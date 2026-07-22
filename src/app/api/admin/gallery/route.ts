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
}
