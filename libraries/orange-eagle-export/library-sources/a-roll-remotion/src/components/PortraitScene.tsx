import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {PhotoReplicaProps} from "../config";

type PortraitLayerProps = Pick<
  PhotoReplicaProps,
  | "portraitSrc"
  | "backgroundScale"
  | "backgroundPositionX"
  | "backgroundPositionY"
  | "portraitScale"
  | "portraitOffsetX"
  | "portraitOffsetY"
  | "breathingAmount"
  | "floatingAmount"
  | "cameraPushAmount"
  | "backgroundBrightness"
  | "backgroundContrast"
> & {
  layer: "background" | "foreground";
};

const portraitMask =
  "radial-gradient(ellipse 28% 70% at 50% 52%, #000 66%, rgba(0,0,0,.92) 78%, transparent 100%)";

export const PortraitScene = ({
  layer,
  portraitSrc,
  backgroundScale,
  backgroundPositionX,
  backgroundPositionY,
  portraitScale,
  portraitOffsetX,
  portraitOffsetY,
  breathingAmount,
  floatingAmount,
  cameraPushAmount,
  backgroundBrightness,
  backgroundContrast,
}: PortraitLayerProps) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const phase = (frame / 90) * Math.PI * 2;
  const cameraPush = interpolate(
    frame,
    [0, durationInFrames - 1],
    [0, cameraPushAmount],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const isForeground = layer === "foreground";

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        translate: isForeground
          ? `${portraitOffsetX}px ${portraitOffsetY + Math.sin(phase) * floatingAmount}px`
          : "0 0",
        scale: isForeground
          ? backgroundScale * portraitScale +
            cameraPush * 1.15 +
            Math.sin(phase) * breathingAmount
          : backgroundScale + cameraPush,
        WebkitMaskImage: isForeground ? portraitMask : undefined,
        maskImage: isForeground ? portraitMask : undefined,
      }}
    >
      <Img
        src={staticFile(portraitSrc)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
          filter: `brightness(${backgroundBrightness}) contrast(${backgroundContrast})`,
        }}
      />
    </AbsoluteFill>
  );
};
