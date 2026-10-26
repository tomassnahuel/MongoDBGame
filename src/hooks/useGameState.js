import { useState, useEffect } from 'react';
import { RANKS, INITIAL_ITEMS_COLLECTION, QUESTS } from '../data/gameData';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'mongodb_quest_save_v1';

export function useGameState() {
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback si hay error de parseo
    }
    return {
      name: 'Escriba Novato',
      level: 1,
      xp: 0,
      gold: 50,
      inventory: [],
      completedQuests: [],
      currentZoneId: 'zone_bson'
    };
  });

  const [activeNpcId, setActiveNpcId] = useState(null);
  const [activeChallengeQuestId, setActiveChallengeQuestId] = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [itemsDb, setItemsDb] = useState(() => INITIAL_ITEMS_COLLECTION);
  const [notification, setNotification] = useState(null);

  // Guardar en localStorage automáticamente
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch {
      // En caso de que el almacenamiento esté restringido
    }
  }, [player]);

  const notify = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.msg === msg ? null : curr));
    }, 4000);
  };

  const addXp = (amount) => {
    setPlayer((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;

      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (newXp >= RANKS[i].xpNeeded) {
          newLevel = Math.max(newLevel, RANKS[i].level);
          break;
        }
      }

      if (newLevel > prev.level) {
        sound.playLevelUp();
        notify(`¡SUBISTE DE NIVEL! Ahora eres Nivel ${newLevel}: ${RANKS[newLevel - 1]?.title}`, 'success');
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const completeQuest = (questId) => {
    const quest = QUESTS[questId];
    if (!quest) return;

    if (player.completedQuests.includes(questId)) {
      return;
    }

    sound.playSuccess();
    addXp(quest.xpReward);

    setPlayer((prev) => {
      const updatedInv = [...prev.inventory];
      if (quest.itemReward && !updatedInv.some((it) => it.id === quest.itemReward.id)) {
        updatedInv.push(quest.itemReward);
      }

      return {
        ...prev,
        gold: prev.gold + 75,
        inventory: updatedInv,
        completedQuests: [...prev.completedQuests, questId]
      };
    });

    notify(`¡Misión completada: "${quest.title}"! Obtuviste +${quest.xpReward} EXP y ${quest.itemReward.name}`, 'success');

    if (questId === 'quest_4') {
      setTimeout(() => setShowVictory(true), 800);
    }
  };

  const updateZone = (zoneId) => {
    sound.playSelect();
    setPlayer((prev) => ({ ...prev, currentZoneId: zoneId }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer({
      name: 'Escriba Novato',
      level: 1,
      xp: 0,
      gold: 50,
      inventory: [],
      completedQuests: [],
      currentZoneId: 'zone_bson'
    });
    setItemsDb(INITIAL_ITEMS_COLLECTION);
    setActiveNpcId(null);
    setActiveChallengeQuestId(null);
    setShowVictory(false);
    notify('Aventura reiniciada con éxito', 'info');
  };

  const currentRank = RANKS[Math.min(player.level - 1, RANKS.length - 1)];
  const nextRank = RANKS[Math.min(player.level, RANKS.length - 1)];

  return {
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
    notify,
    addXp,
    completeQuest,
    updateZone,
    resetGame
  };
}
