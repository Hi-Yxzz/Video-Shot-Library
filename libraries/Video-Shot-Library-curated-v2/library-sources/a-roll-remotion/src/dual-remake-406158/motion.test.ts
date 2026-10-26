import {describe, expect, it} from "vitest";
import {DUAL_REMAKE_406158_PAIRS} from "./catalog";
import {
  deterministicTextureValue,
  sampleCamera,
  segmentProgress,
  smoothSegmentProgress,
} from "./motion";

describe("segmentProgress", () => {
  it("clamps before and after a segment", () => {
    expect(segmentProgress(-10, 0, 20)).toBe(0);
    expect(segmentProgress(10, 0, 20)).toBe(0.5);
    expect(segmentProgress(30, 0, 20)).toBe(1);
  });

  it("remains finite for a collapsed segment", () => {
    expect(segmentProgress(4, 5, 5)).toBe(0);
    expect(segmentProgress(5, 5, 5)).toBe(1);
  });
});

describe("smoothSegmentProgress", () => {
  it("is clamped and continuous at both segment boundaries", () => {
    expect(smoothSegmentProgress(-1, 0, 20)).toBe(0);
    expect(smoothSegmentProgress(0, 0, 20)).toBe(0);
    expect(smoothSegmentProgress(20, 0, 20)).toBe(1);
    expect(smoothSegmentProgress(21, 0, 20)).toBe(1);
    expect(smoothSegmentProgress(0.001, 0, 20)).toBeCloseTo(0, 6);
    expect(smoothSegmentProgress(19.999, 0, 20)).toBeCloseTo(1, 6);
  });
});

describe("sampleCamera", () => {
  it("returns finite camera values across and outside every pair duration", () => {
    for (const pair of DUAL_REMAKE_406158_PAIRS) {
      for (let frame = -30; frame <= pair.durationInFrames + 30; frame += 3) {
        const camera = sampleCamera(pair.cameraBeats, frame);
        expect(
          [
            camera.scale,
            camera.panX,
            camera.panY,
            camera.rollDegrees,
          ].every(Number.isFinite),
        ).toBe(true);
      }
    }
  });

  it("clamps to the first and final camera beats", () => {
    const pair = DUAL_REMAKE_406158_PAIRS[0];

    expect(sampleCamera(pair.cameraBeats, -100)).toEqual(
      sampleCamera(pair.cameraBeats, 0),
    );
    expect(sampleCamera(pair.cameraBeats, pair.durationInFrames + 100)).toEqual(
      sampleCamera(pair.cameraBeats, pair.durationInFrames - 1),
    );
  });

  it("has no visible jump immediately before camera beat boundaries", () => {
    for (const pair of DUAL_REMAKE_406158_PAIRS) {
      for (const beat of pair.cameraBeats.slice(1)) {
        const before = sampleCamera(pair.cameraBeats, beat.outputFrame - 1);
        const atBoundary = sampleCamera(pair.cameraBeats, beat.outputFrame);

        expect(before.scale).toBeCloseTo(atBoundary.scale, 1);
        expect(before.panX).toBeCloseTo(atBoundary.panX, 0);
        expect(before.panY).toBeCloseTo(atBoundary.panY, 0);
        expect(before.rollDegrees).toBeCloseTo(atBoundary.rollDegrees, 1);
      }
    }
  });
});

describe("deterministicTextureValue", () => {
  it("returns repeatable normalized values derived from indices", () => {
    const firstPass = Array.from({length: 12}, (_, index) =>
      deterministicTextureValue(index, 406158),
    );
    const secondPass = Array.from({length: 12}, (_, index) =>
      deterministicTextureValue(index, 406158),
    );

    expect(firstPass).toEqual(secondPass);
    expect(new Set(firstPass).size).toBeGreaterThan(1);
    expect(firstPass.every((value) => value >= 0 && value <= 1)).toBe(true);
    expect(firstPass.every(Number.isFinite)).toBe(true);
  });
});
