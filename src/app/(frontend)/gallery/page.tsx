"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn, Play } from 'lucide-react';

const GALLERY_IMAGES = [
  { id: 1, src: '/images/gallery/4-1-600x540.jpg', alt: 'Poultry Setup 1', category: 'Installation' },
  { id: 2, src: '/images/gallery/7-1-600x540.jpg', alt: 'Poultry Setup 2', category: 'Installation' },
  { id: 3, src: '/images/gallery/1-3-600x540.jpg', alt: 'Poultry Setup 3', category: 'Architecture' },
  { id: 4, src: '/images/gallery/3-2-600x540.jpg', alt: 'Poultry Setup 4', category: 'Architecture' },
  { id: 5, src: '/images/gallery/8-1-600x540.jpg', alt: 'Poultry Setup 5', category: 'Automation' },
  { id: 6, src: '/images/gallery/9-600x540.jpg', alt: 'Poultry Setup 6', category: 'Automation' },
  { id: 7, src: '/images/Glimpse-Metplast-Indsutries-1.jpg', alt: 'Factory Overview', category: 'Core Facility', video: 'https://www.youtube.com/watch?v=sPCkTagbAYo' },
];

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<{ src: string, video?: string } | null>(null);

  return (
    <main className="min-h-screen bg-dark pt-32 pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-blue w-[800px] h-[800px] top-[-10%] right-[-10%]" />
      </div>

      {/* Hero */}
      <section className="px-6 mb-20 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Ecosystem Visuals</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[100px] break-words hyphens-auto font-['Space_Grotesk'] font-black text-white tracking-tighter max-w-4xl mx-auto leading-[0.9]"
          >
            EXCELLENCE IN <br/>
            <span className="text-gradient">ACTION.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Explore our state-of-the-art installations and precision-engineered poultry equipment across the globe.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-[2.5rem] overflow-hidden group cursor-pointer bg-white/5 border border-white/10 ${i === 6 ? 'md:col-span-2 lg:col-span-3 aspect-[21/9]' : 'aspect-[4/3]'}`}
              onClick={() => setSelectedItem(img)}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center backdrop-blur-md scale-50 group-hover:scale-100 transition-transform duration-500 ease-out shadow-[0_0_30px_rgba(248,49,54,0.5)]">
                  {img.video ? <Play className="w-8 h-8 ml-1" /> : <ZoomIn className="w-8 h-8" />}
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="bg-white/10 backdrop-blur-xl text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/20">
                  {img.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setSelectedItem(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/5 border border-white/10 rounded-full p-4 backdrop-blur-md hover:bg-primary hover:border-primary z-[210]">
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.video ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${selectedItem.video.split('v=')[1]}?autoplay=1`} 
                  title="YouTube video player" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <Image src={selectedItem.src} alt="Gallery Focus" fill className="object-contain" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
