import {Easing, interpolate} from "remotion";

export const stageProgress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const getAdvancedAmbiguityState = (frame: number) => ({
  tableau: stageProgress(frame, 8, 30),
  people: stageProgress(frame, 24, 44),
  options: stageProgress(frame, 62, 112),
  question: stageProgress(frame, 126, 148),
  conclusion: stageProgress(frame, 168, 190),
  camera: stageProgress(frame, 0, 194),
});

export const getConstellationState = (frame: number) => ({
  cards: stageProgress(frame, 0, 92),
  center: stageProgress(frame, 52, 108),
  edges: stageProgress(frame, 78, 136),
  summary: stageProgress(frame, 124, 164),
  camera: stageProgress(frame, 0, 179),
});

export const getFormulaGraphState = (frame: number) => ({
  center: stageProgress(frame, 8, 48),
  edges: stageProgress(frame, 42, 112),
  nodes: stageProgress(frame, 90, 168),
  labels: stageProgress(frame, 150, 218),
  summary: stageProgress(frame, 220, 272),
  camera: stageProgress(frame, 0, 308),
});
