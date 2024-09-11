import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function applyRotateCameraAndLights(renderer, camera, lights) {
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set the initial target to the center of the scene
    controls.target.set(0, 0, 0);

    // Restrict the vertical rotation to prevent the camera from moving to the +z location
    controls.maxPolarAngle = Math.PI / 2; // Limit the vertical rotation to 90 degrees

    // Update the controls
    controls.update();

    // Add event listener to update lights' positions based on camera movement
    controls.addEventListener('change', () => {
        lights.forEach(light => {
            light.position.copy(camera.position);
        });
    });

    // Animate the camera and lights
    function animate() {
        // Render the scene
        renderer.render(renderer.scene, camera);

        requestAnimationFrame(animate);
    }
    // Start the animation loop
    animate();
}