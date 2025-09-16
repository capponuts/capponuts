export default function IntegrationsPage() {
  return (
    <main className="min-h-screen p-6 text-cyan-100">
      <h1 className="text-2xl mb-4">Intégrations</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>Riot (LoL/TFT) — EUW, Capponuts#1993</li>
        <li>Blizzard (WoW) — personnage défini</li>
        <li>Twitch — chaîne capponuts</li>
        <li>YouTube — chaîne définie</li>
      </ul>
      <p className="mt-4 opacity-80">Configuration des clés API via .env.local (non versionné).</p>
    </main>
  )
}


