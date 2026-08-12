import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { validateBoxSizeInput } from '@/lib/planner/master-data'

async function authed() {
  return Boolean(await getServerSession(authOptions))
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 })
  const { id } = await params

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const v = validateBoxSizeInput(body)
  if (!v.ok) return NextResponse.json({ error: v.error, impliedMaleFrontIn: v.impliedMaleFrontIn }, { status: 400 })

  try {
    const updated = await prisma.plannerBoxSize.update({
      where: { id },
      data: { ...v.row, valid: true, active: typeof body.active === 'boolean' ? body.active : undefined },
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    const code = e && typeof e === 'object' ? (e as { code?: string }).code : undefined
    if (code === 'P2025') return NextResponse.json({ error: 'Box size not found' }, { status: 404 })
    if (code === 'P2002') return NextResponse.json({ error: 'A box size with this number already exists for this product.' }, { status: 409 })
    console.error('update planner box size failed:', e)
    return NextResponse.json({ error: 'Could not update box size' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authed())) return new Response('Unauthorized', { status: 401 })
  const { id } = await params
  try {
    await prisma.plannerBoxSize.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if (e && typeof e === 'object' && (e as { code?: string }).code === 'P2025')
      return NextResponse.json({ error: 'Box size not found' }, { status: 404 })
    console.error('delete planner box size failed:', e)
    return NextResponse.json({ error: 'Could not delete box size' }, { status: 500 })
  }
}
