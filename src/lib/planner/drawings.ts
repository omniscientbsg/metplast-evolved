// Breeder Farm Planner — DRAWING ENGINE (Phase 5, Section 16).
//
// Pure functions that turn a computed PlannerResult into two scaled SVG strings:
// Drawing A (cross-section, end-on) and Drawing B (plan, top-down). Fully
// determined by the numbers already computed — no extra input. Coordinates are
// in millimetres; the SVG viewBox scales to the container.

import type { PlannerResult } from './engine'
import type { PlannerInput } from './engine'
import { MM_TO_FT, type MasterData, type ProductConstants } from './master-data'

const COL = {
  outline: '#334155',
  female: '#bfdbfe',
  femaleStroke: '#3b82f6',
  male: '#fb923c',
  maleStroke: '#c2410c',
  service: '#e2e8f0',
  kit: '#cbd5e1',
  belt: '#94a3b8',
  trolley: '#fde68a',
  trolleyStroke: '#d97706',
  dim: '#475569',
  text: '#1e293b',
  muted: '#64748b',
}

const ftToMm = (ft: number) => ft / MM_TO_FT

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Even distribution of mixed sections along a row (Section 16.3).
function mixedPositions(sectionsPerRow: number, mixedSections: number, rows: number): Set<number> {
  const perRow = Math.round(mixedSections / rows)
  const set = new Set<number>()
  if (perRow <= 0 || sectionsPerRow <= 0) return set
  const step = sectionsPerRow / perRow
  for (let i = 0; i < perRow; i++) {
    const pos = Math.floor(i * step + step / 2)
    if (pos < sectionsPerRow) set.add(pos)
  }
  return set
}

interface Ctx {
  cfg: MasterData['configs'][number]
  c: ProductConstants
  nF: number
  nM: number
}

function resolve(input: PlannerInput, data: MasterData): Ctx | null {
  const cfg = data.configs.find((k) => k.configNo === input.config)
  const c = data.constants[input.product]
  const box = data.boxes.find((b) => b.product === input.product && b.boxSize === input.boxSize)
  if (!cfg || !c || !box) return null
  return { cfg, c, nF: box.fBoxesPerLine, nM: box.mBoxesPerLine }
}

// ---------------------------------------------------------------------------
// Drawing A — cross-section (looking down the length of the shed).
// ---------------------------------------------------------------------------
export function buildCrossSection(res: PlannerResult, input: PlannerInput, data: MasterData): string {
  const ctx = resolve(input, data)
  if (!ctx) return ''
  const { cfg, c, nM } = ctx
  const W = res.shed.widthMm
  const H = res.shed.heightMm
  const side = res.shed.sideGapMm
  const centre = res.shed.centreGapMm
  const rows = input.rows
  const tiers = input.tiers
  const leg = c.legHeightMm
  const tierH = c.tierHeightMm
  const depth = c.boxDepthIn * 25.4 // 18 in → 457.2 mm
  const hasTrolley = cfg.addsTrolleyHeight
  const trolleyH = hasTrolley ? c.trolleyHeightMm : 0
  const cageTop = leg + tiers * tierH

  const padX = W * 0.14
  const padTop = H * 0.24
  const padBot = H * 0.34
  const vbW = W + padX * 2
  const vbH = H + padTop + padBot
  const sw = Math.max(W, H) / 480
  const fs = Math.max(W, H) / 42
  const ox = padX
  const floorY = padTop + H
  const Y = (mm: number) => floorY - mm // height → svg-y

  const p: string[] = []
  p.push(`<svg viewBox="0 0 ${vbW.toFixed(0)} ${vbH.toFixed(0)}" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif">`)
  p.push(`<rect x="0" y="0" width="${vbW.toFixed(0)}" height="${vbH.toFixed(0)}" fill="white"/>`)

  // Shed outline + floor
  p.push(`<rect x="${ox}" y="${padTop}" width="${W}" height="${H}" fill="none" stroke="${COL.outline}" stroke-width="${sw * 2}"/>`)
  p.push(`<line x1="${ox}" y1="${floorY}" x2="${ox + W}" y2="${floorY}" stroke="${COL.outline}" stroke-width="${sw * 3}"/>`)

  const rowPitch = c.cageWidthMm + centre
  const femaleFrontH = c.femaleFrontHeightIn * 25.4
  const femaleRearH = c.femaleRearHeightIn * 25.4
  const maleH = c.maleHeightIn * 25.4

  // D7 (Arnav, 12 Aug 2026): males sit on the MIDDLE tier by default (customer-
  // changeable). Bird arithmetic is unaffected — one male tier either way.
  const maleTierIndex = Math.round((tiers - 1) / 2)
  for (let r = 0; r < rows; r++) {
    const x0 = ox + side + r * rowPitch
    const leftX = x0
    const rightX = x0 + c.cageWidthMm - depth
    for (let t = 0; t < tiers; t++) {
      const yb = leg + t * tierH
      const isMaleTop = t === maleTierIndex // depict a MIXED section: male middle tier (Section 16.1 / D7)
      // manure belt under each tier
      p.push(`<line x1="${x0}" y1="${Y(yb).toFixed(1)}" x2="${x0 + c.cageWidthMm}" y2="${Y(yb).toFixed(1)}" stroke="${COL.belt}" stroke-width="${sw}" stroke-dasharray="${(sw * 6).toFixed(0)} ${(sw * 4).toFixed(0)}"/>`)
      if (isMaleTop) {
        // flat male boxes, both sides
        for (const bx of [leftX, rightX]) {
          p.push(`<rect class="mbox" x="${bx.toFixed(1)}" y="${Y(yb + maleH).toFixed(1)}" width="${depth.toFixed(1)}" height="${maleH.toFixed(1)}" fill="${COL.male}" stroke="${COL.maleStroke}" stroke-width="${sw}"/>`)
        }
      } else {
        // sloped female boxes (front = outer edge, taller)
        // left box: outer = left
        const lb = [
          [leftX, Y(yb)],
          [leftX, Y(yb + femaleFrontH)],
          [leftX + depth, Y(yb + femaleRearH)],
          [leftX + depth, Y(yb)],
        ]
        const rb = [
          [rightX, Y(yb)],
          [rightX, Y(yb + femaleRearH)],
          [rightX + depth, Y(yb + femaleFrontH)],
          [rightX + depth, Y(yb)],
        ]
        for (const poly of [lb, rb]) {
          p.push(`<polygon class="fbox" points="${poly.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ')}" fill="${COL.female}" stroke="${COL.femaleStroke}" stroke-width="${sw}"/>`)
        }
      }
    }
    // feeding trolley on top
    if (hasTrolley) {
      const tw = c.rowWidthWithTrolleyMm
      const tx = x0 + c.cageWidthMm / 2 - tw / 2
      p.push(`<rect x="${tx.toFixed(1)}" y="${Y(cageTop + trolleyH).toFixed(1)}" width="${tw.toFixed(1)}" height="${trolleyH.toFixed(1)}" fill="${COL.trolley}" stroke="${COL.trolleyStroke}" stroke-width="${sw}"/>`)
    }
  }

  // Overall width dimension (below floor)
  const dw = floorY + padBot * 0.45
  p.push(`<line x1="${ox}" y1="${dw}" x2="${ox + W}" y2="${dw}" stroke="${COL.dim}" stroke-width="${sw}"/>`)
  p.push(`<text x="${ox + W / 2}" y="${dw + fs * 1.2}" font-size="${fs}" fill="${COL.text}" text-anchor="middle">Shed width ${res.shed.widthFt.toFixed(2)} ft (${W.toLocaleString()} mm)</text>`)
  // Overall height dimension (right)
  const dh = ox + W + padX * 0.5
  p.push(`<line x1="${dh}" y1="${padTop}" x2="${dh}" y2="${floorY}" stroke="${COL.dim}" stroke-width="${sw}"/>`)
  p.push(`<text x="${dh + fs * 0.4}" y="${padTop + H / 2}" font-size="${fs}" fill="${COL.text}" text-anchor="middle" transform="rotate(90 ${dh + fs * 0.4} ${padTop + H / 2})">Shed height ${res.shed.heightFt} ft</text>`)
  // Headroom
  p.push(`<text x="${ox + W - fs}" y="${Y(cageTop + trolleyH) - fs * 0.5}" font-size="${fs * 0.85}" fill="${COL.muted}" text-anchor="end">headroom ${res.shed.headroomMm.toFixed(0)} mm</text>`)

  // Title + legend + male-tier callout
  p.push(`<text x="${ox}" y="${padTop * 0.5}" font-size="${fs * 1.15}" font-weight="700" fill="${COL.text}">Cross-section — ${tiers} tiers × ${rows} rows (mixed section, male on middle tier)</text>`)
  const ly = padTop * 0.78
  p.push(`<rect x="${ox}" y="${ly - fs * 0.8}" width="${fs}" height="${fs}" fill="${COL.female}" stroke="${COL.femaleStroke}" stroke-width="${sw}"/>`)
  p.push(`<text x="${ox + fs * 1.3}" y="${ly}" font-size="${fs * 0.9}" fill="${COL.text}">Female (${res.cage.femaleBoxesPerLine}/line, sloped)</text>`)
  p.push(`<rect x="${ox + W * 0.42}" y="${ly - fs * 0.8}" width="${fs}" height="${fs}" fill="${COL.male}" stroke="${COL.maleStroke}" stroke-width="${sw}"/>`)
  p.push(`<text x="${ox + W * 0.42 + fs * 1.3}" y="${ly}" font-size="${fs * 0.9}" fill="${COL.text}">Male middle tier (${nM}/line)</text>`)

  p.push(`</svg>`)
  return p.join('')
}

// ---------------------------------------------------------------------------
// Drawing B — plan (looking down on the shed).
// ---------------------------------------------------------------------------
export function buildPlan(res: PlannerResult, input: PlannerInput, data: MasterData): string {
  const ctx = resolve(input, data)
  if (!ctx) return ''
  const { c, nF, nM } = ctx
  const L = ftToMm(input.houseLengthFt)
  const Wp = res.shed.widthMm
  const front = ftToMm(res.layout.frontServiceFt)
  const rear = ftToMm(res.layout.rearServiceFt)
  const start = ftToMm(res.layout.startKitFt)
  const end = ftToMm(res.layout.endKitFt)
  const secLen = ftToMm(res.cage.sectionLengthFt)
  const spr = res.layout.sectionsPerRow
  const rows = input.rows
  const side = res.shed.sideGapMm
  const centre = res.shed.centreGapMm

  const padX = L * 0.05
  const padTop = Wp * 0.55
  const padBot = Wp * 0.7
  const vbW = L + padX * 2
  const vbH = Wp + padTop + padBot
  const sw = Math.max(L, Wp) / 900
  const fs = Wp / 6
  const ox = padX
  const oy = padTop
  const mixed = mixedPositions(spr, res.layout.mixedSections, rows)
  const birdsPerRow = Math.round(res.flock.total / rows)

  const p: string[] = []
  p.push(`<svg viewBox="0 0 ${vbW.toFixed(0)} ${vbH.toFixed(0)}" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif">`)
  p.push(`<rect x="0" y="0" width="${vbW.toFixed(0)}" height="${vbH.toFixed(0)}" fill="white"/>`)
  // Shed outline
  p.push(`<rect x="${ox}" y="${oy}" width="${L}" height="${Wp}" fill="none" stroke="${COL.outline}" stroke-width="${sw * 2}"/>`)
  // Front / rear service (hatched via light fill)
  p.push(`<rect x="${ox}" y="${oy}" width="${front}" height="${Wp}" fill="${COL.service}"/>`)
  p.push(`<rect x="${ox + L - rear}" y="${oy}" width="${rear}" height="${Wp}" fill="${COL.service}"/>`)
  p.push(`<text x="${ox + front / 2}" y="${oy + Wp / 2}" font-size="${fs * 0.8}" fill="${COL.muted}" text-anchor="middle" transform="rotate(-90 ${ox + front / 2} ${oy + Wp / 2})">Front service ${res.layout.frontServiceFt.toFixed(1)} ft</text>`)
  p.push(`<text x="${ox + L - rear / 2}" y="${oy + Wp / 2}" font-size="${fs * 0.8}" fill="${COL.muted}" text-anchor="middle" transform="rotate(-90 ${ox + L - rear / 2} ${oy + Wp / 2})">Rear ${res.layout.rearServiceFt} ft</text>`)

  const rowPitch = c.cageWidthMm + centre
  const cageStartX = ox + front + start
  for (let r = 0; r < rows; r++) {
    const ry = oy + side + r * rowPitch
    const rh = c.cageWidthMm
    // start / end kits
    p.push(`<rect x="${ox + front}" y="${ry}" width="${start}" height="${rh}" fill="${COL.kit}" stroke="${COL.outline}" stroke-width="${sw}"/>`)
    p.push(`<rect x="${(cageStartX + spr * secLen).toFixed(1)}" y="${ry}" width="${end}" height="${rh}" fill="${COL.kit}" stroke="${COL.outline}" stroke-width="${sw}"/>`)
    for (let s = 0; s < spr; s++) {
      const sx = cageStartX + s * secLen
      const isMixed = mixed.has(s)
      p.push(`<rect class="section${isMixed ? ' mixed' : ''}" x="${sx.toFixed(2)}" y="${ry}" width="${secLen.toFixed(2)}" height="${rh}" fill="${isMixed ? COL.male : COL.female}" stroke="${isMixed ? COL.maleStroke : COL.femaleStroke}" stroke-width="${sw * 0.8}"/>`)
      const div = isMixed ? nM : nF
      for (let d = 1; d < div; d++) {
        const dx = sx + (secLen * d) / div
        p.push(`<line x1="${dx.toFixed(2)}" y1="${ry}" x2="${dx.toFixed(2)}" y2="${ry + rh}" stroke="${isMixed ? COL.maleStroke : COL.femaleStroke}" stroke-width="${sw * 0.4}" opacity="0.5"/>`)
      }
    }
    // row label
    p.push(`<text x="${ox - fs * 0.4}" y="${ry + rh / 2}" font-size="${fs * 0.85}" fill="${COL.text}" text-anchor="end">Row ${r + 1}</text>`)
  }

  // Dimension chain along the bottom: front | start | cage | end | rear
  const dy = oy + Wp + padBot * 0.4
  const cageLen = spr * secLen
  const segs: [number, number, string][] = [
    [ox, front, `Front ${res.layout.frontServiceFt.toFixed(1)}`],
    [ox + front, start, `Start ${res.layout.startKitFt}`],
    [cageStartX, cageLen, `Cage ${res.layout.cageLengthFt.toFixed(1)} ft (${spr} sections)`],
    [cageStartX + cageLen, end, `End ${res.layout.endKitFt}`],
    [ox + L - rear, rear, `Rear ${res.layout.rearServiceFt}`],
  ]
  p.push(`<line x1="${ox}" y1="${dy}" x2="${ox + L}" y2="${dy}" stroke="${COL.dim}" stroke-width="${sw}"/>`)
  for (const [x, w, label] of segs) {
    p.push(`<line x1="${x}" y1="${dy - fs * 0.4}" x2="${x}" y2="${dy + fs * 0.4}" stroke="${COL.dim}" stroke-width="${sw}"/>`)
    p.push(`<text x="${x + w / 2}" y="${dy + fs * 1.3}" font-size="${fs * 0.7}" fill="${COL.text}" text-anchor="middle">${esc(label)}</text>`)
  }
  p.push(`<line x1="${ox + L}" y1="${dy - fs * 0.4}" x2="${ox + L}" y2="${dy + fs * 0.4}" stroke="${COL.dim}" stroke-width="${sw}"/>`)

  // Title + summary
  p.push(`<text x="${ox}" y="${oy * 0.45}" font-size="${fs * 1.1}" font-weight="700" fill="${COL.text}">Plan — ${input.houseLengthFt} ft × ${res.shed.widthFt.toFixed(2)} ft · ${res.layout.totalSections} sections</text>`)
  p.push(`<text x="${ox}" y="${oy * 0.75}" font-size="${fs * 0.85}" fill="${COL.muted}">${res.layout.mixedSections} mixed (male, orange) · ${res.layout.femaleSections} female · ≈${birdsPerRow.toLocaleString()} birds/row</text>`)

  p.push(`</svg>`)
  return p.join('')
}

export function buildPlannerDrawings(res: PlannerResult, input: PlannerInput, data: MasterData) {
  return { crossSection: buildCrossSection(res, input, data), plan: buildPlan(res, input, data) }
}
