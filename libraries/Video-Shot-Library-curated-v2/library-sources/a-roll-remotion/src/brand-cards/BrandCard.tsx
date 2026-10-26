import {interpolate} from "remotion";
import {cardEntrance, floatingOffset} from "./timeline";
import type {BrandCardConfig} from "./types";

type BrandCardProps = {
  config: BrandCardConfig;
  frame: number;
  enterStart: number;
  enterEnd: number;
  phase: number;
};

export const BrandCard = ({
  config,
  frame,
  enterStart,
  enterEnd,
  phase,
}: BrandCardProps) => {
  const entrance = cardEntrance(frame, enterStart, enterEnd);
  const floatY =
    entrance === 1 ? floatingOffset(frame, config.floatAmplitude, phase) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: config.x,
        top: config.y,
        width: config.width,
        height: config.height,
        opacity: entrance,
        scale: interpolate(entrance, [0, 1], [0.72, 1]),
        translate: `${interpolate(
          entrance,
          [0, 1],
          [config.enterFromX, 0],
        )}px ${interpolate(
          entrance,
          [0, 1],
          [config.enterFromY, floatY],
        )}px`,
        rotate: `${interpolate(
          entrance,
          [0, 1],
          [config.enterFromX < 0 ? -4 : 4, 0],
        )}deg`,
        filter: `blur(${interpolate(entrance, [0, 1], [9, 0])}px)`,
        border: `2px solid ${config.borderColor}`,
        borderRadius: 22,
        overflow: "hidden",
        boxShadow:
          "0 24px 54px rgba(20,24,24,.22), inset 0 1px 0 rgba(255,255,255,.88)",
        background: config.panelColor,
      }}
    >
      <div
        style={{
          height: "72%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          color: config.textColor,
          background:
            "linear-gradient(145deg, rgba(255,255,255,.96), rgba(243,244,241,.84))",
          boxShadow:
            "inset 0 0 34px rgba(255,255,255,.8), 0 8px 18px rgba(28,32,31,.13)",
        }}
      >
        <span
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: config.markText.length > 2 ? 48 : 58,
            fontWeight: 750,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {config.markText}
        </span>
        {config.brandName ? (
          <span
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 34,
              fontWeight: 650,
              letterSpacing: -1.4,
            }}
          >
            {config.brandName}
          </span>
        ) : null}
      </div>
      <div
        style={{
          height: "28%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.textColor,
          background: config.labelColor,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 24,
          fontWeight: 520,
          letterSpacing: 4.5,
        }}
      >
        {config.label}
      </div>
    </div>
  );
};
