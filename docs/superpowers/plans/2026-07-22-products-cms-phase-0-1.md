# Products CMS (Phase 0 + 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the database to MySQL and make each public page's product sections database-driven and editable in the admin (page assignment, show/hide, order, image upload), with existing content migrated in so the site looks identical.

**Architecture:** One `ProductSection` MySQL table with JSON columns maps 1:1 onto the existing `ProductSectionProps`. A pure `section-mapper` converts rows ↔ props. Public pages become server components that read sections from the DB and feed the unchanged `ScrollPageTemplate`; the hero/intro/crossLinks/page-blocks stay in code. Admin gets full CRUD + reorder + image upload behind the existing session gate.

**Tech Stack:** Next.js 16 (App Router, route handlers, server components), Prisma 5 + MySQL 8 (JSON columns), next-auth (existing session gate), vitest (new — pure-unit tests only), Docker (local MySQL + runtime).

**Design spec:** `docs/superpowers/specs/2026-07-22-products-cms-phase-0-1-design.md`

**Note on testing:** the repo has no test suite. This plan adds **vitest for the pure `section-mapper` only** (the correctness-critical, side-effect-free unit). Everything DB/HTTP/UI is verified with `npm run build`, `npx tsc --noEmit`, a local Docker MySQL round-trip, and a manual page diff — matching the project's established verification norm.

---

## File Structure

**Create:**
- `docker-compose.yml` — local MySQL 8 for development.
- `vitest.config.ts` — test runner config (alias `@` → `src`).
- `src/lib/content/section-mapper.ts` — pure row ↔ `ProductSectionProps` mapper.
- `src/lib/content/section-mapper.test.ts` — vitest unit tests.
- `src/lib/content/section-payload.ts` — shared admin-payload normalizer.
- `scripts/migrate-content.ts` — one-time content import.
- `src/app/api/admin/upload/route.ts` — image upload endpoint.
- `src/app/api/admin/products/route.ts` — list + create.
- `src/app/api/admin/products/[id]/route.ts` — update + delete.
- `src/app/api/admin/products/reorder/route.ts` — swap sort order.
- `src/app/admin/(dashboard)/products/ProductRowActions.tsx` — client row actions.
- `src/app/admin/(dashboard)/products/ProductForm.tsx` — client create/edit form.
- `src/app/admin/(dashboard)/products/new/page.tsx` — new-section page.
- `src/app/admin/(dashboard)/products/[id]/page.tsx` — edit-section page.

**Modify:**
- `prisma/schema.prisma` — provider `mysql`; add `ProductSection` model.
- `package.json` — scripts (`test`, `db:migrate-content`) + vitest dev dep.
- `.env.example` — MySQL URL + `UPLOAD_DIR`.
- `src/app/(frontend)/{layer,breeder,broiler,environmental-control,feed-silos}/page.tsx` — read sections from DB.
- `src/app/admin/(dashboard)/products/page.tsx` — list `ProductSection` grouped by page.
- `docs/SECURITY.md` — MySQL 8 + upload-volume deploy notes.

---

## Task 1: Phase 0 — MySQL datasource + local Docker MySQL

**Files:**
- Modify: `prisma/schema.prisma:1-4`
- Create: `docker-compose.yml`
- Modify: `.env.example`

- [ ] **Step 1: Switch Prisma provider to MySQL**

In `prisma/schema.prisma`, replace the datasource block:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

- [ ] **Step 2: Add a local MySQL 8 for development**

Create `docker-compose.yml`:

```yaml
services:
  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: metplast
      MYSQL_USER: metplast
      MYSQL_PASSWORD: metplastpass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

- [ ] **Step 3: Document the env vars**

In `.env.example`, replace the `DATABASE_URL` line and add `UPLOAD_DIR`:

```bash
# MySQL 8 (local Docker for dev; Hostinger managed MySQL in production).
DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"

# Where product/gallery image uploads are written. In Docker, mount a volume
# here so uploads survive redeploys. Must be under ./public to be served.
UPLOAD_DIR="./public/uploads"
```

- [ ] **Step 4: Start MySQL and push the current schema**

Run:
```bash
docker compose up -d db
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npx prisma db push
```
Expected: "Your database is now in sync with your Prisma schema." (existing tables created on MySQL).

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma docker-compose.yml .env.example
git commit -m "feat(db): switch Prisma to MySQL + local Docker MySQL"
```

---

## Task 2: `ProductSection` model

**Files:**
- Modify: `prisma/schema.prisma` (append model)

- [ ] **Step 1: Add the model**

Append to `prisma/schema.prisma`:

```prisma
model ProductSection {
  id              String   @id @default(cuid())
  page            String
  slug            String   @unique
  title           String
  badge           String?
  tag             String?
  calculatorHref  String?
  descriptions    Json
  features        Json
  benefits        Json
  specs           Json
  images          Json
  infoBlocks      Json
  topBlockKeys    Json
  bottomBlockKeys Json
  visible         Boolean  @default(true)
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([page, visible, sortOrder])
}
```

- [ ] **Step 2: Push schema + regenerate client**

Run:
```bash
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npx prisma db push
```
Expected: sync succeeds; `ProductSection` table created. (`db push` regenerates the client.)

- [ ] **Step 3: Verify the client has the model**

Run:
```bash
node -e "const {PrismaClient}=require('@prisma/client'); console.log(typeof new PrismaClient().productSection.findMany)"
```
Expected: `function`

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(db): add ProductSection model"
```

---

## Task 3: Add vitest tooling

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install vitest**

Run:
```bash
npm install -D vitest
```
Expected: vitest added to devDependencies.

- [ ] **Step 2: Create the config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Add the test script**

In `package.json` `scripts`, add:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: Verify the runner works (no tests yet)**

Run:
```bash
npm run test
```
Expected: vitest runs and reports "No test files found" (exit is fine) — confirms the runner is wired.

- [ ] **Step 5: Commit**

```bash
git add package.json vitest.config.ts package-lock.json
git commit -m "chore(test): add vitest for pure-unit tests"
```

---

## Task 4: `section-mapper` (row ↔ props) — TDD

**Files:**
- Create: `src/lib/content/section-mapper.test.ts`
- Create: `src/lib/content/section-mapper.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/content/section-mapper.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { rowToSectionProps, sectionPropsToRow, type SectionRow } from './section-mapper';
import type { ProductSectionProps } from '@/components/ProductSection';

const props: ProductSectionProps = {
  id: 'h-type-layer',
  title: 'H-Type Layer Cage System',
  badge: 'Cage System',
  tag: undefined,
  calculatorHref: '/calculators/layer',
  description: ['Line one.', 'Line two.'],
  features: ['Feature A', 'Feature B'],
  benefits: ['Benefit A'],
  specs: [{ label: 'Cage Type', value: 'H-Type' }],
  images: ['/images/layer.jpg'],
  topBlocks: [
    { type: 'info', id: 'layer-numbers', heading: 'Box Sizes', lines: ['24 in', '18 in'] },
    { type: 'upgrade-path' },
  ],
  bottomBlocks: [{ type: 'feeder-materials' }],
};

describe('section-mapper', () => {
  it('round-trips props -> row -> props', () => {
    const row = sectionPropsToRow(props, 'layer', 0, true);
    const back = rowToSectionProps(row as unknown as SectionRow);
    expect(back).toEqual(props);
  });

  it('splits info blocks into infoBlocks and keys into topBlockKeys', () => {
    const row = sectionPropsToRow(props, 'layer', 3, true);
    expect(row.infoBlocks).toEqual([{ id: 'layer-numbers', heading: 'Box Sizes', lines: ['24 in', '18 in'] }]);
    expect(row.topBlockKeys).toEqual(['upgrade-path']);
    expect(row.bottomBlockKeys).toEqual(['feeder-materials']);
    expect(row.page).toBe('layer');
    expect(row.sortOrder).toBe(3);
  });

  it('omits empty block arrays when mapping back to props', () => {
    const row = sectionPropsToRow(
      { id: 's', title: 'T', description: ['x'] } as ProductSectionProps, 'layer', 0, true,
    );
    const back = rowToSectionProps(row as unknown as SectionRow);
    expect(back.topBlocks).toBeUndefined();
    expect(back.bottomBlocks).toBeUndefined();
    expect(back.badge).toBeUndefined();
  });

  it('drops unknown block keys defensively', () => {
    const row = { slug: 's', title: 'T', badge: null, tag: null, calculatorHref: null,
      descriptions: ['x'], features: [], benefits: [], specs: [], images: [],
      infoBlocks: [], topBlockKeys: ['not-a-real-block'], bottomBlockKeys: [] } as SectionRow;
    const back = rowToSectionProps(row);
    expect(back.topBlocks).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test`
Expected: FAIL — cannot resolve `./section-mapper`.

- [ ] **Step 3: Implement the mapper**

Create `src/lib/content/section-mapper.ts`:

```ts
import type { ProductSectionProps, SpecData } from '@/components/ProductSection';
import type { PageBlock } from '@/components/blocks/types';

/** The columns of a ProductSection row this mapper reads (Json columns are unknown). */
export interface SectionRow {
  slug: string;
  title: string;
  badge: string | null;
  tag: string | null;
  calculatorHref: string | null;
  descriptions: unknown;
  features: unknown;
  benefits: unknown;
  specs: unknown;
  images: unknown;
  infoBlocks: unknown;
  topBlockKeys: unknown;
  bottomBlockKeys: unknown;
}

export interface InfoBlockData {
  id?: string;
  heading: string;
  lines: string[];
}

/** The write-shape for creating/updating a row (matches Prisma data input). */
export interface SectionRowInput {
  page: string;
  slug: string;
  title: string;
  badge: string | null;
  tag: string | null;
  calculatorHref: string | null;
  descriptions: string[];
  features: string[];
  benefits: string[];
  specs: SpecData[];
  images: string[];
  infoBlocks: InfoBlockData[];
  topBlockKeys: string[];
  bottomBlockKeys: string[];
  visible: boolean;
  sortOrder: number;
}

export const SELF_CONTAINED_BLOCKS = [
  'feeder-materials', 'auto-flush', 'customization', 'upgrade-path', 'feeding-trolley', 'lighting',
] as const;
type SelfContainedKey = (typeof SELF_CONTAINED_BLOCKS)[number];

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function asSpecs(v: unknown): SpecData[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is SpecData =>
      !!x && typeof x === 'object' &&
      typeof (x as SpecData).label === 'string' && typeof (x as SpecData).value === 'string')
    .map((x) => ({ label: x.label, value: x.value }));
}

function asInfoBlocks(v: unknown): InfoBlockData[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is InfoBlockData =>
      !!x && typeof x === 'object' && typeof (x as InfoBlockData).heading === 'string')
    .map((x) => {
      const b: InfoBlockData = { heading: x.heading, lines: asStringArray(x.lines) };
      if (typeof x.id === 'string') b.id = x.id;
      return b;
    });
}

function keysToBlocks(v: unknown): PageBlock[] {
  return asStringArray(v)
    .filter((k): k is SelfContainedKey => (SELF_CONTAINED_BLOCKS as readonly string[]).includes(k))
    .map((type) => ({ type }) as PageBlock);
}

/** DB row -> ProductSectionProps (as consumed by ScrollPageTemplate). */
export function rowToSectionProps(row: SectionRow): ProductSectionProps {
  const infoAsBlocks: PageBlock[] = asInfoBlocks(row.infoBlocks).map((b) => ({
    type: 'info' as const,
    ...(b.id ? { id: b.id } : {}),
    heading: b.heading,
    lines: b.lines,
  }));
  const topBlocks = [...infoAsBlocks, ...keysToBlocks(row.topBlockKeys)];
  const bottomBlocks = keysToBlocks(row.bottomBlockKeys);

  return {
    id: row.slug,
    title: row.title,
    ...(row.badge ? { badge: row.badge } : {}),
    ...(row.tag ? { tag: row.tag } : {}),
    ...(row.calculatorHref ? { calculatorHref: row.calculatorHref } : {}),
    description: asStringArray(row.descriptions),
    features: asStringArray(row.features),
    benefits: asStringArray(row.benefits),
    specs: asSpecs(row.specs),
    images: asStringArray(row.images),
    ...(topBlocks.length ? { topBlocks } : {}),
    ...(bottomBlocks.length ? { bottomBlocks } : {}),
  };
}

/** ProductSectionProps -> DB write input. Splits blocks into info content + keys. */
export function sectionPropsToRow(
  props: ProductSectionProps,
  page: string,
  sortOrder: number,
  visible = true,
): SectionRowInput {
  const infoBlocks: InfoBlockData[] = [];
  const topBlockKeys: string[] = [];
  for (const b of props.topBlocks ?? []) {
    if (b.type === 'info') {
      infoBlocks.push({ ...(b.id ? { id: b.id } : {}), heading: b.heading, lines: b.lines });
    } else {
      topBlockKeys.push(b.type);
    }
  }
  const bottomBlockKeys = (props.bottomBlocks ?? [])
    .filter((b) => b.type !== 'info')
    .map((b) => b.type);

  return {
    page,
    slug: props.id,
    title: props.title,
    badge: props.badge ?? null,
    tag: props.tag ?? null,
    calculatorHref: props.calculatorHref ?? null,
    descriptions: props.description ?? [],
    features: props.features ?? [],
    benefits: props.benefits ?? [],
    specs: props.specs ?? [],
    images: props.images ?? [],
    infoBlocks,
    topBlockKeys,
    bottomBlockKeys,
    visible,
    sortOrder,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test`
Expected: PASS — 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/content/section-mapper.ts src/lib/content/section-mapper.test.ts
git commit -m "feat(cms): section-mapper (row <-> ProductSectionProps) with tests"
```

---

## Task 5: Content migration script

**Files:**
- Create: `scripts/migrate-content.ts`
- Modify: `package.json` (add `db:migrate-content`)

- [ ] **Step 1: Write the migration script**

Create `scripts/migrate-content.ts`:

```ts
import { PrismaClient } from '@prisma/client';
import { sectionPropsToRow } from '../src/lib/content/section-mapper';
import { layerConfig } from '../src/lib/content/layer';
import { breederConfig } from '../src/lib/content/breeder';
import { broilerConfig } from '../src/lib/content/broiler';
import { environmentalControlConfig } from '../src/lib/content/environmental-control';
import { feedSilosConfig } from '../src/lib/content/feed-silos';

const prisma = new PrismaClient();

const PAGES = [
  { page: 'layer', sections: layerConfig.sections },
  { page: 'breeder', sections: breederConfig.sections },
  { page: 'broiler', sections: broilerConfig.sections },
  { page: 'environmental-control', sections: environmentalControlConfig.sections },
  { page: 'feed-silos', sections: feedSilosConfig.sections },
];

async function main() {
  for (const { page, sections } of PAGES) {
    for (let i = 0; i < sections.length; i++) {
      const row = sectionPropsToRow(sections[i], page, i, true);
      await prisma.productSection.upsert({
        where: { slug: row.slug },
        update: row,
        create: row,
      });
      console.log(`✓ ${page}/${row.slug} (order ${i})`);
    }
  }
  const total = await prisma.productSection.count();
  console.log(`Done. ${total} sections in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, add:

```json
    "db:migrate-content": "tsx scripts/migrate-content.ts"
```

- [ ] **Step 3: Run the migration**

Run:
```bash
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npm run db:migrate-content
```
Expected: a `✓ layer/...` line per section across all five pages, then `Done. N sections in DB.` with N ≥ 15.

- [ ] **Step 4: Verify idempotency (re-run does not duplicate)**

Run:
```bash
npm run db:migrate-content
node -e "const {PrismaClient}=require('@prisma/client');new PrismaClient().productSection.groupBy({by:['slug'],_count:true,having:{slug:{_count:{gt:1}}}}).then(r=>{console.log('dupes:',r.length);process.exit(0)})"
```
Expected: `dupes: 0`

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-content.ts package.json
git commit -m "feat(cms): one-time content migration into ProductSection"
```

---

## Task 6: Switch the layer page to DB-driven (proof)

**Files:**
- Modify: `src/app/(frontend)/layer/page.tsx`

- [ ] **Step 1: Rewrite the layer page as an async server component**

Replace the whole body of `src/app/(frontend)/layer/page.tsx` with:

```tsx
import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { layerConfig } from '@/lib/content/layer';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';

export const metadata = {
  title: 'Layer Cage Solutions | Metplast Industries',
  description: 'H-Type and S-Frame layer cage systems engineered for uniform feed access, clean egg handling, stronger cage life, and consistent layer production.',
};

export const dynamic = 'force-dynamic';

export default async function LayerPage() {
  let sections = layerConfig.sections;
  try {
    const rows = await prisma.productSection.findMany({
      where: { page: 'layer', visible: true },
      orderBy: { sortOrder: 'asc' },
    });
    // Fall back to the code config if the DB has not been migrated yet, so the
    // page is never blank during cutover.
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
  } catch (err) {
    console.error('layer sections query failed, using code config:', err);
  }

  const config: PageConfig = { ...layerConfig, sections };
  return <ScrollPageTemplate config={config} />;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Build**

Run:
```bash
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npm run build
```
Expected: "Compiled successfully". `/layer` shows as `ƒ` (dynamic) in the route table.

- [ ] **Step 4: Manual render check**

Run (with MySQL up and migrated):
```bash
npm run build && npm run start &
sleep 4
curl -s http://localhost:3000/layer | grep -c "H-Type"
kill %1
```
Expected: count ≥ 1 (the H-Type section title rendered from DB). Visually confirm `/layer` matches the current live page (sections, order, blocks, specs).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/layer/page.tsx"
git commit -m "feat(cms): render layer page sections from the database"
```

---

## Task 7: Switch the remaining four pages to DB-driven

**Files:**
- Modify: `src/app/(frontend)/breeder/page.tsx`
- Modify: `src/app/(frontend)/broiler/page.tsx`
- Modify: `src/app/(frontend)/environmental-control/page.tsx`
- Modify: `src/app/(frontend)/feed-silos/page.tsx`

Each file uses the identical pattern as Task 6. For each, **keep the file's existing `metadata` export unchanged**, add the four imports, add `export const dynamic = 'force-dynamic'`, and make the default export async with the DB query. The only differences per file are the config import name and the `page` string.

- [ ] **Step 1: Breeder** — edit `src/app/(frontend)/breeder/page.tsx`. Keep its `metadata`. Set body to:

```tsx
import React from 'react';
import { ScrollPageTemplate, PageConfig } from '@/components/ScrollPageTemplate';
import { breederConfig } from '@/lib/content/breeder';
import prisma from '@/lib/prisma';
import { rowToSectionProps, type SectionRow } from '@/lib/content/section-mapper';

// keep the existing `export const metadata = { ... }` block from the file

export const dynamic = 'force-dynamic';

export default async function BreederPage() {
  let sections = breederConfig.sections;
  try {
    const rows = await prisma.productSection.findMany({
      where: { page: 'breeder', visible: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (rows.length > 0) sections = rows.map((r) => rowToSectionProps(r as unknown as SectionRow));
  } catch (err) {
    console.error('breeder sections query failed, using code config:', err);
  }
  const config: PageConfig = { ...breederConfig, sections };
  return <ScrollPageTemplate config={config} />;
}
```

- [ ] **Step 2: Broiler** — same pattern in `src/app/(frontend)/broiler/page.tsx`: import `broilerConfig`, function `BroilerPage`, `page: 'broiler'`, fallback `broilerConfig.sections`, log prefix `broiler`.

- [ ] **Step 3: Environmental control** — same in `src/app/(frontend)/environmental-control/page.tsx`: import `environmentalControlConfig`, function `EnvironmentalControlPage`, `page: 'environmental-control'`, fallback `environmentalControlConfig.sections`, log prefix `environmental-control`.

- [ ] **Step 4: Feed silos** — same in `src/app/(frontend)/feed-silos/page.tsx`: import `feedSilosConfig`, function `FeedSilosPage`, `page: 'feed-silos'`, fallback `feedSilosConfig.sections`, log prefix `feed-silos`.

- [ ] **Step 5: Typecheck + build**

Run:
```bash
npx tsc --noEmit
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npm run build
```
Expected: 0 type errors; build compiles; all four routes show `ƒ`.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(frontend)/breeder/page.tsx" "src/app/(frontend)/broiler/page.tsx" "src/app/(frontend)/environmental-control/page.tsx" "src/app/(frontend)/feed-silos/page.tsx"
git commit -m "feat(cms): render remaining product pages from the database"
```

---

## Task 8: Image upload endpoint

**Files:**
- Create: `src/app/api/admin/upload/route.ts`

- [ ] **Step 1: Write the upload route**

Create `src/app/api/admin/upload/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 5 MB)' }, { status: 413 });
  }

  const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), bytes);

  return NextResponse.json({ path: `/uploads/${name}` }, { status: 201 });
}
```

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build` (with `DATABASE_URL` exported).
Expected: 0 errors; `/api/admin/upload` appears as `ƒ`.

- [ ] **Step 3: Verify auth gate**

Run:
```bash
npm run start &
sleep 4
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/admin/upload
kill %1
```
Expected: `401` (unauthenticated upload rejected).

- [ ] **Step 4: Commit**

```bash
git add "src/app/api/admin/upload/route.ts"
git commit -m "feat(cms): session-gated image upload endpoint"
```

---

## Task 9: Products CRUD + reorder APIs

**Files:**
- Create: `src/lib/content/section-payload.ts`
- Create: `src/app/api/admin/products/route.ts`
- Create: `src/app/api/admin/products/[id]/route.ts`
- Create: `src/app/api/admin/products/reorder/route.ts`

- [ ] **Step 1: Shared payload normalizer**

Create `src/lib/content/section-payload.ts`:

```ts
import type { SpecData } from '@/components/ProductSection';
import type { InfoBlockData } from '@/lib/content/section-mapper';

export interface SectionPayload {
  page?: string;
  slug?: string;
  title?: string;
  badge?: string | null;
  tag?: string | null;
  calculatorHref?: string | null;
  descriptions?: string[];
  features?: string[];
  benefits?: string[];
  specs?: SpecData[];
  images?: string[];
  infoBlocks?: InfoBlockData[];
  topBlockKeys?: string[];
  bottomBlockKeys?: string[];
  visible?: boolean;
  sortOrder?: number;
}

/** Coerce an admin request body into a full Prisma data object with safe defaults. */
export function normalizeSectionPayload(b: SectionPayload) {
  return {
    page: b.page ?? '',
    slug: b.slug ?? '',
    title: b.title ?? '',
    badge: b.badge ?? null,
    tag: b.tag ?? null,
    calculatorHref: b.calculatorHref ?? null,
    descriptions: b.descriptions ?? [],
    features: b.features ?? [],
    benefits: b.benefits ?? [],
    specs: b.specs ?? [],
    images: b.images ?? [],
    infoBlocks: b.infoBlocks ?? [],
    topBlockKeys: b.topBlockKeys ?? [],
    bottomBlockKeys: b.bottomBlockKeys ?? [],
    visible: b.visible ?? true,
    sortOrder: b.sortOrder ?? 0,
  };
}
```

- [ ] **Step 2: List + create route**

Create `src/app/api/admin/products/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { normalizeSectionPayload, type SectionPayload } from '@/lib/content/section-payload';

async function authed() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const items = await prisma.productSection.findMany({
    orderBy: [{ page: 'asc' }, { sortOrder: 'asc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const body = (await req.json()) as SectionPayload;
  if (!body.page || !body.slug || !body.title) {
    return NextResponse.json({ error: 'page, slug and title are required' }, { status: 400 });
  }
  try {
    const created = await prisma.productSection.create({ data: normalizeSectionPayload(body) });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'slug already exists' }, { status: 409 });
    }
    console.error('create section failed:', e);
    return NextResponse.json({ error: 'Could not create section' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Update + delete route**

Create `src/app/api/admin/products/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { normalizeSectionPayload, type SectionPayload } from '@/lib/content/section-payload';

async function authed() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const body = (await req.json()) as SectionPayload;
  if (!body.page || !body.slug || !body.title) {
    return NextResponse.json({ error: 'page, slug and title are required' }, { status: 400 });
  }
  try {
    const updated = await prisma.productSection.update({
      where: { id },
      data: normalizeSectionPayload(body),
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'slug already exists' }, { status: 409 });
    }
    console.error('update section failed:', e);
    return NextResponse.json({ error: 'Could not update section' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  await prisma.productSection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Reorder route**

Create `src/app/api/admin/products/reorder/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id, direction } = (await req.json()) as { id?: string; direction?: 'up' | 'down' };
  if (!id || (direction !== 'up' && direction !== 'down')) {
    return NextResponse.json({ error: 'id and direction (up|down) are required' }, { status: 400 });
  }

  const current = await prisma.productSection.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const neighbor = await prisma.productSection.findFirst({
    where: {
      page: current.page,
      sortOrder: direction === 'up' ? { lt: current.sortOrder } : { gt: current.sortOrder },
    },
    orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
  });
  if (!neighbor) return NextResponse.json({ ok: true, moved: false });

  await prisma.$transaction([
    prisma.productSection.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.productSection.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  return NextResponse.json({ ok: true, moved: true });
}
```

- [ ] **Step 5: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build` (with `DATABASE_URL` exported).
Expected: 0 errors; `/api/admin/products`, `/api/admin/products/[id]`, `/api/admin/products/reorder` all appear as `ƒ`.

- [ ] **Step 6: Verify auth gate**

Run:
```bash
npm run start &
sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/products
kill %1
```
Expected: `401`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/content/section-payload.ts "src/app/api/admin/products"
git commit -m "feat(cms): product-section CRUD + reorder APIs"
```

---

## Task 10: Admin list page (grouped, reorder, delete)

**Files:**
- Modify: `src/app/admin/(dashboard)/products/page.tsx`
- Create: `src/app/admin/(dashboard)/products/ProductRowActions.tsx`

- [ ] **Step 1: Client row-actions component**

Create `src/app/admin/(dashboard)/products/ProductRowActions.tsx`:

```tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProductRowActions({
  id,
  isFirst,
  isLast,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function move(direction: 'up' | 'down') {
    setBusy(true);
    await fetch('/api/admin/products/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, direction }),
    });
    setBusy(false);
    router.refresh();
  }

  async function del() {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    setBusy(true);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-3">
      <button disabled={busy || isFirst} onClick={() => move('up')}
        className="text-white/50 hover:text-white disabled:opacity-20 text-lg leading-none">↑</button>
      <button disabled={busy || isLast} onClick={() => move('down')}
        className="text-white/50 hover:text-white disabled:opacity-20 text-lg leading-none">↓</button>
      <Link href={`/admin/products/${id}`}
        className="text-white/50 hover:text-white text-sm font-medium">Edit</Link>
      <button disabled={busy} onClick={del}
        className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite the list page**

Replace `src/app/admin/(dashboard)/products/page.tsx` with:

```tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ProductRowActions } from './ProductRowActions';

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage() {
  const sections = await prisma.productSection.findMany({
    orderBy: [{ page: 'asc' }, { sortOrder: 'asc' }],
  });

  const byPage: Record<string, typeof sections> = {};
  for (const s of sections) (byPage[s.page] ??= []).push(s);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Products</h1>
          <p className="text-white/60 mt-1">Sections shown on each public page. Reorder with the arrows.</p>
        </div>
        <Link href="/admin/products/new"
          className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">
          Add Section
        </Link>
      </div>

      {Object.keys(byPage).length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/50">
          No sections yet. Run <code>npm run db:migrate-content</code> or add one.
        </div>
      )}

      {Object.entries(byPage).map(([page, rows]) => (
        <div key={page} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-black/20 text-white/70 text-sm font-bold uppercase tracking-wider">
            {page}
          </div>
          <table className="w-full text-left border-collapse">
            <tbody>
              {rows.map((s, i) => (
                <tr key={s.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-bold text-white">{s.title}</div>
                    <div className="text-xs text-white/50">/{s.slug}{!s.visible && ' · hidden'}</div>
                  </td>
                  <td className="p-4 text-right">
                    <ProductRowActions id={s.id} isFirst={i === 0} isLast={i === rows.length - 1} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build` (with `DATABASE_URL` exported).
Expected: 0 errors; build compiles.

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(dashboard)/products/page.tsx" "src/app/admin/(dashboard)/products/ProductRowActions.tsx"
git commit -m "feat(cms): admin product list with reorder + delete"
```

---

## Task 11: Admin create/edit form + image upload UI

**Files:**
- Create: `src/app/admin/(dashboard)/products/ProductForm.tsx`
- Create: `src/app/admin/(dashboard)/products/new/page.tsx`
- Create: `src/app/admin/(dashboard)/products/[id]/page.tsx`

- [ ] **Step 1: The form component**

Create `src/app/admin/(dashboard)/products/ProductForm.tsx`:

```tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SELF_CONTAINED_BLOCKS } from '@/lib/content/section-mapper';

const PAGES = ['layer', 'breeder', 'broiler', 'environmental-control', 'feed-silos'];

interface Spec { label: string; value: string }
interface InfoBlock { id?: string; heading: string; lines: string[] }

export interface ProductFormValues {
  page: string;
  slug: string;
  title: string;
  badge: string;
  tag: string;
  calculatorHref: string;
  descriptions: string[];
  features: string[];
  benefits: string[];
  specs: Spec[];
  images: string[];
  infoBlocks: InfoBlock[];
  topBlockKeys: string[];
  bottomBlockKeys: string[];
  visible: boolean;
  sortOrder: number;
}

const EMPTY: ProductFormValues = {
  page: 'layer', slug: '', title: '', badge: '', tag: '', calculatorHref: '',
  descriptions: [], features: [], benefits: [], specs: [], images: [],
  infoBlocks: [], topBlockKeys: [], bottomBlockKeys: [], visible: true, sortOrder: 0,
};

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function ProductForm({
  mode,
  id,
  initial,
}: {
  mode: 'create' | 'edit';
  id?: string;
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function toggleKey(field: 'topBlockKeys' | 'bottomBlockKeys', key: string) {
    setV((p) => {
      const has = p[field].includes(key);
      return { ...p, [field]: has ? p[field].filter((k) => k !== key) : [...p[field], key] };
    });
  }

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      setError('Image upload failed.');
      return;
    }
    const { path } = await res.json();
    set('images', [...v.images, path]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || 'Save failed.');
      return;
    }
    router.push('/admin/products');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-8 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {mode === 'create' ? 'Add Section' : 'Edit Section'}
        </h1>
        <button type="submit" disabled={saving}
          className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Page</label>
          <select className={input} value={v.page} onChange={(e) => set('page', e.target.value)}>
            {PAGES.map((p) => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Slug (unique)</label>
          <input className={input} value={v.slug} onChange={(e) => set('slug', e.target.value)} placeholder="h-type-layer" />
        </div>
      </div>

      <div>
        <label className={label}>Title</label>
        <input className={input} value={v.title} onChange={(e) => set('title', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Badge (optional)</label>
          <input className={input} value={v.badge} onChange={(e) => set('badge', e.target.value)} />
        </div>
        <div>
          <label className={label}>Tag (optional)</label>
          <input className={input} value={v.tag} onChange={(e) => set('tag', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Calculator Href (optional)</label>
          <input className={input} value={v.calculatorHref} onChange={(e) => set('calculatorHref', e.target.value)} placeholder="/calculators/layer" />
        </div>
        <div>
          <label className={label}>Order</label>
          <input type="number" className={input} value={v.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
        </div>
      </div>

      <label className="flex items-center gap-3 text-white/80">
        <input type="checkbox" checked={v.visible} onChange={(e) => set('visible', e.target.checked)} />
        Visible on the public page
      </label>

      <StringList title="Description lines" items={v.descriptions} onChange={(x) => set('descriptions', x)} />
      <StringList title="Features" items={v.features} onChange={(x) => set('features', x)} />
      <StringList title="Benefits" items={v.benefits} onChange={(x) => set('benefits', x)} />

      <SpecList specs={v.specs} onChange={(x) => set('specs', x)} />
      <InfoBlockList blocks={v.infoBlocks} onChange={(x) => set('infoBlocks', x)} />

      <div>
        <label className={label}>Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {v.images.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-24 h-24 object-cover rounded-lg border border-white/10" />
              <button type="button" onClick={() => set('images', v.images.filter((_, j) => j !== i))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }}
          className="text-white/70 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <BlockPicker title="Top blocks" selected={v.topBlockKeys} onToggle={(k) => toggleKey('topBlockKeys', k)} />
        <BlockPicker title="Bottom blocks" selected={v.bottomBlockKeys} onToggle={(k) => toggleKey('bottomBlockKeys', k)} />
      </div>
    </form>
  );
}

function StringList({ title, items, onChange }: { title: string; items: string[]; onChange: (x: string[]) => void }) {
  return (
    <div>
      <label className={label}>{title}</label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className={input} value={it}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-red-400 px-2">×</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ''])}
          className="text-primary text-sm font-bold">+ Add</button>
      </div>
    </div>
  );
}

function SpecList({ specs, onChange }: { specs: Spec[]; onChange: (x: Spec[]) => void }) {
  return (
    <div>
      <label className={label}>Specs (label / value)</label>
      <div className="space-y-2">
        {specs.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input className={input} placeholder="Label" value={s.label}
              onChange={(e) => onChange(specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <input className={input} placeholder="Value" value={s.value}
              onChange={(e) => onChange(specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
            <button type="button" onClick={() => onChange(specs.filter((_, j) => j !== i))}
              className="text-red-400 px-2">×</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...specs, { label: '', value: '' }])}
          className="text-primary text-sm font-bold">+ Add spec</button>
      </div>
    </div>
  );
}

function InfoBlockList({ blocks, onChange }: { blocks: InfoBlock[]; onChange: (x: InfoBlock[]) => void }) {
  return (
    <div>
      <label className={label}>Info blocks (heading + lines, shown above the grid)</label>
      <div className="space-y-4">
        {blocks.map((b, i) => (
          <div key={i} className="border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex gap-2">
              <input className={input} placeholder="Heading" value={b.heading}
                onChange={(e) => onChange(blocks.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)))} />
              <button type="button" onClick={() => onChange(blocks.filter((_, j) => j !== i))}
                className="text-red-400 px-2">×</button>
            </div>
            <StringList title="Lines" items={b.lines}
              onChange={(lines) => onChange(blocks.map((x, j) => (j === i ? { ...x, lines } : x)))} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...blocks, { heading: '', lines: [] }])}
          className="text-primary text-sm font-bold">+ Add info block</button>
      </div>
    </div>
  );
}

function BlockPicker({ title, selected, onToggle }: { title: string; selected: string[]; onToggle: (k: string) => void }) {
  return (
    <div>
      <label className={label}>{title}</label>
      <div className="space-y-1">
        {SELF_CONTAINED_BLOCKS.map((k) => (
          <label key={k} className="flex items-center gap-2 text-white/80 text-sm">
            <input type="checkbox" checked={selected.includes(k)} onChange={() => onToggle(k)} />
            {k}
          </label>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: New-section page**

Create `src/app/admin/(dashboard)/products/new/page.tsx`:

```tsx
import { ProductForm } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  return <ProductForm mode="create" />;
}
```

- [ ] **Step 3: Edit-section page**

Create `src/app/admin/(dashboard)/products/[id]/page.tsx`:

```tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductForm, type ProductFormValues } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.productSection.findUnique({ where: { id } });
  if (!s) notFound();

  const initial: ProductFormValues = {
    page: s.page,
    slug: s.slug,
    title: s.title,
    badge: s.badge ?? '',
    tag: s.tag ?? '',
    calculatorHref: s.calculatorHref ?? '',
    descriptions: (s.descriptions as string[]) ?? [],
    features: (s.features as string[]) ?? [],
    benefits: (s.benefits as string[]) ?? [],
    specs: (s.specs as { label: string; value: string }[]) ?? [],
    images: (s.images as string[]) ?? [],
    infoBlocks: (s.infoBlocks as { id?: string; heading: string; lines: string[] }[]) ?? [],
    topBlockKeys: (s.topBlockKeys as string[]) ?? [],
    bottomBlockKeys: (s.bottomBlockKeys as string[]) ?? [],
    visible: s.visible,
    sortOrder: s.sortOrder,
  };

  return <ProductForm mode="edit" id={s.id} initial={initial} />;
}
```

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build` (with `DATABASE_URL` exported).
Expected: 0 errors; `/admin/products/new` and `/admin/products/[id]` compile.

- [ ] **Step 5: Manual admin round-trip**

With MySQL up + migrated, `npm run start`, log in at `/admin/login`, then:
1. `/admin/products` → groups show all pages with sections.
2. Open a section → Edit → change a feature → Save → confirm it changed on the public page.
3. Add a new section on `layer`, upload an image, set order, Save → appears on `/layer`.
4. Reorder with arrows → order changes on `/layer`. Hide → disappears from `/layer`.

- [ ] **Step 6: Commit**

```bash
git add "src/app/admin/(dashboard)/products/ProductForm.tsx" "src/app/admin/(dashboard)/products/new/page.tsx" "src/app/admin/(dashboard)/products/[id]/page.tsx"
git commit -m "feat(cms): admin create/edit section form with image upload"
```

---

## Task 12: Final verification + deploy docs

**Files:**
- Modify: `docs/SECURITY.md`

- [ ] **Step 1: Add MySQL + upload-volume deploy notes**

Under the "Launch blockers" section of `docs/SECURITY.md`, append:

```markdown
### 4. MySQL 8 + persistent upload volume (Docker/Hostinger)
- The app now uses **MySQL 8** (JSON columns require 8.x). Point `DATABASE_URL`
  at the Hostinger managed MySQL. Confirm the version is 8.x.
- Product/gallery images are written to `UPLOAD_DIR` (default `./public/uploads`).
  In Docker, **mount a persistent volume** at `/app/public/uploads` or uploaded
  images vanish on redeploy.
- Deploy order: `prisma db push` → `npm run db:migrate-content` (first deploy
  only) → start the app. The public pages fall back to the in-code content until
  the migration has run, so the site is never blank mid-cutover.
```

- [ ] **Step 2: Full verification suite**

Run:
```bash
npm run test
npx tsc --noEmit
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npm run build
```
Expected: mapper tests pass; 0 type errors; build compiles all routes.

- [ ] **Step 3: Banned-term grep (no-overclaim rule)**

Run:
```bash
grep -rniE "battery cage|a-frame|a-type|pyramid|97% yield|275 gsm|maximum hatchability|cutting-edge" src --include=*.ts --include=*.tsx | grep -v "page.tsx.bak"
```
Expected: no matches (migrated content preserves the cleaned copy).

- [ ] **Step 4: Commit**

```bash
git add docs/SECURITY.md
git commit -m "docs: MySQL 8 + upload-volume deploy notes"
```

---

## Self-Review notes (for the implementer)

- **`info` blocks** are content, stored in `infoBlocks`, and re-assembled ahead of keyed top blocks at render — this preserves the layer/breeder box-dimension notes exactly.
- **Cutover safety:** every public page falls back to its in-code `sections` if the DB is empty or errors, so deploying the code before running the migration cannot blank the site.
- **`descriptions` (column) → `description` (props)** naming is handled only inside `section-mapper`; nothing else touches the difference.
- **Legacy `Product` model** is intentionally left in place (used by the old dummy `/products/[slug]` route); it is not `ProductSection` and is out of scope here.
- **Page-level blocks / hero / intro / crossLinks** remain in the code config objects — Phase 3.
- **Prisma `Json` input typing (likely tsc snag in Tasks 5 & 9):** passing named-interface arrays (`SpecData[]`, `InfoBlockData[]`) into a Prisma `Json` column can trip strict TS ("not assignable to `InputJsonValue`") because interfaces lack an index signature. If `npx tsc --noEmit` flags the `data:` object in the migration upsert or the CRUD create/update, fix it by casting just those fields, e.g. `specs: (row.specs as unknown) as Prisma.InputJsonValue` (import `import { Prisma } from '@prisma/client'`), or wrap the whole data object `data: normalizeSectionPayload(body) as Prisma.ProductSectionCreateInput`. Primitive arrays (`string[]`) are unaffected. This is a known Prisma+TS quirk, not a logic error.
