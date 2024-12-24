import * as THREE from 'three';

const planeSize = 1.0;
const gridLineDivsions = 5;
const gridLineRadius = 0.005;
const opacity = 0.25;

const coneHeight = 0.05;
const coneRadius = 0.02;
const axisLength = planeSize / 2 + coneHeight / 2;
const axisRadius = 0.005;

const xVector = new THREE.Vector3(1, 0, 0);
const yVector = new THREE.Vector3(0, 1, 0);
const zVector = new THREE.Vector3(0, 0, 1);
const xColor = 0xff0000;
const yColor = 0x00ff00;
const zColor = 0x0000ff;
const whiteColor = 0xffffff;

// create a plane at Y=0 with Y+ surface normal 
class PlaneYGeometry extends THREE.Group {
    constructor(planeSize, opacity, color) {
        super();
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(planeSize, planeSize),
            new THREE.MeshPhongMaterial({ 
                color: color, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: opacity,
                depthTest: false  // Disable depth testing
            })
            
        );
        plane.rotation.x = -Math.PI / 2; // Rotate to align with Y=0 plane
        plane.position.set(planeSize/2, 0, planeSize/2);
        this.add(plane);
    }
}

// create grid lines in the Y=0 plane with Y+ surface normal 
class GridYGeometry extends THREE.Group {
    constructor(planeSize, divisions, color) {
        super();

        const step = planeSize / divisions;
        const halfPlaneSize = planeSize / 2;

        const material = new THREE.LineBasicMaterial({ color: color });

        for (let i = 0; i <= divisions; i++) {
            const offset = -halfPlaneSize + i * step;

            // Lines parallel to X-axis
            const geometryX = new THREE.CylinderGeometry(gridLineRadius, gridLineRadius, planeSize, 32);
            const lineX = new THREE.Mesh(geometryX, material);
            lineX.position.set(0, 0, offset);
            lineX.rotation.z = -Math.PI / 2; // Rotate to align with X-axis
            this.add(lineX);

            // Lines parallel to Z-axis
            const geometryZ = new THREE.CylinderGeometry(gridLineRadius, gridLineRadius, planeSize, 32);
            const lineZ = new THREE.Mesh(geometryZ, material);
            lineZ.position.set(offset, 0, 0);
            lineZ.rotation.x = Math.PI / 2; // Rotate to align with X-axis
            this.add(lineZ);
        }
        this.position.set(planeSize/2, 0, planeSize/2);
    }
}

// create Y axis lines with a cone at +Y 
class AxisYGeometry extends THREE.Group {
    constructor(axisRadius, coneRadius, coneHeight, axisLength, color) {
        super();

        // Axis material
        this.axisMaterial = new THREE.MeshPhongMaterial({ color: color });

        // Axis cylinder
        const axisGeometry = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength * 2 + coneHeight, 32);
        const axis = new THREE.Mesh(axisGeometry, this.axisMaterial);
        this.add(axis);

        // Axis cone
        const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight);
        const cone = new THREE.Mesh(coneGeometry, this.axisMaterial);
        cone.position.y = axisLength + coneHeight / 2;
        this.add(cone);
    }
}

class CoordinatePlaneGeometry extends THREE.Group {
    constructor(axisVector, planeSize, gridLineDivsions, opacity, axisRadius, coneRadius, coneHeight, axisLength, color) {
        super();

        this.axisVector = axisVector;
        this.color = color;

        const planeYGeom = new PlaneYGeometry(planeSize, opacity, color);
        this.add(planeYGeom);

        const gridYGeom = new GridYGeometry(planeSize, gridLineDivsions, whiteColor);
        this.add(gridYGeom);

        const axisYGeom = new AxisYGeometry(axisRadius, coneRadius, coneHeight, axisLength, color);
        this.add(axisYGeom);

        // Position and rotate the group based on the axis vector
        
        if (axisVector.equals(xVector)) {
            this.rotation.z = -Math.PI / 2;
        } else if (axisVector.equals(yVector)) {
            // do nothing
        } else if (axisVector.equals(zVector)) {
            this.rotation.x = Math.PI / 2;
        } else {
            console.error("unhandled axisVector:", axisVector);
        }
    }

    setColor(color) {
        this.color = color;
        this.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
            }
        });
    }

    clone() {
        return new CoordinatePlaneGeometry(
            this.axisVector,
            planeSize,
            gridLineDivsions,
            opacity,
            axisRadius,
            coneRadius,
            coneHeight,
            axisLength,
            this.color 
        );
        return cloned;
    }
}

function hexRgbToHue(hexRgb) {
    // given a color string with format #rrggbb
    // return a hue angle between 0 and 360

    // Remove the hash at the start if it's there
    hexRgb = hexRgb.replace(/^#/, '');

    // Parse the r, g, b values
    const bigint = parseInt(hexRgb, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Convert r, g, b to the range 0-1
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let hue = 0;

    if (delta === 0) {
        hue = 0;
    } else if (max === rNorm) {
        hue = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
        hue = (bNorm - rNorm) / delta + 2;
    } else if (max === bNorm) {
        hue = (rNorm - gNorm) / delta + 4;
    }

    hue = Math.round(hue * 60);

    if (hue < 0) {
        hue += 360;
    }

    return hue;
}

function hexRgbFromHue(hue) {
    // given a hue angle between 0 and 360
    // return a string with format #rrggbb
    const c = 1;
    const x = 1 - Math.abs((hue / 60) % 2 - 1);
    const m = 0;
    let R = 0, G = 0, B = 0;

    if (hue >= 0 && hue < 60) {
        R = c; G = x; B = 0;
    } else if (hue >= 60 && hue < 120) {
        R = x; G = c; B = 0;
    } else if (hue >= 120 && hue < 180) {
        R = 0; G = c; B = x;
    } else if (hue >= 180 && hue < 240) {
        R = 0; G = x; B = c;
    } else if (hue >= 240 && hue < 300) {
        R = x; G = 0; B = c;
    } else if (hue >= 300 && hue < 360) {
        R = c; G = 0; B = x;
    }

    R = Math.round((R + m) * 255).toString(16).padStart(2, '0');
    G = Math.round((G + m) * 255).toString(16).padStart(2, '0');
    B = Math.round((B + m) * 255).toString(16).padStart(2, '0');

    return `#${R}${G}${B}`;
}

// Create planes and grids for each coordinate axis
export function createCoordinateGeometry(scene) {
    try {
        // console.log("calling new CoordinatePlaneGeometry with vector:", xVector);
        // const xGeom = new CoordinatePlaneGeometry(xVector, planeSize, gridLineDivsions, opacity, axisRadius, coneRadius, coneHeight, axisLength, xColor);
        // scene.add(xGeom);

        // console.log("calling new CoordinatePlaneGeometry with vector:", yVector);
        // const yGeom = new CoordinatePlaneGeometry(yVector, planeSize, gridLineDivsions, opacity, axisRadius, coneRadius, coneHeight, axisLength, yColor);
        // scene.add(yGeom);

        console.log("calling new CoordinatePlaneGeometry with vector:", zVector);
        const zGeom = new CoordinatePlaneGeometry(zVector, planeSize, gridLineDivsions, opacity, axisRadius, coneRadius, coneHeight, axisLength, zColor);
        // scene.add(zGeom);

        // add hue planes
        const degreesToRadians = Math.PI / 180.0;
        for ( let degrees=0; degrees<360; degrees+=15 ) {
            const plane = zGeom.clone();
            plane.rotation.set(0, degrees * degreesToRadians, Math.PI / 2);
            const hue = degrees;
            const color = hexRgbFromHue(hue);
            plane.setColor(color);
            plane.renderOrder = degrees;  // Added this line
            scene.add(plane);
        }
    
    } catch (error) {
        console.error('Error in createCoordinateGeometry', error);
    }
}

