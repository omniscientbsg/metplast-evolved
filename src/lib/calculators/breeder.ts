// Breeder cage capacity — restored to the original WordPress engine.
//
// This calculator is INDEPENDENT. Do not share these constants with any other
// calculator: the Next.js port wrongly assumed all cage calculators used one
// engine (only birds-per-box differing), which overcounted breeder capacity by
// ~43%. Every constant here is breeder-specific.
export const BREEDER = {
  // Reserved (non-cage) length at the shed ends, in feet.
  CM: 8, // control / machine room
  MU: 6.5, // manure / service unit
  EndKit: 14.0, // end kit + walkway
  sectionLength: 6, // ft per cage section
  baseHeight: 2.52, // ft floor-to-first-tier
  tierHeight: 2.16, // ft per stacked tier
  houseHeightMargin: 2.46, // ft roof clearance
  boxesPerSectionPerTier: 8,
  femalePerBox: 2,
  maleRatio: 0.1, // males stocked at 10% of females
  rowWidth: 8.3, // ft footprint per row (cage + aisle)
  shedLengthMin: 100,
  shedLengthMax: 450,
  rowsMin: 1,
  rowsMax: 9,
  tiersMin: 2,
  tiersMax: 4,
} as const

export interface BreederInput {
  shedLength: number
  rows: number
  tiers: number
}

export interface BreederResult {
  sectionsPerRow: number
  totalSections: number
  totalBoxes: number
  femaleBirds: number
  maleBirds: number
  totalBirds: number
  shedWidth: number
  shedHeight: number
  usableLength: number
  ess: number
}

export function computeBreeder({ shedLength, rows, tiers }: BreederInput): BreederResult | { error: string } {
  if (!shedLength || shedLength < BREEDER.shedLengthMin || shedLength > BREEDER.shedLengthMax)
    return { error: `Shed length must be between ${BREEDER.shedLengthMin} and ${BREEDER.shedLengthMax} ft.` }
  if (!rows || rows < BREEDER.rowsMin || rows > BREEDER.rowsMax)
    return { error: `Rows must be between ${BREEDER.rowsMin} and ${BREEDER.rowsMax}.` }
  if (!tiers || tiers < BREEDER.tiersMin || tiers > BREEDER.tiersMax)
    return { error: `Tiers must be between ${BREEDER.tiersMin} and ${BREEDER.tiersMax}.` }

  const usableLength1 = shedLength - (BREEDER.CM + BREEDER.MU + BREEDER.EndKit) // shedLength − 28.5
  const sectionsPerRow = Math.floor(usableLength1 / BREEDER.sectionLength) - 2
  if (sectionsPerRow <= 0) return { error: 'Shed length too short' }

  const totalSections = sectionsPerRow * rows
  const totalBoxes = BREEDER.boxesPerSectionPerTier * tiers * totalSections
  const femaleBirds = totalBoxes * BREEDER.femalePerBox
  const maleBirds = Math.round(femaleBirds * BREEDER.maleRatio)
  const totalBirds = femaleBirds + maleBirds
  const shedHeight = BREEDER.tierHeight * tiers + BREEDER.baseHeight + BREEDER.houseHeightMargin
  const shedWidth = rows * BREEDER.rowWidth
  const usableLength = sectionsPerRow * BREEDER.sectionLength
  const ess = usableLength1 - usableLength

  return {
    sectionsPerRow,
    totalSections,
    totalBoxes,
    femaleBirds,
    maleBirds,
    totalBirds,
    shedWidth,
    shedHeight,
    usableLength,
    ess,
  }
}
