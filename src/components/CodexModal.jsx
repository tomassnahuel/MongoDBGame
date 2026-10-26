import React, { useState } from 'react';
import { OFFICIAL_DOCS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function CodexModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('docs'); // 'docs' | 'cheatsheet'

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="codex-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Grimorio */}
        <div className="codex-header">
          <div className="codex-title-box">
            <span className="codex-icon">📖</span>
            <div>
              <h2 className="codex-title">Grimorio del Archivo: Documentación & Fórmulas</h2>
              <span className="codex-caption">Fuentes oficiales y referencias técnicas para el equipo</span>
            </div>
          </div>
          <button className="btn-close-codex" onClick={onClose} aria-label="Cerrar grimorio">
            ✕
          </button>
        </div>

        {/* Pestañas */}
        <div className="codex-tabs">
          <button
            className={`codex-tab-btn ${activeTab === 'docs' ? 'tab-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setActiveTab('docs');
            }}
          >
            🌐 Documentación Oficial MongoDB & Mongoose
          </button>
          <button
            className={`codex-tab-btn ${activeTab === 'cheatsheet' ? 'tab-active' : ''}`}
            onClick={() => {
              sound.playSelect();
              setActiveTab('cheatsheet');
            }}
          >
            ⚡ Chuleta de Fórmulas y Códigos Clave
          </button>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="codex-body">
          {activeTab === 'docs' && (
            <div className="docs-list">
              <p className="docs-intro">
                Todo el conocimiento del juego proviene de la documentación técnica oficial. Haz clic en cualquiera de los pergaminos para profundizar en la web oficial:
              </p>
              <div className="docs-grid">
                {OFFICIAL_DOCS.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-link-card"
                  >
                    <div className="doc-link-header">
                      <span className="doc-link-badge">OFICIAL</span>
                      <span className="doc-link-arrow">↗</span>
                    </div>
                    <h3 className="doc-link-title">{doc.title}</h3>
                    <p className="doc-link-desc">{doc.desc}</p>
                    <span className="doc-link-url">{doc.url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cheatsheet' && (
            <div className="cheatsheet-content">
              {/* Sección 1: BSON y CRUD */}
              <div className="cheat-section">
                <h4 className="cheat-heading">1. BSON & Operaciones CRUD en MongoDB</h4>
                <pre className="cheat-code">
{`// Lectura con filtros:
db.coleccion.find({ tipo: "pocion", stock: { $gte: 10 } });

// Modificación atómica con $set:
db.coleccion.updateOne(
  { _id: ObjectId("65a1...") },
  { $set: { stock: 15 }, $push: { etiquetas: "magico" } }
);`}
                </pre>
              </div>

              {/* Sección 2: Mongoose Schema */}
              <div className="cheat-section">
                <h4 className="cheat-heading">2. Esquema y Validación en Mongoose (Node.js)</h4>
                <pre className="cheat-code">
{`const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  email:  { type: String, required: true, unique: true, lowercase: true },
  rol:    { type: String, enum: ['ADMIN', 'DEVELOPER', 'GUEST'], default: 'DEVELOPER' },
  edad:   { type: Number, min: [18, 'Mayor de edad requerido'] }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);`}
                </pre>
              </div>

              {/* Sección 3: Relaciones Embebido vs Referenciado */}
              <div className="cheat-section">
                <h4 className="cheat-heading">3. Relaciones: Embebido vs Referenciado con .populate()</h4>
                <pre className="cheat-code">
{`// A. Embebido (1:1 o 1:pocos acotados):
direccion: { calle: String, ciudad: String } // Dentro del mismo documento

// B. Referenciado (1:Muchos ilimitados o N:M):
misiones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mision' }]

// Consulta con poblado automático:
const heroe = await Heroe.findOne({ nombre: 'Valeria' }).populate('misiones');`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Grimorio */}
        <div className="codex-footer">
          <button className="btn-primary-action" onClick={onClose}>
            Cerrar Grimorio
          </button>
        </div>
      </div>
    </div>
  );
}
