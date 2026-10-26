import { describe, expect, test } from "vitest";
import type { Reference003Shot } from "./catalog";
import {
  REFERENCE_003_COMPOSITIONS,
  REFERENCE_003_FIRST_BATCH,
  REFERENCE_003_SHOTS,
  expandReference003Shots,
} from "./catalog";

const INVALID_A_ROLL: Reference003Shot = {
  shotKey: "A99",
  slug: "InvalidAroll",
  name: "无效人物镜头",
  durationInFrames: 30,
  qaFrames: [0, 29],
  kind: "a-roll",
  // @ts-expect-error A-roll shots only support Fidelity mode.
  modes: ["Fast", "Fidelity"],
};
void INVALID_A_ROLL;

const FIRST_BATCH = [
  {
    shotKey: "B02",
    slug: "OpinionType",
    name: "观点句动态排版",
    durationInFrames: 96,
    qaFrames: [0, 18, 38, 66, 95],
    kind: "b-roll",
    modes: ["Fast", "Fidelity"],
  },
  {
    shotKey: "B05",
    slug: "ChatPanel",
    name: "群聊面板逐条入场",
    durationInFrames: 162,
    qaFrames: [0, 28, 66, 112, 161],
    kind: "b-roll",
    modes: ["Fast", "Fidelity"],
  },
  {
    shotKey: "B07",
    slug: "HardwareDispatch",
    name: "硬件调度信息卡",
    durationInFrames: 210,
    qaFrames: [0, 38, 86, 146, 209],
    kind: "b-roll",
    modes: ["Fast", "Fidelity"],
  },
  {
    shotKey: "B09",
    slug: "ProfileCarousel",
    name: "人物档案卡轮播",
    durationInFrames: 267,
    qaFrames: [0, 52, 112, 182, 266],
    kind: "b-roll",
    modes: ["Fast", "Fidelity"],
  },
] as const;

const REMAINING_FIDELITY = [
  {
    shotKey: "B01",
    slug: "KeywordType",
    name: "关键词逐字形成",
    durationInFrames: 144,
    qaFrames: [0, 28, 64, 102, 143],
    kind: "b-roll",
    modes: ["Fidelity"],
  },
  {
    shotKey: "B03",
    slug: "QuotePanelPush",
    name: "悬浮面板转巨幅引语",
    durationInFrames: 224,
    qaFrames: [0, 42, 100, 160, 223],
    kind: "b-roll",
    modes: ["Fidelity"],
  },
  {
    shotKey: "B04",
    slug: "MetalComputeArray",
    name: "金属算力阵列",
    durationInFrames: 295,
    qaFrames: [0, 54, 128, 218, 294],
    kind: "b-roll",
    modes: ["Fidelity"],
  },
  {
    shotKey: "B06",
    slug: "EvidenceArticlePush",
    name: "标题转文章证据",
    durationInFrames: 172,
    qaFrames: [0, 30, 76, 124, 171],
    kind: "b-roll",
    modes: ["Fidelity"],
  },
  {
    shotKey: "B08",
    slug: "TeamRelationshipGraph",
    name: "团队关系图展开",
    durationInFrames: 309,
    qaFrames: [0, 54, 132, 222, 308],
    kind: "b-roll",
    modes: ["Fidelity"],
  },
  {
    shotKey: "A01",
    slug: "YearMarketOverlay",
    name: "年份巨字压屏",
    durationInFrames: 111,
    qaFrames: [0, 20, 48, 78, 110],
    kind: "a-roll",
    modes: ["Fidelity"],
  },
  {
    shotKey: "A02",
    slug: "QuestionCardSpeaker",
    name: "人物配左右问题卡",
    durationInFrames: 462,
    qaFrames: [0, 84, 204, 330, 461],
    kind: "a-roll",
    modes: ["Fidelity"],
  },
  {
    shotKey: "A03",
    slug: "MonochromeQuotePortrait",
    name: "黑白人物巨字引语",
    durationInFrames: 327,
    qaFrames: [0, 58, 146, 238, 326],
    kind: "a-roll",
    modes: ["Fidelity"],
  },
] as const;

const SHOTS = [...FIRST_BATCH, ...REMAINING_FIDELITY] as const;

describe("reference 003 catalog", () => {
  test("keeps the compatibility first-batch export unchanged", () => {
    expect(REFERENCE_003_FIRST_BATCH).toEqual(FIRST_BATCH);
  });

  test("keeps all 12 approved shots in the exact locked matrix", () => {
    expect(REFERENCE_003_SHOTS).toEqual(SHOTS);
  });

  test("uses unique shot keys and slugs", () => {
    expect(new Set(REFERENCE_003_SHOTS.map(({ shotKey }) => shotKey)).size).toBe(
      12,
    );
    expect(new Set(REFERENCE_003_SHOTS.map(({ slug }) => slug)).size).toBe(12);
  });

  test("allows only Fidelity mode for A-roll shots", () => {
    const aRollShots = REFERENCE_003_SHOTS.filter(
      ({ kind }) => kind === "a-roll",
    );

    expect(aRollShots.map(({ shotKey, modes }) => ({ shotKey, modes }))).toEqual(
      [
        { shotKey: "A01", modes: ["Fidelity"] },
        { shotKey: "A02", modes: ["Fidelity"] },
        { shotKey: "A03", modes: ["Fidelity"] },
      ],
    );
  });

  test("registers the first batch in both modes and new shots in Fidelity only", () => {
    const expected = [
      ...FIRST_BATCH.flatMap((shot) =>
        shot.modes.map((mode) => ({
          shotKey: shot.shotKey,
          id: `${mode}R03${shot.slug}`,
          mode,
          outputName: `R03-${shot.shotKey}-${mode}-${shot.name}.mp4`,
        })),
      ),
      ...REMAINING_FIDELITY.map((shot) => ({
        shotKey: shot.shotKey,
        id:
          shot.kind === "a-roll"
            ? `FidelityR03Aroll${shot.slug}`
            : `FidelityR03${shot.slug}`,
        mode: "Fidelity",
        outputName: `R03-${shot.shotKey}-Fidelity-${shot.name}.mp4`,
      })),
    ];

    expect(
      REFERENCE_003_COMPOSITIONS.map(
        ({ shotKey, id, mode, outputName }) => ({
          shotKey,
          id,
          mode,
          outputName,
        }),
      ),
    ).toEqual(expected);
    expect(REFERENCE_003_COMPOSITIONS).toHaveLength(16);
    expect(
      REFERENCE_003_COMPOSITIONS.filter(
        ({ shotKey, mode }) =>
          ["B01", "B03", "B04", "B06", "B08"].includes(shotKey) &&
          mode === "Fast",
      ),
    ).toEqual([]);
  });

  test("expands only the modes declared by each shot", () => {
    const compositions = expandReference003Shots([
      {
        shotKey: "A01",
        slug: "SyntheticAroll",
        name: "合成人物镜头",
        durationInFrames: 120,
        qaFrames: [0, 30, 60, 90, 119],
        kind: "a-roll",
        modes: ["Fidelity"],
      },
    ]);

    expect(compositions).toHaveLength(1);
    expect(compositions[0]).toMatchObject({
      id: "FidelityR03ArollSyntheticAroll",
      kind: "a-roll",
      mode: "Fidelity",
    });
  });

  test("expanding the public shot catalog never creates unregistered modes", () => {
    expect(expandReference003Shots(REFERENCE_003_SHOTS)).toEqual(
      REFERENCE_003_COMPOSITIONS,
    );
  });

  test("uses unique composition IDs and output names", () => {
    expect(new Set(REFERENCE_003_COMPOSITIONS.map(({ id }) => id)).size).toBe(
      16,
    );
    expect(
      new Set(REFERENCE_003_COMPOSITIONS.map(({ outputName }) => outputName))
        .size,
    ).toBe(16);
  });

  test("keeps QA frames unique, ordered, and within bounds", () => {
    for (const shot of REFERENCE_003_SHOTS) {
      expect(shot.qaFrames).toHaveLength(5);
      expect(shot.qaFrames.every(Number.isInteger)).toBe(true);
      expect(new Set(shot.qaFrames).size).toBe(shot.qaFrames.length);
      expect(shot.qaFrames[0]).toBe(0);
      expect(shot.qaFrames[shot.qaFrames.length - 1]).toBe(
        shot.durationInFrames - 1,
      );
      expect(
        shot.qaFrames.every(
          (frame, index) => index === 0 || frame > shot.qaFrames[index - 1],
        ),
      ).toBe(true);
    }
  });

  test("uses HD output at 30fps", () => {
    for (const composition of REFERENCE_003_COMPOSITIONS) {
      expect(composition).toMatchObject({
        width: 1920,
        height: 1080,
        fps: 30,
      });
    }
  });
});
