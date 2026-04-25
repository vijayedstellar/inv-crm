# Invensis CRM

Next.js 15 + Drizzle + Postgres + Clerk. Frontend on Vercel, Postgres on Railway.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Drizzle ORM** + **Postgres** (Railway)
- **Clerk** auth
- **Tailwind CSS**

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL + Clerk keys
npm run db:push              # create tables in Postgres
npm run dev
```

Open http://localhost:3000.

## Deploy

### 1. Postgres on Railway (one-click)
[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/postgres)

After provision: Project → Postgres → **Connect** tab → copy `DATABASE_URL`.

### 2. Frontend on Vercel
1. Import this repo at https://vercel.com/new
2. Add env vars from `.env.example` (paste Railway `DATABASE_URL`, Clerk keys)
3. Deploy

### 3. Run migrations
After first deploy, locally:
```bash
DATABASE_URL=<railway-url> npm run db:push
```

## Modules

Dashboard, Pipeline, Contacts, Leads, MQLs, SQLs, Opportunities, Accounts, Renewals, Contracts, Revenue, Tasks, Emails, Reports, Migration, Settings.
