"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountryCodeSelect } from '@/components/Navbar';
import { useSiteSettings } from '@/lib/settings/site-settings-context';
import { telHref } from '@/lib/settings/site-settings';

const BIRD_TYPES   = ['Layer', 'Broiler', 'Breeder', 'Not Sure'];
const REQUIREMENTS = ['Complete Housing', 'Cage System', 'Feeding System', 'Drinking System', 'Ventilation / Cooling', 'Feed Silo', 'Spare Parts', 'Other'];
const TIMELINES    = ['Immediate', '1–3 Months', '3–6 Months', 'Later'];

export default function ContactPage() {
  const s = useSiteSettings();
  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '',
    countryCode: '+91', phone: '', email: '',
    birdType: '', requirement: '', capacity: '',
    timeline: '', message: '', hp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* Prefill from calculator / product handoff query params */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product  = params.get('product');
    const capacity = params.get('capacity');
    const type     = params.get('type');
    if (!product && !capacity) return;

    const lines: string[] = [];
    if (type === 'calculator_handoff') lines.push('Sent from calculator.');
    if (product) lines.push(`Interested in: ${product}`);

    setForm(p => ({
      ...p,
      capacity: capacity || p.capacity,
      message: lines.join('\n'),
      birdType: /breeder/i.test(product || '') ? 'Breeder'
              : /broiler/i.test(product || '') ? 'Broiler'
              : /layer/i.test(product || '')   ? 'Layer' : p.birdType,
    }));
  }, []);

  const inputCls = 'w-full bg-[var(--text)]/5 border border-[var(--border)] rounded-2xl px-6 py-4 text-[var(--text)] focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--text)]/10 transition-colors font-medium placeholder:text-[var(--text-muted)]';
  const labelCls = 'text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest';
  const selectCls = `${inputCls} appearance-none cursor-pointer`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const product = new URLSearchParams(window.location.search).get('product') || '';
      const res = await fetch('/api/admin/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          company: form.company,
          phone: `${form.countryCode} ${form.phone}`,
          email: form.email,
          birdType: form.birdType,
          requirement: form.requirement,
          birdCapacity: form.capacity,
          timeline: form.timeline,
          message: form.message,
          hp: form.hp,
          product,
          sourceUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitSuccess(true);
    } catch {
      setSubmitError(`Could not send your enquiry. Please try again, or call us directly at ${s.phonePrimary}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] pt-32 pb-24 relative overflow-hidden text-[var(--text)]">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-blue w-[800px] h-[800px] top-[-20%] left-[-10%]" />
        <div className="glow-orb glow-orange w-[600px] h-[600px] bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero */}
      <section className="px-6 mb-20 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--text)]/5 backdrop-blur-xl"
          >
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Contact Metplast
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[100px] break-words hyphens-auto font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tighter max-w-4xl mx-auto leading-[0.9]"
          >
            SPEAK TO A <br />
            <span className="text-gradient">SALES ENGINEER.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Have questions or need expert poultry solutions? Share your project details and our team will guide you every step of the way.
          </motion.p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-12 gap-16 relative z-10">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 glass-panel p-10 md:p-14 rounded-[3rem] shadow-2xl border border-[var(--border)]"
        >
          <h2 className="text-4xl font-['Space_Grotesk'] font-black text-[var(--text)] mb-8 tracking-tighter">
            SEND ENQUIRY.
          </h2>

          {submitSuccess ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
              <p className="text-[var(--text)] font-bold text-2xl mb-2">Enquiry Sent!</p>
              <p className="text-[var(--text-muted)] text-lg">Our team will contact you shortly.</p>
            </div>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Honeypot — hidden from users, catches form-filling bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.hp}
                onChange={e => setForm(p => ({ ...p, hp: e.target.value }))}
                className="absolute left-[-9999px] w-px h-px opacity-0"
              />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className={labelCls}>First Name *</label>
                  <input required type="text" value={form.firstName}
                    onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="First name" className={inputCls} />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>Last Name</label>
                  <input type="text" value={form.lastName}
                    onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Last name" className={inputCls} />
                </div>
              </div>

              <div className="space-y-3">
                <label className={labelCls}>Farm / Company Name</label>
                <input type="text" value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                  placeholder="Your farm or company" className={inputCls} />
              </div>

              <div className="space-y-3">
                <label className={labelCls}>Phone Number *</label>
                <div className="flex gap-3">
                  <CountryCodeSelect
                    value={form.countryCode}
                    onChange={v => setForm(p => ({ ...p, countryCode: v }))}
                    width="7rem"
                    buttonClassName="py-4 rounded-2xl"
                  />
                  <input required type="tel" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="9876543210" className={`${inputCls} flex-1 min-w-0`} />
                </div>
              </div>

              <div className="space-y-3">
                <label className={labelCls}>Email Address</label>
                <input type="email" value={form.email} autoComplete="email"
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com" className={inputCls} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className={labelCls}>Bird Type</label>
                  <select value={form.birdType}
                    onChange={e => setForm(p => ({ ...p, birdType: e.target.value }))}
                    className={selectCls}>
                    <option value="">Select bird type…</option>
                    {BIRD_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>Requirement</label>
                  <select value={form.requirement}
                    onChange={e => setForm(p => ({ ...p, requirement: e.target.value }))}
                    className={selectCls}>
                    <option value="">Select requirement…</option>
                    {REQUIREMENTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className={labelCls}>Approx Bird Capacity</label>
                  <input type="text" value={form.capacity}
                    onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                    placeholder="e.g. 50,000 birds" className={inputCls} />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>Timeline</label>
                  <select value={form.timeline}
                    onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
                    className={selectCls}>
                    <option value="">Select timeline…</option>
                    {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className={labelCls}>Message / Specifications</label>
                <textarea rows={4}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Detail your project requirements, shed count, existing infrastructure, etc."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {submitError && (
                <p role="alert" className="text-red-400 text-sm font-medium">{submitError}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 text-lg rounded-full font-black text-white hover:opacity-90 transition-all btn-glow shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
                style={{ background: 'var(--accent)' }}
              >
                {isSubmitting ? 'Sending…' : 'Send Enquiry'} <ArrowUpRight className="ml-2 w-6 h-6" />
              </Button>
            </form>
          )}
        </motion.div>

        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-10 lg:pt-10">
          <div>
            <h3 className="text-3xl font-['Space_Grotesk'] font-black text-[var(--text)] mb-10 tracking-tighter">CONTACT DETAILS.</h3>
            <div className="space-y-6">
              <div className="flex gap-6 group glass-panel p-6 rounded-3xl border border-[var(--border)] hover:border-[var(--text)]/20 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[var(--text)]/5 flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] transition-colors">
                  <MapPin className="w-8 h-8 text-[var(--accent)] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Address</h4>
                  <p className="text-[var(--text)] font-medium leading-relaxed">
                    {s.address.split('\n').map((ln, i, a) => (<span key={i}>{ln}{i < a.length - 1 && <br />}</span>))}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group glass-panel p-6 rounded-3xl border border-[var(--border)] hover:border-[var(--text)]/20 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[var(--text)]/5 flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] transition-colors">
                  <Phone className="w-8 h-8 text-[var(--accent)] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Phone</h4>
                  <div className="space-y-1">
                    <a href={telHref(s.phonePrimary)} className="text-[var(--text)] font-bold text-xl block hover:text-[var(--accent)] transition-colors">
                      {s.phonePrimary}
                    </a>
                    <a href={telHref(s.phoneSecondary)} className="text-[var(--text-muted)] font-medium block hover:text-[var(--text)] transition-colors">
                      {s.phoneSecondary}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 group glass-panel p-6 rounded-3xl border border-[var(--border)] hover:border-[var(--text)]/20 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[var(--text)]/5 flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] transition-colors">
                  <Mail className="w-8 h-8 text-[var(--accent)] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Email</h4>
                  <div className="space-y-1">
                    <a href={`mailto:${s.emailPrimary}`} className="text-[var(--text)] font-bold text-xl block hover:text-[var(--accent)] transition-colors">
                      {s.emailPrimary}
                    </a>
                    <a href={`mailto:${s.emailSecondary}`} className="text-[var(--text-muted)] font-medium block hover:text-[var(--text)] transition-colors">
                      {s.emailSecondary}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="p-10 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(249,115,22,0.3)] relative overflow-hidden"
            style={{ background: 'var(--accent)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl rounded-full" />
            <h3 className="text-3xl font-['Space_Grotesk'] font-black mb-4 tracking-tighter leading-none">
              FROM BLUEPRINT TO INSTALLATION.
            </h3>
            <p className="text-white/90 font-medium text-lg">
              Our expert team is ready to design and deploy the right system for your farm — from levelled land to full commissioning.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
