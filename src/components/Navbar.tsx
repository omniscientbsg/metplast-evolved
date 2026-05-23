"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowUpRight, ChevronDown, Download, FileText } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = isScrolled 
    ? 'bg-dark/80 backdrop-blur-2xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
    : 'bg-transparent py-8';

  const links = [
    { name: 'Home', href: '/' },
    { 
      name: 'Turnkey Solutions', 
      href: '#',
      dropdown: [
        { name: 'Breeder', href: '/products/breeder' },
        { name: 'Broiler', href: '/products/broiler' },
        { name: 'Layer', href: '/products/layer' },
      ]
    },
    { 
      name: 'Products', 
      href: '/products',
      dropdown: [
        { name: 'Drinking System', href: '/products/drinking-system' },
        { name: 'Feeding System', href: '/products/feeding-system' },
        { name: 'Ventilation System', href: '/products/ventilation-system' },
      ]
    },
    { name: 'About Us', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${navClass}`}>
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          
          {/* Brand */}
          <Link href="/" className="relative flex items-center h-20 w-72 group shrink-0">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image 
              src="/images/Logo Metplast.png" 
              alt="Metplast Logo" 
              fill 
              className="object-contain relative z-10" 
              priority
            />
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10 bg-white/5 border border-white/10 px-6 xl:px-8 py-3 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(34,88,120,0.1)]">
            {links.map(link => (
              <div 
                key={link.name} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={link.href} 
                  className={`text-sm font-semibold tracking-wide transition-colors relative flex items-center gap-1 ${pathname === link.href || (link.href !== '#' && pathname.startsWith(link.href) && link.href !== '/') ? 'text-white' : 'text-white/60 hover:text-white'}`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
                  {(pathname === link.href || (link.href !== '#' && pathname.startsWith(link.href) && link.href !== '/')) && (
                    <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_#f83136]" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-56"
                      >
                        <div className="bg-dark/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
                          {link.dropdown.map(drop => (
                            <Link 
                              key={drop.name} 
                              href={drop.href}
                              className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                              {drop.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsBrochureOpen(true)}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 h-11 px-6 rounded-full font-bold text-sm tracking-wide transition-all"
            >
              <Download className="mr-2 w-4 h-4" /> Brochure
            </Button>
            <Button 
              onClick={() => setIsQuoteOpen(true)}
              className="bg-primary text-white hover:bg-primary/90 h-11 px-6 rounded-full font-bold text-sm tracking-wide btn-glow transition-all border border-red-500/50"
            >
              Get a Quote <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="text-white w-5 h-5" /> : <Menu className="text-white w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-3xl border-b border-white/10 h-screen overflow-y-auto pb-32"
            >
              <div className="p-6 flex flex-col gap-6">
                {links.map(link => (
                  <div key={link.name}>
                    <Link 
                      href={link.href} 
                      onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                      className={`text-2xl font-['Space_Grotesk'] font-bold tracking-tight block ${pathname === link.href ? 'text-primary' : 'text-white'}`}
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <div className="pl-4 mt-4 space-y-4 border-l-2 border-white/10">
                        {link.dropdown.map(drop => (
                          <Link 
                            key={drop.name} 
                            href={drop.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-lg font-medium text-white/60 hover:text-white"
                          >
                            {drop.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <hr className="border-white/10 my-4" />
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBrochureOpen(true);
                  }}
                  variant="outline" 
                  className="w-full h-14 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold text-lg"
                >
                  <Download className="mr-2 w-5 h-5" /> Download Brochure
                </Button>
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsQuoteOpen(true);
                  }}
                  className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg border border-red-500/50 btn-glow mt-4"
                >
                  Get a Quote
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Brochure Modal */}
      <AnimatePresence>
        {isBrochureOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsBrochureOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-dark border border-white/10 rounded-[2rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsBrochureOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8" />
              </div>
              
              <h2 className="text-3xl font-['Space_Grotesk'] font-black text-white mb-2 tracking-tight">Download Brochure</h2>
              <p className="text-white/60 mb-8 font-medium leading-relaxed">Enter your email to receive the complete Metplast Product Catalog and Turnkey Solutions guide directly to your inbox.</p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Brochure request transmitted successfully.'); setIsBrochureOpen(false); }}>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email address" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" 
                />
                <Button className="w-full h-14 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold text-lg btn-glow">
                  Request Download Link
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote Modal */}
      <AnimatePresence>
        {isQuoteOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsQuoteOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-dark border border-white/10 rounded-[2rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsQuoteOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8" />
              </div>
              
              <h2 className="text-3xl font-['Space_Grotesk'] font-black text-white mb-2 tracking-tight">Request Quotation</h2>
              <p className="text-white/60 mb-8 font-medium leading-relaxed">Fill out the form below to receive a custom quotation from our engineering team.</p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Quotation request transmitted successfully.'); setIsQuoteOpen(false); }}>
                <input 
                  type="text" 
                  required 
                  placeholder="Your Name / Company" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" 
                />
                <input 
                  type="email" 
                  required 
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" 
                />
                <input 
                  type="tel" 
                  required 
                  placeholder="Phone Number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium" 
                />
                <select 
                  defaultValue=""
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="text-dark">Select System Interest</option>
                  <option value="layer" className="text-dark">Layer Pullet Systems</option>
                  <option value="broiler" className="text-dark">Broiler Solutions</option>
                  <option value="breeder" className="text-dark">Breeder Systems</option>
                  <option value="other" className="text-dark">Other Infrastructure</option>
                </select>
                <textarea 
                  placeholder="Additional Details (Optional)" 
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors font-medium resize-none" 
                />
                <Button className="w-full h-14 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold text-lg btn-glow mt-2">
                  Submit Request
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}