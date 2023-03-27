import * as THREE from '/three.min.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js'
const viewer = document.getElementById('model-viewer');
const dropdown = document.getElementById('model-dropdown');

let model;
const loader = new GLTFLoader();

// Load default model
loadModel(dropdown.value);

// Listen for model selection changes
dropdown.addEventListener('change', () => {
  loadModel(dropdown.value);
});

// Load 3D model
function loadModel(modelUrl) {
  // Remove previous model
  if (model) {
    viewer.removeChild(model.scene);
  }
  
  loader.load(modelUrl, gltf => {
    model = gltf;
    viewer.appendChild(model.scene);

    // Position and scale model
    const box = new THREE.Box3().setFromObject(model.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = viewer.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));
    cameraZ *= 1.3; // multiply by a factor to zoom out slightly
    viewer.camera.position.z = cameraZ;

    const minZ = box.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;
    viewer.camera.far = cameraToFarEdge * 3;
    viewer.camera.lookAt(center);
    viewer.renderer.render(viewer.scene, viewer.camera);
  });
}

// Enable touch controls for mobile devices
if ('ontouchstart' in window) {
  const touchControls = new OrbitControls(viewer.camera, viewer.domElement);
  touchControls.enableZoom = true;
  touchControls.enablePan = true;
  touchControls.rotateSpeed = 0.5;
  touchControls.zoomSpeed = 1.0;
  touchControls.panSpeed = 1.0;
  touchControls.minDistance = 10;
  touchControls.maxDistance = 100;
  touchControls.minPolarAngle = 0; // radians
  touchControls.maxPolarAngle = math.PI;
// Enable mouse controls for desktop devices
} else {
    const mouseControls = new OrbitControls(viewer.camera, viewer.domElement);
    mouseControls.enableZoom = true;
    mouseControls.enablePan = true;
    mouseControls.rotateSpeed = 0.5;
    mouseControls.zoomSpeed = 1.0;
    mouseControls.panSpeed = 1.0;
    mouseControls.minDistance = 10;
    mouseControls.maxDistance = 100;
    mouseControls.minPolarAngle = 0; // radians
    mouseControls.maxPolarAngle = Math.PI; // radians
    mouseControls.enableDamping = true;
    mouseControls.dampingFactor = 0.1;
    mouseControls.target.set(0, 0, 0);
    mouseControls.update();
  }
  
  // Resize the viewer when the window size changes
  window.addEventListener('resize', () => {
    viewer.camera.aspect = viewer.clientWidth / viewer.clientHeight;
    viewer.camera.updateProjectionMatrix();
    viewer.renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  });
  
  