import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatPostDate } from '@/lib/content/blog-view';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findFirst({ where: { slug, published: true }, select: { title: true, excerpt: true } });
  if (!post) return { title: 'Post not found | Metplast Industries' };
  return {
    title: `${post.title} | Metplast Industries`,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blog.findFirst({
    where: { slug, published: true },
    include: { category: { select: { name: true } } },
  });
  if (!post) notFound();

  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-navy w-[700px] h-[700px] top-[-10%] right-[-10%]" />
      </div>

      <article className="px-6 max-w-3xl mx-auto relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold mb-8" style={{ color: 'var(--accent)' }}>
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>

        <div className="space-y-4 mb-8">
          {post.category?.name && (
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white inline-block" style={{ background: 'var(--accent)' }}>
              {post.category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-['Space_Grotesk'] font-black tracking-tight leading-tight" style={{ color: 'var(--text)' }}>
            {post.title}
          </h1>
          <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {formatPostDate(post.createdAt)}{post.author && ` · ${post.author}`}
          </div>
        </div>

        {post.image && (
          <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden mb-10 border" style={{ borderColor: 'var(--border)' }}>
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-16 rounded-[2rem] p-8 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-2xl font-['Space_Grotesk'] font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            Planning a poultry project?
          </h2>
          <p className="font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
            Talk to our team about housing, cage systems, silos, and ventilation.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 h-12 px-8 rounded-full font-bold text-white transition-all hover:opacity-90" style={{ background: 'var(--accent)' }}>
            Enquire Now
          </Link>
        </div>
      </article>
    </main>
  );
}
