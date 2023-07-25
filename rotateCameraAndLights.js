// rotateCameraAndLights.js
import { Vector3 } from './node_modules/three/build/three.module.js';

export function applyRotateCameraAndLights(renderer, camera, lights) {
    var isDragging = false;
    var previousMousePosition = { x: 0, y: 0 };
    var verticalAngle = Math.PI / 2; // Initial camera's vertical rotation angle is 90 degrees

    renderer.domElement.addEventListener('mousedown', function(e) {
        isDragging = true;
    });

    renderer.domElement.addEventListener('mousemove', function(e) {
        var deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (isDragging) {
            var angleDelta = deltaMove.y / window.innerHeight * Math.PI; // Calculate angle delta based on the proportion of the vertical drag relative to the window height
            verticalAngle -= angleDelta; // Decrease the vertical angle when dragging downwards
            verticalAngle = Math.max(0, Math.min(Math.PI, verticalAngle)); // Restrict to 0 - 180 degrees

            // Adjust the camera's position based on the vertical angle
            camera.position.set(0, 5 * Math.cos(verticalAngle), 5 * Math.sin(verticalAngle));
            camera.lookAt(new Vector3(0, 0, 0));
            
            // Adjust the lights' positions based on the vertical angle
            lights.forEach(light => {
                light.position.set(0, 5 * Math.cos(verticalAngle), 5 * Math.sin(verticalAngle));
            });
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    renderer.domElement.addEventListener('mouseup', function(e) {
        isDragging = false;
    });
}
