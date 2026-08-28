import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const { name } = (await req.json()) as { name?: string };
  if (!name || !name.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  try {
    const updated = await prisma.galleryCategory.update({ where: { id }, data: { name: name.trim() } });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const code = e && typeof e === 'object' ? (e as { code?: string }).code : undefined;
    if (code === 'P2002') return NextResponse.json({ error: 'category already exists' }, { status: 409 });
    if (code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    console.error('rename category failed:', e);
    return NextResponse.json({ error: 'Could not rename category' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  try {
    // onDelete: SetNull leaves items intact (categoryId -> null).
    await prisma.galleryCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('delete category failed:', e);
    return NextResponse.json({ error: 'Could not delete category' }, { status: 500 });
  }
}
