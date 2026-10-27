import React from 'react';

export default function LoadingScreen3D({ progress = 0, stage = '' }) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="souls-loading-overlay" role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Carga del Mundo 3D">
      <div className="souls-loading-container">
        {/* Emblema místico / Hoguera animada */}
        <div className="souls-loading-emblem">
          <div className="souls-loading-fire" aria-hidden="true">🔥</div>
          <div className="souls-loading-ring"></div>
        </div>

        {/* Textos de carga */}
        <div className="souls-loading-tag">PREPARANDO EL REINO NO-SQL</div>
        <h2 className="souls-loading-title">Cargando Mundo 3D</h2>

        {/* Porcentaje numérico real */}
        <div className="souls-loading-percentage">
          <span className="souls-loading-num">{clampedProgress}</span>
          <span className="souls-loading-symbol">%</span>
        </div>

        {/* Barra de progreso progresiva real */}
        <div className="souls-loading-track">
          <div
            className="souls-loading-fill"
            style={{ width: `${clampedProgress}%` }}
          >
            <span className="souls-loading-shine"></span>
          </div>
        </div>

        {/* Detalle del activo cargándose */}
        <p className="souls-loading-stage">
          {stage || (clampedProgress >= 100 ? '¡Reino cargado! Ingresando...' : 'Descargando y compilando mallas 3D...')}
        </p>
      </div>
    </div>
  );
}
