import { getLolSummaryByRiotId } from '@/services/riot'
import { getTwitchUser } from '@/services/twitch'
import { getWowCharacter } from '@/services/blizzard'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const lol = await getLolSummaryByRiotId('Capponuts#1993', 'euw1')
  const twitch = await getTwitchUser('capponuts')
  const wow = await getWowCharacter('ysondre', 'dracaufist', 'eu')

  return (
    <main className="min-h-screen p-6 text-cyan-100">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="border border-cyan-700/30 rounded p-4">
          <h2 className="text-xl mb-2">LoL / TFT</h2>
          {lol ? (
            <div>
              <div>{lol.gameName}#{lol.tagLine}</div>
              {lol.soloDuo ? (
                <div>Solo/Duo: {lol.soloDuo.tier} {lol.soloDuo.rank} • {lol.soloDuo.lp} LP • WR {lol.soloDuo.winrate}%</div>
              ) : (
                <div>Aucun classement détecté (ou clé API manquante)</div>
              )}
            </div>
          ) : (
            <div>Clé Riot absente ou API indisponible</div>
          )}
        </section>

        <section className="border border-cyan-700/30 rounded p-4">
          <h2 className="text-xl mb-2">WoW</h2>
          {wow ? (
            <div>
              <div>Personnage: {wow.name} @ Ysondre</div>
              <div>Niveau: {wow.level ?? 'n/a'}</div>
            </div>
          ) : (
            <div>Clés Blizzard absentes ou API indisponible</div>
          )}
        </section>

        <section className="border border-cyan-700/30 rounded p-4">
          <h2 className="text-xl mb-2">Twitch</h2>
          {twitch ? (
            <div>
              <div>Chaîne: {twitch.display_name}</div>
              <div>Views: {twitch.view_count ?? 'n/a'}</div>
            </div>
          ) : (
            <div>Clés Twitch absentes ou API indisponible</div>
          )}
        </section>

        {/* Section YouTube retirée */}
      </div>
      <div className="mt-6">
        <DashboardClient />
      </div>
    </main>
  )
}


