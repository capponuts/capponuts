"use client";

import { useEffect, useState } from "react";
import CyberText from "./CyberText";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Optionnel: pour rejouer l'intro à chaque visite, on garde showIntro à true par défaut
    // Si vous souhaitez ne la jouer qu'une fois par session:
    // const seen = sessionStorage.getItem("intro_seen");
    // setShowIntro(!seen);
  }, []);

  return (
    <>
      {showIntro && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            src="/intro.mp4"
            playsInline
            muted
            autoPlay
            onEnded={() => {
              // sessionStorage.setItem("intro_seen", "1");
              setShowIntro(false);
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <main className="min-h-screen">
        <CyberText />
      </main>
    </>
  );
}
