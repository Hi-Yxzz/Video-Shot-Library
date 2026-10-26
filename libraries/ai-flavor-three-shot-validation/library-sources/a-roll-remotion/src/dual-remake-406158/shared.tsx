import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill} from "remotion";
import type {CameraState, NormalizedAnchor} from "./types";

type CameraLayerProps = CameraState & {
  readonly children: ReactNode;
};

export const CameraLayer = ({
  children,
  scale,
  panX,
  panY,
  rollDegrees,
  transformOrigin,
}: CameraLayerProps) => (
  <AbsoluteFill
    style={{
      scale,
      translate: `${panX}px ${panY}px`,
      rotate: `${rollDegrees}deg`,
      transformOrigin,
    }}
  >
    {children}
  </AbsoluteFill>
);

type AnchorLayerProps = {
  readonly anchor: NormalizedAnchor;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
};

export const AnchorLayer = ({anchor, children, style}: AnchorLayerProps) => (
  <div
    style={{
      position: "absolute",
      left: `${anchor.x * 100}%`,
      top: `${anchor.y * 100}%`,
      width: `${anchor.width * 100}%`,
      height: `${anchor.height * 100}%`,
      ...style,
    }}
  >
    {children}
  </div>
);
