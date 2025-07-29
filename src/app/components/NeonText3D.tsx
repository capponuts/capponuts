'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Charger la police Orbitron
function loadOrbitronFont() {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
}

// Étoiles simples et élégantes
function SimpleStars() {
  const starsRef = useRef<THREE.Points>(null)
  
  const starGeometry = useMemo(() => {
    const positions = new Float32Array(500 * 3)
    const colors = new Float32Array(500 * 3)
    const sizes = new Float32Array(500)
    
    for (let i = 0; i < 500; i++) {
      // Position aléatoire plus proche
      const radius = 50 + Math.random() * 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Couleurs d'étoiles naturelles
      colors[i * 3] = 1
      colors[i * 3 + 1] = 1
      colors[i * 3 + 2] = 1
      sizes[i] = 2 + Math.random() * 3
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.001
      starsRef.current.rotation.x += 0.0005
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
        size={3}
        transparent
        opacity={1}
        vertexColors
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Galaxie lointaine
function DistantGalaxy() {
  const galaxyRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.z += 0.001
      const material = galaxyRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <mesh ref={galaxyRef} position={[0, 0, -20]}>
      <ringGeometry args={[10, 25, 64]} />
      <meshBasicMaterial
        color="#8a4e8a"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Texte CAPPONUTS simple et élégant
function CAPPONUTSText({ mouse }: { mouse: { x: number; y: number } }) {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (textRef.current) {
      // Mouvement doux avec la souris
      textRef.current.rotation.y = THREE.MathUtils.lerp(
        textRef.current.rotation.y,
        mouse.x * 0.1,
        0.05
      )
      textRef.current.rotation.x = THREE.MathUtils.lerp(
        textRef.current.rotation.x,
        -mouse.y * 0.05,
        0.05
      )
      
      // Animation subtile
      const time = state.clock.elapsedTime
      textRef.current.position.y = Math.sin(time * 0.8) * 0.1
    }
  })

  return (
    <Text
      ref={textRef}
      position={[0, 0, 2]}
      fontSize={4}
      color="#00ff88"
      anchorX="center"
      anchorY="middle"
    >
      CAPPONUTS
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={1}
      />
    </Text>
  )
}

// Scène principale simple
function SimpleSpaceScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    loadOrbitronFont()
    
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

      return (
      <>
        {/* Éclairage fort pour bien voir */}
        <ambientLight intensity={1} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        
        {/* Éléments de la scène */}
        <SimpleStars />
        <DistantGalaxy />
        <CAPPONUTSText mouse={mouse} />
      </>
    )
}

// Composant principal
export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #000011, #001122)' }}
      >
        <SimpleSpaceScene />
      </Canvas>
      
      {/* Texte fixe en bas */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-green-300 text-lg font-mono tracking-wider opacity-80"
           style={{ fontFamily: 'Orbitron, monospace' }}>
          I&apos;m inevitable...
        </p>
      </div>
    </div>
  )
}