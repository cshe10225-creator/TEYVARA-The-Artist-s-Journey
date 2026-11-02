/**
 * Audio Service for Teyvara: The Artist's Journey
 * Implements Web Audio API procedural synthesis for fantasy RPG BGM and SFX,
 * plus support for custom uploaded or streaming audio files.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isBgmPlaying = false;
  private isMuted = false;
  private bgmVolume = 0.45;
  private sfxVolume = 0.65;
  private bgmIntervalId: number | null = null;
  private customAudioElement: HTMLAudioElement | null = null;
  private useCustomAudio = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.bgmGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.bgmGain.gain.value = this.isMuted ? 0 : this.bgmVolume;
      this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume;
      this.masterGain.gain.value = 1.0;

      this.bgmGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Setters for volume and mute
  public setBgmVolume(val: number) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.value = this.bgmVolume;
    }
    if (this.customAudioElement && !this.isMuted) {
      this.customAudioElement.volume = this.bgmVolume;
    }
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && !this.isMuted) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.sfxGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : this.bgmVolume;
      this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume;
    }
    if (this.customAudioElement) {
      this.customAudioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public getIsPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // Custom audio upload / URL support
  public setCustomAudio(url: string | null) {
    if (this.customAudioElement) {
      this.customAudioElement.pause();
      this.customAudioElement.src = '';
      this.customAudioElement = null;
    }

    if (url) {
      this.useCustomAudio = true;
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = this.isMuted ? 0 : this.bgmVolume;
      audio.muted = this.isMuted;
      this.customAudioElement = audio;
      if (this.isBgmPlaying) {
        audio.play().catch(() => {});
      }
    } else {
      this.useCustomAudio = false;
    }
  }

  // Play procedural fantasy RPG BGM
  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    if (this.useCustomAudio && this.customAudioElement) {
      this.customAudioElement.play().catch(() => {});
      return;
    }

    this.startProceduralMelody();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      window.clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.customAudioElement) {
      this.customAudioElement.pause();
    }
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  // Procedural Fantasy Orchestral Ambient Arpeggiator (Pentatonic & Lydian mode)
  private startProceduralMelody() {
    if (!this.ctx || !this.bgmGain) return;

    // Peaceful celestial anime fantasy scale (D Lydian / Pentatonic: D4, E4, F#4, A4, B4, C#5, D5, E5, F#5)
    const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 554.37, 587.33, 659.25, 739.99, 880.0];
    const chords = [
      [293.66, 369.99, 440.0], // D Maj
      [246.94, 329.63, 440.0], // G/B
      [220.0, 329.63, 440.0],  // A sus
      [196.0, 293.66, 369.99], // G Maj
    ];

    let chordIdx = 0;
    let step = 0;

    const playStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain || this.useCustomAudio) return;

      const now = this.ctx.currentTime;
      const currentChord = chords[chordIdx % chords.length];

      // Bass drone / pad on start of measure
      if (step % 8 === 0) {
        const root = currentChord[0] / 2;
        this.synthPad(root, now, 3.8);
        chordIdx++;
      }

      // Celestial Harp / Flute Arpeggio note
      if (Math.random() > 0.15) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        this.synthPluck(note, now, 0.45);
      }

      step++;
    };

    // Play immediately then loop every 480ms
    playStep();
    this.bgmIntervalId = window.setInterval(playStep, 480);
  }

  private synthPad(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, startTime);
      filter.frequency.exponentialRampToValueAtTime(700, startTime + duration * 0.5);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio fallback
    }
  }

  private synthPluck(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio fallback
    }
  }

  // --- Sound Effects ---

  // Magical Crystal Sparkle Chime (Jawapan Betul)
  public playCorrectAnswer() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const time = this.ctx!.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  // Soft Gentle Encouraging Chime (Jawapan Salah / Hint)
  public playWrongSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [440.0, 392.0]; // A4 to G4 gentle descent
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const time = this.ctx!.currentTime + idx * 0.14;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + 0.28);
    });
  }

  // Grand Victory Orchestral Fanfare (Misi Selesai / Kristal Diperoleh)
  public playVictoryFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const fanfare = [
      { f: 587.33, d: 0.15, t: 0.0 },   // D5
      { f: 587.33, d: 0.15, t: 0.15 },  // D5
      { f: 587.33, d: 0.15, t: 0.3 },   // D5
      { f: 739.99, d: 0.45, t: 0.45 },  // F#5
      { f: 659.25, d: 0.2, t: 0.9 },   // E5
      { f: 880.0, d: 0.65, t: 1.1 },    // A5
      { f: 1174.66, d: 0.9, t: 1.75 },  // D6 (high resolution)
    ];

    fanfare.forEach(({ f, d, t }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const time = this.ctx!.currentTime + t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + d);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + d);
    });
  }

  // UI Button Click (Snappy fantasy tactile cue)
  public playButtonClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, time);
      osc.frequency.exponentialRampToValueAtTime(350, time + 0.06);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.06);
    } catch {
      // Audio fallback
    }
  }

  // Pencil / Brush Sketch sound
  public playSketchSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      // White noise buffer for sketch texture
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;

      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(time);
      noise.stop(time + 0.05);
    } catch {
      // Audio fallback
    }
  }
}

export const soundService = new SoundService();
