import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import type {ToolComparisonProps} from "./types";

const ToolBadge = ({
  mark,
  label,
  color,
  frame,
  enterStart,
}: {
  mark: string;
  label: string;
  color: string;
  frame: number;
  enterStart: number;
}) => {
  const enter = interpolate(frame, [enterStart, enterStart + 10], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
  <div
    style={{
      marginBottom: 78,
      opacity: enter,
      scale: interpolate(enter, [0, 1], [0.35, 1]),
      translate: `${interpolate(enter, [0, 1], [-110, 0])}px 0`,
    }}
  >
    <div
      style={{
        width: 205,
        height: 205,
        borderRadius: 42,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        color: "#fff",
        fontSize: 100,
        fontWeight: 900,
        border: "4px solid rgba(255,255,255,.7)",
        boxShadow: "0 18px 32px rgba(0,0,0,.34)",
      }}
    >
      {mark}
    </div>
    <div
      style={{
        marginTop: 18,
        color: "#f0efc1",
        fontSize: 58,
        fontWeight: 800,
        fontStyle: "italic",
      }}
    >
      {label}
    </div>
  </div>
  );
};

export const ToolComparisonFrame = (props: ToolComparisonProps) => {
  const frame = useCurrentFrame();
  const transition = interpolate(
    frame,
    [props.transitionStart, props.transitionEnd],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: props.backgroundColor,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{position: "absolute", left: 145, top: 105}}>
        <ToolBadge
          mark="✺"
          label={props.topLabel}
          color="#d96e55"
          frame={frame}
          enterStart={props.transitionStart + 3}
        />
        <ToolBadge
          mark="⌁"
          label={props.bottomLabel}
          color="#5655dc"
          frame={frame}
          enterStart={props.transitionStart + 3 + props.iconStagger}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: interpolate(transition, [0, 1], [0, 760]),
          top: interpolate(transition, [0, 1], [0, 68]),
          width: interpolate(transition, [0, 1], [1920, 1100]),
          height: interpolate(transition, [0, 1], [1080, 944]),
          overflow: "hidden",
          borderRadius: interpolate(transition, [0, 1], [0, 68]),
          border: `${interpolate(
            transition,
            [0, 1],
            [0, 6],
          )}px solid ${props.panelBorderColor}`,
          boxShadow: "0 0 80px rgba(160,140,80,.2)",
        }}
      >
        <PhotoPresenterPanel
          {...props}
          durationInFrames={props.durationInFrames}
          frame={frame}
        />
      </div>
    </AbsoluteFill>
  );
};
