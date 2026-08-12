import { describe, it, expect } from 'vitest'
import { computePlanner, type PlannerInput, type PlannerResult } from './engine'
import {
  BREEDER_BOXES,
  PULLET_BOXES,
  isBoxSizeValid,
  impliedMaleFrontIn,
  sectionLengthIn,
  maleSideLengthIn,
} from './master-data'

function ok(r: PlannerResult | { ok: false }): PlannerResult {
  if (!r.ok) throw new Error(`unexpected BLOCK: ${JSON.stringify(r)}`)
  return r
}

// Section 19 — golden test cases. If the engine reproduces these, it is correct.
interface Case {
  id: string
  in: PlannerInput
  sectionsPerRow: number
  totalSections: number
  mixedSections: number
  females: number
  males: number
  total: number
  achievedPct: number
  widthFt: number
  heightFt: number
}

const B = (o: Partial<PlannerInput>): PlannerInput => ({
  product: 'BREEDER',
  houseLengthFt: 365,
  rows: 5,
  tiers: 3,
  boxSize: 1,
  config: 3,
  malePer100Females: 10,
  ...o,
})

const CASES: Case[] = [
  { id: 'TC-01', in: B({}), sectionsPerRow: 55, totalSections: 275, mixedSections: 97, females: 11648, males: 1164, total: 12812, achievedPct: 9.99, widthFt: 41.98, heightFt: 11 },
  { id: 'TC-02', in: B({ tiers: 4 }), sectionsPerRow: 54, totalSections: 270, mixedSections: 127, females: 15248, males: 1524, total: 16772, achievedPct: 9.99, widthFt: 41.98, heightFt: 13 },
  { id: 'TC-03', in: B({ boxSize: 2 }), sectionsPerRow: 52, totalSections: 260, mixedSections: 108, females: 10752, males: 1080, total: 11832, achievedPct: 10.04, widthFt: 41.98, heightFt: 11 },
  { id: 'TC-04', in: B({ boxSize: 5 }), sectionsPerRow: 50, totalSections: 250, mixedSections: 103, females: 10352, males: 1030, total: 11382, achievedPct: 9.95, widthFt: 41.98, heightFt: 11 },
  { id: 'TC-05', in: B({ config: 1 }), sectionsPerRow: 56, totalSections: 280, mixedSections: 99, females: 11856, males: 1188, total: 13044, achievedPct: 10.02, widthFt: 41.98, heightFt: 10 },
  { id: 'TC-06', in: B({ rows: 3, houseLengthFt: 250, config: 2 }), sectionsPerRow: 36, totalSections: 108, mixedSections: 38, females: 4576, males: 456, total: 5032, achievedPct: 9.97, widthFt: 26.55, heightFt: 11 },
  { id: 'TC-07', in: B({ boxSize: 3, tiers: 4, rows: 6, houseLengthFt: 400, malePer100Females: 12 }), sectionsPerRow: 58, totalSections: 348, mixedSections: 192, females: 19200, males: 2304, total: 21504, achievedPct: 12.0, widthFt: 49.7, heightFt: 13 },
  { id: 'TC-08', in: B({ boxSize: 7, rows: 4, houseLengthFt: 300, config: 4, malePer100Females: 8 }), sectionsPerRow: 41, totalSections: 164, mixedSections: 47, females: 7120, males: 564, total: 7684, achievedPct: 7.92, widthFt: 34.27, heightFt: 10 },
]

describe('computePlanner — Section 19 golden test cases', () => {
  for (const c of CASES) {
    it(`${c.id} reproduces exactly`, () => {
      const r = ok(computePlanner(c.in))
      expect(r.layout.sectionsPerRow).toBe(c.sectionsPerRow)
      expect(r.layout.totalSections).toBe(c.totalSections)
      expect(r.layout.mixedSections).toBe(c.mixedSections)
      expect(r.flock.females).toBe(c.females)
      expect(r.flock.males).toBe(c.males)
      expect(r.flock.total).toBe(c.total)
      expect(r.flock.achievedMalePct).toBeCloseTo(c.achievedPct, 2)
      expect(r.shed.widthFt).toBeCloseTo(c.widthFt, 2)
      expect(r.shed.heightFt).toBe(c.heightFt)
    })
  }
})

// Section 19.1 — full intermediate trace for TC-01.
describe('computePlanner — TC-01 full step trace (Section 19.1)', () => {
  const r = ok(computePlanner(B({})))

  it('Step 1 — section length', () => {
    expect(r.cage.sectionLengthIn).toBeCloseTo(72.0, 3)
    expect(r.cage.sectionLengthFt).toBeCloseTo(6.0, 3)
  })
  it('Step 2 — section structure', () => {
    expect(r.sectionStructure.FB).toBe(24)
    expect(r.sectionStructure.FBLow).toBe(16)
    expect(r.sectionStructure.FBTop).toBe(8)
    expect(r.sectionStructure.MB).toBe(6)
  })
  it('Step 3 — length budget', () => {
    expect(r.layout.startKitFt).toBe(6.0)
    expect(r.layout.endKitFt).toBe(12.5)
    expect(r.layout.rearServiceFt).toBe(6)
    expect(r.layout.usableForCagesFt).toBeCloseTo(330.5, 2)
  })
  it('Step 4 — sections', () => {
    expect(r.layout.sectionsPerRow).toBe(55)
    expect(r.layout.cageLengthFt).toBeCloseTo(330.0, 2)
    expect(r.layout.frontServiceFt).toBeCloseTo(10.5, 2)
    expect(r.layout.totalSections).toBe(275)
    // NOTE: Section 12's formula (row_length = house − actual_front − rear = cage+start+end)
    // gives 348.5. The 19.1 trace prints 349.0, which is house − FRONT_MIN − rear — i.e.
    // computed with the 10 ft minimum instead of the 10.5 ft actual front (the 0.5 ft dead
    // length). Following Section 12 exactly; spec inconsistency flagged to Metplast.
    expect(r.layout.rowLengthFt).toBeCloseTo(348.5, 2)
  })
  it('Step 5 — allocation', () => {
    expect(r.layout.xExact).toBeCloseTo(97.0588, 3)
    expect(r.layout.mixedSections).toBe(97)
    expect(r.layout.femaleSections).toBe(178)
  })
  it('Step 6 — bird and box counts', () => {
    expect(r.flock.femaleBoxes).toBe(5824)
    expect(r.flock.maleBoxes).toBe(582)
    expect(r.flock.females).toBe(11648)
    expect(r.flock.males).toBe(1164)
    expect(r.flock.total).toBe(12812)
    expect(r.flock.achievedMalePct).toBeCloseTo(9.9931, 3)
  })
  it('Step 7 — width', () => {
    expect(r.shed.widthMm).toBe(12797)
    expect(r.shed.widthFt).toBeCloseTo(41.98, 2)
    expect(r.shed.trolleyClearanceMm).toBeCloseTo(491.2, 1)
  })
  it('Step 8 — height', () => {
    expect(r.shed.cageHeightMm).toBeCloseTo(2372.6, 1)
    expect(r.shed.heightFt).toBe(11)
    expect(r.shed.headroomMm).toBeCloseTo(650.2, 1)
  })
  it('Step 9 — per-bird metrics', () => {
    expect(r.perBird.femaleAreaIn2).toBeCloseTo(162, 2)
    expect(r.perBird.maleAreaIn2).toBeCloseTo(216, 2)
    expect(r.perBird.femaleFeedSpaceIn).toBeCloseTo(9.0, 2)
    expect(r.perBird.maleFeedSpaceIn).toBeCloseTo(12.0, 2)
    expect(r.perBird.femaleAreaM2).toBeCloseTo(0.105, 3)
  })
  it('reports the dead length (V10 basis)', () => {
    expect(r.layout.deadLengthFt).toBeCloseTo(0.5, 2)
  })
})

describe('inline BLOCK aborts (Section 12 Steps 1 & 3)', () => {
  it('unknown box size blocks', () => {
    const r = computePlanner(B({ boxSize: 99 }))
    expect(r.ok).toBe(false)
  })
  it('shed too short blocks (V2)', () => {
    const r = computePlanner(B({ houseLengthFt: 40 }))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.code).toBe('V2')
  })
  it('pullet cannot use egg-collection configs 3/4 (V5)', () => {
    const r = computePlanner(B({ product: 'BREEDER_PULLET', boxSize: 1, config: 3 }))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.code).toBe('V5')
  })
  it('pullet box 1 on a manual config computes (bF = 3)', () => {
    const r = ok(computePlanner(B({ product: 'BREEDER_PULLET', boxSize: 1, config: 1 })))
    expect(r.cage.birdsPerFemaleBox).toBe(3)
  })
})

describe('Golden Rule master data (Section 6)', () => {
  it('every seeded breeder box satisfies the Golden Rule', () => {
    for (const b of BREEDER_BOXES) {
      expect(isBoxSizeValid(b), `box ${b.boxSize}`).toBe(true)
      expect(sectionLengthIn(b)).toBeCloseTo(maleSideLengthIn(b), 3)
    }
  })
  it('pullet box 1 satisfies the Golden Rule (box 2 withheld pending D5)', () => {
    expect(PULLET_BOXES).toHaveLength(1)
    expect(isBoxSizeValid(PULLET_BOXES[0])).toBe(true)
  })
  it('implied male front helper matches a valid row', () => {
    // Box 1: 72 / 3 = 24 in, the actual male front.
    expect(impliedMaleFrontIn(BREEDER_BOXES[0])).toBeCloseTo(24, 3)
  })
  it('rejects a fabricated mismatched row', () => {
    expect(isBoxSizeValid({ femaleFrontIn: 18, fBoxesPerLine: 4, maleFrontIn: 25, mBoxesPerLine: 3 })).toBe(false)
  })
})
