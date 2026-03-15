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

**IMPORTANT:** Always use `mv ~/Downloads/filename ~/Desktop/QuietReady/filename` (not cp) before deploying.

**IMPORTANT:** GitHub repo is IN SYNC. Always use deploy.sh — never edit server files directly via SSH.

**IMPORTANT:** If PM2 isn't picking up new env vars:
```bash
pm2 delete all && pm2 start /home/ubuntu/quietready/server.js --name quietready-api && pm2 save
```

---

## Project Overview
**QuietReady.ai** — A SaaS platform that automates long-term household food/supply security planning and fulfillment. Customers answer a 10-step wizard, get a personalized emergency food plan, and receive automatic monthly shipments with rotation tracking. Fully drop-ship model — no warehousing.

- **Owner:** Allan Tone (allan@dealeraddendums.com)
- **GitHub:** https://github.com/allantonesgit/quietready
- **Main app:** https://quietready.ai
- **Admin panel:** https://quietready.ai/admin
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

## PRICING MODEL — LOCKED

| Component | Value | Notes |
|---|---|---|
| Monthly membership | $30/mo | Portal access, rotation tracking, recipe guide |
| Product markup | **30%** | Applied to all purchased items |
| Shipping | **Pass-through at cost** | Customer pays exact shipping, no markup |
| Credit card fee | 3.15% | Absorbed into markup — not charged separately |

### How billing math works
```
customer_monthly_budget = $X
membership_fee          = $30
product_budget          = X - 30
our_product_cost        = product_budget / 1.30
our_gross_margin        = product_budget - our_product_cost  (= 23% of product_budget)
shipping                = passed through at actual carrier cost
```

---

## SUPPLIER STRATEGY — DECIDED

### Model: Vendor-agnostic purchase abstraction layer
For each item, check multiple vendor APIs, pick lowest **landed cost** (item + shipping to customer zip), place order. Customer never knows which vendor fulfilled it.

### Priority waterfall (Phase 6 implementation)
```
1. Wholesale partner price   → best margin
2. Walmart API price         → broadest SKU coverage
3. Amazon SP-API price       → specialty/hard-to-find
4. Pick lowest landed cost
5. Place order via winning vendor API
```

### Vendor landscape

**Retail APIs (price discovery + purchasing)**
| Vendor | API | Best for | Status |
|---|---|---|---|
| Walmart | Affiliate + WFS API | Staples, broadest SKU, drop-ship program | Phase 6 |
| Amazon | SP-API (Selling Partner) | Specialty items, Subscribe & Save | Phase 6 |
| Kroger | Products API (free) | CBI price indexing only — no purchasing | Live |

**Wholesale / Emergency Supply (apply for reseller accounts)**
| Vendor | Best for | Notes |
|---|---|---|
| Augason Farms | Freeze-dried, long shelf-life, bulk staples | Has reseller program |
| Emergency Essentials | Full emergency food range | Wholesale pricing available |
| Webstaurant Store | Bulk food-service packaging, rice/oats/canned | Has wholesale API |
| My Patriot Supply | Emergency preparedness, already drop-ships for brands | Strong fit |
| Ready Store / Nitro-Pak | Non-food emergency items | |

### Minimum order thresholds
Not yet decided — Phase 6 problem. Fulfillment engine will batch or reroute dynamically.

---

## Environment Variables (EC2 /etc/environment)
All without quotes:
```
KROGER_CLIENT_ID=quietreadyai-bbcctn0d
KROGER_CLIENT_SECRET=<rotated — in server only, never in chat>
KROGER_LOCATION_ID=01600569
CBI_REFRESH_SECRET=84792e323978e5b56fe8bfad153543f821937405c605dada0b871ca5f3da2afa
```

---

## Supabase Schema

### Key tables:
- **customers** — id, auth_user_id, email, full_name, stripe_customer_id, billing_customer_id, status, billing/shipping addresses, activated_at, login_token, login_token_expires_at, `personal_cbi`, `cbi_locked_at`, `container_payment_preference`
- **household** — infants/children/teens/adults/seniors
- **pets** — pet_type, count, size
- **customer_preferences** — food philosophy, dietary restrictions, storage dims, budget, coverage months, container tier, `calories_children/teens/adults/seniors`, `utilities` (JSON), `equipment` (JSON)
- **pricing_matrix** — wizard option to cost multiplier (~40 rows seeded)
- **price_basis** — daily CBI snapshots. Fields: `basis_date`, `cbi_value`, `raw_prices` (JSON: `today_cpc`, `launch_cpc`). Launch baseline: `launch_cpc=0.003821`, `cbi=100.0`, set 2026-03-14
- **household_changes** — audit log. Fields: `customer_id`, `changes_json`, `reason`, `changed_at`
- **storage_containers**, **orders**, **order_items**, **inventory_items**, **shipment_instructions**, **customer_pdfs**, **admin_users**

---

## Cost Basis Index (CBI) — LIVE

- EasyCron fires `POST /api/admin/cbi/refresh` daily at 3am UTC
- 12 Kroger store-brand products, location `01600569`, `filter.fulfillment=ais` required
- Launch baseline: `cpc = 0.003821` ($/kcal), set 2026-03-14
- As of 2026-03-15: `currentCpc = 0.004394` (~15% above launch baseline)
- Dashboard returns `costIndex: { personalCbi, currentCbi, cbiChangePct, basisDate, currentCpc }`
- **IMPORTANT:** `price_basis` select must include `raw_prices` — `currentCpc` comes from `raw_prices.today_cpc`, not `cbi_value`

### Kroger API rules (learned the hard way)
- Store-brand search terms only — national brands return no price on free tier
- Always add `filter.fulfillment=ais` — otherwise get `items: [null]`
- Fresh token on each CBI run (clear `krogerTokenCache` first)
- 600ms delay between requests

### Plan cost formula
```
monthCost = (dailyCalories x 30) x currentCpc x philosophyMultiplier
```
Philosophy multipliers: wholeFood=1.25, balanced=1.00, freezeDried=2.40, noPreference=0.78

### Quantity rules
- **Calorie-driven:** grains (40% of kcal / 1600/lb), protein cans (20% / 200/can), legumes (10% / 1600/lb), fats (15% split PB/oil)
- **Fixed per-person/month:** veg=4 cans, tomatoes=4, soup=4, fruit=3, dairy=3, sweeteners=1.5 lbs, water=14 gal

---

## Billing System
- Supabase project: `pzkrvgohxojqscdsmegc`, KV: `kv_store_0ecc29ad`
- Products: `quietready-membership` ($30/mo), `quietready-order` (variable)
- Never bill `status = "preview"` customers
- Template created only at activation

---

## Wizard Steps (10)
1. Household  2. Caloric Intake  3. Dietary  4. Food Philosophy  5. Storage
6. Coverage & Budget  7. Utilities  8. Equipment  9. Containers  10. Plan Review

STEPS constant: `["household","caloricIntake","dietary","foodPhilosophy","storage","coverageBudget","utilities","equipment","containers","plan","success"]`

---

## Portal Screens & Structure
- `landing` — Log In + Get Started in nav
- `login` — email+password OR magic link — `POST /api/auth/login`
- `setpassword`, `linkerror`, `questionnaire`, `portal`
- `admin` — separate screen at `/admin` path, own login (checks `admin_users` table), token stored as `qr_admin_token`

### Portal tabs: My Plan | Container Map | Billing
- `PlanTab` — CBI-derived costs, shipment accordion, CBI banner, extras section
- `ContainerMapTab` — color-coded by category, reads `formData.containers` from DB
- `getMonthStatus(m)` — wired to real orders; maps pending/processing to in-progress, fulfilled/shipped to fulfilled, missing to projected
- `formData.orders` — populated from dashboard (ascending by created_at, index 0 = month 1)
- `formData.containers` — populated from `storage_containers` table via dashboard join
- `Portal` uses `localFormData` state (not prop directly) so household changes reflect instantly without reload

### Household card (Plan Tab)
- Active customers: clicking the Household summary card opens `HouseholdChangeModal`
- Modal has people + pets counters, per-row change indicators (shows "prev → new"), optional reason field
- Saves via `PATCH /api/portal/household`, updates `localFormData` immediately, plan costs recalculate
- Preview customers: card is not clickable

### Extras & Add-ons section (bottom of Plan Tab)
- `EQUIPMENT_CATALOG` — 16 items with prices, categories, icons. Single source of truth used by both accordion and extras section.
- `CONTAINER_PRICES` — `{ good: 8, better: 22, best: 45 }` per container (est. retail)
- Delivery: containers always Shipment 1; equipment split first half Ship 1, remainder Ship 2
- Month accordion shows "Also in this shipment" for months 1 and 2 with est. prices in clay
- Active customers can toggle equipment items on/off (saves via `PATCH /api/portal/preferences/equipment`)
- Dark bark total summary bar at bottom showing combined est. cost

### Admin panel tabs: CBI Prices | Customers
- CBI Tab: stat row (today CPC, launch CPC, % change, days tracked) + SVG line chart with launch baseline + daily log table + CBI Impact Flags widget
- CBI Impact Flags: active customers with >=2% CBI change since enrollment. Columns: name/email, enrolled CBI, current CBI, % change badge, budget impact $/mo, monthly budget. Green all-clear state when no flags. Threshold = 2%.
- Customers Tab: full customer list with status badges and budget
- Add users to `admin_users` table in Supabase to grant access

---

## Server Endpoints (key ones)
- `POST /api/auth/login` — password login (customers)
- `POST /api/admin/login` — password login for admins, checks admin_users table
- `GET /api/admin/me` — verify admin token, return admin record
- `POST /api/onboarding/submit` — creates customer, saves calories
- `POST /api/onboarding/activate` — preview to active, snapshots CBI
- `GET /api/portal/dashboard` — returns costIndex, containers, orders (ascending), household, prefs, pets, inventory, pdfs, pendingInstructions
- `PATCH /api/portal/household` — update household + pets post-activation, writes to household_changes audit log
- `PATCH /api/portal/preferences/equipment` — toggle single equipment add-on, merges into equipment JSON
- `POST /api/admin/cbi/refresh` — Kroger price fetch, updates price_basis
- `GET /api/admin/cbi/latest` — last 30 days CBI with raw_prices

---

## Server Structure & Rules
- `/home/ubuntu/quietready/` — git root
- `/home/ubuntu/quietready/frontend/` — Nginx web root (not in git)
- `quietready.jsx` — no import/export, first line `const { useState, useEffect, useRef } = React;`, last line `ReactDOM.createRoot...`
- `server.js` — ESM only, never `require()`
- Always use Python3 for server-side string replacement (sed fails on backticks)
- Nginx must serve `index.html` for `/admin` path: `location /admin { try_files $uri /index.html; }`
- Auth token keys: customers use `qr_token`, admins use `qr_admin_token` (both in localStorage)
- **str_replace caution:** when inserting a new function before an existing one, the replacement target must not include the existing function's opening line or it will be consumed and break the file structure

---

## Supabase Auth Settings
- Confirm email: OFF
- Redirect URLs: `https://quietready.ai`, `https://quietready.ai/auth/callback`
- Site URL: `https://quietready.ai`, OTP Expiry: 86400

---

## Known Issues / Tech Debt
- Stale Supabase test users — clean up in dashboard Authentication Users
- server.js still references FRESHBOOKS_* env vars in comment block — legacy, unused
- Phase 3 Task 5 pending: container payment choice (upfront vs spread) at activation
- Household change history not yet visible in admin customer list (Phase 4 remainder)

---

## Phase Roadmap

### Phase 1 — COMPLETE (Session 7)
DB schema, caloric intake wizard step, pricing matrix, portal Plan Tab accordion, Container Map Tab.

### Phase 2 — COMPLETE (Session 8)
Kroger CBI live, EasyCron running, CBI-derived plan costs, quantity logic fixed, login screen + endpoint.

### Phase 3 — IN PROGRESS
1. DONE: Verified currentCpc flows end-to-end (raw_prices fix, real value 0.004394)
2. DONE: Added storage_containers join to GET /api/portal/dashboard
3. DONE: Wired getMonthStatus to real orders table
4. DONE: Extras & add-ons section with equipment catalog, prices, shipment scheduling, container pricing, interactive toggles, month accordion integration
5. PENDING: Activation container payment choice (upfront vs spread)

### Phase 4 — IN PROGRESS
- DONE: Admin area at quietready.ai/admin with login wall
- DONE: Admin login/me endpoints
- DONE: CBI chart (SVG line chart, stat row, daily log)
- DONE: Customer list tab
- DONE: CBI impact flags widget (>=2% threshold, budget impact $/mo, sorted by largest change)
- DONE: Household change flow — HouseholdChangeModal, PATCH endpoint, household_changes audit log, localFormData instant recalc
- PENDING: Household change history visible in admin customer list

### Phase 5 — Session 11
Resources tab (static content + personalization)

### Phase 6 — Session 12+
Vendor API purchasing integration (Walmart first, then wholesale partners)
Apply for reseller accounts: Augason Farms, My Patriot Supply, Webstaurant Store

---

## Session History
- Session 1 (2026-03-10): Explored live site, identified missing checkout flow
- Session 2 (2026-03-10): Built preview portal, magic link, activation checkout
- Session 3 (2026-03-10): Git, GitHub, EC2, deploy script
- Session 4 (2026-03-11): Magic link debug, custom token system
- Session 5 (2026-03-12): Fixed auth flow end-to-end
- Session 6 (2026-03-13): Product roadmap spec. Phase 1 complete. 10-step wizard. Portal Plan Tab + Container Map.
- Session 7 (2026-03-13): Phase 1 deployed. DB schema, pricing matrix, caloric intake step.
- Session 8 (2026-03-14): Phase 2 complete. Kroger API live. EasyCron running. CBI baseline set (launch_cpc=0.003821). Plan costs CBI-derived. Login screen. Pricing model locked: $30 membership + 30% markup + pass-through shipping. Supplier strategy decided.
- Session 9 (2026-03-15): Two back-to-back sessions totaling ~2.5 hours. Morning: Phase 3 tasks 1-3 complete — fixed raw_prices missing from price_basis select (currentCpc was always falling back to hardcoded value, now reads real 0.004394), added storage_containers to dashboard, wired getMonthStatus to real orders, added orders to formData ascending. Admin area built: login wall, CBI SVG chart, customer list, admin login/me endpoints. Afternoon: equipment prices + shipment scheduling (EQUIPMENT_CATALOG constant, containers Ship 1, equipment split Ship 1/2, prices shown in accordion and extras section). CBI impact flags widget in admin. Household change flow (HouseholdChangeModal, PATCH /api/portal/household, household_changes audit log, localFormData for instant recalc). Fixed str_replace bug that broke ActivateModal function declaration.
