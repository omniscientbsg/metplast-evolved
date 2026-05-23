import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 401 })

  const settings = await prisma.setting.findMany()
  const data = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  return Response.json(data)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 401 })

  const data = await req.json()

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    }
  }

  return Response.json({ success: true })
}
