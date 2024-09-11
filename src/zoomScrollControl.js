 // zoomScrollControl.js
import { Vector3 } from '../node_modules/three/build/three.module.js';
const customLog = require('./logger');

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Calculate the default distance to fit the scene in the window
export function calculateDefaultDistance(camera) {
    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    const aspect = window.innerWidth / window.innerHeight;
    const height = 1; // Assuming the height of the scene to be 1 unit
    const distance = height / (2 * Math.tan(fov / 2));
    return distance;
}

export function applyZoomScrollControl(camera, defaultDistance = 1.0) {
    // If defaultDistance is specified, set the camera's position to this distance from the origin
    camera.position.setLength(defaultDistance);

    let newDistance = defaultDistance;

    function onZoom(event) {
        // Prevent the default action (scrolling)
        event.preventDefault();

        // Control camera zoom to origin with mouse scroll
        var vector = new Vector3(0, 0, 0).sub(camera.position);
        var distance = vector.length();
        var minDistance = 0.6;
        var maxDistance = 3.0;
        newDistance = distance + event.deltaY * 0.01; // Reversed the effect of scroll
        if (newDistance >= minDistance && newDistance <= maxDistance) {
            vector.normalize();
            camera.position.sub(vector.multiplyScalar(event.deltaY * 0.01)); // Reversed the effect of scroll on camera position
        }
    }

    // Debounced log function
    const debouncedLog = debounce(() => {
        customLog(`final zoom:${newDistance}`);
    }, 200); // Adjust the debounce delay as needed

    window.addEventListener('wheel', function (event) {
        onZoom(event);
        debouncedLog();
    }, { passive: false });  // Add this to make event.preventDefault() work
}
