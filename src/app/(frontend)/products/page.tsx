"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Box, Target, Zap, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALL_PRODUCTS = [
  { id: 1, name: 'H-Type Layer Pullet Systems', desc: 'Precision engineered for growing layers with optimal spacing and feed access.', image: '/images/Untitled-design-3-560x690.jpg', cat: 'Architecture' },
  { id: 2, name: 'Debeaking AI Module', desc: 'Safe, automated precision clipping to protect your flock and improve efficiency.', image: '/images/Untitled-design-4-560x690.jpg', cat: 'Intelligence' },
  { id: 3, name: 'H-Type Commercial Matrix', desc: 'Our flagship commercial layer cages ensuring 97% egg collection efficiency.', image: '/images/Untitled-design-6-560x690.jpg', cat: 'Architecture' },
  { id: 4, name: 'Automated Nest Boxes', desc: 'Comfortable, automated nest boxes that significantly reduce egg breakage.', image: '/images/7-1-560x690.jpg', cat: 'Hardware' },
  { id: 5, name: 'Silo Storage Matrix', desc: 'High-capacity, weather-proof feed storage silos ensuring continuous supply.', image: '/images/Untitled-design-7-560x690.jpg', cat: 'Storage' },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-dark pt-32 pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-red w-[800px] h-[800px] top-[-20%] left-[-10%]" />
      </div>

      {/* Hero */}
      <section className="px-6 mb-24 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Architecture Catalog</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[100px] break-words hyphens-auto font-['Space_Grotesk'] font-black text-white tracking-tighter max-w-5xl mx-auto leading-[0.9]"
          >
            HIGH-PERFORMANCE <br /><span className="text-gradient">EQUIPMENT.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            From precision climate control to automated feeding, our catalog represents 35 years of engineering excellence in poultry farming.
          </motion.p>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="px-6 max-w-[1600px] mx-auto mb-32 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_PRODUCTS.map((prod, i) => (
            <motion.div 
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/products/${prod.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`} className="block glass-panel-dark rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all duration-500 flex flex-col hover:-translate-y-2 shadow-2xl h-full">
                <div className="relative h-[400px] bg-black/50 p-8 flex items-center justify-center overflow-hidden">
                  <Image src={prod.image} alt={prod.name} fill className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-80" />
                  <div className="absolute top-8 left-8">
                    <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                      {prod.cat}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1 bg-dark/50">
                  <h3 className="text-3xl font-['Space_Grotesk'] font-black text-white mb-4 group-hover:text-primary transition-colors tracking-tight">{prod.name}</h3>
                  <p className="text-white/50 mb-10 leading-relaxed font-medium flex-1">{prod.desc}</p>
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between cursor-pointer group/btn mt-auto">
                    <span className="font-bold text-white tracking-wide uppercase text-sm group-hover/btn:text-primary transition-colors">Deploy Configuration</span>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary transition-all">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Block */}
      <section className="px-6 max-w-[1600px] mx-auto relative z-10">
        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-white grid lg:grid-cols-2 gap-16 items-center relative overflow-hidden shadow-[0_20px_50px_rgba(248,49,54,0.3)]">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/20 blur-[120px] rounded-full mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-black leading-[0.9] tracking-tighter text-white drop-shadow-lg">
              NEED A CUSTOM <br/>TURNKEY SOLUTION?
            </h2>
            <p className="text-xl text-white/90 font-medium max-w-md drop-shadow-md">
              We design and manufacture end-to-end setups tailored to your exact farm dimensions and operational goals.
            </p>
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4 text-white font-bold text-lg">
                <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center"><Box className="w-5 h-5 text-primary" /></div> Space Optimization Layouts
              </div>
              <div className="flex items-center gap-4 text-white font-bold text-lg">
                <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center"><Zap className="w-5 h-5 text-primary" /></div> Full Automation Integration
              </div>
              <div className="flex items-center gap-4 text-white font-bold text-lg">
                <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center"><Target className="w-5 h-5 text-primary" /></div> High-Yield Configuration
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-6 lg:items-end">
            <Button className="h-20 px-10 w-full lg:w-auto text-xl font-black rounded-full bg-dark text-white hover:bg-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3">
              Calculate Farm Capacity <ArrowUpRight className="w-6 h-6" />
            </Button>
            <Button variant="outline" className="h-16 px-10 w-full lg:w-auto text-lg font-bold rounded-full border-white/30 bg-white/10 hover:bg-white text-white hover:text-dark backdrop-blur-xl transition-colors">
              Speak to an Engineer
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}



