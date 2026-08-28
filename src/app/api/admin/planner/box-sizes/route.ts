import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { validateBoxSizeInput } from '@/lib/planner/master-data'

async function authed() {
  return Boolean(await getServerSession(authOptions))
}

export async function GET() {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 })
  const boxes = await prisma.plannerBoxSize.findMany({ orderBy: [{ product: 'asc' }, { boxSize: 'asc' }] })
  return NextResponse.json(boxes)
}

export async function POST(req: Request) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  // Golden Rule gate — the form must not save a mismatch (Section 6.2).
  const v = validateBoxSizeInput(body)
  if (!v.ok) return NextResponse.json({ error: v.error, impliedMaleFrontIn: v.impliedMaleFrontIn }, { status: 400 })

  try {
    const created = await prisma.plannerBoxSize.create({
      data: { ...v.row, valid: true, active: true },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'A box size with this number already exists for this product.' }, { status: 409 })
    }
    console.error('create planner box size failed:', e)
    return NextResponse.json({ error: 'Could not create box size' }, { status: 500 })
  }
}
