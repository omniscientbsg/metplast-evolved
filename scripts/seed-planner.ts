// Seed the Breeder Farm Planner master-data tables from the canonical module.
// Idempotent: upserts on the unique keys, so it is safe to re-run after adding a
// box size to src/lib/planner/master-data.ts. Run: npm run db:seed-planner
import { PrismaClient, Prisma } from '@prisma/client'
import {
  BREEDER_BOXES,
  PULLET_BOXES,
  EQUIPMENT_CONFIGS,
  PRODUCT_CONSTANTS,
  isBoxSizeValid,
} from '../src/lib/planner/master-data'

const prisma = new PrismaClient()

async function main() {
  const boxes = [...BREEDER_BOXES, ...PULLET_BOXES]
  for (const b of boxes) {
    const valid = isBoxSizeValid(b)
    await prisma.plannerBoxSize.upsert({
      where: { product_boxSize: { product: b.product, boxSize: b.boxSize } },
      update: { ...b, valid, active: true },
      create: { ...b, valid, active: true },
    })
  }
  console.log(`seeded ${boxes.length} box sizes`)

  for (const c of EQUIPMENT_CONFIGS) {
    await prisma.plannerConfig.upsert({ where: { configNo: c.configNo }, update: c, create: c })
  }
  console.log(`seeded ${EQUIPMENT_CONFIGS.length} equipment configs`)

  for (const [product, values] of Object.entries(PRODUCT_CONSTANTS)) {
    const json = values as unknown as Prisma.InputJsonObject
    await prisma.plannerConstant.upsert({
      where: { product },
      update: { values: json },
      create: { product, values: json },
    })
  }
  console.log(`seeded ${Object.keys(PRODUCT_CONSTANTS).length} product constant sets`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
