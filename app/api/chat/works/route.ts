import Anthropic from '@anthropic-ai/sdk'
import { AI_MODEL, getAiErrorMessage } from '@/lib/ai-config'

const SYSTEM_PROMPT = `あなたはAI MASTERBALLの作品例案内botです。
ユーザーが作りたい画像や文章の内容を聞いて、
AI MASTERBALLでどう指示すれば良いかを具体的な例文で教えてください。
回答は日本語で。`

export async function POST(request: Request) {
  const { messages, apiKey } = await request.json()

  if (!apiKey) {
    return Response.json({ error: 'APIキーが必要です' }, { status: 400 })
  }
  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: 'messages is required' }, { status: 400 })
  }

  try {
    const client = new Anthropic({ apiKey })
    const stream = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (e) {
    const { message, status } = getAiErrorMessage(e)
    return Response.json({ error: message }, { status })
  }
}
