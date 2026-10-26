import {describe, expect, it} from "vitest";
import {
  getAdvancedAmbiguityState,
  getConstellationState,
  getFormulaGraphState,
} from "./motion";

const expectFiniteState = (state: Record<string, number>) => {
  expect(Object.values(state).every(Number.isFinite)).toBe(true);
};

const expectMonotonicCamera = (
  frames: readonly number[],
  sampler: (frame: number) => {camera: number},
) => {
  const samples = frames.map((frame) => sampler(frame).camera);
  expect(samples).toEqual([...samples].sort((left, right) => left - right));
};

describe("AI flavor validation motion", () => {
  it("clamps the advanced ambiguity stages at both ends", () => {
    expect(getAdvancedAmbiguityState(-30).tableau).toBe(0);
    expect(getAdvancedAmbiguityState(194).conclusion).toBe(1);

    for (const frame of [-30, 0, 36, 90, 150, 194, 224]) {
      expectFiniteState(getAdvancedAmbiguityState(frame));
    }

    expectMonotonicCamera(
      [0, 36, 90, 150, 194],
      getAdvancedAmbiguityState,
    );
  });

  it("clamps the constellation stages at both ends", () => {
    expect(getConstellationState(-30).cards).toBe(0);
    expect(getConstellationState(179).cards).toBe(1);

    for (const frame of [-30, 0, 36, 84, 132, 179, 209]) {
      expectFiniteState(getConstellationState(frame));
    }

    expectMonotonicCamera([0, 36, 84, 132, 179], getConstellationState);
  });

  it("clamps the formula graph stages at both ends", () => {
    expect(getFormulaGraphState(-30).center).toBe(0);
    expect(getFormulaGraphState(308).labels).toBe(1);

    for (const frame of [-30, 0, 54, 132, 222, 308, 338]) {
      expectFiniteState(getFormulaGraphState(frame));
    }

    expectMonotonicCamera([0, 54, 132, 222, 308], getFormulaGraphState);
  });
});
