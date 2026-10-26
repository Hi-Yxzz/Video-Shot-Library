import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BiographyTimeline } from "./shots/BiographyTimeline";
import {
  FORKED_ROAD_ORIGIN,
  ForkedRoadDecision,
  getForkedRoadEntrance,
  getForkedRoadDepth,
  getForkedRoadGeometry,
} from "./shots/ForkedRoadDecision";

const source = (filename: string) =>
  readFileSync(
    resolve(process.cwd(), "src/dual-remake-406158/shots", filename),
    "utf8",
  );

describe("dual remake shots 05 and 06", () => {
  it("exports both parameterized Remotion shot components", () => {
    expect(BiographyTimeline).toBeTypeOf("function");
    expect(ForkedRoadDecision).toBeTypeOf("function");
  });

  it("keeps both modes deterministic, clamped, and frame-driven", () => {
    for (const filename of [
      "BiographyTimeline.tsx",
      "ForkedRoadDecision.tsx",
    ]) {
      const shot = source(filename);

      expect(shot).toMatch(/\(\{\s*mode\s*\}:\s*\{\s*mode:\s*RemakeMode/);
      expect(shot).toContain("useCurrentFrame()");
      expect(shot).toContain('extrapolateLeft: "clamp"');
      expect(shot).toContain('extrapolateRight: "clamp"');
      expect(shot).toContain('overflow: "hidden"');
      expect(shot).not.toMatch(/\b(?:animation|transition)\s*:/);
      expect(shot).not.toMatch(/Math\.random|Date\s*\(/);
    }
  });

  it("uses the shared catalog A-roll without a mode-specific media path", () => {
    const biography = source("BiographyTimeline.tsx");
    const calls = biography.match(/<SharedAroll[^>]+\/>/g) ?? [];

    expect(calls).toEqual(["<SharedAroll selection={aroll} />"]);
    expect(calls[0]).not.toContain("mode=");
    expect(biography).toContain("const aroll = pair.fast.aroll");
  });

  it("connects every road path to the silhouette's moving foot position", () => {
    const decision = source("ForkedRoadDecision.tsx");

    expect(FORKED_ROAD_ORIGIN).toEqual({ x: 960, y: 814 });
    expect(decision).toContain(
      "const footY = FORKED_ROAD_ORIGIN.y + figureTranslateY",
    );
    expect(decision).toContain(
      "const roadOriginY = footY + personDepth.y - roadDepth.y",
    );
    expect(decision).toContain(
      "getForkedRoadGeometry(roadOriginX, roadOriginY)",
    );
    expect(decision).toContain("translateY={figureTranslateY}");
  });

  it("defines two fast and four fidelity planes with continuous differential parallax", () => {
    const expected = {
      fast: ["paper", "scene"],
      fidelity: ["paper", "road", "person", "labels"],
    } as const;

    for (const mode of ["fast", "fidelity"] as const) {
      const start = getForkedRoadDepth(mode, 0);
      const middle = getForkedRoadDepth(mode, 0.5);
      const end = getForkedRoadDepth(mode, 1);

      expect(start.map((plane) => plane.id)).toEqual(expected[mode]);
      expect(new Set(end.map((plane) => `${plane.x}:${plane.y}`)).size).toBe(
        expected[mode].length,
      );
      for (let index = 0; index < start.length; index += 1) {
        expect(middle[index].x).not.toBe(end[index].x);
        expect(middle[index].y).not.toBe(end[index].y);
      }
    }
  });

  it("stages a near-empty entrance from title through sequential choice labels", () => {
    const empty = getForkedRoadEntrance(0);
    const before = getForkedRoadEntrance(-100);
    const settled = getForkedRoadEntrance(1_000);

    expect(before).toEqual(empty);
    expect([
      empty.title,
      empty.sign,
      empty.person,
      empty.road,
      ...empty.labels,
    ]).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect([
      settled.title,
      settled.sign,
      settled.person,
      settled.road,
      ...settled.labels,
    ]).toEqual([1, 1, 1, 1, 1, 1, 1]);

    const firstVisible = (sample: (frame: number) => number) =>
      Array.from({ length: 180 }, (_, frame) => frame).find(
        (frame) => sample(frame) > 0.01,
      )!;
    const titleFrame = firstVisible(
      (frame) => getForkedRoadEntrance(frame).title,
    );
    const signFrame = firstVisible(
      (frame) => getForkedRoadEntrance(frame).sign,
    );
    const personFrame = firstVisible(
      (frame) => getForkedRoadEntrance(frame).person,
    );
    const roadFrame = firstVisible(
      (frame) => getForkedRoadEntrance(frame).road,
    );
    const labelFrames = [0, 1, 2].map((index) =>
      firstVisible((frame) => getForkedRoadEntrance(frame).labels[index]),
    );

    expect(titleFrame).toBeLessThan(signFrame);
    expect(signFrame).toBeLessThanOrEqual(personFrame);
    expect(personFrame).toBeLessThan(roadFrame);
    expect(roadFrame).toBeLessThan(labelFrames[0]);
    expect(labelFrames[0]).toBeLessThan(labelFrames[1]);
    expect(labelFrames[1]).toBeLessThan(labelFrames[2]);
  });

  it("builds three roads that widen from the foot toward the foreground", () => {
    const roads = getForkedRoadGeometry(FORKED_ROAD_ORIGIN.x, 814);

    expect(roads).toHaveLength(3);
    for (const road of roads) {
      const farWidth = Math.abs(road[1].x - road[0].x);
      const nearWidth = Math.abs(road[3].x - road[2].x);

      expect(road[0].y).toBe(814);
      expect(road[1].y).toBe(814);
      expect(nearWidth).toBeGreaterThan(farWidth * 4);
      expect(road[2].y).toBeGreaterThan(road[0].y);
      expect(road[3].y).toBeGreaterThan(road[1].y);
    }
  });
});
