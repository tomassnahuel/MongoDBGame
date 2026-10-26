import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function HUD({
  player,
  currentRank,
  nextRank,
  onOpenInventory,
  onOpenCodex,
  onOpenShop,
  onResetGame
}) {
  const [muted, setMuted] = useState(sound.muted);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
  };

  const prevXpNeeded = currentRank ? (currentRank.level === 1 ? 0 : RANKS_PREV(currentRank.level)) : 0;
  const nextXpNeeded = nextRank ? nextRank.xpNeeded : 1000;
  const xpCurrentLevel = Math.max(0, player.xp - prevXpNeeded);
  const xpSpan = Math.max(1, nextXpNeeded - prevXpNeeded);
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / xpSpan) * 100));

  function RANKS_PREV(level) {
    if (level === 2) return 100;
    if (level === 3) return 250;
    if (level === 4) return 450;
    return 700;
  }

  const handleReset = () => {
    if (window.confirm('¿Deseas reiniciar toda la aventura y empezar de nuevo desde el Nivel 1?')) {
      onResetGame();
    }
  };

  return (
    <header className="hud-container">
      {/* Perfil del Escriba */}
      <div className="hud-profile">
        <div className="hud-avatar" title="Tu avatar de Escriba">
          🧙
          <span className="hud-level-badge">Lv.{player.level}</span>
        </div>
        <div className="hud-identity">
          <div className="hud-player-name">{player.name}</div>
          <div className="hud-player-rank">{currentRank?.title || 'Escriba'}</div>
        </div>
      </div>

      {/* Barra de EXP */}
      <div className="hud-xp-box">
        <div className="hud-xp-labels">
          <span className="hud-xp-title">EXP de Sabiduría</span>
          <span className="hud-xp-numbers">
            {player.xp} / {nextXpNeeded} XP ({xpPercent}%)
          </span>
        </div>
        <div className="hud-xp-bar-bg" role="progressbar" aria-valuenow={xpPercent} aria-valuemin="0" aria-valuemax="100">
          <div className="hud-xp-bar-fill" style={{ width: `${xpPercent}%` }}>
            <div className="hud-xp-shine"></div>
          </div>
        </div>
      </div>

      {/* Recursos y Acciones Rápidas */}
      <div className="hud-actions">
        <div className="hud-gold" title="Monedas de Sabiduría obtenidas en misiones">
          🪙 <span className="hud-gold-value">{player.gold}</span>
        </div>

        {/* Botón de Tienda — destacado en dorado */}
        <button
          className="hud-btn hud-btn-shop"
          onClick={onOpenShop}
          title="Visitar el Bazar del Archivista"
        >
          🛒 Tienda
        </button>

        <button
          className="hud-btn hud-btn-audio"
          onClick={toggleSound}
          title={muted ? 'Activar sonido' : 'Silenciar sonido'}
          aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        <button
          className="hud-btn"
          onClick={() => { sound.playSelect(); onOpenInventory(); }}
          title="Ver artefactos y recompensas mágicas"
        >
          🎒 Inventario
          {player.inventory.length > 0 && (
            <span className="hud-badge">{player.inventory.length}</span>
          )}
        </button>

        <button
          className="hud-btn hud-btn-codex"
          onClick={() => { sound.playSelect(); onOpenCodex(); }}
          title="Consultar notas técnicas y documentación oficial"
        >
          📖 Grimorio Docs
        </button>

        <button
          className="hud-btn hud-btn-reset"
          onClick={handleReset}
          title="Reiniciar partida"
        >
          ↺
        </button>
      </div>
    </header>
  );
}
