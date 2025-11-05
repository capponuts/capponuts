import type { Metadata } from "next";
import Link from "next/link";
import { FAMILLE_QUESTIONS } from "@/data/famille";

export const metadata: Metadata = {
  title: "Une Famille en Or – Solutions",
  description: "Toutes les réponses pour l’animateur.",
  robots: { index: false, follow: false },
};

export default function Solutions() {
  return (
    <div className="container">
      <header className="header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="neon-text title">Solutions</h1>
          <p className="subtitle">Toutes les questions et réponses – réservé à l’animateur</p>
        </div>
        <Link className="btn-neon" href="/jeu">Aller au plateau</Link>
      </header>

      <main className="glass panel" style={{ padding: 20 }}>
        <section className="glass" style={{ padding: 16, marginBottom: 16 }}>
          <h2 className="neon-text" style={{ marginTop: 0 }}>Raccourcis animateur</h2>
          <ul style={{ marginLeft: 18, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 6 }}>
            <li>1–8: révéler/masquer la réponse correspondante</li>
            <li>A: tout révéler · R: réinitialiser la manche</li>
            <li>X: ajouter une croix rouge (joue <code>erro.mp3</code>)</li>
            <li>Z: retirer une croix rouge</li>
            <li>S: activer/couper le son</li>
            <li>M: musique ON/OFF</li>
            <li>N: manche suivante (enregistre le score cumulé + jingle)</li>
            <li>F: plein écran ON/OFF</li>
          </ul>
        </section>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {FAMILLE_QUESTIONS.map((q) => (
            <section key={q.id} className="glass" style={{ padding: 16 }}>
              <h2 className="neon-text" style={{ marginTop: 0 }}>Manche {q.id} – {q.question}</h2>
              <ol style={{ marginLeft: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                {q.answers.map((a, i) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span>{a.text}</span>
                    <strong className="neon-text">{a.points}</strong>
                  </li>
                ))}
              </ol>
              <div style={{ marginTop: 8 }}>
                <Link className="btn-neon" href={`/jeu/${q.id}`}>Afficher la manche</Link>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}


