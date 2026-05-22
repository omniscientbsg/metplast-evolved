"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = isScrolled 
    ? 'bg-dark/80 backdrop-blur-2xl border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
    : 'bg-transparent py-6';

  const links = [
    { name: 'Platform', href: '/' },
    { name: 'Architecture', href: '/products' },
    { name: 'Intelligence', href: '/about' },
    { name: 'Ecosystem', href: '/gallery' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${navClass}`}>
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="relative flex items-center h-12 w-48 group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Image 
            src="/images/Metplast-Website-Themes-1980-x-400-px.png" 
            alt="Metplast Logo" 
            fill 
            className="object-contain brightness-0 invert relative z-10" 
            priority
          />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10 bg-white/5 border border-white/10 px-8 py-3 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(34,88,120,0.1)]">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-sm font-semibold tracking-wide transition-colors relative ${pathname === link.href ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_#f83136]" />
              )}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/contact" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
            Contact Sales
          </Link>
          <Button className="bg-primary text-white hover:bg-primary/90 h-11 px-6 rounded-full font-bold text-sm tracking-wide btn-glow transition-all border border-red-500/50">
            Initiate Deployment <ArrowUpRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="text-white w-5 h-5" /> : <Menu className="text-white w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-3xl border-b border-white/10"
          >
            <div className="p-6 flex flex-col gap-6">
              {links.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-['Space_Grotesk'] font-bold tracking-tight ${pathname === link.href ? 'text-primary' : 'text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              <Button className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg border border-red-500/50 btn-glow">
                Initiate Deployment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}