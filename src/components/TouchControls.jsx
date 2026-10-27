import React from 'react';

export default function TouchControls() {
  // Simular eventos de teclado al tocar los botones en pantalla
  const simulateKey = (key, isDown) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { key }));
  };

  return (
    <div className="touch-controls-container">
      {/* Pad Direccional */}
      <div className="touch-dpad">
        <button
          className="dpad-btn dpad-up"
          onMouseDown={() => simulateKey('w', true)}
          onMouseUp={() => simulateKey('w', false)}
          onTouchStart={() => simulateKey('w', true)}
          onTouchEnd={() => simulateKey('w', false)}
          aria-label="Avanzar"
        >
          ▲
        </button>
        <div className="dpad-middle">
          <button
            className="dpad-btn dpad-left"
            onMouseDown={() => simulateKey('a', true)}
            onMouseUp={() => simulateKey('a', false)}
            onTouchStart={() => simulateKey('a', true)}
            onTouchEnd={() => simulateKey('a', false)}
            aria-label="Izquierda"
          >
            ◀
          </button>
          <div className="dpad-center"></div>
          <button
            className="dpad-btn dpad-right"
            onMouseDown={() => simulateKey('d', true)}
            onMouseUp={() => simulateKey('d', false)}
            onTouchStart={() => simulateKey('d', true)}
            onTouchEnd={() => simulateKey('d', false)}
            aria-label="Derecha"
          >
            ▶
          </button>
        </div>
        <button
          className="dpad-btn dpad-down"
          onMouseDown={() => simulateKey('s', true)}
          onMouseUp={() => simulateKey('s', false)}
          onTouchStart={() => simulateKey('s', true)}
          onTouchEnd={() => simulateKey('s', false)}
          aria-label="Retroceder"
        >
          ▼
        </button>
      </div>

      {/* Botones de Acción */}
      <div className="touch-actions">
        <button
          className="touch-action-btn btn-jump"
          onMouseDown={() => simulateKey(' ', true)}
          onMouseUp={() => simulateKey(' ', false)}
          onTouchStart={() => simulateKey(' ', true)}
          onTouchEnd={() => simulateKey(' ', false)}
        >
          Saltar
        </button>
        <button
          className="touch-action-btn btn-interact"
          onClick={() => {
            simulateKey('e', true);
            setTimeout(() => simulateKey('e', false), 50);
          }}
        >
          Dialogar [E]
        </button>
      </div>
    </div>
  );
}
