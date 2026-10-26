import type { RemakeMode } from "../types";
import { Easing } from "remotion";
import {
  FastStagedTrainingQuestion,
  getFastStagedTrainingCamera,
  getFastStagedTrainingDepth,
  getFastStagedTrainingTimeline,
} from "./StagedTrainingQuestionFast";
import {
  FidelityStagedTrainingQuestion,
  getFidelityStagedTrainingCamera,
  getFidelityStagedTrainingDepth,
  getFidelityStagedTrainingTimeline,
} from "./StagedTrainingQuestionFidelity";

export {
  FastStagedTrainingQuestion,
  FidelityStagedTrainingQuestion,
  getFastStagedTrainingCamera,
  getFastStagedTrainingDepth,
  getFastStagedTrainingTimeline,
  getFidelityStagedTrainingCamera,
  getFidelityStagedTrainingDepth,
  getFidelityStagedTrainingTimeline,
};

const legacyReveal = (frame: number, start: number, end: number) =>
  Easing.out(Easing.cubic)(
    Math.max(0, Math.min(1, (frame - start) / (end - start))),
  );

export const getStagedTrainingTimeline = (frame: number) => ({
  originFolder: legacyReveal(frame, 12, 32),
  trainingFolder: legacyReveal(frame, 22, 48),
  person: legacyReveal(frame, 28, 52),
  header: legacyReveal(frame, 6, 18),
  footer: legacyReveal(frame, 8, 22),
  note: legacyReveal(frame, 68, 78),
});

export const StagedTrainingQuestion = ({
  mode,
}: {
  readonly mode: RemakeMode;
}) =>
  mode === "fast" ? (
    <FastStagedTrainingQuestion />
  ) : (
    <FidelityStagedTrainingQuestion />
  );
