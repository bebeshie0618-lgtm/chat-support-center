'use client'

import { useState } from 'react'

const TABS = [
  { key: 'sales', label: 'セールスレター' },
  { key: 'step', label: 'ステップメール' },
  { key: 'x', label: 'X投稿' },
  { key: 'threads', label: 'Threads' },
  { key: 'note', label: 'note' },
  { key: 'lp', label: 'LP' },
  { key: 'image', label: '画像生成' },
] as const

type TabKey = typeof TABS[number]['key']

const EXAMPLES: Record<TabKey, { instruction: string; result: string; isImage?: boolean }> = {
  sales: {
    instruction: '副業で月10万円稼ぎたい会社員向けに、AIツールを紹介するセールスレターを書いて',
    result: '「毎月同じ給料、このままでいいのか」と感じているあなたへ。実は今、スキルゼロでも月10万円以上を稼ぐ人が急増しています。その秘密はAIの活用です。難しい操作は一切不要。スマホとAPIキー1つで、プロ級のコンテンツが作れる時代が来ました。今すぐ行動した人だけが、半年後に笑っています。',
  },
  step: {
    instruction: '副業に興味がある人へ、5通のステップメールを書いて。1通目は自己紹介と共感から始める',
    result: '件名：はじめまして。あなたと同じ悩みを持っていました\n\n突然のメールにもかかわらず、開封いただきありがとうございます。私もかつて「副業したいけど何から始めればいいかわからない」と悩んでいた一人です。このメールでは5日間かけて、AIを使った副業の始め方をお伝えしていきます。',
  },
  x: {
    instruction: 'AIで副業を始めた人の体験談風のX投稿を作って。共感されやすい内容で',
    result: '半年前の自分に言いたい。AIツール1つで、外注していたデザインも文章も自分で作れるようになった。月3万円のコスト削減。時間も戻ってきた。「難しそう」って思ってた頃が懐かしい。やってみると全然そんなことなかった。',
  },
  threads: {
    instruction: 'AIマスターボールを使ってみた感想を、一般ユーザー目線で書いて',
    result: 'AIマスターボール使ってみた正直な感想。最初は半信半疑だったけど、指示を入れるだけでセールスレターが完成した時は驚いた。今まで1時間かかってたものが5分で終わる。これは使わない理由がない。',
  },
  note: {
    instruction: 'AIを使った副業の始め方を、初心者向けにわかりやすく解説するnote記事を書いて',
    result: '【タイトル】スキルゼロでも始められるAI副業入門\n\nAIを使った副業に興味はあるけど、何から始めればいいかわからない。そんな方のために、この記事では具体的なステップを解説します。必要なのはスマホとやる気だけ。',
  },
  lp: {
    instruction: 'AIを使った副業スクールのLPを書いて。ターゲットは30代会社員',
    result: '【キャッチコピー】その副業、AIで10倍速くなります\n\n30代会社員のあなたへ。時間がない、スキルがない、そんな言い訳はもう不要です。AIを使えば、プロ並みのコンテンツが今日から作れます。受講生の87%が1ヶ月以内に初収益を達成。',
  },
  image: {
    instruction: '30代女性向けの副業セミナーの告知ポスター。明るくポップな雰囲気で',
    result: '',
    isImage: true,
  },
}

export function WorksGallery() {
  const [activeTab, setActiveTab] = useState<TabKey>('sales')
  const example = EXAMPLES[activeTab]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* タブ */}
      <div style={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        padding: '0 4px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: activeTab === tab.key ? '#C8A84B' : '#1e1e1e',
              color: activeTab === tab.key ? '#0a0a0a' : '#888',
              fontSize: 12,
              fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 指示文 */}
      <div style={{
        backgroundColor: '#141414',
        borderRadius: 10,
        padding: '14px 16px',
        borderLeft: '3px solid #C8A84B',
      }}>
        <p style={{ fontSize: 11, color: '#C8A84B', marginBottom: 6, fontWeight: 600 }}>指示文</p>
        <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{example.instruction}</p>
      </div>

      {/* 生成例 */}
      <div style={{
        backgroundColor: '#141414',
        borderRadius: 10,
        padding: '14px 16px',
        borderLeft: '3px solid #555',
      }}>
        <p style={{ fontSize: 11, color: '#888', marginBottom: 6, fontWeight: 600 }}>生成例</p>
        {example.isImage ? (
          <div style={{
            backgroundColor: '#222',
            borderRadius: 8,
            padding: '40px 20px',
            textAlign: 'center',
            color: '#666',
            fontSize: 13,
          }}>
            AI MASTERBALLで生成した画像がここに表示されます
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {example.result}
          </p>
        )}
      </div>
    </div>
  )
}
