import { describe, expect, test } from "vitest";
import { spring } from "remotion";

const QA_B02 = [0, 18, 38, 66, 95] as const;
const QA_B05 = [0, 28, 66, 112, 161] as const;
const QA_B07 = [0, 38, 86, 146, 209] as const;
const QA_B09 = [0, 52, 112, 182, 266] as const;
const QA_REMAINING = [
  ["getKeywordTypeFidelityState", 143],
  ["getQuotePanelPushFidelityState", 223],
  ["getMetalComputeArrayFidelityState", 294],
  ["getEvidenceArticlePushFidelityState", 171],
  ["getTeamRelationshipGraphFidelityState", 308],
  ["getYearMarketOverlayFidelityState", 110],
  ["getQuestionCardSpeakerFidelityState", 461],
  ["getMonochromeQuotePortraitFidelityState", 326],
] as const;
const loadMotion = () => import("./motion");

const expectStateContract = (
  states: readonly Record<string, number>[],
  progressKeys: readonly string[],
  springFrameKeys: readonly string[] = [],
  discreteKeys: readonly string[] = [],
  continuousKeys: readonly string[] = [],
) => {
  expect(Object.keys(states[0]).sort()).toEqual(
    [
      ...progressKeys,
      ...springFrameKeys,
      ...discreteKeys,
      ...continuousKeys,
    ].sort(),
  );
  for (const key of progressKeys) {
    const values = states.map((state) => state[key]);
    expect(values.every((value) => Number.isFinite(value))).toBe(true);
    expect(values.every((value) => value >= 0 && value <= 1)).toBe(true);
    expect(
      values.every((value, index) => index === 0 || value >= values[index - 1]),
    ).toBe(true);
  }
  for (const key of springFrameKeys) {
    const values = states.map((state) => state[key]);
    expect(values.every((value) => Number.isFinite(value) && value >= 0)).toBe(
      true,
    );
    expect(
      values.every((value, index) => index === 0 || value >= values[index - 1]),
    ).toBe(true);
  }
  for (const key of discreteKeys) {
    expect(
      states.every((state) => Number.isInteger(state[key]) && state[key] >= 0),
    ).toBe(true);
  }
  for (const key of continuousKeys) {
    const values = states.map((state) => state[key]);
    expect(values.every((value) => Number.isFinite(value))).toBe(true);
    expect(
      values.every((value, index) => index === 0 || value >= values[index - 1]),
    ).toBe(true);
  }
};

const loadStateFactory = async (name: string) => {
  const motion = await loadMotion();
  const factory = (motion as unknown as Record<string, unknown>)[name];
  expect(factory, `${name} must be exported`).toBeTypeOf("function");
  return typeof factory === "function"
    ? (factory as (frame: number) => Record<string, number>)
    : null;
};

describe("reference 003 pure per-mode timing states", () => {
  test.each(QA_REMAINING)(
    "%s exposes finite monotonic stages from empty to complete",
    async (factoryName, lastFrame) => {
      const factory = await loadStateFactory(factoryName);
      if (!factory) return;
      const sampleFrames = [0, Math.round(lastFrame * 0.2), Math.round(lastFrame * 0.45), Math.round(lastFrame * 0.7), lastFrame];
      const states = sampleFrames.map(factory);
      const springKeys = Object.keys(states[0]).filter((key) =>
        key.endsWith("SpringFrame"),
      );
      const progressKeys = Object.keys(states[0]).filter(
        (key) => !key.endsWith("SpringFrame"),
      );

      expectStateContract(states, progressKeys, springKeys);
      expect(progressKeys.every((key) => states[0][key] === 0)).toBe(true);
      expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
    },
  );

  test("Fast B02 covers every visible type stage at QA frames", async () => {
    const factory = await loadStateFactory("getOpinionTypeFastState");
    if (!factory) return;
    const states = QA_B02.map(factory);
    const progressKeys = [
      "header",
      "line2",
      "line3",
      "baseline",
      "label1",
      "label2",
      "label3",
      "scan",
      "camera",
    ] as const;
    expectStateContract(states, progressKeys, ["headlineSpringFrame"]);
    expect(progressKeys.every((key) => states[0][key] === 0)).toBe(true);
    expect(states[1].headlineSpringFrame).toBeGreaterThan(0);
    expect(states[1].line2).toBe(0);
    expect(states[2].line2).toBe(1);
    expect(states[2].line3).toBeGreaterThan(0);
    expect(states[3].label3).toBeGreaterThan(0);
    expect(states[3].scan).toBe(1);
    expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
  });

  test("Fidelity B02 covers cursor, staged copy, labels, and grid", async () => {
    const factory = await loadStateFactory("getOpinionTypeFidelityState");
    if (!factory) return;
    const states = QA_B02.map(factory);
    const progressKeys = [
      "cursor",
      "statement",
      "keyword",
      "suffix",
      "label1",
      "label2",
      "label3",
      "grid",
      "camera",
    ] as const;
    expectStateContract(states, progressKeys, ["kickerSpringFrame"]);
    expect(states[0]).toMatchObject({
      cursor: 1,
      statement: 0,
      keyword: 0,
      suffix: 0,
      label1: 0,
      label2: 0,
      label3: 0,
      grid: 0,
      camera: 0,
    });
    expect(states[1].statement).toBeGreaterThan(0);
    expect(states[1].keyword).toBe(0);
    expect(states[2].statement).toBe(1);
    expect(states[2].keyword).toBeGreaterThan(0);
    expect(states[3].label3).toBeGreaterThan(0);
    expect(states[3].grid).toBeGreaterThan(0);
    expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
  });

  test("Fast B05 covers console, all cards, tags, scan, and camera", async () => {
    const factory = await loadStateFactory("getChatPanelFastState");
    if (!factory) return;
    const states = QA_B05.map(factory);
    const progressKeys = ["panel", "header", "tags", "scan", "camera"] as const;
    expectStateContract(states, progressKeys, [
      "panelSpringFrame",
      "bubble1SpringFrame",
      "bubble2SpringFrame",
      "bubble3SpringFrame",
    ]);
    expect(progressKeys.every((key) => states[0][key] === 0)).toBe(true);
    expect(states[1].panel).toBeGreaterThan(0);
    expect(states[1].panel).toBeLessThan(1);
    expect(states[1].bubble1SpringFrame).toBeGreaterThan(0);
    expect(states[2].bubble2SpringFrame).toBeGreaterThan(0);
    expect(states[2].bubble3SpringFrame).toBe(0);
    expect(states[3].bubble3SpringFrame).toBeGreaterThan(0);
    expect(states[3].tags).toBe(1);
    expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
  });

  test("Fidelity B05 covers sliver, title, three bubbles, and late tags", async () => {
    const factory = await loadStateFactory("getChatPanelFidelityState");
    if (!factory) return;
    const states = QA_B05.map(factory);
    const progressKeys = [
      "sliverExit",
      "panel",
      "title",
      "bubble1",
      "bubble2",
      "bubble3",
      "tags",
      "camera",
    ] as const;
    expectStateContract(states, progressKeys, [
      "panelSpringFrame",
      "bubble1SpringFrame",
      "bubble2SpringFrame",
      "bubble3SpringFrame",
    ]);
    expect(progressKeys.every((key) => states[0][key] === 0)).toBe(true);
    expect(states[1].sliverExit).toBe(1);
    expect(states[1].panel).toBeGreaterThan(0);
    expect(states[1].panel).toBeLessThan(1);
    expect(states[1].title).toBeGreaterThan(0);
    expect(states[1].bubble1).toBe(0);
    expect(states[2].bubble1).toBeGreaterThan(0);
    expect(states[2].bubble2).toBe(0);
    expect(states[3].bubble2).toBe(1);
    expect(states[3].bubble3).toBeGreaterThan(0);
    expect(states[3].tags).toBe(0);
    expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
  });

  test("Fast B07 stages the compute field, routing, and highlights", async () => {
    const factory = await loadStateFactory("getHardwareDispatchFastState");
    if (!factory) return;
    const states = QA_B07.map(factory);
    const progressKeys = [
      "grid",
      "title",
      "metrics",
      "nodes",
      "routes",
      "highlight",
      "camera",
    ] as const;
    expectStateContract(
      states,
      progressKeys,
      ["tile1SpringFrame", "tile2SpringFrame", "tile3SpringFrame"],
      ["phaseIndex"],
    );
    expect(states[0]).toMatchObject({
      grid: 0,
      title: 0,
      metrics: 0,
      nodes: 0,
      routes: 0,
      highlight: 0,
      camera: 0,
      phaseIndex: 0,
    });
    expect(states[1].title).toBeGreaterThan(0);
    expect(states[1].tile1SpringFrame).toBeGreaterThan(0);
    expect(states[1].phaseIndex).toBe(1);
    expect(states[2].metrics).toBe(1);
    expect(states[2].tile2SpringFrame).toBeGreaterThan(0);
    expect(states[2].phaseIndex).toBe(2);
    expect(states[3].routes).toBe(1);
    expect(states[3].tile3SpringFrame).toBeGreaterThan(0);
    expect(states[3].phaseIndex).toBe(3);
    expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
    expect(states[4].phaseIndex).toBe(4);
  });

  test("Fidelity B07 reveals modules early, then builds the comparison during the push", async () => {
    const factory = await loadStateFactory("getHardwareDispatchFidelityState");
    if (!factory) return;
    const states = QA_B07.map(factory);
    const progressKeys = [
      "amberCopy",
      "bars",
      "whiteTitle",
      "parameters",
      "nearBar",
      "camera",
    ] as const;
    expectStateContract(
      states,
      progressKeys,
      ["bar1SpringFrame", "bar2SpringFrame"],
      ["phaseIndex"],
    );
    expect(states[0]).toMatchObject({
      amberCopy: 0,
      bars: 0,
      whiteTitle: 0,
      parameters: 0,
      nearBar: 0,
      camera: 0,
      phaseIndex: 0,
    });
    expect(states[1].amberCopy).toBeGreaterThan(0);
    expect(states[1].bars).toBeGreaterThan(0);
    expect(states[1].whiteTitle).toBe(0);
    expect(states[1].phaseIndex).toBe(2);
    expect(states[2].bars).toBe(1);
    expect(states[2].whiteTitle).toBeGreaterThan(0);
    expect(states[2].parameters).toBeGreaterThan(0);
    expect(states[2].phaseIndex).toBe(3);
    expect(states[3].bars).toBe(1);
    expect(states[3].whiteTitle).toBe(1);
    expect(states[3].parameters).toBe(1);
    expect(states[3].nearBar).toBeGreaterThan(0);
    expect(states[3].phaseIndex).toBe(4);
    expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
    expect(states[4].phaseIndex).toBe(4);
  });

  test("Fast B09 advances a readable four-card carousel", async () => {
    const factory = await loadStateFactory("getProfileCarouselFastState");
    if (!factory) return;
    const states = QA_B09.map(factory);
    const progressKeys = ["deck", "details", "rail", "camera"] as const;
    expectStateContract(
      states,
      progressKeys,
      [
        "card1SpringFrame",
        "card2SpringFrame",
        "card3SpringFrame",
        "card4SpringFrame",
      ],
      ["activeProfileIndex"],
      ["trackShift"],
    );
    expect(states[0]).toMatchObject({
      deck: 0,
      details: 0,
      rail: 0,
      camera: 0,
      activeProfileIndex: 0,
    });
    expect(states.map((state) => state.activeProfileIndex)).toEqual([
      0, 0, 1, 2, 3,
    ]);
    expect(states.map((state) => state.trackShift)).toEqual([
      0, 0, 452, 904, 1356,
    ]);
    expect(states[1].deck).toBe(1);
    expect(states[1].card1SpringFrame).toBeGreaterThan(0);
    expect(states[2].card2SpringFrame).toBeGreaterThan(0);
    expect(states[3].card3SpringFrame).toBeGreaterThan(0);
    expect(states[4].card4SpringFrame).toBeGreaterThan(0);
    expect(progressKeys.every((key) => states[4][key] === 1)).toBe(true);
  });

  test("Fidelity B09 crossfades two left then two right profiles", async () => {
    const factory = await loadStateFactory("getProfileCarouselFidelityState");
    if (!factory) return;
    const states = QA_B09.map(factory);
    const boundedKeys = [
      "profile1",
      "profile2",
      "profile3",
      "profile4",
      "letters",
    ] as const;
    expect(Object.keys(states[0]).sort()).toEqual(
      [
        ...boundedKeys,
        "camera",
        "activeProfileIndex",
        "profile1SpringFrame",
        "profile2SpringFrame",
        "profile3SpringFrame",
        "profile4SpringFrame",
      ].sort(),
    );
    for (const key of boundedKeys) {
      expect(
        states.every(
          (state) =>
            Number.isFinite(state[key]) && state[key] >= 0 && state[key] <= 1,
        ),
      ).toBe(true);
    }
    expectStateContract(
      states.map(({ camera }) => ({ camera })),
      ["camera"],
    );
    expect(states.map((state) => state.activeProfileIndex)).toEqual([
      0, 0, 1, 2, 3,
    ]);
    expect(states[0]).toMatchObject({
      profile1: 0,
      profile2: 0,
      profile3: 0,
      profile4: 0,
      letters: 0,
      camera: 0,
    });
    expect(states[1]).toMatchObject({ profile1: 1, profile2: 0 });
    expect(states[2]).toMatchObject({ profile1: 0, profile2: 1 });
    expect(states[3]).toMatchObject({ profile2: 0, profile3: 1 });
    expect(states[4]).toMatchObject({ profile3: 0, profile4: 1 });
    expect(states[1].letters).toBe(1);
    expect(states[3].letters).toBe(0);
  });

  test("spring clocks use linear local frames and keep advancing", async () => {
    const fastOpinion = await loadStateFactory("getOpinionTypeFastState");
    const fidelityOpinion = await loadStateFactory(
      "getOpinionTypeFidelityState",
    );
    const fastChat = await loadStateFactory("getChatPanelFastState");
    const fidelityChat = await loadStateFactory("getChatPanelFidelityState");
    const fastHardware = await loadStateFactory("getHardwareDispatchFastState");
    const fidelityHardware = await loadStateFactory(
      "getHardwareDispatchFidelityState",
    );
    const fastProfiles = await loadStateFactory("getProfileCarouselFastState");
    const fidelityProfiles = await loadStateFactory(
      "getProfileCarouselFidelityState",
    );
    if (
      !fastOpinion ||
      !fidelityOpinion ||
      !fastChat ||
      !fidelityChat ||
      !fastHardware ||
      !fidelityHardware ||
      !fastProfiles ||
      !fidelityProfiles
    )
      return;

    expect(fastOpinion(0).headlineSpringFrame).toBe(0);
    expect(fastOpinion(12).headlineSpringFrame).toBe(4);
    expect(fastOpinion(95).headlineSpringFrame).toBe(87);
    expect(fidelityOpinion(12).kickerSpringFrame).toBe(4);
    expect(fidelityOpinion(95).kickerSpringFrame).toBe(87);
    expect(fastChat(8).panelSpringFrame).toBe(5);
    expect(fastChat(28).bubble1SpringFrame).toBe(4);
    expect(fastChat(50).bubble2SpringFrame).toBe(5);
    expect(fastChat(70).bubble3SpringFrame).toBe(3);
    expect(fastChat(161).panelSpringFrame).toBeGreaterThan(28);
    expect(fastChat(161).bubble1SpringFrame).toBeGreaterThan(22);
    expect(fidelityChat(8).panelSpringFrame).toBe(4);
    expect(fidelityChat(52).bubble1SpringFrame).toBe(4);
    expect(fidelityChat(76).bubble2SpringFrame).toBe(4);
    expect(fidelityChat(100).bubble3SpringFrame).toBe(4);
    expect(fidelityChat(161).panelSpringFrame).toBeGreaterThan(48);
    expect(fidelityChat(161).bubble1SpringFrame).toBeGreaterThan(28);
    expect(fastHardware(20).tile1SpringFrame).toBe(8);
    expect(fastHardware(209).tile1SpringFrame).toBeGreaterThan(100);
    expect(fidelityHardware(86).bar1SpringFrame).toBe(62);
    expect(fidelityHardware(209).bar2SpringFrame).toBeGreaterThan(100);
    expect(fastProfiles(52).card1SpringFrame).toBe(36);
    expect(fastProfiles(266).card4SpringFrame).toBeGreaterThan(40);
    expect(fidelityProfiles(52).profile1SpringFrame).toBe(30);
    expect(fidelityProfiles(266).profile4SpringFrame).toBeGreaterThan(30);
  });

  test("representative entrance opacities are the unduplicated springs", async () => {
    const fastOpinion = await loadStateFactory("getOpinionTypeFastState");
    const fidelityOpinion = await loadStateFactory(
      "getOpinionTypeFidelityState",
    );
    const fastChat = await loadStateFactory("getChatPanelFastState");
    if (!fastOpinion || !fidelityOpinion || !fastChat) return;

    const fastHeadlineOpacity = spring({
      frame: fastOpinion(12).headlineSpringFrame,
      fps: 30,
      config: { damping: 18, stiffness: 180, mass: 0.65 },
      durationInFrames: 18,
    });
    const fidelityKickerOpacity = spring({
      frame: fidelityOpinion(12).kickerSpringFrame,
      fps: 30,
      config: { damping: 22, stiffness: 105, mass: 0.9 },
      durationInFrames: 24,
    });
    const fastBubbleOpacity = spring({
      frame: fastChat(28).bubble1SpringFrame,
      fps: 30,
      config: { damping: 19, stiffness: 190, mass: 0.62 },
      durationInFrames: 22,
    });

    expect(fastHeadlineOpacity).toBeCloseTo(0.5268871755, 8);
    expect(fidelityKickerOpacity).toBeCloseTo(0.3589933744, 8);
    expect(fastBubbleOpacity).toBeCloseTo(0.2622692984, 8);
  });

  test("stageProgress rejects non-finite inputs", async () => {
    const { stageProgress } = await loadMotion();
    expect(() => stageProgress(Number.NaN, 0, 1)).toThrow(/finite/i);
    expect(() => stageProgress(0, Number.NEGATIVE_INFINITY, 1)).toThrow(
      /finite/i,
    );
    expect(() => stageProgress(0, 0, Number.POSITIVE_INFINITY)).toThrow(
      /finite/i,
    );
  });

  test("stageProgress rejects empty or reversed ranges", async () => {
    const { stageProgress } = await loadMotion();
    expect(() => stageProgress(0, 1, 1)).toThrow(/greater than start/i);
    expect(() => stageProgress(0, 2, 1)).toThrow(/greater than start/i);
  });
});
