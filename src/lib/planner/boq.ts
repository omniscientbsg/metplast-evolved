// Breeder Farm Planner — BILL OF QUANTITIES (Phase 7, Section 17).
//
// Derives every quantity the planner outputs from a computed PlannerResult.
// Per the approved decisions: the 36-in circulating fan line ships as TBC
// (defect D4 — broken Excel formula, awaiting Metplast), and PVC cage mats use
// female_boxes (defect D3), never females/2. Silo/ventilation sizing are
// separate Phase 2 modules and are surfaced as client-selected placeholders.

import type { PlannerResult } from './engine'
import type { PlannerInput } from './engine'

export interface BoqLine {
  group: string
  item: string
  qty: number | null // null = to be confirmed / client-selected
  unit: string
  note?: string
}

export interface Boq {
  lines: BoqLine[]
  connectedKw: number
}

const HP_TO_KW = 0.746

export function computeBoq(res: PlannerResult, input: PlannerInput): Boq {
  const R = input.rows
  const T = input.tiers
  const N = res.layout.totalSections
  const femaleBoxes = res.flock.femaleBoxes
  const maleBoxes = res.flock.maleBoxes
  const bM = res.cage.birdsPerMaleBox
  const isPullet = input.product === 'BREEDER_PULLET'
  const hasFeeding = input.config === 2 || input.config === 3
  const hasEgg = input.config === 3 || input.config === 4
  const widthM = res.shed.widthMm / 1000
  const manureDrives = T >= 4 ? R * 2 : R

  const lines: BoqLine[] = [
    // 17.1 Cage system
    { group: 'Cage', item: 'H-Type cage — female positions', qty: res.flock.females, unit: 'birds' },
    { group: 'Cage', item: 'H-Type cage — male positions', qty: res.flock.males, unit: 'birds' },
    { group: 'Cage', item: 'Frame assembly', qty: R, unit: 'rows' },
    { group: 'Cage', item: 'Total sections', qty: N, unit: 'nos' },
    { group: 'Cage', item: 'Female boxes', qty: femaleBoxes, unit: 'nos' },
    { group: 'Cage', item: 'Male boxes', qty: maleBoxes, unit: 'nos' },
    { group: 'Cage', item: 'Manure belt', qty: T * R, unit: 'runs', note: '1.2 mm white UV-treated, one per tier per row' },
    { group: 'Cage', item: 'Feeder trough', qty: 2 * T * R, unit: 'runs', note: 'ZAM coated, 2 per tier per row' },
    { group: 'Cage', item: 'PVC cage mats', qty: femaleBoxes, unit: 'nos', note: 'one per female box (D3)' },

    // 17.2 Drinking system
    {
      group: 'Drinking',
      item: 'Nipple drinkers',
      qty: isPullet ? femaleBoxes * 2 + maleBoxes * 2 : femaleBoxes * 1 + maleBoxes * bM,
      unit: 'nos',
      note: isPullet ? '2 per box both sexes' : `1 per female box, ${bM} per male box`,
    },
    { group: 'Drinking', item: 'Water tank / pressure regulator', qty: T * R, unit: 'nos', note: 'one per tier per row' },
    { group: 'Drinking', item: 'Filters 70 & 50 micron', qty: 1, unit: 'set' },
  ]

  // 17.3 Feeding system (config 2 & 3 only)
  if (hasFeeding) {
    lines.push(
      { group: 'Feeding', item: 'Automatic feeding trolley', qty: R, unit: 'nos', note: '0.5 HP geared motor' },
      { group: 'Feeding', item: 'Feeding trolley control panel', qty: R, unit: 'nos' },
      { group: 'Feeding', item: 'Vertical screw conveyor, 2 HP', qty: 1, unit: 'nos' },
      { group: 'Feeding', item: 'Conveying length, silo to hoppers', qty: Math.round((widthM + 9) * 100) / 100, unit: 'm', note: 'from shed WIDTH' },
      { group: 'Feeding', item: 'Load cell weighing system', qty: 1, unit: 'nos' },
      { group: 'Feeding', item: 'Silo', qty: null, unit: 'nos', note: 'client selects capacity (separate module)' },
      { group: 'Feeding', item: 'Spiral bends', qty: null, unit: 'nos', note: 'depends on silo count' },
    )
  }

  // 17.4 Egg collection (config 3 & 4 only)
  if (hasEgg) {
    lines.push(
      { group: 'Egg collection', item: 'Egg collection unit', qty: R, unit: 'nos', note: 'one per row' },
      { group: 'Egg collection', item: 'Drive unit with assembly', qty: R, unit: 'nos' },
      { group: 'Egg collection', item: 'Control panel', qty: 1, unit: 'nos' },
    )
  }

  // 17.5 Manure removal
  lines.push(
    { group: 'Manure', item: 'Manure removal heads', qty: R, unit: 'nos' },
    { group: 'Manure', item: 'Scrapers', qty: R * T, unit: 'nos' },
    { group: 'Manure', item: 'Drives', qty: manureDrives, unit: 'nos', note: T >= 4 ? 'doubled at 4+ tiers' : undefined },
    { group: 'Manure', item: 'Cross manure conveyor', qty: Math.round(widthM * 100) / 100, unit: 'm' },
    { group: 'Manure', item: 'Cross conveyor drive, 2 HP', qty: 1, unit: 'nos' },
    { group: 'Manure', item: 'Inclined conveyor', qty: 10, unit: 'm', note: 'default, site dependent' },
    { group: 'Manure', item: 'Inclined drive / buffer hopper / support legs', qty: 1, unit: 'set' },
    { group: 'Manure', item: 'Control panel', qty: 1, unit: 'nos' },
  )

  // 17.6 Other
  lines.push(
    { group: 'Other', item: 'Inspection trolley for AI', qty: Math.max(0, R - 1), unit: 'nos', note: 'one per walkway between rows' },
    { group: 'Other', item: 'Lighting system, dimmable 0–100 %', qty: R, unit: 'nos' },
    { group: 'Other', item: 'Lighting control panel', qty: 1, unit: 'nos' },
    { group: 'Other', item: '36 in circulating fans', qty: null, unit: 'nos', note: 'TBC — defect D4, awaiting Metplast formula' },
  )

  // 17.7 Connected electrical load (excludes silo & ventilation Phase 2 modules)
  const sumHp = (hasFeeding ? R * 0.5 : 0) + manureDrives * 1.5 + 2 * 2.0
  const connectedKw = Math.round(sumHp * HP_TO_KW * 100) / 100

  return { lines, connectedKw }
}
