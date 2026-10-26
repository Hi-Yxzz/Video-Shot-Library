import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill} from "remotion";

export const PALETTE = {
  ink: "#f4f1e8",
  muted: "#96988f",
  dim: "#343730",
  panel: "#151712",
  panelRaised: "#1d2018",
  background: "#090b08",
  acid: "#d9ff43",
  acidSoft: "#a9c936",
  warm: "#ffd36a",
  red: "#ff6b4a",
} as const;

export const FONT_SANS =
  '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", Arial, sans-serif';
export const FONT_DISPLAY =
  'Impact, "Arial Narrow", "DIN Condensed", "PingFang SC", sans-serif';

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const fullFrame: CSSProperties = {
  width: 1920,
  height: 1080,
  position: "relative",
  overflow: "hidden",
  color: PALETTE.ink,
  fontFamily: FONT_SANS,
};

export const PilotBackground = ({
  children,
  accent = PALETTE.acid,
}: {
  children?: ReactNode;
  accent?: string;
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: PALETTE.background,
      backgroundImage: [
        `radial-gradient(circle at 50% 38%, ${accent}12 0%, transparent 36%)`,
        "linear-gradient(rgba(255,255,255,0.027) 1px, transparent 1px)",
        "linear-gradient(90deg, rgba(255,255,255,0.027) 1px, transparent 1px)",
        "radial-gradient(circle at center, transparent 42%, rgba(0,0,0,0.72) 100%)",
      ].join(","),
      backgroundSize: "auto, 64px 64px, 64px 64px, auto",
      color: PALETTE.ink,
      fontFamily: FONT_SANS,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.12,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")",
        mixBlendMode: "soft-light",
      }}
    />
    {children}
  </AbsoluteFill>
);

export const Eyebrow = ({children}: {children: ReactNode}) => (
  <div
    style={{
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 8,
      color: PALETTE.acid,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

export const CornerFrame = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 58,
        width: 82,
        height: 82,
        borderLeft: `2px solid ${PALETTE.acid}88`,
        borderTop: `2px solid ${PALETTE.acid}88`,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 58,
        bottom: 58,
        width: 82,
        height: 82,
        borderRight: `2px solid ${PALETTE.acid}88`,
        borderBottom: `2px solid ${PALETTE.acid}88`,
      }}
    />
  </>
);
