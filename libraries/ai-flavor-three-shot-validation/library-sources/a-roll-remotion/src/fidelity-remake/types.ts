export type FidelityShotSlug =
  | "prompt-to-comparison"
  | "case-card-constellation"
  | "metric-card-deal"
  | "ranking-row-highlight"
  | "chat-bubble-ladder"
  | "talking-head-keyword-stickers"
  | "leaderboard-card-push"
  | "orbital-tech-title";

export type CheckpointLabel =
  | "establish"
  | "entrance"
  | "peak"
  | "settle"
  | "exit";

export type ReferenceCheckpoint<
  Label extends CheckpointLabel = CheckpointLabel,
> = {
  readonly label: Label;
  readonly sourceSeconds: number;
  readonly outputFrame: number;
};

export type FiveReferenceCheckpoints = readonly [
  ReferenceCheckpoint<"establish">,
  ReferenceCheckpoint<"entrance">,
  ReferenceCheckpoint<"peak">,
  ReferenceCheckpoint<"settle">,
  ReferenceCheckpoint<"exit">,
];

export type ShotPalette = {
  readonly background: string;
  readonly surface: string;
  readonly text: string;
  readonly accent: string;
  readonly secondaryAccent: string;
  readonly muted: string;
  readonly border: string;
};

export type TypographyObservation = {
  readonly displayFamily: string;
  readonly bodyFamily: string;
  readonly classification: string;
  readonly displayWeight: number;
  readonly bodyWeight: number;
  readonly width: string;
  readonly slantDegrees: number;
  readonly lineHeight: number;
  readonly trackingEm: number;
  readonly numeralStyle: string;
};

export type NormalizedAnchor = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type CameraKeyframe = {
  readonly outputFrame: number;
  readonly scale: number;
  readonly panX: number;
  readonly panY: number;
  readonly rollDegrees: number;
  readonly transformOrigin: string;
};

export type FidelityLayer = {
  readonly id: string;
  readonly zIndex: number;
  readonly occlusionNotes: string;
};

export type ChoreographyStage = {
  readonly id: string;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly easing: string;
  readonly staggerFrames: number;
  readonly overshoot: number;
  readonly settleFrames: number;
  readonly layerIds: readonly string[];
};

export type TextureObservation = {
  readonly description: string;
  readonly grainAmount: number;
  readonly vignetteAmount: number;
  readonly edgeTreatment: string;
};

export type FidelityReferenceSpec = {
  readonly slug: FidelityShotSlug;
  readonly compositionId: `Fidelity${string}`;
  readonly durationInFrames: number;
  readonly checkpoints: FiveReferenceCheckpoints;
  readonly palette: ShotPalette;
  readonly typography: TypographyObservation;
  readonly anchors: Readonly<Record<string, NormalizedAnchor>>;
  readonly cameraKeyframes: readonly CameraKeyframe[];
  readonly layers: readonly FidelityLayer[];
  readonly choreography: readonly ChoreographyStage[];
  readonly parallax: Readonly<Record<string, number>>;
  readonly texture: TextureObservation;
  readonly genericContentNotes: readonly string[];
  readonly qaOutputFrames: readonly [number, number, number, number, number];
};
