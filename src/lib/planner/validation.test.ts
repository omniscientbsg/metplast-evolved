import { describe, it, expect } from 'vitest'
import { planForward, type ForwardInput, type PlannerMessage } from './validation'
import type { PlannerInput } from './engine'

const B = (o: Partial<ForwardInput>): ForwardInput => ({
  product: 'BREEDER',
  houseLengthFt: 365,
  rows: 5,
  tiers: 3,
  boxSize: 1,
  config: 3,
  malePer100Females: 10,
  ...o,
})

const codes = (m: PlannerMessage[]) => m.map((x) => x.code)
const has = (m: PlannerMessage[], code: string) => m.some((x) => x.code === code)

describe('planForward — TC-01 through the validation layer', () => {
  it('reproduces the TC-01 result and does not BLOCK', () => {
    const rep = planForward(B({}))
    expect(rep.ok).toBe(true)
    expect(rep.result).not.toBeNull()
    expect(rep.result!.layout.sectionsPerRow).toBe(55)
    expect(rep.result!.flock.total).toBe(12812)
    expect(rep.result!.flock.females).toBe(11648)
    expect(rep.result!.flock.males).toBe(1164)
    expect(rep.result!.shed.widthFt).toBeCloseTo(41.98, 2)
    expect(rep.result!.shed.heightFt).toBe(11)
    // No BLOCK / no WARN; only the informational dead-length note (0.5 ft) may appear.
    expect(rep.messages.every((m) => m.severity === 'INFO')).toBe(true)
    expect(rep.messages.filter((m) => m.severity === 'WARN')).toHaveLength(0)
  })
})

describe('planForward — every rule fires on a crafted input (Section 15)', () => {
  it('V1 — unknown / invalid box size BLOCKs', () => {
    const rep = planForward(B({ boxSize: 99 }))
    expect(rep.ok).toBe(false)
    expect(has(rep.messages, 'V1')).toBe(true)
    expect(rep.result).toBeNull()
  })

  it('V2 — shed too short BLOCKs', () => {
    const rep = planForward(B({ houseLengthFt: 40 }))
    expect(rep.ok).toBe(false)
    expect(has(rep.messages, 'V2')).toBe(true)
  })

  it('V4 — unsupported tier count BLOCKs', () => {
    expect(has(planForward(B({ tiers: 7 })).messages, 'V4')).toBe(true)
    expect(has(planForward(B({ tiers: 1 })).messages, 'V4')).toBe(true)
  })

  it('V5 — pullet cannot use egg-collection config BLOCKs', () => {
    const rep = planForward(B({ product: 'BREEDER_PULLET', boxSize: 1, config: 3 }))
    expect(rep.ok).toBe(false)
    expect(has(rep.messages, 'V5')).toBe(true)
  })

  it('V6 — infeasible male ratio BLOCKs (box 1, 3 tiers max is 37.5%)', () => {
    const rep = planForward(B({ malePer100Females: 40 }))
    expect(rep.ok).toBe(false)
    expect(has(rep.messages, 'V6')).toBe(true)
  })

  it('V7 — ratio outside 6–15 WARNs (does not block)', () => {
    const rep = planForward(B({ malePer100Females: 4 }))
    expect(has(rep.messages, 'V7')).toBe(true)
    expect(rep.ok).toBe(true) // WARN only
  })

  it('V9 — tight trolley clearance WARNs (9 rows → ~448 mm)', () => {
    const rep = planForward(B({ rows: 9 }))
    expect(has(rep.messages, 'V9')).toBe(true)
    expect(rep.messages.find((m) => m.code === 'V9')!.severity).toBe('WARN')
    expect(rep.ok).toBe(true)
  })

  it('V10 — dead length INFO names a better box (box 5 leaves 5+ ft)', () => {
    const rep = planForward(B({ boxSize: 5 }))
    expect(has(rep.messages, 'V10')).toBe(true)
    const v10 = rep.messages.find((m) => m.code === 'V10')!
    expect(v10.severity).toBe('INFO')
    expect(v10.text).toMatch(/Box size 1/) // box 1 is the higher-capacity alternative
  })

  it('V11 — rows out of range BLOCKs', () => {
    expect(has(planForward(B({ rows: 0 })).messages, 'V11')).toBe(true)
    expect(has(planForward(B({ rows: 13 })).messages, 'V11')).toBe(true)
  })

  it('V12 — coarse rounding shows achieved != target (small shed)', () => {
    const rep = planForward(B({ rows: 1, houseLengthFt: 60, config: 1 }))
    expect(rep.ok).toBe(true)
    expect(has(rep.messages, 'V12')).toBe(true)
  })

  it('V13 — manual section override beyond capacity BLOCKs', () => {
    const rep = planForward(B({ manualSections: 999 }))
    expect(rep.ok).toBe(false)
    expect(has(rep.messages, 'V13')).toBe(true)
  })

  it('a BLOCK never returns a partial result', () => {
    const rep = planForward(B({ boxSize: 99, houseLengthFt: 40, rows: 99 }))
    expect(rep.ok).toBe(false)
    expect(rep.result).toBeNull()
    expect(codes(rep.messages).length).toBeGreaterThan(0)
  })
})
