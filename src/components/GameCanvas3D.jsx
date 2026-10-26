import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ZONES, NPCS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function GameCanvas3D({
  player,
  onTalkNpc,
  onCollectItem,
  onZoneChange
}) {
  const mountRef = useRef(null);
  const [nearbyPrompt, setNearbyPrompt] = useState(null);
  const [controlsHelp, setControlsHelp] = useState(true);

  // Referencias mutables para el ciclo de animación
  const stateRef = useRef({
    keys: { w: false, a: false, s: false, d: false, shift: false, space: false },
    playerPos: new THREE.Vector3(0, 0, 5),
    playerVelocity: new THREE.Vector3(),
    playerRotation: 0,
    isGrounded: true,
    collectibles: [],
    npcObjects: [],
    zoneTriggers: [],
    clock: new THREE.Clock(),
    activeZone: 'zone_bson'
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Escena, Cámara y Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.025);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    camera.position.set(0, 8, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // 2. Iluminación Ambiental y Direccional (Mágica de Fantasía)
    const ambientLight = new THREE.AmbientLight(0x384260, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xa5f3fc, 1.5);
    sunLight.position.set(20, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    const d = 35;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // 3. Suelo / Terreno con Zonas Temáticas
    const floorGeo = new THREE.PlaneGeometry(100, 100, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Senderos de piedra entre las zonas
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const createPath = (w, h, x, z, rot = 0) => {
      const pGeo = new THREE.PlaneGeometry(w, h);
      const pMesh = new THREE.Mesh(pGeo, pathMat);
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.rotation.z = rot;
      pMesh.position.set(x, 0.02, z);
      pMesh.receiveShadow = true;
      scene.add(pMesh);
    };
    createPath(6, 45, 0, 0, 0);       // Sendero Norte-Sur
    createPath(6, 45, 0, 0, Math.PI/2); // Sendero Este-Oeste

    // Decoraciones del Entorno: Árboles arcanos y Rocas de Cristal
    const treeTrunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3, 6);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const foliageGeo = new THREE.DodecahedronGeometry(1.6);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.7 });

    const createTree = (x, z) => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 1.5;
      trunk.castShadow = true;
      group.add(trunk);

      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 3.6;
      foliage.castShadow = true;
      group.add(foliage);

      group.position.set(x, 0, z);
      scene.add(group);
    };

    // Colocar árboles en las esquinas y bordes
    const treePositions = [
      [-15, -15], [-20, -10], [-10, -22], [15, -15], [22, -12],
      [-16, 16], [-22, 10], [16, 16], [20, 20], [-25, 0], [25, 0], [0, -25]
    ];
    treePositions.forEach(([x, z]) => createTree(x, z));

    // 4. Las 4 ZONAS / DISTRITOS TEMÁTICOS EN 3D
    // Coordenadas fijas para cada zona:
    const zoneConfigs = [
      {
        id: 'zone_bson',
        name: 'Valle de los Documentos',
        x: -16,
        z: -14,
        color: 0x10b981,
        npcId: 'npc_bsonia',
        pedestalShape: 'cylinder'
      },
      {
        id: 'zone_mongoose',
        name: 'La Forja de Esquemas',
        x: 16,
        z: -14,
        color: 0xf59e0b,
        npcId: 'npc_schemiel',
        pedestalShape: 'box'
      },
      {
        id: 'zone_relations',
        name: 'La Aguja de las Relaciones',
        x: -16,
        z: 14,
        color: 0x38bdf8,
        npcId: 'npc_relatia',
        pedestalShape: 'cylinder'
      },
      {
        id: 'zone_sanctum',
        name: 'El Sanctum del Gran Custodio',
        x: 16,
        z: 14,
        color: 0xa855f7,
        npcId: 'npc_atlas',
        pedestalShape: 'octa'
      }
    ];

    const npcMeshes = [];
    const zonePillars = [];

    zoneConfigs.forEach((zc) => {
      const zGroup = new THREE.Group();
      zGroup.position.set(zc.x, 0, zc.z);

      // Anillo de energía en el suelo
      const ringGeo = new THREE.RingGeometry(4, 4.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: zc.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.05;
      zGroup.add(ringMesh);

      // 4 Pilares arcanos en las esquinas del altar
      const pillarGeo = new THREE.BoxGeometry(0.8, 4.5, 0.8);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: zc.color,
        emissiveIntensity: 0.2
      });

      const offsets = [[-3, -3], [3, -3], [-3, 3], [3, 3]];
      offsets.forEach(([ox, oz]) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(ox, 2.25, oz);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        zGroup.add(pillar);

        // Orbe flotante sobre cada pilar
        const orbGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const orbMat = new THREE.MeshBasicMaterial({ color: zc.color });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(ox, 5, oz);
        zGroup.add(orb);
        zonePillars.push(orb);
      });

      // Luz puntual temática del altar
      const pLight = new THREE.PointLight(zc.color, 2.2, 14);
      pLight.position.set(0, 3, 0);
      zGroup.add(pLight);

      // --- MODELO 3D DEL NPC ---
      const npcGroup = new THREE.Group();
      npcGroup.position.set(0, 0, 0);

      // Cuerpo del NPC (Túnica cilíndrica/cónica)
      const npcBodyGeo = new THREE.CylinderGeometry(0.4, 0.7, 1.8, 12);
      const npcBodyMat = new THREE.MeshStandardMaterial({
        color: zc.color,
        roughness: 0.5,
        metalness: 0.2
      });
      const npcBody = new THREE.Mesh(npcBodyGeo, npcBodyMat);
      npcBody.position.y = 0.9;
      npcBody.castShadow = true;
      npcGroup.add(npcBody);

      // Cabeza del NPC
      const npcHeadGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const npcHeadMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
      const npcHead = new THREE.Mesh(npcHeadGeo, npcHeadMat);
      npcHead.position.y = 2.1;
      npcHead.castShadow = true;
      npcGroup.add(npcHead);

      // Capucha / Corona
      const npcHatGeo = new THREE.ConeGeometry(0.55, 0.9, 8);
      const npcHatMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const npcHat = new THREE.Mesh(npcHatGeo, npcHatMat);
      npcHat.position.y = 2.7;
      npcHat.castShadow = true;
      npcGroup.add(npcHat);

      // Báculo mágico del NPC
      const staffGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8);
      const staffMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const staff = new THREE.Mesh(staffGeo, staffMat);
      staff.position.set(0.65, 1.2, 0.3);
      staff.castShadow = true;
      npcGroup.add(staff);

      const staffGemGeo = new THREE.OctahedronGeometry(0.25);
      const staffGemMat = new THREE.MeshBasicMaterial({ color: zc.color });
      const staffGem = new THREE.Mesh(staffGemGeo, staffGemMat);
      staffGem.position.set(0.65, 2.5, 0.3);
      npcGroup.add(staffGem);

      // Signo de exclamación flotante (!)
      const questMarkerGeo = new THREE.OctahedronGeometry(0.35);
      const questMarkerMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const questMarker = new THREE.Mesh(questMarkerGeo, questMarkerMat);
      questMarker.position.y = 3.6;
      npcGroup.add(questMarker);

      zGroup.add(npcGroup);
      scene.add(zGroup);

      npcMeshes.push({
        id: zc.npcId,
        name: NPCS[zc.npcId]?.name,
        title: NPCS[zc.npcId]?.title,
        zoneId: zc.id,
        group: npcGroup,
        marker: questMarker,
        gem: staffGem,
        worldPos: new THREE.Vector3(zc.x, 0, zc.z)
      });
    });

    stateRef.current.npcObjects = npcMeshes;

    // 5. COLECCIONABLES FLOTANTES 3D EN EL MUNDO (Pergaminos BSON y Gemas de Schema)
    const collectibleItems = [];
    const collectiblePositions = [
      { x: -5, z: -5, type: 'scroll', name: 'Fragmento BSON Arcano' },
      { x: 5, z: -6, type: 'rune', name: 'Runa de Validación Mongoose' },
      { x: -6, z: 6, type: 'crystal', name: 'Cristal de Referencia ObjectId' },
      { x: 6, z: 6, type: 'scroll', name: 'Códice Perdido de CRUD' },
      { x: 0, z: -12, type: 'rune', name: 'Sello de Esquema' },
      { x: -12, z: 0, type: 'crystal', name: 'Nodo de Poblado .populate' }
    ];

    collectiblePositions.forEach((cp, idx) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(cp.x, 1.2, cp.z);

      let cMesh;
      if (cp.type === 'scroll') {
        const geo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 12);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xca8a04,
          emissiveIntensity: 0.5
        });
        cMesh = new THREE.Mesh(geo, mat);
        cMesh.rotation.z = Math.PI / 4;
      } else if (cp.type === 'rune') {
        const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xd97706,
          emissiveIntensity: 0.6
        });
        cMesh = new THREE.Mesh(geo, mat);
      } else {
        const geo = new THREE.OctahedronGeometry(0.4);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.6
        });
        cMesh = new THREE.Mesh(geo, mat);
      }

      cMesh.castShadow = true;
      cGroup.add(cMesh);

      // Luz puntual pequeña
      const cLight = new THREE.PointLight(0x10b981, 1, 4);
      cGroup.add(cLight);

      scene.add(cGroup);
      collectibleItems.push({
        id: `collectible_${idx}`,
        group: cGroup,
        mesh: cMesh,
        type: cp.type,
        name: cp.name,
        collected: false
      });
    });

    stateRef.current.collectibles = collectibleItems;

    // 6. PERSONAJE 3D JUGABLE (Escriba / Mago)
    const playerGroup = new THREE.Group();
    playerGroup.position.copy(stateRef.current.playerPos);

    // Túnica
    const robeGeo = new THREE.CylinderGeometry(0.4, 0.7, 1.6, 12);
    const robeMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.4
    });
    const robe = new THREE.Mesh(robeGeo, robeMat);
    robe.position.y = 0.8;
    robe.castShadow = true;
    playerGroup.add(robe);

    // Cabeza
    const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffedd5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.9;
    head.castShadow = true;
    playerGroup.add(head);

    // Sombrero de Mago
    const hatGeo = new THREE.ConeGeometry(0.55, 0.9, 12);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 2.5;
    hat.rotation.x = -0.15;
    hat.castShadow = true;
    playerGroup.add(hat);

    // Báculo del Escriba
    const pStaffGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8);
    const pStaffMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
    const pStaff = new THREE.Mesh(pStaffGeo, pStaffMat);
    pStaff.position.set(0.6, 1.1, 0.3);
    pStaff.castShadow = true;
    playerGroup.add(pStaff);

    // Orbe de maná en la punta del báculo
    const pGemGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const pGemMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const pGem = new THREE.Mesh(pGemGeo, pGemMat);
    pGem.position.set(0.6, 2.25, 0.3);
    playerGroup.add(pGem);

    // Luz propia del báculo del jugador
    const playerLight = new THREE.PointLight(0x10b981, 1.8, 7);
    playerLight.position.set(0.6, 2.25, 0.3);
    playerGroup.add(playerLight);

    scene.add(playerGroup);

    // Partículas de polvo de maná en el aire
    const partGeo = new THREE.BufferGeometry();
    const partCount = 180;
    const partPositions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 60;
      partPositions[i + 1] = Math.random() * 12 + 0.5;
      partPositions[i + 2] = (Math.random() - 0.5) * 60;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xa7f3d0,
      size: 0.18,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // 7. MANEJO DE ENTRADAS DE TECLADO
    const handleKeyDown = (e) => {
      const code = e.key.toLowerCase();
      if (code === 'w' || e.key === 'ArrowUp') stateRef.current.keys.w = true;
      if (code === 's' || e.key === 'ArrowDown') stateRef.current.keys.s = true;
      if (code === 'a' || e.key === 'ArrowLeft') stateRef.current.keys.a = true;
      if (code === 'd' || e.key === 'ArrowRight') stateRef.current.keys.d = true;
      if (e.key === 'Shift') stateRef.current.keys.shift = true;
      if (e.key === ' ') {
        stateRef.current.keys.space = true;
        if (stateRef.current.isGrounded) {
          stateRef.current.playerVelocity.y = 6.5;
          stateRef.current.isGrounded = false;
          sound.playSelect();
        }
      }
      if (code === 'e') {
        // Interactuar con NPC o Altar cercano
        if (nearbyPromptRef.current) {
          sound.playSelect();
          onTalkNpc(nearbyPromptRef.current.npcId);
        }
      }
      if (code === 'h') {
        setControlsHelp((prev) => !prev);
      }
    };

    const handleKeyUp = (e) => {
      const code = e.key.toLowerCase();
      if (code === 'w' || e.key === 'ArrowUp') stateRef.current.keys.w = false;
      if (code === 's' || e.key === 'ArrowDown') stateRef.current.keys.s = false;
      if (code === 'a' || e.key === 'ArrowLeft') stateRef.current.keys.a = false;
      if (code === 'd' || e.key === 'ArrowRight') stateRef.current.keys.d = false;
      if (e.key === 'Shift') stateRef.current.keys.shift = false;
      if (e.key === ' ') stateRef.current.keys.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Referencia para el estado de cercanía en el listener
    const nearbyPromptRef = { current: null };

    // 8. BUCLE PRINCIPAL DE ANIMACIÓN Y FÍSICA
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Animaciones de entorno
      particles.rotation.y = elapsedTime * 0.02;
      zonePillars.forEach((p, idx) => {
        p.position.y = 5 + Math.sin(elapsedTime * 2 + idx) * 0.2;
      });

      // Animación de NPCs (flotación leve de marcadores)
      npcMeshes.forEach((npc, i) => {
        npc.marker.rotation.y = elapsedTime * 2;
        npc.marker.position.y = 3.6 + Math.sin(elapsedTime * 3 + i) * 0.15;
        npc.gem.rotation.x = elapsedTime;
        npc.gem.rotation.y = elapsedTime;
      });

      // Animación de coleccionables y detección de colisión para recoger
      stateRef.current.collectibles.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y = elapsedTime * 2.5;
          c.group.position.y = 1.2 + Math.sin(elapsedTime * 3) * 0.25;

          // Distancia con el jugador
          const distToPlayer = playerGroup.position.distanceTo(c.group.position);
          if (distToPlayer < 1.4) {
            c.collected = true;
            c.group.visible = false;
            sound.playSuccess();
            onCollectItem(c);
          }
        }
      });

      // FÍSICA Y MOVIMIENTO DEL PERSONAJE 3D
      const keys = stateRef.current.keys;
      const moveSpeed = keys.shift ? 10 : 6;
      const moveVector = new THREE.Vector3(0, 0, 0);

      if (keys.w) moveVector.z -= 1;
      if (keys.s) moveVector.z += 1;
      if (keys.a) moveVector.x -= 1;
      if (keys.d) moveVector.x += 1;

      const isMoving = moveVector.lengthSq() > 0;

      if (isMoving) {
        moveVector.normalize();
        const targetRotation = Math.atan2(moveVector.x, moveVector.z);
        // Suavizar rotación del jugador
        playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, targetRotation, 10 * delta);

        playerGroup.position.x += moveVector.x * moveSpeed * delta;
        playerGroup.position.z += moveVector.z * moveSpeed * delta;

        // Bobbing de caminar
        robe.position.y = 0.8 + Math.abs(Math.sin(elapsedTime * 12)) * 0.12;
        pStaff.position.y = 1.1 + Math.sin(elapsedTime * 12) * 0.1;
      } else {
        // Idle breathing
        robe.position.y = 0.8 + Math.sin(elapsedTime * 2) * 0.03;
      }

      // Salto y Gravedad
      if (!stateRef.current.isGrounded) {
        stateRef.current.playerVelocity.y -= 18 * delta;
        playerGroup.position.y += stateRef.current.playerVelocity.y * delta;
        if (playerGroup.position.y <= 0) {
          playerGroup.position.y = 0;
          stateRef.current.playerVelocity.y = 0;
          stateRef.current.isGrounded = true;
        }
      }

      // Límites del mundo
      playerGroup.position.x = THREE.MathUtils.clamp(playerGroup.position.x, -35, 35);
      playerGroup.position.z = THREE.MathUtils.clamp(playerGroup.position.z, -35, 35);

      // CÁMARA EN TERCERA PERSONA SUAVE (LERP)
      const cameraOffset = new THREE.Vector3(0, 8, 14);
      const targetCamPos = playerGroup.position.clone().add(cameraOffset);
      camera.position.lerp(targetCamPos, 5 * delta);
      camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.5, playerGroup.position.z);

      // DETECCIÓN DE CERCANÍA A NPCS
      let closestNpc = null;
      let minDistance = 5.0; // Radio de interacción en metros 3D

      npcMeshes.forEach((npc) => {
        const dist = playerGroup.position.distanceTo(npc.worldPos);
        if (dist < minDistance) {
          closestNpc = npc;
          minDistance = dist;
        }
      });

      if (closestNpc) {
        nearbyPromptRef.current = {
          npcId: closestNpc.id,
          name: closestNpc.name,
          title: closestNpc.title,
          zoneId: closestNpc.zoneId
        };
        setNearbyPrompt(nearbyPromptRef.current);
      } else {
        nearbyPromptRef.current = null;
        setNearbyPrompt(null);
      }

      // Detectar cambio de zona para actualizar el estado del juego
      zoneConfigs.forEach((zc) => {
        const dist = playerGroup.position.distanceTo(new THREE.Vector3(zc.x, 0, zc.z));
        if (dist < 8 && stateRef.current.activeZone !== zc.id) {
          stateRef.current.activeZone = zc.id;
          onZoneChange(zc.id);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionamiento
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="canvas-3d-wrapper" ref={mountRef}>
      {/* Indicador Flotante de Interacción 3D cuando estás cerca de un NPC */}
      {nearbyPrompt && (
        <div className="prompt-3d-interact">
          <div className="prompt-key-badge">E</div>
          <div className="prompt-text-group">
            <span className="prompt-main">Hablar con {nearbyPrompt.name}</span>
            <span className="prompt-sub">{nearbyPrompt.title}</span>
          </div>
          <button
            className="btn-talk-touch"
            onClick={() => {
              sound.playSelect();
              onTalkNpc(nearbyPrompt.npcId);
            }}
          >
            Hablar
          </button>
        </div>
      )}

      {/* Controles en Pantalla / Guía Rápida */}
      <div className={`controls-3d-legend ${controlsHelp ? 'legend-visible' : 'legend-collapsed'}`}>
        <div className="legend-header" onClick={() => setControlsHelp((prev) => !prev)}>
          <span>🎮 Controles 3D</span>
          <span className="legend-toggle">{controlsHelp ? '▲' : '▼'}</span>
        </div>
        {controlsHelp && (
          <div className="legend-body">
            <div className="legend-row">
              <span className="key-tag">W</span>
              <span className="key-tag">A</span>
              <span className="key-tag">S</span>
              <span className="key-tag">D</span>
              <span>Moverse libremente por el reino</span>
            </div>
            <div className="legend-row">
              <span className="key-tag">Espacio</span>
              <span>Saltar</span>
            </div>
            <div className="legend-row">
              <span className="key-tag">Shift</span>
              <span>Correr rápido</span>
            </div>
            <div className="legend-row">
              <span className="key-tag">E</span>
              <span>Interactuar con Sabios / Altares</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
