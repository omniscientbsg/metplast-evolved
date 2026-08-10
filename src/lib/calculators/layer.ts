// Layer cage capacity — INDEPENDENT calculator. Original WordPress formula
// RECOVERED and implemented below. Do not share these constants with any other
// calculator (Breeder / Breeder-Pullet / Layer-Pullet are all different engines).
export const LAYER = {
  recovered: true,
  CM: 8,
  MU: 5.7,
  EC: 12.5, // end column reserve
  sectionLength: 5,
  baseHeight: 1.64042,
  tierHeight: 2.132546,
  houseHeightMargin: 2.46063,
  boxAreaSqFt: 5.4138937, // floor area of one box, ft²
  rowWidth: 10, // shedWidth = rows × 10
  boxesPerSectionPerTier: 4,
  birdsPerBoxOptions: [9, 10, 11] as const,
  shedLengthMin: 100,
  shedLengthMax: 450,
  rowsMin: 1,
  rowsMax: 8,
  tiersMin: 4,
  tiersMax: 8,
  // Diagram assets. The original WP pages loaded these from a STAGING host
  // (khaki-okapi-837379.hostingersite.com) — never hardcode that. Served from
  // the app's own /public/images (canonical plain-T names). If the PNGs are not
  // migrated to production the page hides the diagram gracefully (onError).
  diagramSrc: (tiers: number) => `/images/Layer-T${tiers}.png`,
} as const

export interface LayerInput {
  shedLength: number
  rows: number
  tiers: number
  birdsPerBox: number
}

export interface LayerResult {
  sectionsPerRow: number
  totalSections: number
  boxesPerSection: number
  totalBoxes: number
  birdsPerShed: number
  shedHeight: number
  shedWidth: number
  areaPerBirdSqIn: number
  ess: number
  usableLength: number
}

export function computeLayer({ shedLength, rows, tiers, birdsPerBox }: LayerInput): LayerResult | { error: string } {
  if (!shedLength || shedLength < LAYER.shedLengthMin || shedLength > LAYER.shedLengthMax)
    return { error: `Shed length must be between ${LAYER.shedLengthMin} and ${LAYER.shedLengthMax} ft.` }
  if (!rows || rows < LAYER.rowsMin || rows > LAYER.rowsMax)
    return { error: `Rows must be between ${LAYER.rowsMin} and ${LAYER.rowsMax}.` }
  if (!tiers || tiers < LAYER.tiersMin || tiers > LAYER.tiersMax)
    return { error: `Tiers must be between ${LAYER.tiersMin} and ${LAYER.tiersMax}.` }
  if (!LAYER.birdsPerBoxOptions.includes(birdsPerBox as (typeof LAYER.birdsPerBoxOptions)[number]))
    return { error: `Birds per box must be one of ${LAYER.birdsPerBoxOptions.join(' / ')}.` }

  const usableLength1 = shedLength - (LAYER.CM + LAYER.MU + LAYER.EC) // shedLength − 26.2
  const sectionsPerRow = Math.floor(usableLength1 / LAYER.sectionLength) - 2
  if (sectionsPerRow <= 0) return { error: 'Shed length too short' }

  const usableLength = sectionsPerRow * LAYER.sectionLength
  const totalSections = sectionsPerRow * rows
  const boxesPerSection = LAYER.boxesPerSectionPerTier * tiers
  const totalBoxes = boxesPerSection * totalSections
  const birdsPerShed = totalBoxes * birdsPerBox
  const shedHeight = LAYER.tierHeight * tiers + LAYER.baseHeight + LAYER.houseHeightMargin
  const shedWidth = rows * LAYER.rowWidth
  const areaPerBirdSqIn = (LAYER.boxAreaSqFt * 144) / birdsPerBox
  const ess = shedLength - (8 + 5.7 + usableLength + 12.5)

  return {
    sectionsPerRow,
    totalSections,
    boxesPerSection,
    totalBoxes,
    birdsPerShed,
    shedHeight,
    shedWidth,
    areaPerBirdSqIn,
    ess,
    usableLength,
  }
}
