import {Easing, interpolate} from "remotion";
import type {OpenAIEquityProps} from "./types";

type ValueCardProps = Pick<
  OpenAIEquityProps,
  "dateLabel" | "marketValue" | "currencyUnit" | "valuationStartFrame"
> & {
  frame: number;
};

export const ValueCard = ({
  dateLabel,
  marketValue,
  currencyUnit,
  valuationStartFrame,
  frame,
}: ValueCardProps) => {
  const progress = interpolate(
    frame,
    [valuationStartFrame, valuationStartFrame + 16],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  return (
    <div
      style={{
        width: 610,
        height: 118,
        display: "flex",
        alignItems: "center",
        padding: "18px 26px",
        boxSizing: "border-box",
        background: "rgba(246,246,246,0.98)",
        boxShadow: "0 7px 18px rgba(26,24,26,0.14)",
        opacity: progress,
        translate: `0 ${interpolate(progress, [0, 1], [-24, 0])}px`,
        color: "#4b494b",
      }}
    >
      <div style={{width: 176}}>
        <div style={{fontSize: 17, fontWeight: 700, marginBottom: 4}}>
          ◉ OpenAI
        </div>
        <div style={{fontSize: 13, color: "#8b898b", marginBottom: 4}}>
          {dateLabel}
        </div>
        <div style={{fontSize: 25, letterSpacing: 2}}>市场估值</div>
      </div>
      <div style={{fontSize: 18, color: "#8b898b", marginRight: 12}}>$</div>
      <div
        style={{
          fontSize: 76,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        {marketValue}
      </div>
      <div style={{fontSize: 27, marginLeft: 10, alignSelf: "flex-end"}}>
        {currencyUnit}
      </div>
    </div>
  );
};
