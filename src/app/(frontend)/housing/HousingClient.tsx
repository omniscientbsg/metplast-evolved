"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Wrench, Building2, Wind, Droplets, Zap, Package, Calculator, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PageContentView } from '@/lib/content/page-content';
import type { HousingContent } from '@/lib/content/housing-content';

// Icons for the "What We Build" grid, matched by index to the components list.
const SYSTEM_ICONS = [Building2, Zap, Droplets, Wrench, Package, Wind, Package, Building2, Zap, Droplets, Wrench];

export function HousingClient({ hero, content }: { hero: PageContentView; content: HousingContent }) {
  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-navy w-[800px] h-[800px] top-[-20%] right-[-5%]" />
        <div className="glow-orb glow-orange w-[600px] h-[600px] bottom-[-10%] left-[-10%]" style={{ animationDelay: '-7s' }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-20 px-6 mb-32">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            {hero.eyebrow && (
              <div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
                  {hero.eyebrow}
                </span>
              </div>
            )}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-['Space_Grotesk'] font-black tracking-tighter leading-[0.9]"
              style={{ color: 'var(--text)' }}
            >
              {hero.title} {hero.titleAccent && (<span className="text-gradient">{hero.titleAccent}</span>)}
            </h1>
            <p className="text-xl font-medium leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)' }}>
              {hero.subtitle}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href={hero.ctaPrimary?.href ?? '/contact'}>
                <Button className="h-14 px-8 rounded-full font-bold text-lg text-white btn-glow" style={{ background: 'var(--accent)' }}>
                  {hero.ctaPrimary?.label ?? 'Plan My Farm'} <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={hero.ctaSecondary?.href ?? '/calculators'}>
                <Button variant="outline" className="h-14 px-8 rounded-full font-bold text-lg border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text)] hover:bg-[var(--glass-border)]">
                  <Calculator className="mr-2 w-5 h-5" /> {hero.ctaSecondary?.label ?? 'Use Calculator'}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative h-[500px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border"
            style={{ borderColor: 'var(--border)' }}
          >
            <Image
              src={hero.image ?? '/images/Near-Rajesh-Home-Page.jpg'}
              alt="Metplast Poultry Housing System"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>35+ Years</p>
              <p className="text-white font-bold text-xl">Complete Poultry Housing Specialists</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Build */}
      <section className="relative z-10 px-6 mb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2
              className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black tracking-tighter leading-none mb-6"
              style={{ color: 'var(--text)' }}
            >
              {content.whatWeBuild.heading}
            </h2>
            {content.whatWeBuild.intro && (
              <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {content.whatWeBuild.intro}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {content.whatWeBuild.components.map((item, i) => {
              const Icon = SYSTEM_ICONS[i] ?? Building2;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(249,115,22,0.15)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                  {item.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="relative z-20 px-6 py-32 mb-0 rounded-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] bg-white text-[#1A2430]">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black tracking-tighter leading-none mb-6">
              {content.whoItsFor.heading}
            </h2>
            {content.whoItsFor.intro && (
              <p className="text-lg font-medium leading-relaxed text-slate-600">
                {content.whoItsFor.intro}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.whoItsFor.types.map((type, i) => (
              <Link key={i} href={type.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:bg-[var(--brand-navy)] hover:text-white hover:border-transparent transition-all duration-400 group cursor-pointer shadow-sm hover:shadow-xl"
                >
                  <h3 className="text-xl font-['Space_Grotesk'] font-black mb-3 group-hover:text-white">
                    {type.label}
                  </h3>
                  <p className="text-slate-500 group-hover:text-white/80 text-sm font-medium leading-relaxed mb-4">
                    {type.desc}
                  </p>
                  <span className="flex items-center gap-1 text-sm font-bold text-[var(--accent)] group-hover:text-orange-300">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Project Flow */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2
              className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black tracking-tighter leading-none mb-6"
              style={{ color: 'var(--text)' }}
            >
              {content.projectFlow.heading}
            </h2>
            {content.projectFlow.intro && (
              <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
                {content.projectFlow.intro}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent z-0" />
            {content.projectFlow.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 p-6 rounded-2xl border text-center"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 font-['Space_Grotesk'] font-black text-white text-lg"
                  style={{ background: 'var(--accent)' }}
                >
                  {step.step}
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                  {step.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
            style={{ background: 'var(--brand-navy)' }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-[600px] h-[600px] bg-[var(--accent)]/15 blur-3xl rounded-full top-[-200px] left-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black text-white tracking-tighter">
                {content.cta.heading}
              </h2>
              <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">
                {content.cta.body}
              </p>
              <div className="flex gap-4 justify-center flex-wrap pt-4">
                <Link href={content.cta.href}>
                  <Button className="h-14 px-10 rounded-full font-bold text-lg text-white btn-glow" style={{ background: 'var(--accent)' }}>
                    {content.cta.buttonLabel} <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/calculators">
                  <Button variant="outline" className="h-14 px-10 rounded-full font-bold text-lg border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <Calculator className="mr-2 w-5 h-5" /> Farm Calculator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
