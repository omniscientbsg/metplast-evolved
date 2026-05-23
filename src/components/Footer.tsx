"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-dark pt-24 pb-12 px-6 border-t border-white/10 relative z-30">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-4 gap-16 lg:gap-8 mb-20 border-b border-white/10 pb-20">
          <div className="lg:col-span-2 pr-12">
            <div className="flex items-center h-16 w-60 relative mb-8">
              <Image 
                src="/images/Logo Metplast.png" 
                alt="Metplast Logo" 
                fill 
                className="object-contain" 
              />
            </div>
            <p className="text-white/50 text-lg font-medium leading-relaxed mb-8 max-w-md">
              We are committed to continuous innovation, developing cutting-edge equipment tailored to the evolving needs of poultry farmers. Think of Poultry, Think of us!
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-white/5 border-white/10 text-white hover:bg-primary hover:border-primary transition-all duration-300">
                <Globe className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest font-['Space_Grotesk']">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-white/50 hover:text-primary transition-colors font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Architecture</Link></li>
              <li><Link href="/about" className="text-white/50 hover:text-primary transition-colors font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Intelligence</Link></li>
              <li><Link href="/gallery" className="text-white/50 hover:text-primary transition-colors font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Ecosystem</Link></li>
              <li><Link href="/contact" className="text-white/50 hover:text-primary transition-colors font-medium flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest font-['Space_Grotesk']">Telemetry</h4>
            <ul className="space-y-6">
              <li className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <MapPin className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-white/50 font-medium leading-relaxed pt-1 group-hover:text-white/80 transition-colors">Plot no. 207, Atkargaon, Dheku Road, Sajgaon Phata, Khalapur, MH 410203, India</span>
              </li>
              <li className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="pt-1">
                  <span className="block text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Comm Line</span>
                  <span className="text-white font-bold text-lg tracking-wide">+91 89284 05002</span>
                </div>
              </li>
              <li className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="pt-3">
                  <a href="mailto:sales@metplast.com" className="text-white font-bold tracking-wide hover:text-primary transition-colors">sales@metplast.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 font-medium text-sm">
          <p className="tracking-wide">© 2026 METPLAST INDUSTRIES. ALL SYSTEMS SECURE.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Protocol</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Engagement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
