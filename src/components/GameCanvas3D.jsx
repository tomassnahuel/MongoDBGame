import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { NPCS } from '../data/gameData';
import { sound } from '../utils/audio';

// ========================================================
// TEXTURAS PROCEDURALES LIGERAS (Sin dependencias externas)
// ========================================================

// Crea una textura radial suave para partículas de fuego y halos lunares
function createGlowTexture(r = 255, g = 140, b = 40) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  gradient.addColorStop(0.3, `rgba(${r}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.3)}, 0.6)`);
  gradient.addColorStop(0.7, `rgba(${Math.floor(r * 0.5)}, 20, 0, 0.2)`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Crea textura de runas arcanas para anillos de altar
function createRuneTexture(colorHex = '#ff7a22') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 230, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, 256, 190, 0, Math.PI * 2);
  ctx.stroke();

  // Runas e inscripciones radiales
  ctx.font = '24px serif';
  ctx.fillStyle = colorHex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ'];
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    ctx.save();
    ctx.translate(256 + Math.cos(angle) * 210, 256 + Math.sin(angle) * 210);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(runes[i % runes.length], 0, 0);
    ctx.restore();
  }

  // Pentagrama / geometría interior
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a1 = (i / 8) * Math.PI * 2;
    const a2 = ((i + 3) / 8) * Math.PI * 2;
    ctx.moveTo(256 + Math.cos(a1) * 180, 256 + Math.sin(a1) * 180);
    ctx.lineTo(256 + Math.cos(a2) * 180, 256 + Math.sin(a2) * 180);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Crea arco ojival gótico (gothic pointed arch)
function createGothicArch(width, height, thickness, depth) {
  const shape = new THREE.Shape();
  const halfW = width / 2;
  const springH = height * 0.6; // Comienzo del arco apuntado

  shape.moveTo(-halfW, 0);
  shape.lineTo(-halfW, springH);
  shape.quadraticCurveTo(-halfW * 0.6, height * 0.88, 0, height);
  shape.quadraticCurveTo(halfW * 0.6, height * 0.88, halfW, springH);
  shape.lineTo(halfW, 0);

  // Hueco interior
  const innerHalfW = halfW - thickness;
  const innerSpringH = springH - thickness * 0.5;
  const innerHeight = height - thickness;

  const hole = new THREE.Path();
  hole.moveTo(-innerHalfW, 0);
  hole.lineTo(-innerHalfW, innerSpringH);
  hole.quadraticCurveTo(-innerHalfW * 0.6, innerHeight * 0.88, 0, innerHeight);
  hole.quadraticCurveTo(innerHalfW * 0.6, innerHeight * 0.88, innerHalfW, innerSpringH);
  hole.lineTo(innerHalfW, 0);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  });
  return geo;
}

// ========================================================
// ENTORNO Y ARQUITECTURA GÓTICA (Imágenes 1, 2, 3 y 4)
// ========================================================

// Silueta lejana de Irithyll del Valle Boreal (Aguja gótica y catedrales en la niebla)
function buildDistantGothicSkyline(scene) {
  const skylineGroup = new THREE.Group();

  const darkGothicMat = new THREE.MeshStandardMaterial({
    color: 0x080f1d,
    roughness: 0.95,
    metalness: 0.1,
  });

  const windowGlowMat = new THREE.MeshBasicMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.6,
  });

  // Genera torres góticas esbeltas a lo largo del horizonte
  const towersData = [
    [-55, -75, 7, 28, 22],
    [-42, -80, 10, 36, 26],
    [-30, -70, 8, 26, 18],
    [-18, -85, 14, 48, 34], // Gran Catedral Central
    [-4,  -82, 9, 32, 22],
    [10,  -78, 12, 42, 30],
    [26,  -72, 8, 28, 20],
    [38,  -80, 11, 35, 25],
    [52,  -76, 7, 24, 18],
    [-68, -40, 9, 26, 18],
    [65,  -42, 8, 27, 19],
  ];

  towersData.forEach(([tx, tz, tw, th, sh]) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(tx, 0, tz);

    const bodyGeo = new THREE.BoxGeometry(tw, th, tw);
    const body = new THREE.Mesh(bodyGeo, darkGothicMat);
    body.position.y = th / 2;
    towerGroup.add(body);

    const spireGeo = new THREE.ConeGeometry(tw * 0.72, sh, 8);
    const spire = new THREE.Mesh(spireGeo, darkGothicMat);
    spire.position.y = th + sh / 2;
    towerGroup.add(spire);

    for (let wy = th * 0.4; wy < th * 0.85; wy += 6) {
      const winGeo = new THREE.BoxGeometry(0.8, 2.2, tw + 0.2);
      const win = new THREE.Mesh(winGeo, windowGlowMat);
      win.position.y = wy;
      towerGroup.add(win);
    }

    skylineGroup.add(towerGroup);
  });

  const wallGeo = new THREE.BoxGeometry(140, 12, 5);
  const wall = new THREE.Mesh(wallGeo, darkGothicMat);
  wall.position.set(0, 6, -65);
  skylineGroup.add(wall);

  scene.add(skylineGroup);
}

// Brasero de hierro fundido con fuego y brasas ardientes (Imágenes 3 y 4)
function createBrazier(scene, x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x181a1f,
    roughness: 0.7,
    metalness: 0.8,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.9,
  });

  const pedestalGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 8);
  const pedestal = new THREE.Mesh(pedestalGeo, stoneMat);
  pedestal.position.y = 0.45;
  pedestal.castShadow = true;
  group.add(pedestal);

  const bowlGeo = new THREE.CylinderGeometry(0.55, 0.25, 0.4, 12);
  const bowl = new THREE.Mesh(bowlGeo, ironMat);
  bowl.position.y = 1.05;
  bowl.castShadow = true;
  group.add(bowl);

  const coalGeo = new THREE.SphereGeometry(0.4, 8, 8);
  const coalMat = new THREE.MeshStandardMaterial({
    color: 0xff3b00,
    emissive: 0xff4500,
    emissiveIntensity: 1.8,
    roughness: 0.5,
  });
  const coal = new THREE.Mesh(coalGeo, coalMat);
  coal.position.y = 1.15;
  group.add(coal);

  const flameGeo = new THREE.ConeGeometry(0.28, 0.7, 6);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xffaa22,
    transparent: true,
    opacity: 0.88,
  });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.y = 1.45;
  group.add(flame);

  const light = new THREE.PointLight(0xff6e1a, 2.2, 10);
  light.position.set(0, 1.5, 0);
  group.add(light);

  scene.add(group);
  return { flame, light };
}

// Árbol marchito gótico retorcido (Atmósfera lúgubre de ruinas)
function buildWitheredGothicTree(scene, x, z, seed = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const barkMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.95,
    metalness: 0.05,
  });

  const trunkH = 3.6 + (seed % 3) * 0.4;
  const trunkGeo = new THREE.CylinderGeometry(0.14, 0.32, trunkH, 6);
  const trunk = new THREE.Mesh(trunkGeo, barkMat);
  trunk.position.y = trunkH / 2;
  trunk.rotation.z = (seed % 4 - 2) * 0.08;
  trunk.rotation.y = seed * 1.3;
  trunk.castShadow = true;
  group.add(trunk);

  const branchGeo = new THREE.CylinderGeometry(0.06, 0.12, 1.8, 5);
  for (let b = 0; b < 4; b++) {
    const branch = new THREE.Mesh(branchGeo, barkMat);
    const angle = (b / 4) * Math.PI * 2 + seed;
    branch.position.set(Math.cos(angle) * 0.4, trunkH * 0.75 + b * 0.25, Math.sin(angle) * 0.4);
    branch.rotation.z = 0.7 + (b % 2) * 0.3;
    branch.rotation.y = angle;
    branch.castShadow = true;
    group.add(branch);
  }

  scene.add(group);
}

// Rocas de basalto oscuro y escombros de ruinas
function buildBasaltCrag(scene, x, z, scale = 1) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x1c212b,
    roughness: 0.9,
    metalness: 0.1,
  });

  const geo = new THREE.DodecahedronGeometry(1.2 * scale, 0);
  const crag = new THREE.Mesh(geo, stoneMat);
  crag.position.y = 0.5 * scale;
  crag.scale.set(1.2, 0.7, 0.9);
  crag.rotation.set(0.2, (x + z) * 0.3, 0.1);
  crag.castShadow = true;
  crag.receiveShadow = true;
  group.add(crag);

  scene.add(group);
}

// Construcción del terreno de adoquines oscuros y losas rotas
function buildGothicTerrain(scene) {
  const terrainGeo = new THREE.PlaneGeometry(130, 130, 48, 48);
  const pos = terrainGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vz = pos.getZ(i);
    const d = Math.sqrt(vx * vx + vz * vz);
    if (d > 16) {
      const h = Math.sin(vx * 0.15) * Math.cos(vz * 0.15) * 0.8 +
                Math.sin(vx * 0.05 + 1) * Math.cos(vz * 0.06) * 1.4;
      pos.setZ(i, h);
    }
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x0f141f,
    roughness: 0.95,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(terrainGeo, terrainMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const pathMat = new THREE.MeshStandardMaterial({
    color: 0x1b202c,
    roughness: 0.85,
    metalness: 0.1,
  });

  const createStonePath = (w, h, px, pz) => {
    const geo = new THREE.BoxGeometry(w, 0.08, h);
    const mesh = new THREE.Mesh(geo, pathMat);
    mesh.position.set(px, 0.02, pz);
    mesh.receiveShadow = true;
    scene.add(mesh);
  };

  createStonePath(5.5, 46, 0, 0);
  createStonePath(46, 5.5, 0, 0);

  const slabMat = new THREE.MeshStandardMaterial({
    color: 0x272e3d,
    roughness: 0.82,
    metalness: 0.08,
  });
  const slabGeo = new THREE.BoxGeometry(1.8, 0.05, 1.8);

  for (let ix = -14; ix <= 14; ix += 2.4) {
    for (let iz = -14; iz <= 14; iz += 2.4) {
      if (Math.abs(ix) < 3.2 || Math.abs(iz) < 3.2) {
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(ix, 0.04, iz);
        slab.rotation.y = Math.sin(ix * 5 + iz) * 0.08;
        slab.receiveShadow = true;
        scene.add(slab);
      }
    }
  }

  const balustradeMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.85 });
  [-3.0, 3.0].forEach((bx) => {
    for (let bz = -18; bz <= 18; bz += 3.5) {
      if (Math.abs(bz) > 3.5) {
        const postGeo = new THREE.BoxGeometry(0.3, 0.85, 0.3);
        const post = new THREE.Mesh(postGeo, balustradeMat);
        post.position.set(bx, 0.45, bz);
        post.castShadow = true;
        scene.add(post);

        const railGeo = new THREE.BoxGeometry(0.2, 0.12, 3.4);
        const rail = new THREE.Mesh(railGeo, balustradeMat);
        rail.position.set(bx, 0.85, bz);
        scene.add(rail);
      }
    }
  });
}

// Construye arcos ojivales y pilares góticos que enmarcan las zonas (Imagen 2 y 4)
function buildGothicArchway(scene, x, z, rotY = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotY;

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x232936,
    roughness: 0.88,
    metalness: 0.1,
  });

  const archGeo = createGothicArch(4.2, 5.2, 0.45, 0.6);
  const arch = new THREE.Mesh(archGeo, stoneMat);
  arch.position.set(0, 0, -0.3);
  arch.castShadow = true;
  arch.receiveShadow = true;
  group.add(arch);

  [-2.1, 2.1].forEach((px) => {
    const baseGeo = new THREE.BoxGeometry(0.8, 0.35, 0.8);
    const base = new THREE.Mesh(baseGeo, stoneMat);
    base.position.set(px, 0.18, 0);
    group.add(base);

    const shaftGeo = new THREE.CylinderGeometry(0.28, 0.32, 3.2, 8);
    const shaft = new THREE.Mesh(shaftGeo, stoneMat);
    shaft.position.set(px, 1.8, 0);
    shaft.castShadow = true;
    group.add(shaft);

    const capGeo = new THREE.BoxGeometry(0.7, 0.3, 0.7);
    const cap = new THREE.Mesh(capGeo, stoneMat);
    cap.position.set(px, 3.5, 0);
    group.add(cap);
  });

  scene.add(group);
}

// Altar gótico específico según la zona
function buildDarkSoulsAltar(scene, zc) {
  const group = new THREE.Group();
  group.position.set(zc.x, 0, zc.z);

  const darkStoneMat = new THREE.MeshStandardMaterial({
    color: 0x181e29,
    roughness: 0.9,
    metalness: 0.1,
  });

  const baseGeo = new THREE.CylinderGeometry(4.2, 4.8, 0.35, 24);
  const base = new THREE.Mesh(baseGeo, darkStoneMat);
  base.position.y = 0.18;
  base.receiveShadow = true;
  base.castShadow = true;
  group.add(base);

  const runeTex = createRuneTexture(zc.colorHex || '#ff7a22');
  const runeGeo = new THREE.PlaneGeometry(6.5, 6.5);
  const runeMat = new THREE.MeshBasicMaterial({
    map: runeTex,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const runeMesh = new THREE.Mesh(runeGeo, runeMat);
  runeMesh.rotation.x = -Math.PI / 2;
  runeMesh.position.y = 0.37;
  group.add(runeMesh);

  const pilarCoords = [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]];
  const orbs = [];
  const crystals = [];

  pilarCoords.forEach(([ox, oz]) => {
    const colGeo = new THREE.CylinderGeometry(0.24, 0.28, 3.8, 8);
    const col = new THREE.Mesh(colGeo, darkStoneMat);
    col.position.set(ox, 2.0, oz);
    col.castShadow = true;
    group.add(col);

    const capGeo = new THREE.BoxGeometry(0.65, 0.2, 0.65);
    const cap = new THREE.Mesh(capGeo, darkStoneMat);
    cap.position.set(ox, 3.9, oz);
    group.add(cap);

    const orbGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: zc.color,
      emissive: zc.color,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(ox, 4.4, oz);
    group.add(orb);
    orbs.push(orb);
  });

  if (zc.id === 'zone_relations') {
    for (let c = 0; c < 5; c++) {
      const cGeo = new THREE.OctahedronGeometry(0.35 + (c % 2) * 0.15, 1);
      cGeo.scale(0.8, 2.2, 0.8);
      const cMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 1.8,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
      });
      const crystal = new THREE.Mesh(cGeo, cMat);
      const angle = (c / 5) * Math.PI * 2;
      crystal.position.set(Math.cos(angle) * 1.8, 1.8 + (c % 3) * 0.4, Math.sin(angle) * 1.8);
      group.add(crystal);
      crystals.push(crystal);
    }
  }

  const altarLight = new THREE.PointLight(zc.color, 3.0, 14);
  altarLight.position.set(0, 3.5, 0);
  group.add(altarLight);

  scene.add(group);
  return { group, runeMesh, orbs, crystals };
}

// ========================================================
// PERSONAJES ESTILO DARK SOULS (Modelos 3D temáticos)
// ========================================================

function createSoulsHumanoid(clothColor = 0x1e2430, armorColor = 0x334155) {
  const group = new THREE.Group();

  const clothMat = new THREE.MeshStandardMaterial({ color: clothColor, roughness: 0.85 });
  const armorMat = new THREE.MeshStandardMaterial({ color: armorColor, roughness: 0.45, metalness: 0.75 });
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1e1510, roughness: 0.8 });

  const torsoGeo = new THREE.CapsuleGeometry(0.28, 0.62, 8, 12);
  const torso = new THREE.Mesh(torsoGeo, armorMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  group.add(torso);

  const skirtGeo = new THREE.CylinderGeometry(0.32, 0.46, 0.6, 12);
  const skirt = new THREE.Mesh(skirtGeo, clothMat);
  skirt.position.y = 0.58;
  skirt.castShadow = true;
  group.add(skirt);

  const armMat = new THREE.MeshStandardMaterial({ color: armorColor, roughness: 0.5, metalness: 0.6 });
  const shoulderGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.32, 6, 8);
  const foreGeo = new THREE.CapsuleGeometry(0.075, 0.3, 6, 8);

  const arms = [];
  [-1, 1].forEach((side) => {
    const armGroup = new THREE.Group();
    armGroup.position.set(side * 0.38, 1.35, 0);

    const shoulder = new THREE.Mesh(shoulderGeo, armMat);
    shoulder.castShadow = true;
    armGroup.add(shoulder);

    const upper = new THREE.Mesh(armGeo, armMat);
    upper.position.y = -0.2;
    upper.castShadow = true;
    armGroup.add(upper);

    const foreGroup = new THREE.Group();
    foreGroup.position.y = -0.42;

    const fore = new THREE.Mesh(foreGeo, armMat);
    fore.position.y = -0.15;
    fore.castShadow = true;
    foreGroup.add(fore);

    armGroup.add(foreGroup);
    group.add(armGroup);
    arms.push({ group: armGroup, fore: foreGroup, side });
  });

  const thighGeo = new THREE.CapsuleGeometry(0.1, 0.36, 6, 8);
  const shinGeo = new THREE.CapsuleGeometry(0.09, 0.32, 6, 8);
  const bootGeo = new THREE.BoxGeometry(0.11, 0.08, 0.26);

  const legs = [];
  [-0.14, 0.14].forEach((x) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(x, 0.32, 0);

    const thigh = new THREE.Mesh(thighGeo, leatherMat);
    thigh.position.y = -0.2;
    thigh.castShadow = true;
    legGroup.add(thigh);

    const shinGroup = new THREE.Group();
    shinGroup.position.y = -0.48;

    const shin = new THREE.Mesh(shinGeo, armorMat);
    shin.position.y = -0.15;
    shin.castShadow = true;
    shinGroup.add(shin);

    const boot = new THREE.Mesh(bootGeo, leatherMat);
    boot.position.set(0, -0.34, 0.06);
    boot.castShadow = true;
    shinGroup.add(boot);

    legGroup.add(shinGroup);
    group.add(legGroup);
    legs.push({ group: legGroup, shin: shinGroup });
  });

  return { group, torso, arms, legs, clothMat, armorMat };
}

// Crea al Jugador: El Escriba de las Cenizas
function createAshenPlayerMesh() {
  const { group, torso, arms, legs } = createSoulsHumanoid(0x161c28, 0x2b3342);

  const hoodMat = new THREE.MeshStandardMaterial({ color: 0x131722, roughness: 0.9 });
  const hoodGeo = new THREE.SphereGeometry(0.24, 16, 16);
  hoodGeo.scale(1.05, 1.25, 1.15);
  const head = new THREE.Mesh(hoodGeo, hoodMat);
  head.position.y = 1.88;
  head.castShadow = true;
  group.add(head);

  const faceShadowGeo = new THREE.SphereGeometry(0.16, 8, 8);
  const faceShadowMat = new THREE.MeshBasicMaterial({ color: 0x020408 });
  const faceShadow = new THREE.Mesh(faceShadowGeo, faceShadowMat);
  faceShadow.position.set(0, 1.88, 0.1);
  group.add(faceShadow);

  const eyeGeo = new THREE.SphereGeometry(0.02, 6, 6);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
  [-0.06, 0.06].forEach((ex) => {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(ex, 1.9, 0.2);
    group.add(eye);
  });

  const capeGeo = new THREE.PlaneGeometry(0.65, 0.95, 2, 4);
  const capeMat = new THREE.MeshStandardMaterial({
    color: 0x111622,
    roughness: 0.92,
    side: THREE.DoubleSide,
  });
  const cape = new THREE.Mesh(capeGeo, capeMat);
  cape.position.set(0, 1.18, -0.32);
  cape.rotation.x = 0.2;
  cape.castShadow = true;
  group.add(cape);

  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0.42, 1.25, 0.1);

  const poleGeo = new THREE.CylinderGeometry(0.028, 0.038, 2.2, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.6, metalness: 0.7 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = 0.8;
  pole.castShadow = true;
  weaponGroup.add(pole);

  const crownGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
  const crownMat = new THREE.MeshStandardMaterial({ color: 0x855b14, roughness: 0.3, metalness: 0.8 });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.position.y = 1.9;
  crown.rotation.x = Math.PI / 2;
  weaponGroup.add(crown);

  const flameGeo = new THREE.ConeGeometry(0.14, 0.45, 8);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.9,
  });
  const weaponFlame = new THREE.Mesh(flameGeo, flameMat);
  weaponFlame.position.y = 2.12;
  weaponGroup.add(weaponFlame);

  const weaponLight = new THREE.PointLight(0xff7722, 2.6, 8);
  weaponLight.position.y = 2.15;
  weaponGroup.add(weaponLight);

  group.add(weaponGroup);

  return { group, torso, head, cape, arms, legs, weaponFlame, weaponLight };
}

// Crea a los Sabios y Guardianes según la temática Dark Souls (Imágenes 2, 3 y 4)
function createSoulsNPC(npcId) {
  let clothCol = 0x1c2430;
  let armorCol = 0x334155;

  if (npcId === 'npc_bsonia') {
    clothCol = 0x0f281e;
  } else if (npcId === 'npc_schemiel') {
    clothCol = 0x2b1e14;
  } else if (npcId === 'npc_relatia') {
    clothCol = 0x241238;
  } else if (npcId === 'npc_atlas') {
    clothCol = 0x141824;
    armorCol = 0x64748b;
  }

  const { group, torso, arms, legs } = createSoulsHumanoid(clothCol, armorCol);

  let hat;
  const specialOrbs = [];

  if (npcId === 'npc_relatia' || npcId === 'npc_schemiel') {
    const brimGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.04, 16);
    const coneGeo = new THREE.ConeGeometry(0.3, 0.6, 12);
    const hatMat = new THREE.MeshStandardMaterial({
      color: npcId === 'npc_relatia' ? 0x2a1444 : 0x2b1a10,
      roughness: 0.85,
    });
    const hatGroup = new THREE.Group();
    hatGroup.position.y = 1.95;

    const brim = new THREE.Mesh(brimGeo, hatMat);
    hatGroup.add(brim);

    const tip = new THREE.Mesh(coneGeo, hatMat);
    tip.position.y = 0.3;
    tip.rotation.z = -0.15;
    hatGroup.add(tip);

    group.add(hatGroup);
    hat = hatGroup;

    if (npcId === 'npc_relatia') {
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0xa855f7,
        emissiveIntensity: 2.2,
      });
      for (let o = 0; o < 3; o++) {
        const oGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const orb = new THREE.Mesh(oGeo, orbMat);
        group.add(orb);
        specialOrbs.push(orb);
      }
    }
  } else if (npcId === 'npc_atlas') {
    const helmGeo = new THREE.SphereGeometry(0.24, 14, 14);
    const helmMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const helm = new THREE.Mesh(helmGeo, helmMat);
    helm.position.y = 1.95;
    group.add(helm);

    const crestGeo = new THREE.BoxGeometry(0.06, 0.45, 0.45);
    const crestMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.4 });
    const crest = new THREE.Mesh(crestGeo, crestMat);
    crest.position.set(0, 2.22, -0.05);
    group.add(crest);

    const bladeGeo = new THREE.BoxGeometry(0.12, 2.2, 0.04);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const sword = new THREE.Mesh(bladeGeo, bladeMat);
    sword.position.set(0.6, 1.1, 0.4);
    group.add(sword);
  } else {
    const hoodGeo = new THREE.SphereGeometry(0.25, 14, 14);
    const hoodMat = new THREE.MeshStandardMaterial({ color: 0x0f281e, roughness: 0.8 });
    const hood = new THREE.Mesh(hoodGeo, hoodMat);
    hood.position.y = 1.92;
    group.add(hood);

    const lanternGeo = new THREE.OctahedronGeometry(0.14, 1);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 2.0,
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0.48, 1.1, 0.25);
    group.add(lantern);
  }

  return { group, torso, arms, legs, hat, specialOrbs };
}

function buildDarkSoulsCollectible(scene, cp, idx) {
  const cGroup = new THREE.Group();
  cGroup.position.set(cp.x, 1.3, cp.z);

  let cMesh, lightColor;

  if (cp.type === 'scroll') {
    const bookGeo = new THREE.BoxGeometry(0.4, 0.5, 0.12);
    const bookMat = new THREE.MeshStandardMaterial({
      color: 0x1e1510,
      roughness: 0.5,
      metalness: 0.2,
      emissive: 0xb58925,
      emissiveIntensity: 0.4,
    });
    cMesh = new THREE.Mesh(bookGeo, bookMat);
    lightColor = 0xffa834;
  } else if (cp.type === 'rune') {
    const emberGeo = new THREE.DodecahedronGeometry(0.24, 1);
    const emberMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff3b00,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    cMesh = new THREE.Mesh(emberGeo, emberMat);
    lightColor = 0xff6b22;
  } else {
    const crystalGeo = new THREE.OctahedronGeometry(0.28, 0);
    crystalGeo.scale(0.8, 1.6, 0.8);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xa855f7,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    cMesh = new THREE.Mesh(crystalGeo, crystalMat);
    lightColor = 0xa855f7;
  }

  cMesh.castShadow = true;
  cGroup.add(cMesh);

  const cLight = new THREE.PointLight(lightColor, 2.2, 5);
  cLight.position.y = 0.2;
  cGroup.add(cLight);

  scene.add(cGroup);
  return { id: `collectible_${idx}`, group: cGroup, mesh: cMesh, type: cp.type, name: cp.name, collected: false };
}

// ========================================================
// COMPONENTE PRINCIPAL DEL LIENZO 3D
// ========================================================
export default function GameCanvas3D({ onTalkNpc, onCollectItem, onZoneChange }) {
  const mountRef = useRef(null);
  const [nearbyPrompt, setNearbyPrompt] = useState(null);
  const [controlsHelp, setControlsHelp] = useState(true);

  const callbacksRef = useRef({ onTalkNpc, onCollectItem, onZoneChange });
  useEffect(() => {
    callbacksRef.current = { onTalkNpc, onCollectItem, onZoneChange };
  });

  const stateRef = useRef({
    keys: { w: false, a: false, s: false, d: false, shift: false },
    playerVelocity: new THREE.Vector3(),
    isGrounded: true,
    collectibles: [],
    npcObjects: [],
    braziers: [],
    activeZone: 'zone_bson',
    walkPhase: 0,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // Escena y niebla nocturna gótica
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.FogExp2(0x060a14, 0.022);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 240);
    camera.position.set(0, 8.5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // Luna gigante y halo lunar
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-42, 62, -78);

    const moonGeo = new THREE.SphereGeometry(6.2, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xd6e8fc,
      emissive: 0x9dc6f5,
      emissiveIntensity: 0.9,
      roughness: 0.9,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);

    const haloGeo = new THREE.PlaneGeometry(36, 36);
    const haloTex = createGlowTexture(147, 197, 253);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    moonGroup.add(halo);
    scene.add(moonGroup);

    // Bóveda celeste con estrellas
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 95 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = Math.abs(r * Math.cos(phi)) + 10;
      starPos[i + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.25, transparent: true, opacity: 0.65 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Partículas de ascuas flotantes
    const emberCount = 380;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    const emberVel = new Float32Array(emberCount);
    const emberPhase = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      emberPos[i * 3] = (Math.random() - 0.5) * 70;
      emberPos[i * 3 + 1] = Math.random() * 10;
      emberPos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      emberVel[i] = 0.4 + Math.random() * 0.8;
      emberPhase[i] = Math.random() * Math.PI * 2;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberTex = createGlowTexture(255, 120, 30);
    const emberMat = new THREE.PointsMaterial({
      map: emberTex,
      color: 0xff7a22,
      size: 0.32,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const emberParticles = new THREE.Points(emberGeo, emberMat);
    scene.add(emberParticles);

    // Iluminación
    const hemiLight = new THREE.HemisphereLight(0x182438, 0x05080f, 0.85);
    scene.add(hemiLight);

    const moonLight = new THREE.DirectionalLight(0xaad0f8, 1.35);
    moonLight.position.set(-25, 45, -35);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 120;
    const d = 42;
    moonLight.shadow.camera.left = -d;
    moonLight.shadow.camera.right = d;
    moonLight.shadow.camera.top = d;
    moonLight.shadow.camera.bottom = -d;
    moonLight.shadow.radius = 2.5;
    scene.add(moonLight);

    buildGothicTerrain(scene);
    buildDistantGothicSkyline(scene);

    buildGothicArchway(scene, 0, -16, 0);
    buildGothicArchway(scene, 0, 16, Math.PI);
    buildGothicArchway(scene, -16, 0, Math.PI / 2);
    buildGothicArchway(scene, 16, 0, -Math.PI / 2);

    const brazierPositions = [
      [-3.2, -8], [3.2, -8],
      [-3.2, 8], [3.2, 8],
      [-8, -3.2], [-8, 3.2],
      [8, -3.2], [8, 3.2],
    ];
    stateRef.current.braziers = brazierPositions.map(([bx, bz]) => createBrazier(scene, bx, bz));

    const cragPositions = [
      [-14, -7, 1.2], [13, -9, 1.0], [-12, 11, 1.4], [14, 10, 0.9],
      [-22, 2, 1.6], [21, -3, 1.3], [-7, -22, 1.1], [9, 21, 1.2],
    ];
    cragPositions.forEach(([cx, cz, s]) => buildBasaltCrag(scene, cx, cz, s));

    const treePositions = [
      [-18, -19], [-24, -13], [-11, -25], [19, -17], [25, -13],
      [-19, 19], [-26, 13], [20, 19], [27, 24], [-27, 3], [27, -4],
    ];
    treePositions.forEach(([tx, tz], i) => buildWitheredGothicTree(scene, tx, tz, i));

    const zoneConfigs = [
      { id: 'zone_bson',      name: 'Valle de los Documentos',       x: -16, z: -14, color: 0x10b981, colorHex: '#10b981', npcId: 'npc_bsonia' },
      { id: 'zone_mongoose',  name: 'La Forja de Esquemas',          x: 16,  z: -14, color: 0xff6b2b, colorHex: '#ff6b2b', npcId: 'npc_schemiel' },
      { id: 'zone_relations', name: 'La Aguja de las Relaciones',     x: -16, z: 14,  color: 0xa855f7, colorHex: '#a855f7', npcId: 'npc_relatia' },
      { id: 'zone_sanctum',   name: 'El Sanctum del Gran Custodio',  x: 16,  z: 14,  color: 0xd4af37, colorHex: '#d4af37', npcId: 'npc_atlas' },
    ];

    const altarObjects = zoneConfigs.map((zc) => buildDarkSoulsAltar(scene, zc));

    const npcMeshes = zoneConfigs.map((zc) => {
      const npcModel = createSoulsNPC(zc.npcId);
      npcModel.group.position.set(zc.x, 0.38, zc.z - 1.2);
      scene.add(npcModel.group);

      const haloTorusGeo = new THREE.TorusGeometry(0.25, 0.04, 8, 24);
      const haloTorusMat = new THREE.MeshBasicMaterial({ color: 0xffa834 });
      const marker = new THREE.Mesh(haloTorusGeo, haloTorusMat);
      marker.position.set(zc.x, 3.6, zc.z - 1.2);
      marker.rotation.x = -Math.PI / 2;
      scene.add(marker);

      const npcLight = new THREE.PointLight(zc.color, 1.4, 7);
      npcLight.position.set(zc.x, 1.6, zc.z - 1.2);
      scene.add(npcLight);

      return {
        id: zc.npcId,
        name: NPCS[zc.npcId]?.name,
        title: NPCS[zc.npcId]?.title,
        zoneId: zc.id,
        group: npcModel.group,
        arms: npcModel.arms,
        legs: npcModel.legs,
        hat: npcModel.hat,
        specialOrbs: npcModel.specialOrbs,
        marker,
        worldPos: new THREE.Vector3(zc.x, 0, zc.z - 1.2),
      };
    });

    stateRef.current.npcObjects = npcMeshes;

    const collectibleDefs = [
      { x: -5,  z: -5,  type: 'scroll',  name: 'Fragmento BSON Arcano' },
      { x: 5,   z: -6,  type: 'rune',    name: 'Ascua de Esquema Mongoose' },
      { x: -6,  z: 6,   type: 'crystal', name: 'Cristal de Referencia ObjectId' },
      { x: 6,   z: 6,   type: 'scroll',  name: 'Códice Oscuro de CRUD' },
      { x: 0,   z: -12, type: 'rune',    name: 'Sello Ardiente de Validación' },
      { x: -12, z: 0,   type: 'crystal', name: 'Gema de Poblado .populate' },
    ];
    stateRef.current.collectibles = collectibleDefs.map((cp, idx) => buildDarkSoulsCollectible(scene, cp, idx));

    const playerData = createAshenPlayerMesh();
    const playerGroup = playerData.group;
    playerGroup.position.set(0, 0.38, 5);
    scene.add(playerGroup);

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
          stateRef.current.playerVelocity.y = 6.0;
          stateRef.current.isGrounded = false;
          sound.playSelect();
        }
      }
      if (k === 'e' || k === 'E') {
        if (nearbyRef.current) {
          sound.playSelect();
          callbacksRef.current.onTalkNpc(nearbyRef.current.npcId);
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

    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Animación de partículas de ascuas
      const positions = emberGeo.attributes.position.array;
      for (let i = 0; i < emberCount; i++) {
        positions[i * 3 + 1] += emberVel[i] * delta * 2.2;
        positions[i * 3] += Math.sin(t * 1.4 + emberPhase[i]) * 0.02;
        if (positions[i * 3 + 1] > 11) {
          positions[i * 3 + 1] = 0.2;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;

      // Parpadeo de braseros
      stateRef.current.braziers.forEach((br, i) => {
        br.light.intensity = 2.0 + Math.sin(t * 14 + i * 2.3) * 0.5 + Math.cos(t * 22 + i) * 0.3;
        br.flame.scale.y = 1.0 + Math.sin(t * 12 + i) * 0.2;
        br.flame.rotation.y = t * 2.0;
      });

      // Animación de altares
      altarObjects.forEach((ao, i) => {
        ao.runeMesh.rotation.z = t * 0.2 * (i % 2 === 0 ? 1 : -1);
        ao.orbs.forEach((orb, j) => {
          orb.position.y = 4.4 + Math.sin(t * 2.0 + j * 0.7 + i) * 0.15;
        });
        if (ao.crystals) {
          ao.crystals.forEach((cr, k) => {
            cr.position.y = 1.8 + (k % 3) * 0.4 + Math.sin(t * 2.2 + k) * 0.12;
            cr.rotation.y = t * 1.5;
          });
        }
      });

      // Animación de NPCs
      npcMeshes.forEach((npc, i) => {
        const phase = t * 1.2 + i * 1.5;
        npc.group.rotation.y = Math.sin(t * 0.25 + i) * 0.12;
        npc.arms[0].group.rotation.z = 0.18 + Math.sin(phase) * 0.08;
        npc.arms[1].group.rotation.z = -(0.18 + Math.sin(phase + Math.PI) * 0.08);
        npc.marker.position.y = 3.6 + Math.sin(t * 2.5 + i) * 0.15;
        npc.marker.rotation.z = t * 1.2;

        if (npc.specialOrbs && npc.specialOrbs.length > 0) {
          npc.specialOrbs.forEach((sorb, si) => {
            const orbAngle = t * 2.0 + (si / npc.specialOrbs.length) * Math.PI * 2;
            sorb.position.set(
              Math.cos(orbAngle) * 0.7,
              2.2 + Math.sin(t * 3.0 + si) * 0.18,
              Math.sin(orbAngle) * 0.7
            );
          });
        }
      });

      // Coleccionables
      stateRef.current.collectibles.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y = t * 2.0;
          c.group.position.y = 1.3 + Math.sin(t * 2.6) * 0.18;
          const distToPlayer = playerGroup.position.distanceTo(c.group.position);
          if (distToPlayer < 1.6) {
            c.collected = true;
            c.group.visible = false;
            sound.playSuccess();
            callbacksRef.current.onCollectItem(c);
          }
        }
      });

      // Brandón de fuego del jugador
      if (playerData.weaponFlame) {
        playerData.weaponFlame.scale.y = 1.0 + Math.sin(t * 16) * 0.18;
        playerData.weaponFlame.rotation.y = t * 3.0;
        playerData.weaponLight.intensity = 2.4 + Math.sin(t * 18) * 0.4;
      }

      // Movimiento
      const keys = stateRef.current.keys;
      const speed = keys.shift ? 9.5 : 5.8;
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

        stateRef.current.walkPhase += delta * speed * 3.6;
        const wp = stateRef.current.walkPhase;
        const swingAmp = 0.52;
        playerData.legs[0].group.rotation.x = Math.sin(wp) * swingAmp;
        playerData.legs[1].group.rotation.x = Math.sin(wp + Math.PI) * swingAmp;
        playerData.legs[0].shin.rotation.x = Math.max(0, -Math.sin(wp) * 0.4);
        playerData.legs[1].shin.rotation.x = Math.max(0, -Math.sin(wp + Math.PI) * 0.4);

        playerData.arms[0].group.rotation.x = Math.sin(wp + Math.PI) * 0.4;
        playerData.arms[1].group.rotation.x = Math.sin(wp) * 0.4;

        playerData.cape.rotation.x = 0.4 + Math.sin(wp * 2) * 0.1;
      } else {
        playerData.torso.position.y = 1.15 + Math.sin(t * 1.6) * 0.015;
        playerData.head.position.y = 1.88 + Math.sin(t * 1.6 + 0.3) * 0.012;
        playerData.arms[0].group.rotation.x = Math.sin(t * 1.5) * 0.04;
        playerData.arms[1].group.rotation.x = Math.sin(t * 1.5 + 0.4) * 0.04;
        playerData.legs[0].group.rotation.x = 0;
        playerData.legs[1].group.rotation.x = 0;
        playerData.cape.rotation.x = 0.2 + Math.sin(t * 1.2) * 0.03;
      }

      if (!stateRef.current.isGrounded) {
        stateRef.current.playerVelocity.y -= 19 * delta;
        playerGroup.position.y += stateRef.current.playerVelocity.y * delta;
        if (playerGroup.position.y <= 0.38) {
          playerGroup.position.y = 0.38;
          stateRef.current.playerVelocity.y = 0;
          stateRef.current.isGrounded = true;
        }
      }

      playerGroup.position.x = THREE.MathUtils.clamp(playerGroup.position.x, -37, 37);
      playerGroup.position.z = THREE.MathUtils.clamp(playerGroup.position.z, -37, 37);

      const camOffset = new THREE.Vector3(0, 8.2, 14.0);
      const idealCam = playerGroup.position.clone().add(camOffset);
      camera.position.lerp(idealCam, 6 * delta);
      camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.5, playerGroup.position.z);

      halo.lookAt(camera.position);

      let closest = null;
      let minDist = 4.8;
      npcMeshes.forEach((npc) => {
        const d = playerGroup.position.distanceTo(npc.worldPos);
        if (d < minDist) { closest = npc; minDist = d; }
      });

      nearbyRef.current = closest ? { npcId: closest.id, name: closest.name, title: closest.title, zoneId: closest.zoneId } : null;
      setNearbyPrompt(nearbyRef.current);

      zoneConfigs.forEach((zc) => {
        const d = playerGroup.position.distanceTo(new THREE.Vector3(zc.x, 0, zc.z));
        if (d < 8.5 && stateRef.current.activeZone !== zc.id) {
          stateRef.current.activeZone = zc.id;
          callbacksRef.current.onZoneChange(zc.id);
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
      {/* Banner de Interacción Estilo Souls */}
      {nearbyPrompt && (
        <div className="prompt-3d-interact">
          <div className="prompt-key-badge">E</div>
          <div className="prompt-text-group">
            <span className="prompt-main">Hablar con {nearbyPrompt.name}</span>
            <span className="prompt-sub">{nearbyPrompt.title}</span>
          </div>
          <button className="btn-talk-touch" onClick={() => { sound.playSelect(); callbacksRef.current.onTalkNpc(nearbyPrompt.npcId); }}>
            Dialogar
          </button>
        </div>
      )}

      {/* Leyenda de Controles Gótica */}
      <div className={`controls-3d-legend ${controlsHelp ? 'legend-visible' : 'legend-collapsed'}`}>
        <div className="legend-header" onClick={() => setControlsHelp((prev) => !prev)}>
          <span>⚔️ Controles de Ceniza</span>
          <span className="legend-toggle">{controlsHelp ? '▲' : '▼'}</span>
        </div>
        {controlsHelp && (
          <div className="legend-body">
            <div className="legend-row"><span className="key-tag">W</span><span className="key-tag">A</span><span className="key-tag">S</span><span className="key-tag">D</span><span>Explorar las ruinas</span></div>
            <div className="legend-row"><span className="key-tag">Shift</span><span>Acelerar paso</span></div>
            <div className="legend-row"><span className="key-tag">Espacio</span><span>Saltar obstáculos</span></div>
            <div className="legend-row"><span className="key-tag">E</span><span>Dialogar con Sabios</span></div>
            <div className="legend-row"><span className="key-tag">H</span><span>Ocultar guía</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
