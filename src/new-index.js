// main.js
import { Scene, PerspectiveCamera, WebGLRenderer } from '../node_modules/three/build/three.module.js';
import { PointLight, AmbientLight, Color } from '../node_modules/three/build/three.module.js';
import { Vector3 } from '../node_modules/three/build/three.module.js';

import { createRolodex } from './rolodex.js';
import { applyRotateYControl } from './rotateYControl.js';
import { applyZoomScrollControl } from './zoomScrollControl.js';
import { applyRotateCameraAndLights } from './rotateCameraAndLights.js';

const customLog = require('./logger');

const CAMERA_ZOOM = 1.52;
const CAMERA_POSITION = { x: 2, y: 2, z: 2 };
const LIGHT_POSITION = { x: 0, y: 0.7836418629090771, z: 1.3024229077747345 };
const ROLODEX_ROTATION = { y: 42.641613800952896, x: 0 };
const AMBIENT_LIGHT_COLOR = 0x444444;
const POINT_LIGHT_COLOR = 0xffffff;
const BACKGROUND_COLOR = 0x222222;

// Create the scene and camera
const scene = new Scene();
scene.background = new Color(BACKGROUND_COLOR);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
camera.lookAt(new Vector3(0, 0, 0));  // Look at the center of the scene

// Create the renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the Rolodex
const rolodex = createRolodex();
scene.add(rolodex);

// Create a light so we can see the Phong material
const light = new PointLight(POINT_LIGHT_COLOR, 1, 1000);
light.position.set(LIGHT_POSITION.x, LIGHT_POSITION.y, LIGHT_POSITION.z);
scene.add(light);

// Add the ambient light to the scene
const ambientLight = new AmbientLight(AMBIENT_LIGHT_COLOR); // soft white light
scene.add(ambientLight);

// Apply zoom controls
applyZoomScrollControl(camera);

camera.zoom = CAMERA_ZOOM;
camera.updateProjectionMatrix(); // Update the camera projection matrix after changing the zoom
light.position.set(LIGHT_POSITION.x, LIGHT_POSITION.y, LIGHT_POSITION.z);
rolodex.rotation.y = THREE.MathUtils.degToRad(ROLODEX_ROTATION.y); // Convert degrees to radians
rolodex.rotation.x = THREE.MathUtils.degToRad(ROLODEX_ROTATION.x); // Convert degrees to radians

// Apply rotate control for camera and light
applyRotateCameraAndLights(renderer, camera, [light, ambientLight]);

// Apply rotate control around Y-axis
const rotationVelocity = applyRotateYControl(renderer, rolodex);

// Animate the scene
function animate() {
    
    // Use the rotation velocity to update the Rolodex's rotation
    rolodex.rotation.y += rotationVelocity.y;
    rotationVelocity.y *= 0.95; // Gradually ease the rotation velocity to zero
    
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
// start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});