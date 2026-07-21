"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const solutions = [
  {
    title: 'Metplast Housing',
    sub: 'Complete Farm Setup',
    desc: 'From levelled land to complete poultry housing — structure, cages, feeding, drinking, ventilation, and silos.',
    href: '/housing',
    image: '/images/Near-Rajesh-Home-Page.jpg',
    tag: 'Full Turnkey',
  },
  {
    title: 'Layer Solutions',
    sub: 'Layer & Layer Pullet',
    desc: 'H-Type Layer Cage, S-Frame (Iron Nest), Layer Pullet — egg collection, feeding, manure removal, and more.',
    href: '/layer',
    image: '/images/Layer2.jpg',
    tag: 'Layer Farms',
  },
  {
    title: 'Breeder Solutions',
    sub: 'Breeder & Breeder Pullet',
    desc: 'H-Type Breeder Cage and Breeder Pullet — optimised for hatching egg quality, custom male placement, and AI support.',
    href: '/breeder',
    image: '/images/Breeder2.jpg',
    tag: 'Breeder Farms',
  },
  {
    title: 'Broiler Solutions',
    sub: 'Deep Litter & Battery',
    desc: 'Deep Litter housing with pan feeding, nipple drinking, curtains, false ceilings, and H-Type Broiler cage systems.',
    href: '/broiler',
    image: '/images/gallery/1-3-600x540.jpg',
    tag: 'Broiler Farms',
  },
  {
    title: 'Environmental Control',
    sub: 'Cooling & Ventilation',
    desc: 'Cooling pads, exhaust fans, cone fans, circulating fans, box fans, and control panels — for every shed size and climate.',
    href: '/environmental-control',
    image: '/images/Hero-Slider-2.jpg',
    tag: 'All Farm Types',
  },
  {
    title: 'Feed Silos',
    sub: 'Bulk Feed Storage',
    desc: 'Galvanized steel silos with screw conveyors, load cells, and automated feed delivery to every line.',
    href: '/feed-silos',
    image: '/images/Untitled-design-7-560x690.jpg',
    tag: 'All Farm Types',
  },
  {
    title: 'Calculators',
    sub: 'Farm Planning Tools',
    desc: 'Plan your Layer, Layer Pullet, Breeder, Breeder Pullet, or Broiler farm — calculate cage rows, modules, and system requirements.',
    href: '/calculators',
    image: '/images/Shed-8Tier-Cage.png',
    tag: 'Planning Tool',
  },
  {
    title: 'Projects & Gallery',
    sub: 'Real Installations',
    desc: 'Browse real Metplast installations — layer farms, breeder farms, broiler housing, silos, and environmental control.',
    href: '/gallery',
    image: '/images/Hero-Slider-1.jpg',
    tag: 'Gallery',
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-navy w-[800px] h-[800px] top-[-20%] right-[-10%]" />
        <div className="glow-orb glow-orange w-[500px] h-[500px] bottom-[-10%] left-[-10%]" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero */}
      <section className="px-6 mb-24 relative z-10 pt-20 text-center">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Product Range
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-['Space_Grotesk'] font-black tracking-tighter leading-[0.9]"
            style={{ color: 'var(--text)' }}
          >
            ALL SOLUTIONS <br />
            <span className="text-gradient">IN ONE PLACE.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto leading-relaxed font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            Layer, Breeder, Broiler, Environmental Control, Feed Silos, and full farm planning.
            Every Metplast product — in one place.
          </motion.p>
        </div>
      </section>

      {/* 8-Card Grid */}
      <section className="max-w-[1600px] mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link href={sol.href} className="group block h-full">
                <div
                  className="h-full rounded-[2rem] overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden shrink-0">
                    <Image
                      src={sol.image}
                      alt={sol.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span
                      className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      {sol.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: 'var(--accent)' }}
                    >
                      {sol.sub}
                    </span>
                    <h2
                      className="text-xl font-['Space_Grotesk'] font-black tracking-tight mb-3"
                      style={{ color: 'var(--text)' }}
                    >
                      {sol.title}
                    </h2>
                    <p
                      className="text-sm font-medium leading-relaxed flex-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {sol.desc}
                    </p>
                    <div
                      className="mt-5 flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
                      style={{ color: 'var(--accent)' }}
                    >
                      Learn More <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
