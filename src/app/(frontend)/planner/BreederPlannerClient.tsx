'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Settings2, ArrowRight, AlertTriangle, Info, Ban } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { boxFamily, type MasterData, type PlannerProduct } from '@/lib/planner/master-data'
import { planForward, type ForwardInput, type PlannerMessage } from '@/lib/planner/validation'

const PRODUCT_LABEL: Record<PlannerProduct, string> = {
  BREEDER: 'Breeder (production)',
  BREEDER_PULLET: 'Breeder Pullet (rearing)',
}

// TC-01 defaults, so the tool opens on the reference case.
const DEFAULTS = { product: 'BREEDER' as PlannerProduct, houseLengthFt: '365', rows: '5', tiers: '3', boxSize: '1', config: '3', male: '10' }

const inputCls =
  'w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white text-lg font-medium focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all'
const labelCls = 'block text-sm font-bold tracking-widest text-[#9AA7BD] uppercase mb-3'

function Stat({ title, value, sub, highlight }: { title: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 ${highlight ? 'sm:col-span-2 bg-[var(--brand-navy)]/40 border-[var(--brand-navy)]' : ''}`}>
      <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${highlight ? 'text-white/70' : 'text-[#9AA7BD]'}`}>{title}</p>
      <p className={`${highlight ? 'text-4xl md:text-5xl text-[var(--accent)] font-["Space_Grotesk"]' : 'text-2xl text-white'} font-black leading-none`}>{value}</p>
      {sub && <p className="text-[#9AA7BD] text-xs mt-2 font-medium">{sub}</p>}
    </div>
  )
}

function MessageRow({ m }: { m: PlannerMessage }) {
  const style =
    m.severity === 'BLOCK'
      ? { box: 'bg-red-500/10 border-red-500/30 text-red-300', Icon: Ban }
      : m.severity === 'WARN'
        ? { box: 'bg-amber-500/10 border-amber-500/30 text-amber-200', Icon: AlertTriangle }
        : { box: 'bg-sky-500/10 border-sky-500/30 text-sky-200', Icon: Info }
  const Icon = style.Icon
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${style.box}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>
        <span className="font-bold mr-1">{m.code}</span>
        {m.text}
      </span>
    </div>
  )
}

export function BreederPlannerClient({ data }: { data: MasterData }) {
  const router = useRouter()
  const [f, setF] = useState({ ...DEFAULTS })

  const products = Object.keys(data.constants) as PlannerProduct[]
  const boxes = useMemo(() => data.boxes.filter((b) => b.product === f.product), [data.boxes, f.product])
  const configs = useMemo(
    () => data.configs.filter((c) => (f.product === 'BREEDER_PULLET' ? c.availableOnPullet : true)),
    [data.configs, f.product],
  )

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: v }))
  }

  // Switching product may invalidate the selected box / config — snap to the first valid one.
  function setProduct(product: PlannerProduct) {
    const b = data.boxes.find((x) => x.product === product)
    const c = data.configs.find((x) => (product === 'BREEDER_PULLET' ? x.availableOnPullet : true))
    setF((p) => ({ ...p, product, boxSize: String(b?.boxSize ?? 1), config: String(c?.configNo ?? 1) }))
  }

  const report = useMemo(() => {
    const input: ForwardInput = {
      product: f.product,
      houseLengthFt: Number(f.houseLengthFt),
      rows: Number(f.rows),
      tiers: Number(f.tiers),
      boxSize: Number(f.boxSize),
      config: Number(f.config),
      malePer100Females: Number(f.male),
    }
    return planForward(input, data)
  }, [f, data])
  const r = report.result

  // Live flock-split clarifier (Section 8.1) — pure arithmetic, always shown.
  const m = Number(f.male)
  const pctOfTotal = Number.isFinite(m) && m >= 0 ? (m / (100 + m)) * 100 : 0

  function sendToMetplast() {
    const params = new URLSearchParams({ type: 'calculator_handoff', product: `Breeder Farm Planner — ${PRODUCT_LABEL[f.product]}` })
    if (r) params.set('capacity', String(r.flock.total))
    router.push(`/contact?${params.toString()}`)
  }

  const blocks = report.messages.filter((x) => x.severity === 'BLOCK')

  return (
    <div className="max-w-[1200px] mx-auto pt-32 pb-24 px-6 relative z-10">
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6"
        >
          <Settings2 className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Breeder Farm Planner</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black font-['Space_Grotesk'] text-[var(--text)] mb-5 tracking-tight">
          H-Type Breeder Planner
        </h1>
        <p className="text-lg text-[var(--text-muted)] font-medium max-w-2xl mx-auto">
          Enter the shed and the male:female ratio you want. The planner returns capacity, the flock split, shed dimensions and per-bird space.
        </p>
      </div>

      <div
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(249, 115, 22, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="grid lg:grid-cols-12 relative z-10">
          {/* Inputs */}
          <div className="lg:col-span-5 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/5">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Calculator className="text-[var(--accent)]" /> Shed Parameters
            </h2>
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Product</label>
                <select className={inputCls} value={f.product} onChange={(e) => setProduct(e.target.value as PlannerProduct)}>
                  {products.map((p) => (
                    <option key={p} value={p}>{PRODUCT_LABEL[p]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Shed length (ft)</label>
                  <input className={inputCls} inputMode="decimal" value={f.houseLengthFt} onChange={(e) => set('houseLengthFt', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Rows</label>
                  <input className={inputCls} inputMode="numeric" value={f.rows} onChange={(e) => set('rows', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Tiers</label>
                  <input className={inputCls} inputMode="numeric" value={f.tiers} onChange={(e) => set('tiers', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Box size</label>
                  <select className={inputCls} value={f.boxSize} onChange={(e) => set('boxSize', e.target.value)}>
                    {boxes.map((b) => (
                      <option key={b.boxSize} value={b.boxSize}>
                        Box {b.boxSize} · {((b.femaleFrontIn * b.fBoxesPerLine) / 12).toFixed(3)} ft · Fam {boxFamily(b)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Equipment configuration</label>
                <select className={inputCls} value={f.config} onChange={(e) => set('config', e.target.value)}>
                  {configs.map((c) => (
                    <option key={c.configNo} value={c.configNo}>{c.configNo} — {c.description}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Males per 100 females</label>
                <input className={inputCls} inputMode="decimal" value={f.male} onChange={(e) => set('male', e.target.value)} />
                {/* Section 8.1 — the #1 misunderstanding, clarified live. */}
                <p className="mt-2 text-sm text-[#9AA7BD]">
                  <span className="text-white font-bold">{Number.isFinite(m) ? m : 0}</span> males per 100 females
                  {' = '}
                  <span className="text-white font-bold">{pctOfTotal.toFixed(1)}%</span> of the total flock
                  {' '}({Number.isFinite(m) ? 100 + m : 100} birds per 100 females).
                </p>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 p-8 md:p-10 bg-black/40 flex flex-col justify-center min-h-[560px]">
            {blocks.length > 0 || !r ? (
              <div className="space-y-4">
                {blocks.length > 0 ? (
                  blocks.map((msg, i) => <MessageRow key={i} m={msg} />)
                ) : (
                  <div className="text-center opacity-50 py-12">
                    <Calculator className="w-16 h-16 text-[#9AA7BD] mx-auto mb-4 opacity-50" />
                    <p className="text-[#9AA7BD] text-lg">Enter valid shed details to see the plan.</p>
                  </div>
                )}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div>
                  <p className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm mb-1">Farm Plan Summary</p>
                  <h3 className="text-2xl font-black text-white">
                    {r.flock.total.toLocaleString()} birds · {r.flock.females.toLocaleString()} F / {r.flock.males.toLocaleString()} M
                  </h3>
                  {/* Section 8.5 — honest achieved ratio */}
                  <p className="text-[#9AA7BD] text-sm mt-1">
                    Target {r.flock.targetMalePct.toFixed(1)} males/100 females — achieved{' '}
                    <span className="text-white font-bold">{r.flock.achievedMalePct.toFixed(2)}</span> ({r.layout.mixedSections} of{' '}
                    {r.layout.totalSections} sections carry a male tier).
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Stat highlight title="Total birds" value={r.flock.total.toLocaleString()} sub={`${r.flock.females.toLocaleString()} females + ${r.flock.males.toLocaleString()} males`} />
                  <Stat title="Sections per row" value={String(r.layout.sectionsPerRow)} sub={`${r.layout.totalSections.toLocaleString()} sections total`} />
                  <Stat title="Mixed / female sections" value={`${r.layout.mixedSections} / ${r.layout.femaleSections}`} sub="mixed carry the male top tier" />
                  <Stat title="Shed width" value={`${r.shed.widthFt.toFixed(2)} ft`} sub={`${r.shed.widthMm.toLocaleString()} mm`} />
                  <Stat title="Shed height" value={`${r.shed.heightFt} ft`} sub={`${r.shed.headroomMm.toFixed(0)} mm clear headroom`} />
                  <Stat title="Cage length" value={`${r.layout.cageLengthFt.toFixed(2)} ft`} sub={`front service ${r.layout.frontServiceFt.toFixed(2)} ft`} />
                </div>

                {/* Per-bird metrics — Step 9 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3 text-[#9AA7BD]">Per-bird space (Step 9)</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80">
                    <span>Female area</span>
                    <span className="text-right text-white font-semibold">{r.perBird.femaleAreaIn2.toFixed(1)} in² · {r.perBird.femaleAreaM2.toFixed(3)} m²</span>
                    <span>Male area</span>
                    <span className="text-right text-white font-semibold">{r.perBird.maleAreaIn2.toFixed(1)} in² · {r.perBird.maleAreaM2.toFixed(3)} m²</span>
                    <span>Female feeding space</span>
                    <span className="text-right text-white font-semibold">{r.perBird.femaleFeedSpaceIn.toFixed(2)} in/bird</span>
                    <span>Male feeding space</span>
                    <span className="text-right text-white font-semibold">{r.perBird.maleFeedSpaceIn.toFixed(2)} in/bird</span>
                  </div>
                </div>

                {/* Dead-length indicator — V10 / Section 9.3 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#9AA7BD]">Unused shed length (dead length)</p>
                  <p className="text-2xl font-black text-white">{r.layout.deadLengthFt.toFixed(2)} ft</p>
                  <p className="text-[#9AA7BD] text-xs mt-1">Length left over after whole sections, kits and service areas. A different box size may use it better.</p>
                </div>

                {report.messages.length > 0 && (
                  <div className="space-y-2">
                    {report.messages.map((msg, i) => <MessageRow key={i} m={msg} />)}
                  </div>
                )}

                <div className="pt-5 border-t border-white/10">
                  <p className="text-[#9AA7BD] mb-3 text-xs font-medium">
                    * Preliminary planning estimate. Male line layout and positioning are finalised during execution.
                  </p>
                  <button
                    onClick={sendToMetplast}
                    className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-black text-lg transition-all flex items-center justify-center"
                  >
                    Send This Requirement to Metplast <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
