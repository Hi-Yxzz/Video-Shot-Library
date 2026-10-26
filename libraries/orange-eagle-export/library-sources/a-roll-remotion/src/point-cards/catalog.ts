export type PointCardRollType = "A-roll" | "B-roll";

export type PointCardVariant =
  | "title"
  | "list"
  | "compare"
  | "flankcards"
  | "logos"
  | "chipcluster"
  | "pushstack"
  | "questionpush"
  | "sealcard"
  | "radar-lower-third"
  | "sports-lower-third"
  | "news-lower-third"
  | "design-history"
  | "wheel-interface"
  | "badge-morph"
  | "token-text"
  | "selective-recombine";

export type PointCardShot = {
  id: string;
  title: string;
  compositionId: string;
  rollType: PointCardRollType;
  variant: PointCardVariant;
  width: 1920;
  height: 1080;
  fps: 30;
  durationInFrames: number;
  headline: string;
  subline: string;
  items: string[];
  accentColor: string;
  secondaryColor: string;
  darkMode: boolean;
};

const shot = (
  value: Omit<PointCardShot, "width" | "height" | "fps" | "durationInFrames"> & {
    durationInFrames?: number;
  },
): PointCardShot => ({
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: value.durationInFrames ?? 182,
  ...value,
});

export const POINT_CARD_SHOTS: PointCardShot[] = [
  shot({
    id: "title",
    compositionId: "XcyjPointTitle",
    title: "点题关键词卡",
    rollType: "A-roll",
    variant: "title",
    headline: "",
    subline: "",
    items: ["卡片文字示例", "卡片文字示例", "卡片文字示例"],
    accentColor: "#f28a64",
    secondaryColor: "#4a8be8",
    darkMode: true,
  }),
  shot({
    id: "list",
    compositionId: "XcyjPointList",
    title: "侧栏要点列表",
    rollType: "A-roll",
    variant: "list",
    headline: "",
    subline: "",
    items: ["这一条文字示例", "这一条文字示例", "这一条文字示例"],
    accentColor: "#f28a64",
    secondaryColor: "#4a8be8",
    darkMode: false,
  }),
  shot({
    id: "compare",
    compositionId: "XcyjPointCompare",
    title: "双卡对比",
    rollType: "A-roll",
    variant: "compare",
    headline: "",
    subline: "VS",
    items: ["左卡文字示例", "右卡文字示例"],
    accentColor: "#f28a64",
    secondaryColor: "#4a8be8",
    darkMode: true,
  }),
  shot({
    id: "flankcards",
    compositionId: "XcyjPointFlankCards",
    title: "左右卡片",
    rollType: "A-roll",
    variant: "flankcards",
    headline: "",
    subline: "",
    items: [
      "卡片文字示例",
      "卡片文字示例",
      "卡片文字示例",
      "卡片文字示例",
      "卡片文字示例",
      "卡片文字示例",
    ],
    accentColor: "#f28a64",
    secondaryColor: "#4a8be8",
    darkMode: true,
  }),
  shot({
    id: "logos",
    compositionId: "XcyjPointLogoWall",
    title: "Logo 墙",
    rollType: "A-roll",
    variant: "logos",
    headline: "合作与常用工具",
    subline: "",
    items: ["Claude", "Codex", "Cursor", "Copilot", "DeepSeek", "Anthropic"],
    accentColor: "#f28a64",
    secondaryColor: "#4a8be8",
    darkMode: false,
  }),
  shot({
    id: "chipcluster",
    compositionId: "XcyjPointChipCluster",
    title: "小标签聚成结论",
    rollType: "A-roll",
    variant: "chipcluster",
    headline: "收束大字示例",
    subline: "角色汇聚",
    items: ["销售", "运营", "产品", "设计", "研发", "管理者"],
    accentColor: "#f28a64",
    secondaryColor: "#4a8be8",
    darkMode: true,
  }),
  shot({
    id: "pushstack",
    compositionId: "XcyjPointPushStack",
    title: "一句话说三遍·亮出重点",
    rollType: "A-roll",
    variant: "pushstack",
    headline: "推手卡片文字示例",
    subline: "",
    items: ["重复卡文字示例", "重复卡文字示例", "重复卡文字示例"],
    accentColor: "#f28a64",
    secondaryColor: "#4a8be8",
    darkMode: false,
  }),
  shot({
    id: "questionpush",
    compositionId: "XcyjPointQuestionPush",
    title: "标题挤到一边·问题清单",
    rollType: "B-roll",
    variant: "questionpush",
    headline: "5",
    subline: "Simple\nQuestion",
    items: [
      "What should it watch?",
      "How often should it check in?",
      "What's the change it's hunting for?",
      "What should it do the moment that change happens?",
      "When should it stop and come ask you?",
    ],
    accentColor: "#e86f51",
    secondaryColor: "#4a8be8",
    darkMode: false,
  }),
  shot({
    id: "sealcard",
    compositionId: "XcyjPointSealCard",
    title: "印章定论卡",
    rollType: "B-roll",
    variant: "sealcard",
    headline: "这一回合 确定性完胜",
    subline: "本回合判定",
    items: ["已验证"],
    accentColor: "#d62e1f",
    secondaryColor: "#d9a441",
    darkMode: false,
  }),
  shot({
    id: "rk031",
    compositionId: "XcyjPointRadarLowerThird",
    title: "RK B 技法｜Radar Lower Third",
    rollType: "B-roll",
    variant: "radar-lower-third",
    headline: "MOTION TECHNIQUE",
    subline: "Reusable B-grade motion fragment",
    items: ["MOVE", "TRACE", "PULSE", "FOCUS"],
    accentColor: "#397cf7",
    secondaryColor: "#ef7353",
    darkMode: true,
  }),
  shot({
    id: "rk070",
    compositionId: "XcyjPointSportsLowerThird",
    title: "RK B 技法｜Sports Broadcast Lower Third",
    rollType: "B-roll",
    variant: "sports-lower-third",
    headline: "MOTION TECHNIQUE",
    subline: "34:72",
    items: ["MOVE", "TRACE"],
    accentColor: "#397cf7",
    secondaryColor: "#ef7353",
    darkMode: true,
  }),
  shot({
    id: "rk085",
    compositionId: "XcyjPointNewsLowerThird",
    title: "RK B 技法｜News Ticker Lower Third",
    rollType: "B-roll",
    variant: "news-lower-third",
    headline: "MNEWS",
    subline: "MOTION NEWS / TRACE / PULSE / FOCUS",
    items: ["NEWS", "MOVE", "TRACE", "PULSE"],
    accentColor: "#397cf7",
    secondaryColor: "#ef7353",
    darkMode: true,
  }),
  shot({
    id: "rc014",
    compositionId: "XcyjPointDesignHistory",
    title: "RC 结构｜物件驱动设计沿革",
    rollType: "B-roll",
    variant: "design-history",
    headline: "物件、资料与结论组成章节",
    subline: "DESIGN HISTORY",
    items: ["⌨|1984|键盘优先", "◫|2007|触控界面", "✦|2026|智能协作"],
    accentColor: "#397cf7",
    secondaryColor: "#ef7353",
    darkMode: true,
  }),
  shot({
    id: "rc016",
    compositionId: "XcyjPointWheelInterface",
    title: "RC 结构｜环形目录正文映射",
    rollType: "B-roll",
    variant: "wheel-interface",
    headline: "环形目录与正文双向映射",
    subline: "WHEEL INTERFACE",
    items: ["先找证据", "提炼语法", "转成时间线", "进入镜头库"],
    accentColor: "#397cf7",
    secondaryColor: "#ef7353",
    darkMode: true,
  }),
  shot({
    id: "rc022",
    compositionId: "XcyjPointBadgeMorph",
    title: "RC B 技法｜徽标形变反馈",
    rollType: "B-roll",
    variant: "badge-morph",
    headline: "点、勾选与计数共享一次状态反馈",
    subline: "STATUS FEEDBACK",
    items: ["关键帧|4", "标签校验|1", "预览 MP4|8"],
    accentColor: "#397cf7",
    secondaryColor: "#ef7353",
    darkMode: false,
  }),
  shot({
    id: "rc024",
    compositionId: "XcyjPointTokenText",
    title: "RC B 技法｜文字 Token 错峰",
    rollType: "B-roll",
    variant: "token-text",
    headline: "词组按语义错峰，而不是整句淡入",
    subline: "TOKEN TEXT",
    items: ["观察", "运动", "转成", "时间线", "进入", "镜头库"],
    accentColor: "#397cf7",
    secondaryColor: "#ef7353",
    darkMode: false,
  }),
  shot({
    id: "selectiverecombine",
    compositionId: "XcyjPointSelectiveRecombine",
    title: "选择保留与重组",
    rollType: "B-roll",
    variant: "selective-recombine",
    durationInFrames: 452,
    headline: "重新发牌，锁定方法",
    subline: "选择 · 保留 · 重组",
    items: ["主题", "角度", "关键画面", "故事结构", "视觉形式", "声音", "钩子"],
    accentColor: "#3d85e8",
    secondaryColor: "#d97757",
    darkMode: true,
  }),
];
