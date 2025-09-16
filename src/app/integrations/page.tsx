import { getLolSummaryByRiotId } from '@/services/riot'
import { getTwitchUser } from '@/services/twitch'
import { getYouTubeChannelByHandleOrId } from '@/services/youtube'
import { getWowCharacter } from '@/services/blizzard'

export default async function IntegrationsPage() {
  const hasRiot = Boolean(process.env.RIOT_API_KEY)
  const hasBlizzard = Boolean(process.env.BLIZZARD_CLIENT_ID && process.env.BLIZZARD_CLIENT_SECRET)
  const hasTwitch = Boolean(process.env.TWITCH_CLIENT_ID && process.env.TWITCH_APP_TOKEN)
  const hasYouTube = Boolean(process.env.YOUTUBE_API_KEY)

  const [lol, wow, twitch, yt] = await Promise.all([
    getLolSummaryByRiotId('Capponuts#1993', 'euw1').catch(() => null),
    getWowCharacter('ysondre', 'dracaufist', 'eu').catch(() => null),
    getTwitchUser('capponuts').catch(() => null),
    getYouTubeChannelByHandleOrId('@capponuts').catch(() => null),
  ])

  const Status = ({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) => (
    <div className="flex items-center justify-between border border-cyan-700/30 rounded p-3">
      <div className="text-cyan-100">{label}</div>
      <div className={ok ? 'text-green-400' : 'text-red-400'}>{ok ? 'OK' : 'Manquante'}</div>
      {detail ? <div className="col-span-2 text-sm opacity-75">{detail}</div> : null}
    </div>
  )

  return (
    <main className="min-h-screen p-6 text-cyan-100">
      <h1 className="text-2xl mb-4">Intégrations</h1>
      <div className="grid gap-3">
        <Status ok={hasRiot} label="Riot API Key" detail={lol ? `Summoner: ${lol.gameName}#${lol.tagLine}` : undefined} />
        <Status ok={hasBlizzard} label="Blizzard Client/Secret" detail={wow ? `WoW: ${wow.name} @ Ysondre` : undefined} />
        <Status ok={hasTwitch} label="Twitch Client/App Token" detail={twitch ? `Chaîne: ${twitch.display_name}` : undefined} />
        <Status ok={hasYouTube} label="YouTube API Key" detail={yt ? `Channel OK` : undefined} />
      </div>
      <p className="mt-4 opacity-80 text-sm">Les statuts ci-dessus sont évalués côté serveur au moment de l&apos;affichage.</p>
    </main>
  )
}


