// Breeder Pullet cage capacity — restored to the original WordPress engine.
//
// INDEPENDENT calculator. These constants happen to match the pre-migration
// breeder-pullet values (CM=7, MU=6.3, EndKit=5.7, −1 section, baseHeight=1.26,
// tierHeight=2.18). The only port bug was birds-per-box, which was wrongly
// bumped from 3 → 4; it is restored to 3 here. Do NOT reuse these for Breeder
// or Layer — those are different engines.
export const BREEDER_PULLET = {
  CM: 7,
  MU: 6.3,
  EndKit: 5.7,
  sectionLength: 6,
  baseHeight: 1.26,
  tierHeight: 2.18,
  houseHeightMargin: 2.46,
  boxesPerSectionPerTier: 8,
  birdsPerBox: 3, // restored from the wrong 4
  rowWidth: 8.3,
  shedLengthMin: 100,
  shedLengthMax: 450,
  rowsMin: 1,
  rowsMax: 9,
  tiersMin: 2,
  tiersMax: 4,
} as const

export interface BreederPulletInput {
  shedLength: number
  rows: number
  tiers: number
}

export interface BreederPulletResult {
  sectionsPerRow: number
  totalSections: number
  totalBoxes: number
  totalBirds: number
  shedWidth: number
  shedHeight: number
  usableLength: number
  ess: number
}

export function computeBreederPullet({
  shedLength,
  rows,
  tiers,
}: BreederPulletInput): BreederPulletResult | { error: string } {
  if (!shedLength || shedLength < BREEDER_PULLET.shedLengthMin || shedLength > BREEDER_PULLET.shedLengthMax)
    return { error: `Shed length must be between ${BREEDER_PULLET.shedLengthMin} and ${BREEDER_PULLET.shedLengthMax} ft.` }
  if (!rows || rows < BREEDER_PULLET.rowsMin || rows > BREEDER_PULLET.rowsMax)
    return { error: `Rows must be between ${BREEDER_PULLET.rowsMin} and ${BREEDER_PULLET.rowsMax}.` }
  if (!tiers || tiers < BREEDER_PULLET.tiersMin || tiers > BREEDER_PULLET.tiersMax)
    return { error: `Tiers must be between ${BREEDER_PULLET.tiersMin} and ${BREEDER_PULLET.tiersMax}.` }

  const usableLength1 = shedLength - (BREEDER_PULLET.CM + BREEDER_PULLET.MU + BREEDER_PULLET.EndKit) // shedLength − 19
  const sectionsPerRow = Math.floor(usableLength1 / BREEDER_PULLET.sectionLength) - 1
  if (sectionsPerRow <= 0) return { error: 'Shed length too short' }

  const totalSections = sectionsPerRow * rows
  const totalBoxes = BREEDER_PULLET.boxesPerSectionPerTier * tiers * totalSections
  const totalBirds = totalBoxes * BREEDER_PULLET.birdsPerBox
  const shedHeight = BREEDER_PULLET.tierHeight * tiers + BREEDER_PULLET.baseHeight + BREEDER_PULLET.houseHeightMargin
  const shedWidth = rows * BREEDER_PULLET.rowWidth
  const usableLength = sectionsPerRow * BREEDER_PULLET.sectionLength
  const ess = usableLength1 - usableLength

  return { sectionsPerRow, totalSections, totalBoxes, totalBirds, shedWidth, shedHeight, usableLength, ess }
}
