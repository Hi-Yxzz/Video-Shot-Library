import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { REFERENCE_003_COMPOSITIONS } from "./catalog";
import { ChatPanelFast } from "./fast/ChatPanelFast";
import { HardwareDispatchFast } from "./fast/HardwareDispatchFast";
import { OpinionTypeFast } from "./fast/OpinionTypeFast";
import { ProfileCarouselFast } from "./fast/ProfileCarouselFast";
import { ChatPanelFidelity } from "./fidelity/ChatPanelFidelity";
import { EvidenceArticlePushFidelity } from "./fidelity/EvidenceArticlePushFidelity";
import { HardwareDispatchFidelity } from "./fidelity/HardwareDispatchFidelity";
import { KeywordTypeFidelity } from "./fidelity/KeywordTypeFidelity";
import { MetalComputeArrayFidelity } from "./fidelity/MetalComputeArrayFidelity";
import { MonochromeQuotePortraitFidelity } from "./fidelity/MonochromeQuotePortraitFidelity";
import { OpinionTypeFidelity } from "./fidelity/OpinionTypeFidelity";
import { ProfileCarouselFidelity } from "./fidelity/ProfileCarouselFidelity";
import { QuestionCardSpeakerFidelity } from "./fidelity/QuestionCardSpeakerFidelity";
import { QuotePanelPushFidelity } from "./fidelity/QuotePanelPushFidelity";
import { TeamRelationshipGraphFidelity } from "./fidelity/TeamRelationshipGraphFidelity";
import { YearMarketOverlayFidelity } from "./fidelity/YearMarketOverlayFidelity";
import {
  REFERENCE_003_COMPONENT_MAP,
  REFERENCE_003_REGISTERED_COMPOSITIONS,
} from "./registry";

const EXPECTED_COMPONENTS = {
  FastR03OpinionType: OpinionTypeFast,
  FidelityR03OpinionType: OpinionTypeFidelity,
  FastR03ChatPanel: ChatPanelFast,
  FidelityR03ChatPanel: ChatPanelFidelity,
  FastR03HardwareDispatch: HardwareDispatchFast,
  FidelityR03HardwareDispatch: HardwareDispatchFidelity,
  FastR03ProfileCarousel: ProfileCarouselFast,
  FidelityR03ProfileCarousel: ProfileCarouselFidelity,
  FidelityR03KeywordType: KeywordTypeFidelity,
  FidelityR03QuotePanelPush: QuotePanelPushFidelity,
  FidelityR03MetalComputeArray: MetalComputeArrayFidelity,
  FidelityR03EvidenceArticlePush: EvidenceArticlePushFidelity,
  FidelityR03TeamRelationshipGraph: TeamRelationshipGraphFidelity,
  FidelityR03ArollYearMarketOverlay: YearMarketOverlayFidelity,
  FidelityR03ArollQuestionCardSpeaker: QuestionCardSpeakerFidelity,
  FidelityR03ArollMonochromeQuotePortrait: MonochromeQuotePortraitFidelity,
} as const;

describe("reference 003 composition registry", () => {
  test("maps every catalog composition ID to its actual React component", () => {
    const catalogIds = REFERENCE_003_COMPOSITIONS.map(({ id }) => id);
    const componentKeys = Object.keys(REFERENCE_003_COMPONENT_MAP);

    expect(catalogIds).toHaveLength(16);
    expect(new Set(catalogIds).size).toBe(16);
    expect(new Set(componentKeys).size).toBe(16);
    expect(componentKeys.sort()).toEqual([...catalogIds].sort());
    expect(REFERENCE_003_COMPONENT_MAP).toEqual(EXPECTED_COMPONENTS);
    expect(
      Object.values(REFERENCE_003_COMPONENT_MAP).every(
        (component) => typeof component === "function",
      ),
    ).toBe(true);
  });

  test("derives all registered metadata from the catalog", () => {
    expect(REFERENCE_003_REGISTERED_COMPOSITIONS).toHaveLength(16);
    expect(
      REFERENCE_003_REGISTERED_COMPOSITIONS.map(
        ({ id, width, height, fps, durationInFrames }) => ({
          id,
          width,
          height,
          fps,
          durationInFrames,
        }),
      ),
    ).toEqual(
      REFERENCE_003_COMPOSITIONS.map(
        ({ id, width, height, fps, durationInFrames }) => ({
          id,
          width,
          height,
          fps,
          durationInFrames,
        }),
      ),
    );
    expect(
      REFERENCE_003_REGISTERED_COMPOSITIONS.map(
        ({ durationInFrames }) => durationInFrames,
      ),
    ).toEqual([
      96, 96, 162, 162, 210, 210, 267, 267, 144, 224, 295, 172, 309, 111,
      462, 327,
    ]);

    for (const composition of REFERENCE_003_REGISTERED_COMPOSITIONS) {
      expect(composition.component).toBe(
        EXPECTED_COMPONENTS[composition.id as keyof typeof EXPECTED_COMPONENTS],
      );
      expect(composition).toMatchObject({ width: 1920, height: 1080, fps: 30 });
    }
  });

  test("Root imports and maps the registry instead of copying its metadata", () => {
    const rootSource = readFileSync(
      resolve(process.cwd(), "src/Root.tsx"),
      "utf8",
    );

    expect(rootSource).toMatch(
      /import\s+\{\s*REFERENCE_003_REGISTERED_COMPOSITIONS\s*\}\s+from\s+"\.\/reference-003\/registry";/,
    );
    expect(rootSource).toMatch(
      /\{REFERENCE_003_REGISTERED_COMPOSITIONS\.map\(\(composition\) => \(\s*<Composition key=\{composition\.id\} \{\.\.\.composition\} \/>\s*\)\)\}/,
    );

    for (const id of Object.keys(EXPECTED_COMPONENTS)) {
      expect(rootSource).not.toContain(`id="${id}"`);
    }
  });
});
