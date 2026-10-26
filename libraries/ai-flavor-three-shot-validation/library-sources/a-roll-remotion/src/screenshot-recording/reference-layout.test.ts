import {describe, expect, test} from "vitest";
import {SCREENSHOT_RECORDING_LAYOUT} from "./reference-layout";

describe("截图·录屏参考几何", () => {
  test("A-roll 三种构图保留人物与内容分区", () => {
    expect(SCREENSHOT_RECORDING_LAYOUT.showcase).toMatchObject({
      mediaX: 74,
      mediaY: 168,
      mediaWidth: 1180,
      portraitX: 1320,
    });
    expect(SCREENSHOT_RECORDING_LAYOUT.screenshot).toMatchObject({
      cardX: 84,
      cardY: 270,
      portraitX: 1040,
    });
    expect(SCREENSHOT_RECORDING_LAYOUT.brollstack).toMatchObject({
      stackX: 82,
      portraitX: 780,
    });
  });

  test("RC 结构镜头保留核心内容包围盒", () => {
    expect(SCREENSHOT_RECORDING_LAYOUT.rc012).toMatchObject({
      mainX: 84,
      mainY: 188,
      mainWidth: 900,
      listStep: 150,
    });
    expect(SCREENSHOT_RECORDING_LAYOUT.rc019).toMatchObject({
      shellX: 165,
      shellY: 206,
      shellWidth: 1590,
    });
    expect(SCREENSHOT_RECORDING_LAYOUT.rc025).toMatchObject({
      railY: 510,
      cardWidth: 300,
      travelPerFrame: 18,
    });
  });

  test("共享阶段锚点与参考采样帧一致", () => {
    expect(SCREENSHOT_RECORDING_LAYOUT.stageFrames).toEqual([
      0, 30, 60, 90, 120, 165,
    ]);
    expect(SCREENSHOT_RECORDING_LAYOUT.scrollshot).toMatchObject({
      cardX: 84,
      cardY: 270,
      scrollStart: 26,
      scrollEnd: 160,
      scrollDistance: 760,
      background: "portrait",
    });
    expect(SCREENSHOT_RECORDING_LAYOUT.ring).toMatchObject({
      titleSize: 72,
      frameInset: 26,
      startScale: 1,
      endScale: 1.16,
      zoomEnd: 28,
    });
    expect(SCREENSHOT_RECORDING_LAYOUT.rc018).toMatchObject({
      turnFrames: 42,
      exitX: -1180,
      exitRotateY: -62,
    });
  });
});
