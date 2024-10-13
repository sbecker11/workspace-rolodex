import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createLightsAndCamera(scene, camera, renderer) {
    try {
        // Add directional lights
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.95);
        directionalLight1.position.set(100, 100, 0);
        directionalLight1.lookAt(0, 0, 0);
        scene.add(directionalLight1);
    
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.95);
        directionalLight2.position.set(0, 100, 100);
        directionalLight2.lookAt(0, 0, 0);
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.95);
        directionalLight3.position.set(0, -100, 100);
        directionalLight3.lookAt(0, 0, 0);
        scene.add(directionalLight3);
    
        // Add ambient light to ensure all sides of planes are visible
        const ambientLight = new THREE.AmbientLight(0xa0a0a0);
        scene.add(ambientLight);
    
        // Set up camera position (directional only))
        camera.position.set(1.0, 1.0, 1.0);
        camera.lookAt(0, 0, 0);
    
        // Set up OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Add smooth damping effect
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 0.5;
        controls.maxDistance = 2.0;
        controls.maxPolarAngle = Math.PI; // Allow full vertical rotation
        controls.minPolarAngle = 0;

        return controls;
    } catch (error) {
        console.error('Error in createLightsAndCamera', error);
    }
}
