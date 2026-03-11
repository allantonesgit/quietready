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
This script: `git add` → `git commit` → `git push` → SSH into EC2 → `git pull origin main` → copy files to api/ → `pm2 restart all --update-env`

**IMPORTANT:** The deploy.sh on the Mac must be the fixed version that includes the copy step:
```bash
#!/bin/bash
echo "🚀 Pushing to GitHub..."
git add .
git commit -m "${1:-update}"
git push

echo "📡 Deploying to EC2..."
ssh -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com \
  "cd /home/ubuntu/quietready && git pull origin main && cp server.js api/server.js && cp email.js api/email.js && cp billing.js api/billing.js && pm2 restart all --update-env"

echo "✅ Done!"
```

**IMPORTANT:** The GitHub repo is OUT OF SYNC with the server. The server has been edited directly via SSH during debug sessions. Before using deploy.sh, first pull the live files from the server:
```bash
scp -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com:/home/ubuntu/quietready/server.js ~/Desktop/QuietReady/server.js
scp -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com:/home/ubuntu/quietready/email.js ~/Desktop/QuietReady/email.js
```
Then commit and push those to get the repo back in sync.

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
| Backend | Node.js / Express (server.js) — port 3001, **ES module** (`import`/`export`, NOT `require`) |
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
  - `login_token` (text) — custom magic link token ← **added session 4**
  - `login_token_expires_at` (timestamptz) ← **added session 4**
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

---

## Server Structure (IMPORTANT)

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
- Always restart with: `pm2 restart all --update-env`
- After any `/etc/environment` change, must use `--update-env`

### Frontend loading (NO build step — Babel in browser)
- React/ReactDOM loaded as UMD globals from unpkg CDN
- Babel standalone transpiles JSX at runtime
- **quietready.jsx must NOT use import or export statements**
- First line must be: `const { useState, useEffect, useRef } = React;`
- Last line must be: `ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));`

### server.js is ES MODULE
- Uses `import`/`export` syntax throughout — **never use `require()`**
- `import crypto from 'crypto';` is at the top of the file
- Any new imports must use ESM `import` syntax

### After any direct server edit:
```bash
cp /home/ubuntu/quietready/server.js /home/ubuntu/quietready/api/server.js
cp /home/ubuntu/quietready/email.js /home/ubuntu/quietready/api/email.js
pm2 restart all --update-env
```

---

## Editing files on the server
**Python3 is the most reliable way to edit files on the server** (sed fails on backticks/special chars, node scripts fail silently). Always use:
```bash
python3 << 'PYEOF'
with open('server.js', 'r') as f:
    code = f.read()
# ... make replacements ...
with open('server.js', 'w') as f:
    f.write(code)
PYEOF
```

---

## Supabase Auth Settings (IMPORTANT — set in dashboard)
- **Confirm email: OFF** — Authentication → Providers → Email → "Confirm email" toggle must be OFF
  - When ON, Supabase issues short-lived `signup` tokens instead of `magiclink` tokens
  - We handle email confirmation ourselves via `updateUserById`
- **Redirect URLs allowlist** — Authentication → URL Configuration → Redirect URLs:
  - `https://quietready.ai` ← must be present
  - `https://quietready.ai/auth/callback`
- **Site URL:** `https://quietready.ai`
- **OTP Expiry:** Check Authentication → Policies (should be 86400 = 24 hours)

---

## Magic Link Flow — Current State (Session 4 — INCOMPLETE/BROKEN)

### What we built:
Instead of using Supabase's `generateLink` directly (which gets consumed by Outlook/email scanners), we built a custom token system:

1. On signup, generate a `crypto.randomBytes(32)` token, store in `customers.login_token` + `customers.login_token_expires_at`
2. Email link points to `https://quietready.ai/api/auth/magic?token=xxx`
3. `GET /api/auth/magic` — shows an intermediate HTML page with "Enter My Portal →" button (prevents email scanners from consuming the token)
4. `POST /api/auth/magic` — validates + invalidates the token, then tries to create a Supabase session

### Current blocker:
Step 4 (POST) is failing with `server_error`. We tried several approaches to get a Supabase session server-side:
- `supabase.auth.admin.createSession()` — doesn't exist in this SDK version
- POST to `/auth/v1/verify` — returns `validation_failed: Only email or phone should be provided`
- POST to `/auth/v1/admin/users/{id}/token` — unknown, last attempt when session ended

### What to try next session:
The correct Supabase Admin API call to create a session for a user by ID is:
```
POST /auth/v1/admin/users/{user_id}/identities  (probably not this)
```
Actually the right approach is probably to use the Supabase JS client's **`supabase.auth.admin.generateLink`** to get the `action_link`, then make a server-side GET request to that URL and follow redirects, capturing the `#access_token=...` fragment from the final redirect URL.

OR — simplest possible fix: just do a **server-side GET fetch** to the Supabase action_link URL and parse the redirect response headers to extract the tokens:
```js
const resp = await fetch(linkData.properties.action_link, { redirect: 'manual' });
const location = resp.headers.get('location'); // will contain #access_token=...
return res.redirect(303, location);
```
This should work because the Supabase verify URL returns a 302 to the redirectTo URL with the tokens in the hash. Our server follows it and passes the final redirect to the browser.

---

## Known Issues / Tech Debt
- `trust proxy` not set → rate limiter throws ValidationError on every request (non-fatal but noisy). Fix: add `app.set('trust proxy', 1)` near top of server.js
- GitHub repo is behind the live server — sync before using deploy.sh
- Several Supabase users in auth table are unconfirmed/broken from failed test runs — these can be cleaned up in Supabase dashboard → Authentication → Users

---

## Session History
- Session 1 (2026-03-10): Explored live site, assessed wizard steps 1–9, identified missing checkout flow
- Session 2 (2026-03-10): Reviewed full codebase, built preview portal flow: magic link → set password → gated portal → activation checkout with Stripe + addresses
- Session 3 (2026-03-10): Set up Git, GitHub repo, EC2 Git integration, one-command deploy script
- Session 4 (2026-03-11): Long debug session on magic link flow. Root causes found and fixed: (1) redirectTo was pointing to /portal, (2) duplicate sendWelcomeEmail calls, (3) Supabase "Confirm email" was ON causing signup tokens instead of magiclink tokens, (4) Outlook link scanner was pre-fetching and consuming Supabase OTP tokens. Built custom token system to work around scanner issue. POST /api/auth/magic successfully validates token and invalidates it but cannot yet create a Supabase session server-side. Next session: fix the server-side session creation using the `fetch(action_link, {redirect:'manual'})` approach described above.
