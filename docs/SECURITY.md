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
Set `NEXTAUTH_SECRET` (and `NEXTAUTH_URL=https://your-domain`) in the production
environment (Hostinger panel / the Docker container's env, e.g. compose
`environment:` or an `--env-file`).

### 2. Use managed MySQL 8 — not SQLite
`prisma/schema.prisma` targets `mysql` via `DATABASE_URL`. SQLite is not viable in
a container (ephemeral filesystem) — enquiries, settings, chatbot config, and the
CMS product sections would not persist. Point `DATABASE_URL` at the Hostinger
managed MySQL (must be **8.x** — the CMS uses JSON columns). Then:

```bash
# 1. Set DATABASE_URL (locally: docker compose up -d db uses the bundled MySQL 8)
# 2. Create the tables
npx prisma db push
# 3. Create the admin + baseline settings (production skips demo data)
ADMIN_PASSWORD="your-strong-pass" NODE_ENV=production npm run db:seed
# 4. FIRST DEPLOY ONLY: import the existing content into the DB
npm run db:migrate-content   # product sections
npm run db:migrate-gallery   # gallery categories + images
npm run db:migrate-pages     # page hero / intro / cross-links (all 8 pages)
```
Local dev needs a `DATABASE_URL` too — `docker compose up -d db` starts a local
MySQL 8 matching the bundled `docker-compose.yml`.

### 3. Rotate the admin password
The old seed shipped a default (`Admin@123`). Credentials are now env-driven
and no password lives in the repo. Set a new one:

```bash
ADMIN_EMAIL="admin@metplast.com" ADMIN_PASSWORD="new-strong-pass" npm run db:reset-admin
```
Re-running `npm run db:seed` with a new `ADMIN_PASSWORD` also rotates it.

### 4. Persistent upload volume (Docker)
CMS image uploads are written to `UPLOAD_DIR` (default `./public/uploads`) and
served by Next at `/uploads/...`. In Docker, **mount a persistent volume** at
`/app/public/uploads` (or set `UPLOAD_DIR` to a mounted path under `public/`) or
uploaded images vanish on every redeploy.

## What's already protected

- **Admin pages** — `src/app/admin/(dashboard)/layout.tsx` server-side session
  check redirects unauthenticated users. Settings API is session-gated.
- **Passwords** — bcrypt-hashed.
- **`/api/chat`** — per-IP rate limit (15/min) + input-size caps (max 40
  messages, 12k chars) to stop cost-DoS on the LLM key.
- **`/api/admin/enquiries`** — per-IP rate limit (6/min), honeypot field on all
  three lead forms, and per-field length caps to stop bot spam.
- **CMS admin** — the product-section CRUD (`/api/admin/products`, `/[id]`,
  `/reorder`), the gallery CRUD (`/api/admin/gallery*`, including `/categories*`),
  the blog CRUD (`/api/admin/blogs*`, including `/categories*`), the page-content
  API (`/api/admin/pages/[page]`, hero/intro/cross-links), the site-settings
  `PUT /api/admin/settings` (allowlisted to the `SITE_SETTING_KEYS` registry, so
  it can never overwrite chatbot or other keys), the homepage-content
  `PUT /api/admin/home` (normalized through `parseHomeContent` before storing the
  `home_content` JSON), the housing-content `PUT /api/admin/housing` (same pattern
  via `parseHousingContent`), the about-content `PUT /api/admin/about` (same
  pattern via `parseAboutContent`), the contact/calculators copy
  `PUT /api/admin/misc` (same pattern via `parseMiscContent`), and image upload
  (`/api/admin/upload`) all require a valid session (401 otherwise); upload also
  validates MIME type and a 5 MB size cap.

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
- Consider a WAF / bot rule at the Cloudflare/host layer for defense in depth.
- CMS-edited content is NOT auto-checked against the no-overclaim content rules
  (no banned-term gate on admin writes) — reviewers must keep honoring them when
  editing product sections, gallery captions, blog posts, page content
  (hero / intro / cross-links via `/admin/pages`), site settings
  (tagline / footer blurb / SEO via `/admin/settings`), homepage content
  (feature cards / CTA / all sections via `/admin/home`), housing content
  (system components / farm types / project steps via `/admin/housing`), about
  content (story / stats / values via `/admin/about`), and contact/calculators
  copy (hero / CTA / enquiry via `/admin/misc`) in the admin.
- The pre-existing `POST /api/admin/settings` (used by the chatbot admin page)
  is session-gated but NOT key-allowlisted — an authenticated admin can write
  arbitrary `Setting` keys through it. Low risk (admin-only), but the newer
  `PUT` is the allowlisted path; consider allowlisting the `POST` too.
- `src/app/(frontend)/layout.tsx` is `force-dynamic` so site-settings edits
  reflect immediately — this opts the whole marketing subtree out of static
  generation (most pages were already dynamic from the products/page CMS, so the
  marginal cost is the previously-static pages). To restore static/ISR while
  keeping settings fresh, wrap `getSiteSettings()` in `unstable_cache` with a
  `'site-settings'` tag and call `revalidateTag('site-settings')` in the settings
  `PUT` handler, then drop `force-dynamic`. Deferred optimization, not a blocker.
- The rate limiter is in-memory; on a single Docker container that is effectively
  per-process (fine for one instance). If you scale to multiple app containers,
  move it to a shared store (Upstash/Redis) as noted above.
- Blog post content is rich HTML from a WYSIWYG editor. It is **sanitized
  server-side on write** (`src/lib/content/sanitize-post.ts`, allowlist —
  strips scripts, `on*` handlers, unsafe URL schemes) so the DB only stores
  clean HTML; the public post page renders it via `dangerouslySetInnerHTML`.
  Blog copy is NOT auto-checked against the no-overclaim content rules —
  reviewers must keep honoring them when writing posts.
