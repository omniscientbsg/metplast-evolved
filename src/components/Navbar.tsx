"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Menu, X, ArrowUpRight, ChevronDown, Download, FileText, Sun, Moon
} from 'lucide-react';
import Image from 'next/image';

/* ─── Navigation links ─────────────────────────────────────── */
const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Metplast Housing', href: '/housing' },
  {
    name: 'Solutions',
    href: '#',
    dropdown: [
      { name: 'Layer Solutions', href: '/layer' },
      { name: 'Breeder Solutions', href: '/breeder' },
      { name: 'Broiler Solutions', href: '/broiler' },
    ],
  },
  { name: 'Environmental Control', href: '/environmental-control' },
  { name: 'Feed Silos', href: '/feed-silos' },
  { name: 'Calculators', href: '/calculators' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

/* ─── Bird / requirement options for enquiry form ──────────── */
const BIRD_TYPES  = ['Layer', 'Broiler', 'Breeder', 'Not Sure'];
const REQUIREMENTS = [
  'Complete Housing', 'Cage System', 'Feeding System',
  'Drinking System', 'Ventilation / Cooling', 'Feed Silo',
  'Spare Parts', 'Other',
];
const TIMELINES = ['Immediate', '1–3 Months', '3–6 Months', 'Later'];

/* ─── Brochure categories ───────────────────────────────────── */
const BROCHURE_CATEGORIES = [
  { label: 'Complete Product Brochure', file: '/Metplast_brochure.pdf' },
];

/* ─── Country calling codes ─────────────────────────────────── */
export const COUNTRY_CODES = [
  '+91', '+1', '+44', '+61', '+971', '+966', '+974', '+965', '+968', '+973',
  '+880', '+94', '+977', '+95', '+92', '+62', '+63', '+60', '+66', '+84',
  '+98', '+7', '+20', '+27', '+234', '+254', '+255', '+256', '+251',
  '+49', '+33', '+39', '+34', '+31', '+81', '+82', '+86',
];

/* ─── Custom country-code dropdown ───────────────────────────
   Native <select> popups position themselves off-screen with long
   lists, so this renders its own capped, scrollable list. */
export function CountryCodeSelect({
  value,
  onChange,
  width = '6.5rem',
  buttonClassName = 'py-3 rounded-xl',
}: {
  value: string;
  onChange: (v: string) => void;
  width?: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0" style={{ width }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Country code"
        className={`w-full bg-[var(--glass-bg)] border border-[var(--border)] px-3 text-[var(--text)] font-medium text-sm flex items-center justify-between gap-1 focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer ${buttonClassName}`}
      >
        {value} <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1 w-full max-h-56 overflow-y-auto glass-dropdown rounded-xl z-[300] p-1 no-scrollbar"
        >
          {COUNTRY_CODES.map(c => (
            <li key={c}>
              <button
                type="button"
                role="option"
                aria-selected={c === value}
                onClick={() => { onChange(c); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  c === value
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text)] hover:bg-[var(--glass-bg)]'
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ============================================================ */
export function Navbar() {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown]   = useState<string | null>(null);
  const [isBrochureOpen, setIsBrochureOpen]   = useState(false);
  const [isQuoteOpen, setIsQuoteOpen]         = useState(false);
  const [theme, setTheme]                     = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  /* ── Scroll listener ── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Theme init: the inline <head> script already set data-theme
        before first paint — just sync React state to it ── */
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') {
      setTheme(current);
    } else {
      applyTheme('dark'); // dark is always the default
    }
  }, []);

  /* ── Allow any page to open the gated brochure / quote modals ── */
  useEffect(() => {
    const openBrochure = () => setIsBrochureOpen(true);
    const openQuote = () => setIsQuoteOpen(true);
    window.addEventListener('metplast:open-brochure', openBrochure);
    window.addEventListener('metplast:open-quote', openQuote);
    return () => {
      window.removeEventListener('metplast:open-brochure', openBrochure);
      window.removeEventListener('metplast:open-quote', openQuote);
    };
  }, []);

  /* ── Escape closes modals and the mobile menu ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBrochureOpen(false);
        setIsQuoteOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function applyTheme(t: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', t);
    setTheme(t);
    localStorage.setItem('metplast-theme', t);
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  /* ── Brochure form state ── */
  const [brochureEmail, setBrochureEmail] = useState('');
  const [brochurePhone, setBrochurePhone] = useState('');
  const [brochureCode,  setBrochureCode]  = useState('+91');
  const [brochureHp,    setBrochureHp]    = useState('');
  const [brochureError, setBrochureError] = useState('');

  function handleBrochureSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brochureEmail && !brochurePhone) {
      setBrochureError('Enter email or phone number to download brochure.');
      return;
    }
    if (brochurePhone && !brochureCode) {
      setBrochureError('Please select a country code.');
      return;
    }
    setBrochureError('');
    // Capture the lead (fire-and-forget — download must not wait)
    fetch('/api/admin/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Brochure Download',
        email: brochureEmail,
        phone: brochurePhone ? `${brochureCode} ${brochurePhone}` : '',
        type: 'brochure_download',
        product: BROCHURE_CATEGORIES[0].label,
        hp: brochureHp,
        sourceUrl: window.location.href,
      }),
    }).catch(() => {});
    // Trigger download immediately
    const a = document.createElement('a');
    a.href = BROCHURE_CATEGORIES[0].file;
    a.download = 'Metplast-Brochure.pdf';
    a.click();
    setIsBrochureOpen(false);
    setBrochureEmail('');
    setBrochurePhone('');
    setBrochureHp('');
  }

  /* ── Enquiry form state ── */
  const [enquiry, setEnquiry] = useState({
    name: '', company: '', countryCode: '+91', phone: '',
    email: '', country: '', birdType: '', requirement: '', capacity: '',
    timeline: '', message: '', hp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiry.name,
          company: enquiry.company,
          phone: `${enquiry.countryCode} ${enquiry.phone}`,
          email: enquiry.email,
          country: enquiry.country,
          birdType: enquiry.birdType,
          requirement: enquiry.requirement,
          birdCapacity: enquiry.capacity,
          timeline: enquiry.timeline,
          message: enquiry.message,
          hp: enquiry.hp,
          sourceUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitSuccess(true);
      setTimeout(() => { setIsQuoteOpen(false); setSubmitSuccess(false); }, 2500);
    } catch {
      setSubmitError('Could not send your enquiry. Please try again, or call us directly at +91 89284 05002.');
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Nav chrome ── */
  const navClass = isScrolled
    ? 'glass-nav py-4'
    : 'bg-transparent py-8';

  const inputCls = 'w-full bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors font-medium text-sm placeholder:text-[var(--text-muted)]';
  const labelCls = 'text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest';

  const isDarkSection = pathname === '/' && !isScrolled;

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${navClass}`}>
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">

          {/* Brand */}
          <Link href="/" className="relative flex items-center h-20 w-72 group shrink-0">
            <div className="absolute inset-0 bg-[var(--accent)]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image
              src="/images/Logo Metplast.png"
              alt="Metplast Industries"
              fill
              className={`object-contain relative z-10 transition-opacity duration-300 ${(theme === 'light' && !isDarkSection) ? 'opacity-0' : 'opacity-100'}`}
              priority
            />
            <Image
              src="/images/Metplast-Website-Themes-1980-x-400-px.png"
              alt="Metplast Industries"
              fill
              className={`object-contain relative z-10 transition-opacity duration-300 origin-left scale-[0.7] ${(theme === 'light' && !isDarkSection) ? 'opacity-100' : 'opacity-0'}`}
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] px-6 xl:px-8 py-3 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(27,58,107,0.12)]">
            {links.map(link => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  onClick={e => { if (link.href === '#') e.preventDefault(); }}
                  aria-haspopup={link.dropdown ? 'menu' : undefined}
                  className={`text-sm font-semibold tracking-wide transition-colors relative flex items-center gap-1 ${
                    pathname === link.href ||
                    (link.href !== '#' && link.href !== '/' && pathname.startsWith(link.href))
                      ? 'text-[var(--accent)]'
                      : (isDarkSection ? 'text-white/80 hover:text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]')
                  }`}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                  {(pathname === link.href ||
                    (link.href !== '#' && link.href !== '/' && pathname.startsWith(link.href))) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full"
                    />
                  )}
                </Link>

                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-56"
                      >
                        <div className="glass-dropdown p-2 rounded-2xl">
                          {link.dropdown.map(drop => (
                            <Link
                              key={drop.name}
                              href={drop.href}
                              className="block px-4 py-3 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] rounded-xl transition-colors"
                            >
                              {drop.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle light/dark mode"
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                isDarkSection 
                  ? 'border-white/20 bg-white/10 text-white/80 hover:text-white hover:bg-white/20' 
                  : 'border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-border)]'
              }`}
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </button>

            <Button
              variant="outline"
              onClick={() => setIsBrochureOpen(true)}
              className={`h-11 px-5 rounded-full font-bold text-sm tracking-wide transition-all ${
                isDarkSection 
                  ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20' 
                  : 'border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text)] hover:bg-[var(--glass-border)]'
              }`}
            >
              <Download className="mr-2 w-4 h-4" /> Brochure
            </Button>
            <Button
              onClick={() => setIsQuoteOpen(true)}
              className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 h-11 px-5 rounded-full font-bold text-sm tracking-wide btn-glow transition-all"
            >
              Get a Quote <ArrowUpRight className="ml-1.5 w-4 h-4" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            className={`lg:hidden w-12 h-12 flex items-center justify-center rounded-full border transition-colors ${
              isDarkSection 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-[var(--glass-bg)] border-[var(--border)] text-[var(--text)]'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen
              ? <X className="w-5 h-5" />
              : <Menu className="w-5 h-5" />
            }
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full bg-[var(--surface)]/95 backdrop-blur-3xl border-b border-[var(--border)] h-screen overflow-y-auto pb-32"
            >
              <div className="p-6 flex flex-col gap-5">
                {links.map(link => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      onClick={e => {
                        if (link.href === '#') e.preventDefault();
                        if (!link.dropdown) setIsMobileMenuOpen(false);
                      }}
                      className={`text-2xl font-['Space_Grotesk'] font-bold tracking-tight block ${
                        pathname === link.href ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <div className="pl-4 mt-3 space-y-3 border-l-2 border-[var(--border)]">
                        {link.dropdown.map(drop => (
                          <Link
                            key={drop.name}
                            href={drop.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-lg font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
                          >
                            {drop.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <hr className="border-[var(--border)] my-2" />

                {/* Mobile theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 text-[var(--text-muted)] font-semibold text-base"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                <Button
                  onClick={() => { setIsMobileMenuOpen(false); setIsBrochureOpen(true); }}
                  variant="outline"
                  className="w-full h-14 border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text)] hover:bg-[var(--glass-border)] rounded-xl font-bold text-lg"
                >
                  <Download className="mr-2 w-5 h-5" /> Download Brochure
                </Button>
                <Button
                  onClick={() => { setIsMobileMenuOpen(false); setIsQuoteOpen(true); }}
                  className="w-full h-14 bg-[var(--accent)] text-white rounded-xl font-bold text-lg btn-glow"
                >
                  Get a Quote
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── BROCHURE MODAL ── */}
      <AnimatePresence>
        {isBrochureOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsBrochureOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-label="Download brochure"
              className="glass-modal rounded-[2rem] p-6 md:p-8 max-w-md w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setIsBrochureOpen(false)}
                aria-label="Close"
                className="absolute top-5 right-5 w-10 h-10 bg-[var(--glass-bg)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-[var(--accent)]/20 text-[var(--accent)] rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-['Space_Grotesk'] font-black text-[var(--text)] mb-1 tracking-tight">
                Download Brochure
              </h2>
              <p className="text-[var(--text-muted)] mb-6 text-sm font-medium leading-relaxed">
                Enter your email or phone number to download the complete Metplast product brochure.
              </p>

              <form className="space-y-4" onSubmit={handleBrochureSubmit}>
                {/* Honeypot — hidden bot trap */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off"
                  aria-hidden="true" value={brochureHp}
                  onChange={e => setBrochureHp(e.target.value)}
                  className="absolute left-[-9999px] w-px h-px opacity-0" />
                <div className="space-y-1.5">
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={brochureEmail}
                    onChange={e => setBrochureEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className={inputCls}
                  />
                </div>

                <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">
                  <hr className="flex-1 border-[var(--border)]" /> OR <hr className="flex-1 border-[var(--border)]" />
                </div>

                <div className="space-y-1.5">
                  <label className={labelCls}>Phone</label>
                  <div className="flex gap-2">
                    <CountryCodeSelect value={brochureCode} onChange={setBrochureCode} />
                    <input
                      type="tel"
                      value={brochurePhone}
                      onChange={e => setBrochurePhone(e.target.value)}
                      placeholder="9876543210"
                      className={`${inputCls} flex-1 min-w-0`}
                    />
                  </div>
                </div>

                {brochureError && (
                  <p className="text-red-400 text-sm font-medium">{brochureError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 rounded-xl font-bold text-base btn-glow"
                >
                  Download Brochure <Download className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ENQUIRY / QUOTE MODAL ── */}
      <AnimatePresence>
        {isQuoteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsQuoteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-label="Get a quote"
              className="glass-modal rounded-[2rem] p-6 md:p-8 max-w-lg w-full relative max-h-[92vh] overflow-y-auto overflow-x-hidden no-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setIsQuoteOpen(false)}
                aria-label="Close"
                className="absolute top-5 right-5 w-10 h-10 bg-[var(--glass-bg)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-[var(--brand-navy)]/20 text-[var(--brand-navy)] rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <h2 className="text-2xl font-['Space_Grotesk'] font-black text-[var(--text)] mb-1 tracking-tight">
                Get a Quote
              </h2>
              <p className="text-[var(--text-muted)] mb-6 text-sm font-medium leading-relaxed">
                Share your project details and our team will guide you on housing, cages, feeding, drinking, ventilation, and farm planning.
              </p>

              {submitSuccess ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                  <p className="text-[var(--text)] font-bold text-lg">Enquiry sent!</p>
                  <p className="text-[var(--text-muted)] text-sm mt-1">Our team will contact you shortly.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleEnquirySubmit}>
                  {/* Honeypot — hidden bot trap */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off"
                    aria-hidden="true" value={enquiry.hp}
                    onChange={e => setEnquiry(p => ({ ...p, hp: e.target.value }))}
                    className="absolute left-[-9999px] w-px h-px opacity-0" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Name *</label>
                      <input required type="text" value={enquiry.name}
                        onChange={e => setEnquiry(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your name" className={inputCls} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Farm / Company</label>
                      <input type="text" value={enquiry.company}
                        onChange={e => setEnquiry(p => ({ ...p, company: e.target.value }))}
                        placeholder="Farm name" className={inputCls} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelCls}>Phone *</label>
                    <div className="flex gap-2">
                      <CountryCodeSelect
                        value={enquiry.countryCode}
                        onChange={v => setEnquiry(p => ({ ...p, countryCode: v }))}
                      />
                      <input required type="tel" value={enquiry.phone}
                        onChange={e => setEnquiry(p => ({ ...p, phone: e.target.value }))}
                        placeholder="9876543210" className={`${inputCls} flex-1 min-w-0`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Email</label>
                      <input type="email" value={enquiry.email}
                        onChange={e => setEnquiry(p => ({ ...p, email: e.target.value }))}
                        placeholder="optional" className={inputCls} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Country</label>
                      <input type="text" value={enquiry.country}
                        onChange={e => setEnquiry(p => ({ ...p, country: e.target.value }))}
                        placeholder="India" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Bird Type</label>
                      <select value={enquiry.birdType}
                        onChange={e => setEnquiry(p => ({ ...p, birdType: e.target.value }))}
                        className={`${inputCls} appearance-none cursor-pointer`}>
                        <option value="">Select...</option>
                        {BIRD_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Requirement</label>
                      <select value={enquiry.requirement}
                        onChange={e => setEnquiry(p => ({ ...p, requirement: e.target.value }))}
                        className={`${inputCls} appearance-none cursor-pointer`}>
                        <option value="">Select...</option>
                        {REQUIREMENTS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Approx Bird Capacity</label>
                      <input type="text" value={enquiry.capacity}
                        onChange={e => setEnquiry(p => ({ ...p, capacity: e.target.value }))}
                        placeholder="e.g. 50,000" className={inputCls} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Timeline</label>
                      <select value={enquiry.timeline}
                        onChange={e => setEnquiry(p => ({ ...p, timeline: e.target.value }))}
                        className={`${inputCls} appearance-none cursor-pointer`}>
                        <option value="">Select...</option>
                        {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelCls}>Message (optional)</label>
                    <textarea rows={2} value={enquiry.message}
                      onChange={e => setEnquiry(p => ({ ...p, message: e.target.value }))}
                      placeholder="Any additional details..."
                      className={`${inputCls} resize-none`} />
                  </div>

                  {submitError && (
                    <p role="alert" className="text-red-400 text-sm font-medium">{submitError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 rounded-xl font-bold text-base btn-glow"
                  >
                    {isSubmitting ? 'Sending…' : 'Send Enquiry'} <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}