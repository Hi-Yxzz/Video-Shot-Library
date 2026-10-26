import {describe, expect, test} from "vitest";
import {REFERENCE_LAYOUT} from "./layout";
import {clampedProgress, visibleCount} from "./timeline";

describe("A-roll 13–17 timeline helpers", () => {
  test("clamps an entrance progress before and after its frame range", () => {
    expect(clampedProgress(4, 8, 18)).toBe(0);
    expect(clampedProgress(13, 8, 18)).toBeCloseTo(0.5);
    expect(clampedProgress(22, 8, 18)).toBe(1);
  });

  test("reveals list items only after their configured frames", () => {
    expect(visibleCount(5, [6, 28, 54])).toBe(0);
    expect(visibleCount(28, [6, 28, 54])).toBe(2);
    expect(visibleCount(80, [6, 28, 54])).toBe(3);
  });

  test("keeps measured reference geometry for the large text overlays", () => {
    expect(REFERENCE_LAYOUT.agentCard).toMatchObject({
      left: 56,
      top: 68,
      width: 686,
      height: 340,
      titleSize: 88,
    });
    expect(REFERENCE_LAYOUT.numberedRow).toMatchObject({
      left: 56,
      top: 93,
      width: 672,
      height: 168,
      numberSize: 150,
      textSize: 72,
    });
    expect(REFERENCE_LAYOUT.titleBuild.fontSize).toBe(430);
    expect(REFERENCE_LAYOUT.claim.fontSize).toBe(210);
  });
});
