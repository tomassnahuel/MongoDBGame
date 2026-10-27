import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function HUD({
  player,
  currentRank,
  nextRank,
  onOpenInventory,
  onOpenCodex,
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
    if (window.confirm('¿Deseas renacer en las cenizas y reiniciar la expedición desde el Nivel 1?')) {
      onResetGame();
    }
  };

  return (
    <header className="hud-container souls-hud">
      {/* Perfil del Escriba de las Cenizas */}
      <div className="hud-profile">
        <div className="hud-avatar-frame" title="Emblema del Escriba de Ceniza">
          <div className="hud-avatar-icon">⚔️</div>
          <div className="hud-level-seal">
            <span className="seal-roman">NV</span>
            <span className="seal-num">{player.level}</span>
          </div>
        </div>
        <div className="hud-identity">
          <div className="hud-player-name">{player.name}</div>
          <div className="hud-player-rank">{currentRank?.title || 'Escriba de las Cenizas'}</div>
        </div>
      </div>

      {/* Barra de Sabiduría estilo Dark Souls (Barra de Ascuas / Vida) */}
      <div className="hud-xp-box souls-xp-box">
        <div className="hud-xp-labels">
          <span className="hud-xp-title">
            <span className="flame-dot">🔥</span> Sabiduría NoSQL
          </span>
          <span className="hud-xp-numbers">
            {player.xp} / {nextXpNeeded} <span className="xp-label">EXP</span>
          </span>
        </div>
        <div
          className="hud-xp-bar-outer"
          role="progressbar"
          aria-valuenow={xpPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className="hud-xp-bar-frame">
            <div className="hud-xp-bar-fill" style={{ width: `${xpPercent}%` }}>
              <div className="hud-xp-ember-glow"></div>
            </div>
            {/* Ticks de segmentación metálica estilo Dark Souls */}
            <div className="hud-bar-notches">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Recursos y Acciones Rápidas */}
      <div className="hud-actions">
        {/* Contador de Almas / Ascuas */}
        <div className="hud-souls-counter" title="Ascuas de Sabiduría recolectadas">
          <span className="souls-flame-icon">🔥</span>
          <div className="souls-value-group">
            <span className="souls-num">{player.gold}</span>
            <span className="souls-caption">ASCUAS</span>
          </div>
        </div>

        <button
          className="hud-souls-btn btn-audio-toggle"
          onClick={toggleSound}
          title={muted ? 'Activar resonancia sonora' : 'Silenciar sonido'}
          aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {muted ? '🔇' : '🔔'}
        </button>

        <button
          className="hud-souls-btn"
          onClick={() => {
            sound.playSelect();
            onOpenInventory();
          }}
          title="Ver reliquias y pergaminos recolectados"
        >
          <span className="btn-icon">🎒</span>
          <span className="btn-label">Reliquias</span>
          {player.inventory.length > 0 && (
            <span className="hud-souls-badge">{player.inventory.length}</span>
          )}
        </button>

        <button
          className="hud-souls-btn hud-btn-codex"
          onClick={() => {
            sound.playSelect();
            onOpenCodex();
          }}
          title="Consultar Grimorio de Documentación Oficial"
        >
          <span className="btn-icon">📜</span>
          <span className="btn-label">Grimorio</span>
        </button>

        <button
          className="hud-souls-btn hud-btn-reset"
          onClick={handleReset}
          title="Reiniciar expedición del Archivo"
          aria-label="Reiniciar juego"
        >
          <span className="btn-icon">🔄</span>
        </button>
      </div>
    </header>
  );
}
