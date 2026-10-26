# OpenAI Equity Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second editable A-roll Composition that recreates the OpenAI equity infographic and split-screen presenter shot with the existing portrait.

**Architecture:** Pure timeline helpers determine the six animation stages and cell ownership. A Zod-backed prop contract drives reusable infographic components and a dedicated presenter panel. The existing `PhotoReplica` remains unchanged; `Root.tsx` registers the new Composition alongside it.

**Tech Stack:** React, TypeScript, Remotion, Zod, Vitest, FFmpeg/FFprobe

---

### Task 1: Add tested timeline and schema contracts

**Files:**
- Create: `src/equity/timeline.test.ts`
- Create: `src/equity/timeline.ts`
- Create: `src/equity/types.ts`

- [ ] **Step 1: Write failing timeline tests**

Create tests that assert:

```ts
expect(getEquityStage(0, timings)).toBe("intro");
expect(getEquityStage(21, timings)).toBe("split");
expect(getEquityStage(36, timings)).toBe("neutral");
expect(getEquityStage(66, timings)).toBe("valuation");
expect(getEquityStage(176, timings)).toBe("microsoft-transition");
expect(getEquityStage(206, timings)).toBe("microsoft");
expect(getMicrosoftCellIndexes(100, 27)).toHaveLength(27);
expect(getMicrosoftCellIndexes(100, 27)[0]).toBe(73);
```

Use timings `{introEndFrame: 20, splitEndFrame: 35, valuationStartFrame: 66, microsoftStartFrame: 176, microsoftHoldFrame: 206}`.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/equity/timeline.test.ts
```

Expected: FAIL because `timeline.ts` does not exist.

- [ ] **Step 3: Implement the pure helpers**

`timeline.ts` exports:

```ts
export type EquityStage =
  | "intro"
  | "split"
  | "neutral"
  | "valuation"
  | "microsoft-transition"
  | "microsoft";

export type EquityTimings = {
  introEndFrame: number;
  splitEndFrame: number;
  valuationStartFrame: number;
  microsoftStartFrame: number;
  microsoftHoldFrame: number;
};

export const getEquityStage = (frame: number, timings: EquityTimings): EquityStage => {
  if (frame <= timings.introEndFrame) return "intro";
  if (frame <= timings.splitEndFrame) return "split";
  if (frame < timings.valuationStartFrame) return "neutral";
  if (frame < timings.microsoftStartFrame) return "valuation";
  if (frame < timings.microsoftHoldFrame) return "microsoft-transition";
  return "microsoft";
};

export const getMicrosoftCellIndexes = (totalCells: number, microsoftCells: number) => {
  const safeCount = Math.max(0, Math.min(totalCells, microsoftCells));
  return Array.from({length: safeCount}, (_, index) => totalCells - safeCount + index);
};
```

- [ ] **Step 4: Add the Zod prop contract**

`types.ts` defines `openAIEquitySchema` and `OpenAIEquityProps`. The schema includes every prop listed in the design and uses `superRefine()` to reject:

```ts
if (value.microsoftCells > value.totalCells) {
  ctx.addIssue({code: "custom", path: ["microsoftCells"], message: "microsoftCells must not exceed totalCells"});
}

const ordered = [
  value.introEndFrame,
  value.splitEndFrame,
  value.valuationStartFrame,
  value.microsoftStartFrame,
  value.microsoftHoldFrame,
  value.durationInFrames,
];
if (ordered.some((current, index) => index > 0 && current <= ordered[index - 1])) {
  ctx.addIssue({code: "custom", path: ["durationInFrames"], message: "timeline frames must be strictly increasing"});
}
```

- [ ] **Step 5: Verify GREEN**

Run:

```bash
npm test -- src/equity/timeline.test.ts
npm run typecheck
```

Expected: timeline tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/equity
git commit -m "feat: define equity split timeline"
```

### Task 2: Build the infographic and presenter components

**Files:**
- Create: `src/equity/EquityGrid.tsx`
- Create: `src/equity/ValueCard.tsx`
- Create: `src/equity/MicrosoftMark.tsx`
- Create: `src/equity/PhotoPresenterPanel.tsx`
- Create: `src/equity/OpenAIEquitySplit.tsx`

- [ ] **Step 1: Verify the Composition is absent**

Run:

```bash
npx remotion compositions | rg OpenAIEquitySplit
```

Expected: no match.

- [ ] **Step 2: Implement `MicrosoftMark`**

Render a 2×2 CSS grid of 13px squares using `#f25022`, `#7fba00`, `#00a4ef`, and `#ffb900`. Do not load a remote logo.

- [ ] **Step 3: Implement `EquityGrid`**

The component accepts `stage`, `frame`, grid counts, timing, and colors. It renders `totalCells` in a CSS grid. Intro colors use four ownership bands; valuation cells use `neutralColor`; Microsoft transition uses the last `microsoftCells` indexes and a per-cell reveal:

```ts
const reveal = interpolate(
  frame,
  [microsoftStartFrame + localIndex * 0.45, microsoftStartFrame + 12 + localIndex * 0.45],
  [0, 1],
  {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
);
```

Each cell animates only `backgroundColor`, `opacity`, `scale`, and `translate`.

- [ ] **Step 4: Implement `ValueCard`**

Render the OpenAI label, date, `市场估值`, value, and unit in a single light card with a subtle shadow. Animate opacity and vertical translate from `valuationStartFrame`.

- [ ] **Step 5: Implement `PhotoPresenterPanel`**

Use `<Img src={staticFile(portraitSrc)}>` with `objectFit: "cover"`. Animate scale from `portraitScale` to `portraitScale + cameraPushAmount` and add sinusoidal breathing/floating derived from `frame`.

- [ ] **Step 6: Implement `OpenAIEquitySplit`**

Use a flex row with animated left/right widths. The left panel contains:

- intro eyebrow and title;
- 100-cell `EquityGrid`;
- 27% blue highlight band during intro/split;
- `ValueCard` during valuation and Microsoft phases;
- 2290 value band and `MicrosoftMark` from `microsoftHoldFrame`.

The right panel contains `PhotoPresenterPanel` and enters during frames 21–35. No `<Audio>`, subtitles, or watermark components are added.

- [ ] **Step 7: Run component checks**

Run:

```bash
npm test
npm run typecheck
npm run lint
```

Expected: all existing and new tests pass; typecheck and lint exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/equity
git commit -m "feat: add OpenAI equity split scene"
```

### Task 3: Register and verify the Composition

**Files:**
- Modify: `src/Root.tsx`

- [ ] **Step 1: Register `OpenAIEquitySplit`**

Add a second `<Composition>` with:

```tsx
<Composition
  id="OpenAIEquitySplit"
  component={OpenAIEquitySplit}
  width={1280}
  height={720}
  fps={30}
  durationInFrames={236}
  schema={openAIEquitySchema}
  calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames})}
  defaultProps={{
    durationInFrames: 236,
    portraitSrc: "assets/portrait-landscape.png",
    title: "OpenAI 股权占比",
    eyebrow: "FOCUS ON OPENAI EQUITY",
    dateLabel: "2026.03.31",
    ownershipPercent: 27,
    marketValue: 8520,
    microsoftValue: 2290,
    currencyUnit: "亿",
    totalCells: 100,
    gridColumns: 10,
    microsoftCells: 27,
    splitX: 792,
    introEndFrame: 20,
    splitEndFrame: 35,
    valuationStartFrame: 66,
    microsoftStartFrame: 176,
    microsoftHoldFrame: 206,
    marketColor: "#4d4b4d",
    microsoftColor: "#6f9fd0",
    neutralColor: "#555356",
    mutedColor: "#ececed",
    portraitScale: 1.05,
    portraitPositionX: 50,
    portraitPositionY: 48,
    breathingAmount: 0.008,
    floatingAmount: 3,
    cameraPushAmount: 0.018
  }}
/>
```

- [ ] **Step 2: Verify registration**

Run:

```bash
npx remotion compositions
npm test
npm run typecheck
npm run lint
```

Expected: both `PhotoReplica` and `OpenAIEquitySplit` are listed; the new Composition is 236 frames.

- [ ] **Step 3: Commit**

```bash
git add src/Root.tsx
git commit -m "feat: register OpenAI equity split composition"
```

### Task 4: Render, tune, and register A-roll 002

**Files:**
- Create ignored: `out/equity-check-000.png`
- Create ignored: `out/equity-check-032.png`
- Create ignored: `out/equity-check-100.png`
- Create ignored: `out/equity-check-190.png`
- Create ignored: `out/equity-check-235.png`
- Create ignored: `out/openai-equity-split.mp4`
- Modify in catalog repository: `A-roll/entries.json`

- [ ] **Step 1: Render representative frames**

```bash
npx remotion still OpenAIEquitySplit out/equity-check-000.png --frame=0
npx remotion still OpenAIEquitySplit out/equity-check-032.png --frame=32
npx remotion still OpenAIEquitySplit out/equity-check-100.png --frame=100
npx remotion still OpenAIEquitySplit out/equity-check-190.png --frame=190
npx remotion still OpenAIEquitySplit out/equity-check-235.png --frame=235
```

Inspect at full resolution. Adjust only defaults and deterministic layout constants until:

- frame 0 is full-screen infographic;
- frame 32 is a clean 792/488 split;
- frame 100 shows `8520`;
- frame 190 shows partial blue reveal;
- frame 235 shows `2290`;
- the portrait remains upright with no black bars.

- [ ] **Step 2: Render the final silent MP4**

```bash
npx remotion render OpenAIEquitySplit out/openai-equity-split.mp4 --muted --overwrite
```

- [ ] **Step 3: Verify the video**

```bash
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,r_frame_rate -of json out/openai-equity-split.mp4
```

Expected: one 1280×720 H.264 stream, 30/1 fps, no audio, about 7.87 seconds.

- [ ] **Step 4: Add catalog entry**

Append `a-roll-002-openai-equity-split` with:

- project `../remotion-photo-replica`;
- composition `OpenAIEquitySplit`;
- preview `../remotion-photo-replica/out/equity-check-100.png`;
- output `../remotion-photo-replica/out/openai-equity-split.mp4`;
- tags `单人`, `静态照片`, `数据讲解`, `左右分屏`, `股权图`, `数字强调`, `轻推镜`, `16:9`, `30fps`, `无声`.

- [ ] **Step 5: Verify both repositories**

```bash
npm test
npm run typecheck
npm run lint
node --test /Users/admin/Desktop/Codex/video-catalog/test/catalog.test.mjs
```

Expected: all Remotion and catalog tests pass.

