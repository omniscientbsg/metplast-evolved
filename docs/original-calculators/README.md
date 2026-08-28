# Original WordPress calculator sources (reference)

Full-page HTML captures of the original poultry shed-capacity calculators, pulled
from the WordPress staging site while it was still live. Each page embeds the
calculator's logic as inline `<script>` — this is the authoritative source the
Next.js engines in `src/lib/calculators/` were reconstructed from.

**Do not edit these files.** They are a frozen reference. The staging host
(`khaki-okapi-837379.hostingersite.com`) will eventually go away; keep these.

## Files

| File | Contains | Next.js engine |
|------|----------|----------------|
| `breeder-calculator.html` | Breeder **and** Breeder Pullet (two tabs) | `breeder.ts`, `breeder-pullet.ts` |
| `layer-calculator.html` | Layer **and** Layer Pullet (two tabs) | `layer.ts`, `layer-pullet.ts` |
| `broiler-calculator.html` | Broiler | `broiler.ts` |

## Recovered constants (as implemented)

- **Breeder** — CM=7, MU=4.1, EndKit=5.5 (reserve 16.6); `sectionsPerRow = floor(usable1/6) − 1`; female=boxes×2, males=round(F×0.10). 300/4/4 → 12,954.
- **Breeder Pullet** — CM=7, MU=6.3, EndKit=5.7; `floor(usable1/6) − 1`; birdsPerBox=3. 300/4/4 → 17,280.
- **Layer** — CM=8, MU=5.7, EC=12.5; sectionLength=5; `floor(usable1/5) − 2`; boxes/sec=4×tiers; diagram `Layer-T1{tiers}` (repo renames to `Layer-T{tiers}`). 300/4/4/10 → 33,280.
- **Layer Pullet** — CM=7, MU=6.3, EndKit=7.4; sectionLength=8; `floor(usable1/8) − 1`; boxes/sec=4×tiers; diagram `LP{tiers}`. 300/4/4/24 → 50,688.
- **Broiler** — length 100–450, width 20–70, area-per-bird 0.60–0.90 (default 0.65); `birds = floor(L×W / areaPerBird)`. 200×40 @0.65 → 8000.00 sq.ft, 12,307 birds.

## Diagram assets

Original diagrams loaded from `.../wp-content/uploads/2025/05/` on the staging
host. **Never hardcode that domain** in production code — the Next.js pages serve
from `/public/images` and hide the diagram on 404 (`onError`).
