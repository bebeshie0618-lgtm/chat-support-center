import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `あなたはAI MASTERBALLの専任サポートスタッフです。
購入してくれたユーザーがAI MASTERBALLを使いこなせるよう、
すべての疑問に丁寧に答えてください。

【AI MASTERBALLとは】
画像生成・文章生成ができるAIツールです。
自分のAPIキーを登録して使います。
URL: https://ai-masterball.vercel.app

【できること】
- 画像生成：SNS投稿・ポスター・バナー・サムネイル
- 文章生成：セールスレター・ステップメール・X投稿・Threads・note・LP

【APIキー登録方法】
設定画面（右上のアイコン→設定）から登録できます。
・文章生成にはAnthropicのAPIキーが必要
・画像生成にはOpenAIまたはGeminiのAPIキーが必要

【画像生成のコツ】
用途・世界観・人物・追加要望を具体的に入力するほど良い画像が出ます。

【文章生成のコツ】
ターゲット・商品・訴求ポイントを明確に入力してください。

回答は日本語で、フレンドリーかつ丁寧に。`

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
