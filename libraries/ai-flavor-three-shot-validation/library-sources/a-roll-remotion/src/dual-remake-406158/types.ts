export type RemakeMode = "fast" | "fidelity";

export type DualRemakeSlug =
  | "achievement-medal-collage"
  | "talent-relationship-outcomes"
  | "staged-training-question"
  | "feedback-loop-desktop"
  | "biography-timeline"
  | "forked-road-decision";

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

export type FiveQaFrames = readonly [
  number,
  number,
  number,
  number,
  number,
];

export type NormalizedAnchor = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type ShotPalette = {
  readonly background: string;
  readonly surface: string;
  readonly text: string;
  readonly accent: string;
  readonly secondaryAccent: string;
  readonly muted: string;
  readonly border: string;
};

export type GenericCopy = {
  readonly kicker: string;
  readonly headline: string;
  readonly body: readonly string[];
  readonly labels: readonly string[];
};

export type CameraBeat = {
  readonly outputFrame: number;
  readonly scale: number;
  readonly panX: number;
  readonly panY: number;
  readonly rollDegrees: number;
  readonly transformOrigin: string;
};

export type ArollSelection = {
  readonly src: `dual-remake-406158/${string}.mp4`;
  readonly fromFrame: number;
  readonly durationInFrames: number;
  readonly trimBeforeFrames: number;
  readonly trimAfterFrames: number;
  readonly crop: {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
  };
  readonly grade: {
    readonly brightness: number;
    readonly contrast: number;
    readonly saturation: number;
    readonly sepia: number;
  };
  readonly blurPx: number;
  readonly opacity: number;
  readonly scale: number;
  readonly translateX: number;
  readonly translateY: number;
  readonly objectPosition: string;
};

export type PairModeContract = {
  readonly aroll?: ArollSelection;
};

export type DualRemakePair = {
  readonly pairId: `0${1 | 2 | 3 | 4 | 5 | 6}`;
  readonly slug: DualRemakeSlug;
  readonly compositionBaseId: `406158${string}`;
  readonly fps: 30;
  readonly durationInFrames: number;
  readonly referenceInterval: {
    readonly startSeconds: number;
    readonly endSeconds: number;
  };
  readonly qaFrames: FiveQaFrames;
  readonly referenceCheckpoints: FiveReferenceCheckpoints;
  readonly copy: GenericCopy;
  readonly cameraBeats: readonly CameraBeat[];
  readonly palette: ShotPalette;
  readonly anchors: Readonly<Record<string, NormalizedAnchor>>;
  readonly fast: PairModeContract;
  readonly fidelity: PairModeContract;
};

export type CameraState = Omit<CameraBeat, "outputFrame">;
