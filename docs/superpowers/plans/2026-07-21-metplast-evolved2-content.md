# Metplast Evolved2 — Content & Structure Change Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply every approved change in `METPLAST_EVOLVED2_WEBSITE_CONTENT_AND_STRUCTURE_CHANGE_PLAN.md` (the "brief") to the Next.js site — risky-claim removal, sitewide find/replace, rebuilt Layer/Breeder/Broiler content, new reusable blocks (feeder materials, auto-flush, customization, 3-stage upgrade path, feeding trolley, lighting), About+Moba page, Community/multilingual section, spec cards, and forms alignment.

**Architecture:** Config-driven product pages (`layer/breeder/broiler/feed-silos/environmental-control`) render `PageConfig` objects (`src/lib/content/*.ts`) through `ScrollPageTemplate` → `ProductSection`. Brief introduces block types that don't fit the current fixed layout, so we extend the content model with a typed `PageBlock` union + a `BlockRenderer` registry, keeping approved copy inside self-contained block components (copy is fixed/identical across pages → bake it in, don't prop-drill). Bespoke pages (homepage, about) get direct JSX edits + new section components.

**Tech Stack:** Next.js 16 (App Router, `(frontend)` route group), React 19, TypeScript, Tailwind v4, framer-motion, lucide-react, Prisma. `AGENTS.md` warns Next.js APIs differ from training data — read `node_modules/next/dist/docs/` before using any unfamiliar Next API. This work is almost entirely content/JSX in existing patterns; no new Next APIs are expected except a possible new static page (mirror `products/page.tsx`).

**Verification model:** Repo has **no test harness** (no `test` script, no test files). Project reality overrides the TDD default. Every task verifies with:
- `npm run lint` → expected: no new errors
- `npm run build` → expected: `✓ Compiled successfully`, all routes built
- Visual check via `/run` skill or `npm run dev` where copy/layout changed.

**Source of truth for copy:** The brief holds paste-ready final copy. Where a task edits a small config value, the exact string is inlined here. Where a task fills a large block, the task references the brief section by number AND the block component bakes that copy in verbatim. Do not rewrite, improve, or shorten brief copy.

**Wording rules (enforce in every task):**
- Never the word "optional" on a cage feature → "available" / "can be configured".
- Trolley feeding is **standard** on H-Type Layer; "available" everywhere else.
- Never promise fertility/hatchability/yield outcomes → "supports" / "helps create the right conditions for".

---

## File Structure

**New files:**
- `src/components/blocks/BlockRenderer.tsx` — maps a `PageBlock` union member to its component.
- `src/components/blocks/FeederMaterials.tsx` — brief §5, 4 material cards, baked copy.
- `src/components/blocks/AutoFlush.tsx` — brief §6.6, baked copy.
- `src/components/blocks/Customization.tsx` — brief §10, 8 cards + footer line, baked copy.
- `src/components/blocks/UpgradePath.tsx` — brief §4.7, 3 connected stage cards + progress line, baked copy.
- `src/components/blocks/InfoBlock.tsx` — generic titled block (heading + paragraph/line list + optional note). Drives Layer box-dimensions (§4.3) and Breeder female-box-sizes (§6.4) via props.
- `src/components/blocks/FeedingTrolley.tsx` — brief §6.3, highlighted band, 99.7% tag, baked copy.
- `src/components/blocks/Lighting.tsx` — brief §6.8, baked copy.
- `src/components/CommunitySection.tsx` — brief §12, replaces homepage testimonials (cards + multilingual strip + state chips).
- `src/components/MobaBlock.tsx` — brief §11 Moba block, links moba.net.
- `src/app/(frontend)/about/page.tsx` — **rewrite** to brief §11 About copy + Moba block (file exists).

**Modified files:**
- `src/components/ScrollPageTemplate.tsx` — extend `PageConfig` with `PageBlock` union + `pageBlocks?`; render `pageBlocks` after sections, before crossLinks; feed extra nav ids.
- `src/components/ProductSection.tsx` — add `topBlocks?`/`bottomBlocks?: PageBlock[]`, `tag?` positioning line; render via `BlockRenderer`.
- `src/lib/content/layer.ts` — brief §2, §4 (hero, H-Type, box dims, 6 cards, benefits, pullet, S-Frame reposition, feeder materials, customization, spec cards).
- `src/lib/content/breeder.ts` — brief §2, §6 (hero+claims, H-Type, female boxes, 7 cards, feeding trolley, auto-flush, pullet, lighting, feeder materials, customization).
- `src/lib/content/broiler.ts` — brief §2, §7 (hero, restructure, section copy, H-Type reposition).
- `src/lib/content/feed-silos.ts` — brief §2 #12, §9 (delete 275 GSM, customizable copy).
- `src/lib/content/environmental-control.ts` — brief §2 (no offending terms found beyond generic; verify).
- `src/app/(frontend)/page.tsx` — brief §3 (stat cards, tagline, intro, positioning, 250+→500+, Community section swap).
- `src/app/(frontend)/housing/page.tsx` — brief §2/§8 (275 GSM, A-Frame, battery, hatchability, 99.7% removal, 250+→500+).
- `src/app/(frontend)/products/page.tsx` — brief §2 (A-Frame? no; 275 GSM line 53; battery? no).
- `src/app/(frontend)/gallery/page.tsx` — brief §2 (caption "Battery Cage").
- `src/app/(frontend)/calculators/page.tsx` — brief §2 (A-Frame, battery cage descriptions).
- `src/components/CalculatorShell.tsx` — brief §2 (comment "Layer Battery Cage" — cosmetic).
- `src/app/(frontend)/layer/page.tsx`, `broiler/page.tsx`, `breeder/page.tsx` — SEO `metadata` strings (A-Frame, battery cages, optimize hatchability).
- `src/components/Navbar.tsx` + `src/components/Footer.tsx` — add `/about` link (About is a linked page per §11).
- `src/app/(frontend)/contact/page.tsx` — brief §16 (add explicit `product` field to submission payload).

---

## WAVE 1 — CRITICAL (no dependencies)

### Task 1: Global find/replace — offending terms sitewide (brief §2)

**Files:**
- Modify: `src/lib/content/layer.ts`, `src/lib/content/breeder.ts`, `src/lib/content/broiler.ts`, `src/lib/content/feed-silos.ts`
- Modify: `src/app/(frontend)/layer/page.tsx:7`, `broiler/page.tsx:7`, `breeder/page.tsx:7`
- Modify: `src/app/(frontend)/gallery/page.tsx:13`, `calculators/page.tsx:12,36`
- Modify: `src/components/CalculatorShell.tsx:28` (comment)
- Modify: `src/app/(frontend)/products/page.tsx:53`, `src/app/(frontend)/housing/page.tsx:11,17,26,27`

> NOTE: Content-file (`layer.ts`/`breeder.ts`/`broiler.ts`) bodies are fully rebuilt in Wave-1/2 tasks below; this task covers the **secondary** files (metadata, gallery, calculators, products, housing, CalculatorShell) so the offending strings die everywhere even before the big rebuilds land. Apply the §2 table:

| FIND | REPLACE |
|---|---|
| `H-Type Layer Battery Cage` | `H-Type Layer Cage System` |
| `battery cage` / `Battery Cage` / `battery cages` | `cage system` / `Cage System` / `cage systems` |
| `A-Frame` / `Pyramid` | `S-Frame GI Structure` (in prose) / `S-Frame` (in titles) |
| `cutting-edge` | delete word, restructure (per-page copy below) |
| `high-quality equipment` | delete (per-page copy below) |
| `97% Yield Efficiency` | delete stat card entirely |
| `250+` (any variant) | `500+` |
| `99.7% Feeding Accuracy` on Homepage/Housing | remove (Breeder-only) |
| `Maximum Hatchability` | `Breeder Management` |
| `275 GSM` | delete |
| `optimize fertility/hatchability` | never promise; "supports" |

- [ ] **Step 1: Metadata strings** — set the three route metadata descriptions:
  - `src/app/(frontend)/layer/page.tsx:7`: `description: 'H-Type and S-Frame layer cage systems engineered for uniform feed access, clean egg handling, stronger cage life, and consistent layer production.'`
  - `src/app/(frontend)/layer/page.tsx:6` title stays; also fix any "A-Frame" wording.
  - `src/app/(frontend)/broiler/page.tsx:7`: `description: 'Broiler poultry systems — deep litter housing, pan feeding, nipple drinking with auto flush, curtains, and H-Type broiler cage systems for practical shed management.'`
  - `src/app/(frontend)/breeder/page.tsx:7`: `description: 'H-Type breeder cage systems designed for male-female management, uniform feeding, cleaner hatching eggs, and easier AI workflow.'`

- [ ] **Step 2: Gallery caption** — `src/app/(frontend)/gallery/page.tsx:13`: change `H-Type Layer Battery Cage — multi-tier automatic system with egg belt collection` → `H-Type Layer Cage System — multi-tier automatic system with egg belt collection`.

- [ ] **Step 3: Calculators descriptions** — `src/app/(frontend)/calculators/page.tsx`:
  - line 12: `Calculate H-Type and S-Frame cage requirements for commercial layer production based on your bird capacity.`
  - line 36: `Estimate deep litter or H-Type cage requirements for intensive broiler rearing.`

- [ ] **Step 4: CalculatorShell comment** — `src/components/CalculatorShell.tsx:28`: change comment `// e.g. "Layer Battery Cage"` → `// e.g. "Layer Cage System"` (cosmetic, keep it consistent).

- [ ] **Step 5: Products page** — `src/app/(frontend)/products/page.tsx:53`: change `275 GSM galvanized steel silos with screw conveyors, load cells, and automated feed delivery to every line.` → `Galvanized steel silos with screw conveyors, load cells, and automated feed delivery to every line.`

- [ ] **Step 6: Housing page** — `src/app/(frontend)/housing/page.tsx`:
  - line 11 (`Cage Systems` desc): `H-Type and S-Frame cages for Layer, Breeder, and Broiler`
  - line 12 (`Automatic Feeding` desc): `Chain & trolley feeding systems for layer, breeder, and broiler lines` (remove "99.7% accuracy" — Breeder-only per §8.1)
  - line 17 (`Feed Silos` desc): `Galvanized steel silos with screw conveyors` (remove "275 GSM")
  - line 26 (`Breeder Farms` desc): `Hatching egg production with practical male bird placement` (remove "custom" is fine; drop nothing else)
  - line 27 (`Broiler Farms` desc): `Deep litter and H-Type cage broiler rearing systems`

- [ ] **Step 7: lint + build**

Run: `npm run lint && npm run build`
Expected: no new lint errors; `✓ Compiled successfully`.

- [ ] **Step 8: Verify no offending strings remain in secondary files**

Run (Grep tool, not bash): pattern `Battery Cage|battery cage|A-Frame|Pyramid|cutting-edge|275 GSM|97% Yield` across `src/app` and `src/components` excluding `page.tsx.bak`.
Expected: only matches left are inside `src/lib/content/*.ts` (rebuilt in later tasks) and `src/app/page.tsx.bak` (dead backup — ignore).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "content: sitewide find/replace of legacy cage terms (brief §2)"
```

---

### Task 2: Homepage hero stats, tagline, intro, 500+ (brief §3.1–3.3, §8)

**Files:** Modify `src/app/(frontend)/page.tsx`

- [ ] **Step 1: Hero stat block** — replace the two-stat grid (`page.tsx:93-107`, the `99.7%` + `97%` cards) with the four-item brief §3.1 set. Render as a 2×2 grid of small stat tiles inside the existing bordered container:

```
35+ Years of Experience
500+ Farms
Complete Poultry Housing
Layer · Breeder · Broiler Systems
```

Exact JSX (replace lines 93-107):

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
  className="grid grid-cols-2 gap-6 pt-8 w-full border-t border-white/10 mt-4"
>
  <div>
    <p className="text-4xl font-['Space_Grotesk'] font-black text-white">35<span style={{ color: 'var(--accent)' }}>+</span></p>
    <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Years of Experience</p>
  </div>
  <div>
    <p className="text-4xl font-['Space_Grotesk'] font-black text-white">500<span style={{ color: 'var(--accent)' }}>+</span></p>
    <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Farms</p>
  </div>
  <div>
    <p className="text-lg font-['Space_Grotesk'] font-black text-white leading-tight">Complete Poultry Housing</p>
  </div>
  <div>
    <p className="text-lg font-['Space_Grotesk'] font-black text-white leading-tight">Layer · Breeder · Broiler Systems</p>
  </div>
</motion.div>
```

- [ ] **Step 2: Card 01 tagline** — `page.tsx:122-124`, replace the "Providing cutting-edge, high-quality equipment…" paragraph with brief §3.2:

```
Poultry housing systems engineered around bird comfort, farm workflow, clean manure handling, uniform feeding, and long service life.
```

- [ ] **Step 3: Intro/positioning paragraph** — `page.tsx:158-160`, replace the "Metplast Industries specializes in high-quality, reliable poultry equipment…" paragraph with brief §3.3:

```
Metplast designs, manufactures, and installs complete poultry housing — cage systems, feeding, drinking, manure handling, egg collection, ventilation, and feed storage — for layer, breeder, and broiler farms. From levelled land to a running farm, one team stays responsible.
```

- [ ] **Step 4: 250+ → 500+** — `page.tsx:285`: change `across 250+ farms.` → `across 500+ farms.`

- [ ] **Step 5: lint + build + visual**

Run: `npm run lint && npm run build`. Then `/run` skill (or `npm run dev`) → open `/`, confirm 4-item stat block renders, no 97%/99.7% on homepage, tagline + intro updated.

- [ ] **Step 6: Commit**

```bash
git add src/app/"(frontend)"/page.tsx
git commit -m "content: homepage hero stats, tagline, intro, 500+ farms (brief §3)"
```

---

### Task 3: About page rewrite — remove overclaims, 500+, cutting-edge (brief §2, prep for §11)

**Files:** Modify `src/app/(frontend)/about/page.tsx`

> Full About+Moba rebuild is Task 12 (Wave 3). Here, kill the Wave-1 legal/claim risks so nothing overclaiming ships early.

- [ ] **Step 1:** Hero paragraph (line 41): replace "developing cutting-edge equipment tailored to…" →

```
Metplast Industries manufactures complete poultry housing and cage systems for the evolving needs of poultry farmers worldwide.
```

- [ ] **Step 2:** Body (line 64): `Over 35 years and 250+ satisfied farm owners across 10+ countries…` → `Over 35 years and 500+ farms across India and international markets trust Metplast…`

- [ ] **Step 3:** Stat cards (lines 70-76): remove the `99.7% Feeding Accuracy` stat card (Breeder-only, §8/§2 #8). Replace with `35+ Years` tile; keep a `500+ Farms` tile (update `250+` → `500+`, label `Farms`).

- [ ] **Step 4:** Values grid (lines 116-121): remove the `99.7% Feeding Accuracy` value item; replace with a non-numeric value, e.g. `{ icon: Zap, title: "Turnkey Delivery", desc: "From levelled land to a running farm, one team stays responsible — planning, manufacturing, installation, and long-term support." }`. Change `250+ Farm Installations` → `500+ Farms`.

- [ ] **Step 5: lint + build + visual** (`/about`).

- [ ] **Step 6: Commit**

```bash
git add src/app/"(frontend)"/about/page.tsx
git commit -m "content: about page claim removal + 500+ (brief §2)"
```

---

### Task 4: Feed Silos — delete 275 GSM, add customizable copy (brief §9)

**Files:** Modify `src/lib/content/feed-silos.ts`

- [ ] **Step 1:** In the `silo-storage` section, remove any `275 GSM` reference (none in current copy — verify) and set the intro/description to include the brief §9 customizable statement. Add to `intro` array (or the silo-storage `description`):

```
Metplast feed silos are customizable — capacity, height, ring count, and auger delivery are configured to your shed layout, feed program, and bird capacity. Material and coating are specified per project for long outdoor service life.
```

- [ ] **Step 2:** Remove any hard GSM/spec number that isn't verified from the `specs` (keep capacity/roof/filling; do not invent GSM).

- [ ] **Step 3: lint + build + visual** (`/feed-silos`).

- [ ] **Step 4: Commit**

```bash
git add src/lib/content/feed-silos.ts
git commit -m "content: feed silos remove GSM claim, add customizable copy (brief §9)"
```

---

### Task 5: Breeder claim removals + hero (brief §6.1) — CRITICAL legal

**Files:** Modify `src/lib/content/breeder.ts`

> This task does the **Wave-1 legal-risk** subset on breeder. Full breeder rebuild (cards, trolley, boxes, lighting) is Task 9.

- [ ] **Step 1: Hero** — set:
  - `hero.title`: `"BREEDER POULTRY SYSTEMS"` (or keep `"BREEDER SOLUTIONS"` per site style; H1 copy per §6.1 is "Breeder Poultry Systems")
  - `hero.subtitle`: `"Designed for male-female management, uniform feeding, cleaner hatching eggs, and easier AI workflow."`

- [ ] **Step 2: Remove overclaims:**
  - `sections[0].badge`: `"Maximum Hatchability"` → `"Breeder Management"`
  - `intro` array: remove "optimize fertility, hatchability" wording. Replace with: `["Metplast’s breeder cage systems are designed around bird comfort, controlled feeding, male-female placement, AI access, and cleaner hatching egg handling.", "Built to support consistent breeder management across the flock."]`
  - `benefits[0]`: `"Higher Hatchability Rates with improved fertilization success"` → `"Supports cleaner hatching egg handling and easier AI workflow"`
  - Any `"99% Feed Accuracy"` feature line: for now remove the numeric from H-Type feature list (99.7% story moves to the dedicated Feeding Trolley block in Task 9). Replace with non-numeric controlled-feeding line.

- [ ] **Step 3: lint + build + visual** (`/breeder`) — confirm no "hatchability rate", "maximum hatchability", "99%", "optimize fertility" strings remain.

- [ ] **Step 4: Commit**

```bash
git add src/lib/content/breeder.ts
git commit -m "content: breeder claim removals + hero (brief §6.1) — legal risk"
```

---

### Task 6: Layer hero + H-Type description + 6 feature cards + benefits (brief §4.1–4.5)

**Files:** Modify `src/lib/content/layer.ts`

- [ ] **Step 1: Hero** —
  - `hero.title`: `"LAYER POULTRY SYSTEMS"`
  - `hero.subtitle`: `"Designed for uniform feed access, clean egg handling, stronger cage life, and consistent layer production."`
  - Remove tag "Commercial Production" (`sections[0].badge` → e.g. `"H-Type Layer"` or omit).

- [ ] **Step 2: Intro** — replace §4 config `intro` with:
```
["Metplast designs and installs complete layer cage systems built around uniform feed access, clean egg handling, and long cage life.", "Every system is engineered for practical daily management and consistent layer production."]
```

- [ ] **Step 3: H-Type description** (`sections[0]` id `h-type`, title `"H-Type Layer Cage System"`) — brief §4.2:
```
A fully integrated layer cage system for farms that need efficient space use, smooth egg handling, clean manure removal, and practical daily management.
```

- [ ] **Step 4: 6 feature cards** — replace `sections[0].features` with brief §4.4 (six items). Keep the `–` separator so `ProductSection` bolds the title:
```
"Uniform Feed Distribution – Every bird gets 3 inches of feeder front. Consistent access across all tiers reduces competition and drives uniform flock performance.",
"Gentle Egg Movement – Engineered egg roll for smooth travel and cleaner collection — fewer cracks, less handling stress, better-grade eggs.",
"Niagara Egg Collection System – Automated vertical egg collection transfers eggs from every tier to a single collection point — less labour, cleaner eggs.",
"UV-Stabilized PP Manure Belt – A durable polypropylene belt built for daily use — cleaner sheds, lower ammonia and smell, easier routine maintenance.",
"Trolley Feeding System – Trolley feeding comes standard on every H-Type Layer line — controlled, consistent feed delivery across the full cage row.",
"Strong GI Cage Structure – Galvanized construction built for long service life, corrosion resistance, and stable alignment flock after flock."
```
Delete "Chain design", "H-Type vertical", filler.

- [ ] **Step 5: Benefits row** — replace `sections[0].benefits` with brief §4.5 items (split the `·` list into array entries):
```
["Cleaner eggs","Better manure handling","Reduced daily labour","Uniform feed access","Better shed hygiene","Longer cage service life","Built for scalable layer farms"]
```

- [ ] **Step 6: Spec cards (brief §13)** — set `sections[0].specs` to the §13 hard-coded H-Type Layer values:
```
{ label: "Cage Type", value: "H-Type Layer Cage System" },
{ label: "Birds per Box", value: "10" },
{ label: "Box Front", value: "30 in" },
{ label: "Box Depth", value: "26 in" },
{ label: "Feeding Space per Bird", value: "3 in" },
{ label: "Area per Bird", value: "78 sq. in (~503 cm²)" },
{ label: "Material & Coating", value: "GI structure" },
{ label: "Manure System", value: "UV-stabilized PP belt" },
{ label: "Egg Collection", value: "Niagara vertical system" },
{ label: "Feeding", value: "Trolley (standard)" },
{ label: "Feeder Options", value: "ZAM / Aluminium / GI / PVC" },
{ label: "Automation Level", value: "Automatic-ready" }
```

- [ ] **Step 7: lint + build + visual** (`/layer`).

- [ ] **Step 8: Commit**

```bash
git add src/lib/content/layer.ts
git commit -m "content: layer hero + H-Type description, 6 cards, benefits, specs (brief §4.1-4.5, §13)"
```

---

## WAVE 2 — HIGH (build now, photos drop in later)

### Task 7: Block infrastructure — PageBlock model + BlockRenderer + shared blocks

**Files:**
- Modify: `src/components/ScrollPageTemplate.tsx` (extend `PageConfig`)
- Modify: `src/components/ProductSection.tsx` (topBlocks/bottomBlocks + tag)
- Create: `src/components/blocks/BlockRenderer.tsx`
- Create: `src/components/blocks/InfoBlock.tsx`
- Create: `src/components/blocks/FeederMaterials.tsx`
- Create: `src/components/blocks/AutoFlush.tsx`
- Create: `src/components/blocks/Customization.tsx`
- Create: `src/components/blocks/UpgradePath.tsx`
- Create: `src/components/blocks/FeedingTrolley.tsx`
- Create: `src/components/blocks/Lighting.tsx`

- [ ] **Step 1: Define `PageBlock` union** in `ScrollPageTemplate.tsx` (exported):

```ts
export type PageBlock =
  | { type: 'info'; id?: string; heading: string; lines: string[]; note?: string; columns?: boolean }
  | { type: 'feeder-materials'; id?: string }
  | { type: 'auto-flush'; id?: string }
  | { type: 'customization'; id?: string }
  | { type: 'upgrade-path'; id?: string }
  | { type: 'feeding-trolley'; id?: string }
  | { type: 'lighting'; id?: string };
```

Add to `PageConfig`: `pageBlocks?: PageBlock[];`. Add to `ProductSectionProps` (in `ProductSection.tsx`): `tag?: string; topBlocks?: PageBlock[]; bottomBlocks?: PageBlock[];` — import `PageBlock` type (move the union to a shared spot, e.g. keep in `ScrollPageTemplate.tsx` and import, or create `src/components/blocks/types.ts` and import from both to avoid a cycle). **Use `src/components/blocks/types.ts`** to hold `PageBlock` to prevent an import cycle (ProductSection ↔ ScrollPageTemplate).

- [ ] **Step 2: `BlockRenderer.tsx`** — switch on `block.type` → component. Each shared block component below has baked copy; `info` passes props.

- [ ] **Step 3: `InfoBlock.tsx`** — titled block: `heading` (Space Grotesk bold), `lines[]` (each a paragraph; if `columns` render as a stat row), optional `note`. Match site tokens (`var(--surface)`, `var(--border)`, rounded-3xl). Used for Layer §4.3 and Breeder §6.4.

- [ ] **Step 4: `FeederMaterials.tsx`** — brief §5. Heading "Choose the Right Feeder for Your Farm", 4 cards (ZAM, Aluminium, GI, PVC) with baked copy from §5, one icon each (lucide: `ShieldCheck`, `Feather`, `Wrench`, `Droplets` or similar). 4-col grid → 2 → 1 responsive.

- [ ] **Step 5: `AutoFlush.tsx`** — brief §6.6. Heading "Auto Flush Water Hygiene", 3 bullet reasons + availability line, baked copy. 3-step flow feel (§15 graphic #4 optional later).

- [ ] **Step 6: `Customization.tsx`** — brief §10. Heading "Built Around Your Farm Requirement", intro line, 8 cards (§10 card examples), mandatory footer line. Never render "optional".

- [ ] **Step 7: `UpgradePath.tsx`** — brief §4.7. Tag "The Upgrade-Ready Cage" context; 3 connected stage cards (STAGE 1 MANUAL / STAGE 2 SEMI-AUTOMATIC / STAGE 3 AUTOMATIC) with baked copy + an arrow/progress line between them (desktop: horizontal connector; mobile: stacked). This is the S-Frame identity graphic.

- [ ] **Step 8: `FeedingTrolley.tsx`** — brief §6.3. Highlighted band, tag "99.7% Feeding Accuracy", heading "Precision Feeding, Bird by Bird", 3 bullets + result line, baked copy. `[PHOTO: Prateek]` placeholder slot (styled empty frame with caption).

- [ ] **Step 9: `Lighting.tsx`** — brief §6.8. Heading "Metplast Lighting Support", "T5 · T6 · LED Bulb", baked paragraph, "Applicable for:" line. Icon/graphic only, no photo, no production claims.

- [ ] **Step 10: Wire rendering** — In `ProductSection.tsx`, render `tag` (small uppercase pill above title), `topBlocks` (above the features card), `bottomBlocks` (after benefits) via `<BlockRenderer>`. In `ScrollPageTemplate.tsx`, render `config.pageBlocks` after the product-sections loop, before `<CrossLinkCards>`; and include any block `id` in `navSections` so the sticky nav can target them (append blocks with an `id` + a derived label).

- [ ] **Step 11: lint + build** — no page yet consumes blocks, so build must still pass with the new (unused) exports.

Run: `npm run lint && npm run build`
Expected: `✓ Compiled successfully`.

- [ ] **Step 12: Commit**

```bash
git add src/components/blocks src/components/ScrollPageTemplate.tsx src/components/ProductSection.tsx
git commit -m "feat: reusable content-block system (feeder/auto-flush/customization/upgrade-path/trolley/lighting/info)"
```

---

### Task 8: Layer page — S-Frame reposition, box dims, pullet, feeder materials, customization (brief §4.3, §4.6, §4.7, §4.8, §5, §10)

**Files:** Modify `src/lib/content/layer.ts`

- [ ] **Step 1: H-Type box-dimensions block (§4.3)** — add to `sections[0]` (h-type) `topBlocks`:
```ts
topBlocks: [{ type: 'info', id: 'layer-numbers', heading: 'Built on the Right Numbers',
  lines: [
    'Box front: 30 inches · Box depth: 26 inches · 10 birds per box',
    'Space per bird: 78 sq. in. (~503 cm²) · Feeding space per bird: 3 inches',
    'Feeding space decides whether every bird eats at the same time. 3 inches of feeder front per bird means no bird waits, no bird competes — so the flock grows uniform, and uniform birds give uniform eggs and stable daily production.',
    'Space per bird decides comfort. Adequate floor area lowers crowding stress, protects feather condition, and keeps livability and lay rate consistent across the full laying cycle.'
  ] }]
```

- [ ] **Step 2: S-Frame section reposition (§4.7)** — rewrite `sections[1]` (id `s-frame`):
  - `tag`: `"The Upgrade-Ready Cage"`
  - `title`: `"S-Frame Layer Cage System"`
  - `badge`: remove "Manual / Semi-Auto"; set none or `"Upgrade-Ready"`
  - `description`: brief §4.7 sub + positioning paragraph (2 entries):
    ```
    "A modern alternative to traditional California-style layer cages — start manual, grow into automation, never replace your cages.",
    "Traditional California-style cages are simple and familiar. S-Frame keeps that practicality and builds on it — a stronger GI structure, better bird space, cleaner alignment, improved airflow, and a frame that is automation-ready from day one."
    ```
  - `features`: brief §4.7 six cards (keep `[VERIFY: Prateek]` note out of user copy — render card 2 without the bracket; track VERIFY in §19). Card 2 text: `"Better Bird Space – Improved usable area per bird compared with basic California-style layouts."`
  - `benefits`: §4.7 benefits row split to array.
  - `bottomBlocks`: `[{ type: 'upgrade-path' }, { type: 'feeder-materials' }]`
  - `specs`: §13 order (Automation Level: "Manual → Semi-Auto → Automatic (same frame)"; Feeding: "Trolley available"; note trolley "available" here, not standard).
  - Delete all "cost-effective/affordable/manual operations" framing.

- [ ] **Step 3: Layer Pullet (§4.6)** — `sections[2]` (id `layer-pullet`):
  - Intro/description first paragraph: `"Pullets are chicks in their growing stage — there is no egg production and no egg collection at this stage. What matters is uniform growth, because a uniform pullet flock becomes a high-performing layer flock."`
  - `features`: brief §4.6 six items (`–` separated).
  - `specs`: ensure `{ label: "Egg Collection", value: "Not applicable (growing stage)" }`. Remove any egg-collection visual/spec.

- [ ] **Step 4: Page-level blocks (§4.8, §10)** — add to `layerConfig.pageBlocks`: `[{ type: 'customization' }]` (Customization "Built Around Your Farm Requirement" before CTA/crossLinks). Feeder-materials already inside S-Frame bottomBlocks (§5 says Layer + S-Frame section). If §5 also wants it page-level on Layer, keep the single S-Frame instance to avoid duplication — confirm placement reads once per page.

- [ ] **Step 5: lint + build + visual** (`/layer`) — confirm: box-dims block above H-Type features; S-Frame shows tag + 3-stage strip + feeder materials; pullet says "Not applicable (growing stage)"; customization block before related-solutions.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/layer.ts
git commit -m "content: layer S-Frame reposition + box dims + pullet + blocks (brief §4.3-4.8, §5, §10)"
```

---

### Task 9: Breeder page — H-Type cards, female boxes, feeding trolley, auto-flush, pullet, lighting, blocks (brief §6.2–6.9, §5, §10, §13)

**Files:** Modify `src/lib/content/breeder.ts`

- [ ] **Step 1: H-Type description (§6.2)** — `sections[0]` (id `h-type-breeder`, title `"H-Type Breeder Cage System"`):
```
A breeder cage system designed around bird comfort, controlled feeding, male-female placement, AI access, and cleaner hatching egg handling.
```

- [ ] **Step 2: 7 feature cards (§6.5)** — replace `sections[0].features` with the brief §6.5 seven items (`–` separated). Card 5 explains wire without the unverified 3 mm number. Card 6: "Custom Feeder Options – ZAM, aluminium, GI, or PVC feeders — selected per project requirement."

- [ ] **Step 3: Female box sizes block (§6.4)** — `sections[0].topBlocks`:
```ts
topBlocks: [{ type: 'info', id: 'breeder-boxes', heading: 'Box Sizes Built Around Your Breed',
  lines: [
    'Female boxes are available in three front widths — 18", 18.75", and 19.5" — housing 2 females per box.',
    'Box selection is matched to breed, target body weight, and your hatchery’s egg handling plan, so birds get the space the breed actually needs.'
  ] }]
```

- [ ] **Step 4: Feeding Trolley + Auto Flush (§6.3, §6.6)** — `sections[0].bottomBlocks: [{ type: 'feeding-trolley' }, { type: 'auto-flush' }]`. (99.7% story lives ONLY in feeding-trolley block.)

- [ ] **Step 5: Breeder specs (§13)** — set `sections[0].specs` to §13 H-Type Breeder values (Female boxes 18/18.75/19.5 in; 2 females per box; Egg collection "Planned egg roll + collection"; Manure "UV-stabilized PP belt"; Feeding "10\" touchscreen trolley, 99.7% accuracy"; Feeder materials "ZAM / Aluminium / GI / PVC").

- [ ] **Step 6: Breeder Pullet (§6.7)** — `sections[1]` (id `breeder-pullet`):
  - Intro line: `"Pullets are chicks — no egg production, no egg collection. Uniform breeder pullets are the foundation of breeder performance later."`
  - `features`: Uniform growth · Adjustable nipple line · Clean manure removal · Multi-tier option · Strong GI construction · Easy inspection (as `–` cards).
  - `specs`: `{ label: "Egg Collection", value: "Not applicable (growing stage)" }`. (Track `[VERIFY: Prateek]` breeder-pullet feeding type in §19 — keep "Automated Pan/Chain" but flag.)

- [ ] **Step 7: Lighting section (§6.8)** — add page-level `pageBlocks`: `[{ type: 'lighting' }, { type: 'customization' }]`. FeederMaterials also required on Breeder (§5) → add `{ type: 'feeder-materials' }` to `pageBlocks` (before lighting/customization). Final Breeder `pageBlocks`: `[{ type: 'feeder-materials' }, { type: 'lighting' }, { type: 'customization' }]`.

- [ ] **Step 8: lint + build + visual** (`/breeder`).

- [ ] **Step 9: Commit**

```bash
git add src/lib/content/breeder.ts
git commit -m "content: breeder H-Type cards, female boxes, trolley, auto-flush, pullet, lighting (brief §6, §5, §10)"
```

---

### Task 10: Broiler page restructure (brief §7)

**Files:** Modify `src/lib/content/broiler.ts`

- [ ] **Step 1: Hero (§7.1)** —
  - `hero.title`: `"BROILER POULTRY SYSTEMS"`
  - `hero.subtitle`: `"Designed for uniform feed access, clean water, better airflow, and practical shed management."`
  - Delete "space-saving multi-tier battery cages… superior meat yield" hero copy.
  - `intro`: neutral restructure without "battery"/"superior meat yield".

- [ ] **Step 2: Section order (§7.2)** — rebuild `sections` in this order, using §7.3 copy blocks:
  1. `deep-litter` — Deep Litter Broiler Housing (expand existing; drop "battery" cross-refs).
  2. `pan-feeding` — Pan Feeding System (§7.3 copy). New standalone section.
  3. `nipple-drinking` — Nipple Drinking System + Auto Flush → `bottomBlocks: [{ type: 'auto-flush' }]`.
  4. `curtain` — Curtain System (§7.3). New.
  5. `false-ceiling` — False Ceiling (§7.3). New.
  6. `ventilation` — Ventilation Integration (§7.3) — link to `/environmental-control` (use description + a benefit/CTA line "Explore Environmental Control →"; the existing crossLinks already point there).
  7. `h-type-broiler` — H-Type Broiler Cage System (§7.4), repositioned last. Description per §7.4; delete "high stocking density".

  For sections without photos yet, set `images: []` (ProductSection already handles empty images).

- [ ] **Step 3: Specs** — give each new section a small `specs` set consistent with §13 fields where meaningful; keep concise. H-Type Broiler specs: Cage Type, Feeding "Automated Pan", Manure "Automated Belt", Automation Level.

- [ ] **Step 4: lint + build + visual** (`/broiler`) — confirm section order, H-Type at bottom, auto-flush under nipple drinking, no "battery"/"high density"/"superior meat yield".

- [ ] **Step 5: Commit**

```bash
git add src/lib/content/broiler.ts
git commit -m "content: broiler restructure — pan/nipple/curtain/ceiling/ventilation + H-Type last (brief §7)"
```

---

## WAVE 3 — MEDIUM

### Task 11: Add /about to nav + footer (brief §11 — About is a linked page)

**Files:** Modify `src/components/Navbar.tsx` (navlinks ~line 15-30), `src/components/Footer.tsx` (links ~line 9-17)

- [ ] **Step 1:** Add `{ name: 'About', href: '/about' }` to the Navbar `navLinks` array (place after Home or before Contact — match existing UX; mobile menu inherits automatically).
- [ ] **Step 2:** Add `{ name: 'About Metplast', href: '/about' }` to the Footer links array.
- [ ] **Step 3: build + visual** — confirm About appears in header + footer and routes to `/about`.
- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: link About page in nav + footer (brief §11)"
```

---

### Task 12: About page full rebuild + Moba block (brief §11)

**Files:** Modify `src/app/(frontend)/about/page.tsx`, Create `src/components/MobaBlock.tsx`

- [ ] **Step 1:** Replace About body copy with brief §11 "About Metplast" three paragraphs (35+ years; turnkey levelled-land→running-farm; 500+ farms). Keep the page's existing hero/visual shell and Tailwind tokens.
- [ ] **Step 2: `MobaBlock.tsx`** — brief §11 Metplast × Moba block: heading "Metplast × Moba", baked paragraph, `→ moba.net` link to `https://moba.net/` (`target="_blank" rel="noopener noreferrer"`). Moba logo slot: since no logo file is confirmed yet (§19 open item #5), render a text/wordmark placeholder styled as a logo lockup with a `{/* TODO: Moba logo file from Arnav → Baljinder */}` comment. **Do not fabricate/download an external logo.**
- [ ] **Step 3:** Render `<MobaBlock />` in the About page after the values grid.
- [ ] **Step 4: build + visual** (`/about`).
- [ ] **Step 5: Commit**

```bash
git add src/app/"(frontend)"/about/page.tsx src/components/MobaBlock.tsx
git commit -m "content: About Metplast rebuild + Moba distributor block (brief §11)"
```

---

### Task 13: Metplast Community + multilingual + state chips (brief §12) — homepage

**Files:** Create `src/components/CommunitySection.tsx`, Modify `src/app/(frontend)/page.tsx`

> Quotes/translations are `[VERIFY: Ritesh/Arnav]` (§12.4, §19). Build the structure; use only verified content and keep unverified strings behind a clear placeholder so nothing unverified ships. Fix the "Satisfied Customer" placeholder (§12.2) — Saiyed Tarik needs a real farm name or the card stays hidden until Ritesh confirms.

- [ ] **Step 1: `CommunitySection.tsx`** — replicate the current testimonials layout but:
  - Section header per §12.1: Tag "Metplast Community", H2 "Farmers Who Build for the Long Run", Sub "Across states, languages, and bird types — one standard of engineering."
  - Card fields per §12.2: quote (own language + English line — until translations verified, render English only and leave a typed `quoteLocal?` field empty), farmer name + farm name (required; no "Satisfied Customer"), location chip, `bird type · system` line, one-line result.
  - Multilingual strip (§12.2): the rotating language list as a subtle marquee/wrap strip. Gate the regional strings behind a `MULTILINGUAL_VERIFIED = false` flag; when false, render only the English lead line "Built for farmers across India." with a `{/* [VERIFY: Arnav] regional strings §12.2 */}` note.
  - "Across India & Beyond" state chips (§12.3): render the chip list, but gate behind `STATES_VERIFIED` (Ritesh §12.3) — when unverified, show a conservative subset or a note. Default: render chips (they are presence claims — keep flag so Ritesh can trim).
- [ ] **Step 2:** In `page.tsx`, replace the TESTIMONIALS `<section>` (lines ~313-346) with `<CommunitySection />`.
- [ ] **Step 3:** Fix the data: remove `farm: "Satisfied Customer"` — either supply a verified farm name or drop that card behind the verify flag.
- [ ] **Step 4: build + visual** (`/`).
- [ ] **Step 5: Commit**

```bash
git add src/components/CommunitySection.tsx src/app/"(frontend)"/page.tsx
git commit -m "content: Metplast Community + multilingual strip + state chips (brief §12)"
```

---

### Task 14: Forms alignment + explicit product capture (brief §16)

**Files:** Modify `src/app/(frontend)/contact/page.tsx`; verify `src/components/Navbar.tsx` (brochure), `src/app/api/admin/enquiries/route.ts`

- [ ] **Step 1: Verify brochure form (§16)** — Navbar brochure modal already asks email OR phone, requires country code if phone, no project questions. Confirm behavior; no change expected.
- [ ] **Step 2: Verify general enquiry (§16)** — contact form already has Name · Company · Country code + Phone · Bird type · Requirement · Capacity · Timeline · Message. Confirm; no change expected.
- [ ] **Step 3: Explicit product capture (§16 product enquiry)** — in `contact/page.tsx handleSubmit`, add `product: new URLSearchParams(window.location.search).get('product') || ''` to the POST body so the API stores it via the `Product:` context line (route.ts:30 already handles `body.product`). This makes product a discrete field in the lead record, not only inside `sourceUrl`. User never re-types it (prefill already covers the visible field).
- [ ] **Step 4: build + visual** — submit a test enquiry from `/contact?product=Test%20Product`; confirm (dev DB) the enquiry message contains `Product: Test Product` and `Source: …?product=Test%20Product`.
- [ ] **Step 5: Commit**

```bash
git add src/app/"(frontend)"/contact/page.tsx
git commit -m "feat: capture product param as discrete lead field (brief §16)"
```

---

### Task 15: Spec-card consistency pass (brief §13) — remaining pages

**Files:** Modify `src/lib/content/broiler.ts`, `feed-silos.ts`, `environmental-control.ts` (align spec label order where cage-type applies)

- [ ] **Step 1:** For cage sections (broiler H-Type), ensure the §13 field order/labels are used. Non-cage sections (silos, env control) keep their own relevant specs — §13 applies to cage pages only. No forced changes to silo/env specs beyond §2/§9 removals already done.
- [ ] **Step 2: build + visual.**
- [ ] **Step 3: Commit**

```bash
git add src/lib/content
git commit -m "content: spec-card field consistency on cage sections (brief §13)"
```

---

## WAVE 4 — PHOTO/GRAPHIC PLACEHOLDERS (structure only; real assets when Prateek delivers)

### Task 16: Photo placeholder slots (brief §14) + graphic stubs (brief §15)

**Files:** the block components (Task 7) + content configs

- [ ] **Step 1:** Every `[PHOTO: Prateek]` location (brief §14 table) must render a styled empty frame with the required-photo caption as a `title`/`alt` and a visible "Photo coming soon" state — never a wrong reused image. Where a current image is wrong (Layer H-Type reused hero, S-Frame gallery crop, Breeder looks-like-layer, Broiler hero reuse, Env-control cage-shed as fan) → set `images: []` so the section renders text+specs cleanly rather than a misleading photo, OR keep a neutral placeholder. Decide per §14 priority (CRITICAL images → prefer empty over wrong).
- [ ] **Step 2:** Graphics (§15): the built blocks already stand in for graphics #1 (UpgradePath), #3 (FeedingTrolley band), #4 (AutoFlush flow), #5 (InfoBlock box explainer), #8 (multilingual strip), #9 (state chips). Leave `{/* GRAPHIC §15 #N */}` comments where a designed asset will replace the CSS version (ZAM cross-section #2, turnkey flow #6, airflow #7).
- [ ] **Step 3: build + visual** — confirm no misleading reused photos remain on the CRITICAL sections.
- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "content: photo placeholder slots + graphic stubs (brief §14-15)"
```

---

## Open Items to carry (brief §19) — do NOT publish these unverified

Track in commit messages / a follow-up; keep behind flags or placeholders:
1. Multilingual regional strings — Arnav (`MULTILINGUAL_VERIFIED` flag, Task 13).
2. S-Frame area-per-bird figure — Prateek→Arnav (S-Frame card 2 currently unnumbered, Task 8).
3. Breeder box depth + pullet specs — Prateek (spec cells, Tasks 9/15).
4. Verified testimonial quotes + regions — Ritesh (Community cards/state chips, Task 13).
5. Moba logo file — Arnav→Baljinder (MobaBlock placeholder, Task 12).

---

## Self-Review (spec coverage)

- §2 global find/replace → Task 1 (+ configs rebuilt in Tasks 5,6,8,9,10).
- §3 homepage → Task 2, §12 Community → Task 13.
- §4 Layer → Tasks 6, 8.
- §5 Feeder Materials → Task 7 (component) + Tasks 8, 9 (placement).
- §6 Breeder → Tasks 5, 9.
- §7 Broiler → Task 10.
- §8 Housing → Task 1 (step 6).
- §9 Feed Silos → Task 4.
- §10 Customization → Task 7 + Tasks 8, 9.
- §11 About+Moba → Tasks 11, 12.
- §12 Community/multilingual → Task 13.
- §13 Spec cards → Tasks 6, 9, 15.
- §14 Photos → Task 16.
- §15 Graphics → Task 7 (CSS versions) + Task 16 (stubs).
- §16 Forms → Task 14.
- §17 Responsibility / §18 Priority / §19 Open items → reflected in wave order + Open Items section.

No task left with a placeholder TODO in code except the two legitimately-blocked external assets (Moba logo, verified translations/quotes), which are gated behind flags/placeholders per §19.
