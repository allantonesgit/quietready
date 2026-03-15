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
//   KROGER_CLIENT_ID     — from developer.kroger.com (Products API)
//   KROGER_CLIENT_SECRET — from developer.kroger.com
//   KROGER_LOCATION_ID   — optional, defaults to 70100034 (Columbus OH suburban)
//   CBI_REFRESH_SECRET   — shared secret header for EasyCron → /api/admin/cbi/refresh
// ============================================================

import crypto          from "crypto";
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
app.set('trust proxy', 1); // Required for rate limiter behind Nginx
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
app.use(express.urlencoded({ extended: true }));


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
    // 1. Create Supabase auth user, then explicitly confirm so generateLink
    //    produces a magiclink token (not a signup token)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: { full_name: fullName },
    });
    if (authErr) throw new Error(`Auth creation failed: ${authErr.message}`);
    const authUserId = authData.user.id;

    // Explicitly confirm the email so the user is treated as confirmed
    await supabase.auth.admin.updateUserById(authUserId, { email_confirm: true });

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
    // USDA DRI defaults (kcal/day per person) — used if customer didn't adjust
    const USDA_DEFAULTS = { children: 1400, teens: 2000, adults: 2200, seniors: 1900 };
    const cal = formData.calories || {};
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
      // Caloric targets — from Step 2 of wizard, falling back to USDA DRI defaults
      calories_children:    cal.children ?? USDA_DEFAULTS.children,
      calories_teens:       cal.teens    ?? USDA_DEFAULTS.teens,
      calories_adults:      cal.adults   ?? USDA_DEFAULTS.adults,
      calories_seniors:     cal.seniors  ?? USDA_DEFAULTS.seniors,
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

    // 12. Generate magic link using our own token system
    //     Supabase's generateLink invalidates itself via internal emails.
    //     Instead: store a secure random token in customers table,
    //     email a link to /api/auth/magic?token=xxx which exchanges it for a session.
    const loginToken = crypto.randomBytes(32).toString('hex');
    const loginTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await supabase.from('customers').update({
      login_token: loginToken,
      login_token_expires_at: loginTokenExpiry,
    }).eq('id', customerId);
    const magicLink = `${process.env.BASE_URL || 'https://quietready.ai'}/api/auth/magic?token=${loginToken}`;
    console.log("🔗 magicLink:", magicLink);
    sendWelcomeEmail(email, fullName, customerId, magicLink).catch(console.error);




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
// AUTH — Password login
// POST /api/auth/login
// Standard email + password login. Returns accessToken for localStorage.
// ============================================================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Verify customer record exists
    const { data: customer } = await supabase
      .from("customers")
      .select("id, email, status")
      .eq("auth_user_id", data.user.id)
      .single();
    if (!customer) {
      return res.status(404).json({ error: "No account found for this email." });
    }
    console.log(`🔑 Password login: ${email}`);
    return res.json({ accessToken: data.session.access_token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});


// ============================================================
// ADMIN AUTH
// POST /api/admin/login — email+password, must be in admin_users
// GET  /api/admin/me    — verify token + return admin record
// ============================================================
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) return res.status(401).json({ error: "Invalid email or password." });

    const { data: admin } = await supabase
      .from("admin_users")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .single();

    if (!admin) return res.status(403).json({ error: "Not an admin account." });

    console.log(`🔐 Admin login: ${email}`);
    return res.json({ accessToken: data.session.access_token, admin });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

app.get("/api/admin/me", requireAdmin, async (req, res) => {
  res.json({ admin: req.admin });
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
    // Verify the token and get the user
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user) throw new Error('Invalid or expired session token');

    // Use admin client to update password by user ID
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
    if (error) throw new Error(error.message);

    // Generate a fresh magic link and exchange it for a new session token
    // (password change invalidates the old JWT)
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
      options: { redirectTo: 'https://quietready.ai' },
    });
    if (linkErr || !linkData?.properties?.action_link) {
      // Fall back to old token if we can't get a fresh one
      return res.json({ success: true, accessToken: token });
    }
    const verifyResp = await fetch(linkData.properties.action_link, { redirect: 'manual' });
    const location = verifyResp.headers.get('location');
    const hashParams = new URLSearchParams((location || '').split('#')[1] || '');
    const freshToken = hashParams.get('access_token') || token;

    res.json({
      success: true,
      accessToken: freshToken,
    });
  } catch (err) {
    console.error("Set password error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
// GET /api/auth/magic?token=xxx
// Exchanges our custom login token for a real Supabase session
// then redirects to the app with the session hash
// ============================================================
app.get("/api/auth/magic", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect('https://quietready.ai/#error=missing_token');
  // Validate token exists and is not expired — but DO NOT consume it yet.
  // We just show a confirmation page. Outlook/email scanners hit GET links
  // automatically, so we never exchange the token on GET.
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('id, login_token_expires_at')
      .eq('login_token', token)
      .single();
    const expired = !customer || error || new Date(customer.login_token_expires_at) < new Date();
    // Serve a minimal HTML page with a button that POSTs the token
    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>QuietReady — Enter Your Portal</title>
  <style>
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
           background:#F7F3ED; font-family:'Helvetica Neue',sans-serif; }
    .card { background:#FDFCFA; border-radius:16px; padding:48px 40px; max-width:400px;
            width:90%; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.10); }
    .logo { font-size:22px; font-weight:700; color:#4A5C3A; font-family:Georgia,serif; margin-bottom:4px; }
    .sub { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8C8278; margin-bottom:32px; }
    .icon { font-size:40px; margin-bottom:16px; }
    h2 { margin:0 0 8px; font-size:22px; font-weight:700; color:#2C2416; }
    p { margin:0 0 28px; font-size:14px; color:#8C8278; line-height:1.6; }
    .btn { display:inline-block; background:#4A5C3A; color:#FDFCFA; border:none; border-radius:10px;
           padding:15px 32px; font-size:15px; font-weight:700; cursor:pointer; width:100%;
           text-decoration:none; box-sizing:border-box; }
    .err { color:#B94040; font-size:14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">QuietReady.ai</div>
    <div class="sub">Smart Pantry. Peace of Mind.</div>
    ${expired
      ? `<div class="icon">🔗</div>
         <h2>Link expired</h2>
         <p class="err">This link has expired. Please request a new one.</p>
         <a href="https://quietready.ai" class="btn">Back to Home</a>`
      : `<div class="icon">🏡</div>
         <h2>Your plan is ready</h2>
         <p>Click below to set your password and enter your portal.</p>
         <form method="POST" action="/api/auth/magic">
           <input type="hidden" name="token" value="${token}">
           <button type="submit" class="btn">Enter My Portal →</button>
         </form>`
    }
  </div>
</body>
</html>`);
  } catch (err) {
    console.error('Magic GET error:', err);
    res.redirect('https://quietready.ai/#error=server_error');
  }
});

app.post("/api/auth/magic", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.redirect(303, 'https://quietready.ai/#error=missing_token');
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('id, email, login_token, login_token_expires_at')
      .eq('login_token', token)
      .single();
    if (error || !customer) {
      return res.redirect(303, 'https://quietready.ai/#error=access_denied&error_code=otp_expired&error_description=Link+is+invalid');
    }
    if (new Date(customer.login_token_expires_at) < new Date()) {
      return res.redirect(303, 'https://quietready.ai/#error=access_denied&error_code=otp_expired&error_description=Link+has+expired');
    }
    // Invalidate token immediately
    await supabase.from('customers').update({
      login_token: null,
      login_token_expires_at: null,
    }).eq('id', customer.id);
    // Look up the auth_user_id for this customer
    const { data: custRow } = await supabase
      .from('customers')
      .select('auth_user_id')
      .eq('email', customer.email)
      .single();
    if (!custRow?.auth_user_id) {
      return res.redirect(303, 'https://quietready.ai/#error=session_error');
    }
    // Generate a Supabase magic link, then fetch it server-side with redirect:manual
    // so we capture the final redirect URL (which contains #access_token=...) and
    // forward it to the browser. This avoids the browser ever touching Supabase directly.
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: customer.email,
      options: { redirectTo: 'https://quietready.ai' },
    });
    if (linkErr || !linkData?.properties?.action_link) {
      console.error('🔗 generateLink error:', linkErr);
      return res.redirect(303, 'https://quietready.ai/#error=session_error');
    }
    console.log('🔗 POST: fetching action_link with redirect:manual');
    const verifyResp = await fetch(linkData.properties.action_link, { redirect: 'manual' });
    const location = verifyResp.headers.get('location');
    console.log('🔗 verify response status:', verifyResp.status);
    console.log('🔗 location header:', location ? location.substring(0, 200) : 'null');
    if (!location) {
      return res.redirect(303, 'https://quietready.ai/#error=session_error');
    }
    return res.redirect(303, location);
  } catch (err) {
    console.error('Magic POST error:', err);
    return res.redirect(303, 'https://quietready.ai/#error=server_error');
  }
});


// ============================================================
// AUTH — Resend magic link
// POST /api/auth/resend-magic-link
// Called from the expired-link screen. Generates a fresh token and emails it.
// ============================================================
app.post("/api/auth/resend-magic-link", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('id, email')
      .eq('email', email.toLowerCase().trim())
      .single();
    if (error || !customer) {
      // Don't reveal whether email exists — just return success
      return res.json({ ok: true });
    }
    const loginToken = crypto.randomBytes(32).toString('hex');
    const loginTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('customers').update({
      login_token: loginToken,
      login_token_expires_at: loginTokenExpiry,
    }).eq('id', customer.id);
    const magicLink = `${process.env.BASE_URL || 'https://quietready.ai'}/api/auth/magic?token=${loginToken}`;
    await sendWelcomeEmail(customer.email, customer.email, customer.id, magicLink);
    console.log(`🔗 Resent magic link to ${customer.email}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Resend magic link error:', err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ============================================================
// AUTH — Exchange Supabase access_token for a session token
// POST /api/auth/exchange-token
// Called by frontend after magic link redirect lands with #access_token=...
// Validates the token with Supabase, returns a sessionToken for localStorage.
// ============================================================
app.post("/api/auth/exchange-token", async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "Missing access token." });
  try {
    // Set the session on the supabase client using the tokens from the hash
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error || !data?.user) {
      console.error('🔗 exchange-token error:', error);
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    // Look up the customer record
    const { data: customer } = await supabase
      .from('customers')
      .select('id, email, full_name, status')
      .eq('auth_user_id', data.user.id)
      .single();
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }
    // Use the access_token itself as the session token stored in localStorage
    // All portal API calls will send this as Bearer token
    console.log(`🔗 exchange-token: session established for ${customer.email}`);
    return res.json({ sessionToken: accessToken, email: customer.email, status: customer.status });
  } catch (err) {
    console.error('exchange-token error:', err);
    return res.status(500).json({ error: "Server error." });
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

    // Snapshot current CBI at activation time.
    // Falls back to 100.0 (launch baseline) until the daily price-fetch job is running.
    const { data: latestBasis } = await supabase
      .from("price_basis")
      .select("cbi_value")
      .order("basis_date", { ascending: false })
      .limit(1)
      .single();
    const cbiAtActivation = latestBasis?.cbi_value ?? 100.0;

    // Upgrade customer status to active + save addresses + lock CBI
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
        personal_cbi:              cbiAtActivation,
        cbi_locked_at:             new Date().toISOString(),
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

  const [prefs, household, pets, inventory, orders, instructions, pdfs, latestBasis, containers] = await Promise.all([
    supabase.from("customer_preferences").select("*").eq("customer_id", cid).single(),
    supabase.from("household").select("*").eq("customer_id", cid).single(),
    supabase.from("pets").select("*").eq("customer_id", cid),
    supabase.from("inventory_items").select("*").eq("customer_id", cid).order("category"),
    supabase.from("orders").select("*").eq("customer_id", cid).order("created_at", { ascending: true }),
    supabase.from("shipment_instructions").select("*").eq("customer_id", cid).eq("is_acknowledged", false).order("created_at", { ascending: false }),
    supabase.from("customer_pdfs").select("*").eq("customer_id", cid).eq("is_current", true),
    supabase.from("price_basis").select("basis_date, cbi_value, raw_prices").order("basis_date", { ascending: false }).limit(1).single(),
    supabase.from("storage_containers").select("*").eq("customer_id", cid).order("container_code"),
  ]);

  // CBI delta: how much have food costs changed since this customer activated?
  const personalCbi  = req.customer.personal_cbi  ?? 100.0;
  const currentCbi   = latestBasis.data?.cbi_value ?? 100.0;
  const cbiChangePct = parseFloat((((currentCbi - personalCbi) / personalCbi) * 100).toFixed(2));

  // Extract current cost-per-calorie from raw_prices for frontend cost calculations
  const currentCpc   = latestBasis.data?.raw_prices?.today_cpc ?? 0.003821;

  res.json({
    customer:     req.customer,
    preferences:  prefs.data,
    household:    household.data,
    pets:         pets.data,
    inventory:    inventory.data,
    orders:       orders.data,   // ascending by created_at — index 0 = month 1
    containers:   containers.data || [],
    pendingInstructions: instructions.data,
    pdfs:         pdfs.data,
    costIndex: {
      personalCbi,
      currentCbi,
      cbiChangePct,   // positive = more expensive, negative = cheaper
      basisDate:      latestBasis.data?.basis_date ?? null,
      currentCpc,     // cost per calorie at today's Kroger prices — used for plan cost calculations
    },
  });
});

// PATCH /api/portal/preferences/equipment
// Customer toggles an equipment add-on on or off post-activation
app.patch("/api/portal/preferences/equipment", requireAuth, async (req, res) => {
  const { key, value } = req.body;
  if (!key || typeof value !== "boolean") {
    return res.status(400).json({ error: "key (string) and value (boolean) required" });
  }

  const { data: prefs, error: fetchErr } = await supabase
    .from("customer_preferences")
    .select("equipment")
    .eq("customer_id", req.customer.id)
    .single();

  if (fetchErr || !prefs) return res.status(404).json({ error: "Preferences not found" });

  const updated = { ...(prefs.equipment || {}), [key]: value };

  const { error: updateErr } = await supabase
    .from("customer_preferences")
    .update({ equipment: updated })
    .eq("customer_id", req.customer.id);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  console.log(`🔧 Equipment update: customer ${req.customer.id} — ${key} = ${value}`);
  res.json({ success: true, equipment: updated });
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
// CBI REFRESH — Daily Cost Basis Index update
// POST /api/admin/cbi/refresh
// Called by EasyCron daily at 3am UTC.
// Protected by Authorization: Bearer {CBI_REFRESH_SECRET}.
// Fetches live prices for 12 index products from Kroger API,
// calculates cost_per_calorie, stores in price_basis table.
// ============================================================

// ── Kroger OAuth2 token (cached in memory, expires in 30 min) ──
let krogerTokenCache = { token: null, expiresAt: 0 };

async function getKrogerToken() {
  if (krogerTokenCache.token && Date.now() < krogerTokenCache.expiresAt) {
    return krogerTokenCache.token;
  }
  const creds = Buffer.from(
    `${process.env.KROGER_CLIENT_ID}:${process.env.KROGER_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type":  "application/x-www-form-urlencoded",
      "Authorization": `Basic ${creds}`,
    },
    body: "grant_type=client_credentials&scope=product.compact",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kroger auth failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  krogerTokenCache = {
    token:     data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 60s buffer
  };
  return krogerTokenCache.token;
}

// ── Fetch price for one index product from Kroger ──
async function fetchKrogerPrice(token, searchTerm, locationId) {
  // filter.fulfillment=ais = available in store — only these return pricing data
  const url = `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(searchTerm)}&filter.locationId=${locationId}&filter.fulfillment=ais&filter.limit=5`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`Kroger product fetch failed for "${searchTerm}": ${res.status} ${rawText.slice(0,200)}`);
  const data = JSON.parse(rawText);
  // Pick first product that has an in-store priced item
  const product = (data?.data || []).find(p =>
    (p.items || []).some(i => i?.price?.regular || i?.price?.promo)
  ) || data?.data?.[0];
  if (!product) throw new Error(`No product found for "${searchTerm}" — response: ${rawText.slice(0,300)}`);
  console.log(`CBI debug "${searchTerm}": found "${product.description}" items=${JSON.stringify(product.items?.slice(0,1))}`);

  // Price: walk all items to find any with a price (location-specific may be undefined)
  // Kroger returns price as { regular: 10.49, promo: 8.99 } (numbers, not objects)
  // Filter null items — Kroger sometimes returns items: [null] when rate-limited
  const validItems = (product.items || []).filter(i => i != null);
  if (validItems.length === 0) throw new Error(`No valid items for "${searchTerm}" — items: ${JSON.stringify(product.items)}`);
  let price = null;
  for (const item of validItems) {
    const p = item?.price;
    if (p?.promo && typeof p.promo === "number")     { price = p.promo;   break; }
    if (p?.regular && typeof p.regular === "number") { price = p.regular; break; }
  }
  if (!price) throw new Error(`No price returned for "${searchTerm}" — items: ${JSON.stringify(validItems.map(i => i?.price))}`);

  return {
    name:        product.description,
    price:       parseFloat(price),
    size:        product.items?.[0]?.size || "unknown",
    upc:         product.upc,
    searchTerm,
  };
}

// ── Index basket definition ──
// All search terms confirmed working against Kroger location 01600569 (Columbus OH)
// Key insight: Kroger store-brand terms reliably return prices; national brands often don't
// grams = net weight of target package size for cost_per_calorie calculation
const INDEX_BASKET = [
  // Grains — confirmed working
  { searchTerm: "white rice 5 lb",             grams: 2268, calPerGram: 3.63, category: "Grains",      weight: 1.5 },
  { searchTerm: "kroger rolled oats",           grams: 510,  calPerGram: 3.78, category: "Grains",      weight: 1.0 },
  // Protein — confirmed working
  { searchTerm: "kroger chunk light tuna",      grams: 142,  calPerGram: 1.16, category: "Protein",     weight: 1.5 },
  { searchTerm: "kroger chicken breast canned", grams: 354,  calPerGram: 1.39, category: "Protein",     weight: 1.5 },
  { searchTerm: "kroger lentils",               grams: 454,  calPerGram: 3.53, category: "Protein",     weight: 1.0 },
  // Vegetables — confirmed working
  { searchTerm: "kroger diced tomatoes",        grams: 411,  calPerGram: 0.24, category: "Vegetables",  weight: 1.0 },
  { searchTerm: "kroger mixed vegetables",      grams: 425,  calPerGram: 0.42, category: "Vegetables",  weight: 1.0 },
  // Ready meals — confirmed working
  { searchTerm: "kroger vegetable soup",        grams: 533,  calPerGram: 0.56, category: "Ready Meals", weight: 0.75 },
  // Fats — confirmed working
  { searchTerm: "kroger creamy peanut butter",  grams: 454,  calPerGram: 5.88, category: "Fats",        weight: 1.0 },
  { searchTerm: "kroger olive oil 17 oz",       grams: 500,  calPerGram: 8.84, category: "Fats",        weight: 0.75 },
  // Fruit — confirmed working (peaches unavailable, using mixed fruit cups)
  { searchTerm: "kroger mixed fruit",           grams: 425,  calPerGram: 0.55, category: "Fruit",       weight: 0.75 },
  // Dairy — confirmed working
  { searchTerm: "kroger evaporated milk",       grams: 340,  calPerGram: 1.35, category: "Dairy",       weight: 0.75 },
];

// ── Kroger index store (representative suburban US location) ──
// locationId 70100034 = Kroger Columbus OH — standard suburban store, good price rep
const KROGER_LOCATION_ID = process.env.KROGER_LOCATION_ID || "01600569"; // Kroger Brewers Yard, Columbus OH

app.post("/api/admin/cbi/refresh", async (req, res) => {
  // Verify EasyCron shared secret
  const authHeader = req.headers.authorization || "";
  const secret     = authHeader.replace("Bearer ", "").trim();
  if (!secret || secret !== process.env.CBI_REFRESH_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Force fresh token for each CBI run — avoids stale/throttled token issues
    krogerTokenCache = { token: null, expiresAt: 0 };
    const token    = await getKrogerToken();
    const today    = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const results  = [];
    const errors   = [];

    // Fetch price for each index product
    for (const item of INDEX_BASKET) {
      try {
        const priceData = await fetchKrogerPrice(token, item.searchTerm, KROGER_LOCATION_ID);
        const costPerCalorie = priceData.price / (item.grams * item.calPerGram);
        results.push({
          ...item,
          ...priceData,
          costPerCalorie: parseFloat(costPerCalorie.toFixed(6)),
        });
      } catch (err) {
        console.warn(`CBI: skipping "${item.searchTerm}": ${err.message}`);
        errors.push({ searchTerm: item.searchTerm, error: err.message });
      }
      // Delay between requests — Kroger throttles rapid sequential calls
      await new Promise(r => setTimeout(r, 600));
    }

    if (results.length < 6) {
      throw new Error(`Too few products priced (${results.length}/12) — aborting CBI update`);
    }

    // Weighted average cost_per_calorie across all successfully priced items
    const totalWeight      = results.reduce((s, r) => s + r.weight, 0);
    const weightedCpcSum   = results.reduce((s, r) => s + r.costPerCalorie * r.weight, 0);
    const todayCpc         = weightedCpcSum / totalWeight;

    // Get launch baseline CPC from first ever price_basis row
    const { data: baseline } = await supabase
      .from("price_basis")
      .select("cbi_value, raw_prices")
      .order("basis_date", { ascending: true })
      .limit(1)
      .single();

    // If baseline raw_prices has a stored launch_cpc use it, else treat today as baseline (100.0)
    const launchCpc = baseline?.raw_prices?.launch_cpc ?? todayCpc;
    const cbiValue  = parseFloat(((todayCpc / launchCpc) * 100).toFixed(4));

    // Build raw_prices blob
    const rawPrices = {
      launch_cpc:      launchCpc,
      today_cpc:       parseFloat(todayCpc.toFixed(6)),
      location_id:     KROGER_LOCATION_ID,
      products:        results.map(r => ({
        searchTerm:    r.searchTerm,
        name:          r.name,
        price:         r.price,
        size:          r.size,
        category:      r.category,
        costPerCalorie: r.costPerCalorie,
        weight:        r.weight,
      })),
      errors,
      fetched_at: new Date().toISOString(),
    };

    // Upsert today's row (safe to re-run multiple times)
    const { error: upsertErr } = await supabase
      .from("price_basis")
      .upsert({ basis_date: today, cbi_value: cbiValue, raw_prices: rawPrices },
               { onConflict: "basis_date" });

    if (upsertErr) throw new Error(`price_basis upsert failed: ${upsertErr.message}`);

    // If this is the very first real run, backfill launch_cpc into the baseline row
    if (!baseline?.raw_prices?.launch_cpc) {
      await supabase
        .from("price_basis")
        .update({ raw_prices: { ...rawPrices, launch_cpc: todayCpc } })
        .eq("basis_date", today);
    }

    console.log(`✅ CBI refresh: ${today} CBI=${cbiValue} (cpc=${todayCpc.toFixed(6)}) products=${results.length}`);

    res.json({
      success:       true,
      date:          today,
      cbi:           cbiValue,
      todayCpc:      parseFloat(todayCpc.toFixed(6)),
      launchCpc:     parseFloat(launchCpc.toFixed(6)),
      productsFetched: results.length,
      errors:        errors.length,
      summary:       results.map(r => ({ category: r.category, searchTerm: r.searchTerm, price: r.price, costPerCalorie: r.costPerCalorie })),
    });

  } catch (err) {
    console.error("CBI refresh error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/cbi/latest — returns last 30 days of CBI for admin dashboard
app.get("/api/admin/cbi/latest", requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("price_basis")
    .select("basis_date, cbi_value, raw_prices")
    .order("basis_date", { ascending: false })
    .limit(30);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
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