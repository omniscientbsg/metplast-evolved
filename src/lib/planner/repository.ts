// Bridges the Planner master-data DB tables to the MasterData bundle the pure
// engine consumes. The engine itself never imports Prisma — this is the only
// seam between the database and the calculation.

import prisma from '@/lib/prisma'
import {
  DEFAULT_MASTER_DATA,
  PRODUCT_CONSTANTS,
  type BoxSizeRow,
  type EquipmentConfigRow,
  type MasterData,
  type PlannerProduct,
  type ProductConstants,
} from './master-data'

function mapBox(b: {
  product: string
  boxSize: number
  femaleFrontIn: number
  femaleDepthIn: number
  maleFrontIn: number
  maleDepthIn: number
  fBoxesPerLine: number
  mBoxesPerLine: number
  birdsPerFBox: number
  birdsPerMBox: number
  autoFitMaleFront: boolean
}): BoxSizeRow {
  return {
    product: b.product as PlannerProduct,
    boxSize: b.boxSize,
    femaleFrontIn: b.femaleFrontIn,
    femaleDepthIn: b.femaleDepthIn,
    maleFrontIn: b.maleFrontIn,
    maleDepthIn: b.maleDepthIn,
    fBoxesPerLine: b.fBoxesPerLine,
    mBoxesPerLine: b.mBoxesPerLine,
    birdsPerFBox: b.birdsPerFBox,
    birdsPerMBox: b.birdsPerMBox,
    autoFitMaleFront: b.autoFitMaleFront,
  }
}

/**
 * Load the planner master data from the database. Only ACTIVE, VALID box sizes
 * are returned — an invalid (Golden-Rule-failing) row is never offered to the
 * engine. Falls back to the canonical constants if a table has not been seeded
 * yet, so a fresh deploy still functions before `db:seed-planner` is run.
 */
export async function loadMasterData(): Promise<MasterData> {
  const [boxes, configs, constants] = await Promise.all([
    prisma.plannerBoxSize.findMany({ where: { active: true, valid: true }, orderBy: [{ product: 'asc' }, { boxSize: 'asc' }] }),
    prisma.plannerConfig.findMany({ orderBy: { configNo: 'asc' } }),
    prisma.plannerConstant.findMany(),
  ])

  if (boxes.length === 0 || configs.length === 0 || constants.length === 0) {
    console.warn('[planner] master data not fully seeded — falling back to canonical defaults. Run `npm run db:seed-planner`.')
    return DEFAULT_MASTER_DATA
  }

  const constantsByProduct = { ...PRODUCT_CONSTANTS } as Record<PlannerProduct, ProductConstants>
  for (const c of constants) {
    constantsByProduct[c.product as PlannerProduct] = c.values as unknown as ProductConstants
  }

  return {
    boxes: boxes.map(mapBox),
    configs: configs.map(
      (c): EquipmentConfigRow => ({
        configNo: c.configNo,
        description: c.description,
        startKitFt: c.startKitFt,
        endKitFt: c.endKitFt,
        frontServiceMinFt: c.frontServiceMinFt,
        addsTrolleyHeight: c.addsTrolleyHeight,
        availableOnPullet: c.availableOnPullet,
      }),
    ),
    constants: constantsByProduct,
  }
}
