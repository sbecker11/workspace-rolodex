// main.js
import { Scene, PerspectiveCamera, WebGLRenderer } from '../node_modules/three/build/three.module.js';
import { PointLight, AmbientLight, Color } from '../node_modules/three/build/three.module.js';
import { Vector3 } from '../node_modules/three/build/three.module.js';

import { createRolodex } from './rolodex.js';
import { applyRotateYControl } from './rotateYControl.js';
import { applyZoomScrollControl } from './zoomScrollControl.js';
import { applyRotateCameraAndLights } from './rotateCameraAndLights.js';

// Create the scene and camera
const scene = new Scene();
scene.background = new Color(0x222222);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(new Vector3(0, 0, 0));  // Look at the center of the scene

// Create the renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the Rolodex
const rolodex = createRolodex();
scene.add(rolodex);

// Create a light so we can see the Phong material
const light = new PointLight(0xffffff, 1, 1000);
light.position.set(0, 0, 5);
scene.add(light);

// Add the ambient light to the scene
const ambientLight = new AmbientLight(0x444444); // soft white light
scene.add(ambientLight);

// Apply zoom controls
applyZoomScrollControl(camera);

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

    const start = performance.now();
    requestAnimationFrame(animate);
    const end = performance.now();
    const duration = end - start;

    // Log if the frame took too long
    // 16ms is roughly 60fps, 32ms is roughly 30fps, 64ms is roughly 15fps
    if (duration > 64) { 
        console.warn(`Frame took ${duration}ms`);
    }
}
// start the animvation loop
animate();


// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});