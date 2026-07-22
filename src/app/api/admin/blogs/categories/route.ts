import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/content/blog-view';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const cats = await prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { name } = (await req.json()) as { name?: string };
  if (!name || !name.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  try {
    const max = await prisma.blogCategory.aggregate({ _max: { sortOrder: true } });
    const created = await prisma.blogCategory.create({
      data: { name: name.trim(), slug: slugify(name), sortOrder: (max._max.sortOrder ?? -1) + 1 },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'category already exists' }, { status: 409 });
    }
    console.error('create blog category failed:', e);
    return NextResponse.json({ error: 'Could not create category' }, { status: 500 });
  }
}
