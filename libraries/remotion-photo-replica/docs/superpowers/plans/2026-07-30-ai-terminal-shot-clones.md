# AI Terminal Shot Clones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate all eight “AI 对话·终端” reference shots as editable, silent Remotion compositions and add them to the existing shot library without duplicate IDs.

**Architecture:** Add one focused `src/ai-terminal/` module with a typed catalog, measured reference layout, shared terminal/input primitives, and four structural render branches. Register eight compositions from catalog data, render each to MP4, then add matching library metadata and source snapshots.

**Tech Stack:** React, TypeScript, Remotion, Zod, Vitest, FFmpeg, Node test runner.

---

### Task 1: Lock the eight-shot catalog

**Files:**
- Create: `src/ai-terminal/types.ts`
- Create: `src/ai-terminal/catalog.ts`
- Create: `src/ai-terminal/catalog.test.ts`

- [ ] **Step 1: Write the failing catalog test**

```ts
import {describe, expect, test} from "vitest";
import {AI_TERMINAL_SHOTS} from "./catalog";

describe("AI 对话·终端目录", () => {
  test("包含八个唯一镜头", () => {
    expect(AI_TERMINAL_SHOTS.map((shot) => shot.id)).toEqual([
      "code",
      "terminal",
      "contextterminal",
      "aiinput",
      "claudecodeinput",
      "inputpan",
      "rc017",
      "rc021",
    ]);
    expect(new Set(AI_TERMINAL_SHOTS.map((shot) => shot.id)).size).toBe(8);
  });

  test("锁定参考视频参数", () => {
    for (const shot of AI_TERMINAL_SHOTS) {
      expect(shot.width).toBe(1920);
      expect(shot.height).toBe(1080);
      expect(shot.fps).toBe(30);
      expect(shot.durationInFrames).toBe(182);
    }
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run src/ai-terminal/catalog.test.ts`

Expected: FAIL because `./catalog` does not exist.

- [ ] **Step 3: Define the editable schema and catalog**

```ts
import {z} from "zod";

export const aiTerminalSceneSchema = z.object({
  id: z.string(),
  variant: z.enum(["code-split", "terminal", "input", "command"]),
  portraitSrc: z.string(),
  headline: z.string(),
  subline: z.string(),
  lines: z.array(z.string()),
  accentColor: z.string(),
  durationInFrames: z.number().int().positive(),
});

export type AITerminalSceneProps = z.infer<typeof aiTerminalSceneSchema>;
```

`catalog.ts` defines the eight IDs in the tested order, sets 1920×1080, 30fps, 182 frames, assigns `code-split`, `terminal`, `input`, or `command`, and uses `assets/portrait-landscape.png` only for `code`.

- [ ] **Step 4: Run the catalog test**

Run: `npx vitest run src/ai-terminal/catalog.test.ts`

Expected: 2 tests pass.

### Task 2: Lock measured geometry and timing

**Files:**
- Create: `src/ai-terminal/reference-layout.ts`
- Create: `src/ai-terminal/reference-layout.test.ts`

- [ ] **Step 1: Write failing geometry tests**

```ts
import {describe, expect, test} from "vitest";
import {AI_TERMINAL_LAYOUT} from "./reference-layout";

describe("AI 对话·终端参考几何", () => {
  test("代码分屏保留参考包围盒", () => {
    expect(AI_TERMINAL_LAYOUT.code).toMatchObject({
      terminalX: 74,
      portraitX: 1018,
      portraitY: 92,
    });
  });

  test("命令和输入镜头保留关键阶段", () => {
    expect(AI_TERMINAL_LAYOUT.command.stageFrames).toEqual([18, 58, 98, 138]);
    expect(AI_TERMINAL_LAYOUT.input.typeStart).toBe(32);
  });
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npx vitest run src/ai-terminal/reference-layout.test.ts`

Expected: FAIL because `reference-layout.ts` does not exist.

- [ ] **Step 3: Add measured layout constants**

Create constants for:

- code terminal and portrait bounding boxes;
- full-screen terminal window and prompt baseline;
- centered input card and send button;
- input-pan left/right camera positions;
- command menu panel, row heights, stage frames, and result card;
- per-variant font sizes, colors, and reveal frames.

- [ ] **Step 4: Run geometry tests**

Run: `npx vitest run src/ai-terminal/reference-layout.test.ts`

Expected: all geometry tests pass.

### Task 3: Build shared primitives and four structural branches

**Files:**
- Create: `src/ai-terminal/AITerminalScene.tsx`
- Modify: `src/ai-terminal/types.ts`

- [ ] **Step 1: Implement deterministic animation helpers**

```ts
const reveal = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const typedLine = (line: string, frame: number, start: number, speed: number) =>
  line.slice(0, Math.max(0, Math.floor((frame - start) / speed)));
```

- [ ] **Step 2: Implement reusable visual primitives**

Add internal components for:

- `WindowChrome` with three traffic-light dots;
- `TerminalLine` with prompt, monospace text, and cursor;
- `InputComposer` with editable placeholder, send button, and typing;
- `CommandRow` with inactive, selected, success, and error states;
- `PortraitCard` using the existing `PhotoPresenterPanel`.

- [ ] **Step 3: Implement the four render branches**

`AITerminalScene` switches on `variant`:

- `code-split`: left code window enters, right user portrait settles, code types by line;
- `terminal`: full-width dark terminal types commands and results;
- `input`: AI or Claude Code input surface types a prompt and triggers send/clear;
- `command`: rows focus sequentially, a result card expands, and status color changes.

`inputpan` uses the `input` branch with a horizontal camera offset that reveals chat and terminal surfaces in one continuous move.

- [ ] **Step 4: Run focused checks**

Run: `npx vitest run src/ai-terminal/*.test.ts && npm run typecheck`

Expected: tests pass and TypeScript exits 0.

### Task 4: Register compositions

**Files:**
- Modify: `src/Root.tsx`
- Modify: `src/ai-terminal/catalog.test.ts`

- [ ] **Step 1: Add a failing registration coverage test**

Extend the catalog test to assert every catalog entry has a non-empty `compositionId` beginning with `XcyjAiTerminal`.

- [ ] **Step 2: Register catalog-driven compositions**

```tsx
{AI_TERMINAL_SHOTS.map((shot) => (
  <Composition
    key={shot.id}
    id={shot.compositionId}
    component={AITerminalScene}
    width={shot.width}
    height={shot.height}
    fps={shot.fps}
    durationInFrames={shot.durationInFrames}
    schema={aiTerminalSceneSchema}
    defaultProps={shot.defaultProps}
  />
))}
```

- [ ] **Step 3: Verify registration**

Run: `npx vitest run src/ai-terminal/*.test.ts && npm run lint`

Expected: tests, ESLint, and TypeScript pass.

### Task 5: Render and compare all eight shots

**Files:**
- Create generated outputs: `out/xcyj-ai-terminal/*.mp4`

- [ ] **Step 1: Render sequentially**

Run each catalog composition with:

```bash
npx remotion render <composition-id> out/xcyj-ai-terminal/<id>.mp4 --concurrency=2 --log=error
```

Expected: eight non-empty MP4 files.

- [ ] **Step 2: Generate same-frame comparisons**

Use FFmpeg to compare reference and clone at 0.5s, 1.5s, 3s, and 5s. Correct measured layout or timing where terminal bounds, font scale, selected state, cursor position, or camera movement differ visibly.

- [ ] **Step 3: Verify media metadata**

Run `ffprobe` for all eight outputs.

Expected: 1920×1080, 30fps, approximately 6.12 seconds, no audio stream.

### Task 6: Add shots to the library

**Files:**
- Modify: `/Users/admin/Desktop/Codex/Video-Shot-Library/source/a-roll-entries.json`
- Modify: `/Users/admin/Desktop/Codex/Video-Shot-Library/source/shot-metadata.json`
- Modify: `/Users/admin/Desktop/Codex/Video-Shot-Library/scripts/build-library-data.mjs`
- Create: `/Users/admin/Desktop/Codex/Video-Shot-Library/library-sources/a-roll-remotion/src/ai-terminal/*`
- Create generated outputs: `/Users/admin/Desktop/Codex/Video-Shot-Library/public/media/xcyj-ai-terminal/*.mp4`

- [ ] **Step 1: Add failing library coverage tests**

Extend `tests/library-data.test.mjs` to require eight unique `xcyj-ai-terminal-*` cards in category `AI 对话·终端`, with `code` marked A-roll and the remaining seven marked B-roll.

- [ ] **Step 2: Add metadata and source snapshots**

Add the eight entries with Chinese titles, tags for terminal/input/typing/state selection, local media URLs, composition IDs, and editable source paths. Copy the exact Remotion module and output files.

- [ ] **Step 3: Rebuild and verify**

Run:

```bash
npm run data:build
npm test
npm run typecheck
```

Expected: data generation, all tests, production build, and TypeScript pass.

### Task 7: Final regression check

**Files:**
- No additional files expected.

- [ ] **Step 1: Run the Remotion suite**

Run: `npm test && npm run lint`

Expected: all Remotion tests and checks pass.

- [ ] **Step 2: Confirm hover behavior is unchanged**

Run the library render/build tests and confirm the existing preview video URLs, viewport-driven autoplay, and mouse-exit reset tests still pass.

- [ ] **Step 3: Confirm output parity**

Confirm eight library MP4s byte-match the corresponding Remotion outputs and all eight IDs appear once in `public/data/library.json`.
