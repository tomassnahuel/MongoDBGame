import React from 'react';
import { sound } from '../utils/audio';

export default function ModeSelectionScreen({ onSelectMode }) {
  const handleSelect = (mode) => {
    sound.playSelect();
    onSelectMode(mode);
  };

  return (
    <div className="mode-selection-overlay" role="dialog" aria-modal="true" aria-label="Selección de modo de juego">
      <div className="mode-selection-container">
        {/* Encabezado */}
        <header className="mode-selection-header">
          <div className="mode-selection-tag">MONGODB & MONGOOSE RPG</div>
          <h1 className="mode-selection-title">El Archivo del Reino</h1>
          <p className="mode-selection-subtitle">
            Bienvenido, iniciado del códice. Elige cómo deseas adentrarte en los misterios de las bases de datos NoSQL:
          </p>
        </header>

        {/* Tarjetas de Selección */}
        <div className="mode-selection-grid">
          {/* Opción 1: Mundo 3D Vivo */}
          <article
            className="mode-card mode-card-3d"
            onClick={() => handleSelect('3d')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect('3d');
              }
            }}
          >
            <div className="mode-card-badge">EXPERIENCIA INMERSIVA</div>
            <div className="mode-card-icon-wrapper">
              <span className="mode-card-icon" aria-hidden="true">⚔️</span>
            </div>
            <h2 className="mode-card-title">Mundo 3D Vivo</h2>
            <p className="mode-card-desc">
              Exploración en tercera persona por el patio gótico de Irithyll. Interactúa con los sabios modelados en 3D y descubre los santuarios de hogueras.
            </p>
            <ul className="mode-card-features">
              <li><span>🎮</span> Movimiento libre con teclado (WASD) o táctil</li>
              <li><span>🧙</span> Sabios guardianes animados en 3D</li>
              <li><span>🔥</span> Santuarios de hoguera y atmósfera viva</li>
              <li><span>⏳</span> Carga progresiva de modelos 3D</li>
            </ul>
            <button
              type="button"
              className="btn-mode-select btn-mode-3d"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('3d');
              }}
            >
              🎮 Entrar al Mundo 3D
            </button>
          </article>

          {/* Opción 2: Mapa Táctico 2D */}
          <article
            className="mode-card mode-card-map"
            onClick={() => handleSelect('map')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect('map');
              }
            }}
          >
            <div className="mode-card-badge badge-fast">ACCESO INSTANTÁNEO</div>
            <div className="mode-card-icon-wrapper icon-map">
              <span className="mode-card-icon" aria-hidden="true">🗺️</span>
            </div>
            <h2 className="mode-card-title">Mapa Táctico 2D</h2>
            <p className="mode-card-desc">
              Visualización cartográfica directa de todos los distritos del reino. Accede a los códices, desafíos y diálogos al instante sin esperas.
            </p>
            <ul className="mode-card-features">
              <li><span>⚡</span> Carga inmediata sin descargas pesadas</li>
              <li><span>📜</span> Acceso directo a todos los desafíos y NPCs</li>
              <li><span>📱</span> Rendimiento óptimo en cualquier dispositivo</li>
              <li><span>💡</span> Ideal para resolver misiones con agilidad</li>
            </ul>
            <button
              type="button"
              className="btn-mode-select btn-mode-map"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('map');
              }}
            >
              🗺️ Entrar al Mapa Táctico
            </button>
          </article>
        </div>

        {/* Pie informativo */}
        <footer className="mode-selection-footer">
          <span className="footer-tip-icon">💡</span>
          <span>
            Podrás alternar entre el <strong>Mundo 3D</strong> y el <strong>Mapa Táctico 2D</strong> en cualquier momento desde la barra superior de la aventura.
          </span>
        </footer>
      </div>
    </div>
  );
}
