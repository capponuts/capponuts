"use client";

import { useEffect, useRef, useState } from "react";

export default function DoomPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState(0);

  // Intro animation
  useEffect(() => {
    if (!showIntro) return;

    const timers = [
      setTimeout(() => setIntroPhase(1), 1500),
      setTimeout(() => setIntroPhase(2), 3000),
      setTimeout(() => setShowIntro(false), 4500),
    ];

    const skipIntro = () => setShowIntro(false);
    window.addEventListener("keydown", skipIntro);
    window.addEventListener("click", skipIntro);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skipIntro);
      window.removeEventListener("click", skipIntro);
    };
  }, [showIntro]);

  // Load js-dos
  useEffect(() => {
    if (showIntro) return;

    const loadJsDos = async () => {
      try {
        setProgress(10);

        // Load js-dos from CDN
        const script = document.createElement("script");
        script.src = "https://js-dos.com/v8/latest/js-dos.js";
        script.async = true;

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load js-dos"));
          document.head.appendChild(script);
        });

        setProgress(30);

        // Wait for Dos to be available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Dos = (window as any).Dos;
        if (!Dos) {
          throw new Error("js-dos not loaded properly");
        }

        setProgress(50);

        // Create DOS instance
        if (rootRef.current) {
          setProgress(70);

          const dos = Dos(rootRef.current, {
            style: "none",
            noSideBar: true,
            noFullscreen: false,
            noSocialLinks: true,
          });

          setProgress(90);

          // Load Doom bundle
          await dos.run("/doom/doom.jsdos");

          setProgress(100);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading Doom:", err);
        setError(err instanceof Error ? err.message : "Failed to load Doom");
        setLoading(false);
      }
    };

    loadJsDos();
  }, [showIntro]);

  // Intro screen
  if (showIntro) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
        <style jsx global>{`
          @keyframes doom-pulse {
            0% { transform: scale(1); filter: brightness(1); }
            100% { transform: scale(1.03); filter: brightness(1.4); }
          }
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}</style>

        {introPhase === 0 && (
          <div className="text-center animate-pulse">
            <div
              className="text-red-700 text-4xl font-bold tracking-[0.4em]"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              id Software
            </div>
            <div className="text-gray-600 text-lg mt-3">presents</div>
          </div>
        )}

        {introPhase === 1 && (
          <div className="text-center">
            <div className="text-gray-500 text-xl">A</div>
            <div
              className="text-red-600 text-3xl font-bold my-3"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              CAPPONUTS
            </div>
            <div className="text-gray-500 text-xl">experience</div>
          </div>
        )}

        {introPhase >= 2 && (
          <div className="text-center">
            <div
              style={{
                fontFamily: "Impact, sans-serif",
                fontSize: "min(20vw, 140px)",
                color: "#8B0000",
                textShadow: `
                  0 0 20px #FF0000,
                  0 0 40px #FF0000,
                  0 0 60px #FF0000,
                  6px 6px 0 #000,
                  -3px -3px 0 #000
                `,
                letterSpacing: "0.1em",
                animation: "doom-pulse 0.4s ease-in-out infinite alternate",
              }}
            >
              DOOM
            </div>
            <div
              className="text-gray-500 text-lg mt-6"
              style={{ animation: "flicker 1s infinite" }}
            >
              Press any key to start...
            </div>
          </div>
        )}
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-center p-8">
        <div
          className="text-red-600 text-4xl mb-6"
          style={{ fontFamily: "Impact, sans-serif" }}
        >
          ERROR
        </div>
        <div className="text-gray-400 text-lg mb-4">{error}</div>
        <div className="text-gray-600 text-sm max-w-md">
          Le chargement de DOSBox a échoué. Essaie de rafraîchir la page ou
          vérifie ta connexion internet.
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-red-900 hover:bg-red-700 text-white font-bold"
          style={{ fontFamily: "Impact, sans-serif" }}
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div
            className="text-red-700 text-3xl mb-8"
            style={{ fontFamily: "Impact, sans-serif", letterSpacing: "0.1em" }}
          >
            LOADING DOOM...
          </div>

          {/* Progress bar */}
          <div className="w-80 h-6 bg-gray-900 border-2 border-gray-700 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(180deg, #8B0000 0%, #5C0000 50%, #3A0000 100%)",
                boxShadow: "0 0 10px #FF0000",
              }}
            />
          </div>

          <div className="text-gray-500 mt-4 text-sm">
            {progress < 30 && "Initializing DOSBox..."}
            {progress >= 30 && progress < 50 && "Loading emulator..."}
            {progress >= 50 && progress < 70 && "Preparing environment..."}
            {progress >= 70 && progress < 90 && "Loading DOOM.WAD..."}
            {progress >= 90 && "Starting game..."}
          </div>

          <div className="text-gray-600 text-xs mt-8">
            DOOM Shareware © 1993 id Software
          </div>
        </div>
      )}

      {/* js-dos container */}
      <div
        ref={rootRef}
        className="w-full h-full"
        style={{
          maxWidth: "960px",
          maxHeight: "720px",
          aspectRatio: "4/3",
        }}
      />

      {/* Controls hint */}
      {!loading && (
        <div className="absolute bottom-4 left-4 text-gray-600 text-xs bg-black/80 px-3 py-2 rounded">
          <div className="font-bold text-gray-400 mb-1">Contrôles:</div>
          <div>↑↓←→ ou WASD: Se déplacer</div>
          <div>Ctrl: Tirer | Space: Ouvrir | Shift: Courir</div>
          <div>1-7: Armes | Tab: Carte | Esc: Menu</div>
        </div>
      )}

      {/* Fullscreen button */}
      {!loading && (
        <button
          onClick={() => {
            if (rootRef.current) {
              rootRef.current.requestFullscreen?.();
            }
          }}
          className="absolute top-4 right-4 px-4 py-2 bg-red-900/80 hover:bg-red-700 text-white text-sm font-bold rounded"
          style={{ fontFamily: "Impact, sans-serif" }}
        >
          FULLSCREEN
        </button>
      )}
    </div>
  );
}
