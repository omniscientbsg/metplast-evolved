// Broiler deep-litter capacity — INDEPENDENT calculator.
//
// The port hardcoded a single 1.2 sq.ft/bird density, undercounting capacity by
// ~50%. The original page let the user pick the stocking area per bird. Restored
// here as a dropdown; capacity = floor(length × width / areaPerBird).
//
// The feed / water / fan / cooling-pad outputs were NOT on the original page.
// They are gated behind `showSystemEstimates` (off) until the client approves
// them — the code is kept so it can be switched on without a rewrite.
export const BROILER = {
  areaPerBirdOptions: [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9] as const,
  shedLengthMin: 50,
  shedLengthMax: 500, // TODO: confirm against original page
  shedWidthMin: 20,
  shedWidthMax: 100, // TODO: confirm against original page
  showSystemEstimates: false, // feed/water/fan/cooling gated pending client sign-off
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
  // Only populated when BROILER.showSystemEstimates is true.
  estimates?: {
    feedLines: number
    waterLines: number
    exhaustFans: number
    coolingPadSqFt: number
  }
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

  const result: BroilerResult = { area, totalBirds, areaPerBird }

  if (BROILER.showSystemEstimates) {
    result.estimates = {
      feedLines: Math.ceil(shedWidth / 15),
      waterLines: Math.ceil(shedWidth / 10),
      exhaustFans: Math.ceil((area * 8) / 10000),
      coolingPadSqFt: Math.ceil(area / 400),
    }
  }

  return result
}
