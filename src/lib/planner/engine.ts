// Breeder Farm Planner — CORE ENGINE (Phase 2).
//
// Pure function implementing Steps 1–9 of the spec's Section 12 exactly. No UI,
// no DB: it receives the client input plus a MasterData bundle and returns a
// fully-computed result, or a structured BLOCK error. The full V1–V13 validation
// layer is Phase 3; this engine performs only the inline aborts Section 12 names
// (invalid box size, shed too short) plus the product/config guards it needs to
// look data up safely.
//
// Key spec fidelity notes:
//  - FB_low uses the GENERAL form nF*2*(tiers-1), NOT the Excel's hard-coded
//    IF(T=3/4) (defect D1).
//  - x (mixed sections) is ROUND-ed then clamped 0..N (defect D2 decision).
//  - The ACHIEVED male % is recomputed from x_int and returned — never the target.
//  - mm→ft uses the exact factor MM_TO_FT (= 1/304.8); see defect D10.

import {
  DEFAULT_MASTER_DATA,
  MM_TO_FT,
  IN2_TO_M2,
  boxFamily,
  isBoxSizeValid,
  sectionLengthIn,
  type MasterData,
  type PlannerProduct,
} from './master-data'

export type PlannerMode = 'FORWARD' // TARGET_BIRDS / TARGET_BIRDS_AND_PLOT are Phase 6.

export interface PlannerInput {
  product: PlannerProduct
  houseLengthFt: number
  rows: number
  tiers: number
  boxSize: number
  config: number
  malePer100Females: number
  centreGapMm?: number
  sideGapMm?: number
}

export interface PlannerError {
  ok: false
  error: { code: string; severity: 'BLOCK'; message: string }
}

export interface PlannerResult {
  ok: true
  cage: {
    boxSize: number
    family: 'A' | 'B'
    femaleBoxIn: { front: number; depth: number; frontHeight: number; rearHeight: number }
    maleBoxIn: { front: number; depth: number; height: number }
    sectionLengthIn: number
    sectionLengthFt: number
    femaleBoxesPerLine: number
    maleBoxesPerLine: number
    birdsPerFemaleBox: number
    birdsPerMaleBox: number
    autoFitMaleFront: boolean
  }
  sectionStructure: {
    FB: number // female boxes in a pure-female (Type F) section
    FBLow: number // female boxes in the lower tiers of a mixed (Type M) section
    FBTop: number // female boxes in the top tier (lost when a section goes mixed)
    MB: number // male boxes in a mixed section (top tier only)
  }
  layout: {
    sectionsPerRow: number
    totalSections: number
    femaleSections: number
    mixedSections: number
    xExact: number
    usableForCagesFt: number
    cageLengthFt: number
    rowLengthFt: number
    frontServiceFt: number
    rearServiceFt: number
    startKitFt: number
    endKitFt: number
    deadLengthFt: number
  }
  shed: {
    lengthFt: number
    widthFt: number
    widthMm: number
    heightFt: number
    heightMm: number
    cageHeightMm: number
    headroomMm: number
    trolleyClearanceMm: number
    centreGapMm: number
    sideGapMm: number
  }
  flock: {
    femaleBoxes: number
    maleBoxes: number
    females: number
    males: number
    total: number
    targetMalePct: number
    achievedMalePct: number
  }
  perBird: {
    femaleAreaIn2: number
    maleAreaIn2: number
    femaleAreaM2: number
    maleAreaM2: number
    femaleFeedSpaceIn: number
    maleFeedSpaceIn: number
  }
}

function block(code: string, message: string): PlannerError {
  return { ok: false, error: { code, severity: 'BLOCK', message } }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi)
}

export function computePlanner(input: PlannerInput, data: MasterData = DEFAULT_MASTER_DATA): PlannerResult | PlannerError {
  const constants = data.constants[input.product]
  if (!constants) return block('INVALID_PRODUCT', 'Unknown product.')

  const box = data.boxes.find((b) => b.product === input.product && b.boxSize === input.boxSize)
  if (!box) return block('V1', 'This cage configuration is not available. Please contact Metplast.')

  const cfg = data.configs.find((k) => k.configNo === input.config)
  if (!cfg) return block('INVALID_CONFIG', 'Unknown equipment configuration.')
  if (input.product === 'BREEDER_PULLET' && !cfg.availableOnPullet)
    return block('V5', 'Egg collection is not applicable to a rearing (pullet) house.')

  // ---- STEP 1: look up the box size -------------------------------------
  const nF = box.fBoxesPerLine
  const nM = box.mBoxesPerLine
  const bF = box.birdsPerFBox
  const bM = box.birdsPerMBox
  if (!isBoxSizeValid(box)) return block('V1', 'This cage configuration is not available. Please contact Metplast.')
  const section_length_in = sectionLengthIn(box)
  const section_length_ft = section_length_in / 12

  // ---- STEP 2: derive section structure ---------------------------------
  const FB = nF * 2 * input.tiers
  const FB_low = nF * 2 * (input.tiers - 1) // general form — fixes defect D1
  const FB_top = nF * 2
  const MB = nM * 2

  // ---- STEP 3: length budget --------------------------------------------
  const start = cfg.startKitFt
  const end = cfg.endKitFt
  const front_min = cfg.frontServiceMinFt // 9, or 10 with egg collection (config 3/4)
  const rear = input.tiers <= 3 ? 6 : 8
  const usable = input.houseLengthFt - front_min - rear - start - end
  if (usable < section_length_ft) {
    const min_len = section_length_ft + front_min + rear + start + end
    return block('V2', `The shed is too short. A minimum of ${min_len.toFixed(1)} ft is required for this configuration.`)
  }

  // ---- STEP 4: sections -------------------------------------------------
  const sections_per_row = Math.floor(usable / section_length_ft)
  const cage_length = sections_per_row * section_length_ft
  const actual_front = input.houseLengthFt - cage_length - rear - start - end
  // Section 12 formula: row_length = house_length − actual_front − rear (= cage + start + end).
  const row_length = input.houseLengthFt - actual_front - rear
  const N = sections_per_row * input.rows

  // ---- STEP 5: male:female allocation -----------------------------------
  const p = input.malePer100Females / 100
  const x = (p * bF * FB * N) / (MB * bM + p * bF * FB_top)
  const x_int = clamp(Math.round(x), 0, N)
  const mixed_sections = x_int
  const female_sections = N - x_int

  // ---- STEP 6: bird and box counts --------------------------------------
  const female_boxes = female_sections * FB + mixed_sections * FB_low
  const male_boxes = mixed_sections * MB
  const females = female_boxes * bF
  const males = male_boxes * bM
  const total_birds = females + males
  const achieved_male_pct = females > 0 ? (males / females) * 100 : 0

  // ---- STEP 7: shed width -----------------------------------------------
  const centre_gap = input.centreGapMm ?? constants.centreGapMmDefault
  const side_gap = input.sideGapMm ?? constants.sideGapMmDefault
  const shed_width_mm = constants.cageWidthMm * input.rows + centre_gap * (input.rows - 1) + 2 * side_gap
  const shed_width_ft = shed_width_mm * MM_TO_FT
  const trolley_clearance_mm = (shed_width_mm - constants.rowWidthWithTrolleyMm * input.rows) / (input.rows + 1)

  // ---- STEP 8: shed height ----------------------------------------------
  const cage_h_mm = constants.legHeightMm + constants.tierHeightMm * input.tiers
  const trolley_mm = cfg.addsTrolleyHeight ? constants.trolleyHeightMm : 0
  const shed_h_ft = Math.ceil((cage_h_mm + trolley_mm) * MM_TO_FT + constants.headroomFt)
  const shed_height_mm = shed_h_ft / MM_TO_FT
  const headroom_mm = shed_height_mm - cage_h_mm - trolley_mm

  // ---- STEP 9: per-bird metrics -----------------------------------------
  const female_area_in2 = (box.femaleFrontIn * box.femaleDepthIn) / bF
  const male_area_in2 = (box.maleFrontIn * box.maleDepthIn) / bM
  const female_feed_space_in = box.femaleFrontIn / bF
  const male_feed_space_in = box.maleFrontIn / bM

  return {
    ok: true,
    cage: {
      boxSize: box.boxSize,
      family: boxFamily(box),
      femaleBoxIn: {
        front: box.femaleFrontIn,
        depth: box.femaleDepthIn,
        frontHeight: constants.femaleFrontHeightIn,
        rearHeight: constants.femaleRearHeightIn,
      },
      maleBoxIn: { front: box.maleFrontIn, depth: box.maleDepthIn, height: constants.maleHeightIn },
      sectionLengthIn: section_length_in,
      sectionLengthFt: section_length_ft,
      femaleBoxesPerLine: nF,
      maleBoxesPerLine: nM,
      birdsPerFemaleBox: bF,
      birdsPerMaleBox: bM,
      autoFitMaleFront: box.autoFitMaleFront,
    },
    sectionStructure: { FB, FBLow: FB_low, FBTop: FB_top, MB },
    layout: {
      sectionsPerRow: sections_per_row,
      totalSections: N,
      femaleSections: female_sections,
      mixedSections: mixed_sections,
      xExact: x,
      usableForCagesFt: usable,
      cageLengthFt: cage_length,
      rowLengthFt: row_length,
      frontServiceFt: actual_front,
      rearServiceFt: rear,
      startKitFt: start,
      endKitFt: end,
      deadLengthFt: actual_front - front_min,
    },
    shed: {
      lengthFt: input.houseLengthFt,
      widthFt: shed_width_ft,
      widthMm: shed_width_mm,
      heightFt: shed_h_ft,
      heightMm: shed_height_mm,
      cageHeightMm: cage_h_mm,
      headroomMm: headroom_mm,
      trolleyClearanceMm: trolley_clearance_mm,
      centreGapMm: centre_gap,
      sideGapMm: side_gap,
    },
    flock: {
      femaleBoxes: female_boxes,
      maleBoxes: male_boxes,
      females,
      males,
      total: total_birds,
      targetMalePct: input.malePer100Females,
      achievedMalePct: achieved_male_pct,
    },
    perBird: {
      femaleAreaIn2: female_area_in2,
      maleAreaIn2: male_area_in2,
      femaleAreaM2: female_area_in2 * IN2_TO_M2,
      maleAreaM2: male_area_in2 * IN2_TO_M2,
      femaleFeedSpaceIn: female_feed_space_in,
      maleFeedSpaceIn: male_feed_space_in,
    },
  }
}
