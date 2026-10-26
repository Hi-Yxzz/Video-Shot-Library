import assert from "node:assert/strict";
import { test } from "node:test";

import { mapRgbToOrange } from "../scripts/orange-eagle/lut.mjs";

const luma = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function hue([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let value;
  if (max === r) value = ((g - b) / delta) % 6;
  else if (max === g) value = (b - r) / delta + 2;
  else value = (r - g) / delta + 4;
  return (value * 60 + 360) % 360;
}

test("preserves neutral black, gray, and white", () => {
  for (const value of [0, 0.25, 0.5, 0.75, 1]) {
    assert.deepEqual(mapRgbToOrange(value, value, value), [value, value, value]);
  }
});

test("maps saturated primary colors to the FF6900 hue", () => {
  for (const rgb of [
    [0.8, 0.05, 0.05],
    [0.05, 0.8, 0.05],
    [0.05, 0.05, 0.8],
  ]) {
    const mapped = mapRgbToOrange(...rgb);
    assert.ok(Math.abs(hue(mapped) - 24.7) < 2);
    assert.ok(mapped[0] > mapped[1] && mapped[1] > mapped[2]);
  }
});

test("preserves perceived luminance within eight percent", () => {
  for (const rgb of [
    [0.7, 0.1, 0.1],
    [0.1, 0.7, 0.1],
    [0.1, 0.1, 0.7],
    [0.2, 0.55, 0.8],
  ]) {
    const before = luma(rgb);
    const after = luma(mapRgbToOrange(...rgb));
    assert.ok(Math.abs(after - before) / before <= 0.08, `${before} -> ${after}`);
  }
});
