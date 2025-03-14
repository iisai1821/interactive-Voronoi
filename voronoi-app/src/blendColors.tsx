/**
 * Averages an array of hex color codes and returns the resulting hex color.
 * @param colors - An array of hex color strings (e.g., ["#FF5733", "#33FF57", "#3357FF"]).
 * @returns A hex string representing the averaged color.
 */
export function averageHexColors(colors: string[]): string {
  if (colors.length === 0) return "#000000"; // Default to black if no colors provided

  let totalR = 0, totalG = 0, totalB = 0;

  colors.forEach(color => {
    const rgb = hexToRgb(color);
    if (rgb) {
      totalR += rgb.r;
      totalG += rgb.g;
      totalB += rgb.b;
    }
  });

  const count = colors.length;
  const avgR = Math.round(totalR / count);
  const avgG = Math.round(totalG / count);
  const avgB = Math.round(totalB / count);

  return rgbToHex(avgR, avgG, avgB);
}

/**
 * Converts a hex color string to an RGB object.
 * @param hex - A hex color string (e.g., "#FF5733").
 * @returns An object with r, g, and b values or null if input is invalid.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let normalizedHex = hex.replace(/^#/, "");
  
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex.split("").map(c => c + c).join(""); // Expand shorthand hex
  }

  if (!/^([A-Fa-f0-9]{6})$/.test(normalizedHex)) {
    return null; // Invalid hex format
  }

  const bigint = parseInt(normalizedHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Converts RGB values to a hex color string.
 * @param r - Red (0-255).
 * @param g - Green (0-255).
 * @param b - Blue (0-255).
 * @returns A hex color string (e.g., "#AABBCC").
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Compares two colors and returns true if they are similar.
 * @param color1 - First color in hex format (e.g., "#FF5733"). 
 * @param color2 - Second color in hex format (e.g., "#33FF57").
 * @param threshold - Similarity threshold (0-255). Default is 50.  
 * @returns True if colors are similar, false otherwise.
 */
export function colorsAreSimilar(color1: string, color2: string, threshold: number = 50): boolean {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return false; // Invalid colors

  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );

  return distance < threshold;
}
