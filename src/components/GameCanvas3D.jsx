import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { NPCS, QUESTS } from '../data/gameData';
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
// HOGUERAS DARK SOULS (BONFIRES) CON MODELO 3D Y TÍTULO FLOTANTE DE MISIÓN
// ============================================================================

// Dibuja un rectángulo con esquinas redondeadas compatible con todos los navegadores
function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

// Genera un Sprite con textura Canvas 2D en alta resolución para el título flotante sobre la hoguera
function createBonfireMissionTitle(zc) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 190;
  const ctx = canvas.getContext('2d');

  const quest = (QUESTS && QUESTS[zc.questId]) ? QUESTS[zc.questId] : {
    title: zc.questTitle || 'Misión del Reino',
  };

  const hexColor = typeof zc.color === 'number'
    ? '#' + zc.color.toString(16).padStart(6, '0')
    : (zc.color || '#f59e0b');

  // Fondo oscuro traslúcido con estética gótica
  ctx.save();
  ctx.fillStyle = 'rgba(8, 12, 18, 0.90)';
  drawRoundedRect(ctx, 14, 14, 612, 162, 22);
  ctx.fill();

  // Borde con resplandor en el color temático de la zona
  ctx.strokeStyle = hexColor;
  ctx.lineWidth = 3.5;
  ctx.shadowColor = hexColor;
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.restore();

  // Insignia superior: p. ej. "✦ MISIÓN I ✦"
  const rawTitle = quest.title || zc.questTitle || '';
  const parts = rawTitle.includes(':') ? rawTitle.split(':') : ['MISIÓN', rawTitle];
  const missionHeader = parts[0].trim().toUpperCase();
  const missionBody = (parts[1] || rawTitle).trim();

  ctx.save();
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillStyle = hexColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = hexColor;
  ctx.shadowBlur = 6;
  ctx.fillText(`✦ ${missionHeader} ✦`, 320, 52);
  ctx.restore();

  // Título principal de la misión
  ctx.save();
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 8;
  ctx.fillText(missionBody, 320, 98);
  ctx.restore();

  // Subtítulo o temática educativa
  const topicText = zc.questTopic || zc.name;
  ctx.save();
  ctx.font = '600 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(topicText, 320, 142);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(3.4, 1.01, 1);
  sprite.position.set(0, 2.95, 0); // Flota justo arriba de la espada de la hoguera

  return { sprite, texture, mat };
}

function buildSoulsBonfires(scene, zoneConfigs, loader) {
  const bonfireObjects = zoneConfigs.map((zc) => {
    const group = new THREE.Group();
    group.position.set(zc.x, 0, zc.z);

    // Contenedor / Ranura para el modelo 3D cargado
    const modelSlot = new THREE.Group();
    group.add(modelSlot);

    // Silueta temporal mientras se procesa la carga del modelo 3D
    const ashGeo = new THREE.ConeGeometry(1.6, 0.45, 12);
    const ashMat = new THREE.MeshStandardMaterial({
      color: 0x1b1c20,
      roughness: 0.95,
    });
    const placeholderAsh = new THREE.Mesh(ashGeo, ashMat);
    placeholderAsh.position.y = 0.2;
    placeholderAsh.receiveShadow = true;
    modelSlot.add(placeholderAsh);

    // Luz suave ambiental de la hoguera (sin fuego invasivo)
    const bonfireLight = new THREE.PointLight(0xffedd5, 1.8, 12, 1.5);
    bonfireLight.position.set(0, 1.4, 0);
    bonfireLight.castShadow = true;
    group.add(bonfireLight);

    // Runa / Mensaje de saponita sutil en el suelo
    const runeCircleGeo = new THREE.RingGeometry(1.8, 2.3, 32);
    const runeCircleMat = new THREE.MeshBasicMaterial({
      color: zc.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const runeCircle = new THREE.Mesh(runeCircleGeo, runeCircleMat);
    runeCircle.rotation.x = -Math.PI / 2;
    runeCircle.position.y = 0.03;
    group.add(runeCircle);

    // Título flotante arriba sobre la misión a que hace referencia
    const titleData = createBonfireMissionTitle(zc);
    group.add(titleData.sprite);

    scene.add(group);
    return {
      group,
      modelSlot,
      placeholderAsh,
      bonfireLight,
      runeCircle,
      titleSprite: titleData.sprite,
      titleTexture: titleData.texture,
      titleMat: titleData.mat,
      zoneId: zc.id,
    };
  });

  // Carga del modelo 3D de hoguera oficial de Dark Souls
  loader.load(
    '/models/bonfire_-_dark_souls.glb',
    (gltf) => {
      const model = gltf.scene;

      // Remover paredes y suelo del diorama original para integrarse al mundo
      const toRemove = [];
      model.traverse((child) => {
        if (child.name.toLowerCase().includes('wall') || child.name.toLowerCase().includes('ground')) {
          toRemove.push(child);
        }
      });
      toRemove.forEach((c) => c.parent && c.parent.remove(c));

      // Habilitar sombras y afinar materiales PBR
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = Math.max(0.32, child.material.roughness ?? 0.7);
            child.material.needsUpdate = true;
          }
        }
      });

      // Normalizar escala (altura 2.2m) y centrar base en (0, 0, 0)
      const initialBox = new THREE.Box3().setFromObject(model);
      const initialSize = initialBox.getSize(new THREE.Vector3());
      const targetHeight = 2.2;
      const scale = targetHeight / (initialSize.y || 1);
      model.scale.setScalar(scale);

      model.updateMatrixWorld(true);
      const updatedBox = new THREE.Box3().setFromObject(model);
      const updatedCenter = updatedBox.getCenter(new THREE.Vector3());
      model.position.set(-updatedCenter.x, -updatedBox.min.y, -updatedCenter.z);

      const template = new THREE.Group();
      template.add(model);
      template.updateMatrixWorld(true);

      // Distribuir modelo clonado a cada hoguera activa
      bonfireObjects.forEach((bf, idx) => {
        if (bf.placeholderAsh) {
          bf.modelSlot.remove(bf.placeholderAsh);
          bf.placeholderAsh.geometry.dispose();
          bf.placeholderAsh.material.dispose();
          bf.placeholderAsh = null;
        }

        const clone = template.clone(true);
        // Ligera rotación estética entre zonas
        clone.rotation.y = (idx * Math.PI) / 2 + 0.35;
        bf.modelSlot.add(clone);
      });
    },
    undefined,
    (error) => {
      console.error('Error al cargar bonfire_-_dark_souls.glb:', error);
    }
  );

  return bonfireObjects;
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
      positions[i * 3] = x + Math.cos(angle) * 0.2;
      positions[i * 3 + 1] = y + 0.06 + Math.random() * 0.08;
      positions[i * 3 + 2] = z + Math.sin(angle) * 0.2;

      velocities[i * 3] = Math.cos(angle) * rSpeed;
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
          positions[i * 3] += velocities[i * 3] * delta;
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
    { x: 16, z: -14, r: 1.55 },
    { x: -16, z: 14, r: 1.55 },
    { x: 16, z: 14, r: 1.55 },
    // 4 Sabios / NPCs de Dark Souls
    { x: -13.8, z: -14, r: 0.95 },
    { x: 18.2, z: -14, r: 0.95 },
    { x: -13.8, z: 14, r: 0.95 },
    { x: 18.2, z: 14, r: 0.95 },
    // 8 Farolas de hierro góticas
    { x: -8, z: -8, r: 0.48 },
    { x: 8, z: -8, r: 0.48 },
    { x: -18, z: 4, r: 0.48 },
    { x: 18, z: 4, r: 0.48 },
    { x: -6, z: 18, r: 0.48 },
    { x: 6, z: 18, r: 0.48 },
    { x: -22, z: -18, r: 0.48 },
    { x: 22, z: -18, r: 0.48 },
    // 4 Grandes Torres / Agujas góticas perimetrales
    { x: -34, z: -28, r: 2.8 },
    { x: 34, z: -28, r: 2.8 },
    { x: -32, z: 28, r: 2.8 },
    { x: 32, z: 28, r: 2.8 },
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
    { minX: 2.5, maxX: 17.5, minZ: -18.7, maxZ: -17.3 },
    { minX: -18.7, maxX: -17.3, minZ: 2.5, maxZ: 17.5 },
    { minX: 17.3, maxX: 18.7, minZ: 2.5, maxZ: 17.5 },
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

      // Habilitar sombras y optimizar materiales PBR con mayor luminosidad y brillo
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = true;
          if (child.material) {
            child.material.roughness = Math.min(0.52, child.material.roughness ?? 0.6);
            child.material.metalness = Math.min(0.35, child.material.metalness ?? 0.2);
            // Realce de color y brillo en el modelo del mago
            if (child.material.color) {
              child.material.color.multiplyScalar(1.5);
            }
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

      // Luz frontal de realce para rostro, báculo y vestiduras del mago
      const wizardFillLight = new THREE.PointLight(0xfff7ed, 2.6, 6.0, 1.2);
      wizardFillLight.position.set(0, 1.8, 1.4);
      innerGroup.add(wizardFillLight);

      // Aura / Rim light arcano en la espalda y hombros
      const wizardLight = new THREE.PointLight(0x60a5fa, 3.4, 8.5, 1.2);
      wizardLight.position.set(0, 2.0, -1.0);
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
// MODELOS 3D DE NPCs DE MISIONES
// ============================================================================
const NPC_CONFIGS = {
  npc_bsonia: {
    modelFile: '/models/dark_knight_-_hitem3d_hi3d_vs_supavoxel_test.glb',
    targetHeight: 2.3,
    color: 0x10b981,
    baseRotY: -Math.PI / 4,
  },
  npc_schemiel: {
    modelFile: '/models/voidbound_necromancer.glb',
    targetHeight: 2.35,
    color: 0xf59e0b,
    baseRotY: -3 * Math.PI / 4,
  },
  npc_relatia: {
    modelFile: '/models/knight_artorias.glb',
    targetHeight: 2.3,
    color: 0x38bdf8,
    baseRotY: Math.PI / 4,
    brightness: 0.55,
  },
  npc_atlas: {
    modelFile: '/models/knight_artorias.glb',
    targetHeight: 2.45,
    color: 0xa855f7,
    baseRotY: 3 * Math.PI / 4,
  },
  npc_scribe: {
    modelFile: '/models/ember_winged_fallen_angel_warrior.glb',
    targetHeight: 2.2,
    color: 0xf97316,
    baseRotY: Math.PI / 4,
  },
  npc_archivist: {
    modelFile: '/models/knight_artorias.glb',
    targetHeight: 2.2,
    color: 0xeab308,
    baseRotY: -Math.PI / 4,
  },
  npc_gardener: {
    modelFile: '/models/lowpoly_pbr_knight_armour.glb',
    targetHeight: 2.2,
    color: 0x22c55e,
    baseRotY: Math.PI / 2,
  },
  npc_pathfinder: {
    modelFile: '/models/mastercraft_mithril_armor_set_for_beyond_skyrim2.glb',
    targetHeight: 2.2,
    color: 0x06b6d4,
    baseRotY: -Math.PI / 2,
  },
  npc_guardian: {
    modelFile: '/models/dark_knight_-_hitem3d_hi3d_vs_supavoxel_test.glb',
    targetHeight: 2.2,
    color: 0x8b5cf6,
    baseRotY: Math.PI,
  },
  npc_keeper: {
    modelFile: '/models/mastercraft_mithril_armor_set_for_beyond_skyrim2.glb',
    targetHeight: 2.2,
    color: 0xec4899,
    baseRotY: 0,
  },
};

function buildSoulsNPCs(scene, zoneConfigs, loader) {
  const npcMeshes = zoneConfigs.map((zc) => {
    const config = NPC_CONFIGS[zc.npcId] || {
      modelFile: '/models/witch_hunter_in_long_coat_and_wide_hat.glb',
      targetHeight: 2.3,
      color: zc.color,
      baseRotY: -Math.PI / 4,
    };

    const group = new THREE.Group();
    group.position.set(zc.x + 2.2, 0, zc.z);
    group.rotation.y = config.baseRotY;

    // Sombra de contacto suave en el piso
    const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    // Ranura para el modelo 3D cargado
    const modelSlot = new THREE.Group();
    group.add(modelSlot);

    // Silueta estilizada temporal mientras finaliza la carga del modelo
    const placeholderGeo = new THREE.CylinderGeometry(0.26, 0.52, 1.7, 12);
    const placeholderMat = new THREE.MeshStandardMaterial({
      color: 0x161c24,
      roughness: 0.8,
      emissive: config.color,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.75,
    });
    const placeholderMesh = new THREE.Mesh(placeholderGeo, placeholderMat);
    placeholderMesh.position.y = 0.85;
    placeholderMesh.castShadow = true;
    modelSlot.add(placeholderMesh);

    // Aura mística de iluminación en el color representativo del NPC (brillo aumentado)
    const auraLight = new THREE.PointLight(config.color, 3.2 * (config.brightness ?? 1), 7.5, 1.2);
    auraLight.position.set(0, 2.0, 0);
    group.add(auraLight);

    // Luz frontal de realce suave para destacar rostro, ropaje y detalles de los modelos GLB
    const npcFrontFill = new THREE.PointLight(0xfff8ee, 2.8 * (config.brightness ?? 1), 6.0, 1.2);
    npcFrontFill.position.set(0, 1.8, 1.3);
    group.add(npcFrontFill);

    // Baliza / Marcador sutil de diálogo (Torus dorado flotante)
    const markerGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 20);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.set(zc.x + 2.2, 2.5, zc.z);
    marker.rotation.x = -Math.PI / 2;
    scene.add(marker);

    const missionSign = zc.hasBonfire === false ? createBonfireMissionTitle(zc) : null;
    if (missionSign) {
      missionSign.sprite.position.y = 3.35;
      group.add(missionSign.sprite);
    }

    scene.add(group);

    return {
      id: zc.npcId,
      name: NPCS[zc.npcId]?.name,
      title: NPCS[zc.npcId]?.title,
      zoneId: zc.id,
      config,
      group,
      modelSlot,
      placeholderMesh,
      marker,
      missionSign,
      worldPos: new THREE.Vector3(zc.x + 2.2, 0, zc.z),
      baseRotY: config.baseRotY,
    };
  });

  // Cargar los archivos GLB de los modelos requeridos
  const uniqueFiles = [...new Set(Object.values(NPC_CONFIGS).map((c) => c.modelFile))];

  uniqueFiles.forEach((file) => {
    loader.load(
      file,
      (gltf) => {
        const model = gltf.scene;

        // Configuración de sombras y materiales PBR con brillo realzado
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.min(0.48, child.material.roughness ?? 0.6);
              child.material.metalness = Math.min(0.4, child.material.metalness ?? 0.2);
              // Multiplicador de brillo para que los NPCs resalten y se vean radiantes
              if (child.material.color) {
                child.material.color.multiplyScalar(1);
              }
              child.material.needsUpdate = true;
            }
          }
        });

        // Distribuir a los NPCs correspondientes
        npcMeshes.forEach((npc) => {
          if (npc.config.modelFile === file) {
            // Remover silueta temporal
            if (npc.placeholderMesh) {
              npc.modelSlot.remove(npc.placeholderMesh);
              npc.placeholderMesh.geometry.dispose();
              npc.placeholderMesh.material.dispose();
              npc.placeholderMesh = null;
            }

            // Clonar modelo y normalizar escala / anclaje
            const instance = model.clone(true);
            if (npc.config.brightness < 1) {
              instance.traverse((child) => {
                if (!child.isMesh || !child.material) return;
                child.material = Array.isArray(child.material)
                  ? child.material.map((material) => material.clone())
                  : child.material.clone();
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material) => {
                  if (material.emissive) {
                    material.emissiveIntensity *= npc.config.brightness;
                  }
                });
              });
            }
            const initialBox = new THREE.Box3().setFromObject(instance);
            const initialSize = initialBox.getSize(new THREE.Vector3());
            const scale = npc.config.targetHeight / (initialSize.y || 1);
            instance.scale.setScalar(scale);

            instance.updateMatrixWorld(true);
            const updatedBox = new THREE.Box3().setFromObject(instance);
            const updatedCenter = updatedBox.getCenter(new THREE.Vector3());
            instance.position.set(-updatedCenter.x, -updatedBox.min.y, -updatedCenter.z);

            const wrapper = new THREE.Group();
            wrapper.add(instance);
            npc.modelSlot.add(wrapper);
          }
        });
      },
      undefined,
      (err) => {
        console.error(`Error al cargar modelo de NPC (${file}):`, err);
      }
    );
  });

  return npcMeshes;
}

// ============================================================================
// COMPONENTE PRINCIPAL: LIENZO 3D DARK SOULS 3 (IRITHYLL ESTILO ARTÍSTICO)
// ============================================================================
export default function GameCanvas3D({ player, onTalkNpc, onZoneChange }) {
  const mountRef = useRef(null);
  const [nearbyPrompt, setNearbyPrompt] = useState(null);
  const [controlsHelp, setControlsHelp] = useState(false);
  const [isDayTime, setIsDayTime] = useState(true);

  const stateRef = useRef({
    keys: { w: false, a: false, s: false, d: false, shift: false },
    playerVelocity: new THREE.Vector3(),
    prevVelocity: new THREE.Vector3(),
    currentRotation: 0,
    targetRotation: 0,
    isGrounded: true,
    npcObjects: [],
    activeZone: 'zone_bson',
    walkPhase: 0,
    snowParticles: null,
    camLookTarget: new THREE.Vector3(0, 1.8, 0),
    // Cámara orbital libre con mouse
    camYaw: 0.0,
    camPitch: 0.38,
    camDist: 8.6,
    isDraggingMouse: false,
    prevMousePos: { x: 0, y: 0 },
    // Ciclo Día / Noche (0.0 = Noche, 1.0 = Día)
    dayFactor: 1.0,
    targetDayFactor: 1.0,
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

    // ─── 1. ESCENA Y NIEBLA DINÁMICA DE IRITHYLL ────────────────
    const scene = new THREE.Scene();
    const skyColor = new THREE.Color(0x0c131d);
    scene.background = skyColor;
    scene.fog = new THREE.FogExp2(0x0d1522, 0.020);

    // ─── 2. CÁMARA TERCERA PERSONA ─────────────────────────────
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 260);
    camera.position.set(0, 5.5, 12.5);

    // ─── 3. RENDERER CINEMATOGRÁFICO DE ALTO RENDIMIENTO ────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    // Limitar pixel ratio a 1.5 — por encima no hay ganancia visual perceptible
    // pero sí coste cuadrático de rasterizado (4x píxeles en pantallas Retina 2x)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    // PCFShadowMap es 2-3x más rápido que PCFSoftShadowMap con calidad casi idéntica a esta escala
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    mount.appendChild(renderer.domElement);

    // ─── 4. LUNA, SOL Y CIELO ESTRELLADO ────────────────────────
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
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

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

    // Sol radiante diurno
    const sunGeo = new THREE.SphereGeometry(7.0, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(35, -45, 75);
    scene.add(sun);

    // ─── 5. ILUMINACIÓN DINÁMICA (CICLO DÍA / NOCHE) ────────────
    const hemiLight = new THREE.HemisphereLight(0x1a2638, 0x090d14, 1.15);
    scene.add(hemiLight);

    const mainDirLight = new THREE.DirectionalLight(0x9eb8d4, 1.7);
    mainDirLight.position.set(-25, 45, -30);
    mainDirLight.castShadow = true;
    // Shadow map 1024 — suficiente para el área de juego visible; 2048 triplicaba el coste GPU
    mainDirLight.shadow.mapSize.width = 1024;
    mainDirLight.shadow.mapSize.height = 1024;
    mainDirLight.shadow.camera.near = 0.5;
    mainDirLight.shadow.camera.far = 130;
    const shadowDist = 42;
    mainDirLight.shadow.camera.left = -shadowDist;
    mainDirLight.shadow.camera.right = shadowDist;
    mainDirLight.shadow.camera.top = shadowDist;
    mainDirLight.shadow.camera.bottom = -shadowDist;
    mainDirLight.shadow.bias = -0.0005;
    scene.add(mainDirLight);

    // Paletas de color para lerp suave día/noche
    const nightSkyColor = new THREE.Color(0x0c131d);
    const daySkyColor = new THREE.Color(0x5688c7);

    const nightFogColor = new THREE.Color(0x0d1522);
    const dayFogColor = new THREE.Color(0x7da8d7);

    const nightHemiSky = new THREE.Color(0x1a2638);
    const dayHemiSky = new THREE.Color(0xfff3db);
    const nightHemiGround = new THREE.Color(0x090d14);
    const dayHemiGround = new THREE.Color(0x524e49);

    const nightDirColor = new THREE.Color(0x9eb8d4);
    const dayDirColor = new THREE.Color(0xffeed0);

    const nightDirPos = new THREE.Vector3(-25, 45, -30);
    const dayDirPos = new THREE.Vector3(30, 55, 25);

    // ─── 6. PARTÍCULAS DE NIEVE Y CENIZA GÉLIDA (BLIZZARD) ──────
    // 600 partículas — visualmente indistinguible de 1400 con la densidad de la niebla
    const snowCount = 600;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    const snowVel = new Float32Array(snowCount);
    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * 80;
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
    stateRef.current.snowParticles = { points: snowPoints, geo: snowGeo, vel: snowVel, arr: snowPos };

    // ─── 7. CONSTRUCCIÓN DEL MUNDO GÓTICO ────────────────────────
    buildSoulsCourtyardGround(scene);
    buildGothicCourtyardWalls(scene);
    buildGrandCathedral(scene);

    // ─── 8. HOGUERAS DE ZONA (BONFIRES) ─────────────────────────
    const zoneConfigs = [
      {
        id: 'zone_bson',
        name: 'Hoguera del Archivo BSON',
        x: -16,
        z: -14,
        color: 0x10b981,
        npcId: 'npc_bsonia',
        questId: 'quest_1',
        questTitle: 'Misión I: El Catálogo Desordenado',
        questTopic: 'MongoDB & Documentos BSON',
      },
      {
        id: 'zone_mongoose',
        name: 'Hoguera de la Forja de Esquemas',
        x: 16,
        z: -14,
        color: 0xf59e0b,
        npcId: 'npc_schemiel',
        questId: 'quest_2',
        questTitle: 'Misión II: El Sello de Validación',
        questTopic: 'Mongoose ODM & Schemas',
      },
      {
        id: 'zone_relations',
        name: 'Hoguera de la Torre de Enlaces',
        x: -15,
        z: 14,
        color: 0x38bdf8,
        npcId: 'npc_relatia',
        questId: 'quest_3',
        questTitle: 'Misión III: El Dilema de las Relaciones',
        questTopic: 'Modelado: Subdocumentos vs ObjectId',
      },
      {
        id: 'zone_sanctum',
        name: 'Hoguera del Santuario del Custodio',
        x: 14,
        z: 14,
        color: 0xa855f7,
        npcId: 'npc_atlas',
        questId: 'quest_4',
        questTitle: 'Misión Final: El Juicio del Custodio',
        questTopic: 'Prueba Integradora y Graduación',
      },
      {
        id: 'zone_document_hall',
        name: 'Galería de Claves y Valores',
        x: -3,
        z: -23,
        color: 0xf97316,
        npcId: 'npc_scribe',
        questId: 'quest_5',
        questTitle: 'Misión Secundaria: El Archivo de Claves',
        questTopic: 'Estructura de documentos',
        hasBonfire: false,
      },
      {
        id: 'zone_bson_archive',
        name: 'Archivo de Tipos BSON',
        x: 5,
        z: 23,
        color: 0xeab308,
        npcId: 'npc_archivist',
        questId: 'quest_6',
        questTitle: 'Misión Secundaria: El Espejo BSON',
        questTopic: 'BSON y tipos de datos',
        hasBonfire: false,
      },
      {
        id: 'zone_nested_garden',
        name: 'Jardín de Documentos Anidados',
        x: 24,
        z: 0,
        color: 0x22c55e,
        npcId: 'npc_gardener',
        questId: 'quest_7',
        questTitle: 'Misión Secundaria: El Jardín Anidado',
        questTopic: 'Documentos y arreglos',
        hasBonfire: false,
      },
      {
        id: 'zone_dot_tower',
        name: 'Torre de la Notación de Puntos',
        x: -7,
        z: 23,
        color: 0x06b6d4,
        npcId: 'npc_pathfinder',
        questId: 'quest_8',
        questTitle: 'Misión Secundaria: La Ruta de los Puntos',
        questTopic: 'Campos anidados y arreglos',
        hasBonfire: false,
      },
      {
        id: 'zone_id_vault',
        name: 'Bóveda de Identificadores',
        x: -24,
        z: 23,
        color: 0x8b5cf6,
        npcId: 'npc_guardian',
        questId: 'quest_9',
        questTitle: 'Misión Secundaria: La Bóveda de _id',
        questTopic: '_id y nombres de campo',
        hasBonfire: false,
      },
      {
        id: 'zone_gridfs_gate',
        name: 'Umbral de GridFS',
        x: -24,
        z: 0,
        color: 0xec4899,
        npcId: 'npc_keeper',
        questId: 'quest_10',
        questTitle: 'Misión Secundaria: El Umbral de 16 MiB',
        questTopic: 'Tamaño de documentos',
        hasBonfire: false,
      },
    ];

    const gltfLoader = new GLTFLoader();
    const bonfireObjects = buildSoulsBonfires(
      scene,
      zoneConfigs.filter((zone) => zone.hasBonfire !== false),
      gltfLoader
    );

    // ─── 9. NPCs DE DARK SOULS (SABIOS Y CUSTODIOS) ─────────────
    const npcMeshes = buildSoulsNPCs(scene, zoneConfigs, gltfLoader);
    stateRef.current.npcObjects = npcMeshes;

    // ─── 11. PERSONAJE JUGADOR: MAGO ARTICULADO (GLTF RIGGED) ─
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 4);
    scene.add(playerGroup);

    const playerData = loadWizardCharacter(scene, playerGroup);

    // ─── 12. ENTRADA DE TECLADO ─────────────────────────────────
    const nearbyRef = { current: null };

    const handleKeyDown = (e) => {
      const k = e.key;
      if (k === 'w' || k === 'W' || k === 'ArrowUp') stateRef.current.keys.w = true;
      if (k === 's' || k === 'S' || k === 'ArrowDown') stateRef.current.keys.s = true;
      if (k === 'a' || k === 'A' || k === 'ArrowLeft') stateRef.current.keys.a = true;
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
      if (k === 'w' || k === 'W' || k === 'ArrowUp') stateRef.current.keys.w = false;
      if (k === 's' || k === 'S' || k === 'ArrowDown') stateRef.current.keys.s = false;
      if (k === 'a' || k === 'A' || k === 'ArrowLeft') stateRef.current.keys.a = false;
      if (k === 'd' || k === 'D' || k === 'ArrowRight') stateRef.current.keys.d = false;
      if (k === 'Shift') stateRef.current.keys.shift = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ─── 13. CONTROL DE CÁMARA LIBRE CON MOUSE (ROTACIÓN Y ZOOM) ──
    const handlePointerDown = (e) => {
      // Ignorar clicks si provienen de botones UI superpuestos
      if (e.target !== renderer.domElement) return;
      stateRef.current.isDraggingMouse = true;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e) => {
      if (!stateRef.current.isDraggingMouse) return;
      const dx = e.clientX - stateRef.current.prevMousePos.x;
      const dy = e.clientY - stateRef.current.prevMousePos.y;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };

      const rotSpeed = 0.0055;
      stateRef.current.camYaw -= dx * rotSpeed;
      stateRef.current.camPitch += dy * rotSpeed;

      // Clampear pitch vertical para vista limpia (sin pasar bajo el suelo ni invertir)
      stateRef.current.camPitch = THREE.MathUtils.clamp(
        stateRef.current.camPitch,
        0.06,
        1.32
      );
    };

    const handlePointerUp = () => {
      stateRef.current.isDraggingMouse = false;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      stateRef.current.camDist = THREE.MathUtils.clamp(
        stateRef.current.camDist + e.deltaY * 0.008,
        4.2,
        16.5
      );
    };

    const handleContextMenu = (e) => e.preventDefault();

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'none';

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    mount.addEventListener('wheel', handleWheel, { passive: false });
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);

    // ─── 13. MOTOR DE FÍSICA Y ANIMACIÓN CINEMATOGRÁFICA ─────────
    let raf;
    const clock = new THREE.Clock();

    // Pre-alocar objetos reutilizables para evitar GC pressure en el loop (60fps × new Vector3 = miles de objetos/seg)
    const _targetLook = new THREE.Vector3();
    const _idealCamPos = new THREE.Vector3();
    const _zoneVec = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Animación de hogueras y títulos flotantes de misión
      bonfireObjects.forEach((bf, i) => {
        if (bf.bonfireLight) {
          const flicker = 1.0 + Math.sin(t * 5 + i * 2.0) * 0.1;
          bf.bonfireLight.intensity = 1.8 * flicker;
        }
        if (bf.runeCircle) bf.runeCircle.rotation.z = t * 0.2;
        if (bf.titleSprite) {
          bf.titleSprite.position.y = 2.95 + Math.sin(t * 2.2 + i * 1.5) * 0.08;
        }
      });

      // Animación de nieve y ventisca de Irithyll
      if (stateRef.current.snowParticles) {
        // Acceso directo al Float32Array en lugar de getX/getY/setX/setY
        // Elimina ~4800 llamadas a métodos de THREE por frame (600 partículas × 8 calls)
        const { arr, geo, vel } = stateRef.current.snowParticles;
        for (let i = 0; i < snowCount; i++) {
          const base = i * 3;
          arr[base + 1] -= vel[i];
          if (arr[base + 1] < 0) arr[base + 1] = 28;
          arr[base] += Math.sin(t * 0.8 + i) * 0.015;
        }
        geo.attributes.position.needsUpdate = true;
      }

      // Animación de NPCs (respiración solemne, orientación hacia el jugador y baliza)
      npcMeshes.forEach((npc, i) => {
        npc.marker.position.y = 2.5 + Math.sin(t * 2.2 + i) * 0.12;
        npc.marker.rotation.z = t * 1.2;
        if (npc.missionSign) {
          npc.missionSign.sprite.position.y = 3.35 + Math.sin(t * 2.2 + i * 1.5) * 0.08;
        }

        // Orientación dinámica hacia el jugador cuando está en proximidad (< 6.5m)
        const distToPlayer = playerGroup.position.distanceTo(npc.worldPos);
        let targetAngle = npc.baseRotY;
        if (distToPlayer < 6.5) {
          const dx = playerGroup.position.x - npc.worldPos.x;
          const dz = playerGroup.position.z - npc.worldPos.z;
          targetAngle = Math.atan2(dx, dz);
        }
        let diff = targetAngle - npc.group.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        npc.group.rotation.y += diff * Math.min(1, 3.5 * delta);

        if (npc.modelSlot) {
          npc.modelSlot.position.y = Math.sin(t * 1.8 + i) * 0.02;
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

      // Vector de entrada de dirección relativo a la orientación de la cámara libre
      const rawX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
      const rawZ = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
      const inputDir = new THREE.Vector3();
      const hasInput = rawX !== 0 || rawZ !== 0;
      if (hasInput) {
        // Rotar el input según el ángulo horizontal (camYaw) de la cámara
        const inputAngle = Math.atan2(rawX, rawZ) + stateRef.current.camYaw;
        inputDir.set(Math.sin(inputAngle), 0, Math.cos(inputAngle)).normalize();
      }

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

      // ─── CÁMARA SPRING-ARM ORBITAL LIBRE CON ANTICIPACIÓN (LOOK-AHEAD) ───
      const sprintCamPull = (currentSpeed / maxRunSpeed) * 1.0;
      const effectiveDist = stateRef.current.camDist + sprintCamPull;

      // Objetivo de mirada hacia el personaje con anticipación sutil (Vector3 pre-alocado)
      _targetLook.set(
        playerGroup.position.x + vel.x * 0.08,
        playerGroup.position.y + 1.85,
        playerGroup.position.z + vel.z * 0.08
      );
      stateRef.current.camLookTarget.lerp(_targetLook, 9.0 * delta);

      // Coordenadas esféricas de la cámara alrededor del punto de mira
      const cosPitch = Math.cos(stateRef.current.camPitch);
      const sinPitch = Math.sin(stateRef.current.camPitch);
      const sinYaw = Math.sin(stateRef.current.camYaw);
      const cosYaw = Math.cos(stateRef.current.camYaw);

      // Reutilizar _idealCamPos pre-alocado
      _idealCamPos.set(
        stateRef.current.camLookTarget.x + effectiveDist * cosPitch * sinYaw,
        stateRef.current.camLookTarget.y + effectiveDist * sinPitch,
        stateRef.current.camLookTarget.z + effectiveDist * cosPitch * cosYaw
      );
      camera.position.lerp(_idealCamPos, 10.0 * delta);
      camera.lookAt(stateRef.current.camLookTarget);

      // ─── INTERACCIÓN DE HOGUERAS Y SABIOS ─────────────────────
      let closest = null;
      let minDist = 4.8;
      npcMeshes.forEach((npc) => {
        const d = playerGroup.position.distanceTo(npc.worldPos);
        if (d < minDist) { closest = npc; minDist = d; }
      });

      const newPrompt = closest ? { npcId: closest.id, name: closest.name, title: closest.title, zoneId: closest.zoneId } : null;
      // Solo actualizar estado React si cambió — evita re-render cada frame
      if (nearbyRef.current?.npcId !== newPrompt?.npcId) {
        nearbyRef.current = newPrompt;
        setNearbyPrompt(newPrompt);
      }

      // Detección de cambio de zona (Vector3 pre-alocado, sin alloc por frame)
      zoneConfigs.forEach((zc) => {
        _zoneVec.set(zc.x, 0, zc.z);
        const d = playerGroup.position.distanceTo(_zoneVec);
        if (d < 8 && stateRef.current.activeZone !== zc.id) {
          stateRef.current.activeZone = zc.id;
          onZoneChange(zc.id);
        }
      });

      // ─── TRANSICIÓN CINEMATOGRÁFICA DÍA / NOCHE (LERP) ─────────
      stateRef.current.dayFactor = THREE.MathUtils.lerp(
        stateRef.current.dayFactor,
        stateRef.current.targetDayFactor,
        2.2 * delta
      );
      const df = stateRef.current.dayFactor;

      scene.background.lerpColors(nightSkyColor, daySkyColor, df);
      scene.fog.color.lerpColors(nightFogColor, dayFogColor, df);
      scene.fog.density = THREE.MathUtils.lerp(0.020, 0.009, df);

      hemiLight.color.lerpColors(nightHemiSky, dayHemiSky, df);
      hemiLight.groundColor.lerpColors(nightHemiGround, dayHemiGround, df);
      hemiLight.intensity = THREE.MathUtils.lerp(1.15, 1.85, df);

      mainDirLight.color.lerpColors(nightDirColor, dayDirColor, df);
      mainDirLight.intensity = THREE.MathUtils.lerp(1.7, 3.2, df);
      mainDirLight.position.lerpVectors(nightDirPos, dayDirPos, df);

      moon.position.y = THREE.MathUtils.lerp(65, -45, df);
      sun.position.y = THREE.MathUtils.lerp(-45, 65, df);

      starMat.opacity = Math.max(0, 0.75 * (1.0 - df * 1.6));
      if (stateRef.current.snowParticles) {
        stateRef.current.snowParticles.points.material.opacity = THREE.MathUtils.lerp(0.7, 0.22, df);
      }

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
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
        renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      mount.removeEventListener('wheel', handleWheel);
      playerData.dispose();
      bonfireObjects.forEach((bf) => {
        if (bf.titleTexture) bf.titleTexture.dispose();
        if (bf.titleMat) bf.titleMat.dispose();
      });
      npcMeshes.forEach((npc) => {
        if (npc.missionSign?.texture) npc.missionSign.texture.dispose();
        if (npc.missionSign?.mat) npc.missionSign.mat.dispose();
      });
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="canvas-3d-wrapper souls-theme" ref={mountRef}>
      {/* Botón de Transición Día / Noche */}
      <div className="souls-environment-bar">
        <button
          type="button"
          className={`souls-btn-daynight ${isDayTime ? 'is-day' : 'is-night'}`}
          onClick={() => {
            sound.playSelect();
            setIsDayTime((prev) => {
              const next = !prev;
              stateRef.current.targetDayFactor = next ? 1.0 : 0.0;
              return next;
            });
          }}
          title="Alternar ciclo Día / Noche en tiempo real"
        >
          <span className="daynight-icon">{isDayTime ? '☀️' : '🌙'}</span>
          <span className="daynight-label">{isDayTime ? 'Modo Día' : 'Modo Noche'}</span>
        </button>
      </div>

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
              <span className="key-tag">Mouse</span>
              <span>Arrastrar para girar cámara libre</span>
            </div>
            <div className="legend-row">
              <span className="key-tag">Rueda</span>
              <span>Zoom alejar / acercar</span>
            </div>
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
