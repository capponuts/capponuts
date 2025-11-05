"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FAMILLE_QUESTIONS } from "@/data/famille";

type Params = { params: { id: string } };

export default function JeuManche({ params }: Params) {
  const id = Number(params.id);
  const question = useMemo(() => FAMILLE_QUESTIONS.find((q) => q.id === id) || null, [id]);

  const [revealed, setRevealed] = useState<boolean[]>(() =>
    question ? Array(question.answers.length).fill(false) : []
  );

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAltAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [pulse, setPulse] = useState<boolean[]>(() => (question ? Array(question.answers.length).fill(false) : []));
  const [strikes, setStrikes] = useState(0);

  function playBeep() {
    if (!soundEnabled) return;
    try {
      const Ctor: typeof AudioContext = (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || AudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new Ctor();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 880; // clic court, assez percussif
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  function playClick() {
    if (!soundEnabled) return;
    const el = clickAudioRef.current;
    if (!el) {
      playBeep();
      return;
    }
    try {
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof (p as Promise<void>).then === "function") {
        (p as Promise<void>).catch(() => {
          playBeep();
        });
      }
    } catch {
      playBeep();
    }
  }

  function playSuccess() {
    if (!soundEnabled) return;
    const el = successAudioRef.current;
    if (!el) {
      playBeep();
      return;
    }
    try {
      el.currentTime = 0;
      void el.play().catch(() => playBeep());
    } catch {
      playBeep();
    }
  }

  function playError() {
    if (!soundEnabled) return;
    const el = errorAudioRef.current || errorAltAudioRef.current;
    if (!el) {
      playBeep();
      return;
    }
    try {
      el.currentTime = 0;
      void el.play().catch(() => playBeep());
    } catch {
      playBeep();
    }
  }

  useEffect(() => {
    if (!question) return;
    setRevealed(Array(question.answers.length).fill(false));
    setPulse(Array(question.answers.length).fill(false));
    setStrikes(0);
  }, [question]);

  const total = useMemo(() => {
    if (!question) return 0;
    return question.answers.reduce((acc, a, idx) => acc + (revealed[idx] ? a.points : 0), 0);
  }, [question, revealed]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question) return;
      // 1..8 => toggle
      const num = Number(e.key);
      if (!Number.isNaN(num) && num >= 1 && num <= question.answers.length) {
        const idx = num - 1;
        const willReveal = !revealed[idx];
        setRevealed((r) => r.map((v, i) => (i === idx ? !v : v)));
        if (willReveal) {
          setPulse((p) => {
            const next = [...p];
            next[idx] = true;
            return next;
          });
          setTimeout(() => {
            setPulse((p) => {
              const next = [...p];
              next[idx] = false;
              return next;
            });
          }, 360);
          playSuccess();
        } else {
          playClick();
        }
      }
      if (e.key.toLowerCase() === "a") {
        // reveal all
        const anyHidden = revealed.some((v) => !v);
        setRevealed(Array(question.answers.length).fill(true));
        setPulse(Array(question.answers.length).fill(true));
        setTimeout(() => setPulse(Array(question.answers.length).fill(false)), 380);
        if (anyHidden) playSuccess(); else playClick();
      }
      if (e.key.toLowerCase() === "r") {
        // reset
        setRevealed(Array(question.answers.length).fill(false));
        setPulse(Array(question.answers.length).fill(false));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question]);

  // Synchronise la musique de fond
  useEffect(() => {
    const bg = bgAudioRef.current;
    if (!bg) return;
    if (soundEnabled && musicOn) {
      bg.loop = true;
      bg.volume = 0.5;
      void bg.play().catch(() => {});
    } else {
      try { bg.pause(); } catch {}
    }
  }, [soundEnabled, musicOn]);

  // Tente de (re)prendre le contexte audio lorsque l'utilisateur active le son
  useEffect(() => {
    if (!soundEnabled) return;
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        void audioCtxRef.current.resume();
      }
    } catch {}
  }, [soundEnabled]);

  if (!question) {
    return (
      <div className="container">
        <main className="glass panel" style={{ padding: 20 }}>
          <h2 className="neon-text" style={{ marginTop: 0 }}>Manche introuvable</h2>
          <Link className="btn-neon" href="/jeu">Revenir aux manches</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="neon-text title" style={{ fontSize: 40 }}>Manche {question.id}</h1>
          <p className="subtitle" style={{ fontSize: 16 }}>Appuyez 1-8 pour révéler, A: tout, R: réinitialiser</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn-neon"
            onClick={() => {
              setStrikes((s) => {
                const next = Math.min(3, s + 1);
                if (next !== s) playError();
                return next;
              });
            }}
            title="Ajouter une croix rouge"
          >
            Ajouter une croix
          </button>
          <button
            className="btn-neon"
            onClick={() => setSoundEnabled((v) => !v)}
            title={soundEnabled ? "Couper tous les sons" : "Activer les sons"}
          >
            {soundEnabled ? "Couper le son" : "Activer le son"}
          </button>
          <button
            className="btn-neon"
            onClick={() => setMusicOn((v) => !v)}
            disabled={!soundEnabled}
            style={{ opacity: soundEnabled ? 1 : 0.6 }}
            title="Musique de fond"
          >
            {musicOn ? "Musique: ON" : "Musique: OFF"}
          </button>
          <Link className="btn-neon" href="/jeu">Liste des manches</Link>
        </div>
      </header>

      <main
        className="glass panel"
        style={{
          padding: 32,
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <div aria-label="strikes" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[0,1,2].map((i) => (
              <span key={i} style={{ fontSize: 32, color: i < strikes ? "#ff4d4f" : "#3a1e28", textShadow: i < strikes ? "0 0 10px rgba(255,77,79,0.5)" : "none" }}>
                ✖
              </span>
            ))}
          </div>
        </div>
        <h2 className="neon-text" style={{ marginTop: 0, fontSize: 32, textAlign: "center" }}>{question.question}</h2>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 16,
            maxWidth: 1600,
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
          }}
        >
          {question.answers.map((a, index) => {
            const shown = revealed[index];
            return (
              <button
                key={index}
                className={["tile", "glass", shown ? "active" : "", pulse[index] ? "reveal-pulse" : ""].join(" ")}
                onClick={() => {
                  const willReveal = !revealed[index];
                  setRevealed((r) => r.map((v, i) => (i === index ? !v : v)));
                  if (willReveal) {
                    setPulse((p) => {
                      const next = [...p];
                      next[index] = true;
                      return next;
                    });
                    setTimeout(() => {
                      setPulse((p) => {
                        const next = [...p];
                        next[index] = false;
                        return next;
                      });
                    }, 360);
                    playSuccess();
                  } else {
                    playClick();
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 24,
                  minHeight: 140,
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="neon-text" style={{ fontSize: 28 }}>{index + 1}</span>
                  <span style={{ fontSize: 24, color: shown ? "#fff" : "#8a8a8a" }}>{shown ? a.text : "— — — — —"}</span>
                </div>
                <span className="neon-text" style={{ fontSize: 28 }}>{shown ? a.points : "?"}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
          <button className="btn-neon" onClick={() => { setRevealed(Array(question.answers.length).fill(true)); playClick(); }}>Révéler tout</button>
          <button className="btn-neon" onClick={() => setRevealed(Array(question.answers.length).fill(false))}>Réinitialiser</button>
          <div style={{ marginLeft: "auto", fontSize: 22 }}>
            Score: <span className="neon-text" style={{ fontSize: 28 }}>{total}</span>
          </div>
        </div>
      </main>

      <footer style={{ marginTop: 12, display: "flex", justifyContent: "space-between", color: "#9fa3a9" }}>
        <div>
          Suivante:
          {FAMILLE_QUESTIONS.find((q) => q.id === id + 1) ? (
            <Link href={`/jeu/${id + 1}`} style={{ marginLeft: 8 }} className="neon-text">Manche {id + 1}</Link>
          ) : (
            <span style={{ marginLeft: 8 }}>aucune</span>
          )}
        </div>
        <div>
          Astuce: F11 pour plein écran · Touche 1-8 pour chaque réponse
        </div>
      </footer>

      {/* Audio elements (placez vos fichiers dans public/sounds/) */}
      <audio ref={clickAudioRef} src="/sounds/click.mp3" preload="auto" />
      <audio ref={bgAudioRef} src="/sounds/bg.mp3" preload="auto" />
      <audio ref={successAudioRef} src="/sounds/victory.mp3" preload="auto" />
      <audio ref={errorAudioRef} src="/sounds/error.mp3" preload="auto" />
      <audio ref={errorAltAudioRef} src="/sounds/erro.mp3" preload="auto" />
    </div>
  );
}


