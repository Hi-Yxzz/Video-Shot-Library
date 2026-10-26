import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import type {LogoCalloutProps} from "./types";

export const LogoCallout = (props: LogoCalloutProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(
    frame,
    [props.enterStart, props.enterEnd],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#c8cdcf"}}>
      <PhotoPresenterPanel
        {...props}
        durationInFrames={props.durationInFrames}
        frame={frame}
      />
      <div
        style={{
          position: "absolute",
          left: props.x,
          top: props.y,
          width: props.size,
          opacity: enter,
          scale: interpolate(enter, [0, 1], [0.45, 1]),
          translate: `${interpolate(enter, [0, 1], [-130, 0])}px 0`,
          textAlign: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            width: props.size,
            height: props.size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: props.size * 0.22,
            background: props.backgroundColor,
            color: props.accentColor,
            border: "4px solid rgba(255,255,255,.35)",
            boxShadow: "0 24px 50px rgba(0,0,0,.35)",
            fontSize: props.size * 0.48,
            fontWeight: 900,
          }}
        >
          {props.mark}
        </div>
        <div
          style={{
            marginTop: 22,
            color: "#f5f4ce",
            fontSize: props.size * 0.34,
            fontStyle: "italic",
            fontWeight: 800,
            textShadow: "0 5px 12px rgba(0,0,0,.75)",
          }}
        >
          {props.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
