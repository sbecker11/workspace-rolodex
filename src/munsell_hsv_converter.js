export class MunsellHSVConverter {
    constructor() {
        this.munsellToHsvMapping = {
            'R': 0,     // Red
            'YR': 30,   // Yellow-Red
            'Y': 60,    // Yellow
            'GY': 90,   // Green-Yellow
            'G': 120,   // Green
            'BG': 150,  // Blue-Green
            'B': 180,   // Blue
            'PB': 210,  // Purple-Blue
            'P': 270,   // Purple
            'RP': 330   // Red-Purple
        };
    }

    /**
     * Convert HSV color to approximate Munsell notation
     * 
     * @param {{hue: number, saturation: number, value: number}} hsvColor - HSV color object
     * @returns {string} Munsell color notation in the format 'Hue Value/Chroma'
     */
    static convertHSVtoMunsell(hsvColor) {
        const { hue, saturation, value } = hsvColor;
        
        // Normalize hue to 0-360 degrees
        const normalizedHue = hue * 360;

        // Handle near-neutral colors (very low saturation)
        if (saturation < 0.1) {
            // Neutral colors use 'N' notation
            const neutralValue = Math.round(value * 10 * 10) / 10;
            return `N ${neutralValue.toFixed(1)}/0.0`;
        }

        // Find closest Munsell hue direction
        const munsellToHsvMapping = {
            'R': 0,     // Red
            'YR': 30,   // Yellow-Red
            'Y': 60,    // Yellow
            'GY': 90,   // Green-Yellow
            'G': 120,   // Green
            'BG': 150,  // Blue-Green
            'B': 180,   // Blue
            'PB': 210,  // Purple-Blue
            'P': 270,   // Purple
            'RP': 330   // Red-Purple
        };

        const closestHue = Object.entries(munsellToHsvMapping)
            .reduce((prev, curr) => 
                Math.abs(curr[1] - normalizedHue) < Math.abs(prev[1] - normalizedHue) ? curr : prev
            )[0];
        
        const baseHue = munsellToHsvMapping[closestHue];
        
        // Always calculate hue steps
        let hueSteps = Math.round((normalizedHue - baseHue) / 10);
        
        // Ensure steps are within 0-3 range
        hueSteps = (hueSteps + 36) % 36;
        if (hueSteps > 3) {
            hueSteps = 3;
        }

        // Convert value and chroma
        const munsellValue = Math.round(value * 10 * 10) / 10;
        const munsellChroma = Math.round(saturation * 16 * 10) / 10;
        
        // Always return with hue steps, even if it's 1.0
        return `${hueSteps > 0 ? `${hueSteps}.0` : '1.0'}${closestHue} ${munsellValue.toFixed(1)}/${munsellChroma.toFixed(1)}`;
    }
}

export default MunsellHSVConverter;