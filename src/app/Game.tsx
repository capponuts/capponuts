'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { KeyboardControls, Text, Grid, useKeyboardControls, useTexture, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'

type NpcProps = {
  position: [number, number, number]
  message?: string
}

function lerpAngleShortest(current: number, target: number, t: number): number {
  const twoPi = Math.PI * 2
  let delta = (target - current) % twoPi
  if (delta > Math.PI) delta -= twoPi
  if (delta < -Math.PI) delta += twoPi
  return current + delta * t
}

type InteractableType = 'poker' | 'blackjack' | 'bar' | 'piano'
type Interactable = {
  type: InteractableType
  position: [number, number, number]
  radius: number
  label: string
}

type FallbackKeys = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  run: boolean
  interact: boolean
}

function Character({ color = '#c0c0ff' }: { color?: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.2, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={'#ffe0bd'} />
      </mesh>
      <mesh castShadow position={[0, 1.7, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.32, 0.3, 12]} />
        <meshStandardMaterial color={'#000'} />
      </mesh>
      <mesh castShadow position={[0, 1.56, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 16]} />
        <meshStandardMaterial color={'#111'} />
      </mesh>
    </group>
  )
}

function Npc({ position, message = '...' }: NpcProps) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2
    }
  })
  return (
    <group ref={groupRef} position={position}>
      <Character color="#aab7ff" />
      <Text position={[0, 1.9, 0]} fontSize={0.22} color="#ffd1f3" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000">{message}</Text>
    </group>
  )
}

function PokerTable({ position = [0, 0, 0] as [number, number, number] }) {
  const { scene } = useGLTF('/models/props/sm_pokertable.glb') as unknown as { scene: THREE.Group }
  return (
    <group position={position}>
      <primitive object={scene} scale={[1.6, 1.6, 1.6]} />
      <Text position={[0, 1.6, 0]} fontSize={0.28} color="#fff" anchorX="center" anchorY="middle">Poker</Text>
    </group>
  )
}

function BlackjackTable({ position = [0, 0, 0] as [number, number, number] }) {
  // Conserve la table générique pour blackjack pour l'instant
  return (
    <group position={position}>
      <mesh receiveShadow castShadow position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3, 0.12, 1.6]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.7} />
      </mesh>
      <mesh receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.4]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <Text position={[0, 1.15, 0]} fontSize={0.25} color="#fff" anchorX="center" anchorY="middle">Blackjack</Text>
    </group>
  )
}

function Bar({ position = [0, 0, 0] as [number, number, number] }) {
  const { scene } = useGLTF('/models/props/bar_kit.glb') as unknown as { scene: THREE.Group }
  return (
    <group position={position}>
      <primitive object={scene} scale={[2.2, 1, 1]} />
      <Text position={[0, 1.6, 0]} fontSize={0.25} color="#ffecb3" anchorX="center" anchorY="middle">Bar</Text>
    </group>
  )
}

// useGLTF déjà importé en tête

function Piano({ position = [0, 0, 0] as [number, number, number] }) {
  const { scene } = useGLTF('/models/props/Piano.glb') as unknown as { scene: THREE.Group }
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])
  return (
    <group position={position}>
      <primitive object={scene} scale={[1.8, 1.8, 1.8]} />
      <Text position={[0, 1.8, 0]} fontSize={0.24} color="#e3f2fd" anchorX="center" anchorY="middle">Piano</Text>
    </group>
  )
}

function Pianist({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <Npc position={[0, 0, 0]} message={'♫ Jazz'} />
    </group>
  )
}

function PlayerModel() {
  const { scene } = useGLTF('/models/characters/cool_man_rigged_free.glb') as unknown as { scene: THREE.Group }
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])
  return <primitive object={scene} scale={[1, 1, 1]} />
}

function ThirdPersonCharacter({ onPositionChange, fallbackKeysRef }: { onPositionChange?: (pos: THREE.Vector3) => void; fallbackKeysRef: React.MutableRefObject<FallbackKeys> }) {
  const playerRef = useRef<THREE.Group>(null)
  const velocityRef = useRef(new THREE.Vector3())
  const directionRef = useRef(new THREE.Vector3())
  const upVector = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()

  useFrame((state, delta) => {
    const provider = getKeys() as unknown as {
      forward: boolean
      backward: boolean
      left: boolean
      right: boolean
      run: boolean
    }
    const fallback = fallbackKeysRef.current
    const forward = provider.forward || fallback.forward
    const backward = provider.backward || fallback.backward
    const left = provider.left || fallback.left
    const right = provider.right || fallback.right
    const run = provider.run || fallback.run

    const speed = run ? 4.2 : 2.4

    // Compute intended direction relative to camera on XZ plane
    directionRef.current.set(0, 0, 0)
    const camDir = new THREE.Vector3()
    camera.getWorldDirection(camDir)
    camDir.y = 0
    camDir.normalize()
    const camRight = new THREE.Vector3().crossVectors(camDir, upVector).normalize()
    if (forward) directionRef.current.add(camDir)
    if (backward) directionRef.current.add(camDir.clone().negate())
    if (left) directionRef.current.add(camRight.clone().negate())
    if (right) directionRef.current.add(camRight)
    directionRef.current.normalize()

    // Smooth velocity
    const targetVelocity = directionRef.current.clone().multiplyScalar(speed)
    velocityRef.current.lerp(targetVelocity, 0.15)

    // Update player position
    if (playerRef.current) {
      playerRef.current.position.addScaledVector(velocityRef.current, delta)

      // Boundaries (salle réduite)
      playerRef.current.position.x = THREE.MathUtils.clamp(playerRef.current.position.x, -7, 7)
      playerRef.current.position.z = THREE.MathUtils.clamp(playerRef.current.position.z, -7, 7)

      // Orientation: on tourne seulement si on n'est pas uniquement en marche arrière
      const moving = velocityRef.current.lengthSq() > 0.0001
      const onlyBackward = backward && !forward && !left && !right
      if (moving && !onlyBackward) {
        const desiredRotation = Math.atan2(velocityRef.current.x, velocityRef.current.z)
        const currentY = playerRef.current.rotation.y
        const newY = lerpAngleShortest(currentY, desiredRotation, 0.2)
        playerRef.current.rotation.set(0, newY, 0)
      }

      // Third-person camera follow
      const behindOffset = 3.8
      const height = 2.2
      const forwardDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(upVector, playerRef.current.rotation.y)
      const desiredCamPos = playerRef.current.position
        .clone()
        .addScaledVector(forwardDir, -behindOffset)
        .add(new THREE.Vector3(0, height, 0))
      camera.position.lerp(desiredCamPos, 0.15)
      camera.lookAt(playerRef.current.position.x, playerRef.current.position.y + 1, playerRef.current.position.z)

      if (onPositionChange) {
        onPositionChange(playerRef.current.position.clone())
      }
    }
  })

  return (
    <group ref={playerRef} position={[0, 0.6, 3.5]}>
      <PlayerModel />
    </group>
  )
}

function FloorTextured() {
  const [base, normal, rough] = useTexture([
    '/textures/saloon/floor_base.jpg',
    '/textures/saloon/floor_normal.jpg',
    '/textures/saloon/floor_rough.jpg',
  ])
  base.wrapS = base.wrapT = THREE.RepeatWrapping
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping
  rough.wrapS = rough.wrapT = THREE.RepeatWrapping
  base.repeat.set(3, 3)
  normal.repeat.set(3, 3)
  rough.repeat.set(3, 3)
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[16, 16]} />
      <meshStandardMaterial map={base} normalMap={normal} roughnessMap={rough} roughness={1} />
    </mesh>
  )
}

function WallsTextured() {
  const [base, normal, rough] = useTexture([
    '/textures/saloon/wall_base.jpg',
    '/textures/saloon/wall_normal.jpg',
    '/textures/saloon/wall_rough.jpg',
  ])
  base.wrapS = base.wrapT = THREE.RepeatWrapping
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping
  rough.wrapS = rough.wrapT = THREE.RepeatWrapping
  base.repeat.set(2, 1)
  normal.repeat.set(2, 1)
  rough.repeat.set(2, 1)
  return (
    <>
      <mesh position={[0, 2.0, -8]} receiveShadow castShadow>
        <boxGeometry args={[16, 4.0, 0.2]} />
        <meshStandardMaterial map={base} normalMap={normal} roughnessMap={rough} />
      </mesh>
      <mesh position={[0, 2.0, 8]} receiveShadow castShadow>
        <boxGeometry args={[16, 4.0, 0.2]} />
        <meshStandardMaterial map={base} normalMap={normal} roughnessMap={rough} />
      </mesh>
      <mesh position={[-8, 2.0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 4.0, 0.2]} />
        <meshStandardMaterial map={base} normalMap={normal} roughnessMap={rough} />
      </mesh>
      <mesh position={[8, 2.0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 4.0, 0.2]} />
        <meshStandardMaterial map={base} normalMap={normal} roughnessMap={rough} />
      </mesh>
    </>
  )
}

function Scene({ onPlayerMove, fallbackKeysRef }: { onPlayerMove?: (pos: THREE.Vector3) => void; fallbackKeysRef: React.MutableRefObject<FallbackKeys> }) {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={[0xb3e5fc, 0x141418, 0.7]} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Floor */}
      <FloorTextured />
      <Grid
        position={[0, 0.005, 0]}
        args={[16, 16]}
        cellColor="#2a2a44"
        sectionColor="#3a3a66"
        cellSize={0.5}
        sectionSize={3}
        fadeDistance={10}
        fadeStrength={2}
      />

      {/* Simple room walls */}
      <WallsTextured />

      {/* Props */}
      <PokerTable position={[-3.5, 0, -1.4]} />
      <BlackjackTable position={[3.5, 0, -1.4]} />
      <Bar position={[0, 0, -6]} />
      <Piano position={[5.2, 0, 3.6]} />
      <Pianist position={[4.7, 0, 4.1]} />

      {/* NPCs */}
      <Npc position={[-5, 0, 3.8]} message={'Tu connais la martingale ?'} />
      <Npc position={[-4.2, 0, 4.3]} message={"J'ai un bon pressentiment..."} />
      <Npc position={[4.5, 0, 1.4]} message={'La maison gagne toujours.'} />

      {/* Player */}
      <ThirdPersonCharacter onPositionChange={onPlayerMove} fallbackKeysRef={fallbackKeysRef} />
    </>
  )
}

function ProximitySensor({
  playerPositionRef,
  interactables,
  onNearestChange,
}: {
  playerPositionRef: React.MutableRefObject<THREE.Vector3 | null>
  interactables: Interactable[]
  onNearestChange: (nearest: Interactable | null, distance: number | null) => void
}) {
  const lastNearestRef = useRef<string | null>(null)
  useFrame(() => {
    const playerPos = playerPositionRef.current
    if (!playerPos) return
    let nearest: Interactable | null = null
    let nearestDist = Infinity
    for (const it of interactables) {
      const dx = playerPos.x - it.position[0]
      const dz = playerPos.z - it.position[2]
      const dist = Math.hypot(dx, dz)
      if (dist < it.radius && dist < nearestDist) {
        nearest = it
        nearestDist = dist
      }
    }
    const id = nearest ? `${nearest.type}-${nearest.position.join(',')}` : null
    if (id !== lastNearestRef.current) {
      lastNearestRef.current = id
      onNearestChange(nearest, nearest ? nearestDist : null)
    }
  })
  return null
}

function InteractionHandler({
  nearest,
  onOpenUI,
  uiOpen,
  fallbackKeysRef,
}: {
  nearest: Interactable | null
  onOpenUI: (type: InteractableType) => void
  uiOpen: boolean
  fallbackKeysRef: React.MutableRefObject<FallbackKeys>
}) {
  const [, getKeys] = useKeyboardControls()
  useFrame(() => {
    const { interact } = getKeys() as unknown as { interact: boolean }
    const fallbackInteract = fallbackKeysRef.current.interact
    if ((interact || fallbackInteract) && nearest && !uiOpen) {
      onOpenUI(nearest.type)
    }
  })
  return null
}

type BlackjackPhase = 'betting' | 'dealing' | 'player' | 'dealer' | 'result'
type Card = { value: string; suit: string }

function drawCard(deck: Card[]): Card {
  return deck.shift() as Card
}

function buildShuffledDeck(): Card[] {
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const suits = ['♠', '♥', '♦', '♣']
  const deck: Card[] = []
  for (const s of suits) {
    for (const v of values) {
      deck.push({ value: v, suit: s })
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function handValue(hand: Card[]): number {
  let total = 0
  let aces = 0
  for (const c of hand) {
    if (c.value === 'A') {
      aces += 1
      total += 11
    } else if (['K', 'Q', 'J'].includes(c.value)) {
      total += 10
    } else {
      total += parseInt(c.value, 10)
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }
  return total
}

function BlackjackGame({ onClose }: { onClose: () => void }) {
  const [bank, setBank] = useState(200)
  const [bet, setBet] = useState(10)
  const [deck, setDeck] = useState<Card[]>(buildShuffledDeck())
  const [player, setPlayer] = useState<Card[]>([])
  const [dealer, setDealer] = useState<Card[]>([])
  const [phase, setPhase] = useState<BlackjackPhase>('betting')
  const [message, setMessage] = useState<string>('Faites vos jeux!')

  const startHand = () => {
    if (bet <= 0 || bet > bank) {
      setMessage('Mise invalide')
      return
    }
    const d = deck.length < 15 ? buildShuffledDeck() : [...deck]
    const p: Card[] = [drawCard(d), drawCard(d)]
    const h: Card[] = [drawCard(d), drawCard(d)]
    setDeck(d)
    setPlayer(p)
    setDealer(h)
    setPhase('player')
    setBank((b) => b - bet)
    setMessage('À vous de jouer')
  }

  const hit = () => {
    if (phase !== 'player') return
    const d = [...deck]
    const p = [...player, drawCard(d)]
    setDeck(d)
    setPlayer(p)
    if (handValue(p) > 21) {
      setPhase('result')
      setMessage('Vous avez dépassé 21. Perdu!')
    }
  }

  const stand = () => {
    if (phase !== 'player') return
    setPhase('dealer')
    dealerPlay()
  }

  const doubleDown = () => {
    if (phase !== 'player' || bank < bet) return
    setBank((b) => b - bet)
    setBet((m) => m * 2)
    const d = [...deck]
    const p = [...player, drawCard(d)]
    setDeck(d)
    setPlayer(p)
    if (handValue(p) > 21) {
      setPhase('result')
      setMessage('Vous avez dépassé 21 après Double. Perdu!')
    } else {
      setPhase('dealer')
      dealerPlay()
    }
  }

  const dealerPlay = () => {
    setTimeout(() => {
      const d = [...deck]
      let h = [...dealer]
      while (handValue(h) < 17) {
        h = [...h, drawCard(d)]
      }
      setDeck(d)
      setDealer(h)
      const pv = handValue(player)
      const dv = handValue(h)
      if (dv > 21 || pv > dv) {
        setMessage('Gagné!')
        setBank((b) => b + bet * 2)
      } else if (pv === dv) {
        setMessage('Égalité')
        setBank((b) => b + bet)
      } else {
        setMessage('Perdu!')
      }
      setPhase('result')
    }, 300)
  }

  const resetForNext = () => {
    setBet((m) => Math.min(m, bank))
    setPlayer([])
    setDealer([])
    setPhase('betting')
    setMessage('Faites vos jeux!')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ width: 520, maxWidth: '95vw', color: '#e0e0e0', background: '#101018', border: '1px solid #333', borderRadius: 12, padding: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Blackjack</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #444', color: '#bbb', borderRadius: 6, padding: '6px 10px' }}>Fermer (Esc)</button>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>Banque: {bank} • Mise: {bet}</div>
            {phase === 'betting' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <button onClick={() => setBet((m) => Math.max(1, m - 5))}>-5</button>
                <button onClick={() => setBet((m) => Math.max(1, m - 1))}>-1</button>
                <input type="number" value={bet} onChange={(e) => setBet(Math.max(1, Math.min(bank, parseInt(e.target.value || '1'))))} style={{ width: 80, background: '#0b0b12', color: '#ddd', border: '1px solid #333', padding: 6, borderRadius: 6 }} />
                <button onClick={() => setBet((m) => Math.min(bank, m + 1))}>+1</button>
                <button onClick={() => setBet((m) => Math.min(bank, m + 5))}>+5</button>
                <button onClick={() => setBet(bank)}>All-in</button>
                <button onClick={startHand} disabled={bank <= 0 || bet <= 0} style={{ marginLeft: 'auto' }}>Distribuer</button>
              </div>
            )}
            {phase !== 'betting' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div>Joueur ({handValue(player)})</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 48 }}>
                    {player.map((c, i) => (
                      <span key={i} style={{ padding: '6px 8px', background: '#182028', border: '1px solid #2a3a48', borderRadius: 8 }}>
                        {c.value}{c.suit}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div>Donneur ({phase === 'player' ? '?' : handValue(dealer)})</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 48 }}>
                    {dealer.map((c, i) => (
                      <span key={i} style={{ padding: '6px 8px', background: i === 1 && phase === 'player' ? '#0b0b12' : '#281820', border: '1px solid #2a3a48', borderRadius: 8 }}>
                        {i === 1 && phase === 'player' ? '🂠' : `${c.value}${c.suit}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ marginTop: 12, minHeight: 24 }}>{message}</div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {phase === 'player' && (
                <>
                  <button onClick={hit}>Tirer</button>
                  <button onClick={stand}>Rester</button>
                  <button onClick={doubleDown} disabled={bank < bet}>Doubler</button>
                </>
              )}
              {phase === 'result' && (
                <>
                  <button onClick={resetForNext}>Rejouer</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CasinoGame() {
  const keyMap = useMemo(
    () => [
      { name: 'forward', keys: ['ArrowUp', 'KeyW', 'KeyZ'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA', 'KeyQ'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] },
      { name: 'run', keys: ['Shift'] },
      { name: 'interact', keys: ['KeyE'] },
    ],
    []
  )

  const playerPositionRef = useRef<THREE.Vector3 | null>(null)
  const fallbackKeysRef = useRef<FallbackKeys>({ forward: false, backward: false, left: false, right: false, run: false, interact: false })
  const [nearest, setNearest] = useState<Interactable | null>(null)
  const [uiMode, setUiMode] = useState<InteractableType | null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  const interactables = useMemo<Interactable[]>(
    () => [
      { type: 'poker', position: [-6, 0, -2], radius: 2.2, label: 'Jouer au Poker (E)' },
      { type: 'blackjack', position: [6, 0, -2], radius: 2.2, label: 'Jouer au Blackjack (E)' },
      { type: 'bar', position: [0, 0, -12], radius: 2.8, label: 'Prendre un verre (E)' },
      { type: 'piano', position: [12, 0, 8], radius: 2.5, label: 'Écouter le pianiste (E)' },
    ],
    []
  )

  // Fallback clavier ZQSD/Flèches/WASD
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'z' || k === 'w' || e.key === 'ArrowUp') fallbackKeysRef.current.forward = true
      if (k === 's' || e.key === 'ArrowDown') fallbackKeysRef.current.backward = true
      if (k === 'q' || k === 'a' || e.key === 'ArrowLeft') fallbackKeysRef.current.left = true
      if (k === 'd' || e.key === 'ArrowRight') fallbackKeysRef.current.right = true
      if (e.key === 'Shift') fallbackKeysRef.current.run = true
      if (k === 'e') fallbackKeysRef.current.interact = true
      if (k === 'h' || e.key === 'Escape') setShowHelp((v) => !v)
      if (k === 'm') setMuted((m) => !m)
    }
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'z' || k === 'w' || e.key === 'ArrowUp') fallbackKeysRef.current.forward = false
      if (k === 's' || e.key === 'ArrowDown') fallbackKeysRef.current.backward = false
      if (k === 'q' || k === 'a' || e.key === 'ArrowLeft') fallbackKeysRef.current.left = false
      if (k === 'd' || e.key === 'ArrowRight') fallbackKeysRef.current.right = false
      if (e.key === 'Shift') fallbackKeysRef.current.run = false
      if (k === 'e') fallbackKeysRef.current.interact = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // Préparer l'élément audio mais ne pas lancer automatiquement (politiques autoplay)
  useEffect(() => {
    const el = document.getElementById('saloon-audio') as HTMLAudioElement | null
    if (el) {
      audioRef.current = el
      el.volume = 0.25
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100vh', background: 'black' }}>
      <KeyboardControls map={keyMap}>
        <Canvas shadows camera={{ position: [0, 3, 8], fov: 60 }}>
          <color attach="background" args={[0x060608]} />
          <fog attach="fog" args={[0x060608, 15, 45]} />
          <Scene onPlayerMove={(pos) => { playerPositionRef.current = pos }} fallbackKeysRef={fallbackKeysRef} />
          <ProximitySensor
            playerPositionRef={playerPositionRef}
            interactables={interactables}
            onNearestChange={(n) => setNearest(n)}
          />
          <InteractionHandler
            nearest={nearest}
            uiOpen={uiMode !== null}
            onOpenUI={(type) => setUiMode(type)}
            fallbackKeysRef={fallbackKeysRef}
          />
        </Canvas>
      </KeyboardControls>

      {/* HUD */}
      <div style={{ position: 'fixed', top: 12, left: 12, color: '#b3e5fc', fontFamily: 'monospace', fontSize: 14, zIndex: 5 }}>
        <div><strong>Contrôles</strong>: Z/Q/S/D ou Flèches — Shift pour courir — E pour interagir — H/Echap: Aide</div>
      </div>

      {/* Prompt d'interaction */}
      {nearest && uiMode === null && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', borderRadius: 8, padding: '8px 12px', zIndex: 5 }}>
          {nearest.label}
        </div>
      )}

      {/* Audio ambiance saloon */}
      <audio id="saloon-audio" src="/saloon_ambiance.mp3" loop autoPlay={false} muted={muted} style={{ display: 'none' }} />
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 6, display: 'flex', gap: 8 }}>
        {!soundOn ? (
          <button
            onClick={() => {
              const el = document.getElementById('saloon-audio') as HTMLAudioElement | null
              if (el) {
                el.volume = 0.25
                el.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false))
              }
            }}
            style={{ background: '#0b0b12', color: '#b3e5fc', border: '1px solid #234', borderRadius: 8, padding: '8px 12px' }}
          >Activer le son</button>
        ) : (
          <button
            onClick={() => setMuted((m) => !m)}
            style={{ background: '#0b0b12', color: '#b3e5fc', border: '1px solid #234', borderRadius: 8, padding: '8px 12px' }}
            title="M pour mute"
          >{muted ? 'Son coupé' : 'Son actif'}</button>
        )}
      </div>

      {/* UI Jeux */}
      {uiMode === 'blackjack' && <BlackjackGame onClose={() => setUiMode(null)} />}
      {uiMode === 'poker' && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', zIndex: 1000 }}>
          <div style={{ background: '#101018', color: '#ddd', border: '1px solid #333', borderRadius: 12, padding: 16, width: 420, maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Poker</h3>
              <button onClick={() => setUiMode(null)}>Fermer</button>
            </div>
            <p style={{ marginTop: 12 }}>Mode Poker en construction. À venir: Texas Hold&apos;em simplifié.</p>
          </div>
        </div>
      )}
      {uiMode === 'bar' && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', zIndex: 1000 }}>
          <div style={{ background: '#101018', color: '#ddd', border: '1px solid #333', borderRadius: 12, padding: 16, width: 420, maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Bar</h3>
              <button onClick={() => setUiMode(null)}>Fermer</button>
            </div>
            <p style={{ marginTop: 12 }}>Le barman vous salue. “Ce sera quoi ?” (à implémenter)</p>
          </div>
        </div>
      )}
      {uiMode === 'piano' && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', zIndex: 1000 }}>
          <div style={{ background: '#101018', color: '#ddd', border: '1px solid #333', borderRadius: 12, padding: 16, width: 420, maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Pianiste</h3>
              <button onClick={() => setUiMode(null)}>Fermer</button>
            </div>
            <p style={{ marginTop: 12 }}>Le pianiste commence un air jazzy. (boucle audio légère à venir)</p>
          </div>
        </div>
      )}

      {/* Menu d'aide */}
      {showHelp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
          <div style={{ width: 520, maxWidth: '92vw', background: '#0b0b12', color: '#d0e7ff', border: '1px solid #234', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Aide & Features</h3>
              <button onClick={() => setShowHelp(false)}>Fermer (H/Echap)</button>
            </div>
            <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.7 }}>
              <div><strong>Contrôles</strong>: Z/Q/S/D ou Flèches, Shift: courir, E: interagir, M: mute, H/Echap: aide</div>
              <div><strong>Features</strong>: tables Poker/Blackjack, bar, pianiste, PNJ, audio d&apos;ambiance</div>
              <div><strong>À venir</strong>: Poker Texas Hold&apos;em, collisions physiques, animations avancées du Cowboy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


