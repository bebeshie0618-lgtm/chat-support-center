'use client'

import { useState } from 'react'
import { MasterBallAnimation } from './_components/MasterBallAnimation'
import { ApiKeyInput } from './_components/ApiKeyInput'
import { MainScreen } from './_components/MainScreen'

type AppPhase = 'ball' | 'apikey' | 'main'

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>('ball')
  const [apiKey, setApiKey] = useState('')

  if (phase === 'ball') {
    return <MasterBallAnimation onComplete={() => setPhase('apikey')} />
  }

  if (phase === 'apikey') {
    return (
      <ApiKeyInput
        onSubmit={(key) => {
          setApiKey(key)
          setPhase('main')
        }}
      />
    )
  }

  return <MainScreen apiKey={apiKey} />
}
