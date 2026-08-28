"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { MiscContent } from '@/lib/content/misc-content';

const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary';
const label = 'block text-xs font-bold text-white/60 uppercase tracking-widest mb-2';

export function MiscContentForm({ initial }: { initial: MiscContent }) {
  const router = useRouter();
  const [v, setV] = useState<MiscContent>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  function setContact(patch: Partial<MiscContent['contact']>) {
    setV((p) => ({ ...p, contact: { ...p.contact, ...patch } }));
  }
  function setCalc(patch: Partial<MiscContent['calculators']>) {
    setV((p) => ({ ...p, calculators: { ...p.calculators, ...patch } }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setOk(false);
    try {
      const res = await fetch('/api/admin/misc', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || 'Save failed.'); return; }
      setOk(true); router.refresh();
    } catch { setError('Save failed (network error).'); }
    finally { setSaving(false); }
  }

  const c = v.contact, k = v.calculators;

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">Contact &amp; Calculators — Copy</h1>
        <button type="submit" disabled={saving} className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {ok && <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm">Saved.</div>}

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Contact page</legend>
        <div>
          <label className={label}>Hero eyebrow</label>
          <input className={input} value={c.heroEyebrow} onChange={(e) => setContact({ heroEyebrow: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Hero heading</label>
            <input className={input} value={c.heroHeading} onChange={(e) => setContact({ heroHeading: e.target.value })} />
          </div>
          <div>
            <label className={label}>Hero accent (gradient)</label>
            <input className={input} value={c.heroAccent} onChange={(e) => setContact({ heroAccent: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={label}>Hero subtitle</label>
          <textarea className={input} rows={2} value={c.heroSubtitle} onChange={(e) => setContact({ heroSubtitle: e.target.value })} />
        </div>
        <div>
          <label className={label}>Form heading</label>
          <input className={input} value={c.formHeading} onChange={(e) => setContact({ formHeading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Bottom CTA heading</label>
          <input className={input} value={c.ctaHeading} onChange={(e) => setContact({ ctaHeading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Bottom CTA body</label>
          <textarea className={input} rows={2} value={c.ctaBody} onChange={(e) => setContact({ ctaBody: e.target.value })} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-white/10 rounded-2xl p-5">
        <legend className="px-2 text-sm font-bold text-white/70">Calculators page</legend>
        <div>
          <label className={label}>Hero eyebrow</label>
          <input className={input} value={k.heroEyebrow} onChange={(e) => setCalc({ heroEyebrow: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Hero heading</label>
            <input className={input} value={k.heroHeading} onChange={(e) => setCalc({ heroHeading: e.target.value })} />
          </div>
          <div>
            <label className={label}>Hero accent</label>
            <input className={input} value={k.heroAccent} onChange={(e) => setCalc({ heroAccent: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={label}>Hero subtitle</label>
          <textarea className={input} rows={2} value={k.heroSubtitle} onChange={(e) => setCalc({ heroSubtitle: e.target.value })} />
        </div>
        <div>
          <label className={label}>Enquiry card heading</label>
          <input className={input} value={k.enquiryHeading} onChange={(e) => setCalc({ enquiryHeading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Enquiry card body</label>
          <textarea className={input} rows={2} value={k.enquiryBody} onChange={(e) => setCalc({ enquiryBody: e.target.value })} />
        </div>
      </fieldset>
    </form>
  );
}
