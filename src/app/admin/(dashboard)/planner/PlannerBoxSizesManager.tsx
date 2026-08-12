'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateBoxSizeInput, boxFamily, type PlannerProduct } from '@/lib/planner/master-data'

export interface BoxRow {
  id: string
  product: PlannerProduct
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
  valid: boolean
  active: boolean
}

type FormState = {
  product: PlannerProduct
  boxSize: string
  femaleFrontIn: string
  femaleDepthIn: string
  maleFrontIn: string
  maleDepthIn: string
  fBoxesPerLine: string
  mBoxesPerLine: string
  birdsPerFBox: string
  birdsPerMBox: string
  autoFitMaleFront: boolean
}

const BLANK: FormState = {
  product: 'BREEDER',
  boxSize: '',
  femaleFrontIn: '',
  femaleDepthIn: '18',
  maleFrontIn: '',
  maleDepthIn: '18',
  fBoxesPerLine: '4',
  mBoxesPerLine: '3',
  birdsPerFBox: '2',
  birdsPerMBox: '2',
  autoFitMaleFront: false,
}

const input =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary text-sm'
const label = 'block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1'

function toForm(r: BoxRow): FormState {
  return {
    product: r.product,
    boxSize: String(r.boxSize),
    femaleFrontIn: String(r.femaleFrontIn),
    femaleDepthIn: String(r.femaleDepthIn),
    maleFrontIn: String(r.maleFrontIn),
    maleDepthIn: String(r.maleDepthIn),
    fBoxesPerLine: String(r.fBoxesPerLine),
    mBoxesPerLine: String(r.mBoxesPerLine),
    birdsPerFBox: String(r.birdsPerFBox),
    birdsPerMBox: String(r.birdsPerMBox),
    autoFitMaleFront: r.autoFitMaleFront,
  }
}

export function PlannerBoxSizesManager({ initial }: { initial: BoxRow[] }) {
  const router = useRouter()
  const [rows, setRows] = useState<BoxRow[]>(initial)
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Live Golden Rule feedback from the shared validator.
  const check = useMemo(() => validateBoxSizeInput(form), [form])

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  function startNew() {
    setForm(BLANK)
    setEditing('new')
    setError('')
  }
  function startEdit(r: BoxRow) {
    setForm(toForm(r))
    setEditing(r.id)
    setError('')
  }
  function cancel() {
    setEditing(null)
    setError('')
  }

  async function save() {
    if (!check.ok) return
    setSaving(true)
    setError('')
    const url = editing === 'new' ? '/api/admin/planner/box-sizes' : `/api/admin/planner/box-sizes/${editing}`
    const method = editing === 'new' ? 'POST' : 'PUT'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...check.row }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error || 'Save failed.')
        return
      }
      const saved = (await res.json()) as BoxRow
      setRows((prev) => {
        const rest = prev.filter((r) => r.id !== saved.id)
        return [...rest, saved].sort((a, b) => a.product.localeCompare(b.product) || a.boxSize - b.boxSize)
      })
      setEditing(null)
      router.refresh()
    } catch {
      setError('Save failed (network error).')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    setError('')
    try {
      const res = await fetch(`/api/admin/planner/box-sizes/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error || 'Delete failed.')
        return
      }
      setRows((prev) => prev.filter((r) => r.id !== id))
      setConfirmDelete(null)
      router.refresh()
    } catch {
      setError('Delete failed (network error).')
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {editing === null && (
        <button onClick={startNew} className="bg-primary text-white font-bold px-5 py-2 rounded-xl hover:bg-primary/90">
          + Add box size
        </button>
      )}

      {editing !== null && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white">{editing === 'new' ? 'New box size' : 'Edit box size'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={label}>Product</label>
              <select className={input} value={form.product} onChange={(e) => set('product', e.target.value as PlannerProduct)}>
                <option value="BREEDER" className="bg-slate-900">Breeder</option>
                <option value="BREEDER_PULLET" className="bg-slate-900">Breeder Pullet</option>
              </select>
            </div>
            <div>
              <label className={label}>Box size #</label>
              <input className={input} inputMode="numeric" value={form.boxSize} onChange={(e) => set('boxSize', e.target.value)} />
            </div>
            <div>
              <label className={label}>Female front (in)</label>
              <input className={input} inputMode="decimal" value={form.femaleFrontIn} onChange={(e) => set('femaleFrontIn', e.target.value)} />
            </div>
            <div>
              <label className={label}>Female depth (in)</label>
              <input className={input} inputMode="decimal" value={form.femaleDepthIn} onChange={(e) => set('femaleDepthIn', e.target.value)} />
            </div>
            <div>
              <label className={label}>Male front (in)</label>
              <input
                className={`${input} disabled:opacity-40`}
                inputMode="decimal"
                value={form.autoFitMaleFront ? check.impliedMaleFrontIn?.toFixed(3) ?? '' : form.maleFrontIn}
                disabled={form.autoFitMaleFront}
                onChange={(e) => set('maleFrontIn', e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Male depth (in)</label>
              <input className={input} inputMode="decimal" value={form.maleDepthIn} onChange={(e) => set('maleDepthIn', e.target.value)} />
            </div>
            <div>
              <label className={label}>F boxes / line (nF)</label>
              <input className={input} inputMode="numeric" value={form.fBoxesPerLine} onChange={(e) => set('fBoxesPerLine', e.target.value)} />
            </div>
            <div>
              <label className={label}>M boxes / line (nM)</label>
              <input className={input} inputMode="numeric" value={form.mBoxesPerLine} onChange={(e) => set('mBoxesPerLine', e.target.value)} />
            </div>
            <div>
              <label className={label}>Birds / F box (bF)</label>
              <input className={input} inputMode="numeric" value={form.birdsPerFBox} onChange={(e) => set('birdsPerFBox', e.target.value)} />
            </div>
            <div>
              <label className={label}>Birds / M box (bM)</label>
              <input className={input} inputMode="numeric" value={form.birdsPerMBox} onChange={(e) => set('birdsPerMBox', e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-white/80 text-sm self-end pb-2">
              <input type="checkbox" checked={form.autoFitMaleFront} onChange={(e) => set('autoFitMaleFront', e.target.checked)} />
              Auto-fit male front
            </label>
          </div>

          {/* Live Golden Rule helper (Section 6.2) */}
          <div
            className={`rounded-xl px-4 py-3 text-sm border ${
              check.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {check.ok ? (
              <>
                ✓ Golden Rule satisfied — section length {(check.row.femaleFrontIn * check.row.fBoxesPerLine).toFixed(3)} in (
                {((check.row.femaleFrontIn * check.row.fBoxesPerLine) / 12).toFixed(3)} ft). Implied male front{' '}
                {check.impliedMaleFrontIn.toFixed(3)} in.
              </>
            ) : (
              <>
                ✗ {check.error}
                {check.impliedMaleFrontIn !== null && !form.autoFitMaleFront && (
                  <>
                    {' '}
                    <button
                      type="button"
                      className="underline font-semibold"
                      onClick={() => set('maleFrontIn', check.impliedMaleFrontIn!.toFixed(3))}
                    >
                      Use {check.impliedMaleFrontIn.toFixed(3)} in
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={!check.ok || saving}
              className="bg-primary text-white font-bold px-5 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} className="text-white/60 hover:text-white px-5 py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-white/10 rounded-2xl">
        <table className="w-full text-sm text-white/80">
          <thead className="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-3 py-3">#</th>
              <th className="text-left px-3 py-3">Family</th>
              <th className="text-right px-3 py-3">F front</th>
              <th className="text-right px-3 py-3">M front</th>
              <th className="text-right px-3 py-3">nF / nM</th>
              <th className="text-right px-3 py-3">bF / bM</th>
              <th className="text-right px-3 py-3">Section (ft)</th>
              <th className="text-center px-3 py-3">Valid</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-6 text-center text-white/40">No box sizes yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="px-4 py-3">{r.product === 'BREEDER' ? 'Breeder' : 'Pullet'}</td>
                <td className="px-3 py-3">{r.boxSize}</td>
                <td className="px-3 py-3">{boxFamily(r)}</td>
                <td className="px-3 py-3 text-right">{r.femaleFrontIn}</td>
                <td className="px-3 py-3 text-right">
                  {r.maleFrontIn.toFixed(3).replace(/\.?0+$/, '')}
                  {r.autoFitMaleFront && <span className="text-white/40 text-xs"> *</span>}
                </td>
                <td className="px-3 py-3 text-right">{r.fBoxesPerLine} / {r.mBoxesPerLine}</td>
                <td className="px-3 py-3 text-right">{r.birdsPerFBox} / {r.birdsPerMBox}</td>
                <td className="px-3 py-3 text-right">{((r.femaleFrontIn * r.fBoxesPerLine) / 12).toFixed(3)}</td>
                <td className="px-3 py-3 text-center">
                  {r.valid ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>}
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  <button onClick={() => startEdit(r)} className="text-primary hover:underline mr-3">Edit</button>
                  {confirmDelete === r.id ? (
                    <>
                      <button onClick={() => remove(r.id)} className="text-red-400 hover:underline mr-2">Confirm</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-white/40 hover:underline">No</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDelete(r.id)} className="text-red-400/80 hover:underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-white/30 text-xs">* male front is auto-fit (derived from section length ÷ male boxes per line).</p>
    </div>
  )
}
