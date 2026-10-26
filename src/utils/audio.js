// Sintetizador Web Audio API para efectos de sonido retro RPG (sin librerías externas)
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignorar restricciones de audio del navegador antes de interacción
    }
  }

  playDialogueBlip() {
    this.playTone(320 + Math.random() * 80, 'triangle', 0.04, 0.03);
  }

  playSelect() {
    this.playTone(440, 'square', 0.08, 0.04);
  }

  playSuccess() {
    if (this.muted) return;
    this.playTone(523.25, 'triangle', 0.1, 0.08); // Do
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.08), 90); // Mi
    setTimeout(() => this.playTone(783.99, 'triangle', 0.2, 0.09), 180); // Sol
  }

  playLevelUp() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'square', 0.18, 0.08), i * 110);
    });
  }

  playError() {
    if (this.muted) return;
    this.playTone(220, 'sawtooth', 0.15, 0.06);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.2, 0.06), 120);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const sound = new SoundManager();
