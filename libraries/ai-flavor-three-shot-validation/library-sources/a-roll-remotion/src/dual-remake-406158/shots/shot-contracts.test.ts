import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DUAL_REMAKE_406158_PAIRS } from "../catalog";
import type { RemakeMode } from "../types";

const SHOT_FILES = [
  "AchievementMedalCollage.tsx",
  "TalentRelationshipOutcomes.tsx",
] as const;

const shotPath = (filename: (typeof SHOT_FILES)[number]) =>
  resolve(process.cwd(), "src/dual-remake-406158/shots", filename);

type NumericTransform = Readonly<Record<string, number>>;

type AchievementTimeline = {
  readonly people: readonly NumericTransform[];
  readonly medal: NumericTransform;
  readonly majorOpacity?: {
    readonly headline: number;
    readonly medal: number;
    readonly arroll: number;
    readonly bars: readonly number[];
  };
};

type TalentTimeline = {
  readonly titleOpacity: number;
  readonly relationshipOpacity: number;
  readonly outcomesOpacity: number;
  readonly outcomeCards: readonly {
    readonly label: string;
    readonly transform: NumericTransform;
  }[];
};

const numericValuesAreFinite = (transform: NumericTransform) =>
  Object.values(transform).every(Number.isFinite);

describe("dual remake shots 01 and 02", () => {
  it("provides both requested shot modules", () => {
    for (const filename of SHOT_FILES) {
      expect(existsSync(shotPath(filename))).toBe(true);
    }
  });

  it("keeps both modes frame-driven and render-safe", () => {
    for (const filename of SHOT_FILES) {
      const path = shotPath(filename);
      if (!existsSync(path)) {
        continue;
      }

      const source = readFileSync(path, "utf8");
      expect(source).toContain("mode: RemakeMode");
      expect(source).toContain("useCurrentFrame");
      expect(source).toContain("interpolate");
      expect(source).toContain("spring");
      expect(source).toContain('extrapolateLeft: "clamp"');
      expect(source).toContain('extrapolateRight: "clamp"');
      expect(source).toContain('overflow: "hidden"');
      expect(source).not.toMatch(/\b(?:animation|transition)\s*:/);
      expect(source).not.toMatch(/Math\.random|Date\s*\(/);
    }
  });

  it("samples a finite multi-person collage in both modes", async () => {
    const module = await import("./AchievementMedalCollage");
    const sampler = Reflect.get(module, "sampleAchievementTimeline") as
      | ((frame: number, mode: RemakeMode) => AchievementTimeline)
      | undefined;

    expect(typeof sampler).toBe("function");
    if (!sampler) {
      return;
    }

    expect(sampler(84, "fast").people).toHaveLength(3);
    expect(sampler(84, "fidelity").people).toHaveLength(5);

    const qaFrames = DUAL_REMAKE_406158_PAIRS[0].qaFrames;
    const fastQa = qaFrames.map((frame) => sampler(frame, "fast"));
    const fidelityQa = qaFrames.map((frame) => sampler(frame, "fidelity"));
    expect(fastQa[0].majorOpacity).toBeDefined();
    if (!fastQa[0].majorOpacity) {
      return;
    }

    const opacityScore = (sample: AchievementTimeline) => {
      expect(sample.majorOpacity).toBeDefined();
      if (!sample.majorOpacity) {
        return Number.NaN;
      }

      return (
        sample.majorOpacity.headline +
        sample.majorOpacity.medal +
        sample.majorOpacity.arroll +
        sample.majorOpacity.bars.reduce((sum, value) => sum + value, 0)
      );
    };

    expect(
      [
        fastQa[0].majorOpacity.headline,
        fastQa[0].majorOpacity.medal,
        fastQa[0].majorOpacity.arroll,
        ...fastQa[0].majorOpacity.bars,
      ].every((value) => value <= 0.02),
    ).toBe(true);
    expect(opacityScore(fastQa[0])).toBeLessThan(opacityScore(fastQa[1]));
    expect(opacityScore(fastQa[1])).toBeLessThan(opacityScore(fastQa[2]));
    expect(opacityScore(fastQa[2])).toBeLessThan(opacityScore(fastQa[3]));
    expect(opacityScore(fastQa[3])).toBe(opacityScore(fastQa[4]));
    expect(fidelityQa.map((sample) => sample.majorOpacity)).toEqual(
      fastQa.map((sample) => sample.majorOpacity),
    );

    for (const mode of ["fast", "fidelity"] as const) {
      const lastFrame = DUAL_REMAKE_406158_PAIRS[0].durationInFrames - 1;
      expect(sampler(-100, mode)).toEqual(sampler(0, mode));
      expect(sampler(lastFrame + 100, mode)).toEqual(sampler(lastFrame, mode));

      for (let frame = -30; frame <= 210; frame += 6) {
        const sample = sampler(frame, mode);
        expect(sample.people.every(numericValuesAreFinite)).toBe(true);
        expect(numericValuesAreFinite(sample.medal)).toBe(true);
      }
    }
  });

  it("orders title, relationship, then exactly two outcome cards", async () => {
    const module = await import("./TalentRelationshipOutcomes");
    const sampler = Reflect.get(module, "sampleTalentRelationshipTimeline") as
      | ((frame: number, mode: RemakeMode) => TalentTimeline)
      | undefined;
    const beats = Reflect.get(module, "TALENT_RELATIONSHIP_BEATS") as
      | Readonly<Record<"title" | "relationship" | "outcomes", number>>
      | undefined;

    expect(typeof sampler).toBe("function");
    expect(beats).toBeDefined();
    if (!sampler || !beats) {
      return;
    }

    expect(beats.title).toBeLessThan(beats.relationship);
    expect(beats.relationship).toBeLessThan(beats.outcomes);

    const title = sampler(20, "fast");
    const relationship = sampler(90, "fast");
    const outcomes = sampler(180, "fast");
    expect(title.titleOpacity).toBeGreaterThan(title.relationshipOpacity);
    expect(relationship.relationshipOpacity).toBeGreaterThan(
      relationship.titleOpacity,
    );
    expect(outcomes.outcomesOpacity).toBeGreaterThan(
      outcomes.relationshipOpacity,
    );

    for (const mode of ["fast", "fidelity"] as const) {
      const lastFrame = DUAL_REMAKE_406158_PAIRS[1].durationInFrames - 1;
      expect(sampler(-100, mode)).toEqual(sampler(0, mode));
      expect(sampler(lastFrame + 100, mode)).toEqual(sampler(lastFrame, mode));

      for (let frame = -30; frame <= 255; frame += 5) {
        const sample = sampler(frame, mode);
        expect(
          [
            sample.titleOpacity,
            sample.relationshipOpacity,
            sample.outcomesOpacity,
          ].every(Number.isFinite),
        ).toBe(true);
        expect(sample.outcomeCards.map((card) => card.label)).toEqual([
          "代表成果",
          "长期影响",
        ]);
        expect(sample.outcomeCards).toHaveLength(2);
        expect(
          sample.outcomeCards.every((card) =>
            numericValuesAreFinite(card.transform),
          ),
        ).toBe(true);
      }
    }
  });
});
