// textUtils.js

//import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js';
//import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { MeshBasicMaterial, Mesh } from '../node_modules/three/build/three.module.js';

export function addTextToCard(text, textColor, card, cardX, cardY, fontSize) {
    var loader = new FontLoader();

    loader.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        var geometry = new TextGeometry(text, {
            font: font,
            size: fontSize,
            height: fontSize * 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: fontSize * 0.005,
            bevelSize: fontSize * 0.005,
            bevelOffset: 0,
            bevelSegments: 5
        });

        var material = new MeshBasicMaterial({ color: textColor }); 
        var textMesh = new Mesh(geometry, material);

        textMesh.position.set(cardX, cardY, 0);  // Adjust this position to correctly place the text on the card
        card.add(textMesh);
    });
}
