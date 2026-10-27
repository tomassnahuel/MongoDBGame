import React from 'react';
import { ZONES, NPCS, QUESTS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function WorldMap({
  player,
  onSelectZone,
  onTalkNpc
}) {
  return (
    <main className="world-container souls-world-map">
      {/* Cabecera del Reino Gótico */}
      <section className="world-header souls-map-header">
        <div className="souls-header-filigree">
          <span className="filigree-line"></span>
          <span className="filigree-symbol">⚔️</span>
          <span className="filigree-line"></span>
        </div>
        <div className="world-header-tag souls-tag">CARTOGRAFÍA DEL GRAN ARCHIVO</div>
        <h1 className="world-title souls-grand-title">El Reino de las Cenizas NoSQL</h1>
        <p className="world-subtitle souls-map-subtitle">
          Recorre las catedrales y ruinas ancestrales. Dialoga con los sabios encapuchados y supera los ritos
          de BSON, Mongoose y Arquitectura Documental para encender el fuego del conocimiento.
        </p>
      </section>

      {/* Grid de Zonas Góticas */}
      <div className="zones-grid souls-zones-grid">
        {ZONES.map((zone) => {
          const npc = NPCS[zone.npcId];
          const quest = QUESTS[npc?.questId];
          const isCurrent = player.currentZoneId === zone.id;
          const isCompleted = player.completedQuests.includes(quest?.id);
          const isLocked = zone.id === 'zone_sanctum' && player.completedQuests.length < 3;

          return (
            <article
              key={zone.id}
              className={`zone-card souls-zone-card ${isCurrent ? 'zone-card-active souls-active-glow' : ''} ${isLocked ? 'zone-card-locked souls-locked-plaque' : ''}`}
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
              {/* Adorno superior de placa de piedra */}
              <div className="card-stone-filigree">
                <span></span><span></span><span></span>
              </div>

              {/* Cabecera de la Zona */}
              <div className="zone-card-top souls-zone-top">
                <span className="zone-icon souls-zone-icon">{zone.icon}</span>
                <div className="zone-badge-wrapper souls-badge-wrap">
                  {isCurrent && <span className="badge-current-location souls-badge-loc">📍 Estás aquí</span>}
                  {isCompleted && <span className="badge-completed souls-badge-done">✓ Sello Restaurado</span>}
                  {isLocked && <span className="badge-locked souls-badge-lock">🔒 Sello Cerrado</span>}
                </div>
              </div>

              {/* Información de la Zona */}
              <h2 className="zone-name souls-zone-name">{zone.name}</h2>
              <div className="zone-subtitle souls-zone-subtitle">{zone.subtitle}</div>
              <p className="zone-desc souls-zone-desc">{zone.description}</p>

              {/* Placa del Sabio / NPC */}
              {npc && (
                <div className="npc-preview-box souls-npc-box">
                  <div className="npc-avatar-circle souls-npc-avatar">{npc.avatar}</div>
                  <div className="npc-info-col">
                    <span className="npc-name souls-npc-name">{npc.name}</span>
                    <span className="npc-title souls-npc-title">{npc.title}</span>
                  </div>
                  <div className="npc-status-icon">
                    {isCompleted ? (
                      <span className="npc-indicator-done souls-ind-done" title="Prueba cumplida">✓</span>
                    ) : isLocked ? (
                      <span className="npc-indicator-locked souls-ind-lock" title="Requiere sellos anteriores">🔒</span>
                    ) : (
                      <span className="npc-indicator-alert souls-ind-alert" title="¡Prueba del Archivo disponible!">!</span>
                    )}
                  </div>
                </div>
              )}

              {/* Botón de Interacción */}
              <div className="zone-actions souls-zone-actions">
                <button
                  type="button"
                  className={`btn-zone-enter souls-btn-enter ${isLocked ? 'btn-disabled souls-btn-disabled' : ''}`}
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
                    : isCurrent
                    ? '✦ Dialogar con el Sabio'
                    : 'Viajar a estas Ruinas'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
