import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function disposeModel(model) {
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose();
      });
      material.dispose();
    });
  });
}

export default function NPCModelPreview({ modelPath, npcName }) {
  const mountRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !modelPath) return undefined;

    let disposed = false;
    let character = null;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdce9ff, 0x241a12, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffe6b0, 2.7);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.88, 0.12, 48),
      new THREE.MeshStandardMaterial({ color: 0x30313a, metalness: 0.68, roughness: 0.42 })
    );
    platform.position.y = -0.07;
    scene.add(platform);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }

        character = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(character);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 2.45 / (size.y || 1);
        character.scale.setScalar(scale);
        character.position.set(
          -center.x * scale,
          -bounds.min.y * scale,
          -center.z * scale
        );
        scene.add(character);

        const scaledBounds = new THREE.Box3().setFromObject(character);
        const scaledSize = scaledBounds.getSize(new THREE.Vector3());
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const distance = Math.max(
          scaledSize.y / (2 * Math.tan(verticalFov / 2)),
          scaledSize.x / (2 * Math.tan(horizontalFov / 2))
        ) * 1.2;
        camera.position.set(0, 1.22, Math.max(distance, 3.2));
        camera.lookAt(0, 1.22, 0);
        resize();
      },
      undefined,
      (error) => {
        if (disposed) return;
        console.error(`No se pudo cargar el modelo de ${npcName}:`, error);
        setLoadError(true);
      }
    );

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      if (character) disposeModel(character);
      platform.geometry.dispose();
      platform.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [modelPath, npcName]);

  return (
    <div className="dialogue-model-preview" aria-label={`Modelo 3D de ${npcName}`} role="img">
      <div className="dialogue-model-canvas" ref={mountRef} />
      {loadError && (
        <div className="dialogue-model-error" role="status">
          No se pudo cargar el modelo de {npcName}.
        </div>
      )}
    </div>
  );
}
