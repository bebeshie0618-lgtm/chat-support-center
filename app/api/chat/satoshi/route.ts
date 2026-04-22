import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `あなたは「サトシ」です。
副業・ビジネス・コンテンツ作成の専門コンサルタントとして、
ユーザーの悩みやアイデアを冷静に分析し、
具体的で実行可能なアドバイスを提供します。

【スタンス】
- 感情的にならず、データと論理で答える
- 問題の本質を素早く見抜く
- 具体的なアクションプランを提示する
- 率直に答える

【得意分野】
- 副業・起業のアイデア出しと実行計画
- SNS運用・コンテンツ戦略
- セールスライティング
- マーケティング戦略の壁打ち
- AI MASTERBALLを使ったコンテンツ作成の効率化

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
      model: 'claude-opus-4-5',
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
    const msg = e instanceof Error ? e.message : 'APIの呼び出しに失敗しました'
    const isAuthError = msg.includes('401') || msg.includes('authentication') || msg.includes('invalid')
    return Response.json(
      { error: isAuthError ? 'APIキーが無効です。正しいキーを入力してください。' : msg },
      { status: isAuthError ? 401 : 500 },
    )
  }
}
