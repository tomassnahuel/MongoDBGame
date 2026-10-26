import React from 'react';

export default function InventoryModal({ inventory, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="inventory-card" onClick={(e) => e.stopPropagation()}>
        <div className="inventory-header">
          <div className="inventory-title-box">
            <span className="inventory-icon">🎒</span>
            <h2 className="inventory-title">Bolsa de Artefactos del Escriba</h2>
          </div>
          <button className="btn-close-inventory" onClick={onClose} aria-label="Cerrar inventario">
            ✕
          </button>
        </div>

        <p className="inventory-subtitle">
          Objetos y reliquias obtenidas al demostrar tus conocimientos ante los maestros de la Ciudadela.
        </p>

        {inventory.length === 0 ? (
          <div className="inventory-empty">
            <span className="empty-icon">🕸️</span>
            <p>Tu inventario está vacío por ahora. ¡Habla con la Maestra Bsonia en el Valle de los Documentos para ganar tu primer artefacto!</p>
          </div>
        ) : (
          <div className="inventory-grid">
            {inventory.map((item) => (
              <div key={item.id} className="inventory-item-card">
                <div className="item-icon-box">{item.icon}</div>
                <div className="item-content">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-type-badge">{item.type.toUpperCase()}</span>
                  <p className="item-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="inventory-footer">
          <button className="btn-primary-action" onClick={onClose}>
            Regresar a la Aventura
          </button>
        </div>
      </div>
    </div>
  );
}
