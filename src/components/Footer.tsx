"use client"

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { useSiteSettings } from '@/lib/settings/site-settings-context';
import { telHref } from '@/lib/settings/site-settings';
import { parseFooterLinks } from '@/lib/settings/footer-links';

export function Footer() {
  const s = useSiteSettings();
  const solutionLinks = parseFooterLinks(s.footerLinks);
  // lucide (this version) ships no brand icons — render social links as text pills.
  const socials = [
    { url: s.socialFacebook, name: 'Facebook' },
    { url: s.socialInstagram, name: 'Instagram' },
    { url: s.socialLinkedin, name: 'LinkedIn' },
    { url: s.socialYoutube, name: 'YouTube' },
  ].filter((x) => x.url);
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
                src={s.logoDark}
                alt="Metplast Industries"
                fill
                className="object-contain footer-logo-dark"
              />
              <Image
                src={s.logoLight}
                alt="Metplast Industries"
                fill
                className="object-contain footer-logo-light origin-left scale-[0.7]"
              />
            </div>
            <p
              className="text-lg font-medium leading-relaxed mb-8 max-w-md"
              style={{ color: 'var(--text-muted)' }}
            >
              {s.footerBlurb}
              <br /><br />
              <em style={{ color: 'var(--text)' }}>{s.tagline}</em>
            </p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socials.map(({ url, name }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-sm font-bold transition-colors hover:text-[var(--accent)]"
                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
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
                <li key={link.label}>
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
                    {link.label}
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
                    {s.address.split('\n').map((ln, i, a) => (
                      <span key={i}>{ln}{i < a.length - 1 && <br />}</span>
                    ))}
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
                    href={telHref(s.phonePrimary)}
                    className="font-bold text-lg tracking-wide transition-colors block"
                    style={{ color: 'var(--text)' }}
                  >
                    {s.phonePrimary}
                  </a>
                  {s.phoneSecondary && (
                    <a
                      href={telHref(s.phoneSecondary)}
                      className="font-medium transition-colors block"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {s.phoneSecondary}
                    </a>
                  )}
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
                    href={`mailto:${s.emailPrimary}`}
                    className="font-bold tracking-wide hover:underline transition-colors block"
                    style={{ color: 'var(--text)' }}
                  >
                    {s.emailPrimary}
                  </a>
                  {s.emailSecondary && (
                    <a
                      href={`mailto:${s.emailSecondary}`}
                      className="font-medium hover:underline transition-colors block"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {s.emailSecondary}
                    </a>
                  )}
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
