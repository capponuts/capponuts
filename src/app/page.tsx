"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background:
          "radial-gradient(1200px 800px at 20% 10%, rgba(124,60,255,0.25), transparent 60%), radial-gradient(1000px 700px at 80% 20%, rgba(0,229,255,0.2), transparent 55%), radial-gradient(1200px 900px at 50% 90%, rgba(255,43,210,0.16), transparent 60%), #070311",
        backgroundImage:
          "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4,2,14,0.35) 0%, rgba(4,2,14,0.55) 50%, rgba(4,2,14,0.8) 100%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, padding: 24 }}>
        <h1
          className="neon-text"
          style={{
            fontSize: 84,
            letterSpacing: "0.06em",
            lineHeight: 1,
            textTransform: "uppercase",
            textShadow:
              "0 1px 0 #a688ff, 0 2px 0 #8e6dff, 0 3px 0 #7c3cff, 0 4px 10px rgba(124,60,255,0.6), 0 10px 30px rgba(0,229,255,0.3)",
          }}
        >
          Capponuts
        </h1>
        <p className="subtitle" style={{ marginTop: 12, fontSize: 18 }}>
          Univers néon · Gaming · Fun
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <Link className="btn-neon" href="/jeu">Jouer: Une Famille en Or</Link>
          <Link className="btn-neon" href="/jeu2">Jouer: Samedi Tout Est Permis</Link>
        </div>
      </div>
    </main>
  );
}
