import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { isKnownPage, rowToPageContent, pageContentToRow, type PageContentView } from '@/lib/content/page-content';

async function authed() {
  return Boolean(await getServerSession(authOptions));
}

export async function GET(_req: Request, ctx: { params: Promise<{ page: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { page } = await ctx.params;
  if (!isKnownPage(page)) return NextResponse.json({ error: 'Unknown page' }, { status: 404 });
  const row = await prisma.pageContent.findUnique({ where: { page } });
  return NextResponse.json(row ? rowToPageContent(row) : null);
}

export async function PUT(req: Request, ctx: { params: Promise<{ page: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 });
  const { page } = await ctx.params;
  if (!isKnownPage(page)) return NextResponse.json({ error: 'Unknown page' }, { status: 404 });

  const v = (await req.json()) as PageContentView;
  if (!v || typeof v.title !== 'string' || !v.title.trim() || typeof v.subtitle !== 'string') {
    return NextResponse.json({ error: 'title and subtitle are required' }, { status: 400 });
  }
  const w = pageContentToRow(page, v);
  const data = {
    heroEyebrow: w.heroEyebrow,
    heroTitle: w.heroTitle,
    heroTitleAccent: w.heroTitleAccent,
    heroSubtitle: w.heroSubtitle,
    heroImage: w.heroImage,
    heroCtaPrimary: (w.heroCtaPrimary ?? Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
    heroCtaSecondary: (w.heroCtaSecondary ?? Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
    intro: w.intro as unknown as Prisma.InputJsonValue,
    crossLinks: w.crossLinks as unknown as Prisma.InputJsonValue,
  };
  try {
    const saved = await prisma.pageContent.upsert({
      where: { page },
      create: { page, ...data },
      update: data,
    });
    return NextResponse.json(rowToPageContent(saved));
  } catch (e) {
    console.error('save page content failed:', e);
    return NextResponse.json({ error: 'Could not save page content' }, { status: 500 });
  }
}
