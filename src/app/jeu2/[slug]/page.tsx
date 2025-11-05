"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MINI_GAMES, ARTICULE_EXPRESSIONS, MIME_ACTIONS, JEMAPPELLE_PROMPTS } from "@/data/jeu2";

type Params = { params: { slug: string } };

function usePersistentNumber(key: string, initial = 0) {
  const [value, setValue] = useState<number>(initial);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw != null) setValue(Number(raw) || 0); } catch {}
  }, [key]);
  useEffect(() => {
    try { localStorage.setItem(key, String(value)); } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

export default function Jeu2Game({ params }: Params) {
  const { slug } = params;
  const game = useMemo(() => MINI_GAMES.find((g) => g.slug === slug) || null, [slug]);

  const [sound, setSound] = useState(false);
  const buzzerRef = useRef<HTMLAudioElement | null>(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [lockBuzz, setLockBuzz] = useState(false);
  const [firstBuzz, setFirstBuzz] = useState<null | "A" | "B">(null);
  const [scoreA, setScoreA] = usePersistentNumber("jeu2_score_A", 0);
  const [scoreB, setScoreB] = usePersistentNumber("jeu2_score_B", 0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  function startTimer(seconds: number) { setTimer(seconds); setRunning(true); }
  function pauseTimer() { setRunning(false); }
  function resetTimer() { setRunning(false); setTimer(0); }

  function buzz(team: "A" | "B") {
    if (lockBuzz) return;
    setFirstBuzz((prev) => prev ?? team);
    setLockBuzz(true);
    if (sound) {
      try { const el = buzzerRef.current; el && (el.currentTime = 0) && el.play(); } catch {}
    }
    setTimeout(() => setLockBuzz(false), 1500);
  }

  function addPoint(team: "A" | "B", delta = 1) {
    if (team === "A") setScoreA((s) => Math.max(0, s + delta));
    else setScoreB((s) => Math.max(0, s + delta));
  }

  // Helpers
  const [letter, setLetter] = useState<string>("A");
  function randomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    setLetter(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  const [idx, setIdx] = useState(0);

  if (!game) {
    return (
      <div className="container">
        <main className="glass panel" style={{ padding: 20 }}>
          <h2 className="neon-text">Jeu introuvable</h2>
          <Link className="btn-neon" href="/jeu2">Retour</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="neon-text title" style={{ fontSize: 36 }}>
            <span aria-hidden style={{ marginRight: 10 }}>{game.emoji}</span>
            {game.title}
          </h1>
          <p className="subtitle" style={{ maxWidth: 900 }}>{game.description}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn-neon" href="/jeu2">Menu</Link>
          <button className="btn-neon" onClick={() => setSound((v) => !v)}>{sound ? "Son: ON" : "Son: OFF"}</button>
        </div>
      </header>

      <main className="glass panel" style={{ padding: 24, display: "grid", gap: 16 }}>
        {/* Scoreboard */}
        <section className="glass" style={{ padding: 16 }}>
          <h3 className="neon-text" style={{ marginTop: 0 }}>Score</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="tile glass" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <span className="neon-text">Équipe A</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn-neon" onClick={() => addPoint("A", -1)}>-1</button>
                <span className="neon-text" style={{ fontSize: 28 }}>{scoreA}</span>
                <button className="btn-neon" onClick={() => addPoint("A", +1)}>+1</button>
              </div>
            </div>
            <div className="tile glass" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <span className="neon-text">Équipe B</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn-neon" onClick={() => addPoint("B", -1)}>-1</button>
                <span className="neon-text" style={{ fontSize: 28 }}>{scoreB}</span>
                <button className="btn-neon" onClick={() => addPoint("B", +1)}>+1</button>
              </div>
            </div>
          </div>
        </section>

        {/* Buzzer */}
        <section className="glass" style={{ padding: 16 }}>
          <h3 className="neon-text" style={{ marginTop: 0 }}>Buzzer</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <button className="tile glass" onClick={() => buzz("A")} disabled={lockBuzz} style={{ padding: 28, fontSize: 22 }}>🔴 Équipe A</button>
            <button className="tile glass" onClick={() => buzz("B")} disabled={lockBuzz} style={{ padding: 28, fontSize: 22 }}>🔵 Équipe B</button>
          </div>
          <div style={{ marginTop: 10, color: "#b7b7b7" }}>
            {firstBuzz ? (
              <span>Premier buzz: <span className="neon-text" style={{ fontSize: 20 }}>{firstBuzz}</span> <button className="btn-neon" style={{ marginLeft: 8 }} onClick={() => setFirstBuzz(null)}>Réinitialiser</button></span>
            ) : (
              <span>Attente du premier buzz…</span>
            )}
          </div>
        </section>

        {/* Timer */}
        <section className="glass" style={{ padding: 16 }}>
          <h3 className="neon-text" style={{ marginTop: 0 }}>Chrono</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="neon-text" style={{ fontSize: 32, minWidth: 90, textAlign: "center" }}>{String(Math.floor(timer / 60)).padStart(1, "0")}:{String(timer % 60).padStart(2, "0")}</span>
            <button className="btn-neon" onClick={() => startTimer(30)}>30s</button>
            <button className="btn-neon" onClick={() => startTimer(60)}>1:00</button>
            <button className="btn-neon" onClick={() => startTimer(90)}>1:30</button>
            <button className="btn-neon" onClick={() => startTimer(120)}>2:00</button>
            <button className="btn-neon" onClick={pauseTimer}>Pause</button>
            <button className="btn-neon" onClick={resetTimer}>Reset</button>
          </div>
        </section>

        {/* Game specific panel */}
        <section className="glass" style={{ padding: 16 }}>
          <h3 className="neon-text" style={{ marginTop: 0 }}>Panneau</h3>
          {game.kind === "blindtest" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ color: "#b7b7b7" }}>Lancez la musique sur votre source. Utilisez le buzzer pour capturer la priorité.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Titre / Artiste / Série" style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "#fff" }} />
                <button className="btn-neon" onClick={() => addPoint(firstBuzz || "A", 1)}>Valider (+1)</button>
              </div>
            </div>
          ) : game.kind === "abc-story" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div>Lettre: <span className="neon-text" style={{ fontSize: 22 }}>{letter}</span> <button className="btn-neon" onClick={randomLetter} style={{ marginLeft: 8 }}>Nouvelle lettre</button></div>
              <div style={{ color: "#b7b7b7" }}>30s par joueur. Un point par tour complété.</div>
            </div>
          ) : game.kind === "scoop" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ color: "#b7b7b7" }}>Choisissez un joueur. Racontez l’anecdote. L’équipe adverse buzze puis vote.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-neon" onClick={() => addPoint("A", 1)}>Point A</button>
                <button className="btn-neon" onClick={() => addPoint("B", 1)}>Point B</button>
              </div>
            </div>
          ) : game.kind === "jemappelle" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div>Lettre: <span className="neon-text" style={{ fontSize: 22 }}>{letter}</span> <button className="btn-neon" onClick={randomLetter} style={{ marginLeft: 8 }}>Nouvelle lettre</button></div>
              <div style={{ display: "grid", gap: 6 }}>
                {JEMAPPELLE_PROMPTS.map((p, i) => (
                  <div key={i} className="tile glass" style={{ padding: 10 }}>{p}</div>
                ))}
              </div>
            </div>
          ) : game.kind === "articule" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ color: "#b7b7b7" }}>Casque sur les oreilles. Deviner en lisant sur les lèvres, sans son.</div>
              <div className="tile glass" style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Expression:</span>
                <strong className="neon-text" style={{ fontSize: 22 }}>{ARTICULE_EXPRESSIONS[idx % ARTICULE_EXPRESSIONS.length]}</strong>
                <button className="btn-neon" onClick={() => setIdx((v) => v + 1)}>Suivante</button>
              </div>
            </div>
          ) : game.kind === "mime-dance" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div className="tile glass" style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Action secrète:</span>
                <strong className="neon-text" style={{ fontSize: 22 }}>{MIME_ACTIONS[idx % MIME_ACTIONS.length]}</strong>
                <button className="btn-neon" onClick={() => setIdx((v) => v + 1)}>Nouvelle action</button>
              </div>
              <div style={{ color: "#b7b7b7" }}>L’équipe adverse buzze pour proposer une réponse.</div>
            </div>
          ) : game.kind === "remix" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div>Préparation: <button className="btn-neon" onClick={() => startTimer(120)}>Lancer 2:00</button></div>
              <div style={{ color: "#b7b7b7" }}>Réécrire le refrain avec un thème imposé. Juger l’originalité et le rythme.</div>
            </div>
          ) : game.kind === "lets-dance" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div>Battle 1v1. <button className="btn-neon" onClick={() => startTimer(60)}>Lancer 1:00</button></div>
              <div style={{ color: "#b7b7b7" }}>Le public vote au bruitmètre. Donnez le point à l’équipe gagnante.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div>Tout le monde danse. <button className="btn-neon" onClick={() => startTimer(60)}>Lancer 1:00</button></div>
              <div style={{ color: "#b7b7b7" }}>Stop musique = mimer un objet/animal. Éliminez les joueurs qui bougent.</div>
            </div>
          )}
        </section>
      </main>

      <audio ref={buzzerRef} src="/sounds/buzzer.mp3" preload="auto" />
    </div>
  );
}


