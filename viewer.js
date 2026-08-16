/* ============================================================
   PORTFOLIO QWINTE DE VALCK — 3D viewer (viewer.js)
   Laadt .glb modellen met Three.js in de project-modal.
   Exposeert window.PortfolioViewer voor script.js.
   ============================================================ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

let container = null;
let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let currentModel = null;
let animationId = null;
let statusEl = null;
let resizeObserver = null;

/* ---------- Status / foutmelding tonen in de viewer ---------- */
function setStatus(msg) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.display = msg ? 'block' : 'none';
}

/* ---------- Renderer & scene opzetten ---------- */
function init(el) {
  container = el;
  const w = container.clientWidth || 300;
  const h = container.clientHeight || 200;

  // Status-overlay
  statusEl = document.createElement('div');
  statusEl.className = 'viewer-status';
  container.appendChild(statusEl);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  // Omgevingstextuur zodat PBR-materialen nooit zwart/leeg lijken
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000);
  camera.position.set(0, 1.2, 3.5);

  // Extra gerichte lampen voor een strakke uitstraling
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x3b82f6, 0.5);
  fill.position.set(-3, 1, -2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.position.set(0, -2, -3);
  scene.add(rim);

  // Grondvlak met subtiel grid (in site-kleuren)
  const grid = new THREE.GridHelper(4, 20, 0x3b82f6, 0x243349);
  grid.position.y = 0.001;
  scene.add(grid);

  // Orbit controls: draaien, zoomen + langzame auto-rotatie
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;

  // Resizen volgen (ook als de modal later van grootte verandert)
  resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(container);

  animate();
}

/* ---------- Animatie loop ---------- */
function animate() {
  animationId = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/* ---------- Model laden, centreren én camera framen ---------- */
function loadModel(path) {
  clearModel();
  setStatus('Model laden…');

  new GLTFLoader().load(
    path,
    (gltf) => {
      const model = gltf.scene;

      // Model centreren en schalen zodat het netjes in beeld past
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2 / maxDim;
      const center = box.getCenter(new THREE.Vector3());

      model.scale.setScalar(scale);
      model.position.x = -center.x * scale;
      model.position.y = -box.min.y * scale;   // voetstuk op de grond
      model.position.z = -center.z * scale;

      scene.add(model);
      currentModel = model;
      setStatus(null); // gelukt: status weghalen

      // Camera positioneren op het model
      const box2 = new THREE.Box3().setFromObject(model);
      const size2 = new THREE.Vector3();
      box2.getSize(size2);
      const distance = size2.length() * 2.2 || 5;

      camera.position.set(distance * 0.35, distance * 0.45, distance);
      controls.target.set(0, size2.y * 0.45, 0);
      controls.update();
    },
    undefined,
    (err) => {
      console.error('GLB laden mislukt:', err);
      setStatus(
        'Model kon niet geladen worden.<br />Open de browserconsole (F12) voor de foutmelding.<br /><em>Tip: gebruik een lokale server, niet dubbelklikken op index.html.</em>'
      );
    }
  );
}

/* ---------- Vorig model opruimen ---------- */
function clearModel() {
  if (!currentModel) return;
  scene.remove(currentModel);
  currentModel.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        Object.values(m).forEach((v) => {
          if (v && v.isTexture) v.dispose();
        });
        m.dispose();
      });
    }
  });
  currentModel = null;
}

/* ---------- Responsief bijven ---------- */
function resize() {
  if (!renderer || !container) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

/* ---------- Volledig afsluiten (bij sluiten modal) ---------- */
function destroy() {
  cancelAnimationFrame(animationId);
  animationId = null;
  clearModel();
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  container = null;
  statusEl = null;
}

/* ---------- Public API voor script.js ---------- */
window.PortfolioViewer = {
  open(el, modelPath) {
    init(el);
    loadModel(modelPath);
  },
  resize,
  close: destroy
};
