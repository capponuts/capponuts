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
    <div className="container">
      <header className="header">
        <div>
          <h1 className="neon-text title">Capponuts</h1>
          <p className="subtitle">Joueur passionné · Univers néon gaming · Dashboard stats</p>
        </div>
        <button className="btn-neon pulse-ring" onClick={() => setSelected("tft")}>Voir mes stats</button>
      </header>

      <nav className="tabs" aria-label="Sélection du jeu">
        <Tab label="TFT" active={selected === "tft"} onClick={() => setSelected("tft")} />
        <Tab label="LoL" active={selected === "lol"} onClick={() => setSelected("lol")} />
        <Tab label="WoW" active={selected === "wow"} onClick={() => setSelected("wow")} />
        <Tab label="Twitch" active={selected === "twitch"} onClick={() => setSelected("twitch")} />
      </nav>

      <section className="grid">
        <GameTile label="Teamfight Tactics" icon="/next.svg" active={selected === "tft"} onClick={() => setSelected("tft")} />
        <GameTile label="League of Legends" icon="/globe.svg" active={selected === "lol"} onClick={() => setSelected("lol")} />
        <GameTile label="World of Warcraft" icon="/file.svg" active={selected === "wow"} onClick={() => setSelected("wow")} />
        <GameTile label="Twitch" icon="/window.svg" active={selected === "twitch"} onClick={() => setSelected("twitch")} />
      </section>

      <main className="glass panel">
        <h2 className="neon-text" style={{ marginTop: 0 }}>{title}</h2>
        {selected === "tft" ? <TftPanel stats={MOCK_TFT} /> : <PlaceholderPanel game={title} />}
      </main>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button className={["tab", active ? "active" : ""].join(" ")} onClick={onClick}>
      {label}
    </button>
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

function TftPanel({ stats }: { stats: TftStats }) {
  return (
    <div>
      <div className="stats">
        <div className="glass card">
          <h3>Rang</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="neon-text" style={{ fontSize: 28 }}>{stats.rank}</span>
            <span style={{ opacity: 0.8 }}>({stats.lp} LP)</span>
          </div>
        </div>
        <div className="glass card">
          <h3>Aperçu</h3>
          <StatRow label="Games" value={String(stats.games)} />
          <div className="stat-row" style={{ alignItems: "center", gap: 12 }}>
            <span className="label">Top 4</span>
            <span className="value">{Math.round(stats.top4Rate * 100)}%</span>
          </div>
          <ProgressBar percent={Math.round(stats.top4Rate * 100)} />
          <div className="stat-row" style={{ alignItems: "center", gap: 12 }}>
            <span className="label">Winrate</span>
            <span className="value">{Math.round(stats.winRate * 100)}%</span>
          </div>
          <ProgressBar percent={Math.round(stats.winRate * 100)} />
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

function ProgressBar({ percent }: { percent: number }) {
  const value = Math.max(0, Math.min(100, percent));
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar" style={{ width: `${value}%` }} />
    </div>
  );
}
