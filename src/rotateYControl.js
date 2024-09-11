import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const customLog = require('./logger');

export function applyRotateYControl(renderer, camera) {
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set the initial target to the center of the scene
    controls.target.set(0, 0, 0);

    // Restrict the vertical rotation to prevent the camera from moving to the +z location
    controls.maxPolarAngle = Math.PI / 2; // Limit the vertical rotation to 90 degrees

    // Update the controls
    controls.update();

    // Track the rotation velocity
    let rotationVelocity = 0;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isDragging = false;

    // Convert screen coordinates to polar coordinates
    function toPolar(x, y) {
        customLog(`toPolar x:${x}, y:${y}`);
        const rect = renderer.domElement.getBoundingClientRect();
        customLog(`Bounding Client Rect: ${JSON.stringify(rect)}`);
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        customLog(`toPolar - x: ${x}, y: ${y}, centerX: ${centerX}, centerY: ${centerY}, dx: ${dx}, dy: ${dy}`);
        if (isNaN(dx) || isNaN(dy)) {
            customLog(`Invalid dx or dy: dx=${dx}, dy=${dy}`);
            return { radius: null, angle: null };
        }
        const radius = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        customLog(`toPolar - radius: ${radius}, angle: ${angle}`);
        return { radius, angle };
    }

    // Add event listener for mouse down to start tracking
    renderer.domElement.addEventListener('mousedown', (event) => {
        rotationVelocity = 0; // Reset rotation velocity on user interaction
        customLog(`rotationVelocity reset to 0`);
        startX = event.clientX; // Track the initial X position
        startY = event.clientY; // Track the initial Y position
        customLog(`startX: ${startX}, startY: ${startY}`);
        isDragging = true;
    });

    // Add event listener for mouse move to track dragging
    renderer.domElement.addEventListener('mousemove', (event) => {
        if (isDragging) {
            endX = event.clientX;
            endY = event.clientY;
            customLog(`dragging - endX: ${endX}, endY: ${endY}`);
        }
    });

    // Add event listener for mouse up to end tracking
    renderer.domElement.addEventListener('mouseup', (event) => {
        if (isDragging) {
            customLog(`end event: ${JSON.stringify(event)}`);
            endX = event.clientX;
            endY = event.clientY;
            customLog(`endX: ${endX}, endY: ${endY}`);
            const startPolar = toPolar(startX, startY);
            const endPolar = toPolar(endX, endY);
            rotationVelocity = (endPolar.angle - startPolar.angle) * 0.1; // Scale down the rotation velocity
            customLog(`startPolar: ${JSON.stringify(startPolar)}, endPolar: ${JSON.stringify(endPolar)}, rotationVelocity: ${rotationVelocity}`);
            isDragging = false;
        }
    });

    // Animate the camera with inertial rotation
    function animate() {
        // Apply inertial rotation to the camera
        if (!isDragging) {
            controls.azimuthalAngle += rotationVelocity; // Apply the scaled rotation velocity
            rotationVelocity *= 0.95; // Gradually ease the rotation velocity to zero
            customLog(`rotationVelocity during inertia: ${rotationVelocity}`);
        }

        // Update controls and render the scene
        controls.update();
        renderer.render(renderer.scene, camera);

        requestAnimationFrame(animate);
    }
    // Start the animation loop
    animate();
}