import {describe, expect, test} from "vitest";
import {TRANSITION_BACKGROUND_SHOTS} from "./catalog";

const IDS = [
  "transition",
  "abilitypan",
  "abilitychapter",
  "dotmatrix",
  "tornwipe",
  "chaptercard",
  "rk028",
  "rk029",
  "rk036",
  "rk063",
  "rk069",
  "rk080",
  "rk090",
  "rk093",
  "rk131",
  "rc023",
  "rc026",
  "paperlift",
  "documentcascade",
  "pageleafcascade",
] as const;

describe("转场·背景镜头目录", () => {
  test("注册 20 个稳定 ID 且没有重复", () => {
    expect(TRANSITION_BACKGROUND_SHOTS.map((shot) => shot.id)).toEqual(IDS);
    expect(new Set(IDS).size).toBe(20);
  });

  test("全部为不含人物的 B-roll", () => {
    for (const shot of TRANSITION_BACKGROUND_SHOTS) {
      expect(shot.rollType).toBe("B-roll");
      expect(shot.defaultProps.portraitSrc).toBe("");
    }
  });

  test("保持参考输出规格和特殊时长", () => {
    for (const shot of TRANSITION_BACKGROUND_SHOTS) {
      expect(shot).toMatchObject({width: 1920, height: 1080, fps: 30});
    }
    expect(
      Object.fromEntries(
        TRANSITION_BACKGROUND_SHOTS.map((shot) => [
          shot.id,
          shot.durationInFrames,
        ]),
      ),
    ).toMatchObject({
      abilitypan: 189,
      documentcascade: 210,
      pageleafcascade: 93,
      // eslint-disable-next-line @remotion/non-pure-animation -- upstream shot id
      transition: 180,
      dotmatrix: 180,
    });
  });
});
