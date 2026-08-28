"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Cat { id: string; name: string }

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function add() {
    if (!name.trim()) return;
    setBusy(true); setError('');
    const res = await fetch('/api/admin/gallery/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Failed'); return; }
    setName(''); router.refresh();
  }

  async function rename(id: string, current: string) {
    const next = prompt('Rename category', current);
    if (!next || next === current) return;
    setBusy(true);
    await fetch(`/api/admin/gallery/categories/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: next }),
    });
    setBusy(false); router.refresh();
  }

  async function move(id: string, direction: 'up' | 'down') {
    setBusy(true);
    await fetch('/api/admin/gallery/categories/reorder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, direction }),
    });
    setBusy(false); router.refresh();
  }

  async function del(id: string) {
    if (!confirm('Delete this category? Its images stay but become Uncategorized.')) return;
    setBusy(true);
    await fetch(`/api/admin/gallery/categories/${id}`, { method: 'DELETE' });
    setBusy(false); router.refresh();
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-bold text-white">Categories (filters)</h2>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      <div className="space-y-2">
        {categories.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3">
            <span className="flex-1 text-white/80">{c.name}</span>
            <button disabled={busy || i === 0} onClick={() => move(c.id, 'up')} className="text-white/50 hover:text-white disabled:opacity-20 text-lg">↑</button>
            <button disabled={busy || i === categories.length - 1} onClick={() => move(c.id, 'down')} className="text-white/50 hover:text-white disabled:opacity-20 text-lg">↓</button>
            <button disabled={busy} onClick={() => rename(c.id, c.name)} className="text-white/50 hover:text-white text-sm">Rename</button>
            <button disabled={busy} onClick={() => del(c.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
          </div>
        ))}
        {categories.length === 0 && <p className="text-white/40 text-sm">No categories yet.</p>}
      </div>
      <div className="flex gap-2 pt-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary" />
        <button disabled={busy} onClick={add} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">Add</button>
      </div>
    </div>
  );
}
