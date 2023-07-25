// rotateCameraAndLight.js
import { Vector3 } from './node_modules/three/build/three.module.js';

export function applyRotateCameraAndLights(renderer, camera, lights) {
    var isDragging = false;
    var previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', function(e) {
        isDragging = true;
    });

    renderer.domElement.addEventListener('mousemove', function(e) {
        var deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (isDragging) {
            var angle = toRadians(deltaMove.y * 0.1);
            
            // Rotate the camera
            camera.position.applyAxisAngle(new Vector3(1, 0, 0), angle);
            camera.lookAt(new Vector3(0, 0, 0));
            
            // Rotate the lights
            lights.forEach(light => {
                light.position.applyAxisAngle(new Vector3(1, 0, 0), angle);
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

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
}
