export type AiFlavorComposition = Readonly<{
  id:
    | "AiFlavorAdvancedAmbiguity"
    | "AiFlavorStyleConstellation"
    | "AiFlavorPromptFormulaGraph";
  durationInFrames: number;
  fps: 30;
  width: 1920;
  height: 1080;
  qaFrames: readonly [number, number, number, number, number];
  outputName: string;
}>;

export const AI_FLAVOR_COMPOSITIONS = [
  {
    id: "AiFlavorAdvancedAmbiguity",
    durationInFrames: 195,
    fps: 30,
    width: 1920,
    height: 1080,
    qaFrames: [0, 36, 90, 150, 194],
    outputName: "01-Fidelity-高级到底是什么.mp4",
  },
  {
    id: "AiFlavorStyleConstellation",
    durationInFrames: 180,
    fps: 30,
    width: 1920,
    height: 1080,
    qaFrames: [0, 36, 84, 132, 179],
    outputName: "02-Fidelity-五风格案例星座.mp4",
  },
  {
    id: "AiFlavorPromptFormulaGraph",
    durationInFrames: 309,
    fps: 30,
    width: 1920,
    height: 1080,
    qaFrames: [0, 54, 132, 222, 308],
    outputName: "03-Fidelity-界面需求公式关系图.mp4",
  },
] as const satisfies readonly AiFlavorComposition[];
