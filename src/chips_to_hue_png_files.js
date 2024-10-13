import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { flatColorChips } from './color_chips.js'; // Corrected import statement
import { resolve } from 'path';

// Define the path to save the PNG files
const huePagesPath = resolve('hue_pages');

// Ensure the directory exists
if (!existsSync(huePagesPath)) {
  mkdirSync(huePagesPath);
}

// Find the maximum value_row and chroma_column
let minValueRow = 100;
let maxValueRow = -100;
let minChromaColumn = 100;
let maxChromaColumn = -100; 
flatColorChips.forEach(chip => {
  let value_row = parseInt(chip.value_row);
  if (value_row > maxValueRow) {
    maxValueRow = value_row;
  } else if (value_row < minValueRow) {
    minValueRow = value_row;
  }

  let chroma_column = parseInt(chip.chroma_column);
  if (chroma_column > maxChromaColumn) {
    maxChromaColumn = chroma_column;
  } else if (chroma_column < minChromaColumn) {
    minChromaColumn = chroma_column;
  }
});

console.log(`Value Row min:${minValueRow} max: ${maxValueRow}`);
if (minValueRow != 0 || maxValueRow !== 10) {
  console.log('Wrong valueRow');
}
console.log(`Chroma Column: min: ${minChromaColumn} ${maxChromaColumn}`);
if (minChromaColumn != 0 || maxChromaColumn != 38) {
  console.log('Wrong chromaColumns');
}

// Create a transparent template with width maxChromaColumn/2 and height maxValueRow 
const templateWidth = maxChromaColumn/2 + 1;
const templateHeight = maxValueRow + 1;
const templateCanvas = createCanvas(templateWidth, templateHeight);
const templateCtx = templateCanvas.getContext('2d');
templateCtx.clearRect(0, 0, templateWidth, templateHeight);

function createPngImages(colorChips) {
  // Group color chips by page_hue_number
  const groupedChips = colorChips.reduce((acc, chip) => {
    if (!acc[chip.page_hue_number]) {
      acc[chip.page_hue_number] = [];
    }
    acc[chip.page_hue_number].push(chip);
    return acc;
  }, {});
  let numHuePages = Object.keys(groupedChips).length;
  console.log(`Number of hue pages: ${numHuePages}`);
  if ( numHuePages !== 40 ) {
    console.log(`Wrong number of hue pages: ${numHuePages}`);
  }


  // Create a PNG image for each page_hue_number
  Object.keys(groupedChips).forEach(pageHueNumber => {
    const chips = groupedChips[pageHueNumber];
    const canvas = createCanvas(templateWidth, templateHeight);
    const ctx = canvas.getContext('2d');

    // Set transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw one RGB pixel for each color chip
    const uniqueLocations = new Set();
    chips.forEach(chip => {
      const x = parseInt(chip.chroma_column) / 2;
      const y = parseInt(chip.value_row);
      const locationKey = `${x},${y}`;
      if (uniqueLocations.has(locationKey)) {
        console.error(`Duplicate location found: ${locationKey}`);
      } else {
        uniqueLocations.add(locationKey);
      }
      ctx.fillStyle = `rgba(${chip.r}, ${chip.g}, ${chip.b}, 1)`;
      ctx.fillRect(x, y, 1, 1);
    });

    // Compute the hue file name
    const huePageName = `page_hue_${pageHueNumber}.png`;

    // Output the dimensions of the buffered image
    console.log(`Hue Page Name: ${huePageName}, Page Hue Number: ${pageHueNumber}, Dimensions: ${canvas.width}x${canvas.height}`);

    // Save the canvas as a PNG file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(resolve(huePagesPath, huePageName), buffer);
  });
}

// Call the function with the example color chips array
createPngImages(flatColorChips);