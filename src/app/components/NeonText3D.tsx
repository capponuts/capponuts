'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, useTexture } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

// Images 3D haute résolution gratuites du système solaire et nébuleuses
const REAL_SPACE_IMAGES = {
  solarSystemBackground: 'https://images.unsplash.com/photo-1634307006082-46275a5dbe29?w=2048&h=1024&fit=crop&crop=center&q=80',
  nebulaColorful: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1024&h=1024&fit=crop&crop=center&q=80',
  nebulaVeil: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1024&h=1024&fit=crop&crop=center&q=80',
  nebulaHubble: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1024&h=1024&fit=crop&crop=center&q=80',
  planetSystem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1024&h=1024&fit=crop&crop=center&q=80',
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

// Trou noir épique avec shader personnalisé
function EpicBlackHole({ mouse }: { mouse: { x: number; y: number } }) {
  const blackHoleRef = useRef<THREE.Mesh>(null)
  
  // Shader uniforms
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1920, 1080) },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    blackHolePos: { value: new THREE.Vector3(0, 0, -50) },
    accretionIntensity: { value: 2.0 },
    distortionStrength: { value: 1.5 },
    eventHorizonRadius: { value: 8.0 },
  }), [])
  
  useFrame((state) => {
    uniforms.time.value = state.clock.elapsedTime
    uniforms.mouse.value.set(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5)
    uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
    
    if (blackHoleRef.current) {
      blackHoleRef.current.rotation.z += 0.002
    }
  })

  return (
    <mesh ref={blackHoleRef} position={[0, 0, -50]}>
      <planeGeometry args={[120, 80]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec2 resolution;
          uniform vec2 mouse;
          uniform vec3 blackHolePos;
          uniform float accretionIntensity;
          uniform float distortionStrength;
          uniform float eventHorizonRadius;
          
          varying vec2 vUv;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for(int i = 0; i < 6; i++) {
              value += amplitude * noise(p);
              p *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          
          vec2 gravitationalLensing(vec2 coord, vec3 bhPos, float strength) {
            vec2 toBlackHole = coord - bhPos.xy;
            float dist = length(toBlackHole);
            float lensing = strength / (dist * dist + 0.1);
            return coord + normalize(toBlackHole) * lensing * 0.1;
          }
          
          void main() {
            vec2 uv = vUv;
            vec2 center = vec2(0.5, 0.5);
            vec2 coord = (uv - center) * 2.0;
            
            vec3 bhPos = blackHolePos + vec3(mouse * 0.2, 0.0);
            vec2 distortedCoord = gravitationalLensing(coord, bhPos, distortionStrength);
            float distToCenter = length(distortedCoord - bhPos.xy);
            
            float eventHorizon = eventHorizonRadius * 0.1;
            if(distToCenter < eventHorizon) {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              return;
            }
            
            float accretionRadius = eventHorizon * 6.0;
            float ringPattern = sin(distToCenter * 15.0 - time * 4.0) * 0.5 + 0.5;
            float rings = smoothstep(0.02, 0.0, mod(distToCenter * 20.0, 1.0));
            
            vec2 diskUV = distortedCoord * 3.0 + time * 0.1;
            float turbulence = fbm(diskUV + time * 0.5);
            
            vec3 diskColor = vec3(0.0);
            if(distToCenter > eventHorizon && distToCenter < accretionRadius) {
              float diskFactor = 1.0 - smoothstep(eventHorizon, accretionRadius, distToCenter);
              float temperature = diskFactor * 2.0 + turbulence * 0.5;
              
              diskColor = mix(
                vec3(1.0, 0.3, 0.0),
                vec3(1.0, 0.8, 0.4),
                temperature
              );
              
              diskColor *= (ringPattern * 0.8 + 0.2) * accretionIntensity;
              diskColor += rings * vec3(1.0, 0.6, 0.0) * 2.0;
              
              float rotation = atan(distortedCoord.y - bhPos.y, distortedCoord.x - bhPos.x);
              float rotationSpeed = 1.0 / (distToCenter + 0.1);
              diskColor *= sin(rotation * 8.0 + time * rotationSpeed * 10.0) * 0.3 + 0.7;
            }
            
            vec2 jetDir = normalize(vec2(0.0, 1.0));
            float jetDist = abs(dot(distortedCoord - bhPos.xy, vec2(-jetDir.y, jetDir.x)));
            vec3 jetColor = vec3(0.0);
            if(jetDist < 0.05 && abs(distortedCoord.y - bhPos.y) > eventHorizon) {
              float jetIntensity = 1.0 - jetDist / 0.05;
              jetColor = vec3(0.0, 0.4, 1.0) * jetIntensity * 0.8;
            }
            
            vec3 backgroundColor = vec3(0.0);
            vec2 starCoord = distortedCoord * 0.5;
            float stars = noise(starCoord * 100.0);
            if(stars > 0.95) {
              backgroundColor = vec3(1.0) * (stars - 0.95) * 20.0;
            }
            
            vec3 nebulaColor = vec3(
              fbm(distortedCoord * 2.0) * 0.3,
              fbm(distortedCoord * 1.5 + time * 0.1) * 0.2,
              fbm(distortedCoord * 1.8 - time * 0.1) * 0.4
            ) * 0.1;
            
            vec3 finalColor = backgroundColor + nebulaColor + diskColor + jetColor;
            
            float brightness = dot(finalColor, vec3(0.299, 0.587, 0.114));
            if(brightness > 0.5) {
              finalColor *= 1.0 + (brightness - 0.5) * 2.0;
            }
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
        transparent
      />
    </mesh>
  )
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
      opacity: 0.08,
      texture: nebulaTextures[0],
      color: '#ff6080'
    },
    { 
      position: [60, -30, -100], 
      scale: 30, 
      opacity: 0.06,
      texture: nebulaTextures[1],
      color: '#6080ff'
    },
    { 
      position: [-40, -60, -140], 
      scale: 20, 
      opacity: 0.1,
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

// Étoiles réalistes haute qualité
function HighQualityStars() {
  const starsRef = useRef<THREE.Points>(null)
  
  const starGeometry = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    const colors = new Float32Array(1000 * 3)
    const sizes = new Float32Array(1000)
    
    for (let i = 0; i < 1000; i++) {
      const radius = 300 + Math.random() * 500
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Couleurs stellaires réalistes
      const starType = Math.random()
      if (starType < 0.1) {
        colors[i * 3] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 1
        sizes[i] = 2 + Math.random() * 3
      } else if (starType < 0.4) {
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
        sizes[i] = 1 + Math.random() * 2
      } else {
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
      textRef.current.rotation.y = THREE.MathUtils.lerp(textRef.current.rotation.y, mouse.x * 0.15, 0.08)
      textRef.current.rotation.x = THREE.MathUtils.lerp(textRef.current.rotation.x, -mouse.y * 0.08, 0.08)
      
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
        emissiveIntensity={3}
        roughness={0}
        metalness={1}
      />
    </Text>
  )
}

function EpicBlackHoleScene() {
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
      {/* Fond système solaire */}
      <SolarSystemBackground />
      
      {/* Éclairage pour trou noir */}
      <ambientLight intensity={0.02} color="#000044" />
      <directionalLight position={[100, 100, 100]} intensity={0.1} color="#ffffff" />
      
      {/* Éléments spatiaux */}
      <HighQualityStars />
      <RealNebulas />
      
      {/* TROU NOIR ÉPIQUE */}
      <EpicBlackHole mouse={mouse} />
      
      {/* Texte réactif */}
      <SpaceInvadersText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        style={{ background: '#000000' }}
      >
        <EpicBlackHoleScene />
        
        {/* Post-processing intense pour trou noir */}
        <EffectComposer>
          <Bloom 
            intensity={2.5} 
            luminanceThreshold={0.02} 
            luminanceSmoothing={0.05}
          />
          <ChromaticAberration 
            offset={[0.001, 0.001]} 
          />
        </EffectComposer>
      </Canvas>
      
      {/* Interface rétro gaming */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-green-300 text-xl font-mono tracking-[0.4em] opacity-90 drop-shadow-lg" 
           style={{ fontFamily: 'Orbitron, monospace' }}>
          I&apos;m inevitable...
        </p>
        <div className="mt-3 h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70"></div>
      </div>
      
      {/* Indicateur trou noir */}
      <div className="absolute top-4 left-4 text-orange-300 text-xs font-mono opacity-80 bg-black/70 p-3 rounded">
        <div>🕳️ TROU NOIR avec Distorsion Gravitationnelle</div>
        <div>🔥 Disque d&apos;Accrétion avec Cercles Intenses</div>
        <div>⚡ Jets de Particules Relativistes</div>
        <div>🌀 Shader GLSL Physiquement Correct</div>
        <div>🚀 Police Spatiale: Orbitron</div>
      </div>
      
      {/* Footer black hole */}
      <div className="absolute bottom-4 right-4 text-orange-400 text-xs font-mono opacity-60">
        ★ EPIC BLACK HOLE SHADER ★
      </div>
      
      {/* Effet de distorsion gravitationnelle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-orange-500/5 to-transparent animate-pulse"></div>
      </div>
    </div>
  )
}