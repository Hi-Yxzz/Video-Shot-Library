import {AbsoluteFill, Img, interpolate, staticFile} from "remotion";
import type {OpenAIEquityProps} from "./types";

type PhotoPresenterPanelProps = Pick<
  OpenAIEquityProps,
  | "portraitSrc"
  | "portraitScale"
  | "portraitPositionX"
  | "portraitPositionY"
  | "breathingAmount"
  | "floatingAmount"
  | "cameraPushAmount"
  | "durationInFrames"
> & {
  frame: number;
};

export const PhotoPresenterPanel = ({
  portraitSrc,
  portraitScale,
  portraitPositionX,
  portraitPositionY,
  breathingAmount,
  floatingAmount,
  cameraPushAmount,
  durationInFrames,
  frame,
}: PhotoPresenterPanelProps) => {
  const phase = (frame / 90) * Math.PI * 2;

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#c8cdcf"}}>
      <AbsoluteFill
        style={{
          scale:
            portraitScale +
            interpolate(
              frame,
              [0, durationInFrames - 1],
              [0, cameraPushAmount],
              {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
            ) +
            Math.sin(phase) * breathingAmount,
          translate: `0 ${Math.sin(phase) * floatingAmount}px`,
        }}
      >
        <Img
          src={staticFile(portraitSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${portraitPositionX}% ${portraitPositionY}%`,
            filter: "brightness(0.96) contrast(1.03)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.08), transparent 18%, transparent 80%, rgba(0,0,0,.08))",
        }}
      />
    </AbsoluteFill>
  );
};
