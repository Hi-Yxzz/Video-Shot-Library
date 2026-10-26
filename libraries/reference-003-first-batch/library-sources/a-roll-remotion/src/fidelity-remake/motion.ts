import type {CameraKeyframe} from "./types";

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

type CameraState = Omit<CameraKeyframe, "outputFrame">;

const tidy = (value: number) => Math.round(value * 1_000_000) / 1_000_000;

export const interpolateCameraTrack = (
  track: readonly CameraKeyframe[],
  frame: number,
): CameraState => {
  if (track.length === 0) {
    throw new Error("Camera track must contain at least one keyframe");
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

  const rightIndex = track.findIndex((keyframe) => keyframe.outputFrame >= frame);
  const left = track[rightIndex - 1];
  const right = track[rightIndex];
  const progress = segmentProgress(frame, left.outputFrame, right.outputFrame);
  const mix = (from: number, to: number) => tidy(from + (to - from) * progress);

  return {
    scale: mix(left.scale, right.scale),
    panX: mix(left.panX, right.panX),
    panY: mix(left.panY, right.panY),
    rollDegrees: mix(left.rollDegrees, right.rollDegrees),
    transformOrigin: left.transformOrigin,
  };
};
