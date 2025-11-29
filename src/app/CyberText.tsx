'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

// Types pour l'API YouTube
interface YouTubePlayerVars {
  autoplay?: number;
  controls?: number;
  disablekb?: number;
  fs?: number;
  iv_load_policy?: number;
  loop?: number;
  modestbranding?: number;
  playsinline?: number;
  rel?: number;
  showinfo?: number;
  mute?: number;
  playlist?: string;
  start?: number;
}

interface YouTubePlayer {
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  playVideo: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy: () => void;
  seekTo: (seconds: number) => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: {
        videoId: string;
        playerVars: YouTubePlayerVars;
        events: {
          onReady: (event: { target: YouTubePlayer }) => void;
        };
      }) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady: () => void;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

// Générateur de son de bip d'arcade synthétique
function createArcadeBeep() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Fréquence du bip d'arcade moins aiguë
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
    
    // Enveloppe sonore rapide
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    
    oscillator.type = 'square'; // Son carré typique des arcades
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
    
    return oscillator;
  } catch {
    console.log('Audio not supported');
    return null;
  }
}

export default function CyberText() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("home_muted");
      return raw === null ? true : raw === "true";
    } catch {
      return true;
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [volume, setVolume] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("home_volume");
      const v = raw ? Math.max(0, Math.min(100, Number(raw))) : 20;
      return Number.isFinite(v) ? v : 20;
    } catch {
      return 20;
    }
  })
  const playerRef = useRef<YouTubePlayer | null>(null)
  const customAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Forcer le silence à l'arrivée (aucun son autoplay)
  useEffect(() => {
    try { localStorage.setItem("home_muted", "true"); } catch {}
    setIsMuted(true);
    const a = customAudioRef.current;
    if (a) {
      try {
        a.pause();
        a.currentTime = 0;
        a.muted = true;
      } catch {}
    }
  }, []);

  // Animation de chargement
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500) // Délai pour l'animation de sortie
          return 100
        }
        // Progression non-linéaire pour effet plus réaliste
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Charger l'API YouTube après le chargement
    if (!isLoading) {
      // Éviter le double-inject si la page se réhydrate
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (!existing) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        tag.async = true
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      }

      // Fonction globale requise par l'API YouTube
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: '3w_A-qMxsDw',
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            mute: 1,
            start: 20, // Commence à 20 secondes
            playlist: '3w_A-qMxsDw' // Pour le loop
          },
          events: {
            onReady: (event: { target: YouTubePlayer }) => {
              // Toujours rester en muet pour respecter l'autoplay et ne pas perturber le système
              event.target.mute()
              event.target.seekTo(20) // Force le démarrage à 20 secondes
              event.target.playVideo()
              // On ne dé-mute plus la vidéo YouTube. Le son est géré par un audio séparé.
            }
          }
        })
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {}
      }
    }
  }, [isLoading])

  // Raccourci clavier global: touche "m" pour mute/unmute
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        enableSound()
        toggleMute()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const toggleMute = () => {
    // Laisser la vidéo YouTube muette. Utiliser un audio séparé.
    const a = customAudioRef.current;
    if (!a) return;
    if (isMuted) {
      try {
        a.muted = false;
        a.volume = Math.max(0, Math.min(1, volume / 100));
        void a.play();
      } catch {}
      setIsMuted(false);
      try { localStorage.setItem("home_muted", "false"); } catch {}
    } else {
      try {
        a.pause();
        a.muted = true;
      } catch {}
      setIsMuted(true);
      try { localStorage.setItem("home_muted", "true"); } catch {}
    }
  }

  const playArcadeBeep = () => {
    // Désactivé pour éviter d'interférer avec l'audio global
  }

  const enableSound = () => {
    setSoundEnabled(true)
    // Ne pas forcer un bip immédiat (évite d'impacter les sons système)
    // L'utilisateur entendra la vidéo une fois le mute levé
  }

  // Persistance du volume utilisateur (si on ajoute un contrôle plus tard)
  useEffect(() => {
    try { localStorage.setItem("home_volume", String(volume)); } catch {}
    const a = customAudioRef.current;
    if (a && !isMuted) {
      try { a.volume = Math.max(0, Math.min(1, volume / 100)); } catch {}
    }
  }, [volume, isMuted])

  const letters = ['C', 'A', 'P', 'P', 'O', 'N', 'U', 'T', 'S']

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center z-50">
        <div className="text-center">
          {/* Logo CAPPONUTS pendant le chargement */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-cyan-400 glitch-text mb-4">
              CAPPONUTS
            </h1>
            <p className="text-purple-300 text-sm sm:text-base font-mono tracking-widest opacity-80">
              CYBER EXPERIENCE
            </p>
          </div>

          {/* Barre de progression */}
          <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(loadingProgress)}>
            <div 
              className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 ease-out loading-bar"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Pourcentage */}
          <p className="text-cyan-400 font-mono text-lg" aria-live="polite">
            {Math.round(loadingProgress)}%
          </p>

          {/* Texte de chargement */}
          <div className="mt-6 text-purple-300 font-mono text-sm opacity-60" aria-live="polite">
            <div className="loading-dots">
              Initialisation du système
              <span className="animate-pulse">...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden fade-in">
      {/* Vidéo YouTube en arrière-plan */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div 
          id="youtube-player"
          className="absolute top-1/2 left-1/2 w-screen h-screen"
          style={{
            transform: 'translate(-50%, -50%)',
            width: 'max(100vw, 177.78vh)',
            height: 'max(100vh, 56.25vw)',
          }}
        />
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>
      {/* Audio séparé pour la musique d'accueil */}
      <audio ref={customAudioRef} src="/sounds/kapponutss.mp3" preload="auto" loop muted />
      {/* Fallback vers le nom de fichier au root si besoin */}
      {/* <audio ref={customAudioRef} src="/Kapponutss.mp3" preload="auto" loop muted /> */}

      {/* Container principal pour le contenu */}
      <div className="relative z-30 w-full h-full flex flex-col">
        {/* Lettres CAPPONUTS - Centré dans l'écran */}
            <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            {/* CAPPONUTS */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-7xl mb-8">
              {letters.map((letter, index) => (
                <div
                  key={index}
                  className="cyber-letter-glitch select-none"
                  style={{
                    transform: `
                      perspective(1000px) 
                      rotateX(${mousePosition.y * 0.1 - 5}deg) 
                      rotateY(${mousePosition.x * 0.1 - 5}deg)
                      translateZ(${Math.sin(Date.now() * 0.001 + index) * 10}px)
                    `,
                    animationDelay: `${index * 0.1}s`,
                  }}
                      // bip désactivé pour stabilité audio
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Bouton volume descendu sous CAPPONUTS */}
            <div className="flex justify-center mt-12">
              <div className="relative flex items-center justify-center">
                {/* Ondes d'eau qui se propagent quand le son est activé */}
                {!isMuted && (
                  <>
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 animate-water-wave-1" />
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400 animate-water-wave-2" />
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-400 animate-water-wave-3" />
                  </>
                )}
                
                {/* Bouton volume transparent avec grosse icône */}
                <button
                  onClick={() => {
                    enableSound()
                    // Démarre la piste audio custom (YouTube reste muet)
                    const a = customAudioRef.current;
                    if (a) {
                      try {
                        a.muted = false;
                        a.volume = Math.max(0, Math.min(1, volume / 100));
                        a.currentTime = 0;
                        void a.play();
                        setIsMuted(false);
                        try { localStorage.setItem("home_muted", "false"); } catch {}
                      } catch {}
                    } else {
                      // fallback au comportement précédent si jamais
                      toggleMute();
                    }
                  }}
                  className="cyber-volume-button group relative p-4 z-10"
                  aria-label={isMuted ? "Activer le son" : "Désactiver le son"}
                  aria-pressed={!isMuted}
                  title={isMuted ? "Activer le son (M)" : "Désactiver le son (M)"}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      enableSound()
                      toggleMute()
                    }
                  }}
                >
                  {/* Effet néon autour de l'icône */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-400/15 to-pink-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  
                  {/* Grosse icône sur fond transparent */}
                  {isMuted ? 
                    <VolumeX size={40} className="relative text-cyan-400 group-hover:text-purple-400 transition-all duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] group-hover:scale-110" /> : 
                    <Volume2 size={40} className="relative text-cyan-400 group-hover:text-purple-400 transition-all duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] group-hover:scale-110" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Phrase "I'm inevitable..." - Positionnée en bas */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-40">
          <div className="relative text-center">
            {/* Effet de fumée cyberpunk */}
            <div className="absolute inset-0 bg-gradient-radial from-pink-500/20 via-purple-500/5 to-transparent blur-xl animate-pulse" />
            <div className="absolute inset-0 bg-gradient-conic from-cyan-400/10 via-transparent to-pink-600/10 blur-lg animate-spin-slow" />
            
            {/* Texte */}
            <p className="relative text-pink-300 text-base sm:text-lg md:text-xl lg:text-2xl font-mono tracking-[0.3em] opacity-90 animate-glow-text drop-shadow-lg px-4" role="text">
              I&apos;m inevitable...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}