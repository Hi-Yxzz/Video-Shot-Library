import {describe, expect, test} from "vitest";
import {TRANSITION_BACKGROUND_MOTION as motion} from "./motion";

describe("转场·背景参考时间轴", () => {
  test("基础品牌转场保留独立阶段", () => {
    expect(motion.transition).toMatchObject({
      titleStart: 8,
      lineEnd: 42,
      titleX: 300,
      titleY: 535,
      titleSize: 86,
      lineX: 867,
      lineWidth: 200,
    });
    expect(motion.abilitypan).toMatchObject({
      dealStart: 20,
      dealStagger: 24,
      exitStart: 160,
    });
    expect(motion.abilitychapter).toMatchObject({
      popStart: 1,
      popEnd: 18,
      splitStart: 21,
      splitEnd: 34,
      secondStart: 30,
      cardWidth: 450,
      cardHeight: 600,
      textStagger: 6,
      finalLeft: 375,
      contentPaddingTop: 150,
      contentPaddingX: 118,
      numberSize: 140,
      cardTitleSize: 68,
    });
    expect(motion.tornwipe).toMatchObject({
      wipeEnd: 20,
      startX: -2200,
      endX: 1920,
      width: 2200,
    });
    expect(motion.chaptercard).toMatchObject({
      lineStart: 10,
      titleStart: 20,
      lineLength: 128,
      lineLeft: 560,
      lineRight: 1353,
      titleTop: 480,
      titleSize: 88,
    });
  });

  test("持续背景使用可循环的 180 帧时间轴", () => {
    for (const id of [
      "dotmatrix",
      "rk028",
      "rk029",
      "rk036",
      "rk063",
      "rk069",
      "rk080",
      "rk090",
      "rk093",
      "rk131",
    ] as const) {
      expect(motion[id].loopFrames).toBe(180);
    }
  });

  test("轨道圆环与 HUD 眼扫描器匹配参考主体边界", () => {
    expect(motion.rk029).toMatchObject({
      left: 510,
      top: 90,
      size: 900,
      labelSize: 60,
    });
    expect(motion.rk036).toMatchObject({
      left: 510,
      top: 280,
      width: 900,
      height: 520,
      labelSize: 60,
    });
  });

  test("结构转场的运动方向与参考一致", () => {
    expect(motion.rc023).toMatchObject({sweepStart: 12, sweepEnd: 150});
    expect(motion.paperlift).toMatchObject({
      liftStart: 18,
      liftEnd: 45,
      revealStart: 32,
      revealY: 320,
      titleBlockHeight: 98,
      titleFontSize: 60,
    });
    expect(motion.documentcascade).toMatchObject({spreadEnd: 34});
    expect(motion.pageleafcascade).toMatchObject({
      pageCount: 9,
      flipStagger: 3.2,
      holdLastPage: true,
      keepTurnedPages: true,
    });
  });
});
