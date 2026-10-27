import React, { useState, useMemo } from 'react';
import { ZONES, NPCS, QUESTS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function WorldMap({
  player,
  onSelectZone,
  onTalkNpc,
  onStartChallenge
}) {
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'main' | 'side' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  const completedQuests = player?.completedQuests || [];
  const currentZone = ZONES.find((z) => z.id === player.currentZoneId) || ZONES[0];

  // Cálculo de estadísticas globales de progreso
  const stats = useMemo(() => {
    const totalZones = ZONES.length;
    let completedCount = 0;
    let mainTotal = 0;
    let mainCompleted = 0;
    let sideTotal = 0;
    let sideCompleted = 0;

    ZONES.forEach((zone) => {
      const npc = NPCS[zone.npcId];
      const quest = QUESTS[npc?.questId];
      const isDone = quest ? completedQuests.includes(quest.id) : false;

      if (isDone) completedCount++;

      if (quest?.category === 'main') {
        mainTotal++;
        if (isDone) mainCompleted++;
      } else {
        sideTotal++;
        if (isDone) sideCompleted++;
      }
    });

    const percent = totalZones > 0 ? Math.round((completedCount / totalZones) * 100) : 0;
    const coreDone = ['quest_1', 'quest_2', 'quest_3'].filter((qId) => completedQuests.includes(qId)).length;
    const sanctumUnlocked = coreDone === 3;

    return {
      totalZones,
      completedCount,
      percent,
      mainTotal,
      mainCompleted,
      sideTotal,
      sideCompleted,
      coreDone,
      sanctumUnlocked
    };
  }, [completedQuests]);

  // Filtrado y búsqueda de distritos
  const filteredZones = useMemo(() => {
    return ZONES.filter((zone) => {
      const npc = NPCS[zone.npcId];
      const quest = QUESTS[npc?.questId];
      const isCompleted = quest ? completedQuests.includes(quest.id) : false;
      const isMain = quest?.category === 'main';

      // Filtro de categoría
      if (filterCategory === 'main' && !isMain) return false;
      if (filterCategory === 'side' && isMain) return false;
      if (filterCategory === 'pending' && isCompleted) return false;
      if (filterCategory === 'completed' && !isCompleted) return false;

      // Filtro de búsqueda por texto (nombre de zona, npc, misión, tema, descripción)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchZone = zone.name.toLowerCase().includes(q) || zone.subtitle.toLowerCase().includes(q) || zone.description.toLowerCase().includes(q);
        const matchNpc = npc?.name.toLowerCase().includes(q) || npc?.title.toLowerCase().includes(q);
        const matchQuest = quest?.title.toLowerCase().includes(q) || quest?.instructions?.toLowerCase().includes(q);
        if (!matchZone && !matchNpc && !matchQuest) return false;
      }

      return true;
    });
  }, [filterCategory, searchQuery, completedQuests]);

  return (
    <main className="world-container">
      {/* ─── CABECERA DEL REINO Y RESUMEN TÁCTICO ─────────────────── */}
      <section className="world-header">
        <div className="world-header-tag">COMANDO TÁCTICO DEL REINO</div>
        <h1 className="world-title">Cartografía de MongoDB & Mongoose</h1>
        <p className="world-subtitle">
          Supervisa el estado de pacificación de los distritos NoSQL, consulta las misiones pendientes y viaja directamente hacia los sabios del códice.
        </p>

        {/* ─── BANNER DE PROGRESO GLOBAL DEL REINO ───────────────── */}
        <div className="tactical-progress-panel">
          <div className="tactical-progress-top">
            <div className="tactical-progress-meta">
              <span className="tactical-meta-title">Dominio del Archivo</span>
              <span className="tactical-meta-value">
                {stats.completedCount} de {stats.totalZones} Distritos Conquistados
              </span>
            </div>
            <div className="tactical-percent-badge">{stats.percent}%</div>
          </div>

          {/* Barra de progreso global */}
          <div className="tactical-progress-bar-bg" role="progressbar" aria-valuenow={stats.percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="tactical-progress-bar-fill" style={{ width: `${stats.percent}%` }}>
              <span className="tactical-bar-shine"></span>
            </div>
          </div>

          {/* Píldoras de Estadísticas Tácticas */}
          <div className="tactical-stats-row">
            <div className="tactical-stat-pill">
              <span className="stat-icon">👑</span>
              <span className="stat-label">Historia Principal:</span>
              <span className="stat-count">{stats.mainCompleted} / {stats.mainTotal}</span>
            </div>
            <div className="tactical-stat-pill">
              <span className="stat-icon">📜</span>
              <span className="stat-label">Especializaciones:</span>
              <span className="stat-count">{stats.sideCompleted} / {stats.sideTotal}</span>
            </div>
            <div className="tactical-stat-pill">
              <span className="stat-icon">⭐</span>
              <span className="stat-label">Experiencia:</span>
              <span className="stat-count">{player?.xp || 0} EXP</span>
            </div>
            <div className={`tactical-stat-pill ${stats.sanctumUnlocked ? 'pill-sanctum-unlocked' : 'pill-sanctum-locked'}`}>
              <span className="stat-icon">{stats.sanctumUnlocked ? '🔓' : '🔒'}</span>
              <span className="stat-label">Sanctum Final:</span>
              <span className="stat-count">
                {stats.sanctumUnlocked ? '¡Abierto para Graduación!' : `${stats.coreDone}/3 Misiones Core`}
              </span>
            </div>
          </div>
        </div>

        {/* ─── BARRA DE HERRAMIENTAS TÁCTICA: FILTROS Y BÚSQUEDA ──── */}
        <div className="tactical-toolbar">
          {/* Pestañas de Filtrado */}
          <div className="tactical-filter-tabs" role="tablist" aria-label="Filtrar distritos">
            <button
              type="button"
              className={`tactical-tab ${filterCategory === 'all' ? 'tab-active' : ''}`}
              onClick={() => {
                sound.playSelect();
                setFilterCategory('all');
              }}
            >
              Todos ({stats.totalZones})
            </button>
            <button
              type="button"
              className={`tactical-tab ${filterCategory === 'main' ? 'tab-active' : ''}`}
              onClick={() => {
                sound.playSelect();
                setFilterCategory('main');
              }}
            >
              👑 Principales ({stats.mainTotal})
            </button>
            <button
              type="button"
              className={`tactical-tab ${filterCategory === 'side' ? 'tab-active' : ''}`}
              onClick={() => {
                sound.playSelect();
                setFilterCategory('side');
              }}
            >
              📜 Secundarias ({stats.sideTotal})
            </button>
            <button
              type="button"
              className={`tactical-tab ${filterCategory === 'pending' ? 'tab-active' : ''}`}
              onClick={() => {
                sound.playSelect();
                setFilterCategory('pending');
              }}
            >
              ⏳ Pendientes ({stats.totalZones - stats.completedCount})
            </button>
            <button
              type="button"
              className={`tactical-tab ${filterCategory === 'completed' ? 'tab-active' : ''}`}
              onClick={() => {
                sound.playSelect();
                setFilterCategory('completed');
              }}
            >
              ✓ Superadas ({stats.completedCount})
            </button>
          </div>

          {/* Campo de Búsqueda Táctica */}
          <div className="tactical-search-box">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="tactical-search-input"
              placeholder="Buscar por concepto (BSON, Schema, GridFS, populate...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar distritos o conceptos"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── GRID DE ZONAS TÁCTICAS ──────────────────────────────── */}
      {filteredZones.length === 0 ? (
        <div className="tactical-empty-state">
          <span className="empty-icon">📜</span>
          <h3>Ningún distrito coincide con el filtro</h3>
          <p>Prueba ajustando los términos de búsqueda o cambiando la pestaña de categoría.</p>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setFilterCategory('all');
              setSearchQuery('');
            }}
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="zones-grid">
          {filteredZones.map((zone) => {
            const npc = NPCS[zone.npcId];
            const quest = QUESTS[npc?.questId];
            const isCurrent = player?.currentZoneId === zone.id;
            const isCompleted = quest ? completedQuests.includes(quest.id) : false;
            const isMain = quest?.category === 'main';

            const isLocked = zone.requiresCoreQuests
              && !['quest_1', 'quest_2', 'quest_3'].every((questId) => completedQuests.includes(questId));

            return (
              <article
                key={zone.id}
                className={`zone-card ${isCurrent ? 'zone-card-active' : ''} ${isLocked ? 'zone-card-locked' : ''} ${isCompleted ? 'zone-card-completed' : ''}`}
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
                {/* Cabecera de la Tarjeta */}
                <div className="zone-card-top">
                  <span className="zone-icon" title={`Distrito: ${zone.name}`}>
                    {zone.icon}
                  </span>
                  <div className="zone-badge-wrapper">
                    <span className={`badge-quest-type ${isMain ? 'type-main' : 'type-side'}`}>
                      {isMain ? '👑 Principal' : '📜 Secundaria'}
                    </span>
                    {isCurrent && <span className="badge-current-location">📍 Estás aquí</span>}
                    {isCompleted && <span className="badge-completed">✓ Superada</span>}
                    {isLocked && <span className="badge-locked">🔒 Bloqueada</span>}
                  </div>
                </div>

                {/* Información del Distrito */}
                <h2 className="zone-name">{zone.name}</h2>
                <div className="zone-subtitle">{zone.subtitle}</div>
                <p className="zone-desc">{zone.description}</p>

                {/* Resumen de Misión y Recompensa */}
                {quest && (
                  <div className="zone-quest-preview">
                    <div className="quest-preview-title">
                      <span className="quest-mini-tag">MISIÓN:</span>
                      <span className="quest-name-text">{quest.title}</span>
                    </div>
                    <div className="quest-reward-chips">
                      <span className="reward-chip xp-chip" title="Recompensa de Experiencia">
                        ⭐ +{quest.xpReward} EXP
                      </span>
                      {quest.itemReward && (
                        <span className="reward-chip item-chip" title={quest.itemReward.desc}>
                          {quest.itemReward.icon} {quest.itemReward.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Información del NPC Custodio */}
                {npc && (
                  <div className="npc-preview-box">
                    <div className="npc-avatar-circle" title={npc.name}>
                      {npc.avatar}
                    </div>
                    <div className="npc-info-col">
                      <span className="npc-name">{npc.name}</span>
                      <span className="npc-title">{npc.title}</span>
                    </div>
                    <div className="npc-status-icon">
                      {isCompleted ? (
                        <span className="npc-indicator-done" title="Misión cumplida">✓</span>
                      ) : isLocked ? (
                        <span className="npc-indicator-locked" title="Requiere superar las misiones anteriores">🔒</span>
                      ) : (
                        <span className="npc-indicator-alert" title="¡Misión disponible!">!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Botones de Acción Táctica Dual */}
                <div className="zone-actions-dual">
                  {/* Botón 1: Diálogo con el Sabio */}
                  <button
                    type="button"
                    className={`btn-zone-talk ${isLocked ? 'btn-disabled' : ''}`}
                    disabled={isLocked}
                    title="Aprende la teoría pedagógica dialogando con el NPC"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLocked) {
                        sound.playError();
                        return;
                      }
                      sound.playSelect();
                      onSelectZone(zone.id);
                      onTalkNpc(npc.id);
                    }}
                  >
                    💬 {isCompleted ? 'Repasar Diálogo' : `Hablar con ${npc.name.split(' ')[0]}`}
                  </button>

                  {/* Botón 2: Abrir Desafío Directo */}
                  {quest && onStartChallenge && (
                    <button
                      type="button"
                      className={`btn-zone-challenge ${isLocked ? 'btn-disabled' : ''} ${isCompleted ? 'challenge-done' : ''}`}
                      disabled={isLocked}
                      title="Abrir directamente el códice de desafío NoSQL"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isLocked) {
                          sound.playError();
                          return;
                        }
                        sound.playSelect();
                        onSelectZone(zone.id);
                        onStartChallenge(quest.id);
                      }}
                    >
                      {isCompleted ? '📜 Códice ✓' : '⚡ Desafío'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ─── GUÍA RÁPIDA DE EXPLORACIÓN ──────────────────────────── */}
      <footer className="world-footer-tip">
        <span className="tip-icon">💡</span>
        <span>
          <strong>Estrategia Táctica:</strong> Dialoga con cada maestro para recibir la teoría antes de desafiar el códice. Puedes abrir el <strong>Códice Directo</strong> en cualquier momento si ya dominas el tema, o consultar el <strong>Grimorio Docs</strong> desde la barra superior.
        </span>
      </footer>
    </main>
  );
}
