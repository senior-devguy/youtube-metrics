// Per-source color palettes. Each source family (channels, stores) gets a
// monochromatic ramp so the eye can group them at a glance, while still
// distinguishing individual items by lightness/saturation.

export const channelPalette = [
  "hsl(0 78% 55%)", // bright red
  "hsl(14 84% 56%)", // red-orange
  "hsl(345 70% 50%)", // crimson
  "hsl(28 88% 58%)", // amber
];

export const storePalette = [
  "hsl(235 100% 71%)", // brand indigo
  "hsl(260 70% 65%)", // violet
  "hsl(210 80% 60%)", // sky
  "hsl(200 80% 50%)", // info blue
];

export function colorFor(idx: number, palette: string[]): string {
  return palette[idx % palette.length] ?? palette[0]!;
}
