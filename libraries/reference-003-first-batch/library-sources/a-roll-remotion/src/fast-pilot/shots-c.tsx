import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CLAMP,
  CornerFrame,
  FONT_SANS,
  PALETTE,
  PilotBackground,
} from "./design";

export const CASE_CARD_CONSTELLATION_DURATION = 165;
export const CASE_CARD_CONSTELLATION_QA_FRAMES = [0, 35, 78, 118, 150] as const;

export const PROMPT_TO_COMPARISON_DURATION = 150;
export const PROMPT_TO_COMPARISON_QA_FRAMES = [0, 28, 62, 96, 138] as const;

const progress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], CLAMP);

const springIn = (frame: number, fps: number, delay: number) =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.82},
    durationInFrames: 34,
  });

type CardSpec = {
  x: number;
  y: number;
  width: number;
  delay: number;
  rotate: number;
  fromX: number;
  fromY: number;
  label: string;
  title: string;
  metric: string;
  accent: string;
  icon: ReactNode;
};

const MiniChart = ({color}: {color: string}) => (
  <svg width="126" height="58" viewBox="0 0 126 58" aria-hidden="true">
    <path d="M4 50 C23 42 26 30 42 34 S64 48 76 25 S102 22 121 7" fill="none" stroke={color} strokeWidth="5" />
    <path d="M4 50 H121" fill="none" stroke="#ffffff22" strokeWidth="2" />
  </svg>
);

const MiniBars = ({color}: {color: string}) => (
  <div style={{display: "flex", alignItems: "flex-end", gap: 8, height: 58}}>
    {[28, 44, 35, 55].map((height, index) => (
      <div
        key={height}
        style={{
          width: 18,
          height,
          borderRadius: 5,
          background: index === 3 ? color : `${color}55`,
        }}
      />
    ))}
  </div>
);

const CaseCard = ({spec, frame, fps}: {spec: CardSpec; frame: number; fps: number}) => {
  const enter = springIn(frame, fps, spec.delay);
  const float = Math.sin((frame + spec.delay * 2) / 27) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: spec.x,
        top: spec.y,
        width: spec.width,
        minHeight: 208,
        padding: "26px 28px",
        boxSizing: "border-box",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.13)",
        background: "linear-gradient(145deg, rgba(33,36,29,0.98), rgba(16,18,14,0.98))",
        boxShadow: `0 32px 70px rgba(0,0,0,0.46), inset 0 1px 0 ${spec.accent}22`,
        opacity: enter,
        transform: [
          `translate3d(${interpolate(enter, [0, 1], [spec.fromX, 0])}px, ${
            interpolate(enter, [0, 1], [spec.fromY, 0]) + float
          }px, 0)`,
          `rotate(${interpolate(enter, [0, 1], [spec.rotate * 1.7, spec.rotate])}deg)`,
          `rotateY(${interpolate(enter, [0, 1], [spec.fromX > 0 ? -8 : 8, 0])}deg)`,
          `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        ].join(" "),
        transformOrigin: "center",
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", gap: 18}}>
        <div>
          <div style={{fontSize: 32, color: spec.accent, fontWeight: 800, letterSpacing: 2}}>{spec.label}</div>
          <div style={{fontSize: 38, fontWeight: 750, lineHeight: 1.18, marginTop: 10}}>{spec.title}</div>
        </div>
        {spec.icon}
      </div>
      <div style={{display: "flex", alignItems: "baseline", gap: 10, marginTop: 22}}>
        <span style={{fontSize: 50, lineHeight: 1, fontWeight: 900}}>{spec.metric}</span>
        <span style={{fontSize: 32, color: PALETTE.muted}}>实测提升</span>
      </div>
    </div>
  );
};

const ConnectorLayer = ({frame}: {frame: number}) => {
  const draw = progress(frame, 76, 32);
  const paths = [
    "M960 540 C960 430 960 350 960 280",
    "M960 540 C780 520 660 438 535 366",
    "M960 540 C1140 500 1260 432 1387 366",
    "M960 540 C790 590 680 696 560 770",
    "M960 540 C1134 594 1254 690 1380 770",
  ];

  return (
    <svg style={{position: "absolute", inset: 0}} width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
      {paths.map((path, index) => (
        <path
          key={path}
          d={path}
          pathLength={1}
          fill="none"
          stroke={index === 0 ? `${PALETTE.acid}b8` : "#d9ff4366"}
          strokeWidth={index === 0 ? 3 : 2}
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />
      ))}
    </svg>
  );
};

export const CaseCardConstellation = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = interpolate(frame, [0, 128], [1.06, 1], CLAMP);
  const roll = interpolate(frame, [0, 128], [-0.35, 0.12], CLAMP);
  const hub = springIn(frame, fps, 94);
  const cards: CardSpec[] = [
    {
      x: 760,
      y: 78,
      width: 400,
      delay: 10,
      rotate: -1.8,
      fromX: 0,
      fromY: -180,
      label: "案例 01",
      title: "内容检索",
      metric: "+68%",
      accent: PALETTE.acid,
      icon: <MiniChart color={PALETTE.acid} />,
    },
    {
      x: 178,
      y: 302,
      width: 420,
      delay: 24,
      rotate: -5.2,
      fromX: -260,
      fromY: -8,
      label: "案例 02",
      title: "客服分流",
      metric: "2.4×",
      accent: PALETTE.warm,
      icon: <MiniBars color={PALETTE.warm} />,
    },
    {
      x: 1322,
      y: 300,
      width: 420,
      delay: 33,
      rotate: 4.6,
      fromX: 260,
      fromY: -8,
      label: "案例 03",
      title: "数据洞察",
      metric: "-41%",
      accent: "#7ee7ff",
      icon: <MiniChart color="#7ee7ff" />,
    },
    {
      x: 244,
      y: 728,
      width: 420,
      delay: 44,
      rotate: 3.4,
      fromX: -200,
      fromY: 150,
      label: "案例 04",
      title: "销售跟进",
      metric: "+53%",
      accent: "#ff9e7a",
      icon: <MiniBars color="#ff9e7a" />,
    },
    {
      x: 1256,
      y: 724,
      width: 420,
      delay: 53,
      rotate: -3.1,
      fromX: 200,
      fromY: 150,
      label: "案例 05",
      title: "知识沉淀",
      metric: "7 天",
      accent: "#b6a6ff",
      icon: <MiniChart color="#b6a6ff" />,
    },
  ];

  return (
    <PilotBackground>
      <AbsoluteFill
        style={{
          transform: `scale(${camera}) rotate(${roll}deg)`,
          transformOrigin: "center",
        }}
      >
        <ConnectorLayer frame={frame} />
        {cards.map((spec) => (
          <CaseCard key={spec.label} spec={spec} frame={frame} fps={fps} />
        ))}
        <div
          style={{
            position: "absolute",
            left: 764,
            top: 394,
            width: 392,
            height: 292,
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "radial-gradient(circle at 48% 38%, #292d21, #0d0f0b 72%)",
            border: `2px solid ${PALETTE.acid}aa`,
            boxShadow: `0 0 0 12px ${PALETTE.acid}0d, 0 30px 90px rgba(0,0,0,0.62)`,
            opacity: hub,
            transform: `scale(${interpolate(hub, [0, 1], [0.72, 1])}) translateY(${interpolate(
              hub,
              [0, 1],
              [20, 0],
            )}px)`,
          }}
        >
          <div style={{fontSize: 32, color: PALETTE.acid, fontWeight: 800, letterSpacing: 5}}>ONE SYSTEM</div>
          <div style={{fontSize: 64, fontWeight: 900, lineHeight: 1.08, marginTop: 13}}>五种场景<br />一套方法</div>
        </div>
      </AbsoluteFill>
      <CornerFrame />
    </PilotBackground>
  );
};

const PromptFrame = ({frame}: {frame: number}) => {
  const border = interpolate(frame, [4, 31], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const reveal = interpolate(frame, [17, 47], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const promptExit = interpolate(frame, [58, 72], [1, 0], CLAMP);
  const camera = interpolate(frame, [0, 58], [1.12, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity: promptExit,
        transform: `scale(${camera})`,
        transformOrigin: "center",
      }}
    >
      <svg style={{position: "absolute", inset: 0}} width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        <rect
          x="350"
          y="322"
          width="1220"
          height="436"
          rx="42"
          pathLength={1}
          fill="rgba(15,21,16,0.84)"
          stroke={PALETTE.acid}
          strokeWidth="3"
          strokeDasharray="1"
          strokeDashoffset={1 - border}
        />
      </svg>
      <div style={{position: "absolute", left: 418, top: 388, width: 1084, overflow: "hidden"}}>
        <div
          style={{
            width: `${reveal * 100}%`,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{fontSize: 32, color: PALETTE.acid, fontWeight: 800, letterSpacing: 6}}>PROMPT / 需求输入</div>
          <div style={{fontSize: 64, lineHeight: 1.35, fontWeight: 760, marginTop: 35}}>
            比较两种方案的
            <span style={{color: PALETTE.acid}}>信息密度</span>与
            <span style={{color: PALETTE.acid}}>决策速度</span>
          </div>
          <div style={{fontSize: 34, color: PALETTE.muted, marginTop: 32}}>输出：结论清晰、证据可核对、适合口播展示</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 418,
          bottom: 372,
          width: interpolate(frame, [32, 53], [0, 1040], CLAMP),
          height: 3,
          background: `linear-gradient(90deg, ${PALETTE.acid}, transparent)`,
          boxShadow: `0 0 22px ${PALETTE.acid}99`,
        }}
      />
    </AbsoluteFill>
  );
};

const Arrow = ({positive}: {positive: boolean}) => (
  <span style={{color: positive ? PALETTE.acid : PALETTE.red, fontWeight: 900}}>{positive ? "↗" : "↘"}</span>
);

type ComparisonRowProps = {
  frame: number;
  fps: number;
  delay: number;
  label: string;
  left: string;
  right: string;
  positive?: boolean;
};

const ComparisonRow = ({frame, fps, delay, label, left, right, positive = true}: ComparisonRowProps) => {
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 150, mass: 0.72},
    durationInFrames: 28,
  });
  const rowStyle: CSSProperties = {
    height: 116,
    display: "grid",
    gridTemplateColumns: "260px 1fr 1fr",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.11)",
    opacity: enter,
    transform: `translateY(${interpolate(enter, [0, 1], [32, 0])}px)`,
  };

  return (
    <div style={rowStyle}>
      <div style={{fontSize: 34, color: PALETTE.muted, fontWeight: 650}}>{label}</div>
      <div style={{fontSize: 44, fontWeight: 750}}>{left}</div>
      <div style={{fontSize: 44, fontWeight: 850, color: PALETTE.ink}}>
        <Arrow positive={positive} /> {right}
      </div>
    </div>
  );
};

const ComparisonFrame = ({frame}: {frame: number}) => {
  const {fps} = useVideoConfig();
  const cut = interpolate(frame, [60, 75], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const heading = springIn(frame, fps, 68);
  const camera = interpolate(frame, [70, 149], [1, 1.03], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity: cut,
        transform: `scale(${camera})`,
        transformOrigin: "center",
      }}
    >
      <div style={{position: "absolute", left: 150, top: 112, width: 1620}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            opacity: heading,
            transform: `translateY(${interpolate(heading, [0, 1], [28, 0])}px)`,
          }}
        >
          <div>
            <div style={{fontSize: 32, color: PALETTE.acid, letterSpacing: 6, fontWeight: 800}}>COMPARISON / 对照结果</div>
            <div style={{fontSize: 66, fontWeight: 900, marginTop: 12}}>信息不只是更多，而是更快被理解</div>
          </div>
          <div style={{fontSize: 32, color: PALETTE.muted}}>同一主题 · 同一时长</div>
        </div>

        <div
          style={{
            marginTop: 56,
            borderRadius: 32,
            border: "1px solid rgba(255,255,255,0.13)",
            overflow: "hidden",
            background: "rgba(17,20,15,0.92)",
            boxShadow: "0 34px 110px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr 1fr",
              height: 122,
              alignItems: "center",
              padding: "0 48px",
              background: "rgba(255,255,255,0.035)",
              opacity: heading,
            }}
          >
            <div style={{fontSize: 32, color: PALETTE.muted}}>评价维度</div>
            <div style={{fontSize: 44, fontStyle: "italic", fontWeight: 650}}>普通信息页</div>
            <div style={{fontSize: 44, fontStyle: "italic", fontWeight: 850, color: PALETTE.acid}}>叙事信息页</div>
          </div>
          <div style={{padding: "0 48px"}}>
            <ComparisonRow frame={frame} fps={fps} delay={78} label="结论出现" left="第 8 秒" right="第 2 秒" />
            <ComparisonRow frame={frame} fps={fps} delay={84} label="有效层级" left="3 层" right="5 层" />
            <ComparisonRow frame={frame} fps={fps} delay={90} label="理解成本" left="高" right="降低 46%" positive={false} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PromptToComparison = () => {
  const frame = useCurrentFrame();
  const sweep = progress(frame, 56, 17);

  return (
    <PilotBackground accent="#67db83">
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(118deg, transparent 18%, rgba(103,219,131,0.045) 18%, rgba(103,219,131,0.045) 30%, transparent 30%, transparent 58%, rgba(217,255,67,0.035) 58%, rgba(217,255,67,0.035) 70%, transparent 70%)",
          fontFamily: FONT_SANS,
        }}
      >
        <PromptFrame frame={frame} />
        <ComparisonFrame frame={frame} />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: interpolate(sweep, [0, 1], [-260, 1940]),
            width: 210,
            opacity: interpolate(sweep, [0, 0.2, 0.82, 1], [0, 0.9, 0.9, 0]),
            background: `linear-gradient(90deg, transparent, ${PALETTE.acid}28, transparent)`,
            transform: "skewX(-10deg)",
            filter: "blur(4px)",
          }}
        />
      </AbsoluteFill>
      <CornerFrame />
    </PilotBackground>
  );
};
