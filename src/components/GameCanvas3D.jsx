import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { NPCS } from '../data/gameData';
import { sound } from '../utils/audio';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  createCobblestoneTexture,
  createGothicStoneTexture,
  createRoseWindowTexture,
  createKnightShieldTexture
} from '../utils/soulsTextures';

// ============================================================================
// GEOMETRÍAS Y ELEMENTOS ARQUITECTÓNICOS GÓTICOS (ESTILO DARK SOULS 3 / IRITHYLL)
// ============================================================================

// Crea un arco ojival gótico apuntado
function createPointedArch(w, h, thick, depth) {
  const shape = new THREE.Shape();
  const half = w / 2;
  const radius = w * 0.78;

  shape.moveTo(-half, 0);
  shape.lineTo(-half + thick, 0);
  shape.lineTo(-half + thick, h * 0.4);

  // Curva interior ojival
  shape.quadraticCurveTo(-half + thick, h * 0.8, 0, h - thick);
  shape.quadraticCurveTo(half - thick, h * 0.8, half - thick, h * 0.4);

  shape.lineTo(half - thick, 0);
  shape.lineTo(half, 0);
  shape.lineTo(half, h * 0.4);

  // Curva exterior ojival
  shape.quadraticCurveTo(half, h * 0.85, 0, h);
  shape.quadraticCurveTo(-half, h * 0.85, -half, h * 0.4);
  shape.lineTo(-half, 0);

  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
}

// Crea una farola gótica de hierro forjado con farol y fuego ámbar
function createGothicStreetLamp(scene, x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x1b2028,
    roughness: 0.65,
    metalness: 0.8,
  });

  // Base de piedra y poste de hierro
  const baseGeo = new THREE.CylinderGeometry(0.32, 0.42, 0.6, 8);
  const base = new THREE.Mesh(baseGeo, ironMat);
  base.position.y = 0.3;
  base.castShadow = true;
  group.add(base);

  const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.2, 8);
  const pole = new THREE.Mesh(poleGeo, ironMat);
  pole.position.y = 2.4;
  pole.castShadow = true;
  group.add(pole);

  // Brazo curvo decorativo
  const armGeo = new THREE.TorusGeometry(0.35, 0.04, 6, 12, Math.PI * 0.7);
  const arm = new THREE.Mesh(armGeo, ironMat);
  arm.position.set(0.2, 4.3, 0);
  arm.rotation.z = -Math.PI / 4;
  group.add(arm);

  // Farol hexagonal de hierro con cristal cálido
  const lanternGeo = new THREE.CylinderGeometry(0.22, 0.15, 0.5, 6);
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xffbb44,
    emissive: 0xff8811,
    emissiveIntensity: 1.6,
    roughness: 0.2,
  });
  const lantern = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.set(0.35, 4.0, 0);
  group.add(lantern);

  // Tejadillo del farol
  const capGeo = new THREE.ConeGeometry(0.28, 0.25, 6);
  const cap = new THREE.Mesh(capGeo, ironMat);
  cap.position.set(0.35, 4.35, 0);
  group.add(cap);

  // Luz puntual cálida de farola (antorcha/farol ámbar Dark Souls)
  const lampLight = new THREE.PointLight(0xff8c20, 2.2, 14, 1.4);
  lampLight.position.set(0.35, 4.0, 0);
  group.add(lampLight);

  scene.add(group);
  return lampLight;
}

// Crea una gran torre o aguja gótica de Irithyll con tejado cónico y molduras
function createGothicSpire(scene, x, z, scale = 1, rotation = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.scale.set(scale, scale, scale);
  group.rotation.y = rotation;

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x222934,
    roughness: 0.88,
    metalness: 0.15,
  });
  const slateMat = new THREE.MeshStandardMaterial({
    color: 0x141822,
    roughness: 0.6,
    metalness: 0.2,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x303848,
    roughness: 0.75,
    metalness: 0.2,
  });

  // Base cuadrada maciza
  const baseGeo = new THREE.BoxGeometry(4.8, 8, 4.8);
  const base = new THREE.Mesh(baseGeo, stoneMat);
  base.position.y = 4;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Cornisa de transición
  const corniceGeo = new THREE.BoxGeometry(5.2, 0.6, 5.2);
  const cornice = new THREE.Mesh(corniceGeo, accentMat);
  cornice.position.y = 8.3;
  group.add(cornice);

  // Cuerpo octogonal superior de la torre
  const towerGeo = new THREE.CylinderGeometry(2.1, 2.3, 14, 8);
  const tower = new THREE.Mesh(towerGeo, stoneMat);
  tower.position.y = 15.3;
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  // Arcos y ventanas ojivales góticas en los 4 costados
  const archMat = new THREE.MeshBasicMaterial({ color: 0x06090e });
  [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((rot) => {
    const windowGeo = new THREE.PlaneGeometry(0.9, 3.2);
    const win = new THREE.Mesh(windowGeo, archMat);
    win.position.set(Math.sin(rot) * 2.15, 17, Math.cos(rot) * 2.15);
    win.rotation.y = rot;
    group.add(win);
  });

  // Balcón / Mirador gótico con almenas
  const balcGeo = new THREE.CylinderGeometry(2.5, 2.3, 1.0, 8);
  const balc = new THREE.Mesh(balcGeo, accentMat);
  balc.position.y = 22.8;
  group.add(balc);

  // Aguja cónica empinada típica de Irithyll
  const spireGeo = new THREE.ConeGeometry(2.2, 16, 8);
  const spire = new THREE.Mesh(spireGeo, slateMat);
  spire.position.y = 31.3;
  spire.castShadow = true;
  group.add(spire);

  // Pináculo y cruz o remate superior
  const finialGeo = new THREE.OctahedronGeometry(0.35, 1);
  const finialMat = new THREE.MeshStandardMaterial({ color: 0x8a9aa8, roughness: 0.3, metalness: 0.8 });
  const finial = new THREE.Mesh(finialGeo, finialMat);
  finial.position.y = 39.5;
  group.add(finial);

  scene.add(group);
  return group;
}

// Gran Catedral Gótica de fondo (silueta monumental de Irithyll)
function buildGrandCathedral(scene) {
  const catGroup = new THREE.Group();
  catGroup.position.set(0, 0, -42);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    roughness: 0.9,
    metalness: 0.12,
  });
  const slateMat = new THREE.MeshStandardMaterial({
    color: 0x121720,
    roughness: 0.7,
  });

  // Nave principal colosal
  const naveGeo = new THREE.BoxGeometry(26, 22, 18);
  const nave = new THREE.Mesh(naveGeo, stoneMat);
  nave.position.y = 11;
  nave.castShadow = true;
  nave.receiveShadow = true;
  catGroup.add(nave);

  // Tejado a dos aguas empinado
  const roofGeo = new THREE.ConeGeometry(17, 10, 4);
  roofGeo.rotateY(Math.PI / 4);
  roofGeo.scale(1.2, 1, 0.75);
  const roof = new THREE.Mesh(roofGeo, slateMat);
  roof.position.y = 27;
  roof.castShadow = true;
  catGroup.add(roof);

  // Rosetón gótico iluminado desde dentro
  const roseTex = createRoseWindowTexture();
  const roseGeo = new THREE.CircleGeometry(4.2, 32);
  const roseMat = new THREE.MeshBasicMaterial({
    map: roseTex,
    transparent: true,
  });
  const rose = new THREE.Mesh(roseGeo, roseMat);
  rose.position.set(0, 14.5, 9.1);
  catGroup.add(rose);

  // Luz cálida tenue que emana del rosetón
  const cathedralLight = new THREE.PointLight(0xff9933, 2.5, 25);
  cathedralLight.position.set(0, 14.5, 11);
  catGroup.add(cathedralLight);

  // Gran portal ojival en la entrada
  const portalArchGeo = createPointedArch(6.5, 9.5, 0.8, 1.2);
  const portalArch = new THREE.Mesh(portalArchGeo, stoneMat);
  portalArch.position.set(0, 0, 9.2);
  catGroup.add(portalArch);

  // Interior oscuro del portal
  const portalBack = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 8.5), new THREE.MeshBasicMaterial({ color: 0x05070a }));
  portalBack.position.set(0, 4.25, 9.1);
  catGroup.add(portalBack);

  // Contrafuertes y arbotantes laterales (flying buttresses)
  [-11, 11].forEach((bx) => {
    const buttressGeo = new THREE.BoxGeometry(2.0, 18, 3.5);
    const buttress = new THREE.Mesh(buttressGeo, stoneMat);
    buttress.position.set(bx, 9, 8.5);
    buttress.castShadow = true;
    catGroup.add(buttress);

    const pinGeo = new THREE.ConeGeometry(1.2, 4.5, 4);
    pinGeo.rotateY(Math.PI / 4);
    const pin = new THREE.Mesh(pinGeo, slateMat);
    pin.position.set(bx, 20, 8.5);
    catGroup.add(pin);
  });

  scene.add(catGroup);

  // Dos agujas colosales gemelas flanqueando la catedral
  createGothicSpire(scene, -18, -42, 1.25, 0);
  createGothicSpire(scene, 18, -42, 1.25, 0.2);

  // Torres perimetrales que cierran el horizonte gótico como en Irithyll
  createGothicSpire(scene, -34, -28, 1.0, 0.4);
  createGothicSpire(scene, 34, -28, 1.0, -0.3);
  createGothicSpire(scene, -38, 0, 0.9, 0.1);
  createGothicSpire(scene, 38, 0, 0.9, -0.2);
  createGothicSpire(scene, -32, 28, 1.1, 0.5);
  createGothicSpire(scene, 32, 28, 1.1, -0.4);
}

// Muros perimetrales y balaustradas de piedra gótica con almenas
function buildGothicCourtyardWalls(scene) {
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x222a36,
    roughness: 0.92,
    metalness: 0.1,
  });

  // Muros almenados en el perímetro del patio
  const createWallSegment = (x, z, length, rot = 0) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rot;

    const wallGeo = new THREE.BoxGeometry(length, 3.5, 1.4);
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 1.75;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    // Almenas góticas superiores
    const merlonCount = Math.floor(length / 2.2);
    for (let i = 0; i < merlonCount; i++) {
      const mx = -length / 2 + 1.1 + i * 2.2;
      const merlonGeo = new THREE.BoxGeometry(1.2, 0.9, 1.5);
      const merlon = new THREE.Mesh(merlonGeo, wallMat);
      merlon.position.set(mx, 3.95, 0);
      merlon.castShadow = true;
      group.add(merlon);
    }

    scene.add(group);
  };

  createWallSegment(0, -32, 48, 0);       // Fondo norte
  createWallSegment(-30, 0, 60, Math.PI / 2); // Flanco oeste
  createWallSegment(30, 0, 60, -Math.PI / 2); // Flanco este
  createWallSegment(0, 32, 48, Math.PI);    // Frente sur

  // Balaustradas de piedra en la plaza central (como en la plaza de Irithyll del screenshot)
  const balustradeMat = new THREE.MeshStandardMaterial({ color: 0x364050, roughness: 0.85 });
  const createBalustrade = (x, z, len, rot = 0) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rot;

    const railGeo = new THREE.BoxGeometry(len, 0.22, 0.45);
    const topRail = new THREE.Mesh(railGeo, balustradeMat);
    topRail.position.y = 1.1;
    group.add(topRail);

    const baseRail = new THREE.Mesh(railGeo, balustradeMat);
    baseRail.position.y = 0.2;
    group.add(baseRail);

    // Balaustres individuales
    const count = Math.floor(len / 0.7);
    for (let i = 0; i < count; i++) {
      const bx = -len / 2 + 0.35 + i * 0.7;
      const balusterGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6);
      const baluster = new THREE.Mesh(balusterGeo, balustradeMat);
      baluster.position.set(bx, 0.65, 0);
      group.add(baluster);
    }

    // Pilares en extremos con remates / urnas de piedra
    [-len / 2, len / 2].forEach((px) => {
      const postGeo = new THREE.BoxGeometry(0.55, 1.35, 0.55);
      const post = new THREE.Mesh(postGeo, balustradeMat);
      post.position.set(px, 0.675, 0);
      group.add(post);

      const urnGeo = new THREE.DodecahedronGeometry(0.22);
      const urn = new THREE.Mesh(urnGeo, balustradeMat);
      urn.position.set(px, 1.5, 0);
      group.add(urn);
    });

    scene.add(group);
  };

  createBalustrade(-10, -18, 14, 0);
  createBalustrade(10, -18, 14, 0);
  createBalustrade(-18, 10, 14, Math.PI / 2);
  createBalustrade(18, 10, 14, Math.PI / 2);
}

// Terreno adoquinado y plazas góticas con adoquines y escarcha
function buildSoulsCourtyardGround(scene) {
  const cobbleTex = createCobblestoneTexture();

  // Suelo principal del patio con textura de adoquines húmedos
  const groundGeo = new THREE.PlaneGeometry(100, 100, 40, 40);
  const groundMat = new THREE.MeshStandardMaterial({
    map: cobbleTex,
    color: 0x5a6878,
    roughness: 0.75,
    metalness: 0.25,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // Plataformas elevadas y escalinatas de piedra gótica (multi-nivel como en Irithyll)
  const stepMat = new THREE.MeshStandardMaterial({
    color: 0x2d3644,
    roughness: 0.85,
    metalness: 0.15,
  });

  // Escalinatas centrales que descienden a la plaza
  for (let s = 0; s < 4; s++) {
    const stepGeo = new THREE.BoxGeometry(16 - s * 1.5, 0.2, 1.2);
    const step = new THREE.Mesh(stepGeo, stepMat);
    step.position.set(0, (3 - s) * 0.2, -10 - s * 1.0);
    step.receiveShadow = true;
    step.castShadow = true;
    scene.add(step);
  }

  // Farolas de hierro góticas a lo largo del patio
  const lampPositions = [
    [-8, -8], [8, -8],
    [-18, 4], [18, 4],
    [-6, 18], [6, 18],
    [-22, -18], [22, -18],
  ];
  lampPositions.forEach(([lx, lz]) => createGothicStreetLamp(scene, lx, lz));
}

// ============================================================================
// HOGUERA DARK SOULS (BONFIRE) CON ESPADA EN ESPIRAL Y BRASAS ACTIVAS
// ============================================================================
function buildSoulsBonfire(scene, zc) {
  const group = new THREE.Group();
  group.position.set(zc.x, 0, zc.z);

  // 1. Base / Montículo de cenizas oscuras y huesos
  const ashMat = new THREE.MeshStandardMaterial({
    color: 0x1b1c20,
    roughness: 0.95,
  });
  const ashGeo = new THREE.ConeGeometry(1.6, 0.45, 12);
  const ashMesh = new THREE.Mesh(ashGeo, ashMat);
  ashMesh.position.y = 0.2;
  ashMesh.receiveShadow = true;
  group.add(ashMesh);

  // Piedras calcinadas rodeando la hoguera
  const emberStoneMat = new THREE.MeshStandardMaterial({
    color: 0x221812,
    roughness: 0.9,
  });
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const r = 1.4 + (Math.random() - 0.5) * 0.25;
    const rockGeo = new THREE.DodecahedronGeometry(0.24, 0);
    const rock = new THREE.Mesh(rockGeo, emberStoneMat);
    rock.position.set(Math.cos(angle) * r, 0.15, Math.sin(angle) * r);
    rock.scale.set(1.2, 0.8, 1.1);
    rock.castShadow = true;
    group.add(rock);
  }

  // 2. La emblemática Espada en Espiral (Coiled Sword) clavada en las cenizas
  const swordGroup = new THREE.Group();
  swordGroup.position.set(0, 0.2, 0);
  swordGroup.rotation.z = 0.18; // Clavada inclinada
  swordGroup.rotation.y = Math.PI / 4;

  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0x2a1a12,
    emissive: 0x992200,
    emissiveIntensity: 0.8,
    roughness: 0.4,
    metalness: 0.7,
  });

  // Hoja retorcida en espiral
  const bladeGeo = new THREE.CylinderGeometry(0.045, 0.09, 1.7, 6, 16);
  // Efecto espiral en los vértices de la espada
  const bPos = bladeGeo.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const y = bPos.getY(i);
    const angle = y * 4.0;
    const x = bPos.getX(i);
    const z = bPos.getZ(i);
    bPos.setX(i, x * Math.cos(angle) - z * Math.sin(angle));
    bPos.setZ(i, x * Math.sin(angle) + z * Math.cos(angle));
  }
  bladeGeo.computeVertexNormals();
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.y = 0.9;
  blade.castShadow = true;
  swordGroup.add(blade);

  // Guarda y pomo de hierro de la espada
  const guardGeo = new THREE.BoxGeometry(0.44, 0.07, 0.12);
  const guardMat = new THREE.MeshStandardMaterial({ color: 0x1f1f26, metalness: 0.85, roughness: 0.3 });
  const guard = new THREE.Mesh(guardGeo, guardMat);
  guard.position.y = 1.76;
  swordGroup.add(guard);

  const hiltGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.4, 8);
  const hilt = new THREE.Mesh(hiltGeo, guardMat);
  hilt.position.y = 1.98;
  swordGroup.add(hilt);

  const pommelGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const pommel = new THREE.Mesh(pommelGeo, guardMat);
  pommel.position.y = 2.2;
  swordGroup.add(pommel);

  group.add(swordGroup);

  // 3. Fuego sagrado y ascuas ardientes (Embers)
  const fireCoreGeo = new THREE.OctahedronGeometry(0.32, 2);
  const fireCoreMat = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff7700,
    emissiveIntensity: 3.5,
    roughness: 0.0,
  });
  const fireCore = new THREE.Mesh(fireCoreGeo, fireCoreMat);
  fireCore.position.y = 0.55;
  group.add(fireCore);

  // Partículas de ascuas / brasas flotantes ascendiendo (Dark Souls Embers)
  const emberCount = 35;
  const emberGeo = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(emberCount * 3);
  for (let i = 0; i < emberCount * 3; i += 3) {
    emberPositions[i] = (Math.random() - 0.5) * 0.9;
    emberPositions[i + 1] = 0.4 + Math.random() * 1.8;
    emberPositions[i + 2] = (Math.random() - 0.5) * 0.9;
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
  const emberMat = new THREE.PointsMaterial({
    color: 0xffaa33,
    size: 0.09,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const embersPoints = new THREE.Points(emberGeo, emberMat);
  group.add(embersPoints);

  // 4. Luz de hoguera cálida parpadeante
  const bonfireLight = new THREE.PointLight(0xff6a14, 3.8, 16, 1.3);
  bonfireLight.position.set(0, 1.1, 0);
  bonfireLight.castShadow = true;
  group.add(bonfireLight);

  // Runa / Mensaje de saponita brillante en el suelo
  const runeCircleGeo = new THREE.RingGeometry(1.8, 2.3, 32);
  const runeCircleMat = new THREE.MeshBasicMaterial({
    color: zc.color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45,
  });
  const runeCircle = new THREE.Mesh(runeCircleGeo, runeCircleMat);
  runeCircle.rotation.x = -Math.PI / 2;
  runeCircle.position.y = 0.03;
  group.add(runeCircle);

  scene.add(group);
  return { group, fireCore, embersPoints, bonfireLight, runeCircle, swordGroup };
}

// ============================================================================
// SISTEMA DE FÍSICAS DE CONTACTO Y COLISIONES DEL MUNDO
// ============================================================================

// Crea una sombra de contacto suave de oclusión ambiental bajo los pies
function createContactShadowMesh(scene) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.4, 'rgba(4, 8, 16, 0.45)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(1.6, 1.6);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(geo, mat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.025;
  scene.add(shadowMesh);
  return shadowMesh;
}

// Sistema de partículas de polvo y gravilla al correr y al aterrizar de saltos
function createDustParticleSystem(scene) {
  const count = 50;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lives = new Float32Array(count);
  const maxLives = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] = -100; // Inactivas bajo el mapa
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xc8d8e8,
    size: 0.22,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let nextIdx = 0;
  const emit = (x, y, z, burstCount = 8, speed = 2.4) => {
    for (let k = 0; k < burstCount; k++) {
      const i = (nextIdx + k) % count;
      const angle = Math.random() * Math.PI * 2;
      const rSpeed = speed * (0.35 + Math.random() * 0.8);
      positions[i * 3]     = x + Math.cos(angle) * 0.2;
      positions[i * 3 + 1] = y + 0.06 + Math.random() * 0.08;
      positions[i * 3 + 2] = z + Math.sin(angle) * 0.2;

      velocities[i * 3]     = Math.cos(angle) * rSpeed;
      velocities[i * 3 + 1] = 0.5 + Math.random() * 1.4;
      velocities[i * 3 + 2] = Math.sin(angle) * rSpeed;

      lives[i] = 1.0;
      maxLives[i] = 0.3 + Math.random() * 0.25;
    }
    nextIdx = (nextIdx + burstCount) % count;
  };

  const update = (delta) => {
    let active = false;
    for (let i = 0; i < count; i++) {
      if (lives[i] > 0) {
        lives[i] -= delta / maxLives[i];
        if (lives[i] <= 0) {
          lives[i] = 0;
          positions[i * 3 + 1] = -100;
        } else {
          active = true;
          positions[i * 3]     += velocities[i * 3] * delta;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
          velocities[i * 3 + 1] -= 5.5 * delta; // Gravedad
        }
      }
    }
    if (active) geo.attributes.position.needsUpdate = true;
  };

  const dispose = () => {
    scene.remove(points);
    geo.dispose();
    mat.dispose();
  };

  return { emit, update, dispose };
}

// Resuelve colisiones cilíndricas y de muros con deslizamiento tangencial (Slide Collision)
function resolveWorldCollisions(pos, vel, playerRadius = 0.65) {
  // Obstáculos cilíndricos (Hogueras, NPCs, Farolas y Torres de esquina)
  const cylindricalObstacles = [
    // 4 Hogueras
    { x: -16, z: -14, r: 1.55 },
    { x: 16,  z: -14, r: 1.55 },
    { x: -16, z: 14,  r: 1.55 },
    { x: 16,  z: 14,  r: 1.55 },
    // 4 Sabios / NPCs de Dark Souls
    { x: -13.8, z: -14, r: 0.95 },
    { x: 18.2,  z: -14, r: 0.95 },
    { x: -13.8, z: 14,  r: 0.95 },
    { x: 18.2,  z: 14,  r: 0.95 },
    // 8 Farolas de hierro góticas
    { x: -8, z: -8, r: 0.48 },
    { x: 8,  z: -8, r: 0.48 },
    { x: -18, z: 4,  r: 0.48 },
    { x: 18,  z: 4,  r: 0.48 },
    { x: -6, z: 18,  r: 0.48 },
    { x: 6,  z: 18,  r: 0.48 },
    { x: -22, z: -18, r: 0.48 },
    { x: 22,  z: -18, r: 0.48 },
    // 4 Grandes Torres / Agujas góticas perimetrales
    { x: -34, z: -28, r: 2.8 },
    { x: 34,  z: -28, r: 2.8 },
    { x: -32, z: 28,  r: 2.8 },
    { x: 32,  z: 28,  r: 2.8 },
  ];

  for (let i = 0; i < cylindricalObstacles.length; i++) {
    const obs = cylindricalObstacles[i];
    const dx = pos.x - obs.x;
    const dz = pos.z - obs.z;
    const distSq = dx * dx + dz * dz;
    const minDist = playerRadius + obs.r;
    if (distSq < minDist * minDist && distSq > 0.0001) {
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const nz = dz / dist;
      const pen = minDist - dist;
      pos.x += nx * pen;
      pos.z += nz * pen;
      const vn = vel.x * nx + vel.z * nz;
      if (vn < 0) {
        vel.x -= vn * nx;
        vel.z -= vn * nz;
      }
    }
  }

  // Muros perimetrales del patio y fachada de la Gran Catedral
  if (pos.z < -28.2) {
    pos.z = -28.2;
    if (vel.z < 0) vel.z = 0;
  }
  if (pos.z > 29.2) {
    pos.z = 29.2;
    if (vel.z > 0) vel.z = 0;
  }
  if (pos.x < -27.5) {
    pos.x = -27.5;
    if (vel.x < 0) vel.x = 0;
  }
  if (pos.x > 27.5) {
    pos.x = 27.5;
    if (vel.x > 0) vel.x = 0;
  }

  // Balaustradas centrales de piedra
  const boxes = [
    { minX: -17.5, maxX: -2.5, minZ: -18.7, maxZ: -17.3 },
    { minX: 2.5,   maxX: 17.5, minZ: -18.7, maxZ: -17.3 },
    { minX: -18.7, maxX: -17.3, minZ: 2.5,  maxZ: 17.5 },
    { minX: 17.3,  maxX: 18.7,  minZ: 2.5,  maxZ: 17.5 },
  ];

  for (let b = 0; b < boxes.length; b++) {
    const box = boxes[b];
    const closestX = Math.max(box.minX, Math.min(pos.x, box.maxX));
    const closestZ = Math.max(box.minZ, Math.min(pos.z, box.maxZ));
    const dx = pos.x - closestX;
    const dz = pos.z - closestZ;
    const distSq = dx * dx + dz * dz;
    if (distSq < playerRadius * playerRadius && distSq > 0.0001) {
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const nz = dz / dist;
      const pen = playerRadius - dist;
      pos.x += nx * pen;
      pos.z += nz * pen;
      const vn = vel.x * nx + vel.z * nz;
      if (vn < 0) {
        vel.x -= vn * nx;
        vel.z -= vn * nz;
      }
    }
  }
}

// ============================================================================
// MODELO DEL JUGADOR: MAGO CON ESQUELETO Y ANIMACIONES (WIZARD RIGGED)
// ============================================================================
function loadWizardCharacter(scene, playerGroup, onLoadingState) {
  // innerGroup aloja la cinemática física secundaria: inclinación, inercia, squash & stretch
  const innerGroup = new THREE.Group();
  playerGroup.add(innerGroup);

  // modelWrapper garantiza centrado geométrico perfecto y anclaje de pies en Y = 0
  const modelWrapper = new THREE.Group();
  innerGroup.add(modelWrapper);

  // Sombra de contacto física en el suelo
  const contactShadow = createContactShadowMesh(scene);

  // Sistema de partículas de polvo al correr y aterrizar
  const dustSystem = createDustParticleSystem(scene);

  // Silueta espectral temporal mientras se procesa la carga del modelo 3D
  const ghostGeo = new THREE.CapsuleGeometry(0.35, 1.4, 8, 16);
  const ghostMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.2,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
  });
  const ghostMesh = new THREE.Mesh(ghostGeo, ghostMat);
  ghostMesh.position.y = 1.05;
  modelWrapper.add(ghostMesh);

  let loadedModel = null;
  let mixer = null;
  const actions = { walk: null, run: null };

  const loader = new GLTFLoader();

  loader.load(
    '/models/wizard-rigged.glb',
    (gltf) => {
      // Eliminar silueta temporal
      modelWrapper.remove(ghostMesh);
      ghostGeo.dispose();
      ghostMat.dispose();

      const model = gltf.scene;

      // Habilitar sombras y optimizar materiales PBR
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = true;
          if (child.material) {
            child.material.roughness = Math.max(0.28, child.material.roughness ?? 0.6);
            child.material.metalness = Math.min(0.85, child.material.metalness ?? 0.2);
            child.material.needsUpdate = true;
          }
        }
      });

      // Normalizar escala para que la altura sea exactamente 2.3m
      const initialBox = new THREE.Box3().setFromObject(model);
      const initialSize = initialBox.getSize(new THREE.Vector3());
      const targetHeight = 2.3;
      const scale = targetHeight / (initialSize.y || 1);
      model.scale.setScalar(scale);

      // Centrado exacto: colocar el centro entre los pies en (0, 0, 0)
      model.updateMatrixWorld(true);
      const updatedBox = new THREE.Box3().setFromObject(model);
      const updatedCenter = updatedBox.getCenter(new THREE.Vector3());
      model.position.set(-updatedCenter.x, -updatedBox.min.y, -updatedCenter.z);

      modelWrapper.add(model);
      loadedModel = model;

      // Configurar AnimationMixer y clips de esqueleto
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);

        const walkClip = gltf.animations.find((a) => a.name.toLowerCase().includes('walk')) || gltf.animations[0];
        const runClip = gltf.animations.find((a) => a.name.toLowerCase().includes('run')) || gltf.animations[1] || walkClip;

        if (walkClip) {
          actions.walk = mixer.clipAction(walkClip);
          actions.walk.play();
          actions.walk.setEffectiveWeight(0);
        }
        if (runClip) {
          actions.run = mixer.clipAction(runClip);
          actions.run.play();
          actions.run.setEffectiveWeight(0);
        }
      }

      // Aura de fuego fatuo / magia arcana del mago
      const wizardLight = new THREE.PointLight(0x38bdf8, 2.4, 7.5, 1.4);
      wizardLight.position.set(0, 1.6, 0);
      innerGroup.add(wizardLight);

      if (onLoadingState) onLoadingState(false);
    },
    undefined,
    (error) => {
      console.error('Error al cargar wizard-rigged.glb:', error);
    }
  );

  const updateAnimation = (currentSpeed, isGrounded, delta) => {
    if (!mixer) return;

    if (!isGrounded) {
      // En el aire: tiempo lento para pose de salto/suspensión heroica
      if (actions.walk) actions.walk.setEffectiveTimeScale(0.35);
      if (actions.run) actions.run.setEffectiveTimeScale(0.35);
    } else if (currentSpeed > 6.0) {
      // Carrera (Shift)
      if (actions.run) {
        actions.run.setEffectiveTimeScale(currentSpeed / 6.2);
        actions.run.setEffectiveWeight(THREE.MathUtils.lerp(actions.run.getEffectiveWeight(), 1.0, 10 * delta));
      }
      if (actions.walk) {
        actions.walk.setEffectiveWeight(THREE.MathUtils.lerp(actions.walk.getEffectiveWeight(), 0.0, 10 * delta));
      }
    } else if (currentSpeed > 0.25) {
      // Caminar
      if (actions.walk) {
        actions.walk.setEffectiveTimeScale(currentSpeed / 3.6);
        actions.walk.setEffectiveWeight(THREE.MathUtils.lerp(actions.walk.getEffectiveWeight(), 1.0, 10 * delta));
      }
      if (actions.run) {
        actions.run.setEffectiveWeight(THREE.MathUtils.lerp(actions.run.getEffectiveWeight(), 0.0, 10 * delta));
      }
    } else {
      // Reposo (Idle): desvanecer animaciones hacia la pose de reposo natural del esqueleto
      if (actions.walk) {
        actions.walk.setEffectiveWeight(THREE.MathUtils.lerp(actions.walk.getEffectiveWeight(), 0.0, 12 * delta));
      }
      if (actions.run) {
        actions.run.setEffectiveWeight(THREE.MathUtils.lerp(actions.run.getEffectiveWeight(), 0.0, 12 * delta));
      }
    }

    mixer.update(delta);
  };

  const dispose = () => {
    if (mixer) mixer.stopAllAction();
    scene.remove(contactShadow);
    contactShadow.geometry.dispose();
    contactShadow.material.dispose();
    dustSystem.dispose();
  };

  return { innerGroup, modelWrapper, contactShadow, dustSystem, dispose, getModel: () => loadedModel, updateAnimation };
}


// ============================================================================
// MODELO DE NPC (SABIOS Y GUARDIANES GÓTICOS / FIRE KEEPERS)
// ============================================================================
function createSoulsNPCMesh(accentColor) {
  const group = new THREE.Group();

  const robeMat = new THREE.MeshStandardMaterial({
    color: 0x161c24,
    roughness: 0.9,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.6,
    roughness: 0.4,
  });

  // Túnica larga talar gótica
  const robeGeo = new THREE.CylinderGeometry(0.28, 0.58, 1.6, 16);
  const robe = new THREE.Mesh(robeGeo, robeMat);
  robe.position.y = 0.8;
  robe.castShadow = true;
  group.add(robe);

  // Cenefa de runas o ribete bordado
  const trimGeo = new THREE.CylinderGeometry(0.585, 0.585, 0.15, 16);
  const trim = new THREE.Mesh(trimGeo, trimMat);
  trim.position.y = 0.1;
  group.add(trim);

  // Capucha profunda misteriosa
  const hoodGeo = new THREE.SphereGeometry(0.24, 16, 16);
  hoodGeo.scale(1, 1.25, 1.15);
  const hood = new THREE.Mesh(hoodGeo, robeMat);
  hood.position.y = 1.86;
  hood.castShadow = true;
  group.add(hood);

  // Ojos brillantes arcanos en la oscuridad de la capucha
  const eyeMat = new THREE.MeshBasicMaterial({ color: accentColor });
  [-0.07, 0.07].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
    eye.position.set(ex, 1.86, 0.19);
    group.add(eye);
  });

  // Brazos con mangas anchas de monje / sabio
  const armGeo = new THREE.CylinderGeometry(0.09, 0.18, 0.65, 8);
  [-0.34, 0.34].forEach((ax) => {
    const arm = new THREE.Mesh(armGeo, robeMat);
    arm.position.set(ax, 1.2, 0.05);
    arm.rotation.z = ax > 0 ? -0.2 : 0.2;
    arm.castShadow = true;
    group.add(arm);
  });

  // Grimorio / Catalizador arcano en mano
  const bookGeo = new THREE.BoxGeometry(0.28, 0.36, 0.09);
  const book = new THREE.Mesh(bookGeo, trimMat);
  book.position.set(0.28, 0.9, 0.25);
  book.rotation.y = -0.4;
  group.add(book);

  return { group };
}

// ============================================================================
// COLECCIONABLE GÓTICO (ALMAS Y RUNAS FLOTANTES DE SABIDURÍA)
// ============================================================================
function buildSoulsCollectible(scene, cp, idx) {
  const cGroup = new THREE.Group();
  cGroup.position.set(cp.x, 1.3, cp.z);

  // Alma brillante flotante al estilo Dark Souls (Soul of a Proud Knight)
  const coreGeo = new THREE.OctahedronGeometry(0.26, 2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xcfe6ff,
    emissive: 0x4da6ff,
    emissiveIntensity: 2.2,
    roughness: 0.0,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
  });
  const cMesh = new THREE.Mesh(coreGeo, coreMat);
  cGroup.add(cMesh);

  // Halo etéreo y chispas
  const haloGeo = new THREE.SphereGeometry(0.38, 12, 12);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    wireframe: true,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  cGroup.add(halo);

  const cLight = new THREE.PointLight(0x38bdf8, 2.0, 6);
  cLight.position.y = 0.2;
  cGroup.add(cLight);

  scene.add(cGroup);
  return { id: `soul_${idx}`, group: cGroup, mesh: cMesh, halo, type: cp.type, name: cp.name, collected: false };
}

// ============================================================================
// COMPONENTE PRINCIPAL: LIENZO 3D DARK SOULS 3 (IRITHYLL ESTILO ARTÍSTICO)
// ============================================================================
export default function GameCanvas3D({ player, onTalkNpc, onCollectItem, onZoneChange }) {
  const mountRef = useRef(null);
  const [nearbyPrompt, setNearbyPrompt] = useState(null);
  const [controlsHelp, setControlsHelp] = useState(true);

  const stateRef = useRef({
    keys: { w: false, a: false, s: false, d: false, shift: false },
    playerVelocity: new THREE.Vector3(),
    prevVelocity: new THREE.Vector3(),
    currentRotation: 0,
    targetRotation: 0,
    isGrounded: true,
    collectibles: [],
    npcObjects: [],
    activeZone: 'zone_bson',
    walkPhase: 0,
    snowParticles: null,
    camLookTarget: new THREE.Vector3(0, 1.8, 0),
    // Físicas de oscilador armónico amortiguado (Squash & Stretch)
    squashY: 1.0,
    squashVelY: 0.0,
    // Inercia corporal (Fuerzas de D'Alembert y Banking)
    tiltPitch: 0.0,
    tiltRoll: 0.0,
    stepTimer: 0.0,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // ─── 1. ESCENA Y NIEBLA GÓTICA DE IRITHYLL ───────────────────
    const scene = new THREE.Scene();
    // Atmósfera de cielo nocturno frío, neblina azul-ceniza profunda de Irithyll
    const skyColor = new THREE.Color(0x0c131d);
    scene.background = skyColor;
    scene.fog = new THREE.FogExp2(0x0d1522, 0.022);

    // ─── 2. CÁMARA TERCERA PERSONA ─────────────────────────────
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 260);
    camera.position.set(0, 5.5, 12.5);

    // ─── 3. RENDERER CINEMATOGRÁFICO DE ALTO RENDIMIENTO ────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // ─── 4. LUNA GÉLIDA Y CIELO NOCTURNO ESTRELLADO ─────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 110 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = Math.abs(r * Math.cos(phi)) * 0.8 + 15;
      starPos[i + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xc8d8e8, size: 0.32, transparent: true, opacity: 0.75 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Esfera lunar de Irithyll
    const moonGeo = new THREE.SphereGeometry(6.5, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xd8e8f8,
      emissive: 0xb5d0ec,
      emissiveIntensity: 0.85,
      roughness: 0.9,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-35, 65, -85);
    scene.add(moon);

    // ─── 5. ILUMINACIÓN CLAROSCURO DARK SOULS ───────────────────
    // Luz ambiental de hemisferio: cielo azul gélido y suelo de piedra carbón
    const hemiLight = new THREE.HemisphereLight(0x1a2638, 0x090d14, 0.95);
    scene.add(hemiLight);

    // Luz de luna direccional (sombras largas y marcadas)
    const moonLight = new THREE.DirectionalLight(0x9eb8d4, 1.6);
    moonLight.position.set(-25, 45, -30);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 130;
    const shadowDist = 42;
    moonLight.shadow.camera.left = -shadowDist;
    moonLight.shadow.camera.right = shadowDist;
    moonLight.shadow.camera.top = shadowDist;
    moonLight.shadow.camera.bottom = -shadowDist;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    // ─── 6. PARTÍCULAS DE NIEVE Y CENIZA GÉLIDA (BLIZZARD) ──────
    const snowCount = 1400;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    const snowVel = new Float32Array(snowCount);
    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3]     = (Math.random() - 0.5) * 80;
      snowPos[i * 3 + 1] = Math.random() * 28;
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      snowVel[i] = 0.04 + Math.random() * 0.08;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xd8e6f4,
      size: 0.14,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const snowPoints = new THREE.Points(snowGeo, snowMat);
    scene.add(snowPoints);
    stateRef.current.snowParticles = { points: snowPoints, geo: snowGeo, vel: snowVel };

    // ─── 7. CONSTRUCCIÓN DEL MUNDO GÓTICO ────────────────────────
    buildSoulsCourtyardGround(scene);
    buildGothicCourtyardWalls(scene);
    buildGrandCathedral(scene);

    // ─── 8. HOGUERAS DE ZONA (BONFIRES) ─────────────────────────
    const zoneConfigs = [
      { id: 'zone_bson',      name: 'Hoguera del Archivo BSON',       x: -16, z: -14, color: 0x10b981, npcId: 'npc_bsonia' },
      { id: 'zone_mongoose',  name: 'Hoguera de la Forja de Esquemas', x: 16,  z: -14, color: 0xf59e0b, npcId: 'npc_schemiel' },
      { id: 'zone_relations', name: 'Hoguera de la Torre de Enlaces',  x: -16, z: 14,  color: 0x38bdf8, npcId: 'npc_relatia' },
      { id: 'zone_sanctum',   name: 'Hoguera del Santuario de Atlas',  x: 16,  z: 14,  color: 0xa855f7, npcId: 'npc_atlas' },
    ];

    const bonfireObjects = zoneConfigs.map((zc) => buildSoulsBonfire(scene, zc));

    // ─── 9. NPCs DE DARK SOULS (SABIOS Y CUSTODIOS) ─────────────
    const npcColors = {
      npc_bsonia:   0x10b981,
      npc_schemiel: 0xf59e0b,
      npc_relatia:  0x38bdf8,
      npc_atlas:    0xa855f7,
    };

    const npcMeshes = zoneConfigs.map((zc) => {
      const npcData = createSoulsNPCMesh(npcColors[zc.npcId]);
      npcData.group.position.set(zc.x + 2.2, 0, zc.z);
      npcData.group.rotation.y = -Math.PI / 4;
      scene.add(npcData.group);

      // Baliza / Marcador sutil de diálogo
      const markerGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 20);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(zc.x + 2.2, 2.5, zc.z);
      marker.rotation.x = -Math.PI / 2;
      scene.add(marker);

      return {
        id: zc.npcId,
        name: NPCS[zc.npcId]?.name,
        title: NPCS[zc.npcId]?.title,
        zoneId: zc.id,
        group: npcData.group,
        marker,
        worldPos: new THREE.Vector3(zc.x + 2.2, 0, zc.z),
      };
    });

    stateRef.current.npcObjects = npcMeshes;

    // ─── 10. ALMAS Y RUNAS COLECCIONABLES ───────────────────────
    const collectibleDefs = [
      { x: -6,  z: -4,  type: 'scroll',  name: 'Alma de Sabio: Documento BSON' },
      { x: 6,   z: -5,  type: 'rune',    name: 'Runa Ancestral de Mongoose' },
      { x: -5,  z: 7,   type: 'crystal', name: 'Fragmento de Enlace ObjectId' },
      { x: 5,   z: 8,   type: 'scroll',  name: 'Códice del Escriba Oscuro' },
      { x: 0,   z: -14, type: 'rune',    name: 'Sello de la Hoguera Central' },
      { x: -12, z: 0,   type: 'crystal', name: 'Esquirla de Titanita MongoDB' },
    ];
    stateRef.current.collectibles = collectibleDefs.map((cp, idx) => buildSoulsCollectible(scene, cp, idx));

    // ─── 11. PERSONAJE JUGADOR: MAGO ARTICULADO (GLTF RIGGED) ─
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 4);
    scene.add(playerGroup);

    const playerData = loadWizardCharacter(scene, playerGroup);

    // ─── 12. ENTRADA DE TECLADO ─────────────────────────────────
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
          // Impulso de salto vertical con masa
          stateRef.current.playerVelocity.y = 7.4;
          stateRef.current.isGrounded = false;
          // Deformación elástica de anticipación (resorte se comprime y dispara hacia arriba)
          stateRef.current.squashY = 1.15;
          stateRef.current.squashVelY = 2.2;
          sound.playSelect();
          // Nube de polvo de despegue
          playerData.dustSystem.emit(playerGroup.position.x, 0, playerGroup.position.z, 8, 1.8);
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

    // ─── 13. MOTOR DE FÍSICA Y ANIMACIÓN CINEMATOGRÁFICA ─────────
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Animación de hogueras (fuego parpadeante y ascuas)
      bonfireObjects.forEach((bf, i) => {
        const flicker = 1.0 + Math.sin(t * 12 + i * 2.5) * 0.18 + Math.cos(t * 23) * 0.08;
        bf.bonfireLight.intensity = 3.6 * flicker;
        bf.fireCore.scale.setScalar(0.95 + Math.sin(t * 8 + i) * 0.12);
        bf.runeCircle.rotation.z = t * 0.25;
      });

      // Animación de nieve y ventisca de Irithyll
      if (stateRef.current.snowParticles) {
        const { geo, vel } = stateRef.current.snowParticles;
        const pos = geo.attributes.position;
        for (let i = 0; i < snowCount; i++) {
          let y = pos.getY(i) - vel[i];
          let x = pos.getX(i) + Math.sin(t * 0.8 + i) * 0.015;
          if (y < 0) y = 28;
          pos.setY(i, y);
          pos.setX(i, x);
        }
        pos.needsUpdate = true;
      }

      // Animación de NPCs (respiración solemne y baliza)
      npcMeshes.forEach((npc, i) => {
        npc.marker.position.y = 2.5 + Math.sin(t * 2.2 + i) * 0.12;
        npc.marker.rotation.z = t * 1.2;
      });

      // Coleccionables (almas que levitan y giran)
      stateRef.current.collectibles.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y = t * 2.0;
          c.halo.rotation.x = t * 1.5;
          c.group.position.y = 1.3 + Math.sin(t * 2.4) * 0.18;
          const dist = playerGroup.position.distanceTo(c.group.position);
          if (dist < 1.5) {
            c.collected = true;
            c.group.visible = false;
            sound.playSuccess();
            onCollectItem(c);
          }
        }
      });

      // ─── FÍSICAS DE MOVIMIENTO, INERCIA Y CONSERVACIÓN DEL MOMENTUM ───
      const keys = stateRef.current.keys;
      const vel = stateRef.current.playerVelocity;
      const isGrounded = stateRef.current.isGrounded;

      // Velocidades terminales
      const maxWalkSpeed = 5.4;
      const maxRunSpeed = 9.5;
      const topSpeed = keys.shift ? maxRunSpeed : maxWalkSpeed;

      // Vector de entrada de dirección
      const inputDir = new THREE.Vector3();
      if (keys.w) inputDir.z -= 1;
      if (keys.s) inputDir.z += 1;
      if (keys.a) inputDir.x -= 1;
      if (keys.d) inputDir.x += 1;
      const hasInput = inputDir.lengthSq() > 0;
      if (hasInput) inputDir.normalize();

      // Cálculo de aceleración y resistencia física
      if (isGrounded) {
        if (hasInput) {
          // Tracción de suelo adoquinado con aceleración continua
          const accel = keys.shift ? 24.0 : 17.0;
          vel.x = THREE.MathUtils.lerp(vel.x, inputDir.x * topSpeed, accel * delta);
          vel.z = THREE.MathUtils.lerp(vel.z, inputDir.z * topSpeed, accel * delta);
        } else {
          // Fricción cinemática de frenada con inercia de peso (desaceleración orgánica)
          const friction = 11.5;
          vel.x = THREE.MathUtils.lerp(vel.x, 0, friction * delta);
          vel.z = THREE.MathUtils.lerp(vel.z, 0, friction * delta);
        }
      } else {
        // En el aire: CONSERVACIÓN DEL MOMENTUM HORIZONTAL (Física Parabólica)
        if (hasInput) {
          // Control aéreo sutil sin frenar bruscamente la inercia
          const airControl = 4.0;
          vel.x = THREE.MathUtils.lerp(vel.x, inputDir.x * topSpeed, airControl * delta);
          vel.z = THREE.MathUtils.lerp(vel.z, inputDir.z * topSpeed, airControl * delta);
        } else {
          // Resistencia del aire mínima
          const airDrag = 0.6;
          vel.x = THREE.MathUtils.lerp(vel.x, 0, airDrag * delta);
          vel.z = THREE.MathUtils.lerp(vel.z, 0, airDrag * delta);
        }
      }

      // Integración de desplazamiento horizontal
      playerGroup.position.x += vel.x * delta;
      playerGroup.position.z += vel.z * delta;

      // Gravedad y salto físico
      if (!isGrounded) {
        // Gravedad asimétrica: subida más ligera (-18), caída contundente (-26)
        const gravity = vel.y > 0 ? -18.5 : -26.0;
        vel.y += gravity * delta;
        playerGroup.position.y += vel.y * delta;

        // Contacto con el suelo (Impacto y aterrizaje)
        if (playerGroup.position.y <= 0) {
          playerGroup.position.y = 0;
          const impactSpeed = Math.abs(vel.y);
          vel.y = 0;
          stateRef.current.isGrounded = true;

          // Impacto en el oscilador armónico: compresión vertical violenta
          stateRef.current.squashVelY = -Math.min(3.4, impactSpeed * 0.26);
          // Ráfaga de partículas de polvo al aterrizar
          playerData.dustSystem.emit(
            playerGroup.position.x,
            0,
            playerGroup.position.z,
            Math.floor(Math.min(24, 7 + impactSpeed * 2.2)),
            2.8
          );
        }
      }

      // ─── RESOLUCIÓN DE COLISIONES SÓLIDAS CON EL ENTORNO ─────
      resolveWorldCollisions(playerGroup.position, vel, 0.65);

      // ─── SIMULADOR DE RESORTE-AMORTIGUADOR (SQUASH & STRETCH) ─
      // m*y'' + c*y' + k*(y - 1) = 0
      const springK = 210.0;    // Rigidez elástica
      const springDamp = 15.5;  // Coeficiente de amortiguamiento
      const displacement = stateRef.current.squashY - 1.0;
      const springForce = -springK * displacement - springDamp * stateRef.current.squashVelY;
      stateRef.current.squashVelY += springForce * delta;
      stateRef.current.squashY += stateRef.current.squashVelY * delta;

      const sy = THREE.MathUtils.clamp(stateRef.current.squashY, 0.68, 1.35);
      const sxz = 1.0 / Math.sqrt(Math.max(0.4, sy));

      // ─── CINEMÁTICA PROCEDURAL Y DESCONGELAMIENTO DEL MODELO ───
      const currentSpeed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);

      // Rotación suave del personaje orientada hacia el movimiento
      if (hasInput && isGrounded) {
        stateRef.current.targetRotation = Math.atan2(inputDir.x, inputDir.z);
      }
      let angleDiff = stateRef.current.targetRotation - stateRef.current.currentRotation;
      angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff)); // Normalizar a [-PI, PI]
      const turnSpeed = hasInput ? 14.0 : 6.0;
      stateRef.current.currentRotation += angleDiff * Math.min(1.0, turnSpeed * delta);
      playerGroup.rotation.y = stateRef.current.currentRotation;

      // Inercia corporal calculada (Fuerzas de D'Alembert por aceleración)
      const accelX = (vel.x - stateRef.current.prevVelocity.x) / Math.max(0.001, delta);
      const accelZ = (vel.z - stateRef.current.prevVelocity.z) / Math.max(0.001, delta);
      stateRef.current.prevVelocity.copy(vel);

      const sinR = Math.sin(stateRef.current.currentRotation);
      const cosR = Math.cos(stateRef.current.currentRotation);
      const forwardAccel = -sinR * accelX - cosR * accelZ;
      const lateralAccel = cosR * accelX - sinR * accelZ;

      // Cabeceo por inercia: inclinación al acelerar / proyectarse hacia adelante al frenar
      const targetPitchInertia = THREE.MathUtils.clamp(-forwardAccel * 0.011 + (currentSpeed / maxRunSpeed) * 0.08, -0.22, 0.28);
      // Inclinación centrífuga en giros cerrados (Banking)
      const targetRollInertia = THREE.MathUtils.clamp(-lateralAccel * 0.012 - angleDiff * 0.42 * Math.min(1.0, currentSpeed / 3.2), -0.24, 0.24);

      stateRef.current.tiltPitch = THREE.MathUtils.lerp(stateRef.current.tiltPitch, targetPitchInertia, 10 * delta);
      stateRef.current.tiltRoll = THREE.MathUtils.lerp(stateRef.current.tiltRoll, targetRollInertia, 10 * delta);

      // Cinemática de marcha procedural (Gait) para dotar de vida orgánica al modelo estático
      if (currentSpeed > 0.25 && isGrounded) {
        stateRef.current.walkPhase += delta * currentSpeed * 3.8;
        const wp = stateRef.current.walkPhase;
        const speedRatio = Math.min(1.0, currentSpeed / 4.0);

        // Bobbing vertical (dos pisadas por zancada)
        const walkBob = Math.sin(wp * 2.0) * 0.065 * speedRatio;
        // Balanceo de cadera y hombros alternado (sway lateral)
        const walkSway = Math.sin(wp) * 0.055 * speedRatio;
        // Cabeceo de zancada
        const walkPitch = Math.cos(wp * 2.0) * 0.032 * speedRatio;
        // Torsión pélvica rítmica
        const walkYaw = Math.sin(wp) * 0.045;

        playerData.innerGroup.position.y = THREE.MathUtils.lerp(playerData.innerGroup.position.y, walkBob, 14 * delta);
        playerData.innerGroup.rotation.x = stateRef.current.tiltPitch + walkPitch;
        playerData.innerGroup.rotation.z = stateRef.current.tiltRoll + walkSway;
        playerData.innerGroup.rotation.y = walkYaw;

        // Disparo sutil de polvo al correr sobre adoquines
        stateRef.current.stepTimer += delta * currentSpeed;
        if (stateRef.current.stepTimer > 3.4) {
          stateRef.current.stepTimer = 0;
          playerData.dustSystem.emit(playerGroup.position.x, 0, playerGroup.position.z, 2, 0.9);
        }
      } else if (!isGrounded) {
        // En el aire: suspensión y leve anticipación
        playerData.innerGroup.position.y = THREE.MathUtils.lerp(playerData.innerGroup.position.y, 0, 8 * delta);
        playerData.innerGroup.rotation.x = stateRef.current.tiltPitch;
        playerData.innerGroup.rotation.z = stateRef.current.tiltRoll;
        playerData.innerGroup.rotation.y = 0;
      } else {
        // En reposo: respiración arcana solemne e ingravidez sobrenatural (evita rigidez)
        const idleCycle = Math.sin(t * 1.8);
        const idleBob = idleCycle * 0.03;
        const idlePitch = Math.sin(t * 0.9) * 0.016;
        playerData.innerGroup.position.y = THREE.MathUtils.lerp(playerData.innerGroup.position.y, idleBob, 8 * delta);
        playerData.innerGroup.rotation.x = THREE.MathUtils.lerp(playerData.innerGroup.rotation.x, idlePitch, 6 * delta);
        playerData.innerGroup.rotation.z = THREE.MathUtils.lerp(playerData.innerGroup.rotation.z, 0, 6 * delta);
        playerData.innerGroup.rotation.y = THREE.MathUtils.lerp(playerData.innerGroup.rotation.y, 0, 6 * delta);
      }

      // Escala física aplicada (resorte elástico de squash & stretch + respiración de reposo)
      const breathScale = isGrounded && currentSpeed <= 0.25 ? 1.0 + Math.sin(t * 1.8) * 0.012 : 1.0;
      playerData.innerGroup.scale.set(sxz * breathScale, sy * (2.0 - breathScale), sxz * breathScale);

      // Sombra de contacto física en el suelo:
      playerData.contactShadow.position.x = playerGroup.position.x;
      playerData.contactShadow.position.z = playerGroup.position.z;
      const jumpHeight = Math.max(0, playerGroup.position.y);
      const shadowScale = Math.max(0.4, 1.0 - jumpHeight * 0.16);
      playerData.contactShadow.scale.set(shadowScale * sxz, shadowScale * sxz, 1.0);
      playerData.contactShadow.material.opacity = Math.max(0.12, 0.75 - jumpHeight * 0.25);

      // Actualizar partículas de polvo de impacto
      playerData.dustSystem.update(delta);

      // Actualizar animación esquelética (Walk / Run / Idle blends)
      if (playerData.updateAnimation) {
        playerData.updateAnimation(currentSpeed, isGrounded, delta);
      }

      // ─── CÁMARA SPRING-ARM FLUIDA CON ANTICIPACIÓN (LOOK-AHEAD) ───
      const sprintCamPull = (currentSpeed / maxRunSpeed) * 1.2;
      const targetCamDist = 8.6 + sprintCamPull;
      const targetCamHeight = 4.8 + playerGroup.position.y * 0.35;
      const idealCamPos = new THREE.Vector3(
        playerGroup.position.x,
        targetCamHeight,
        playerGroup.position.z + targetCamDist
      );
      camera.position.lerp(idealCamPos, 6.0 * delta);

      // Objetivo de mirada con anticipación hacia donde se mueve el personaje
      const targetLook = new THREE.Vector3(
        playerGroup.position.x + vel.x * 0.12,
        playerGroup.position.y + 1.8,
        playerGroup.position.z + vel.z * 0.12
      );
      stateRef.current.camLookTarget.lerp(targetLook, 8.5 * delta);
      camera.lookAt(stateRef.current.camLookTarget);

      // ─── INTERACCIÓN DE HOGUERAS Y SABIOS ─────────────────────
      let closest = null;
      let minDist = 4.8;
      npcMeshes.forEach((npc) => {
        const d = playerGroup.position.distanceTo(npc.worldPos);
        if (d < minDist) { closest = npc; minDist = d; }
      });

      nearbyRef.current = closest ? { npcId: closest.id, name: closest.name, title: closest.title, zoneId: closest.zoneId } : null;
      setNearbyPrompt(nearbyRef.current);

      // Detección de cambio de zona
      zoneConfigs.forEach((zc) => {
        const d = playerGroup.position.distanceTo(new THREE.Vector3(zc.x, 0, zc.z));
        if (d < 8 && stateRef.current.activeZone !== zc.id) {
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
      playerData.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="canvas-3d-wrapper souls-theme" ref={mountRef}>
      {/* Banner de Interacción Estilo Dark Souls 3 */}
      {nearbyPrompt && (
        <div className="souls-prompt-interact">
          <div className="souls-prompt-frame">
            <span className="souls-key-badge">E</span>
            <div className="souls-prompt-text">
              <span className="souls-prompt-action">Descansar en la Hoguera / Hablar</span>
              <span className="souls-prompt-target">{nearbyPrompt.name} — {nearbyPrompt.title}</span>
            </div>
            <button
              className="souls-btn-touch"
              onClick={() => {
                sound.playSelect();
                onTalkNpc(nearbyPrompt.npcId);
              }}
            >
              Interactuar
            </button>
          </div>
        </div>
      )}

      {/* Guía de Controles Estilo Pergamino / Piedra */}
      <div className={`souls-controls-legend ${controlsHelp ? 'legend-visible' : 'legend-collapsed'}`}>
        <div className="legend-header" onClick={() => setControlsHelp((prev) => !prev)}>
          <span>⚔️ Controles de Viajero</span>
          <span className="legend-toggle">{controlsHelp ? '▲' : '▼'}</span>
        </div>
        {controlsHelp && (
          <div className="legend-body">
            <div className="legend-row">
              <span className="key-tag">W</span><span className="key-tag">A</span><span className="key-tag">S</span><span className="key-tag">D</span>
              <span>Mover al Latente</span>
            </div>
            <div className="legend-row"><span className="key-tag">Shift</span><span>Carrera de Caballero</span></div>
            <div className="legend-row"><span className="key-tag">Espacio</span><span>Salto</span></div>
            <div className="legend-row"><span className="key-tag">E</span><span>Descansar en Hoguera / Dialogar</span></div>
            <div className="legend-row"><span className="key-tag">H</span><span>Ocultar guía</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
