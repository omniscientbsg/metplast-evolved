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

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const items = await prisma.productSection.findMany({
    orderBy: [{ page: 'asc' }, { sortOrder: 'asc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const body = (await req.json()) as SectionPayload;
  if (!body.page || !body.slug || !body.title) {
    return NextResponse.json({ error: 'page, slug and title are required' }, { status: 400 });
  }
  try {
    // New sections append to the end of their page so they never tie with an
    // existing sortOrder (ties would leave the up/down reorder unable to move them).
    const maxAgg = await prisma.productSection.aggregate({
      where: { page: body.page },
      _max: { sortOrder: true },
    });
    const data = normalizeSectionPayload(body);
    data.sortOrder = (maxAgg._max.sortOrder ?? -1) + 1;
    const created = await prisma.productSection.create({
      data: data as unknown as Prisma.ProductSectionCreateInput,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'slug already exists' }, { status: 409 });
    }
    console.error('create section failed:', e);
    return NextResponse.json({ error: 'Could not create section' }, { status: 500 });
  }
}
