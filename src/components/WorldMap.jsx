import React from 'react';
import { ZONES, NPCS, QUESTS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function WorldMap({
  player,
  onSelectZone,
  onTalkNpc
}) {
  const currentZone = ZONES.find((z) => z.id === player.currentZoneId) || ZONES[0];

  return (
    <main className="world-container">
      {/* Cabecera del Reino */}
      <section className="world-header">
        <div className="world-header-tag">CIUDADELA DEL GRAN ARCHIVO</div>
        <h1 className="world-title">Reino de MongoDB & Mongoose</h1>
        <p className="world-subtitle">
          Explora los distritos del reino, dialoga con los maestros del códice y supera los desafíos para dominar las bases de datos NoSQL.
        </p>
      </section>

      {/* Grid de Zonas Interactivas */}
      <div className="zones-grid">
        {ZONES.map((zone, idx) => {
          const npc = NPCS[zone.npcId];
          const quest = QUESTS[npc?.questId];
          const isCurrent = player.currentZoneId === zone.id;
          const isCompleted = player.completedQuests.includes(quest?.id);
          
          // Bloqueo progresivo: la zona 4 (Sanctum) se desbloquea tras completar las primeras 3
          const isLocked = zone.id === 'zone_sanctum' && player.completedQuests.length < 3;

          return (
            <article
              key={zone.id}
              className={`zone-card ${isCurrent ? 'zone-card-active' : ''} ${isLocked ? 'zone-card-locked' : ''}`}
              style={{ '--zone-color': zone.color }}
              onClick={() => {
                if (isLocked) {
                  sound.playError();
                  return;
                }
                sound.playSelect();
                onSelectZone(zone.id);
              }}
            >
              {/* Cabecera de la Zona */}
              <div className="zone-card-top">
                <span className="zone-icon">{zone.icon}</span>
                <div className="zone-badge-wrapper">
                  {isCurrent && <span className="badge-current-location">📍 Estás aquí</span>}
                  {isCompleted && <span className="badge-completed">✓ Superada</span>}
                  {isLocked && <span className="badge-locked">🔒 Bloqueada</span>}
                </div>
              </div>

              {/* Información de la Zona */}
              <h2 className="zone-name">{zone.name}</h2>
              <div className="zone-subtitle">{zone.subtitle}</div>
              <p className="zone-desc">{zone.description}</p>

              {/* Tarjeta del NPC en la Zona */}
              {npc && (
                <div className="npc-preview-box">
                  <div className="npc-avatar-circle">{npc.avatar}</div>
                  <div className="npc-info-col">
                    <span className="npc-name">{npc.name}</span>
                    <span className="npc-title">{npc.title}</span>
                  </div>
                  <div className="npc-status-icon">
                    {isCompleted ? (
                      <span className="npc-indicator-done" title="Misión cumplida">✓</span>
                    ) : isLocked ? (
                      <span className="npc-indicator-locked" title="Completa las misiones anteriores">🔒</span>
                    ) : (
                      <span className="npc-indicator-alert" title="¡Misión disponible!">!</span>
                    )}
                  </div>
                </div>
              )}

              {/* Botón de Interacción */}
              <div className="zone-actions">
                <button
                  type="button"
                  className={`btn-zone-enter ${isLocked ? 'btn-disabled' : ''}`}
                  disabled={isLocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLocked) {
                      sound.playError();
                      return;
                    }
                    onSelectZone(zone.id);
                    onTalkNpc(npc.id);
                  }}
                >
                  {isLocked
                    ? 'Requiere superar Misiones 1, 2 y 3'
                    : isCompleted
                    ? `Hablar con ${npc.name}`
                    : `Explorar y Hablar con ${npc.name}`}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Guía Rápida de Exploración */}
      <footer className="world-footer-tip">
        <span className="tip-icon">💡</span>
        <span>
          <strong>Consejo del Escriba:</strong> Habla con cada NPC para recibir la explicación pedagógica antes de abrir el Códice de Desafío. Puedes consultar el <strong>Grimorio Docs</strong> en cualquier momento si tienes dudas.
        </span>
      </footer>
    </main>
  );
}
