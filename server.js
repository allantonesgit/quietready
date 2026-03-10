// ============================================================
// QuietReady.ai — Node.js / Express API
// Deploy to: EC2 Ubuntu 24.04, managed by PM2
//
// Required env vars (set in /etc/environment or .env):
//   SUPABASE_URL         — from Supabase project settings
//   SUPABASE_SERVICE_KEY — service_role key (bypasses RLS, server only)
//   SUPABASE_ANON_KEY    — anon key (for client-facing auth)
//   STRIPE_SECRET_KEY    — from Stripe dashboard
//   STRIPE_WEBHOOK_SECRET
//   FRESHBOOKS_CLIENT_ID
//   FRESHBOOKS_CLIENT_SECRET
//   FRESHBOOKS_ACCOUNT_ID
//   PDF_SCRIPT_PATH      — absolute path to generate_recipe_pdf.py
//   PORT                 — default 3001
// ============================================================

import express         from "express";
import cors            from "cors";
import helmet          from "helmet";
import morgan          from "morgan";
import rateLimit       from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import Stripe           from "stripe";
import { exec }         from "child_process";
import { promisify }    from "util";
import path             from "path";
import fs               from "fs";
import {
  createBillingCustomer,
  createBillingTemplate,
  updateTemplateOrderAmount,
  generateMonthlyInvoice,
  getCustomerInvoices,
  getInvoicePdfUrl,
  markInvoicePaid,
  cancelBillingTemplate,
  hasOverdueInvoices,
  runMonthlyBillingCycle,
  checkBillingHealth,
} from "./billing.js";
import {
  sendWelcomeEmail,
  sendShipmentEmail,
  sendRotationReminderEmail,
  sendPaymentFailedEmail,
} from "./email.js";

const execAsync = promisify(exec);

// ── Env validation ────────────────────────────────────────────
const required = [
  "SUPABASE_URL", "SUPABASE_SERVICE_KEY", "SUPABASE_ANON_KEY",
  "STRIPE_SECRET_KEY", "BILLING_API_URL", "BILLING_API_KEY",
  "MANDRILL_API_KEY",
];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
}

// ── Clients ───────────────────────────────────────────────────
// service_role client: full DB access, server-side only, never exposed to browser
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });

// ── App setup ─────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(morgan("combined"));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000", "https://quietready.ai"],
  credentials: true,
}));

// Rate limiting — generous for normal use, blocks abuse
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api/", limiter);

// Stripe webhooks need raw body — must be before express.json()
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "2mb" }));


// ── Auth middleware ────────────────────────────────────────────
// Validates Supabase JWT from Authorization header.
// Attaches customer record to req.customer.
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Invalid token" });

  const { data: customer, error: custErr } = await supabase
    .from("customers")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (custErr || !customer) return res.status(401).json({ error: "Customer not found" });

  req.user     = user;
  req.customer = customer;
  next();
}

// Admin-only middleware — checks admin_users table
async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Invalid token" });

  const { data: admin } = await supabase
    .from("admin_users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!admin) return res.status(403).json({ error: "Admin access required" });

  req.user  = user;
  req.admin = admin;
  next();
}


// ============================================================
// ONBOARDING
// POST /api/onboarding/submit
// Called at the end of the questionnaire. Creates the full
// customer record, household, pets, preferences, containers.
// Also creates Stripe customer and triggers first invoice.
// ============================================================
app.post("/api/onboarding/submit", async (req, res) => {
  const { email, fullName, formData } = req.body;

  if (!email || !formData) {
    return res.status(400).json({ error: "email and formData are required" });
  }

  try {
    // 1. Create Supabase auth user (sends magic link / sets temp password)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (authErr) throw new Error(`Auth creation failed: ${authErr.message}`);
    const authUserId = authData.user.id;

    // 2. Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email,
      name: fullName,
      metadata: { supabase_user_id: authUserId },
    });

    // 3. Insert customer row
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .insert({
        auth_user_id:       authUserId,
        email,
        full_name:          fullName,
        stripe_customer_id: stripeCustomer.id,
        status:             "preview",  // Becomes "active" after payment collected
      })
      .select()
      .single();
    if (custErr) throw new Error(`Customer insert failed: ${custErr.message}`);
    const customerId = customer.id;

    // 4. Household
    const hh = formData.household || {};
    await supabase.from("household").insert({
      customer_id: customerId,
      infants:  hh.infants  || 0,
      children: hh.children || 0,
      teens:    hh.teens    || 0,
      adults:   hh.adults   || 0,
      seniors:  hh.seniors  || 0,
    });

    // 5. Pets
    const pets = formData.pets || {};
    const petInserts = [];
    for (const [petType, petData] of Object.entries(pets)) {
      if (petData?.count > 0) {
        petInserts.push({
          customer_id: customerId,
          pet_type:    petType,
          count:       petData.count,
          size:        petData.size || null,
        });
      }
    }
    if (petInserts.length > 0) {
      await supabase.from("pets").insert(petInserts);
    }

    // 6. Preferences
    await supabase.from("customer_preferences").insert({
      customer_id:          customerId,
      food_philosophy:      formData.foodPhilosophy   || "balanced",
      dietary_restrictions: formData.dietary          || {},
      dietary_notes:        formData.dietaryNotes     || null,
      food_avoidances:      formData.foodAvoid        || {},
      coverage_months:      formData.coverageMonths   || 3,
      monthly_budget:       formData.monthlyBudget    || 150,
      storage_length_ft:    formData.storageL         || null,
      storage_width_ft:     formData.storageW         || null,
      storage_height_ft:    formData.storageH         || null,
      storage_max_stack_ft: formData.maxStack         || null,
      storage_type:         formData.storageType      || null,
      utilities:            formData.utilities        || {},
      equipment:            formData.equipment        || {},
      container_tier:       formData.containerTier    || "good",
    });

    // 7. Generate container assignments
    await generateContainers(customerId, formData);

    // 8. Create first QuietReady order record
    const order = await createMonthlyOrder(customerId, formData);

    // 9. Create billing platform customer record
    const billingCustomerId = await createBillingCustomer(customer);

    // 10. Store billing customer ID on the QuietReady customer row
    await supabase
      .from("customers")
      .update({ billing_customer_id: billingCustomerId })
      .eq("id", customerId);

    // 11. Create recurring billing template
    //     $30/mo membership + variable order line item
    //     First invoice fires in 30 days — after first order ships
    const firstBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await createBillingTemplate(billingCustomerId, firstBillingDate);

    // 12. Send welcome email (async, don't block response)
    sendWelcomeEmail(email, fullName, customerId).catch(console.error);

    res.json({
      success: true,
      customerId,
      message: "Account created. Check your email for login link.",
    });

  } catch (err) {
    console.error("Onboarding error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
// AUTH — Set password after magic link
// POST /api/auth/set-password
// Customer provides their new password. We call Supabase to
// update the user's password using their access token.
// ============================================================
app.post("/api/auth/set-password", async (req, res) => {
  const { password } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "No token provided" });
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    // Use the user's own token to update their password
    const userClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data, error } = await userClient.auth.updateUser({ password });
    if (error) throw new Error(error.message);

    // Return a fresh session token
    const { data: session } = await userClient.auth.getSession();
    res.json({
      success: true,
      accessToken: session?.session?.access_token || token,
    });
  } catch (err) {
    console.error("Set password error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
// ONBOARDING — Create Stripe SetupIntent for payment step
// POST /api/onboarding/create-setup-intent
// Called when preview customer clicks Activate and reaches payment.
// Returns a clientSecret for Stripe Elements to collect card.
// ============================================================
app.post("/api/onboarding/create-setup-intent", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email is required" });

  try {
    const stripeCustomer = await stripe.customers.create({ email });
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomer.id,
      payment_method_types: ["card"],
      usage: "off_session",
    });
    res.json({
      clientSecret: setupIntent.client_secret,
      tempStripeCustomerId: stripeCustomer.id,
    });
  } catch (err) {
    console.error("SetupIntent creation failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
// ONBOARDING — Activate plan (preview → active)
// POST /api/onboarding/activate
// Called after customer enters billing/shipping/payment in portal.
// Attaches payment method to Stripe, stores addresses, creates
// billing template, upgrades status to "active".
// ============================================================
app.post("/api/onboarding/activate", requireAuth, async (req, res) => {
  const { paymentMethodId, billingAddress, shippingAddress } = req.body;
  const customer = req.customer;

  if (!paymentMethodId) return res.status(400).json({ error: "paymentMethodId is required" });
  if (!billingAddress?.line1 || !billingAddress?.city || !billingAddress?.state || !billingAddress?.zip) {
    return res.status(400).json({ error: "Billing address is required" });
  }
  if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zip) {
    return res.status(400).json({ error: "Shipping address is required" });
  }
  if (customer.status === "active") {
    return res.status(400).json({ error: "Plan is already active" });
  }

  try {
    let stripeCustomerId = customer.stripe_customer_id;

    // Create or update Stripe customer with full billing address
    if (stripeCustomerId) {
      await stripe.customers.update(stripeCustomerId, {
        address: {
          line1:       billingAddress.line1,
          line2:       billingAddress.line2 || undefined,
          city:        billingAddress.city,
          state:       billingAddress.state,
          postal_code: billingAddress.zip,
          country:     billingAddress.country || "US",
        },
        shipping: {
          name:    customer.full_name,
          address: {
            line1:       shippingAddress.line1,
            line2:       shippingAddress.line2 || undefined,
            city:        shippingAddress.city,
            state:       shippingAddress.state,
            postal_code: shippingAddress.zip,
            country:     shippingAddress.country || "US",
          },
        },
      });
    } else {
      const sc = await stripe.customers.create({
        email:    customer.email,
        name:     customer.full_name,
        address: {
          line1:       billingAddress.line1,
          city:        billingAddress.city,
          state:       billingAddress.state,
          postal_code: billingAddress.zip,
          country:     billingAddress.country || "US",
        },
      });
      stripeCustomerId = sc.id;
    }

    // Attach payment method as default
    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create billing platform customer (if not already done at signup)
    let billingCustomerId = customer.billing_customer_id;
    if (!billingCustomerId) {
      billingCustomerId = await createBillingCustomer({ ...customer, stripe_customer_id: stripeCustomerId });
    }

    // Activate billing template
    const firstBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await createBillingTemplate(billingCustomerId, firstBillingDate);

    // Upgrade customer status to active + save addresses
    const { data: updatedCustomer, error: updateErr } = await supabase
      .from("customers")
      .update({
        status:                    "active",
        stripe_customer_id:        stripeCustomerId,
        stripe_payment_method_id:  paymentMethodId,
        billing_customer_id:       billingCustomerId,
        billing_address:           billingAddress,
        shipping_address:          shippingAddress,
        activated_at:              new Date().toISOString(),
      })
      .eq("id", customer.id)
      .select()
      .single();

    if (updateErr) throw new Error(`Status update failed: ${updateErr.message}`);

    // Send welcome email now that plan is confirmed
    sendWelcomeEmail(customer.email, customer.full_name, customer.id).catch(console.error);

    res.json({ success: true, customer: updatedCustomer });

  } catch (err) {
    console.error("Activation error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
// CUSTOMER PORTAL — all routes require auth
// ============================================================

// GET /api/portal/dashboard
// Everything the portal home page needs in one call
app.get("/api/portal/dashboard", requireAuth, async (req, res) => {
  const cid = req.customer.id;

  const [prefs, household, pets, inventory, orders, instructions, pdfs] = await Promise.all([
    supabase.from("customer_preferences").select("*").eq("customer_id", cid).single(),
    supabase.from("household").select("*").eq("customer_id", cid).single(),
    supabase.from("pets").select("*").eq("customer_id", cid),
    supabase.from("inventory_items").select("*").eq("customer_id", cid).order("category"),
    supabase.from("orders").select("*").eq("customer_id", cid).order("created_at", { ascending: false }).limit(6),
    supabase.from("shipment_instructions").select("*").eq("customer_id", cid).eq("is_acknowledged", false).order("created_at", { ascending: false }),
    supabase.from("customer_pdfs").select("*").eq("customer_id", cid).eq("is_current", true),
  ]);

  res.json({
    customer:     req.customer,
    preferences:  prefs.data,
    household:    household.data,
    pets:         pets.data,
    inventory:    inventory.data,
    orders:       orders.data,
    pendingInstructions: instructions.data,
    pdfs:         pdfs.data,
  });
});

// GET /api/portal/inventory
app.get("/api/portal/inventory", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*, storage_containers(container_code, location_zone)")
    .eq("customer_id", req.customer.id)
    .order("category")
    .order("product_name");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/portal/orders
app.get("/api/portal/orders", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", req.customer.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/portal/instructions
// Pending placement instructions for items just delivered
app.get("/api/portal/instructions", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("shipment_instructions")
    .select("*")
    .eq("customer_id", req.customer.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/portal/instructions/:id/acknowledge
// Customer marks a placement instruction as done
app.post("/api/portal/instructions/:id/acknowledge", requireAuth, async (req, res) => {
  const { error } = await supabase
    .from("shipment_instructions")
    .update({ is_acknowledged: true, acknowledged_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .eq("customer_id", req.customer.id);  // RLS double-check

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// GET /api/portal/pdf/latest
// Returns signed URL to the latest Recipe Guide PDF
app.get("/api/portal/pdf/latest", requireAuth, async (req, res) => {
  const { data: pdf, error } = await supabase
    .from("customer_pdfs")
    .select("*")
    .eq("customer_id", req.customer.id)
    .eq("pdf_type", "recipe_guide")
    .eq("is_current", true)
    .single();

  if (error || !pdf) return res.status(404).json({ error: "No PDF available yet" });

  // Generate a signed URL valid for 1 hour
  const { data: signed } = await supabase.storage
    .from("customer-pdfs")
    .createSignedUrl(pdf.storage_path, 3600);

  res.json({ url: signed?.signedUrl, generatedAt: pdf.generated_at, version: pdf.version });
});

// GET /api/portal/billing/invoices
// Customer's full invoice history — proxied from billing platform
app.get("/api/portal/billing/invoices", requireAuth, async (req, res) => {
  const billingId = req.customer.billing_customer_id;
  if (!billingId) return res.json([]);
  try {
    const invoices = await getCustomerInvoices(billingId);
    res.json(invoices.map(inv => ({ ...inv, pdfUrl: getInvoicePdfUrl(inv.id) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/portal/billing/overdue
// Check for overdue invoices — used to show warning banner in portal
app.get("/api/portal/billing/overdue", requireAuth, async (req, res) => {
  const billingId = req.customer.billing_customer_id;
  if (!billingId) return res.json({ hasOverdue: false });
  try {
    const hasOverdue = await hasOverdueInvoices(billingId);
    res.json({ hasOverdue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
// ADMIN ROUTES — require admin auth
// ============================================================

// GET /api/admin/customers
app.get("/api/admin/customers", requireAdmin, async (req, res) => {
  const { status, search } = req.query;
  let query = supabase
    .from("customers")
    .select("*, customer_preferences(*), household(*)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("email", `%${search}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/admin/customers/:id
app.get("/api/admin/customers/:id", requireAdmin, async (req, res) => {
  const cid = req.params.id;
  const [customer, prefs, household, pets, inventory, orders, containers] = await Promise.all([
    supabase.from("customers").select("*").eq("id", cid).single(),
    supabase.from("customer_preferences").select("*").eq("customer_id", cid).single(),
    supabase.from("household").select("*").eq("customer_id", cid).single(),
    supabase.from("pets").select("*").eq("customer_id", cid),
    supabase.from("inventory_items").select("*").eq("customer_id", cid).order("category"),
    supabase.from("orders").select("*, order_items(*)").eq("customer_id", cid).order("created_at", { ascending: false }),
    supabase.from("storage_containers").select("*").eq("customer_id", cid).order("container_code"),
  ]);

  res.json({
    customer:   customer.data,
    prefs:      prefs.data,
    household:  household.data,
    pets:       pets.data,
    inventory:  inventory.data,
    orders:     orders.data,
    containers: containers.data,
  });
});

// POST /api/admin/orders/:orderId/items/:itemId/confirm
// Admin marks a shipment as received — triggers portal instructions + PDF regen
app.post("/api/admin/orders/:orderId/items/:itemId/confirm", requireAdmin, async (req, res) => {
  const { itemId } = req.params;

  const { data: item, error: fetchErr } = await supabase
    .from("order_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (fetchErr || !item) return res.status(404).json({ error: "Order item not found" });

  // Set confirmed_at — this fires the DB trigger that creates shipment_instruction
  const { error: updateErr } = await supabase
    .from("order_items")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("id", itemId);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  // Update inventory
  await updateInventoryItem(item);

  // Async: regenerate PDF — don't block the response
  regeneratePDF(item.customer_id).catch(console.error);

  res.json({ success: true, message: "Shipment confirmed. Portal updated. PDF regenerating." });
});

// POST /api/admin/orders
// Create a new monthly order for a customer
app.post("/api/admin/orders", requireAdmin, async (req, res) => {
  const { customerId } = req.body;
  if (!customerId) return res.status(400).json({ error: "customerId required" });

  const { data: prefs } = await supabase
    .from("customer_preferences")
    .select("*")
    .eq("customer_id", customerId)
    .single();

  if (!prefs) return res.status(404).json({ error: "Customer preferences not found" });

  const order = await createMonthlyOrder(customerId, prefs);
  res.json(order);
});

// PATCH /api/admin/customers/:id/status
app.patch("/api/admin/customers/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["preview", "active", "paused", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const { data: customer, error } = await supabase
    .from("customers")
    .update({ status })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Cancel billing template when customer is cancelled — stops future invoices
  if (status === "cancelled" && customer.billing_customer_id) {
    await cancelBillingTemplate(customer.billing_customer_id).catch(err =>
      console.warn("Could not cancel billing template:", err.message)
    );
  }

  res.json(customer);
});

// POST /api/admin/billing/run/:customerId
// Manually trigger monthly billing cycle for one customer
app.post("/api/admin/billing/run/:customerId", requireAdmin, async (req, res) => {
  const { customerId } = req.params;
  const { data: customer } = await supabase
    .from("customers")
    .select("billing_customer_id")
    .eq("id", customerId)
    .single();

  if (!customer?.billing_customer_id) {
    return res.status(404).json({ error: "No billing customer ID — was onboarding completed?" });
  }

  try {
    const result = await runMonthlyBillingCycle(supabase, customerId, customer.billing_customer_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/billing/run-all
// Trigger monthly billing for ALL active customers (called by cron job)
app.post("/api/admin/billing/run-all", requireAdmin, async (req, res) => {
  const { data: customers } = await supabase
    .from("customers")
    .select("id, billing_customer_id")
    .eq("status", "active")  // never bill preview customers
    .not("billing_customer_id", "is", null);

  if (!customers?.length) return res.json({ processed: 0, results: [] });

  const results = await Promise.allSettled(
    customers.map(c => runMonthlyBillingCycle(supabase, c.id, c.billing_customer_id))
  );

  const summary = results.map((r, i) => ({
    customerId: customers[i].id,
    status:     r.status,
    result:     r.status === "fulfilled" ? r.value : { error: r.reason?.message },
  }));

  const succeeded = summary.filter(s => s.status === "fulfilled" && !s.result?.skipped).length;
  const skipped   = summary.filter(s => s.result?.skipped).length;
  const failed    = summary.filter(s => s.status === "rejected").length;

  console.log(`Billing run: ${succeeded} invoiced, ${skipped} skipped, ${failed} failed`);
  res.json({ processed: customers.length, succeeded, skipped, failed, details: summary });
});


// ============================================================
// STRIPE WEBHOOK
// Handles: payment succeeded, subscription events
// ============================================================
app.post("/api/webhooks/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "invoice.payment_succeeded": {
      const invoice   = event.data.object;
      const stripeId  = invoice.customer;
      await supabase
        .from("customers")
        .update({ status: "active" })
        .eq("stripe_customer_id", stripeId);
      break;
    }
    case "invoice.payment_failed": {
      const invoice  = event.data.object;
      console.warn("Payment failed for Stripe customer:", invoice.customer);
      // TODO: send dunning email
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await supabase
        .from("customers")
        .update({ status: "cancelled" })
        .eq("stripe_customer_id", sub.customer);
      break;
    }
  }

  res.json({ received: true });
});


// ============================================================
// HEALTH CHECK
// ============================================================
app.get("/api/health", async (req, res) => {
  const [dbCheck, billingCheck] = await Promise.all([
    supabase.from("customers").select("count").limit(1),
    checkBillingHealth(),
  ]);
  const dbOk      = !dbCheck.error;
  const billingOk = billingCheck.status === "ok";
  res.json({
    status:  dbOk && billingOk ? "ok" : "degraded",
    db:      dbOk      ? "connected" : "error",
    billing: billingOk ? "connected" : billingCheck.message,
    ts:      new Date().toISOString(),
  });
});


// ============================================================
// HELPER FUNCTIONS
// ============================================================

async function generateContainers(customerId, formData) {
  const {
    coverageMonths = 3,
    foodPhilosophy = "balanced",
    containerTier  = "good",
    maxStack,
    storageH,
    pets = {},
  } = formData;

  const totalPeople = Object.values(formData.household || {}).reduce((s, v) => s + v, 0) || 1;
  const totalPets   = Object.values(pets).reduce((s, v) => s + (v?.count || 0), 0);

  const volPPM = { wholeFood: 2.2, balanced: 1.9, freezeDried: 1.4, noPreference: 1.6 }[foodPhilosophy] || 1.9;
  const containerVol = { good: 0.57, better: 1.71, best: 2.05 }[containerTier] || 0.57;
  const totalVolume  = (totalPeople * volPPM + totalPets * 0.35) * coverageMonths;
  const count        = Math.ceil(totalVolume / containerVol);

  // Generate container codes: A-1, A-2, ..., B-1, B-2, ...
  const rows    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const stackH  = parseFloat(maxStack) || parseFloat(storageH) || 4;
  const cH      = { good: 1.21, better: 1.375, best: 1.54 }[containerTier] || 1.21;
  const perStack = Math.max(1, Math.floor(stackH / cH));

  const containers = [];
  let row = 0, slot = 1;

  for (let i = 0; i < count; i++) {
    containers.push({
      customer_id:     customerId,
      container_code:  `${rows[row]}-${slot}`,
      tier:            containerTier,
      is_pet_container: false,
    });
    slot++;
    if (slot > perStack) { slot = 1; row++; }
    if (row >= rows.length) break; // safety
  }

  // Add pet containers (labeled separately)
  if (totalPets > 0) {
    const petContainerCount = Math.ceil(totalPets * 0.35 * coverageMonths / containerVol);
    for (let i = 0; i < petContainerCount; i++) {
      containers.push({
        customer_id:     customerId,
        container_code:  `P-${i + 1}`,
        tier:            containerTier,
        is_pet_container: true,
      });
    }
  }

  await supabase.from("storage_containers").insert(containers);
}

async function createMonthlyOrder(customerId, formData) {
  const budget     = formData.monthlyBudget || 150;
  const productAmt = parseFloat(((budget - 30) / 1.1).toFixed(2));
  const markup     = parseFloat((productAmt * 0.1).toFixed(2));

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id:   customerId,
      order_number:  "",  // auto-generated by DB trigger
      product_cost:  productAmt,
      markup_amount: markup,
      membership_fee: 30.00,
      total_billed:  budget,
      status:        "pending",
    })
    .select()
    .single();

  if (error) throw new Error(`Order creation failed: ${error.message}`);
  return order;
}

async function updateInventoryItem(orderItem) {
  // Check if inventory item exists for this product + customer
  const { data: existing } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("customer_id",  orderItem.customer_id)
    .eq("product_name", orderItem.product_name)
    .single();

  if (existing) {
    await supabase
      .from("inventory_items")
      .update({
        qty_on_hand: existing.qty_on_hand + orderItem.qty,
        status:      "full",
        updated_at:  new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("inventory_items").insert({
      customer_id:  orderItem.customer_id,
      product_name: orderItem.product_name,
      category:     "Uncategorized",
      supplier:     orderItem.supplier,
      qty_on_hand:  orderItem.qty,
      unit:         orderItem.unit,
      status:       "full",
    });
  }
}

async function regeneratePDF(customerId) {
  const { data: customer } = await supabase
    .from("customers")
    .select("*, customer_preferences(*), household(*), pets(*), inventory_items(*, storage_containers(container_code))")
    .eq("id", customerId)
    .single();

  if (!customer) return;

  const tmpPath  = `/tmp/qr_pdf_${customerId}_${Date.now()}.pdf`;
  const dataPath = `/tmp/qr_data_${customerId}.json`;
  fs.writeFileSync(dataPath, JSON.stringify(customer));

  const scriptPath = process.env.PDF_SCRIPT_PATH || "/home/ubuntu/quietready/generate_recipe_pdf.py";

  try {
    await execAsync(`python3 ${scriptPath} --data ${dataPath} --output ${tmpPath}`);

    const pdfBuffer = fs.readFileSync(tmpPath);
    const storagePath = `pdfs/${customerId}/recipe_guide_v${Date.now()}.pdf`;

    // Mark all previous PDFs as not current
    await supabase
      .from("customer_pdfs")
      .update({ is_current: false })
      .eq("customer_id", customerId)
      .eq("pdf_type", "recipe_guide");

    // Upload to Supabase Storage
    await supabase.storage
      .from("customer-pdfs")
      .upload(storagePath, pdfBuffer, { contentType: "application/pdf", upsert: true });

    // Record in DB
    await supabase.from("customer_pdfs").insert({
      customer_id:  customerId,
      pdf_type:     "recipe_guide",
      storage_path: storagePath,
      triggered_by: "shipment_confirmed",
      is_current:   true,
    });

    console.log(`✓ PDF regenerated for customer ${customerId}`);
  } catch (err) {
    console.error(`PDF generation failed for ${customerId}:`, err.message);
  } finally {
    [tmpPath, dataPath].forEach(f => { try { fs.unlinkSync(f); } catch {} });
  }
}

// sendWelcomeEmail imported from email.js


// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ QuietReady API running on port ${PORT}`);
});

export default app;
