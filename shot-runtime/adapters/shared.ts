import type { ComponentType } from "react";

import type {
  ShotComposition,
  ShotControl,
} from "../types.ts";

export type ShotAdapter = {
  Component: ComponentType<Record<string, unknown>>;
  composition: ShotComposition;
  inputProps: Record<string, unknown>;
  controls: ShotControl[];
  commonMappings: Record<string, string>;
};

export type RawControl = {
  type: "text" | "number" | "color" | "boolean" | "select";
  default?: unknown;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly (string | number)[];
};

const COMMON_CANDIDATES = {
  text: ["text", "title", "label"],
  secondaryText: ["secondaryText", "subtitle", "description"],
  primaryColor: ["color", "primaryColor", "accentColor"],
  secondaryColor: ["secondaryColor", "cursorColor"],
  backgroundColor: ["backgroundColor", "background", "bgColor"],
} as const;

export function controlsFromConfig(
  controls: Readonly<Record<string, RawControl>>,
): ShotControl[] {
  return Object.entries(controls).flatMap<ShotControl>(([key, control]) => {
    const base = {
      key: `custom.${key}`,
      label: control.label ?? key,
    };
    if (control.type === "text" && typeof control.default === "string") {
      return [{ ...base, type: "text" as const, defaultValue: control.default }];
    }
    if (control.type === "color" && typeof control.default === "string") {
      return [{ ...base, type: "color" as const, defaultValue: control.default }];
    }
    if (control.type === "boolean" && typeof control.default === "boolean") {
      return [{
        ...base,
        type: "boolean" as const,
        defaultValue: control.default,
      }];
    }
    if (control.type === "number" && typeof control.default === "number") {
      return [{
        ...base,
        type: "number" as const,
        defaultValue: control.default,
        min: control.min,
        max: control.max,
        step: control.step,
      }];
    }
    if (control.type === "select" && control.default !== undefined) {
      return [{
        ...base,
        type: "select" as const,
        defaultValue: String(control.default),
        options: (control.options ?? []).map(String),
      }];
    }
    return [];
  });
}

export function commonMappingsFromConfig(
  controls: Readonly<Record<string, RawControl>>,
): Record<string, string> {
  const available = new Set(Object.keys(controls));
  return Object.fromEntries(
    Object.entries(COMMON_CANDIDATES).flatMap(([commonKey, candidates]) => {
      const target = candidates.find((candidate) => available.has(candidate));
      return target ? [[commonKey, target]] : [];
    }),
  );
}
