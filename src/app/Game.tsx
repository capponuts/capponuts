'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { KeyboardControls, Text, Grid, useKeyboardControls } from '@react-three/drei'
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
      <mesh castShadow position={[0, 0.6, 0]}> 
        <capsuleGeometry args={[0.35, 0.6, 8, 16]} />
        <meshStandardMaterial color="#c0c0ff" />
      </mesh>
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.25}
        color="#ffd1f3"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {message}
      </Text>
    </group>
  )
}

function PokerTable({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh receiveShadow castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.1, 32]} />
        <meshStandardMaterial color="#1b5e20" roughness={0.7} />
      </mesh>
      <mesh receiveShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
        <meshStandardMaterial color="#3e2723" />
      </mesh>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        return (
          <mesh key={i} position={[x, 0.45, z]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.9, 12]} />
            <meshStandardMaterial color="#4e342e" />
          </mesh>
        )
      })}
      <Text position={[0, 1.1, 0]} fontSize={0.25} color="#fff" anchorX="center" anchorY="middle">Poker</Text>
    </group>
  )
}

function BlackjackTable({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh receiveShadow castShadow position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3, 0.12, 1.6]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.7} />
      </mesh>
      <mesh receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.4]} />
        <meshStandardMaterial color="#3e2723" />
      </mesh>
      {[...Array(4)].map((_, i) => {
        const x = -1.2 + i * 0.8
        const z = 1.1
        return (
          <mesh key={i} position={[x, 0.5, z]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.9, 12]} />
            <meshStandardMaterial color="#4e342e" />
          </mesh>
        )
      })}
      <Text position={[0, 1.15, 0]} fontSize={0.25} color="#fff" anchorX="center" anchorY="middle">Blackjack</Text>
    </group>
  )
}

function Bar({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 1.0, 1.2]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[-1.6 + i * 1.1, 0.45, 1]} castShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.9, 12]} />
          <meshStandardMaterial color="#6d4c41" />
        </mesh>
      ))}
      <Text position={[0, 1.6, 0]} fontSize={0.25} color="#ffecb3" anchorX="center" anchorY="middle">Bar</Text>
    </group>
  )
}

import { useGLTF } from '@react-three/drei'

function Piano({ position = [0, 0, 0] as [number, number, number] }) {
  const { scene } = useGLTF('/models/props/Piano.glb') as unknown as { scene: THREE.Group }
  const ref = useRef<THREE.Group>(null)
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
      <primitive object={scene} ref={ref} scale={[0.9, 0.9, 0.9]} />
      <Text position={[0, 1.6, 0]} fontSize={0.22} color="#e3f2fd" anchorX="center" anchorY="middle">Piano</Text>
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

function ThirdPersonCharacter({ onPositionChange }: { onPositionChange?: (pos: THREE.Vector3) => void }) {
  const playerRef = useRef<THREE.Group>(null)
  const velocityRef = useRef(new THREE.Vector3())
  const directionRef = useRef(new THREE.Vector3())
  const upVector = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()

  useFrame((state, delta) => {
    const { forward, backward, left, right, run } = getKeys() as unknown as {
      forward: boolean
      backward: boolean
      left: boolean
      right: boolean
      run: boolean
    }

    const speed = run ? 6 : 3

    // Compute intended direction on XZ plane
    directionRef.current.set(0, 0, 0)
    if (forward) directionRef.current.z -= 1
    if (backward) directionRef.current.z += 1
    if (left) directionRef.current.x -= 1
    if (right) directionRef.current.x += 1
    directionRef.current.normalize()

    // Smooth velocity
    const targetVelocity = directionRef.current.clone().multiplyScalar(speed)
    velocityRef.current.lerp(targetVelocity, 0.15)

    // Update player position
    if (playerRef.current) {
      playerRef.current.position.addScaledVector(velocityRef.current, delta)

      // Boundaries in a square room
      playerRef.current.position.x = THREE.MathUtils.clamp(playerRef.current.position.x, -18, 18)
      playerRef.current.position.z = THREE.MathUtils.clamp(playerRef.current.position.z, -18, 18)

      // Face movement direction if moving
      if (velocityRef.current.lengthSq() > 0.0001) {
        const desiredRotation = Math.atan2(velocityRef.current.x, velocityRef.current.z)
        const currentY = playerRef.current.rotation.y
        const newY = lerpAngleShortest(currentY, desiredRotation, 0.2)
        playerRef.current.rotation.set(0, newY, 0)
      }

      // Third-person camera follow
      const behindOffset = 4
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
    <group ref={playerRef} position={[0, 0.6, 6]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial color="#90caf9" />
      </mesh>
    </group>
  )
}

function Scene({ onPlayerMove }: { onPlayerMove?: (pos: THREE.Vector3) => void }) {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0b0b0f" roughness={1} />
      </mesh>
      <Grid
        position={[0, 0.005, 0]}
        args={[50, 50]}
        cellColor="#232338"
        sectionColor="#2f2f55"
        cellSize={0.5}
        sectionSize={5}
        fadeDistance={25}
        fadeStrength={2}
      />

      {/* Props */}
      <PokerTable position={[-6, 0, -2]} />
      <BlackjackTable position={[6, 0, -2]} />
      <Bar position={[0, 0, -12]} />
      <Piano position={[12, 0, 8]} />
      <Pianist position={[12, 0, 8.8]} />

      {/* NPCs */}
      <Npc position={[-8, 0, 6]} message={'Tu connais la martingale ?'} />
      <Npc position={[-7.2, 0, 6.6]} message={"J'ai un bon pressentiment..."} />
      <Npc position={[7.5, 0, 2.2]} message={'La maison gagne toujours.'} />

      {/* Player */}
      <ThirdPersonCharacter onPositionChange={onPlayerMove} />
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
}: {
  nearest: Interactable | null
  onOpenUI: (type: InteractableType) => void
  uiOpen: boolean
}) {
  const [, getKeys] = useKeyboardControls()
  useFrame(() => {
    const { interact } = getKeys() as unknown as { interact: boolean }
    if (interact && nearest && !uiOpen) {
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
  const [nearest, setNearest] = useState<Interactable | null>(null)
  const [uiMode, setUiMode] = useState<InteractableType | null>(null)

  const interactables = useMemo<Interactable[]>(
    () => [
      { type: 'poker', position: [-6, 0, -2], radius: 2.2, label: 'Jouer au Poker (E)' },
      { type: 'blackjack', position: [6, 0, -2], radius: 2.2, label: 'Jouer au Blackjack (E)' },
      { type: 'bar', position: [0, 0, -12], radius: 2.8, label: 'Prendre un verre (E)' },
      { type: 'piano', position: [12, 0, 8], radius: 2.5, label: 'Écouter le pianiste (E)' },
    ],
    []
  )

  return (
    <div style={{ width: '100%', height: '100vh', background: 'black' }}>
      <KeyboardControls map={keyMap}>
        <Canvas shadows camera={{ position: [0, 3, 8], fov: 60 }}>
          <color attach="background" args={[0x060608]} />
          <fog attach="fog" args={[0x060608, 15, 45]} />
          <Scene onPlayerMove={(pos) => { playerPositionRef.current = pos }} />
          <ProximitySensor
            playerPositionRef={playerPositionRef}
            interactables={interactables}
            onNearestChange={(n) => setNearest(n)}
          />
          <InteractionHandler
            nearest={nearest}
            uiOpen={uiMode !== null}
            onOpenUI={(type) => setUiMode(type)}
          />
        </Canvas>
      </KeyboardControls>

      {/* HUD */}
      <div style={{ position: 'fixed', top: 12, left: 12, color: '#b3e5fc', fontFamily: 'monospace', fontSize: 14, zIndex: 5 }}>
        <div><strong>Contrôles</strong>: Z/Q/S/D ou Flèches — Shift pour courir — E pour interagir</div>
      </div>

      {/* Prompt d'interaction */}
      {nearest && uiMode === null && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', borderRadius: 8, padding: '8px 12px', zIndex: 5 }}>
          {nearest.label}
        </div>
      )}

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
    </div>
  )
}


