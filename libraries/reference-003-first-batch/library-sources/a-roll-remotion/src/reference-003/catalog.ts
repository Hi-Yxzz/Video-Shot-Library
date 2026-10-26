export type Reference003Mode = "Fast" | "Fidelity";
export type Reference003Kind = "b-roll" | "a-roll";

type Reference003ShotBase = Readonly<{
  shotKey: string;
  slug: string;
  name: string;
  durationInFrames: number;
  qaFrames: readonly number[];
}>;

export type Reference003Shot = Reference003ShotBase &
  (
    | Readonly<{
        kind: "a-roll";
        modes: readonly ["Fidelity"];
      }>
    | Readonly<{
        kind: "b-roll";
        modes: readonly ["Fast", "Fidelity"] | readonly ["Fidelity"];
      }>
  );

export type Reference003Composition = Readonly<
  Reference003Shot & {
    id: string;
    mode: Reference003Mode;
    outputName: string;
    width: 1920;
    height: 1080;
    fps: 30;
  }
>;

export const REFERENCE_003_FIRST_BATCH = [
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
] as const satisfies readonly Reference003Shot[];

const REFERENCE_003_REMAINING_FIDELITY = [
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
] as const satisfies readonly Reference003Shot[];

export const REFERENCE_003_SHOTS = [
  ...REFERENCE_003_FIRST_BATCH,
  ...REFERENCE_003_REMAINING_FIDELITY,
] as const satisfies readonly Reference003Shot[];

const createReference003Composition = (
  shot: Reference003Shot,
  mode: Reference003Mode,
): Reference003Composition => {
  if (shot.kind === "a-roll") {
    if (mode !== "Fidelity") {
      throw new Error(`A-roll shot ${shot.shotKey} only supports Fidelity`);
    }

    return {
      ...shot,
      id: `FidelityR03Aroll${shot.slug}`,
      mode,
      outputName: `R03-${shot.shotKey}-${mode}-${shot.name}.mp4`,
      width: 1920,
      height: 1080,
      fps: 30,
    };
  }

  return {
    ...shot,
    id: `${mode}R03${shot.slug}`,
    mode,
    outputName: `R03-${shot.shotKey}-${mode}-${shot.name}.mp4`,
    width: 1920,
    height: 1080,
    fps: 30,
  };
};

export const expandReference003Shots = (
  shots: readonly Reference003Shot[],
): readonly Reference003Composition[] =>
  shots.flatMap((shot) =>
    shot.modes.map((mode) => createReference003Composition(shot, mode)),
  );

export const REFERENCE_003_COMPOSITIONS = [
  ...expandReference003Shots(REFERENCE_003_SHOTS),
] as const satisfies readonly Reference003Composition[];
