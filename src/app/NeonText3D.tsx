'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

export default function NeonText3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene de base
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000)
    mountRef.current.appendChild(renderer.domElement)

    // Lumière
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Créer une forme d'étoile
    const createStarShape = () => {
      const starShape = new THREE.Shape()
      const outerRadius = 0.1
      const innerRadius = 0.04
      const points = 5

      for (let i = 0; i < points * 2; i++) {
        const angle = (i / (points * 2)) * Math.PI * 2
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        if (i === 0) {
          starShape.moveTo(x, y)
        } else {
          starShape.lineTo(x, y)
        }
      }
      starShape.closePath()
      return starShape
    }

    // Créer les étoiles avec géométrie personnalisée
    const starShape = createStarShape()
    const extrudeSettings = { depth: 0.02, bevelEnabled: false }
    const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings)
    
    const starInstances: THREE.Mesh[] = []
    const starsCount = 100

    for (let i = 0; i < starsCount; i++) {
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const starMesh = new THREE.Mesh(starGeometry, starMaterial)
      
      // Position aléatoire
      starMesh.position.x = (Math.random() - 0.5) * 50
      starMesh.position.y = (Math.random() - 0.5) * 50
      starMesh.position.z = (Math.random() - 0.5) * 50
      
      // Rotation aléatoire
      starMesh.rotation.x = Math.random() * Math.PI * 2
      starMesh.rotation.y = Math.random() * Math.PI * 2
      starMesh.rotation.z = Math.random() * Math.PI * 2
      
      // Taille aléatoire
      const scale = 0.5 + Math.random() * 1.5
      starMesh.scale.setScalar(scale)
      
      scene.add(starMesh)
      starInstances.push(starMesh)
    }

    // Créer du texte 3D pour CAPPONUTS
    const letters = ['C', 'A', 'P', 'P', 'O', 'N', 'U', 'T', 'S']
    const letterMeshes: THREE.Mesh[] = []
    
    // Charger la police et créer le texte
    const fontLoader = new FontLoader()
    fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      (font) => {
        letters.forEach((letter, index) => {
          const textGeometry = new TextGeometry(letter, {
            font: font,
            size: window.innerWidth < 768 ? 0.6 : 0.8,
            depth: 0.1,
            curveSegments: 12,
          })
          textGeometry.computeBoundingBox()
          textGeometry.translate(
            -textGeometry.boundingBox!.max.x * 0.5,
            -textGeometry.boundingBox!.max.y * 0.5,
            -textGeometry.boundingBox!.max.z * 0.5
          )
          
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
          const mesh = new THREE.Mesh(textGeometry, material)
          mesh.position.x = (index - 4) * (window.innerWidth < 768 ? 1.0 : 1.2)
          mesh.position.y = 0
          mesh.position.z = 0
          scene.add(mesh)
          letterMeshes.push(mesh)
        })
      },
      undefined,
      (error) => {
        console.warn('Police non chargée, utilisation de cubes:', error)
        // Fallback vers des cubes si la police ne charge pas
        letters.forEach((letter, index) => {
          const boxSize = window.innerWidth < 768 ? 0.6 : 0.8
          const geometry = new THREE.BoxGeometry(boxSize, boxSize * 1.25, 0.2)
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.position.x = (index - 4) * (window.innerWidth < 768 ? 1.0 : 1.2)
          mesh.position.y = 0
          mesh.position.z = 0
          scene.add(mesh)
          letterMeshes.push(mesh)
        })
      }
    )

    // Position caméra adaptée à l'écran
    camera.position.z = window.innerWidth < 768 ? 12 : 10

    // Variables pour souris
    let mouseX = 0
    let mouseY = 0

    // Event listener souris
    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotation des étoiles
      starInstances.forEach((star, index) => {
        star.rotation.x += 0.001 + (index * 0.0001)
        star.rotation.y += 0.002 + (index * 0.0001)
        star.rotation.z += 0.001 + (index * 0.0001)
      })

      // Animation des lettres avec souris
      letterMeshes.forEach((mesh, index) => {
        const time = Date.now() * 0.001
        mesh.rotation.x = mouseY * 0.2 + Math.sin(time + index * 0.1) * 0.1
        mesh.rotation.y = mouseX * 0.2 + Math.cos(time + index * 0.1) * 0.1
        mesh.position.y = Math.sin(time * 2 + index * 0.3) * 0.2
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', onResize)

    // Cleanup
    return () => {
      const currentMount = mountRef.current
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-center z-50 w-full px-4">
        <p className="text-green-300 text-lg sm:text-xl md:text-2xl font-mono tracking-wider opacity-95 bg-black/70 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg border border-green-500/30">
          I&apos;m inevitable...
        </p>
      </div>
    </div>
  )
}