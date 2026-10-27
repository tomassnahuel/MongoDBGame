import React from 'react';

export default function TouchControls() {
  // Simular eventos de teclado al tocar o mantener pulsados los controles
  const simulateKey = (key, isDown) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(
      new KeyboardEvent(eventType, {
        key,
        code: key === ' ' ? 'Space' : key === 'Shift' ? 'ShiftLeft' : `Key${key.toUpperCase()}`,
        bubbles: true,
        cancelable: true
      })
    );
  };

  const bindKey = (key) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      simulateKey(key, true);
    },
    onPointerUp: (e) => {
      e.preventDefault();
      simulateKey(key, false);
    },
    onPointerLeave: () => {
      simulateKey(key, false);
    },
    onPointerCancel: () => {
      simulateKey(key, false);
    },
    onTouchStart: (e) => {
      e.preventDefault();
      simulateKey(key, true);
    },
    onTouchEnd: (e) => {
      e.preventDefault();
      simulateKey(key, false);
    }
  });

  return (
    <div className="touch-controls-container" aria-label="Controles táctiles en pantalla">
      {/* Pad Direccional de Movimiento (W, A, S, D) */}
      <div className="touch-dpad">
        <button
          type="button"
          className="dpad-btn dpad-up"
          {...bindKey('w')}
          aria-label="Avanzar (W)"
          title="Avanzar [W]"
        >
          ▲
        </button>

        <div className="dpad-middle">
          <button
            type="button"
            className="dpad-btn dpad-left"
            {...bindKey('a')}
            aria-label="Izquierda (A)"
            title="Izquierda [A]"
          >
            ◀
          </button>

          <div className="dpad-center" aria-hidden="true">
            <span className="dpad-center-rune">✦</span>
          </div>

          <button
            type="button"
            className="dpad-btn dpad-right"
            {...bindKey('d')}
            aria-label="Derecha (D)"
            title="Derecha [D]"
          >
            ▶
          </button>
        </div>

        <button
          type="button"
          className="dpad-btn dpad-down"
          {...bindKey('s')}
          aria-label="Retroceder (S)"
          title="Retroceder [S]"
        >
          ▼
        </button>
      </div>

      {/* Botones de Acción (Salto, Sprint y Hablar/Interactuar) */}
      <div className="touch-actions">
        {/* Botón de Carrera / Sprint (Shift) */}
        <button
          type="button"
          className="touch-action-btn btn-sprint"
          {...bindKey('Shift')}
          title="Mantener para correr rápido [Shift]"
        >
          <span className="action-icon">⚡</span>
          <span className="action-text">Sprint</span>
        </button>

        {/* Botón de Salto (Espacio) */}
        <button
          type="button"
          className="touch-action-btn btn-jump"
          {...bindKey(' ')}
          title="Saltar [Espacio]"
        >
          <span className="action-icon">🦘</span>
          <span className="action-text">Salto</span>
        </button>

        {/* Botón de Interactuar / Hablar (E) */}
        <button
          type="button"
          className="touch-action-btn btn-interact"
          onPointerDown={(e) => {
            e.preventDefault();
            simulateKey('e', true);
            setTimeout(() => simulateKey('e', false), 160);
          }}
          title="Interactuar o Hablar con Sabios / Descansar en Hoguera [E]"
        >
          <span className="action-icon">💬</span>
          <span className="action-text">Hablar [E]</span>
        </button>
      </div>
    </div>
  );
}
