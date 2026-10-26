import type {ScreenshotRecordingSceneProps} from "./types";

export type ScreenshotRecordingRollType = "A-roll" | "B-roll";

export type ScreenshotRecordingShot = {
  id: ScreenshotRecordingSceneProps["id"];
  compositionId: string;
  title: string;
  rollType: ScreenshotRecordingRollType;
  width: 1920;
  height: 1080;
  fps: 30;
  durationInFrames: 180;
  defaultProps: ScreenshotRecordingSceneProps;
};

const shot = (
  value: Omit<
    ScreenshotRecordingShot,
    "width" | "height" | "fps" | "durationInFrames" | "defaultProps"
  > &
    Omit<ScreenshotRecordingSceneProps, "durationInFrames">,
): ScreenshotRecordingShot => ({
  id: value.id,
  compositionId: value.compositionId,
  title: value.title,
  rollType: value.rollType,
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 180,
  defaultProps: {
    durationInFrames: 180,
    id: value.id,
    variant: value.variant,
    portraitSrc: value.portraitSrc,
    mediaSrc: value.mediaSrc,
    secondaryMediaSrc: value.secondaryMediaSrc,
    title: value.title,
    subtitle: value.subtitle,
    lines: value.lines,
    accentColor: value.accentColor,
    darkMode: value.darkMode,
  },
});

const portraitSrc = "assets/portrait-landscape.png";
const common = {
  mediaSrc: "",
  secondaryMediaSrc: "",
  accentColor: "#e87955",
} as const;

export const SCREENSHOT_RECORDING_SHOTS: ScreenshotRecordingShot[] = [
  shot({
    ...common,
    id: "showcase",
    compositionId: "XcyjScreenshotShowcase",
    title: "产品展示",
    rollType: "A-roll",
    variant: "showcase",
    portraitSrc,
    subtitle: "边讲边展示产品录屏或网页示例",
    lines: ["录屏展示", "关键步骤", "成果预览"],
    darkMode: false,
  }),
  shot({
    ...common,
    id: "screenshot",
    compositionId: "XcyjScreenshotEvidenceSide",
    title: "截图证据（半屏）",
    rollType: "A-roll",
    variant: "screenshot",
    portraitSrc,
    subtitle: "把证据放到口播旁边",
    lines: ["关键结论", "重点区域"],
    darkMode: false,
  }),
  shot({
    ...common,
    id: "shotfull",
    compositionId: "XcyjScreenshotEvidenceFull",
    title: "截图证据（全屏）",
    rollType: "B-roll",
    variant: "shotfull",
    portraitSrc: "",
    subtitle: "重要证据全屏特写",
    lines: ["关键结论", "重点证据"],
    darkMode: true,
  }),
  shot({
    ...common,
    id: "scrollshot",
    compositionId: "XcyjScreenshotLongScroll",
    title: "长截图往上滚",
    rollType: "A-roll",
    variant: "scrollshot",
    portraitSrc,
    subtitle: "长文按阅读顺序向上滚动",
    lines: ["第一段", "第二段", "第三段", "第四段"],
    darkMode: true,
  }),
  shot({
    ...common,
    id: "brollstack",
    compositionId: "XcyjScreenshotDoubleCover",
    title: "双封面并排（开头用）",
    rollType: "A-roll",
    variant: "brollstack",
    portraitSrc,
    subtitle: "两个封面或案例同时出现",
    lines: ["主题拆解", "案例参考"],
    darkMode: true,
  }),
  shot({
    ...common,
    id: "ring",
    compositionId: "XcyjScreenshotHighlightRing",
    title: "截图高亮框",
    rollType: "A-roll",
    variant: "ring",
    portraitSrc,
    subtitle: "高密度证据页精准圈注",
    lines: ["关键数据", "核心结论", "来源说明"],
    darkMode: true,
  }),
  shot({
    ...common,
    id: "rc012",
    compositionId: "XcyjScreenshotStickyStory",
    title: "RC A｜滚动叙事固定主画面",
    rollType: "B-roll",
    variant: "sticky-story",
    portraitSrc: "",
    subtitle: "内容滚动，主画面保持叙事锚点",
    lines: ["钩子：先给结论", "证据：展示原始材料", "方法：拆成三个动作", "案例：替换成自己的内容"],
    darkMode: true,
  }),
  shot({
    ...common,
    id: "rc018",
    compositionId: "XcyjScreenshotBrowserStack",
    title: "RC 结构｜浏览历史空间栈",
    rollType: "B-roll",
    variant: "browser-stack",
    portraitSrc: "",
    subtitle: "把访问路径变成可读的空间栈",
    lines: ["运动参考盘点", "参数化字段设计", "关键帧检查", "镜头目录验收"],
    darkMode: false,
  }),
  shot({
    ...common,
    id: "rc019",
    compositionId: "XcyjScreenshotSidebarSync",
    title: "RC 结构｜三区同步侧边栏",
    rollType: "B-roll",
    variant: "sidebar-sync",
    portraitSrc: "",
    subtitle: "导航、预览与正文三区同步",
    lines: ["素材", "镜头", "参数", "验收"],
    darkMode: true,
  }),
  shot({
    ...common,
    id: "rc025",
    compositionId: "XcyjScreenshotMediaRail",
    title: "RC B 技法｜媒体焦点轨道",
    rollType: "B-roll",
    variant: "media-rail",
    portraitSrc: "",
    subtitle: "媒体轨道连续移动，焦点卡负责解释",
    lines: ["选题证据", "钩子片段", "方法拆解", "案例画面", "结尾收束"],
    darkMode: true,
  }),
];
