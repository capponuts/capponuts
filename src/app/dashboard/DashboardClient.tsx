'use client'
import { motion } from 'framer-motion'
import { Sword, Twitch, Gamepad2, Shield, type LucideIcon } from 'lucide-react'

export function StatCard({ title, value, icon: Icon, accent }: { title: string; value: string; icon: LucideIcon; accent: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-xl border border-cyan-700/30 p-4 bg-black/40">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ background: accent }}>
          <Icon size={20} />
        </div>
        <div>
          <div className="opacity-80 text-sm">{title}</div>
          <div className="text-xl">{value}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardClient() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="LoL / TFT" value="Chargement..." icon={Sword} accent="linear-gradient(135deg, rgba(56,189,248,.2), rgba(168,85,247,.15))" />
        <StatCard title="WoW" value="Chargement..." icon={Shield} accent="linear-gradient(135deg, rgba(34,197,94,.2), rgba(34,197,94,.1))" />
        <StatCard title="Twitch" value="Chargement..." icon={Twitch} accent="linear-gradient(135deg, rgba(147,51,234,.2), rgba(147,51,234,.1))" />
        <StatCard title="Sessions" value="0 cette semaine" icon={Gamepad2} accent="linear-gradient(135deg, rgba(234,88,12,.2), rgba(234,88,12,.1))" />
      </div>
    </motion.div>
  )
}


