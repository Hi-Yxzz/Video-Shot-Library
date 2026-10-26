import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import type {PromptDocumentProps} from "./types";

export const PromptDocumentSplit = (props: PromptDocumentProps) => {
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
          right: 0,
          top: 0,
          width: props.panelWidth,
          height: 1080,
          opacity: enter,
          translate: `${interpolate(enter, [0, 1], [480, 0])}px 0`,
          padding: "52px 64px",
          boxSizing: "border-box",
          background: props.paperColor,
          color: "#27231d",
          boxShadow: "-25px 0 54px rgba(0,0,0,.2)",
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        <div style={{fontSize: 18, color: "#766f64", marginBottom: 18}}>
          {props.eyebrow}
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1.35,
            marginBottom: 34,
          }}
        >
          {props.title}
        </div>
        {props.sections.map((section, index) => (
          <div key={`${section}-${index}`} style={{marginBottom: 24}}>
            <div style={{fontSize: 21, fontWeight: 700, marginBottom: 10}}>
              {index + 1}. {section}
            </div>
            <div
              style={{
                width: `${86 - (index % 3) * 8}%`,
                height: 7,
                borderRadius: 5,
                background: "#d5cfc4",
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: `${62 + (index % 2) * 12}%`,
                height: 7,
                borderRadius: 5,
                background: "#e2ddd4",
              }}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
