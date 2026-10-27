import React from 'react';
import { ZONES } from '../data/gameData';

export default function RadarCompass({ currentZoneId, onFastTravel }) {
  const currentZone = ZONES.find((z) => z.id === currentZoneId) || ZONES[0];

  return (
    <div className="radar-container" title="Radar del Gran Archivo">
      <div className="radar-header">
        <span className="radar-dot-pulse">●</span>
        <span className="radar-current-zone">{currentZone.name}</span>
      </div>

      <div className="radar-map-circle">
        <div className="radar-grid-cross"></div>
        {/* Marcadores de los 4 distritos */}
        <div className={`radar-pin pin-nw ${currentZoneId === 'zone_bson' ? 'pin-active' : ''}`} title="Valle de los Documentos (BSON)">
          📜
        </div>
        <div className={`radar-pin pin-ne ${currentZoneId === 'zone_mongoose' ? 'pin-active' : ''}`} title="La Forja de Esquemas (Mongoose)">
          ⚒️
        </div>
        <div className={`radar-pin pin-sw ${currentZoneId === 'zone_relations' ? 'pin-active' : ''}`} title="La Aguja de las Relaciones">
          🏛️
        </div>
        <div className={`radar-pin pin-se ${currentZoneId === 'zone_sanctum' ? 'pin-active' : ''}`} title="El Sanctum del Gran Custodio">
          👑
        </div>

        {/* Marcador del jugador en el centro */}
        <div className="radar-player-center" title="Tu posición en el mundo 3D">
          ⚔️
        </div>
      </div>
    </div>
  );
}
