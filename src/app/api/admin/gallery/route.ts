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

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const items = await prisma.galleryItem.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { category: { select: { name: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const b = (await req.json()) as ItemBody;
  if (!b.src) return NextResponse.json({ error: 'src (image) is required' }, { status: 400 });
  try {
    const max = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } });
    const created = await prisma.galleryItem.create({
      data: {
        src: b.src,
        caption: b.caption ?? '',
        categoryId: b.categoryId || null,
        videoUrl: b.videoUrl || null,
        featured: b.featured ?? false,
        visible: b.visible ?? true,
        sortOrder: (max._max.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    // P2003 = FK constraint (the chosen category was deleted between load and submit).
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2003') {
      return NextResponse.json({ error: 'Selected category no longer exists' }, { status: 400 });
    }
    console.error('create gallery item failed:', e);
    return NextResponse.json({ error: 'Could not create item' }, { status: 500 });
  }
}
