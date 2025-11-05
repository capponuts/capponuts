import Link from "next/link";
import type { Metadata } from "next";
import { FAMILLE_QUESTIONS } from "@/data/famille";

export const metadata: Metadata = {
  title: "Une Famille en Or – Plateau",
  description: "Sélection des manches du jeu pour affichage TV.",
};

export default function JeuIndex() {
  const EMOJIS = ["🎉","🍕","🚀","🧠","🎮","🎤","🍀","🔥","🌟","🧩","🎯","🍀"]; // boucle
  return (
    <div className="container">
      <header className="header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="neon-text title">Une Famille en Or</h1>
          <p className="subtitle">Sélectionnez une manche à afficher sur la TV</p>
        </div>
        <Link className="btn-neon pulse-ring" href="/jeu/1">Démarrer</Link>
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
        <h2 className="neon-text" style={{ marginTop: 0, fontSize: 28 }}>Manches disponibles</h2>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 20,
            maxWidth: 1600,
            margin: "16px auto 0",
            width: "100%",
          }}
        >
          {FAMILLE_QUESTIONS.map((q, idx) => (
            <Link key={q.id} href={`/jeu/${q.id}`} className="tile glass" style={{ textDecoration: "none", padding: 20, minHeight: 120 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span className="neon-text" style={{ fontSize: 22 }}>
                  <span aria-hidden="true" style={{ marginRight: 8 }}>{EMOJIS[idx % EMOJIS.length]}</span>
                  Manche {q.id}
                </span>
                <span style={{ color: "#b7b7b7", fontSize: 16 }}>{q.question}</span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 24, color: "#9fa3a9", textAlign: "center" }}>
          Astuce: passez en plein écran (F11) pour l’affichage TV.
        </div>
      </main>
    </div>
  );
}


