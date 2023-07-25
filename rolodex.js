// rolodex.js
import { Group, PlaneGeometry, MeshPhongMaterial, Mesh, CylinderGeometry, Color, DoubleSide } from './node_modules/three/build/three.module.js';

export function createRolodex() {
    // Create the Rolodex
    var rolodex = new Group();
    rolodex.rotation.reorder('YXZ'); // Ensure that the Euler angles are in YXZ order

    // Add a cylinder to the Rolodex
    var cylinderMaterial = new MeshPhongMaterial({ color: 0x808080 }); // Gray color
    var cylinderGeometry = new CylinderGeometry(0.25, 0.25, 2, 32); // Radius 0.25, Height 2, 32 segments
    var cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = 0; // Centered vertically
    rolodex.add(cylinder);

    // Create the cards of the Rolodex
    var numCards = 40;
    var cardGeometry = new PlaneGeometry(1, 1.5);
    for (var i = 0; i < numCards; i++) {
        var angle = (i / numCards) * Math.PI * 2;
        var hue = angle / (Math.PI * 2);  // Normalize to a range between 0 and 1
        var saturation = 1;  // Full saturation
        var lightness = 0.5;  // Full color
        var color = new Color().setHSL(hue, saturation, lightness);
        var cardMaterial = new MeshPhongMaterial({ color: color, side: DoubleSide });
        var card = new Mesh(cardGeometry, cardMaterial);
        var angle = (i / numCards) * Math.PI * 2;
        card.position.x = Math.sin(angle) * 1.2;
        card.position.z = Math.cos(angle) * 1.2;
        card.rotation.y = angle + Math.PI / 2;  // Orient the card to face away from the center
        rolodex.add(card);

        // Here you can add your code for the content on each card
    }
    
    return rolodex;
}
