"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { BlogCard } from '@/lib/content/blog-view';

export function BlogClient({ posts, categories }: { posts: BlogCard[]; categories: string[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const usableCategories = categories.filter((name) => posts.some((p) => p.category === name));
  const FILTERS = ['All', ...usableCategories];
  const filtered = activeFilter === 'All' ? posts : posts.filter((p) => p.category === activeFilter);

  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-navy w-[800px] h-[800px] top-[-10%] right-[-10%]" />
      </div>

      <section className="px-6 mb-16 relative z-10 pt-20">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-[var(--glass-bg)] backdrop-blur-xl"
            style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Blog &amp; News</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-['Space_Grotesk'] font-black tracking-tighter max-w-4xl mx-auto leading-[0.9]"
            style={{ color: 'var(--text)' }}>
            INSIGHTS &amp; <span className="text-gradient">UPDATES</span>
          </motion.h1>
        </div>
      </section>

      {posts.length === 0 ? (
        <p className="text-center py-20 font-medium relative z-10" style={{ color: 'var(--text-muted)' }}>
          No posts yet. Check back soon.
        </p>
      ) : (
        <>
          {FILTERS.length > 1 && (
            <section className="px-6 mb-12 relative z-10">
              <div className="max-w-[1600px] mx-auto overflow-x-auto no-scrollbar">
                <div className="flex gap-3 pb-2 min-w-max">
                  {FILTERS.map((filter) => (
                    <button key={filter} onClick={() => setActiveFilter(filter)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                        activeFilter === filter ? 'text-white border-transparent shadow-lg'
                          : 'border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                      style={activeFilter === filter ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}}>
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="px-6 max-w-[1600px] mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className={post.featured ? 'md:col-span-2 lg:col-span-3' : ''}>
                    <Link href={`/blog/${post.slug}`}
                      className="group block h-full rounded-[2rem] overflow-hidden border transition-all hover:-translate-y-1"
                      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <div className={`relative w-full ${post.featured ? 'aspect-[21/9]' : 'aspect-[16/10]'} overflow-hidden`}
                        style={{ background: 'var(--bg-elevated)' }}>
                        {post.image && (
                          <Image src={post.image} alt={post.title} fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        )}
                        {post.category && (
                          <div className="absolute top-5 left-5">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white" style={{ background: 'var(--accent)' }}>
                              {post.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                          {post.date}{post.author && ` · ${post.author}`}
                        </div>
                        <h2 className="text-xl font-bold leading-snug" style={{ color: 'var(--text)' }}>{post.title}</h2>
                        {post.excerpt && <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>}
                        <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--accent)' }}>
                          Read more <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <p className="text-center py-20 font-medium" style={{ color: 'var(--text-muted)' }}>No posts in this category yet.</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
