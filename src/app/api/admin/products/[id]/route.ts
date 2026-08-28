import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { normalizeSectionPayload, type SectionPayload } from '@/lib/content/section-payload';

async function authed() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  const body = (await req.json()) as SectionPayload;
  if (!body.page || !body.slug || !body.title) {
    return NextResponse.json({ error: 'page, slug and title are required' }, { status: 400 });
  }
  try {
    const updated = await prisma.productSection.update({
      where: { id },
      data: normalizeSectionPayload(body) as unknown as Prisma.ProductSectionUpdateInput,
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'slug already exists' }, { status: 409 });
    }
    console.error('update section failed:', e);
    return NextResponse.json({ error: 'Could not update section' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { id } = await ctx.params;
  try {
    await prisma.productSection.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('delete section failed:', e);
    return NextResponse.json({ error: 'Could not delete section' }, { status: 500 });
  }
}
