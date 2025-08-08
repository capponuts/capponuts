"use client"
import { useState } from 'react'
import dynamic from 'next/dynamic'
import CyberText from './CyberText'

const CasinoGame = dynamic(() => import('./Game'), { ssr: false })

export default function Home() {
  const [showGame, setShowGame] = useState(false)

  if (showGame) {
    return (
      <main className="min-h-screen">
        <CasinoGame />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <CyberText onSelectProject={(id) => {
        if (id === 'saloon') setShowGame(true)
      }} />
    </main>
  )
}
