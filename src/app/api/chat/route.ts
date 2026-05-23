import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const { messages } = await req.json()

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

  return result.toDataStreamResponse()
}
