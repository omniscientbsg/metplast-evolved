"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-dark pt-32 pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-blue w-[800px] h-[800px] top-[-20%] left-[-10%]" />
        <div className="glow-orb glow-red w-[600px] h-[600px] bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero */}
      <section className="px-6 mb-20 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Secure Comms</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[100px] break-words hyphens-auto font-['Space_Grotesk'] font-black text-white tracking-tighter max-w-4xl mx-auto leading-[0.9]"
          >
            INITIATE <br/>
            <span className="text-gradient-blue">DEPLOYMENT.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Have questions or need expert poultry solutions? We're here to help. Let’s architect your facility for maximum efficiency.
          </motion.p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-12 gap-16 relative z-10">
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 glass-panel-dark p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/10"
        >
          <h2 className="text-4xl font-['Space_Grotesk'] font-black text-white mb-8 tracking-tighter">TRANSMIT DATA.</h2>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">First Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors font-medium" placeholder="John" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Last Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors font-medium" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors font-medium" placeholder="john@enterprise.com" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Phone Number</label>
              <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors font-medium" placeholder="+91..." />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Specifications</label>
              <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors font-medium resize-none" placeholder="Detail your facility requirements..."></textarea>
            </div>
            <Button className="w-full h-16 text-lg rounded-full font-black bg-primary text-white hover:bg-primary/90 transition-all btn-glow shadow-[0_10px_30px_rgba(248,49,54,0.3)]">
              Transmit <ArrowUpRight className="ml-2 w-6 h-6" />
            </Button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-10 lg:pt-10">
          <div>
            <h3 className="text-3xl font-['Space_Grotesk'] font-black text-white mb-10 tracking-tighter">TELEMETRY DATA.</h3>
            <div className="space-y-8">
              <div className="flex gap-6 group glass-panel-dark p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <MapPin className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Coordinates</h4>
                  <p className="text-white font-medium leading-relaxed">Plot No. 207, Atkargaon, Khalapur, Dist Raigad, Maharashtra-410203, India</p>
                </div>
              </div>

              <div className="flex gap-6 group glass-panel-dark p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <Phone className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Voice Comms</h4>
                  <div className="space-y-1">
                    <p className="text-white font-bold text-xl">+91 89284 05002</p>
                    <p className="text-white/70 font-medium">+91 89284 05005</p>
                    <p className="text-white/70 font-medium">+91 84520 55536</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 group glass-panel-dark p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <Mail className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Digital Comms</h4>
                  <div className="space-y-1">
                    <p className="text-white font-bold text-xl">sales@metplast.com</p>
                    <p className="text-white/70 font-medium">info@metplast.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-[2.5rem] p-10 text-white mt-12 shadow-[0_20px_50px_rgba(248,49,54,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl rounded-full" />
            <h3 className="text-3xl font-['Space_Grotesk'] font-black mb-4 tracking-tighter leading-none">FROM BLUEPRINT TO INSTALLATION.</h3>
            <p className="text-white/90 font-medium text-lg">Our expert team is ready to design and deploy the perfect solution for your facility.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
