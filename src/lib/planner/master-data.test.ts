import { describe, it, expect } from 'vitest'
import { validateBoxSizeInput, BREEDER_BOXES } from './master-data'

const base = {
  product: 'BREEDER',
  boxSize: 8,
  femaleFrontIn: 18,
  femaleDepthIn: 18,
  maleFrontIn: 24,
  maleDepthIn: 18,
  fBoxesPerLine: 4,
  mBoxesPerLine: 3,
  birdsPerFBox: 2,
  birdsPerMBox: 2,
  autoFitMaleFront: false,
}

describe('validateBoxSizeInput — admin Golden Rule gate (Phase 1 acceptance)', () => {
  it('accepts a matching row (72 = 72)', () => {
    const v = validateBoxSizeInput(base)
    expect(v.ok).toBe(true)
    if (v.ok) expect(v.impliedMaleFrontIn).toBeCloseTo(24, 3)
  })

  it('REJECTS a mismatched row and reports the implied male front', () => {
    const v = validateBoxSizeInput({ ...base, maleFrontIn: 25 }) // 25×3 = 75 ≠ 72
    expect(v.ok).toBe(false)
    if (!v.ok) {
      expect(v.error).toMatch(/Golden Rule failed/)
      expect(v.impliedMaleFrontIn).toBeCloseTo(24, 3)
    }
  })

  it('auto-fit derives the male front from the section length (box 4: 74/3)', () => {
    const v = validateBoxSizeInput({ ...base, boxSize: 4, femaleFrontIn: 18.5, maleFrontIn: '', autoFitMaleFront: true })
    expect(v.ok).toBe(true)
    if (v.ok) {
      expect(v.row.maleFrontIn).toBeCloseTo(74 / 3, 6)
      expect(v.row.maleFrontIn * v.row.mBoxesPerLine).toBeCloseTo(74, 6)
    }
  })

  it('coerces string numbers from the form', () => {
    const v = validateBoxSizeInput({ ...base, femaleFrontIn: '18', fBoxesPerLine: '4', maleFrontIn: '24', mBoxesPerLine: '3' })
    expect(v.ok).toBe(true)
  })

  it('rejects non-positive or non-numeric fields', () => {
    expect(validateBoxSizeInput({ ...base, femaleFrontIn: 0 }).ok).toBe(false)
    expect(validateBoxSizeInput({ ...base, mBoxesPerLine: 'abc' }).ok).toBe(false)
    expect(validateBoxSizeInput({ ...base, product: 'DUCK' }).ok).toBe(false)
    expect(validateBoxSizeInput({ ...base, boxSize: 2.5 }).ok).toBe(false)
  })

  it('every seeded breeder box passes the admin validator too', () => {
    for (const b of BREEDER_BOXES) {
      expect(validateBoxSizeInput(b).ok, `box ${b.boxSize}`).toBe(true)
    }
  })
})
