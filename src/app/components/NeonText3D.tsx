'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

// URLs pour vos vraies images d'espace 4K (remplacez ces liens par vos images)
const YOUR_SPACE_IMAGES = {
  background: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&crop=center&q=80', // REMPLACEZ par votre fond d'espace
  nebula1: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=512&h=512&fit=crop&crop=center&q=80', // REMPLACEZ par votre nébuleuse 1
  nebula2: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=512&h=512&fit=crop&crop=center&q=80', // REMPLACEZ par votre nébuleuse 2
  stars: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1024&h=1024&fit=crop&crop=center&q=80', // REMPLACEZ par vos étoiles
}

// Charger une police spatiale via Google Fonts
function loadSpaceFont() {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
}

// Créer un fond d'espace avec votre image
function createSpaceBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  // Fond noir temporaire
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 2048, 1024)
  
  // TODO: Chargez ici votre vraie image de fond d'espace
  // const img = new Image()
  // img.crossOrigin = 'anonymous'
  // img.onload = () => ctx.drawImage(img, 0, 0, 2048, 1024)
  // img.src = YOUR_SPACE_IMAGES.background
  
  // Étoiles temporaires (vous les remplacerez par vos images)
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 1024
    const brightness = Math.random() * 0.8 + 0.2
    const size = Math.random() > 0.9 ? 2 : 1
    
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
    ctx.fillRect(x, y, size, size)
  }
  
  return new THREE.CanvasTexture(canvas)
}

// Étoiles à remplacer par vos images
function YourStars() {
  const starsRef = useRef<THREE.Points>(null)
  
  // TODO: Remplacez ces étoiles générées par vos vraies images d'étoiles
  const starGeometry = useMemo(() => {
    const positions = new Float32Array(500 * 3) // Réduit pour de meilleures performances
    const colors = new Float32Array(500 * 3)
    const sizes = new Float32Array(500)
    
    for (let i = 0; i < 500; i++) {
      // Distribution sphérique
      const radius = 150 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Couleurs spatiales
      colors[i * 3] = 0.8 + Math.random() * 0.2     // R
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1 // G
      colors[i * 3 + 2] = 1                         // B
      
      sizes[i] = 1 + Math.random() * 2
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002
      
      const material = starsRef.current.material as THREE.PointsMaterial
      if (material) {
        const time = Date.now() * 0.001
        material.opacity = 0.7 + Math.sin(time * 0.3) * 0.3
      }
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starGeometry.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[starGeometry.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[starGeometry.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial 
        size={2}
        transparent 
        opacity={0.8}
        vertexColors
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Nébuleuses à remplacer par vos images
function YourNebulas() {
  // TODO: Remplacez ces sphères simples par vos vraies images de nébuleuses
  const nebulas = useMemo(() => [
    { 
      position: [-80, 40, -120], 
      color: '#ff6080', 
      scale: 18, 
      opacity: 0.12,
      imageUrl: YOUR_SPACE_IMAGES.nebula1 // Utilisez cette URL pour charger votre image
    },
    { 
      position: [60, -30, -100], 
      color: '#6080ff', 
      scale: 22, 
      opacity: 0.1,
      imageUrl: YOUR_SPACE_IMAGES.nebula2 // Utilisez cette URL pour charger votre image
    }
  ], [])

  return (
    <group>
      {nebulas.map((nebula, i) => (
        <mesh key={i} position={nebula.position as [number, number, number]}>
          <sphereGeometry args={[nebula.scale, 32, 32]} />
          <meshBasicMaterial
            color={nebula.color}
            transparent
            opacity={nebula.opacity}
            blending={THREE.AdditiveBlending}
            // TODO: Ajoutez ici map={votre_texture_de_nebuleuse}
          />
        </mesh>
      ))}
    </group>
  )
}

// Texte CAPPONUTS avec police spatiale
function SpaceInvadersText({ mouse }: { mouse: { x: number; y: number } }) {
  const textRef = useRef<THREE.Mesh>(null)
  
  useEffect(() => {
    loadSpaceFont() // Charger la police spatiale
  }, [])
  
  useFrame((state) => {
    if (textRef.current) {
      // Mouvement fluide avec la souris
      textRef.current.rotation.y = THREE.MathUtils.lerp(textRef.current.rotation.y, mouse.x * 0.15, 0.08)
      textRef.current.rotation.x = THREE.MathUtils.lerp(textRef.current.rotation.x, -mouse.y * 0.08, 0.08)
      
      // Animation style Space Invaders (plus robotique)
      const time = state.clock.elapsedTime
      textRef.current.position.y = Math.sin(time * 1.2) * 0.03
      textRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.008)
    }
  })

  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={2.8}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.15}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
      font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"
    >
      CAPPONUTS
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00cc66"
        emissiveIntensity={2}
        roughness={0}
        metalness={1}
      />
    </Text>
  )
}

function CleanSpaceScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const spaceTexture = useMemo(() => createSpaceBackground(), [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Fond d'espace - REMPLACEZ par votre image */}
      <Environment map={spaceTexture} background />
      
      {/* Éclairage spatial */}
      <ambientLight intensity={0.05} color="#001144" />
      <directionalLight position={[0, 0, 50]} intensity={0.3} color="#00ff88" />
      <pointLight position={[30, 30, 30]} intensity={1} color="#88ffcc" />
      
      {/* Éléments à remplacer par vos images */}
      <YourStars />
      <YourNebulas />
      <SpaceInvadersText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        style={{ background: '#000000' }}
      >
        <CleanSpaceScene />
        
        {/* Post-processing spatial */}
        <EffectComposer>
          <Bloom 
            intensity={0.8} 
            luminanceThreshold={0.08} 
            luminanceSmoothing={0.15}
          />
          <ChromaticAberration 
            offset={[0.0004, 0.0004]} 
          />
        </EffectComposer>
      </Canvas>
      
      {/* Interface style rétro gaming */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-green-300 text-xl font-mono tracking-[0.4em] opacity-90 drop-shadow-lg" 
           style={{ fontFamily: 'Orbitron, monospace' }}>
          I&apos;m inevitable...
        </p>
        <div className="mt-3 h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70"></div>
      </div>
      
      {/* Instructions pour vous */}
      <div className="absolute top-4 left-4 text-green-300 text-xs font-mono opacity-60 bg-black/50 p-2 rounded">
        <div>🚀 Police Spatiale: Orbitron (Space Invaders style)</div>
        <div>📁 Remplacez YOUR_SPACE_IMAGES par vos vraies images</div>
        <div>⭐ Modifiez YourStars() et YourNebulas()</div>
      </div>
      
      {/* Footer gaming */}
      <div className="absolute bottom-4 right-4 text-green-400 text-xs font-mono opacity-50">
        ★ SPACE INVADERS STYLE ★
      </div>
    </div>
  )
}