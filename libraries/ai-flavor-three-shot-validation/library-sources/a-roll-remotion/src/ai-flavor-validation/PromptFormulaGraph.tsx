import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {getFormulaGraphState, stageProgress} from "./motion";

const SANS = '"PingFang SC", "Microsoft YaHei", sans-serif';
const SERIF = '"Songti SC", "STSong", serif';
const ORANGE = "#c46f1d";
const INK = "#24211d";

const NODES = [
  {
    index: "01",
    title: "场景",
    description: "这是干嘛的",
    x: 108,
    y: 254,
    start: 90,
    tone: "paper",
  },
  {
    index: "02",
    title: "结构",
    description: "页面怎么排",
    x: 1402,
    y: 254,
    start: 106,
    tone: "paper",
  },
  {
    index: "03",
    title: "风格",
    description: "想要什么气质",
    x: 128,
    y: 760,
    start: 122,
    tone: "orange",
  },
  {
    index: "04",
    title: "视觉约束",
    description: "色彩、圆角、密度",
    x: 765,
    y: 798,
    start: 138,
    tone: "paper",
  },
  {
    index: "05",
    title: "禁止项",
    description: "明确不要什么",
    x: 1382,
    y: 760,
    start: 154,
    tone: "ink",
  },
] as const;

const EDGE_PATHS = [
  "M790 500 C640 472 560 398 500 330",
  "M1130 500 C1280 472 1360 398 1420 330",
  "M805 600 C650 660 560 725 520 790",
  "M960 625 C960 690 960 742 960 800",
  "M1115 600 C1270 660 1360 725 1400 790",
] as const;

const FormulaNode = ({node, frame}: {node: (typeof NODES)[number]; frame: number}) => {
  const {fps} = useVideoConfig();
  const progress = stageProgress(frame, node.start, node.start + 38);
  const enter = spring({
    frame: frame - node.start,
    fps,
    config: {damping: 24, stiffness: 92, mass: 0.9},
    durationInFrames: 42,
  });
  const isInk = node.tone === "ink";
  const isOrange = node.tone === "orange";

  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: 410,
        height: 148,
        display: "flex",
        alignItems: "center",
        padding: "0 30px",
        boxSizing: "border-box",
        background: isInk ? INK : isOrange ? "#d38a3d" : "rgba(250,247,239,.9)",
        color: isInk ? "#f7efe0" : INK,
        border: `2px solid ${isInk ? INK : "rgba(66,58,47,.38)"}`,
        borderRadius: 5,
        boxShadow: "-22px 25px 38px rgba(69,57,42,.14)",
        opacity: progress,
        scale: interpolate(enter, [0, 1], [0.76, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
        translate: `0px ${interpolate(enter, [0, 1], [42, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}px`,
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          borderRadius: "50%",
          background: isInk ? ORANGE : INK,
          color: "#fff4e3",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        {node.index}
      </div>
      <div style={{marginLeft: 24}}>
        <div style={{fontFamily: SERIF, fontSize: 42, fontWeight: 800}}>
          {node.title}
        </div>
        <div
          style={{
            marginTop: 8,
            color: isInk ? "#d9cdbb" : "#71695e",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          {node.description}
        </div>
      </div>
    </div>
  );
};

export const PromptFormulaGraph = () => {
  const frame = useCurrentFrame();
  const state = getFormulaGraphState(frame);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#ede7da",
        color: INK,
        fontFamily: SANS,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 45%, #faf7ef 0%, #ede7da 68%, #d0c7b7 100%), radial-gradient(rgba(65,54,40,.16) .55px, transparent .8px)",
          backgroundSize: "auto, 7px 7px",
          scale: 1 + state.camera * 0.055,
          translate: `${-10 * state.camera}px ${8 * state.camera}px`,
          transformOrigin: "50% 52%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 74,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 7,
            color: "#726b61",
            opacity: state.center,
          }}
        >
          PROMPT ANATOMY / FIVE PARTS
        </div>
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 112,
            fontFamily: SERIF,
            fontSize: 60,
            fontWeight: 800,
            opacity: state.center,
            translate: `0px ${(1 - state.center) * 24}px`,
          }}
        >
          把模糊感觉拆成明确关系
        </div>

        <svg
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{position: "absolute", inset: 0, overflow: "visible"}}
        >
          {EDGE_PATHS.map((path, index) => (
            <g key={path}>
              <path
                d={path}
                fill="none"
                stroke="rgba(77,68,56,.16)"
                strokeWidth="14"
                strokeDasharray="1"
                strokeDashoffset={1 - state.edges}
                pathLength="1"
              />
              <path
                d={path}
                fill="none"
                stroke={index >= 2 ? "rgba(196,111,29,.78)" : "rgba(77,68,56,.64)"}
                strokeWidth="2.5"
                strokeDasharray="1"
                strokeDashoffset={1 - state.edges}
                pathLength="1"
              />
            </g>
          ))}
        </svg>

        <div
          style={{
            position: "absolute",
            left: 735,
            top: 402,
            width: 450,
            height: 234,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: INK,
            color: "#f7efe1",
            border: `5px solid ${ORANGE}`,
            boxShadow: "0 0 0 16px rgba(196,111,29,.1), -25px 32px 55px rgba(61,49,36,.22)",
            opacity: state.center,
            scale: 0.72 + state.center * 0.28,
          }}
        >
          <div style={{fontSize: 16, fontWeight: 800, letterSpacing: 5}}>
            COMPLETE BRIEF
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: SERIF,
              fontSize: 54,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            可执行的界面需求
          </div>
        </div>

        {NODES.map((node) => (
          <FormulaNode key={node.index} node={node} frame={frame} />
        ))}

        <div
          style={{
            position: "absolute",
            left: 625,
            top: 674,
            width: 670,
            height: 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(249,245,236,.94)",
            borderTop: `4px solid ${ORANGE}`,
            borderBottom: `1px solid rgba(65,54,40,.35)`,
            boxShadow: "-14px 18px 28px rgba(65,54,40,.11)",
            fontFamily: SERIF,
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: 4,
            opacity: state.summary,
            translate: `0px ${(1 - state.summary) * 32}px`,
          }}
        >
          把感觉翻译成规则
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
