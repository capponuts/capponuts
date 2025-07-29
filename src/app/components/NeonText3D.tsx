'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, useTexture } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

// Images 3D haute résolution gratuites du système solaire et nébuleuses
const REAL_SPACE_IMAGES = {
  // Rendu 3D système solaire avec nébuleuses colorées haute résolution
  solarSystemBackground: 'https://images.unsplash.com/photo-1634307006082-46275a5dbe29?w=2048&h=1024&fit=crop&crop=center&q=80', // Système solaire 3D
  nebulaColorful: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1024&h=1024&fit=crop&crop=center&q=80', // Nébuleuse colorée NASA
  nebulaVeil: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1024&h=1024&fit=crop&crop=center&q=80', // Nébuleuse du Voile
  nebulaHubble: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1024&h=1024&fit=crop&crop=center&q=80', // Image Hubble
  planetSystem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1024&h=1024&fit=crop&crop=center&q=80', // Planètes 3D
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

// Fond 3D du système solaire avec vraie image
function SolarSystemBackground() {
  const backgroundTexture = useTexture(REAL_SPACE_IMAGES.solarSystemBackground)
  
  useMemo(() => {
    backgroundTexture.mapping = THREE.EquirectangularReflectionMapping
    backgroundTexture.wrapS = THREE.RepeatWrapping
    backgroundTexture.wrapT = THREE.RepeatWrapping
  }, [backgroundTexture])

  return <Environment map={backgroundTexture} background />
}

// Vraies nébuleuses 3D avec images haute résolution
function RealNebulas() {
  const nebulaTextures = useTexture([
    REAL_SPACE_IMAGES.nebulaColorful,
    REAL_SPACE_IMAGES.nebulaVeil,
    REAL_SPACE_IMAGES.nebulaHubble
  ])
  
  const nebulas = useMemo(() => [
    { 
      position: [-80, 40, -120], 
      scale: 25, 
      opacity: 0.15,
      texture: nebulaTextures[0],
      color: '#ff6080'
    },
    { 
      position: [60, -30, -100], 
      scale: 30, 
      opacity: 0.12,
      texture: nebulaTextures[1],
      color: '#6080ff'
    },
    { 
      position: [-40, -60, -140], 
      scale: 20, 
      opacity: 0.18,
      texture: nebulaTextures[2],
      color: '#80ff60'
    }
  ], [nebulaTextures])

  return (
    <group>
      {nebulas.map((nebula, i) => (
        <mesh key={i} position={nebula.position as [number, number, number]}>
          <sphereGeometry args={[nebula.scale, 32, 32]} />
          <meshBasicMaterial
            map={nebula.texture}
            color={nebula.color}
            transparent
            opacity={nebula.opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// Système de planètes 3D réaliste
function Real3DPlanets() {
  const planetTexture = useTexture(REAL_SPACE_IMAGES.planetSystem)
  const planetsRef = useRef<THREE.Group>(null)
  
  const planets = useMemo(() => [
    { position: [100, 20, -80], scale: 8, speed: 0.5, color: '#ff8040' },
    { position: [-120, -15, -60], scale: 12, speed: 0.3, color: '#4080ff' },
    { position: [80, -40, -100], scale: 6, speed: 0.8, color: '#80ff40' },
    { position: [-60, 50, -120], scale: 10, speed: 0.4, color: '#ff4080' }
  ], [])

  useFrame((state) => {
    if (planetsRef.current) {
      planetsRef.current.rotation.y += 0.0005
      
      planetsRef.current.children.forEach((planet, i) => {
        const time = state.clock.elapsedTime
        planet.rotation.y += planets[i].speed * 0.01
        planet.position.y += Math.sin(time * planets[i].speed + i) * 0.02
      })
    }
  })

  return (
    <group ref={planetsRef}>
      {planets.map((planet, i) => (
        <mesh key={i} position={planet.position as [number, number, number]}>
          <sphereGeometry args={[planet.scale, 32, 32]} />
          <meshStandardMaterial
            map={planetTexture}
            color={planet.color}
            emissive={planet.color}
            emissiveIntensity={0.1}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Étoiles réalistes haute qualité
function HighQualityStars() {
  const starsRef = useRef<THREE.Points>(null)
  
  const starGeometry = useMemo(() => {
    const positions = new Float32Array(800 * 3)
    const colors = new Float32Array(800 * 3)
    const sizes = new Float32Array(800)
    
    for (let i = 0; i < 800; i++) {
      // Distribution galactique réaliste
      const radius = 200 + Math.random() * 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Couleurs d'étoiles réalistes selon le type stellaire
      const starType = Math.random()
      if (starType < 0.1) {
        // Géantes bleues (très rares)
        colors[i * 3] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 1
        sizes[i] = 2 + Math.random() * 3
      } else if (starType < 0.4) {
        // Étoiles blanc-jaunâtres (type solaire)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
        sizes[i] = 1 + Math.random() * 2
      } else {
        // Naines rouges (majoritaires)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.4
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.3
        sizes[i] = 0.5 + Math.random() * 1.5
      }
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001
      starsRef.current.rotation.x += 0.00005
      
      const material = starsRef.current.material as THREE.PointsMaterial
      if (material) {
        const time = Date.now() * 0.001
        material.opacity = 0.8 + Math.sin(time * 0.2) * 0.2
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
        size={1.5}
        transparent 
        opacity={0.8}
        vertexColors
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Texte CAPPONUTS avec police spatiale
function SpaceInvadersText({ mouse }: { mouse: { x: number; y: number } }) {
  const textRef = useRef<THREE.Mesh>(null)
  
  useEffect(() => {
    loadSpaceFont()
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
        emissiveIntensity={2.5}
        roughness={0}
        metalness={1}
      />
    </Text>
  )
}

function Epic3DSolarSystemScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

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
      {/* Fond 3D du système solaire */}
      <SolarSystemBackground />
      
      {/* Éclairage cinématographique */}
      <ambientLight intensity={0.08} color="#001144" />
      <directionalLight position={[50, 50, 50]} intensity={0.4} color="#00ff88" />
      <pointLight position={[100, 0, 0]} intensity={2} color="#ff6040" />
      <pointLight position={[-100, 0, 0]} intensity={1.5} color="#4060ff" />
      <pointLight position={[0, 100, 0]} intensity={1} color="#60ff40" />
      
      {/* Éléments 3D réalistes */}
      <HighQualityStars />
      <RealNebulas />
      <Real3DPlanets />
      <SpaceInvadersText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ background: '#000000' }}
      >
        <Epic3DSolarSystemScene />
        
        {/* Post-processing cinématographique */}
        <EffectComposer>
          <Bloom 
            intensity={1.2} 
            luminanceThreshold={0.06} 
            luminanceSmoothing={0.1}
          />
          <ChromaticAberration 
            offset={[0.0006, 0.0006]} 
          />
        </EffectComposer>
      </Canvas>
      
      {/* Interface rétro gaming améliorée */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-green-300 text-xl font-mono tracking-[0.4em] opacity-90 drop-shadow-lg" 
           style={{ fontFamily: 'Orbitron, monospace' }}>
          I&apos;m inevitable...
        </p>
        <div className="mt-3 h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70"></div>
      </div>
      
      {/* Indicateur de rendu 3D réaliste */}
      <div className="absolute top-4 left-4 text-green-300 text-xs font-mono opacity-70 bg-black/60 p-3 rounded">
        <div>🌌 Rendu 3D Système Solaire Haute Résolution</div>
        <div>✨ Nébuleuses colorées NASA/Hubble</div>
        <div>🚀 Police Spatiale: Orbitron</div>
        <div>🌟 Planètes et étoiles réalistes</div>
      </div>
      
      {/* Footer épique */}
      <div className="absolute bottom-4 right-4 text-green-400 text-xs font-mono opacity-60">
        ★ EPIC 3D SOLAR SYSTEM ★
      </div>
      
      {/* Effet de scan rétro */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
    </div>
  )
}