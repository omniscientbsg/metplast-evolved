// Breeder Farm Planner — MASTER DATA (canonical source).
//
// Per the spec (Metplast_Breeder_BoxSize_Logic_Board v1.0, Sections 4, 4.2, 5,
// 5.4), box sizes / equipment configs / product constants are MASTER DATA and
// live in the database so Metplast can add a box size without a code release.
// This module is the single canonical definition: it seeds the DB (prisma/
// seed) AND backs the pure engine's unit tests (no DB needed to test the math).
// The engine never hard-codes any of these numbers — it receives a MasterData
// bundle.
//
// Units: box dimensions in inches; shed dimensions in feet / millimetres.

export type PlannerProduct = 'BREEDER' | 'BREEDER_PULLET'

/** One row of a Box Size Lookup Table (Section 4 / 4.2). */
export interface BoxSizeRow {
  product: PlannerProduct
  boxSize: number
  femaleFrontIn: number
  femaleDepthIn: number
  maleFrontIn: number
  maleDepthIn: number
  fBoxesPerLine: number // nF — female boxes per tier per side per section
  mBoxesPerLine: number // nM — male boxes per tier per side (male tier)
  birdsPerFBox: number // bF
  birdsPerMBox: number // bM
  /** Male front is derived (section_length / nM), not a designed dimension. Boxes 4 & 7. See defect D6. */
  autoFitMaleFront: boolean
}

/** Equipment configuration (Section 5.4). Drives kit lengths, trolley height, front-service minimum. */
export interface EquipmentConfigRow {
  configNo: number
  description: string
  startKitFt: number
  endKitFt: number
  frontServiceMinFt: number
  addsTrolleyHeight: boolean
  availableOnPullet: boolean
}

/** Fixed product constants (Sections 5.1–5.3). Identical on every box size of a product. */
export interface ProductConstants {
  // 5.1 box geometry (in)
  boxDepthIn: number
  femaleFrontHeightIn: number
  femaleRearHeightIn: number
  maleHeightIn: number
  femaleBoxesPerLine: number
  // 5.2 vertical (mm / ft)
  legHeightMm: number
  tierHeightMm: number
  trolleyHeightMm: number
  headroomFt: number
  // 5.3 horizontal (mm)
  cageWidthMm: number
  rowWidthWithTrolleyMm: number
  centreGapMmDefault: number
  sideGapMmDefault: number
}

/** Exact mm→ft factor used by the Metplast templates (= 1/304.8). Spec §Conventions; see defect D10. */
export const MM_TO_FT = 0.00328084
/** in²→m² (1 in = 0.0254 m). */
export const IN2_TO_M2 = 0.00064516

// ---------------------------------------------------------------------------
// BROILER BREEDER box table — Section 4 (7 sizes).
// Male front for auto-fit rows (4, 7) is stored as the EXACT femaleFront*nF/nM
// so the Golden Rule compares exactly, not the rounded 24.667 / 26.000 display.
// ---------------------------------------------------------------------------
export const BREEDER_BOXES: BoxSizeRow[] = [
  { product: 'BREEDER', boxSize: 1, femaleFrontIn: 18,    femaleDepthIn: 18, maleFrontIn: 24,          maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 3, birdsPerFBox: 2, birdsPerMBox: 2, autoFitMaleFront: false },
  { product: 'BREEDER', boxSize: 2, femaleFrontIn: 18.75, femaleDepthIn: 18, maleFrontIn: 15,          maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 5, birdsPerFBox: 2, birdsPerMBox: 1, autoFitMaleFront: false },
  { product: 'BREEDER', boxSize: 3, femaleFrontIn: 18.75, femaleDepthIn: 18, maleFrontIn: 25,          maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 3, birdsPerFBox: 2, birdsPerMBox: 2, autoFitMaleFront: false },
  { product: 'BREEDER', boxSize: 4, femaleFrontIn: 18.5,  femaleDepthIn: 18, maleFrontIn: 74 / 3,      maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 3, birdsPerFBox: 2, birdsPerMBox: 2, autoFitMaleFront: true },
  { product: 'BREEDER', boxSize: 5, femaleFrontIn: 19.5,  femaleDepthIn: 18, maleFrontIn: 15.6,        maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 5, birdsPerFBox: 2, birdsPerMBox: 1, autoFitMaleFront: false },
  { product: 'BREEDER', boxSize: 6, femaleFrontIn: 19.05, femaleDepthIn: 18, maleFrontIn: 25.4,        maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 3, birdsPerFBox: 2, birdsPerMBox: 2, autoFitMaleFront: false },
  { product: 'BREEDER', boxSize: 7, femaleFrontIn: 19.5,  femaleDepthIn: 18, maleFrontIn: 78 / 3,      maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 3, birdsPerFBox: 2, birdsPerMBox: 2, autoFitMaleFront: true },
]

// ---------------------------------------------------------------------------
// BROILER BREEDER PULLET box table — Section 4.2.
// Box size 1 ONLY until Metplast confirms defect D5 (box 2 birds-per-female-box
// = 3 vs 2). Box 2 is intentionally NOT seeded yet.
// ---------------------------------------------------------------------------
export const PULLET_BOXES: BoxSizeRow[] = [
  { product: 'BREEDER_PULLET', boxSize: 1, femaleFrontIn: 18, femaleDepthIn: 18, maleFrontIn: 18, maleDepthIn: 18, fBoxesPerLine: 4, mBoxesPerLine: 4, birdsPerFBox: 3, birdsPerMBox: 2, autoFitMaleFront: false },
  // { product: 'BREEDER_PULLET', boxSize: 2, ... } // BLOCKED pending D5 confirmation.
]

// Equipment configurations — Section 5.4.
export const EQUIPMENT_CONFIGS: EquipmentConfigRow[] = [
  { configNo: 1, description: 'Manual — no auto feeding, no egg collection', startKitFt: 3.5, endKitFt: 5.8,  frontServiceMinFt: 9,  addsTrolleyHeight: false, availableOnPullet: true },
  { configNo: 2, description: 'Auto Feeding only',                            startKitFt: 6,   endKitFt: 8.8,  frontServiceMinFt: 9,  addsTrolleyHeight: true,  availableOnPullet: true },
  { configNo: 3, description: 'Auto Feeding + Auto Egg Collection',           startKitFt: 6,   endKitFt: 12.5, frontServiceMinFt: 10, addsTrolleyHeight: true,  availableOnPullet: false },
  { configNo: 4, description: 'Auto Egg Collection only (manual feeding)',    startKitFt: 3.5, endKitFt: 12.5, frontServiceMinFt: 10, addsTrolleyHeight: false, availableOnPullet: false },
]

// Product constants — Sections 5.1–5.3.
export const PRODUCT_CONSTANTS: Record<PlannerProduct, ProductConstants> = {
  BREEDER: {
    boxDepthIn: 18, femaleFrontHeightIn: 21, femaleRearHeightIn: 18, maleHeightIn: 24, femaleBoxesPerLine: 4,
    legHeightMm: 332.6, tierHeightMm: 680, trolleyHeightMm: 330, headroomFt: 1.5,
    cageWidthMm: 1253, rowWidthWithTrolleyMm: 1970, centreGapMmDefault: 1100, sideGapMmDefault: 1066,
  },
  BREEDER_PULLET: {
    boxDepthIn: 18, femaleFrontHeightIn: 21, femaleRearHeightIn: 21, maleHeightIn: 21, femaleBoxesPerLine: 4,
    legHeightMm: 332.6, tierHeightMm: 680, trolleyHeightMm: 330, headroomFt: 1.5,
    cageWidthMm: 1253, rowWidthWithTrolleyMm: 1970, centreGapMmDefault: 1273, sideGapMmDefault: 940,
  },
}

/** The full master-data bundle the engine consumes. Built from the DB in the app, from these constants in tests. */
export interface MasterData {
  boxes: BoxSizeRow[]
  configs: EquipmentConfigRow[]
  constants: Record<PlannerProduct, ProductConstants>
}

export const DEFAULT_MASTER_DATA: MasterData = {
  boxes: [...BREEDER_BOXES, ...PULLET_BOXES],
  configs: EQUIPMENT_CONFIGS,
  constants: PRODUCT_CONSTANTS,
}

// ---------------------------------------------------------------------------
// The Golden Rule (Section 6): a box size is valid only when
//   female_front × nF  ==  male_front × nM   (within 0.001 in).
// ---------------------------------------------------------------------------
export const GOLDEN_RULE_TOLERANCE_IN = 0.001

/** Section length from the female side (the authoritative value). */
export function sectionLengthIn(row: Pick<BoxSizeRow, 'femaleFrontIn' | 'fBoxesPerLine'>): number {
  return row.femaleFrontIn * row.fBoxesPerLine
}

/** Male-side length — must equal the female side. */
export function maleSideLengthIn(row: Pick<BoxSizeRow, 'maleFrontIn' | 'mBoxesPerLine'>): number {
  return row.maleFrontIn * row.mBoxesPerLine
}

/** Admin helper — the male front the row WOULD need to satisfy the Golden Rule. */
export function impliedMaleFrontIn(row: Pick<BoxSizeRow, 'femaleFrontIn' | 'fBoxesPerLine' | 'mBoxesPerLine'>): number {
  return sectionLengthIn(row) / row.mBoxesPerLine
}

/** True when the box size satisfies the Golden Rule within tolerance. */
export function isBoxSizeValid(row: Pick<BoxSizeRow, 'femaleFrontIn' | 'fBoxesPerLine' | 'maleFrontIn' | 'mBoxesPerLine'>): boolean {
  return Math.abs(sectionLengthIn(row) - maleSideLengthIn(row)) <= GOLDEN_RULE_TOLERANCE_IN
}

/** Family label: A = 3-box (nM 3), B = 5-box (nM 5). Section 3.1. */
export function boxFamily(row: Pick<BoxSizeRow, 'mBoxesPerLine'>): 'A' | 'B' {
  return row.mBoxesPerLine >= 5 ? 'B' : 'A'
}

/** Raw box-size fields as they arrive from the admin form / API (numbers may be strings). */
export interface BoxSizeInput {
  product: unknown
  boxSize: unknown
  femaleFrontIn: unknown
  femaleDepthIn: unknown
  maleFrontIn: unknown
  maleDepthIn: unknown
  fBoxesPerLine: unknown
  mBoxesPerLine: unknown
  birdsPerFBox: unknown
  birdsPerMBox: unknown
  autoFitMaleFront?: unknown
}

export type BoxSizeValidation =
  | { ok: true; row: BoxSizeRow; impliedMaleFrontIn: number }
  | { ok: false; error: string; impliedMaleFrontIn: number | null }

function posNum(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v) : (v as number)
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : null
}

function posInt(v: unknown): number | null {
  const n = posNum(v)
  return n !== null && Number.isInteger(n) ? n : null
}

/**
 * Validate and normalise an admin box-size submission (Section 6.2). Shared by
 * the client form (live feedback) and the server route (authoritative gate). On
 * an auto-fit row the male front is derived from the section length. Rejects any
 * row that fails the Golden Rule — the form must not save a mismatch.
 */
export function validateBoxSizeInput(raw: BoxSizeInput): BoxSizeValidation {
  const product = raw.product === 'BREEDER' || raw.product === 'BREEDER_PULLET' ? raw.product : null
  const boxSize = posInt(raw.boxSize)
  const femaleFrontIn = posNum(raw.femaleFrontIn)
  const femaleDepthIn = posNum(raw.femaleDepthIn)
  const maleDepthIn = posNum(raw.maleDepthIn)
  const fBoxesPerLine = posInt(raw.fBoxesPerLine)
  const mBoxesPerLine = posInt(raw.mBoxesPerLine)
  const birdsPerFBox = posInt(raw.birdsPerFBox)
  const birdsPerMBox = posInt(raw.birdsPerMBox)
  const autoFitMaleFront = Boolean(raw.autoFitMaleFront)

  if (!product) return { ok: false, error: 'Product must be BREEDER or BREEDER_PULLET.', impliedMaleFrontIn: null }
  if (boxSize === null) return { ok: false, error: 'Box size must be a positive whole number.', impliedMaleFrontIn: null }
  if (femaleFrontIn === null || femaleDepthIn === null || maleDepthIn === null)
    return { ok: false, error: 'All box dimensions must be positive numbers.', impliedMaleFrontIn: null }
  if (fBoxesPerLine === null || mBoxesPerLine === null || birdsPerFBox === null || birdsPerMBox === null)
    return { ok: false, error: 'Box and bird counts must be positive whole numbers.', impliedMaleFrontIn: null }

  const impliedMaleFrontIn = (femaleFrontIn * fBoxesPerLine) / mBoxesPerLine
  // Auto-fit rows (e.g. breeder 4 & 7) derive the male front from the section length.
  const maleFrontIn = autoFitMaleFront ? impliedMaleFrontIn : posNum(raw.maleFrontIn)
  if (maleFrontIn === null)
    return { ok: false, error: 'Male front width must be a positive number.', impliedMaleFrontIn }

  const row: BoxSizeRow = {
    product,
    boxSize,
    femaleFrontIn,
    femaleDepthIn,
    maleFrontIn,
    maleDepthIn,
    fBoxesPerLine,
    mBoxesPerLine,
    birdsPerFBox,
    birdsPerMBox,
    autoFitMaleFront,
  }

  if (!isBoxSizeValid(row)) {
    const female = sectionLengthIn(row)
    const male = maleSideLengthIn(row)
    return {
      ok: false,
      error: `Golden Rule failed: female side ${female.toFixed(3)} in ≠ male side ${male.toFixed(3)} in. Implied male front is ${impliedMaleFrontIn.toFixed(3)} in.`,
      impliedMaleFrontIn,
    }
  }

  return { ok: true, row, impliedMaleFrontIn }
}
