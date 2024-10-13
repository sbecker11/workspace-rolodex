import * as THREE from 'three';
import { createLightsAndCamera } from './lightsAndCamera.js';
import { createRolodex } from './rolodex.js';

let scene, camera, renderer, controls;
let worker = new Worker(new URL('./worker.js', import.meta.url));

// set up the scene with lights, camera, and coordinate geometry
async function init() {
    try {   
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        controls = createLightsAndCamera(scene, camera, renderer);

        // Create the Rolodex
        const { createRolodex } = await import('./rolodex.js');
        const rolodex = createRolodex(scene);
        rolodex.position.set(0, 0, 0); // Ensure the Rolodex is centered
        scene.add(rolodex);
    
        console.log('Scene setup complete');
        console.log('Starting animation loop');
        animate();

    } catch (error) {
        console.error('Error during scene setup:', error);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    try {
        if (typeof controls !== 'undefined') {
            controls.update(); // Required for damping to work
        }
        renderer.render(scene, camera);
    } catch (error) {
        console.error('Error during animation:', error);
    }
}

// Offload heavy computation to Web Worker
worker.postMessage({ /* data */ });
worker.onmessage = function(event) {
  console.log('Result from worker:', event.data);
};

if (import.meta.env.MODE === 'development') {
    try {
        const { setupWebSocketClient } = await import('./webSocketClient.js');
        // connect to the WebSocket server in development mode
        // so client can exit if server is not running
        setupWebSocketClient('ws://localhost:3000');
    } catch (error) {
        console.error('Error loading webSocketClient.js:', error);
    }
}

console.log('main.js loaded and calling init()');
init();

