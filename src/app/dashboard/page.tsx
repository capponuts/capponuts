export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6 text-cyan-100">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="border border-cyan-700/30 rounded p-4">
          <h2 className="text-xl mb-2">LoL / TFT</h2>
          <div>Rang, winrate, meilleurs champions/compos (à venir)</div>
        </section>
        <section className="border border-cyan-700/30 rounded p-4">
          <h2 className="text-xl mb-2">WoW</h2>
          <div>Progression raid, ilvl, MM+ (à venir)</div>
        </section>
        <section className="border border-cyan-700/30 rounded p-4">
          <h2 className="text-xl mb-2">Twitch</h2>
          <div>Followers, vues, derniers streams, clips (à venir)</div>
        </section>
        <section className="border border-cyan-700/30 rounded p-4">
          <h2 className="text-xl mb-2">YouTube</h2>
          <div>Vues, abonnés, derniers uploads (à venir)</div>
        </section>
      </div>
    </main>
  )
}


