"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { StickyPageNav } from './StickyPageNav';
import { ProductSection, ProductSectionProps } from './ProductSection';
import { CrossLinkCards, CrossLink } from './CrossLinkCards';
import { Button } from '@/components/ui/button';

export interface PageConfig {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary?: { label: string; href: string };
  };
  intro: string[];
  sections: ProductSectionProps[];
  crossLinks: CrossLink[];
}

interface ScrollPageTemplateProps {
  config: PageConfig;
}

export function ScrollPageTemplate({ config }: ScrollPageTemplateProps) {
  const navSections = config.sections.map(s => ({ id: s.id, label: s.title }));

  return (
    <main className="min-h-screen bg-[var(--bg)] relative overflow-x-hidden">
      
      {/* ── HERO ── */}
      <section className="relative h-[80vh] min-h-[600px] flex flex-col justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={config.hero.image} 
            alt={config.hero.title} 
            fill 
            className="object-cover object-center" 
            priority 
            sizes="100vw" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-[var(--bg)]" />
        </div>

        <div className="max-w-[1400px] mx-auto w-full relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6 shadow-lg"
          >
            <div className="w-2 h-2 rounded-full animate-pulse bg-[var(--accent)]" style={{ boxShadow: '0 0 10px var(--accent)' }} />
            <span className="text-sm font-bold tracking-widest text-white uppercase">
              Metplast Solutions
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-['Space_Grotesk'] font-black text-white tracking-tighter leading-[0.9] max-w-5xl mb-6 drop-shadow-2xl"
          >
            {config.hero.title.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word} {i === config.hero.title.split(' ').length - 1 ? '' : ' '}
              </React.Fragment>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mb-10 leading-relaxed"
          >
            {config.hero.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href={config.hero.ctaPrimary.href}>
              <Button className="h-14 px-8 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 rounded-xl font-bold text-lg btn-glow transition-all">
                {config.hero.ctaPrimary.label} <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            {config.hero.ctaSecondary && (
              <Link href={config.hero.ctaSecondary.href}>
                <Button variant="outline" className="h-14 px-8 border-white/20 bg-white/10 text-white hover:bg-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-md">
                  {config.hero.ctaSecondary.label}
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── STICKY NAV ── */}
      <StickyPageNav sections={navSections} />

      {/* ── INTRO ── */}
      {config.intro && config.intro.length > 0 && (
        <section className="py-24 relative">
          <div className="max-w-[900px] mx-auto px-6 text-center space-y-6">
            {config.intro.map((paragraph, idx) => (
              <p key={idx} className="text-xl md:text-2xl text-[var(--text-muted)] font-medium leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* ── PRODUCT SECTIONS ── */}
      <div className="space-y-12">
        {config.sections.map((section, idx) => (
          <div key={section.id}>
            <ProductSection {...section} reverse={idx % 2 !== 0} />
            {idx !== config.sections.length - 1 && (
              <div className="max-w-[1400px] mx-auto px-6">
                <hr className="border-[var(--border)]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── CROSS LINKS ── */}
      <CrossLinkCards links={config.crossLinks} />

    </main>
  );
}
