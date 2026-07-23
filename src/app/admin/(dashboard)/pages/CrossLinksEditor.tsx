"use client";

import type { CrossLink } from '@/lib/content/page-content';

const input = 'bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';

export function CrossLinksEditor({ items, onChange }: { items: CrossLink[]; onChange: (next: CrossLink[]) => void }) {
  function set(i: number, patch: Partial<CrossLink>) { onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))); }
  function add() { onChange([...items, { title: '', desc: '', href: '', color: '#3b82f6' }]); }
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
      <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">Cross-link cards</label>
      {items.map((c, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <input className={`${input} flex-1`} placeholder="Title" value={c.title} onChange={(e) => set(i, { title: e.target.value })} />
            <input className={`${input} w-28`} placeholder="/href" value={c.href} onChange={(e) => set(i, { href: e.target.value })} />
            <input type="color" className="w-10 h-10 rounded bg-transparent border border-white/10" value={c.color} onChange={(e) => set(i, { color: e.target.value })} />
          </div>
          <textarea className={`${input} w-full`} rows={2} placeholder="Description" value={c.desc} onChange={(e) => set(i, { desc: e.target.value })} />
          <div className="flex gap-3 justify-end text-sm">
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="text-white/50 hover:text-white disabled:opacity-20">↑</button>
            <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="text-white/50 hover:text-white disabled:opacity-20">↓</button>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300">Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm font-bold text-primary hover:opacity-80">+ Add card</button>
    </div>
  );
}
