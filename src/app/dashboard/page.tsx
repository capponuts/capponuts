import { getLolSummaryByRiotId } from '@/services/riot'
import { getTwitchUser } from '@/services/twitch'
import { getWowCharacter } from '@/services/blizzard'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const lol = await getLolSummaryByRiotId('Capponuts#1993', 'euw1')
  const twitch = await getTwitchUser('capponuts')
  const wow = await getWowCharacter('ysondre', 'dracaufist', 'eu')

  return (
    <main className="min-h-screen p-6 text-cyan-100 bg-black">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-wide">Dashboard</h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-cyan-700/30 p-4 bg-black/40">
            <h2 className="text-xl mb-2">LoL / TFT</h2>
            {lol ? (
              <div className="space-y-1">
                <div className="opacity-80">{lol.gameName}#{lol.tagLine}</div>
                {lol.soloDuo ? (
                  <div className="text-cyan-200">Solo/Duo: {lol.soloDuo.tier} {lol.soloDuo.rank} • {lol.soloDuo.lp} LP • WR {lol.soloDuo.winrate}%</div>
                ) : (
                  <div className="opacity-70">Aucun classement détecté (ou clé API manquante)</div>
                )}
              </div>
            ) : (
              <div className="opacity-70">Clé Riot absente ou API indisponible</div>
            )}
          </div>

          <div className="rounded-xl border border-cyan-700/30 p-4 bg-black/40">
            <h2 className="text-xl mb-2">WoW</h2>
            {wow ? (
              <div className="space-y-1">
                <div className="opacity-80">Personnage: {wow.name} @ Ysondre</div>
                <div className="opacity-80">Niveau: {wow.level ?? 'n/a'}</div>
              </div>
            ) : (
              <div className="opacity-70">Clés Blizzard absentes ou API indisponible</div>
            )}
          </div>

          <div className="rounded-xl border border-cyan-700/30 p-4 bg-black/40">
            <h2 className="text-xl mb-2">Twitch</h2>
            {twitch ? (
              <div className="space-y-1">
                <div className="opacity-80">Chaîne: {twitch.display_name}</div>
                <div className="opacity-80">Views: {twitch.view_count ?? 'n/a'}</div>
              </div>
            ) : (
              <div className="opacity-70">Clés Twitch absentes ou API indisponible</div>
            )}
          </div>
        </section>

        <div className="pt-2 border-t border-cyan-700/20">
          <DashboardClient />
        </div>
      </div>
    </main>
  )
}


