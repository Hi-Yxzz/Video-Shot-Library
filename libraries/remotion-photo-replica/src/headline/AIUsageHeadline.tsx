import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import type {
  AIUsageHeadlineProps,
  HeadlineBlockConfig,
} from "./types";

const HeadlineBlock = ({
  config,
  frame,
  enterStart,
  enterEnd,
  direction,
}: {
  config: HeadlineBlockConfig;
  frame: number;
  enterStart: number;
  enterEnd: number;
  direction: -1 | 1;
}) => {
  const enter = interpolate(frame, [enterStart, enterEnd], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: config.x,
        top: config.y,
        width: config.width,
        opacity: enter,
        translate: `${interpolate(
          enter,
          [0, 1],
          [direction * 110, 0],
        )}px 0`,
        scale: interpolate(enter, [0, 1], [0.88, 1]),
        textAlign: config.align,
        fontFamily:
          '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: config.fontSize,
        fontWeight: 950,
        lineHeight: 1.18,
        letterSpacing: -2,
        color: config.textColor,
        WebkitTextStroke: "1px rgba(20,20,20,.15)",
        textShadow:
          "0 4px 0 rgba(24,24,24,.6), 0 10px 22px rgba(0,0,0,.25)",
      }}
    >
      <div>{config.lineOne}</div>
      <div>
        <span style={{color: config.accentColor}}>AI</span>
        {config.lineTwo.replace(/^AI\s*/, " ")}
      </div>
    </div>
  );
};

export const AIUsageHeadline = (props: AIUsageHeadlineProps) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#c8cdcf"}}>
      <PhotoPresenterPanel
        portraitSrc={props.portraitSrc}
        portraitScale={props.portraitScale}
        portraitPositionX={props.portraitPositionX}
        portraitPositionY={props.portraitPositionY}
        breathingAmount={props.breathingAmount}
        floatingAmount={props.floatingAmount}
        cameraPushAmount={props.cameraPushAmount}
        durationInFrames={props.durationInFrames}
        frame={frame}
      />
      <HeadlineBlock
        config={props.leftHeadline}
        frame={frame}
        enterStart={props.leftEnterStart}
        enterEnd={props.leftEnterEnd}
        direction={-1}
      />
      <HeadlineBlock
        config={props.rightHeadline}
        frame={frame}
        enterStart={props.rightEnterStart}
        enterEnd={props.rightEnterEnd}
        direction={1}
      />
    </AbsoluteFill>
  );
};
