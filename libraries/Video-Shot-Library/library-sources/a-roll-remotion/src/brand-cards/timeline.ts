import {Easing, interpolate} from "remotion";

export const cardEntrance = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const floatingOffset = (
  frame: number,
  amplitude: number,
  phase: number,
) => Math.sin((frame / 24) * Math.PI * 2 + phase) * amplitude;
