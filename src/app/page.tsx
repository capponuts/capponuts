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
      <CyberText />
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowGame(true)}
          className="px-6 py-3 rounded-lg border border-cyan-400 text-cyan-200 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition"
        >
          Jouer
        </button>
      </div>
    </main>
  )
}
