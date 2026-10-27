import React from 'react';
import { ZONES } from '../data/gameData';

const RADAR_POSITIONS = {
  zone_bson: { top: '22%', left: '20%' },
  zone_mongoose: { top: '20%', left: '74%' },
  zone_relations: { top: '80%', left: '20%' },
  zone_sanctum: { top: '78%', left: '83%' },
  zone_document_hall: { top: '7%', left: '50%' },
  zone_bson_archive: { top: '34%', left: '91%' },
  zone_nested_garden: { top: '55%', left: '91%' },
  zone_dot_tower: { top: '92%', left: '68%' },
  zone_id_vault: { top: '92%', left: '34%' },
  zone_gridfs_gate: { top: '55%', left: '9%' }
};

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
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`radar-pin ${currentZoneId === zone.id ? 'pin-active' : ''}`}
            style={{ ...RADAR_POSITIONS[zone.id], '--zone-color': zone.color }}
            title={zone.name}
          >
            {zone.icon}
          </div>
        ))}

        {/* Marcador del jugador en el centro */}
        <div className="radar-player-center" title="Tu posición en el mundo 3D">
          ⚔️
        </div>
      </div>
    </div>
  );
}
