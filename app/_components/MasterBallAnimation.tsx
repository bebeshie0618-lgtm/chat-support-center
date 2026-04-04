'use client'

import { useEffect, useState } from 'react'

type Props = { onComplete: () => void }

export function MasterBallAnimation({ onComplete }: Props) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('opening'), 1200)
    const t2 = setTimeout(() => setPhase('done'), 2400)
    const t3 = setTimeout(onComplete, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* 外枠 */}
        <circle cx="100" cy="100" r="96" fill="none" stroke="#888" strokeWidth="4" />

        {/* 上半球（赤） */}
        <g
          style={{
            animation: phase === 'opening' ? 'ball-top-open 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            transformOrigin: '100px 100px',
          }}
        >
          <path
            d="M 4 100 A 96 96 0 0 1 196 100 L 4 100 Z"
            fill="#CC0000"
            stroke="#888"
            strokeWidth="2"
          />
          {/* 光沢 */}
          <ellipse cx="70" cy="50" rx="40" ry="20" fill="rgba(255,255,255,0.15)" />
        </g>

        {/* 下半球（白） */}
        <g
          style={{
            animation: phase === 'opening' ? 'ball-bottom-open 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            transformOrigin: '100px 100px',
          }}
        >
          <path
            d="M 4 100 A 96 96 0 0 0 196 100 L 4 100 Z"
            fill="#f0f0f0"
            stroke="#888"
            strokeWidth="2"
          />
        </g>

        {/* 中央ライン */}
        <line
          x1="4" y1="100" x2="196" y2="100"
          stroke="#999"
          strokeWidth="4"
          style={{
            opacity: phase === 'opening' ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* 中央ボタン */}
        <g style={{
          opacity: phase === 'opening' ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}>
          {/* 外グレー */}
          <circle cx="100" cy="100" r="20" fill="#888" />
          {/* 内白 */}
          <circle cx="100" cy="100" r="14" fill="#f0f0f0" />
          {/* 中心ドット金 */}
          <circle cx="100" cy="100" r="5" fill="#C8A84B" />
        </g>
      </svg>
    </div>
  )
}
