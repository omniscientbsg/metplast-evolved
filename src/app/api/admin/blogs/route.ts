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

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const posts = await prisma.blog.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    include: { category: { select: { name: true } } },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const b = (await req.json()) as BlogBody;
  if (!b.title || !b.title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  const slug = (b.slug?.trim() || slugify(b.title)) || slugify(`post-${Date.now()}`);
  try {
    const created = await prisma.blog.create({
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
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const code = e && typeof e === 'object' ? (e as { code?: string }).code : undefined;
    if (code === 'P2002') return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    if (code === 'P2003') return NextResponse.json({ error: 'Selected category no longer exists' }, { status: 400 });
    console.error('create blog failed:', e);
    return NextResponse.json({ error: 'Could not create post' }, { status: 500 });
  }
}
