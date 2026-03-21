# CLAUDE.md — QuietReady.ai

This file gives Claude full context about this project. Read it at the start of every session before writing any code or making any changes.

---

## Who I Am

**Allan Tone** — owner of QuietReady.ai, a household food security subscription service. I am not a developer. I rely on Claude to build and maintain all code. Keep explanations clear and commands copy-paste ready.

---

## What This Platform Is

QuietReady.ai helps families build a personalized long-term food storage plan. Customers complete a 10-step onboarding questionnaire, receive a customized food plan, and we source and deliver everything monthly — including storage containers, Mylar bags, and oxygen absorbers.

**Live URL:** `quietready.ai`

---

## Infrastructure

| Item | Detail |
|---|---|
| Server | AWS EC2 — Ubuntu 24.04 |
| Server IP | 54.160.4.222 |
| SSH command | `ssh -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com` |
| PEM key location | `/Users/allantone/ssh/QuietReady2026.pem` |
| Deploy directory | `/home/ubuntu/quietready` |
| Local files | `/Users/allantone/Sites/quietready` |
| GitHub repo | `https://github.com/allantonesgit/quietready` |
| Web server | nginx (reverse proxy) |
| Process manager | PM2 — process name: `quietready-api` |
| Node version | v20 |

---

## File Structure

```
quietready/
├── CLAUDE.md                  ← You are here
├── deploy.sh                  ← One-command deploy: bash deploy.sh "message"
├── package.json
├── QuietReady_Launch_Plan.docx
├── db/
│   └── 001_schema.sql         ← Supabase schema — all tables defined here
├── public/
│   ├── index.html             ← Single HTML shell that loads React
│   └── quietready.jsx         ← Entire React frontend (single file)
└── server/
    ├── index.js               ← Express API server (main entry point)
    ├── billing.js             ← Billing platform integration
    └── email.js               ← Mandrill/email sending
```

---

## How Deploying Works

### Day-to-day (from your Mac):
```bash
cd /Users/allantone/Sites/quietready
bash deploy.sh "describe what changed"
```

This script:
1. Commits and pushes to GitHub
2. SSHs into EC2, runs `git pull`, and restarts PM2

### What deploy.sh does:
```bash
git add .
git commit -m "your message"
git push
ssh into EC2 → git pull origin main → pm2 restart all --update-env
```

### If you ever need to manually restart the server:
```bash
ssh -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com
pm2 restart all --update-env
pm2 logs quietready-api
```

---

## Environment Variables

All set on the server via PM2 or `/etc/environment`. Never hardcoded in files.

| Variable | What it's for |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key (server only, never exposed to browser) |
| `SUPABASE_ANON_KEY` | Anon key for client-facing auth |
| `STRIPE_SECRET_KEY` | Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `BILLING_API_URL` | Billing platform endpoint |
| `BILLING_API_KEY` | Billing platform key |
| `MANDRILL_API_KEY` | Transactional email |
| `KROGER_CLIENT_ID` | Kroger Products API (CBI price tracking) |
| `KROGER_CLIENT_SECRET` | Kroger Products API |
| `KROGER_LOCATION_ID` | Default: 01600569 (Columbus OH) |
| `CBI_REFRESH_SECRET` | Shared secret for EasyCron → CBI refresh endpoint |
| `BASE_URL` | `https://quietready.ai` |
| `PORT` | Default 3001 |
| `PDF_SCRIPT_PATH` | Path to generate_recipe_pdf.py |

---

## The Application

### Frontend (`public/quietready.jsx`)

Single React file — no build step, no webpack, loads directly in the browser via CDN React.

**Screens:**
- **Landing page** — marketing, CTA to start questionnaire
- **Questionnaire** — 10-step onboarding wizard
- **Portal** — customer dashboard (Plan, Container Map, Billing tabs)
- **Admin** — internal dashboard at `/admin` (CBI price tracking, customer management)
- **Auth screens** — Login, Set Password, Link Error

**10 Questionnaire Steps:**
1. Household (people by age bracket + pets)
2. Caloric intake (USDA defaults, adjustable per group)
3. Dietary restrictions
4. Food philosophy (Whole Foods / Balanced / Freeze-Dried / Best Value)
5. Storage space (dimensions)
6. Coverage & budget (dual sliders, live cost calculation)
7. Utilities & cooking methods
8. Equipment add-ons
9. Storage containers (see Container System below)
10. Plan review → email capture → account creation

---

## Container System

Every plan uses the same fixed two-container system. There are no tiers or choices for the customer (other than opting out if they already have containers).

### 5-Gallon Gamma Seal Bucket
- **Source:** Uline
- **Dimensions:** 12" × 12" footprint, 14.5" tall
- **Usable volume:** 0.57 cu ft
- **Used for:** Bulk dry goods stored in Mylar bags with oxygen absorbers — grains, rice, oats, legumes, flour, sugar, powdered milk, dried herbs
- **Price est:** ~$18/bucket + lid

### IRIS Remington 82qt WeatherPro Gasket Bin
- **Source:** IRIS USA directly
- **Dimensions:** 30" × 16" footprint, 15.3" tall
- **Usable volume:** 2.33 cu ft
- **Used for:** Packaged dry goods, freeze-dried pouches/#10 cans, nut butters, oils, pantry kits, pet food
- **Price est:** ~$50/bin

### Mylar Bags + Oxygen Absorbers
- Included with every plan
- Assorted resealable sizes matched to bucket count
- Step-by-step sealing instructions included with first shipment

### Canned Goods — NOT stored in containers
- Cans go on open shelving (customer-supplied from their hardware store)
- Canned goods are **excluded from all container volume calculations**
- Container map includes a shelving layout recommendation

### Container Codes
- Buckets: `B-A1`, `B-A2`, `B-B1`... (prefix `B-`)
- Bins: `N-A1`, `N-A2`, `N-B1`... (prefix `N-`)
- Pet containers: `P-1`, `P-2`... (prefix `P-`)

---

## Volume Calculations (per person per month, excluding cans)

| Philosophy | Bucket vol (cu ft) | Bin vol (cu ft) |
|---|---|---|
| Whole Foods | 1.40 | 0.40 |
| Balanced | 0.80 | 0.70 |
| Freeze-Dried | 0.20 | 1.10 |
| Best Value | 0.70 | 0.40 |

Pet food goes into bins: dogs ~0.18–0.70 cu ft/mo by size, cats ~0.22 cu ft/mo.

---

## Database (Supabase)

Key tables:

| Table | What it stores |
|---|---|
| `customers` | Main customer record, status, Stripe ID, addresses |
| `household` | Age bracket counts per customer |
| `pets` | Pet type, count, size per customer |
| `customer_preferences` | All wizard answers — philosophy, budget, equipment, etc. |
| `storage_containers` | Generated container assignments (`container_type`: `bucket` or `bin`) |
| `orders` | Monthly order records |
| `order_items` | Line items per order |
| `inventory_items` | What's currently in the customer's storage |
| `shipment_instructions` | Placement instructions shown in portal after delivery |
| `household_changes` | Audit log of household composition changes |
| `price_basis` | Daily CBI (Cost Basis Index) from Kroger API |
| `customer_pdfs` | Recipe guide PDF metadata and storage paths |
| `admin_users` | Admin accounts |

**Important:** `storage_containers` has a `container_type` column (`TEXT`, values `'bucket'` or `'bin'`). Added via:
```sql
ALTER TABLE storage_containers ADD COLUMN IF NOT EXISTS container_type TEXT DEFAULT 'bucket';
```

---

## CBI — Cost Basis Index

Tracks real food cost-per-calorie using live Kroger API pricing. Updated daily at 3am UTC via EasyCron hitting `/api/admin/cbi/refresh`.

- 12-item basket of Kroger store-brand products
- Weighted average cost-per-calorie → indexed to launch baseline (100.0)
- Used to show customers when food costs have moved since they enrolled
- Admin dashboard shows full price history chart and customer impact flags

---

## Auth Flow

1. Customer completes questionnaire → POST `/api/onboarding/submit`
2. Server creates Supabase auth user + customer record
3. Server generates a secure random token, stores it on the customer row
4. Welcome email sent with magic link: `quietready.ai/api/auth/magic?token=xxx`
5. Customer clicks link → confirmation page (prevents email scanner auto-consume)
6. Customer clicks button → POST `/api/auth/magic` → server exchanges for Supabase session → redirects with `#access_token=...`
7. Frontend detects hash, calls `/api/auth/exchange-token` → gets `sessionToken` → stores in `localStorage`
8. All portal API calls send `Authorization: Bearer {sessionToken}`

Returning customers log in at `/login` with email + password, or request a new magic link.

---

## Billing

- **Stripe** — stores payment methods, handles card collection via SetupIntent
- **Billing platform** — handles recurring invoices (see `billing.js`)
- **Flow:** Preview → customer activates → payment method saved → first invoice in 30 days
- **Monthly charge:** $30 membership + variable food fulfillment amount
- **After supply complete:** only $30/mo membership continues

---

## Styling Conventions

| Token | Value | Use |
|---|---|---|
| `cream` | `#F7F3ED` | Page background |
| `bark` | `#2C2416` | Primary text |
| `moss` | `#4A5C3A` | Primary green (buttons, accents) |
| `sage` | `#7A9E6E` | Secondary green |
| `clay` | `#C4773B` | Warm accent (warnings, prices) |
| `stone` | `#8C8278` | Secondary text |
| `mist` | `#E8E2D9` | Borders |
| `white` | `#FDFCFA` | Cards |

Fonts: Georgia (headings) + Helvetica Neue (body/UI). No external font imports — system fonts only.

**No frameworks** — plain HTML/CSS/JS for the frontend. Express only for the server. No React build step — loads via CDN.

---

## What Claude Should Do at the Start of Each Session

1. Read this file fully
2. Read all other files in the project if relevant to the task
3. Ask what needs to be built or changed
4. Make changes to files in `/Users/allantone/Sites/quietready/`
5. Provide the exact deploy command when ready
6. Never assume Allan has development experience — always give complete, copy-paste-ready instructions
