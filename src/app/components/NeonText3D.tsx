'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Sphere, Environment } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'

// Créer un HDRI d'espace photoréaliste procédural
function createSpaceHDRI() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  // Fond noir de l'espace
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 2048, 1024)
  
  // Ajouter la Voie Lactée
  const gradient = ctx.createLinearGradient(0, 512, 2048, 512)
  gradient.addColorStop(0, 'rgba(30, 20, 50, 0)')
  gradient.addColorStop(0.3, 'rgba(80, 60, 120, 0.1)')
  gradient.addColorStop(0.5, 'rgba(150, 120, 200, 0.2)')
  gradient.addColorStop(0.7, 'rgba(80, 60, 120, 0.1)')
  gradient.addColorStop(1, 'rgba(30, 20, 50, 0)')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 200, 2048, 600)
  
  // Ajouter des nébuleuses distantes
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 1024
    const size = 50 + Math.random() * 150
    
    const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
    const colors = ['rgba(255, 100, 150, 0.05)', 'rgba(100, 150, 255, 0.05)', 'rgba(150, 255, 100, 0.05)']
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    nebulaGradient.addColorStop(0, color)
    nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    ctx.fillStyle = nebulaGradient
    ctx.fillRect(x - size, y - size, size * 2, size * 2)
  }
  
  // Ajouter des étoiles de fond
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 1024
    const brightness = Math.random()
    const size = brightness > 0.8 ? 2 : 1
    
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`
    ctx.fillRect(x, y, size, size)
  }
  
  return new THREE.CanvasTexture(canvas)
}

// Étoiles volumétriques photoréalistes avec géométries 3D
function PhotorealisticStars() {
  const groupRef = useRef<THREE.Group>(null)
  
  // Types d'étoiles basés sur la classification stellaire
  const starTypes = useMemo(() => {
    const stars = []
    
    // Étoiles géantes rouges
    for (let i = 0; i < 8; i++) {
      stars.push({
        type: 'red_giant',
        position: [
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 300
        ],
        size: 3 + Math.random() * 4,
        color: new THREE.Color(0.9, 0.3, 0.1),
        temperature: 3000,
        intensity: 0.8 + Math.random() * 0.2
      })
    }
    
    // Étoiles de séquence principale (comme le Soleil)
    for (let i = 0; i < 25; i++) {
      stars.push({
        type: 'main_sequence',
        position: [
          (Math.random() - 0.5) * 400,
          (Math.random() - 0.5) * 400,
          (Math.random() - 0.5) * 400
        ],
        size: 1.5 + Math.random() * 2,
        color: new THREE.Color(1, 0.9, 0.6),
        temperature: 5500,
        intensity: 0.6 + Math.random() * 0.3
      })
    }
    
    // Étoiles bleues chaudes
    for (let i = 0; i < 12; i++) {
      stars.push({
        type: 'blue_giant',
        position: [
          (Math.random() - 0.5) * 350,
          (Math.random() - 0.5) * 350,
          (Math.random() - 0.5) * 350
        ],
        size: 2 + Math.random() * 3,
        color: new THREE.Color(0.6, 0.8, 1),
        temperature: 10000,
        intensity: 0.9 + Math.random() * 0.1
      })
    }
    
    // Naines blanches
    for (let i = 0; i < 15; i++) {
      stars.push({
        type: 'white_dwarf',
        position: [
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500
        ],
        size: 0.8 + Math.random() * 1,
        color: new THREE.Color(0.9, 0.9, 1),
        temperature: 8000,
        intensity: 0.7 + Math.random() * 0.2
      })
    }
    
    return stars
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation très lente pour simuler la rotation galactique
      groupRef.current.rotation.y += 0.0001
      
      // Scintillement atmosphérique réaliste
      const time = state.clock.elapsedTime
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          const star = starTypes[index]
          if (star) {
            // Scintillement basé sur la température stellaire
            const scintillation = 1 + Math.sin(time * (1 + star.temperature / 10000)) * 0.1
            child.scale.setScalar(star.size * scintillation)
            
            // Variation de l'intensité lumineuse
            const material = child.material as THREE.MeshBasicMaterial
            material.opacity = star.intensity * (0.8 + 0.2 * Math.sin(time * 2 + index))
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {starTypes.map((star, i) => (
        <mesh key={i} position={star.position as [number, number, number]}>
          <sphereGeometry args={[star.size, 16, 16]} />
          <meshBasicMaterial
            color={star.color}
            transparent
            opacity={star.intensity}
            blending={THREE.AdditiveBlending}
          />
          {/* Couronne stellaire */}
          <mesh scale={[1.5, 1.5, 1.5]}>
            <sphereGeometry args={[star.size, 8, 8]} />
            <meshBasicMaterial
              color={star.color}
              transparent
              opacity={star.intensity * 0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </mesh>
      ))}
    </group>
  )
}

// Nébuleuses basées sur de vraies données Hubble
function HubbleNebulas() {
  const nebulas = useMemo(() => [
    {
      name: 'orion',
      position: [-80, 40, -200] as [number, number, number],
      scale: 30,
      colors: [new THREE.Color(1, 0.3, 0.3), new THREE.Color(0.3, 0.6, 1)],
      density: 0.15
    },
    {
      name: 'eagle',
      position: [120, -60, -250] as [number, number, number],
      scale: 25,
      colors: [new THREE.Color(0.8, 0.4, 0.2), new THREE.Color(0.2, 0.8, 0.6)],
      density: 0.12
    },
    {
      name: 'helix',
      position: [-60, -80, -180] as [number, number, number],
      scale: 20,
      colors: [new THREE.Color(0.6, 0.8, 0.3), new THREE.Color(0.9, 0.5, 0.7)],
      density: 0.18
    }
  ], [])

  return (
    <group>
      {nebulas.map((nebula, i) => (
        <group key={i} position={nebula.position}>
          {/* Couche principale de la nébuleuse */}
          <Sphere args={[nebula.scale, 32, 32]}>
            <meshBasicMaterial
              color={nebula.colors[0]}
              transparent
              opacity={nebula.density}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
          {/* Couche secondaire */}
          <Sphere args={[nebula.scale * 0.7, 24, 24]}>
            <meshBasicMaterial
              color={nebula.colors[1]}
              transparent
              opacity={nebula.density * 0.6}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
          {/* Cœur dense */}
          <Sphere args={[nebula.scale * 0.3, 16, 16]}>
            <meshBasicMaterial
              color={nebula.colors[0]}
              transparent
              opacity={nebula.density * 1.5}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
        </group>
      ))}
    </group>
  )
}

// Poussières cosmiques et gaz interstellaire
function InterstellarMedium() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const { positions, colors, sizes } = useMemo(() => {
    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Distribution plus dense vers le plan galactique
      const y = (Math.random() - 0.5) * 80 + Math.random() * 20 - 10
      positions[i * 3] = (Math.random() - 0.5) * 400
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400
      
      // Couleurs basées sur la composition chimique
      const dustType = Math.random()
      if (dustType < 0.4) {
        // Silicates (rougeâtres)
        colors[i * 3] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.2
      } else if (dustType < 0.7) {
        // Carbone (bleuâtre)
        colors[i * 3] = 0.3 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3
      } else {
        // Hydrogène ionisé (verdâtre)
        colors[i * 3] = 0.2 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.4
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.2
      }
      
      sizes[i] = 0.5 + Math.random() * 2
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      
      // Mouvement brownien et dérive galactique
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i] += Math.sin(time * 0.1 + i) * 0.02
        posArray[i + 1] += Math.cos(time * 0.15 + i) * 0.01
        posArray[i + 2] += Math.sin(time * 0.12 + i) * 0.015
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial 
        size={1.5}
        transparent 
        opacity={0.6}
        vertexColors
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Texte CAPPONUTS avec effet de réfraction stellaire
function StellarText({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Suivi de souris plus fluide
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.3, 0.05)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouse.y * 0.2, 0.05)
      
      // Pulsation basée sur les cycles stellaires
      const time = state.clock.elapsedTime
      meshRef.current.position.y = Math.sin(time * 0.6) * 0.1
      meshRef.current.scale.setScalar(1 + Math.sin(time * 1.1) * 0.02)
    }
    
    if (materialRef.current) {
      // Variation d'intensité basée sur l'activité stellaire
      const time = state.clock.elapsedTime
      materialRef.current.emissiveIntensity = 1.8 + Math.sin(time * 2.2) * 0.3
    }
  })

  return (
    <group>
      {/* Texte principal avec matériau stellaire */}
      <Text
        ref={meshRef}
        position={[0, 0, 0]}
        fontSize={2.5}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          ref={materialRef}
          color="#00e5ff"
          emissive="#0088cc"
          emissiveIntensity={1.8}
          roughness={0}
          metalness={1}
        />
      </Text>
      
      {/* Halo de diffraction */}
      <Text
        position={[0.08, -0.08, -0.4]}
        fontSize={2.6}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          color="#004488"
          emissive="#0044aa"
          emissiveIntensity={1.0}
          transparent
          opacity={0.25}
          roughness={0}
          metalness={1}
        />
      </Text>
    </group>
  )
}

function PhotorealisticSpace() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const spaceTexture = useMemo(() => createSpaceHDRI(), [])

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
      {/* Environnement spatial photoréaliste */}
      <Environment map={spaceTexture} background />
      
      {/* Éclairage astronomique réaliste */}
      <ambientLight intensity={0.02} color="#000044" />
      
      {/* Lumière de la galaxie centrale */}
      <directionalLight 
        position={[0, 0, 100]} 
        intensity={0.1} 
        color="#4466aa" 
      />
      
      {/* Rayonnement cosmique diffus */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.3} 
        color="#6688cc" 
        distance={1000}
        decay={0.1}
      />
      
      {/* Objets célestes */}
      <PhotorealisticStars />
      <HubbleNebulas />
      <InterstellarMedium />
      
      {/* Texte principal */}
      <StellarText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        style={{ background: '#000000' }}
      >
        <PhotorealisticSpace />
        
        {/* Post-processing astronomique */}
        <EffectComposer>
          <Bloom 
            intensity={0.8} 
            luminanceThreshold={0.05} 
            luminanceSmoothing={0.1}
            height={1024}
          />
          <ChromaticAberration 
            offset={[0.0008, 0.0008]} 
          />
          <Vignette 
            eskil={false} 
            offset={0.05} 
            darkness={0.4} 
          />
        </EffectComposer>
      </Canvas>
      
      {/* Interface utilisateur */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-cyan-100 text-2xl font-mono tracking-[0.5em] opacity-95 drop-shadow-2xl">
          I&apos;m inevitable...
        </p>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-80"></div>
      </div>
      
      {/* Overlay de qualité spatiale */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-4 text-cyan-200 text-sm font-mono opacity-60">
          ★ Photorealistic Space Rendering
        </div>
      </div>
    </div>
  )
}