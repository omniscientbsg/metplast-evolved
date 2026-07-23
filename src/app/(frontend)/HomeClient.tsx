"use client"

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Play, CheckCircle2, Calculator, ArrowRightCircle, X, Download, Wind, Image as ImageIcon, Bird, Award, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunitySection } from '@/components/CommunitySection';
import Link from 'next/link';
import type { PageContentView } from '@/lib/content/page-content';

export function HomeClient({ hero }: { hero: PageContentView }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scale = useTransform(smoothProgress, [0, 0.05], [1, 0.8]);
  const heroBlur = useTransform(smoothProgress, [0, 0.05], [0, 10]);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[var(--bg)] overflow-hidden">

      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orange w-[800px] h-[800px] top-[-20%] left-[-10%]" />
        <div className="glow-orb glow-navy w-[600px] h-[600px] bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }} />
      </div>

      {/* HERO SECTION */}
      <section
        className="sticky top-0 h-screen flex flex-col justify-center px-6 overflow-hidden z-10"
      >
        <div className="absolute inset-0 z-[-1] opacity-80">
          <Image src={hero.image ?? '/images/Hero-Slider-2.jpg'} alt="Background" fill className="object-cover object-center" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-[var(--hero-fade)]" />
        </div>

        <motion.div style={{ scale, filter: `blur(${heroBlur}px)` }} className="w-full max-w-[1600px] mx-auto mt-20">
          <div className="w-full relative z-10 grid lg:grid-cols-12 gap-12 items-end pb-20 pt-32">
          <div className="lg:col-span-8 space-y-8">
            {hero.eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_4px_20px_rgba(34,88,120,0.2)]"
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
                <span className="text-sm font-bold tracking-widest text-white uppercase">{hero.eyebrow}</span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white text-4xl sm:text-6xl md:text-8xl lg:text-[110px] break-words hyphens-auto font-['Space_Grotesk'] font-black leading-[0.9] tracking-tighter drop-shadow-2xl"
            >
              {hero.title}{hero.titleAccent && (<><br /><span className="text-gradient">{hero.titleAccent}</span></>)}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 max-w-3xl"
            >
              <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
                {hero.subtitle}
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
              <Link href={hero.ctaPrimary?.href ?? '/housing'} className="w-full sm:w-auto">
                <Button className="h-16 px-8 rounded-full text-white border border-orange-500/50 font-bold text-lg hover:scale-105 transition-transform btn-glow w-full" style={{ background: 'var(--accent)' }}>
                  {hero.ctaPrimary?.label ?? 'Plan My Poultry Project'} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={hero.ctaSecondary?.href ?? '/layer'} className="w-full sm:w-auto">
                <Button variant="outline" className="h-16 px-8 rounded-full border-blue/40 bg-blue/10 backdrop-blur-xl text-white hover:bg-blue/30 font-bold text-lg w-full sm:w-auto transition-colors">
                  {hero.ctaSecondary?.label ?? 'Explore Solutions'} <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-6 pt-8 w-full border-t border-white/10 mt-4"
            >
              <div>
                <p className="text-4xl font-['Space_Grotesk'] font-black text-white">35<span style={{ color: 'var(--accent)' }}>+</span></p>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Years of Experience</p>
              </div>
              <div>
                <p className="text-4xl font-['Space_Grotesk'] font-black text-white">500<span style={{ color: 'var(--accent)' }}>+</span></p>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Farms</p>
              </div>
              <div>
                <p className="text-lg font-['Space_Grotesk'] font-black text-white leading-tight">Complete Poultry Housing</p>
              </div>
              <div>
                <p className="text-lg font-['Space_Grotesk'] font-black text-white leading-tight">Layer · Breeder · Broiler Systems</p>
              </div>
            </motion.div>
          </div>
        </div>
        </motion.div>
      </section>

      {/* FEATURE CARDS */}
      <section className="relative z-20 bg-[var(--bg)] pt-12 pb-6 px-6 -mt-8 transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-[var(--surface)] p-10 rounded-[2rem] border border-[var(--border)] relative overflow-hidden group shadow-xl transition-colors duration-500">
            <div className="absolute top-4 right-8 text-8xl font-black text-[var(--text)] opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">01</div>
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm relative z-10 transition-colors duration-500 group-hover:-translate-y-1 group-hover:shadow-md transition-all">
              <Bird className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-4 relative z-10 group-hover:text-[var(--accent)] transition-colors">Innovative Poultry Solutions</h3>
            <p className="text-[var(--text-muted)] font-medium text-[15px] leading-relaxed relative z-10">
              Poultry housing systems engineered around bird comfort, farm workflow, clean manure handling, uniform feeding, and long service life.
            </p>
          </div>
          <div className="bg-[var(--surface)] p-10 rounded-[2rem] border border-[var(--border)] relative overflow-hidden group shadow-xl transition-colors duration-500">
            <div className="absolute top-4 right-8 text-8xl font-black text-[var(--text)] opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">02</div>
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm relative z-10 transition-colors duration-500 group-hover:-translate-y-1 group-hover:shadow-md transition-all">
              <Award className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-4 relative z-10 group-hover:text-[var(--accent)] transition-colors">Expertise & Experience</h3>
            <p className="text-[var(--text-muted)] font-medium text-[15px] leading-relaxed relative z-10">
              Backed by over 35 years of manufacturing excellence and deep industry knowledge.
            </p>
          </div>
          <div className="bg-[var(--surface)] p-10 rounded-[2rem] border border-[var(--border)] relative overflow-hidden group shadow-xl transition-colors duration-500">
            <div className="absolute top-4 right-8 text-8xl font-black text-[var(--text)] opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">03</div>
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm relative z-10 transition-colors duration-500 group-hover:-translate-y-1 group-hover:shadow-md transition-all">
              <Handshake className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-4 relative z-10 group-hover:text-[var(--accent)] transition-colors">Customer-Centric Approach</h3>
            <p className="text-[var(--text-muted)] font-medium text-[15px] leading-relaxed relative z-10">
              Delivering customized turnkey solutions from project planning to final installation.
            </p>
          </div>
        </div>
      </section>

      {/* POSITIONING & 4 SOLUTION CARDS */}
      <section className="relative z-20 bg-[var(--bg)] py-16 px-6 mb-12">
        <div className="max-w-[1600px] mx-auto space-y-20">

          {/* Plain Text Positioning */}
          <div className="max-w-4xl text-center mx-auto space-y-6">
             <h2 className="text-3xl md:text-5xl font-['Space_Grotesk'] font-black tracking-tighter text-[var(--text)]">
                Engineered for <span className="text-gradient">Performance.</span>
             </h2>
             <p className="text-lg md:text-xl text-[var(--text-muted)] leading-relaxed font-medium">
                Metplast designs, manufactures, and installs complete poultry housing — cage systems, feeding, drinking, manure handling, egg collection, ventilation, and feed storage — for layer, breeder, and broiler farms. From levelled land to a running farm, one team stays responsible.
             </p>
          </div>

          {/* Solution Selector - 4 Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
                { title: 'Metplast Housing', img: '/images/Near-Rajesh-Home-Page.jpg', link: '/housing', desc: 'Complete structural builds.' },
                { title: 'Layer Solutions', img: '/images/Layer2.jpg', link: '/layer', desc: 'H-Type & S-Frame Layer Cages.' },
                { title: 'Breeder Solutions', img: '/images/Breeder2.jpg', link: '/breeder', desc: 'Breeder Cage & Feeding Systems.' },
                { title: 'Broiler Solutions', img: '/images/gallery/1-3-600x540.jpg', link: '/broiler', desc: 'Floor & Cage Broiler Systems.' }
             ].map((sol, i) => (
                 <Link href={sol.link} key={i} className="group relative rounded-[2rem] overflow-hidden aspect-square border border-[var(--border)] hover:border-[var(--border)] transition-colors shadow-2xl bg-slate-900">
                    <Image src={sol.img} alt={sol.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-90" sizes="(max-width: 1024px) 50vw, 25vw" />
                   <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent p-8 flex flex-col justify-end">
                      <h3 className="text-2xl font-black text-white font-['Space_Grotesk'] mb-2">{sol.title}</h3>
                      <p className="text-white/80 font-medium text-sm">{sol.desc}</p>
                   </div>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SYSTEM OVERVIEW */}
      <section className="relative z-20 py-24 px-6 bg-[var(--bg-elevated)] rounded-[4rem] text-[var(--text)] shadow-[var(--shadow)] mt-[-2rem] overflow-hidden border border-[var(--border)]">
        <div className="max-w-[1600px] mx-auto text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-6">
             <span className="text-primary font-bold tracking-widest uppercase text-sm">Our Equipment</span>
             <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black tracking-tighter text-[var(--text)]">
                Everything Your Farm Needs
             </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
                { name: 'Cage Systems', link: '/layer' },
                { name: 'Feeding', link: '/layer' },
                { name: 'Drinking', link: '/layer' },
                { name: 'Manure Removal', link: '/layer' },
                { name: 'Egg Collection', link: '/layer' },
                { name: 'Environmental Control', link: '/environmental-control' },
                { name: 'Feed Silos', link: '/feed-silos' },
                { name: 'Calculators', link: '/calculators' }
             ].map((tile, i) => (
                <Link href={tile.link} key={i} className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className="w-12 h-12 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--accent)] font-black font-['Space_Grotesk'] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                      0{i+1}
                   </div>
                   <span className="font-bold text-lg text-center text-[var(--text)]">{tile.name}</span>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR SECTION */}
      <section className="relative z-20 bg-[var(--bg)] py-32 px-6 overflow-hidden mt-[-2rem]">
        <div className="absolute inset-0 bg-[url('/images/Metplast-Website-Themes-1980-x-400-px.png')] bg-center opacity-5 mix-blend-luminosity pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center space-y-6 mb-20">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--text)]/5 border border-[var(--border)] mb-4 backdrop-blur-xl shadow-[0_0_30px_rgba(34,88,120,0.3)]">
               <Calculator className="w-10 h-10 text-blue" />
             </div>
             <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-black tracking-tighter text-[var(--text)] drop-shadow-xl">
                START FARM <br className="md:hidden" />
                <span className="text-gradient-blue">CALCULATION</span>
             </h2>
             <p className="text-xl text-[var(--text-muted)] font-medium max-w-2xl mx-auto">
               Use our intelligent calculators to determine the optimal bird density, rows, and dimensions for your shed.
             </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-center">
            {[
              { title: 'Layer', link: '/calculators/layer', img: '/images/Untitled-design-3-560x690.jpg' },
              { title: 'Layer Pullet', link: '/calculators/layer-pullet', img: '/images/gallery/9-600x540.jpg' },
              { title: 'Breeder', link: '/calculators/breeder', img: '/images/Breeder2.jpg' },
              { title: 'Breeder Pullet', link: '/calculators/breeder-pullet', img: '/images/gallery/4-1-600x540.jpg' },
              { title: 'Broiler', link: '/calculators/broiler', img: '/images/gallery/1-3-600x540.jpg' }
            ].map((calc, i) => (
              <Link href={calc.link} key={i} className="group relative glass-panel rounded-3xl p-6 transition-all duration-700 hover:-translate-y-2 flex flex-col items-center gap-6 overflow-hidden hover:shadow-[0_20px_60px_rgba(34,88,120,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-t from-dark/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border)] shadow-lg">
                  <Image src={calc.img} alt={calc.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 z-10" sizes="96px" />
                </div>
                <div className="space-y-4 w-full relative z-20 text-center">
                   <h3 className="text-xl font-black font-['Space_Grotesk'] text-[var(--text)] leading-tight">{calc.title}<br/>Calculator</h3>
                   <div className="flex items-center justify-center text-blue group-hover:scale-110 transition-transform">
                     <ArrowRightCircle className="w-6 h-6" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ENV CONTROL / GALLERY / BROCHURES ROW */}
      <section className="relative z-20 py-32 px-6 bg-[var(--bg)] border-t border-white/5 text-[var(--text)]">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-3 gap-8">

           {/* Env Control */}
           <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
               <div className="space-y-6 relative z-10">
                 <div className="w-16 h-16 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center text-[var(--accent)]">
                    <Wind className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black font-['Space_Grotesk'] text-[var(--text)]">Environmental Control</h3>
                 <p className="text-[var(--text-muted)] font-medium">Keep your flock comfortable with our range of exhaust fans, cooling pads, and automated climate control systems.</p>
              </div>
              <Link href="/environmental-control" className="mt-12 inline-flex items-center text-[var(--accent)] font-bold tracking-widest uppercase text-sm hover:gap-4 transition-all gap-2 relative z-10">
                 View Climate Systems <ArrowRight className="w-4 h-4" />
              </Link>
           </div>

           {/* Gallery Teaser */}
           <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-navy)]/15 rounded-full blur-3xl pointer-events-none" />
               <div className="space-y-6 relative z-10">
                 <div className="w-16 h-16 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center text-[var(--accent)]">
                    <ImageIcon className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black font-['Space_Grotesk'] text-[var(--text)]">Projects & Gallery</h3>
                 <p className="text-[var(--text-muted)] font-medium">See real installations of our cages, silos, and housing projects across 500+ farms.</p>
              </div>
              <Link href="/gallery" className="mt-12 inline-flex items-center text-[var(--accent)] font-bold tracking-widest uppercase text-sm hover:gap-4 transition-all gap-2 relative z-10">
                 View All Projects <ArrowRight className="w-4 h-4" />
              </Link>
           </div>

           {/* Brochures */}
           <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
               <div className="space-y-6 relative z-10">
                 <div className="w-16 h-16 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center text-[var(--accent)]">
                    <Download className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black font-['Space_Grotesk'] text-[var(--text)]">Product Brochures</h3>
                 <p className="text-[var(--text-muted)] font-medium">Download our comprehensive master brochure containing detailed specs of all Metplast products.</p>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('metplast:open-brochure'))}
                className="mt-12 inline-flex items-center text-[var(--accent)] hover:opacity-80 font-bold tracking-widest uppercase text-sm hover:gap-4 transition-all gap-2 relative z-10 cursor-pointer"
              >
                 Download PDF <ArrowRight className="w-4 h-4" />
              </button>
           </div>

        </div>
      </section>

      <CommunitySection />

      {/* MASSIVE CTA */}
      <section className="relative z-20 text-white py-40 px-6 rounded-t-[4rem] shadow-[0_-30px_60px_rgba(249,115,22,0.2)]" style={{ background: 'var(--accent)' }}>
        <div className="max-w-[1200px] mx-auto text-center space-y-12 relative z-10">
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[130px] break-words hyphens-auto font-['Space_Grotesk'] font-black leading-[0.9] tracking-tighter drop-shadow-xl">
            PLAN YOUR <br/>FARM.
          </h2>
          <p className="text-2xl font-medium text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Speak to our engineers today to configure your complete poultry housing and equipment setup.
          </p>
          <div className="pt-8">
            <Link href="/contact">
              <Button className="h-20 px-12 rounded-full bg-[var(--bg)] text-[var(--text)] hover:opacity-90 font-black text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-all">
                Send Enquiry <ArrowRight className="ml-4 w-8 h-8" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
