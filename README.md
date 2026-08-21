# Jilid Enam Operations

Dashboard and Telegram webhook for Jilid Enam, Seksyen 6 Shah Alam. It supports manual receipt entry now, with database foundations for inventory, purchasing, stock count, attendance, claims, leave, and payroll.

## Setup

1. Install Node.js 20 LTS or later.
2. Copy `.env.example` to `.env.local` and populate the Supabase keys and Telegram secret values. Do not commit this file.
3. In Supabase SQL Editor, run `supabase/migrations/20260821_initial_schema.sql`.
4. Run `npm install`, then `npm run dev`.
5. Add the same environment variables to Vercel and deploy.

## Telegram webhook

After Vercel deploys, set the Telegram webhook with a random secret token:

```text
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<YOUR-VERCEL-DOMAIN>/api/telegram/webhook&secret_token=<WEBHOOK_SECRET>
```

Use `/start`, `/help`, `/in`, and `/out`. The webhook accepts only calls with the configured Telegram secret header.

## Important

- Regenerate a Telegram bot token if it has been shared in a chat or committed anywhere.
- Add RLS policies and Supabase Auth before exposing dashboard data to staff.
- Payroll calculation is intentionally not automated until Jilid Enam's pay rules are approved.
