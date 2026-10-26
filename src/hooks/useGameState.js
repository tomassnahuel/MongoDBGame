import { useState, useEffect } from 'react';
import { RANKS, INITIAL_ITEMS_COLLECTION, QUESTS } from '../data/gameData';
import { SHOP_ITEMS } from '../data/shopData';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'mongodb_quest_save_v2';

const DEFAULT_PLAYER = {
  name: 'Escriba Novato',
  level: 1,
  xp: 0,
  gold: 120,           // Empezar con algo más de oro para probar la tienda
  inventory: [],
  completedQuests: [],
  currentZoneId: 'zone_bson',
  purchasedItems: [],  // ids de ítems comprados (para oneTime)
  cosmetics: {         // cosméticos activos en el personaje 3D
    robe_color: 0x1d4ed8,
    gem_color:  0x00ffaa,
    hair_color: 0x3b1f0a,
    cape_color: 0x1e1b4b,
  },
  hintTokens: 0,       // fichas de pista
};

export function useGameState() {
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Asegurar que campos nuevos existan en saves viejos
        return {
          ...DEFAULT_PLAYER,
          ...parsed,
          cosmetics: { ...DEFAULT_PLAYER.cosmetics, ...(parsed.cosmetics || {}) },
          purchasedItems: parsed.purchasedItems || [],
          hintTokens: parsed.hintTokens || 0,
        };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_PLAYER };
  });

  const [activeNpcId, setActiveNpcId] = useState(null);
  const [activeChallengeQuestId, setActiveChallengeQuestId] = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [itemsDb, setItemsDb] = useState(() => INITIAL_ITEMS_COLLECTION);
  const [notification, setNotification] = useState(null);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch { /* storage restringido */ }
  }, [player]);

  const notify = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.msg === msg ? null : curr));
    }, 4500);
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
        notify(
          `¡SUBISTE DE NIVEL! Ahora eres Nivel ${newLevel}: ${RANKS[newLevel - 1]?.title}`,
          'success'
        );
      }

      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  // ─── COMPRA EN LA TIENDA ──────────────────────────────────────────────────
  const purchaseItem = (shopItem) => {
    setPlayer((prev) => {
      if (prev.gold < shopItem.price) return prev;

      const alreadyBought = prev.purchasedItems.includes(shopItem.id);
      if (shopItem.oneTime && alreadyBought) return prev;

      let updates = { gold: prev.gold - shopItem.price };

      // Marcar como comprado si es oneTime
      if (shopItem.oneTime) {
        updates.purchasedItems = [...prev.purchasedItems, shopItem.id];
      }

      const effect = shopItem.effect;

      // Aplicar efecto inmediato según tipo
      switch (effect.type) {
        case 'robe_color':
        case 'gem_color':
        case 'hair_color':
        case 'cape_color':
          updates.cosmetics = { ...prev.cosmetics, [effect.type]: effect.value };
          break;

        case 'add_xp':
          // Se aplica después vía addXp para respetar leveling
          break;

        case 'add_gold':
          // Se suma al gold restado
          updates.gold = (prev.gold - shopItem.price) + effect.value;
          break;

        case 'hint_token':
          updates.hintTokens = (prev.hintTokens || 0) + effect.value;
          break;

        case 'gold_bonus':
        case 'codex_unlock':
          // Efectos registrados para uso posterior
          break;

        default:
          break;
      }

      return { ...prev, ...updates };
    });

    // Efectos que requieren llamadas fuera del setter
    if (shopItem.effect.type === 'add_xp') {
      setTimeout(() => addXp(shopItem.effect.value), 0);
    }

    notify(`¡Compraste: ${shopItem.name}!`, 'success');
  };

  // ─── COMPLETAR MISIÓN ─────────────────────────────────────────────────────
  const completeQuest = (questId) => {
    const quest = QUESTS[questId];
    if (!quest) return;
    if (player.completedQuests.includes(questId)) return;

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
        completedQuests: [...prev.completedQuests, questId],
      };
    });

    notify(
      `¡Misión completada: "${quest.title}"! +${quest.xpReward} EXP y ${quest.itemReward.name}`,
      'success'
    );

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
    setPlayer({ ...DEFAULT_PLAYER });
    setItemsDb(INITIAL_ITEMS_COLLECTION);
    setActiveNpcId(null);
    setActiveChallengeQuestId(null);
    setShowVictory(false);
    setShowShop(false);
    notify('Aventura reiniciada con éxito', 'info');
  };

  const currentRank = RANKS[Math.min(player.level - 1, RANKS.length - 1)];
  const nextRank    = RANKS[Math.min(player.level, RANKS.length - 1)];

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
    showShop,
    setShowShop,
    notification,
    notify,
    addXp,
    purchaseItem,
    completeQuest,
    updateZone,
    resetGame,
  };
}
