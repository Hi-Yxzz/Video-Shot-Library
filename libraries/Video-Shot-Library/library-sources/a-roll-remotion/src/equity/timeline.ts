export type EquityStage =
  | "intro"
  | "split"
  | "neutral"
  | "valuation"
  | "microsoft-transition"
  | "microsoft";

export type EquityTimings = {
  introEndFrame: number;
  splitEndFrame: number;
  valuationStartFrame: number;
  microsoftStartFrame: number;
  microsoftHoldFrame: number;
};

export const getEquityStage = (
  frame: number,
  timings: EquityTimings,
): EquityStage => {
  if (frame <= timings.introEndFrame) {
    return "intro";
  }
  if (frame <= timings.splitEndFrame) {
    return "split";
  }
  if (frame < timings.valuationStartFrame) {
    return "neutral";
  }
  if (frame < timings.microsoftStartFrame) {
    return "valuation";
  }
  if (frame < timings.microsoftHoldFrame) {
    return "microsoft-transition";
  }
  return "microsoft";
};

export const getMicrosoftCellIndexes = (
  totalCells: number,
  microsoftCells: number,
) => {
  const safeTotal = Math.max(0, Math.floor(totalCells));
  const safeCount = Math.max(
    0,
    Math.min(safeTotal, Math.floor(microsoftCells)),
  );

  return Array.from(
    {length: safeCount},
    (_, index) => safeTotal - safeCount + index,
  );
};
