import { describe, expect, it } from "vitest";
import * as feedbackModule from "./shots/FeedbackLoopDesktop";
import type { RemakeMode } from "./types";

type FeedbackDepthApi = {
  getFeedbackDepthPlane?: (mode: RemakeMode, depth: number) => number;
  getFeedbackParallaxOffset?: (
    mode: RemakeMode,
    depthPlane: number,
    cameraProgress: number,
  ) => number;
};

const api = feedbackModule as FeedbackDepthApi;
const sourceDepths = [1.12, 0.88, 1.2, 0.76, 1.34] as const;

describe("feedback-loop depth treatment", () => {
  it("quantizes Fast props to two planes and Fidelity props to five planes", () => {
    const getPlane = api.getFeedbackDepthPlane ?? (() => Number.NaN);
    const fastPlanes = sourceDepths.map((depth) => getPlane("fast", depth));
    const fidelityPlanes = sourceDepths.map((depth) =>
      getPlane("fidelity", depth),
    );

    expect(fastPlanes).toEqual([1, 0, 1, 0, 1]);
    expect(new Set(fastPlanes).size).toBe(2);
    expect(fidelityPlanes).toEqual([2, 1, 3, 0, 4]);
    expect(new Set(fidelityPlanes).size).toBe(5);
  });

  it("keeps parallax active through the push with stronger near-plane travel", () => {
    const getOffset = api.getFeedbackParallaxOffset ?? (() => Number.NaN);

    expect(getOffset("fast", 1, 0)).toBe(0);
    expect(getOffset("fidelity", 4, 0)).toBe(0);
    expect(getOffset("fast", 1, 1)).toBeGreaterThan(getOffset("fast", 0, 1));
    expect(getOffset("fidelity", 4, 1)).toBeGreaterThan(
      getOffset("fidelity", 0, 1),
    );
    expect(Math.abs(getOffset("fidelity", 4, 1))).toBeGreaterThan(
      Math.abs(getOffset("fast", 1, 1)),
    );
    expect(getOffset("fidelity", 4, 1)).toBeGreaterThan(
      getOffset("fidelity", 4, 0.5),
    );
  });
});
