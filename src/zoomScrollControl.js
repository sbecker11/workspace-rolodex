 // zoomScrollControl.js
import { Vector3 } from '../node_modules/three/build/three.module.js';

export function applyZoomScrollControl(camera, defaultDistance = 1.0) {
    // If defaultDistance is specified, set the camera's position to this distance from the origin
    camera.position.setLength(defaultDistance);

    window.addEventListener('wheel', function (event) {
        // Prevent the default action (scrolling)
        event.preventDefault();

        // Control camera zoom to origin with mouse scroll
        var vector = new Vector3(0, 0, 0).sub(camera.position);
        var distance = vector.length();
        var minDistance = 0.25;
        var maxDistance = 10;
        var newDistance = distance + event.deltaY * 0.01; // Reversed the effect of scroll
        if (newDistance >= minDistance && newDistance <= maxDistance) {
            console.log(`zoom:${newDistance}`);
            vector.normalize();
            camera.position.sub(vector.multiplyScalar(event.deltaY * 0.01)); // Reversed the effect of scroll on camera position
        }
    }, { passive: false });  // Add this to make event.preventDefault() work
}
