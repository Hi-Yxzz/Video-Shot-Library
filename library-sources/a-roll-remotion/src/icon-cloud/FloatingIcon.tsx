import {Easing, interpolate} from "remotion";
import type {FloatingIconConfig} from "./types";

type FloatingIconProps = {
  config: FloatingIconConfig;
  frame: number;
  index: number;
  enterStart: number;
  enterStagger: number;
  enterDuration: number;
  exitStart: number;
  exitEnd: number;
};

export const FloatingIcon = ({
  config,
  frame,
  index,
  enterStart,
  enterStagger,
  enterDuration,
  exitStart,
  exitEnd,
}: FloatingIconProps) => {
  const start = enterStart + index * enterStagger;
  const enter = interpolate(frame, [start, start + enterDuration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [exitStart + index * 2, exitEnd], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const floatY =
    Math.sin((frame / 28) * Math.PI * 2 + config.phase) *
    config.floatAmplitude;

  return (
    <div
      style={{
        position: "absolute",
        left: config.x,
        top: config.y,
        width: config.size,
        height: config.size,
        opacity: enter * exit,
        scale: interpolate(enter, [0, 1], [0.35, 1]),
        translate: `${interpolate(
          enter,
          [0, 1],
          [config.enterOffsetX, 0],
        )}px ${interpolate(
          enter,
          [0, 1],
          [config.enterOffsetY, floatY],
        )}px`,
        rotate: `${config.rotation}deg`,
        borderRadius: config.label ? 18 : "50%",
        background: config.backgroundColor,
        color: config.textColor,
        border: "3px solid rgba(255,255,255,.82)",
        boxShadow:
          "0 13px 28px rgba(16,24,32,.24), inset 0 1px 8px rgba(255,255,255,.38)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <span
        style={{
          fontSize: config.label ? config.size * 0.28 : config.size * 0.45,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: -2,
        }}
      >
        {config.mark}
      </span>
      {config.label ? (
        <span
          style={{
            fontSize: Math.max(10, config.size * 0.12),
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: 0.2,
          }}
        >
          {config.label}
        </span>
      ) : null}
    </div>
  );
};
