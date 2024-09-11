import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function applyRotateYControl(renderer, camera, scene) {
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set the initial target to the center of the scene
    controls.target.set(0, 0, 0);

    // Restrict the vertical rotation to prevent the camera from moving to the +z location
    controls.maxPolarAngle = Math.PI / 2; // Limit the vertical rotation to 90 degrees

    // Update the controls
    controls.update();

    // Track the rotation velocity
    let rotationVelocity = 0.01; // Set a small initial rotation velocity
    let isDragging = false;

    // Add event listener for mouse down to start tracking
    renderer.domElement.addEventListener('mousedown', (event) => {
        isDragging = true;
        console.log('Mouse down: isDragging =', isDragging);
    });

    // Add event listener for mouse up to end tracking
    renderer.domElement.addEventListener('mouseup', (event) => {
        isDragging = false;
        console.log('Mouse up: isDragging =', isDragging);
    });

    // Animate the camera with inertial rotation
    function animate() {
        // Apply inertial rotation to the camera
        if (!isDragging) {
            // Apply the rotation velocity to the azimuthal angle
            controls.rotateLeft(rotationVelocity);
            console.log('Rotating: rotationVelocity =', rotationVelocity);

            // Update controls to apply the changes
            controls.update();
        }

        // Render the scene
        renderer.render(scene, camera);

        // Request the next frame
        requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();
}