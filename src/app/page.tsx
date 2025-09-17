"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type GameKey = "tft" | "wow" | "twitch";

type ApiTft = {
  rank: string | null;
  lp: number | null;
  top4Rate: number | null;
  winRate: number | null;
  games: number | null;
  bestAugment: string | null;
};

type ApiTwitch = {
  user?: { id: string; login: string; displayName: string; avatar: string | null; description: string | null; views: number | null };
  stream?: { live: boolean; title?: string; viewers?: number; gameName?: string | null; thumbnailUrl?: string };
};

type ApiWow = {
  name?: string;
  realm?: string;
  faction?: string;
  race?: string;
  characterClass?: string;
  activeSpec?: string | null;
  level?: number;
  averageItemLevel?: number | null;
  thumbnail?: string | null;
};

export default function Home() {
  const [selected, setSelected] = useState<GameKey>("tft");
  const [tft, setTft] = useState<ApiTft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twitch, setTwitch] = useState<ApiTwitch | null>(null);
  const [loadingTwitch, setLoadingTwitch] = useState(false);
  const [errorTwitch, setErrorTwitch] = useState<string | null>(null);
  const [wow, setWow] = useState<ApiWow | null>(null);
  const [loadingWow, setLoadingWow] = useState(false);
  const [errorWow, setErrorWow] = useState<string | null>(null);

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
      .catch(async (err) => {
        if (cancelled) return;
        try {
          const msg = typeof err?.message === "string" ? err.message : "";
          const hint = msg.includes("hint") ? msg : "";
          setError(hint || "Impossible de récupérer les stats TFT maintenant.");
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

  useEffect(() => {
    if (selected !== "wow") return;
    let cancelled = false;
    setLoadingWow(true);
    setErrorWow(null);
    fetch(`/api/wow?name=${encodeURIComponent("Dracaufist")}&realm=${encodeURIComponent("ysondre")}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data: ApiWow) => {
        if (cancelled) return;
        setWow(data);
      })
      .catch(() => {
        if (cancelled) return;
        setErrorWow("Impossible de récupérer les infos WoW maintenant.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingWow(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  useEffect(() => {
    if (selected !== "twitch") return;
    let cancelled = false;
    setLoadingTwitch(true);
    setErrorTwitch(null);
    fetch(`/api/twitch`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data: ApiTwitch) => {
        if (cancelled) return;
        setTwitch(data);
      })
      .catch(() => {
        if (cancelled) return;
        setErrorTwitch("Impossible de récupérer les infos Twitch maintenant.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingTwitch(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const title = useMemo(() => {
    switch (selected) {
      case "tft":
        return "Teamfight Tactics";
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
        <GameTile label="Teamfight Tactics" icon="/icons/tft.jpg" active={selected === "tft"} onClick={() => setSelected("tft")} />
        <GameTile label="World of Warcraft" icon="/icons/wow.png" active={selected === "wow"} onClick={() => setSelected("wow")} />
        <GameTile label="Twitch" icon="/icons/twitch.png" active={selected === "twitch"} onClick={() => setSelected("twitch")} />
      </section>

      <main className="glass panel">
        <h2 className="neon-text" style={{ marginTop: 0 }}>{title}</h2>
        {selected === "tft" ? (
          <TftPanel stats={tft} loading={loading} error={error} />
        ) : selected === "twitch" ? (
          <TwitchPanel data={twitch} loading={loadingTwitch} error={errorTwitch} />
        ) : selected === "wow" ? (
          <WowPanel data={wow} loading={loadingWow} error={errorWow} />
        ) : (
          <PlaceholderPanel game={title} />
        )}
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

function TwitchPanel({ data, loading, error }: { data: ApiTwitch | null; loading: boolean; error: string | null }) {
  if (loading) return <div className="glass card" style={{ textAlign: "center" }}>Chargement Twitch…</div>;
  if (error) return <div className="glass card" style={{ color: "#ff8080" }}>{error}</div>;
  if (!data?.user) return <div className="glass card">Twitch non disponible.</div>;
  const user = data.user;
  const stream = data.stream;
  return (
    <div className="stats">
      <div className="glass card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {user.avatar && <Image src={user.avatar} alt="avatar" width={56} height={56} style={{ borderRadius: 8 }} />}
        <div>
          <div className="neon-text" style={{ fontSize: 22 }}>{user.displayName}</div>
          <div className="label">twitch.tv/{user.login}</div>
        </div>
      </div>
      <div className="glass card">
        <h3>Statut</h3>
        {stream?.live ? (
          <>
            <StatRow label="Live" value={"Oui"} />
            {stream.title && <StatRow label="Titre" value={stream.title} />}
            {stream.gameName && <StatRow label="Jeu" value={stream.gameName} />}
            {typeof stream.viewers === "number" && <StatRow label="Viewers" value={String(stream.viewers)} />}
          </>
        ) : (
          <StatRow label="Live" value={"Non"} />
        )}
      </div>
    </div>
  );
}

function WowPanel({ data, loading, error }: { data: ApiWow | null; loading: boolean; error: string | null }) {
  if (loading) return <div className="glass card" style={{ textAlign: "center" }}>Chargement WoW…</div>;
  if (error) return <div className="glass card" style={{ color: "#ff8080" }}>{error}</div>;
  if (!data) return <div className="glass card">WoW non disponible.</div>;
  return (
    <div className="stats">
      <div className="glass card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {data.thumbnail && <Image src={data.thumbnail} alt="avatar" width={56} height={56} style={{ borderRadius: 8 }} />}
        <div>
          <div className="neon-text" style={{ fontSize: 22 }}>{data.name} · {data.level}</div>
          <div className="label">{data.realm} · {data.faction}</div>
        </div>
      </div>
      <div className="glass card">
        <h3>Perso</h3>
        <StatRow label="Classe" value={data.characterClass || "—"} />
        <StatRow label="Spécialisation" value={data.activeSpec || "—"} />
        <StatRow label="iLvl" value={data.averageItemLevel != null ? String(data.averageItemLevel) : "—"} />
      </div>
    </div>
  );
}
