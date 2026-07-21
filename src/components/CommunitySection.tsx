"use client"

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Farmer testimonial data (§12.2)
// These 4 quotes already ship on the homepage today — reused here as-is,
// with the deprecated cage-system product term removed (brief §2 term
// removal) and the prior generic placeholder farm label replaced with a
// neutral, non-fabricated one. A real farm name for the 4th card is a
// [VERIFY: Ritesh] open item — do not invent one.
// ---------------------------------------------------------------------------

interface FarmerCard {
  q: string;
  auth: string;
  farm: string;
  img: string;
  /** Native-language quote — staged for future use, not yet verified. [VERIFY: Ritesh/Arnav] */
  quoteLocal?: string;
}

const FARMER_CARDS: FarmerCard[] = [
  {
    q: "Metplast isn't just a company; they treat you like family. Their support and quality products make all the difference in your business.",
    auth: 'Mr. Arez',
    farm: 'Eggsy Farms',
    img: '/images/Mr.-Arez.jpg',
  },
  {
    q: "We've been using Metplast cages for years — excellent quality, zero issues, and unmatched reliability. Highly recommended!",
    auth: 'Mr. Imran',
    farm: 'Ghanis Food & Farms',
    img: '/images/Mr.-Ghanis.jpg',
  },
  {
    q: "Switching to Metplast cage systems has significantly reduced bird mortality and egg breakage. I'm extremely satisfied with the results!",
    auth: 'Mr. Srinivas',
    farm: 'Shree Manjunath Farms',
    img: '/images/Mr.-Manjunath-.jpg',
  },
  {
    q: 'Their machines run perfectly and their service is truly reliable and commendable. After visiting the factory, I knew I made the right choice.',
    auth: 'Saiyed Tarik',
    farm: 'Metplast Customer',
    img: '/images/Mr.-Saiyad-Tarik.jpg',
  },
];

// ---------------------------------------------------------------------------
// Multilingual strip (§12.2) — GATED behind MULTILINGUAL_VERIFIED
// The full regional-language string set is staged here in code so it is
// ready to ship the moment Arnav confirms the translations, but it must
// NOT render until that flag flips to true.
// ---------------------------------------------------------------------------

const MULTILINGUAL_VERIFIED = false;

const MULTILINGUAL_STRINGS = [
  'Built for farmers across India.',
  'भारत के किसानों के लिए.',
  'भारतातील शेतकऱ्यांसाठी.',
  'ਭਾਰਤ ਦੇ ਕਿਸਾਨਾਂ ਲਈ.',
  'ભારતના ખેડૂતો માટે.',
  'ভারতের কৃষকদের জন্য.',
  'இந்திய விவசாயிகளுக்காக.',
  'భారత రైతుల కోసం.',
  'ಭಾರತದ ರೈತರಿಗಾಗಿ.',
  'ഇന്ത്യയിലെ കർഷകർക്കായി.',
  'مصمم للمزارعين في كل مكان.',
  'Создано для птицеводов.',
];

// ---------------------------------------------------------------------------
// State chips (§12.3) — GATED behind STATES_VERIFIED
// The full chip list is staged here so it is ready the moment Ritesh
// confirms it, but it must NOT render until that flag flips to true.
// ---------------------------------------------------------------------------

const STATES_VERIFIED = false;

const STATE_CHIPS = [
  'Maharashtra',
  'Punjab',
  'Gujarat',
  'Karnataka',
  'Telangana',
  'Andhra Pradesh',
  'Tamil Nadu',
  'West Bengal',
  'Assam',
  'Mizoram',
  'UAE',
  'Middle East',
  'Bangladesh',
  'Nigeria',
];

export function CommunitySection() {
  return (
    <section className="relative z-20 py-32 px-6 overflow-hidden bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="absolute inset-0 bg-[url('/images/Hero-Slider-2.jpg')] bg-cover bg-center opacity-10 mix-blend-luminosity" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Section Header (§12.1) */}
        <div className="flex flex-col items-center text-center mb-16">
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl mb-6"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Metplast Community
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black tracking-tighter mb-6 text-[var(--text)]">
            Farmers Who Build <br /><span className="text-gradient">for the Long Run</span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium max-w-2xl">
            Across states, languages, and bird types — one standard of engineering.
          </p>
        </div>

        {/* Multilingual strip (§12.2) — gated */}
        {MULTILINGUAL_VERIFIED ? (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-16 text-sm font-medium text-[var(--text-muted)]">
            {MULTILINGUAL_STRINGS.map((str, i) => (
              <span key={i}>{str}</span>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center mb-16">
            {/* [VERIFY: Arnav] regional-language strings §12.2 pending approval */}
            <p className="text-sm font-bold tracking-widest uppercase text-[var(--text-muted)]">
              Built for farmers across India.
            </p>
          </div>
        )}

        {/* Farmer cards (§12.2) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {FARMER_CARDS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between hover:-translate-y-4 transition-transform duration-500"
            >
              <p className="text-xl font-bold leading-relaxed mb-10 text-[var(--text)] font-['Space_Grotesk'] tracking-tight">
                {'“'}{t.q}{'”'}
              </p>
              <div className="flex items-center gap-5 border-t border-[var(--border)] pt-8 mt-auto">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] overflow-hidden relative">
                  <Image src={t.img} alt={t.auth} fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-[var(--text)] text-sm tracking-wide">{t.auth}</h4>
                  <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest">{t.farm}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* State presence (§12.3) — gated */}
        <div className="flex flex-col items-center text-center gap-6">
          <h3 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-black tracking-tight text-[var(--text)]">
            Across India &amp; Beyond
          </h3>
          {STATES_VERIFIED ? (
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl">
              {STATE_CHIPS.map((state, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl text-sm font-bold text-[var(--text)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {state}
                </span>
              ))}
            </div>
          ) : (
            <>
              {/* [VERIFY: Ritesh] final state-chip list §12.3 */}
              <p className="text-[var(--text-muted)] font-medium max-w-xl">
                Present across multiple states in India and international markets.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CommunitySection;
