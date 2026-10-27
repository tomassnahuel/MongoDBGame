import React from 'react';
import { ZONES } from '../data/gameData';

export default function RadarCompass({ currentZoneId }) {
  const currentZone = ZONES.find((z) => z.id === currentZoneId) || ZONES[0];

  return (
    <div className="radar-container souls-astrolabe" title="Astrolabio de los Cuatro Distritos">
      <div className="radar-header souls-astrolabe-header">
        <span className="radar-dot-pulse ember-pulse">●</span>
        <span className="radar-current-zone">{currentZone.name}</span>
      </div>

      <div className="radar-map-circle souls-compass-ring">
        {/* Cruz cardinal de bronce antiguo */}
        <div className="radar-grid-cross souls-cross"></div>
        <div className="cardinal-rune rune-n">N</div>
        <div className="cardinal-rune rune-s">S</div>
        <div className="cardinal-rune rune-e">E</div>
        <div className="cardinal-rune rune-w">O</div>

        {/* Marcadores de los 4 distritos */}
        <div className={`radar-pin pin-nw ${currentZoneId === 'zone_bson' ? 'pin-active ember-active' : ''}`} title="Valle de los Documentos (BSON)">
          📜
        </div>
        <div className={`radar-pin pin-ne ${currentZoneId === 'zone_mongoose' ? 'pin-active ember-active' : ''}`} title="La Forja de Esquemas (Mongoose)">
          ⚒️
        </div>
        <div className={`radar-pin pin-sw ${currentZoneId === 'zone_relations' ? 'pin-active ember-active' : ''}`} title="La Aguja de las Relaciones (Cristales)">
          🔮
        </div>
        <div className={`radar-pin pin-se ${currentZoneId === 'zone_sanctum' ? 'pin-active ember-active' : ''}`} title="El Sanctum del Gran Custodio (Catedral)">
          👑
        </div>

        {/* Marcador del Escriba de las Cenizas */}
        <div className="radar-player-center souls-player-marker" title="Tu posición en las ruinas">
          ⚔️
        </div>
      </div>
    </div>
  );
}
