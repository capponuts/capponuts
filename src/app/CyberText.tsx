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
    
    // Fréquence du bip d'arcade (plus aiguë)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    // Enveloppe sonore rapide
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.type = 'square'; // Son carré typique des arcades
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    
    return oscillator;
  } catch {
    console.log('Audio not supported');
    return null;
  }
}

export default function CyberText() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const playerRef = useRef<YouTubePlayer | null>(null)

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
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

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
            start: 15, // Commence à 15 secondes
            playlist: '3w_A-qMxsDw' // Pour le loop
          },
          events: {
            onReady: (event: { target: YouTubePlayer }) => {
              event.target.mute()
              event.target.seekTo(15) // Force le démarrage à 15 secondes
              event.target.playVideo()
            }
          }
        })
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [isLoading])

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
    createArcadeBeep()
  }

  const letters = ['C', 'A', 'P', 'P', 'O', 'N', 'U', 'T', 'S']

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center z-50">
        <div className="text-center">
          {/* Logo CAPPONUTS pendant le chargement */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-green-400 glitch-text mb-4">
              CAPPONUTS
            </h1>
            <p className="text-green-300 text-sm sm:text-base font-mono tracking-widest opacity-80">
              CYBER EXPERIENCE
            </p>
          </div>

          {/* Barre de progression */}
          <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4">
            <div 
              className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 ease-out loading-bar"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Pourcentage */}
          <p className="text-green-400 font-mono text-lg">
            {Math.round(loadingProgress)}%
          </p>

          {/* Texte de chargement */}
          <div className="mt-6 text-green-300 font-mono text-sm opacity-60">
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

      {/* Éclairs CSS par-dessus la vidéo */}
      <div className="absolute inset-0 z-20">
        <div className="lightning lightning-1" />
        <div className="lightning lightning-2" />
        <div className="lightning lightning-3" />
      </div>

      {/* Container principal pour le contenu */}
      <div className="relative z-30 w-full h-full flex flex-col">
        {/* Lettres CAPPONUTS - Centré dans l'écran */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-7xl">
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
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Phrase "I'm inevitable..." - Positionnée en bas */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-40">
          <div className="relative text-center">
            {/* Effet de fumée verte */}
            <div className="absolute inset-0 bg-gradient-radial from-green-500/20 via-green-500/5 to-transparent blur-xl animate-pulse" />
            <div className="absolute inset-0 bg-gradient-conic from-green-400/10 via-transparent to-green-600/10 blur-lg animate-spin-slow" />
            
            {/* Texte */}
            <p className="relative text-green-300 text-base sm:text-lg md:text-xl lg:text-2xl font-mono tracking-[0.3em] opacity-90 animate-glow-text drop-shadow-lg px-4">
              I&apos;m inevitable...
            </p>
          </div>
        </div>

        {/* Bouton son en bas à droite avec ondes */}
        <div className="absolute bottom-8 right-8 z-40">
          <div className="relative">
            {/* Ondes sonores quand le son est activé */}
            {!isMuted && (
              <>
                <div className="absolute inset-0 border-2 border-green-400/30 rounded-full animate-ping-slow scale-150" />
                <div className="absolute inset-0 border-2 border-green-400/20 rounded-full animate-ping-slower scale-200" />
                <div className="absolute inset-0 border-2 border-green-400/10 rounded-full animate-ping-slowest scale-250" />
              </>
            )}
            
            {/* Bouton */}
            <button
              onClick={toggleMute}
              className="relative bg-black/80 text-green-400 p-4 rounded-full hover:bg-black/90 transition-all duration-300 backdrop-blur-sm hover:scale-110 flex items-center justify-center border border-green-400/30"
              aria-label={isMuted ? "Activer le son" : "Désactiver le son"}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}