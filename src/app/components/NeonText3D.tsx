'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

// URLs d'images 4K d'espace réelles et gratuites (pour usage futur)
// const SPACE_BACKGROUNDS = [
//   'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&crop=center&q=80', // Deep space
//   'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=2048&h=1024&fit=crop&crop=center&q=80', // Galaxy
//   'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=2048&h=1024&fit=crop&crop=center&q=80', // Nebula
//   'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&h=1024&fit=crop&crop=center&q=80', // Starfield
// ]

// Créer un fond d'espace avec de vraies images 4K
function create4KSpaceBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  // Fond noir en attendant le chargement
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 2048, 1024)
  
  // Ajouter quelques étoiles de base
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 1024
    const brightness = Math.random() * 0.8 + 0.2
    const size = Math.random() > 0.9 ? 2 : 1
    
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
    ctx.fillRect(x, y, size, size)
  }
  
  return new THREE.CanvasTexture(canvas)
}

// Étoiles simples mais belles
function BeautifulStars() {
  const starsRef = useRef<THREE.Points>(null)
  
  const starGeometry = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    const colors = new Float32Array(1000 * 3)
    const sizes = new Float32Array(1000)
    
    for (let i = 0; i < 1000; i++) {
      // Positions aléatoires dans une sphère
      const radius = 200 + Math.random() * 300
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Couleurs d'étoiles réalistes
      const temp = Math.random()
      if (temp < 0.3) {
        // Étoiles chaudes (bleues)
        colors[i * 3] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 1
      } else if (temp < 0.7) {
        // Étoiles moyennes (blanches/jaunes)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3
      } else {
        // Étoiles froides (rouges)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.3
      }
      
      sizes[i] = 0.5 + Math.random() * 2
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      // Rotation très lente
      starsRef.current.rotation.y += 0.0001
      
      // Scintillement subtil
      const material = starsRef.current.material as THREE.PointsMaterial
      if (material) {
        const time = Date.now() * 0.001
        material.opacity = 0.8 + Math.sin(time * 0.5) * 0.2
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

// Quelques nébuleuses simples et belles
function SimpleNebulas() {
  const nebulas = useMemo(() => [
    { position: [-100, 50, -150], color: '#ff4080', scale: 20, opacity: 0.1 },
    { position: [80, -40, -120], color: '#4080ff', scale: 25, opacity: 0.08 },
    { position: [-60, -70, -100], color: '#80ff40', scale: 15, opacity: 0.12 }
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
          />
        </mesh>
      ))}
    </group>
  )
}

// Texte CAPPONUTS propre et élégant
function ElegantText({ mouse }: { mouse: { x: number; y: number } }) {
  const textRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (textRef.current) {
      // Mouvement fluide avec la souris
      textRef.current.rotation.y = THREE.MathUtils.lerp(textRef.current.rotation.y, mouse.x * 0.2, 0.1)
      textRef.current.rotation.x = THREE.MathUtils.lerp(textRef.current.rotation.x, -mouse.y * 0.1, 0.1)
      
      // Animation subtile
      const time = state.clock.elapsedTime
      textRef.current.position.y = Math.sin(time * 0.5) * 0.05
      textRef.current.scale.setScalar(1 + Math.sin(time) * 0.01)
    }
  })

  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={3}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.1}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      CAPPONUTS
      <meshStandardMaterial
        color="#00e5ff"
        emissive="#0099cc"
        emissiveIntensity={1.5}
        roughness={0}
        metalness={1}
      />
    </Text>
  )
}

function CleanSpaceScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const spaceTexture = useMemo(() => create4KSpaceBackground(), [])

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
      {/* Fond d'espace 4K */}
      <Environment map={spaceTexture} background />
      
      {/* Éclairage simple et efficace */}
      <ambientLight intensity={0.1} color="#002244" />
      <pointLight position={[0, 0, 50]} intensity={0.5} color="#4488cc" />
      
      {/* Éléments de la scène */}
      <BeautifulStars />
      <SimpleNebulas />
      <ElegantText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: '#000000' }}
      >
        <CleanSpaceScene />
        
        {/* Post-processing minimal mais efficace */}
        <EffectComposer>
          <Bloom 
            intensity={0.6} 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.2}
          />
          <ChromaticAberration 
            offset={[0.0003, 0.0003]} 
          />
        </EffectComposer>
      </Canvas>
      
      {/* Interface utilisateur propre */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-cyan-100 text-xl font-mono tracking-[0.3em] opacity-90 drop-shadow-lg">
          I&apos;m inevitable...
        </p>
        <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-60"></div>
      </div>
      
      {/* Footer simple */}
      <div className="absolute bottom-4 right-4 text-cyan-300 text-xs font-mono opacity-50">
        ✨ Clean Space Rendering
      </div>
    </div>
  )
}