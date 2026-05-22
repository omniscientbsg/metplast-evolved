"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Shield, Settings, Zap, ArrowRight, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Calculator } from 'lucide-react';

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
  },
  'breeder': {
    name: 'Breeder Systems',
    tagline: 'Genetic optimization matrix for maximum hatchability.',
    desc: 'Precision feeding and watering systems to ensure superior breeder flock health, optimal mating environments, and high hatchability rates. Features specialized male-exclusion grilles and isolated nesting sectors.',
    image: '/images/Breeder.png',
    gallery: ['/images/aa.png', '/images/cc.png'],
    cat: 'Turnkey Solutions',
    specs: ['Male-Exclusion Grilles', 'Precision Automated Weighing', 'Ergonomic Nest Layout', 'High-Flow Nipple Lines']
  },
  'broiler': {
    name: 'Broiler Solutions',
    tagline: 'Rapid growth matrices engineered for scale.',
    desc: 'Advanced climate-controlled systems designed for rapid and healthy bird growth, maximizing yield and efficiency for modern broiler farming operations with specialized day-old chick adaptations.',
    image: '/images/Broiler.png',
    gallery: ['/images/bb.png', '/images/dd.png'],
    cat: 'Turnkey Solutions',
    specs: ['360° Nipple Drinkers', 'Flood-Proof Feed Pans', 'Dynamic Micro-Climate Control', 'Heavy-Duty Flooring']
  },
  'layer': {
    name: 'Layer Complexes',
    tagline: 'High-yield framework for commercial egg production.',
    desc: 'Meticulously crafted to deliver exceptional results. Optimizes productivity while prioritizing the well-being of your layer birds with uniform feed distribution and efficient egg collection.',
    image: '/images/Layer.png',
    gallery: ['/images/ee.png', '/images/ff.png'],
    cat: 'Turnkey Solutions',
    specs: ['Gantry Feed Distributors', 'Soft-Roll Egg Belts', 'Mite-Resistant Perches', 'Automated Manure Removal']
  },
  'drinking-system': {
    name: 'Precision Drinking Systems',
    tagline: 'Dynamic hydration delivery matrix.',
    desc: '360-degree, high-flow nipple drinker systems engineered to prevent leaking while delivering precise, filtered hydration to every bird at all stages of growth.',
    image: '/images/chicken.png',
    gallery: ['/images/Glimpse-Metplast-Indsutries-1.jpg', '/images/Hero-Slider-3.jpg'],
    cat: 'Products',
    specs: ['360° Stainless Steel Nipples', 'Integrated Water Filtration', 'Anti-Roost Wires', 'Pressure Regulators']
  },
  'feeding-system': {
    name: 'Automated Feeding Systems',
    tagline: 'Zero-friction nutrient distribution.',
    desc: 'High-velocity auger and pan feeding systems that ensure perfectly uniform feed distribution across massive scale houses without feed separation or waste.',
    image: '/images/Untitled-design-3-560x690.jpg',
    gallery: ['/images/Untitled-design-6-560x690.jpg', '/images/Hero-Slider-1.jpg'],
    cat: 'Products',
    specs: ['Flood-Proof Feed Pans', 'High-Speed Auger Lines', 'Anti-Waste Lip Rings', 'Dynamic Height Adjustment']
  },
  'ventilation-system': {
    name: 'Climate & Ventilation Matrix',
    tagline: 'Absolute atmospheric control.',
    desc: 'Tunnel ventilation, cooling pads, and heavy-duty extraction fans integrated with AI thermostats to maintain the absolute perfect micro-climate for high-yield farming.',
    image: '/images/Untitled-design-2.jpg',
    gallery: ['/images/Hero-Slider-2.jpg', '/images/Glimpse-Metplast-Indsutries-1.jpg'],
    cat: 'Products',
    specs: ['50" Tunnel Extraction Fans', 'Cellulose Cooling Pads', 'AI Thermostatic Controllers', 'Automated Baffle Inlets']
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = PRODUCT_DATABASE[slug] || PRODUCT_DATABASE['h-type-layer-pullet-systems'];

  const [isQuoting, setIsQuoting] = useState(false);
  const [shedLength, setShedLength] = useState<number | ''>('');
  const [numRows, setNumRows] = useState<number | ''>('');
  const [numTiers, setNumTiers] = useState<number | ''>('');
  
  const [calcResult, setCalcResult] = useState<{
    sectionsPerRow?: number,
    totalSections?: number,
    totalBoxes?: number,
    shedHeight?: number,
    shedWidth?: number,
    totalBirds?: number,
    error?: string,
    usableLength?: number,
    cm?: number,
    ess?: number
  } | null>(null);

  const calculateCapacity = () => {
    setCalcResult(null);

    const length = Number(shedLength);
    const rows = Number(numRows);
    const tiers = Number(numTiers);

    if (!length || length < 100 || length > 450) {
      setCalcResult({ error: 'Shed length must be between 100 and 450 ft.' });
      return;
    }
    if (!rows || rows < 1 || rows > 9) {
      setCalcResult({ error: 'Number of rows must be between 1 and 9.' });
      return;
    }
    if (!tiers || tiers < 2 || tiers > 4) {
      setCalcResult({ error: 'Number of tiers must be between 2 and 4.' });
      return;
    }

    const CM = 7, MU = 6.3, EndKit = 5.7;
    const sectionLength = 6;
    const baseHeight = 1.26, tierHeight = 2.18, houseHeightMargin = 2.46;
    const shedWidth = rows * 8.3;
    const birdsPerBox = 3;

    const usableLength1 = length - (CM + MU + EndKit);
    const sectionsPerRow = Math.floor(usableLength1 / sectionLength) - 1;
    const totalSections = sectionsPerRow * rows;
    const totalBoxes = 8 * tiers * totalSections;
    const totalBirds = totalBoxes * birdsPerBox;
    const shedHeight = (tierHeight * tiers) + baseHeight + houseHeightMargin;
    const usableLength = sectionsPerRow * sectionLength;
    const ESS = usableLength1 - usableLength;

    setCalcResult({
      sectionsPerRow,
      totalSections,
      totalBoxes,
      shedHeight,
      shedWidth,
      totalBirds,
      usableLength,
      cm: CM,
      ess: ESS
    });
  };

  const resetCalc = () => {
    setShedLength('');
    setNumRows('');
    setNumTiers('');
    setCalcResult(null);
  };

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
              {['layer', 'broiler', 'breeder'].includes(slug) && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    document.getElementById('calculator-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-16 px-8 rounded-full bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-bold text-lg hover:scale-105 transition-all w-full sm:w-auto"
                >
                  <Calculator className="w-5 h-5 mr-2" /> Open Calculator
                </Button>
              )}
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

      {/* DEDICATED CALCULATOR SECTION */}
      {['layer', 'broiler', 'breeder'].includes(slug) && (
        <section id="calculator-form" className="relative z-20 bg-[#0a0a0a] text-white py-32 px-6 border-t border-white/10 rounded-t-[4rem] -mb-10">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-8 sticky top-32">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-['Space_Grotesk'] font-black leading-[0.9] tracking-tighter text-white">
                INTELLIGENT <br/><span className="text-primary">CAPACITY CALCULATOR.</span>
              </h2>
              <p className="text-xl font-medium text-white/60 leading-relaxed">
                Determine the exact structural and equipment requirements for your {product.name} facility based on your specific dimensions.
              </p>
            </div>
            
            <div className="lg:col-span-7 bg-white/5 p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/10 glass-panel-dark">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Shed Length (Feet)</label>
                    <input type="number" className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium text-lg" placeholder="e.g. 300" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Shed Width (Feet)</label>
                    <input type="number" className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium text-lg" placeholder="e.g. 40" />
                  </div>
                </div>
                
                {slug === 'layer' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Cage Tiers (Height)</label>
                      <select className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium text-lg appearance-none cursor-pointer">
                        <option>3 Tiers</option>
                        <option>4 Tiers</option>
                        <option>5 Tiers</option>
                        <option>6 Tiers</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Rows per Shed</label>
                      <select className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium text-lg appearance-none cursor-pointer">
                        <option>3 Rows</option>
                        <option>4 Rows</option>
                        <option>5 Rows</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <Button className="w-full h-16 rounded-full bg-white text-dark hover:bg-slate-200 font-black text-xl transition-all shadow-lg">
                    Calculate Total Capacity
                  </Button>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10">
                  <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Projected Output</p>
                  <div className="bg-dark/50 rounded-2xl p-8 border border-white/5 flex items-center justify-between">
                    <span className="text-white/70 font-medium text-lg">Total Bird Capacity</span>
                    <span className="text-4xl font-['Space_Grotesk'] font-black text-primary">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DEDICATED QUOTE SECTION */}
      <section id="quote-form" className="relative z-30 bg-primary text-white py-32 px-6 rounded-t-[4rem] shadow-[0_-20px_50px_rgba(248,49,54,0.3)]">
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








