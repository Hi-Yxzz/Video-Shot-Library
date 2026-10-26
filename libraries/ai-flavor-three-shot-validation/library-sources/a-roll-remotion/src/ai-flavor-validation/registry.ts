import type {ComponentType} from "react";
import {AdvancedAmbiguity} from "./AdvancedAmbiguity";
import {AI_FLAVOR_COMPOSITIONS} from "./catalog";
import {PromptFormulaGraph} from "./PromptFormulaGraph";
import {StyleConstellation} from "./StyleConstellation";

const AI_FLAVOR_COMPONENT_MAP = {
  AiFlavorAdvancedAmbiguity: AdvancedAmbiguity,
  AiFlavorStyleConstellation: StyleConstellation,
  AiFlavorPromptFormulaGraph: PromptFormulaGraph,
} as const satisfies Readonly<Record<string, ComponentType>>;

export const AI_FLAVOR_REGISTERED_COMPOSITIONS =
  AI_FLAVOR_COMPOSITIONS.map((composition) => ({
    ...composition,
    component: AI_FLAVOR_COMPONENT_MAP[composition.id],
  }));
