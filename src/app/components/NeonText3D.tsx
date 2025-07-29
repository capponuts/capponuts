'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Fond d'étoiles simple et élégant (inspiré des exemples Three.js)
function StarField() {
  const starsRef = useRef<THREE.Points>(null)
  
  const starGeometry = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    
    return positions
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.001
      starsRef.current.rotation.y += 0.002
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starGeometry, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={5}
        sizeAttenuation={false}
      />
    </points>
  )
}

// Lettres individuelles CAPPONUTS
function IndividualLetters({ mouse }: { mouse: { x: number; y: number } }) {
  const letters = ['C', 'A', 'P', 'P', 'O', 'N', 'U', 'T', 'S']
  const letterRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    letterRefs.current.forEach((letterRef, index) => {
      if (letterRef) {
        const time = state.clock.elapsedTime
        const offset = index * 0.1
        
        // Mouvement avec la souris
        letterRef.rotation.x = THREE.MathUtils.lerp(
          letterRef.rotation.x,
          mouse.y * 0.3 + Math.sin(time + offset) * 0.1,
          0.05
        )
        letterRef.rotation.y = THREE.MathUtils.lerp(
          letterRef.rotation.y,
          mouse.x * 0.3 + Math.cos(time + offset) * 0.1,
          0.05
        )
        
        // Animation flottante
        letterRef.position.y = Math.sin(time * 2 + offset * 3) * 0.2
        letterRef.position.z = Math.sin(time + offset * 2) * 0.3
      }
    })
  })

  return (
    <group>
      {letters.map((letter, index) => (
        <Text
          key={index}
          ref={(el) => {
            if (el) letterRefs.current[index] = el
          }}
          position={[(index - 4) * 1.5, 0, 5]}
          fontSize={3}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"
        >
          {letter}
          <meshBasicMaterial
            color="#00ff88"
          />
        </Text>
      ))}
    </group>
  )
}

// Scène principale
function SpaceScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
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
      {/* Éclairage */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Fond d'étoiles animé */}
      <StarField />
      
      {/* Lettres qui bougent avec la souris */}
      <IndividualLetters mouse={mouse} />
    </>
  )
}

// Composant principal
export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: '#000000' }}
      >
        <SpaceScene />
      </Canvas>
      
      {/* Texte fixe en bas */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-green-300 text-lg font-mono tracking-wider opacity-80">
          I&apos;m inevitable...
        </p>
      </div>
    </div>
  )
}