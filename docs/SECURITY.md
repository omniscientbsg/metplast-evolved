# Security & Launch Checklist

Pre-launch hardening for the Metplast site. Work through the **launch
blockers** before going live.

## Launch blockers (must do)

### 1. Set `NEXTAUTH_SECRET` in production
`src/app/api/auth/[...nextauth]/route.ts` falls back to a hard-coded secret if
this env var is missing. Without it set, **anyone can forge an admin session
token and skip the login entirely**.

```bash
openssl rand -base64 32   # generate a value
```
Set `NEXTAUTH_SECRET` (and `NEXTAUTH_URL=https://your-domain`) in Vercel →
Project → Settings → Environment Variables (Production).

### 2. Move off SQLite to Postgres
`prisma/schema.prisma` now targets `postgresql` via `DATABASE_URL`. SQLite on
Vercel is ephemeral — enquiries, settings, and chatbot config written in prod
do not persist. Provision a database (Vercel Postgres / Neon / Supabase), then:

```bash
# 1. Set DATABASE_URL locally and in Vercel
# 2. Create the tables
npx prisma db push
# 3. Create the admin + baseline settings (production skips demo data)
ADMIN_PASSWORD="your-strong-pass" NODE_ENV=production npm run db:seed
```
Local dev now also needs a `DATABASE_URL` (a free Neon branch works well).

### 3. Rotate the admin password
The old seed shipped a default (`Admin@123`). Credentials are now env-driven
and no password lives in the repo. Set a new one:

```bash
ADMIN_EMAIL="admin@metplast.com" ADMIN_PASSWORD="new-strong-pass" npm run db:reset-admin
```
Re-running `npm run db:seed` with a new `ADMIN_PASSWORD` also rotates it.

## What's already protected

- **Admin pages** — `src/app/admin/(dashboard)/layout.tsx` server-side session
  check redirects unauthenticated users. Settings API is session-gated.
- **Passwords** — bcrypt-hashed.
- **`/api/chat`** — per-IP rate limit (15/min) + input-size caps (max 40
  messages, 12k chars) to stop cost-DoS on the LLM key.
- **`/api/admin/enquiries`** — per-IP rate limit (6/min), honeypot field on all
  three lead forms, and per-field length caps to stop bot spam.

## Rate limiting notes

`src/lib/rate-limit.ts` is an in-memory limiter — state is per serverless
instance. It stops single-source floods and abusive loops (the common case) but
is not a hard global guarantee across many concurrent instances. To upgrade to a
strict global limit, back it with Upstash Redis (`@upstash/ratelimit`) and swap
the store in `rateLimit()`; the call sites do not need to change.

## Follow-ups (not blockers)

- The Prisma seed's demo products contain banned copy (`A-Type`, "high yield",
  "optimal egg production", "maximum broiler performance"). They are now gated
  to non-production only, so they cannot reach the live DB — but if you ever
  seed demo data, fix that copy per the content rules first.
- Consider a WAF / bot rule at the Vercel/Cloudflare layer for defense in depth.
