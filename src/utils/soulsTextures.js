import * as THREE from 'three';

/**
 * Genera texturas procedurales optimizadas para la estética Dark Souls 3 (Irithyll)
 */

// Textura de adoquines / losas de piedra gótica con toques de escarcha/nieve
export function createCobblestoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Fondo base de mortero oscuro
  ctx.fillStyle = '#0a0d12';
  ctx.fillRect(0, 0, 512, 512);

  // Cuadrícula de losas / adoquines irregulares
  const rows = 16;
  const cols = 16;
  const rw = 512 / cols;
  const rh = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = (r % 2) * (rw * 0.5);
      const x = ((c * rw + offsetX) % 512);
      const y = r * rh;
      const pad = 3;

      // Color de piedra variable (pizarras frías, carbón, granito húmedo)
      const brightness = Math.floor(25 + Math.random() * 25);
      const coolTint = Math.floor(Math.random() * 8);
      ctx.fillStyle = `rgb(${brightness}, ${brightness + coolTint}, ${brightness + coolTint + 10})`;
      
      // Rectángulo con esquinas ligeramente redondeadas
      const stoneW = rw - pad * 2;
      const stoneH = rh - pad * 2;
      ctx.beginPath();
      ctx.rect(x + pad, y + pad, stoneW, stoneH);
      ctx.fill();

      // Ruido de grano de piedra
      for (let k = 0; k < 12; k++) {
        const nx = x + pad + Math.random() * stoneW;
        const ny = y + pad + Math.random() * stoneH;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.18)';
        ctx.fillRect(nx, ny, 2, 2);
      }

      // Toques sutiles de escarcha / nieve en los bordes superiores (como en Irithyll)
      if (Math.random() > 0.45) {
        ctx.fillStyle = 'rgba(180, 205, 230, 0.18)';
        ctx.fillRect(x + pad, y + pad, stoneW, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

// Textura de muros de piedra y sillería gótica
export function createGothicStoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#10141b';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 24;
  const cols = 8;
  const rw = 512 / cols;
  const rh = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const shift = (r % 2 === 0) ? 0 : rw * 0.5;
    for (let c = -1; c <= cols; c++) {
      const x = c * rw + shift;
      const y = r * rh;
      const pad = 2;

      const baseVal = Math.floor(28 + Math.random() * 20);
      ctx.fillStyle = `rgb(${baseVal}, ${baseVal + 2}, ${baseVal + 8})`;
      ctx.fillRect(x + pad, y + pad, rw - pad * 2, rh - pad * 2);

      // Líneas de relieve de sillería
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(x + pad, y + rh - 1, rw - pad * 2, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(x + pad, y + pad, rw - pad * 2, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  return texture;
}

// Textura de rosetón gótico / vidriera iluminada
export function createRoseWindowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const cx = 128;
  const cy = 128;
  const r = 115;

  // Fondo oscuro
  ctx.fillStyle = '#060a10';
  ctx.fillRect(0, 0, 256, 256);

  // Resplandor cálido interior (luz ámbar/dorada desde dentro de la catedral)
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
  grad.addColorStop(0, '#ffcc66');
  grad.addColorStop(0.4, '#e68a00');
  grad.addColorStop(0.75, '#4a2c10');
  grad.addColorStop(1, '#101520');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Tracerías góticas de piedra (círculos y pétalos concéntricos)
  ctx.strokeStyle = '#0a0d14';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Pétalos radiales
  const petals = 12;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.stroke();

    const midA = angle + Math.PI / petals;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(midA) * (r * 0.65), cy + Math.sin(midA) * (r * 0.65), r * 0.25, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Círculo central con símbolo de hoja MongoDB / gótico
  ctx.fillStyle = '#10141a';
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Textura de escudo de caballero (Heater Shield)
export function createKnightShieldTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  // Fondo de acero oscuro pavonado
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(0, 0, 256, 384);

  // Borde de bronce / latón envejecido
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#8a6e38';
  ctx.strokeRect(7, 7, 242, 370);

  // Borde interior fino
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(18, 18, 220, 348);

  // Cruz heráldica o emblema de hoja MongoDB estilizado
  ctx.fillStyle = '#8a1f1f';
  ctx.fillRect(118, 20, 20, 344);
  ctx.fillRect(20, 140, 216, 20);

  // Escudo central
  ctx.fillStyle = '#10141a';
  ctx.beginPath();
  ctx.arc(128, 150, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Emblema sagrado central
  ctx.fillStyle = '#10b981'; // Verde hoja esmeralda arcana
  ctx.beginPath();
  ctx.ellipse(128, 150, 16, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
