'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Sphere, Torus } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Composant pour les étoiles animées
function StarField() {
  const starsRef = useRef<THREE.Points>(null)
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    return positions
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005
      starsRef.current.rotation.x += 0.0002
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.5} 
        color="#ffffff" 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Composant pour les nébuleuses colorées
function NebulaCloud({ position, color, scale }: { position: [number, number, number], color: string, scale: number }) {
  const cloudRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.z += 0.001
      const material = cloudRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <Sphere ref={cloudRef} args={[scale, 32, 32]} position={position}>
      <meshBasicMaterial 
        color={color}
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  )
}

// Composant pour les particules cosmiques
function CosmicParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      particlesRef.current.rotation.y = time * 0.1
      
      // Animation flottante des particules
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.01
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.2} 
        color="#00ffcc" 
        transparent 
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Anneaux galactiques tournants
function GalacticRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.002
    if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.003
    if (ring3Ref.current) ring3Ref.current.rotation.z += 0.001
  })

  return (
    <group>
      <Torus ref={ring1Ref} args={[20, 0.5, 8, 50]} position={[0, 0, -30]}>
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring2Ref} args={[35, 0.3, 8, 50]} position={[0, 0, -40]}>
        <meshBasicMaterial color="#0088ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring3Ref} args={[50, 0.8, 8, 50]} position={[0, 0, -60]}>
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </Torus>
    </group>
  )
}

// Texte principal qui suit la souris
function EpicNeonText({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Le texte suit la souris avec un effet fluide
      meshRef.current.rotation.y = mouse.x * 0.4
      meshRef.current.rotation.x = -mouse.y * 0.3
      
      // Animation de pulsation plus dramatique
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.2
      meshRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.05)
    }
    
    if (materialRef.current) {
      // Animation de l'intensité du néon cosmique
      const time = state.clock.getElapsedTime()
      materialRef.current.emissiveIntensity = 1.2 + Math.sin(time * 3) * 0.4
    }
  })

  return (
    <group>
      {/* Texte principal CAPPONUTS avec effet cosmique */}
      <Text
        ref={meshRef}
        position={[0, 0, 0]}
        fontSize={2}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.05}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          ref={materialRef}
          color="#00ffe1"
          emissive="#0099cc"
          emissiveIntensity={1.2}
          roughness={0}
          metalness={1}
        />
      </Text>
      
      {/* Halo de lumière autour du texte */}
      <Text
        position={[0.05, -0.05, -0.2]}
        fontSize={2.1}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.05}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          color="#004466"
          emissive="#0066ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
          roughness={0}
          metalness={1}
        />
      </Text>
    </group>
  )
}

function CosmicScene() {
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
      {/* Éclairage cosmique complexe */}
      <ambientLight intensity={0.1} color="#000044" />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#00aaff" />
      <pointLight position={[20, 20, 20]} intensity={2} color="#ff00aa" />
      <pointLight position={[-20, -20, 20]} intensity={1.5} color="#00ffaa" />
      <spotLight
        position={[0, 0, 50]}
        angle={0.15}
        penumbra={1}
        intensity={3}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
      
      {/* Fond cosmique */}
      <StarField />
      <CosmicParticles />
      <GalacticRings />
      
      {/* Nébuleuses colorées */}
      <NebulaCloud position={[-40, 30, -80]} color="#ff0088" scale={15} />
      <NebulaCloud position={[50, -20, -100]} color="#0088ff" scale={20} />
      <NebulaCloud position={[-30, -40, -60]} color="#aa00ff" scale={12} />
      <NebulaCloud position={[60, 40, -120]} color="#00ff88" scale={25} />
      
      {/* Texte principal qui suit la souris */}
      <EpicNeonText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ 
          background: 'radial-gradient(ellipse at center, #001122 0%, #000000 70%, #000000 100%)'
        }}
      >
        <CosmicScene />
      </Canvas>
      
      {/* Texte fixe en bas avec style cosmique */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-cyan-300 text-2xl font-mono tracking-[0.3em] opacity-80 animate-pulse drop-shadow-lg">
          I&apos;m inevitable...
        </p>
        <div className="mt-2 h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
      </div>
      
      {/* Overlay d'effet cosmique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-blue-900/5 to-purple-900/10"></div>
      </div>
    </div>
  )
}