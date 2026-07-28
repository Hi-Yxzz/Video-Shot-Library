import {describe, expect, it} from "vitest";
import {openAIEquitySchema} from "./types";

const validProps = {
  durationInFrames: 236,
  portraitSrc: "assets/portrait-landscape.png",
  title: "OpenAI 股权占比",
  eyebrow: "FOCUS ON OPENAI EQUITY",
  dateLabel: "2026.03.31",
  ownershipPercent: 27,
  marketValue: 8520,
  microsoftValue: 2290,
  currencyUnit: "亿",
  totalCells: 100,
  gridColumns: 10,
  microsoftCells: 27,
  splitX: 792,
  introEndFrame: 20,
  splitEndFrame: 35,
  valuationStartFrame: 66,
  microsoftStartFrame: 176,
  microsoftHoldFrame: 206,
  marketColor: "#4d4b4d",
  microsoftColor: "#6f9fd0",
  neutralColor: "#555356",
  mutedColor: "#ececed",
  portraitScale: 1.05,
  portraitPositionX: 50,
  portraitPositionY: 48,
  breathingAmount: 0.008,
  floatingAmount: 3,
  cameraPushAmount: 0.018,
};

describe("openAIEquitySchema", () => {
  it("accepts the default editable shape", () => {
    expect(openAIEquitySchema.safeParse(validProps).success).toBe(true);
  });

  it("rejects ownership cells above the grid size", () => {
    const result = openAIEquitySchema.safeParse({
      ...validProps,
      microsoftCells: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-increasing timeline frames", () => {
    const result = openAIEquitySchema.safeParse({
      ...validProps,
      valuationStartFrame: 30,
    });
    expect(result.success).toBe(false);
  });
});
