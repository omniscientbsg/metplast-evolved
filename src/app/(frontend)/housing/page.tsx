"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Wrench, Building2, Wind, Droplets, Zap, Package, Calculator, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const systemComponents = [
  { icon: Building2, title: 'Cage Systems', desc: 'H-Type and A-Frame cages for Layer, Breeder, and Broiler' },
  { icon: Zap, title: 'Automatic Feeding', desc: 'Chain & trolley feeding systems with 99.7% accuracy' },
  { icon: Droplets, title: 'Nipple Drinking', desc: 'Adjustable nipple lines for all bird types and ages' },
  { icon: Wrench, title: 'Manure Removal', desc: 'Automated belt conveyors, cross conveyors, and elevators' },
  { icon: Package, title: 'Egg Collection', desc: 'Gentle slope collection with reduced breakage design' },
  { icon: Wind, title: 'Environmental Control', desc: 'Cooling pads, exhaust fans, cone fans, and control panels' },
  { icon: Package, title: 'Feed Silos', desc: '275 GSM galvanized steel silos with screw conveyors' },
  { icon: Building2, title: 'Shed Structure', desc: 'Pre-engineered steel frames and sidewall systems' },
  { icon: Zap, title: 'Lighting System', desc: 'LED lighting optimised for laying and breeding cycles' },
  { icon: Droplets, title: 'Water Lines', desc: 'Main water lines, pressure regulators, and medication dosers' },
  { icon: Wrench, title: 'Control Panels', desc: 'Smart environmental control panels for every shed' },
];

const farmTypes = [
  { label: 'Layer Farms', desc: 'Commercial egg production from 10,000 to 5 lakh+ birds', href: '/layer' },
  { label: 'Breeder Farms', desc: 'Hatching egg production with custom male bird placement', href: '/breeder' },
  { label: 'Broiler Farms', desc: 'Deep litter and battery cage broiler rearing systems', href: '/broiler' },
  { label: 'Integrated Farms', desc: 'Pullet + Layer or Pullet + Breeder on the same land', href: '/contact' },
];

const projectSteps = [
  { step: '01', title: 'Site Assessment', desc: 'We visit your land, assess topography, access, and local climate.' },
  { step: '02', title: 'Farm Layout Planning', desc: 'Shed count, orientation, spacing, utility routing, and system sizing.' },
  { step: '03', title: 'Manufacturing', desc: 'Cages, feeding systems, drinking lines, and silos made at Khalapur.' },
  { step: '04', title: 'Installation', desc: 'Our team installs every component — structure, cages, plumbing, electrical.' },
  { step: '05', title: 'Commissioning', desc: 'Full trial run, team training, and handover with ongoing support.' },
];

export default function HousingPage() {
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
            <div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
                Metplast Housing
              </span>
            </div>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-['Space_Grotesk'] font-black tracking-tighter leading-[0.9]"
              style={{ color: 'var(--text)' }}
            >
              COMPLETE POULTRY HOUSING <span className="text-gradient">SYSTEMS.</span>
            </h1>
            <p className="text-xl font-medium leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)' }}>
              From levelled land to a fully commissioned poultry farm. Metplast designs, manufactures, and installs cage systems, feeding, drinking, ventilation, cooling, silos, and everything else your farm needs — in one project.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/contact">
                <Button className="h-14 px-8 rounded-full font-bold text-lg text-white btn-glow" style={{ background: 'var(--accent)' }}>
                  Plan My Farm <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/calculators">
                <Button variant="outline" className="h-14 px-8 rounded-full font-bold text-lg border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text)] hover:bg-[var(--glass-border)]">
                  <Calculator className="mr-2 w-5 h-5" /> Use Calculator
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
              src="/images/Near-Rajesh-Home-Page.jpg"
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
              WHAT METPLAST <span className="text-gradient">INTEGRATES.</span>
            </h2>
            <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Every system below is designed, manufactured, and installed by Metplast. One vendor. One team. One responsibility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {systemComponents.map((item, i) => (
              <motion.div
                key={item.title}
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
                  <item.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                  {item.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="relative z-20 px-6 py-32 mb-0 rounded-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] bg-white text-[#1A2430]">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black tracking-tighter leading-none mb-6">
              WHO IT&apos;S <span className="text-gradient">FOR.</span>
            </h2>
            <p className="text-lg font-medium leading-relaxed text-slate-600">
              Metplast Housing is built for farmers starting fresh, expanding existing farms, or upgrading from manual to automated systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmTypes.map((type, i) => (
              <Link key={type.label} href={type.href}>
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
              HOW A PROJECT <span className="text-gradient">WORKS.</span>
            </h2>
            <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
              From your first call to the day you stock birds — here is how Metplast manages your project.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent z-0" />
            {projectSteps.map((step, i) => (
              <motion.div
                key={step.step}
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
                PLAN YOUR FARM.
              </h2>
              <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">
                Talk to a Metplast engineer about your project. We'll guide you from site layout to cage selection to full commissioning.
              </p>
              <div className="flex gap-4 justify-center flex-wrap pt-4">
                <Link href="/contact">
                  <Button className="h-14 px-10 rounded-full font-bold text-lg text-white btn-glow" style={{ background: 'var(--accent)' }}>
                    Enquire Now <ArrowUpRight className="ml-2 w-5 h-5" />
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
