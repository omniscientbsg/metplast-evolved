"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Settings2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export interface CalculatorInput {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: number;
  type: 'number' | 'select';
  options?: { label: string; value: number }[];
}

export interface CalculatorResult {
  title: string;
  value: string | number;
  highlight?: boolean;
}

export interface CalculatorShellProps {
  title: string;
  description: string;
  inputs: CalculatorInput[];
  systemType?: string; // e.g. "Layer Cage System"
  onCalculate: (values: Record<string, number>) => CalculatorResult[] | { error: string };
  layoutView?: React.ReactNode;
}

export function CalculatorShell({ title, description, inputs, systemType, onCalculate, layoutView }: CalculatorShellProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, number>>(
    inputs.reduce((acc, input) => {
      let defaultVal = input.defaultValue;
      if (input.type === 'select' && !defaultVal && input.options?.length) {
        defaultVal = input.options[0].value;
      }
      return { ...acc, [input.id]: defaultVal || 0 };
    }, {})
  );
  
  const [results, setResults] = useState<CalculatorResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const calculated = onCalculate(values);
    if ('error' in calculated) {
      setError(calculated.error);
      setResults(null);
    } else {
      setResults(calculated);
    }
  };

  const handleEnquiry = () => {
    // Navigate to contact page with pre-filled query parameters
    const params = new URLSearchParams();
    params.set('type', 'calculator_handoff');
    params.set('product', systemType || title);
    if (results) {
      // Find Total Capacity if it exists
      const capacity = results.find(r => r.title.toLowerCase().includes('capacity'));
      if (capacity) {
        params.set('capacity', String(capacity.value));
      }
    }
    router.push(`/contact?${params.toString()}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto pt-32 pb-24 px-6 relative z-10">
      
      {/* Title Area */}
      <div className="text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6"
        >
          <Settings2 className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Engineering Tool
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black font-['Space_Grotesk'] text-[var(--text)] mb-6 tracking-tight"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-[var(--text-muted)] font-medium max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      </div>

      {/* Calculator Body - Blueprint Theme */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', // Forcing dark navy
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249, 115, 22, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="grid lg:grid-cols-12 relative z-10">
          
          {/* Inputs Column */}
          <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/5">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Calculator className="text-[var(--accent)]" /> Shed Parameters
            </h2>
            
            <form onSubmit={handleCalculate} className="space-y-8">
              {inputs.map((input) => (
                <div key={input.id}>
                  <label className="block text-sm font-bold tracking-widest text-[#9AA7BD] uppercase mb-3">
                    {input.label}
                  </label>
                  {input.type === 'number' ? (
                    <input 
                      type="number"
                      value={values[input.id] || ''}
                      onChange={(e) => setValues({ ...values, [input.id]: parseInt(e.target.value) || 0 })}
                      placeholder={input.placeholder}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-medium focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                  ) : (
                    <div className="relative">
                      <select
                        value={values[input.id] || ''}
                        onChange={(e) => setValues({ ...values, [input.id]: parseInt(e.target.value) || 0 })}
                        className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-medium focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                      >
                        {input.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#9AA7BD]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              <Button 
                type="submit"
                className="w-full h-14 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 rounded-xl font-bold text-lg btn-glow transition-all mt-4"
              >
                Calculate Layout & Capacity
              </Button>
            </form>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-7 p-8 md:p-12 bg-black/40 flex flex-col justify-center min-h-[500px]">
            {!results ? (
              <div className="text-center opacity-50">
                <Calculator className="w-20 h-20 text-[#9AA7BD] mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Calculate</h3>
                <p className="text-[#9AA7BD] text-lg">Enter your shed details to see cage rows, capacity, and layout.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm mb-2">Farm Plan Summary</p>
                  <h3 className="text-3xl font-black text-white">{systemType || "Calculation Result"}</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {results.map((result, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${result.highlight ? 'sm:col-span-2 bg-[var(--brand-navy)]/40 border-[var(--brand-navy)]' : ''}`}
                    >
                      <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${result.highlight ? 'text-white/70' : 'text-[#9AA7BD]'}`}>
                        {result.title}
                      </p>
                      <p className={`${result.highlight ? 'text-5xl text-[var(--accent)] font-["Space_Grotesk"]' : 'text-3xl text-white'} font-black`}>
                        {result.value}
                      </p>
                    </div>
                  ))}
                </div>

                {layoutView && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <p className="text-sm font-bold uppercase tracking-wider mb-4 text-[#9AA7BD]">
                      System Layout Diagram
                    </p>
                    {layoutView}
                  </div>
                )}

                <div className="pt-6 border-t border-white/10">
                  <p className="text-[#9AA7BD] mb-4 text-sm font-medium">
                    * This is a preliminary planning estimate. For a final layout and quote, send these requirements to our engineering team.
                  </p>
                  <Button 
                    onClick={handleEnquiry}
                    className="w-full h-16 bg-white text-black hover:bg-gray-200 rounded-xl font-black text-lg transition-all"
                  >
                    Send This Requirement to Metplast <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
