"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, Factory, Globe, Trophy, Users, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-dark pt-32 pb-24 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-red w-[600px] h-[600px] top-[-10%] right-[-10%]" />
      </div>

      {/* Hero */}
      <section className="px-6 mb-32 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Who We Are</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl break-words hyphens-auto font-['Space_Grotesk'] font-black text-white tracking-tighter max-w-5xl mx-auto leading-[0.9]"
          >
            REVOLUTIONIZING <br/>
            <span className="text-gradient">THE INDUSTRY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Metplast Industries is committed to continuous innovation, developing cutting-edge equipment tailored to the evolving needs of poultry farmers worldwide.
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
            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-black text-white leading-none tracking-tighter">
              DECADES OF EXPERTISE.<br/>
              <span className="text-white/30">ZERO COMPROMISE.</span>
            </h2>
            <div className="text-lg text-white/60 font-medium space-y-6 leading-relaxed">
              <p>
                As an industry leader, we specialize in manufacturing high-quality, need-based poultry solutions from our state-of-the-art facility in Khopoli, India—just an hour drive from Mumbai.
              </p>
              <p>
                Are you a farmer aiming to maximize productivity while ensuring the comfort of your poultry? Our Automatic Cages are designed to revolutionize poultry farming with unmatched efficiency and durability.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
              <div className="glass-panel p-8 rounded-3xl group hover:border-primary/50 transition-colors">
                <p className="text-5xl font-['Space_Grotesk'] font-black text-primary mb-3">99<span className="text-2xl">%</span></p>
                <p className="font-bold text-white tracking-wide uppercase text-sm">Feeding Accuracy</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl group hover:border-primary/50 transition-colors">
                <p className="text-5xl font-['Space_Grotesk'] font-black text-primary mb-3">97<span className="text-2xl">%</span></p>
                <p className="font-bold text-white tracking-wide uppercase text-sm">Egg Collection</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[800px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <Image src="/images/Glimpse-Metplast-Indsutries-1.jpg" alt="Metplast Factory" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 glass-panel p-8 rounded-3xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Factory className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Our Core Facility</p>
                  <p className="text-2xl font-bold text-white">Khopoli, Maharashtra</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white text-dark py-40 px-6 rounded-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-black tracking-tighter leading-none mb-6">
              WHY CHOOSE <br/><span className="text-gradient">METPLAST.</span>
            </h2>
            <p className="text-xl text-dark/70 font-medium max-w-2xl">
              Built on a foundation of engineering excellence and deep understanding of agricultural needs. We don't just supply equipment; we upgrade ecosystems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Precision Feeding", desc: "Automated systems that ensure exactly the right amount of feed, zero waste." },
              { icon: Globe, title: "Global Standards", desc: "Manufactured to meet and exceed international agricultural tolerances." },
              { icon: ShieldCheck, title: "Yield Protection", desc: "Designed specifically to protect your eggs, reduce breakage, and increase margins." },
              { icon: Users, title: "Enterprise Trust", desc: "250+ satisfied farm owners across 10+ countries rely on our infrastructure." },
            ].map((value, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 hover:bg-dark hover:text-white transition-colors duration-500 group cursor-pointer shadow-sm hover:shadow-2xl">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 font-['Space_Grotesk'] tracking-tight">{value.title}</h3>
                <p className="text-slate-500 group-hover:text-slate-400 font-medium leading-relaxed transition-colors">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
