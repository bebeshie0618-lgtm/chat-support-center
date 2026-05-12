'use client'

import { useState, useEffect } from 'react'
import { MasterBallAnimation } from './_components/MasterBallAnimation'
import { ApiKeyInput } from './_components/ApiKeyInput'
import { MainScreen } from './_components/MainScreen'

type AppPhase = 'ball' | 'apikey' | 'main'

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>('ball')
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('csc-api-key')
    if (saved) {
      setApiKey(saved)
      setPhase('main')
    }
  }, [])

  function handleChangeApiKey() {
    localStorage.removeItem('csc-api-key')
    setApiKey('')
    setPhase('apikey')
  }

  if (phase === 'ball') {
    return <MasterBallAnimation onComplete={() => {
      const saved = localStorage.getItem('csc-api-key')
      if (saved) {
        setApiKey(saved)
        setPhase('main')
      } else {
        setPhase('apikey')
      }
    }} />
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

  return <MainScreen apiKey={apiKey} onChangeApiKey={handleChangeApiKey} />
}
