// Broiler deep-litter capacity — verbatim port of the original WordPress engine
// (staging /broiler-calculator, recovered JS archived in
// docs/original-calculators/).
//
// The earlier port hardcoded a single 1.2 sq.ft/bird density, undercounting
// capacity by ~50%. The original page let the user pick the stocking area per
// bird (dropdown); capacity = floor(length × width / areaPerBird).
//
// The original had exactly two outputs: total shed area and total birds. The
// feed / water / fan / cooling-pad estimates were never on the original page and
// have been removed.
export const BROILER = {
  areaPerBirdOptions: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9] as const,
  shedLengthMin: 100,
  shedLengthMax: 450,
  shedWidthMin: 20,
  shedWidthMax: 70,
} as const

export interface BroilerInput {
  shedLength: number
  shedWidth: number
  areaPerBird: number
}

export interface BroilerResult {
  area: number
  totalBirds: number
  areaPerBird: number
}

export function computeBroiler({ shedLength, shedWidth, areaPerBird }: BroilerInput): BroilerResult | { error: string } {
  if (!shedLength || shedLength < BROILER.shedLengthMin || shedLength > BROILER.shedLengthMax)
    return { error: `Shed length must be between ${BROILER.shedLengthMin} and ${BROILER.shedLengthMax} ft.` }
  if (!shedWidth || shedWidth < BROILER.shedWidthMin || shedWidth > BROILER.shedWidthMax)
    return { error: `Shed width must be between ${BROILER.shedWidthMin} and ${BROILER.shedWidthMax} ft.` }
  if (!areaPerBird || !BROILER.areaPerBirdOptions.includes(areaPerBird as (typeof BROILER.areaPerBirdOptions)[number]))
    return { error: `Area per bird must be one of ${BROILER.areaPerBirdOptions.map((a) => a.toFixed(2)).join(' / ')} sq.ft.` }

  const area = shedLength * shedWidth
  const totalBirds = Math.floor(area / areaPerBird)

  return { area, totalBirds, areaPerBird }
}
