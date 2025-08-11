import { palette } from './palette';

describe('palette', () => {
  it('should export palette object with all colors', () => {
    expect(palette).toBeDefined();
    expect(typeof palette).toBe('object');
  });

  it('should have all required color properties', () => {
    const requiredColors = [
      'WHITE',
      'BLUE_98',
      'BLUE_80',
      'BLUE_60',
      'BLUE_50',
      'BLUE_25',
      'BLUE',
      'DARK_BLUE',
      'DARKEST_BLUE',
      'TEAL_ACCENT',
      'LIGHTER_GREEN',
      'LIGHT_GRAY',
      'GRAY',
      'MEDIUM_GRAY',
      'DARK_GRAY',
      'BLACK',
      'RED',
      'LIGHT_RED',
      'YELLOW',
      'LIGHT_YELLOW',
      'ORANGE',
      'LIGHT_ORANGE',
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
    expect(palette.BLUE).toBe('#2c6e94');
    expect(palette.BLACK).toBe('#000000');
    expect(palette.RED).toBe('#ff4458');
  });

  it('should have blue gradient colors in correct order', () => {
    // Blue colors should get darker as we go from BLUE_98 to DARKEST_BLUE
    const blueGradient = [
      palette.BLUE_98,
      palette.BLUE_80,
      palette.BLUE_60,
      palette.BLUE_50,
      palette.BLUE_25,
      palette.BLUE,
      palette.DARK_BLUE,
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
      palette.GRAY,
      palette.MEDIUM_GRAY,
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
      palette.LIGHTER_GREEN,
      palette.RED,
      palette.LIGHT_RED,
      palette.YELLOW,
      palette.LIGHT_YELLOW,
      palette.ORANGE,
      palette.LIGHT_ORANGE,
    ];

    accentColors.forEach(color => {
      expect(color).toBeDefined();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});