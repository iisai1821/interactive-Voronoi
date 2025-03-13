/**
 * Averages an array of hex color codes and returns the resulting hex color.
 * @param colors - An array of hex color strings (e.g., ["#FF5733", "#33FF57", "#3357FF"]).
 * @returns A hex string representing the averaged color.
 */
export default function averageHexColors(colors: string[]): string {
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
