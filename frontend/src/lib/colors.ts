import chroma from 'chroma-js';

export function generate_color_palette(base_colors: string[], total_colors: number): string[] {
  const colors_per_base = Math.ceil(total_colors / base_colors.length);
  const palette: string[] = [];

  for (const color of base_colors) {
    // Generate a small scale from light to dark for this base color
    const scale = chroma.scale([chroma(color).brighten(1.5), chroma(color).darken(1.5)])
      .mode('lch') // perceptual color space for smoother transitions
      .colors(colors_per_base);

    palette.push(...scale);
  }

  // If too many colors, trim; if too few, repeat (in case of weird inputs)
  return palette.slice(0, total_colors);
}

export function category_color(id: string, palette: string[]): string {
  const hash = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return palette[hash % palette.length];
}