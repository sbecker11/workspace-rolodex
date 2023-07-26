// createRolodex.js
import { BoxGeometry, MeshPhongMaterial, Mesh, Group, DoubleSide, Color } from './node_modules/three/build/three.module.js';
import { CylinderGeometry } from './node_modules/three/build/three.module.js';

export function createRolodex() {
    // Create the Rolodex
    var rolodex = new Group();

    // Create the cards of the Rolodex
    var numCards = 40;
    var cardWidth = 1.0;
    var cardHeight = cardWidth / 2;
    var cardGeometry = new BoxGeometry(cardWidth, cardHeight, 0.02);  // Cuboid geometry with small depth to give 3D effect
    var gap = cardWidth / 8;
    for (var i = 0; i < numCards; i++) {
        var angle = (i / numCards) * Math.PI * 2;
        var hue = angle / (Math.PI * 2);  // Normalize to a range between 0 and 1
        var saturation = 1;  // Full saturation
        var lightness = 0.5;  // Full color
        var color = new Color().setHSL(hue, saturation, lightness);
        var cardMaterial = new MeshPhongMaterial({ color: color, side: DoubleSide });
        var card = new Mesh(cardGeometry, cardMaterial);
        card.position.x = Math.sin(angle) * (gap + cardWidth / 2);
        card.position.z = Math.cos(angle) * (gap + cardWidth / 2);
        card.rotation.y = angle + Math.PI / 2;  // Orient the card to face away from the center
        rolodex.add(card);
    }

    // Create the Rolodex cylinder
    var cylinderHeight = cardHeight;
    var cylinderRadius = gap;  // Cylinder is cardWidth / 8 away from the y-axis
    var cylinderGeometry = new CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);
    var cylinderMaterial = new MeshPhongMaterial({ color: 0xaaaaaa });
    var cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
    rolodex.add(cylinder);

    return rolodex;
}
