"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { PageContentView, PageDef } from '@/lib/content/page-content';
import { StringListEditor } from './StringListEditor';
import { CrossLinksEditor } from './CrossLinksEditor';

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function PageContentForm({ def, initial }: { def: PageDef; initial: PageContentView }) {
  const router = useRouter();
  const [v, setV] = useState<PageContentView>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  function set<K extends keyof PageContentView>(k: K, val: PageContentView[K]) { setV((p) => ({ ...p, [k]: val })); }
  function setCta(which: 'ctaPrimary' | 'ctaSecondary', patch: { label?: string; href?: string }) {
    setV((p) => {
      const cur = p[which] ?? { label: '', href: '' };
      const next = { ...cur, ...patch };
      return { ...p, [which]: next.label === '' && next.href === '' ? null : next };
    });
  }

  async function uploadImage(file: File) {
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) { setError('Image upload failed.'); return; }
      const { path } = await res.json();
      setV((p) => ({ ...p, image: path }));
    } catch { setError('Image upload failed (network error).'); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(''); setOk(false);
    try {
      const res = await fetch(`/api/admin/pages/${def.page}`, {
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
        <h1 className="text-3xl font-black text-white tracking-tight">{def.label} — Page Content</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {ok && <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm">Saved.</div>}

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Hero</legend>
        <div>
          <label className={label}>Eyebrow / badge (optional)</label>
          <input className={input} value={v.eyebrow ?? ''} onChange={(e) => set('eyebrow', e.target.value || null)} />
        </div>
        <div>
          <label className={label}>Title</label>
          <input className={input} value={v.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div>
          <label className={label}>Title accent (optional — rendered in gradient)</label>
          <input className={input} value={v.titleAccent ?? ''} onChange={(e) => set('titleAccent', e.target.value || null)} />
        </div>
        <div>
          <label className={label}>Subtitle</label>
          <textarea className={input} rows={2} value={v.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
        </div>
        <div>
          <label className={label}>Hero image (optional)</label>
          {v.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.image} alt="" className="w-56 h-28 object-cover rounded-lg border border-white/10 mb-3" />
          )}
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }} className="text-white/70 text-sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Primary CTA</label>
            <input className={`${input} mb-2`} placeholder="Label" value={v.ctaPrimary?.label ?? ''} onChange={(e) => setCta('ctaPrimary', { label: e.target.value })} />
            <input className={input} placeholder="/href" value={v.ctaPrimary?.href ?? ''} onChange={(e) => setCta('ctaPrimary', { href: e.target.value })} />
          </div>
          <div>
            <label className={label}>Secondary CTA</label>
            <input className={`${input} mb-2`} placeholder="Label" value={v.ctaSecondary?.label ?? ''} onChange={(e) => setCta('ctaSecondary', { label: e.target.value })} />
            <input className={input} placeholder="/href" value={v.ctaSecondary?.href ?? ''} onChange={(e) => setCta('ctaSecondary', { href: e.target.value })} />
          </div>
        </div>
      </fieldset>

      {def.hasIntro && (
        <fieldset className="border border-white/10 rounded-2xl p-5">
          <legend className="px-2 text-sm font-bold text-white/70">Intro paragraphs</legend>
          <StringListEditor label="" items={v.intro} onChange={(next) => set('intro', next)} placeholder="Paragraph text" />
        </fieldset>
      )}

      {def.hasCrossLinks && (
        <fieldset className="border border-white/10 rounded-2xl p-5">
          <legend className="px-2 text-sm font-bold text-white/70">Cross-links</legend>
          <CrossLinksEditor items={v.crossLinks} onChange={(next) => set('crossLinks', next)} />
        </fieldset>
      )}
    </form>
  );
}
