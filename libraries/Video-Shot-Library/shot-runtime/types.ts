import type { ComponentType } from "react";

export type ShotGrade = "S" | "A" | "B" | null;
export type ShotKind = "executable" | "reference";

export type ShotMetadata = {
  title: string;
  summary: string;
  use: string;
  category: string;
  collection: string;
  grade: ShotGrade;
  tags: string[];
};

export type ShotComposition = {
  id: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

type ControlBase = {
  key: string;
  label: string;
  defaultValue: unknown;
};

export type ShotControl =
  | (ControlBase & { type: "text"; defaultValue: string })
  | (ControlBase & {
    type: "number";
    defaultValue: number;
    min?: number;
    max?: number;
    step?: number;
  })
  | (ControlBase & { type: "color"; defaultValue: string })
  | (ControlBase & { type: "boolean"; defaultValue: boolean })
  | (ControlBase & {
    type: "select";
    defaultValue: string;
    options: string[];
  });

export type ShotOverrides = {
  text?: string;
  secondaryText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  durationInFrames?: number;
  custom?: Record<string, unknown>;
};

export type ShotFilter = {
  kind?: ShotKind;
  grade?: Exclude<ShotGrade, null>;
  category?: string;
  tags?: readonly string[];
};

export type ReferenceShotDefinition = {
  kind: "reference";
  id: string;
  metadata: ShotMetadata;
  previewUrl: string | null;
  sourceFiles: string[];
};

export type ExecutableShotDefinition = {
  kind: "executable";
  id: string;
  metadata: ShotMetadata;
  Component: ComponentType<Record<string, unknown>>;
  composition: ShotComposition;
  defaults: ShotOverrides;
  controls: ShotControl[];
  createProps(overrides?: ShotOverrides): Record<string, unknown>;
  createComposition(overrides?: ShotOverrides): ShotComposition;
  sourceFiles: string[];
};

export type ShotDefinition =
  | ExecutableShotDefinition
  | ReferenceShotDefinition;
