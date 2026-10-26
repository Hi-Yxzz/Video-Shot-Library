import { writeFile } from "node:fs/promises";

const TARGET_HUE = 24.7 / 360;
const LUMA = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const clamp = (value) => Math.max(0, Math.min(1, value));

function rgbToSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function hueToRgb(p, q, t) {
  let wrapped = t;
  if (wrapped < 0) wrapped += 1;
  if (wrapped > 1) wrapped -= 1;
  if (wrapped < 1 / 6) return p + (q - p) * 6 * wrapped;
  if (wrapped < 1 / 2) return q;
  if (wrapped < 2 / 3) return p + (q - p) * (2 / 3 - wrapped) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    hueToRgb(p, q, h + 1 / 3),
    hueToRgb(p, q, h),
    hueToRgb(p, q, h - 1 / 3),
  ];
}

function orangeAtLuma(targetLuma, saturation) {
  let low = 0;
  let high = 1;
  for (let index = 0; index < 24; index += 1) {
    const lightness = (low + high) / 2;
    const candidate = hslToRgb(TARGET_HUE, saturation, lightness);
    if (LUMA(candidate) < targetLuma) low = lightness;
    else high = lightness;
  }
  return hslToRgb(TARGET_HUE, saturation, (low + high) / 2);
}

export function mapRgbToOrange(r, g, b) {
  const saturation = rgbToSaturation(r, g, b);
  if (saturation <= 0.12) return [r, g, b];

  const blend = clamp((saturation - 0.12) / 0.13);
  const target = orangeAtLuma(LUMA([r, g, b]), Math.max(0.82, saturation));
  return [r, g, b].map((channel, index) =>
    clamp(channel + (target[index] - channel) * blend),
  );
}

export async function writeOrangeCube(path, { size = 33 } = {}) {
  const lines = [
    'TITLE "Video Shot Library FF6900"',
    `LUT_3D_SIZE ${size}`,
    "DOMAIN_MIN 0.0 0.0 0.0",
    "DOMAIN_MAX 1.0 1.0 1.0",
  ];

  for (let blue = 0; blue < size; blue += 1) {
    for (let green = 0; green < size; green += 1) {
      for (let red = 0; red < size; red += 1) {
        const mapped = mapRgbToOrange(
          red / (size - 1),
          green / (size - 1),
          blue / (size - 1),
        );
        lines.push(mapped.map((value) => value.toFixed(7)).join(" "));
      }
    }
  }

  await writeFile(path, `${lines.join("\n")}\n`);
}
