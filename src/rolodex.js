import * as THREE from 'three';
import { Math_PI } from './math.js';
import { colorChips } from './color_chips.js';
import { customLog } from './logger.js';

// Define the conversion factor from radians to degrees
const radiansToDegrees = 180 / Math_PI;

export function createRolodex() {
    // Define the cylinder radius
    const cylinderRadius = 5; // Adjust this value as needed
    const cardWidth = 1; // Define the width of each card
    const cardHeight = 2; // Define the height of each card
    const chipSize = 0.2; // Define the size of each chip
    
    // Create the Rolodex
    let rolodex = new THREE.Group();

    // Create the cards of the Rolodex
    let numCards = 40;
    for (let i = 0; i < numCards; i++) {
        let angleRad = (i / numCards) * Math_PI * 2;
        let card = createCard(angleRad, cylinderRadius, cardWidth, cardHeight);
        rolodex.add(card);

        let matchingColorChips = colorChips.filter(chip => chip.page_hue_number - 1 === i);
        let degrees = Math.floor(angleRad * radiansToDegrees);
        let pageHueName = matchingColorChips[0].page_hue_name;

        const hueMapping = {
            'R': 0/360,     // Red
            'YR': 30/360,   // Yellow-Red
            'Y': 60/360,    // Yellow
            'GY': 90/360,   // Green-Yellow
            'G': 120/360,   // Green
            'BG': 150/360,  // Blue-Green
            'B': 180/360,   // Blue
            'PB': 210/360,  // Purple-Blue
            'P': 270/360,   // Purple
            'RP': 330/360   // Red-Purple
        };

        // Calculate the hue for the hue page
        // let hue = i / numCards;
        const hue = hueMapping[pageHueName.split(' ')[0]] || i / numCards;

        customLog("pageHueName:", pageHueName,"hue:", hue.toFixed(3));

        // Assign colors to the card based on the hue values
        let maxValueRow = 0;
        matchingColorChips.forEach(colorChip => {
            let chip = createChip(colorChip, chipSize, hue);
            if ( chip ) {
                card.add(chip);
                maxValueRow = Math.max(maxValueRow, colorChip.value_row || 0);
            }
        });
    }

    // Create the central grey-scaled cylinder
    // const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, cardHeight, 32);
    // const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    // const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    // rolodex.add(cylinder);

    const totalRadius = cylinderRadius + cardWidth / 2;
    const totalHeight = cardHeight;
    customLog(`totalRadius:${totalRadius} totalHeight:${totalHeight} maxValueRow:${maxValueRow}`);

    return rolodex;
}

function hueToRgb(hue) {
    const h = hue * 360;
    const c = 1;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = 0;

    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return new THREE.Color(
        Math.max(0, Math.min(1, r + m)),
        Math.max(0, Math.min(1, g + m)),
        Math.max(0, Math.min(1, b + m))
    );
}


// Function to create a card with the specified angle, radius, width, and height
function createCard(angleRad, radius, width, height) {
    let card = new THREE.Group();
    let geometry = new THREE.PlaneGeometry(width, height);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    let mesh = new THREE.Mesh(geometry, material);
    card.add(mesh);

    card.position.set(radius * Math.cos(angleRad), 0, radius * Math.sin(angleRad));
    card.rotation.y = -angleRad;

    return card;
}

// Function to create a chip with the specified color and size
function createChip(colorChip, size, hue) {
    let geometry = new THREE.BoxGeometry(size, size, size);
    let color = hueToRgb(hue);
    let material = new THREE.MeshBasicMaterial({ color: color });
    let mesh = new THREE.Mesh(geometry, material);

    // Position the chip based on its value row and chroma column
    if ( colorChip.chroma_column && colorChip.value_row ) {
        mesh.position.set(
            (colorChip.chroma_column - 1) * size,
            (colorChip.value_row - 1) * size,
            0
        );

        return mesh;
    } else {
        return null;
    }
}