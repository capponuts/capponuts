"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type GameKey = "tft" | "lol" | "wow" | "twitch";

type TftStats = {
  rank: string;
  lp: number;
  top4Rate: number; // 0..1
  winRate: number; // 0..1
  games: number;
  bestAugment: string;
};

const MOCK_TFT: TftStats = {
  rank: "Diamond II",
  lp: 36,
  top4Rate: 0.59,
  winRate: 0.18,
  games: 128,
  bestAugment: "Metabolic Accelerator",
};

export default function Home() {
  const [selected, setSelected] = useState<GameKey>("tft");

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
    <div style={{ padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="neon-text" style={{ fontSize: 32, margin: 0 }}>Capponuts</h1>
          <p style={{ opacity: 0.8, marginTop: 6 }}>Joueur passionné · Univers néon gaming · Dashboard stats</p>
        </div>
        <button className="btn-neon pulse-ring" onClick={() => setSelected("tft")}>Voir mes stats</button>
      </header>

      <section className="grid" style={{ marginBottom: 24 }}>
        <GameTile label="Teamfight Tactics" icon="/next.svg" active={selected === "tft"} onClick={() => setSelected("tft")} />
        <GameTile label="League of Legends" icon="/globe.svg" active={selected === "lol"} onClick={() => setSelected("lol")} />
        <GameTile label="World of Warcraft" icon="/file.svg" active={selected === "wow"} onClick={() => setSelected("wow")} />
        <GameTile label="Twitch" icon="/window.svg" active={selected === "twitch"} onClick={() => setSelected("twitch")} />
      </section>

      <main className="glass" style={{ borderRadius: 16, padding: 20 }}>
        <h2 className="neon-text" style={{ marginTop: 0 }}>{title}</h2>
        {selected === "tft" ? <TftPanel stats={MOCK_TFT} /> : <PlaceholderPanel game={title} />}
      </main>
    </div>
  );
}

function GameTile({ label, icon, active, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="tile glass"
      style={{
        gridColumn: "span 3",
        borderRadius: 16,
        padding: 16,
        textAlign: "left",
        background: active ? "rgba(124, 60, 255, 0.08)" : undefined,
      }}
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
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ opacity: 0.8 }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function TftPanel({ stats }: { stats: TftStats }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="glass" style={{ padding: 16, borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Rang</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="neon-text" style={{ fontSize: 28 }}>{stats.rank}</span>
            <span style={{ opacity: 0.8 }}>({stats.lp} LP)</span>
          </div>
        </div>
        <div className="glass" style={{ padding: 16, borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Aperçu</h3>
          <StatRow label="Games" value={String(stats.games)} />
          <StatRow label="Top 4" value={`${Math.round(stats.top4Rate * 100)}%`} />
          <StatRow label="Winrate" value={`${Math.round(stats.winRate * 100)}%`} />
          <StatRow label="Best augment" value={stats.bestAugment} />
        </div>
      </div>
    </div>
  );
}

function PlaceholderPanel({ game }: { game: string }) {
  return (
    <div style={{ opacity: 0.8 }}>Les stats {game} arrivent bientôt…</div>
  );
}
