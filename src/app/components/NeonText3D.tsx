'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, OrbitControls } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function NeonText({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Le texte suit la souris avec un effet fluide
      meshRef.current.rotation.y = mouse.x * 0.3
      meshRef.current.rotation.x = -mouse.y * 0.2
      
      // Animation de pulsation pour l'effet néon
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1
    }
    
    if (materialRef.current) {
      // Animation de l'intensité du néon
      const time = state.clock.getElapsedTime()
      materialRef.current.emissiveIntensity = 0.8 + Math.sin(time * 2) * 0.2
    }
  })

  return (
    <group>
      {/* Texte principal CAPPONUTS */}
      <Text
        ref={meshRef}
        position={[0, 0, 0]}
        fontSize={1.5}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          ref={materialRef}
          color="#00ffff"
          emissive="#0088ff"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </Text>
      
      {/* Effet de glow autour du texte */}
      <Text
        position={[0.02, -0.02, -0.1]}
        fontSize={1.52}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        CAPPONUTS
        <meshStandardMaterial
          color="#003366"
          emissive="#0066cc"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </Text>
    </group>
  )
}

function Scene() {
  const { camera } = useThree()
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

  useFrame(() => {
    // Mouvement subtil de la caméra
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Éclairage néon */}
      <ambientLight intensity={0.2} color="#001122" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#ff0088" />
      <spotLight
        position={[0, 0, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#00ccff"
        target-position={[0, 0, 0]}
      />
      
      {/* Texte principal */}
      <NeonText mouse={mouse} />
      
      {/* Particules d'ambiance */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(
              Array.from({ length: 200 }, () => [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
              ]).flat()
            )}
            count={200}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00ffff" transparent opacity={0.6} />
      </points>
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #000011 0%, #001122 50%, #000033 100%)' }}
      >
        <Scene />
      </Canvas>
      
      {/* Texte fixe en bas */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white text-xl font-mono tracking-wider opacity-80 animate-pulse">
          I'm inevitable...
        </p>
      </div>
    </div>
  )
}