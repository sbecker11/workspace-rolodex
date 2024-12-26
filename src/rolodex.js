// rolodex.js
import { PlaneGeometry, BoxGeometry, MeshPhongMaterial, Mesh } from 'three';
import { CylinderGeometry, Group, DoubleSide, Color } from 'three';
//import { flatColorChips } from './color_chips.js';
// import { flatColorChips } from './new_unscaled_color_chips.js';
import { flatColorChips } from './new_scaled_color_chips.js';

import { customLog } from './logger.js';

let cardWidth = 1.0;

let { colorChips, cardHeight, minX, maxX, minY, maxY, chipSize, chipMargin, min_value_row, max_value_row, min_chroma_column, max_chroma_column } = scaleColorChips(flatColorChips, cardWidth);
customLog(`cardHeight:${cardHeight}`);
customLog(`minX:${minX} maxX:${maxX}`);
customLog(`minX:${minY} maxX:${maxY}`);
customLog(`chipSize:${chipSize} chipMargin:${chipMargin}`);
if ( min_value_row && max_value_row )  customLog(`value_row:${min_value_row} .. ${max_value_row}`);
else customLog("min/max value_row undefined");
if ( min_chroma_column && max_chroma_column )  customLog(`chroma_column:${min_chroma_column} .. ${max_chroma_column}`);
else customLog("min/max chroma_column undefined");

function scaleColorChips(allColorChips, cardWidth) {

    customLog(`incoming numColorChips:${allColorChips.length}`);

    // Convert strings to floating point numbers
    allColorChips.forEach(chip => {
        chip.x1 = parseFloat(chip.x1);
        chip.x2 = parseFloat(chip.x2);
        chip.y1 = parseFloat(chip.y1);
        chip.y2 = parseFloat(chip.y2);
        chip.value_row = parseInt(chip.value_row);
        chip.chroma_column = parseInt(chip.chroma_column);
        chip.page_hue_number = parseInt(chip.page_hue_number);
    });

    customLog(`before valueRow filtering numColorChips:${allColorChips.length}`);

    // keep only colorChips with value_row between 1 and 9
    const colorChips = allColorChips.filter(chip => {
        return chip.value_row >= 1 && chip.value_row <= 9;
    });

    customLog(`after valueRow filtering numColorChips:${colorChips.length}`);

    // Find ranges
    let xValues = colorChips.map(chip => chip.x1).concat(colorChips.map(chip => chip.x2));
    let yValues = colorChips.map(chip => chip.y1).concat(colorChips.map(chip => chip.y2));
    let valueRows = colorChips.map(chip => chip.value_row);
    let chromaColumns = colorChips.map(chip => chip.chroma_column);
    let huePages = colorChips.map(chip => chip.page_hue_number);

    let minX = Math.min(...xValues);
    let maxX = Math.max(...xValues);
    let minY = Math.min(...yValues);
    let maxY = Math.max(...yValues);
    let min_value_row = Math.min(...valueRows);
    let max_value_row = Math.max(...valueRows);
    let min_chroma_column = Math.min(...chromaColumns);
    let max_chroma_column = Math.max(...chromaColumns);
    let min_hue_page_number = Math.min(...huePages);
    let max_hue_page_number = Math.max(...huePages);

    console.log(`min_value_row:${min_value_row}`);
    console.log(`max_value_row:${max_value_row}`);
    console.log(`min_chroma_column:${min_chroma_column}`);
    console.log(`max_chroma_column:${max_chroma_column}`);
    console.log(`min_hue_page_number:${min_hue_page_number}`);
    console.log(`max_hue_page_number:${max_hue_page_number}`);
    // Calculate chip size and chip margin
    let chipSize = 75;
    let chipMargin = 5;

    // Scale chip dimensions to fit card width
    let scaleFactor = cardWidth / (maxX - minX + chipSize + chipMargin);
    chipSize *= scaleFactor;
    chipMargin *= scaleFactor;

    // Adjust card height to match aspect ratio of x-range and y-range
    let cardHeight = cardWidth * (maxY - minY) / (maxX - minX) - chipSize/2;

    // Translate and orient the color chips
    colorChips.forEach(chip => {
        let x_scale = -1;
        chip.x1 = cardWidth/2 - (chip.x1 * scaleFactor) + x_scale*chipSize;
        chip.x2 = cardWidth/2 - (chip.x2 * scaleFactor) + x_scale*chipSize;
        chip.y1 = (chip.y1 - minY) * scaleFactor - cardHeight/2; // flip y-axis to make minY at the top
        chip.y2 = (chip.y2 - minY) * scaleFactor - cardHeight/2; // flip y-axis to make minY at the top
        let h = (chip.page_hue_number-1) / max_hue_page_number;
        let s = chip.chroma_column / max_chroma_column;
        let v = (10+chip.value_row) / 10;
        [chip.r, chip.g, chip.b] = rgb_from_hsv(h, s, v);
    });

    return { colorChips, cardHeight, minX, maxX, minY, maxY, chipSize, chipMargin };
}

function rgb_from_hsv(h, s, v) {
    // h, s and v are between 0 and 1
    h = h * 360;
    
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }
    return [r*255, g*255, b*255];
}

function createChip(colorChip, chipSize) {
    let chipDepth = (cardWidth/2 - colorChip.x1) * 0.16;
    let chipGeometry = new BoxGeometry(chipSize, chipSize, chipDepth);
    let chipColor = new Color(
        parseInt(colorChip.r)/255.0, 
        parseInt(colorChip.g)/255.0, 
        parseInt(colorChip.b)/255.0
        );
    let chipMaterial = new MeshPhongMaterial({
        color: chipColor, 
        specular: 0x9d9d9d, // Specular color (gray)
        shininess: 100 // Shininess of the material (higher value means more specular highlights)
      });
    let chip = new Mesh(chipGeometry, chipMaterial);
    chip.position.set(colorChip.x1 + chipSize / 2, colorChip.y1 + chipSize / 2, -chipDepth / 2);
    return chip;
}

let cylinderRadius = 0;

function createCard(angleRad, cylinderRadius, cardWidth, cardHeight) {
    // Create card
    let cardGeometry = new PlaneGeometry(cardWidth, cardHeight);
    let cardMaterial = new MeshPhongMaterial({
         //color: new Color(0xffffff), 
         side: DoubleSide,
         transparent: true, // Enable transparency
         opacity: 0.00 // Set opacity level (0 = fully transparent, 1 = fully opaque)
        });
    let card = new Mesh(cardGeometry, cardMaterial);
    card.position.x = Math.sin(angleRad) * (cylinderRadius + cardWidth / 2);
    card.position.z = Math.cos(angleRad) * (cylinderRadius + cardWidth / 2);
    card.rotation.y = angleRad + Math.PI / 2;

    return card;
}

function createCylinder(cardHeight, cylinderRadius) {
    // Create cylinder
    let cylinderGeometry = new CylinderGeometry(cylinderRadius, cylinderRadius, cardHeight, 32);
    let cylinderMaterial = new MeshPhongMaterial({ color: 0xaaaaaa });
    let cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
    return cylinder;
}

let degreesToRadians = 2*Math.PI/360;
let radiansToDegrees = 1.0/degreesToRadians;

export function createRolodex() {
    // Create the Rolodex
    let rolodex = new Group();

    // Create the cards of the Rolodex
    let numCards = 40;
    for (let i = 0; i < numCards; i++) {
        // if (i % 4 !== 0)
        //     continue;
        let angleRad = (i / numCards) * Math.PI * 2;
        let card = createCard(angleRad, cylinderRadius, cardWidth, cardHeight);
        rolodex.add(card);

        let matchingColorChips = colorChips.filter(chip => chip.page_hue_number-1 === i);
        let degrees = Math.floor(angleRad*radiansToDegrees);
        let pageHueName = matchingColorChips[0].page_hue_name;
        if ( pageHueName.startsWith('5.0') ) {
            customLog(`card:${i} pageHueName:${pageHueName} degrees:${degrees} #matchingColorChips ${matchingColorChips.length}`)
        }

        matchingColorChips.forEach(colorChip => {
            let chip = createChip(colorChip, chipSize);
            card.add(chip);
        });
    }

    let cylinder = createCylinder(cardHeight, cylinderRadius);
    rolodex.add(cylinder);

    return rolodex;
}
