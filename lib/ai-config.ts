export const AI_MODELS = {
  claude: { default: 'claude-sonnet-4-5', fast: 'claude-haiku-4-5' },
} as const

export const AI_MODEL = AI_MODELS.claude.default

export function getAiErrorMessage(error: unknown): { message: string; status: number } {
  const msg = error instanceof Error ? error.message : String(error)

  if (msg.includes('404') || msg.includes('model_not_found')) {
    return { message: '使用中のAIモデルが更新されました。しばらくお待ちください。', status: 404 }
  }
  if (msg.includes('401') || msg.includes('authentication') || msg.includes('invalid x-api-key') || msg.includes('Unauthorized')) {
    return { message: 'APIキーが無効です。正しいキーを入力してください。', status: 401 }
  }
  if (msg.includes('429') || msg.includes('rate_limit')) {
    return { message: 'APIの利用制限に達しました。しばらくしてから再試行してください。', status: 429 }
  }

  return { message: 'AIサーバーで一時的なエラーが発生しました。しばらくしてから再試行してください。', status: 500 }
}
