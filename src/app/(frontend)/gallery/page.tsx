"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ZoomIn, Play, ArrowUpRight } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    src: '/images/gallery/1-3-600x540.jpg',
    caption: 'H-Type Layer Battery Cage — multi-tier automatic system with egg belt collection',
    category: 'Layer Cage Systems',
  },
  {
    id: 2,
    src: '/images/gallery/3-2-600x540.jpg',
    caption: 'Metplast Layer cage corridor — automated feeding and manure belt system in operation',
    category: 'Layer Cage Systems',
  },
  {
    id: 3,
    src: '/images/gallery/4-1-600x540.jpg',
    caption: 'Breeder cage system — designed for hatching egg quality and custom male bird placement',
    category: 'Breeder Cage Systems',
  },
  {
    id: 4,
    src: '/images/gallery/7-1-600x540.jpg',
    caption: 'Automatic nest boxes installed for clean hatching egg collection',
    category: 'Breeder Cage Systems',
  },
  {
    id: 5,
    src: '/images/gallery/8-1-600x540.jpg',
    caption: 'H-Type layer cage corridor — central service walkway with automated feeding lines',
    category: 'Layer Cage Systems',
  },
  {
    id: 6,
    src: '/images/gallery/9-600x540.jpg',
    caption: 'Multi-tier layer cages with feed trough and nipple drinking lines',
    category: 'Layer Cage Systems',
  },
  {
    id: 8,
    src: '/images/Untitled-design-7-560x690.jpg',
    caption: 'Metplast feed silo installed at farm — galvanized steel with conical bottom',
    category: 'Feed Silos',
  },
  {
    id: 9,
    src: '/images/Hero-Slider-2.jpg',
    caption: 'Complete poultry housing project — multiple sheds built from levelled land',
    category: 'Metplast Housing',
  },
  {
    id: 7,
    src: '/images/Glimpse-Metplast-Indsutries-1.jpg',
    caption: 'Metplast Industries manufacturing facility — Khalapur, Maharashtra',
    category: 'Factory / Manufacturing',
    video: 'https://www.youtube.com/embed/sPCkTagbAYo',
  },
];

// Filters shown only for categories that have real photos — add
// 'Broiler Systems' / 'Environmental Control' back when photos arrive.
const FILTERS = ['All', 'Metplast Housing', 'Layer Cage Systems', 'Breeder Cage Systems', 'Feed Silos', 'Factory / Manufacturing'];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filtered = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-navy w-[800px] h-[800px] top-[-10%] right-[-10%]" />
      </div>

      {/* Hero */}
      <section className="px-6 mb-16 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Projects & Gallery
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[100px] break-words hyphens-auto font-['Space_Grotesk'] font-black tracking-tighter max-w-4xl mx-auto leading-[0.9]"
            style={{ color: 'var(--text)' }}
          >
            REAL SYSTEMS. <br />
            <span className="text-gradient">REAL INSTALLATIONS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Real poultry housing, cage systems, silos, ventilation, and installation work by Metplast Industries.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-6 mb-12 relative z-10">
        <div className="max-w-[1600px] mx-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-3 pb-2 min-w-max">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  activeFilter === filter
                    ? 'text-white border-transparent shadow-lg'
                    : 'border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                style={activeFilter === filter ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 max-w-[1600px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`relative rounded-[2.5rem] overflow-hidden group cursor-pointer border ${
                  item.id === 7 ? 'md:col-span-2 lg:col-span-3 aspect-[21/9]' : 'aspect-[4/3]'
                }`}
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                onClick={() => setSelected(item)}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Category badge */}
                <div className="absolute top-6 left-6">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Zoom/play icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="w-20 h-20 rounded-full text-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 ease-out shadow-2xl"
                    style={{ background: 'var(--accent)' }}
                  >
                    {item.video ? <Play className="w-8 h-8 ml-1" /> : <ZoomIn className="w-8 h-8" />}
                  </div>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-white font-semibold text-sm leading-relaxed mb-3">{item.caption}</p>
                  <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    Enquire for Similar Project <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center py-20 font-medium" style={{ color: 'var(--text-muted)' }}>
            No images in this category yet.
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 mt-20 relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="rounded-[3rem] p-12 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <h2
              className="text-3xl md:text-5xl font-['Space_Grotesk'] font-black tracking-tight mb-4"
              style={{ color: 'var(--text)' }}
            >
              Want a Similar Setup for Your Farm?
            </h2>
            <p className="font-medium mb-8" style={{ color: 'var(--text-muted)' }}>
              Talk to our team and we'll design the right system for your bird count, climate, and budget.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-14 px-10 rounded-full font-bold text-lg text-white btn-glow transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Enquire Now <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <button
              aria-label="Close lightbox"
              className="absolute top-8 right-8 w-12 h-12 text-white/50 hover:text-white transition-colors bg-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-[var(--accent)] hover:border-[var(--accent)] z-[210]"
              onClick={() => setSelected(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {selected.video ? (
                <iframe
                  src={`${selected.video}?autoplay=1`}
                  title={selected.caption}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <Image src={selected.src} alt={selected.caption} fill className="object-contain" />
              )}
            </motion.div>
            {/* Caption below */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="text-white/70 font-medium text-sm">{selected.caption}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-bold mt-2"
                style={{ color: 'var(--accent)' }}
                onClick={() => setSelected(null)}
              >
                Enquire for Similar Project <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
