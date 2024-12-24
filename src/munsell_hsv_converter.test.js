import MunsellHSVConverter from './munsell_hsv_converter.js';

describe('MunsellHSVConverter.convertHSVtoMunsell', () => {
    test('should convert HSV to Munsell notation correctly', () => {
        const hsvColor = { hue: 0.5/360, saturation: 0.8, value: 0.9 };
        const result = MunsellHSVConverter.convertHSVtoMunsell(hsvColor);
        expect(result).toBe('1.0R 9.0/12.8');
    });

    test('should handle zero hue steps correctly', () => {
        const hsvColor = { hue: 0, saturation: 0.05, value: 0.5 };
        const result = MunsellHSVConverter.convertHSVtoMunsell(hsvColor);
        expect(result).toBe('N 5.0/0.0');
    });
});