'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

// Charger une police spatiale via Google Fonts avec fallback
function loadSpaceFont() {
  if (typeof document !== 'undefined') {
    try {
      const link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'
      link.rel = 'stylesheet'
      link.onerror = () => {
        console.warn('Police Orbitron non chargée, utilisation de la police système')
      }
      document.head.appendChild(link)
    } catch (error) {
      console.warn('Erreur chargement police:', error)
    }
  }
}

// Créer un fond d'espace procédural (fallback si images ne se chargent pas)
function createProceduralSpaceBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  // Gradient d'espace profond
  const gradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 1024)
  gradient.addColorStop(0, '#001122')
  gradient.addColorStop(0.5, '#000011')
  gradient.addColorStop(1, '#000000')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 2048, 1024)
  
  // Étoiles procédurales
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 1024
    const brightness = Math.random() * 0.8 + 0.2
    const size = Math.random() > 0.95 ? 2 : 1
    
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
    ctx.fillRect(x, y, size, size)
  }
  
  // Nébuleuses procédurales
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 1024
    const radius = 100 + Math.random() * 200
    
    const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    const colors = ['#ff4080', '#4080ff', '#80ff40', '#ff8040', '#8040ff']
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    nebulaGradient.addColorStop(0, color + '20')
    nebulaGradient.addColorStop(0.5, color + '10')
    nebulaGradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = nebulaGradient
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }
  
  return new THREE.CanvasTexture(canvas)
}

// Fond d'espace avec fallback procédural
function SpaceBackground() {
  const backgroundTexture = useMemo(() => createProceduralSpaceBackground(), [])
  
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
    blackHolePos: { value: new THREE.Vector3(0, 0, -20) },
    accretionIntensity: { value: 2.0 },
    distortionStrength: { value: 1.5 },
                eventHorizonRadius: { value: 4.0 },
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
    <mesh ref={blackHoleRef} position={[0, 0, -20]}>
      <planeGeometry args={[60, 40]} />
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

// Texte CAPPONUTS avec police spatiale et fallback
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
      position={[0, 0, 5]}
      fontSize={2.2}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.15}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
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
      {/* Fond d'espace procédural */}
      <SpaceBackground />
      
      {/* Éclairage pour trou noir */}
      <ambientLight intensity={0.02} color="#000044" />
      <directionalLight position={[100, 100, 100]} intensity={0.1} color="#ffffff" />
      
      {/* Éléments spatiaux */}
      <HighQualityStars />
      
      {/* TROU NOIR ÉPIQUE */}
      <EpicBlackHole mouse={mouse} />
      
      {/* Texte réactif */}
      <SpaceInvadersText mouse={mouse} />
    </>
  )
}

export default function NeonText3D() {
  // Gestion des erreurs WebGL
  const [hasWebGLError, setHasWebGLError] = useState(false)

  useEffect(() => {
    const handleWebGLContextLost = () => {
      console.warn('Contexte WebGL perdu, rechargement...')
      setHasWebGLError(true)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }

    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleWebGLContextLost)
      return () => canvas.removeEventListener('webglcontextlost', handleWebGLContextLost)
    }
  }, [])

  if (hasWebGLError) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-green-300 font-mono">
          <div className="text-2xl mb-4">🔄 Rechargement du contexte WebGL...</div>
          <div className="text-sm opacity-70">Le rendu 3D va redémarrer automatiquement</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 60 }}
        style={{ background: '#000000' }}
        onCreated={({ gl }) => {
          // Configuration WebGL robuste
          gl.setClearColor('#000000')
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}
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
           style={{ fontFamily: 'Orbitron, Courier, monospace' }}>
          I&apos;m inevitable...
        </p>
        <div className="mt-3 h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70"></div>
      </div>
      
      {/* Indicateur trou noir */}
      <div className="absolute top-4 left-4 text-orange-300 text-xs font-mono opacity-80 bg-black/70 p-3 rounded">
        <div>🕳️ TROU NOIR Procédural avec Distorsion</div>
        <div>🔥 Disque d&apos;Accrétion avec Cercles</div>
        <div>⚡ Jets Relativistes</div>
        <div>🌀 Shader GLSL Optimisé</div>
        <div>🚀 Police Système avec Fallback</div>
      </div>
      
      {/* Footer black hole */}
      <div className="absolute bottom-4 right-4 text-orange-400 text-xs font-mono opacity-60">
        ★ ROBUSTE BLACK HOLE ★
      </div>
      
      {/* Effet de distorsion gravitationnelle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-orange-500/5 to-transparent animate-pulse"></div>
      </div>
    </div>
  )
}