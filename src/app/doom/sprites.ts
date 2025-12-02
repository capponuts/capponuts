// ============================================================================
// DOOM SPRITES - Pixel Art Data
// ============================================================================

// Wall textures (16x16 simplified patterns)
export const WALL_TEXTURES: Record<number, string[][]> = {
  // Brown brick wall
  1: generateBrickTexture("#8B4513", "#5D2E0C", "#4A2508"),
  // Gray tech wall
  2: generateTechTexture("#6A6A6A", "#4A4A4A", "#3A3A3A"),
  // Red hell wall
  3: generateHellTexture("#8B0000", "#5C0000", "#3A0000"),
  // Door
  4: generateDoorTexture("#4A4A4A", "#2A2A2A", "#FFD700"),
  // Exit sign
  5: generateExitTexture(),
};

function generateBrickTexture(light: string, mid: string, dark: string): string[][] {
  const tex: string[][] = [];
  for (let y = 0; y < 64; y++) {
    tex[y] = [];
    for (let x = 0; x < 64; x++) {
      const brickRow = Math.floor(y / 8);
      const offset = brickRow % 2 === 0 ? 0 : 16;
      const brickX = (x + offset) % 32;
      
      // Brick edges
      if (y % 8 === 0 || y % 8 === 7) {
        tex[y][x] = dark;
      } else if (brickX === 0 || brickX === 31) {
        tex[y][x] = dark;
      } else if (brickX === 1 || y % 8 === 1) {
        tex[y][x] = light;
      } else {
        // Add some noise
        const noise = Math.random() > 0.9;
        tex[y][x] = noise ? mid : light;
      }
    }
  }
  return tex;
}

function generateTechTexture(light: string, mid: string, dark: string): string[][] {
  const tex: string[][] = [];
  for (let y = 0; y < 64; y++) {
    tex[y] = [];
    for (let x = 0; x < 64; x++) {
      // Panel pattern
      const panelX = x % 32;
      const panelY = y % 32;
      
      if (panelX < 2 || panelX > 29 || panelY < 2 || panelY > 29) {
        tex[y][x] = dark;
      } else if (panelX < 4 || panelX > 27 || panelY < 4 || panelY > 27) {
        tex[y][x] = "#1a1a1a";
      } else {
        // Tech details
        if ((panelX > 10 && panelX < 22) && (panelY > 12 && panelY < 20)) {
          // Screen area
          const flicker = Math.random() > 0.7;
          tex[y][x] = flicker ? "#00FF00" : "#003300";
        } else {
          tex[y][x] = mid;
        }
      }
    }
  }
  return tex;
}

function generateHellTexture(light: string, mid: string, dark: string): string[][] {
  const tex: string[][] = [];
  for (let y = 0; y < 64; y++) {
    tex[y] = [];
    for (let x = 0; x < 64; x++) {
      // Organic hell pattern
      const distort = Math.sin(x * 0.3) * 5 + Math.cos(y * 0.2) * 5;
      const val = (x + y + distort) % 16;
      
      if (val < 4) {
        tex[y][x] = dark;
      } else if (val < 8) {
        tex[y][x] = mid;
      } else if (val < 12) {
        tex[y][x] = light;
      } else {
        tex[y][x] = "#FF4500"; // Lava glow
      }
    }
  }
  return tex;
}

function generateDoorTexture(light: string, mid: string, accent: string): string[][] {
  const tex: string[][] = [];
  for (let y = 0; y < 64; y++) {
    tex[y] = [];
    for (let x = 0; x < 64; x++) {
      // Door frame
      if (x < 4 || x > 59) {
        tex[y][x] = "#2a2a2a";
      } else if (y < 4) {
        tex[y][x] = "#2a2a2a";
      } else {
        // Door panels
        const panelX = Math.floor((x - 4) / 28);
        const localX = (x - 4) % 28;
        
        if (localX < 2 || localX > 25) {
          tex[y][x] = "#1a1a1a";
        } else if (y > 28 && y < 36 && localX > 10 && localX < 18) {
          // Handle
          tex[y][x] = accent;
        } else {
          tex[y][x] = mid;
        }
      }
    }
  }
  return tex;
}

function generateExitTexture(): string[][] {
  const tex: string[][] = [];
  const exitText = [
    "................",
    "..EEEE.XX..XX...",
    "..E.....X..X....",
    "..EEE....XX.....",
    "..E.....X..X....",
    "..EEEE.XX..XX...",
    "................",
    "..II.TTTT.......",
    "..I...TT........",
    "..I...TT........",
    "..I...TT........",
    "..II..TT........",
    "................",
  ];
  
  for (let y = 0; y < 64; y++) {
    tex[y] = [];
    for (let x = 0; x < 64; x++) {
      const textY = Math.floor(y / 5);
      const textX = Math.floor(x / 4);
      
      if (textY < exitText.length && textX < 16) {
        const char = exitText[textY]?.[textX];
        if (char && char !== ".") {
          tex[y][x] = "#FF0000";
        } else {
          tex[y][x] = "#1a1a1a";
        }
      } else {
        tex[y][x] = "#1a1a1a";
      }
    }
  }
  return tex;
}

// ============================================================================
// ENEMY SPRITES (Simplified but detailed pixel art)
// ============================================================================

export interface SpriteFrame {
  width: number;
  height: number;
  pixels: string[][];
}

// Zombieman sprite (front view)
export const ZOMBIEMAN_SPRITE: SpriteFrame = generateZombiemanSprite();
export const ZOMBIEMAN_DEAD: SpriteFrame = generateZombiemanDead();

// Imp sprite
export const IMP_SPRITE: SpriteFrame = generateImpSprite();
export const IMP_ATTACK: SpriteFrame = generateImpAttack();
export const IMP_DEAD: SpriteFrame = generateImpDead();

// Demon sprite
export const DEMON_SPRITE: SpriteFrame = generateDemonSprite();

function generateZombiemanSprite(): SpriteFrame {
  const width = 32;
  const height = 56;
  const pixels: string[][] = [];
  
  const sprite = `
................................
................................
..........######................
.........########...............
........##FFFF##................
........#FFFFFF#................
........#F@@F@@#................
........#FFFFFF#................
........##FFFF##................
.........#MMMM#.................
..........####..................
.........######.................
........##GGGG##................
.......###GGGG###...............
......####GGGG####..............
.....##GG#GGGG#GG##.............
....##GGG#GGGG#GGG##............
....#GGGG######GGGG#............
....#GGGG#....#GGGG#............
....##GGG#....#GGG##............
.....####......####.............
.....##GG......GG##.............
....##GGG......GGG##............
....#GGGG......GGGG#............
....#GGG#......#GGG#............
....####........####............
....##BB........BB##............
...##BBB........BBB##...........
...#BBBB........BBBB#...........
...#BBB#........#BBB#...........
...####..........####...........
................................
`;

  const colors: Record<string, string> = {
    "#": "#2a2a2a",
    "G": "#3d5c3d", // Green uniform
    "F": "#c9a86c", // Flesh
    "@": "#FF0000", // Eyes
    "M": "#8B0000", // Mouth
    "B": "#4a3728", // Brown boots
    ".": "transparent",
  };

  const lines = sprite.trim().split("\n");
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      const char = lines[y]?.[x] || ".";
      pixels[y][x] = colors[char] || "transparent";
    }
  }
  
  return { width, height, pixels };
}

function generateZombiemanDead(): SpriteFrame {
  const width = 48;
  const height = 16;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      if (y > 8 && y < 14) {
        if (x > 4 && x < 44) {
          if (y === 9 || y === 13) {
            pixels[y][x] = "#2a2a2a";
          } else if (x < 12) {
            pixels[y][x] = "#c9a86c"; // Head
          } else if (x < 36) {
            pixels[y][x] = "#3d5c3d"; // Body
          } else {
            pixels[y][x] = "#4a3728"; // Feet
          }
        } else {
          pixels[y][x] = "transparent";
        }
      } else {
        pixels[y][x] = "transparent";
      }
      // Blood pool
      if (y > 11 && x > 8 && x < 30 && Math.random() > 0.5) {
        pixels[y][x] = "#8B0000";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateImpSprite(): SpriteFrame {
  const width = 40;
  const height = 56;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      // Head with horns
      if (y >= 0 && y < 6) {
        if ((x >= 8 && x <= 12) || (x >= 28 && x <= 32)) {
          if (y < 4) pixels[y][x] = "#8B4513"; // Horns
          else pixels[y][x] = "transparent";
        } else {
          pixels[y][x] = "transparent";
        }
      }
      // Face
      else if (y >= 6 && y < 18) {
        const cx = 20;
        const cy = 12;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 10) {
          // Eyes
          if (y >= 9 && y <= 12) {
            if ((x >= 14 && x <= 17) || (x >= 23 && x <= 26)) {
              pixels[y][x] = "#FF0000"; // Red eyes
            } else {
              pixels[y][x] = "#8B4513";
            }
          }
          // Mouth
          else if (y >= 14 && y <= 16 && x >= 16 && x <= 24) {
            pixels[y][x] = "#2a0000";
          } else {
            pixels[y][x] = "#8B4513";
          }
        } else {
          pixels[y][x] = "transparent";
        }
      }
      // Body
      else if (y >= 18 && y < 45) {
        const bodyWidth = 24 - Math.abs(y - 30) * 0.5;
        const leftEdge = 20 - bodyWidth / 2;
        const rightEdge = 20 + bodyWidth / 2;
        
        if (x >= leftEdge && x <= rightEdge) {
          // Spikes on back
          if ((y % 6 === 0) && (x < leftEdge + 3 || x > rightEdge - 3)) {
            pixels[y][x] = "#5C3317";
          } else {
            pixels[y][x] = "#8B4513";
          }
        } else {
          pixels[y][x] = "transparent";
        }
      }
      // Legs
      else if (y >= 45 && y < 56) {
        if ((x >= 12 && x <= 18) || (x >= 22 && x <= 28)) {
          pixels[y][x] = "#5C3317";
        } else {
          pixels[y][x] = "transparent";
        }
      }
      else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateImpAttack(): SpriteFrame {
  const base = generateImpSprite();
  // Add fireball in hand
  for (let y = 20; y < 30; y++) {
    for (let x = 32; x < 40; x++) {
      const dist = Math.sqrt((x - 36) ** 2 + (y - 25) ** 2);
      if (dist < 5) {
        base.pixels[y][x] = dist < 2 ? "#FFFF00" : "#FF4500";
      }
    }
  }
  return base;
}

function generateImpDead(): SpriteFrame {
  const width = 48;
  const height = 20;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      if (y > 8 && y < 18) {
        if (x > 4 && x < 44) {
          pixels[y][x] = "#5C3317";
        } else {
          pixels[y][x] = "transparent";
        }
      } else {
        pixels[y][x] = "transparent";
      }
      // Blood
      if (y > 14 && x > 10 && x < 35 && Math.random() > 0.4) {
        pixels[y][x] = "#8B0000";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateDemonSprite(): SpriteFrame {
  const width = 64;
  const height = 64;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      // Large pink demon body
      const cx = 32;
      const cy = 40;
      const dx = x - cx;
      const dy = (y - cy) * 1.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 28) {
        // Head area
        if (y < 25) {
          // Horns
          if (y < 10 && ((x > 15 && x < 22) || (x > 42 && x < 49))) {
            pixels[y][x] = "#8B4513";
          }
          // Eyes
          else if (y >= 12 && y <= 18) {
            if ((x >= 20 && x <= 26) || (x >= 38 && x <= 44)) {
              pixels[y][x] = "#FFFF00";
            } else {
              pixels[y][x] = "#CD5C5C";
            }
          }
          // Mouth with teeth
          else if (y >= 20 && y <= 24 && x >= 24 && x <= 40) {
            if (y === 20 || y === 24) {
              pixels[y][x] = "#FFFFFF"; // Teeth
            } else {
              pixels[y][x] = "#2a0000"; // Mouth
            }
          } else {
            pixels[y][x] = "#CD5C5C";
          }
        }
        // Body
        else {
          pixels[y][x] = "#CD5C5C";
        }
      }
      // Legs
      else if (y >= 50 && y < 64) {
        if ((x >= 18 && x <= 28) || (x >= 36 && x <= 46)) {
          pixels[y][x] = "#8B4040";
        } else {
          pixels[y][x] = "transparent";
        }
      }
      else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

// ============================================================================
// WEAPON SPRITES
// ============================================================================

export const PISTOL_FRAMES: SpriteFrame[] = [
  generatePistolFrame(0),
  generatePistolFrame(1),
  generatePistolFrame(2),
  generatePistolFrame(3),
];

export const SHOTGUN_FRAMES: SpriteFrame[] = [
  generateShotgunFrame(0),
  generateShotgunFrame(1),
  generateShotgunFrame(2),
  generateShotgunFrame(3),
  generateShotgunFrame(4),
];

export const FIST_FRAMES: SpriteFrame[] = [
  generateFistFrame(0),
  generateFistFrame(1),
  generateFistFrame(2),
];

function generatePistolFrame(frame: number): SpriteFrame {
  const width = 128;
  const height = 128;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      pixels[y][x] = "transparent";
      
      // Muzzle flash for firing frames
      if (frame === 1 || frame === 2) {
        const flashCx = 64;
        const flashCy = 30;
        const dx = x - flashCx;
        const dy = y - flashCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 20 - frame * 5) {
          if (dist < 8) pixels[y][x] = "#FFFFFF";
          else if (dist < 14) pixels[y][x] = "#FFFF00";
          else pixels[y][x] = "#FF8800";
        }
      }
      
      // Gun body
      if (y >= 50 && y < 90) {
        // Barrel
        if (x >= 56 && x <= 72 && y >= 50 && y < 65) {
          pixels[y][x] = "#2a2a2a";
        }
        // Slide
        if (x >= 48 && x <= 80 && y >= 65 && y < 80) {
          if (x < 52 || x > 76) pixels[y][x] = "#1a1a1a";
          else pixels[y][x] = "#3a3a3a";
        }
        // Grip
        if (x >= 52 && x <= 76 && y >= 80 && y < 100) {
          pixels[y][x] = "#4a3728";
        }
      }
      
      // Hand
      if (y >= 85 && y < 128) {
        const handCx = 64;
        const handCy = 105;
        const dx = x - handCx;
        const dy = y - handCy;
        
        if (Math.abs(dx) < 25 && dy > -15 && dy < 25) {
          pixels[y][x] = "#c9a86c";
        }
      }
    }
  }
  
  return { width, height, pixels };
}

function generateShotgunFrame(frame: number): SpriteFrame {
  const width = 200;
  const height = 140;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      pixels[y][x] = "transparent";
      
      // Muzzle flash
      if (frame === 1) {
        const flashCx = 100;
        const flashCy = 20;
        const dx = x - flashCx;
        const dy = y - flashCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 30) {
          if (dist < 10) pixels[y][x] = "#FFFFFF";
          else if (dist < 20) pixels[y][x] = "#FFFF00";
          else pixels[y][x] = "#FF4400";
        }
      }
      
      // Barrels
      if (y >= 35 && y < 55 && x >= 60 && x <= 140) {
        if (y < 42 || y > 48) pixels[y][x] = "#1a1a1a";
        else if (x < 70 || x > 130) pixels[y][x] = "#2a2a2a";
        else pixels[y][x] = "#0a0a0a"; // Barrel holes
      }
      
      // Body
      if (y >= 55 && y < 85 && x >= 50 && x <= 150) {
        pixels[y][x] = "#3a3a3a";
      }
      
      // Pump (moves during reload)
      const pumpOffset = frame >= 3 ? 15 : 0;
      if (y >= 60 && y < 75 && x >= 70 + pumpOffset && x <= 100 + pumpOffset) {
        pixels[y][x] = "#4a4a4a";
      }
      
      // Stock
      if (y >= 75 && y < 110 && x >= 80 && x <= 120) {
        pixels[y][x] = "#5c4033";
      }
      
      // Hands
      if (y >= 90 && y < 140) {
        // Left hand on pump
        if (x >= 75 && x <= 105 && y >= 95 && y < 115) {
          pixels[y][x] = "#c9a86c";
        }
        // Right hand on grip
        if (x >= 95 && x <= 125 && y >= 100 && y < 130) {
          pixels[y][x] = "#c9a86c";
        }
      }
    }
  }
  
  return { width, height, pixels };
}

function generateFistFrame(frame: number): SpriteFrame {
  const width = 128;
  const height = 128;
  const pixels: string[][] = [];
  
  const offsetX = frame === 1 ? -20 : frame === 2 ? 20 : 0;
  const offsetY = frame === 1 ? -30 : 0;
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      pixels[y][x] = "transparent";
      
      const cx = 64 + offsetX;
      const cy = 80 + offsetY;
      const dx = x - cx;
      const dy = y - cy;
      
      // Fist
      if (Math.abs(dx) < 30 && dy > -25 && dy < 35) {
        if (dy < 0) {
          // Knuckles
          pixels[y][x] = "#b8956c";
        } else {
          pixels[y][x] = "#c9a86c";
        }
      }
      
      // Arm
      if (y > cy + 20 && y < height && Math.abs(x - cx) < 25) {
        pixels[y][x] = "#c9a86c";
      }
    }
  }
  
  return { width, height, pixels };
}

// ============================================================================
// ITEM SPRITES
// ============================================================================

export const HEALTH_BONUS: SpriteFrame = generateHealthBonus();
export const ARMOR_BONUS: SpriteFrame = generateArmorBonus();
export const AMMO_CLIP: SpriteFrame = generateAmmoClip();
export const SHOTGUN_AMMO: SpriteFrame = generateShotgunAmmo();
export const MEDIKIT: SpriteFrame = generateMedikit();
export const BLUE_KEY: SpriteFrame = generateKey("#0000FF");
export const RED_KEY: SpriteFrame = generateKey("#FF0000");
export const YELLOW_KEY: SpriteFrame = generateKey("#FFFF00");

function generateHealthBonus(): SpriteFrame {
  const width = 16;
  const height = 16;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      const cx = 8;
      const cy = 8;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      
      if (dist < 6) {
        // Blue health bonus
        if (dist < 4) pixels[y][x] = "#4444FF";
        else pixels[y][x] = "#2222AA";
      } else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateArmorBonus(): SpriteFrame {
  const width = 16;
  const height = 16;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      const cx = 8;
      const cy = 8;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      
      if (dist < 6) {
        if (dist < 4) pixels[y][x] = "#00AA00";
        else pixels[y][x] = "#006600";
      } else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateAmmoClip(): SpriteFrame {
  const width = 12;
  const height = 20;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      if (x >= 2 && x <= 9 && y >= 2 && y <= 17) {
        if (y < 5) pixels[y][x] = "#8B8B00";
        else pixels[y][x] = "#4a4a4a";
      } else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateShotgunAmmo(): SpriteFrame {
  const width = 24;
  const height = 16;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      // 4 shells
      const shellIndex = Math.floor(x / 6);
      const localX = x % 6;
      
      if (localX >= 1 && localX <= 4 && y >= 2 && y <= 13) {
        if (y < 5) pixels[y][x] = "#CD853F";
        else pixels[y][x] = "#8B0000";
      } else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateMedikit(): SpriteFrame {
  const width = 24;
  const height = 20;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      if (x >= 2 && x <= 21 && y >= 2 && y <= 17) {
        // White box
        pixels[y][x] = "#FFFFFF";
        
        // Red cross
        if ((x >= 9 && x <= 14 && y >= 4 && y <= 15) ||
            (x >= 5 && x <= 18 && y >= 7 && y <= 12)) {
          pixels[y][x] = "#FF0000";
        }
      } else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

function generateKey(color: string): SpriteFrame {
  const width = 16;
  const height = 24;
  const pixels: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      // Key head (circle)
      if (y < 10) {
        const cx = 8;
        const cy = 5;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (dist < 5 && dist > 2) {
          pixels[y][x] = color;
        } else {
          pixels[y][x] = "transparent";
        }
      }
      // Key shaft
      else if (x >= 6 && x <= 9) {
        pixels[y][x] = color;
        // Key teeth
        if (y > 16 && y < 22 && x >= 9 && x <= 12) {
          pixels[y][x] = color;
        }
      } else if (y > 16 && y < 20 && x >= 9 && x <= 12) {
        pixels[y][x] = color;
      } else if (y > 19 && y < 23 && x >= 9 && x <= 11) {
        pixels[y][x] = color;
      } else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

// ============================================================================
// HUD SPRITES
// ============================================================================

export const DOOMGUY_FACES: SpriteFrame[] = [
  generateDoomguyFace(100), // Full health
  generateDoomguyFace(80),
  generateDoomguyFace(60),
  generateDoomguyFace(40),
  generateDoomguyFace(20),
  generateDoomguyFace(0), // Dead
];

function generateDoomguyFace(health: number): SpriteFrame {
  const width = 32;
  const height = 32;
  const pixels: string[][] = [];
  
  const bloodLevel = Math.max(0, 100 - health) / 20;
  
  for (let y = 0; y < height; y++) {
    pixels[y] = [];
    for (let x = 0; x < width; x++) {
      const cx = 16;
      const cy = 16;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 14) {
        // Face
        pixels[y][x] = "#c9a86c";
        
        // Eyes
        if (y >= 10 && y <= 14) {
          if ((x >= 8 && x <= 12) || (x >= 20 && x <= 24)) {
            pixels[y][x] = "#FFFFFF";
            // Pupils
            if ((x >= 9 && x <= 11) || (x >= 21 && x <= 23)) {
              if (y >= 11 && y <= 13) {
                pixels[y][x] = health > 0 ? "#000000" : "#FF0000";
              }
            }
          }
        }
        
        // Nose
        if (y >= 14 && y <= 18 && x >= 14 && x <= 18) {
          pixels[y][x] = "#b8956c";
        }
        
        // Mouth
        if (y >= 20 && y <= 24 && x >= 10 && x <= 22) {
          if (health > 40) {
            pixels[y][x] = "#8B4513"; // Normal
          } else {
            pixels[y][x] = "#2a0000"; // Grimace
          }
        }
        
        // Blood based on damage
        if (bloodLevel > 0) {
          if (y > 8 && y < 28 && Math.random() < bloodLevel * 0.1) {
            pixels[y][x] = "#8B0000";
          }
        }
        
        // Hair
        if (y < 8 && dist < 12) {
          pixels[y][x] = "#4a3728";
        }
      } else {
        pixels[y][x] = "transparent";
      }
    }
  }
  
  return { width, height, pixels };
}

