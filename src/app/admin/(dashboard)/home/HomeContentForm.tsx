"use client";

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type {
  HomeContent,
  StatTile,
  FeatureCard,
  SolutionCard,
  OverviewTile,
  CalcCard,
  Teaser,
} from '@/lib/content/home-content';
import { uploadImage as uploadImageApi } from '@/lib/upload-client';

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

/** Generic add/remove/reorder list editor. Mirrors CrossLinksEditor's move/add/remove logic. */
function ListEditor<T extends object>({ items, onChange, blank, renderRow, label: listLabel, fixed = false }: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: T;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  label: string;
  // `fixed` = the section is rendered by fixed index on the site (hero stats, teasers):
  // edit in place only — no add/remove/reorder, so the array length can't drift and
  // crash the public page.
  fixed?: boolean;
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
          {!fixed && (
            <div className="flex gap-3 justify-end text-sm">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="text-white/50 hover:text-white disabled:opacity-20">↑</button>
              <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="text-white/50 hover:text-white disabled:opacity-20">↓</button>
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300">Remove</button>
            </div>
          )}
        </div>
      ))}
      {!fixed && (
        <button type="button" onClick={add} className="text-sm font-bold text-primary hover:opacity-80">+ Add {listLabel}</button>
      )}
    </div>
  );
}

/** Small image upload field: preview of the current path + a file input that uploads and reports the new path back. */
function ImageField({ image, onUploaded, onError }: {
  image: string;
  onUploaded: (path: string) => void;
  onError: (msg: string) => void;
}) {
  async function handle(file: File) {
    try {
      onUploaded(await uploadImageApi(file));
    } catch (e) { onError(e instanceof Error ? e.message : 'Image upload failed.'); }
  }
  return (
    <div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="w-32 h-20 object-cover rounded-lg border border-white/10 mb-2" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ''; }}
        className="text-white/70 text-sm"
      />
    </div>
  );
}

type ObjectKey = 'positioning' | 'overview' | 'calculators' | 'cta';

export function HomeContentForm({ initial }: { initial: HomeContent }) {
  const router = useRouter();
  const [v, setV] = useState<HomeContent>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  function set<K extends keyof HomeContent>(k: K, val: HomeContent[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }
  function setNested<K extends ObjectKey>(k: K, patch: Partial<HomeContent[K]>) {
    setV((p) => ({ ...p, [k]: { ...p[k], ...patch } }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setOk(false);
    try {
      const res = await fetch('/api/admin/home', {
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
        <h1 className="text-3xl font-black text-white tracking-tight">Home Page — Content</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {ok && <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm">Saved.</div>}

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Hero stats</legend>
        <ListEditor<StatTile>
          label="stat"
          fixed
          items={v.heroStats}
          onChange={(next) => set('heroStats', next)}
          blank={{ top: '', bottom: '' }}
          renderRow={(item, update) => (
            <div className="flex gap-2">
              <input className={input} placeholder="Top (e.g. 35+)" value={item.top} onChange={(e) => update({ top: e.target.value })} />
              <input className={input} placeholder="Bottom label" value={item.bottom} onChange={(e) => update({ bottom: e.target.value })} />
            </div>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Feature cards</legend>
        <ListEditor<FeatureCard>
          label="feature card"
          items={v.featureCards}
          onChange={(next) => set('featureCards', next)}
          blank={{ title: '', body: '' }}
          renderRow={(item, update) => (
            <>
              <input className={input} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <textarea className={input} rows={2} placeholder="Body" value={item.body} onChange={(e) => update({ body: e.target.value })} />
            </>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Positioning</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.positioning.heading} onChange={(e) => setNested('positioning', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Accent</label>
          <input className={input} value={v.positioning.accent} onChange={(e) => setNested('positioning', { accent: e.target.value })} />
        </div>
        <div>
          <label className={label}>Body</label>
          <textarea className={input} rows={3} value={v.positioning.body} onChange={(e) => setNested('positioning', { body: e.target.value })} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Solution cards</legend>
        <ListEditor<SolutionCard>
          label="solution card"
          items={v.solutionCards}
          onChange={(next) => set('solutionCards', next)}
          blank={{ title: '', desc: '', image: '', href: '' }}
          renderRow={(item, update) => (
            <>
              <input className={input} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <input className={input} placeholder="Description" value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
              <input className={input} placeholder="/href" value={item.href} onChange={(e) => update({ href: e.target.value })} />
              <ImageField image={item.image} onUploaded={(path) => update({ image: path })} onError={setError} />
            </>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Overview</legend>
        <div>
          <label className={label}>Eyebrow</label>
          <input className={input} value={v.overview.eyebrow} onChange={(e) => setNested('overview', { eyebrow: e.target.value })} />
        </div>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.overview.heading} onChange={(e) => setNested('overview', { heading: e.target.value })} />
        </div>
        <ListEditor<OverviewTile>
          label="tile"
          items={v.overview.tiles}
          onChange={(next) => setNested('overview', { tiles: next })}
          blank={{ name: '', href: '' }}
          renderRow={(item, update) => (
            <div className="flex gap-2">
              <input className={input} placeholder="Name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <input className={input} placeholder="/href" value={item.href} onChange={(e) => update({ href: e.target.value })} />
            </div>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Calculators</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.calculators.heading} onChange={(e) => setNested('calculators', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Accent</label>
          <input className={input} value={v.calculators.accent} onChange={(e) => setNested('calculators', { accent: e.target.value })} />
        </div>
        <div>
          <label className={label}>Body</label>
          <textarea className={input} rows={2} value={v.calculators.body} onChange={(e) => setNested('calculators', { body: e.target.value })} />
        </div>
        <ListEditor<CalcCard>
          label="calculator card"
          items={v.calculators.cards}
          onChange={(next) => setNested('calculators', { cards: next })}
          blank={{ title: '', image: '', href: '' }}
          renderRow={(item, update) => (
            <>
              <input className={input} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <input className={input} placeholder="/href" value={item.href} onChange={(e) => update({ href: e.target.value })} />
              <ImageField image={item.image} onUploaded={(path) => update({ image: path })} onError={setError} />
            </>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Teasers</legend>
        <ListEditor<Teaser>
          label="teaser"
          fixed
          items={v.teasers}
          onChange={(next) => set('teasers', next)}
          blank={{ title: '', desc: '', ctaLabel: '' }}
          renderRow={(item, update) => (
            <>
              <input className={input} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <textarea className={input} rows={2} placeholder="Description" value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
              <input className={input} placeholder="CTA label" value={item.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} />
            </>
          )}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">CTA</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.cta.heading} onChange={(e) => setNested('cta', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Body</label>
          <textarea className={input} rows={2} value={v.cta.body} onChange={(e) => setNested('cta', { body: e.target.value })} />
        </div>
        <div>
          <label className={label}>Button label</label>
          <input className={input} value={v.cta.buttonLabel} onChange={(e) => setNested('cta', { buttonLabel: e.target.value })} />
        </div>
        <div>
          <label className={label}>Href</label>
          <input className={input} value={v.cta.href} onChange={(e) => setNested('cta', { href: e.target.value })} />
        </div>
      </fieldset>
    </form>
  );
}
