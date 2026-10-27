import React, { useEffect, useRef, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import HUD from './components/HUD';
import GameCanvas3D from './components/GameCanvas3D';
import WorldMap from './components/WorldMap';
import TouchControls from './components/TouchControls';
import RadarCompass from './components/RadarCompass';
import DialogueBox from './components/DialogueBox';
import ChallengeModal from './components/ChallengeModal';
import InventoryModal from './components/InventoryModal';
import CodexModal from './components/CodexModal';
import VictoryScreen from './components/VictoryScreen';
import QuestRoadmap from './components/QuestRoadmap';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import LoadingScreen3D from './components/LoadingScreen3D';
import { NPCS } from './data/gameData';
import { sound } from './utils/audio';
import './App.css';

export default function App() {
  const {
    player,
    currentRank,
    nextRank,
    itemsDb,
    setItemsDb,
    activeNpcId,
    setActiveNpcId,
    activeChallengeQuestId,
    setActiveChallengeQuestId,
    showInventory,
    setShowInventory,
    showCodex,
    setShowCodex,
    showVictory,
    setShowVictory,
    notification,
    completeQuest,
    updateZone,
    resetGame
  } = useGameState();

  // Estados de entrada y selección de vista
  const [hasEnteredGame, setHasEnteredGame] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'map'
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const [is3DLoading, setIs3DLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');

  const [showTouchControls, setShowTouchControls] = useState(false);
  const [health, setHealth] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const deathHandled = useRef(false);

  const activeNpc = NPCS[activeNpcId];
  const isQuestDone = activeNpc ? player.completedQuests.includes(activeNpc.questId) : false;

  useEffect(() => {
    const startAudio = () => sound.playBgm();
    window.addEventListener('pointerdown', startAudio);
    window.addEventListener('keydown', startAudio);
    sound.playBgm();

    return () => {
      window.removeEventListener('pointerdown', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
  }, []);

  const handleSelectMode = (mode) => {
    setViewMode(mode);
    setHasEnteredGame(true);
    if (mode === '3d') {
      if (!is3DLoaded) {
        setIs3DLoading(true);
        setLoadingProgress(5);
        setLoadingStage('Iniciando entorno 3D de Irithyll...');
      }
    }
  };

  const handleSwitchView = (mode) => {
    sound.playSelect();
    setViewMode(mode);
    if (mode === '3d' && !is3DLoaded) {
      setIs3DLoading(true);
      setLoadingProgress(5);
      setLoadingStage('Iniciando entorno 3D de Irithyll...');
    }
  };

  const handleWrongAnswer = () => {
    setHealth((currentHealth) => Math.max(0, currentHealth - 10));
  };

  const handleResetGame = () => {
    setHealth(100);
    resetGame();
  };

  const resetGameRef = useRef(handleResetGame);

  useEffect(() => {
    resetGameRef.current = handleResetGame;
  });

  useEffect(() => {
    if (health > 0 || deathHandled.current) return undefined;

    deathHandled.current = true;
    setIsDead(true);

    const resetTimeout = window.setTimeout(() => {
      resetGameRef.current();
      setIsDead(false);
      deathHandled.current = false;
    }, 1800);

    return () => window.clearTimeout(resetTimeout);
  }, [health]);

  return (
    <>
      {/* ─── PANTALLA PREVIA DE ELECCIÓN DE MODO (3D vs MAPA 2D) ─── */}
      {!hasEnteredGame && (
        <ModeSelectionScreen onSelectMode={handleSelectMode} />
      )}

      {/* ─── PANTALLA DE CARGA PROGRESIVA REAL DEL MUNDO 3D ──────── */}
      {hasEnteredGame && viewMode === '3d' && (!is3DLoaded || is3DLoading) && (
        <LoadingScreen3D progress={loadingProgress} stage={loadingStage} />
      )}

      {/* ─── CONTENEDOR PRINCIPAL DEL JUEGO ──────────────────────── */}
      <div className={`game-wrapper ${viewMode === '3d' ? 'game-3d-active' : 'game-map-active'} ${showTouchControls ? 'touch-controls-enabled' : ''}`}>
        {/* HUD Superior Fijo con Estadísticas y Barra de EXP */}
        <HUD
          player={player}
          currentRank={currentRank}
          nextRank={nextRank}
          health={health}
          onOpenInventory={() => setShowInventory(true)}
          onOpenCodex={() => setShowCodex(true)}
          onResetGame={handleResetGame}
        />

        {/* Roadmap de Misiones a la izquierda (Principales y Secundarias) */}
        <QuestRoadmap
          player={player}
          onSelectZone={(zId) => updateZone(zId)}
          onTalkNpc={(npcId) => setActiveNpcId(npcId)}
          onStartChallenge={(questId) => {
            setActiveNpcId(null);
            setActiveChallengeQuestId(questId);
          }}
        />

        {/* Barra de Modo de Vista y Ayuda */}
        <div className="view-mode-bar">
          <div className="view-toggle-group">
            <button
              className={`btn-view-toggle ${viewMode === '3d' ? 'view-active' : ''}`}
              onClick={() => handleSwitchView('3d')}
              title="Mundo 3D con movimiento libre y personajes"
            >
              🎮 Mundo 3D Vivo
            </button>
            <button
              className={`btn-view-toggle ${viewMode === 'map' ? 'view-active' : ''}`}
              onClick={() => handleSwitchView('map')}
              title="Vista de mapa táctico 2D"
            >
              🗺️ Mapa Táctico 2D
            </button>
          </div>

          {viewMode === '3d' && (
            <button
              className={`btn-touch-toggle ${showTouchControls ? 'touch-active' : ''}`}
              onClick={() => setShowTouchControls((prev) => !prev)}
              title="Mostrar controles táctiles en pantalla"
            >
              🕹️ {showTouchControls ? 'Ocultar Controles Táctiles' : 'Controles en Pantalla'}
            </button>
          )}
        </div>

        {/* Notificación Flotante */}
        {notification && (
          <div className={`toast-notification toast-${notification.type}`} role="status">
            <span className="toast-icon">
              {notification.type === 'success' ? '🏆' : 'ℹ️'}
            </span>
            <span className="toast-text">{notification.msg}</span>
          </div>
        )}

        {/* ÁREA DE JUEGO PRINCIPAL */}
        <main className="game-main-viewport">
          {hasEnteredGame && viewMode === '3d' && (
            <>
              {/* Lienzo WebGL 3D con Three.js y carga progresiva real */}
              <GameCanvas3D
                player={player}
                onTalkNpc={(npcId) => setActiveNpcId(npcId)}
                onZoneChange={(zoneId) => updateZone(zoneId)}
                onLoadingProgress={({ percent, stage }) => {
                  setLoadingProgress(percent);
                  if (stage) setLoadingStage(stage);
                }}
                onLoaded={() => {
                  setIs3DLoaded(true);
                  setIs3DLoading(false);
                }}
              />

              {/* Mini-Radar / Brújula en esquina */}
              {is3DLoaded && <RadarCompass currentZoneId={player.currentZoneId} />}

              {/* Controles táctiles en pantalla opcionales */}
              {is3DLoaded && showTouchControls && <TouchControls />}
            </>
          )}

          {hasEnteredGame && viewMode === 'map' && (
            /* Mapa táctico 2D alternativo */
            <WorldMap
              player={player}
              onSelectZone={(zId) => updateZone(zId)}
              onTalkNpc={(npcId) => setActiveNpcId(npcId)}
              onStartChallenge={(questId) => {
                setActiveNpcId(null);
                setActiveChallengeQuestId(questId);
              }}
            />
          )}
        </main>


      {/* Modal de Diálogo RPG al hablar con un NPC */}
      {activeNpcId && (
        <DialogueBox
          npcId={activeNpcId}
          isQuestCompleted={isQuestDone}
          onClose={() => setActiveNpcId(null)}
          onStartChallenge={(questId) => {
            setActiveNpcId(null);
            setActiveChallengeQuestId(questId);
          }}
        />
      )}

      {/* Modal de Desafío Interactivo / Códice */}
      {activeChallengeQuestId && (
        <ChallengeModal
          questId={activeChallengeQuestId}
          itemsDb={itemsDb}
          setItemsDb={setItemsDb}
          health={health}
          onCompleteQuest={(qId) => completeQuest(qId)}
          onWrongAnswer={handleWrongAnswer}
          onClose={() => setActiveChallengeQuestId(null)}
        />
      )}

      {/* Modal de Inventario */}
      {showInventory && (
        <InventoryModal
          inventory={player.inventory}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Modal de Grimorio y Documentación Oficial */}
      {showCodex && (
        <CodexModal onClose={() => setShowCodex(false)} />
      )}

      {/* Pantalla de Victoria / Graduación */}
      {showVictory && (
        <VictoryScreen
          player={player}
          onOpenCodex={() => {
            setShowVictory(false);
            setShowCodex(true);
          }}
          onRestart={handleResetGame}
          onClose={() => setShowVictory(false)}
        />
      )}

      {isDead && (
        <div className="modal-backdrop death-backdrop" role="alertdialog" aria-modal="true">
          <div className="death-message">
            <span className="death-icon" aria-hidden="true">☠</span>
            <h1>Has muerto</h1>
            <p>La aventura volverá a comenzar...</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

