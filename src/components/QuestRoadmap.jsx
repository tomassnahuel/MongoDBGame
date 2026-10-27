import React, { useState, useMemo } from 'react';
import { QUESTS, ZONES, NPCS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function QuestRoadmap({
  player,
  onSelectZone,
  onTalkNpc,
  onStartChallenge
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('roadmap_collapsed_v1');
      if (saved !== null) return saved === 'true';
      return typeof window !== 'undefined' && window.innerWidth <= 860;
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'main' | 'side'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [expandedQuestId, setExpandedQuestId] = useState(null);

  const completedQuests = player?.completedQuests || [];

  const toggleCollapse = () => {
    sound.playSelect();
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('roadmap_collapsed_v1', String(next));
      } catch {
        // Ignorar
      }
      return next;
    });
  };

  const { mainQuests, sideQuests, allQuests } = useMemo(() => {
    const list = Object.values(QUESTS);
    const main = list
      .filter((q) => q.category === 'main')
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const side = list
      .filter((q) => q.category === 'side')
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return { mainQuests: main, sideQuests: side, allQuests: list };
  }, []);

  const completedMainCount = useMemo(
    () => mainQuests.filter((q) => completedQuests.includes(q.id)).length,
    [mainQuests, completedQuests]
  );

  const completedSideCount = useMemo(
    () => sideQuests.filter((q) => completedQuests.includes(q.id)).length,
    [sideQuests, completedQuests]
  );

  const totalCompleted = completedQuests.length;
  const totalCount = allQuests.length;
  const progressPercent = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;

  // Filtrado de misiones según la pestaña y el filtro de estado
  const filteredQuests = useMemo(() => {
    let baseList = [];
    if (activeTab === 'main') baseList = mainQuests;
    else if (activeTab === 'side') baseList = sideQuests;
    else baseList = allQuests;

    if (statusFilter === 'pending') {
      return baseList.filter((q) => !completedQuests.includes(q.id));
    }
    if (statusFilter === 'completed') {
      return baseList.filter((q) => completedQuests.includes(q.id));
    }
    return baseList;
  }, [activeTab, statusFilter, mainQuests, sideQuests, allQuests, completedQuests]);

  // Verificar si quest_4 está bloqueada
  const isQuestLocked = (quest) => {
    if (quest.requiresCoreQuests) {
      return !['quest_1', 'quest_2', 'quest_3'].every((id) => completedQuests.includes(id));
    }
    return false;
  };

  const handleQuestCardClick = (questId) => {
    sound.playSelect();
    setExpandedQuestId((prev) => (prev === questId ? null : questId));
  };

  // Renderizar un elemento de misión individual
  const renderQuestItem = (quest) => {
    const isCompleted = completedQuests.includes(quest.id);
    const isLocked = isQuestLocked(quest);
    const isExpanded = expandedQuestId === quest.id;
    const zone = ZONES.find((z) => z.id === quest.zoneId);
    const npc = NPCS[quest.npcId];
    const isCurrentZone = player?.currentZoneId === quest.zoneId;

    let statusType = 'pending';
    let statusLabel = 'Falta hacer';
    let statusIcon = '⏳';

    if (isCompleted) {
      statusType = 'completed';
      statusLabel = 'Completada';
      statusIcon = '✓';
    } else if (isLocked) {
      statusType = 'locked';
      statusLabel = 'Bloqueada';
      statusIcon = '🔒';
    }

    return (
      <div
        key={quest.id}
        className={`roadmap-quest-card status-${statusType} ${isExpanded ? 'card-expanded' : ''}`}
        onClick={() => handleQuestCardClick(quest.id)}
      >
        <div className="quest-card-header">
          <div className="quest-status-bullet">
            <span className="bullet-icon">{statusIcon}</span>
          </div>

          <div className="quest-header-main">
            <div className="quest-meta-top">
              <span className={`quest-category-badge category-${quest.category}`}>
                {quest.category === 'main' ? 'Principal' : 'Secundaria'}
              </span>
              <span className={`quest-status-badge badge-${statusType}`}>
                {statusLabel}
              </span>
              {isCurrentZone && <span className="quest-here-badge">📍 Aquí</span>}
            </div>

            <h4 className="quest-title">{quest.title}</h4>

            <div className="quest-zone-info">
              <span className="zone-name-tag">{zone?.icon} {zone?.name || 'Reino'}</span>
              <span className="quest-sep">·</span>
              <span className="npc-name-tag">{npc?.avatar} {npc?.name}</span>
            </div>
          </div>
        </div>

        {/* Detalles expandibles con recompensas e instrucciones */}
        {isExpanded && (
          <div className="quest-expanded-body" onClick={(e) => e.stopPropagation()}>
            <p className="quest-instructions">{quest.instructions}</p>

            {isLocked && (
              <div className="quest-locked-notice">
                <span>⚠️ Requiere completar las Misiones Principales I, II y III primero.</span>
              </div>
            )}

            <div className="quest-rewards-preview">
              <span className="reward-xp">+{quest.xpReward} EXP</span>
              {quest.itemReward && (
                <span className="reward-item">
                  {quest.itemReward.icon} {quest.itemReward.name}
                </span>
              )}
            </div>

            {/* Botones de acción rápida */}
            <div className="quest-action-row">
              {onSelectZone && zone && !isCurrentZone && (
                <button
                  type="button"
                  className="btn-roadmap-action"
                  onClick={() => {
                    sound.playSelect();
                    onSelectZone(zone.id);
                  }}
                  title="Cambiar a esta zona del mapa"
                >
                  🗺️ Ir a {zone.name}
                </button>
              )}

              {onTalkNpc && npc && !isLocked && !isCompleted && (
                <button
                  type="button"
                  className="btn-roadmap-action btn-roadmap-talk"
                  onClick={() => {
                    sound.playSelect();
                    if (onSelectZone && !isCurrentZone) {
                      onSelectZone(zone.id);
                    }
                    onTalkNpc(npc.id);
                  }}
                  title="Hablar con el NPC asignado"
                >
                  💬 Hablar con {npc.name}
                </button>
              )}

              {onStartChallenge && !isLocked && !isCompleted && (
                <button
                  type="button"
                  className="btn-roadmap-action btn-roadmap-start"
                  onClick={() => {
                    sound.playSelect();
                    onStartChallenge(quest.id);
                  }}
                  title="Iniciar el desafío de la misión directamente"
                >
                  ⚔️ Desafío
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Versión colapsada minimalista: no tapa nada y muestra resumen elegante
  if (isCollapsed) {
    return (
      <aside className="roadmap-collapsed-pill" aria-label="Roadmap de misiones colapsado">
        <button
          type="button"
          className="btn-roadmap-expand"
          onClick={toggleCollapse}
          title="Abrir Roadmap de Misiones (Ver principales y secundarias)"
        >
          <span className="roadmap-pill-icon">📜</span>
          <span className="roadmap-pill-label">Misiones</span>
          <span className="roadmap-pill-count">
            {totalCompleted}/{totalCount}
          </span>
          <span className="roadmap-pill-arrow">▶</span>
        </button>
      </aside>
    );
  }

  return (
    <>
      {/* Backdrop transparente en móviles para cerrar con 1 toque */}
      <div
        className="roadmap-backdrop-mobile"
        onClick={toggleCollapse}
        aria-hidden="true"
      />
      <aside className="roadmap-container souls-theme" aria-label="Roadmap de Misiones">
      {/* Cabecera del Roadmap con progreso y botón de colapso */}
      <header className="roadmap-header">
        <div className="roadmap-header-title-row">
          <div className="roadmap-title-group">
            <span className="roadmap-header-icon">📜</span>
            <div className="roadmap-title-texts">
              <h3 className="roadmap-title">Roadmap del Escriba</h3>
              <span className="roadmap-subtitle">
                {totalCompleted} de {totalCount} misiones completadas ({progressPercent}%)
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-roadmap-collapse"
            onClick={toggleCollapse}
            title="Minimizar roadmap para no tapar pantalla"
            aria-label="Minimizar roadmap"
          >
            ◀
          </button>
        </div>

        {/* Barra de progreso global estilo Dark Souls */}
        <div className="roadmap-progress-bar">
          <div
            className="roadmap-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Pestañas de categorías: Principales vs Secundarias */}
        <nav className="roadmap-nav-tabs">
          <button
            type="button"
            className={`roadmap-tab ${activeTab === 'all' ? 'tab-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setActiveTab('all');
            }}
          >
            📋 Todas ({totalCount})
          </button>
          <button
            type="button"
            className={`roadmap-tab ${activeTab === 'main' ? 'tab-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setActiveTab('main');
            }}
          >
            ⚔️ Principales ({completedMainCount}/{mainQuests.length})
          </button>
          <button
            type="button"
            className={`roadmap-tab ${activeTab === 'side' ? 'tab-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setActiveTab('side');
            }}
          >
            🧭 Secundarias ({completedSideCount}/{sideQuests.length})
          </button>
        </nav>

        {/* Filtro rápido: Todas / Faltan hacer / Completadas */}
        <div className="roadmap-status-filter">
          <button
            type="button"
            className={`status-pill-btn ${statusFilter === 'all' ? 'pill-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setStatusFilter('all');
            }}
          >
            Todas
          </button>
          <button
            type="button"
            className={`status-pill-btn ${statusFilter === 'pending' ? 'pill-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setStatusFilter('pending');
            }}
          >
            ⏳ Faltan hacer ({totalCount - totalCompleted})
          </button>
          <button
            type="button"
            className={`status-pill-btn ${statusFilter === 'completed' ? 'pill-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setStatusFilter('completed');
            }}
          >
            ✓ Hechas ({totalCompleted})
          </button>
        </div>
      </header>

      {/* Lista de Misiones scrolleable con scrollbar fino */}
      <div className="roadmap-list-scroll">
        {activeTab === 'all' ? (
          <>
            {/* Sección de Misiones Principales */}
            <div className="roadmap-section-group">
              <div className="roadmap-section-title">
                <span>👑 Misiones Principales ({completedMainCount}/{mainQuests.length})</span>
                <span className="roadmap-section-tag">Campaña Central</span>
              </div>
              <div className="roadmap-cards-column">
                {mainQuests
                  .filter((q) => {
                    if (statusFilter === 'pending') return !completedQuests.includes(q.id);
                    if (statusFilter === 'completed') return completedQuests.includes(q.id);
                    return true;
                  })
                  .map(renderQuestItem)}
              </div>
            </div>

            {/* Sección de Misiones Secundarias */}
            <div className="roadmap-section-group">
              <div className="roadmap-section-title">
                <span>🧭 Misiones Secundarias ({completedSideCount}/{sideQuests.length})</span>
                <span className="roadmap-section-tag">Archivo & Tipos BSON</span>
              </div>
              <div className="roadmap-cards-column">
                {sideQuests
                  .filter((q) => {
                    if (statusFilter === 'pending') return !completedQuests.includes(q.id);
                    if (statusFilter === 'completed') return completedQuests.includes(q.id);
                    return true;
                  })
                  .map(renderQuestItem)}
              </div>
            </div>
          </>
        ) : (
          <div className="roadmap-cards-column">
            {filteredQuests.map(renderQuestItem)}
            {filteredQuests.length === 0 && (
              <div className="roadmap-empty-state">
                <span>No hay misiones que coincidan con este filtro.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  </>
  );
}
