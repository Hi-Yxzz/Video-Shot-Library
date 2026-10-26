import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill} from "remotion";

type CameraLayerProps = {
  children: ReactNode;
  scale: number;
  panX: number;
  panY: number;
  rollDegrees: number;
  transformOrigin: string;
  style?: CSSProperties;
};

export const CameraLayer = ({
  children,
  scale,
  panX,
  panY,
  rollDegrees,
  transformOrigin,
  style,
}: CameraLayerProps) => (
  <AbsoluteFill
    style={{
      scale,
      translate: `${panX}px ${panY}px`,
      rotate: `${rollDegrees}deg`,
      transformOrigin,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

type TextureLayerProps = {
  grainColor: string;
  grainOpacity: number;
  grainSize: number;
  vignette: string;
  blendMode: CSSProperties["mixBlendMode"];
};

export const TextureLayer = ({
  grainColor,
  grainOpacity,
  grainSize,
  vignette,
  blendMode,
}: TextureLayerProps) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      backgroundImage: `${vignette}, radial-gradient(${grainColor} 0.65px, transparent 0.8px)`,
      backgroundSize: `100% 100%, ${grainSize}px ${grainSize}px`,
      opacity: grainOpacity,
      mixBlendMode: blendMode,
    }}
  />
);
