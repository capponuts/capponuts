import Link from "next/link";
import type { Metadata } from "next";
import { FAMILLE_QUESTIONS } from "@/data/famille";

export const metadata: Metadata = {
  title: "Une Famille en Or – Plateau",
  description: "Sélection des manches du jeu pour affichage TV.",
};

export default function JeuIndex() {
  return (
    <div className="container">
      <header className="header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="neon-text title">Une Famille en Or</h1>
          <p className="subtitle">Sélectionnez une manche à afficher sur la TV</p>
        </div>
        <Link className="btn-neon pulse-ring" href="/jeu/1">Démarrer</Link>
      </header>

      <main className="glass panel" style={{ padding: 20 }}>
        <h2 className="neon-text" style={{ marginTop: 0 }}>Manches disponibles</h2>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {FAMILLE_QUESTIONS.map((q) => (
            <Link key={q.id} href={`/jeu/${q.id}`} className="tile glass" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="neon-text" style={{ fontSize: 18 }}>Manche {q.id}</span>
                <span style={{ color: "#b7b7b7" }}>{q.question}</span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 20, color: "#9fa3a9" }}>
          Astuce: passez en plein écran (F11) pour l’affichage TV.
        </div>
      </main>
    </div>
  );
}


