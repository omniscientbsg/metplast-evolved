"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, Factory, Globe, Trophy, Users, ShieldCheck, Zap } from 'lucide-react';
import { MobaBlock } from '@/components/MobaBlock';
import type { PageContentView } from '@/lib/content/page-content';
import type { AboutContent } from '@/lib/content/about-content';

// Value-card icons, matched by index to content.values.cards.
const VALUE_ICONS = [Zap, Globe, ShieldCheck, Users];

export function AboutClient({ hero, content }: { hero: PageContentView; content: AboutContent }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] pt-32 pb-24 overflow-hidden relative text-[var(--text)]">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-red w-[600px] h-[600px] top-[-10%] right-[-10%]" />
      </div>

      {/* Hero */}
      <section className="px-6 mb-32 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          {hero.eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl"
            >
              <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>{hero.eyebrow}</span>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl break-words hyphens-auto font-['Space_Grotesk'] font-black text-[var(--text)] tracking-tighter max-w-5xl mx-auto leading-[0.9]"
          >
            {hero.title}{hero.titleAccent && (<><br/><span className="text-gradient">{hero.titleAccent}</span></>)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 mb-40 relative z-10">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-black text-[var(--text)] leading-none tracking-tighter">
              {content.story.heading}<br/>
              <span className="text-[var(--text-muted)]">{content.story.subheading}</span>
            </h2>
            <div className="text-lg text-[var(--text-muted)] font-medium space-y-6 leading-relaxed">
              {hero.intro.map((p, i) => (<p key={i}>{p}</p>))}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[var(--border)]">
              {content.stats.map((stat, i) => (
                <div key={i} className="glass-panel p-8 rounded-3xl group hover:border-orange-500/50 transition-colors">
                  <p className="text-5xl font-['Space_Grotesk'] font-black mb-3" style={{ color: 'var(--accent)' }}>{stat.top}</p>
                  <p className="font-bold tracking-wide uppercase text-sm" style={{ color: 'var(--text)' }}>{stat.bottom}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[800px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <Image src={content.mainImage} alt="Metplast poultry housing project" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 glass-panel p-8 rounded-3xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Factory className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>{content.imageBadge.eyebrow}</p>
                  <p className="text-2xl font-bold text-white">{content.imageBadge.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-[var(--bg-elevated)] text-[var(--text)] py-40 px-6 rounded-[4rem] shadow-[var(--shadow)] border border-[var(--border)] relative z-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-black tracking-tighter leading-none mb-6">
              {content.values.heading} <br/><span className="text-gradient">{content.values.accent}</span>
            </h2>
            <p className="text-xl text-[var(--text-muted)] font-medium max-w-2xl">
              {content.values.intro}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.values.cards.map((value, i) => {
              const Icon = VALUE_ICONS[i] ?? Zap;
              return (
              <div key={i} className="glass-panel p-10 rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 group cursor-pointer hover:shadow-2xl">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 font-['Space_Grotesk'] tracking-tight text-[var(--text)]">{value.title}</h3>
                <p className="text-[var(--text-muted)] font-medium leading-relaxed transition-colors">{value.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <MobaBlock />

    </main>
  );
}
