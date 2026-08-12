import { loadMasterData } from '@/lib/planner/repository'
import { BreederPlannerClient } from './BreederPlannerClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Breeder Farm Planner | Metplast',
  description: 'Plan an H-Type broiler breeder house: capacity, male:female split, shed dimensions and layout.',
}

export default async function BreederPlannerPage() {
  const data = await loadMasterData()
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <BreederPlannerClient data={data} />
    </div>
  )
}
