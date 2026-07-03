"use client"

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

const solutionLinks = [
  { name: 'Metplast Housing', href: '/housing' },
  { name: 'Layer Solutions',  href: '/layer' },
  { name: 'Breeder Solutions', href: '/breeder' },
  { name: 'Broiler Solutions', href: '/broiler' },
  { name: 'Environmental Control', href: '/environmental-control' },
  { name: 'Feed Silos',       href: '/feed-silos' },
  { name: 'Calculators',      href: '/calculators' },
  { name: 'Gallery',          href: '/gallery' },
  { name: 'Contact',          href: '/contact' },
];

export function Footer() {
  return (
    <footer
      className="pt-24 pb-12 px-6 border-t relative z-30"
      style={{
        background: 'var(--bg-elevated)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div
          className="grid lg:grid-cols-4 gap-16 lg:gap-8 mb-20 border-b pb-20"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Brand column */}
          <div className="lg:col-span-2 pr-12">
            <div className="flex items-center h-16 w-60 relative mb-8">
              <Image
                src="/images/Logo Metplast.png"
                alt="Metplast Industries"
                fill
                className="object-contain footer-logo-dark"
              />
              <Image
                src="/images/Metplast-Website-Themes-1980-x-400-px.png"
                alt="Metplast Industries"
                fill
                className="object-contain footer-logo-light origin-left scale-[0.7]"
              />
            </div>
            <p
              className="text-lg font-medium leading-relaxed mb-8 max-w-md"
              style={{ color: 'var(--text-muted)' }}
            >
              From levelled land to complete poultry housing systems.
              Metplast designs, manufactures, and installs cage systems,
              feeding, drinking, ventilation, cooling, and feed storage
              for Layer, Breeder, and Broiler farms.
              <br /><br />
              <em style={{ color: 'var(--text)' }}>Think of Poultry, Think of Us.</em>
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h4
              className="font-bold text-lg mb-8 uppercase tracking-widest font-['Space_Grotesk']"
              style={{ color: 'var(--text)' }}
            >
              Solutions
            </h4>
            <ul className="space-y-4">
              {solutionLinks.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-medium flex items-center gap-3 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'var(--accent)' }}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4
              className="font-bold text-lg mb-8 uppercase tracking-widest font-['Space_Grotesk']"
              style={{ color: 'var(--text)' }}
            >
              Contact
            </h4>
            <ul className="space-y-6">
              {/* Address */}
              <li className="flex gap-4 group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <span
                    className="block text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Address
                  </span>
                  <span
                    className="font-medium leading-relaxed pt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Plot No. 207, Atkargaon, Dheku Road,<br />
                    Sajgaon Phata, Khalapur,<br />
                    MH 410203, India
                  </span>
                </div>
              </li>

              {/* Phone */}
              <li className="flex gap-4 group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}
                >
                  <Phone className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="pt-1">
                  <span
                    className="block text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Phone
                  </span>
                  <a
                    href="tel:+918928405002"
                    className="font-bold text-lg tracking-wide transition-colors block"
                    style={{ color: 'var(--text)' }}
                  >
                    +91 89284 05002
                  </a>
                  <a
                    href="tel:+918928405005"
                    className="font-medium transition-colors block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    +91 89284 05005
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex gap-4 group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}
                >
                  <Mail className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="pt-1">
                  <span
                    className="block text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Email
                  </span>
                  <a
                    href="mailto:sales@metplast.com"
                    className="font-bold tracking-wide hover:underline transition-colors block"
                    style={{ color: 'var(--text)' }}
                  >
                    sales@metplast.com
                  </a>
                  <a
                    href="mailto:info@metplast.com"
                    className="font-medium hover:underline transition-colors block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    info@metplast.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4 font-medium text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          <p className="tracking-wide">
            © {new Date().getFullYear()} Metplast Industries. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="hover:underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
