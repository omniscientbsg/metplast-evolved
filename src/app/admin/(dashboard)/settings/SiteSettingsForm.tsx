"use client";

import { useState } from 'react';
import { SITE_SETTING_KEYS } from '@/lib/settings/site-settings';

const input = 'w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function SiteSettingsForm({ initial }: { initial: Record<string, string> }) {
  const [v, setV] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  function set(key: string, val: string) { setV((p) => ({ ...p, [key]: val })); }

  async function uploadImage(key: string, file: File) {
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) { setError('Image upload failed.'); return; }
      const { path } = await res.json();
      setV((p) => ({ ...p, [key]: path }));
    } catch { setError('Image upload failed (network error).'); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setOk(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Save failed.'); return; }
      setOk(true);
    } catch { setError('Save failed (network error).'); }
    finally { setSaving(false); }
  }

  const groups = Array.from(new Set(SITE_SETTING_KEYS.map((f) => f.group)));

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">General Settings</h1>
          <p className="text-white/60 mt-1">Logos, contact details, and site-wide copy.</p>
        </div>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {ok && <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm">Saved.</div>}

      {groups.map((group) => (
        <fieldset key={group} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <legend className="px-2 text-sm font-bold text-white/70">{group}</legend>
          {SITE_SETTING_KEYS.filter((f) => f.group === group).map((f) => (
            <div key={f.key}>
              <label className={label}>{f.label}</label>
              {f.type === 'image' ? (
                <div>
                  {v[f.key] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v[f.key]} alt="" className="h-14 object-contain rounded-lg border border-white/10 bg-black/30 px-3 mb-3" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadImage(f.key, file); e.target.value = ''; }} className="text-white/70 text-sm" />
                </div>
              ) : f.type === 'textarea' ? (
                <textarea className={`${input} resize-none`} rows={3} value={v[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
              ) : (
                <input type={f.type === 'url' ? 'url' : 'text'} className={input} value={v[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </fieldset>
      ))}
    </form>
  );
}
