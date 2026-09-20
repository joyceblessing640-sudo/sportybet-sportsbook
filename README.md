# SportyBets

SportyBets is a demo sportsbook web app with a compact red-and-white sportsbook interface. Layout, density, and navigation follow common mobile sportsbook patterns. Branding, logo, and copy are original — this product is not affiliated with any third-party operator.

**18+ only. Play responsibly. Betting can be addictive.** Football fixtures, scores, and (when your plan includes them) odds come from API-Football. Other sports and cashier flows remain demo until you connect licensed providers.

## Football data (API-Football)

Set this **server-side** environment variable. Never put it in client code, HTML, or git.

```
API_FOOTBALL_KEY=your_key_here
```

Copy `.env.example` to `.env` locally. On Vercel, add `API_FOOTBALL_KEY` to the **SportyBets** project only — do not add it to a separate predictor project.

The key is read only in `lib/football/api.ts` and proxied through `/api/football/snapshot` and `/api/football/match`. Homepage Featured, Matches, Today, Next 3 Hours, and Live poll those routes. Live matches refresh about every 60 seconds; upcoming fixtures are cached longer.

Odds (1X2, O/U, DC, BTTS, and others) are loaded **per fixture**. API-Football’s date-wide odds feed is paginated across every league worldwide (65+ pages), so reading the first pages does not include Premier League or La Liga. The sportsbook never invents prices: if a fixture has no bookmaker row, those markets stay hidden.

If the key is missing or the provider is down, the sportsbook UI stays up and shows **Unable to load live matches** (or **No matches available**). Demo football rows are hidden from the production UI.

Kickoff times are formatted in **Africa/Accra**. UTC instants are converted; they are not labelled as Ghana time without conversion.

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

The demo player wallet is pre-funded so you can place tickets. Log in with **+233 240000001** / `DemoPass123!` (email `demo@sportbet.test` also works). Deposits and withdrawals stay **Pending** until an admin confirms them. The UI never marks a payment successful on its own.

Registration is a three-step Ghana mobile flow (number → demo OTP `123456` → username/password). This UI is original SportyBets software. It does not copy another operator's source code, trademarks, or licences.

## Scripts

- `npm run dev` — development server on port 43141
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
- `npm run test` — Vitest (odds, money, phone, football feed mapping)
- `npm run build` — production build
- `npm run db:setup` — push schema and seed demo fixtures

## Production notes

- Replace SQLite with Postgres (or another hosted database) before deploying to serverless hosts.
- Set `API_FOOTBALL_KEY` on the SportyBets host (not on a separate predictor project). Optional: `API_FOOTBALL_PROVIDER=rapidapi` if the key is a RapidAPI key.
- Connect a payment provider. Until then, keep `NEXT_PUBLIC_DEMO_MODE=true`.
- Put `AUTH_SECRET` in the host environment. Never store passwords in plain text. Never commit `.env`.
- Rate limits are in-memory per instance; use Redis (or similar) behind multiple replicas.
- Admins review cashier requests. Financial totals always come from the database, never from the browser.

## Responsible gaming

This software does not claim guaranteed wins, licensed status, official partnerships, or live customer counts. If you ship it as a real operator you must obtain the licences required in each market you serve.
