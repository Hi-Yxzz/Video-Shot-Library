import {describe, expect, test} from "vitest";
import {SCREENSHOT_RECORDING_SHOTS} from "./catalog";

const IDS = [
  "showcase",
  "screenshot",
  "shotfull",
  "scrollshot",
  "brollstack",
  "ring",
  "rc012",
  "rc018",
  "rc019",
  "rc025",
];

describe("截图·录屏镜头目录", () => {
  test("删除多图轮播后保留 10 个稳定 ID", () => {
    expect(SCREENSHOT_RECORDING_SHOTS.map((shot) => shot.id)).toEqual(IDS);
    expect(new Set(IDS).size).toBe(10);
  });

  test("截图高亮框和长截图背景使用人物照片后共有五个 A-roll", () => {
    expect(
      SCREENSHOT_RECORDING_SHOTS.filter((shot) => shot.rollType === "A-roll").map(
        (shot) => shot.id,
      ),
    ).toEqual([
      "showcase",
      "screenshot",
      "scrollshot",
      "brollstack",
      "ring",
    ]);
    expect(
      SCREENSHOT_RECORDING_SHOTS.filter((shot) => shot.rollType === "B-roll"),
    ).toHaveLength(5);
  });

  test("统一使用参考输出规格且 A-roll 使用演示人物图", () => {
    for (const shot of SCREENSHOT_RECORDING_SHOTS) {
      expect(shot).toMatchObject({
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: 180,
      });
      if (shot.rollType === "A-roll") {
        expect(shot.defaultProps.portraitSrc).toBe(
          "assets/portrait-landscape.png",
        );
      }
    }
  });
});
