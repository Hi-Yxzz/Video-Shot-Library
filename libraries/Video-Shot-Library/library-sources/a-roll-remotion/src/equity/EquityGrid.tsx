import {interpolate} from "remotion";
import {getMicrosoftCellIndexes, type EquityStage} from "./timeline";
import type {OpenAIEquityProps} from "./types";

type EquityGridProps = Pick<
  OpenAIEquityProps,
  | "totalCells"
  | "gridColumns"
  | "microsoftCells"
  | "microsoftStartFrame"
  | "marketColor"
  | "microsoftColor"
  | "neutralColor"
  | "mutedColor"
> & {
  frame: number;
  stage: EquityStage;
  splitProgress: number;
};

const introColor = (
  index: number,
  totalCells: number,
  microsoftColor: string,
  mutedColor: string,
) => {
  const ratio = index / totalCells;
  if (ratio < 0.27) return "#f2b8bb";
  if (ratio < 0.53) return "#94413f";
  if (ratio < 0.8) return microsoftColor;
  return mutedColor;
};

export const EquityGrid = ({
  totalCells,
  gridColumns,
  microsoftCells,
  microsoftStartFrame,
  marketColor,
  microsoftColor,
  neutralColor,
  mutedColor,
  frame,
  stage,
  splitProgress,
}: EquityGridProps) => {
  const microsoftIndexes = getMicrosoftCellIndexes(
    totalCells,
    microsoftCells,
  );
  const microsoftSet = new Set(microsoftIndexes);
  const cellSize = interpolate(splitProgress, [0, 1], [46, 34]);
  const gap = interpolate(splitProgress, [0, 1], [13, 9]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridColumns}, ${cellSize}px)`,
        gap,
      }}
    >
      {Array.from({length: totalCells}, (_, index) => {
        const localMicrosoftIndex = microsoftIndexes.indexOf(index);
        const reveal =
          localMicrosoftIndex === -1
            ? 0
            : interpolate(
                frame,
                [
                  microsoftStartFrame + localMicrosoftIndex * 0.45,
                  microsoftStartFrame + 12 + localMicrosoftIndex * 0.45,
                ],
                [0, 1],
                {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
              );

        let background = introColor(
          index,
          totalCells,
          microsoftColor,
          mutedColor,
        );
        let scale = 1;

        if (stage === "neutral") {
          background = neutralColor;
        } else if (stage === "valuation") {
          background = marketColor;
        } else if (
          stage === "microsoft-transition" ||
          stage === "microsoft"
        ) {
          background = microsoftSet.has(index)
            ? microsoftColor
            : mutedColor;
          scale = microsoftSet.has(index)
            ? interpolate(reveal, [0, 1], [0.76, 1])
            : 1;
        }

        return (
          <div
            key={index}
            style={{
              width: cellSize,
              height: cellSize,
              background,
              opacity:
                stage === "microsoft-transition" && microsoftSet.has(index)
                  ? interpolate(reveal, [0, 1], [0.12, 1])
                  : 1,
              scale,
            }}
          />
        );
      })}
    </div>
  );
};
