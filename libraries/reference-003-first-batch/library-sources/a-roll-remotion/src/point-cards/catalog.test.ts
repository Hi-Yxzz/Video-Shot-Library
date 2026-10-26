import {describe, expect, test} from "vitest";
import {POINT_CARD_SHOTS} from "./catalog";

describe("XCYJ 要点卡片镜头目录", () => {
  test("包含站点标签下的 17 个唯一镜头", () => {
    expect(POINT_CARD_SHOTS).toHaveLength(17);
    expect(new Set(POINT_CARD_SHOTS.map((shot) => shot.id)).size).toBe(17);
  });

  test("只给需要人物图层的镜头标记 A-roll", () => {
    const aRollIds = POINT_CARD_SHOTS.filter(
      (shot) => shot.rollType === "A-roll",
    ).map((shot) => shot.id);

    expect(aRollIds).toEqual([
      "title",
      "list",
      "compare",
      "flankcards",
      "logos",
      "chipcluster",
      "pushstack",
    ]);
  });

  test("保持参考预览的画布、帧率和时长", () => {
    for (const shot of POINT_CARD_SHOTS) {
      expect(shot.width).toBe(1920);
      expect(shot.height).toBe(1080);
      expect(shot.fps).toBe(30);
      expect(shot.durationInFrames).toBe(
        shot.id === "selectiverecombine" ? 452 : 182,
      );
    }
  });

  test("默认文字与参考预览保持一致", () => {
    const byId = new Map(POINT_CARD_SHOTS.map((shot) => [shot.id, shot]));

    expect(byId.get("title")?.items).toEqual([
      "卡片文字示例",
      "卡片文字示例",
      "卡片文字示例",
    ]);
    expect(byId.get("list")?.items).toEqual([
      "这一条文字示例",
      "这一条文字示例",
      "这一条文字示例",
    ]);
    expect(byId.get("compare")?.items).toEqual([
      "左卡文字示例",
      "右卡文字示例",
    ]);
    expect(byId.get("chipcluster")?.headline).toBe("收束大字示例");
    expect(byId.get("questionpush")?.items).toEqual([
      "What should it watch?",
      "How often should it check in?",
      "What's the change it's hunting for?",
      "What should it do the moment that change happens?",
      "When should it stop and come ask you?",
    ]);
  });
});
