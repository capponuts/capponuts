"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getDoomAudio } from "./sounds";
import { E1M1, isWalkable, isDoor, getWallType, DoorState } from "./level";
import {
  WALL_TEXTURES,
  ZOMBIEMAN_SPRITE,
  ZOMBIEMAN_DEAD,
  IMP_SPRITE,
  IMP_ATTACK,
  IMP_DEAD,
  DEMON_SPRITE,
  PISTOL_FRAMES,
  SHOTGUN_FRAMES,
  FIST_FRAMES,
  HEALTH_BONUS,
  ARMOR_BONUS,
  AMMO_CLIP,
  SHOTGUN_AMMO,
  MEDIKIT,
  DOOMGUY_FACES,
  SpriteFrame,
} from "./sprites";

// ============================================================================
// TYPES
// ============================================================================

type GameState = "intro" | "menu" | "loading" | "game" | "dead" | "victory";
type WeaponType = "fist" | "pistol" | "shotgun";

interface Player {
  x: number;
  y: number;
  angle: number;
  health: number;
  armor: number;
  ammo: { bullets: number; shells: number };
  weapon: WeaponType;
  bobPhase: number;
  isMoving: boolean;
  hurtTimer: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  type: "zombieman" | "imp" | "demon";
  health: number;
  maxHealth: number;
  state: "idle" | "walking" | "attacking" | "hurt" | "dead";
  angle: number;
  lastAttack: number;
  animFrame: number;
  seenPlayer: boolean;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
}

interface Item {
  id: number;
  x: number;
  y: number;
  type: string;
  collected: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 400;
const HUD_HEIGHT = 40;
const VIEW_HEIGHT = SCREEN_HEIGHT - HUD_HEIGHT;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const NUM_RAYS = 320;
const MAX_DEPTH = 24;
const MOVE_SPEED = 0.06;
const ROT_SPEED = 0.04;

// ============================================================================
// INTRO COMPONENT
// ============================================================================

function DoomIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const audio = getDoomAudio();

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => {
        audio.startTitleMusic();
        onComplete();
      }, 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, audio]);

  useEffect(() => {
    const skip = () => {
      audio.resume();
      audio.startTitleMusic();
      onComplete();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [onComplete, audio]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {phase === 0 && (
        <div className="text-center animate-pulse">
          <div className="text-red-700 text-3xl font-bold tracking-[0.3em]" style={{ fontFamily: "Impact, sans-serif" }}>
            id Software
          </div>
          <div className="text-gray-600 text-sm mt-2">presents</div>
        </div>
      )}
      {phase === 1 && (
        <div className="text-center">
          <div className="text-gray-500 text-lg">A</div>
          <div className="text-red-600 text-2xl font-bold my-2" style={{ fontFamily: "Impact, sans-serif" }}>
            CAPPONUTS
          </div>
          <div className="text-gray-500 text-lg">production</div>
        </div>
      )}
      {phase >= 2 && (
        <div className="text-center">
          <div
            style={{
              fontFamily: "Impact, sans-serif",
              fontSize: "100px",
              color: "#8B0000",
              textShadow: "0 0 20px #FF0000, 0 0 40px #FF0000, 4px 4px 0 #000",
              letterSpacing: "15px",
              animation: "pulse 0.5s ease-in-out infinite alternate",
            }}
          >
            DOOM
          </div>
          <div className="text-gray-500 text-sm mt-4 animate-pulse">Press any key...</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MENU COMPONENT
// ============================================================================

function DoomMenu({ onNewGame }: { onNewGame: () => void }) {
  const [selected, setSelected] = useState(0);
  const [skullFrame, setSkullFrame] = useState(0);
  const audio = getDoomAudio();

  const options = [
    { label: "New Game", action: onNewGame },
    { label: "Options", action: () => {} },
    { label: "Quit", action: () => window.history.back() },
  ];

  useEffect(() => {
    const interval = setInterval(() => setSkullFrame((f) => (f + 1) % 2), 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      audio.resume();
      if (e.key === "ArrowUp" || e.key === "w") {
        audio.playMenuMove();
        setSelected((s) => (s - 1 + options.length) % options.length);
      } else if (e.key === "ArrowDown" || e.key === "s") {
        audio.playMenuMove();
        setSelected((s) => (s + 1) % options.length);
      } else if (e.key === "Enter" || e.key === " ") {
        audio.playMenuSelect();
        audio.stopMusic();
        options[selected].action();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, options, audio]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(ellipse at center, #2a0000 0%, #000 70%)" }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "Impact, sans-serif",
          fontSize: "70px",
          color: "#8B0000",
          textShadow: "0 0 15px #FF0000, 3px 3px 0 #000",
          letterSpacing: "10px",
          marginBottom: "50px",
        }}
      >
        DOOM
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => (
          <div
            key={opt.label}
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => {
              audio.playMenuSelect();
              audio.stopMusic();
              opt.action();
            }}
            onMouseEnter={() => {
              audio.playMenuMove();
              setSelected(i);
            }}
          >
            <span
              className="text-2xl"
              style={{
                visibility: selected === i ? "visible" : "hidden",
                transform: skullFrame === 0 ? "scaleX(1)" : "scaleX(-1)",
              }}
            >
              💀
            </span>
            <span
              style={{
                fontFamily: "Impact, sans-serif",
                fontSize: "24px",
                color: selected === i ? "#FF4444" : "#AA0000",
                textShadow: selected === i ? "0 0 10px #FF0000" : "none",
                letterSpacing: "3px",
              }}
            >
              {opt.label}
            </span>
            <span
              className="text-2xl"
              style={{
                visibility: selected === i ? "visible" : "hidden",
                transform: skullFrame === 0 ? "scaleX(-1)" : "scaleX(1)",
              }}
            >
              💀
            </span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 text-gray-600 text-xs">
        CAPPONUTS EDITION © 2024 | ↑↓ Navigate | Enter Select
      </div>
    </div>
  );
}

// ============================================================================
// LOADING SCREEN
// ============================================================================

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + Math.random() * 12;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div style={{ fontFamily: "Impact, sans-serif", fontSize: "32px", color: "#8B0000", marginBottom: "30px" }}>
        {E1M1.name}
      </div>
      <div className="w-72 h-5 bg-gray-900 border-2 border-gray-700">
        <div
          className="h-full transition-all duration-75"
          style={{ width: `${Math.min(100, progress)}%`, background: "linear-gradient(180deg, #8B0000 0%, #5C0000 100%)" }}
        />
      </div>
      <div className="text-gray-500 mt-3 text-sm">{Math.floor(Math.min(100, progress))}%</div>
    </div>
  );
}

// ============================================================================
// GAME ENGINE
// ============================================================================

function DoomGame({ onDeath, onVictory }: { onDeath: () => void; onVictory: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audio = useRef(getDoomAudio());
  const keysRef = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef(0);

  const [player, setPlayer] = useState<Player>({
    x: E1M1.playerStart.x + 0.5,
    y: E1M1.playerStart.y + 0.5,
    angle: E1M1.playerStart.angle,
    health: 100,
    armor: 0,
    ammo: { bullets: 50, shells: 0 },
    weapon: "pistol",
    bobPhase: 0,
    isMoving: false,
    hurtTimer: 0,
  });

  const [enemies, setEnemies] = useState<Enemy[]>(() =>
    E1M1.enemies.map((e, i) => ({
      id: i,
      x: e.x + 0.5,
      y: e.y + 0.5,
      type: e.type,
      health: e.type === "zombieman" ? 20 : e.type === "imp" ? 60 : 150,
      maxHealth: e.type === "zombieman" ? 20 : e.type === "imp" ? 60 : 150,
      state: "idle",
      angle: e.angle,
      lastAttack: 0,
      animFrame: 0,
      seenPlayer: false,
    }))
  );

  const [items, setItems] = useState<Item[]>(() =>
    E1M1.items.map((item, i) => ({ id: i, ...item, collected: false }))
  );

  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [doors, setDoors] = useState<Map<string, DoorState>>(new Map());
  const [weaponFrame, setWeaponFrame] = useState(0);
  const [isShooting, setIsShooting] = useState(false);

  // Initialize doors
  useEffect(() => {
    const doorMap = new Map<string, DoorState>();
    E1M1.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 4) {
          doorMap.set(`${x},${y}`, { x, y, open: 0, opening: false, closing: false });
        }
      });
    });
    setDoors(doorMap);
  }, []);

  // Start music
  useEffect(() => {
    audio.current.resume();
    audio.current.startE1M1Music();
    return () => audio.current.stopMusic();
  }, []);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      audio.current.resume();

      if (e.key === " " || e.key === "Control") {
        setIsShooting(true);
      }
      // Weapon switch
      if (e.key === "1") setPlayer((p) => ({ ...p, weapon: "fist" }));
      if (e.key === "2") setPlayer((p) => ({ ...p, weapon: "pistol" }));
      if (e.key === "3" && player.ammo.shells > 0) setPlayer((p) => ({ ...p, weapon: "shotgun" }));
      // Use/Open door
      if (e.key === "e" || e.key === "Enter") {
        tryOpenDoor();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [player]);

  // Try to open nearby door
  const tryOpenDoor = useCallback(() => {
    const checkDist = 1.5;
    const checkX = Math.floor(player.x + Math.cos(player.angle) * checkDist);
    const checkY = Math.floor(player.y + Math.sin(player.angle) * checkDist);
    const doorKey = `${checkX},${checkY}`;

    setDoors((prev) => {
      const newDoors = new Map(prev);
      const door = newDoors.get(doorKey);
      if (door && !door.opening && door.open < 0.9) {
        audio.current.playDoorOpen();
        newDoors.set(doorKey, { ...door, opening: true, closing: false });
      }
      return newDoors;
    });
  }, [player]);

  // Shooting logic
  useEffect(() => {
    if (!isShooting) return;

    const weapon = player.weapon;
    let canShoot = false;
    let damage = 0;
    let spread = 0;

    if (weapon === "fist") {
      canShoot = true;
      damage = 10;
      audio.current.playPunch();
    } else if (weapon === "pistol" && player.ammo.bullets > 0) {
      canShoot = true;
      damage = 15;
      audio.current.playPistolShot();
      setPlayer((p) => ({ ...p, ammo: { ...p.ammo, bullets: p.ammo.bullets - 1 } }));
    } else if (weapon === "shotgun" && player.ammo.shells > 0) {
      canShoot = true;
      damage = 10;
      spread = 0.1;
      audio.current.playShotgunShot();
      setPlayer((p) => ({ ...p, ammo: { ...p.ammo, shells: p.ammo.shells - 1 } }));
    }

    if (canShoot) {
      // Weapon animation
      setWeaponFrame(1);
      setTimeout(() => setWeaponFrame(2), 60);
      setTimeout(() => setWeaponFrame(3), 120);
      setTimeout(() => {
        setWeaponFrame(0);
        setIsShooting(false);
      }, weapon === "shotgun" ? 400 : 200);

      // Hitscan for each pellet (shotgun = 7 pellets)
      const pellets = weapon === "shotgun" ? 7 : 1;
      const maxRange = weapon === "fist" ? 2 : 20;

      for (let p = 0; p < pellets; p++) {
        const angle = player.angle + (Math.random() - 0.5) * spread * 2;
        
        // Cast ray to find hit
        let hitDist = maxRange;
        for (let d = 0.1; d < maxRange; d += 0.1) {
          const testX = player.x + Math.cos(angle) * d;
          const testY = player.y + Math.sin(angle) * d;
          
          // Check wall hit
          const mapX = Math.floor(testX);
          const mapY = Math.floor(testY);
          if (mapY >= 0 && mapY < E1M1.map.length && mapX >= 0 && mapX < E1M1.map[0].length) {
            const cell = E1M1.map[mapY][mapX];
            if (cell !== 0 && cell !== 4) {
              hitDist = d;
              break;
            }
          }
        }

        // Check enemy hit
        setEnemies((currentEnemies) => {
          return currentEnemies.map((enemy) => {
            if (enemy.state === "dead") return enemy;

            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > hitDist) return enemy;

            const enemyAngle = Math.atan2(dy, dx);
            let angleDiff = enemyAngle - angle;
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

            const hitRadius = 0.4 / dist;
            if (Math.abs(angleDiff) < hitRadius) {
              audio.current.playEnemyHit();
              const newHealth = enemy.health - damage;

              if (newHealth <= 0) {
                audio.current.playEnemyDeath();
                return { ...enemy, health: 0, state: "dead" as const };
              }
              return { ...enemy, health: newHealth, state: "hurt" as const, seenPlayer: true };
            }
            return enemy;
          });
        });
      }
    } else {
      setIsShooting(false);
    }
  }, [isShooting, player]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = (time: number) => {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update player
      setPlayer((p) => {
        let newX = p.x;
        let newY = p.y;
        let newAngle = p.angle;
        let isMoving = false;

        const keys = keysRef.current;

        // Rotation
        if (keys.has("arrowleft") || keys.has("a")) newAngle -= ROT_SPEED;
        if (keys.has("arrowright") || keys.has("d")) newAngle += ROT_SPEED;

        // Movement
        const moveX = Math.cos(newAngle) * MOVE_SPEED;
        const moveY = Math.sin(newAngle) * MOVE_SPEED;
        const strafeX = Math.cos(newAngle + Math.PI / 2) * MOVE_SPEED;
        const strafeY = Math.sin(newAngle + Math.PI / 2) * MOVE_SPEED;

        if (keys.has("arrowup") || keys.has("w")) {
          if (isWalkable(E1M1.map, newX + moveX * 1.5, newY, doors)) newX += moveX;
          if (isWalkable(E1M1.map, newX, newY + moveY * 1.5, doors)) newY += moveY;
          isMoving = true;
        }
        if (keys.has("arrowdown") || keys.has("s")) {
          if (isWalkable(E1M1.map, newX - moveX * 1.5, newY, doors)) newX -= moveX;
          if (isWalkable(E1M1.map, newX, newY - moveY * 1.5, doors)) newY -= moveY;
          isMoving = true;
        }
        if (keys.has("q")) {
          if (isWalkable(E1M1.map, newX - strafeX * 1.5, newY, doors)) newX -= strafeX;
          if (isWalkable(E1M1.map, newX, newY - strafeY * 1.5, doors)) newY -= strafeY;
          isMoving = true;
        }
        if (keys.has("e") === false && keys.has("shift")) {
          if (isWalkable(E1M1.map, newX + strafeX * 1.5, newY, doors)) newX += strafeX;
          if (isWalkable(E1M1.map, newX, newY + strafeY * 1.5, doors)) newY += strafeY;
          isMoving = true;
        }

        // Check exit
        const exitDist = Math.sqrt((newX - E1M1.exitPos.x - 0.5) ** 2 + (newY - E1M1.exitPos.y - 0.5) ** 2);
        if (exitDist < 1) {
          onVictory();
        }

        return {
          ...p,
          x: newX,
          y: newY,
          angle: newAngle,
          isMoving,
          bobPhase: isMoving ? p.bobPhase + 0.2 : 0,
          hurtTimer: Math.max(0, p.hurtTimer - deltaTime),
        };
      });

      // Update doors
      setDoors((prev) => {
        const newDoors = new Map(prev);
        newDoors.forEach((door, key) => {
          if (door.opening) {
            const newOpen = Math.min(1, door.open + deltaTime * 2);
            if (newOpen >= 1) {
              newDoors.set(key, { ...door, open: 1, opening: false });
              // Auto close after 3 seconds
              setTimeout(() => {
                setDoors((d) => {
                  const nd = new Map(d);
                  const dr = nd.get(key);
                  if (dr && dr.open >= 1) {
                    audio.current.playDoorClose();
                    nd.set(key, { ...dr, closing: true });
                  }
                  return nd;
                });
              }, 3000);
            } else {
              newDoors.set(key, { ...door, open: newOpen });
            }
          } else if (door.closing) {
            const newOpen = Math.max(0, door.open - deltaTime * 2);
            if (newOpen <= 0) {
              newDoors.set(key, { ...door, open: 0, closing: false });
            } else {
              newDoors.set(key, { ...door, open: newOpen });
            }
          }
        });
        return newDoors;
      });

      // Update enemies
      setEnemies((currentEnemies) => {
        return currentEnemies.map((enemy) => {
          if (enemy.state === "dead") return enemy;

          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angleToPlayer = Math.atan2(dy, dx);

          // Check if can see player
          let canSee = dist < 15;
          if (canSee) {
            for (let d = 0.5; d < dist; d += 0.5) {
              const checkX = Math.floor(enemy.x + Math.cos(angleToPlayer) * d);
              const checkY = Math.floor(enemy.y + Math.sin(angleToPlayer) * d);
              if (E1M1.map[checkY]?.[checkX] !== 0 && E1M1.map[checkY]?.[checkX] !== 4) {
                canSee = false;
                break;
              }
            }
          }

          if (canSee) {
            enemy.seenPlayer = true;
            enemy.angle = angleToPlayer;
          }

          if (enemy.state === "hurt") {
            return { ...enemy, state: "walking" as const, animFrame: (enemy.animFrame + 1) % 4 };
          }

          if (enemy.seenPlayer && enemy.state !== "attacking") {
            // Move towards player
            if (dist > (enemy.type === "demon" ? 1.5 : 3)) {
              const speed = enemy.type === "demon" ? 0.03 : 0.015;
              const newX = enemy.x + Math.cos(angleToPlayer) * speed;
              const newY = enemy.y + Math.sin(angleToPlayer) * speed;
              if (isWalkable(E1M1.map, newX, newY, doors)) {
                return { ...enemy, x: newX, y: newY, state: "walking" as const, animFrame: (enemy.animFrame + 1) % 4 };
              }
            }

            // Attack
            const now = Date.now();
            const attackRange = enemy.type === "demon" ? 2 : 10;
            const attackCooldown = enemy.type === "demon" ? 1000 : 2000;

            if (dist < attackRange && now - enemy.lastAttack > attackCooldown) {
              if (enemy.type === "imp") {
                // Imp throws fireball
                audio.current.playImpFireball();
                setProjectiles((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    x: enemy.x,
                    y: enemy.y,
                    angle: angleToPlayer,
                    speed: 0.15,
                    damage: 15,
                  },
                ]);
              } else if (enemy.type === "zombieman") {
                // Hitscan attack
                audio.current.playPistolShot();
                if (Math.random() < 0.3) {
                  setPlayer((p) => {
                    const newHealth = Math.max(0, p.health - 10);
                    audio.current.playPlayerHurt();
                    if (newHealth <= 0) {
                      audio.current.playPlayerDeath();
                      setTimeout(onDeath, 1000);
                    }
                    return { ...p, health: newHealth, hurtTimer: 0.2 };
                  });
                }
              } else if (enemy.type === "demon" && dist < 2) {
                // Melee attack
                audio.current.playPunch();
                setPlayer((p) => {
                  const newHealth = Math.max(0, p.health - 20);
                  audio.current.playPlayerHurt();
                  if (newHealth <= 0) {
                    audio.current.playPlayerDeath();
                    setTimeout(onDeath, 1000);
                  }
                  return { ...p, health: newHealth, hurtTimer: 0.2 };
                });
              }
              return { ...enemy, state: "attacking" as const, lastAttack: now };
            }
          }

          if (enemy.state === "attacking") {
            return { ...enemy, state: "idle" as const };
          }

          return enemy;
        });
      });

      // Update projectiles
      setProjectiles((prev) => {
        return prev
          .map((proj) => {
            const newX = proj.x + Math.cos(proj.angle) * proj.speed;
            const newY = proj.y + Math.sin(proj.angle) * proj.speed;

            // Check wall collision
            const mapX = Math.floor(newX);
            const mapY = Math.floor(newY);
            if (E1M1.map[mapY]?.[mapX] !== 0 && E1M1.map[mapY]?.[mapX] !== 4) {
              return null;
            }

            // Check player collision
            const distToPlayer = Math.sqrt((newX - player.x) ** 2 + (newY - player.y) ** 2);
            if (distToPlayer < 0.5) {
              setPlayer((p) => {
                const newHealth = Math.max(0, p.health - proj.damage);
                audio.current.playPlayerHurt();
                if (newHealth <= 0) {
                  audio.current.playPlayerDeath();
                  setTimeout(onDeath, 1000);
                }
                return { ...p, health: newHealth, hurtTimer: 0.3 };
              });
              return null;
            }

            return { ...proj, x: newX, y: newY };
          })
          .filter((p): p is Projectile => p !== null);
      });

      // Check item pickup
      setItems((currentItems) => {
        return currentItems.map((item) => {
          if (item.collected) return item;

          const dist = Math.sqrt((item.x + 0.5 - player.x) ** 2 + (item.y + 0.5 - player.y) ** 2);
          if (dist < 0.8) {
            audio.current.playItemPickup();

            if (item.type === "health") {
              setPlayer((p) => ({ ...p, health: Math.min(100, p.health + 10) }));
            } else if (item.type === "medikit") {
              setPlayer((p) => ({ ...p, health: Math.min(100, p.health + 25) }));
            } else if (item.type === "armor") {
              setPlayer((p) => ({ ...p, armor: Math.min(100, p.armor + 10) }));
            } else if (item.type === "ammo") {
              setPlayer((p) => ({ ...p, ammo: { ...p.ammo, bullets: p.ammo.bullets + 10 } }));
            } else if (item.type === "shells") {
              setPlayer((p) => ({ ...p, ammo: { ...p.ammo, shells: p.ammo.shells + 4 } }));
            } else if (item.type === "shotgun") {
              audio.current.playWeaponPickup();
              setPlayer((p) => ({ ...p, weapon: "shotgun", ammo: { ...p.ammo, shells: p.ammo.shells + 8 } }));
            }

            return { ...item, collected: true };
          }
          return item;
        });
      });

      // Render
      render(ctx);

      animationId = requestAnimationFrame(gameLoop);
    };

    const render = (ctx: CanvasRenderingContext2D) => {
      // Clear
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      // Hurt flash
      if (player.hurtTimer > 0) {
        ctx.fillStyle = `rgba(255, 0, 0, ${player.hurtTimer})`;
        ctx.fillRect(0, 0, SCREEN_WIDTH, VIEW_HEIGHT);
      }

      // Ceiling
      const ceilGrad = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT / 2);
      ceilGrad.addColorStop(0, "#1a1a2e");
      ceilGrad.addColorStop(1, "#0f0f1a");
      ctx.fillStyle = ceilGrad;
      ctx.fillRect(0, 0, SCREEN_WIDTH, VIEW_HEIGHT / 2);

      // Floor
      const floorGrad = ctx.createLinearGradient(0, VIEW_HEIGHT / 2, 0, VIEW_HEIGHT);
      floorGrad.addColorStop(0, "#2d2d2d");
      floorGrad.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, VIEW_HEIGHT / 2, SCREEN_WIDTH, VIEW_HEIGHT / 2);

      // Raycasting
      const zBuffer: number[] = [];

      for (let ray = 0; ray < NUM_RAYS; ray++) {
        const rayAngle = player.angle - HALF_FOV + (ray / NUM_RAYS) * FOV;
        const sinA = Math.sin(rayAngle);
        const cosA = Math.cos(rayAngle);

        let distance = 0;
        let wallType = 0;
        let side = 0;
        let texX = 0;

        for (let d = 0.02; d < MAX_DEPTH; d += 0.02) {
          const testX = player.x + cosA * d;
          const testY = player.y + sinA * d;
          const mapX = Math.floor(testX);
          const mapY = Math.floor(testY);

          if (mapY >= 0 && mapY < E1M1.map.length && mapX >= 0 && mapX < E1M1.map[0].length) {
            const cell = E1M1.map[mapY][mapX];

            if (cell !== 0) {
              // Check if door
              if (cell === 4) {
                const doorKey = `${mapX},${mapY}`;
                const door = doors.get(doorKey);
                if (door && door.open > 0.9) continue;
              }

              distance = d;
              wallType = cell;

              // Calculate texture X coordinate
              const hitX = testX - mapX;
              const hitY = testY - mapY;
              if (hitX < 0.02 || hitX > 0.98) {
                side = 0;
                texX = hitY;
              } else {
                side = 1;
                texX = hitX;
              }
              break;
            }
          }
        }

        // Fix fisheye
        const correctedDist = distance * Math.cos(rayAngle - player.angle);
        zBuffer[ray] = correctedDist;

        // Wall height
        const wallHeight = Math.min(VIEW_HEIGHT * 2, VIEW_HEIGHT / (correctedDist + 0.001));
        const wallTop = (VIEW_HEIGHT - wallHeight) / 2;

        // Draw textured wall
        const texture = WALL_TEXTURES[wallType];
        if (texture) {
          const texXInt = Math.floor(texX * 64) % 64;
          const shade = Math.max(0.2, 1 - correctedDist / MAX_DEPTH) * (side === 0 ? 1 : 0.7);

          for (let y = 0; y < wallHeight; y++) {
            const texY = Math.floor((y / wallHeight) * 64) % 64;
            const color = texture[texY]?.[texXInt] || "#4a4a4a";

            // Apply shading
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            ctx.fillStyle = `rgb(${Math.floor(r * shade)},${Math.floor(g * shade)},${Math.floor(b * shade)})`;
            ctx.fillRect(
              (ray / NUM_RAYS) * SCREEN_WIDTH,
              wallTop + y,
              SCREEN_WIDTH / NUM_RAYS + 1,
              1
            );
          }
        }
      }

      // Draw sprites (enemies, items, projectiles)
      const sprites: { x: number; y: number; dist: number; type: string; data: unknown }[] = [];

      // Add enemies
      enemies.forEach((enemy) => {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        sprites.push({
          x: enemy.x,
          y: enemy.y,
          dist: Math.sqrt(dx * dx + dy * dy),
          type: "enemy",
          data: enemy,
        });
      });

      // Add items
      items.forEach((item) => {
        if (item.collected) return;
        const dx = item.x + 0.5 - player.x;
        const dy = item.y + 0.5 - player.y;
        sprites.push({
          x: item.x + 0.5,
          y: item.y + 0.5,
          dist: Math.sqrt(dx * dx + dy * dy),
          type: "item",
          data: item,
        });
      });

      // Add projectiles
      projectiles.forEach((proj) => {
        const dx = proj.x - player.x;
        const dy = proj.y - player.y;
        sprites.push({
          x: proj.x,
          y: proj.y,
          dist: Math.sqrt(dx * dx + dy * dy),
          type: "projectile",
          data: proj,
        });
      });

      // Sort by distance (far to near)
      sprites.sort((a, b) => b.dist - a.dist);

      // Draw sprites
      sprites.forEach((sprite) => {
        const dx = sprite.x - player.x;
        const dy = sprite.y - player.y;
        const dist = sprite.dist;

        let spriteAngle = Math.atan2(dy, dx) - player.angle;
        while (spriteAngle > Math.PI) spriteAngle -= 2 * Math.PI;
        while (spriteAngle < -Math.PI) spriteAngle += 2 * Math.PI;

        if (Math.abs(spriteAngle) > HALF_FOV + 0.3) return;

        const screenX = SCREEN_WIDTH / 2 + (spriteAngle / HALF_FOV) * (SCREEN_WIDTH / 2);
        const spriteHeight = Math.min(VIEW_HEIGHT * 1.5, VIEW_HEIGHT / dist);
        const spriteWidth = spriteHeight * 0.8;

        // Check z-buffer
        const rayIndex = Math.floor((screenX / SCREEN_WIDTH) * NUM_RAYS);
        if (rayIndex >= 0 && rayIndex < zBuffer.length && dist > zBuffer[rayIndex]) return;

        const shade = Math.max(0.3, 1 - dist / MAX_DEPTH);

        if (sprite.type === "enemy") {
          const enemy = sprite.data as Enemy;
          let spriteData: SpriteFrame;

          if (enemy.state === "dead") {
            spriteData = enemy.type === "zombieman" ? ZOMBIEMAN_DEAD : IMP_DEAD;
          } else if (enemy.state === "attacking" && enemy.type === "imp") {
            spriteData = IMP_ATTACK;
          } else {
            spriteData =
              enemy.type === "zombieman"
                ? ZOMBIEMAN_SPRITE
                : enemy.type === "imp"
                ? IMP_SPRITE
                : DEMON_SPRITE;
          }

          drawSprite(ctx, spriteData, screenX, spriteHeight, shade, enemy.state === "dead");
        } else if (sprite.type === "item") {
          const item = sprite.data as Item;
          let itemSprite: SpriteFrame;

          switch (item.type) {
            case "health":
              itemSprite = HEALTH_BONUS;
              break;
            case "armor":
              itemSprite = ARMOR_BONUS;
              break;
            case "ammo":
              itemSprite = AMMO_CLIP;
              break;
            case "shells":
              itemSprite = SHOTGUN_AMMO;
              break;
            case "medikit":
              itemSprite = MEDIKIT;
              break;
            default:
              itemSprite = HEALTH_BONUS;
          }

          const itemHeight = spriteHeight * 0.4;
          drawSprite(ctx, itemSprite, screenX, itemHeight, shade, false, true);
        } else if (sprite.type === "projectile") {
          // Draw fireball
          const size = spriteHeight * 0.3;
          const gradient = ctx.createRadialGradient(screenX, VIEW_HEIGHT / 2, 0, screenX, VIEW_HEIGHT / 2, size / 2);
          gradient.addColorStop(0, "#FFFFFF");
          gradient.addColorStop(0.3, "#FFFF00");
          gradient.addColorStop(0.6, "#FF4400");
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(screenX, VIEW_HEIGHT / 2, size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw weapon
      drawWeapon(ctx);

      // Draw HUD
      drawHUD(ctx);

      // Crosshair
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(SCREEN_WIDTH / 2 - 10, VIEW_HEIGHT / 2);
      ctx.lineTo(SCREEN_WIDTH / 2 + 10, VIEW_HEIGHT / 2);
      ctx.moveTo(SCREEN_WIDTH / 2, VIEW_HEIGHT / 2 - 10);
      ctx.lineTo(SCREEN_WIDTH / 2, VIEW_HEIGHT / 2 + 10);
      ctx.stroke();
    };

    const drawSprite = (
      ctx: CanvasRenderingContext2D,
      sprite: SpriteFrame,
      screenX: number,
      height: number,
      shade: number,
      isDead: boolean,
      isItem: boolean = false
    ) => {
      const width = (height * sprite.width) / sprite.height;
      const startX = screenX - width / 2;
      const startY = isDead ? VIEW_HEIGHT - height : isItem ? VIEW_HEIGHT / 2 : (VIEW_HEIGHT - height) / 2;

      const pixelW = width / sprite.width;
      const pixelH = height / sprite.height;

      for (let py = 0; py < sprite.height; py++) {
        for (let px = 0; px < sprite.width; px++) {
          const color = sprite.pixels[py]?.[px];
          if (!color || color === "transparent") continue;

          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);

          ctx.fillStyle = `rgb(${Math.floor(r * shade)},${Math.floor(g * shade)},${Math.floor(b * shade)})`;
          ctx.fillRect(startX + px * pixelW, startY + py * pixelH, pixelW + 1, pixelH + 1);
        }
      }
    };

    const drawWeapon = (ctx: CanvasRenderingContext2D) => {
      const bobX = Math.sin(player.bobPhase) * 8;
      const bobY = Math.abs(Math.cos(player.bobPhase)) * 5;

      let weaponSprite: SpriteFrame;
      let weaponScale = 2;

      if (player.weapon === "fist") {
        weaponSprite = FIST_FRAMES[Math.min(weaponFrame, FIST_FRAMES.length - 1)];
        weaponScale = 2.5;
      } else if (player.weapon === "shotgun") {
        weaponSprite = SHOTGUN_FRAMES[Math.min(weaponFrame, SHOTGUN_FRAMES.length - 1)];
        weaponScale = 1.8;
      } else {
        weaponSprite = PISTOL_FRAMES[Math.min(weaponFrame, PISTOL_FRAMES.length - 1)];
      }

      const width = weaponSprite.width * weaponScale;
      const height = weaponSprite.height * weaponScale;
      const startX = SCREEN_WIDTH / 2 - width / 2 + bobX;
      const startY = VIEW_HEIGHT - height + bobY;

      const pixelW = width / weaponSprite.width;
      const pixelH = height / weaponSprite.height;

      for (let py = 0; py < weaponSprite.height; py++) {
        for (let px = 0; px < weaponSprite.width; px++) {
          const color = weaponSprite.pixels[py]?.[px];
          if (!color || color === "transparent") continue;

          ctx.fillStyle = color;
          ctx.fillRect(startX + px * pixelW, startY + py * pixelH, pixelW + 1, pixelH + 1);
        }
      }
    };

    const drawHUD = (ctx: CanvasRenderingContext2D) => {
      const hudY = VIEW_HEIGHT;

      // Background
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(0, hudY, SCREEN_WIDTH, HUD_HEIGHT);
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(0, hudY, SCREEN_WIDTH, 2);

      // Doomguy face
      const faceIndex = Math.min(5, Math.floor((100 - player.health) / 20));
      const face = DOOMGUY_FACES[faceIndex];
      const faceSize = 32;
      const faceX = SCREEN_WIDTH / 2 - faceSize / 2;
      const faceY = hudY + 4;

      for (let py = 0; py < face.height; py++) {
        for (let px = 0; px < face.width; px++) {
          const color = face.pixels[py]?.[px];
          if (!color || color === "transparent") continue;
          ctx.fillStyle = color;
          ctx.fillRect(faceX + px, faceY + py, 1, 1);
        }
      }

      // Health
      ctx.fillStyle = "#8B0000";
      ctx.font = "bold 12px monospace";
      ctx.fillText("HEALTH", 15, hudY + 15);
      ctx.fillStyle = "#FF0000";
      ctx.font = "bold 18px monospace";
      ctx.fillText(`${player.health}%`, 15, hudY + 34);

      // Armor
      ctx.fillStyle = "#006400";
      ctx.font = "bold 12px monospace";
      ctx.fillText("ARMOR", 100, hudY + 15);
      ctx.fillStyle = "#00FF00";
      ctx.font = "bold 18px monospace";
      ctx.fillText(`${player.armor}%`, 100, hudY + 34);

      // Ammo
      ctx.fillStyle = "#8B8B00";
      ctx.font = "bold 12px monospace";
      ctx.fillText("AMMO", SCREEN_WIDTH - 100, hudY + 15);
      ctx.fillStyle = "#FFFF00";
      ctx.font = "bold 18px monospace";
      const ammoCount = player.weapon === "shotgun" ? player.ammo.shells : player.ammo.bullets;
      ctx.fillText(`${ammoCount}`, SCREEN_WIDTH - 100, hudY + 34);

      // Weapon indicator
      ctx.fillStyle = "#888";
      ctx.font = "10px monospace";
      ctx.fillText(`[${player.weapon.toUpperCase()}]`, SCREEN_WIDTH - 180, hudY + 25);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [player, enemies, items, projectiles, doors, weaponFrame, onDeath, onVictory]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        className="border-2 border-gray-800"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="absolute top-2 left-2 text-gray-600 text-xs">
        WASD: Move | Q/Shift: Strafe | E: Open | 1-3: Weapons | Space: Shoot
      </div>
    </div>
  );
}

// ============================================================================
// DEATH SCREEN
// ============================================================================

function DeathScreen({ onRestart, onMenu }: { onRestart: () => void; onMenu: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") onRestart();
      if (e.key === "Escape") onMenu();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onRestart, onMenu]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div
        style={{
          fontFamily: "Impact, sans-serif",
          fontSize: "60px",
          color: "#8B0000",
          textShadow: "0 0 20px #FF0000",
          marginBottom: "30px",
        }}
      >
        YOU DIED
      </div>
      <div className="text-gray-500 text-lg mb-8">The demons have claimed another soul...</div>
      <div className="flex gap-8">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-red-900 hover:bg-red-700 text-white font-bold tracking-wider"
          style={{ fontFamily: "Impact, sans-serif" }}
        >
          TRY AGAIN [ENTER]
        </button>
        <button
          onClick={onMenu}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold tracking-wider"
          style={{ fontFamily: "Impact, sans-serif" }}
        >
          MENU [ESC]
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// VICTORY SCREEN
// ============================================================================

function VictoryScreen({ onMenu }: { onMenu: () => void }) {
  const audio = getDoomAudio();

  useEffect(() => {
    audio.playSecretFound();
  }, [audio]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div
        style={{
          fontFamily: "Impact, sans-serif",
          fontSize: "50px",
          color: "#00AA00",
          textShadow: "0 0 20px #00FF00",
          marginBottom: "20px",
        }}
      >
        LEVEL COMPLETE!
      </div>
      <div className="text-gray-400 text-lg mb-4">E1M1: Hangar - Cleared</div>
      <div className="text-gray-500 mb-8">You have survived... for now.</div>
      <button
        onClick={onMenu}
        className="px-8 py-4 bg-green-900 hover:bg-green-700 text-white font-bold tracking-wider text-xl"
        style={{ fontFamily: "Impact, sans-serif" }}
      >
        CONTINUE
      </button>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function DoomPage() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [gameKey, setGameKey] = useState(0);

  const handleRestart = useCallback(() => {
    setGameKey((k) => k + 1);
    setGameState("loading");
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
      style={{ cursor: gameState === "game" ? "none" : "default" }}
    >
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); filter: brightness(1); }
          100% { transform: scale(1.02); filter: brightness(1.3); }
        }
      `}</style>

      <div className="relative" style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
        {gameState === "intro" && <DoomIntro onComplete={() => setGameState("menu")} />}
        {gameState === "menu" && <DoomMenu onNewGame={() => setGameState("loading")} />}
        {gameState === "loading" && <LoadingScreen onComplete={() => setGameState("game")} />}
        {gameState === "game" && (
          <DoomGame
            key={gameKey}
            onDeath={() => setGameState("dead")}
            onVictory={() => setGameState("victory")}
          />
        )}
        {gameState === "dead" && (
          <DeathScreen onRestart={handleRestart} onMenu={() => setGameState("menu")} />
        )}
        {gameState === "victory" && <VictoryScreen onMenu={() => setGameState("menu")} />}
      </div>
    </div>
  );
}
