 // zoomScrollControl.js
import { Vector3 } from '../node_modules/three/build/three.module.js';
import * as THREE from 'three';
import customLog from './logger';

// Calculate the default distance to fit the scene in the window
export function calculateDefaultDistance(camera) {
    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    const aspect = window.innerWidth / window.innerHeight;
    const height = 1; // Assuming the height of the scene to be 1 unit
    const distance = height / (2 * Math.tan(fov / 2));
    return distance;
}

function applyZoomScrollControl(camera, renderer) {

    const controls = new OrbitControls(camera, renderer.domElement);

    // Set minimum and maximum zoom distances
    controls.minDistance = 10;  // Minimum zoom distance
    controls.maxDistance = 100; // Maximum zoom distance

    // Optionally, you can set other properties like zoomSpeed
    controls.zoomSpeed = 1.2;

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);

        // Calculate and log the distance from the scene origin
        let distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
        console.log('Distance from origin:', distance);
    }

    animate();
}

export { applyZoomScrollControl };