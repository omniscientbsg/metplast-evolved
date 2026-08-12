import { describe, it, expect } from 'vitest'
import { computeBoq } from './boq'
import { computePlanner, type PlannerInput } from './engine'

function boqFor(o: Partial<PlannerInput>) {
  const input: PlannerInput = { product: 'BREEDER', houseLengthFt: 365, rows: 5, tiers: 3, boxSize: 1, config: 3, malePer100Females: 10, ...o }
  const r = computePlanner(input)
  if (!r.ok) throw new Error('block')
  return computeBoq(r, input)
}
const qty = (b: ReturnType<typeof boqFor>, item: string) => b.lines.find((l) => l.item === item)?.qty

describe('computeBoq — TC-01 (config 3)', () => {
  const b = boqFor({})
  it('cage quantities', () => {
    expect(qty(b, 'H-Type cage — female positions')).toBe(11648)
    expect(qty(b, 'H-Type cage — male positions')).toBe(1164)
    expect(qty(b, 'Frame assembly')).toBe(5)
    expect(qty(b, 'Total sections')).toBe(275)
    expect(qty(b, 'Female boxes')).toBe(5824)
    expect(qty(b, 'Male boxes')).toBe(582)
    expect(qty(b, 'Manure belt')).toBe(15) // T×R = 3×5
    expect(qty(b, 'Feeder trough')).toBe(30) // 2×T×R
  })
  it('mats use female_boxes, not females/2 (D3)', () => {
    expect(qty(b, 'PVC cage mats')).toBe(5824)
  })
  it('nipple drinkers = female_boxes×1 + male_boxes×bM', () => {
    expect(qty(b, 'Nipple drinkers')).toBe(5824 + 582 * 2) // 6988
  })
  it('config 3 includes feeding and egg collection', () => {
    expect(qty(b, 'Automatic feeding trolley')).toBe(5)
    expect(qty(b, 'Egg collection unit')).toBe(5)
  })
  it('fan line ships as TBC (D4)', () => {
    const fan = b.lines.find((l) => l.item === '36 in circulating fans')
    expect(fan?.qty).toBeNull()
    expect(fan?.note).toMatch(/TBC/)
  })
  it('connected load computed (feeding 5×0.5 + drives 5×1.5 + cross 2×2) × 0.746', () => {
    expect(b.connectedKw).toBeCloseTo(10.44, 2) // 14 HP × 0.746
  })
})

describe('computeBoq — config gating', () => {
  it('manual config 1 has no feeding or egg lines', () => {
    const b = boqFor({ config: 1 })
    expect(b.lines.some((l) => l.group === 'Feeding')).toBe(false)
    expect(b.lines.some((l) => l.group === 'Egg collection')).toBe(false)
  })
  it('4 tiers doubles the manure drives', () => {
    const b = boqFor({ tiers: 4 })
    expect(qty(b, 'Drives')).toBe(10) // R×2
  })
})
