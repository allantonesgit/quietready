// ============================================================
// QuietReady.ai — Billing Integration
// Target: https://billing.quietready.ai
//
// Required env vars:
//   BILLING_API_URL  — https://billing.quietready.ai
//   BILLING_API_KEY  — dab_... key from billing platform Settings → API Keys
//
// Product catalog (must exist in billing platform):
//   quietready-membership  — $30/mo flat membership fee
//   quietready-order       — variable monthly product order (price set per-invoice)
//
// Design:
//   - One customer record per QuietReady customer
//   - One recurring template per customer
//   - Template always has two line items:
//       1. quietready-membership  @ $30 (constant)
//       2. quietready-order       @ variable (updated before each invoice generation)
//   - Monthly billing cycle:
//       1. calculateMonthlyOrder()  — compute this month's product cost + markup
//       2. updateTemplateOrder()    — patch the template with new order amount
//       3. generateInvoice()        — trigger invoice creation + customer email
// ============================================================

const BILLING_URL = process.env.BILLING_API_URL?.replace(/\/$/, "") || "https://billing.quietready.ai";
const BILLING_KEY  = process.env.BILLING_API_KEY;

// ── Base fetch wrapper ────────────────────────────────────────
async function billingFetch(path, options = {}) {
  if (!BILLING_KEY) throw new Error("BILLING_API_KEY is not set");

  const res = await fetch(`${BILLING_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": BILLING_KEY,
      ...(options.headers || {}),
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = body?.error || body?.message || `HTTP ${res.status}`;
    throw new Error(`Billing API error on ${options.method || "GET"} ${path}: ${msg}`);
  }

  return body;
}


// ============================================================
// CUSTOMERS
// ============================================================

/**
 * Create a billing platform customer record when a new QuietReady
 * customer completes onboarding.
 *
 * @param {object} customer  — row from QuietReady customers table
 * @returns {string}         — billing platform customer ID (stored in customers.billing_customer_id)
 */
export async function createBillingCustomer(customer) {
  const { customer: created } = await billingFetch("/api/v1/customers", {
    method: "POST",
    body: JSON.stringify({
      name:  customer.full_name || customer.email,
      email: customer.email,
      notes: `QuietReady customer ID: ${customer.id}`,
    }),
  });
  return created.id;
}

/**
 * Update billing customer details (e.g. after profile change).
 */
export async function updateBillingCustomer(billingCustomerId, fields) {
  const { customer } = await billingFetch(`/api/v1/customers/${billingCustomerId}`, {
    method: "PUT",
    body: JSON.stringify(fields),
  });
  return customer;
}

/**
 * Check if a customer has any overdue invoices.
 * Used to gate order creation — don't place new orders for delinquent accounts.
 */
export async function hasOverdueInvoices(billingCustomerId) {
  const { hasOverdue } = await billingFetch(`/api/v1/customers/${billingCustomerId}/has-overdue`);
  return hasOverdue;
}


// ============================================================
// TEMPLATES (recurring billing setup)
// ============================================================

/**
 * Create the recurring billing template for a new customer.
 * Called once during onboarding, after createBillingCustomer().
 *
 * Template structure:
 *   Line 1: quietready-membership @ $30  (stays every month)
 *   Line 2: quietready-order @ $0        (placeholder — updated before first invoice)
 *
 * @param {string} billingCustomerId
 * @param {Date}   firstBillingDate   — when to generate the first invoice
 */
export async function createBillingTemplate(billingCustomerId, firstBillingDate) {
  const nextDate = firstBillingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const { template } = await billingFetch("/api/v1/templates", {
    method: "POST",
    body: JSON.stringify({
      customerId: billingCustomerId,
      products: [
        {
          productId:           "quietready-membership",
          quantity:            1,
          price:               30.00,
          discount:            0,
          lineItemDescription: "QuietReady Monthly Membership",
        },
        {
          productId:           "quietready-order",
          quantity:            1,
          price:               0,          // updated before first invoice
          discount:            0,
          lineItemDescription: "Monthly Food Supply Order — pending first order",
        },
      ],
      nextInvoiceDate: nextDate.toISOString(),
    }),
  });

  return template;
}

/**
 * Update the order line item on the template with this month's
 * product cost + markup amount before generating the invoice.
 *
 * Call this immediately before generateMonthlyInvoice().
 *
 * @param {string} billingCustomerId
 * @param {number} orderAmount        — product cost + 10% markup (no membership)
 * @param {string} orderDescription   — human-readable e.g. "Monthly Food Supply Order — Mar 2026"
 */
export async function updateTemplateOrderAmount(billingCustomerId, orderAmount, orderDescription) {
  const { template } = await billingFetch(`/api/v1/templates/${billingCustomerId}`, {
    method: "PUT",
    body: JSON.stringify({
      products: [
        {
          productId:           "quietready-membership",
          quantity:            1,
          price:               30.00,
          discount:            0,
          lineItemDescription: "QuietReady Monthly Membership",
        },
        {
          productId:           "quietready-order",
          quantity:            1,
          price:               orderAmount,
          discount:            0,
          lineItemDescription: orderDescription,
        },
      ],
    }),
  });

  return template;
}

/**
 * Cancel a customer's recurring billing (pause or cancel subscription).
 * Deletes the template — no further invoices will be generated.
 */
export async function cancelBillingTemplate(billingCustomerId) {
  await billingFetch(`/api/v1/templates/${billingCustomerId}`, { method: "DELETE" });
}

/**
 * Get the current template for a customer.
 * Returns null if no template exists.
 */
export async function getBillingTemplate(billingCustomerId) {
  const { template } = await billingFetch(`/api/v1/templates/customer/${billingCustomerId}`);
  return template || null;
}


// ============================================================
// INVOICES
// ============================================================

/**
 * Generate the monthly invoice for a customer.
 *
 * Full monthly billing cycle (call in this order):
 *   1. calculateMonthlyOrderAmount(customer)  — your business logic
 *   2. updateTemplateOrderAmount(...)          — patch the template
 *   3. generateMonthlyInvoice(...)             — this function
 *
 * The billing platform will:
 *   - Create the invoice with both line items
 *   - Email the customer automatically via Mandrill
 *   - Reset the template's nextInvoiceDate +30 days
 *
 * @param {string} billingCustomerId
 * @returns {object} invoice
 */
export async function generateMonthlyInvoice(billingCustomerId) {
  const { invoice, template } = await billingFetch(
    `/api/v1/generate-invoice/${billingCustomerId}`,
    { method: "POST" }
  );
  return { invoice, template };
}

/**
 * Get all invoices for a customer.
 * Used in the customer portal billing history screen.
 */
export async function getCustomerInvoices(billingCustomerId) {
  const { invoices } = await billingFetch("/api/v1/invoices");
  // Filter client-side — the API doesn't support customerId query param
  return invoices.filter(inv => inv.customerId === billingCustomerId);
}

/**
 * Get a single invoice.
 */
export async function getInvoice(invoiceId) {
  const { invoice } = await billingFetch(`/api/v1/invoices/${invoiceId}`);
  return invoice;
}

/**
 * Get the public PDF URL for an invoice.
 * No auth required — safe to expose directly in the customer portal.
 *
 * @returns {string} full URL to the invoice PDF/HTML view
 */
export function getInvoicePdfUrl(invoiceId) {
  return `${BILLING_URL}/api/v1/invoices/${invoiceId}/pdf`;
}

/**
 * Mark an invoice as paid manually (e.g. after a Stripe webhook confirms payment).
 * The billing platform doesn't have its own Stripe webhook handler exposed,
 * so QuietReady's server.js listens to Stripe and calls this.
 */
export async function markInvoicePaid(invoiceId, notes = "") {
  const { invoice } = await billingFetch(`/api/v1/invoices/${invoiceId}`, {
    method: "PUT",
    body: JSON.stringify({ status: "paid", notes }),
  });
  return invoice;
}

/**
 * Create a one-off invoice (outside the monthly cycle).
 * Used for: setup fees, replacement items, adjustments.
 */
export async function createAdHocInvoice(billingCustomerId, items, notes = "") {
  const { invoice } = await billingFetch("/api/v1/invoices", {
    method: "POST",
    body: JSON.stringify({
      customerId: billingCustomerId,
      items,
      notes,
      dueDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
    }),
  });
  return invoice;
}


// ============================================================
// FULL MONTHLY BILLING CYCLE
// ============================================================

/**
 * Run the complete monthly billing cycle for a single customer.
 *
 * This is the main function called by the billing scheduler (cron)
 * or manually from the admin dashboard.
 *
 * Steps:
 *   1. Check for overdue invoices — skip if delinquent
 *   2. Get this month's order amount from QuietReady orders table
 *   3. Update the billing template with the order amount
 *   4. Generate the invoice (billing platform emails customer)
 *   5. Store the billing invoice ID on the QuietReady order record
 *
 * @param {object} supabase          — service-role Supabase client
 * @param {string} customerId        — QuietReady customer UUID
 * @param {string} billingCustomerId — billing platform customer ID
 * @returns {object} { invoice, skipped, reason }
 */
export async function runMonthlyBillingCycle(supabase, customerId, billingCustomerId) {

  // 1. Don't bill delinquent accounts
  const overdue = await hasOverdueInvoices(billingCustomerId);
  if (overdue) {
    console.warn(`⚠️  Skipping billing for ${customerId} — overdue invoices exist`);
    return { skipped: true, reason: "overdue_invoices" };
  }

  // 2. Find this month's pending order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (orderErr || !order) {
    console.warn(`⚠️  No pending order for customer ${customerId} — creating membership-only invoice`);
    // Bill membership fee even if no product order this month
    await updateTemplateOrderAmount(billingCustomerId, 0, "No product order this month");
  } else {
    // 3. Update template with this month's product + markup amount
    const orderLineAmount = order.product_cost + order.markup_amount;
    const monthLabel = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const description = `Monthly Food Supply Order — ${monthLabel} (${order.order_number})`;

    await updateTemplateOrderAmount(billingCustomerId, orderLineAmount, description);
  }

  // 4. Generate the invoice
  const { invoice } = await generateMonthlyInvoice(billingCustomerId);

  // 5. Store billing invoice ID on the order
  if (order) {
    await supabase
      .from("orders")
      .update({
        billing_invoice_id: invoice.id,
        billing_invoice_number: invoice.invoiceNumber,
        status: "purchasing",
      })
      .eq("id", order.id);
  }

  console.log(`✓ Invoice ${invoice.invoiceNumber} generated for customer ${customerId}`);
  return { invoice, skipped: false };
}


// ============================================================
// HEALTH CHECK
// ============================================================

/**
 * Verify the billing platform is reachable and the API key is valid.
 * Called by GET /api/health in server.js.
 */
export async function checkBillingHealth() {
  try {
    await billingFetch("/api/v1/api-keys");
    return { status: "ok" };
  } catch (err) {
    return { status: "error", message: err.message };
  }
}
