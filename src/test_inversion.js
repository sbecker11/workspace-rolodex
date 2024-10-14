import { chipsFromHuePngFiles } from './chips_from_hue_png_files.js';
import { flatColorChips as originalFlatColorChips } from './color_chips.js';

// Function to reformat the the given color chips array
// so all values are strings and the array is sorted by
// page_hue_number, value_row, chroma_column
export function reformatColorChips(colorChips) {
    
    // Reformat each chip to ensure all values are strings
    const reformattedChips = colorChips.map(chip => ({
      x1: chip.x1.toString(),
      y1: chip.y1.toString(),
      x2: chip.x2.toString(),
      y2: chip.y2.toString(),
      page_hue_number: chip.page_hue_number.toString(),
      page_hue_name: chip.page_hue_name,
      value_row: chip.value_row.toString(),
      chroma_column: chip.chroma_column.toString(),
      color_key: chip.color_key,
      r: chip.r.toString(),
      g: chip.g.toString(),
      b: chip.b.toString()
    }));
  
    // Sort the reformatted chips by page_hue_number, value_row, chroma_column
    reformattedChips.sort((a, b) => {
      const pageHueNumberComparison = a.page_hue_number.localeCompare(b.page_hue_number, undefined, { numeric: true });
      if (pageHueNumberComparison !== 0) return pageHueNumberComparison;
  
      const valueRowComparison = a.value_row.localeCompare(b.value_row, undefined, { numeric: true });
      if (valueRowComparison !== 0) return valueRowComparison;
  
      return a.chroma_column.localeCompare(b.chroma_column, undefined, { numeric: true });
    });
  
    return reformattedChips;
  }
  
// Main function to perform the test
async function testInversion() {
  const inputHuePngsDirectory = './hue_pages_unscaled';
  const newColorChips = await chipsFromHuePngFiles(inputHuePngsDirectory, originalFlatColorChips);
  const reformattedNewColorChips = reformatColorChips(newColorChips);
  const reformattedOrigColorChips = reformatColorChips(originalFlatColorChips);

  // Compare the new color chips array with the original flatColorChips array
  const arraysAreEqual = JSON.stringify(reformattedNewColorChips) === JSON.stringify(reformattedOrigColorChips);
  if (arraysAreEqual) {
    console.log('Test passed: The reformatted new color_chips array is identical to the reformatted original flatColorChips array.');
  } else {
    console.log('Test failed: The reformatted new color_chips array is not identical to the reformatted original flatColorChips array.');
    console.log(`first row of reformattedNewColorChips:\n${JSON.stringify(reformattedNewColorChips[0])}`);
    console.log(`first row of reformattedOrigColorChips:\n${JSON.stringify(reformattedOrigColorChips[0])}`);
  }
}

// Run the test
testInversion();