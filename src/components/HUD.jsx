import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { RANKS } from '../data/gameData';

export default function HUD({
  player,
  currentRank,
  nextRank,
  health,
  onOpenInventory,
  onOpenCodex,
  onResetGame
}) {
  const [muted, setMuted] = useState(sound.muted);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
  };

  const prevXpNeeded = currentRank
    ? RANKS.find((rank) => rank.level === currentRank.level - 1)?.xpNeeded || 0
    : 0;
  const nextXpNeeded = nextRank ? nextRank.xpNeeded : 1000;
  const xpCurrentLevel = Math.max(0, player.xp - prevXpNeeded);
  const xpSpan = Math.max(1, nextXpNeeded - prevXpNeeded);
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / xpSpan) * 100));

  const handleReset = () => {
    if (window.confirm('¿Deseas reavivar la llama desde el inicio (Nivel 1)?')) {
      onResetGame();
    }
  };

  return (
    <>
      {/* ─── HUD SUPERIOR: BARRAS DE ESTADO DARK SOULS 3 ─────────────── */}
      <header className="souls-hud-top">
        {/* Medallón de Pacto / Nivel */}
        <div className="souls-covenant-slot" title={`Nivel ${player.level} — ${player.name}`}>
          <div className="souls-covenant-medal">
            <span className="souls-covenant-icon">⚔️</span>
            <span className="souls-level-badge">{player.level}</span>
          </div>
        </div>

        {/* Triple Barra Clásica: Salud (Roja), Maná/FP (Azul), Resistencia/EXP (Verde) */}
        <div className="souls-bars-container">
          {/* Barra de Salud (HP) */}
          <div className="souls-bar-row souls-bar-hp">
            <div className="souls-bar-frame">
              <div className="souls-bar-fill hp-fill" style={{ width: `${health}%` }}>
                <span className="souls-bar-shine"></span>
              </div>
            </div>
          </div>

          {/* Barra de Concentración / FP (Azul) */}
          <div className="souls-bar-row souls-bar-fp">
            <div className="souls-bar-frame">
              <div className="souls-bar-fill fp-fill" style={{ width: '80%' }}>
                <span className="souls-bar-shine"></span>
              </div>
            </div>
          </div>

          {/* Barra de Resistencia / Sabiduría (Verde - EXP) */}
          <div className="souls-bar-row souls-bar-stamina">
            <div className="souls-bar-frame">
              <div className="souls-bar-fill stamina-fill" style={{ width: `${Math.max(15, xpPercent)}%` }}>
                <span className="souls-bar-shine"></span>
              </div>
            </div>
          </div>

          {/* Nombre y Rango del Latente */}
          <div className="souls-character-info">
            <span className="souls-char-name">{player.name}</span>
            <span className="souls-char-sep">·</span>
            <span className="souls-char-rank">{currentRank?.title || 'Latente'}</span>
            <span className="souls-char-sep">·</span>
            <span className="souls-xp-text">{player.xp} / {nextXpNeeded} EXP</span>
          </div>
        </div>

        {/* Acciones Rápidas del HUD (Audio / Reinicio) */}
        <div className="souls-hud-actions">
          <button
            className={`souls-hud-btn souls-hud-audio-btn ${!muted ? 'audio-playing' : ''}`}
            onClick={toggleSound}
            title={muted ? 'Activar banda sonora épica y efectos (Click para reproducir música)' : 'Silenciar música y efectos'}
            aria-label={muted ? 'Activar banda sonora épica y efectos' : 'Silenciar música y efectos'}
          >
            {muted ? '🔇' : '🎵 🔊'}
          </button>
          <button
            className="souls-hud-btn"
            onClick={handleReset}
            title="Reavivar la Hoguera (Reiniciar partida)"
          >
            ↺
          </button>
        </div>
      </header>

      {/* ─── HUD INFERIOR IZQUIERDO: DIAMANTE DE EQUIPAMIENTO DARK SOULS ─── */}
      <div className="souls-equipment-dpad">
        {/* Arriba: Hechizo / Grimorio Docs */}
        <div
          className="souls-slot slot-top"
          onClick={() => {
            sound.playSelect();
            onOpenCodex();
          }}
          title="Grimorio de Hechizos y Documentación (Click para abrir)"
        >
          <span className="slot-icon">📖</span>
          <span className="slot-label">Grimorio</span>
        </div>

        {/* Izquierda: Escudo de Caballero */}
        <div className="souls-slot slot-left" title="Escudo de Acero de Lothric (+Defensa BSON)">
          <span className="slot-icon">🛡️</span>
          <span className="slot-label">Escudo</span>
        </div>

        {/* Derecha: Alabarda / Lanza */}
        <div className="souls-slot slot-right" title="Alabarda de Guardián de Irithyll (+Ataque Mongoose)">
          <span className="slot-icon">🔱</span>
          <span className="slot-label">Alabarda</span>
        </div>

        {/* Abajo: Frasco de Estus / Inventario de Almas */}
        <div
          className="souls-slot slot-bottom slot-estus"
          onClick={() => {
            sound.playSelect();
            onOpenInventory();
          }}
          title="Frasco de Estus / Inventario de Almas (Click para abrir)"
        >
          <span className="slot-icon">🏺</span>
          <span className="slot-badge">{player.inventory.length}</span>
          <span className="slot-label">Estus</span>
          <span className="slot-estus-name">Frasco Estus +{player.inventory.length}</span>
        </div>

        {/* Nexo Central Decorativo del Diamante */}
        <div className="souls-dpad-nexus" aria-hidden="true">
          <span>✧</span>
        </div>
      </div>
    </>
  );
}
