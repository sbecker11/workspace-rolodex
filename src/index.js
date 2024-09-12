import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, AmbientLight, Color, Vector3, MathUtils } from 'three';

import { createRolodex } from './rolodex.js';
import { applyZoomScrollControl, calculateDefaultDistance } from './zoomScrollControl.js';
import { applyRotateCameraAndLights } from './rotateCameraAndLights.js';
import { applyRotateYControl } from './rotateYControl.js';

const customLog = require('./logger');

const CAMERA_ZOOM = 2.729892039507871;
const LIGHT_POSITION = { x: 0, y: 2.729892039507869, z: 0 };
const ROLODEX_ROTATION = { y: -19.587837728762263, x: 0 };
const AMBIENT_LIGHT_COLOR = 0x444444;
const POINT_LIGHT_COLOR = 0xffffff;
const BACKGROUND_COLOR = 0x222222;

// Create the scene and camera
const scene = new Scene();
scene.background = new Color(BACKGROUND_COLOR);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Calculate and set the default distance
const defaultDistance = calculateDefaultDistance(camera) * 5; // Increase the distance by 5 times
camera.position.set(0, defaultDistance, 0); // Center the camera on the Y-axis
camera.lookAt(new Vector3(0, 0, 0));  // Point the camera towards the center of the scene
customLog(`defaultDistance:${defaultDistance}`);
// Set the default zoom
camera.zoom = CAMERA_ZOOM;
camera.updateProjectionMatrix(); // Update the camera projection matrix after changing the zoom

// Create the renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Attach the scene and camera to the renderer for use in animation functions
renderer.scene = scene;
renderer.camera = camera;

// Create the Rolodex
const rolodex = createRolodex();
rolodex.position.set(0, 0, 0); // Ensure the Rolodex is centered
scene.add(rolodex);

// Create a light so we can see the Phong material
const light = new PointLight(POINT_LIGHT_COLOR, 1, 1000);
light.position.set(LIGHT_POSITION.x, LIGHT_POSITION.y, LIGHT_POSITION.z);
scene.add(light);

// Add the ambient light to the scene
const ambientLight = new AmbientLight(AMBIENT_LIGHT_COLOR); // soft white light
scene.add(ambientLight);

light.position.set(LIGHT_POSITION.x, LIGHT_POSITION.y, LIGHT_POSITION.z);
rolodex.rotation.y = MathUtils.degToRad(ROLODEX_ROTATION.y); // Final rotation around Y-axis
rolodex.rotation.x = ROLODEX_ROTATION.x; // Final rotation around X-axis

// Apply rotate control for camera and light
applyRotateCameraAndLights(renderer, camera, [light, ambientLight]);

// Apply rotate control around Y-axis
applyRotateYControl(renderer, camera, rolodex);

// Apply zoom controls
applyZoomScrollControl(camera, renderer);

// Track the previous zoom value
let previousZoom = camera.zoom;

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});