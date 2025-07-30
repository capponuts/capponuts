'use client'

import { useState, useEffect, useRef } from 'react'

// Types pour l'API YouTube
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
}

interface YouTubePlayer {
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  playVideo: () => void;
  destroy: () => void;
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
  }
}

export default function CyberText() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
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

  useEffect(() => {
    // Charger l'API YouTube
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
          playlist: '3w_A-qMxsDw' // Pour le loop
        },
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            event.target.mute()
            event.target.playVideo()
          }
        }
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  const letters = ['C', 'A', 'P', 'P', 'O', 'N', 'U', 'T', 'S']

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Vidéo YouTube en arrière-plan */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          id="youtube-player"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '100vw',
            height: '56.25vw', // 16:9 aspect ratio
            minHeight: '100vh',
            minWidth: '177.78vh', // 16:9 aspect ratio
          }}
        ></div>
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Éclairs CSS par-dessus la vidéo */}
      <div className="lightning lightning-1 z-10"></div>
      <div className="lightning lightning-2 z-10"></div>
      <div className="lightning lightning-3 z-10"></div>

      {/* Lettres CAPPONUTS */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="flex space-x-2 sm:space-x-4">
          {letters.map((letter, index) => (
            <div
              key={index}
              className="cyber-letter"
              style={{
                transform: `
                  perspective(1000px) 
                  rotateX(${mousePosition.y * 0.1 - 5}deg) 
                  rotateY(${mousePosition.x * 0.1 - 5}deg)
                  translateZ(${Math.sin(Date.now() * 0.001 + index) * 10}px)
                `,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>

      {/* Phrase "I'm inevitable..." */}
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 text-center z-20">
        <div className="relative">
          {/* Effet de fumée verte */}
          <div className="absolute inset-0 bg-gradient-radial from-green-500/20 via-green-500/5 to-transparent blur-xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-conic from-green-400/10 via-transparent to-green-600/10 blur-lg animate-spin-slow"></div>
          
          {/* Texte */}
          <p className="relative text-green-300 text-base sm:text-lg md:text-xl font-mono tracking-[0.3em] opacity-90 animate-glow-text drop-shadow-lg">
            I&apos;m inevitable...
          </p>
        </div>
      </div>

      {/* Informations */}
      <div className="absolute top-4 left-4 text-green-400 text-xs font-mono opacity-80 bg-black/70 p-3 rounded z-30">
        <div>🎮 CAPPONUTS - Cyber Experience</div>
        <div>🎬 Space Video Background</div>
        <div>⚡ Pure CSS + Next.js</div>
        <div>🌟 Police Orbitron Style</div>
      </div>

      {/* Bouton pour contrôler le son (optionnel) */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => {
            if (playerRef.current) {
              if (playerRef.current.isMuted()) {
                playerRef.current.unMute()
              } else {
                playerRef.current.mute()
              }
            }
          }}
          className="bg-black/70 text-green-400 p-2 rounded hover:bg-black/90 transition-colors"
        >
          🔊
        </button>
      </div>
    </div>
  )
}