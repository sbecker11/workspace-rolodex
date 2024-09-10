// rotateYControl.js
import { Vector3, Quaternion, Euler } from '../node_modules/three/build/three.module.js';

export function applyRotateYControl(renderer, rolodex) {
    var isDragging = false;
    var previousMousePosition = {
        x: 0,
        y: 0
    };
    var rotationVelocity = {
        x: 0,
        y: 0
    };

    renderer.domElement.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousMousePosition = {
            x: e.offsetX,
            y: 0
        };
    });

    renderer.domElement.addEventListener('mousemove', function(e) {
        if (isDragging) {
            var deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: 0
            };
            
            rotationVelocity.y = deltaMove.x * 0.01;
            
            previousMousePosition = {
                x: e.offsetX,
                y: 0
            };
        }
    });

    renderer.domElement.addEventListener('mouseup', function(e) {
        isDragging = false;

        // Log the final rotation angles when dragging stops
        console.log(`Final rotation around Y-axis: ${rolodex.rotation.y}`);
        console.log(`Final rotation around X-axis: ${rolodex.rotation.x}`);
    });

    return rotationVelocity;
}
