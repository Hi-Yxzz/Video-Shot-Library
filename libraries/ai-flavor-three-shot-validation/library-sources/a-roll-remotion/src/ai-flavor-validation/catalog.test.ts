import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe, expect, it} from "vitest";
import {AI_FLAVOR_COMPOSITIONS} from "./catalog";
import {AI_FLAVOR_REGISTERED_COMPOSITIONS} from "./registry";

const ASSET_PATHS = [
  "vox/barber.png",
  "vox/customer.png",
  "vox/ai-assistant.png",
  "objects/monitor.png",
  "styles/default-ai.png",
  "styles/swiss.png",
  "styles/glassmorphism.png",
  "styles/neubrutalism.png",
  "styles/aurora.png",
] as const;

describe("AI flavor validation catalog", () => {
  it("registers the three approved previews", () => {
    expect(
      AI_FLAVOR_COMPOSITIONS.map(({id, durationInFrames}) => ({
        id,
        durationInFrames,
      })),
    ).toEqual([
      {id: "AiFlavorAdvancedAmbiguity", durationInFrames: 195},
      {id: "AiFlavorStyleConstellation", durationInFrames: 180},
      {id: "AiFlavorPromptFormulaGraph", durationInFrames: 309},
    ]);

    expect(AI_FLAVOR_COMPOSITIONS[0].outputName).toBe(
      "01-Fidelity-高级到底是什么.mp4",
    );
    expect(JSON.stringify(AI_FLAVOR_COMPOSITIONS)).not.toContain(
      "AiFlavorBarberAmbiguity",
    );
    expect(JSON.stringify(AI_FLAVOR_COMPOSITIONS)).not.toContain(
      "01-Fidelity-模糊指令理发师.mp4",
    );
  });

  it("keeps all outputs 1080p at 30fps with valid QA frames", () => {
    for (const item of AI_FLAVOR_COMPOSITIONS) {
      expect(item).toMatchObject({width: 1920, height: 1080, fps: 30});
      expect(item.qaFrames).toHaveLength(5);
      expect(item.qaFrames).toEqual(
        [...item.qaFrames].sort((left, right) => left - right),
      );
      expect(item.qaFrames[4]).toBeLessThan(item.durationInFrames);
    }
  });

  it("stages every approved visual asset", () => {
    for (const assetPath of ASSET_PATHS) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/ai-flavor-validation", assetPath),
        ),
        assetPath,
      ).toBe(true);
    }
  });

  it("keeps the advanced ambiguity content contract", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/ai-flavor-validation/AdvancedAmbiguity.tsx",
      ),
      "utf8",
    );

    for (const expected of [
      "帮我做一个高级界面",
      "干净克制？",
      "大牌留白？",
      "深色科技？",
      "柔和氛围？",
      "你说的“高级”",
      "到底是哪一种？",
      "“高级”是感觉，不是指令",
      "ai-flavor-validation/vox/ai-assistant.png",
      "ai-flavor-validation/objects/monitor.png",
      "getAdvancedAmbiguityState",
      'whiteSpace: "nowrap"',
    ]) {
      expect(source).toContain(expected);
    }

    for (const forbidden of [
      "理发师",
      "剪帅",
      "什么叫帅",
      "barber.png",
      "customer.png",
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });

  it("keeps the five-style constellation content contract", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/ai-flavor-validation/StyleConstellation.tsx",
      ),
      "utf8",
    );

    for (const expected of [
      "默认 AI 味",
      "Swiss",
      "Glassmorphism",
      "Neubrutalism",
      "Aurora",
      "同一个页面",
      "功能、文案、结构不变，只换风格词",
      "styles/default-ai.png",
      "styles/swiss.png",
      "styles/glassmorphism.png",
      "styles/neubrutalism.png",
      "styles/aurora.png",
      "getConstellationState",
      'whiteSpace: "nowrap"',
    ]) {
      expect(source).toContain(expected);
    }
  });

  it("keeps the prompt formula graph content contract", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/ai-flavor-validation/PromptFormulaGraph.tsx",
      ),
      "utf8",
    );

    for (const expected of [
      "可执行的界面需求",
      "场景",
      "这是干嘛的",
      "结构",
      "页面怎么排",
      "风格",
      "想要什么气质",
      "视觉约束",
      "色彩、圆角、密度",
      "禁止项",
      "明确不要什么",
      "把感觉翻译成规则",
      "getFormulaGraphState",
      "<svg",
    ]) {
      expect(source).toContain(expected);
    }

    for (const forbidden of ["LEAD", "DESIGNER", "ENGINEER"]) {
      expect(source).not.toContain(forbidden);
    }
  });

  it("maps every catalog entry to a React component", () => {
    expect(AI_FLAVOR_REGISTERED_COMPOSITIONS).toHaveLength(3);
    expect(
      AI_FLAVOR_REGISTERED_COMPOSITIONS.map(
        ({id, width, height, fps, durationInFrames, component}) => ({
          id,
          width,
          height,
          fps,
          durationInFrames,
          componentType: typeof component,
        }),
      ),
    ).toEqual(
      AI_FLAVOR_COMPOSITIONS.map(
        ({id, width, height, fps, durationInFrames}) => ({
          id,
          width,
          height,
          fps,
          durationInFrames,
          componentType: "function",
        }),
      ),
    );
  });
});
