import Link from "next/link";
import type { Metadata } from "next";
import { MINI_GAMES } from "@/data/jeu2";

export const metadata: Metadata = {
  title: "Samedi Tout Est Permis – Mini‑jeux",
  description: "Sélectionnez un mini‑jeu pour lancer la soirée.",
};

export default function Jeu2Index() {
  return (
    <div className="container">
      <header className="header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="neon-text title">Samedi Tout Est Permis</h1>
          <p className="subtitle">Mini‑jeux d’ambiance – Buzzer, TV, improvisation</p>
        </div>
        <Link className="btn-neon" href={`/jeu2/${MINI_GAMES[0].slug}`}>Démarrer</Link>
      </header>

      <main className="glass panel" style={{ padding: 24 }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20, maxWidth: 1600, margin: "0 auto" }}>
          {MINI_GAMES.map((g) => (
            <Link key={g.slug} href={`/jeu2/${g.slug}`} className="tile glass" style={{ textDecoration: "none", padding: 20, minHeight: 140 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span className="neon-text" style={{ fontSize: 22 }}>
                  <span aria-hidden style={{ marginRight: 8 }}>{g.emoji}</span>
                  {g.title}
                </span>
                <span style={{ color: "#b7b7b7", fontSize: 16 }}>{g.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}


