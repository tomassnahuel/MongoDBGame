import React, { useState, useEffect } from 'react';
import { NPCS, QUESTS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function DialogueBox({
  npcId,
  isQuestCompleted,
  onClose,
  onStartChallenge
}) {
  const npc = NPCS[npcId];
  const [currentNodeKey, setCurrentNodeKey] = useState(() => (isQuestCompleted ? 'completed' : 'initial'));

  useEffect(() => {
    sound.playDialogueBlip();
  }, [currentNodeKey]);

  if (!npc) return null;

  const node = npc.dialogue[currentNodeKey] || npc.dialogue.initial;
  const quest = QUESTS[npc.questId];

  const handleOptionClick = (option) => {
    sound.playSelect();
    if (option.action === 'start_challenge') {
      onStartChallenge(quest?.id);
      onClose();
    } else if (option.action === 'view_victory') {
      onClose();
    } else if (option.next) {
      setCurrentNodeKey(option.next);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop souls-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dialogue-card souls-dialogue-card" onClick={(e) => e.stopPropagation()}>
        {/* Adorno gótico superior */}
        <div className="souls-card-filigree-top">
          <span className="filigree-line"></span>
          <span className="filigree-gem">◆</span>
          <span className="filigree-line"></span>
        </div>

        {/* Cabecera del Sabio / NPC */}
        <div className="dialogue-header souls-dialogue-header">
          <div className="dialogue-npc-avatar-box souls-avatar-box">
            <span className="dialogue-npc-avatar">{npc.avatar}</span>
          </div>
          <div className="dialogue-npc-meta">
            <h3 className="dialogue-npc-name souls-title">{npc.name}</h3>
            <span className="dialogue-npc-title souls-subtitle">{npc.title}</span>
          </div>
          <button className="btn-close-dialogue souls-btn-close" onClick={onClose} aria-label="Cerrar diálogo">
            ✕
          </button>
        </div>

        {/* Línea divisoria de oro antiguo */}
        <div className="souls-divider"></div>

        {/* Texto del Diálogo con tipografía de códice */}
        <div className="dialogue-speech-box souls-speech-box">
          <p className="dialogue-text souls-dialogue-text">{node.text}</p>
        </div>

        {/* Opciones de Diálogo estilo Dark Souls */}
        <div className="dialogue-options-list souls-options-list">
          {node.options && node.options.length > 0 ? (
            node.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                className={`dialogue-option-btn souls-option-btn ${option.action === 'start_challenge' ? 'option-btn-highlight souls-highlight-fire' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <span className="option-bracket">[</span>
                <span className="option-number">{idx + 1}</span>
                <span className="option-bracket">]</span>
                <span className="option-text">{option.text}</span>
              </button>
            ))
          ) : (
            <button type="button" className="dialogue-option-btn souls-option-btn" onClick={onClose}>
              <span className="option-bracket">[</span>
              <span className="option-number">E</span>
              <span className="option-bracket">]</span>
              <span className="option-text">Proseguir mi camino entre las cenizas.</span>
            </button>
          )}
        </div>

        {/* Recordatorio de Misión vinculada */}
        {quest && !isQuestCompleted && (
          <div className="dialogue-quest-reminder souls-quest-reminder">
            <span className="reminder-icon">⚔️</span>
            <div className="reminder-info">
              <strong>Prueba del Archivo:</strong> {quest.title} (+{quest.xpReward} Sabiduría)
            </div>
          </div>
        )}

        {/* Adorno gótico inferior */}
        <div className="souls-card-filigree-bottom">
          <span className="filigree-line"></span>
          <span className="filigree-gem">◆</span>
          <span className="filigree-line"></span>
        </div>
      </div>
    </div>
  );
}
