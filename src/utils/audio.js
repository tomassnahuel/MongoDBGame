// Sintetizador Web Audio API de ambientación mística y gótica (estilo Dark Souls / Campana y Ascuas)
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

  // Toque de campana mística / resonancia gótica
  playBell(freq = 440, duration = 1.4) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // Campana con armónicos
      [freq, freq * 1.5, freq * 2.76, freq * 4.07].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        const amp = 0.08 / (idx + 1);
        gain.gain.setValueAtTime(amp, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      });
    } catch {
      // Fallback seguro
    }
  }

  playDialogueBlip() {
    this.playTone(280 + Math.random() * 60, 'triangle', 0.045, 0.035);
  }

  playSelect() {
    // Sonido de piedra / click metálico
    this.playTone(380, 'sine', 0.08, 0.05);
    setTimeout(() => this.playTone(190, 'triangle', 0.1, 0.04), 25);
  }

  playSuccess() {
    // Acorde de hoguera / resonancia mística
    this.playBell(330, 0.9);
    setTimeout(() => this.playBell(440, 1.1), 120);
    setTimeout(() => this.playBell(660, 1.3), 260);
  }

  playLevelUp() {
    // Toque de campana triunfal del Santuario
    this.playBell(261.63, 1.6); // C4
    setTimeout(() => this.playBell(329.63, 1.5), 180); // E4
    setTimeout(() => this.playBell(392.00, 1.6), 360); // G4
    setTimeout(() => this.playBell(523.25, 2.2), 540); // C5
  }

  playError() {
    this.playTone(180, 'sawtooth', 0.2, 0.06);
    setTimeout(() => this.playTone(135, 'sawtooth', 0.25, 0.07), 130);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const sound = new SoundManager();
