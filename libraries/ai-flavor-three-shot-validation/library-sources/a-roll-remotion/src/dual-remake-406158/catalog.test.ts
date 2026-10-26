import {describe, expect, it} from "vitest";
import {DUAL_REMAKE_406158_PAIRS} from "./catalog";

const CHECKPOINT_LABELS = [
  "establish",
  "entrance",
  "peak",
  "settle",
  "exit",
] as const;

describe("DUAL_REMAKE_406158_PAIRS", () => {
  it("defines the six requested reusable shot pairs", () => {
    expect(DUAL_REMAKE_406158_PAIRS).toHaveLength(6);
    expect(DUAL_REMAKE_406158_PAIRS.map((pair) => pair.slug)).toEqual([
      "achievement-medal-collage",
      "talent-relationship-outcomes",
      "staged-training-question",
      "feedback-loop-desktop",
      "biography-timeline",
      "forked-road-decision",
    ]);
  });

  it("uses a unique composition base id for every pair", () => {
    const ids = DUAL_REMAKE_406158_PAIRS.map(
      (pair) => pair.compositionBaseId,
    );

    expect(new Set(ids).size).toBe(6);
  });

  it("defines five ordered QA frames from first through last output frame", () => {
    for (const pair of DUAL_REMAKE_406158_PAIRS) {
      expect(pair.fps).toBe(30);
      expect(Number.isInteger(pair.durationInFrames)).toBe(true);
      expect(pair.qaFrames).toHaveLength(5);
      expect(pair.qaFrames[0]).toBe(0);
      expect(pair.qaFrames[pair.qaFrames.length - 1]).toBe(
        pair.durationInFrames - 1,
      );
      expect([...pair.qaFrames].sort((left, right) => left - right)).toEqual(
        pair.qaFrames,
      );
    }
  });

  it("maps establish through exit reference checkpoints to the QA frames", () => {
    for (const pair of DUAL_REMAKE_406158_PAIRS) {
      expect(pair.referenceCheckpoints.map((point) => point.label)).toEqual(
        CHECKPOINT_LABELS,
      );
      expect(
        pair.referenceCheckpoints.map((point) => point.outputFrame),
      ).toEqual(pair.qaFrames);

      for (const checkpoint of pair.referenceCheckpoints) {
        expect(checkpoint.sourceSeconds).toBeGreaterThanOrEqual(
          pair.referenceInterval.startSeconds,
        );
        expect(checkpoint.sourceSeconds).toBeLessThanOrEqual(
          pair.referenceInterval.endSeconds,
        );
      }
    }
  });

  it("keeps paired A-roll selections exactly equal", () => {
    for (const pair of DUAL_REMAKE_406158_PAIRS) {
      expect(pair.fast.aroll).toEqual(pair.fidelity.aroll);
    }
  });

  it("selects staged A-roll only for the person collage and biography", () => {
    expect(DUAL_REMAKE_406158_PAIRS[0].fast).toHaveProperty("aroll");
    expect(DUAL_REMAKE_406158_PAIRS[4].fast).toHaveProperty("aroll");
    expect(
      DUAL_REMAKE_406158_PAIRS.slice(1, 4).every(
        (pair) => !("aroll" in pair.fast),
      ),
    ).toBe(true);
    expect("aroll" in DUAL_REMAKE_406158_PAIRS[5].fast).toBe(false);
  });

  it("provides reusable copy, camera beats, palette, and normalized anchors", () => {
    for (const pair of DUAL_REMAKE_406158_PAIRS) {
      expect(pair.copy.headline.length).toBeGreaterThan(0);
      expect(pair.copy.labels.length).toBeGreaterThan(0);
      expect(pair.cameraBeats.length).toBeGreaterThanOrEqual(2);
      expect(pair.cameraBeats[0].outputFrame).toBe(0);
      expect(pair.cameraBeats[pair.cameraBeats.length - 1].outputFrame).toBe(
        pair.durationInFrames - 1,
      );
      expect(Object.values(pair.palette).every((value) => value.length > 0)).toBe(
        true,
      );

      for (const anchor of Object.values(pair.anchors)) {
        expect(anchor.x).toBeGreaterThanOrEqual(0);
        expect(anchor.y).toBeGreaterThanOrEqual(0);
        expect(anchor.width).toBeGreaterThan(0);
        expect(anchor.height).toBeGreaterThan(0);
        expect(anchor.x + anchor.width).toBeLessThanOrEqual(1);
        expect(anchor.y + anchor.height).toBeLessThanOrEqual(1);
      }
    }
  });
});
