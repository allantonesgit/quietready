// ============================================================
// email.js — QuietReady transactional email via Mandrill
// ============================================================

const MANDRILL_API_KEY = process.env.MANDRILL_API_KEY;
const FROM_EMAIL       = process.env.EMAIL_FROM      || "hello@quietready.ai";
const FROM_NAME        = process.env.EMAIL_FROM_NAME || "QuietReady";
const BASE_URL         = process.env.BASE_URL         || "https://quietready.ai";

// ── Core send function ────────────────────────────────────────
async function sendEmail({ to, toName, subject, html, text, trackClicks = true }) {
  if (!MANDRILL_API_KEY) {
    console.warn("⚠️  MANDRILL_API_KEY not set — email skipped:", subject);
    return;
  }

  const res = await fetch("https://mandrillapp.com/api/1.0/messages/send", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: MANDRILL_API_KEY,
      message: {
        html,
        text,
        subject,
        from_email: FROM_EMAIL,
        from_name:  FROM_NAME,
        to: [{ email: to, name: toName || to, type: "to" }],
        important: false,
        track_opens:  true,
        track_clicks: trackClicks,
        auto_text:    !text,
        tags: ["quietready-transactional"],
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || data[0]?.status === "rejected" || data[0]?.status === "invalid") {
    throw new Error(`Mandrill error: ${JSON.stringify(data)}`);
  }
  console.log(`📧 Email sent to ${to}: ${subject} [${data[0]?.status}]`);
  return data;
}


// ── Brand colors & shared styles ─────────────────────────────
const styles = {
  wrapper:  `font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#FDFCFA;`,
  header:   `background:#4A5C3A;padding:28px 36px;`,
  logoText: `color:#F7F3ED;font-size:22px;font-weight:700;letter-spacing:-0.5px;font-family:Georgia,serif;margin:0;`,
  logoSub:  `color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:3px 0 0;`,
  body:     `padding:36px;color:#2C2416;`,
  h1:       `font-family:Georgia,serif;font-size:22px;font-weight:600;color:#2C2416;margin:0 0 12px;`,
  p:        `font-size:14px;color:#8C8278;line-height:1.7;margin:0 0 16px;`,
  pDark:    `font-size:14px;color:#2C2416;line-height:1.7;margin:0 0 16px;`,
  btn:      `display:inline-block;background:#4A5C3A;color:#FDFCFA;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;`,
  divider:  `border:none;border-top:1px solid #E8E2D9;margin:24px 0;`,
  footer:   `background:#F7F3ED;padding:20px 36px;border-top:1px solid #E8E2D9;`,
  footerP:  `font-size:11px;color:#8C8278;line-height:1.6;margin:0;`,
  card:     `background:#F7F3ED;border:1px solid #E8E2D9;border-radius:8px;padding:18px 20px;margin:16px 0;`,
  row:      `display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #E8E2D9;`,
  rowLast:  `display:flex;justify-content:space-between;font-size:13px;padding:6px 0;`,
  label:    `color:#8C8278;`,
  value:    `color:#2C2416;font-weight:600;`,
};

function emailWrapper(content) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#F0EBE3;">
<div style="${styles.wrapper}">
  <div style="${styles.header}">
    <p style="${styles.logoText}">QuietReady.ai</p>
    <p style="${styles.logoSub}">Smart Pantry. Peace of Mind.</p>
  </div>
  <div style="${styles.body}">
    ${content}
  </div>
  <div style="${styles.footer}">
    <p style="${styles.footerP}">
      You're receiving this because you have a QuietReady account.<br>
      Questions? Reply to this email or contact <a href="mailto:support@quietready.ai" style="color:#C4773B;">support@quietready.ai</a><br><br>
      QuietReady.ai · Family Food Security · <a href="${BASE_URL}/portal" style="color:#C4773B;">Your Portal →</a>
    </p>
  </div>
</div>
</body></html>`;
}


// ── 1. Welcome email ──────────────────────────────────────────
// Sent immediately after onboarding. No order details yet.

async function sendWelcomeEmail(email, fullName, customerId, magicLink) {
  const firstName = fullName?.split(" ")[0] || "there";
  const portalLink = magicLink || `${BASE_URL}/portal`;

  const html = emailWrapper(`
    <h1 style="${styles.h1}">Your QuietReady plan is ready, ${firstName}. 🏡</h1>
    <p style="${styles.pDark}">
      We've built your personalized food security plan. Click below to set your password and preview your plan — no payment needed yet.
    </p>

    <p style="text-align:center;margin:28px 0;">
      <a href="${portalLink}" style="${styles.btn}">View My Plan →</a>
    </p>

    <div style="${styles.card}">
      <p style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8C8278;margin:0 0 12px;">What happens next</p>
      ${[
        ["Right now",   "Set your password and preview your full Month 1 plan"],
        ["When ready",  "Activate your plan with payment info to begin fulfillment"],
        ["1–3 days",    "Your container kit ships first — arrives before the food"],
        ["5–14 days",   "Supplier shipments begin arriving directly at your door"],
      ].map(([time, desc], i, arr) => `
        <div style="${i < arr.length - 1 ? styles.row : styles.rowLast}">
          <span style="${styles.label}">${time}</span>
          <span style="${styles.value};max-width:70%;text-align:right;">${desc}</span>
        </div>`).join("")}
    </div>

    <hr style="${styles.divider}">
    <p style="${styles.p}">
      This link expires in 24 hours. If it expires, you can request a new one at <a href="${BASE_URL}" style="color:#C4773B;">quietready.ai</a>.
    </p>
  `);

  await sendEmail({
    to:          email,
    toName:      fullName,
    subject:     `Your QuietReady plan is ready — set your password to view it`,
    html,
    trackClicks: false,  // magic link is one-time-use — tracking would consume it
  });
}


// ── 2. Shipment arriving email ────────────────────────────────
// Sent when admin confirms a shipment is on its way
async function sendShipmentEmail(email, fullName, items) {
  const firstName = fullName?.split(" ")[0] || "there";
  const itemList  = Array.isArray(items) ? items : [];

  const html = emailWrapper(`
    <h1 style="${styles.h1}">A shipment is on its way 📦</h1>
    <p style="${styles.pDark}">
      Good news, ${firstName} — one of your QuietReady shipments has been confirmed and is heading to you now.
    </p>

    ${itemList.length > 0 ? `
    <div style="${styles.card}">
      <p style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8C8278;margin:0 0 12px;">Items in this shipment</p>
      ${itemList.map((item, i) => `
        <div style="${i < itemList.length - 1 ? styles.row : styles.rowLast}">
          <span style="${styles.label}">${item.product_name}</span>
          <span style="${styles.value}">${item.qty} ${item.unit}</span>
        </div>`).join("")}
    </div>` : ""}

    <p style="${styles.p}">
      When it arrives, your portal will have step-by-step placement instructions telling you exactly which container each item goes in and what label to apply.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${BASE_URL}/portal" style="${styles.btn}">View Placement Instructions →</a>
    </p>
  `);

  await sendEmail({
    to:      email,
    toName:  fullName,
    subject: `Your QuietReady shipment is on the way`,
    html,
  });
}


// ── 3. Rotation reminder email ────────────────────────────────
// Sent when items are approaching expiry (60-day warning)
async function sendRotationReminderEmail(email, fullName, items) {
  const firstName  = fullName?.split(" ")[0] || "there";
  const overdueItems   = items.filter(i => i.daysLeft < 0);
  const upcomingItems  = items.filter(i => i.daysLeft >= 0);

  const html = emailWrapper(`
    <h1 style="${styles.h1}">Time to rotate some items 🔄</h1>
    <p style="${styles.pDark}">
      Hi ${firstName}, a few items in your storage are coming up on their rotation date.
    </p>

    ${overdueItems.length > 0 ? `
    <div style="background:#FEF0EE;border:1px solid #F5C6C0;border-radius:8px;padding:18px 20px;margin:16px 0;">
      <p style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#B94040;margin:0 0 12px;">Use these now — past rotation date</p>
      ${overdueItems.map((item, i) => `
        <div style="${i < overdueItems.length - 1 ? styles.row : styles.rowLast}">
          <span style="${styles.label}">${item.product_name} <span style="color:#8C8278;font-size:11px;">(${item.container_code})</span></span>
          <span style="color:#B94040;font-weight:600;">${Math.abs(item.daysLeft)}d overdue</span>
        </div>`).join("")}
    </div>` : ""}

    ${upcomingItems.length > 0 ? `
    <div style="${styles.card}">
      <p style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8C8278;margin:0 0 12px;">Rotate within 60 days</p>
      ${upcomingItems.map((item, i) => `
        <div style="${i < upcomingItems.length - 1 ? styles.row : styles.rowLast}">
          <span style="${styles.label}">${item.product_name} <span style="color:#8C8278;font-size:11px;">(${item.container_code})</span></span>
          <span style="color:#C98B2A;font-weight:600;">${item.daysLeft}d left</span>
        </div>`).join("")}
    </div>` : ""}

    <p style="${styles.p}">
      Use these items in your regular cooking now and your next QuietReady order will automatically replenish them.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${BASE_URL}/portal" style="${styles.btn}">View Full Rotation Schedule →</a>
    </p>
  `);

  await sendEmail({
    to:      email,
    toName:  fullName,
    subject: `QuietReady rotation reminder — ${items.length} item${items.length > 1 ? "s" : ""} to use soon`,
    html,
  });
}


// ── 4. Payment failed / overdue warning ───────────────────────
async function sendPaymentFailedEmail(email, fullName, invoiceNumber, amount) {
  const firstName = fullName?.split(" ")[0] || "there";

  const html = emailWrapper(`
    <h1 style="${styles.h1}">Action needed: payment issue ⚠️</h1>
    <p style="${styles.pDark}">
      Hi ${firstName}, we weren't able to process your payment for invoice #${invoiceNumber} (${amount}).
    </p>
    <p style="${styles.p}">
      Your food security plan is paused until this is resolved. No new orders will be placed until your account is current.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${BASE_URL}/portal" style="${styles.btn}">Resolve Payment →</a>
    </p>
    <hr style="${styles.divider}">
    <p style="${styles.p}">
      If you have questions or need to update your payment method, reply to this email or contact <a href="mailto:support@quietready.ai" style="color:#C4773B;">support@quietready.ai</a>.
    </p>
  `);

  await sendEmail({
    to:      email,
    toName:  fullName,
    subject: `Action needed: QuietReady payment issue — Invoice #${invoiceNumber}`,
    html,
  });
}


export {
  sendWelcomeEmail,
  sendShipmentEmail,
  sendRotationReminderEmail,
  sendPaymentFailedEmail,
};
