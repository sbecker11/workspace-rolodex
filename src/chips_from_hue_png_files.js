import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

// Function to create mappings from the original flatColorChips array
function createMappings(originalFlatColorChips) {
  const page_hue_number_page_hue_name_map = originalFlatColorChips.reduce((acc, chip) => {
    acc[chip.page_hue_number] = chip.page_hue_name;
    return acc;
  }, {});

  const max_chroma_column_of_hue_map = originalFlatColorChips.reduce((acc, chip) => {
    const pageHueNumber = chip.page_hue_number;
    const chromaColumn = parseInt(chip.chroma_column, 10);
    if (!acc[pageHueNumber] || acc[pageHueNumber] < chromaColumn) {
      acc[pageHueNumber] = chromaColumn;
    }
    return acc;
  }, {});

  const max_chroma_column_of_all_hue_pages = Math.max(...Object.values(max_chroma_column_of_hue_map));

  return { page_hue_number_page_hue_name_map, max_chroma_column_of_hue_map, max_chroma_column_of_all_hue_pages };
}

// Function to read PNG files from a inputHuePngsDirectory
function readPngFiles(inputHuePngsDirectory) {
  return fs.readdirSync(inputHuePngsDirectory).filter(file => path.extname(file) === '.png');
}

// Function to extract color information from a PNG file
// and return an array of color chips that match the format 
// of the original flatColorChips array
async function extractColorInformation(filePath, isScaled, mappings) {
  const { page_hue_number_page_hue_name_map, max_chroma_column_of_hue_map, max_chroma_column_of_all_hue_pages } = mappings;
  const image = await loadImage(filePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  const colorChips = [];
  const rectWidth = 75;
  const rectHeight = 75;
  const gapWidth = 10;
  const gapHeight = 10;

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      if (pixelData[3] !== 0) { // Check if the pixel is not transparent
        const pageHueNumber = parseInt(path.basename(filePath).match(/\d+/)[0], 10); // Extract hue page number from file name
        const maxChromaColumn = max_chroma_column_of_hue_map[pageHueNumber];
        const scaleFactor = max_chroma_column_of_all_hue_pages / maxChromaColumn;

        let chromaColumn;
        if (isScaled) {
          chromaColumn = x / scaleFactor;
        } else {
          chromaColumn = x * 2;
        }
        const valueRow = y;
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];

        const pageHueName = page_hue_number_page_hue_name_map[pageHueNumber];
        const colorKey = `${pageHueName}-${valueRow}-${chromaColumn}`;

        colorChips.push({
          x1: (gapWidth / 2 + x * (rectWidth + gapWidth)).toString(),
          y1: (gapHeight / 2 + y * (rectHeight + gapHeight)).toString(),
          x2: (gapWidth / 2 + x * (rectWidth + gapWidth) + rectWidth).toString(),
          y2: (gapHeight / 2 + y * (rectHeight + gapHeight) + rectHeight).toString(),
          page_hue_number: pageHueNumber.toString(),
          page_hue_name: pageHueName,
          value_row: valueRow.toString(),
          chroma_column: chromaColumn.toString(),
          color_key: colorKey,
          r: r.toString(),
          g: g.toString(),
          b: b.toString()
        });
      }
    }
  }
  return colorChips;
}

// Function to generate the chips array from a inputHuePngsDirectory of PNG files
export async function chipsFromHuePngFiles(inputHuePngsDirectory, originalFlatColorChips) {
  const isScaled = !inputHuePngsDirectory.includes('unscaled');
  const mappings = createMappings(originalFlatColorChips);
  const pngFiles = readPngFiles(inputHuePngsDirectory);
  let allColorChips = [];

  for (const file of pngFiles) {
    const filePath = path.join(inputHuePngsDirectory, file);
    const colorChips = await extractColorInformation(filePath, isScaled, mappings);
    allColorChips = allColorChips.concat(colorChips);
  }

  return allColorChips;
}

// Function to save the chips array to a .js file
function saveChipsArrayToFile(chipsArray, newColorChipsPath) {
  const content = `export const flatColorChips = ${JSON.stringify(chipsArray, null, 2)};`;
  fs.writeFileSync(newColorChipsPath, content, 'utf8');
}

import { flatColorChips as originalFlatColorChips } from './color_chips.js';

// Main function to process the scaled or non-scaled 
// inputHuePngsDirectory to generate the new color chips
// array and save it to newColorChipsPath. 
// The original flatColorChips array is used as reference
// and the isScaled flag is recovered from the 
// inputHuePngsDirectory
export async function processHuePngsDirectory (
  inputHuePngsDirectory, newColorChipsPath, originalFlatColorChips) {
  const newChipsArray = await chipsFromHuePngFiles(inputHuePngsDirectory, originalFlatColorChips);
  saveChipsArrayToFile(newChipsArray, newColorChipsPath);
  console.log(`newChipsArray saved to ${newColorChipsPath}`);
}

async function invertUnscaled() {
  await processHuePngsDirectory(
    './hue_pages_unscaled', 
    './new_unscaled_color_chips.js', 
    originalFlatColorChips
  );
}

async function invertScaled() {
  await processHuePngsDirectory(
    './hue_pages_scaled', 
    './new_scaled_color_chips.js', 
    originalFlatColorChips
  );
}

invertUnscaled();