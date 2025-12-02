"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type GameState = "intro" | "menu" | "game" | "loading";
type MenuOption = "new_game" | "options" | "quit";

interface Player {
  x: number;
  y: number;
  angle: number;
  health: number;
  armor: number;
  ammo: number;
  weapon: number;
  bobPhase: number;
  isMoving: boolean;
}

interface Enemy {
  x: number;
  y: number;
  type: "zombieman" | "imp";
  health: number;
  state: "idle" | "walking" | "attacking" | "hurt" | "dead";
  angle: number;
  lastAttack: number;
  animFrame: number;
}

interface Projectile {
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  isEnemy: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 400;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const NUM_RAYS = 320;
const MAX_DEPTH = 20;
const TILE_SIZE = 1;
const MOVE_SPEED = 0.05;
const ROT_SPEED = 0.03;

// E1M1 inspired map (simplified)
const MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 3, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Wall colors by type
const WALL_COLORS: Record<number, { light: string; dark: string }> = {
  1: { light: "#8B4513", dark: "#5D2E0C" }, // Brown walls
  2: { light: "#4A4A4A", dark: "#2A2A2A" }, // Gray walls
  3: { light: "#8B0000", dark: "#5C0000" }, // Red walls (tech)
};

// ============================================================================
// DOOM INTRO COMPONENT
// ============================================================================

function DoomIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => setOpacity(1), 100);
    // id Software logo
    const phase1 = setTimeout(() => setPhase(1), 2000);
    // DOOM logo
    const phase2 = setTimeout(() => setPhase(2), 4000);
    // Skip to menu
    const complete = setTimeout(() => onComplete(), 6000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(complete);
    };
  }, [onComplete]);

  // Skip on click/key
  useEffect(() => {
    const handleSkip = () => onComplete();
    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);
    return () => {
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, [onComplete]);

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-black transition-opacity duration-1000"
      style={{ opacity }}
    >
      {phase === 0 && (
        <div className="text-center animate-pulse">
          <div className="text-red-600 text-2xl font-bold tracking-widest mb-2">
            id Software
          </div>
          <div className="text-gray-500 text-sm">presents</div>
        </div>
      )}
      {phase === 1 && (
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-4">A</div>
          <div className="text-red-500 text-xl font-bold">CAPPONUTS</div>
          <div className="text-gray-400 text-lg mt-4">production</div>
        </div>
      )}
      {phase >= 2 && (
        <div className="relative">
          {/* DOOM Logo */}
          <div
            className="doom-logo text-center"
            style={{
              fontFamily: "Impact, sans-serif",
              fontSize: "120px",
              fontWeight: "bold",
              color: "#8B0000",
              textShadow: `
                0 0 10px #FF0000,
                0 0 20px #FF0000,
                0 0 30px #FF0000,
                0 0 40px #8B0000,
                4px 4px 0 #000,
                -2px -2px 0 #000
              `,
              letterSpacing: "10px",
              animation: "doom-pulse 0.5s ease-in-out infinite alternate",
            }}
          >
            DOOM
          </div>
          <div className="text-gray-500 text-center mt-4 text-sm animate-pulse">
            Press any key to continue...
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DOOM MENU COMPONENT
// ============================================================================

function DoomMenu({
  onNewGame,
  onOptions,
}: {
  onNewGame: () => void;
  onOptions: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState<MenuOption>("new_game");
  const [skullFrame, setSkullFrame] = useState(0);

  const menuOptions: { id: MenuOption; label: string; action: () => void }[] = [
    { id: "new_game", label: "New Game", action: onNewGame },
    { id: "options", label: "Options", action: onOptions },
    { id: "quit", label: "Quit Game", action: () => window.history.back() },
  ];

  // Skull animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSkullFrame((f) => (f + 1) % 2);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const currentIndex = menuOptions.findIndex(
        (o) => o.id === selectedOption
      );
      if (e.key === "ArrowUp" || e.key === "w") {
        const newIndex =
          (currentIndex - 1 + menuOptions.length) % menuOptions.length;
        setSelectedOption(menuOptions[newIndex].id);
      } else if (e.key === "ArrowDown" || e.key === "s") {
        const newIndex = (currentIndex + 1) % menuOptions.length;
        setSelectedOption(menuOptions[newIndex].id);
      } else if (e.key === "Enter" || e.key === " ") {
        menuOptions.find((o) => o.id === selectedOption)?.action();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedOption, menuOptions]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #1a0000 0%, #000000 50%, #1a0000 100%)",
      }}
    >
      {/* DOOM Logo */}
      <div
        className="mb-16"
        style={{
          fontFamily: "Impact, sans-serif",
          fontSize: "80px",
          fontWeight: "bold",
          color: "#8B0000",
          textShadow: `
            0 0 10px #FF0000,
            0 0 20px #FF0000,
            3px 3px 0 #000
          `,
          letterSpacing: "8px",
        }}
      >
        DOOM
      </div>

      {/* Menu Options */}
      <div className="flex flex-col gap-4">
        {menuOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center gap-4 cursor-pointer group"
            onClick={option.action}
            onMouseEnter={() => setSelectedOption(option.id)}
          >
            {/* Skull cursor */}
            <div
              className="w-8 h-8 flex items-center justify-center text-2xl"
              style={{
                visibility:
                  selectedOption === option.id ? "visible" : "hidden",
                transform: skullFrame === 0 ? "scaleX(1)" : "scaleX(-1)",
              }}
            >
              💀
            </div>
            <div
              className="text-2xl tracking-wider"
              style={{
                fontFamily: "Impact, sans-serif",
                color: selectedOption === option.id ? "#FF4444" : "#AA0000",
                textShadow:
                  selectedOption === option.id
                    ? "0 0 10px #FF0000"
                    : "none",
              }}
            >
              {option.label}
            </div>
            <div
              className="w-8 h-8 flex items-center justify-center text-2xl"
              style={{
                visibility:
                  selectedOption === option.id ? "visible" : "hidden",
                transform: skullFrame === 0 ? "scaleX(-1)" : "scaleX(1)",
              }}
            >
              💀
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-gray-600 text-sm">
        <div>CAPPONUTS EDITION - 2024</div>
        <div className="text-center mt-2 text-xs">
          Use ↑↓ or W/S to navigate, Enter to select
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DOOM GAME ENGINE
// ============================================================================

function DoomGame({ onQuit }: { onQuit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Player>({
    x: 2,
    y: 2,
    angle: 0,
    health: 100,
    armor: 0,
    ammo: 50,
    weapon: 1,
    bobPhase: 0,
    isMoving: false,
  });
  const [enemies, setEnemies] = useState<Enemy[]>([
    { x: 5, y: 5, type: "zombieman", health: 20, state: "idle", angle: 0, lastAttack: 0, animFrame: 0 },
    { x: 15, y: 5, type: "imp", health: 60, state: "idle", angle: 0, lastAttack: 0, animFrame: 0 },
    { x: 10, y: 15, type: "zombieman", health: 20, state: "idle", angle: 0, lastAttack: 0, animFrame: 0 },
  ]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [isShooting, setIsShooting] = useState(false);
  const [weaponFrame, setWeaponFrame] = useState(0);
  const keysRef = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef(0);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === "Escape") onQuit();
      if (e.key === " " || e.key === "Control") {
        setIsShooting(true);
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
  }, [onQuit]);

  // Check collision
  const checkCollision = useCallback((x: number, y: number): boolean => {
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);
    if (mapX < 0 || mapX >= MAP[0].length || mapY < 0 || mapY >= MAP.length) {
      return true;
    }
    return MAP[mapY][mapX] !== 0;
  }, []);

  // Raycast function
  const castRay = useCallback(
    (
      startX: number,
      startY: number,
      angle: number
    ): { distance: number; wallType: number; side: number } => {
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      let distance = 0;
      let wallType = 0;
      let side = 0;

      for (let i = 0; i < MAX_DEPTH * 100; i++) {
        distance += 0.01;
        const testX = startX + cosA * distance;
        const testY = startY + sinA * distance;

        const mapX = Math.floor(testX);
        const mapY = Math.floor(testY);

        if (mapX < 0 || mapX >= MAP[0].length || mapY < 0 || mapY >= MAP.length) {
          break;
        }

        if (MAP[mapY][mapX] !== 0) {
          wallType = MAP[mapY][mapX];
          // Determine side for shading
          const dx = testX - mapX;
          const dy = testY - mapY;
          side = dx < 0.01 || dx > 0.99 ? 0 : 1;
          break;
        }
      }

      return { distance, wallType, side };
    },
    []
  );

  // Shooting logic
  useEffect(() => {
    if (isShooting && player.ammo > 0) {
      setWeaponFrame(1);
      setTimeout(() => setWeaponFrame(2), 50);
      setTimeout(() => setWeaponFrame(3), 100);
      setTimeout(() => {
        setWeaponFrame(0);
        setIsShooting(false);
      }, 200);

      // Decrease ammo
      setPlayer((p) => ({ ...p, ammo: p.ammo - 1 }));

      // Check for enemy hit (hitscan)
      const hitResult = castRay(player.x, player.y, player.angle);
      
      setEnemies((currentEnemies) => {
        return currentEnemies.map((enemy) => {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          const enemyDist = Math.sqrt(dx * dx + dy * dy);
          const enemyAngle = Math.atan2(dy, dx);
          
          let angleDiff = enemyAngle - player.angle;
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

          // Check if enemy is in crosshair and closer than wall
          if (
            Math.abs(angleDiff) < 0.2 &&
            enemyDist < hitResult.distance &&
            enemy.state !== "dead"
          ) {
            const newHealth = enemy.health - 15;
            if (newHealth <= 0) {
              return { ...enemy, health: 0, state: "dead" as const };
            }
            return { ...enemy, health: newHealth, state: "hurt" as const };
          }
          return enemy;
        });
      });
    }
  }, [isShooting, player.x, player.y, player.angle, player.ammo, castRay]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Update player
      setPlayer((p) => {
        let newX = p.x;
        let newY = p.y;
        let newAngle = p.angle;
        let isMoving = false;

        const keys = keysRef.current;

        // Rotation
        if (keys.has("arrowleft") || keys.has("a")) {
          newAngle -= ROT_SPEED;
        }
        if (keys.has("arrowright") || keys.has("d")) {
          newAngle += ROT_SPEED;
        }

        // Movement
        const moveX = Math.cos(newAngle) * MOVE_SPEED;
        const moveY = Math.sin(newAngle) * MOVE_SPEED;

        if (keys.has("arrowup") || keys.has("w")) {
          if (!checkCollision(newX + moveX * 2, newY)) newX += moveX;
          if (!checkCollision(newX, newY + moveY * 2)) newY += moveY;
          isMoving = true;
        }
        if (keys.has("arrowdown") || keys.has("s")) {
          if (!checkCollision(newX - moveX * 2, newY)) newX -= moveX;
          if (!checkCollision(newX, newY - moveY * 2)) newY -= moveY;
          isMoving = true;
        }

        // Strafe
        const strafeX = Math.cos(newAngle + Math.PI / 2) * MOVE_SPEED;
        const strafeY = Math.sin(newAngle + Math.PI / 2) * MOVE_SPEED;

        if (keys.has("q")) {
          if (!checkCollision(newX - strafeX * 2, newY)) newX -= strafeX;
          if (!checkCollision(newX, newY - strafeY * 2)) newY -= strafeY;
          isMoving = true;
        }
        if (keys.has("e")) {
          if (!checkCollision(newX + strafeX * 2, newY)) newX += strafeX;
          if (!checkCollision(newX, newY + strafeY * 2)) newY += strafeY;
          isMoving = true;
        }

        return {
          ...p,
          x: newX,
          y: newY,
          angle: newAngle,
          isMoving,
          bobPhase: isMoving ? p.bobPhase + 0.15 : 0,
        };
      });

      // Render
      render(ctx);

      animationId = requestAnimationFrame(gameLoop);
    };

    const render = (ctx: CanvasRenderingContext2D) => {
      // Clear screen
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      // Draw ceiling
      const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT / 2);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2);

      // Draw floor
      const floorGradient = ctx.createLinearGradient(
        0,
        SCREEN_HEIGHT / 2,
        0,
        SCREEN_HEIGHT
      );
      floorGradient.addColorStop(0, "#2d2d2d");
      floorGradient.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = floorGradient;
      ctx.fillRect(0, SCREEN_HEIGHT / 2, SCREEN_WIDTH, SCREEN_HEIGHT / 2);

      // Raycasting - draw walls
      const wallHeights: { height: number; distance: number }[] = [];

      for (let ray = 0; ray < NUM_RAYS; ray++) {
        const rayAngle =
          player.angle - HALF_FOV + (ray / NUM_RAYS) * FOV;
        const { distance, wallType, side } = castRay(
          player.x,
          player.y,
          rayAngle
        );

        // Fix fisheye
        const correctedDistance =
          distance * Math.cos(rayAngle - player.angle);

        // Calculate wall height
        const wallHeight = Math.min(
          SCREEN_HEIGHT,
          SCREEN_HEIGHT / (correctedDistance + 0.0001)
        );
        wallHeights.push({ height: wallHeight, distance: correctedDistance });

        // Get wall color
        const colors = WALL_COLORS[wallType] || WALL_COLORS[1];
        const color = side === 0 ? colors.light : colors.dark;

        // Apply distance shading
        const shade = Math.max(0, 1 - correctedDistance / MAX_DEPTH);
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        ctx.fillStyle = `rgb(${Math.floor(r * shade)}, ${Math.floor(
          g * shade
        )}, ${Math.floor(b * shade)})`;

        // Draw wall slice
        const x = (ray / NUM_RAYS) * SCREEN_WIDTH;
        const wallTop = (SCREEN_HEIGHT - wallHeight) / 2;
        ctx.fillRect(x, wallTop, SCREEN_WIDTH / NUM_RAYS + 1, wallHeight);
      }

      // Draw enemies (sprites)
      const sortedEnemies = [...enemies]
        .map((enemy) => {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          return { ...enemy, distance: Math.sqrt(dx * dx + dy * dy) };
        })
        .sort((a, b) => b.distance - a.distance);

      for (const enemy of sortedEnemies) {
        if (enemy.state === "dead") continue;

        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = enemy.distance;

        let enemyAngle = Math.atan2(dy, dx) - player.angle;
        while (enemyAngle > Math.PI) enemyAngle -= 2 * Math.PI;
        while (enemyAngle < -Math.PI) enemyAngle += 2 * Math.PI;

        // Check if enemy is in FOV
        if (Math.abs(enemyAngle) < HALF_FOV + 0.2) {
          const screenX =
            SCREEN_WIDTH / 2 + (enemyAngle / HALF_FOV) * (SCREEN_WIDTH / 2);
          const spriteHeight = Math.min(400, SCREEN_HEIGHT / distance);
          const spriteWidth = spriteHeight * 0.6;

          // Check if not behind wall
          const rayIndex = Math.floor(
            ((screenX / SCREEN_WIDTH) * NUM_RAYS)
          );
          if (
            rayIndex >= 0 &&
            rayIndex < wallHeights.length &&
            distance < wallHeights[rayIndex].distance
          ) {
            // Draw enemy sprite (simplified)
            const shade = Math.max(0.2, 1 - distance / MAX_DEPTH);
            
            if (enemy.type === "zombieman") {
              // Green zombie
              ctx.fillStyle = `rgba(${Math.floor(50 * shade)}, ${Math.floor(
                150 * shade
              )}, ${Math.floor(50 * shade)}, 1)`;
            } else {
              // Brown imp
              ctx.fillStyle = `rgba(${Math.floor(180 * shade)}, ${Math.floor(
                100 * shade
              )}, ${Math.floor(60 * shade)}, 1)`;
            }

            const spriteTop = SCREEN_HEIGHT / 2 - spriteHeight / 2 + spriteHeight * 0.1;
            
            // Body
            ctx.fillRect(
              screenX - spriteWidth / 2,
              spriteTop,
              spriteWidth,
              spriteHeight * 0.8
            );

            // Head
            ctx.beginPath();
            ctx.arc(
              screenX,
              spriteTop - spriteHeight * 0.1,
              spriteWidth / 3,
              0,
              Math.PI * 2
            );
            ctx.fill();

            // Eyes (red)
            ctx.fillStyle = `rgba(255, ${enemy.state === "hurt" ? 255 : 0}, 0, ${shade})`;
            ctx.beginPath();
            ctx.arc(
              screenX - spriteWidth / 6,
              spriteTop - spriteHeight * 0.1,
              spriteWidth / 10,
              0,
              Math.PI * 2
            );
            ctx.arc(
              screenX + spriteWidth / 6,
              spriteTop - spriteHeight * 0.1,
              spriteWidth / 10,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
      }

      // Draw weapon
      drawWeapon(ctx);

      // Draw HUD
      drawHUD(ctx);
    };

    const drawWeapon = (ctx: CanvasRenderingContext2D) => {
      const bobOffset = Math.sin(player.bobPhase) * 5;
      const weaponY = SCREEN_HEIGHT - 120 + bobOffset;
      const weaponX = SCREEN_WIDTH / 2 - 40;

      // Weapon flash when shooting
      if (weaponFrame > 0 && weaponFrame < 3) {
        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.moveTo(SCREEN_WIDTH / 2, weaponY - 60);
        ctx.lineTo(SCREEN_WIDTH / 2 - 30, weaponY - 20);
        ctx.lineTo(SCREEN_WIDTH / 2 + 30, weaponY - 20);
        ctx.closePath();
        ctx.fill();
      }

      // Pistol
      ctx.fillStyle = "#4a4a4a";
      ctx.fillRect(weaponX, weaponY, 80, 40);
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(weaponX + 30, weaponY + 40, 20, 60);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(weaponX + 25, weaponY + 70, 30, 40);

      // Barrel
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(weaponX + 60, weaponY + 10, 40, 15);
    };

    const drawHUD = (ctx: CanvasRenderingContext2D) => {
      // HUD background
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(0, SCREEN_HEIGHT - 40, SCREEN_WIDTH, 40);
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(0, SCREEN_HEIGHT - 40, SCREEN_WIDTH, 3);

      // Face (Doomguy)
      ctx.fillStyle = "#c9a86c";
      ctx.beginPath();
      ctx.arc(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 20, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(SCREEN_WIDTH / 2 - 5, SCREEN_HEIGHT - 23, 3, 0, Math.PI * 2);
      ctx.arc(SCREEN_WIDTH / 2 + 5, SCREEN_HEIGHT - 23, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(SCREEN_WIDTH / 2 - 5, SCREEN_HEIGHT - 23, 1.5, 0, Math.PI * 2);
      ctx.arc(SCREEN_WIDTH / 2 + 5, SCREEN_HEIGHT - 23, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Health
      ctx.fillStyle = "#8B0000";
      ctx.font = "bold 16px monospace";
      ctx.fillText("HEALTH", 20, SCREEN_HEIGHT - 25);
      ctx.fillStyle = "#FF0000";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`${player.health}%`, 20, SCREEN_HEIGHT - 8);

      // Ammo
      ctx.fillStyle = "#8B8B00";
      ctx.font = "bold 16px monospace";
      ctx.fillText("AMMO", SCREEN_WIDTH - 100, SCREEN_HEIGHT - 25);
      ctx.fillStyle = "#FFFF00";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`${player.ammo}`, SCREEN_WIDTH - 100, SCREEN_HEIGHT - 8);

      // Armor
      ctx.fillStyle = "#006400";
      ctx.font = "bold 16px monospace";
      ctx.fillText("ARMOR", 150, SCREEN_HEIGHT - 25);
      ctx.fillStyle = "#00FF00";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`${player.armor}%`, 150, SCREEN_HEIGHT - 8);

      // Crosshair
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(SCREEN_WIDTH / 2 - 10, SCREEN_HEIGHT / 2);
      ctx.lineTo(SCREEN_WIDTH / 2 + 10, SCREEN_HEIGHT / 2);
      ctx.moveTo(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 10);
      ctx.lineTo(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10);
      ctx.stroke();
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [player, enemies, checkCollision, castRay, weaponFrame]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        className="border-4 border-gray-800"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="absolute top-4 left-4 text-gray-500 text-xs">
        ESC: Menu | WASD/Arrows: Move | Q/E: Strafe | Space/Ctrl: Shoot
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
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div
        style={{
          fontFamily: "Impact, sans-serif",
          fontSize: "40px",
          color: "#8B0000",
          marginBottom: "40px",
        }}
      >
        Loading E1M1...
      </div>
      <div className="w-80 h-6 bg-gray-800 border-2 border-gray-600">
        <div
          className="h-full bg-red-700 transition-all duration-100"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <div className="text-gray-500 mt-4">
        Hangar - {Math.floor(Math.min(100, progress))}%
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DOOM PAGE
// ============================================================================

export default function DoomPage() {
  const [gameState, setGameState] = useState<GameState>("intro");

  const handleIntroComplete = useCallback(() => {
    setGameState("menu");
  }, []);

  const handleNewGame = useCallback(() => {
    setGameState("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setGameState("game");
  }, []);

  const handleQuit = useCallback(() => {
    setGameState("menu");
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
      style={{ cursor: gameState === "game" ? "none" : "default" }}
    >
      <style jsx global>{`
        @keyframes doom-pulse {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          100% {
            transform: scale(1.02);
            filter: brightness(1.2);
          }
        }
      `}</style>

      <div
        className="relative"
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      >
        {gameState === "intro" && (
          <DoomIntro onComplete={handleIntroComplete} />
        )}
        {gameState === "menu" && (
          <DoomMenu onNewGame={handleNewGame} onOptions={() => {}} />
        )}
        {gameState === "loading" && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        {gameState === "game" && <DoomGame onQuit={handleQuit} />}
      </div>
    </div>
  );
}

