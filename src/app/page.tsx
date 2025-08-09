"use client"
import { useRouter } from 'next/navigation'
import CyberText from './CyberText'

export default function Home() {
  const router = useRouter()
  return (
    <main className="min-h-screen">
      <CyberText onSelectProject={() => router.push('/saloon')} />
    </main>
  )
}
