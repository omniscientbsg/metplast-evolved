"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SELF_CONTAINED_BLOCKS } from '@/lib/content/section-mapper';

const PAGES = ['layer', 'breeder', 'broiler', 'environmental-control', 'feed-silos'];

interface Spec { label: string; value: string }
interface InfoBlock { id?: string; heading: string; lines: string[] }

export interface ProductFormValues {
  page: string;
  slug: string;
  title: string;
  badge: string;
  tag: string;
  calculatorHref: string;
  descriptions: string[];
  features: string[];
  benefits: string[];
  specs: Spec[];
  images: string[];
  infoBlocks: InfoBlock[];
  topBlockKeys: string[];
  bottomBlockKeys: string[];
  visible: boolean;
  sortOrder: number;
}

const EMPTY: ProductFormValues = {
  page: 'layer', slug: '', title: '', badge: '', tag: '', calculatorHref: '',
  descriptions: [], features: [], benefits: [], specs: [], images: [],
  infoBlocks: [], topBlockKeys: [], bottomBlockKeys: [], visible: true, sortOrder: 0,
};

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function ProductForm({
  mode,
  id,
  initial,
}: {
  mode: 'create' | 'edit';
  id?: string;
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function toggleKey(field: 'topBlockKeys' | 'bottomBlockKeys', key: string) {
    setV((p) => {
      const has = p[field].includes(key);
      return { ...p, [field]: has ? p[field].filter((k) => k !== key) : [...p[field], key] };
    });
  }

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      setError('Image upload failed.');
      return;
    }
    const { path } = await res.json();
    set('images', [...v.images, path]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || 'Save failed.');
      return;
    }
    router.push('/admin/products');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-8 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {mode === 'create' ? 'Add Section' : 'Edit Section'}
        </h1>
        <button type="submit" disabled={saving}
          className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Page</label>
          <select className={input} value={v.page} onChange={(e) => set('page', e.target.value)}>
            {PAGES.map((p) => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Slug (unique)</label>
          <input className={input} value={v.slug} onChange={(e) => set('slug', e.target.value)} placeholder="h-type-layer" />
        </div>
      </div>

      <div>
        <label className={label}>Title</label>
        <input className={input} value={v.title} onChange={(e) => set('title', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Badge (optional)</label>
          <input className={input} value={v.badge} onChange={(e) => set('badge', e.target.value)} />
        </div>
        <div>
          <label className={label}>Tag (optional)</label>
          <input className={input} value={v.tag} onChange={(e) => set('tag', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Calculator Href (optional)</label>
          <input className={input} value={v.calculatorHref} onChange={(e) => set('calculatorHref', e.target.value)} placeholder="/calculators/layer" />
        </div>
        <div>
          <label className={label}>Order</label>
          <input type="number" className={input} value={v.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
        </div>
      </div>

      <label className="flex items-center gap-3 text-white/80">
        <input type="checkbox" checked={v.visible} onChange={(e) => set('visible', e.target.checked)} />
        Visible on the public page
      </label>

      <StringList title="Description lines" items={v.descriptions} onChange={(x) => set('descriptions', x)} />
      <StringList title="Features" items={v.features} onChange={(x) => set('features', x)} />
      <StringList title="Benefits" items={v.benefits} onChange={(x) => set('benefits', x)} />

      <SpecList specs={v.specs} onChange={(x) => set('specs', x)} />
      <InfoBlockList blocks={v.infoBlocks} onChange={(x) => set('infoBlocks', x)} />

      <div>
        <label className={label}>Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {v.images.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-24 h-24 object-cover rounded-lg border border-white/10" />
              <button type="button" onClick={() => set('images', v.images.filter((_, j) => j !== i))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }}
          className="text-white/70 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <BlockPicker title="Top blocks" selected={v.topBlockKeys} onToggle={(k) => toggleKey('topBlockKeys', k)} />
        <BlockPicker title="Bottom blocks" selected={v.bottomBlockKeys} onToggle={(k) => toggleKey('bottomBlockKeys', k)} />
      </div>
    </form>
  );
}

function StringList({ title, items, onChange }: { title: string; items: string[]; onChange: (x: string[]) => void }) {
  return (
    <div>
      <label className={label}>{title}</label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className={input} value={it}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-red-400 px-2">×</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ''])}
          className="text-primary text-sm font-bold">+ Add</button>
      </div>
    </div>
  );
}

function SpecList({ specs, onChange }: { specs: Spec[]; onChange: (x: Spec[]) => void }) {
  return (
    <div>
      <label className={label}>Specs (label / value)</label>
      <div className="space-y-2">
        {specs.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input className={input} placeholder="Label" value={s.label}
              onChange={(e) => onChange(specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <input className={input} placeholder="Value" value={s.value}
              onChange={(e) => onChange(specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
            <button type="button" onClick={() => onChange(specs.filter((_, j) => j !== i))}
              className="text-red-400 px-2">×</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...specs, { label: '', value: '' }])}
          className="text-primary text-sm font-bold">+ Add spec</button>
      </div>
    </div>
  );
}

function InfoBlockList({ blocks, onChange }: { blocks: InfoBlock[]; onChange: (x: InfoBlock[]) => void }) {
  return (
    <div>
      <label className={label}>Info blocks (heading + lines, shown above the grid)</label>
      <div className="space-y-4">
        {blocks.map((b, i) => (
          <div key={i} className="border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex gap-2">
              <input className={input} placeholder="Heading" value={b.heading}
                onChange={(e) => onChange(blocks.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)))} />
              <button type="button" onClick={() => onChange(blocks.filter((_, j) => j !== i))}
                className="text-red-400 px-2">×</button>
            </div>
            <StringList title="Lines" items={b.lines}
              onChange={(lines) => onChange(blocks.map((x, j) => (j === i ? { ...x, lines } : x)))} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...blocks, { heading: '', lines: [] }])}
          className="text-primary text-sm font-bold">+ Add info block</button>
      </div>
    </div>
  );
}

function BlockPicker({ title, selected, onToggle }: { title: string; selected: string[]; onToggle: (k: string) => void }) {
  return (
    <div>
      <label className={label}>{title}</label>
      <div className="space-y-1">
        {SELF_CONTAINED_BLOCKS.map((k) => (
          <label key={k} className="flex items-center gap-2 text-white/80 text-sm">
            <input type="checkbox" checked={selected.includes(k)} onChange={() => onToggle(k)} />
            {k}
          </label>
        ))}
      </div>
    </div>
  );
}
