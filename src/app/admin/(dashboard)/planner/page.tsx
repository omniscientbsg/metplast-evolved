import prisma from '@/lib/prisma'
import { PlannerBoxSizesManager, type BoxRow } from './PlannerBoxSizesManager'

export const dynamic = 'force-dynamic'

export default async function PlannerAdminPage() {
  let rows: BoxRow[] = []
  let dbError = false
  try {
    const boxes = await prisma.plannerBoxSize.findMany({ orderBy: [{ product: 'asc' }, { boxSize: 'asc' }] })
    rows = boxes.map((b) => ({
      id: b.id,
      product: b.product as BoxRow['product'],
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
      valid: b.valid,
      active: b.active,
    }))
  } catch (e) {
    console.error('planner admin: could not load box sizes', e)
    dbError = true
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Breeder Planner — Box Sizes</h1>
        <p className="text-white/50 text-sm mt-1">
          Master data for the Breeder Farm Planner. Every size must satisfy the Golden Rule
          (female&nbsp;front&nbsp;×&nbsp;F&nbsp;boxes = male&nbsp;front&nbsp;×&nbsp;M&nbsp;boxes). Invalid sizes cannot be saved and are hidden from clients.
        </p>
      </div>
      {dbError && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl px-4 py-3 text-sm mb-6">
          Could not read the planner tables. If this is a fresh deploy, run{' '}
          <code className="font-mono">npm run db:seed-planner</code> after applying the schema.
        </div>
      )}
      <PlannerBoxSizesManager initial={rows} />
    </div>
  )
}
