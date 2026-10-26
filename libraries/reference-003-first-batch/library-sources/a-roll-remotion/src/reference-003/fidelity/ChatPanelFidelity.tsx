import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS } from "../fonts";
import { getChatPanelFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const Avatar = ({ tone }: { tone: "warm" | "cool" }) => (
  <div
    style={{
      position: "relative",
      width: 112,
      height: 112,
      flex: "0 0 auto",
      overflow: "hidden",
      borderRadius: "50%",
      border: "3px solid #22201e",
      background:
        tone === "warm"
          ? "linear-gradient(145deg, #d8c7ae, #f1e9dd)"
          : "linear-gradient(145deg, #b9c7cb, #ebe8df)",
      boxShadow: "-28px 30px 34px rgba(53,47,42,.24)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 36,
        top: 20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: tone === "warm" ? "#735f50" : "#59676a",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 20,
        bottom: -22,
        width: 72,
        height: 72,
        borderRadius: "48% 48% 20% 20%",
        background: tone === "warm" ? "#8b7461" : "#6f8083",
      }}
    />
  </div>
);

const Message = ({
  fps,
  progress,
  springFrame,
  tone,
  children,
}: {
  fps: number;
  progress: number;
  springFrame: number;
  tone: "warm" | "cool";
  children: ReactNode;
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 20, stiffness: 130, mass: 0.78 },
    durationInFrames: 28,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: enter * progress,
        translate: `${interpolate(enter, [0, 1], [-90, 0])}px ${interpolate(enter, [0, 1], [20, 0])}px`,
      }}
    >
      <Avatar tone={tone} />
      <div
        style={{
          minHeight: 88,
          display: "flex",
          alignItems: "center",
          padding: "0 38px",
          borderRadius: "7px 20px 20px 7px",
          background: "linear-gradient(100deg, #272624, #111110)",
          color: "#f7f4ed",
          fontSize: 34,
          fontWeight: 400,
          letterSpacing: 1,
          boxShadow: "-36px 34px 38px rgba(61,54,47,.22)",
          scale: `${interpolate(enter, [0, 1], [0.25, 1])} 1`,
          transformOrigin: "left center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ChatPanelFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getChatPanelFidelityState(frame);
  const open = spring({
    frame: state.panelSpringFrame,
    fps,
    config: { damping: 22, stiffness: 82, mass: 1.05 },
    durationInFrames: 48,
  });
  const camera = interpolate(state.camera, [0, 1], [1, 1.035], CLAMP);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#eeeae2",
        color: "#292826",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: camera,
          backgroundImage:
            "radial-gradient(ellipse at 50% 46%, #fbf9f4 0%, #eeeae2 64%, #d4cfc7 100%), radial-gradient(rgba(83,76,68,.18) .55px, transparent .75px)",
          backgroundSize: "auto, 6px 6px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 906,
            top: 92,
            width: 108,
            height: 10,
            borderRadius: 8,
            background: "#242321",
            boxShadow: "-28px 26px 24px rgba(67,59,52,.3)",
            opacity: 1 - state.sliverExit,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 104,
            top: 88,
            width: 1712,
            height: 884,
            overflow: "hidden",
            border: "3px solid #292826",
            borderRadius: 34,
            background: "rgba(250,248,243,.46)",
            boxShadow: "-44px 42px 58px rgba(69,61,53,.24)",
            opacity: state.panel,
            scale: `${interpolate(open, [0, 1], [0.06, 1])} ${interpolate(open, [0, 1], [0.012, 1])}`,
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 58,
              textAlign: "center",
              color: "#77736e",
              fontSize: 37,
              fontWeight: 400,
              letterSpacing: 5,
              opacity: state.title,
              translate: `0 ${interpolate(state.title, [0, 1], [18, 0])}px`,
            }}
          >
            项目协作 · 本周计划
          </div>

          <div
            style={{
              position: "absolute",
              left: 156,
              top: 210,
              display: "grid",
              gap: 30,
            }}
          >
            <Message
              fps={fps}
              progress={state.bubble1}
              springFrame={state.bubble1SpringFrame}
              tone="warm"
            >
              先确认目标与边界。
            </Message>
            <Message
              fps={fps}
              progress={state.bubble2}
              springFrame={state.bubble2SpringFrame}
              tone="cool"
            >
              验证关键假设，
              <span style={{ color: "#e33e31", marginLeft: 3 }}>
                再进入制作。
              </span>
            </Message>
            <Message
              fps={fps}
              progress={state.bubble3}
              springFrame={state.bubble3SpringFrame}
              tone="warm"
            >
              完成复核后，进入交付。
            </Message>
          </div>

          <div
            style={{
              position: "absolute",
              right: 94,
              bottom: 70,
              display: "flex",
              alignItems: "center",
              opacity: state.tags,
              translate: `${interpolate(state.tags, [0, 1], [54, 0])}px 0`,
            }}
          >
            {["计划", "验证", "交付"].map((tag, index) => (
              <div
                key={tag}
                style={{
                  width: 104,
                  height: 76,
                  marginLeft: index === 0 ? 0 : -12,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 38,
                  background: "#1d1c1a",
                  color: index === 1 ? "#e34835" : "#f2eee7",
                  fontSize: 23,
                  fontWeight: 600,
                  letterSpacing: 2,
                  boxShadow: "-24px 26px 34px rgba(55,48,42,.2)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
