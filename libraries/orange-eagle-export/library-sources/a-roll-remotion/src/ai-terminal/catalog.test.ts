import {describe, expect, test} from "vitest";
import {AI_TERMINAL_SHOTS} from "./catalog";

describe("AI 对话·终端目录", () => {
  test("包含八个唯一镜头", () => {
    expect(AI_TERMINAL_SHOTS.map((shot) => shot.id)).toEqual([
      "code",
      "terminal",
      "contextterminal",
      "aiinput",
      "claudecodeinput",
      "inputpan",
      "rc017",
      "rc021",
    ]);
    expect(new Set(AI_TERMINAL_SHOTS.map((shot) => shot.id)).size).toBe(8);
  });

  test("锁定参考视频参数和可执行 ID", () => {
    for (const shot of AI_TERMINAL_SHOTS) {
      expect(shot.width).toBe(1920);
      expect(shot.height).toBe(1080);
      expect(shot.fps).toBe(30);
      expect(shot.durationInFrames).toBe(182);
      expect(shot.compositionId).toMatch(/^XcyjAiTerminal/);
    }
  });

  test("仅代码分屏使用人物图层", () => {
    expect(
      AI_TERMINAL_SHOTS.filter((shot) => shot.rollType === "A-roll").map(
        (shot) => shot.id,
      ),
    ).toEqual(["code"]);
  });
});

