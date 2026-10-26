import {describe, expect, test} from "vitest";
import {AROLL_REFERENCE_LAYOUT} from "./ArollOverlayScene";

describe("A-roll 012–016 reference typography layout", () => {
  test("matches the measured reference anchors and type sizes", () => {
    expect(AROLL_REFERENCE_LAYOUT.milestone).toMatchObject({
      eyebrow: {x: 70, y: 72, fontSize: 26},
      primary: {x: 70, y: 210, fontSize: 250},
      secondary: {x: 90, y: 690, fontSize: 88},
      card: {x: 1290, y: 100, width: 600, height: 440},
    });
    expect(AROLL_REFERENCE_LAYOUT.levels).toMatchObject({
      eyebrow: {x: 88, y: 72, fontSize: 26},
      title: {x: 70, y: 235, fontSize: 78},
      cards: {x: 70, y: 540, height: 230, gap: 20},
      cardHeadingSize: 44,
      cardLabelSize: 30,
      cardValueSize: 42,
    });
    expect(AROLL_REFERENCE_LAYOUT.growth).toMatchObject({
      eyebrow: {x: 88, y: 72, fontSize: 26},
      title: {x: 70, y: 241, fontSize: 100},
      english: {x: 70, y: 360, fontSize: 44},
      chart: {x: 70, y: 595, height: 175},
      monthly: {x: 586, y: 729, fontSize: 28},
    });
    expect(AROLL_REFERENCE_LAYOUT.knowledge).toMatchObject({
      eyebrow: {x: 88, y: 72, fontSize: 26},
      title: {x: 70, y: 240, fontSize: 90},
      english: {x: 70, y: 348, fontSize: 39},
      card: {x: 1290, y: 100, width: 550, height: 593},
      ticker: {x: 70, y: 610, width: 1100, height: 114},
    });
    expect(AROLL_REFERENCE_LAYOUT.headline).toMatchObject({
      eyebrow: {x: 88, y: 72, fontSize: 26},
      title: {x: 70, y: 280, fontSize: 108},
      subtitle: {x: 70, y: 420, fontSize: 70},
    });
  });
});
