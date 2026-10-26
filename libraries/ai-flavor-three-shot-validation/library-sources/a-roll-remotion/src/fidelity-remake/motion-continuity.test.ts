import { describe, expect, it } from "vitest";
import {
  getLeaderboardFocus,
  getOrbitalBlinkOpacity,
  getStarTwinkleOpacity,
} from "./motion-continuity";

const adjacentDeltas = (values: number[]) =>
  values.slice(1).map((value, index) => Math.abs(value - values[index]));

describe("leaderboard camera focus", () => {
  it("moves continuously into the lower-row detail push", () => {
    const focus = Array.from({ length: 144 }, (_, frame) =>
      getLeaderboardFocus(frame),
    );

    expect(focus[93]).toEqual({ xPercent: 50, yPercent: 50 });
    expect(focus[143]).toEqual({ xPercent: 55, yPercent: 69 });
    expect(
      Math.max(...adjacentDeltas(focus.map(({ xPercent }) => xPercent))),
    ).toBeLessThan(0.25);
    expect(
      Math.max(...adjacentDeltas(focus.map(({ yPercent }) => yPercent))),
    ).toBeLessThan(0.75);
  });
});

describe("orbital title flicker", () => {
  it("keeps the targeting blink continuous while retaining a visible pulse", () => {
    const opacity = Array.from({ length: 120 }, (_, frame) =>
      getOrbitalBlinkOpacity(frame),
    );

    expect(Math.max(...adjacentDeltas(opacity))).toBeLessThan(0.12);
    expect(Math.min(...opacity.slice(14, 25))).toBeLessThan(0.9);
    expect(Math.min(...opacity)).toBeGreaterThanOrEqual(0.78);
    expect(Math.max(...opacity)).toBeLessThanOrEqual(1);
  });

  it("loops star twinkle without a sawtooth reset", () => {
    for (let index = 0; index < 10; index++) {
      const opacity = Array.from({ length: 120 }, (_, frame) =>
        getStarTwinkleOpacity(frame, index),
      );

      expect(Math.max(...adjacentDeltas(opacity))).toBeLessThan(0.04);
      expect(Math.min(...opacity)).toBeGreaterThanOrEqual(0.2);
      expect(Math.max(...opacity)).toBeLessThanOrEqual(0.44);
    }
  });
});
