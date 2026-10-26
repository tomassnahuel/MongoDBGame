import React from 'react';
import { sound } from '../utils/audio';

export default function VictoryScreen({ player, onOpenCodex, onRestart, onClose }) {
  return (
    <div className="modal-backdrop victory-backdrop" role="dialog" aria-modal="true">
      <div className="victory-card" onClick={(e) => e.stopPropagation()}>
        <div className="victory-crown">👑</div>
        <div className="victory-pretitle">EXPEDICIÓN COMPLETADA CON ÉXITO</div>
        <h2 className="victory-title">¡Te has Graduado como Maestro del Archivo!</h2>

        <p className="victory-message">
          El Gran Custodio Atlas y todo el consejo de Escribas reconocen formalmente tus conocimientos.
          Has demostrado que no solo comprendes la sintaxis de MongoDB y Mongoose, sino que sabes tomar
          las decisiones arquitectónicas correctas para una aplicación real en producción.
        </p>

        {/* Certificado de Logros */}
        <div className="victory-diploma-box">
          <div className="diploma-header">
            <span>📜 REGISTRO DE MAESTRÍA NO-SQL</span>
            <span className="diploma-seal">SELLADO</span>
          </div>
          <div className="diploma-body">
            <div className="diploma-player">
              Escriba Otorgado: <strong>{player.name}</strong> (Nivel {player.level})
            </div>
            <ul className="diploma-skills-list">
              <li>✔ Dominio de Documentos BSON, campo <code>_id</code> y operaciones CRUD con <code>$set</code>.</li>
              <li>✔ Modelado de Esquemas en Node.js y validación robusta con <code>Mongoose</code>.</li>
              <li>✔ Criterio de arquitectura: Embebido (1:1/1:pocos) vs Referencias con <code>ObjectId</code> y <code>.populate()</code>.</li>
              <li>✔ Respeto estricto del límite de 16 MB por documento.</li>
            </ul>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="victory-actions">
          <button
            className="btn-victory-codex"
            onClick={() => {
              sound.playSelect();
              onOpenCodex();
            }}
          >
            📖 Abrir Grimorio de Documentación Oficial
          </button>

          <button
            className="btn-victory-close"
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
          >
            Volver a la Ciudadela
          </button>
        </div>
      </div>
    </div>
  );
}
