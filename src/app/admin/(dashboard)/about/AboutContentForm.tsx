"use client";

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type { AboutContent, StatTile, ValueCard } from '@/lib/content/about-content';
import { uploadImage as uploadImageApi } from '@/lib/upload-client';

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

function ListEditor<T extends object>({ items, onChange, blank, renderRow, label: listLabel, fixed = false }: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: T;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  label: string;
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

function ImageField({ image, onUploaded, onError }: { image: string; onUploaded: (path: string) => void; onError: (msg: string) => void }) {
  async function handle(file: File) {
    try {
      onUploaded(await uploadImageApi(file));
    } catch (e) { onError(e instanceof Error ? e.message : 'Image upload failed.'); }
  }
  return (
    <div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="w-40 h-24 object-cover rounded-lg border border-white/10 mb-2" />
      )}
      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ''; }} className="text-white/70 text-sm" />
    </div>
  );
}

type SectionKey = 'story' | 'imageBadge' | 'values';

export function AboutContentForm({ initial }: { initial: AboutContent }) {
  const router = useRouter();
  const [v, setV] = useState<AboutContent>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  function set<K extends keyof AboutContent>(k: K, val: AboutContent[K]) { setV((p) => ({ ...p, [k]: val })); }
  function setSection<K extends SectionKey>(k: K, patch: Partial<AboutContent[K]>) {
    setV((p) => ({ ...p, [k]: { ...p[k], ...patch } }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setOk(false);
    try {
      const res = await fetch('/api/admin/about', {
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
        <h1 className="text-3xl font-black text-white tracking-tight">About Page — Content</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {ok && <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm">Saved.</div>}

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Story block</legend>
        <div>
          <label className={label}>Heading (line 1)</label>
          <input className={input} value={v.story.heading} onChange={(e) => setSection('story', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Subheading (line 2, muted)</label>
          <input className={input} value={v.story.subheading} onChange={(e) => setSection('story', { subheading: e.target.value })} />
        </div>
        <p className="text-xs text-white/40">The story paragraphs are edited under Pages &rarr; About (intro).</p>
        <div>
          <label className={label}>Stat tiles</label>
          <ListEditor<StatTile>
            label="stat"
            fixed
            items={v.stats}
            onChange={(next) => set('stats', next)}
            blank={{ top: '', bottom: '' }}
            renderRow={(item, update) => (
              <div className="flex gap-2">
                <input className={input} placeholder="Top (e.g. 35+)" value={item.top} onChange={(e) => update({ top: e.target.value })} />
                <input className={input} placeholder="Label" value={item.bottom} onChange={(e) => update({ bottom: e.target.value })} />
              </div>
            )}
          />
        </div>
        <div>
          <label className={label}>Main image</label>
          <ImageField image={v.mainImage} onUploaded={(path) => set('mainImage', path)} onError={setError} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Image badge — eyebrow</label>
            <input className={input} value={v.imageBadge.eyebrow} onChange={(e) => setSection('imageBadge', { eyebrow: e.target.value })} />
          </div>
          <div>
            <label className={label}>Image badge — title</label>
            <input className={input} value={v.imageBadge.title} onChange={(e) => setSection('imageBadge', { title: e.target.value })} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Why Choose Metplast</legend>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={v.values.heading} onChange={(e) => setSection('values', { heading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Accent (gradient)</label>
          <input className={input} value={v.values.accent} onChange={(e) => setSection('values', { accent: e.target.value })} />
        </div>
        <div>
          <label className={label}>Intro</label>
          <textarea className={input} rows={3} value={v.values.intro} onChange={(e) => setSection('values', { intro: e.target.value })} />
        </div>
        <ListEditor<ValueCard>
          label="value card"
          items={v.values.cards}
          onChange={(next) => setSection('values', { cards: next })}
          blank={{ title: '', desc: '' }}
          renderRow={(item, update) => (
            <>
              <input className={input} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <textarea className={input} rows={2} placeholder="Description" value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
            </>
          )}
        />
        <p className="text-xs text-white/40">Card icons are fixed per position.</p>
      </fieldset>
    </form>
  );
}
