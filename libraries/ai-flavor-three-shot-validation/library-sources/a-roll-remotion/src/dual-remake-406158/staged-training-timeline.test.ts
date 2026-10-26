import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import * as stagedModule from "./shots/StagedTrainingQuestion";

type TimelineSample = {
  tableau: number;
  folders: number;
  person: number;
  topNote: number;
  question: number;
  conclusion: number;
};

type DepthSample = Record<string, number>;
type CameraSample = {
  scale: number;
  panX: number;
  panY: number;
};
type LegacyTimelineSample = {
  originFolder: number;
  trainingFolder: number;
  person: number;
  header: number;
  footer: number;
  note: number;
};

type StagedTrainingApi = {
  FastStagedTrainingQuestion?: unknown;
  FidelityStagedTrainingQuestion?: unknown;
  getFastStagedTrainingTimeline?: (frame: number) => TimelineSample;
  getFidelityStagedTrainingTimeline?: (frame: number) => TimelineSample;
  getFastStagedTrainingDepth?: (frame: number) => DepthSample;
  getFidelityStagedTrainingDepth?: (frame: number) => DepthSample;
  getFastStagedTrainingCamera?: (frame: number) => CameraSample;
  getFidelityStagedTrainingCamera?: (frame: number) => CameraSample;
  getStagedTrainingTimeline?: (frame: number) => LegacyTimelineSample;
};

const api = stagedModule as StagedTrainingApi;
const missingTimeline = (): TimelineSample => ({
  tableau: Number.NaN,
  folders: Number.NaN,
  person: Number.NaN,
  topNote: Number.NaN,
  question: Number.NaN,
  conclusion: Number.NaN,
});
const missingDepth = (): DepthSample => ({ missing: Number.NaN });
const missingCamera = (): CameraSample => ({
  scale: Number.NaN,
  panX: Number.NaN,
  panY: Number.NaN,
});
const missingLegacyTimeline = (): LegacyTimelineSample => ({
  originFolder: Number.NaN,
  trainingFolder: Number.NaN,
  person: Number.NaN,
  header: Number.NaN,
  footer: Number.NaN,
  note: Number.NaN,
});

const fastTimeline = api.getFastStagedTrainingTimeline ?? missingTimeline;
const fidelityTimeline =
  api.getFidelityStagedTrainingTimeline ?? missingTimeline;
const fastDepth = api.getFastStagedTrainingDepth ?? missingDepth;
const fidelityDepth = api.getFidelityStagedTrainingDepth ?? missingDepth;
const fastCamera = api.getFastStagedTrainingCamera ?? missingCamera;
const fidelityCamera = api.getFidelityStagedTrainingCamera ?? missingCamera;
const legacyTimeline = api.getStagedTrainingTimeline ?? missingLegacyTimeline;

const allFinite = (record: Record<string, number>) =>
  Object.values(record).every(Number.isFinite);

describe("staged-training dual implementation contract", () => {
  it("delegates Fast and Fidelity to separate visual components", () => {
    expect(api.FastStagedTrainingQuestion).toBeTypeOf("function");
    expect(api.FidelityStagedTrainingQuestion).toBeTypeOf("function");
    expect(api.FastStagedTrainingQuestion).not.toBe(
      api.FidelityStagedTrainingQuestion,
    );

    const wrapperSource = readFileSync(
      resolve(
        process.cwd(),
        "src/dual-remake-406158/shots/StagedTrainingQuestion.tsx",
      ),
      "utf8",
    );
    expect(wrapperSource).toContain("<FastStagedTrainingQuestion");
    expect(wrapperSource).toContain("<FidelityStagedTrainingQuestion");
  });

  it("keeps both samplers finite at and beyond every boundary frame", () => {
    for (const frame of [-30, 0, 36, 90, 150, 194, 240]) {
      expect(allFinite(fastTimeline(frame))).toBe(true);
      expect(allFinite(fidelityTimeline(frame))).toBe(true);
      expect(allFinite(fastDepth(frame))).toBe(true);
      expect(allFinite(fidelityDepth(frame))).toBe(true);
      expect(allFinite(fastCamera(frame))).toBe(true);
      expect(allFinite(fidelityCamera(frame))).toBe(true);
    }
  });

  it("clamps camera tracks and keeps visible motion through every interval", () => {
    const tracks = [fastCamera, fidelityCamera];
    const intervalFrames = [0, 30, 60, 90, 120, 150, 180, 194];

    for (const camera of tracks) {
      expect(camera(-30)).toEqual(camera(0));
      expect(camera(240)).toEqual(camera(194));

      const samples = Array.from({ length: 195 }, (_, frame) => camera(frame));
      expect(
        samples.every(
          (sample, index) =>
            index === 0 ||
            (sample.scale >= samples[index - 1].scale &&
              sample.panX <= samples[index - 1].panX),
        ),
      ).toBe(true);

      for (let index = 1; index < intervalFrames.length; index++) {
        const start = camera(intervalFrames[index - 1]);
        const end = camera(intervalFrames[index]);
        expect(
          end.scale > start.scale ||
            Math.abs(end.panX - start.panX) > 0.01 ||
            Math.abs(end.panY - start.panY) > 0.01,
        ).toBe(true);
      }
    }

    const fastTailStart = fastCamera(150);
    const fastTailEnd = fastCamera(194);
    expect(
      fastTailEnd.scale - fastTailStart.scale >= 0.012 ||
        Math.abs(fastTailEnd.panX - fastTailStart.panX) >= 4,
    ).toBe(true);

    const fidelityTailStart = fidelityCamera(150);
    const fidelityTailEnd = fidelityCamera(194);
    expect(
      fidelityTailEnd.scale - fidelityTailStart.scale >= 0.018 ||
        Math.abs(fidelityTailEnd.panX - fidelityTailStart.panX) >= 6,
    ).toBe(true);
  });

  it("uses a simpler Fast depth stack and at least five Fidelity Z layers", () => {
    const fast = fastDepth(90);
    const fidelity = fidelityDepth(90);

    expect(Object.keys(fast)).toHaveLength(3);
    expect(Object.keys(fidelity).length).toBeGreaterThanOrEqual(5);
    expect(new Set(Object.values(fidelity)).size).toBeGreaterThanOrEqual(5);
    expect(fidelity).not.toEqual(fast);
  });

  it("hits the five reference checkpoints with a distinct Fidelity rhythm", () => {
    expect(Math.max(...Object.values(fidelityTimeline(0)))).toBe(0);

    const entrance = fidelityTimeline(36);
    expect(entrance.folders).toBeGreaterThan(0.8);
    expect(entrance.person).toBeGreaterThan(0.45);
    expect(entrance.question).toBe(0);

    const peak = fidelityTimeline(90);
    expect(peak.tableau).toBe(1);
    expect(peak.topNote).toBe(1);
    expect(peak.question).toBe(0);

    expect(fidelityTimeline(150).question).toBeGreaterThan(0.9);
    expect(fidelityTimeline(194).conclusion).toBe(1);
    expect(fastTimeline(90)).not.toEqual(fidelityTimeline(90));
  });
});

describe("staged-training legacy timeline compatibility", () => {
  it("preserves the original fields and staggered checkpoints", () => {
    for (const frame of [-30, 0, 20, 36, 90, 240]) {
      expect(allFinite(legacyTimeline(frame))).toBe(true);
    }

    const establish = legacyTimeline(0);
    expect(Object.keys(establish).sort()).toEqual(
      [
        "footer",
        "header",
        "note",
        "originFolder",
        "person",
        "trainingFolder",
      ].sort(),
    );
    expect(Math.max(...Object.values(establish))).toBeLessThanOrEqual(0.01);

    const early = legacyTimeline(20);
    expect(early.header).toBeGreaterThan(early.originFolder);
    expect(early.originFolder).toBeGreaterThan(early.trainingFolder);
    expect(early.trainingFolder).toBe(0);
    expect(early.person).toBe(0);
    expect(early.note).toBe(0);

    const entrance = legacyTimeline(36);
    expect(entrance.originFolder).toBe(1);
    expect(entrance.originFolder).toBeGreaterThan(entrance.trainingFolder);
    expect(entrance.trainingFolder).toBeGreaterThan(entrance.person);
    expect(entrance.person).toBeGreaterThan(entrance.note);

    expect(
      Object.values(legacyTimeline(90)).every((value) => value === 1),
    ).toBe(true);
  });
});
