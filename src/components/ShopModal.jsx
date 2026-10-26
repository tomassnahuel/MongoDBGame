import React, { useState, useEffect } from 'react';
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shopData';
import { sound } from '../utils/audio';

export default function ShopModal({ player, onBuy, onClose }) {
  const [activeCategory, setActiveCategory] = useState('cosmetic');
  const [buyConfirm, setBuyConfirm] = useState(null);   // id del ítem a confirmar
  const [flashId, setFlashId] = useState(null);          // feedback visual
  const [previewCosmetic, setPreviewCosmetic] = useState(null);

  const filteredItems = SHOP_ITEMS.filter((i) => i.category === activeCategory);

  // Cierre con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const isPurchased = (item) =>
    item.oneTime && player.purchasedItems?.includes(item.id);

  const canAfford = (item) => player.gold >= item.price;

  const handleBuyClick = (item) => {
    if (isPurchased(item)) return;
    if (!canAfford(item)) { sound.playSelect(); return; }
    setBuyConfirm(item);
  };

  const confirmBuy = () => {
    if (!buyConfirm) return;
    sound.playSuccess();
    onBuy(buyConfirm);
    setFlashId(buyConfirm.id);
    setBuyConfirm(null);
    setTimeout(() => setFlashId(null), 1000);
  };

  const getCategoryCount = (catId) =>
    SHOP_ITEMS.filter((i) => i.category === catId && !isPurchased(i)).length;

  return (
    <div className="modal-overlay shop-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="shop-modal" role="dialog" aria-label="Tienda del Reino">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <div className="shop-header">
          <div className="shop-header-left">
            <span className="shop-title-icon">🏪</span>
            <div>
              <h2 className="shop-title">Bazar del Archivista</h2>
              <p className="shop-subtitle">Gasta tu sabiduría acumulada en el reino</p>
            </div>
          </div>
          <div className="shop-header-right">
            <div className="shop-gold-display">
              <span className="shop-gold-icon">🪙</span>
              <span className="shop-gold-amount">{player.gold}</span>
              <span className="shop-gold-label">monedas</span>
            </div>
            <button className="shop-close-btn" onClick={onClose} aria-label="Cerrar tienda">✕</button>
          </div>
        </div>

        {/* ── CATEGORÍAS ──────────────────────────────────────── */}
        <div className="shop-categories">
          {Object.values(SHOP_CATEGORIES).map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                className={`shop-cat-btn ${activeCategory === cat.id ? 'cat-active' : ''}`}
                onClick={() => { sound.playSelect(); setActiveCategory(cat.id); }}
              >
                <span className="cat-label">{cat.label}</span>
                {count > 0 && <span className="cat-badge">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="shop-body">
          {/* ── GRID DE ÍTEMS ───────────────────────────────────── */}
          <div className="shop-items-grid">
            {filteredItems.map((item) => {
              const purchased = isPurchased(item);
              const affordable = canAfford(item);
              const isFlash = flashId === item.id;

              return (
                <div
                  key={item.id}
                  className={`shop-item-card
                    ${purchased ? 'item-owned' : ''}
                    ${!affordable && !purchased ? 'item-unaffordable' : ''}
                    ${isFlash ? 'item-flash' : ''}
                    ${previewCosmetic?.id === item.id ? 'item-previewing' : ''}
                  `}
                  onMouseEnter={() => item.category === 'cosmetic' && setPreviewCosmetic(item)}
                  onMouseLeave={() => setPreviewCosmetic(null)}
                >
                  <div className="item-icon-wrapper">
                    <span className="item-icon">{item.icon}</span>
                    {purchased && <span className="item-owned-badge">✓</span>}
                  </div>

                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-desc">{item.desc}</div>
                    {!item.oneTime && (
                      <div className="item-reusable-tag">♻️ Reutilizable</div>
                    )}
                  </div>

                  <div className="item-footer">
                    <div className={`item-price ${!affordable && !purchased ? 'price-cant' : ''}`}>
                      🪙 {item.price}
                    </div>
                    {purchased ? (
                      <div className="item-btn item-btn-owned">Equipado</div>
                    ) : (
                      <button
                        className={`item-btn ${affordable ? 'item-btn-buy' : 'item-btn-disabled'}`}
                        onClick={() => handleBuyClick(item)}
                        disabled={!affordable}
                      >
                        {affordable ? 'Comprar' : 'Sin fondos'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── PANEL DE PREVIEW DEL PERSONAJE ───────────────────── */}
          <div className="shop-preview-panel">
            <div className="preview-title">👁️ Vista Previa</div>
            <CharacterPreview player={player} previewItem={previewCosmetic} />
            <div className="preview-equipped-list">
              <div className="pe-section-title">Cosmético activo</div>
              {['robe_color','gem_color','hair_color','cape_color'].map((type) => {
                const equipped = SHOP_ITEMS.find(
                  (i) => i.effect?.type === type && player.purchasedItems?.includes(i.id)
                );
                return equipped ? (
                  <div key={type} className="pe-row">
                    <span className="pe-icon">{equipped.icon}</span>
                    <span className="pe-name">{equipped.name}</span>
                  </div>
                ) : null;
              })}
              {!player.purchasedItems?.some((id) =>
                SHOP_ITEMS.find((i) => i.id === id && i.category === 'cosmetic')
              ) && (
                <div className="pe-empty">Ningún cosmético equipado todavía</div>
              )}
            </div>
          </div>
        </div>

        {/* ── MODAL DE CONFIRMACIÓN ──────────────────────────────── */}
        {buyConfirm && (
          <div className="shop-confirm-overlay" onClick={() => setBuyConfirm(null)}>
            <div className="shop-confirm-box" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon">{buyConfirm.icon}</div>
              <div className="confirm-title">¿Confirmar compra?</div>
              <div className="confirm-item-name">{buyConfirm.name}</div>
              <div className="confirm-cost">
                Costo: <strong>🪙 {buyConfirm.price}</strong> monedas
                <br/>
                <span className="confirm-balance">
                  Te quedarán: 🪙 {player.gold - buyConfirm.price}
                </span>
              </div>
              <div className="confirm-actions">
                <button className="btn-confirm-cancel" onClick={() => setBuyConfirm(null)}>
                  Cancelar
                </button>
                <button className="btn-confirm-buy" onClick={confirmBuy}>
                  ¡Comprar!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PREVIEW SVG del personaje con cosméticos ──────────────────────────────
function CharacterPreview({ player, previewItem }) {
  // Determina colores activos
  const getActive = (type) => {
    const preview = previewItem?.effect?.type === type ? previewItem.effect : null;
    if (preview) return preview.value;
    const owned = SHOP_ITEMS.find(
      (i) => i.effect?.type === type && player.purchasedItems?.includes(i.id)
    );
    return owned ? owned.effect.value : null;
  };

  const robeColor   = hexCss(getActive('robe_color')  ?? 0x1d4ed8);
  const gemColor    = hexCss(getActive('gem_color')   ?? 0x00ffaa);
  const hairColor   = hexCss(getActive('hair_color')  ?? 0x3b1f0a);
  const capeColor   = hexCss(getActive('cape_color')  ?? 0x1e1b4b);

  return (
    <div className="char-preview-svg-wrap">
      <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" className="char-preview-svg">
        {/* Capa */}
        <path d="M42 72 L25 160 L50 150 L75 160 L58 72" fill={capeColor} opacity="0.9" />
        {/* Piernas */}
        <rect x="38" y="135" width="10" height="40" rx="5" fill={darken(robeColor, 30)} />
        <rect x="52" y="135" width="10" height="40" rx="5" fill={darken(robeColor, 30)} />
        {/* Botas */}
        <rect x="35" y="168" width="16" height="8" rx="3" fill="#2d1a0e" />
        <rect x="49" y="168" width="16" height="8" rx="3" fill="#2d1a0e" />
        {/* Falda / pelvis */}
        <path d="M34 120 Q50 132 66 120 L62 140 Q50 148 38 140Z" fill={darken(robeColor, 15)} />
        {/* Torso / túnica */}
        <rect x="34" y="72" width="32" height="52" rx="12" fill={robeColor} />
        {/* Brazos */}
        <rect x="20" y="74" width="14" height="36" rx="7" fill={robeColor} />
        <rect x="66" y="74" width="14" height="36" rx="7" fill={robeColor} />
        {/* Manos */}
        <circle cx="27" cy="112" r="6" fill="#f5c5a3" />
        <circle cx="73" cy="112" r="6" fill="#f5c5a3" />
        {/* Cuello */}
        <rect x="45" y="58" width="10" height="16" rx="5" fill="#f5c5a3" />
        {/* Cabeza */}
        <ellipse cx="50" cy="44" rx="18" ry="22" fill="#f5c5a3" />
        {/* Cabello */}
        <ellipse cx="50" cy="30" rx="19" ry="11" fill={hairColor} />
        <rect x="30" y="28" width="8" height="20" rx="4" fill={hairColor} />
        <rect x="62" y="28" width="8" height="20" rx="4" fill={hairColor} />
        {/* Ojos */}
        <circle cx="43" cy="44" r="4" fill="white" />
        <circle cx="57" cy="44" r="4" fill="white" />
        <circle cx="44" cy="45" r="2.2" fill="#1a0a00" />
        <circle cx="58" cy="45" r="2.2" fill="#1a0a00" />
        {/* Báculo */}
        <rect x="76" y="70" width="4" height="68" rx="2" fill="#4a2c0a" />
        {/* Gema del báculo */}
        <polygon points="78,66 83,74 78,78 73,74" fill={gemColor} opacity="0.95" />
        <polygon points="78,66 83,74 78,78 73,74" fill={gemColor} opacity="0.4" transform="scale(1.3) translate(-18,-16)" />
        {/* Cinturón */}
        <rect x="33" y="116" width="34" height="7" rx="3" fill={darken(robeColor, 40)} />
        <rect x="47" y="116" width="6" height="7" rx="2" fill="#d97706" />
      </svg>

      {previewItem && (
        <div className="preview-label-pill">Previsualización: {previewItem.name}</div>
      )}
    </div>
  );
}

// Helpers de color
function hexCss(hex) {
  return `#${hex.toString(16).padStart(6, '0')}`;
}

function darken(cssHex, amount) {
  let hex = cssHex.replace('#', '');
  const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
