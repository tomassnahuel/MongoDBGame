import React, { useState, useEffect } from 'react';
import { NPCS, QUESTS } from '../data/gameData';
import { sound } from '../utils/audio';
import NPCModelPreview from './NPCModelPreview';

export default function DialogueBox({
  npcId,
  isQuestCompleted,
  onClose,
  onStartChallenge
}) {
  const npc = NPCS[npcId];
  const [currentNodeKey, setCurrentNodeKey] = useState('initial');

  useEffect(() => {
    // Si la misión ya fue completada, comenzar en el nodo de agradecimiento
    if (isQuestCompleted) {
      setCurrentNodeKey('completed');
    } else {
      setCurrentNodeKey('initial');
    }
  }, [npcId, isQuestCompleted]);

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
    <div
      className="modal-backdrop dialogue-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialogue-npc-name"
    >
      <div className="dialogue-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del NPC */}
        <div className="dialogue-header">
          <div className="dialogue-npc-avatar-box">
            <span className="dialogue-npc-avatar">{npc.avatar}</span>
          </div>
          <div className="dialogue-npc-meta">
            <h3 className="dialogue-npc-name" id="dialogue-npc-name">{npc.name}</h3>
            <span className="dialogue-npc-title">{npc.title}</span>
          </div>
          <button className="btn-close-dialogue" onClick={onClose} aria-label="Cerrar diálogo">
            ✕
          </button>
        </div>

        <div className="dialogue-content">
          <NPCModelPreview key={npc.id} modelPath={npc.model} npcName={npc.name} />

          <div className="dialogue-conversation">
            {/* Texto del Diálogo */}
            <div className="dialogue-speech-box">
              <p className="dialogue-text">{node.text}</p>
            </div>

            {/* Opciones de Diálogo y Respuestas */}
            <div className="dialogue-options-list">
              {node.options && node.options.length > 0 ? (
                node.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`dialogue-option-btn ${option.action === 'start_challenge' ? 'option-btn-highlight' : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <span className="option-number">[{idx + 1}]</span>
                    <span className="option-text">{option.text}</span>
                  </button>
                ))
              ) : (
                <button type="button" className="dialogue-option-btn" onClick={onClose}>
                  <span className="option-number">[Enter]</span>
                  <span className="option-text">Entendido. Hasta pronto, {npc.name}.</span>
                </button>
              )}
            </div>

            {/* Recordatorio de Misión */}
            {quest && !isQuestCompleted && (
              <div className="dialogue-quest-reminder">
                <span className="reminder-icon">📜</span>
                <div className="reminder-info">
                  <strong>Misión vinculada:</strong> {quest.title} (+{quest.xpReward} EXP)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
