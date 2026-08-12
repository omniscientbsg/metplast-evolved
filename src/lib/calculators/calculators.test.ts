import { describe, it, expect } from 'vitest'
import { computeBreeder } from './breeder'
import { computeBreederPullet } from './breeder-pullet'
import { computeLayer, LAYER } from './layer'
import { computeLayerPullet, LAYER_PULLET } from './layer-pullet'
import { computeBroiler } from './broiler'

// Helper: narrow away the error branch in tests.
function ok<T>(r: T | { error: string }): T {
  if (r && typeof r === 'object' && 'error' in r) throw new Error(`unexpected error: ${(r as { error: string }).error}`)
  return r as T
}

describe('computeBreeder', () => {
  it('matches the known-good 300/4/4 case (staging engine, client-confirmed 12,954)', () => {
    const r = ok(computeBreeder({ shedLength: 300, rows: 4, tiers: 4 }))
    expect(r.sectionsPerRow).toBe(46) // floor((300 − 16.6) / 6) − 1
    expect(r.totalSections).toBe(184)
    expect(r.totalBoxes).toBe(5888)
    expect(r.femaleBirds).toBe(11776)
    expect(r.maleBirds).toBe(1178) // round(11776 × 0.10)
    expect(r.totalBirds).toBe(12954)
    expect(r.shedHeight).toBeCloseTo(13.62, 2)
  })

  it('rejects out-of-range inputs', () => {
    expect(computeBreeder({ shedLength: 90, rows: 4, tiers: 4 })).toHaveProperty('error')
    expect(computeBreeder({ shedLength: 500, rows: 4, tiers: 4 })).toHaveProperty('error')
    expect(computeBreeder({ shedLength: 300, rows: 0, tiers: 4 })).toHaveProperty('error')
    expect(computeBreeder({ shedLength: 300, rows: 10, tiers: 4 })).toHaveProperty('error')
    expect(computeBreeder({ shedLength: 300, rows: 4, tiers: 1 })).toHaveProperty('error')
    expect(computeBreeder({ shedLength: 300, rows: 4, tiers: 5 })).toHaveProperty('error')
  })
})

describe('computeBreederPullet', () => {
  it('matches the known-good 300/4/4 case (birdsPerBox restored to 3)', () => {
    const r = ok(computeBreederPullet({ shedLength: 300, rows: 4, tiers: 4 }))
    expect(r.sectionsPerRow).toBe(45)
    expect(r.totalBoxes).toBe(5760)
    expect(r.totalBirds).toBe(17280)
  })

  it('rejects out-of-range inputs', () => {
    expect(computeBreederPullet({ shedLength: 90, rows: 4, tiers: 4 })).toHaveProperty('error')
    expect(computeBreederPullet({ shedLength: 300, rows: 4, tiers: 1 })).toHaveProperty('error')
  })
})

describe('computeBroiler', () => {
  it('matches the known-good 200×40 @0.65 case (density dropdown, not hardcoded 1.2)', () => {
    const r = ok(computeBroiler({ shedLength: 200, shedWidth: 40, areaPerBird: 0.65 }))
    expect(r.area).toBe(8000)
    expect(r.totalBirds).toBe(12307) // floor(8000 / 0.65)
  })

  it('honours the selected area per bird', () => {
    expect(ok(computeBroiler({ shedLength: 200, shedWidth: 40, areaPerBird: 0.9 })).totalBirds).toBe(Math.floor(8000 / 0.9))
    expect(ok(computeBroiler({ shedLength: 200, shedWidth: 40, areaPerBird: 0.6 })).totalBirds).toBe(Math.floor(8000 / 0.6))
  })

  it('rejects an area-per-bird not in the dropdown, and out-of-range dimensions (len 100–450, width 20–70)', () => {
    expect(computeBroiler({ shedLength: 200, shedWidth: 40, areaPerBird: 1.2 })).toHaveProperty('error')
    expect(computeBroiler({ shedLength: 90, shedWidth: 40, areaPerBird: 0.65 })).toHaveProperty('error')
    expect(computeBroiler({ shedLength: 460, shedWidth: 40, areaPerBird: 0.65 })).toHaveProperty('error')
    expect(computeBroiler({ shedLength: 200, shedWidth: 15, areaPerBird: 0.65 })).toHaveProperty('error')
    expect(computeBroiler({ shedLength: 200, shedWidth: 80, areaPerBird: 0.65 })).toHaveProperty('error')
  })
})

describe('computeLayer (formula recovered)', () => {
  it('is marked recovered', () => {
    expect(LAYER.recovered).toBe(true)
  })

  it('matches the known-good 300/4/4/10 case', () => {
    const r = ok(computeLayer({ shedLength: 300, rows: 4, tiers: 4, birdsPerBox: 10 }))
    expect(r.sectionsPerRow).toBe(52)
    expect(r.totalSections).toBe(208)
    expect(r.boxesPerSection).toBe(16)
    expect(r.totalBoxes).toBe(3328)
    expect(r.birdsPerShed).toBe(33280)
    expect(r.shedHeight).toBeCloseTo(12.63, 2)
    expect(r.shedWidth).toBe(40)
    expect(r.areaPerBirdSqIn).toBeCloseTo(77.96, 2)
    expect(r.ess).toBeCloseTo(13.8, 1)
  })

  it('validates the original inputs (rows 1–8, tiers 4–8, birdsPerBox 9/10/11)', () => {
    expect(computeLayer({ shedLength: 300, rows: 9, tiers: 5, birdsPerBox: 10 })).toHaveProperty('error')
    expect(computeLayer({ shedLength: 300, rows: 4, tiers: 3, birdsPerBox: 10 })).toHaveProperty('error')
    expect(computeLayer({ shedLength: 300, rows: 4, tiers: 5, birdsPerBox: 12 })).toHaveProperty('error')
    expect(computeLayer({ shedLength: 460, rows: 4, tiers: 5, birdsPerBox: 10 })).toHaveProperty('error')
  })
})

describe('computeLayerPullet (formula recovered)', () => {
  it('is marked recovered', () => {
    expect(LAYER_PULLET.recovered).toBe(true)
  })

  it('matches the known-good 300/4/4/24 case', () => {
    const r = ok(computeLayerPullet({ shedLength: 300, rows: 4, tiers: 4, birdsPerBox: 24 }))
    expect(r.sectionsPerRow).toBe(33)
    expect(r.totalSections).toBe(132)
    expect(r.totalBoxes).toBe(2112)
    expect(r.birdsPerShed).toBe(50688)
    expect(r.shedHeight).toBeCloseTo(13.45, 2)
    expect(r.areaPerBirdSqIn).toBeCloseTo(48.0, 2)
    expect(r.ess).toBeCloseTo(22.7, 1)
    expect(r.usableLength).toBeCloseTo(256.6, 1) // diagram overlay value
  })

  it('validates the original inputs (rows 1–8, tiers 3–6, birdsPerBox 23/24/25)', () => {
    expect(computeLayerPullet({ shedLength: 300, rows: 9, tiers: 4, birdsPerBox: 24 })).toHaveProperty('error')
    expect(computeLayerPullet({ shedLength: 300, rows: 4, tiers: 2, birdsPerBox: 24 })).toHaveProperty('error')
    expect(computeLayerPullet({ shedLength: 300, rows: 4, tiers: 7, birdsPerBox: 24 })).toHaveProperty('error')
    expect(computeLayerPullet({ shedLength: 300, rows: 4, tiers: 4, birdsPerBox: 22 })).toHaveProperty('error')
  })
})
