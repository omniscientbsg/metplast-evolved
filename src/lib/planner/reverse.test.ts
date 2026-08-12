import { describe, it, expect } from 'vitest'
import { planTargetBirds, planTargetBirdsAndPlot } from './reverse'

describe('planTargetBirds — Mode B (Section 13.2)', () => {
  it('reverse of TC-01 returns 364.5 ft and the buildable numbers', () => {
    const out = planTargetBirds({
      product: 'BREEDER',
      targetFemales: 11648,
      rows: 5,
      tiers: 3,
      boxSize: 1,
      config: 3,
      malePer100Females: 10,
    })
    expect(out.ok).toBe(true)
    if (!out.ok) return
    expect(out.nRequired).toBe(275)
    expect(out.sectionsPerRow).toBe(55)
    expect(out.recommendedHouseLengthFt).toBeCloseTo(364.5, 2)
    // Re-run forward delivers exactly the target.
    expect(out.report.ok).toBe(true)
    expect(out.report.result!.flock.females).toBe(11648)
    expect(out.report.result!.flock.males).toBe(1164)
    expect(out.report.result!.layout.sectionsPerRow).toBe(55)
  })

  it('rejects a non-positive target', () => {
    expect(planTargetBirds({ product: 'BREEDER', targetFemales: 0, rows: 5, tiers: 3, boxSize: 1, config: 3, malePer100Females: 10 }).ok).toBe(false)
  })
})

describe('planTargetBirdsAndPlot — Mode C', () => {
  it('returns up to three row options that fit the plot width, best capacity first', () => {
    const out = planTargetBirdsAndPlot({
      product: 'BREEDER',
      targetFemales: 11648,
      tiers: 3,
      boxSize: 1,
      config: 3,
      malePer100Females: 10,
      maxWidthFt: 50,
    })
    expect(out.ok).toBe(true)
    if (!out.ok) return
    expect(out.options.length).toBeGreaterThan(0)
    expect(out.options.length).toBeLessThanOrEqual(3)
    // Every option fits the plot and is ranked by capacity (descending).
    for (const o of out.options) expect(o.widthFt).toBeLessThanOrEqual(50)
    for (let i = 1; i < out.options.length; i++) expect(out.options[i - 1].totalBirds).toBeGreaterThanOrEqual(out.options[i].totalBirds)
  })

  it('excludes row counts whose shed is wider than the plot', () => {
    const narrow = planTargetBirdsAndPlot({
      product: 'BREEDER',
      targetFemales: 11648,
      tiers: 3,
      boxSize: 1,
      config: 3,
      malePer100Females: 10,
      maxWidthFt: 20, // only 2 rows fit (~18.6 ft); 3 rows ≈ 26.5 ft is excluded
    })
    expect(narrow.ok).toBe(true)
    if (!narrow.ok) return
    for (const o of narrow.options) expect(o.widthFt).toBeLessThanOrEqual(20)
  })
})
