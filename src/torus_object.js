import * as THREE from 'three';

class TorusObject extends THREE.Group {
  // Create a torus mesh with the center axis pointing in the +Z direction.
  constructor(innerRadius, crossSectionRadius) {
    super();
    const geometry = new THREE.TorusGeometry(innerRadius, crossSectionRadius, 64, 100);

    // Create the shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying vec2 vUv;

        vec3 hueToRgb(float hue) {
          float r = abs(hue * 6.0 - 3.0) - 1.0;
          float g = 2.0 - abs(hue * 6.0 - 2.0);
          float b = 2.0 - abs(hue * 6.0 - 4.0);
          return clamp(vec3(r, g, b), 0.0, 1.0);
        }

        void main() {
          float hue = mod(1.0 - vUv.x + 0.25, 1.0); // Use the UV coordinate to vary the hue around the torus
          vec3 color = hueToRgb(hue);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {}
    });

    // Create the torus mesh
    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
  }
}

export default TorusObject;

function example(scene) {
  const innerRadius = 10;
  const crossSectionRadius = 3;
  const torusObject = new TorusObject(innerRadius, crossSectionRadius);
  scene.add(torusObject);
}