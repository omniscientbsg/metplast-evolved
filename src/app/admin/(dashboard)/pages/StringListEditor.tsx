"use client";

const line = 'flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';

export function StringListEditor({ label, items, onChange, placeholder }: {
  label: string; items: string[]; onChange: (next: string[]) => void; placeholder?: string;
}) {
  function set(i: number, val: string) { onChange(items.map((x, j) => (j === i ? val : x))); }
  function add() { onChange([...items, '']); }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)); }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">{label}</label>
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <textarea className={line} rows={2} value={it} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
          <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="text-white/50 hover:text-white disabled:opacity-20">↑</button>
          <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="text-white/50 hover:text-white disabled:opacity-20">↓</button>
          <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm font-bold text-primary hover:opacity-80">+ Add</button>
    </div>
  );
}
