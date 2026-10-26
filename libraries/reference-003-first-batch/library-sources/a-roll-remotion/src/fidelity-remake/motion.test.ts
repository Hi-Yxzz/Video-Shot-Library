import {describe, expect, it} from "vitest";
import {interpolateCameraTrack, segmentProgress} from "./motion";

describe("segmentProgress", () => {
  it("clamps progress before and after a segment", () => {
    expect(segmentProgress(4, 10, 20)).toBe(0);
    expect(segmentProgress(15, 10, 20)).toBe(0.5);
    expect(segmentProgress(26, 10, 20)).toBe(1);
  });
});

describe("interpolateCameraTrack", () => {
  const track = [
    {
      outputFrame: 0,
      scale: 1.12,
      panX: -12,
      panY: 6,
      rollDegrees: -0.4,
      transformOrigin: "50% 46%",
    },
    {
      outputFrame: 20,
      scale: 1,
      panX: 8,
      panY: -4,
      rollDegrees: 0.2,
      transformOrigin: "50% 50%",
    },
  ] as const;

  it("linearly interpolates numeric camera values between keyframes", () => {
    expect(interpolateCameraTrack(track, 10)).toEqual({
      scale: 1.06,
      panX: -2,
      panY: 1,
      rollDegrees: -0.1,
      transformOrigin: "50% 46%",
    });
  });

  it("clamps to the first and last camera keyframes", () => {
    expect(interpolateCameraTrack(track, -5).scale).toBe(1.12);
    expect(interpolateCameraTrack(track, 40)).toEqual({
      scale: 1,
      panX: 8,
      panY: -4,
      rollDegrees: 0.2,
      transformOrigin: "50% 50%",
    });
  });
});
