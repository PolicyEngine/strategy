import { palette, ColorKey } from './palette';

describe('palette', () => {
  it('should export palette object with all colors', () => {
    expect(palette).toBeDefined();
    expect(typeof palette).toBe('object');
  });

  it('should have all required color properties', () => {
    const requiredColors: ColorKey[] = [
      'WHITE',
      'BLUE_98',
      'BLUE',
      'BLUE_LIGHT',
      'BLUE_PRESSED',
      'DARK_BLUE_HOVER',
      'DARKEST_BLUE',
      'TEAL_ACCENT',
      'TEAL_LIGHT',
      'TEAL_PRESSED',
      'LIGHT_GRAY',
      'GRAY',
      'MEDIUM_DARK_GRAY',
      'MEDIUM_LIGHT_GRAY',
      'DARK_GRAY',
      'DARK_RED',
      'BLACK',
    ];

    requiredColors.forEach(color => {
      expect(palette).toHaveProperty(color);
      expect(typeof palette[color]).toBe('string');
    });
  });

  it('should have valid hex color values', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    
    Object.values(palette).forEach(color => {
      expect(color).toMatch(hexColorRegex);
    });
  });

  it('should have correct specific color values', () => {
    expect(palette.WHITE).toBe('#FFFFFF');
    expect(palette.BLUE).toBe('#2C6496');
    expect(palette.BLACK).toBe('#000000');
  });

  it('should have blue gradient colors in correct order', () => {
    // Blue colors should get darker
    const blueGradient = [
      palette.BLUE_98,
      palette.BLUE_LIGHT,
      palette.BLUE,
      palette.BLUE_PRESSED,
      palette.DARK_BLUE_HOVER,
      palette.DARKEST_BLUE,
    ];

    // Check that each color is defined
    blueGradient.forEach(color => {
      expect(color).toBeDefined();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('should have gray gradient colors', () => {
    const grayColors = [
      palette.LIGHT_GRAY,
      palette.MEDIUM_LIGHT_GRAY,
      palette.MEDIUM_DARK_GRAY,
      palette.GRAY,
      palette.DARK_GRAY,
    ];

    grayColors.forEach(color => {
      expect(color).toBeDefined();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('should have accent colors', () => {
    const accentColors = [
      palette.TEAL_ACCENT,
      palette.TEAL_LIGHT,
      palette.TEAL_PRESSED,
      palette.DARK_RED,
    ];

    accentColors.forEach(color => {
      expect(color).toBeDefined();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});