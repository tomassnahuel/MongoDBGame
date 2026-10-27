import React from 'react';
import { sound } from '../utils/audio';

export default function VictoryScreen({ player, onOpenCodex, onRestart, onClose }) {
  return (
    <div className="modal-backdrop victory-backdrop souls-victory-backdrop" role="dialog" aria-modal="true">
      <div className="victory-card souls-victory-card" onClick={(e) => e.stopPropagation()}>
        {/* Banner legendario estilo Dark Souls */}
        <div className="souls-victory-banner">
          <div className="victory-banner-line line-left"></div>
          <div className="victory-banner-text">HOGUERA DEL ARCHIVO VINCULADA</div>
          <div className="victory-banner-line line-right"></div>
        </div>

        <div className="victory-crown souls-flame-crown">🔥</div>
        <div className="victory-pretitle souls-pretitle">EXPEDICIÓN SUPREMA COMPLETADA</div>
        <h2 className="victory-title souls-victory-title">¡Te has Consagrado como Gran Maestro del Archivo!</h2>

        <p className="victory-message souls-victory-message">
          El Gran Custodio Atlas, la Maestra Bsonia, el Herrero Schemiel y la Sabia Relatia se inclinan ante tu sabiduría.
          Las cenizas del desconocimiento se han dispersado: ahora dominas la arquitectura NoSQL, los documentos BSON,
          los esquemas de Mongoose y el criterio técnico que separa a los novicios de los verdaderos arquitectos en producción.
        </p>

        {/* Certificado de Logros de las Cenizas */}
        <div className="victory-diploma-box souls-diploma-box">
          <div className="diploma-header souls-diploma-header">
            <span>📜 REGISTRO IMPERIAL DE MAESTRÍA NoSQL</span>
            <span className="diploma-seal souls-seal-ember">SELLADO CON ASCUA</span>
          </div>
          <div className="diploma-body souls-diploma-body">
            <div className="diploma-player souls-diploma-player">
              Señor del Códice: <strong>{player.name}</strong> — Nivel {player.level} ({player.xp} EXP)
            </div>
            <ul className="diploma-skills-list souls-skills-list">
              <li>⚔️ <strong>Fundamentos de MongoDB:</strong> Colecciones, documentos BSON, identificador único <code>_id</code> y actualizaciones atómicas seguras con <code>$set</code>.</li>
              <li>⚔️ <strong>Modelado y Esquemas Mongoose:</strong> Validación estricta en tiempo de ejecución (<code>required</code>, <code>enum</code>, <code>min</code>) y tipado de modelos para Node.js.</li>
              <li>⚔️ <strong>Criterio de Arquitectura Documental:</strong> Cuándo Embeber (1:1 o 1:pocos acoplados) vs Cuándo Referenciar con <code>ObjectId</code> y <code>.populate()</code>.</li>
              <li>⚔️ <strong>Límites y Rendimiento:</strong> Respeto inquebrantable del límite de 16 MB por documento de MongoDB.</li>
            </ul>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="victory-actions souls-victory-actions">
          <button
            className="btn-victory-codex souls-btn-gold"
            onClick={() => {
              sound.playSelect();
              onOpenCodex();
            }}
          >
            📖 Consultar Grimorio y Documentación Oficial
          </button>

          <button
            className="btn-victory-close souls-btn-dark"
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
          >
            Regresar al Santuario
          </button>

          <button
            className="btn-victory-restart souls-btn-ember"
            onClick={() => {
              if (window.confirm('¿Deseas renacer en las cenizas e iniciar un nuevo viaje?')) {
                onRestart();
              }
            }}
          >
            🔄 Nuevo Ciclo de Cenizas
          </button>
        </div>
      </div>
    </div>
  );
}
