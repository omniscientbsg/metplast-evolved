"use client"

import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  label: string;
}

interface StickyPageNavProps {
  sections: Section[];
}

export function StickyPageNav({ sections }: StickyPageNavProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // offset for nav

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const top = section.offsetTop - 120; // adjust for sticky headers
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="sticky top-20 z-40 w-full px-4 md:px-6 py-4 pointer-events-none">
      <div className="max-w-[1200px] mx-auto flex justify-start md:justify-center overflow-x-auto no-scrollbar">
        <div className="glass-panel rounded-full p-2 flex items-center gap-2 pointer-events-auto min-w-max">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-[var(--accent)] text-white shadow-lg scale-105'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
