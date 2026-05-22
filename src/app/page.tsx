"use client"

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, ChevronRight, Activity, Zap, Cpu, Play, ThermometerSnowflake, Droplets, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.2], [0, 10]);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-dark">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-red w-[800px] h-[800px] top-[-20%] left-[-10%]" />
        <div className="glow-orb glow-blue w-[600px] h-[600px] bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }} />
      </div>

      {/* HERO SECTION */}
      <motion.section 
        style={{ scale, opacity, filter: `blur(${heroBlur}px)` }}
        className="sticky top-0 h-screen flex flex-col justify-center px-6 overflow-hidden z-10"
      >
        <div className="absolute inset-0 z-[-1] opacity-60">
          <Image src="/images/Hero-Slider-2.jpg" alt="Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/80 to-dark" />
        </div>

        <div className="max-w-[1600px] mx-auto w-full relative z-10 grid lg:grid-cols-12 gap-12 items-end pb-20 pt-32">
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_4px_20px_rgba(34,88,120,0.2)]"
            >
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#f83136] animate-pulse" />
              <span className="text-sm font-bold tracking-widest text-white uppercase">The 100/100 Standard</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[140px] break-words hyphens-auto font-['Space_Grotesk'] font-black leading-[0.9] tracking-tighter drop-shadow-2xl"
            >
              ARCHITECTING<br />
              <span className="text-gradient">THE FUTURE.</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 max-w-2xl"
            >
              <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed">
                Immersive, precision-engineered poultry systems. Over 35 years of dominating the industry through unrelenting automation and high-yield configuration.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-6 justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 w-full sm:w-auto"
            >
              <Button className="h-16 px-8 rounded-full bg-primary text-white border border-red-500/50 font-bold text-lg hover:scale-105 transition-transform btn-glow w-full sm:w-auto">
                Explore Architecture <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="h-16 px-8 rounded-full border-blue/40 bg-blue/10 backdrop-blur-xl text-white hover:bg-blue/30 font-bold text-lg w-full sm:w-auto transition-colors">
                <Play className="w-5 h-5 mr-2 fill-current" /> Watch Showreel
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-8 pt-8 w-full border-t border-white/10 mt-4"
            >
              <div>
                <p className="text-5xl font-['Space_Grotesk'] font-black text-white">99<span className="text-primary">%</span></p>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-2">Feeding Accuracy</p>
              </div>
              <div>
                <p className="text-5xl font-['Space_Grotesk'] font-black text-white">97<span className="text-primary">%</span></p>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-2">Yield Efficiency</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* HORIZONTAL SCROLL CAROUSEL - IMMERSIVE EXPERIENCE */}
      <section className="relative z-20 bg-dark py-32 px-6 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black tracking-tighter">
              BEYOND <span className="text-gradient-blue">TRADITION</span>
            </h2>
            <p className="hidden md:block text-white/50 max-w-sm text-right font-medium">Explore the ecosystems driving modern agriculture.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pb-12">
            {[
              { title: 'LAYER', img: '/images/Layer.png', tag: 'High-Yield Framework' },
              { title: 'BROILER', img: '/images/Broiler.png', tag: 'Rapid Growth Matrix' },
              { title: 'BREEDER', img: '/images/Breeder.png', tag: 'Genetic Optimization' }
            ].map((item, i) => (
              <div key={i} className="aspect-[4/3] relative rounded-[2rem] overflow-hidden glass-panel-dark group cursor-pointer w-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                
                <motion.div style={{ y: y1 }} className="absolute inset-0 p-12 flex items-center justify-center z-10 pointer-events-none">
                   <Image src={item.img} alt={item.title} width={400} height={400} className="object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                </motion.div>

                <div className="absolute inset-0 z-20 flex flex-col justify-between p-10 bg-gradient-to-t from-dark/90 via-transparent to-dark/40">
                  <div className="flex justify-between items-start">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest border border-white/20 text-white">
                      {item.tag}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-6xl font-['Space_Grotesk'] font-black tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID - HARDWARE ARCHITECTURE */}
      <section className="relative z-20 py-32 px-6 bg-white rounded-[4rem] text-dark shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-black tracking-tighter leading-none mb-6">
              HARDWARE <br/><span className="text-gradient">ARCHITECTURE.</span>
            </h2>
            <p className="text-xl text-dark/70 font-medium leading-relaxed">
              We don't just build equipment. We build the physical manifestation of efficiency. Every component is over-engineered for absolute reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
            {/* Big Bento 1 */}
            <div className="md:col-span-2 lg:col-span-2 row-span-2 rounded-[2.5rem] bg-slate-100 relative overflow-hidden group shadow-xl">
              <Image src="/images/Untitled-design-3-560x690.jpg" alt="Layer Cages" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent p-10 flex flex-col justify-end">
                <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-4xl font-black text-white mb-3 tracking-tight">H-Type Layer Pullet Systems</h3>
                <p className="text-white/80 font-medium text-lg max-w-md">The pinnacle of structural integrity and automated yield extraction.</p>
              </div>
            </div>

            {/* Small Bentos */}
            {[
              { icon: Zap, title: 'Automation', color: 'bg-blue' },
              { icon: Cpu, title: 'Debeaking AI', color: 'bg-primary' },
              { icon: ThermometerSnowflake, title: 'Climate Control', color: 'bg-slate-800' },
              { icon: Droplets, title: 'Hydration', color: 'bg-slate-700' }
            ].map((feat, i) => (
              <div key={i} className="rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8 flex flex-col justify-between group hover:bg-dark transition-colors duration-500 cursor-pointer shadow-sm hover:shadow-2xl">
                <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-dark group-hover:text-white transition-colors">{feat.title}</h4>
                  <p className="text-slate-500 group-hover:text-slate-400 font-medium text-sm mt-2 transition-colors">Precision Integration</p>
                </div>
              </div>
            ))}

            {/* Big Bento 2 */}
            <div className="md:col-span-2 lg:col-span-2 rounded-[2.5rem] bg-dark text-white p-10 flex flex-col justify-center relative overflow-hidden group shadow-xl">
              <div className="absolute right-[-10%] bottom-[-20%] w-[400px] h-[400px] bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/40 transition-colors duration-700" />
              <h3 className="text-4xl font-black mb-4 relative z-10 tracking-tight">Silo Storage Matrix</h3>
              <p className="text-white/60 max-w-sm mb-8 relative z-10 text-lg">High-capacity, zero-friction feed delivery frameworks designed for massive scale.</p>
              <Button className="w-fit rounded-full bg-white text-dark hover:bg-slate-200 font-bold relative z-10 h-12 px-8">
                View Specifications
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DARK MODE PARALLAX - TRUST */}
      <section className="relative z-20 py-40 px-6 overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-[url('/images/Glimpse-Metplast-Indsutries-1.jpg')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black tracking-tighter mb-8">
              THE <span className="text-gradient-blue">NETWORK.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl font-medium">Over 250+ enterprise installations. We power the facilities that feed the continent.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { q: "Their machines run perfectly. Absolute reliability.", auth: "Mr. Srinivas", img: "/images/Mr.-Manjunath-.jpg" },
              { q: "Quality products, timely delivery. A true partnership.", auth: "Saiyed Tarik", img: "/images/Mr.-Saiyad-Tarik.jpg" },
              { q: "Zero issues. Unmatched reliability.", auth: "Mr. Imran", img: "/images/Mr.-Ghanis.jpg" }
            ].map((t, i) => (
              <div key={i} className="glass-panel-dark rounded-[2.5rem] p-10 flex flex-col justify-between hover:-translate-y-4 transition-transform duration-500 border border-white/10 shadow-2xl">
                <p className="text-3xl font-bold leading-tight mb-12 text-white/90 font-['Space_Grotesk'] tracking-tight">"{t.q}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-primary/50 grayscale group-hover:grayscale-0 transition-all">
                    <Image src={t.img} alt={t.auth} fill className="object-cover" />
                  </div>
                  <span className="font-bold text-white tracking-wide uppercase">{t.auth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MASSIVE CTA */}
      <section className="relative z-20 bg-primary text-white py-40 px-6 rounded-t-[4rem] shadow-[0_-20px_50px_rgba(248,49,54,0.3)]">
        <div className="max-w-[1200px] mx-auto text-center space-y-12">
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[140px] break-words hyphens-auto font-['Space_Grotesk'] font-black leading-[0.9] tracking-tighter drop-shadow-lg">
            INITIATE <br/>YOUR BUILD.
          </h2>
          <p className="text-2xl font-medium text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Stop scrolling. Start scaling. Speak to our engineers today to configure your bespoke automation architecture.
          </p>
          <div className="pt-8">
            <Button className="h-20 px-12 rounded-full bg-dark text-white hover:bg-slate-800 font-black text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-all">
              Schedule Deployment <ArrowUpRight className="ml-4 w-8 h-8" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}



