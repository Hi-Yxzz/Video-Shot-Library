import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = resolve(process.cwd(), "src/reference-003");
const FONT_FILE = resolve(ROOT, "fonts.ts");
const COMPONENTS = [
  ["fast/OpinionTypeFast.tsx", ["R03_SANS"]],
  ["fidelity/OpinionTypeFidelity.tsx", ["R03_SANS", "R03_SERIF"]],
  ["fast/ChatPanelFast.tsx", ["R03_SANS"]],
  ["fidelity/ChatPanelFidelity.tsx", ["R03_SANS"]],
] as const;

describe("reference 003 deterministic fonts", () => {
  test("loads explicit Noto SC subsets and required weights", () => {
    expect(existsSync(FONT_FILE)).toBe(true);
    if (!existsSync(FONT_FILE)) return;
    const source = readFileSync(FONT_FILE, "utf8").replace(/\s/g, "");
    expect(source).toContain('from"@remotion/google-fonts/NotoSansSC"');
    expect(source).toContain('from"@remotion/google-fonts/NotoSerifSC"');
    expect(source).toContain('subsets:["chinese-simplified","latin"]');
    expect(source).toContain('weights:["400","600","700","800"]');
    expect(source).toContain('weights:["600"]');
    expect(source).toContain("fontFamily:R03_SANS");
    expect(source).toContain("fontFamily:R03_SERIF");
  });

  test.each(COMPONENTS)(
    "%s uses loaded font constants",
    (relativePath, fonts) => {
      const source = readFileSync(resolve(ROOT, relativePath), "utf8");
      expect(source).toContain('from "../fonts"');
      for (const font of fonts) expect(source).toContain(`fontFamily: ${font}`);
      expect(source).not.toMatch(
        /PingFang|Songti|Microsoft YaHei|Arial|Georgia/,
      );
      const weights = Array.from(
        source.matchAll(/fontWeight:\s*(\d+)/g),
        (match) => Number(match[1]),
      );
      expect(
        weights.every((weight) => [400, 500, 600, 700, 800].includes(weight)),
      ).toBe(true);
    },
  );
});
