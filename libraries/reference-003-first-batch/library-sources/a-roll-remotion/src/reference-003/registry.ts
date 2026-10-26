import type { ComponentType } from "react";
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

export const REFERENCE_003_COMPONENT_MAP = {
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
} as const satisfies Readonly<Record<string, ComponentType>>;

type Reference003CompositionId = keyof typeof REFERENCE_003_COMPONENT_MAP;

type Reference003RegisteredComposition = Readonly<{
  id: string;
  component: ComponentType;
  width: 1920;
  height: 1080;
  fps: 30;
  durationInFrames: number;
}>;

export const REFERENCE_003_REGISTERED_COMPOSITIONS: readonly Reference003RegisteredComposition[] =
  REFERENCE_003_COMPOSITIONS.map((composition) => {
    const component =
      REFERENCE_003_COMPONENT_MAP[composition.id as Reference003CompositionId];

    if (!component) {
      throw new Error(
        `Missing Reference 003 component for composition ${composition.id}`,
      );
    }

    return {
      id: composition.id,
      component,
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
    };
  });
