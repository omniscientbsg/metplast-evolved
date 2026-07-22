"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { slugify } from '@/lib/content/blog-view';

interface CatOption { id: string; name: string }

export interface BlogFormValues {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  categoryId: string;
  featured: boolean;
  published: boolean;
}

const EMPTY: BlogFormValues = {
  title: '', slug: '', content: '', excerpt: '', image: '', author: '',
  categoryId: '', featured: false, published: false,
};

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function BlogForm({ mode, id, categories, initial }: {
  mode: 'create' | 'edit';
  id?: string;
  categories: CatOption[];
  initial?: BlogFormValues;
}) {
  const router = useRouter();
  const [v, setV] = useState<BlogFormValues>(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof BlogFormValues>(k: K, val: BlogFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  // Auto-fill slug from title until the user edits the slug field themselves.
  function onTitle(title: string) {
    setV((p) => ({ ...p, title, slug: slugTouched ? p.slug : slugify(title) }));
  }

  async function uploadCover(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) { setError('Cover upload failed.'); return; }
      const { path } = await res.json();
      setV((p) => ({ ...p, image: path }));
    } catch { setError('Cover upload failed (network error).'); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError('');
    const url = mode === 'create' ? '/api/admin/blogs' : `/api/admin/blogs/${id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...v,
          categoryId: v.categoryId || null,
          image: v.image || null,
          excerpt: v.excerpt || null,
          author: v.author || null,
        }),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Save failed.'); return; }
      router.push('/admin/blogs'); router.refresh();
    } catch { setError('Save failed (network error).'); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">{mode === 'create' ? 'New Post' : 'Edit Post'}</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <div>
        <label className={label}>Title</label>
        <input className={input} value={v.title} onChange={(e) => onTitle(e.target.value)} />
      </div>

      <div>
        <label className={label}>Slug (URL)</label>
        <input className={input} value={v.slug}
          onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }}
          placeholder="auto-generated-from-title" />
        <p className="text-xs text-white/40 mt-1">/blog/{v.slug || '…'}</p>
      </div>

      <div>
        <label className={label}>Cover image</label>
        {v.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.image} alt="" className="w-56 h-32 object-cover rounded-lg border border-white/10 mb-3" />
        )}
        <input type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ''; }}
          className="text-white/70 text-sm" />
      </div>

      <div>
        <label className={label}>Excerpt (listing + SEO summary)</label>
        <textarea className={input} rows={2} value={v.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Author</label>
          <input className={input} value={v.author} onChange={(e) => set('author', e.target.value)} placeholder="Metplast Team" />
        </div>
        <div>
          <label className={label}>Category</label>
          <select className={input} value={v.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
            <option value="" className="bg-slate-900">Uncategorized</option>
            {categories.map((c) => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Content</label>
        <RichTextEditor value={v.content} onChange={(html) => set('content', html)} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-3 text-white/80">
          <input type="checkbox" checked={v.featured} onChange={(e) => set('featured', e.target.checked)} />
          Featured (pinned to top)
        </label>
        <label className="flex items-center gap-3 text-white/80">
          <input type="checkbox" checked={v.published} onChange={(e) => set('published', e.target.checked)} />
          Published (visible on the site)
        </label>
      </div>
    </form>
  );
}
