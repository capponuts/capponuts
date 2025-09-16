"use client"
import CyberText from './CyberText'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        <a href="/dashboard" className="px-4 py-2 rounded-lg border border-cyan-400/60 text-cyan-100 bg-black/40">Aller au Dashboard</a>
        <a href="/integrations" className="px-4 py-2 rounded-lg border border-cyan-400/60 text-cyan-100 bg-black/40">Intégrations</a>
      </div>
      <CyberText />
    </main>
  )
}
