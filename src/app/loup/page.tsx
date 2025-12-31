"use client";

import { useRef, useState, useCallback } from "react";

type SoundButton = {
  id: string;
  label: string;
  file: string;
  icon: string;
  category: "ambiance" | "role" | "effet";
  color: string;
  loop?: boolean;
};

const SOUNDS: SoundButton[] = [
  // Ambiances
  {
    id: "nuit",
    label: "Ambiance Nuit",
    file: "/soundbox/nuit.mp3",
    icon: "🌙",
    category: "ambiance",
    color: "#1e3a5f",
    loop: true,
  },
  {
    id: "jour",
    label: "Ambiance Jour",
    file: "/soundbox/jour.mp3",
    icon: "☀️",
    category: "ambiance",
    color: "#c9a227",
    loop: true,
  },
  {
    id: "hurlement",
    label: "Hurlement de Loup",
    file: "/soundbox/hurlement.mp3",
    icon: "🐺",
    category: "effet",
    color: "#4a1a1a",
  },
  {
    id: "tension",
    label: "Tension",
    file: "/soundbox/tension.mp3",
    icon: "😰",
    category: "effet",
    color: "#2d1f3d",
  },
  {
    id: "mort",
    label: "Mort",
    file: "/soundbox/mort.mp3",
    icon: "💀",
    category: "effet",
    color: "#1a1a1a",
  },
  // Rôles - Village s'endort
  {
    id: "village-dort",
    label: "Le village s'endort",
    file: "/soundbox/village-dort.mp3",
    icon: "😴",
    category: "role",
    color: "#2c3e50",
  },
  {
    id: "village-reveille",
    label: "Le village se réveille",
    file: "/soundbox/village-reveille.mp3",
    icon: "🏘️",
    category: "role",
    color: "#e67e22",
  },
  // Rôles - Nuit
  {
    id: "loups",
    label: "Les Loups se réveillent",
    file: "/soundbox/loups.mp3",
    icon: "🐺",
    category: "role",
    color: "#8b0000",
  },
  {
    id: "loups-cible",
    label: "Quelle cible ?",
    file: "/soundbox/loups-cible.mp3",
    icon: "🎯",
    category: "role",
    color: "#a00000",
  },
  {
    id: "loups-dort",
    label: "Les Loups s'endorment",
    file: "/soundbox/loups-dort.mp3",
    icon: "🐺💤",
    category: "role",
    color: "#5c0000",
  },
  {
    id: "voyante",
    label: "La Voyante se réveille",
    file: "/soundbox/voyante.mp3",
    icon: "🔮",
    category: "role",
    color: "#6a0dad",
  },
  {
    id: "voyante-identite",
    label: "Quelle identité ?",
    file: "/soundbox/voyante-identite.mp3",
    icon: "❓",
    category: "role",
    color: "#8b00db",
  },
  {
    id: "voyante-dort",
    label: "La Voyante s'endort",
    file: "/soundbox/voyante-dort.mp3",
    icon: "🔮💤",
    category: "role",
    color: "#4a0080",
  },
  {
    id: "sorciere",
    label: "La Sorcière se réveille",
    file: "/soundbox/sorciere.mp3",
    icon: "🧙‍♀️",
    category: "role",
    color: "#228b22",
  },
  {
    id: "sorciere-vie",
    label: "Potion de Vie",
    file: "/soundbox/sorciere-vie.mp3",
    icon: "💚",
    category: "role",
    color: "#32cd32",
  },
  {
    id: "sorciere-mort",
    label: "Potion de Mort",
    file: "/soundbox/sorciere-mort.mp3",
    icon: "☠️",
    category: "role",
    color: "#2f4f2f",
  },
  {
    id: "sorciere-dort",
    label: "La Sorcière s'endort",
    file: "/soundbox/sorciere-dort.mp3",
    icon: "🧙‍♀️💤",
    category: "role",
    color: "#145214",
  },
  {
    id: "cupidon",
    label: "Cupidon se réveille",
    file: "/soundbox/cupidon.mp3",
    icon: "💘",
    category: "role",
    color: "#ff69b4",
  },
  {
    id: "cupidon-fleches",
    label: "Tire deux flèches",
    file: "/soundbox/cupidon-fleches.mp3",
    icon: "💕",
    category: "role",
    color: "#ff1493",
  },
  {
    id: "cupidon-dort",
    label: "Cupidon s'endort",
    file: "/soundbox/cupidon-dort.mp3",
    icon: "💘💤",
    category: "role",
    color: "#c71585",
  },
  {
    id: "chasseur",
    label: "Le Chasseur tire",
    file: "/soundbox/chasseur.mp3",
    icon: "🏹",
    category: "role",
    color: "#8b4513",
  },
  // Effets additionnels
  {
    id: "vote",
    label: "Vote du village",
    file: "/soundbox/vote.mp3",
    icon: "🗳️",
    category: "effet",
    color: "#2980b9",
  },
  {
    id: "gong",
    label: "Gong",
    file: "/soundbox/gong.mp3",
    icon: "🔔",
    category: "effet",
    color: "#d4af37",
  },
];

export default function LoupPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [loopPlaying, setLoopPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loopAudioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.8);

  const playSound = useCallback(
    (sound: SoundButton) => {
      // Si c'est un son en loop (ambiance)
      if (sound.loop) {
        // Si c'est le même qui joue, on l'arrête
        if (loopPlaying === sound.id) {
          loopAudioRef.current?.pause();
          loopAudioRef.current = null;
          setLoopPlaying(null);
          return;
        }

        // Arrêter l'ancien loop
        if (loopAudioRef.current) {
          loopAudioRef.current.pause();
        }

        // Jouer le nouveau
        const audio = new Audio(sound.file);
        audio.loop = true;
        audio.volume = volume;
        audio.play().catch(() => {});
        loopAudioRef.current = audio;
        setLoopPlaying(sound.id);
      } else {
        // Son one-shot
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(sound.file);
        audio.volume = volume;
        audio.play().catch(() => {});
        audioRef.current = audio;
        setPlaying(sound.id);

        audio.onended = () => setPlaying(null);
      }
    },
    [volume, loopPlaying]
  );

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (loopAudioRef.current) {
      loopAudioRef.current.pause();
      loopAudioRef.current = null;
    }
    setPlaying(null);
    setLoopPlaying(null);
  }, []);

  const ambiances = SOUNDS.filter((s) => s.category === "ambiance");
  const roles = SOUNDS.filter((s) => s.category === "role");
  const effets = SOUNDS.filter((s) => s.category === "effet");

  return (
    <div
      className="min-h-screen p-4 pb-24"
      style={{
        background: "linear-gradient(180deg, #0a0a15 0%, #1a1a2e 50%, #16213e 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            color: "#c9a227",
            textShadow: "0 0 20px rgba(201, 162, 39, 0.5)",
            fontFamily: "Georgia, serif",
          }}
        >
          🐺 Loup Garou Soundbox 🌙
        </h1>
        <p className="text-gray-500 text-sm">Touche un bouton pour jouer le son</p>
      </div>

      {/* Volume control */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-2xl">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
            if (loopAudioRef.current) loopAudioRef.current.volume = v;
          }}
          className="w-32 h-2 rounded-lg appearance-none cursor-pointer"
          style={{ background: "linear-gradient(to right, #c9a227, #4a1a1a)" }}
        />
        <span className="text-2xl">🔊</span>
      </div>

      {/* Stop All button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={stopAll}
          className="px-6 py-3 rounded-xl text-white font-bold text-lg active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #8b0000, #5c0000)",
            boxShadow: "0 4px 15px rgba(139, 0, 0, 0.4)",
          }}
        >
          ⏹️ STOP TOUT
        </button>
      </div>

      {/* Ambiances */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
          <span>🎵</span> Ambiances (boucle)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {ambiances.map((sound) => (
            <SoundButtonComponent
              key={sound.id}
              sound={sound}
              isPlaying={loopPlaying === sound.id}
              onClick={() => playSound(sound)}
            />
          ))}
        </div>
      </section>

      {/* Rôles */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
          <span>🎭</span> Annonces de rôles
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((sound) => (
            <SoundButtonComponent
              key={sound.id}
              sound={sound}
              isPlaying={playing === sound.id}
              onClick={() => playSound(sound)}
            />
          ))}
        </div>
      </section>

      {/* Effets */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
          <span>💥</span> Effets sonores
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {effets.map((sound) => (
            <SoundButtonComponent
              key={sound.id}
              sound={sound}
              isPlaying={playing === sound.id}
              onClick={() => playSound(sound)}
            />
          ))}
        </div>
      </section>

      {/* Info */}
      <div className="text-center text-gray-600 text-xs mt-8 px-4">
        <p className="mb-2">📂 Ajoute tes sons MP3 dans <code className="bg-gray-800 px-1 rounded">public/soundbox/</code></p>
        <p>Noms attendus : nuit.mp3, jour.mp3, hurlement.mp3, loups.mp3, voyante.mp3, sorciere.mp3, etc.</p>
      </div>
    </div>
  );
}

function SoundButtonComponent({
  sound,
  isPlaying,
  onClick,
}: {
  sound: SoundButton;
  isPlaying: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative p-4 rounded-xl text-white font-medium text-sm active:scale-95 transition-all duration-150 overflow-hidden"
      style={{
        background: isPlaying
          ? `linear-gradient(135deg, ${sound.color}, ${adjustColor(sound.color, 40)})`
          : `linear-gradient(135deg, ${sound.color}, ${adjustColor(sound.color, -20)})`,
        boxShadow: isPlaying
          ? `0 0 20px ${sound.color}, inset 0 0 20px rgba(255,255,255,0.1)`
          : `0 4px 15px ${sound.color}40`,
        border: isPlaying ? "2px solid rgba(255,255,255,0.5)" : "2px solid transparent",
      }}
    >
      {/* Pulse animation when playing */}
      {isPlaying && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: `${sound.color}40` }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-2xl">{sound.icon}</span>
        <span className="leading-tight">{sound.label}</span>
        {isPlaying && sound.loop && (
          <span className="text-xs opacity-70">▶ En cours...</span>
        )}
      </div>
    </button>
  );
}

// Helper to lighten/darken color
function adjustColor(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

