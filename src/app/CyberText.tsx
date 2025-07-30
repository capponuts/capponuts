'use client'

import { useState, useEffect } from 'react'

export default function CyberText() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  const letters = ['C', 'A', 'P', 'P', 'O', 'N', 'U', 'T', 'S']

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fond d'étoiles CSS */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Planètes CSS */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-60 animate-spin-slow planet-1"></div>
      <div className="absolute top-40 right-20 w-20 h-20 bg-red-500 rounded-full opacity-50 animate-pulse planet-2"></div>
      <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gray-300 rounded-full opacity-70 animate-bounce-slow planet-3"></div>

      {/* Éclairs CSS */}
      <div className="lightning lightning-1"></div>
      <div className="lightning lightning-2"></div>
      <div className="lightning lightning-3"></div>

      {/* Lettres CAPPONUTS */}
      <div className="absolute inset-0 flex items-center justify-center">
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
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 text-center">
        <div className="relative">
          {/* Effet de fumée verte */}
          <div className="absolute inset-0 bg-gradient-radial from-green-500/20 via-green-500/5 to-transparent blur-xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-conic from-green-400/10 via-transparent to-green-600/10 blur-lg animate-spin-slow"></div>
          
          {/* Texte */}
          <p className="relative text-green-300 text-base sm:text-lg md:text-xl font-mono tracking-[0.3em] opacity-90 animate-glow-text">
            I&apos;m inevitable...
          </p>
        </div>
      </div>

      {/* Informations */}
      <div className="absolute top-4 left-4 text-green-400 text-xs font-mono opacity-80 bg-black/70 p-3 rounded">
        <div>🎮 CAPPONUTS - Cyber Experience</div>
        <div>⚡ Pure CSS + Next.js</div>
        <div>🌟 Police Bitcount Style</div>
        <div>🪐 Système Solaire Animé</div>
      </div>
    </div>
  )
}