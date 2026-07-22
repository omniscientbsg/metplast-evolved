import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

interface ItemBody {
  src?: string;
  caption?: string;
  categoryId?: string | null;
  videoUrl?: string | null;
  featured?: boolean;
  visible?: boolean;
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const b = (await req.json()) as ItemBody;
  if (!b.src) return NextResponse.json({ error: 'src (image) is required' }, { status: 400 });
  try {
    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        src: b.src,
        caption: b.caption ?? '',
        categoryId: b.categoryId || null,
        videoUrl: b.videoUrl || null,
        featured: b.featured ?? false,
        visible: b.visible ?? true,
      },
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('update gallery item failed:', e);
    return NextResponse.json({ error: 'Could not update item' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  try {
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('delete gallery item failed:', e);
    return NextResponse.json({ error: 'Could not delete item' }, { status: 500 });
  }
}
