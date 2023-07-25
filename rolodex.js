// createRolodex.js
import { BoxGeometry, MeshPhongMaterial, Mesh, Group, DoubleSide, Color } from './node_modules/three/build/three.module.js';

export function createRolodex() {
    // Create the Rolodex
    var rolodex = new Group();

    // Create the cards of the Rolodex
    var numCards = 40;
    var cardGeometry = new BoxGeometry(1, 1.5, 0.02);  // Cuboid geometry with small depth to give 3D effect
    for (var i = 0; i < numCards; i++) {
        var angle = (i / numCards) * Math.PI * 2;
        var hue = angle / (Math.PI * 2);  // Normalize to a range between 0 and 1
        var saturation = 1;  // Full saturation
        var lightness = 0.5;  // Full color
        var color = new Color().setHSL(hue, saturation, lightness);
        var cardMaterial = new MeshPhongMaterial({ color: color, side: DoubleSide });
        var card = new Mesh(cardGeometry, cardMaterial);
        card.position.x = Math.sin(angle) * 1.2;
        card.position.z = Math.cos(angle) * 1.2;
        card.rotation.y = angle + Math.PI / 2;  // Orient the card to face away from the center
        rolodex.add(card);
    }

    return rolodex;
}
