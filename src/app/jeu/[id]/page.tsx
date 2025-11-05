"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FAMILLE_QUESTIONS } from "@/data/famille";

type Params = { params: { id: string } };

export default function JeuManche({ params }: Params) {
  const id = Number(params.id);
  const question = useMemo(() => FAMILLE_QUESTIONS.find((q) => q.id === id) || null, [id]);

  const [revealed, setRevealed] = useState<boolean[]>(() =>
    question ? Array(question.answers.length).fill(false) : []
  );

  useEffect(() => {
    if (!question) return;
    setRevealed(Array(question.answers.length).fill(false));
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
        setRevealed((r) => r.map((v, i) => (i === idx ? !v : v)));
      }
      if (e.key.toLowerCase() === "a") {
        // reveal all
        setRevealed(Array(question.answers.length).fill(true));
      }
      if (e.key.toLowerCase() === "r") {
        // reset
        setRevealed(Array(question.answers.length).fill(false));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question]);

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
                className={["tile", "glass", shown ? "active" : ""].join(" ")}
                onClick={() => setRevealed((r) => r.map((v, i) => (i === index ? !v : v)))}
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
          <button className="btn-neon" onClick={() => setRevealed(Array(question.answers.length).fill(true))}>Révéler tout</button>
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
    </div>
  );
}


