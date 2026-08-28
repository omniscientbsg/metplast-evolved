import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import prisma from '@/lib/prisma'
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rate-limit'

// Abuse limits. This endpoint calls a paid LLM using the owner's API key,
// so uncapped access is a cost-DoS risk.
const CHAT_RATE_LIMIT = 15        // requests
const CHAT_RATE_WINDOW = 60_000   // per 60s per IP
const MAX_MESSAGES = 40           // conversation turns per request
const MAX_TOTAL_CHARS = 12_000    // total prompt size per request

export async function POST(req: Request) {
  // 1) Rate limit per IP.
  const ip = getClientIp(req)
  const rl = rateLimit(`chat:${ip}`, CHAT_RATE_LIMIT, CHAT_RATE_WINDOW)
  if (!rl.ok) return tooManyRequests(rl.retryAfter)

  // 2) Parse + validate input size.
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const messages = (body as { messages?: unknown })?.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages must be a non-empty array' }), { status: 400 })
  }
  if (messages.length > MAX_MESSAGES) {
    return new Response(JSON.stringify({ error: 'Too many messages in one request' }), { status: 400 })
  }
  const totalChars = messages.reduce((sum: number, m) => {
    const content = (m as { content?: unknown })?.content
    return sum + (typeof content === 'string' ? content.length : JSON.stringify(content ?? '').length)
  }, 0)
  if (totalChars > MAX_TOTAL_CHARS) {
    return new Response(JSON.stringify({ error: 'Message too long' }), { status: 400 })
  }

  // Get active provider and training data
  const providerSetting = await prisma.setting.findUnique({ where: { key: 'chatbot_provider' } })
  const providerName = providerSetting?.value || 'gemini'

  const trainingDataSetting = await prisma.setting.findUnique({ where: { key: 'chatbot_training_data' } })
  const systemPrompt = `You are the official Metplast AI Chatbot. 
Here is your knowledge base about Metplast:
${trainingDataSetting?.value || 'Metplast is a leading manufacturer of poultry equipment.'}

Always be helpful, professional, and concise.`

  let model
  try {
    if (providerName === 'gemini') {
      const keySetting = await prisma.setting.findUnique({ where: { key: 'gemini_api_key' } })
      if (!keySetting?.value) throw new Error("Gemini API key not configured")
      const google = createGoogleGenerativeAI({ apiKey: keySetting.value })
      model = google('gemini-1.5-flash')
    } else if (providerName === 'openai') {
      const keySetting = await prisma.setting.findUnique({ where: { key: 'openai_api_key' } })
      if (!keySetting?.value) throw new Error("OpenAI API key not configured")
      const openai = createOpenAI({ apiKey: keySetting.value })
      model = openai('gpt-4o-mini')
    } else if (providerName === 'anthropic') {
      const keySetting = await prisma.setting.findUnique({ where: { key: 'anthropic_api_key' } })
      if (!keySetting?.value) throw new Error("Anthropic API key not configured")
      const anthropic = createAnthropic({ apiKey: keySetting.value })
      model = anthropic('claude-3-haiku-20240307')
    }
  } catch (error) {
    // Fallback if no API key is configured
    console.warn("AI Provider Error:", error)
    
    // We can simulate a stream for the frontend
    const textEncoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reply = "I'm currently in basic mode since my AI brain hasn't been connected yet. But I can tell you that Metplast provides top-tier poultry equipment! Please leave an enquiry for more details."
        
        // Vercel AI SDK text stream format: 0:"text"\n
        const chunks = reply.split(" ")
        for (const chunk of chunks) {
          controller.enqueue(textEncoder.encode(`0:"${chunk} "\n`))
          await new Promise(r => setTimeout(r, 50))
        }
        controller.close()
      }
    })
    
    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      }
    })
  }

  if (!model) {
    return new Response(JSON.stringify({ error: "Invalid provider" }), { status: 500 })
  }

  const result = await streamText({
    model,
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}
