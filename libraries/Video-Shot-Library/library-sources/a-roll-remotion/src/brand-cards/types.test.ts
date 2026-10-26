import {describe, expect, it} from "vitest";
import {aiBrandCardSchema} from "./types";

const validProps = {
  durationInFrames: 66,
  portraitSrc: "assets/portrait-landscape.png",
  portraitScale: 1.04,
  portraitPositionX: 50,
  portraitPositionY: 47,
  breathingAmount: 0.006,
  floatingAmount: 2,
  cameraPushAmount: 0.012,
  leftEnterStart: 6,
  leftEnterEnd: 18,
  rightEnterStart: 24,
  rightEnterEnd: 36,
  leftCard: {
    brandName: "OpenAI",
    markText: "◉",
    label: "OPENAI",
    x: 42,
    y: 52,
    width: 320,
    height: 360,
    enterFromX: -150,
    enterFromY: -42,
    panelColor: "#f7f7f4",
    labelColor: "#e8e9de",
    borderColor: "#ffffff",
    textColor: "#161616",
    floatAmplitude: 4,
  },
  rightCard: {
    brandName: "",
    markText: "AI",
    label: "ANTHROPIC",
    x: 924,
    y: 52,
    width: 300,
    height: 360,
    enterFromX: 150,
    enterFromY: -42,
    panelColor: "#f7f7f4",
    labelColor: "#eef0d7",
    borderColor: "#ffffff",
    textColor: "#111111",
    floatAmplitude: 4,
  },
};

describe("aiBrandCardSchema", () => {
  it("accepts a complete editable composition configuration", () => {
    expect(aiBrandCardSchema.safeParse(validProps).success).toBe(true);
  });

  it("rejects reversed entrance windows", () => {
    expect(
      aiBrandCardSchema.safeParse({
        ...validProps,
        leftEnterEnd: validProps.leftEnterStart - 1,
      }).success,
    ).toBe(false);
  });

  it("rejects an entrance that ends outside the composition", () => {
    expect(
      aiBrandCardSchema.safeParse({
        ...validProps,
        rightEnterEnd: validProps.durationInFrames + 1,
      }).success,
    ).toBe(false);
  });
});
