'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

type Props = {
  apiKey: string
  endpoint: string
  placeholder?: string
}

export function ChatUI({ apiKey, endpoint, placeholder }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!isStreaming) inputRef.current?.focus()
  }, [isStreaming])

  async function handleSend() {
    const text = input.trim()
    if (!text || isStreaming) return

    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, apiKey }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'エラーが発生しました' }))
        setMessages(prev => [...prev, { role: 'assistant', content: `エラー: ${err.error}` }])
        setIsStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'ストリームの読み取りに失敗しました' }])
        setIsStreaming(false)
        return
      }

      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: assistantText }
          return copy
        })
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '通信エラーが発生しました。もう一度お試しください。' }])
    } finally {
      setIsStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleReset() {
    setMessages([])
    setInput('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* メッセージ一覧 */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 20px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#555', fontSize: 14, textAlign: 'center', marginTop: 40 }}>
            {placeholder || 'メッセージを入力してください'}
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className="animate-chat-message-in"
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <div style={{
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              backgroundColor: msg.role === 'user' ? '#C8A84B' : '#1e1e1e',
              color: msg.role === 'user' ? '#0a0a0a' : '#f0f0f0',
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.content || (isStreaming && i === messages.length - 1 ? '...' : '')}
            </div>
          </div>
        ))}
      </div>

      {/* 入力エリア */}
      <div style={{
        padding: '12px 20px 20px',
        borderTop: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {messages.length > 0 && (
          <button
            onClick={handleReset}
            style={{
              alignSelf: 'flex-end',
              fontSize: 11,
              color: '#666',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 8px',
            }}
          >
            会話をリセット
          </button>
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            disabled={isStreaming}
            rows={1}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #333',
              backgroundColor: '#141414',
              color: '#f0f0f0',
              fontSize: 14,
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              maxHeight: 100,
              overflow: 'auto',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#C8A84B')}
            onBlur={e => (e.currentTarget.style.borderColor = '#333')}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 100) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              backgroundColor: isStreaming || !input.trim() ? '#333' : '#C8A84B',
              color: isStreaming || !input.trim() ? '#666' : '#0a0a0a',
              fontSize: 14,
              fontWeight: 600,
              cursor: isStreaming || !input.trim() ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {isStreaming ? '...' : '送信'}
          </button>
        </div>
      </div>
    </div>
  )
}
