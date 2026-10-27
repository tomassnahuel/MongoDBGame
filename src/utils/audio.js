// Gestor de Audio: Efectos de sonido (Web Audio API) y Banda Sonora Épica de Fondo
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = true; // Comienza silenciado respetando las políticas del navegador hasta que el usuario lo activa
    this.bgm = null;
    this.bgmSrc = '/Audio/sounduniversestudio-skyrim-music-epic-the-elder-scrolls-sound-track-204714.mp3';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  initBgm() {
    if (!this.bgm && typeof window !== 'undefined') {
      this.bgm = new Audio(this.bgmSrc);
      this.bgm.loop = true;
      this.bgm.volume = 0.45; // Volumen equilibrado para acompañar la aventura
      this.bgm.preload = 'auto';
    }
  }

  playBgm() {
    if (this.muted) return;
    this.init();
    this.initBgm();
    if (this.bgm) {
      this.bgm.play().catch((err) => {
        console.warn('Reproducción de audio a la espera de interacción:', err);
      });
    }
  }

  pauseBgm() {
    if (this.bgm) {
      this.bgm.pause();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.pauseBgm();
    } else {
      this.playBgm();
      this.playSelect();
    }
    return this.muted;
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
}

export const sound = new SoundManager();
