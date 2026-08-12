"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { uploadImage as uploadImageApi } from '@/lib/upload-client';

interface CatOption { id: string; name: string }

export interface GalleryFormValues {
  src: string;
  caption: string;
  categoryId: string;
  videoUrl: string;
  featured: boolean;
  visible: boolean;
}

const EMPTY: GalleryFormValues = { src: '', caption: '', categoryId: '', videoUrl: '', featured: false, visible: true };

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function GalleryForm({ mode, id, categories, initial }: {
  mode: 'create' | 'edit';
  id?: string;
  categories: CatOption[];
  initial?: GalleryFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState<GalleryFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof GalleryFormValues>(k: K, val: GalleryFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function uploadImage(file: File) {
    setError('');
    try {
      const path = await uploadImageApi(file);
      setV((p) => ({ ...p, src: path }));
    } catch (e) { setError(e instanceof Error ? e.message : 'Image upload failed.'); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.src) { setError('Please upload an image first.'); return; }
    setSaving(true); setError('');
    const url = mode === 'create' ? '/api/admin/gallery' : `/api/admin/gallery/${id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, categoryId: v.categoryId || null, videoUrl: v.videoUrl || null }),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Save failed.'); return; }
      router.push('/admin/gallery'); router.refresh();
    } catch { setError('Save failed (network error).'); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">{mode === 'create' ? 'Add Image' : 'Edit Image'}</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div>
        <label className={label}>Image</label>
        {v.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.src} alt="" className="w-40 h-40 object-cover rounded-lg border border-white/10 mb-3" />
        )}
        <input type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }}
          className="text-white/70 text-sm" />
      </div>

      <div>
        <label className={label}>Caption</label>
        <input className={input} value={v.caption} onChange={(e) => set('caption', e.target.value)} />
      </div>

      <div>
        <label className={label}>Category</label>
        <select className={input} value={v.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
          <option value="" className="bg-slate-900">Uncategorized</option>
          {categories.map((c) => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className={label}>Video embed URL (optional)</label>
        <input className={input} value={v.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://www.youtube.com/embed/…" />
      </div>

      <label className="flex items-center gap-3 text-white/80">
        <input type="checkbox" checked={v.featured} onChange={(e) => set('featured', e.target.checked)} />
        Featured (full-width tile)
      </label>
      <label className="flex items-center gap-3 text-white/80">
        <input type="checkbox" checked={v.visible} onChange={(e) => set('visible', e.target.checked)} />
        Visible on the public gallery
      </label>
    </form>
  );
}
