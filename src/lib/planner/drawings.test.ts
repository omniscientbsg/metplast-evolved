import { describe, it, expect } from 'vitest'
import { computePlanner, type PlannerInput, type PlannerResult } from './engine'
import { buildPlannerDrawings } from './drawings'
import { DEFAULT_MASTER_DATA } from './master-data'

const count = (s: string, sub: string) => s.split(sub).length - 1

function run(o: Partial<PlannerInput>) {
  const input: PlannerInput = { product: 'BREEDER', houseLengthFt: 365, rows: 5, tiers: 3, boxSize: 1, config: 3, malePer100Females: 10, ...o }
  const r = computePlanner(input)
  if (!r.ok) throw new Error('unexpected block')
  return { input, r: r as PlannerResult, d: buildPlannerDrawings(r as PlannerResult, input, DEFAULT_MASTER_DATA) }
}

describe('planner drawings — cross-section', () => {
  it('renders valid SVG at 3 tiers with the right box counts', () => {
    const { d } = run({ tiers: 3 })
    expect(d.crossSection).toMatch(/^<svg/)
    expect(d.crossSection).toContain('viewBox')
    // female boxes = rows × (tiers-1) × 2 sides = 5×2×2 = 20 sloped polygons
    expect(count(d.crossSection, 'class="fbox"')).toBe(20)
    // male top tier = rows × 2 sides = 10 flat boxes
    expect(count(d.crossSection, 'class="mbox"')).toBe(10)
  })

  it('renders at 4 tiers (more female tiers, rear service 8 ft)', () => {
    const { d } = run({ tiers: 4 })
    expect(count(d.crossSection, 'class="fbox"')).toBe(30) // 5×3×2
    expect(count(d.crossSection, 'class="mbox"')).toBe(10) // males still one tier
  })

  it('omits the feeding trolley when the config has none (config 4)', () => {
    const withTrolley = run({ config: 3 }).d.crossSection
    const noTrolley = run({ config: 4, houseLengthFt: 300, rows: 4, boxSize: 7 }).d.crossSection
    expect(withTrolley).toContain('#fde68a') // trolley colour present
    expect(noTrolley).not.toContain('#fde68a')
  })
})

describe('planner drawings — plan', () => {
  it('draws every section (TC-01: 5×55 = 275)', () => {
    const { r, d } = run({ tiers: 3 })
    expect(count(d.plan, 'class="section')).toBe(r.layout.totalSections) // 275
    expect(d.plan).toContain('viewBox')
    expect(d.plan).toContain('Row 5')
  })

  it('shades roughly the right number of mixed sections (~97)', () => {
    const { d } = run({ tiers: 3 })
    const mixedRects = count(d.plan, 'class="section mixed"')
    // round(97/5)=19 per row × 5 = 95, close to the engine's 97
    expect(mixedRects).toBeGreaterThanOrEqual(90)
    expect(mixedRects).toBeLessThanOrEqual(100)
  })

  it('draws every section at 4 tiers box 3 (TC-07: 348)', () => {
    const { r, d } = run({ boxSize: 3, tiers: 4, rows: 6, houseLengthFt: 400, malePer100Females: 12 })
    expect(count(d.plan, 'class="section')).toBe(r.layout.totalSections) // 348
    expect(d.plan).toContain('Row 6')
  })
})
