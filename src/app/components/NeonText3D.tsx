'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Sphere, Torus } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'

// Créer une texture d'étoile procédurale
function createStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  
  // Gradient radial pour l'étoile
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.4)')
  gradient.addColorStop(0.6, 'rgba(100, 150, 255, 0.1)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  
  // Ajouter des rayons d'étoile
  ctx.globalCompositeOperation = 'screen'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(32, 8)
  ctx.lineTo(32, 56)
  ctx.moveTo(8, 32)
  ctx.lineTo(56, 32)
  ctx.moveTo(16, 16)
  ctx.lineTo(48, 48)
  ctx.moveTo(48, 16)
  ctx.lineTo(16, 48)
  ctx.stroke()
  
  return new THREE.CanvasTexture(canvas)
}

// Étoiles réalistes avec textures
function RealisticStarField() {
  const groupRef = useRef<THREE.Group>(null)
  const starTexture = useMemo(() => createStarTexture(), [])
  
  // Créer différentes tailles d'étoiles
  const starGroups = useMemo(() => {
    
    // Grandes étoiles brillantes (peu nombreuses)
    const bigStars = []
    for (let i = 0; i < 50; i++) {
      bigStars.push({
        position: [
          (Math.random() - 0.5) * 400,
          (Math.random() - 0.5) * 400,
          (Math.random() - 0.5) * 400
        ],
        size: 2 + Math.random() * 3,
        brightness: 0.8 + Math.random() * 0.2,
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.3, 0.9 + Math.random() * 0.1)
      })
    }
    
    // Étoiles moyennes
    const mediumStars = []
    for (let i = 0; i < 200; i++) {
      mediumStars.push({
        position: [
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 300
        ],
        size: 1 + Math.random() * 2,
        brightness: 0.6 + Math.random() * 0.3,
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 0.2, 0.8 + Math.random() * 0.2)
      })
    }
    
    // Petites étoiles lointaines
    const smallStars = []
    for (let i = 0; i < 800; i++) {
      smallStars.push({
        position: [
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500
        ],
        size: 0.5 + Math.random() * 1,
        brightness: 0.3 + Math.random() * 0.4,
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.15, 0.1, 0.7 + Math.random() * 0.3)
      })
    }
    
    return { bigStars, mediumStars, smallStars }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002
      groupRef.current.rotation.x += 0.0001
      
      // Animation de scintillement
      const time = state.clock.elapsedTime
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Sprite) {
          const material = child.material as THREE.SpriteMaterial
          const baseOpacity = material.userData.baseOpacity || 1
          material.opacity = baseOpacity * (0.7 + 0.3 * Math.sin(time * (2 + index * 0.1)))
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Grandes étoiles */}
      {starGroups.bigStars.map((star, i) => (
        <sprite key={`big-${i}`} position={star.position as [number, number, number]} scale={[star.size, star.size, 1]}>
          <spriteMaterial
            map={starTexture}
            transparent
            opacity={star.brightness}
            color={star.color}
            blending={THREE.AdditiveBlending}
            userData={{ baseOpacity: star.brightness }}
          />
        </sprite>
      ))}
      
      {/* Étoiles moyennes */}
      {starGroups.mediumStars.map((star, i) => (
        <sprite key={`medium-${i}`} position={star.position as [number, number, number]} scale={[star.size, star.size, 1]}>
          <spriteMaterial
            map={starTexture}
            transparent
            opacity={star.brightness}
            color={star.color}
            blending={THREE.AdditiveBlending}
            userData={{ baseOpacity: star.brightness }}
          />
        </sprite>
      ))}
      
      {/* Petites étoiles */}
      {starGroups.smallStars.map((star, i) => (
        <sprite key={`small-${i}`} position={star.position as [number, number, number]} scale={[star.size, star.size, 1]}>
          <spriteMaterial
            map={starTexture}
            transparent
            opacity={star.brightness}
            color={star.color}
            blending={THREE.AdditiveBlending}
            userData={{ baseOpacity: star.brightness }}
          />
        </sprite>
      ))}
    </group>
  )
}

// Nébuleuses améliorées avec texture procédurale
function CinematicNebula({ position, color, scale }: { position: [number, number, number], color: string, scale: number }) {
  const cloudRef = useRef<THREE.Mesh>(null)
  
  const nebulaTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Créer un effet de nébuleuse procédural
    const imageData = ctx.createImageData(256, 256)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % 256
      const y = Math.floor((i / 4) / 256)
      const centerX = 128
      const centerY = 128
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      
      const noise = Math.sin(x * 0.01) * Math.cos(y * 0.01) + 
                   Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.5 +
                   Math.sin(x * 0.03) * Math.cos(y * 0.03) * 0.25
      
      const alpha = Math.max(0, (1 - dist / 128) * (0.3 + noise * 0.2))
      
      data[i] = 255     // R
      data[i + 1] = 255 // G  
      data[i + 2] = 255 // B
      data[i + 3] = alpha * 255 // A
    }
    
    ctx.putImageData(imageData, 0, 0)
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.z += 0.0005
      const material = cloudRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <Sphere ref={cloudRef} args={[scale, 32, 32]} position={position}>
      <meshBasicMaterial 
        map={nebulaTexture}
        color={color}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  )
}

// Particules cosmiques améliorées
function CinematicParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const { positions, colors, sizes } = useMemo(() => {
    const particleCount = 1000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Positions
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      
      // Couleurs variées
      const hue = 0.5 + Math.random() * 0.3
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      // Tailles
      sizes[i] = Math.random() * 3 + 1
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      particlesRef.current.rotation.y = time * 0.05
      
      // Animation flottante des particules
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i + 1] += Math.sin(time * 0.5 + i) * 0.02
        posArray[i] += Math.cos(time * 0.3 + i) * 0.01
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
        size={2} 
        transparent 
        opacity={0.8}
        vertexColors
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Anneaux galactiques améliorés
function CinematicRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.001
      const material = ring1Ref.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(time * 2) * 0.1
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= 0.0015
      const material = ring2Ref.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.25 + Math.sin(time * 1.5) * 0.1
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += 0.0008
      const material = ring3Ref.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.2 + Math.sin(time * 1.8) * 0.1
    }
  })

  return (
    <group>
      <Torus ref={ring1Ref} args={[25, 0.3, 16, 100]} position={[0, 0, -40]}>
        <meshBasicMaterial color="#ff0080" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring2Ref} args={[40, 0.2, 16, 100]} position={[0, 0, -60]}>
        <meshBasicMaterial color="#0080ff" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring3Ref} args={[60, 0.4, 16, 100]} position={[0, 0, -80]}>
        <meshBasicMaterial color="#ff8000" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </Torus>
    </group>
  )
}

// Texte principal amélioré
function CinematicNeonText({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = mouse.x * 0.3
      meshRef.current.rotation.x = -mouse.y * 0.2
      
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.15
      meshRef.current.scale.setScalar(1 + Math.sin(time * 1.2) * 0.03)
    }
    
    if (materialRef.current) {
      const time = state.clock.getElapsedTime()
      materialRef.current.emissiveIntensity = 1.5 + Math.sin(time * 2.5) * 0.3
    }
  })

  return (
    <group>
      <Text
        ref={meshRef}
        position={[0, 0, 0]}
        fontSize={2.2}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.08}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          ref={materialRef}
          color="#00ffe1"
          emissive="#0099cc"
          emissiveIntensity={1.5}
          roughness={0}
          metalness={1}
        />
      </Text>
      
      {/* Halo de lumière */}
      <Text
        position={[0.06, -0.06, -0.3]}
        fontSize={2.3}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.08}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          color="#004466"
          emissive="#0066ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
          roughness={0}
          metalness={1}
        />
      </Text>
    </group>
  )
}

function CinematicScene() {
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
      {/* Éclairage cinématographique */}
      <ambientLight intensity={0.05} color="#000066" />
      <directionalLight position={[20, 20, 10]} intensity={0.3} color="#4080ff" />
      <pointLight position={[30, 30, 30]} intensity={1.5} color="#ff0080" />
      <pointLight position={[-30, -30, 30]} intensity={1.2} color="#00ff80" />
      <spotLight
        position={[0, 0, 80]}
        angle={0.1}
        penumbra={1}
        intensity={2}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
      
      {/* Environnement cosmique réaliste */}
      <RealisticStarField />
      <CinematicParticles />
      <CinematicRings />
      
      {/* Nébuleuses cinématographiques */}
      <CinematicNebula position={[-60, 40, -120]} color="#ff0088" scale={20} />
      <CinematicNebula position={[80, -30, -150]} color="#0088ff" scale={25} />
      <CinematicNebula position={[-40, -60, -100]} color="#aa00ff" scale={18} />
      <CinematicNebula position={[100, 60, -180]} color="#00ff88" scale={30} />
      
      {/* Texte principal */}
      <CinematicNeonText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ 
          background: 'radial-gradient(ellipse at center, #001133 0%, #000000 70%, #000000 100%)'
        }}
      >
        <CinematicScene />
        {/* Effets post-processing cinématographiques */}
        <EffectComposer>
          <Bloom 
            intensity={0.5} 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.2}
            height={1024}
          />
          <ChromaticAberration 
            offset={[0.0005, 0.0005]} 
          />
          <Vignette 
            eskil={false} 
            offset={0.1} 
            darkness={0.3} 
          />
        </EffectComposer>
      </Canvas>
      
      {/* Texte fixe cinématographique */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-cyan-200 text-2xl font-mono tracking-[0.4em] opacity-90 drop-shadow-2xl filter">
          I&apos;m inevitable...
        </p>
        <div className="mt-3 h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-70 blur-sm"></div>
      </div>
      
      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />
      </div>
    </div>
  )
}