import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const COMPONENTS = [
  [
    "fast/OpinionTypeFast.tsx",
    "OpinionTypeFast",
    "getOpinionTypeFastState",
    [
      "header",
      "line2",
      "line3",
      "baseline",
      "label1",
      "label2",
      "label3",
      "scan",
      "camera",
      "headlineSpringFrame",
    ],
  ],
  [
    "fidelity/OpinionTypeFidelity.tsx",
    "OpinionTypeFidelity",
    "getOpinionTypeFidelityState",
    [
      "cursor",
      "statement",
      "keyword",
      "suffix",
      "label1",
      "label2",
      "label3",
      "grid",
      "camera",
      "kickerSpringFrame",
    ],
  ],
  [
    "fast/ChatPanelFast.tsx",
    "ChatPanelFast",
    "getChatPanelFastState",
    [
      "panel",
      "header",
      "tags",
      "scan",
      "camera",
      "panelSpringFrame",
      "bubble1SpringFrame",
      "bubble2SpringFrame",
      "bubble3SpringFrame",
    ],
  ],
  [
    "fidelity/ChatPanelFidelity.tsx",
    "ChatPanelFidelity",
    "getChatPanelFidelityState",
    [
      "sliverExit",
      "panel",
      "title",
      "bubble1",
      "bubble2",
      "bubble3",
      "tags",
      "camera",
      "panelSpringFrame",
      "bubble1SpringFrame",
      "bubble2SpringFrame",
      "bubble3SpringFrame",
    ],
  ],
  [
    "fast/HardwareDispatchFast.tsx",
    "HardwareDispatchFast",
    "getHardwareDispatchFastState",
    [
      "grid",
      "title",
      "metrics",
      "nodes",
      "routes",
      "highlight",
      "camera",
      "phaseIndex",
      "tile1SpringFrame",
      "tile2SpringFrame",
      "tile3SpringFrame",
    ],
  ],
  [
    "fidelity/HardwareDispatchFidelity.tsx",
    "HardwareDispatchFidelity",
    "getHardwareDispatchFidelityState",
    [
      "amberCopy",
      "bars",
      "whiteTitle",
      "parameters",
      "nearBar",
      "camera",
      "phaseIndex",
      "bar1SpringFrame",
      "bar2SpringFrame",
    ],
  ],
  [
    "fast/ProfileCarouselFast.tsx",
    "ProfileCarouselFast",
    "getProfileCarouselFastState",
    [
      "deck",
      "details",
      "rail",
      "camera",
      "activeProfileIndex",
      "trackShift",
      "card1SpringFrame",
      "card2SpringFrame",
      "card3SpringFrame",
      "card4SpringFrame",
    ],
  ],
  [
    "fidelity/ProfileCarouselFidelity.tsx",
    "ProfileCarouselFidelity",
    "getProfileCarouselFidelityState",
    [
      "profile1",
      "profile2",
      "profile3",
      "profile4",
      "letters",
      "camera",
      "activeProfileIndex",
      "profile1SpringFrame",
      "profile2SpringFrame",
      "profile3SpringFrame",
      "profile4SpringFrame",
    ],
  ],
  [
    "fidelity/KeywordTypeFidelity.tsx",
    "KeywordTypeFidelity",
    "getKeywordTypeFidelityState",
    ["paper", "headline", "keyword", "underline", "microcopy", "camera"],
  ],
  [
    "fidelity/QuotePanelPushFidelity.tsx",
    "QuotePanelPushFidelity",
    "getQuotePanelPushFidelityState",
    [
      "panel",
      "frame",
      "quote",
      "macroQuote",
      "shadow",
      "camera",
      "panelSpringFrame",
    ],
  ],
  [
    "fidelity/MetalComputeArrayFidelity.tsx",
    "MetalComputeArrayFidelity",
    "getMetalComputeArrayFidelityState",
    [
      "blocks",
      "edgeLight",
      "labels",
      "depth",
      "camera",
      "block1SpringFrame",
      "block2SpringFrame",
      "block3SpringFrame",
    ],
  ],
  [
    "fidelity/EvidenceArticlePushFidelity.tsx",
    "EvidenceArticlePushFidelity",
    "getEvidenceArticlePushFidelityState",
    [
      "headline",
      "blueUnderline",
      "amberUnderline",
      "article",
      "evidenceFocus",
      "camera",
      "articleSpringFrame",
    ],
  ],
  [
    "fidelity/TeamRelationshipGraphFidelity.tsx",
    "TeamRelationshipGraphFidelity",
    "getTeamRelationshipGraphFidelityState",
    [
      "primaryNodes",
      "edges",
      "secondaryNodes",
      "labels",
      "camera",
      "node1SpringFrame",
      "node2SpringFrame",
      "node3SpringFrame",
      "node4SpringFrame",
    ],
  ],
  [
    "fidelity/YearMarketOverlayFidelity.tsx",
    "YearMarketOverlayFidelity",
    "getYearMarketOverlayFidelityState",
    ["video", "year", "market", "foreground", "camera"],
  ],
  [
    "fidelity/QuestionCardSpeakerFidelity.tsx",
    "QuestionCardSpeakerFidelity",
    "getQuestionCardSpeakerFidelityState",
    [
      "video",
      "leftCard",
      "rightCard",
      "copy1",
      "copy2",
      "copy3",
      "parallax",
      "camera",
      "leftCardSpringFrame",
      "rightCardSpringFrame",
    ],
  ],
  [
    "fidelity/MonochromeQuotePortraitFidelity.tsx",
    "MonochromeQuotePortraitFidelity",
    "getMonochromeQuotePortraitFidelityState",
    [
      "video",
      "monochrome",
      "grid",
      "giantLetters",
      "quote",
      "marks",
      "camera",
    ],
  ],
] as const;

const readComponent = (relativePath: string) =>
  readFileSync(
    resolve(process.cwd(), "src/reference-003", relativePath),
    "utf8",
  );

describe("reference 003 first-batch components", () => {
  test.each(COMPONENTS)("%s exports %s", (relativePath, exportName) => {
    const source = readComponent(relativePath);
    const componentExports = Array.from(
      source.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g),
      (match) => match[1],
    );

    expect(componentExports).toEqual([exportName]);
  });

  test.each(COMPONENTS)(
    "%s uses deterministic frame-driven motion",
    (relativePath, _exportName, stateFactory, stateFields) => {
      const source = readComponent(relativePath);

      expect(source).toContain("useCurrentFrame()");
      expect(source).toContain('from "../motion"');
      expect(source).toContain(`const state = ${stateFactory}(frame)`);
      for (const field of stateFields) {
        expect(source, `${relativePath} must consume state.${field}`).toContain(
          `state.${field}`,
        );
      }
      expect(source).not.toMatch(/\banimation\s*:/);
      expect(source).not.toMatch(/\btransition\s*:/);
      expect(source).not.toContain("Math.random");
      expect(source).not.toMatch(/\bDate\b/);
      expect(source).not.toMatch(
        /spring\(\{\s*frame:\s*(?:state\.\w+|progress)\s*\*/,
      );
    },
  );

  test("Fidelity chat includes a third delivery dialogue", () => {
    expect(readComponent("fidelity/ChatPanelFidelity.tsx")).toContain(
      "完成复核后，进入交付。",
    );
  });

  test("Fidelity B07 uses two recognizable compute modules", () => {
    const source = readComponent("fidelity/HardwareDispatchFidelity.tsx");

    expect(source).toContain("const ComputeModule");
    expect(source).toContain('label="MODULE A"');
    expect(source).toContain('label="MODULE B"');
    expect(source).toContain("repeating-linear-gradient");
    expect(source).not.toContain("width: 830");
  });

  test("Fast B09 starts centered and moves the whole card track left", () => {
    const source = readComponent("fast/ProfileCarouselFast.tsx");

    expect(source).toContain("left: (1920 - CARD_WIDTH) / 2");
    expect(source).toContain("-state.trackShift");
    expect(source).not.toContain("-state.activeProfileIndex * 452");
  });

  test("spring-driven entrances do not multiply opacity by stage progress", () => {
    const fastOpinion = readComponent("fast/OpinionTypeFast.tsx");
    const fidelityOpinion = readComponent("fidelity/OpinionTypeFidelity.tsx");
    const fastChat = readComponent("fast/ChatPanelFast.tsx");

    expect(fastOpinion).toContain("opacity: first,");
    expect(fastOpinion).not.toContain("first * state.headline");
    expect(fidelityOpinion).toContain("opacity: first,");
    expect(fidelityOpinion).not.toContain("first * state.kicker");
    expect(fastChat).toContain("opacity: enter,");
    expect(fastChat).not.toContain("enter * progress");
  });
});

describe("reference 003 remaining Fidelity behavior", () => {
  test("A02 renders all three copy stages independently", () => {
    const source = readComponent(
      "fidelity/QuestionCardSpeakerFidelity.tsx",
    );

    expect(source).not.toMatch(/Math\.max\(state\.copy1/);
    expect(source).toMatch(/progress=\{state\.copy1\}/);
    expect(source).toMatch(/progress=\{state\.copy2\}/);
    expect(source).toMatch(/progress=\{state\.copy3\}/);
  });

  test("A01 consumes the shared selected clip metadata", () => {
    const source = readComponent("fidelity/YearMarketOverlayFidelity.tsx");

    expect(source).toContain("REFERENCE_003_AROLL_CLIPS.yearMarketOverlay");
    expect(source).toContain("staticFile(clip.src)");
    expect(source).toContain("trimBefore={clip.trimBefore}");
  });
});
