// ============================================================================
// DOOM SOUNDS - Audio Generation & Management
// ============================================================================

export class DoomAudio {
  private audioContext: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicPlaying: boolean = false;
  private musicOscillators: OscillatorNode[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudio();
    }
  }

  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = 0.3;
      this.musicGain.connect(this.audioContext.destination);
      
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = 0.5;
      this.sfxGain.connect(this.audioContext.destination);
    } catch {
      console.warn("Web Audio API not available");
    }
  }

  public resume() {
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
  }

  // ============================================================================
  // SOUND EFFECTS
  // ============================================================================

  public playPistolShot() {
    this.playNoise(0.1, 800, 200, "square");
  }

  public playShotgunShot() {
    this.playNoise(0.2, 400, 100, "sawtooth");
    setTimeout(() => this.playNoise(0.15, 300, 80, "square"), 30);
  }

  public playPunch() {
    this.playNoise(0.1, 150, 50, "square");
  }

  public playEnemyHit() {
    this.playNoise(0.1, 300, 100, "sawtooth");
  }

  public playEnemyDeath() {
    // Descending growl
    if (!this.audioContext || !this.sfxGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }

  public playImpFireball() {
    if (!this.audioContext || !this.sfxGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  public playPlayerHurt() {
    // Grunt sound
    if (!this.audioContext || !this.sfxGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  public playPlayerDeath() {
    // Long death sound
    if (!this.audioContext || !this.sfxGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 1);
    
    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 1);
  }

  public playDoorOpen() {
    if (!this.audioContext || !this.sfxGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "square";
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(150, this.audioContext.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }

  public playDoorClose() {
    if (!this.audioContext || !this.sfxGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }

  public playItemPickup() {
    // Happy pickup sound
    if (!this.audioContext || !this.sfxGain) return;
    
    const notes = [440, 554, 659]; // A, C#, E (A major)
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = "square";
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.05;
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  public playWeaponPickup() {
    // More dramatic pickup
    if (!this.audioContext || !this.sfxGain) return;
    
    const notes = [330, 440, 554, 659]; // E, A, C#, E
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = "square";
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  public playSecretFound() {
    // Special discovery sound
    if (!this.audioContext || !this.sfxGain) return;
    
    const notes = [392, 440, 494, 523, 587, 659]; // G, A, B, C, D, E
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = "sine";
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  public playMenuSelect() {
    this.playNoise(0.05, 600, 400, "square");
  }

  public playMenuMove() {
    this.playNoise(0.03, 400, 350, "square");
  }

  private playNoise(duration: number, startFreq: number, endFreq: number, type: OscillatorType) {
    if (!this.audioContext || !this.sfxGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  // ============================================================================
  // E1M1 MUSIC - "At Doom's Gate" (simplified chiptune version)
  // ============================================================================

  public startE1M1Music() {
    if (!this.audioContext || !this.musicGain || this.musicPlaying) return;
    
    this.musicPlaying = true;
    this.playE1M1Loop();
  }

  public stopMusic() {
    this.musicPlaying = false;
    this.musicOscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.musicOscillators = [];
  }

  private playE1M1Loop() {
    if (!this.musicPlaying || !this.audioContext || !this.musicGain) return;
    
    // E1M1 "At Doom's Gate" - Main riff (simplified)
    // Based on the iconic E minor riff
    const bpm = 120;
    const beatDuration = 60 / bpm;
    
    // Notes: E2, E3, E4 power chord pattern
    const pattern = [
      // Bar 1
      { note: 82.41, duration: 0.25, time: 0 },      // E2
      { note: 82.41, duration: 0.25, time: 0.25 },
      { note: 164.81, duration: 0.25, time: 0.5 },   // E3
      { note: 82.41, duration: 0.25, time: 0.75 },
      { note: 155.56, duration: 0.25, time: 1 },     // Eb3
      { note: 82.41, duration: 0.25, time: 1.25 },
      { note: 146.83, duration: 0.25, time: 1.5 },   // D3
      { note: 82.41, duration: 0.25, time: 1.75 },
      
      // Bar 2
      { note: 138.59, duration: 0.25, time: 2 },     // C#3
      { note: 130.81, duration: 0.5, time: 2.25 },   // C3
      { note: 82.41, duration: 0.25, time: 2.75 },
      { note: 82.41, duration: 0.25, time: 3 },
      { note: 164.81, duration: 0.25, time: 3.25 },
      { note: 82.41, duration: 0.25, time: 3.5 },
      { note: 82.41, duration: 0.25, time: 3.75 },
      
      // Bar 3-4 (repeat with variation)
      { note: 82.41, duration: 0.25, time: 4 },
      { note: 82.41, duration: 0.25, time: 4.25 },
      { note: 164.81, duration: 0.25, time: 4.5 },
      { note: 82.41, duration: 0.25, time: 4.75 },
      { note: 174.61, duration: 0.25, time: 5 },     // F3
      { note: 82.41, duration: 0.25, time: 5.25 },
      { note: 164.81, duration: 0.25, time: 5.5 },
      { note: 82.41, duration: 0.25, time: 5.75 },
      
      { note: 155.56, duration: 0.5, time: 6 },
      { note: 82.41, duration: 0.25, time: 6.5 },
      { note: 82.41, duration: 0.25, time: 6.75 },
      { note: 164.81, duration: 0.5, time: 7 },
      { note: 82.41, duration: 0.25, time: 7.5 },
      { note: 82.41, duration: 0.25, time: 7.75 },
    ];
    
    const loopDuration = 8 * beatDuration;
    const startTime = this.audioContext.currentTime;
    
    pattern.forEach(({ note, duration, time }) => {
      if (!this.audioContext || !this.musicGain) return;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      // Distorted guitar sound
      osc.type = "sawtooth";
      osc.frequency.value = note;
      
      const noteStart = startTime + time * beatDuration;
      const noteDuration = duration * beatDuration;
      
      gain.gain.setValueAtTime(0.15, noteStart);
      gain.gain.setValueAtTime(0.15, noteStart + noteDuration * 0.8);
      gain.gain.exponentialRampToValueAtTime(0.01, noteStart + noteDuration);
      
      osc.connect(gain);
      gain.connect(this.musicGain);
      
      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);
      
      this.musicOscillators.push(osc);
    });
    
    // Add bass drum
    this.playDrumPattern(startTime, loopDuration);
    
    // Loop
    setTimeout(() => {
      if (this.musicPlaying) {
        this.musicOscillators = [];
        this.playE1M1Loop();
      }
    }, loopDuration * 1000);
  }

  private playDrumPattern(startTime: number, loopDuration: number) {
    if (!this.audioContext || !this.musicGain) return;
    
    const bpm = 120;
    const beatDuration = 60 / bpm;
    
    // Kick drum on beats 1 and 3
    for (let beat = 0; beat < 16; beat += 2) {
      const kickTime = startTime + beat * beatDuration * 0.5;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, kickTime);
      osc.frequency.exponentialRampToValueAtTime(30, kickTime + 0.1);
      
      gain.gain.setValueAtTime(0.4, kickTime);
      gain.gain.exponentialRampToValueAtTime(0.01, kickTime + 0.1);
      
      osc.connect(gain);
      gain.connect(this.musicGain);
      
      osc.start(kickTime);
      osc.stop(kickTime + 0.1);
      
      this.musicOscillators.push(osc);
    }
    
    // Snare on beats 2 and 4
    for (let beat = 1; beat < 16; beat += 2) {
      const snareTime = startTime + beat * beatDuration * 0.5;
      
      // Noise-like snare using high frequency oscillator
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = "square";
      osc.frequency.setValueAtTime(200, snareTime);
      osc.frequency.exponentialRampToValueAtTime(100, snareTime + 0.05);
      
      gain.gain.setValueAtTime(0.2, snareTime);
      gain.gain.exponentialRampToValueAtTime(0.01, snareTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.musicGain);
      
      osc.start(snareTime);
      osc.stop(snareTime + 0.08);
      
      this.musicOscillators.push(osc);
    }
  }

  // ============================================================================
  // TITLE MUSIC
  // ============================================================================

  public startTitleMusic() {
    if (!this.audioContext || !this.musicGain || this.musicPlaying) return;
    
    this.musicPlaying = true;
    this.playTitleLoop();
  }

  private playTitleLoop() {
    if (!this.musicPlaying || !this.audioContext || !this.musicGain) return;
    
    // Ominous title theme
    const notes = [
      { note: 55, duration: 2, time: 0 },      // A1
      { note: 51.91, duration: 2, time: 2 },   // Ab1
      { note: 49, duration: 2, time: 4 },      // G1
      { note: 46.25, duration: 2, time: 6 },   // Gb1
    ];
    
    const loopDuration = 8;
    const startTime = this.audioContext.currentTime;
    
    notes.forEach(({ note, duration, time }) => {
      if (!this.audioContext || !this.musicGain) return;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.value = note;
      
      gain.gain.setValueAtTime(0.1, startTime + time);
      gain.gain.setValueAtTime(0.1, startTime + time + duration * 0.8);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + time + duration);
      
      osc.connect(gain);
      gain.connect(this.musicGain);
      
      osc.start(startTime + time);
      osc.stop(startTime + time + duration);
      
      this.musicOscillators.push(osc);
    });
    
    // Loop
    setTimeout(() => {
      if (this.musicPlaying) {
        this.musicOscillators = [];
        this.playTitleLoop();
      }
    }, loopDuration * 1000);
  }

  public setMusicVolume(volume: number) {
    if (this.musicGain) {
      this.musicGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public setSfxVolume(volume: number) {
    if (this.sfxGain) {
      this.sfxGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

// Singleton instance
let audioInstance: DoomAudio | null = null;

export function getDoomAudio(): DoomAudio {
  if (!audioInstance) {
    audioInstance = new DoomAudio();
  }
  return audioInstance;
}

