# SPORTBET

SPORTBET is a demo sportsbook web app with a red-and-white production-style interface. Layout and navigation follow modern betting apps. Branding, logo, and copy are original — this product is not affiliated with any third-party operator.

**18+ only. Play responsibly. Betting can be addictive.** Matches, odds, balances, and payments in this repository are **demo data** unless you connect a real sports feed and payment provider.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (switch `DATABASE_URL` to Postgres for production)
- Cookie sessions (HMAC JWT) with bcrypt password hashing
- Server-side stake, odds, and wallet math

## Run locally

```bash
cp .env.example .env
# set AUTH_SECRET to a long random string
npm install
npx prisma generate
npm run db:setup
npm run dev
```

The app listens on [http://127.0.0.1:43141](http://127.0.0.1:43141).

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Player | demo@sportbet.test | DemoPass123! |
| Admin | admin@sportbet.test | AdminPass123! |
| Sub-admin | subadmin@sportbet.test | SubAdmin123! |

The demo player wallet is pre-funded so you can place tickets. Deposits and withdrawals stay **Pending** until an admin confirms them. The UI never marks a payment successful on its own.

## Scripts

- `npm run dev` — development server on port 43141
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
- `npm run test` — Vitest (odds/money/phone validation)
- `npm run build` — production build
- `npm run db:setup` — push schema and seed demo fixtures

## Production notes

- Replace SQLite with Postgres (or another hosted database) before deploying to serverless hosts.
- Connect a licensed odds feed and a payment provider. Until then, keep `NEXT_PUBLIC_DEMO_MODE=true`.
- Put `AUTH_SECRET` in the host environment. Never store passwords in plain text.
- Rate limits are in-memory per instance; use Redis (or similar) behind multiple replicas.
- Admins review cashier requests. Financial totals always come from the database, never from the browser.

## Responsible gaming

This software does not claim guaranteed wins, licensed status, official partnerships, or live customer counts. If you ship it as a real operator you must obtain the licences required in each market you serve.
