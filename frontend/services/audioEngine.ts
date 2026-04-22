import { TRACKS } from '../constants';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: number = 0;
  private nextNoteTime: number = 0;
  private current16thNote: number = 0;
  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // s
  private timerID: number | null = null;

  // Scales for procedural generation
  private pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4, D4, E4, G4, A4, C5
  private minorScale = [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00]; // A3 minor

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(trackId: number) {
    this.init();
    this.currentTrackId = trackId;
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.current16thNote = 0;
      this.nextNoteTime = this.ctx!.currentTime + 0.05;
      this.scheduler();
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  public setTrack(trackId: number) {
    this.currentTrackId = trackId;
    // If playing, it will naturally pick up the new track's logic in the next schedule cycle
  }

  private nextNote() {
    const tempo = TRACKS[this.currentTrackId].tempo;
    const secondsPerBeat = 60.0 / tempo;
    this.nextNoteTime += 0.25 * secondsPerBeat; // 16th note
    this.current16thNote++;
    if (this.current16thNote === 16) {
      this.current16thNote = 0;
    }
  }

  private scheduleNote(beatNumber: number, time: number) {
    if (!this.ctx) return;

    // Track 0: Neon Pulse (Four on the floor + random arpeggio)
    if (this.currentTrackId === 0) {
      // Kick drum on every quarter note (0, 4, 8, 12)
      if (beatNumber % 4 === 0) {
        this.playKick(time);
      }
      // Hi-hat on off-beats
      if (beatNumber % 2 !== 0) {
        this.playHiHat(time);
      }
      // Random arpeggio on 16ths
      if (Math.random() > 0.3) {
        const freq = this.pentatonicScale[Math.floor(Math.random() * this.pentatonicScale.length)];
        this.playSynth(freq, time, 0.1, 'square');
      }
    }

    // Track 1: Cyber Drift (Slow, moody, sparse)
    else if (this.currentTrackId === 1) {
      if (beatNumber === 0 || beatNumber === 8) {
        this.playKick(time, 0.8); // Deeper kick
      }
      if (beatNumber % 8 === 4) {
        this.playSnare(time);
      }
      // Sparse minor notes
      if (Math.random() > 0.7) {
        const freq = this.minorScale[Math.floor(Math.random() * this.minorScale.length)];
        this.playSynth(freq / 2, time, 0.4, 'sawtooth'); // Lower octave
      }
    }

    // Track 2: Grid Runner (Fast, driving bassline)
    else if (this.currentTrackId === 2) {
      if (beatNumber % 4 === 0) {
        this.playKick(time);
      }
      // Driving 16th bassline
      const baseFreq = 110.0; // A2
      const freq = beatNumber % 4 === 0 ? baseFreq : (beatNumber % 2 === 0 ? baseFreq * 1.2 : baseFreq * 1.5);
      this.playSynth(freq, time, 0.1, 'triangle', 0.5);
      
      if (beatNumber % 4 === 2) {
         this.playSnare(time);
      }
    }
  }

  private scheduler = () => {
    if (!this.isPlaying || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = window.setTimeout(this.scheduler, this.lookahead);
  }

  // --- Sound Generators ---

  private playKick(time: number, decay: number = 0.5) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.001, time + decay);
    
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.start(time);
    osc.stop(time + decay);
  }

  private playSnare(time: number) {
    if (!this.ctx) return;
    // Snare is a mix of a tone and noise. We'll just use a high pitched short burst for simplicity here
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.frequency.setValueAtTime(250, time);
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  private playHiHat(time: number) {
     if (!this.ctx) return;
     const osc = this.ctx.createOscillator();
     const gain = this.ctx.createGain();
     osc.type = 'square';
     osc.connect(gain);
     gain.connect(this.ctx.destination);

     osc.frequency.setValueAtTime(8000, time);
     gain.gain.setValueAtTime(0.1, time);
     gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

     osc.start(time);
     osc.stop(time + 0.05);
  }

  private playSynth(freq: number, time: number, duration: number, type: OscillatorType, vol: number = 0.2) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Simple lowpass filter for a warmer sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    osc.type = type;
    osc.frequency.value = freq;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.02); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration); // Decay

    osc.start(time);
    osc.stop(time + duration);
  }
}

export const audioEngine = new AudioEngine();
