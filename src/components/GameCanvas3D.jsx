import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { NPCS } from '../data/gameData';
import { sound } from '../utils/audio';

// Crea una geometría de arco con secciones
function createArch(w, h, thick, depth) {
  const shape = new THREE.Shape();
  const half = w / 2;
  shape.moveTo(-half, 0);
  shape.lineTo(-half + thick, 0);
  shape.lineTo(-half + thick, h - half + thick);
  shape.absarc(0, h - half + thick, half - thick, Math.PI, 0, true);
  shape.lineTo(half - thick, 0);
  shape.lineTo(half, 0);
  shape.absarc(0, h - half + thick, half, 0, Math.PI, false);
  shape.lineTo(-half, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  return geo;
}

// Crea un personaje NPC articulado con proporciones realistas para cada zona
function createNPCMesh(zoneColor, isPlayer = false) {
  const group = new THREE.Group();
  const skinColor = isPlayer ? 0xf5c5a3 : 0xe8c49b;

  // --- CUERPO ---
  const torsoGeo = new THREE.CapsuleGeometry(0.28, 0.6, 8, 16);
  const clothMat = new THREE.MeshStandardMaterial({
    color: zoneColor,
    roughness: 0.6,
    metalness: 0.05,
  });
  const torso = new THREE.Mesh(torsoGeo, clothMat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // --- PELVIS / FALDA ---
  const skirtGeo = new THREE.CylinderGeometry(0.32, 0.44, 0.55, 16);
  const skirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(zoneColor).offsetHSL(0, 0, -0.12),
    roughness: 0.7,
  });
  const skirt = new THREE.Mesh(skirtGeo, skirtMat);
  skirt.position.y = 0.55;
  skirt.castShadow = true;
  group.add(skirt);

  // --- CUELLO ---
  const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.2, 12);
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.55,
    metalness: 0.0,
  });
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = 1.55;
  group.add(neck);

  // --- CABEZA (forma ovoide) ---
  const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
  headGeo.scale(1, 1.25, 1);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.87;
  head.castShadow = true;
  group.add(head);

  // --- OJOS (geometría simple) ---
  const eyeGeo = new THREE.SphereGeometry(0.038, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 0.3 });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  [-0.09, 0.09].forEach((x) => {
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), eyeWhiteMat);
    eyeWhite.position.set(x, 1.88, 0.19);
    group.add(eyeWhite);
    const pupil = new THREE.Mesh(eyeGeo, eyeMat);
    pupil.position.set(x, 1.88, 0.22);
    group.add(pupil);
  });

  // --- CABELLO ---
  const hairGeo = new THREE.SphereGeometry(0.235, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const hairMat = new THREE.MeshStandardMaterial({
    color: isPlayer ? 0x3b1f0a : 0x1a0a00,
    roughness: 0.8,
  });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.96;
  hair.rotation.x = -0.15;
  hair.castShadow = true;
  group.add(hair);

  // --- HOMBROS ---
  const shoulderGeo = new THREE.CapsuleGeometry(0.1, 0.05, 6, 8);
  [-0.38, 0.38].forEach((x) => {
    const s = new THREE.Mesh(shoulderGeo, clothMat);
    s.position.set(x, 1.35, 0);
    s.rotation.z = Math.PI / 2;
    s.castShadow = true;
    group.add(s);
  });

  // --- BRAZOS ARTICULADOS ---
  const upperArmGeo = new THREE.CapsuleGeometry(0.085, 0.3, 6, 8);
  const foreArmGeo = new THREE.CapsuleGeometry(0.075, 0.28, 6, 8);
  const handGeo = new THREE.SphereGeometry(0.08, 10, 10);

  const armMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(zoneColor).offsetHSL(0, -0.05, -0.05),
    roughness: 0.65,
  });

  const arms = [];
  [-1, 1].forEach((side, idx) => {
    const armGroup = new THREE.Group();
    armGroup.position.set(side * 0.4, 1.35, 0);

    const upper = new THREE.Mesh(upperArmGeo, armMat);
    upper.position.y = -0.2;
    upper.castShadow = true;
    armGroup.add(upper);

    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -0.46;
    const fore = new THREE.Mesh(foreArmGeo, armMat);
    fore.position.y = -0.15;
    fore.castShadow = true;
    forearmGroup.add(fore);

    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.y = -0.33;
    forearmGroup.add(hand);

    armGroup.add(forearmGroup);
    group.add(armGroup);
    arms.push({ group: armGroup, fore: forearmGroup, side });
  });

  // --- PIERNAS ARTICULADAS ---
  const thighGeo = new THREE.CapsuleGeometry(0.1, 0.34, 6, 8);
  const shinGeo = new THREE.CapsuleGeometry(0.088, 0.3, 6, 8);
  const footGeo = new THREE.BoxGeometry(0.1, 0.07, 0.24);

  const legMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(zoneColor).offsetHSL(0, 0, -0.2),
    roughness: 0.7,
  });
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x2d1a0e, roughness: 0.8 });

  const legs = [];
  [-0.14, 0.14].forEach((x, idx) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(x, 0.3, 0);

    const thigh = new THREE.Mesh(thighGeo, legMat);
    thigh.position.y = -0.22;
    thigh.castShadow = true;
    legGroup.add(thigh);

    const shinGroup = new THREE.Group();
    shinGroup.position.y = -0.52;
    const shin = new THREE.Mesh(shinGeo, legMat);
    shin.position.y = -0.16;
    shin.castShadow = true;
    shinGroup.add(shin);

    const foot = new THREE.Mesh(footGeo, bootMat);
    foot.position.set(0, -0.36, 0.06);
    foot.castShadow = true;
    shinGroup.add(foot);

    legGroup.add(shinGroup);
    group.add(legGroup);
    legs.push({ group: legGroup, shin: shinGroup });
  });

  return { group, torso, head, hair, arms, legs };
}

// Crea el modelo de personaje jugador con báculo detallado
function createPlayerMesh() {
  const { group, torso, head, hair, arms, legs } = createNPCMesh(0x1d4ed8, true);

  // Capa / Manto trasero
  const capeGeo = new THREE.PlaneGeometry(0.5, 0.7, 1, 4);
  const capeMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    side: THREE.DoubleSide,
    roughness: 0.8,
  });
  const cape = new THREE.Mesh(capeGeo, capeMat);
  cape.position.set(0, 1.1, -0.32);
  cape.rotation.x = 0.15;
  cape.castShadow = true;
  group.add(cape);

  // Báculo con cristal de gema brillante
  const staffGroup = new THREE.Group();
  staffGroup.position.set(0.42, 1.2, 0);

  const staffGeo = new THREE.CylinderGeometry(0.025, 0.035, 2.0, 10);
  const staffMat = new THREE.MeshStandardMaterial({
    color: 0x4a2c0a,
    roughness: 0.5,
    metalness: 0.2,
  });
  const staffMesh = new THREE.Mesh(staffGeo, staffMat);
  staffMesh.position.y = 1.0;
  staffMesh.castShadow = true;
  staffGroup.add(staffMesh);

  // Cabeza del báculo en forma de luna creciente
  const topGeo = new THREE.TorusGeometry(0.1, 0.025, 10, 20, Math.PI * 1.2);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.85,
  });
  const staffTop = new THREE.Mesh(topGeo, topMat);
  staffTop.position.y = 2.1;
  staffTop.rotation.z = Math.PI / 4;
  staffGroup.add(staffTop);

  const gemGeo = new THREE.OctahedronGeometry(0.1, 1);
  const gemMat = new THREE.MeshStandardMaterial({
    color: 0x00ffaa,
    emissive: 0x00cc88,
    emissiveIntensity: 1.8,
    roughness: 0.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.85,
  });
  const gem = new THREE.Mesh(gemGeo, gemMat);
  gem.position.y = 2.1;
  staffGroup.add(gem);

  const staffLight = new THREE.PointLight(0x00ffaa, 2.5, 6);
  staffLight.position.y = 2.1;
  staffGroup.add(staffLight);

  group.add(staffGroup);

  return { group, torso, head, hair, arms, legs, gem, cape };
}

// Construye el terreno con variaciones de altura procedurales
function buildTerrain(scene) {
  // Suelo base con textura procedural via Color
  const terrainGeo = new THREE.PlaneGeometry(120, 120, 60, 60);
  const positions = terrainGeo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const dist = Math.sqrt(x * x + z * z);
    // Suelo plano en el centro, ligero relieve en bordes
    if (dist > 18) {
      const bump =
        Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.6 +
        Math.sin(x * 0.07 + 1.2) * Math.sin(z * 0.09) * 1.2;
      positions.setZ(i, bump);
    }
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x1a2b1a,
    roughness: 0.95,
    metalness: 0.0,
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  scene.add(terrain);

  // Senderos de piedra — pavimento cuadrado
  const pathMat = new THREE.MeshStandardMaterial({
    color: 0x3d3d4f,
    roughness: 0.85,
    metalness: 0.05,
  });

  const createPath = (w, h, x, z, ry = 0) => {
    const geo = new THREE.BoxGeometry(w, 0.06, h, Math.max(1, Math.floor(w)), 1, Math.max(1, Math.floor(h)));
    const mesh = new THREE.Mesh(geo, pathMat);
    mesh.position.set(x, 0.01, z);
    mesh.rotation.y = ry;
    mesh.receiveShadow = true;
    scene.add(mesh);
  };

  createPath(4, 44, 0, 0);      // eje Z
  createPath(44, 4, 0, 0, 0);   // eje X

  // Losas individuales de piedra en el sendero (detalle)
  const slabGeo = new THREE.BoxGeometry(1.6, 0.05, 1.6);
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0x4a4a60,
    roughness: 0.9,
  });
  for (let i = -12; i <= 12; i += 2) {
    for (let j = -12; j <= 12; j += 2) {
      if (Math.abs(i) < 3 || Math.abs(j) < 3) {
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(i, 0.03, j);
        slab.rotation.y = (Math.random() - 0.5) * 0.08;
        slab.receiveShadow = true;
        scene.add(slab);
      }
    }
  }

  // Césped / hierba en los bordes
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x1f4a1a, roughness: 1.0 });
  for (let k = 0; k < 80; k++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 12 + Math.random() * 28;
    const bx = Math.cos(angle) * radius;
    const bz = Math.sin(angle) * radius;
    if (Math.abs(bx) > 3 && Math.abs(bz) > 3) {
      const h = 0.3 + Math.random() * 0.7;
      const patchGeo = new THREE.CylinderGeometry(0.05, 0.12, h, 4);
      const grass = new THREE.Mesh(patchGeo, grassMat);
      grass.position.set(bx, h / 2, bz);
      grass.rotation.y = Math.random() * Math.PI;
      scene.add(grass);
    }
  }
}

// Construye una roca decorativa detallada
function buildRock(scene, x, z, scale = 1) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const mat = new THREE.MeshStandardMaterial({
    color: 0x48505a,
    roughness: 0.9,
    metalness: 0.05,
  });

  [
    [0, 0, 0, scale * 0.8, scale * 0.6, scale * 0.7, 0],
    [scale * 0.35, 0, 0, scale * 0.5, scale * 0.4, scale * 0.5, 0.4],
    [-scale * 0.3, 0, scale * 0.2, scale * 0.4, scale * 0.35, scale * 0.45, -0.3],
  ].forEach(([rx, ry, rz, sx, sy, sz, rot]) => {
    const geo = new THREE.DodecahedronGeometry(0.9, 1);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(rx, sy * 0.5, rz);
    mesh.scale.set(sx, sy, sz);
    mesh.rotation.y = rot;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  scene.add(group);
}

// Árbol realista con tronco retorcido y follaje en capas
function buildTree(scene, x, z, seed = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x3d2b1a,
    roughness: 0.9,
    metalness: 0.0,
  });
  const foliageMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.3 + (seed % 5) * 0.01, 0.45, 0.18 + (seed % 3) * 0.04),
    roughness: 0.85,
  });

  // Tronco en capas con leve inclinación
  const trunkH = 2.8 + (seed % 4) * 0.4;
  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.28, trunkH, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = trunkH / 2;
  trunk.rotation.z = (seed % 5 - 2) * 0.04;
  trunk.castShadow = true;
  group.add(trunk);

  // 3 capas de follaje con tamaños decrecientes
  const foliageOffsets = [
    [0, trunkH + 0.6, 0, 2.1, 1.5, 2.0],
    [0, trunkH + 1.6, 0, 1.6, 1.2, 1.5],
    [0, trunkH + 2.5, 0, 1.1, 0.9, 1.0],
  ];
  foliageOffsets.forEach(([fx, fy, fz, sx, sy, sz]) => {
    const fGeo = new THREE.ConeGeometry(1, 1.8, 9);
    const fMesh = new THREE.Mesh(fGeo, foliageMat);
    fMesh.position.set(fx, fy, fz);
    fMesh.scale.set(sx, sy, sz);
    fMesh.castShadow = true;
    group.add(fMesh);
  });

  scene.add(group);
}

// Construye el altar de cada zona con arquitectura detallada
function buildZoneAltar(scene, zc) {
  const group = new THREE.Group();
  group.position.set(zc.x, 0, zc.z);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a3a,
    roughness: 0.88,
    metalness: 0.08,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: zc.color,
    emissive: zc.color,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    metalness: 0.5,
  });
  const glowMat = new THREE.MeshBasicMaterial({
    color: zc.color,
    transparent: true,
    opacity: 0.35,
  });

  // Plataforma central elevada
  const platGeo = new THREE.CylinderGeometry(4.5, 5.0, 0.4, 16);
  const plat = new THREE.Mesh(platGeo, stoneMat);
  plat.position.y = 0.2;
  plat.receiveShadow = true;
  plat.castShadow = true;
  group.add(plat);

  // Escalones de acceso (3 lados)
  [-1, 0, 1].forEach((offset) => {
    const stepGeo = new THREE.BoxGeometry(1.2, 0.14, 1.0);
    const step = new THREE.Mesh(stepGeo, stoneMat);
    step.position.set(offset * 1.25, 0.07, 5.0);
    step.receiveShadow = true;
    group.add(step);
  });

  // 4 Pilares con capiteles y bases
  const pillarOffsets = [[-3, -3], [3, -3], [-3, 3], [3, 3]];
  const orbs = [];
  pillarOffsets.forEach(([ox, oz]) => {
    // Base del pilar
    const baseGeo = new THREE.BoxGeometry(0.9, 0.25, 0.9);
    const base = new THREE.Mesh(baseGeo, stoneMat);
    base.position.set(ox, 0.32, oz);
    base.castShadow = true;
    group.add(base);

    // Fuste del pilar
    const shaftGeo = new THREE.CylinderGeometry(0.28, 0.32, 4.2, 12);
    const shaft = new THREE.Mesh(shaftGeo, stoneMat);
    shaft.position.set(ox, 2.5, oz);
    shaft.castShadow = true;
    group.add(shaft);

    // Capitel
    const capGeo = new THREE.BoxGeometry(0.82, 0.22, 0.82);
    const cap = new THREE.Mesh(capGeo, stoneMat);
    cap.position.set(ox, 4.71, oz);
    cap.castShadow = true;
    group.add(cap);

    // Borde de acento brillante en el pilar
    const accentGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.06, 12);
    const accent = new THREE.Mesh(accentGeo, accentMat);
    accent.position.set(ox, 2.5, oz);
    group.add(accent);

    // Orbe mágico flotante sobre cada pilar
    const orbGeo = new THREE.SphereGeometry(0.22, 20, 20);
    const orb = new THREE.Mesh(orbGeo, new THREE.MeshStandardMaterial({
      color: zc.color,
      emissive: zc.color,
      emissiveIntensity: 2.0,
      roughness: 0.0,
    }));
    orb.position.set(ox, 5.3, oz);
    group.add(orb);
    orbs.push(orb);

    // Halo difuso alrededor del orbe
    const haloGeo = new THREE.SphereGeometry(0.42, 14, 14);
    const halo = new THREE.Mesh(haloGeo, glowMat);
    halo.position.copy(orb.position);
    group.add(halo);
  });

  // Anillo de runas en el suelo
  const runeRingGeo = new THREE.RingGeometry(2.6, 3.2, 64);
  const runeRingMat = new THREE.MeshBasicMaterial({
    color: zc.color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55,
  });
  const runeRing = new THREE.Mesh(runeRingGeo, runeRingMat);
  runeRing.rotation.x = -Math.PI / 2;
  runeRing.position.y = 0.42;
  group.add(runeRing);

  // Luz puntual del altar
  const altarLight = new THREE.PointLight(zc.color, 3.5, 18);
  altarLight.position.set(0, 4.5, 0);
  group.add(altarLight);

  scene.add(group);
  return { group, orbs, runeRing };
}

// Crea un coleccionable con mayor detalle visual
function buildCollectible(scene, cp, idx) {
  const cGroup = new THREE.Group();
  cGroup.position.set(cp.x, 1.4, cp.z);

  let cMesh, lightColor;

  if (cp.type === 'scroll') {
    // Pergamino enrollado detallado
    const cGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.62, 14);
    const cMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.6,
      emissive: 0x92400e,
      emissiveIntensity: 0.4,
    });
    cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.rotation.x = Math.PI / 5;
    // Tapas del pergamino
    const capGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.07, 14);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5, metalness: 0.3 });
    [-0.315, 0.315].forEach((y) => {
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = y;
      cMesh.add(cap);
    });
    lightColor = 0xfbbf24;
  } else if (cp.type === 'rune') {
    // Runa: cristal hexagonal con grabado
    const cGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 6);
    const cMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.05,
      metalness: 0.0,
      transparent: true,
      opacity: 0.88,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
    });
    cMesh = new THREE.Mesh(cGeo, cMat);
    lightColor = 0xfbbf24;
  } else {
    // Cristal / Gema flotante facetada
    const cGeo = new THREE.OctahedronGeometry(0.28, 2);
    const cMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.0,
      metalness: 0.0,
      transparent: true,
      opacity: 0.80,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
    });
    cMesh = new THREE.Mesh(cGeo, cMat);
    lightColor = 0x38bdf8;
  }

  cMesh.castShadow = true;
  cGroup.add(cMesh);

  // Partículas flotantes alrededor del coleccionable
  const sparkGeo = new THREE.BufferGeometry();
  const sparkCount = 10;
  const sparks = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount * 3; i += 3) {
    const a = (i / sparkCount) * Math.PI * 2;
    sparks[i] = Math.cos(a) * 0.45;
    sparks[i + 1] = (Math.random() - 0.5) * 0.5;
    sparks[i + 2] = Math.sin(a) * 0.45;
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparks, 3));
  const sparkMat = new THREE.PointsMaterial({
    color: lightColor,
    size: 0.06,
    transparent: true,
    opacity: 0.9,
  });
  const sparksPoints = new THREE.Points(sparkGeo, sparkMat);
  cGroup.add(sparksPoints);

  const cLight = new THREE.PointLight(lightColor, 2.0, 5);
  cLight.position.y = 0.3;
  cGroup.add(cLight);

  scene.add(cGroup);
  return { id: `collectible_${idx}`, group: cGroup, mesh: cMesh, sparks: sparksPoints, type: cp.type, name: cp.name, collected: false };
}

// ===========================
// COMPONENTE PRINCIPAL
// ===========================
export default function GameCanvas3D({ player, onTalkNpc, onCollectItem, onZoneChange }) {
  const mountRef = useRef(null);
  const [nearbyPrompt, setNearbyPrompt] = useState(null);
  const [controlsHelp, setControlsHelp] = useState(true);

  const stateRef = useRef({
    keys: { w: false, a: false, s: false, d: false, shift: false },
    playerVelocity: new THREE.Vector3(),
    isGrounded: true,
    collectibles: [],
    npcObjects: [],
    activeZone: 'zone_bson',
    walkPhase: 0,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // ─── ESCENA ───────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060b1a);
    scene.fog = new THREE.FogExp2(0x060b1a, 0.018);

    // ─── CÁMARA ───────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 220);
    camera.position.set(0, 9, 17);

    // ─── RENDERER DE ALTA CALIDAD ─────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // ─── SKYBOX ESTRELLADO ────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 90 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = Math.abs(r * Math.cos(phi));
      starPos[i + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.28, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(starGeo, starMat));

    // ─── LUNA ─────────────────────────────────────────────────
    const moonGeo = new THREE.SphereGeometry(4.5, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xd4e4f7,
      emissive: 0xb0c8e8,
      emissiveIntensity: 0.6,
      roughness: 0.95,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-60, 70, -80);
    scene.add(moon);

    // ─── ILUMINACIÓN REALISTA ─────────────────────────────────
    // Luz de hemisferio (cielo nocturno azul + suelo oscuro)
    const hemi = new THREE.HemisphereLight(0x1a2a4a, 0x0a0f08, 0.9);
    scene.add(hemi);

    // Luna directional light (sombras largas azuladas)
    const moonLight = new THREE.DirectionalLight(0xb4cfe8, 1.4);
    moonLight.position.set(-20, 40, -25);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 110;
    const d = 40;
    moonLight.shadow.camera.left = -d;
    moonLight.shadow.camera.right = d;
    moonLight.shadow.camera.top = d;
    moonLight.shadow.camera.bottom = -d;
    moonLight.shadow.radius = 3;
    scene.add(moonLight);

    // Luz de relleno cálida suave
    const fillLight = new THREE.DirectionalLight(0x2a1a5a, 0.4);
    fillLight.position.set(15, 12, 8);
    scene.add(fillLight);

    // ─── TERRENO DETALLADO ────────────────────────────────────
    buildTerrain(scene);

    // Decoraciones del entorno
    const treePositions = [
      [-16, -20], [-22, -14], [-10, -26], [17, -18], [24, -14],
      [-18, 20], [-25, 14], [19, 20], [26, 26], [-28, 2], [28, -2],
      [-5, -28], [8, -30], [-30, -6], [30, 10], [3, 30],
    ];
    treePositions.forEach(([x, z], i) => buildTree(scene, x, z, i));

    const rockPositions = [
      [-13, -8, 1.1], [14, -10, 0.9], [-11, 12, 1.3], [13, 11, 0.8],
      [-20, 0, 1.5], [20, -2, 1.2], [-8, -20, 0.9], [10, 22, 1.0],
    ];
    rockPositions.forEach(([x, z, s]) => buildRock(scene, x, z, s));

    // ─── ALTARES DE ZONA ──────────────────────────────────────
    const zoneConfigs = [
      { id: 'zone_bson',      name: 'Valle de los Documentos',       x: -16, z: -14, color: 0x10b981, npcId: 'npc_bsonia' },
      { id: 'zone_mongoose',  name: 'La Forja de Esquemas',          x: 16,  z: -14, color: 0xf59e0b, npcId: 'npc_schemiel' },
      { id: 'zone_relations', name: 'La Aguja de las Relaciones',     x: -16, z: 14,  color: 0x38bdf8, npcId: 'npc_relatia' },
      { id: 'zone_sanctum',   name: 'El Sanctum del Gran Custodio',  x: 16,  z: 14,  color: 0xa855f7, npcId: 'npc_atlas' },
    ];

    const altarObjects = zoneConfigs.map((zc) => buildZoneAltar(scene, zc));

    // ─── NPCs ARTICULADOS ─────────────────────────────────────
    const npcColors = {
      npc_bsonia:   0x10b981,
      npc_schemiel: 0xf59e0b,
      npc_relatia:  0x38bdf8,
      npc_atlas:    0xa855f7,
    };

    const npcMeshes = zoneConfigs.map((zc) => {
      const npcData = createNPCMesh(npcColors[zc.npcId]);
      npcData.group.position.set(zc.x, 0.42, zc.z - 1.5);
      scene.add(npcData.group);

      // Marcador flotante (aura de misión)
      const markerGeo = new THREE.TorusGeometry(0.22, 0.06, 10, 28);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(zc.x, 3.8, zc.z - 1.5);
      marker.rotation.x = -Math.PI / 2;
      scene.add(marker);

      // Luz NPC propia
      const npcLight = new THREE.PointLight(zc.color, 1.2, 8);
      npcLight.position.set(zc.x, 1.5, zc.z - 1.5);
      scene.add(npcLight);

      return {
        id: zc.npcId,
        name: NPCS[zc.npcId]?.name,
        title: NPCS[zc.npcId]?.title,
        zoneId: zc.id,
        group: npcData.group,
        arms: npcData.arms,
        legs: npcData.legs,
        marker,
        worldPos: new THREE.Vector3(zc.x, 0, zc.z - 1.5),
      };
    });

    stateRef.current.npcObjects = npcMeshes;

    // ─── COLECCIONABLES ───────────────────────────────────────
    const collectibleDefs = [
      { x: -5,  z: -5,  type: 'scroll',  name: 'Fragmento BSON Arcano' },
      { x: 5,   z: -6,  type: 'rune',    name: 'Runa de Validación Mongoose' },
      { x: -6,  z: 6,   type: 'crystal', name: 'Cristal de Referencia ObjectId' },
      { x: 6,   z: 6,   type: 'scroll',  name: 'Códice Perdido de CRUD' },
      { x: 0,   z: -12, type: 'rune',    name: 'Sello de Esquema' },
      { x: -12, z: 0,   type: 'crystal', name: 'Nodo de Poblado .populate' },
    ];
    stateRef.current.collectibles = collectibleDefs.map((cp, idx) => buildCollectible(scene, cp, idx));

    // ─── PERSONAJE JUGADOR ────────────────────────────────────
    const playerData = createPlayerMesh();
    const playerGroup = playerData.group;
    playerGroup.position.set(0, 0.42, 5);
    scene.add(playerGroup);

    // ─── CONTROLES ────────────────────────────────────────────
    const nearbyRef = { current: null };

    const handleKeyDown = (e) => {
      const k = e.key;
      if (k === 'w' || k === 'W' || k === 'ArrowUp')    stateRef.current.keys.w = true;
      if (k === 's' || k === 'S' || k === 'ArrowDown')  stateRef.current.keys.s = true;
      if (k === 'a' || k === 'A' || k === 'ArrowLeft')  stateRef.current.keys.a = true;
      if (k === 'd' || k === 'D' || k === 'ArrowRight') stateRef.current.keys.d = true;
      if (k === 'Shift') stateRef.current.keys.shift = true;
      if (k === ' ') {
        if (stateRef.current.isGrounded) {
          stateRef.current.playerVelocity.y = 6.2;
          stateRef.current.isGrounded = false;
          sound.playSelect();
        }
      }
      if (k === 'e' || k === 'E') {
        if (nearbyRef.current) {
          sound.playSelect();
          onTalkNpc(nearbyRef.current.npcId);
        }
      }
      if (k === 'h' || k === 'H') setControlsHelp((prev) => !prev);
    };

    const handleKeyUp = (e) => {
      const k = e.key;
      if (k === 'w' || k === 'W' || k === 'ArrowUp')    stateRef.current.keys.w = false;
      if (k === 's' || k === 'S' || k === 'ArrowDown')  stateRef.current.keys.s = false;
      if (k === 'a' || k === 'A' || k === 'ArrowLeft')  stateRef.current.keys.a = false;
      if (k === 'd' || k === 'D' || k === 'ArrowRight') stateRef.current.keys.d = false;
      if (k === 'Shift') stateRef.current.keys.shift = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ─── LOOP DE ANIMACIÓN ────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Animación de altares
      altarObjects.forEach((ao, i) => {
        ao.orbs.forEach((orb, j) => {
          orb.position.y = 5.3 + Math.sin(t * 1.8 + j * 0.8 + i) * 0.18;
          orb.rotation.y = t * 0.8;
        });
        ao.runeRing.rotation.z = t * 0.4 * (i % 2 === 0 ? 1 : -1);
      });

      // Animación de NPCs (idle: balanceo suave)
      npcMeshes.forEach((npc, i) => {
        const phase = t * 1.2 + i * 1.4;
        npc.group.rotation.y = Math.sin(t * 0.3 + i) * 0.15;
        npc.arms[0].group.rotation.z = 0.2 + Math.sin(phase) * 0.1;
        npc.arms[1].group.rotation.z = -(0.2 + Math.sin(phase + Math.PI) * 0.1);
        npc.marker.position.y = 3.8 + Math.sin(t * 2.5 + i) * 0.18;
        npc.marker.rotation.z = t * 1.5;
      });

      // Animación de coleccionables
      stateRef.current.collectibles.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y = t * 2.2;
          c.group.position.y = 1.4 + Math.sin(t * 2.5) * 0.22;
          c.sparks.rotation.y = t * 1.5;
          const distToPlayer = playerGroup.position.distanceTo(c.group.position);
          if (distToPlayer < 1.5) {
            c.collected = true;
            c.group.visible = false;
            sound.playSuccess();
            onCollectItem(c);
          }
        }
      });

      // ─── MOVIMIENTO DEL JUGADOR ───────────────────────────
      const keys = stateRef.current.keys;
      const speed = keys.shift ? 10 : 6;
      const move = new THREE.Vector3();
      if (keys.w) move.z -= 1;
      if (keys.s) move.z += 1;
      if (keys.a) move.x -= 1;
      if (keys.d) move.x += 1;

      const isMoving = move.lengthSq() > 0;

      if (isMoving) {
        move.normalize();
        const targetRot = Math.atan2(move.x, move.z);
        playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, targetRot, 12 * delta);
        playerGroup.position.x += move.x * speed * delta;
        playerGroup.position.z += move.z * speed * delta;

        // Animación de caminar: oscilación de brazos y piernas
        stateRef.current.walkPhase += delta * speed * 3.5;
        const wp = stateRef.current.walkPhase;
        const swingAmp = 0.55;
        playerData.legs[0].group.rotation.x = Math.sin(wp) * swingAmp;
        playerData.legs[1].group.rotation.x = Math.sin(wp + Math.PI) * swingAmp;
        playerData.legs[0].shin.rotation.x = Math.max(0, -Math.sin(wp) * 0.4);
        playerData.legs[1].shin.rotation.x = Math.max(0, -Math.sin(wp + Math.PI) * 0.4);

        playerData.arms[0].group.rotation.x = Math.sin(wp + Math.PI) * 0.45;
        playerData.arms[1].group.rotation.x = Math.sin(wp) * 0.45;

        // Cuerpo levemente inclinado hacia adelante
        playerData.torso.rotation.x = 0.08;
      } else {
        // Idle: respiración
        playerData.torso.rotation.x = 0;
        playerData.torso.position.y = 1.1 + Math.sin(t * 1.5) * 0.02;
        playerData.head.position.y = 1.87 + Math.sin(t * 1.5 + 0.3) * 0.015;
        playerData.arms[0].group.rotation.x = Math.sin(t * 1.4) * 0.06;
        playerData.arms[1].group.rotation.x = Math.sin(t * 1.4 + 0.5) * 0.06;
        playerData.legs[0].group.rotation.x = 0;
        playerData.legs[1].group.rotation.x = 0;
      }

      // Gema del báculo pulsa
      if (playerData.gem) {
        playerData.gem.rotation.y = t * 2.5;
        playerData.gem.scale.setScalar(1 + Math.sin(t * 4) * 0.06);
      }

      // Gravedad y salto
      if (!stateRef.current.isGrounded) {
        stateRef.current.playerVelocity.y -= 20 * delta;
        playerGroup.position.y += stateRef.current.playerVelocity.y * delta;
        if (playerGroup.position.y <= 0.42) {
          playerGroup.position.y = 0.42;
          stateRef.current.playerVelocity.y = 0;
          stateRef.current.isGrounded = true;
        }
      }

      playerGroup.position.x = THREE.MathUtils.clamp(playerGroup.position.x, -38, 38);
      playerGroup.position.z = THREE.MathUtils.clamp(playerGroup.position.z, -38, 38);

      // ─── CÁMARA TERCERA PERSONA ───────────────────────────
      const camOffset = new THREE.Vector3(0, 8.5, 14.5);
      const idealCam = playerGroup.position.clone().add(camOffset);
      camera.position.lerp(idealCam, 6 * delta);
      camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.6, playerGroup.position.z);

      // ─── DETECCIÓN DE NPC CERCANO ─────────────────────────
      let closest = null;
      let minDist = 5.0;
      npcMeshes.forEach((npc) => {
        const d = playerGroup.position.distanceTo(npc.worldPos);
        if (d < minDist) { closest = npc; minDist = d; }
      });

      nearbyRef.current = closest ? { npcId: closest.id, name: closest.name, title: closest.title, zoneId: closest.zoneId } : null;
      setNearbyPrompt(nearbyRef.current);

      // Detección de zona activa
      zoneConfigs.forEach((zc) => {
        const d = playerGroup.position.distanceTo(new THREE.Vector3(zc.x, 0, zc.z));
        if (d < 9 && stateRef.current.activeZone !== zc.id) {
          stateRef.current.activeZone = zc.id;
          onZoneChange(zc.id);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="canvas-3d-wrapper" ref={mountRef}>
      {nearbyPrompt && (
        <div className="prompt-3d-interact">
          <div className="prompt-key-badge">E</div>
          <div className="prompt-text-group">
            <span className="prompt-main">Hablar con {nearbyPrompt.name}</span>
            <span className="prompt-sub">{nearbyPrompt.title}</span>
          </div>
          <button className="btn-talk-touch" onClick={() => { sound.playSelect(); onTalkNpc(nearbyPrompt.npcId); }}>
            Hablar
          </button>
        </div>
      )}

      <div className={`controls-3d-legend ${controlsHelp ? 'legend-visible' : 'legend-collapsed'}`}>
        <div className="legend-header" onClick={() => setControlsHelp((prev) => !prev)}>
          <span>🎮 Controles 3D</span>
          <span className="legend-toggle">{controlsHelp ? '▲' : '▼'}</span>
        </div>
        {controlsHelp && (
          <div className="legend-body">
            <div className="legend-row"><span className="key-tag">W</span><span className="key-tag">A</span><span className="key-tag">S</span><span className="key-tag">D</span><span>Moverse por el reino</span></div>
            <div className="legend-row"><span className="key-tag">Shift</span><span>Correr</span></div>
            <div className="legend-row"><span className="key-tag">Espacio</span><span>Saltar</span></div>
            <div className="legend-row"><span className="key-tag">E</span><span>Interactuar con Sabios</span></div>
            <div className="legend-row"><span className="key-tag">H</span><span>Ocultar esta guía</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
