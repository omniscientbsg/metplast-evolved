// Layer Pullet cage capacity — INDEPENDENT calculator. Original WordPress
// formula RECOVERED and implemented below. Own constants — never reuse
// breeder / breeder-pullet / layer values.
export const LAYER_PULLET = {
  recovered: true,
  CM: 7,
  MU: 6.3,
  EndKit: 7.4,
  sectionLength: 8,
  baseHeight: 1.75,
  tierHeight: 2.31,
  houseHeightMargin: 2.46,
  boxAreaSqFt: 8.0,
  rowWidth: 10, // shedWidth = rows × 10
  boxesPerSectionPerTier: 4,
  birdsPerBoxOptions: [23, 24, 25] as const,
  shedLengthMin: 100,
  shedLengthMax: 450,
  rowsMin: 1,
  rowsMax: 8,
  tiersMin: 3,
  tiersMax: 6,
  // Diagram served from /public/images (LP{tiers}.png). See LAYER note re: the
  // original staging host — never hardcode it. Page hides diagram on 404.
  diagramSrc: (tiers: number) => `/images/LP${tiers}.png`,
} as const

export interface LayerPulletInput {
  shedLength: number
  rows: number
  tiers: number
  birdsPerBox: number
}

export interface LayerPulletResult {
  sectionsPerRow: number
  totalSections: number
  boxesPerSection: number
  totalBoxes: number
  birdsPerShed: number
  shedHeight: number
  shedWidth: number
  areaPerBirdSqIn: number
  ess: number
  usableLength: number // overlay only — not shown as a result row
}

export function computeLayerPullet({
  shedLength,
  rows,
  tiers,
  birdsPerBox,
}: LayerPulletInput): LayerPulletResult | { error: string } {
  if (!shedLength || shedLength < LAYER_PULLET.shedLengthMin || shedLength > LAYER_PULLET.shedLengthMax)
    return { error: `Shed length must be between ${LAYER_PULLET.shedLengthMin} and ${LAYER_PULLET.shedLengthMax} ft.` }
  if (!rows || rows < LAYER_PULLET.rowsMin || rows > LAYER_PULLET.rowsMax)
    return { error: `Rows must be between ${LAYER_PULLET.rowsMin} and ${LAYER_PULLET.rowsMax}.` }
  if (!tiers || tiers < LAYER_PULLET.tiersMin || tiers > LAYER_PULLET.tiersMax)
    return { error: `Tiers must be between ${LAYER_PULLET.tiersMin} and ${LAYER_PULLET.tiersMax}.` }
  if (!LAYER_PULLET.birdsPerBoxOptions.includes(birdsPerBox as (typeof LAYER_PULLET.birdsPerBoxOptions)[number]))
    return { error: `Birds per box must be one of ${LAYER_PULLET.birdsPerBoxOptions.join(' / ')}.` }

  const usableLength1 = shedLength - (LAYER_PULLET.CM + LAYER_PULLET.MU + LAYER_PULLET.EndKit) // shedLength − 20.7
  const sectionsPerRow = Math.floor(usableLength1 / LAYER_PULLET.sectionLength) - 1
  if (sectionsPerRow <= 0) return { error: 'Shed length too short' }

  const totalSections = sectionsPerRow * rows
  const boxesPerSection = LAYER_PULLET.boxesPerSectionPerTier * tiers
  const totalBoxes = boxesPerSection * totalSections
  const birdsPerShed = totalBoxes * birdsPerBox
  const shedHeight = LAYER_PULLET.tierHeight * tiers + LAYER_PULLET.baseHeight + LAYER_PULLET.houseHeightMargin
  const shedWidth = rows * LAYER_PULLET.rowWidth
  const areaPerBirdSqIn = (LAYER_PULLET.boxAreaSqFt * 144) / birdsPerBox
  // Original behavior: EndKit is INCLUDED in ESS. Keep it.
  const ess = LAYER_PULLET.EndKit + (usableLength1 - sectionsPerRow * LAYER_PULLET.sectionLength)
  // Overlay-only usable length (differs from sectionsPerRow × sectionLength).
  const usableLength = shedLength - (LAYER_PULLET.CM + LAYER_PULLET.MU + LAYER_PULLET.EndKit + ess)

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
