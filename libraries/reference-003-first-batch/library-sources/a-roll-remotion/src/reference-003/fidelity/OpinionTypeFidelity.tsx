import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getOpinionTypeFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MicroLabel = ({
  progress,
  color,
  children,
}: {
  progress: number;
  color: string;
  children: string;
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        color,
        fontFamily: R03_SANS,
        fontSize: 20,
        letterSpacing: 5,
        opacity: progress,
        translate: `0 ${interpolate(progress, [0, 1], [18, 0])}px`,
      }}
    >
      <span style={{ width: 26, height: 2, backgroundColor: color }} />
      {children}
    </div>
  );
};

export const OpinionTypeFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getOpinionTypeFidelityState(frame);
  const first = spring({
    frame: state.kickerSpringFrame,
    fps,
    config: { damping: 22, stiffness: 105, mass: 0.9 },
    durationInFrames: 24,
  });
  const camera = interpolate(state.camera, [0, 1], [1, 1.035], CLAMP);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#111315",
        color: "#f3f0e9",
        fontFamily: R03_SERIF,
      }}
    >
      <AbsoluteFill
        style={{
          scale: camera,
          backgroundImage:
            "radial-gradient(ellipse at 48% 48%, #202326 0%, #151719 55%, #090a0c 100%), radial-gradient(rgba(255,255,255,.1) .6px, transparent .8px)",
          backgroundSize: "auto, 5px 5px",
        }}
      >
        <AbsoluteFill
          style={{
            opacity: state.grid * 0.24,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "182px 182px",
            backgroundPosition: "-36px -20px",
            maskImage:
              "radial-gradient(circle at 52% 54%, black, transparent 58%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 360,
            top: 758,
            width: 5,
            height: 72,
            background: "#e5583d",
            boxShadow:
              "0 0 16px rgba(229,88,61,.65), 0 0 42px rgba(231,176,91,.24)",
            opacity: state.cursor,
          }}
        />

        <div style={{ position: "absolute", left: 294, top: 250, width: 1390 }}>
          <div
            style={{
              marginLeft: 680,
              fontFamily: R03_SANS,
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: 12,
              opacity: first,
              translate: `0 ${interpolate(first, [0, 1], [22, 0])}px`,
            }}
          >
            真正的突破
          </div>

          <div
            style={{
              marginTop: 108,
              display: "flex",
              alignItems: "baseline",
              whiteSpace: "nowrap",
              fontSize: 94,
              fontWeight: 600,
              lineHeight: 1.16,
              letterSpacing: -4,
              filter: `blur(${interpolate(state.statement, [0, 1], [6, 0])}px)`,
              textShadow: "0 0 24px rgba(255,245,230,.18)",
            }}
          >
            <span
              style={{
                opacity: state.statement,
                clipPath: `inset(0 ${(1 - state.statement) * 100}% 0 0)`,
              }}
            >
              往往来自
            </span>
            <span
              style={{
                marginLeft: 28,
                color: "#e34830",
                opacity: state.keyword,
                translate: `0 ${interpolate(state.keyword, [0, 1], [22, 0])}px`,
                textShadow: "0 0 26px rgba(227,72,48,.26)",
              }}
            >
              重新定义
            </span>
            <span
              style={{
                marginLeft: 18,
                opacity: state.suffix,
                clipPath: `inset(0 ${(1 - state.suffix) * 100}% 0 0)`,
              }}
            >
              问题
            </span>
          </div>

          <div
            style={{
              marginTop: 96,
              display: "flex",
              justifyContent: "space-between",
              padding: "0 90px 0 12px",
            }}
          >
            <MicroLabel progress={state.label1} color="#d4a555">
              方法 / METHOD
            </MicroLabel>
            <MicroLabel progress={state.label2} color="#719bc7">
              验证 / VERIFY
            </MicroLabel>
            <MicroLabel progress={state.label3} color="#d4a555">
              结构 / SYSTEM
            </MicroLabel>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 1124,
            top: 326,
            width: 1,
            height: 420,
            background: "rgba(255,255,255,.16)",
            opacity: state.grid,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 776,
            top: 526,
            width: 700,
            height: 1,
            background: "rgba(255,255,255,.13)",
            opacity: state.grid,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
