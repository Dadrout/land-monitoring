# JerMonitor — Digital Land Monitoring MVP

Hackathon by Zhambyl Hub prototype for the case **«Цифровой мониторинг земель и сервис для граждан»**.

The project implements the core end-to-end jury scenario:

**Citizen Telegram report → geolocation + photo + description → backend → inspector map → violation confirmation → deadline → resolution.**

## What is included

- GIS inspector dashboard with OpenStreetMap + Leaflet
- Test land parcels with green / yellow / red lifecycle status
- Citizen-report queue and inspector workflow
- Telegram bot with button-driven UX
- Telegram application-status lookup (`KZ-2026-042` … `KZ-2026-045`)
- Land-procedure knowledge base
- Telegram photo download and Supabase Storage upload
- Supabase PostgreSQL migration + seed data
- Local demo mode that works **without any cloud credentials**
- API routes suitable for Vercel

## 1. Run immediately in local demo mode

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

No `.env` is required for demo mode. The dashboard contains **Demo Citizen**, which reproduces the Telegram-to-map moment locally. Reports are stored in server memory and reset when the dev server restarts.

## 2. Production database with Supabase

This package is configured for Supabase project:

`https://tfsbcnmakaomboshrfho.supabase.co`

The repository contains only the public project URL and publishable key. The backend secret is deliberately **not stored in the repository or ZIP**.

### Database schema

In Supabase SQL Editor, run the complete file:

`supabase/migrations/202609270001_land_monitoring.sql`

The migration is safe to rerun and creates:

- `land_plots`
- `citizen_reports`
- `land_applications`
- `telegram_sessions`
- public Storage bucket `report-photos`
- indexes
- Realtime publication for `citizen_reports` and `land_plots`
- 15 demo plots and demo application-status records

### Local environment

Because a Supabase secret key was previously shared in chat, rotate it first in **Supabase → Project Settings → API Keys**. Then run:

```bash
npm run setup:env
```

The setup script writes `.env.local` with the configured project URL/public key and securely prompts for the **new** secret key without putting it in source control.

The application also supports manual environment configuration with these variable names:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tfsbcnmakaomboshrfho.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_-hCAsTK9tRsprcMqL2tI7Q_XF73LNVE
SUPABASE_URL=https://tfsbcnmakaomboshrfho.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_-hCAsTK9tRsprcMqL2tI7Q_XF73LNVE
```

Add `SUPABASE_SECRET_KEY` only to `.env.local` or the Vercel Environment Variables UI. Never commit it. The code also accepts the legacy `SUPABASE_SERVICE_ROLE_KEY`, but the current `sb_secret_...` key is preferred.

## 3. Telegram bot

Create a bot with `@BotFather`. Run `npm run setup:env` and paste the BotFather token when prompted. The script stores it only in `.env.local`.

After deployment, set `APP_URL` in Vercel to the final production URL and register the webhook from a shell where those two variables are available:

```bash
set -a
source .env.local
set +a
curl -X POST "$APP_URL/api/telegram/set-webhook" \
  -H "x-setup-secret: $WEBHOOK_SETUP_SECRET"
```

Telegram flow:

1. `/start`
2. `🚨 Сообщить о нарушении`
3. Select violation category
4. Send location
5. Send photo
6. Send description
7. Confirm
8. The report appears in the inspector dashboard

## 4. Vercel deployment

Push the repository to GitHub/GitLab or deploy using Vercel, then copy the values from your local `.env.local` into the Vercel Environment Variables UI. Update `APP_URL` there to the final production URL.

For a **web-only jury demo**, Supabase credentials are enough. For the full Telegram demo, also configure the bot token, public deployment URL, and setup secret.

## Demo script (3 minutes)

**0:00–0:20 — Problem**  
Inspectors spend time comparing field reality with land records, while citizens lack one fast reporting channel.

**0:20–0:35 — Dashboard**  
Show KPI cards and the land-status map.

**0:35–1:15 — Citizen report**  
On the phone: Telegram → violation → location → photo → description → send.

**1:15 — Main wow moment**  
A new yellow report appears on the inspector map.

**1:15–1:50 — Inspector action**  
Open report → confirm violation → set deadline. The status turns red.

**1:50–2:10 — Application lookup**  
Use `KZ-2026-042`.

**2:10–2:30 — Knowledge base**  
Show the three procedures.

**2:30–3:00 — Scale**  
Explain future integration with cadastre, satellite monitoring, eGov and AI change detection.

## Routes

- `/` — dashboard
- `/map` — full GIS map
- `/reports` — citizen reports
- `/applications` — application lookup
- `/api/plots`
- `/api/reports`
- `/api/reports/:id`
- `/api/applications?tracking=KZ-2026-042`
- `/api/telegram/webhook`
- `/api/telegram/set-webhook`

## Architecture

```text
Telegram Citizen
      │
      ▼
Next.js API routes
      │
      ├──────────► Supabase Storage (photos)
      │
      ▼
Supabase PostgreSQL
      │
      ▼
Inspector Dashboard
Leaflet + OpenStreetMap
```

## Security notes

- Service-role key is never sent to the browser.
- Public table RLS is enabled with no permissive table policies in this MVP.
- Telegram webhook setup endpoint is protected by `WEBHOOK_SETUP_SECRET`.
- For production beyond the hackathon, add inspector authentication, RBAC, audit log, rate limits, private evidence storage, and official legal/regulatory content synchronization.
