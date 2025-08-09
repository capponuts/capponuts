"use client"
import dynamic from 'next/dynamic'

const CasinoGame = dynamic(() => import('../Game'), { ssr: false })

export default function SaloonPage() {
  return (
    <main className="min-h-screen">
      <CasinoGame />
    </main>
  )
}


