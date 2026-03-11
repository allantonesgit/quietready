# QuietReady — Claude Context File
**Read this file completely at the start of every session before touching any code.**

---

## Server Access
```
ssh -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com
```
App lives at: `/home/ubuntu/quietready`

## One-Command Deploy (from Mac, inside ~/Desktop/QuietReady)
```
./deploy.sh "describe what changed"
```
This script: `git add` → `git commit` → `git push` → SSH into EC2 → `git pull origin main` → `pm2 restart all`

---

## Project Overview
**QuietReady.ai** — A SaaS platform that automates long-term household food/supply security planning and fulfillment. Customers answer a 9-step wizard, get a personalized emergency food plan, and receive automatic monthly shipments with rotation tracking.

- **Owner:** Allan Tone (allan@dealeraddendums.com)
- **GitHub:** https://github.com/allantonesgit/quietready
- **Main app:** https://quietready.ai
- **Billing portal:** https://billing.quietready.ai

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React (quietready.jsx) — single JSX file, no build step |
| Backend | Node.js / Express (server.js) — port 3001 |
| Database | Supabase PostgreSQL (project ID: `fxbrsubgzjuairnhzscl`) |
| Auth | Supabase Auth (magic links + password) |
| Billing system | billing.quietready.ai (separate Next.js/Deno/Hono.js app) |
| Email | Mandrill (email.js) |
| Payments | Stripe |
| Process manager | PM2 (service: `quietready-api`) |
| Server | EC2 Ubuntu 24.04, LAMP-adjacent |

---

## Design System (COLORS object in quietready.jsx)
```js
cream: "#F7F3ED"   // page background
bark:  "#2C2416"   // primary text
moss:  "#4A5C3A"   // primary green (buttons, accents)
sage:  "#7A9E6E"   // lighter green
clay:  "#C4773B"   // orange/warm accent
stone: "#8C8278"   // muted text
mist:  "#E8E2D9"   // borders/dividers
white: "#FDFCFA"   // card backgrounds
```
Font stack: Georgia/serif for headings, Helvetica Neue/sans-serif for body.

---

## Supabase Schema (001_schema.sql)

### Key tables:
- **customers** — main customer record
  - `id`, `auth_user_id`, `email`, `full_name`
  - `stripe_customer_id`, `billing_customer_id`
  - `status` — `"preview"` | `"active"` | `"paused"` | `"cancelled"`
  - `billing_address` (jsonb), `shipping_address` (jsonb)
  - `stripe_payment_method_id`, `activated_at`
- **household** — people counts (infants/children/teens/adults/seniors)
- **pets** — pet type, count, size
- **customer_preferences** — food philosophy, dietary restrictions, storage dimensions, budget, coverage months, container tier
- **storage_containers** — container_code (A-1, A-2, B-1...), tier, is_pet_container
- **orders** — order_number, product_cost, markup_amount, membership_fee (30.00), total_billed, status
- **order_items** — product_name, supplier, qty, unit, confirmed_at
- **inventory_items** — product_name, category, supplier, qty_on_hand, unit, status
- **shipment_instructions** — per-item placement instructions (fires via DB trigger when order_items.confirmed_at is set)
- **customer_pdfs** — Supabase Storage references for Recipe Guide PDFs
- **admin_users** — for admin auth middleware

### Pending schema migrations (not yet applied):
```sql
ALTER TABLE customers
  ADD COLUMN billing_address jsonb,
  ADD COLUMN shipping_address jsonb,
  ADD COLUMN stripe_payment_method_id text,
  ADD COLUMN activated_at timestamptz;
```

---

## Billing System (billing.quickready.ai)

### Architecture:
- Separate Next.js frontend + Deno/Hono.js edge function
- Supabase project: `pzkrvgohxojqscdsmegc`
- Single KV table: `kv_store_0ecc29ad`
- API base: `https://pzkrvgohxojqscdsmegc.supabase.co/functions/v1/make-server-0ecc29ad`

### Products:
- `quietready-membership` — $30.00/mo fixed
- `quietready-order` — variable (monthlyBudget − $30)

### Critical billing rules:
- One template per customer — always GET first, then PUT to update (never create duplicate)
- Subscription products do NOT auto-drop from template
- `lineItemDescription` tracks fulfillment counter ("1 of 15")
- `nextInvoiceDate` = activation date + 1 month
- **Never bill customers with `status = "preview"`**
- Billing template is NOT created until activation (not at signup/wizard completion)

### billing.js exports:
```js
createBillingCustomer(customer)
createBillingTemplate(billingCustomerId, firstBillingDate)
updateTemplateOrderAmount(billingCustomerId, newAmount)
generateMonthlyInvoice(billingCustomerId)
getCustomerInvoices(billingCustomerId)
getInvoicePdfUrl(invoiceId)
markInvoicePaid(invoiceId)
cancelBillingTemplate(billingCustomerId)
hasOverdueInvoices(billingCustomerId)
runMonthlyBillingCycle(supabase, customerId, billingCustomerId)
checkBillingHealth()
```

---

## Customer Status Flow
```
[wizard complete]
       ↓
   "preview"    ← account created, password set, can see Month 1 plan only
       ↓        (Months 2+ blurred/locked)
  [activation]  ← payment + addresses collected via /api/onboarding/activate
       ↓
   "active"     ← full portal access, billing running, shipments begin
       ↓
  "paused" / "cancelled"
```

---

## Complete Wizard Steps (9 steps)
1. **Household** — people (infants/children/teens/adults/seniors) + pets (dogs/cats/birds/etc.)
2. **Dietary** — restrictions (vegetarian/vegan/gluten-free/etc.) + free-text notes
3. **Food Philosophy** — Whole Foods First / Balanced Mix / Freeze-Dried / Best Value + ingredient avoidances
4. **Storage** — dimensions (L×W×H), max stack height, storage type (basement/pantry/garage/etc.)
5. **Coverage & Budget** — coverage months slider (3–24) + monthly budget slider ($75–$500)
6. **Utilities** — available cooking/heating options during emergency
7. **Equipment** — existing emergency gear inventory
8. **Containers** — tier selection: Essential (Gamma Seal) / Premium (IRIS USA) / Professional (Safecastle)
9. **Plan (Review)** — full plan summary with Month 1 itemized food list, container map, billing breakdown

### Container logic (generateContainers function):
- Volume per person per month: wholeFood=2.2, balanced=1.9, freezeDried=1.4, noPreference=1.6 cubic ft
- Container volumes: good=0.57, better=1.71, best=2.05 cubic ft
- Container heights: good=1.21ft, better=1.375ft, best=1.54ft
- Codes: A-1, A-2, ..., B-1... (human) + P-1, P-2... (pets)

---

## Complete User Onboarding Flow

### Step A: Wizard → "Approve & Get Started"
- Modal: name + email only (no payment at this stage)
- Submits to `POST /api/onboarding/submit`
- Server creates customer with `status: "preview"`, sends Supabase magic link
- User sees "Check your inbox" with 4-step explanation

### Step B: Magic Link → SetPasswordScreen component
- Detects `access_token` + `type=signup|magiclink` in URL hash
- Password creation page with strength meter (weak/fair/strong)
- Calls `POST /api/auth/set-password` with Bearer token
- On success: stores token in localStorage, loads portal

### Step C: Preview Portal
Three tabs: **My Plan** | **Container Map** | **Billing**

**My Plan tab:**
- Summary cards: coverage goal, household, philosophy, budget, completion estimate, container system
- Month 1 shipment: FULLY VISIBLE — all items grouped by category
- Months 2+: BLURRED with lock overlay (`filter: blur(4px)`) — "🔒 Month N unlocks when you activate" + CTA
- If months > 4: "+ N more months in your plan — all unlock on activation"

**Container Map tab:**
- Container grid (A-1, A-2, B-1, etc.)
- Note that placement instructions activate with plan

**Billing tab:**
- Monthly breakdown: $30 membership + product budget = total
- Explanation of post-fulfillment billing
- Green activation CTA box

**Portal nav:**
- "PREVIEW MODE" badge (clay color)
- Green banner: "Welcome [firstName]! Your plan is ready — activate it to begin"

### Step D: ActivateModal (2-step)
Step 1 — Address:
- Shipping address (required)
- "Billing address is same as shipping" checkbox (default: checked)

Step 2 — Payment:
- Plan summary card ($30 + product budget + coverage)
- Stripe Elements card form (via `window.Stripe` + `window.__STRIPE_PUBLISHABLE_KEY__`)
- Calls `POST /api/onboarding/activate` with Bearer token

### Step E: After Activation
- `isPreview` → false throughout portal
- Blurred months reveal, preview badge gone
- Welcome email sent, billing template created

---

## Server.js API Endpoints

### Onboarding
| Method | Path | Description |
|---|---|---|
| POST | `/api/onboarding/submit` | Create preview account, send magic link |
| POST | `/api/auth/set-password` | Set password after magic link (Bearer token) |
| POST | `/api/onboarding/create-setup-intent` | Stripe SetupIntent for card collection |
| POST | `/api/onboarding/activate` | Collect payment, upgrade preview → active |

### Customer Portal (requireAuth)
| Method | Path | Description |
|---|---|---|
| GET | `/api/portal/dashboard` | Everything portal home needs in one call |
| GET | `/api/portal/inventory` | Inventory items with container codes |
| GET | `/api/portal/orders` | Order history with order_items |
| GET | `/api/portal/instructions` | Pending placement instructions |
| POST | `/api/portal/instructions/:id/acknowledge` | Mark instruction done |
| GET | `/api/portal/pdf/latest` | Signed URL to latest Recipe Guide PDF |
| GET | `/api/portal/billing/invoices` | Invoice history from billing platform |
| GET | `/api/portal/billing/overdue` | Check for overdue invoices |

### Admin (requireAdmin)
| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/customers` | List customers (filterable by status/search) |
| GET | `/api/admin/customers/:id` | Full customer detail |
| POST | `/api/admin/orders/:orderId/items/:itemId/confirm` | Confirm shipment receipt |
| POST | `/api/admin/orders` | Create new monthly order |
| PATCH | `/api/admin/customers/:id/status` | Update status (preview/active/paused/cancelled) |
| POST | `/api/admin/billing/run/:customerId` | Manual billing for one customer |
| POST | `/api/admin/billing/run-all` | Monthly billing cron for all active customers |

### Other
| Method | Path | Description |
|---|---|---|
| POST | `/api/webhooks/stripe` | Stripe webhook (payment succeeded/failed, subscription deleted) |
| GET | `/api/health` | Health check (DB + billing) |

---

## Required Environment Variables (server.js)
```
SUPABASE_URL
SUPABASE_SERVICE_KEY   # service_role — never exposed to browser
SUPABASE_ANON_KEY      # for client-facing auth
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
BILLING_API_URL
BILLING_API_KEY
MANDRILL_API_KEY
ALLOWED_ORIGINS        # comma-separated (defaults: localhost:3000, quietready.ai)
PDF_SCRIPT_PATH        # path to generate_recipe_pdf.py (default: /home/ubuntu/quietready/generate_recipe_pdf.py)
PORT                   # default 3001
```

---

## Pending Items (not yet built or applied)

### Infrastructure pending:
- Supabase schema migration (billing_address, shipping_address, stripe_payment_method_id, activated_at columns)
- Add Stripe.js to index.html:
  ```html
  <script src="https://js.stripe.com/v3/"></script>
  <script>window.__STRIPE_PUBLISHABLE_KEY__ = "pk_live_...";</script>
  ```

### Features not yet built:
- **Engine 1:** Smart shopping & vendor ordering (buying the actual food)
- **Engine 2:** Expiration/rotation tracking (notify customer when to use/replace)
- **Engine 3:** Full customer portal (orders tab, inventory tab, PDF download, placement instructions UI)
- **Admin portal** (UI for Allan to manage customers, confirm shipments)
- **Login page** (for returning customers not using magic link)
- **PDF generation** (generate_recipe_pdf.py — Recipe & Menu Guide)
- **Order status → billing trigger** (mark order fulfilled → update billing line item)

---

## File Reference
| File | Description |
|---|---|
| `quietready.jsx` | Entire React frontend (~3134 lines): landing page, 9-step wizard, SetPasswordScreen, Portal, ActivateModal, CheckoutModal |
| `server.js` | Express API (~980 lines) |
| `email.js` | Mandrill transactional emails: sendWelcomeEmail, sendShipmentEmail, sendRotationReminderEmail, sendPaymentFailedEmail |
| `billing.js` | Billing platform integration |
| `001_schema.sql` | Supabase PostgreSQL schema |
| `deploy.sh` | One-command deploy script |
| `CLAUDE.md` | This file |
| `package.json` | Node dependencies |
| `ecosystem.config.cjs` | PM2 config |

---

## Business Context
- Target market: US households wanting long-term food security (not doomsday preppers — mainstream families)
- Pricing: $30/mo membership + variable monthly product order (budget − $30)
- Coverage options: 3–24 months of food supply
- Container tiers: Essential / Premium / Professional
- Monthly rotation cycle: oldest items consumed, replaced with new stock
- After full supply is built out, monthly billing drops to just $30/mo membership

---

## Session History Notes
- Session 1 (2026-03-10): Explored live site, assessed wizard steps 1–9, identified missing checkout flow
- Session 2 (2026-03-10): Reviewed full codebase, built preview portal flow: magic link → set password → gated portal → activation checkout with Stripe + addresses
- Session 3 (2026-03-10): Set up Git, GitHub repo, EC2 Git integration, one-command deploy script

---

## Server Structure (IMPORTANT — learned 2026-03-10)

The EC2 server has a split structure that predates Git setup:

| Path | Purpose |
|---|---|
| `/home/ubuntu/quietready/` | Git root — all source files live here |
| `/home/ubuntu/quietready/api/` | Old API location — has `node_modules` only |
| `/home/ubuntu/quietready/frontend/` | Nginx web root — manually created |
| `/home/ubuntu/quietready/frontend/index.html` | Static HTML entry point |
| `/home/ubuntu/quietready/frontend/quietready.jsx` | Symlink → `../quietready.jsx` |

### Nginx
- Config: `/etc/nginx/sites-enabled/quietready`
- Serves static files from: `/home/ubuntu/quietready/frontend/`
- Proxies `/api/*` to: `http://127.0.0.1:3001`

### PM2
- Now points to: `/home/ubuntu/quietready/server.js` ✅
- node_modules at: `/home/ubuntu/quietready/api/node_modules`

### Frontend loading (no build step)
- Babel standalone transpiles JSX in the browser at runtime
- React/ReactDOM loaded as UMD globals from unpkg CDN
- **quietready.jsx must NOT use `import` or `export`**
- First line must be: `const { useState, useEffect, useRef } = React;`
- Last line must be: `ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));`

### Deploy gotcha
After `git pull`, the symlink in `frontend/` keeps `quietready.jsx` in sync automatically.
The `index.html` only needs to be updated manually if the HTML shell changes.

### Known issues fixed
- `trust proxy` not set → rate limiter throws ValidationError (non-fatal, fix: add `app.set('trust proxy', 1)` to server.js)
- Billing API returning Unauthorized → `BILLING_API_KEY` env var needs to be set on EC2

---

## Server Structure (IMPORTANT — learned 2026-03-10)

The EC2 server has a split structure that predates Git setup:

| Path | Purpose |
|---|---|
| `/home/ubuntu/quietready/` | Git root — all source files live here |
| `/home/ubuntu/quietready/api/` | Old API location — has `node_modules` only |
| `/home/ubuntu/quietready/frontend/` | Nginx web root — manually created, not in git |
| `/home/ubuntu/quietready/frontend/index.html` | Static HTML entry point — manually maintained |
| `/home/ubuntu/quietready/frontend/quietready.jsx` | Symlink → `../quietready.jsx` |

### Nginx config
- File: `/etc/nginx/sites-enabled/quietready`
- Serves static files from: `/home/ubuntu/quietready/frontend/`
- Proxies `/api/*` to: `http://127.0.0.1:3001`

### PM2
- Points to: `/home/ubuntu/quietready/server.js`
- node_modules at: `/home/ubuntu/quietready/api/node_modules`

### Frontend loading (NO build step — Babel in browser)
- React/ReactDOM loaded as UMD globals from unpkg CDN
- Babel standalone transpiles JSX at runtime
- **quietready.jsx must NOT use import or export statements**
- First line must be: `const { useState, useEffect, useRef } = React;`
- Last line must be: `ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));`
- The symlink keeps quietready.jsx in sync automatically on every git pull

### Known issues to fix
- Add `app.set('trust proxy', 1)` to server.js (stops rate limiter ValidationError)
- Verify BILLING_API_KEY env var is set on EC2 (onboarding returning Unauthorized)

---

## Session Notes 2026-03-11

### Fixes completed
- Fixed BILLING_API_KEY, MANDRILL_API_KEY, STRIPE_WEBHOOK_SECRET in /etc/environment
- Added BASE_URL="https://quietready.ai" to /etc/environment
- Fixed customers_status_check constraint to include "preview" status:
  ALTER TABLE customers DROP CONSTRAINT customers_status_check;
  ALTER TABLE customers ADD CONSTRAINT customers_status_check
    CHECK (status IN ('preview', 'active', 'paused', 'cancelled'));
- PM2 now registered as systemd service (survives reboots)
- PM2 restart command must use --update-env to pick up env var changes
- Logs flushed — old cached errors no longer showing

### Magic link flow fix
- server.js now calls supabase.auth.admin.generateLink() after creating user
- Magic link passed to sendWelcomeEmail() as 4th argument
- Welcome email updated with correct preview messaging and "View My Plan" CTA
- Supabase OTP expiry should be set to 86400 (24 hours) in Auth settings

### Current blocker
- SetPasswordScreen shows "Auth session missing!" when submitting
- Root cause: Supabase session from magic link token not being established
  before the password set API call
- Need to fix SetPasswordScreen to call supabase.auth.setSession() with
  the access_token and refresh_token from the URL hash BEFORE calling
  POST /api/auth/set-password

### PM2 env var notes
- /etc/environment is NOT automatically read by PM2
- Always use: pm2 restart all --update-env
- Or: export $(cat /etc/environment | grep -v '^PATH' | xargs) before pm2 start
- After any /etc/environment change, must restart PM2 with --update-env

### Deploy reminder
- After git pull on EC2, must also copy files to api folder:
  cp /home/ubuntu/quietready/server.js /home/ubuntu/quietready/api/server.js
  cp /home/ubuntu/quietready/email.js /home/ubuntu/quietready/api/email.js
  cp /home/ubuntu/quietready/billing.js /home/ubuntu/quietready/api/billing.js

  ---

## Code Access Notes (2026-03-11)

### GitHub repo is PUBLIC
- URL: https://github.com/allantonesgit/quietready
- Claude cannot access raw.githubusercontent.com (blocked by network policy)
- Claude cannot access GitHub API for large files (size limit)
- Best workaround: paste code directly into chat, or upload files

### Current blocker (SetPasswordScreen — "Auth session missing!")
The magic link access_token from the URL hash is not a valid session token.
Fix requires two changes:

1. quietready.jsx — replace the magic link useEffect to call /api/auth/exchange-token
   first, which validates the token server-side and returns a real session token.
   Also add "linkerror" screen for expired links + ResendMagicLink component.

2. server.js — add two new endpoints:
   POST /api/auth/exchange-token — calls supabase.auth.setSession() with the
     access_token + refresh_token from the URL hash, returns session.access_token
   POST /api/auth/resend-magic-link — generates fresh magic link, sends via Mandrill

### Full fix code
Claude wrote the complete fix in the previous session. Start new chat, reference
this note, and ask Claude to apply the SetPasswordScreen fix. The code is in the
previous conversation history.
