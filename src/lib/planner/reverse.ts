// Breeder Farm Planner — REVERSE MODES (Phase 6, Section 13).
//
// Mode B: fix the bird target, get the shed length. Mode C: fix the birds AND
// the plot, rank row counts by capacity. Both derive a candidate house length,
// then ALWAYS re-run the forward engine on it so the numbers returned are the
// exact, buildable ones (Section 13.1: "Never present the reverse result directly.")

import { planForward, type PlannerReport } from './validation'
import { computePlanner } from './engine'
import { DEFAULT_MASTER_DATA, type MasterData, type PlannerProduct } from './master-data'

export interface TargetBirdsInput {
  product: PlannerProduct
  targetFemales: number
  rows: number
  tiers: number
  boxSize: number
  config: number
  malePer100Females: number
}

export interface TargetBirdsResult {
  ok: true
  recommendedHouseLengthFt: number
  sectionsPerRow: number
  nRequired: number
  report: PlannerReport // forward engine re-run on the recommended length
}

export type TargetBirdsOutcome = TargetBirdsResult | { ok: false; error: string }

/** Mode B — fix the females target, return the shed length (Section 13.1). */
export function planTargetBirds(input: TargetBirdsInput, data: MasterData = DEFAULT_MASTER_DATA): TargetBirdsOutcome {
  const box = data.boxes.find((b) => b.product === input.product && b.boxSize === input.boxSize)
  const cfg = data.configs.find((c) => c.configNo === input.config)
  if (!box) return { ok: false, error: 'This cage configuration is not available. Please contact Metplast.' }
  if (!cfg) return { ok: false, error: 'Unknown equipment configuration.' }
  if (!Number.isInteger(input.tiers) || input.tiers < 2 || input.tiers > 6)
    return { ok: false, error: 'Metplast supplies 3 and 4 tier systems as standard.' }
  if (!(input.targetFemales > 0)) return { ok: false, error: 'Enter a positive female target.' }
  if (!Number.isFinite(input.rows) || input.rows < 1 || input.rows > 12)
    return { ok: false, error: 'Please enter between 1 and 12 rows.' }

  const nF = box.fBoxesPerLine
  const bF = box.birdsPerFBox
  const bM = box.birdsPerMBox
  const nM = box.mBoxesPerLine
  const p = input.malePer100Females / 100
  const FB = nF * 2 * input.tiers
  const FB_low = nF * 2 * (input.tiers - 1)
  const FB_top = nF * 2
  const MB = nM * 2

  const sectionLengthFt = (box.femaleFrontIn * nF) / 12
  const rear = input.tiers <= 3 ? 6 : 8
  const reserves = cfg.frontServiceMinFt + rear + cfg.startKitFt + cfg.endKitFt
  const lengthForSpr = (spr: number) => spr * sectionLengthFt + reserves

  // Mixed-section fraction / average females per section (Section 13.1) — used only
  // as the starting estimate. The continuous average slightly under-counts because
  // mixed sections round, so we then find the MINIMAL sections/row that actually
  // deliver the target through the forward engine (the true buildable answer).
  const k = (p * bF * FB) / (MB * bM + p * bF * FB_top)
  const avgFPerSection = bF * (FB - k * FB_top)
  if (!(avgFPerSection > 0)) return { ok: false, error: 'Cannot solve for this configuration.' }

  const femalesForSpr = (spr: number): number => {
    if (spr < 1) return -1
    const res = computePlanner(
      { product: input.product, houseLengthFt: lengthForSpr(spr), rows: input.rows, tiers: input.tiers, boxSize: input.boxSize, config: input.config, malePer100Females: input.malePer100Females },
      data,
    )
    return res.ok ? res.flock.females : -1
  }

  let spr = Math.max(1, Math.ceil(Math.ceil(input.targetFemales / avgFPerSection) / input.rows))
  let guard = 0
  while (femalesForSpr(spr) < input.targetFemales && spr < 2000 && guard++ < 4000) spr++
  if (femalesForSpr(spr) < input.targetFemales) return { ok: false, error: 'The target cannot be reached with this configuration.' }
  while (spr > 1 && femalesForSpr(spr - 1) >= input.targetFemales) spr--

  const sectionsPerRow = spr
  const recommendedHouseLengthFt = lengthForSpr(spr)

  // Re-run the forward engine on the recommended length for the buildable numbers.
  const report = planForward(
    {
      product: input.product,
      houseLengthFt: recommendedHouseLengthFt,
      rows: input.rows,
      tiers: input.tiers,
      boxSize: input.boxSize,
      config: input.config,
      malePer100Females: input.malePer100Females,
    },
    data,
  )
  const nRequired = report.ok && report.result ? report.result.layout.totalSections : sectionsPerRow * input.rows

  return { ok: true, recommendedHouseLengthFt, sectionsPerRow, nRequired, report }
}

export interface PlotInput extends Omit<TargetBirdsInput, 'rows'> {
  maxWidthFt: number
  maxLengthFt?: number
  minRows?: number
  maxRows?: number
}

export interface PlotOption {
  rows: number
  recommendedHouseLengthFt: number
  widthFt: number
  totalBirds: number
  females: number
  males: number
}

/** Mode C — fix birds AND plot; rank row counts that fit, best capacity first (top 3). */
export function planTargetBirdsAndPlot(input: PlotInput, data: MasterData = DEFAULT_MASTER_DATA): { ok: true; options: PlotOption[] } | { ok: false; error: string } {
  if (!(input.maxWidthFt > 0)) return { ok: false, error: 'Enter a positive maximum shed width.' }
  const lo = Math.max(1, input.minRows ?? 2)
  const hi = Math.min(12, input.maxRows ?? 12)
  const options: PlotOption[] = []

  for (let rows = lo; rows <= hi; rows++) {
    const b = planTargetBirds({ ...input, rows }, data)
    if (!b.ok || !b.report.ok || !b.report.result) continue
    const res = b.report.result
    if (res.shed.widthFt > input.maxWidthFt + 1e-9) continue
    if (input.maxLengthFt && b.recommendedHouseLengthFt > input.maxLengthFt + 1e-9) continue
    options.push({
      rows,
      recommendedHouseLengthFt: b.recommendedHouseLengthFt,
      widthFt: res.shed.widthFt,
      totalBirds: res.flock.total,
      females: res.flock.females,
      males: res.flock.males,
    })
  }

  options.sort((a, b) => b.totalBirds - a.totalBirds)
  return { ok: true, options: options.slice(0, 3) }
}
