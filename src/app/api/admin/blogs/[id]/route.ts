import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/content/blog-view';
import { sanitizePostHtml } from '@/lib/content/sanitize-post';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

interface BlogBody {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  image?: string | null;
  author?: string | null;
  categoryId?: string | null;
  featured?: boolean;
  published?: boolean;
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const b = (await req.json()) as BlogBody;
  if (!b.title || !b.title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  const slug = (b.slug?.trim() || slugify(b.title));
  try {
    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title: b.title.trim(),
        slug,
        content: sanitizePostHtml(b.content ?? ''),
        excerpt: b.excerpt?.trim() || null,
        image: b.image || null,
        author: b.author?.trim() || null,
        categoryId: b.categoryId || null,
        featured: b.featured ?? false,
        published: b.published ?? false,
      },
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const code = e && typeof e === 'object' ? (e as { code?: string }).code : undefined;
    if (code === 'P2002') return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    if (code === 'P2003') return NextResponse.json({ error: 'Selected category no longer exists' }, { status: 400 });
    if (code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    console.error('update blog failed:', e);
    return NextResponse.json({ error: 'Could not update post' }, { status: 500 });
  }
}

// Lightweight publish/unpublish toggle used by the admin list row.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const { published } = (await req.json()) as { published?: boolean };
  if (typeof published !== 'boolean') {
    return NextResponse.json({ error: 'published (boolean) is required' }, { status: 400 });
  }
  try {
    const updated = await prisma.blog.update({ where: { id }, data: { published } });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('toggle publish failed:', e);
    return NextResponse.json({ error: 'Could not update post' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  try {
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('delete blog failed:', e);
    return NextResponse.json({ error: 'Could not delete post' }, { status: 500 });
  }
}
