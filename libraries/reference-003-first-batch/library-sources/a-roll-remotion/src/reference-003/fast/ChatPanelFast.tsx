import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS } from "../fonts";
import { getChatPanelFastState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ChatCard = ({
  fps,
  springFrame,
  index,
  accent,
  children,
}: {
  fps: number;
  springFrame: number;
  index: string;
  accent: string;
  children: ReactNode;
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 19, stiffness: 190, mass: 0.62 },
    durationInFrames: 22,
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "94px 1fr 112px",
        alignItems: "center",
        minHeight: 132,
        border: `1px solid ${accent}66`,
        borderLeft: `8px solid ${accent}`,
        background:
          "linear-gradient(100deg, rgba(25,29,26,.98), rgba(15,18,17,.94))",
        boxShadow: "0 24px 60px rgba(0,0,0,.32)",
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [-170, 0])}px 0`,
        scale: interpolate(enter, [0, 1], [0.96, 1]),
      }}
    >
      <div
        style={{
          color: accent,
          fontSize: 22,
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        {index}
      </div>
      <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 1 }}>
        {children}
      </div>
      <div style={{ color: "#727d76", fontSize: 15, letterSpacing: 3 }}>
        READY
      </div>
    </div>
  );
};

export const ChatPanelFast = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getChatPanelFastState(frame);
  const panel = spring({
    frame: state.panelSpringFrame,
    fps,
    config: { damping: 20, stiffness: 140, mass: 0.8 },
    durationInFrames: 28,
  });
  const camera = interpolate(state.camera, [0, 1], [1, 1.025], CLAMP);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#080b0a",
        color: "#f3f5ee",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: camera,
          backgroundImage:
            "linear-gradient(rgba(105,232,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(105,232,255,.045) 1px, transparent 1px), radial-gradient(circle at 50% 42%, rgba(217,255,67,.06), transparent 46%)",
          backgroundSize: "64px 64px, 64px 64px, auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 116,
            top: 84,
            width: 1688,
            height: 900,
            border: "1px solid rgba(217,255,67,.38)",
            background: "rgba(11,14,13,.9)",
            boxShadow: "0 38px 120px rgba(0,0,0,.5)",
            opacity: panel * state.panel,
            scale: `${interpolate(panel, [0, 1], [0.18, 1])} ${interpolate(panel, [0, 1], [0.03, 1])}`,
          }}
        >
          <div
            style={{
              height: 108,
              padding: "0 48px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,.13)",
              opacity: state.header,
            }}
          >
            <div>
              <div
                style={{
                  color: "#d9ff43",
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: 5,
                }}
              >
                COLLAB CONSOLE / 05
              </div>
              <div style={{ marginTop: 8, fontSize: 31, fontWeight: 800 }}>
                项目协作 · 本周计划
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "#69e8ff",
                fontSize: 17,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#69e8ff",
                }}
              />
              SYNCED 03 / 03
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 186,
              display: "grid",
              gap: 28,
            }}
          >
            <ChatCard
              fps={fps}
              springFrame={state.bubble1SpringFrame}
              index="01"
              accent="#d9ff43"
            >
              先确认目标与边界。
            </ChatCard>
            <ChatCard
              fps={fps}
              springFrame={state.bubble2SpringFrame}
              index="02"
              accent="#69e8ff"
            >
              验证关键假设，再进入制作。
            </ChatCard>
            <ChatCard
              fps={fps}
              springFrame={state.bubble3SpringFrame}
              index="03"
              accent="#d9ff43"
            >
              按节点复盘，确保清晰交付。
            </ChatCard>
          </div>

          <div
            style={{
              position: "absolute",
              right: 62,
              bottom: 56,
              display: "flex",
              gap: 10,
              opacity: state.tags,
              translate: `0 ${interpolate(state.tags, [0, 1], [24, 0])}px`,
            }}
          >
            {["计划", "验证", "交付"].map((tag, index) => (
              <div
                key={tag}
                style={{
                  padding: "14px 25px",
                  border: `1px solid ${index === 1 ? "#69e8ff" : "#d9ff43"}`,
                  color: index === 1 ? "#69e8ff" : "#d9ff43",
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: 3,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: interpolate(state.scan, [0, 1], [-240, 1980]),
            width: 140,
            opacity: interpolate(
              state.scan,
              [0, 0.18, 0.8, 1],
              [0, 0.7, 0.7, 0],
            ),
            background:
              "linear-gradient(90deg, transparent, rgba(217,255,67,.17), transparent)",
            rotate: "-10deg",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
