# Gallery CMS (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the gallery database-driven and editable in the admin — managed categories (add/rename/reorder/delete) assigned to uploaded images, plus caption/video/featured/visible/order — with the public gallery rendering from the DB and looking identical after a one-time content migration.

**Architecture:** Two MySQL tables (`GalleryCategory`, `GalleryItem` with a nullable `onDelete: SetNull` FK). A thin `gallery-view` mapper flattens rows for the client. The public `gallery/page.tsx` becomes a server component that fetches + falls back to code, passing data to the existing client UI (`GalleryClient`). Admin gets item CRUD + category management, reusing the Phase-1 upload endpoint, reorder-by-swap, and append-on-create patterns.

**Tech Stack:** Next.js 16 (App Router, route handlers, server components), Prisma 5 + MySQL 8, next-auth session gate, vitest (mapper unit test), the existing `/api/admin/upload` endpoint.

**Design spec:** `docs/superpowers/specs/2026-07-22-gallery-cms-phase-2-design.md`

**Note on testing:** repo has no full test suite. vitest covers the pure `gallery-view` mapper; everything else is verified via `npm run build`, `npx tsc --noEmit`, a local MySQL round-trip, and a manual page diff — matching the project norm.

**Standing context for every task:**
- Repo `c:/Users/Admin/Documents/Metpalst Next.js`; branch `nextjs-website` (commit here, not master). Use the Bash tool (Git Bash).
- MySQL 8 runs in Docker; export `DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"` before any `prisma`/`build` command. A local `.env` also has it.
- Do NOT start a persistent dev server. Hard gates are `npx tsc --noEmit` + `npm run build` unless a task says otherwise. Port 3000/3001 may be occupied by unrelated projects.
- Windows: if a build hits `EPERM ... query_engine-windows.dll.node`, no dev server should hold it — retry once.

---

## File Structure

**Create:**
- `src/app/(frontend)/gallery/gallery-fallback.ts` — the current hardcoded items + categories (fallback + migration source).
- `src/lib/content/gallery-view.ts` — pure row→view mapper.
- `src/lib/content/gallery-view.test.ts` — vitest test.
- `src/app/(frontend)/gallery/GalleryClient.tsx` — the interactive UI (moved out of page.tsx), props-driven.
- `scripts/migrate-gallery.ts` — one-time content import.
- `src/app/api/admin/gallery/route.ts` — item list + create.
- `src/app/api/admin/gallery/[id]/route.ts` — item update + delete.
- `src/app/api/admin/gallery/reorder/route.ts` — item reorder.
- `src/app/api/admin/gallery/categories/route.ts` — category list + create.
- `src/app/api/admin/gallery/categories/[id]/route.ts` — category rename + delete.
- `src/app/api/admin/gallery/categories/reorder/route.ts` — category reorder.
- `src/app/admin/(dashboard)/gallery/page.tsx` — admin gallery page (list + category manager).
- `src/app/admin/(dashboard)/gallery/CategoryManager.tsx` — client category CRUD.
- `src/app/admin/(dashboard)/gallery/GalleryRowActions.tsx` — client row actions.
- `src/app/admin/(dashboard)/gallery/GalleryForm.tsx` — client create/edit form.
- `src/app/admin/(dashboard)/gallery/new/page.tsx` — new-item page.
- `src/app/admin/(dashboard)/gallery/[id]/page.tsx` — edit-item page.

**Modify:**
- `prisma/schema.prisma` — add `GalleryCategory` + `GalleryItem`.
- `src/app/(frontend)/gallery/page.tsx` — become a server component that fetches + renders `GalleryClient`.
- `src/app/admin/(dashboard)/layout.tsx` — add a "Gallery" nav link.
- `package.json` — add `db:migrate-gallery` script.

---

## Task 1: Gallery models

**Files:** Modify `prisma/schema.prisma`.

- [ ] **Step 1: Append both models**

Append to `prisma/schema.prisma`:

```prisma
model GalleryCategory {
  id        String        @id @default(cuid())
  name      String        @unique
  sortOrder Int           @default(0)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  items     GalleryItem[]

  @@index([sortOrder])
}

model GalleryItem {
  id         String           @id @default(cuid())
  src        String
  caption    String           @db.Text
  videoUrl   String?
  featured   Boolean          @default(false)
  visible    Boolean          @default(true)
  sortOrder  Int              @default(0)
  categoryId String?
  category   GalleryCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  createdAt  DateTime         @default(now())
  updatedAt  DateTime         @updatedAt

  @@index([visible, sortOrder])
  @@index([categoryId])
}
```

- [ ] **Step 2: Push + regenerate**

Run:
```bash
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npx prisma db push
```
Expected: "Your database is now in sync with your Prisma schema"; both tables created; client regenerated.

- [ ] **Step 3: Verify the client has the models**

Run:
```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();console.log(typeof p.galleryItem.findMany, typeof p.galleryCategory.findMany)"
```
Expected: `function function`

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(db): add GalleryCategory + GalleryItem models"
```

---

## Task 2: Fallback data + view mapper (TDD)

**Files:**
- Create: `src/app/(frontend)/gallery/gallery-fallback.ts`
- Create: `src/lib/content/gallery-view.test.ts`
- Create: `src/lib/content/gallery-view.ts`

- [ ] **Step 1: Extract the current data into a fallback module**

Create `src/app/(frontend)/gallery/gallery-fallback.ts` (copied verbatim from the current `page.tsx` arrays, re-typed to the view shape — note `category` becomes a string, `video`→`videoUrl`, and `featured` replaces the `id===7` special case):

```ts
import type { GalleryView, GalleryCategoryView } from '@/lib/content/gallery-view';

export const FALLBACK_CATEGORIES: GalleryCategoryView[] = [
  { name: 'Metplast Housing' },
  { name: 'Layer Cage Systems' },
  { name: 'Breeder Cage Systems' },
  { name: 'Feed Silos' },
  { name: 'Factory / Manufacturing' },
];

export const FALLBACK_ITEMS: GalleryView[] = [
  { id: '1', src: '/images/gallery/1-3-600x540.jpg', caption: 'H-Type Layer Cage System — multi-tier automatic system with egg belt collection', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '2', src: '/images/gallery/3-2-600x540.jpg', caption: 'Metplast Layer cage corridor — automated feeding and manure belt system in operation', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '3', src: '/images/gallery/4-1-600x540.jpg', caption: 'Breeder cage system — designed for hatching egg quality and custom male bird placement', category: 'Breeder Cage Systems', videoUrl: null, featured: false },
  { id: '4', src: '/images/gallery/7-1-600x540.jpg', caption: 'Automatic nest boxes installed for clean hatching egg collection', category: 'Breeder Cage Systems', videoUrl: null, featured: false },
  { id: '5', src: '/images/gallery/8-1-600x540.jpg', caption: 'H-Type layer cage corridor — central service walkway with automated feeding lines', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '6', src: '/images/gallery/9-600x540.jpg', caption: 'Multi-tier layer cages with feed trough and nipple drinking lines', category: 'Layer Cage Systems', videoUrl: null, featured: false },
  { id: '8', src: '/images/Untitled-design-7-560x690.jpg', caption: 'Metplast feed silo installed at farm — galvanized steel with conical bottom', category: 'Feed Silos', videoUrl: null, featured: false },
  { id: '9', src: '/images/Hero-Slider-2.jpg', caption: 'Complete poultry housing project — multiple sheds built from levelled land', category: 'Metplast Housing', videoUrl: null, featured: false },
  { id: '7', src: '/images/Glimpse-Metplast-Indsutries-1.jpg', caption: 'Metplast Industries manufacturing facility — Khalapur, Maharashtra', category: 'Factory / Manufacturing', videoUrl: 'https://www.youtube.com/embed/sPCkTagbAYo', featured: true },
];
```

- [ ] **Step 2: Write the failing test**

Create `src/lib/content/gallery-view.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { rowToGalleryView, type GalleryItemRow } from './gallery-view';

const row: GalleryItemRow = {
  id: 'abc',
  src: '/uploads/x.jpg',
  caption: 'A caption',
  videoUrl: null,
  featured: false,
  category: { name: 'Feed Silos' },
};

describe('gallery-view', () => {
  it('maps a row with a category to a flat view', () => {
    expect(rowToGalleryView(row)).toEqual({
      id: 'abc', src: '/uploads/x.jpg', caption: 'A caption',
      category: 'Feed Silos', videoUrl: null, featured: false,
    });
  });

  it('maps a null category to category: null (Uncategorized)', () => {
    expect(rowToGalleryView({ ...row, category: null }).category).toBeNull();
  });

  it('preserves videoUrl and featured', () => {
    const v = rowToGalleryView({ ...row, videoUrl: 'https://x/embed/1', featured: true });
    expect(v.videoUrl).toBe('https://x/embed/1');
    expect(v.featured).toBe(true);
  });
});
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npm run test`
Expected: FAIL — cannot resolve `./gallery-view`.

- [ ] **Step 4: Implement the mapper**

Create `src/lib/content/gallery-view.ts`:

```ts
/** Flat shape the gallery client component consumes. */
export interface GalleryView {
  id: string;
  src: string;
  caption: string;
  category: string | null;
  videoUrl: string | null;
  featured: boolean;
}

export interface GalleryCategoryView {
  name: string;
}

/** The subset of a GalleryItem row (with its category joined) that the mapper reads. */
export interface GalleryItemRow {
  id: string;
  src: string;
  caption: string;
  videoUrl: string | null;
  featured: boolean;
  category: { name: string } | null;
}

export function rowToGalleryView(row: GalleryItemRow): GalleryView {
  return {
    id: row.id,
    src: row.src,
    caption: row.caption,
    category: row.category ? row.category.name : null,
    videoUrl: row.videoUrl,
    featured: row.featured,
  };
}
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npm run test`
Expected: PASS (existing mapper tests + these 3).

- [ ] **Step 6: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/app/"(frontend)"/gallery/gallery-fallback.ts src/lib/content/gallery-view.ts src/lib/content/gallery-view.test.ts
git commit -m "feat(gallery): fallback data + row->view mapper with tests"
```
(0 tsc errors expected.)

---

## Task 3: Content migration script

**Files:**
- Create: `scripts/migrate-gallery.ts`
- Modify: `package.json` (add `db:migrate-gallery`).

- [ ] **Step 1: Write the migration**

Create `scripts/migrate-gallery.ts`:

```ts
import { PrismaClient } from '@prisma/client';
import { FALLBACK_CATEGORIES, FALLBACK_ITEMS } from '../src/app/(frontend)/gallery/gallery-fallback';

const prisma = new PrismaClient();

async function main() {
  // 1) Categories (unique by name), in filter order.
  const idByName = new Map<string, string>();
  for (let i = 0; i < FALLBACK_CATEGORIES.length; i++) {
    const name = FALLBACK_CATEGORIES[i].name;
    const cat = await prisma.galleryCategory.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    });
    idByName.set(name, cat.id);
    console.log(`✓ category ${name} (order ${i})`);
  }

  // 2) Items — find by src, then update or create (src is not a DB unique).
  for (let i = 0; i < FALLBACK_ITEMS.length; i++) {
    const it = FALLBACK_ITEMS[i];
    const data = {
      src: it.src,
      caption: it.caption,
      videoUrl: it.videoUrl,
      featured: it.featured,
      visible: true,
      sortOrder: i,
      categoryId: it.category ? idByName.get(it.category) ?? null : null,
    };
    const existing = await prisma.galleryItem.findFirst({ where: { src: it.src } });
    if (existing) {
      await prisma.galleryItem.update({ where: { id: existing.id }, data });
    } else {
      await prisma.galleryItem.create({ data });
    }
    console.log(`✓ item ${it.src} (order ${i})`);
  }

  const [c, n] = await Promise.all([prisma.galleryCategory.count(), prisma.galleryItem.count()]);
  console.log(`Done. ${c} categories, ${n} items.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, add:
```json
    "db:migrate-gallery": "tsx scripts/migrate-gallery.ts"
```

- [ ] **Step 3: Run + verify**

Run:
```bash
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npm run db:migrate-gallery
```
Expected: 5 category lines + 9 item lines, then `Done. 5 categories, 9 items.`

- [ ] **Step 4: Verify idempotency**

Run:
```bash
npm run db:migrate-gallery
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();Promise.all([p.galleryCategory.count(),p.galleryItem.count()]).then(([c,i])=>{console.log('cats',c,'items',i);process.exit(0)})"
```
Expected: `cats 5 items 9` (unchanged).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-gallery.ts package.json
git commit -m "feat(gallery): one-time content migration (5 categories + 9 items)"
```

---

## Task 4: Public gallery — server fetch + client component

**Files:**
- Create: `src/app/(frontend)/gallery/GalleryClient.tsx`
- Modify (replace): `src/app/(frontend)/gallery/page.tsx`

- [ ] **Step 1: Move the interactive UI into `GalleryClient.tsx`**

Create `src/app/(frontend)/gallery/GalleryClient.tsx`. This is the CURRENT contents of `page.tsx` (the whole `"use client"` component) with these changes only: (a) it takes `{ items, categories }: { items: GalleryView[]; categories: string[] }` as props instead of the module-level `GALLERY_ITEMS`/`FILTERS`; (b) `FILTERS` becomes `['All', ...categories.filter(name => items.some(it => it.visible !== false && it.category === name))]` — i.e. only categories that have an item; (c) the featured full-width tile uses `item.featured` instead of `item.id === 7`; (d) the lightbox/`video` checks use `item.videoUrl` instead of `item.video`; (e) the selected-item type is `GalleryView`.

```tsx
"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ZoomIn, Play, ArrowUpRight } from 'lucide-react';
import type { GalleryView } from '@/lib/content/gallery-view';

export function GalleryClient({ items, categories }: { items: GalleryView[]; categories: string[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<GalleryView | null>(null);

  const usableCategories = categories.filter((name) => items.some((it) => it.category === name));
  const FILTERS = ['All', ...usableCategories];

  const filtered = activeFilter === 'All' ? items : items.filter((item) => item.category === activeFilter);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-navy w-[800px] h-[800px] top-[-10%] right-[-10%]" />
      </div>

      <section className="px-6 mb-16 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl"
            style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Projects & Gallery
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[100px] break-words hyphens-auto font-['Space_Grotesk'] font-black tracking-tighter max-w-4xl mx-auto leading-[0.9]"
            style={{ color: 'var(--text)' }}>
            REAL SYSTEMS. <br />
            <span className="text-gradient">REAL INSTALLATIONS.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Real poultry housing, cage systems, silos, ventilation, and installation work by Metplast Industries.
          </motion.p>
        </div>
      </section>

      <section className="px-6 mb-12 relative z-10">
        <div className="max-w-[1600px] mx-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-3 pb-2 min-w-max">
            {FILTERS.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  activeFilter === filter ? 'text-white border-transparent shadow-lg'
                    : 'border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                style={activeFilter === filter ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}}>
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 max-w-[1600px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`relative rounded-[2.5rem] overflow-hidden group cursor-pointer border ${
                  item.featured ? 'md:col-span-2 lg:col-span-3 aspect-[21/9]' : 'aspect-[4/3]'}`}
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                onClick={() => setSelected(item)}>
                <Image src={item.src} alt={item.caption} fill
                  className="object-cover group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                {item.category && (
                  <div className="absolute top-6 left-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md text-white"
                      style={{ background: 'var(--accent)' }}>
                      {item.category}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-20 h-20 rounded-full text-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 ease-out shadow-2xl"
                    style={{ background: 'var(--accent)' }}>
                    {item.videoUrl ? <Play className="w-8 h-8 ml-1" /> : <ZoomIn className="w-8 h-8" />}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-white font-semibold text-sm leading-relaxed mb-3">{item.caption}</p>
                  <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    Enquire for Similar Project <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center py-20 font-medium" style={{ color: 'var(--text-muted)' }}>
            No images in this category yet.
          </p>
        )}
      </section>

      <section className="px-6 mt-20 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="rounded-[3rem] p-12 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-3xl md:text-5xl font-['Space_Grotesk'] font-black tracking-tight mb-4" style={{ color: 'var(--text)' }}>
              Want a Similar Setup for Your Farm?
            </h2>
            <p className="font-medium mb-8" style={{ color: 'var(--text-muted)' }}>
              Talk to our team and we'll design the right system for your bird count, climate, and budget.
            </p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 h-14 px-10 rounded-full font-bold text-lg text-white btn-glow transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}>
              Enquire Now <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setSelected(null)}>
            <button aria-label="Close lightbox"
              className="absolute top-8 right-8 w-12 h-12 text-white/50 hover:text-white transition-colors bg-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-[var(--accent)] hover:border-[var(--accent)] z-[210]"
              onClick={() => setSelected(null)}>
              <X className="w-6 h-6" />
            </button>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              {selected.videoUrl ? (
                <iframe src={`${selected.videoUrl}?autoplay=1`} title={selected.caption}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen className="w-full h-full border-0" />
              ) : (
                <Image src={selected.src} alt={selected.caption} fill className="object-contain" />
              )}
            </motion.div>
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="text-white/70 font-medium text-sm">{selected.caption}</p>
              <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-bold mt-2"
                style={{ color: 'var(--accent)' }} onClick={() => setSelected(null)}>
                Enquire for Similar Project <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
```

- [ ] **Step 2: Replace `page.tsx` with a server component**

Replace the ENTIRE contents of `src/app/(frontend)/gallery/page.tsx` with:

```tsx
import React from 'react';
import prisma from '@/lib/prisma';
import { GalleryClient } from './GalleryClient';
import { rowToGalleryView } from '@/lib/content/gallery-view';
import { FALLBACK_ITEMS, FALLBACK_CATEGORIES } from './gallery-fallback';

export const metadata = {
  title: 'Projects & Gallery | Metplast Industries',
  description: 'Real poultry housing, cage systems, silos, ventilation, and installation work by Metplast Industries.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let items = FALLBACK_ITEMS;
  let categories = FALLBACK_CATEGORIES.map((c) => c.name);
  try {
    const [rows, cats] = await Promise.all([
      prisma.galleryItem.findMany({
        where: { visible: true },
        orderBy: { sortOrder: 'asc' },
        include: { category: { select: { name: true } } },
      }),
      prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { name: true } }),
    ]);
    if (rows.length > 0) {
      items = rows.map(rowToGalleryView);
      categories = cats.map((c) => c.name);
    }
  } catch (err) {
    console.error('gallery query failed, using fallback:', err);
  }

  return <GalleryClient items={items} categories={categories} />;
}
```

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build` (with `DATABASE_URL` exported).
Expected: 0 errors; compiles; `/gallery` shows as `ƒ`.

- [ ] **Step 4: Render check (best-effort)**

Start `PORT=3401 npm run start` in the background, wait ~4s:
```bash
curl -s http://localhost:3401/gallery | grep -c "REAL SYSTEMS"
```
Expect ≥ 1. Also confirm a category name (e.g. "Feed Silos") appears. Stop the server. Skip if backgrounding is impractical.

- [ ] **Step 5: Commit**

```bash
git add src/app/"(frontend)"/gallery/page.tsx src/app/"(frontend)"/gallery/GalleryClient.tsx
git commit -m "feat(gallery): render gallery from the database (server + client split)"
```

---

## Task 5: Category APIs

**Files:**
- Create: `src/app/api/admin/gallery/categories/route.ts`
- Create: `src/app/api/admin/gallery/categories/[id]/route.ts`
- Create: `src/app/api/admin/gallery/categories/reorder/route.ts`

- [ ] **Step 1: List + create**

Create `src/app/api/admin/gallery/categories/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const cats = await prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { name } = (await req.json()) as { name?: string };
  if (!name || !name.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  try {
    const max = await prisma.galleryCategory.aggregate({ _max: { sortOrder: true } });
    const created = await prisma.galleryCategory.create({
      data: { name: name.trim(), sortOrder: (max._max.sortOrder ?? -1) + 1 },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'category already exists' }, { status: 409 });
    }
    console.error('create category failed:', e);
    return NextResponse.json({ error: 'Could not create category' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Rename + delete**

Create `src/app/api/admin/gallery/categories/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const { name } = (await req.json()) as { name?: string };
  if (!name || !name.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  try {
    const updated = await prisma.galleryCategory.update({ where: { id }, data: { name: name.trim() } });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const code = e && typeof e === 'object' ? (e as { code?: string }).code : undefined;
    if (code === 'P2002') return NextResponse.json({ error: 'category already exists' }, { status: 409 });
    if (code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    console.error('rename category failed:', e);
    return NextResponse.json({ error: 'Could not rename category' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  try {
    // onDelete: SetNull leaves items intact (categoryId -> null).
    await prisma.galleryCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('delete category failed:', e);
    return NextResponse.json({ error: 'Could not delete category' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Reorder**

Create `src/app/api/admin/gallery/categories/reorder/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  if (!(await getServerSession(authOptions))) return new Response('Unauthorized', { status: 401 });
  const { id, direction } = (await req.json()) as { id?: string; direction?: 'up' | 'down' };
  if (!id || (direction !== 'up' && direction !== 'down')) {
    return NextResponse.json({ error: 'id and direction (up|down) are required' }, { status: 400 });
  }
  const current = await prisma.galleryCategory.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const neighbor = await prisma.galleryCategory.findFirst({
    where: { sortOrder: direction === 'up' ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
  });
  if (!neighbor) return NextResponse.json({ ok: true, moved: false });
  await prisma.$transaction([
    prisma.galleryCategory.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.galleryCategory.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  return NextResponse.json({ ok: true, moved: true });
}
```

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build` (DATABASE_URL exported). Expect 0 errors; the 3 category routes appear as `ƒ`.

- [ ] **Step 5: Verify auth gate (best-effort)**

`PORT=3401 npm run start` background, then `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3401/api/admin/gallery/categories` → expect `401`. Stop server. Skip if impractical.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/gallery/categories
git commit -m "feat(gallery): category CRUD + reorder APIs"
```

---

## Task 6: Gallery item APIs

**Files:**
- Create: `src/app/api/admin/gallery/route.ts`
- Create: `src/app/api/admin/gallery/[id]/route.ts`
- Create: `src/app/api/admin/gallery/reorder/route.ts`

- [ ] **Step 1: List + create**

Create `src/app/api/admin/gallery/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

interface ItemBody {
  src?: string;
  caption?: string;
  categoryId?: string | null;
  videoUrl?: string | null;
  featured?: boolean;
  visible?: boolean;
}

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const items = await prisma.galleryItem.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { category: { select: { name: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const b = (await req.json()) as ItemBody;
  if (!b.src) return NextResponse.json({ error: 'src (image) is required' }, { status: 400 });
  const max = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } });
  const created = await prisma.galleryItem.create({
    data: {
      src: b.src,
      caption: b.caption ?? '',
      categoryId: b.categoryId || null,
      videoUrl: b.videoUrl || null,
      featured: b.featured ?? false,
      visible: b.visible ?? true,
      sortOrder: (max._max.sortOrder ?? -1) + 1,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
```

- [ ] **Step 2: Update + delete**

Create `src/app/api/admin/gallery/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

interface ItemBody {
  src?: string;
  caption?: string;
  categoryId?: string | null;
  videoUrl?: string | null;
  featured?: boolean;
  visible?: boolean;
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const b = (await req.json()) as ItemBody;
  if (!b.src) return NextResponse.json({ error: 'src (image) is required' }, { status: 400 });
  try {
    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        src: b.src,
        caption: b.caption ?? '',
        categoryId: b.categoryId || null,
        videoUrl: b.videoUrl || null,
        featured: b.featured ?? false,
        visible: b.visible ?? true,
      },
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('update gallery item failed:', e);
    return NextResponse.json({ error: 'Could not update item' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  try {
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('delete gallery item failed:', e);
    return NextResponse.json({ error: 'Could not delete item' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Reorder**

Create `src/app/api/admin/gallery/reorder/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  if (!(await getServerSession(authOptions))) return new Response('Unauthorized', { status: 401 });
  const { id, direction } = (await req.json()) as { id?: string; direction?: 'up' | 'down' };
  if (!id || (direction !== 'up' && direction !== 'down')) {
    return NextResponse.json({ error: 'id and direction (up|down) are required' }, { status: 400 });
  }
  const current = await prisma.galleryItem.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const neighbor = await prisma.galleryItem.findFirst({
    where: { sortOrder: direction === 'up' ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
  });
  if (!neighbor) return NextResponse.json({ ok: true, moved: false });
  await prisma.$transaction([
    prisma.galleryItem.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.galleryItem.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  return NextResponse.json({ ok: true, moved: true });
}
```

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`. Expect 0 errors; the 3 item routes appear as `ƒ`.

- [ ] **Step 5: Verify auth gate (best-effort)**

`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3401/api/admin/gallery` → expect `401` (server backgrounded as before). Skip if impractical.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/gallery/route.ts src/app/api/admin/gallery/"[id]" src/app/api/admin/gallery/reorder
git commit -m "feat(gallery): item CRUD + reorder APIs"
```

---

## Task 7: Admin gallery page (list + category manager) + nav

**Files:**
- Create: `src/app/admin/(dashboard)/gallery/CategoryManager.tsx`
- Create: `src/app/admin/(dashboard)/gallery/GalleryRowActions.tsx`
- Create: `src/app/admin/(dashboard)/gallery/page.tsx`
- Modify: `src/app/admin/(dashboard)/layout.tsx` (nav link)

- [ ] **Step 1: Category manager (client)**

Create `src/app/admin/(dashboard)/gallery/CategoryManager.tsx`:

```tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Cat { id: string; name: string }

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function add() {
    if (!name.trim()) return;
    setBusy(true); setError('');
    const res = await fetch('/api/admin/gallery/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Failed'); return; }
    setName(''); router.refresh();
  }

  async function rename(id: string, current: string) {
    const next = prompt('Rename category', current);
    if (!next || next === current) return;
    setBusy(true);
    await fetch(`/api/admin/gallery/categories/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: next }),
    });
    setBusy(false); router.refresh();
  }

  async function move(id: string, direction: 'up' | 'down') {
    setBusy(true);
    await fetch('/api/admin/gallery/categories/reorder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, direction }),
    });
    setBusy(false); router.refresh();
  }

  async function del(id: string) {
    if (!confirm('Delete this category? Its images stay but become Uncategorized.')) return;
    setBusy(true);
    await fetch(`/api/admin/gallery/categories/${id}`, { method: 'DELETE' });
    setBusy(false); router.refresh();
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-bold text-white">Categories (filters)</h2>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      <div className="space-y-2">
        {categories.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3">
            <span className="flex-1 text-white/80">{c.name}</span>
            <button disabled={busy || i === 0} onClick={() => move(c.id, 'up')} className="text-white/50 hover:text-white disabled:opacity-20 text-lg">↑</button>
            <button disabled={busy || i === categories.length - 1} onClick={() => move(c.id, 'down')} className="text-white/50 hover:text-white disabled:opacity-20 text-lg">↓</button>
            <button disabled={busy} onClick={() => rename(c.id, c.name)} className="text-white/50 hover:text-white text-sm">Rename</button>
            <button disabled={busy} onClick={() => del(c.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
          </div>
        ))}
        {categories.length === 0 && <p className="text-white/40 text-sm">No categories yet.</p>}
      </div>
      <div className="flex gap-2 pt-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary" />
        <button disabled={busy} onClick={add} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">Add</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Row actions (client)**

Create `src/app/admin/(dashboard)/gallery/GalleryRowActions.tsx`:

```tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function GalleryRowActions({ id, isFirst, isLast }: { id: string; isFirst: boolean; isLast: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function move(direction: 'up' | 'down') {
    setBusy(true);
    await fetch('/api/admin/gallery/reorder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, direction }),
    });
    setBusy(false); router.refresh();
  }
  async function del() {
    if (!confirm('Delete this image?')) return;
    setBusy(true);
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    setBusy(false); router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-3">
      <button disabled={busy || isFirst} onClick={() => move('up')} className="text-white/50 hover:text-white disabled:opacity-20 text-lg leading-none">↑</button>
      <button disabled={busy || isLast} onClick={() => move('down')} className="text-white/50 hover:text-white disabled:opacity-20 text-lg leading-none">↓</button>
      <Link href={`/admin/gallery/${id}`} className="text-white/50 hover:text-white text-sm font-medium">Edit</Link>
      <button disabled={busy} onClick={del} className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
    </div>
  );
}
```

- [ ] **Step 3: Admin gallery page (server)**

Create `src/app/admin/(dashboard)/gallery/page.tsx`:

```tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CategoryManager } from './CategoryManager';
import { GalleryRowActions } from './GalleryRowActions';

export const dynamic = 'force-dynamic';

export default async function GalleryAdminPage() {
  const [items, categories] = await Promise.all([
    prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' }, include: { category: { select: { name: true } } } }),
    prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gallery</h1>
          <p className="text-white/60 mt-1">Images shown on the public gallery. Reorder with the arrows.</p>
        </div>
        <Link href="/admin/gallery/new" className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">Add Image</Link>
      </div>

      <CategoryManager categories={categories} />

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody>
            {items.length === 0 && (
              <tr><td className="p-8 text-center text-white/50">No images yet. Run <code>npm run db:migrate-gallery</code> or add one.</td></tr>
            )}
            {items.map((it, i) => (
              <tr key={it.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4 w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.src} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                </td>
                <td className="p-4">
                  <div className="text-white text-sm">{it.caption || <span className="text-white/40">(no caption)</span>}</div>
                  <div className="text-xs text-white/50">
                    {it.category?.name ?? 'Uncategorized'}
                    {it.featured && ' · featured'}{!it.visible && ' · hidden'}{it.videoUrl && ' · video'}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <GalleryRowActions id={it.id} isFirst={i === 0} isLast={i === items.length - 1} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add the nav link**

In `src/app/admin/(dashboard)/layout.tsx`, add a Gallery link to the sidebar `<nav>`, immediately after the Blogs link (match the existing link markup exactly):

```tsx
          <Link href="/admin/gallery" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Gallery
          </Link>
```

- [ ] **Step 5: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`. Expect 0 errors; `/admin/gallery` appears as `ƒ`.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/"(dashboard)"/gallery/page.tsx src/app/admin/"(dashboard)"/gallery/CategoryManager.tsx src/app/admin/"(dashboard)"/gallery/GalleryRowActions.tsx src/app/admin/"(dashboard)"/layout.tsx
git commit -m "feat(gallery): admin gallery list + category manager + nav link"
```

---

## Task 8: Admin gallery item form

**Files:**
- Create: `src/app/admin/(dashboard)/gallery/GalleryForm.tsx`
- Create: `src/app/admin/(dashboard)/gallery/new/page.tsx`
- Create: `src/app/admin/(dashboard)/gallery/[id]/page.tsx`

- [ ] **Step 1: The form (client)**

Create `src/app/admin/(dashboard)/gallery/GalleryForm.tsx`:

```tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CatOption { id: string; name: string }

export interface GalleryFormValues {
  src: string;
  caption: string;
  categoryId: string;
  videoUrl: string;
  featured: boolean;
  visible: boolean;
}

const EMPTY: GalleryFormValues = { src: '', caption: '', categoryId: '', videoUrl: '', featured: false, visible: true };

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function GalleryForm({ mode, id, categories, initial }: {
  mode: 'create' | 'edit';
  id?: string;
  categories: CatOption[];
  initial?: GalleryFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState<GalleryFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof GalleryFormValues>(k: K, val: GalleryFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) { setError('Image upload failed.'); return; }
      const { path } = await res.json();
      setV((p) => ({ ...p, src: path }));
    } catch { setError('Image upload failed (network error).'); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.src) { setError('Please upload an image first.'); return; }
    setSaving(true); setError('');
    const url = mode === 'create' ? '/api/admin/gallery' : `/api/admin/gallery/${id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, categoryId: v.categoryId || null, videoUrl: v.videoUrl || null }),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Save failed.'); return; }
      router.push('/admin/gallery'); router.refresh();
    } catch { setError('Save failed (network error).'); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">{mode === 'create' ? 'Add Image' : 'Edit Image'}</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div>
        <label className={label}>Image</label>
        {v.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.src} alt="" className="w-40 h-40 object-cover rounded-lg border border-white/10 mb-3" />
        )}
        <input type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }}
          className="text-white/70 text-sm" />
      </div>

      <div>
        <label className={label}>Caption</label>
        <input className={input} value={v.caption} onChange={(e) => set('caption', e.target.value)} />
      </div>

      <div>
        <label className={label}>Category</label>
        <select className={input} value={v.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
          <option value="" className="bg-slate-900">Uncategorized</option>
          {categories.map((c) => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className={label}>Video embed URL (optional)</label>
        <input className={input} value={v.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://www.youtube.com/embed/…" />
      </div>

      <label className="flex items-center gap-3 text-white/80">
        <input type="checkbox" checked={v.featured} onChange={(e) => set('featured', e.target.checked)} />
        Featured (full-width tile)
      </label>
      <label className="flex items-center gap-3 text-white/80">
        <input type="checkbox" checked={v.visible} onChange={(e) => set('visible', e.target.checked)} />
        Visible on the public gallery
      </label>
    </form>
  );
}
```

- [ ] **Step 2: New page**

Create `src/app/admin/(dashboard)/gallery/new/page.tsx`:

```tsx
import prisma from '@/lib/prisma';
import { GalleryForm } from '../GalleryForm';

export const dynamic = 'force-dynamic';

export default async function NewGalleryItemPage() {
  const categories = await prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } });
  return <GalleryForm mode="create" categories={categories} />;
}
```

- [ ] **Step 3: Edit page**

Create `src/app/admin/(dashboard)/gallery/[id]/page.tsx`:

```tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { GalleryForm, type GalleryFormValues } from '../GalleryForm';

export const dynamic = 'force-dynamic';

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.galleryItem.findUnique({ where: { id } }),
    prisma.galleryCategory.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
  ]);
  if (!item) notFound();

  const initial: GalleryFormValues = {
    src: item.src,
    caption: item.caption,
    categoryId: item.categoryId ?? '',
    videoUrl: item.videoUrl ?? '',
    featured: item.featured,
    visible: item.visible,
  };
  return <GalleryForm mode="edit" id={item.id} categories={categories} initial={initial} />;
}
```

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`. Expect 0 errors; `/admin/gallery/new` and `/admin/gallery/[id]` appear as `ƒ`.

- [ ] **Step 5: Manual admin round-trip (with a logged-in session)**

`npm run dev` (or start), log in at `/admin/login`, then: add a category; add an image (upload) into it; mark featured; toggle visible; reorder; open `/gallery` and confirm it reflects; delete the category and confirm its image becomes Uncategorized (still shown, filter chip gone).

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/"(dashboard)"/gallery/GalleryForm.tsx src/app/admin/"(dashboard)"/gallery/new src/app/admin/"(dashboard)"/gallery/"[id]"
git commit -m "feat(gallery): admin add/edit image form with upload + category select"
```

---

## Task 9: Final verification + docs

**Files:** Modify `docs/SECURITY.md` (one line under "What's already protected").

- [ ] **Step 1: Note the gallery admin in the protected list**

In `docs/SECURITY.md`, under the "CMS admin" bullet, extend it to mention gallery:

```markdown
- **CMS admin** — the product-section CRUD (`/api/admin/products`, `/[id]`,
  `/reorder`), the gallery CRUD (`/api/admin/gallery*`, incl. `/categories*`),
  and image upload (`/api/admin/upload`) all require a valid session (401
  otherwise); upload also validates MIME type and a 5 MB size cap.
```

- [ ] **Step 2: Full verification suite**

Run:
```bash
npm run test
npx tsc --noEmit
export DATABASE_URL="mysql://metplast:metplastpass@localhost:3306/metplast"
npm run build
```
Expected: all mapper tests pass (products + gallery); 0 type errors; build compiles all routes.

- [ ] **Step 3: Banned-term grep**

Run:
```bash
grep -rniE "battery cage|a-frame|a-type|pyramid|97% yield|275 gsm|maximum hatchability|cutting-edge" src --include=*.ts --include=*.tsx | grep -v "page.tsx.bak"
```
Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add docs/SECURITY.md
git commit -m "docs: note gallery admin in security protected list"
```

---

## Self-Review notes (for the implementer)

- **Public split:** `GalleryClient.tsx` is the current `page.tsx` client body, prop-driven; `page.tsx` becomes a server fetch with a fallback to `gallery-fallback.ts` so the page never blanks pre-migration.
- **Featured / video:** `item.featured` replaces the `id === 7` special case; `item.videoUrl` replaces `item.video` — both in the grid and the lightbox.
- **Category delete** relies on `onDelete: SetNull` — items survive with `categoryId = null` and render as "Uncategorized" (no category chip); the filter bar only lists categories that still have an item.
- **Append-on-create** (items and categories both compute `max(sortOrder) + 1`) prevents reorder ties — the same fix applied to products.
- **Reuse:** the image upload endpoint, the reorder-swap pattern, and the admin session gate are all unchanged from Phase 1.
- **Prisma Json note (products) does NOT apply here** — gallery has no JSON columns, so no `InputJsonValue` casting is needed.
