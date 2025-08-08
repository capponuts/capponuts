'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Volume2, VolumeX, FolderOpen, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function CyberText({ onSelectProject }: { onSelectProject?: (projectId: string) => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [showProjects, setShowProjects] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Fermer le popup avec Echap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowProjects(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
    // Option anti-logs: si adblock bloque, on tombe en fond statique
    if (isLoading) return
    let cancelled = false
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    const loadYT = () => {
      if (cancelled) return
      if (typeof window.YT !== 'undefined') {
        try {
          playerRef.current = new window.YT.Player('youtube-player', {
            videoId: '3w_A-qMxsDw',
            playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, loop: 1, modestbranding: 1, playsinline: 1, rel: 0, showinfo: 0, mute: 1, start: 20, playlist: '3w_A-qMxsDw' },
            events: { onReady: (event: { target: YouTubePlayer }) => { try { event.target.mute(); event.target.seekTo(20); event.target.playVideo() } catch {} } },
          })
        } catch {
          // ignore si bloqué
        }
        return
      }
      window.onYouTubeIframeAPIReady = loadYT
      if (!existing) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        tag.async = true
        document.head.appendChild(tag)
      }
    }
    // Si adblock empêche, on n'affiche pas d'erreurs bloquantes
    try { loadYT() } catch {}

    return () => {
      cancelled = true
      try { playerRef.current?.destroy() } catch {}
      window.onYouTubeIframeAPIReady = () => {}
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
    if (playerRef.current) {
      if (playerRef.current.isMuted()) {
        playerRef.current.unMute()
        setIsMuted(false)
      } else {
        playerRef.current.mute()
        setIsMuted(true)
      }
    }
  }

  const playArcadeBeep = () => {
    // Activer le son au premier clic utilisateur si nécessaire
    if (!soundEnabled) {
      setSoundEnabled(true)
    }
    
    if (soundEnabled) {
      createArcadeBeep()
    }
  }

  const enableSound = () => {
    setSoundEnabled(true)
    createArcadeBeep() // Test du son
  }

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
                  onMouseEnter={playArcadeBeep}
                  onClick={playArcadeBeep}
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
                    toggleMute()
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

            {/* Bouton Projects sous le volume (thème cyber) */}
            <div className="flex justify-center mt-6">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  enableSound()
                  setTimeout(() => setShowProjects(true), 0)
                }}
                className="relative inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-400/60 text-cyan-100 bg-black/40 backdrop-blur-sm hover:bg-black/55 transition-all duration-200 shadow-[0_0_14px_rgba(34,211,238,0.2)] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-haspopup="dialog"
                aria-controls="projects-dialog"
              >
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 via-purple-400/10 to-pink-500/10 blur"></span>
                <FolderOpen size={18} className="relative z-10 text-cyan-300" />
                <span className="relative z-10 tracking-[0.25em] font-mono text-sm">PROJECTS</span>
              </motion.button>
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

        {/* Popup Projects */}
        {mounted && createPortal(
          <AnimatePresence>
            {showProjects && (
              <motion.div
                className="fixed inset-0 z-[9999] grid place-items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProjects(false)} />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="projects-title"
                  id="projects-dialog"
                  initial={{ y: -16, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -12, opacity: 0, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className="relative w-full max-w-md rounded-xl border border-cyan-500/25 bg-[#0b0b12]/90 p-4 shadow-[0_0_24px_rgba(34,211,238,0.25)] pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 id="projects-title" className="text-cyan-200 tracking-widest font-mono text-sm">PROJECTS</h3>
                    <button onClick={() => setShowProjects(false)} className="text-cyan-300/80 hover:text-pink-300 transition" aria-label="Close projects">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setShowProjects(false)
                        if (onSelectProject) onSelectProject('saloon')
                      }}
                      className="w-full text-left px-3 py-3 rounded-lg border border-purple-400/30 bg-black/40 hover:bg-black/55 text-purple-100 transition flex items-center justify-between"
                    >
                      <span className="font-mono tracking-widest text-sm">Saloon</span>
                      <span className="text-[10px] text-purple-300/80">3D</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </div>
  )
}