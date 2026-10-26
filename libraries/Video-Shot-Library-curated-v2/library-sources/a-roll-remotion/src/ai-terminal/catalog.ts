import type {AITerminalSceneProps} from "./types";

export type AITerminalRollType = "A-roll" | "B-roll";

export type AITerminalShot = {
  id: AITerminalSceneProps["id"];
  compositionId: string;
  title: string;
  rollType: AITerminalRollType;
  width: 1920;
  height: 1080;
  fps: 30;
  durationInFrames: 182;
  defaultProps: AITerminalSceneProps;
};

const shot = (
  value: Omit<
    AITerminalShot,
    "width" | "height" | "fps" | "durationInFrames" | "defaultProps"
  > &
    Omit<AITerminalSceneProps, "durationInFrames">,
): AITerminalShot => ({
  id: value.id,
  compositionId: value.compositionId,
  title: value.title,
  rollType: value.rollType,
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 182,
  defaultProps: {
    durationInFrames: 182,
    id: value.id,
    variant: value.variant,
    portraitSrc: value.portraitSrc,
    headline: value.headline,
    subline: value.subline,
    lines: value.lines,
    accentColor: value.accentColor,
    darkMode: value.darkMode,
  },
});

export const AI_TERMINAL_SHOTS: AITerminalShot[] = [
  shot({
    id: "code",
    compositionId: "XcyjAiTerminalCode",
    title: "代码窗",
    rollType: "A-roll",
    variant: "code-split",
    portraitSrc: "assets/portrait-landscape.png",
    headline: "composition.html",
    subline: "HyperFrames · 写网页就能做,方便,但效果偏简单",
    lines: [
      '<div data-composition-id="intro"',
      '  data-width="1920" data-height="1080">',
      '  <h1 class="title">HyperFrames</h1>',
      "  <script>",
      "    const tl = gsap.timeline();",
      "    tl.from('.title', {opacity: 0, y: 40});",
      "  </script>",
      "</div>",
    ],
    accentColor: "#3f8cff",
    darkMode: false,
  }),
  shot({
    id: "terminal",
    compositionId: "XcyjAiTerminalClaudeTerminal",
    title: "Claude Code 终端",
    rollType: "B-roll",
    variant: "terminal",
    portraitSrc: "",
    headline: "claude — Claude Code",
    subline: "",
    lines: ["正文示例", "正文示例", "正文示例"],
    accentColor: "#3f8cff",
    darkMode: true,
  }),
  shot({
    id: "contextterminal",
    compositionId: "XcyjAiTerminalContextTerminal",
    title: "喂资料前后对照(终端)",
    rollType: "B-roll",
    variant: "context-terminal",
    portraitSrc: "",
    headline: "claude — Claude Code",
    subline: "claude-opus-4.8",
    lines: ["帮我设计一个 AI 工作台", "读取项目上下文", "根据资料生成结构"],
    accentColor: "#3f8cff",
    darkMode: true,
  }),
  shot({
    id: "aiinput",
    compositionId: "XcyjAiTerminalAiInput",
    title: "AI 输入页(可换 AI)",
    rollType: "B-roll",
    variant: "ai-input",
    portraitSrc: "",
    headline: "How can I help you today?",
    subline: "Let's design an interface for a new AI workbench",
    lines: ["Claude Sonnet 4.5"],
    accentColor: "#e87955",
    darkMode: true,
  }),
  shot({
    id: "claudecodeinput",
    compositionId: "XcyjAiTerminalClaudeCodeInput",
    title: "Claude Code 输入页",
    rollType: "B-roll",
    variant: "claude-input",
    portraitSrc: "",
    headline: "Claude Code v2.1.195",
    subline: "Let's design an interface for a new AI workbench",
    lines: ["Opus 4.8 (1M context) with xhigh effort · Claude Max"],
    accentColor: "#df7657",
    darkMode: false,
  }),
  shot({
    id: "inputpan",
    compositionId: "XcyjAiTerminalInputPan",
    title: "一镜摇过:聊天框→终端",
    rollType: "B-roll",
    variant: "input-pan",
    portraitSrc: "",
    headline: "How can I help you today?",
    subline: "Let's design an interface for a new AI workbench",
    lines: ["Claude Code v2.1.195"],
    accentColor: "#df7657",
    darkMode: false,
  }),
  shot({
    id: "rc017",
    compositionId: "XcyjAiTerminalCommandMenu",
    title: "RC 结构｜命令菜单状态机",
    rollType: "B-roll",
    variant: "command-menu",
    portraitSrc: "",
    headline: "搜索、选择与结果构成状态机",
    subline: "RC STRUCTURE / S05",
    lines: ["新建镜头", "打开镜头目录", "渲染关键帧", "运行标签校验"],
    accentColor: "#e87955",
    darkMode: true,
  }),
  shot({
    id: "rc021",
    compositionId: "XcyjAiTerminalCommandConverge",
    title: "RC B 技法｜命令输入收束",
    rollType: "B-roll",
    variant: "command-converge",
    portraitSrc: "",
    headline: "输入、排除与路径在同一外壳收束",
    subline: "RC TECHNIQUE / B02",
    lines: ["洗脑", "脚本", "分镜", "字幕", "渲染"],
    accentColor: "#e87955",
    darkMode: false,
  }),
];

