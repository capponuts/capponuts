// ============================================================================
// DOOM LEVEL DATA - E1M1 "Hangar"
// ============================================================================

export interface MapCell {
  wall: number;      // 0 = empty, 1-5 = wall types
  floor: number;     // Floor texture
  ceiling: number;   // Ceiling texture
  door?: boolean;    // Is this a door?
  doorOpen?: number; // Door open amount (0-1)
  secret?: boolean;  // Secret area
}

export interface ItemSpawn {
  x: number;
  y: number;
  type: "health" | "armor" | "ammo" | "shells" | "medikit" | "shotgun" | "key_blue" | "key_red" | "key_yellow";
}

export interface EnemySpawn {
  x: number;
  y: number;
  type: "zombieman" | "imp" | "demon";
  angle: number;
}

export interface LevelData {
  name: string;
  width: number;
  height: number;
  map: number[][];
  playerStart: { x: number; y: number; angle: number };
  enemies: EnemySpawn[];
  items: ItemSpawn[];
  exitPos: { x: number; y: number };
}

// E1M1 - Hangar (inspired by original, simplified)
export const E1M1: LevelData = {
  name: "E1M1: Hangar",
  width: 32,
  height: 32,
  map: [
    // 0 = empty, 1 = brown brick, 2 = gray tech, 3 = red hell, 4 = door, 5 = exit
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,1,0,0,0,0,2,2,2,2,2,0,0,0,0,0,1],
    [1,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0,0,2,0,0,0,2,0,0,0,0,0,1],
    [1,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0,0,2,0,0,0,2,0,0,0,0,0,1],
    [1,0,0,0,2,2,4,2,0,0,0,0,0,0,0,0,1,0,0,0,0,2,0,0,0,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,2,4,2,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,4,1,1,1,1,1,4,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,3,3,3,3,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,4,1,1,1,1,1,0,0,0,3,0,0,3,0,0,0,0,1,1,1,1,1,4,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,1],
    [1,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,1],
    [1,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,1],
    [1,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,1],
    [1,0,0,0,2,2,4,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,4,2,2,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,5,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  playerStart: { x: 3, y: 3, angle: 0 },
  enemies: [
    // Starting area
    { x: 8, y: 6, type: "zombieman", angle: Math.PI },
    { x: 12, y: 8, type: "zombieman", angle: Math.PI / 2 },
    
    // Right side room
    { x: 24, y: 6, type: "zombieman", angle: Math.PI },
    { x: 26, y: 8, type: "imp", angle: Math.PI },
    
    // Central corridor
    { x: 8, y: 13, type: "zombieman", angle: 0 },
    { x: 22, y: 13, type: "zombieman", angle: Math.PI },
    
    // Red room (harder enemies)
    { x: 16, y: 15, type: "imp", angle: 0 },
    { x: 15, y: 16, type: "imp", angle: Math.PI / 2 },
    
    // Lower area
    { x: 6, y: 22, type: "zombieman", angle: 0 },
    { x: 26, y: 22, type: "zombieman", angle: Math.PI },
    { x: 16, y: 20, type: "demon", angle: Math.PI },
    
    // Near exit
    { x: 16, y: 26, type: "imp", angle: Math.PI },
    { x: 14, y: 28, type: "zombieman", angle: 0 },
    { x: 18, y: 28, type: "zombieman", angle: Math.PI },
  ],
  items: [
    // Health
    { x: 2, y: 2, type: "health" },
    { x: 6, y: 6, type: "health" },
    { x: 14, y: 2, type: "health" },
    { x: 28, y: 10, type: "health" },
    { x: 12, y: 13, type: "medikit" },
    
    // Armor
    { x: 6, y: 5, type: "armor" },
    { x: 24, y: 24, type: "armor" },
    
    // Ammo
    { x: 4, y: 8, type: "ammo" },
    { x: 10, y: 3, type: "ammo" },
    { x: 20, y: 5, type: "ammo" },
    { x: 28, y: 20, type: "ammo" },
    { x: 8, y: 18, type: "shells" },
    { x: 24, y: 18, type: "shells" },
    
    // Shotgun (secret-ish area)
    { x: 6, y: 22, type: "shotgun" },
  ],
  exitPos: { x: 16, y: 27 },
};

// Door state management
export interface DoorState {
  x: number;
  y: number;
  open: number; // 0 = closed, 1 = open
  opening: boolean;
  closing: boolean;
}

export function isDoor(map: number[][], x: number, y: number): boolean {
  if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) return false;
  return map[y][x] === 4;
}

export function getWallType(map: number[][], x: number, y: number): number {
  if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) return 1;
  return map[y][x];
}

export function isWalkable(map: number[][], x: number, y: number, doors: Map<string, DoorState>): boolean {
  if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) return false;
  
  const cell = map[Math.floor(y)][Math.floor(x)];
  
  if (cell === 0) return true;
  if (cell === 4) {
    // Check if door is open
    const doorKey = `${Math.floor(x)},${Math.floor(y)}`;
    const door = doors.get(doorKey);
    return door ? door.open > 0.8 : false;
  }
  
  return false;
}

