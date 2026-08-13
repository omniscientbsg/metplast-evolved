// Breeder Farm Planner — VALIDATION LAYER (Phase 3, Section 15).
//
// Wraps the pure engine and returns structured messages (BLOCK / WARN / INFO).
// A single BLOCK stops the calculation entirely — never a partial result, never
// a string flowing into arithmetic (Section 15 note). This is the entry point
// the client UI calls.

import { computePlanner, type PlannerInput, type PlannerResult } from './engine'
import { DEFAULT_MASTER_DATA, isBoxSizeValid, MM_TO_FT, type MasterData } from './master-data'

// D9 (Arnav, 12 Aug 2026): walkway is the FEEDER-TO-FEEDER gap, not trolley
// clearance. Warn below 3.5 ft, block below 3.0 ft. Thresholds in mm: 1066 is
// Metplast's own 3.5 ft standard side gap (so the default does not self-warn);
// 914 mm = 3.0 ft. (Arnav's doc rounds 3.5 ft up to 1067; using the 1066
// standard avoids warning the default breeder gap — flagged to Arnav.)
const WALKWAY_WARN_MM = 1066
const WALKWAY_BLOCK_MM = 914

export type Severity = 'BLOCK' | 'WARN' | 'INFO'

export interface PlannerMessage {
  code: string
  severity: Severity
  text: string
}

export interface PlannerReport {
  ok: boolean // false if any BLOCK is present
  messages: PlannerMessage[]
  result: PlannerResult | null // null whenever ok is false
}

/** Forward-mode input, plus the optional manual-section override that rule V13 guards. */
export type ForwardInput = PlannerInput & { manualSections?: number }

/** Best alternative box size for the same shed — powers the V10 dead-length hint. */
function bestAlternativeBox(
  input: PlannerInput,
  data: MasterData,
  currentTotal: number,
): { boxSize: number; extra: number } | null {
  let best: { boxSize: number; total: number } | null = null
  for (const b of data.boxes) {
    if (b.product !== input.product || b.boxSize === input.boxSize) continue
    const r = computePlanner({ ...input, boxSize: b.boxSize }, data)
    if (r.ok && r.flock.total > currentTotal && (!best || r.flock.total > best.total)) {
      best = { boxSize: b.boxSize, total: r.flock.total }
    }
  }
  return best ? { boxSize: best.boxSize, extra: best.total - currentTotal } : null
}

export function planForward(input: ForwardInput, data: MasterData = DEFAULT_MASTER_DATA): PlannerReport {
  const messages: PlannerMessage[] = []
  const push = (code: string, severity: Severity, text: string) => messages.push({ code, severity, text })
  const blocked = () => messages.some((m) => m.severity === 'BLOCK')

  // ---- Input-level checks (before any math) -----------------------------
  // V11 — rows sanity
  if (!Number.isFinite(input.rows) || input.rows < 1 || input.rows > 12)
    push('V11', 'BLOCK', 'Please enter between 1 and 12 rows.')
  // V4 — tier count supported
  if (!Number.isInteger(input.tiers) || input.tiers < 2 || input.tiers > 6)
    push('V4', 'BLOCK', 'Metplast supplies 3 and 4 tier systems as standard. Contact us for other heights.')
  // V7 — ratio sanity (WARN, not a block)
  if (Number.isFinite(input.malePer100Females) && (input.malePer100Females < 6 || input.malePer100Females > 15))
    push('V7', 'WARN', 'Typical broiler breeder ratios are 8 to 12 males per 100 females. Please confirm.')

  const box = data.boxes.find((b) => b.product === input.product && b.boxSize === input.boxSize)
  const cfg = data.configs.find((c) => c.configNo === input.config)

  // V1 — box size validity (existence + Golden Rule)
  if (!box) push('V1', 'BLOCK', 'This cage configuration is not available. Please contact Metplast.')
  else if (!isBoxSizeValid(box)) push('V1', 'BLOCK', 'This cage configuration is not available. Please contact Metplast.')
  if (!cfg) push('CONFIG', 'BLOCK', 'Unknown equipment configuration.')

  // V5 — config valid for product
  if (box && cfg && input.product === 'BREEDER_PULLET' && !cfg.availableOnPullet)
    push('V5', 'BLOCK', 'Egg collection is not applicable to a rearing (pullet) house.')

  // V6 — ratio feasibility (males can only ever occupy the top tier)
  if (box && Number.isInteger(input.tiers) && input.tiers >= 2 && input.tiers <= 6) {
    const FB_low = box.fBoxesPerLine * 2 * (input.tiers - 1)
    const MB = box.mBoxesPerLine * 2
    const maxRatio = (MB * box.birdsPerMBox) / (FB_low * box.birdsPerFBox) // fraction
    if (input.malePer100Females / 100 > maxRatio)
      push(
        'V6',
        'BLOCK',
        `The requested male ratio cannot be achieved with this cage. Maximum is ${(maxRatio * 100).toFixed(1)} males per 100 females.`,
      )
  }

  // V13 — manual override consistency (dormant unless a manual section count is supplied)
  if (box && cfg && typeof input.manualSections === 'number') {
    const front_min = cfg.frontServiceMinFt
    const rear = input.tiers <= 3 ? 6 : 8
    const usable = input.houseLengthFt - front_min - rear - cfg.startKitFt - cfg.endKitFt
    const section_length_ft = (box.femaleFrontIn * box.fBoxesPerLine) / 12
    if (input.manualSections * section_length_ft > usable + 1e-9)
      push('V13', 'BLOCK', 'Too many sections for this shed length.')
  }

  if (blocked()) return { ok: false, messages, result: null }

  // ---- Run the engine ---------------------------------------------------
  const r = computePlanner(input, data)
  if (!r.ok) {
    // Engine BLOCK (e.g. V2 — shed too short). Carry its code + message.
    push(r.error.code, 'BLOCK', r.error.message)
    return { ok: false, messages, result: null }
  }

  // ---- Post-computation checks ------------------------------------------
  // V3 — front service area (internal guard; unreachable by construction, kept per §15)
  if (cfg && r.layout.frontServiceFt < cfg.frontServiceMinFt - 1e-9)
    push('V3', 'BLOCK', 'Front service area is below the minimum of 9 ft (10 ft with egg collection). Increase shed length.')

  // V8 — cage length consistency (internal guard)
  if (cfg) {
    const expected = input.houseLengthFt - r.layout.frontServiceFt - r.layout.rearServiceFt - r.layout.startKitFt - r.layout.endKitFt
    if (Math.abs(r.layout.cageLengthFt - expected) > 1e-6)
      push('V8', 'BLOCK', 'Cage length mismatch. Internal error - log and alert.')
  }

  // V9 (D9) — feeder-to-feeder walkway gaps. Warn below 3.5 ft, block below 3.0 ft.
  const gaps: [string, number][] = [
    ...(input.rows > 1 ? ([['centre', r.shed.centreGapMm]] as [string, number][]) : []),
    ['side', r.shed.sideGapMm],
  ]
  for (const [name, mm] of gaps) {
    const ft = mm * MM_TO_FT
    if (mm < WALKWAY_BLOCK_MM)
      push('V9', 'BLOCK', `The ${name} walkway gap is only ${ft.toFixed(2)} ft (${mm.toFixed(0)} mm), below the 3.0 ft (914 mm) minimum. Increase the ${name} gap or reduce rows.`)
    else if (mm < WALKWAY_WARN_MM)
      push('V9', 'WARN', `The ${name} walkway gap is ${ft.toFixed(2)} ft (${mm.toFixed(0)} mm), below the recommended 3.5 ft. Please confirm.`)
  }

  // V10 — dead length (INFO). NOTE: §15's literal condition (deadLength > section
  // length) can never fire — deadLength is always < one section. Implemented per
  // the §9.3 / D11 intent (surface any unused length + the better box size).
  // Spec erratum flagged to Metplast.
  if (r.layout.deadLengthFt > 0.01) {
    const alt = bestAlternativeBox(input, data, r.flock.total)
    push(
      'V10',
      'INFO',
      alt
        ? `${r.layout.deadLengthFt.toFixed(2)} ft of shed length is unused. Box size ${alt.boxSize} could add approximately ${alt.extra.toLocaleString()} more birds.`
        : `${r.layout.deadLengthFt.toFixed(2)} ft of shed length is unused.`,
    )
  }

  // V12 — achieved vs target ratio (INFO)
  if (Math.abs(r.flock.achievedMalePct - r.flock.targetMalePct) > 0.5)
    push(
      'V12',
      'INFO',
      `Sections are indivisible, so the achieved ratio is ${r.flock.achievedMalePct.toFixed(2)} %, not the requested ${r.flock.targetMalePct.toFixed(2)} %.`,
    )

  // A post-check BLOCK (V3/V8) must still suppress the result.
  if (blocked()) return { ok: false, messages, result: null }
  return { ok: true, messages, result: r }
}
