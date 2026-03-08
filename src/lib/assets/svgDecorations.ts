import type { HeadingDecorationStyle } from "../../types";

export type HeadingIconLevel = "h1" | "h2" | "h3";

function svgDataUri(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function parseHexColor(color: string): [number, number, number] {
  const hex = color.trim().replace("#", "");
  const normalized = hex.length === 3
    ? hex.split("").map((value) => value + value).join("")
    : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return [29, 121, 183];
  }

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function mixColor(color: string, target: [number, number, number], ratio: number): string {
  const base = parseHexColor(color);
  const mixed = base.map((value, index) => Math.round(value + (target[index] - value) * ratio));
  return `rgb(${mixed[0]},${mixed[1]},${mixed[2]})`;
}

function withAlpha(color: string, alpha: number): string {
  const [r, g, b] = parseHexColor(color);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const backgroundSvgs = {
  dotGrid: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><circle cx='2' cy='2' r='1' fill='rgba(0,0,0,0.09)'/></svg>`),
  waveLines: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='60' viewBox='0 0 160 60'><path d='M0 30 C20 8 40 8 60 30 C80 52 100 52 120 30 C140 8 160 8 180 30' stroke='rgba(0,0,0,0.08)' fill='none' stroke-width='1.2'/></svg>`),
  diagonalMesh: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'><path d='M0 34 L34 0 M-8 8 L8 -8 M26 42 L42 26' stroke='rgba(0,0,0,0.06)' stroke-width='1'/></svg>`),
  cornerAura: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'><defs><radialGradient id='g' cx='0.18' cy='0.1' r='0.7'><stop offset='0' stop-color='rgba(255,255,255,0.45)'/><stop offset='1' stop-color='rgba(255,255,255,0)'/></radialGradient></defs><rect width='280' height='280' fill='url(#g)'/></svg>`),
  hexNet: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='54' height='46' viewBox='0 0 54 46'><path d='M13 2 L27 10 L27 26 L13 34 L-1 26 L-1 10 Z M40 2 L54 10 L54 26 L40 34 L26 26 L26 10 Z' fill='none' stroke='rgba(0,0,0,0.07)' stroke-width='1'/></svg>`),
  grain: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='80' height='80' filter='url(#n)' opacity='0.08'/></svg>`),
  rings: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'><circle cx='45' cy='45' r='26' fill='none' stroke='rgba(0,0,0,0.06)'/><circle cx='45' cy='45' r='14' fill='none' stroke='rgba(0,0,0,0.05)'/></svg>`),
  staircase: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><path d='M0 40 H16 V24 H32 V8 H48' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='2'/></svg>`),
  arcs: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'><path d='M-10 80 C30 15 90 15 130 80' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.4'/><path d='M-10 95 C30 30 90 30 130 95' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1.2'/></svg>`),
  plusGrid: svgDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'><path d='M15 7 V23 M7 15 H23' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'/></svg>`),
};

function headingIconSvg(level: HeadingIconLevel, color: string, variant: number, size: number): string {
  const icons: Record<HeadingIconLevel, string[]> = {
    h1: [
      `<path fill='none' stroke='${color}' stroke-width='1.8' d='M12 2 L22 12 L12 22 L2 12 Z'/><circle cx='12' cy='12' r='3.3' fill='${color}'/>`,
      `<path fill='none' stroke='${color}' stroke-width='2' d='M4 12 H20 M12 4 V20'/><circle cx='12' cy='12' r='8.5' fill='none' stroke='${color}' stroke-width='1.4'/>`,
      `<path fill='${color}' d='M12 2 L22 22 H2 Z'/><circle cx='12' cy='14' r='2.4' fill='white'/>`,
      `<rect x='4' y='4' width='16' height='16' rx='3' fill='none' stroke='${color}' stroke-width='1.8'/><path d='M7 12 H17' stroke='${color}' stroke-width='1.8'/>`,
      `<circle cx='12' cy='12' r='9' fill='none' stroke='${color}' stroke-width='2'/><path d='M7 12 L11 16 L18 8' stroke='${color}' stroke-width='1.8' fill='none'/>`,
    ],
    h2: [
      `<path fill='${color}' d='M12 2 L22 12 L12 22 L2 12 Z'/>`,
      `<circle cx='12' cy='12' r='8' fill='none' stroke='${color}' stroke-width='2'/><circle cx='12' cy='12' r='2.8' fill='${color}'/>`,
      `<rect x='5' y='5' width='14' height='14' rx='7' fill='none' stroke='${color}' stroke-width='2'/><path d='M12 7 V17 M7 12 H17' stroke='${color}' stroke-width='1.6'/>`,
      `<path d='M4 12 H20 M12 4 V20' stroke='${color}' stroke-width='1.8'/><circle cx='12' cy='12' r='2.5' fill='${color}'/>`,
      `<path fill='none' stroke='${color}' stroke-width='1.8' d='M3 15 L9 9 L14 14 L21 7'/>`,
    ],
    h3: [
      `<circle cx='12' cy='12' r='7' fill='none' stroke='${color}' stroke-width='2'/><circle cx='12' cy='12' r='2.8' fill='${color}'/>`,
      `<rect x='6' y='6' width='12' height='12' rx='2' fill='none' stroke='${color}' stroke-width='2'/><path d='M8 12 H16' stroke='${color}' stroke-width='1.8'/>`,
      `<path d='M4 12 H20' stroke='${color}' stroke-width='2'/><circle cx='12' cy='12' r='3' fill='${color}'/>`,
      `<path fill='${color}' d='M12 4 L19 12 L12 20 L5 12 Z'/>`,
      `<path fill='none' stroke='${color}' stroke-width='2' d='M6 18 L12 6 L18 18 Z'/><circle cx='12' cy='14' r='2' fill='${color}'/>`,
    ],
  };

  const parts = icons[level];
  const body = parts[variant % parts.length];
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'>${body}</svg>`;
}

export function headingDecorationDataUri(level: HeadingIconLevel, color: string, variant: number, size: number): string {
  const svg = headingIconSvg(level, color, variant, size);
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function headingAccentDataUri(style: Exclude<HeadingDecorationStyle, "auto">, color: string, size: number): string {
  const soft = mixColor(color, [255, 255, 255], 0.48);
  const vivid = mixColor(color, [255, 214, 92], 0.22);
  const deep = mixColor(color, [18, 28, 46], 0.24);
  const mist = withAlpha(color, 0.16);
  const glow = withAlpha(color, 0.28);

  const accentMap: Record<Exclude<HeadingDecorationStyle, "auto">, string> = {
    gem: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <path d='M18 4 L25 11 L18 18 L11 11 Z' fill='${soft}' opacity='0.88'/>
      <path d='M7 22 L12 17 L17 22 L12 27 Z' fill='${glow}'/>
      <circle cx='28' cy='10' r='2.4' fill='${vivid}'/>
      <circle cx='28' cy='26' r='1.8' fill='${deep}' opacity='0.6'/>
    `,
    cross: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <path d='M18 5 V31 M5 18 H31' stroke='${soft}' stroke-width='2.6' stroke-linecap='round'/>
      <path d='M9 9 L27 27 M27 9 L9 27' stroke='${glow}' stroke-width='1.4' stroke-linecap='round' opacity='0.9'/>
      <circle cx='25' cy='11' r='2.2' fill='${vivid}'/>
    `,
    triangle: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <path d='M18 4 L31 28 H5 Z' fill='${soft}' opacity='0.9'/>
      <path d='M18 9 L26 24 H10 Z' fill='none' stroke='${deep}' stroke-width='1.5' opacity='0.65'/>
      <circle cx='27' cy='12' r='2.1' fill='${vivid}'/>
    `,
    ring: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <circle cx='18' cy='18' r='11.5' fill='none' stroke='${soft}' stroke-width='2.5'/>
      <circle cx='18' cy='18' r='6.5' fill='none' stroke='${glow}' stroke-width='2'/>
      <circle cx='29' cy='14' r='2.4' fill='${vivid}'/>
    `,
    spark: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <path d='M18 4 L20.8 13.8 L31 18 L20.8 22.2 L18 32 L15.2 22.2 L5 18 L15.2 13.8 Z' fill='${soft}' opacity='0.92'/>
      <circle cx='28' cy='11' r='2.3' fill='${vivid}'/>
      <circle cx='10' cy='8.5' r='1.7' fill='${glow}'/>
    `,
    ribbon: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <path d='M5 20 C10 8, 21 8, 31 15 C24 15, 17 20, 13 31 C11 24, 9 22, 5 20 Z' fill='${soft}' opacity='0.9'/>
      <path d='M9 24 C15 17, 21 15, 29 16' stroke='${deep}' stroke-width='1.5' fill='none' opacity='0.55'/>
      <circle cx='27' cy='11' r='2.2' fill='${vivid}'/>
    `,
    bloom: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <circle cx='18' cy='10' r='5.4' fill='${soft}' opacity='0.86'/>
      <circle cx='25.5' cy='18' r='5.4' fill='${glow}' opacity='0.9'/>
      <circle cx='18' cy='26' r='5.4' fill='${vivid}' opacity='0.72'/>
      <circle cx='10.5' cy='18' r='5.4' fill='${soft}' opacity='0.64'/>
      <circle cx='18' cy='18' r='3.4' fill='${deep}' opacity='0.72'/>
    `,
    orbit: `
      <circle cx='18' cy='18' r='17' fill='${mist}'/>
      <ellipse cx='18' cy='18' rx='12.5' ry='6.3' fill='none' stroke='${soft}' stroke-width='2'/>
      <ellipse cx='18' cy='18' rx='7.2' ry='13' fill='none' stroke='${glow}' stroke-width='1.6' opacity='0.95'/>
      <circle cx='29' cy='16' r='2.6' fill='${vivid}'/>
      <circle cx='11' cy='25.5' r='1.9' fill='${deep}' opacity='0.58'/>
    `,
  };

  return svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 36 36'>
      ${accentMap[style]}
    </svg>
  `);
}

export function headingTrailDataUri(style: Exclude<HeadingDecorationStyle, "auto">, color: string, width: number, height: number): string {
  const soft = mixColor(color, [255, 255, 255], 0.5);
  const vivid = mixColor(color, [255, 214, 92], 0.24);
  const deep = mixColor(color, [18, 28, 46], 0.2);
  const glow = withAlpha(color, 0.24);

  const trailMap: Record<Exclude<HeadingDecorationStyle, "auto">, string> = {
    gem: `
      <path d='M8 18 H40' stroke='${glow}' stroke-width='2.2' stroke-linecap='round'/>
      <path d='M44 10 L52 18 L44 26 L36 18 Z' fill='${soft}' opacity='0.94'/>
      <circle cx='28' cy='18' r='3' fill='${vivid}' opacity='0.72'/>
    `,
    cross: `
      <path d='M8 18 H52' stroke='${glow}' stroke-width='2.2' stroke-linecap='round'/>
      <path d='M40 9 V27 M31 18 H49' stroke='${soft}' stroke-width='2' stroke-linecap='round'/>
      <circle cx='20' cy='18' r='2.4' fill='${vivid}'/>
    `,
    triangle: `
      <path d='M8 22 H28' stroke='${glow}' stroke-width='2' stroke-linecap='round'/>
      <path d='M36 8 L52 28 H20 Z' fill='${soft}' opacity='0.9'/>
      <path d='M36 14 L44 25 H28 Z' fill='none' stroke='${deep}' stroke-width='1.4' opacity='0.58'/>
    `,
    ring: `
      <path d='M8 18 H52' stroke='${glow}' stroke-width='2' stroke-linecap='round'/>
      <circle cx='39' cy='18' r='8.5' fill='none' stroke='${soft}' stroke-width='2.2'/>
      <circle cx='39' cy='18' r='3.4' fill='${vivid}' opacity='0.7'/>
    `,
    spark: `
      <path d='M8 18 H28' stroke='${glow}' stroke-width='2' stroke-linecap='round'/>
      <path d='M40 5 L42.5 14 L52 18 L42.5 22 L40 31 L37.5 22 L28 18 L37.5 14 Z' fill='${soft}' opacity='0.95'/>
      <circle cx='19' cy='18' r='2.2' fill='${vivid}'/>
    `,
    ribbon: `
      <path d='M8 20 C16 9, 26 9, 35 18 C42 25, 48 23, 52 17' fill='none' stroke='${soft}' stroke-width='2.6' stroke-linecap='round'/>
      <path d='M10 26 C20 18, 31 18, 44 20' fill='none' stroke='${glow}' stroke-width='1.8' stroke-linecap='round'/>
      <circle cx='46' cy='14' r='2.2' fill='${vivid}'/>
    `,
    bloom: `
      <path d='M8 18 H24' stroke='${glow}' stroke-width='2' stroke-linecap='round'/>
      <circle cx='39' cy='11.5' r='5.1' fill='${soft}' opacity='0.82'/>
      <circle cx='45' cy='18' r='5.1' fill='${glow}' opacity='0.92'/>
      <circle cx='39' cy='24.5' r='5.1' fill='${vivid}' opacity='0.7'/>
      <circle cx='33' cy='18' r='5.1' fill='${soft}' opacity='0.6'/>
      <circle cx='39' cy='18' r='2.8' fill='${deep}' opacity='0.68'/>
    `,
    orbit: `
      <path d='M8 18 H24' stroke='${glow}' stroke-width='2' stroke-linecap='round'/>
      <ellipse cx='40' cy='18' rx='11' ry='5.5' fill='none' stroke='${soft}' stroke-width='2'/>
      <ellipse cx='40' cy='18' rx='6.2' ry='11.2' fill='none' stroke='${vivid}' stroke-width='1.5' opacity='0.85'/>
      <circle cx='50.5' cy='17' r='2.4' fill='${soft}'/>
    `,
  };

  return svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 60 36'>
      ${trailMap[style]}
    </svg>
  `);
}
