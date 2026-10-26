import React from 'react';
import { useGameState } from './hooks/useGameState';
import HUD from './components/HUD';
import WorldMap from './components/WorldMap';
import DialogueBox from './components/DialogueBox';
import ChallengeModal from './components/ChallengeModal';
import InventoryModal from './components/InventoryModal';
import CodexModal from './components/CodexModal';
import VictoryScreen from './components/VictoryScreen';
import { NPCS, QUESTS } from './data/gameData';
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

  const activeNpc = NPCS[activeNpcId];
  const isQuestDone = activeNpc ? player.completedQuests.includes(activeNpc.questId) : false;

  return (
    <div className="game-wrapper">
      {/* HUD Superior Fijo */}
      <HUD
        player={player}
        currentRank={currentRank}
        nextRank={nextRank}
        onOpenInventory={() => setShowInventory(true)}
        onOpenCodex={() => setShowCodex(true)}
        onResetGame={resetGame}
      />

      {/* Notificación flotante de logros / nivel */}
      {notification && (
        <div className={`toast-notification toast-${notification.type}`} role="status">
          <span className="toast-icon">
            {notification.type === 'success' ? '🏆' : 'ℹ️'}
          </span>
          <span className="toast-text">{notification.msg}</span>
        </div>
      )}

      {/* Escenario de Exploración del Reino */}
      <WorldMap
        player={player}
        onSelectZone={updateZone}
        onTalkNpc={(npcId) => setActiveNpcId(npcId)}
      />

      {/* Modal de Diálogo RPG */}
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
          onCompleteQuest={(qId) => completeQuest(qId)}
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
          onRestart={resetGame}
          onClose={() => setShowVictory(false)}
        />
      )}
    </div>
  );
}
