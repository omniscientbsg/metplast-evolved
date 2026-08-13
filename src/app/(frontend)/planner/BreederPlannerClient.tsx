'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Settings2, ArrowRight, AlertTriangle, Info, Ban } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { boxFamily, MM_TO_FT, type MasterData, type PlannerProduct } from '@/lib/planner/master-data'
import { planForward, type PlannerMessage, type PlannerReport } from '@/lib/planner/validation'
import { planTargetBirds, planTargetBirdsAndPlot, type PlotOption } from '@/lib/planner/reverse'
import { buildPlannerDrawings } from '@/lib/planner/drawings'
import { computeBoq, type Boq } from '@/lib/planner/boq'
import type { PlannerInput, PlannerResult } from '@/lib/planner/engine'

type Mode = 'FORWARD' | 'TARGET' | 'PLOT'

const PRODUCT_LABEL: Record<PlannerProduct, string> = {
  BREEDER: 'Breeder (production)',
  BREEDER_PULLET: 'Breeder Pullet (rearing)',
}
const MODE_LABEL: Record<Mode, string> = { FORWARD: 'I have a shed', TARGET: 'I have a bird target', PLOT: 'Bird target + plot' }

// TC-01 defaults, so the tool opens on the reference case.
const DEFAULTS = {
  product: 'BREEDER' as PlannerProduct,
  houseLengthFt: '365',
  rows: '5',
  tiers: '3',
  boxSize: '1',
  config: '3',
  male: '10',
  targetFemales: '11648',
  maxWidthFt: '50',
  maxLengthFt: '',
}

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

function BoqPanel({ boq }: { boq: Boq }) {
  const [open, setOpen] = useState(false)
  const groups = boq.lines.reduce<Record<string, typeof boq.lines>>((acc, l) => {
    ;(acc[l.group] ??= []).push(l)
    return acc
  }, {})
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-[#9AA7BD]">Bill of quantities · connected load ≈ {boq.connectedKw} kW</span>
        <span className="text-[var(--accent)] text-sm font-bold">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          {Object.entries(groups).map(([group, lines]) => (
            <div key={group}>
              <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-1">{group}</p>
              <div className="divide-y divide-white/5">
                {lines.map((l, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
                    <span className="text-white/80">
                      {l.item}
                      {l.note && <span className="text-[#9AA7BD] text-xs"> — {l.note}</span>}
                    </span>
                    <span className="text-white font-semibold whitespace-nowrap">
                      {l.qty === null ? 'TBC' : l.qty.toLocaleString()} {l.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="text-[#9AA7BD] text-xs">
            Connected load excludes silo and ventilation (separate modules). Fan quantity is pending Metplast confirmation (D4).
          </p>
        </div>
      )}
    </div>
  )
}

export function BreederPlannerClient({ data }: { data: MasterData }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('FORWARD')
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

  function setProduct(product: PlannerProduct) {
    const b = data.boxes.find((x) => x.product === product)
    const c = data.configs.find((x) => (product === 'BREEDER_PULLET' ? x.availableOnPullet : true))
    setF((p) => ({ ...p, product, boxSize: String(b?.boxSize ?? 1), config: String(c?.configNo ?? 1) }))
  }

  type Out =
    | { kind: 'result'; report: PlannerReport; result: PlannerResult; effInput: PlannerInput; recommendedLengthFt: number | null }
    | { kind: 'blocked'; report: PlannerReport }
    | { kind: 'error'; text: string }
    | { kind: 'plot'; options: PlotOption[] }
    | { kind: 'empty' }

  const out: Out = useMemo(() => {
    const common = {
      product: f.product,
      rows: Number(f.rows),
      tiers: Number(f.tiers),
      boxSize: Number(f.boxSize),
      config: Number(f.config),
      malePer100Females: Number(f.male),
    }
    if (mode === 'FORWARD') {
      const input: PlannerInput = { ...common, houseLengthFt: Number(f.houseLengthFt) }
      const report = planForward(input, data)
      if (report.ok && report.result) return { kind: 'result', report, result: report.result, effInput: input, recommendedLengthFt: null }
      return { kind: 'blocked', report }
    }
    if (mode === 'TARGET') {
      const tb = planTargetBirds({ ...common, targetFemales: Number(f.targetFemales) }, data)
      if (!tb.ok) return { kind: 'error', text: tb.error }
      if (!tb.report.ok || !tb.report.result) return { kind: 'blocked', report: tb.report }
      const effInput: PlannerInput = { ...common, houseLengthFt: tb.recommendedHouseLengthFt }
      return { kind: 'result', report: tb.report, result: tb.report.result, effInput, recommendedLengthFt: tb.recommendedHouseLengthFt }
    }
    // PLOT
    const pl = planTargetBirdsAndPlot(
      { ...common, targetFemales: Number(f.targetFemales), maxWidthFt: Number(f.maxWidthFt), maxLengthFt: f.maxLengthFt ? Number(f.maxLengthFt) : undefined },
      data,
    )
    if (!pl.ok) return { kind: 'error', text: pl.error }
    return { kind: 'plot', options: pl.options }
  }, [mode, f, data])

  const view = useMemo(() => {
    if (out.kind !== 'result') return null
    return { drawings: buildPlannerDrawings(out.result, out.effInput, data), boq: computeBoq(out.result, out.effInput) }
  }, [out, data])

  // Live flock-split clarifier (Section 8.1) — pure arithmetic, always shown.
  const m = Number(f.male)
  const pctOfTotal = Number.isFinite(m) && m >= 0 ? (m / (100 + m)) * 100 : 0

  function sendToMetplast(total?: number) {
    const params = new URLSearchParams({ type: 'calculator_handoff', product: `Breeder Farm Planner — ${PRODUCT_LABEL[f.product]}` })
    if (total) params.set('capacity', String(total))
    router.push(`/contact?${params.toString()}`)
  }

  function useLayout(o: PlotOption) {
    setF((p) => ({ ...p, rows: String(o.rows), houseLengthFt: o.recommendedHouseLengthFt.toFixed(1) }))
    setMode('FORWARD')
  }

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
        <h1 className="text-4xl md:text-6xl font-black font-['Space_Grotesk'] text-[var(--text)] mb-5 tracking-tight">H-Type Breeder Planner</h1>
        <p className="text-lg text-[var(--text-muted)] font-medium max-w-2xl mx-auto">
          Start from a shed, a bird target, or a plot. The planner returns capacity, the flock split, shed dimensions, per-bird space, layout drawings and a bill of quantities.
        </p>
      </div>

      <div
        className="rounded-3xl overflow-hidden relative"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(249, 115, 22, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="grid lg:grid-cols-12 relative z-10">
          {/* Inputs */}
          <div className="lg:col-span-5 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/5">
            {/* Mode tabs */}
            <div className="flex gap-1 mb-8 bg-black/30 rounded-xl p-1">
              {(['FORWARD', 'TARGET', 'PLOT'] as Mode[]).map((mo) => (
                <button
                  key={mo}
                  onClick={() => setMode(mo)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold transition-colors ${mode === mo ? 'bg-[var(--accent)] text-white' : 'text-[#9AA7BD] hover:text-white'}`}
                >
                  {MODE_LABEL[mo]}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelCls}>Product</label>
                <select className={inputCls} value={f.product} onChange={(e) => setProduct(e.target.value as PlannerProduct)}>
                  {products.map((p) => (
                    <option key={p} value={p}>{PRODUCT_LABEL[p]}</option>
                  ))}
                </select>
              </div>

              {/* Mode-specific primary inputs */}
              {mode === 'FORWARD' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Shed length (ft)</label>
                    <input className={inputCls} inputMode="decimal" value={f.houseLengthFt} onChange={(e) => set('houseLengthFt', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Rows</label>
                    <input className={inputCls} inputMode="numeric" value={f.rows} onChange={(e) => set('rows', e.target.value)} />
                  </div>
                </div>
              )}
              {mode === 'TARGET' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Target females</label>
                    <input className={inputCls} inputMode="numeric" value={f.targetFemales} onChange={(e) => set('targetFemales', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Rows</label>
                    <input className={inputCls} inputMode="numeric" value={f.rows} onChange={(e) => set('rows', e.target.value)} />
                  </div>
                </div>
              )}
              {mode === 'PLOT' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Target females</label>
                    <input className={inputCls} inputMode="numeric" value={f.targetFemales} onChange={(e) => set('targetFemales', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Max width (ft)</label>
                    <input className={inputCls} inputMode="decimal" value={f.maxWidthFt} onChange={(e) => set('maxWidthFt', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Max length (ft, optional)</label>
                    <input className={inputCls} inputMode="decimal" value={f.maxLengthFt} placeholder="—" onChange={(e) => set('maxLengthFt', e.target.value)} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
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
                  <span className="text-white font-bold">{Number.isFinite(m) ? m : 0}</span> males per 100 females{' = '}
                  <span className="text-white font-bold">{pctOfTotal.toFixed(1)}%</span> of the total flock{' '}
                  ({Number.isFinite(m) ? 100 + m : 100} birds per 100 females).
                </p>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 p-8 md:p-10 bg-black/40 flex flex-col justify-center min-h-[560px]">
            {out.kind === 'blocked' ? (
              <div className="space-y-4">
                {out.report.messages.filter((x) => x.severity === 'BLOCK').map((msg, i) => <MessageRow key={i} m={msg} />)}
              </div>
            ) : out.kind === 'error' ? (
              <div className="rounded-xl border bg-red-500/10 border-red-500/30 text-red-300 px-4 py-3 text-sm">{out.text}</div>
            ) : out.kind === 'plot' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <p className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">Best fits for your plot</p>
                {out.options.length === 0 && <p className="text-[#9AA7BD]">No row count fits that width. Increase the maximum width.</p>}
                {out.options.map((o, i) => (
                  <div key={o.rows} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-black text-xl">
                        {o.rows} rows · {o.totalBirds.toLocaleString()} birds
                        {i === 0 && <span className="ml-2 text-[var(--accent)] text-xs font-bold uppercase">Best</span>}
                      </p>
                      <p className="text-[#9AA7BD] text-sm mt-1">
                        {o.recommendedHouseLengthFt.toFixed(1)} ft long · {o.widthFt.toFixed(2)} ft wide · {o.females.toLocaleString()} F / {o.males.toLocaleString()} M
                      </p>
                    </div>
                    <button onClick={() => useLayout(o)} className="shrink-0 bg-[var(--accent)] text-white font-bold px-4 py-2 rounded-xl hover:bg-[var(--accent)]/90">
                      Use this
                    </button>
                  </div>
                ))}
              </motion.div>
            ) : out.kind === 'result' ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {out.recommendedLengthFt !== null && (
                  <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1">Recommended shed length</p>
                    <p className="text-4xl font-black text-white">{out.recommendedLengthFt.toFixed(1)} ft</p>
                    <p className="text-[#9AA7BD] text-xs mt-1">Smallest shed that meets your target, run back through the forward engine for exact numbers.</p>
                  </div>
                )}

                <div>
                  <p className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm mb-1">Farm Plan Summary</p>
                  <h3 className="text-2xl font-black text-white">
                    {out.result.flock.total.toLocaleString()} birds · {out.result.flock.females.toLocaleString()} F / {out.result.flock.males.toLocaleString()} M
                  </h3>
                  <p className="text-[#9AA7BD] text-sm mt-1">
                    Target {out.result.flock.targetMalePct.toFixed(1)} males/100 females — achieved{' '}
                    <span className="text-white font-bold">{out.result.flock.achievedMalePct.toFixed(2)}</span> ({out.result.layout.mixedSections} of{' '}
                    {out.result.layout.totalSections} sections carry a male tier).
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Stat highlight title="Total birds" value={out.result.flock.total.toLocaleString()} sub={`${out.result.flock.females.toLocaleString()} females + ${out.result.flock.males.toLocaleString()} males`} />
                  <Stat title="Sections per row" value={String(out.result.layout.sectionsPerRow)} sub={`${out.result.layout.totalSections.toLocaleString()} sections total`} />
                  <Stat title="Mixed / female sections" value={`${out.result.layout.mixedSections} / ${out.result.layout.femaleSections}`} sub="mixed carry the male top tier" />
                  <Stat title="Shed width" value={`${out.result.shed.widthFt.toFixed(2)} ft`} sub={`${out.result.shed.widthMm.toLocaleString()} mm`} />
                  <Stat title="Shed height" value={`${out.result.shed.heightFt} ft`} sub={`${out.result.shed.headroomMm.toFixed(0)} mm clear headroom`} />
                  <Stat title="Shed length" value={`${out.result.shed.lengthFt.toFixed(2)} ft`} sub={`cage ${out.result.layout.cageLengthFt.toFixed(2)} ft · front ${out.result.layout.frontServiceFt.toFixed(2)} ft`} />
                </div>

                {/* Walkway gaps (D9) — feeder-to-feeder, shown in ft + mm */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#9AA7BD]">Walkway gaps (feeder-to-feeder)</p>
                  <p className="text-white text-sm">
                    Side {(out.result.shed.sideGapMm * MM_TO_FT).toFixed(2)} ft ({out.result.shed.sideGapMm.toLocaleString()} mm)
                    {out.result.layout.totalSections > 0 && out.effInput.rows > 1 && (
                      <> · Centre {(out.result.shed.centreGapMm * MM_TO_FT).toFixed(2)} ft ({out.result.shed.centreGapMm.toLocaleString()} mm)</>
                    )}
                  </p>
                  <p className="text-[#9AA7BD] text-xs mt-1">Metplast standard is 3.5–4.0 ft; warned below 3.5 ft, not allowed below 3.0 ft.</p>
                </div>

                {/* D7 — male tier allocation disclaimer, on every output */}
                <div className="rounded-xl border bg-sky-500/10 border-sky-500/30 text-sky-200 px-4 py-3 text-sm">
                  Males sit on the middle tier by default (customer-changeable). <span className="font-semibold">Male tier allocation to be confirmed by Metplast Sales Engineer.</span>
                </div>

                {/* Per-bird metrics — Step 9 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3 text-[#9AA7BD]">Per-bird space (Step 9)</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80">
                    <span>Female area</span>
                    <span className="text-right text-white font-semibold">{out.result.perBird.femaleAreaIn2.toFixed(1)} in² · {out.result.perBird.femaleAreaM2.toFixed(3)} m²</span>
                    <span>Male area</span>
                    <span className="text-right text-white font-semibold">{out.result.perBird.maleAreaIn2.toFixed(1)} in² · {out.result.perBird.maleAreaM2.toFixed(3)} m²</span>
                    <span>Female feeding space</span>
                    <span className="text-right text-white font-semibold">{out.result.perBird.femaleFeedSpaceIn.toFixed(2)} in/bird</span>
                    <span>Male feeding space</span>
                    <span className="text-right text-white font-semibold">{out.result.perBird.maleFeedSpaceIn.toFixed(2)} in/bird</span>
                  </div>
                </div>

                {/* Dead-length indicator — V10 / Section 9.3 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#9AA7BD]">Unused shed length (dead length)</p>
                  <p className="text-2xl font-black text-white">{out.result.layout.deadLengthFt.toFixed(2)} ft</p>
                  <p className="text-[#9AA7BD] text-xs mt-1">Length left over after whole sections, kits and service areas. A different box size may use it better.</p>
                </div>

                {out.report.messages.length > 0 && (
                  <div className="space-y-2">{out.report.messages.map((msg, i) => <MessageRow key={i} m={msg} />)}</div>
                )}

                {/* Layout drawings — Phase 5 / Section 16 */}
                {view?.drawings && (
                  <div className="space-y-3">
                    <p className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">Layout drawings</p>
                    <div className="bg-white rounded-2xl p-3 overflow-x-auto">
                      <div className="min-w-[520px]" dangerouslySetInnerHTML={{ __html: view.drawings.crossSection }} />
                    </div>
                    <div className="bg-white rounded-2xl p-3 overflow-x-auto">
                      <div className="min-w-[520px]" dangerouslySetInnerHTML={{ __html: view.drawings.plan }} />
                    </div>
                    <p className="text-[#9AA7BD] text-xs">Approximate overview. Male line layout and positioning are finalised during execution.</p>
                  </div>
                )}

                {/* Bill of quantities — Phase 7 / Section 17 */}
                {view?.boq && <BoqPanel boq={view.boq} />}

                <div className="pt-5 border-t border-white/10">
                  <p className="text-[#9AA7BD] mb-3 text-xs font-medium">* Preliminary planning estimate. Male line layout and positioning are finalised during execution.</p>
                  <button
                    onClick={() => sendToMetplast(out.result.flock.total)}
                    className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-black text-lg transition-all flex items-center justify-center"
                  >
                    Send This Requirement to Metplast <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center opacity-50 py-12">
                <Calculator className="w-16 h-16 text-[#9AA7BD] mx-auto mb-4 opacity-50" />
                <p className="text-[#9AA7BD] text-lg">Enter details to see the plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
