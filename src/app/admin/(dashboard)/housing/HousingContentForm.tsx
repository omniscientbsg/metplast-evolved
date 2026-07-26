"use client";

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type { HousingContent, SystemComponent, FarmType, ProjectStep } from '@/lib/content/housing-content';

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

/** Generic add/remove/reorder list editor (all housing lists are free lists). */
function ListEditor<T extends object>({ items, onChange, blank, renderRow, label: listLabel }: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: T;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  label: string;
}) {
  function update(i: number, patch: Partial<T>) {
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  }
  function add() { onChange([...items, blank]); }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)); }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
          {renderRow(it, (patch) => update(i, patch))}
          <div className="flex gap-3 justify-end text-sm">
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="text-white/50 hover:text-white disabled:opacity-20">↑</button>
            <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="text-white/50 hover:text-white disabled:opacity-20">↓</button>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300">Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm font-bold text-primary hover:opacity-80">+ Add {listLabel}</button>
    </div>
  );
}

type SectionKey = 'whatWeBuild' | 'whoItsFor' | 'projectFlow' | 'cta';

export function HousingContentForm({ initial }: { initial: HousingContent }) {
  const router = useRouter();
  const [v, setV] = useState<HousingContent>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  function setSection<K extends SectionKey>(k: K, patch: Partial<HousingContent[K]>) {
    setV((p) => ({ ...p, [k]: { ...p[k], ...patch } }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setOk(false);
    try {
      const res = await fetch('/api/admin/housing', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Save failed.'); return; }
      setOk(true); router.refresh();
    } catch { setError('Save failed (network error).'); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">Housing Page — Content</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {ok && <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm">Saved.</div>}

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">What We Build</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.whatWeBuild.heading} onChange={(e) => setSection('whatWeBuild', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Intro</label>
          <textarea className={input} rows={2} value={v.whatWeBuild.intro} onChange={(e) => setSection('whatWeBuild', { intro: e.target.value })} />
        </div>
        <ListEditor<SystemComponent>
          label="component"
          items={v.whatWeBuild.components}
          onChange={(next) => setSection('whatWeBuild', { components: next })}
          blank={{ title: '', desc: '' }}
          renderRow={(item, update) => (
            <>
              <input className={input} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <textarea className={input} rows={2} placeholder="Description" value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
            </>
          )}
        />
        <p className="text-xs text-white/40">Icons are fixed per position in the grid.</p>
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Who It&apos;s For</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.whoItsFor.heading} onChange={(e) => setSection('whoItsFor', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Intro</label>
          <textarea className={input} rows={2} value={v.whoItsFor.intro} onChange={(e) => setSection('whoItsFor', { intro: e.target.value })} />
        </div>
        <ListEditor<FarmType>
          label="farm type"
          items={v.whoItsFor.types}
          onChange={(next) => setSection('whoItsFor', { types: next })}
          blank={{ label: '', desc: '', href: '' }}
          renderRow={(item, update) => (
            <>
              <input className={input} placeholder="Label" value={item.label} onChange={(e) => update({ label: e.target.value })} />
              <input className={input} placeholder="Description" value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
              <input className={input} placeholder="/href" value={item.href} onChange={(e) => update({ href: e.target.value })} />
            </>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Project Flow</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.projectFlow.heading} onChange={(e) => setSection('projectFlow', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Intro</label>
          <textarea className={input} rows={2} value={v.projectFlow.intro} onChange={(e) => setSection('projectFlow', { intro: e.target.value })} />
        </div>
        <ListEditor<ProjectStep>
          label="step"
          items={v.projectFlow.steps}
          onChange={(next) => setSection('projectFlow', { steps: next })}
          blank={{ step: '', title: '', desc: '' }}
          renderRow={(item, update) => (
            <>
              <div className="flex gap-2">
                <input className={`${input} w-24`} placeholder="01" value={item.step} onChange={(e) => update({ step: e.target.value })} />
                <input className={input} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              </div>
              <textarea className={input} rows={2} placeholder="Description" value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
            </>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">CTA</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.cta.heading} onChange={(e) => setSection('cta', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Body</label>
          <textarea className={input} rows={2} value={v.cta.body} onChange={(e) => setSection('cta', { body: e.target.value })} />
        </div>
        <div>
          <label className={label}>Button label</label>
          <input className={input} value={v.cta.buttonLabel} onChange={(e) => setSection('cta', { buttonLabel: e.target.value })} />
        </div>
        <div>
          <label className={label}>Href</label>
          <input className={input} value={v.cta.href} onChange={(e) => setSection('cta', { href: e.target.value })} />
        </div>
        <p className="text-xs text-white/40">The secondary &ldquo;Farm Calculator&rdquo; button is fixed.</p>
      </fieldset>
    </form>
  );
}
