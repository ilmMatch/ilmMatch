export function generateRandomColor(baseHue: number): string {
  const hue = (baseHue + Math.random() * 30 - 15 + 360) % 360;
  const saturation = 85 + Math.random() * 10;
  const lightness = 45 + Math.random() * 10;
  return `hsl(${hue.toFixed(2)}, ${saturation.toFixed(2)}%, ${lightness.toFixed(2)}%)`;
}

export function getRandomGradientDirection(): string {
  // const directions = ['to right', 'to left', 'to bottom', 'to top', 'to bottom right', 'to left bottom', 'to top right', 'to top left'];
  const directions = directionsInDeg;
  return directions[Math.floor(Math.random() * directions.length)];
}

const directionsInDeg = [
  '0deg', // Vertical - Top to Bottom
  '45deg', // Diagonal - Top Left to Bottom Right
  '90deg', // Horizontal - Left to Right
  '135deg', // Diagonal - Bottom Left to Top Right
  '180deg', // Vertical - Bottom to Top
  '225deg', // Diagonal - Bottom Right to Top Left
  '270deg', // Horizontal - Right to Left
  '315deg', // Diagonal - Top Right to Bottom Left
  '30deg', // Slightly tilted from Top to Bottom Right
  '60deg', // Between Top Right and Bottom Right
  '120deg', // Between Bottom Right and Bottom Left
  '150deg', // Slightly tilted from Bottom to Bottom Left
  '210deg', // Slightly tilted from Bottom to Bottom Right
  '240deg', // Between Bottom Left and Top Left
  '300deg', // Between Top Left and Top Right
  '330deg', // Slightly tilted from Top to Top Right
];
