import {describe, expect, it} from "vitest";
import {
  getEquityStage,
  getMicrosoftCellIndexes,
  type EquityTimings,
} from "./timeline";

const timings: EquityTimings = {
  introEndFrame: 20,
  splitEndFrame: 35,
  valuationStartFrame: 66,
  microsoftStartFrame: 176,
  microsoftHoldFrame: 206,
};

describe("getEquityStage", () => {
  it.each([
    [0, "intro"],
    [20, "intro"],
    [21, "split"],
    [35, "split"],
    [36, "neutral"],
    [65, "neutral"],
    [66, "valuation"],
    [175, "valuation"],
    [176, "microsoft-transition"],
    [205, "microsoft-transition"],
    [206, "microsoft"],
    [235, "microsoft"],
  ] as const)("maps frame %i to %s", (frame, expected) => {
    expect(getEquityStage(frame, timings)).toBe(expected);
  });
});

describe("getMicrosoftCellIndexes", () => {
  it("selects the last 27 cells of a 100-cell grid", () => {
    const indexes = getMicrosoftCellIndexes(100, 27);
    expect(indexes).toHaveLength(27);
    expect(indexes[0]).toBe(73);
    expect(indexes[indexes.length - 1]).toBe(99);
  });

  it("clamps invalid ownership counts", () => {
    expect(getMicrosoftCellIndexes(10, 12)).toHaveLength(10);
    expect(getMicrosoftCellIndexes(10, -2)).toEqual([]);
  });
});
