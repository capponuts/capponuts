"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type GameKey = "tft" | "lol" | "wow" | "twitch";

type ApiTft = {
  rank: string | null;
  lp: number | null;
  top4Rate: number | null;
  winRate: number | null;
  games: number | null;
  bestAugment: string | null;
};

export default function Home() {
  const [selected, setSelected] = useState<GameKey>("tft");
  const [tft, setTft] = useState<ApiTft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selected !== "tft") return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/tft?gameName=${encodeURIComponent("Capponuts")}&tagLine=${encodeURIComponent("1993")}&region=euw`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data: ApiTft) => {
        if (cancelled) return;
        setTft({
          rank: data?.rank ?? null,
          lp: data?.lp ?? null,
          top4Rate: data?.top4Rate ?? null,
          winRate: data?.winRate ?? null,
          games: data?.games ?? null,
          bestAugment: data?.bestAugment ?? null,
        });
      })
      .catch(async (e) => {
        if (cancelled) return;
        try {
          const text = typeof e?.message === "string" ? e.message : String(e);
          setError("Impossible de récupérer les stats TFT maintenant.");
        } catch {
          setError("Impossible de récupérer les stats TFT maintenant.");
        }
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const title = useMemo(() => {
    switch (selected) {
      case "tft":
        return "Teamfight Tactics";
      case "lol":
        return "League of Legends";
      case "wow":
        return "World of Warcraft";
      case "twitch":
        return "Twitch";
      default:
        return "Dashboard";
    }
  }, [selected]);

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="neon-text title">Capponuts</h1>
          <p className="subtitle">Joueur passionné · Univers néon gaming · Dashboard stats</p>
        </div>
        <button className="btn-neon pulse-ring" onClick={() => setSelected("tft")}>Voir mes stats</button>
      </header>

      {/* Tabs retirés; on garde les tuiles designées comme sélecteurs */}

      <section className="grid">
        <GameTile label="Teamfight Tactics" icon="/next.svg" active={selected === "tft"} onClick={() => setSelected("tft")} />
        <GameTile label="League of Legends" icon="/globe.svg" active={selected === "lol"} onClick={() => setSelected("lol")} />
        <GameTile label="World of Warcraft" icon="/file.svg" active={selected === "wow"} onClick={() => setSelected("wow")} />
        <GameTile label="Twitch" icon="/window.svg" active={selected === "twitch"} onClick={() => setSelected("twitch")} />
      </section>

      <main className="glass panel">
        <h2 className="neon-text" style={{ marginTop: 0 }}>{title}</h2>
        {selected === "tft" ? <TftPanel stats={tft} loading={loading} error={error} /> : <PlaceholderPanel game={title} />}
      </main>
    </div>
  );
}

function GameTile({ label, icon, active, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={["tile", "glass", active ? "active" : ""].join(" ")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Image src={icon} alt="" width={28} height={28} />
        <span className="neon-text" style={{ fontSize: 18 }}>{label}</span>
      </div>
    </button>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-row">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}

function TftPanel({ stats, loading, error }: { stats: ApiTft | null; loading: boolean; error: string | null }) {
  return (
    <div>
      {loading ? (
        <div className="glass card" style={{ textAlign: "center" }}>Chargement des stats TFT…</div>
      ) : error ? (
        <div className="glass card" style={{ color: "#ff8080" }}>{error}</div>
      ) : stats ? (
        <div className="stats">
          <div className="glass card">
            <h3>Rang</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="neon-text" style={{ fontSize: 28 }}>{stats.rank ?? "—"}</span>
              {stats.lp != null && <span style={{ opacity: 0.8 }}>({stats.lp} LP)</span>}
            </div>
          </div>
          <div className="glass card">
            <h3>Aperçu</h3>
            <StatRow label="Games" value={stats.games != null ? String(stats.games) : "—"} />
            <div className="stat-row" style={{ alignItems: "center", gap: 12 }}>
              <span className="label">Top 4</span>
              <span className="value">{stats.top4Rate != null ? Math.round(stats.top4Rate * 100) : "—"}%</span>
            </div>
            {stats.top4Rate != null && <ProgressBar percent={Math.round(stats.top4Rate * 100)} />}
            <div className="stat-row" style={{ alignItems: "center", gap: 12 }}>
              <span className="label">Winrate</span>
              <span className="value">{stats.winRate != null ? Math.round(stats.winRate * 100) : "—"}%</span>
            </div>
            {stats.winRate != null && <ProgressBar percent={Math.round(stats.winRate * 100)} />}
            <StatRow label="Best augment" value={stats.bestAugment ?? "—"} />
          </div>
        </div>
      ) : (
        <div className="glass card">Stats indisponibles pour le moment.</div>
      )}
    </div>
  );
}

function PlaceholderPanel({ game }: { game: string }) {
  return (
    <div style={{ opacity: 0.8 }}>Les stats {game} arrivent bientôt…</div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  const value = Math.max(0, Math.min(100, percent));
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar" style={{ width: `${value}%` }} />
    </div>
  );
}
