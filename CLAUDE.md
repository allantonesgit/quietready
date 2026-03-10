# QuietReady — Claude Context File
Read this file at the start of every session before touching any code.

## Project
QuietReady.ai — family emergency food supply SaaS
Owner: Allan Tone (allan@dealeraddendums.com)
GitHub: https://github.com/allantonesgit/quietready

## Server Access
```
ssh -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com
```
App lives at: /home/ubuntu/quietready

## Deploy (after every git push)
```
cd /home/ubuntu/quietready && git pull && pm2 restart all
```

## Stack
- Frontend: React (quietready.jsx) — served as a single-page app
- Backend: Node.js / Express (server.js) — port 3001
- Database: Supabase PostgreSQL
- Billing system: billing.quietready.ai (separate Next.js app)
- Email: Mandrill (email.js)
- Payments: Stripe
- Process manager: PM2

## Key URLs
- Main app: https://quietready.ai
- Billing portal: https://billing.quietready.ai

## Customer Status Flow
preview → (payment collected) → active → paused / cancelled

## Key Files
- quietready.jsx — entire React frontend (wizard + portal)
- server.js — Express API (onboarding, portal, admin, billing)
- email.js — Mandrill transactional emails
- billing.js — billing platform integration
- 001_schema.sql — Supabase database schema
