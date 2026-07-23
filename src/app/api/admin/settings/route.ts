import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { SETTING_KEY_SET } from "@/lib/settings/site-settings"

async function authed() {
  return Boolean(await getServerSession(authOptions))
}

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

export async function PUT(req: Request) {
  if (!(await authed())) return new Response("Unauthorized", { status: 401 })
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  // Only registry keys are writable — this can never clobber chatbot_* or other settings.
  const entries = Object.entries(body).filter(
    ([key, value]) => SETTING_KEY_SET.has(key) && typeof value === "string",
  ) as [string, string][]

  try {
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } }),
      ),
    )
    return NextResponse.json({ ok: true, saved: entries.length })
  } catch (e) {
    console.error("save settings failed:", e)
    return NextResponse.json({ error: "Could not save settings" }, { status: 500 })
  }
}
