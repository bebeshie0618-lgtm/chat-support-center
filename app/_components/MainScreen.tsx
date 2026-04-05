'use client'

import { useState } from 'react'
import { ChatUI } from './ChatUI'
import { WorksGallery } from './WorksGallery'

type MenuKey = 'support' | 'satoshi' | 'works'

const MENU_ITEMS: { key: MenuKey; label: string; shortLabel: string }[] = [
  { key: 'support', label: 'AIマスターボールの使い方', shortLabel: '使い方' },
  { key: 'satoshi', label: 'サトシとの会話', shortLabel: 'サトシ' },
  { key: 'works', label: '作品例', shortLabel: '作品例' },
]

type Props = { apiKey: string }

export function MainScreen({ apiKey }: Props) {
  const [active, setActive] = useState<MenuKey>('support')

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#0a0a0a' }}>

      {/* スマホ用タブ（md以下で表示） */}
      <div className="md:hidden" style={{
        display: 'flex',
        borderBottom: '1px solid #1e1e1e',
        backgroundColor: '#0a0a0a',
        flexShrink: 0,
      }}>
        {MENU_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              flex: 1,
              padding: '12px 4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: active === item.key ? '#C8A84B' : '#666',
              fontSize: 11,
              fontWeight: active === item.key ? 700 : 400,
              cursor: 'pointer',
              borderBottom: active === item.key ? '2px solid #C8A84B' : '2px solid transparent',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em',
            }}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* PC用サイドバー（md以上で表示） */}
        <aside className="hidden md:flex animate-sidebar-slide-in" style={{
          width: 240,
          minWidth: 240,
          backgroundColor: '#0a0a0a',
          borderRight: '1px solid #1e1e1e',
          flexDirection: 'column',
          padding: '28px 16px',
          gap: 28,
        }}>
          <h1 style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#C8A84B',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            チャットサポート<br />センター
          </h1>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {MENU_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: active === item.key ? '#C8A84B18' : 'transparent',
                  color: active === item.key ? '#C8A84B' : '#777',
                  fontSize: 13,
                  fontWeight: active === item.key ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  borderLeft: active === item.key ? '3px solid #C8A84B' : '3px solid transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* メインエリア */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#111' }}>
          {/* PC用ヘッダー */}
          <header className="hidden md:flex" style={{
            padding: '14px 20px',
            borderBottom: '1px solid #1e1e1e',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#C8A84B' }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f0' }}>
              {MENU_ITEMS.find(m => m.key === active)?.label}
            </span>
          </header>

          {/* コンテンツ */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {active === 'support' && (
              <ChatUI
                key="support"
                apiKey={apiKey}
                endpoint="/api/chat/support"
                placeholder="AI MASTERBALLの使い方について質問してください"
              />
            )}
            {active === 'satoshi' && (
              <ChatUI
                key="satoshi"
                apiKey={apiKey}
                endpoint="/api/chat/satoshi"
                placeholder="副業・ビジネスについてサトシに相談してください"
              />
            )}
            {active === 'works' && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                {/* ギャラリー部分 */}
                <div className="works-gallery-area" style={{
                  overflowY: 'auto',
                  padding: '16px',
                  flex: '0 0 auto',
                  maxHeight: '45%',
                }}>
                  <WorksGallery />
                </div>
                {/* チャット部分 */}
                <div style={{
                  flex: 1,
                  minHeight: 0,
                  borderTop: '1px solid #1e1e1e',
                }}>
                  <ChatUI
                    key="works"
                    apiKey={apiKey}
                    endpoint="/api/chat/works"
                    placeholder="どんな画像・文章を作りたいですか？指示例を教えます"
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
