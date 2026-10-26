import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS } from "../fonts";
import { getOpinionTypeFastState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ModuleLabel = ({
  progress,
  index,
  label,
  english,
}: {
  progress: number;
  index: string;
  label: string;
  english: string;
}) => {
  const enter = progress;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "58px 1fr",
        alignItems: "center",
        width: 310,
        height: 62,
        border: "1px solid rgba(218,255,66,.42)",
        background: "rgba(16,20,18,.9)",
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [-46, 0])}px 0`,
        clipPath: `inset(0 ${(1 - enter) * 100}% 0 0)`,
      }}
    >
      <div
        style={{
          alignSelf: "stretch",
          display: "grid",
          placeItems: "center",
          background: "#d9ff43",
          color: "#0a0d0b",
          fontSize: 19,
          fontWeight: 800,
        }}
      >
        {index}
      </div>
      <div
        style={{
          paddingLeft: 20,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        {label}{" "}
        <span style={{ color: "#69e8ff", fontSize: 15 }}>{english}</span>
      </div>
    </div>
  );
};

export const OpinionTypeFast = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getOpinionTypeFastState(frame);
  const first = spring({
    frame: state.headlineSpringFrame,
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.65 },
    durationInFrames: 18,
  });
  const camera = interpolate(state.camera, [0, 1], [1, 1.04], CLAMP);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#090c0b",
        color: "#f4f6ee",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(105,232,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(105,232,255,.045) 1px, transparent 1px), radial-gradient(circle at 65% 42%, rgba(217,255,67,.08), transparent 42%)",
          backgroundSize: "72px 72px, 72px 72px, auto",
          scale: camera,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 106,
            right: 106,
            top: 78,
            height: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,.16)",
            opacity: state.header,
          }}
        >
          <div
            style={{
              color: "#d9ff43",
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: 6,
            }}
          >
            OPINION / 003
          </div>
          <div style={{ color: "#7e8983", fontSize: 16, letterSpacing: 4 }}>
            REDEFINE THE FRAME
          </div>
        </div>

        <div style={{ position: "absolute", left: 160, top: 250, width: 1430 }}>
          <div
            style={{
              color: "#d9ff43",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1,
              opacity: first,
              translate: `0 ${interpolate(first, [0, 1], [62, 0])}px`,
            }}
          >
            真正的突破
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 114,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              opacity: state.line2,
              clipPath: `inset(0 ${(1 - state.line2) * 100}% 0 0)`,
            }}
          >
            往往来自
          </div>
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "baseline",
              gap: 26,
              fontSize: 134,
              fontWeight: 800,
              letterSpacing: -8,
              lineHeight: 1,
              opacity: state.line3,
              translate: `${interpolate(state.line3, [0, 1], [120, 0])}px 0`,
            }}
          >
            <span style={{ color: "#69e8ff" }}>重新定义</span>
            <span>问题</span>
          </div>
          <div
            style={{
              marginTop: 42,
              height: 8,
              width: interpolate(state.baseline, [0, 1], [0, 1340]),
              background:
                "linear-gradient(90deg, #d9ff43 0 62%, #69e8ff 62% 76%, #303832 76%)",
              boxShadow: "0 0 28px rgba(217,255,67,.24)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: 118,
            bottom: 92,
            display: "flex",
            gap: 12,
          }}
        >
          <ModuleLabel
            progress={state.label1}
            index="01"
            label="方法"
            english="METHOD"
          />
          <ModuleLabel
            progress={state.label2}
            index="02"
            label="验证"
            english="VERIFY"
          />
          <ModuleLabel
            progress={state.label3}
            index="03"
            label="结构"
            english="SYSTEM"
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            left: interpolate(state.scan, [0, 1], [-300, 1940]),
            width: 180,
            opacity: interpolate(
              state.scan,
              [0, 0.15, 0.8, 1],
              [0, 0.58, 0.58, 0],
            ),
            rotate: "-12deg",
            background:
              "linear-gradient(90deg, transparent, rgba(105,232,255,.16), transparent)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
