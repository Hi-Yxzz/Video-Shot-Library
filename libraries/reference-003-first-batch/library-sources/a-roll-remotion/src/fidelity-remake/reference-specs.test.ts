import { describe, expect, test } from "vitest";
import { FIDELITY_REFERENCE_SPECS } from "./reference-specs";

const EXPECTED_SHOTS = [
  {
    slug: "prompt-to-comparison",
    compositionId: "FidelityPromptToComparison",
    sourceSeconds: [26.033, 26.7, 31.8, 33.3, 34.3],
    durationInFrames: 168,
  },
  {
    slug: "case-card-constellation",
    compositionId: "FidelityCaseCardConstellation",
    sourceSeconds: [128.8, 130, 133, 137, 140.8],
    durationInFrames: 180,
  },
  {
    slug: "metric-card-deal",
    compositionId: "FidelityMetricCardDeal",
    sourceSeconds: [240.833, 242.5, 245.8, 249.5, 254.9],
    durationInFrames: 195,
  },
  {
    slug: "ranking-row-highlight",
    compositionId: "FidelityRankingRowHighlight",
    sourceSeconds: [273.667, 274.4, 277, 280.5, 284.3],
    durationInFrames: 174,
  },
  {
    slug: "chat-bubble-ladder",
    compositionId: "FidelityChatBubbleLadder",
    sourceSeconds: [141.4, 142, 145, 148, 151.3],
    durationInFrames: 165,
  },
  {
    slug: "talking-head-keyword-stickers",
    compositionId: "FidelityTalkingHeadKeywordStickers",
    sourceSeconds: [267.3, 267.9, 269.2, 271.4, 273.5],
    durationInFrames: 126,
  },
  {
    slug: "leaderboard-card-push",
    compositionId: "FidelityLeaderboardCardPush",
    sourceSeconds: [161.8, 162.8, 166, 167, 167.733],
    durationInFrames: 144,
  },
  {
    slug: "orbital-tech-title",
    compositionId: "FidelityOrbitalTechTitle",
    sourceSeconds: [5.733, 6.233, 7.4, 9.4, 10],
    durationInFrames: 120,
  },
] as const;

const isStrictlyIncreasing = (values: readonly number[]) =>
  values.every((value, index) => index === 0 || value > values[index - 1]);

const getSpec = (slug: (typeof EXPECTED_SHOTS)[number]["slug"]) => {
  const spec = FIDELITY_REFERENCE_SPECS.find(
    (candidate) => candidate.slug === slug,
  );
  expect(spec).toBeDefined();
  return spec!;
};

describe("fidelity remake reference specs", () => {
  test("defines the eight approved shots with unique slugs and composition IDs", () => {
    expect(FIDELITY_REFERENCE_SPECS).toHaveLength(8);
    expect(FIDELITY_REFERENCE_SPECS.map(({ slug }) => slug)).toEqual(
      EXPECTED_SHOTS.map(({ slug }) => slug),
    );
    expect(
      FIDELITY_REFERENCE_SPECS.map(({ compositionId }) => compositionId),
    ).toEqual(EXPECTED_SHOTS.map(({ compositionId }) => compositionId));
    expect(
      new Set(FIDELITY_REFERENCE_SPECS.map(({ slug }) => slug)),
    ).toHaveLength(8);
    expect(
      new Set(
        FIDELITY_REFERENCE_SPECS.map(({ compositionId }) => compositionId),
      ),
    ).toHaveLength(8);
  });

  test("records five ordered source checkpoints and compressed output frames per shot", () => {
    FIDELITY_REFERENCE_SPECS.forEach((spec, index) => {
      const expected = EXPECTED_SHOTS[index];
      expect(spec.checkpoints).toHaveLength(5);
      expect(
        spec.checkpoints.map(({ sourceSeconds }) => sourceSeconds),
      ).toEqual(expected.sourceSeconds);
      expect(
        isStrictlyIncreasing(
          spec.checkpoints.map(({ sourceSeconds }) => sourceSeconds),
        ),
      ).toBe(true);
      expect(
        isStrictlyIncreasing(
          spec.checkpoints.map(({ outputFrame }) => outputFrame),
        ),
      ).toBe(true);
      expect(spec.durationInFrames).toBe(expected.durationInFrames);
      expect(spec.durationInFrames).toBeGreaterThanOrEqual(120);
      expect(spec.durationInFrames).toBeLessThanOrEqual(195);
      expect(spec.qaOutputFrames).toEqual(
        spec.checkpoints.map(({ outputFrame }) => outputFrame),
      );
      expect(spec.qaOutputFrames[4]).toBeLessThan(spec.durationInFrames);
    });
  });

  test("keeps palette and typography observations owned by each shot", () => {
    const paletteFingerprints = FIDELITY_REFERENCE_SPECS.map(({ palette }) =>
      [palette.background, palette.surface, palette.text, palette.accent].join(
        "|",
      ),
    );

    FIDELITY_REFERENCE_SPECS.forEach(({ palette, typography }) => {
      expect(
        Object.values(palette).every((value) => /^#[0-9a-f]{6}$/i.test(value)),
      ).toBe(true);
      expect(
        Object.values(typography).every((value) =>
          typeof value === "string"
            ? value.trim().length > 0
            : Number.isFinite(value),
        ),
      ).toBe(true);
    });
    expect(new Set(paletteFingerprints).size).toBe(8);
  });

  test("uses the observed neutral sans families for constellation and chat", () => {
    expect(
      FIDELITY_REFERENCE_SPECS.find(
        ({ slug }) => slug === "case-card-constellation",
      ),
    ).toMatchObject({
      typography: {
        displayFamily: "Inter",
        bodyFamily: "Source Han Sans SC",
      },
    });
    expect(
      FIDELITY_REFERENCE_SPECS.find(
        ({ slug }) => slug === "chat-bubble-ladder",
      ),
    ).toMatchObject({
      typography: {
        displayFamily: "Source Han Sans SC",
        bodyFamily: "Inter",
      },
    });
  });

  test("records ordered, finite camera tracks including the multi-stage moves", () => {
    FIDELITY_REFERENCE_SPECS.forEach((spec) => {
      expect(spec.cameraKeyframes.length).toBeGreaterThanOrEqual(2);
      expect(
        isStrictlyIncreasing(
          spec.cameraKeyframes.map(({ outputFrame }) => outputFrame),
        ),
      ).toBe(true);
      spec.cameraKeyframes.forEach((keyframe) => {
        expect(keyframe.outputFrame).toBeGreaterThanOrEqual(0);
        expect(keyframe.outputFrame).toBeLessThan(spec.durationInFrames);
        expect(
          [
            keyframe.scale,
            keyframe.panX,
            keyframe.panY,
            keyframe.rollDegrees,
          ].every(Number.isFinite),
        ).toBe(true);
        expect(keyframe.scale).toBeGreaterThan(0);
        expect(keyframe.transformOrigin.trim().length).toBeGreaterThan(0);
      });
    });

    expect(
      getSpec("prompt-to-comparison").cameraKeyframes.map(({ scale }) => scale),
    ).toEqual([1.12, 1, 1, 1.03]);
    expect(
      getSpec("metric-card-deal").cameraKeyframes.map(({ scale }) => scale),
    ).toEqual([1.02, 1.08, 0.96, 0.96, 1.01]);
    expect(
      new Set(
        getSpec("ranking-row-highlight").cameraKeyframes.map(
          ({ transformOrigin }) => transformOrigin,
        ),
      ).size,
    ).toBeGreaterThan(1);
    expect(
      getSpec("leaderboard-card-push").cameraKeyframes.map(
        ({ scale }) => scale,
      ),
    ).toEqual([0.72, 1.04, 1.04, 1.58]);
  });

  test("uses bounded anchors, parallax, and texture observations", () => {
    FIDELITY_REFERENCE_SPECS.forEach((spec) => {
      const anchors = Object.values(spec.anchors) as Array<{
        x: number;
        y: number;
        width: number;
        height: number;
      }>;
      expect(anchors.length).toBeGreaterThan(0);
      anchors.forEach(({ x, y, width, height }) => {
        expect([x, y, width, height].every(Number.isFinite)).toBe(true);
        expect(Math.min(x, y, width, height)).toBeGreaterThanOrEqual(0);
        expect(x + width).toBeLessThanOrEqual(1);
        expect(y + height).toBeLessThanOrEqual(1);
      });
      const parallaxValues = Object.values(spec.parallax);
      expect(parallaxValues.length).toBeGreaterThan(0);
      expect(
        parallaxValues.every(
          (value) => Number.isFinite(value) && value >= 0 && value <= 2,
        ),
      ).toBe(true);
      expect(spec.texture.description).not.toHaveLength(0);
      expect(
        [spec.texture.grainAmount, spec.texture.vignetteAmount].every(
          (value) => Number.isFinite(value) && value >= 0 && value <= 1,
        ),
      ).toBe(true);
      expect(spec.genericContentNotes.length).toBeGreaterThan(0);
    });
  });

  test("provides complete layer and choreography observations for every shot", () => {
    FIDELITY_REFERENCE_SPECS.forEach((spec) => {
      const layerIds = spec.layers.map(({ id }) => id);
      const zIndexes = spec.layers.map(({ zIndex }) => zIndex);

      expect(spec.layers.length).toBeGreaterThanOrEqual(3);
      expect(new Set(layerIds).size).toBe(layerIds.length);
      expect(new Set(zIndexes).size).toBe(zIndexes.length);
      spec.layers.forEach(({ id, zIndex, occlusionNotes }) => {
        expect(id.trim().length).toBeGreaterThan(0);
        expect(Number.isFinite(zIndex)).toBe(true);
        expect(occlusionNotes.trim().length).toBeGreaterThan(0);
      });

      expect(spec.choreography.length).toBeGreaterThanOrEqual(3);
      spec.choreography.forEach((stage) => {
        expect(stage.id.trim().length).toBeGreaterThan(0);
        expect(stage.startFrame).toBeGreaterThanOrEqual(0);
        expect(stage.endFrame).toBeGreaterThanOrEqual(stage.startFrame);
        expect(stage.endFrame).toBeLessThan(spec.durationInFrames);
        expect(stage.easing.trim().length).toBeGreaterThan(0);
        expect(
          [stage.staggerFrames, stage.overshoot, stage.settleFrames].every(
            Number.isFinite,
          ),
        ).toBe(true);
        expect(stage.staggerFrames).toBeGreaterThanOrEqual(0);
        expect(stage.overshoot).toBeGreaterThanOrEqual(0);
        expect(stage.overshoot).toBeLessThanOrEqual(1);
        expect(stage.settleFrames).toBeGreaterThanOrEqual(0);
        expect(stage.layerIds.length).toBeGreaterThan(0);
        expect(
          stage.layerIds.every((layerId) => layerIds.includes(layerId)),
        ).toBe(true);
      });
    });

    expect(getSpec("prompt-to-comparison").layers.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "prompt-frame",
        "comparison-grid",
        "direction-arrows",
      ]),
    );
    expect(
      getSpec("prompt-to-comparison").choreography.map(({ id }) => id),
    ).toEqual(
      expect.arrayContaining([
        "prompt-draw",
        "comparison-switch",
        "arrow-settle",
      ]),
    );
    expect(getSpec("metric-card-deal").layers.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "concept-symbol",
        "rear-cards",
        "front-cards",
        "numerals",
      ]),
    );
    expect(
      getSpec("metric-card-deal").choreography.map(({ id }) => id),
    ).toEqual(
      expect.arrayContaining([
        "concept-build",
        "proof-pivot",
        "paired-card-deal",
      ]),
    );
  });
});
