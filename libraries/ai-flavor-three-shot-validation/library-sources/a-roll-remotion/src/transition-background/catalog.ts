import type {
  TransitionBackgroundId,
  TransitionBackgroundSceneProps,
} from "./types";

export type TransitionBackgroundShot = {
  id: TransitionBackgroundId;
  compositionId: string;
  title: string;
  rollType: "B-roll";
  width: 1920;
  height: 1080;
  fps: 30;
  durationInFrames: number;
  defaultProps: TransitionBackgroundSceneProps;
};

type ShotInput = {
  id: TransitionBackgroundId;
  compositionId: string;
  title: string;
  sceneTitle?: string;
  subtitle: string;
  words: string[];
  durationInFrames?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  paperColor?: string;
  darkMode?: boolean;
  speed?: number;
  intensity?: number;
};

const shot = ({
  durationInFrames = 180,
  backgroundColor = "#1c130d",
  primaryColor = "#3d85e8",
  secondaryColor = "#d97757",
  paperColor = "#efe7dd",
  darkMode = true,
  speed = 1,
  intensity = 1,
  ...value
}: ShotInput): TransitionBackgroundShot => ({
  id: value.id,
  compositionId: value.compositionId,
  title: value.title,
  rollType: "B-roll",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames,
  defaultProps: {
    durationInFrames,
    id: value.id,
    variant: value.id,
    portraitSrc: "",
    title: value.sceneTitle ?? value.title,
    subtitle: value.subtitle,
    words: value.words,
    backgroundColor,
    primaryColor,
    secondaryColor,
    paperColor,
    darkMode,
    speed,
    intensity,
  },
});

export const TRANSITION_BACKGROUND_SHOTS: TransitionBackgroundShot[] = [
  shot({id: "transition", compositionId: "XcyjTransitionTitle", title: "过场标题", sceneTitle: "段文本示例段文本示例段文本示例", subtitle: "概念翻篇 · 章节转场", words: ["新的章节"]}),
  shot({id: "abilitypan", compositionId: "XcyjAbilityCardDeal", title: "能力卡发牌·逐张扫过", subtitle: "五张能力卡依次发牌", words: ["懂 AI", "品味与判断", "Context 工程", "迭代进程", "好奇探索"], durationInFrames: 189}),
  shot({id: "abilitychapter", compositionId: "XcyjAbilityChapter", title: "能力章节卡", subtitle: "成为懂 AI 的人", words: ["01", "能力一", "懂 AI"]}),
  shot({id: "dotmatrix", compositionId: "XcyjDotMatrixBackdrop", title: "点阵铺底背景", subtitle: "低透明点阵慢速漂移", words: ["AMBIENT", "LOOP"], backgroundColor: "#17130f", primaryColor: "#7cf5d2", secondaryColor: "#f6b65e"}),
  shot({id: "tornwipe", compositionId: "XcyjTornPaperWipe", title: "撕纸转场", subtitle: "第二回合", words: ["第二回合"], backgroundColor: "#29201a", primaryColor: "#d62e1f", secondaryColor: "#d9a441"}),
  shot({id: "chaptercard", compositionId: "XcyjChapterTitleCard", title: "章节标题卡", subtitle: "Claude 完整效果", words: ["CLAUDE", "完整效果"]}),
  shot({id: "rk028", compositionId: "XcyjCircuitPulseBackground", title: "Circuit Pulse Background", subtitle: "MOTION TECHNIQUE", words: ["PULSE", "SIGNAL"]}),
  shot({id: "rk029", compositionId: "XcyjOrbitalRingsLoader", title: "Orbital Rings Loader", subtitle: "MOTION TECHNIQUE", words: ["ORBIT", "LOAD"]}),
  shot({id: "rk036", compositionId: "XcyjHudEyeScanner", title: "HUD Eye Scanner", subtitle: "MOTION TECHNIQUE", words: ["SCAN", "FOCUS"]}),
  shot({id: "rk063", compositionId: "XcyjWaveformPulse", title: "Waveform Pulse", subtitle: "MOTION TECHNIQUE", words: ["WAVE", "PULSE"]}),
  shot({id: "rk069", compositionId: "XcyjStargazer", title: "Stargazer", subtitle: "MOTION TECHNIQUE", words: ["STAR", "TRACE"]}),
  shot({id: "rk080", compositionId: "XcyjParticleField", title: "Particle Field", subtitle: "MOTION TECHNIQUE", words: ["PARTICLE", "FIELD"]}),
  shot({id: "rk090", compositionId: "XcyjMusicVisualizer", title: "Music Visualizer Scene", subtitle: "MOTION TECHNIQUE", words: ["BEAT", "RHYTHM"]}),
  shot({id: "rk093", compositionId: "XcyjMatrixRain", title: "Matrix Rain", subtitle: "MOTION TECHNIQUE", words: ["CODE", "MATRIX"]}),
  shot({id: "rk131", compositionId: "XcyjAuroraBackground", title: "Aurora Background", subtitle: "MOTION TECHNIQUE", words: ["AURORA", "FLOW"]}),
  shot({id: "rc023", compositionId: "XcyjSweepMaskTransition", title: "扫描遮罩转场", subtitle: "扫描窗把旧状态改写成新主题", words: ["粗略观察", "局部证据"], backgroundColor: "#efe7dd", darkMode: false}),
  shot({id: "rc026", compositionId: "XcyjFluidSurface", title: "流体表面材质", subtitle: "低成本流体表面只保留一次材质变化", words: ["SURFACE", "FLUID"]}),
  shot({id: "paperlift", compositionId: "XcyjPaperLift", title: "整页抬升揭示", subtitle: "从明细表切换到一句话判断", words: ["阶段数据排行", "项目一", "项目二", "项目三", "核心结论"], backgroundColor: "#efe7dd", darkMode: false}),
  shot({id: "documentcascade", compositionId: "XcyjDocumentCascade", title: "文档级联证据墙", subtitle: "证据从单页扩展成完整图景", words: ["研究背景", "用户路径", "关键数据", "实验结果", "竞争分析", "结论摘要"], durationInFrames: 210, backgroundColor: "#29201a"}),
  shot({id: "pageleafcascade", compositionId: "XcyjPageLeafCascade", title: "连续书页叶片级联", subtitle: "证据目录", words: ["背景", "证据", "分析", "结论", "附录"], durationInFrames: 93, backgroundColor: "#29201a"}),
];
