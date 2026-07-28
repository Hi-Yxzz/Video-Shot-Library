import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {EquityGrid} from "./EquityGrid";
import {MicrosoftMark} from "./MicrosoftMark";
import {PhotoPresenterPanel} from "./PhotoPresenterPanel";
import {getEquityStage} from "./timeline";
import type {OpenAIEquityProps} from "./types";
import {ValueCard} from "./ValueCard";

export const OpenAIEquitySplit = (props: OpenAIEquityProps) => {
  const frame = useCurrentFrame();
  const timings = {
    introEndFrame: props.introEndFrame,
    splitEndFrame: props.splitEndFrame,
    valuationStartFrame: props.valuationStartFrame,
    microsoftStartFrame: props.microsoftStartFrame,
    microsoftHoldFrame: props.microsoftHoldFrame,
  };
  const stage = getEquityStage(frame, timings);
  const splitProgress = interpolate(
    frame,
    [props.introEndFrame, props.splitEndFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const introOpacity = interpolate(
    frame,
    [props.introEndFrame, props.splitEndFrame + 12],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const microsoftBand = interpolate(
    frame,
    [props.microsoftHoldFrame - 6, props.microsoftHoldFrame + 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "row",
        background: "#f8f7f7",
        color: "#4b494b",
        fontFamily: "Arial, PingFang SC, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          width: interpolate(
            splitProgress,
            [0, 1],
            [1280, props.splitX],
          ),
          height: 720,
          overflow: "hidden",
          background: "#faf9f9",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: interpolate(splitProgress, [0, 1], [50, 18]),
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: introOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 18,
              letterSpacing: 3,
              marginBottom: 8,
            }}
          >
            {props.eyebrow}
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: 4,
            }}
          >
            {props.title}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: interpolate(splitProgress, [0, 1], [160, 188]),
            left: "50%",
            translate: "-50% 0",
          }}
        >
          <EquityGrid
            {...props}
            frame={frame}
            stage={stage}
            splitProgress={splitProgress}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: interpolate(splitProgress, [0, 1], [120, 24]),
            top: interpolate(splitProgress, [0, 1], [390, 360]),
            width: interpolate(splitProgress, [0, 1], [918, 700]),
            height: interpolate(splitProgress, [0, 1], [96, 76]),
            background: "rgba(167,221,239,.52)",
            opacity: interpolate(
              frame,
              [0, props.splitEndFrame + 22, props.valuationStartFrame],
              [1, 1, 0],
              {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
            ),
            display: "flex",
            alignItems: "center",
            paddingLeft: 70,
            boxSizing: "border-box",
          }}
        >
          <span style={{fontSize: 72, fontWeight: 900, color: "#32879b"}}>
            {props.ownershipPercent}
          </span>
          <span style={{fontSize: 25, fontWeight: 700, color: "#32879b"}}>
            %
          </span>
          <div
            style={{
              marginLeft: "auto",
              marginRight: 36,
              padding: 12,
              background: "rgba(255,255,255,.9)",
              boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            }}
          >
            <MicrosoftMark size={15} />
          </div>
        </div>

        <div style={{position: "absolute", top: 34, left: 32}}>
          <ValueCard {...props} frame={frame} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 30,
            right: 8,
            bottom: 166,
            height: 92,
            background: "rgba(172,226,242,.58)",
            opacity: microsoftBand,
            translate: `${interpolate(microsoftBand, [0, 1], [-60, 0])}px 0`,
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            boxSizing: "border-box",
          }}
        >
          <span style={{fontSize: 66, fontWeight: 900, color: "#2f8092"}}>
            {props.microsoftValue}
          </span>
          <span
            style={{
              marginLeft: 6,
              fontSize: 25,
              fontWeight: 700,
              color: "#2f8092",
            }}
          >
            {props.currencyUnit}
          </span>
          <div
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,.9)",
              padding: 14,
              boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            }}
          >
            <MicrosoftMark size={16} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: interpolate(
            splitProgress,
            [0, 1],
            [0, 1280 - props.splitX],
          ),
          height: 720,
          flex: "0 0 auto",
          opacity: splitProgress,
          overflow: "hidden",
        }}
      >
        <PhotoPresenterPanel {...props} frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
