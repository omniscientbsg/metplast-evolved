"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Shield, Settings, Zap, ArrowRight, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRODUCT_DATABASE: Record<string, any> = {
  'h-type-layer-pullet-systems': {
    name: 'H-Type Layer Pullet Systems',
    tagline: 'The pinnacle of structural integrity and automated yield extraction.',
    desc: 'Precision engineered for growing layers with optimal spacing, climate integration, and frictionless feed access. This system maximizes vertical space while ensuring perfect airflow to every bird, drastically reducing mortality and improving feed conversion ratios.',
    image: '/images/Untitled-design-3-560x690.jpg',
    gallery: ['/images/aa.png', '/images/bb.png'],
    cat: 'Architecture',
    specs: ['Fully Automated Feeding', 'Integrated Manure Belt', 'Anti-Corrosion Zinc Coating', '99.5% Space Efficiency']
  },
  'debeaking-ai-module': {
    name: 'Debeaking AI Module',
    tagline: 'Safe, automated precision clipping.',
    desc: 'Our latest AI-driven module uses machine vision to ensure exact, painless debeaking. This protects your flock, reduces stress, and completely eliminates the margin of human error during the crucial early development phases.',
    image: '/images/Untitled-design-4-560x690.jpg',
    gallery: ['/images/ff.png', '/images/ee.png'],
    cat: 'Intelligence',
    specs: ['Sub-millimeter Precision', 'Stress-Reduction Processing', 'Thermal Cauterization', 'High-Speed Throughput']
  },
  'h-type-commercial-matrix': {
    name: 'H-Type Commercial Matrix',
    tagline: 'Ensuring 97% egg collection efficiency.',
    desc: 'Our flagship commercial layer cages. Engineered for massive scale, these matrices feature soft-roll floors, automated egg conveyors, and zero-stress partitions that push laying efficiency to the absolute limit.',
    image: '/images/Untitled-design-6-560x690.jpg',
    gallery: ['/images/cc.png', '/images/dd.png'],
    cat: 'Architecture',
    specs: ['Automated Egg Conveyors', 'Soft-Roll Egg Saving Floors', 'Dynamic Hydration Nipples', 'Zero-Stress Partitions']
  },
  'automated-nest-boxes': {
    name: 'Automated Nest Boxes',
    tagline: 'Comfortable, automated nest boxes.',
    desc: 'Significantly reduce egg breakage and floor eggs. These automated nest boxes create a dark, secure environment for layers while automatically expelling birds at night and transporting eggs to the central packing station.',
    image: '/images/7-1-560x690.jpg',
    gallery: ['/images/cc.png', '/images/Layer.png'],
    cat: 'Hardware',
    specs: ['Auto-Expulsion System', 'Central Conveyor Integration', 'Mite-Resistant Mats', 'Breathable Dark Canopies']
  },
  'silo-storage-matrix': {
    name: 'Silo Storage Matrix',
    tagline: 'High-capacity, weather-proof feed storage.',
    desc: 'Galvanized, thermal-regulating feed silos that ensure continuous, zero-friction feed supply. Integrated directly with our automated feeding lines to eliminate manual labor and protect against feed contamination.',
    image: '/images/Untitled-design-7-560x690.jpg',
    gallery: ['/images/Glimpse-Metplast-Indsutries-1.jpg', '/images/Hero-Slider-2.jpg'],
    cat: 'Storage',
    specs: ['Galvanized Steel Build', 'Thermal Reflective Coating', 'Automated Auger Delivery', 'Contamination Sealed']
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = PRODUCT_DATABASE[slug] || PRODUCT_DATABASE['h-type-layer-pullet-systems'];

  const [isQuoting, setIsQuoting] = useState(false);

  // Fallback to top if rendering
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <main className="min-h-screen bg-dark text-white relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-red w-[600px] h-[600px] top-[-10%] right-[-10%]" />
        <div className="glow-orb glow-blue w-[800px] h-[800px] bottom-[-20%] left-[-20%]" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 pt-32 pb-24">
        
        {/* Breadcrumb & Back */}
        <div className="mb-12">
          <Link href="/products" className="inline-flex items-center text-white/50 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Architecture
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:items-start">
          
          {/* Left Column: Sticky Details */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#f83136] animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-white uppercase">{product.cat}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-['Space_Grotesk'] font-black leading-[0.95] tracking-tighter"
            >
              {product.name.toUpperCase()}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-['Space_Grotesk'] text-white/80 font-bold tracking-tight"
            >
              {product.tagline}
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/50 leading-relaxed font-medium"
            >
              {product.desc}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-8 flex flex-col sm:flex-row gap-4 border-t border-white/10"
            >
              <Button 
                onClick={() => {
                  document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-16 px-8 rounded-full bg-primary text-white hover:bg-primary/90 font-black text-lg shadow-[0_10px_30px_rgba(248,49,54,0.3)] hover:scale-105 transition-all btn-glow w-full sm:w-auto"
              >
                Request Quotation <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Imagery and Specs */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Main Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-[4/3] rounded-[3rem] overflow-hidden glass-panel-dark border border-white/10 shadow-2xl group"
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700" 
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60" />
            </motion.div>

            {/* Specifications Bento */}
            <div className="grid sm:grid-cols-2 gap-6">
              {product.specs.map((spec: string, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group"
                >
                  <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:border-primary/50 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{spec}</h3>
                  <p className="text-white/40 text-sm mt-2 font-medium">Enterprise Grade</p>
                </motion.div>
              ))}
            </div>

            {/* Gallery Expansion */}
            <div className="grid grid-cols-2 gap-6">
              {product.gallery.map((img: string, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={i} 
                  className="relative aspect-square rounded-[2rem] overflow-hidden glass-panel-dark border border-white/10 group"
                >
                  <Image src={img} alt={`${product.name} detail`} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* DEDICATED QUOTE SECTION */}
      <section id="quote-form" className="relative z-20 bg-primary text-white py-32 px-6 rounded-t-[4rem] shadow-[0_-20px_50px_rgba(248,49,54,0.2)]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-black leading-[0.9] tracking-tighter drop-shadow-md">
              SECURE THIS <br/>ARCHITECTURE.
            </h2>
            <p className="text-xl font-medium text-white/90 max-w-md drop-shadow-sm">
              Request a custom quotation for the <span className="font-bold">{product.name}</span>. Our engineering team will configure exact specifications for your facility.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 text-white font-bold">
                <Shield className="w-6 h-6 text-dark" /> Covered by Metplast Warranty
              </div>
              <div className="flex items-center gap-4 text-white font-bold">
                <Settings className="w-6 h-6 text-dark" /> Custom Installation Available
              </div>
            </div>
          </div>
          
          <div className="bg-dark p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => { e.preventDefault(); setIsQuoting(true); setTimeout(() => setIsQuoting(false), 2000); }}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Facility Name</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" placeholder="Your Farm Name" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Email</label>
                  <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" placeholder="you@domain.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Phone</label>
                  <input type="tel" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" placeholder="+91..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Estimated Capacity (Birds)</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" placeholder="e.g. 50000" />
              </div>
              <div className="pt-4">
                <Button 
                  disabled={isQuoting}
                  className="w-full h-16 rounded-full bg-primary text-white hover:bg-primary/90 font-black text-xl transition-all btn-glow"
                >
                  {isQuoting ? "Transmitting..." : "Get Exact Quote"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}