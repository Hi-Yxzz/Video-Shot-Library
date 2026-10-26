import {describe, expect, test} from "vitest";
import {POINT_CARD_REFERENCE_LAYOUT} from "./reference-layout";

describe("XCYJ 要点卡片参考几何", () => {
  test("锁定浅底人物卡的参考包围盒", () => {
    expect(POINT_CARD_REFERENCE_LAYOUT.portraitCard).toEqual({
      x: 820,
      y: 92,
      width: 1040,
      height: 900,
      radius: 24,
    });
  });

  test("锁定全屏人物卡片的尺寸和锚点", () => {
    expect(POINT_CARD_REFERENCE_LAYOUT.titleCard).toMatchObject({
      x: 92,
      width: 544,
      height: 100,
      fontSize: 40,
    });
    expect(POINT_CARD_REFERENCE_LAYOUT.compareCard).toMatchObject({
      width: 408,
      height: 150,
      fontSize: 36,
    });
    expect(POINT_CARD_REFERENCE_LAYOUT.flankCard).toMatchObject({
      width: 600,
      height: 156,
      fontSize: 80,
    });
    expect(POINT_CARD_REFERENCE_LAYOUT.logoCard).toMatchObject({
      x: 86,
    });
  });

  test("锁定 B-roll 的关键构图尺寸", () => {
    expect(POINT_CARD_REFERENCE_LAYOUT.questionHero).toMatchObject({
      numberSize: 310,
      labelSize: 122,
      finalLeftWidth: 560,
    });
    expect(POINT_CARD_REFERENCE_LAYOUT.badgePanel).toMatchObject({
      x: 335,
      y: 340,
      width: 1250,
      height: 550,
    });
    expect(POINT_CARD_REFERENCE_LAYOUT.newsTicker).toMatchObject({
      bottom: 76,
      height: 60,
    });
    expect(POINT_CARD_REFERENCE_LAYOUT.wheel).toMatchObject({
      visualNodeCount: 5,
      sectionStarts: [0, 66, 96, 126],
      progressBottom: 70,
    });
  });
});
