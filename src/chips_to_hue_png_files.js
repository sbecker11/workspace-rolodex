import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { flatColorChips } from './color_chips.js'; // Corrected import statement
import { resolve } from 'path';

function findMinMaxValues(chips, huePageNumber = null) {
  // Filter chips by huePageNumber if provided
  const filteredChips = huePageNumber !== null
    ? chips.filter(chip => parseInt(chip.page_hue_number, 10) === parseInt(huePageNumber, 10))
    : chips;

  // console.log(`Filtered Chips for huePageNumber ${huePageNumber}:`, filteredChips);

  if (filteredChips.length === 0) {
    return {
      minChromaColumn: Infinity,
      maxChromaColumn: -Infinity,
      minValueRow: Infinity,
      maxValueRow: -Infinity
    };
  }

  const chromaColumns = filteredChips.map(chip => parseInt(chip.chroma_column, 10));
  const valueRows = filteredChips.map(chip => parseInt(chip.value_row, 10));

  const minChromaColumn = Math.min(...chromaColumns);
  const maxChromaColumn = Math.max(...chromaColumns);
  const minValueRow = Math.min(...valueRows);
  const maxValueRow = Math.max(...valueRows);

  return {
    minChromaColumn,
    maxChromaColumn,
    minValueRow,
    maxValueRow
  };
}

// Get the min and max values for all chips
const allChipsRange = findMinMaxValues(flatColorChips);

// Create a transparent template with the maximum width and height
const templateWidth = (allChipsRange.maxChromaColumn - allChipsRange.minChromaColumn) / 2 + 1; // Adjusted for even chromaColumn values
const templateHeight = allChipsRange.maxValueRow - allChipsRange.minValueRow + 1; // +1 to include the maximum value_row value
const templateCanvas = createCanvas(templateWidth, templateHeight);
const templateCtx = templateCanvas.getContext('2d');
templateCtx.clearRect(0, 0, templateWidth, templateHeight);

function interpolateColor(startColor, endColor, factor) {
  const result = startColor.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (endColor[i] - result[i]));
  }
  return result;
}

function createPngImages(colorChips, scaleChroma = false) {
  // Determine the output folder based on scaleChroma
  const outputFolder = scaleChroma ? resolve('./hue_pages_scaled') : resolve('./hue_pages_unscaled');

  // Ensure the output folder exists
  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder, { recursive: true });
  }

  // Group color chips by page_hue_number
  const groupedChips = colorChips.reduce((acc, chip) => {
    const pageHueNumber = parseInt(chip.page_hue_number, 10);
    if (!acc[pageHueNumber]) {
      acc[pageHueNumber] = [];
    }
    acc[pageHueNumber].push(chip);
    return acc;
  }, {});

  // Create a PNG image for each page_hue_number
  Object.keys(groupedChips).forEach(pageHueNumber => {
    const chips = groupedChips[pageHueNumber];
    const { minChromaColumn, maxChromaColumn, minValueRow, maxValueRow } = findMinMaxValues(chips, pageHueNumber);

    console.log(`Hue Page Number: ${pageHueNumber}`);
    console.log(`Min Chroma Column: ${minChromaColumn}, Max Chroma Column: ${maxChromaColumn}`);
    console.log(`Min Value Row: ${minValueRow}, Max Value Row: ${maxValueRow}`);

    const canvas = createCanvas(templateWidth, templateHeight);
    const ctx = canvas.getContext('2d');

    // Set transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factor if scaleChroma is true
    const scaleFactor = scaleChroma ? allChipsRange.maxChromaColumn / maxChromaColumn : 1;

    // Draw one RGB pixel for each color chip
    const uniqueLocations = new Set();
    chips.forEach(chip => {
      const x = Math.round((chip.chroma_column - minChromaColumn) * scaleFactor / 2); // Normalize and scale chroma_column, adjusted for even values
      const y = chip.value_row - minValueRow; // Normalize value_row to start from 0
      const locationKey = `${x},${y}`;
      if (uniqueLocations.has(locationKey)) {
        console.error(`Duplicate location found: ${locationKey}`);
      } else {
        uniqueLocations.add(locationKey);
      }
      ctx.fillStyle = `rgba(${chip.r}, ${chip.g}, ${chip.b}, 1)`;
      ctx.fillRect(x, y, 1, 1);
    });

    // Interpolate colors along each row
    for (let y = 0; y < templateHeight; y++) {
      let startColor = null;
      let endColor = null;
      let startX = null;
      let endX = null;

      for (let x = 0; x < templateWidth; x++) {
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        if (pixelData[3] !== 0) { // Check if the pixel is not transparent
          if (startColor === null) {
            startColor = [pixelData[0], pixelData[1], pixelData[2]];
            startX = x;
          } else {
            endColor = [pixelData[0], pixelData[1], pixelData[2]];
            endX = x;
            const distance = endX - startX;
            for (let i = 1; i < distance; i++) {
              const factor = i / distance;
              const interpolatedColor = interpolateColor(startColor, endColor, factor);
              ctx.fillStyle = `rgba(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]}, 1)`;
              ctx.fillRect(startX + i, y, 1, 1);
            }
            startColor = endColor;
            startX = endX;
          }
        }
      }
    }

    // Compute the hue file name
    const huePageName = `page_hue_${pageHueNumber}.png`;

    // Output the dimensions of the buffered image
    console.log(`Hue Page Name: ${huePageName}, Page Hue Number: ${pageHueNumber}, Dimensions: ${canvas.width}x${canvas.height}`);

    // Save the canvas as a PNG file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(resolve(outputFolder, huePageName), buffer);
  });
}

// Example usage
createPngImages(flatColorChips, false);
createPngImages(flatColorChips, true);