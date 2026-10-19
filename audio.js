/**
 * FLUIDLAB - Web Audio API Procedural Lo-Fi Ambient Synthesizer & Sound FX Engine
 * Bebas hak cipta, tanpa ketergantungan file eksternal/CDN mp3 yang rentan gagal dimuat.
 * Menghasilkan progresi chord Lo-Fi chillout futuristik dengan synth Rhodes & warmth vinyl.
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.45; // Default volume 45%
    this.masterGain = null;
    this.lofiTimer = null;
    this.chordStep = 0;
    
    // Chord progression in Hz (Lo-Fi Jazz / Chillhop: Dmaj9 -> Bm9 -> Gmaj9 -> A7sus4)
    this.chords = [
      // Dmaj9 (D3, F#3, A3, C#4, E4)
      [146.83, 185.00, 220.00, 277.18, 329.63],
      // Bm9 (B2, D3, F#3, A3, C#4)
      [123.47, 146.83, 185.00, 220.00, 277.18],
      // Gmaj9 (G2, B2, D3, F#3, A3)
      [98.00, 123.47, 146.83, 185.00, 220.00],
      // A13sus (A2, D3, E3, G3, B3)
      [110.00, 146.83, 164.81, 196.00, 246.94]
    ];

    this.onStateChangeCallbacks = [];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  onStateChange(callback) {
    this.onStateChangeCallbacks.push(callback);
  }

  notifyState() {
    this.onStateChangeCallbacks.forEach(cb => cb(this.isPlaying, this.volume, this.isMuted));
  }

  // Synthesizes a soft Rhodes / electric piano tone
  playEPianoNote(freq, startTime, duration = 3.6) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm triangle + sine wave harmonics
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 2, startTime);

    // Warm lo-fi low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, startTime);
    filter.frequency.exponentialRampToValueAtTime(350, startTime + duration);

    // Envelope (soft attack, sustained body, gentle release)
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.8);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration);
    subOsc.stop(startTime + duration);
  }

  // Mellow lo-fi sub bass note
  playBassNote(freq, startTime, duration = 3.6) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq / 2, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Generates atmospheric vinyl warmth & crackle
  createVinylAtmosphere() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.015;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.8;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.02;

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start();
    this.vinylNode = whiteNoise;
  }

  playNextChord() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chords[this.chordStep % this.chords.length];
    const now = this.ctx.currentTime;
    const chordDuration = 3.6;

    // Play chord notes with slight humanized strumming delays
    chord.forEach((freq, idx) => {
      const strumOffset = idx * 0.04;
      this.playEPianoNote(freq, now + strumOffset, chordDuration);
    });

    // Play corresponding root bass note
    this.playBassNote(chord[0], now, chordDuration);

    this.chordStep++;

    // Schedule next chord in 3.6s
    this.lofiTimer = setTimeout(() => {
      this.playNextChord();
    }, 3600);
  }

  start() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    if (!this.vinylNode) {
      this.createVinylAtmosphere();
    }
    this.playNextChord();
    this.notifyState();
  }

  pause() {
    this.isPlaying = false;
    if (this.lofiTimer) {
      clearTimeout(this.lofiTimer);
      this.lofiTimer = null;
    }
    this.notifyState();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  setVolume(val) {
    // val between 0.0 and 1.0
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.notifyState();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    this.notifyState();
  }

  // Futuristic Sound FX for UI Interactions
  playClickSound() {
    try {
      this.initContext();
      if (this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playSuccessSound() {
    try {
      this.initContext();
      if (this.isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const time = this.ctx.currentTime + (i * 0.07);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.25);
      });
    } catch (e) {}
  }

  playErrorSound() {
    try {
      this.initContext();
      if (this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }
}

// Global audio singleton
window.fluidAudio = new AudioManager();
