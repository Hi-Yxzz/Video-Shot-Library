import type {CameraBeat, CameraState} from "./types";

const tidy = (value: number) => Math.round(value * 1_000_000) / 1_000_000;

export const segmentProgress = (
  frame: number,
  startFrame: number,
  endFrame: number,
) => {
  if (endFrame <= startFrame) {
    return frame >= endFrame ? 1 : 0;
  }

  return Math.max(0, Math.min(1, (frame - startFrame) / (endFrame - startFrame)));
};

export const smoothSegmentProgress = (
  frame: number,
  startFrame: number,
  endFrame: number,
) => {
  const progress = segmentProgress(frame, startFrame, endFrame);
  return progress * progress * (3 - 2 * progress);
};

export const sampleCamera = (
  track: readonly CameraBeat[],
  frame: number,
): CameraState => {
  if (track.length === 0) {
    throw new Error("Camera track must contain at least one beat");
  }

  const first = track[0];
  const last = track[track.length - 1];
  if (frame <= first.outputFrame) {
    const {outputFrame: _outputFrame, ...state} = first;
    return state;
  }
  if (frame >= last.outputFrame) {
    const {outputFrame: _outputFrame, ...state} = last;
    return state;
  }

  const rightIndex = track.findIndex((beat) => beat.outputFrame >= frame);
  const left = track[rightIndex - 1];
  const right = track[rightIndex];
  const progress = smoothSegmentProgress(
    frame,
    left.outputFrame,
    right.outputFrame,
  );
  const mix = (from: number, to: number) => tidy(from + (to - from) * progress);

  return {
    scale: mix(left.scale, right.scale),
    panX: mix(left.panX, right.panX),
    panY: mix(left.panY, right.panY),
    rollDegrees: mix(left.rollDegrees, right.rollDegrees),
    transformOrigin: left.transformOrigin,
  };
};

export const deterministicTextureValue = (index: number, salt = 0) => {
  let value = (Math.trunc(index) ^ Math.trunc(salt) ^ 0x6d2b79f5) | 0;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_295;
};
