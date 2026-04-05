'use client'

import { useState } from 'react'

type Props = { onSubmit: (key: string) => void }

export function ApiKeyInput({ onSubmit }: Props) {
  const [key, setKey] = useState('')

  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        backgroundColor: '#141414',
        borderRadius: 16,
        border: '1px solid #222',
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <h2 style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#f0f0f0',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          AnthropicのAPIキーを入力してください
        </h2>

        <p style={{
          fontSize: 12,
          color: '#888',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          入力したキーはこのブラウザのみで使用されます。<br />
          外部には一切送信されません。
        </p>

        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #333',
            backgroundColor: '#1a1a1a',
            color: '#f0f0f0',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#C8A84B')}
          onBlur={e => (e.currentTarget.style.borderColor = '#333')}
        />

        <button
          onClick={() => key.trim() && onSubmit(key.trim())}
          disabled={!key.trim()}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            border: 'none',
            backgroundColor: key.trim() ? '#C8A84B' : '#333',
            color: key.trim() ? '#0a0a0a' : '#666',
            fontSize: 15,
            fontWeight: 600,
            cursor: key.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
          }}
        >
          はじめる
        </button>
      </div>
    </div>
  )
}
