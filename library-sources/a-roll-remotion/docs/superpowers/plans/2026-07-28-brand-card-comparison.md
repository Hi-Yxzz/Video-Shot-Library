# AI Brand Card Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 66-frame editable Remotion Composition that recreates the OpenAI and Anthropic floating-card A-roll with the user's existing portrait.

**Architecture:** Keep the feature isolated under `src/brand-cards/`. Pure timeline helpers calculate deterministic entrance and float motion, a Zod schema exposes Studio controls, and one composition layers the existing portrait asset behind two reusable brand-card components.

**Tech Stack:** React 19, TypeScript, Remotion 4, Zod, Vitest, FFmpeg/FFprobe

---

### Task 1: Timeline Helpers

**Files:**
- Create: `src/brand-cards/timeline.test.ts`
- Create: `src/brand-cards/timeline.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import {describe, expect, it} from "vitest";
import {cardEntrance, floatingOffset} from "./timeline";

describe("cardEntrance", () => {
  it("clamps before and after the entrance window", () => {
    expect(cardEntrance(5, 6, 18)).toBe(0);
    expect(cardEntrance(18, 6, 18)).toBe(1);
  });

  it("returns an eased value during the entrance", () => {
    expect(cardEntrance(12, 6, 18)).toBeGreaterThan(0);
    expect(cardEntrance(12, 6, 18)).toBeLessThan(1);
  });
});

describe("floatingOffset", () => {
  it("is deterministic and changes with phase", () => {
    expect(floatingOffset(30, 4, 0)).toBe(floatingOffset(30, 4, 0));
    expect(floatingOffset(30, 4, 0)).not.toBe(floatingOffset(30, 4, Math.PI));
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run: `npx vitest run src/brand-cards/timeline.test.ts`

Expected: FAIL because `./timeline` does not exist.

- [ ] **Step 3: Implement the helpers**

```ts
import {Easing, interpolate} from "remotion";

export const cardEntrance = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const floatingOffset = (
  frame: number,
  amplitude: number,
  phase: number,
) => Math.sin((frame / 24) * Math.PI * 2 + phase) * amplitude;
```

- [ ] **Step 4: Verify the tests pass**

Run: `npx vitest run src/brand-cards/timeline.test.ts`

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/brand-cards/timeline.ts src/brand-cards/timeline.test.ts
git commit -m "feat: add brand card timeline helpers"
```

### Task 2: Editable Props Schema

**Files:**
- Create: `src/brand-cards/types.test.ts`
- Create: `src/brand-cards/types.ts`

- [ ] **Step 1: Write schema boundary tests**

```ts
import {describe, expect, it} from "vitest";
import {aiBrandCardSchema} from "./types";

const valid = {
  durationInFrames: 66,
  portraitSrc: "assets/portrait-landscape.png",
  leftEnterStart: 6,
  leftEnterEnd: 18,
  rightEnterStart: 24,
  rightEnterEnd: 36,
};

describe("aiBrandCardSchema", () => {
  it("accepts ordered entrance windows", () => {
    expect(aiBrandCardSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects reversed entrance windows", () => {
    expect(
      aiBrandCardSchema.safeParse({...valid, leftEnterEnd: 4}).success,
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run: `npx vitest run src/brand-cards/types.test.ts`

Expected: FAIL because `./types` does not exist.

- [ ] **Step 3: Implement schema and types**

Create a top-level `z.object()` containing portrait motion, two brand-card configs, colors, and four entrance frames. Add `.refine()` checks for ordered frame windows and infer `AIBrandCardProps` from the schema.

- [ ] **Step 4: Verify the schema tests pass**

Run: `npx vitest run src/brand-cards/types.test.ts`

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/brand-cards/types.ts src/brand-cards/types.test.ts
git commit -m "feat: define editable brand card props"
```

### Task 3: Brand Card Scene

**Files:**
- Create: `src/brand-cards/BrandCard.tsx`
- Create: `src/brand-cards/AIBrandCardComparison.tsx`

- [ ] **Step 1: Implement the reusable card**

Render an absolutely positioned two-layer card. Use `cardEntrance()` for opacity, scale, translate and blur, then add `floatingOffset()` after entrance. The upper layer shows `markText` and `brandName`; the lower layer shows the uppercase label.

- [ ] **Step 2: Implement the composition**

Render `PhotoPresenterPanel` full-screen using the existing portrait props. Place the OpenAI card above the left shoulder and the Anthropic card above the right shoulder. Pass phase `0` to the left card and `Math.PI` to the right card.

- [ ] **Step 3: Run focused and full checks**

Run: `npm test`

Expected: all previous tests plus new timeline and schema tests pass.

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 4: Commit**

```bash
git add src/brand-cards/BrandCard.tsx src/brand-cards/AIBrandCardComparison.tsx
git commit -m "feat: add AI brand card comparison scene"
```

### Task 4: Register and Document the Composition

**Files:**
- Modify: `src/Root.tsx`
- Modify: `package.json`
- Modify: `README.md`

- [ ] **Step 1: Register `AIBrandCardComparison`**

Add a 1280×720, 30fps, 66-frame Composition with `aiBrandCardSchema`, dynamic duration metadata, the existing portrait asset, left OpenAI defaults, right Anthropic defaults, and the reference-derived entrance frames.

- [ ] **Step 2: Add render scripts**

```json
"render:brand-check": "remotion still AIBrandCardComparison out/brand-card-check-36.png --frame=36",
"render:brand-video": "remotion render AIBrandCardComparison out/ai-brand-card-comparison.mp4 --muted --overwrite"
```

- [ ] **Step 3: Document editable props**

Add the third Composition and the two new commands to `README.md`. Document card content, positions, dimensions, entrance frames, colors and portrait controls.

- [ ] **Step 4: Verify registration**

Run: `npx remotion compositions`

Expected: `AIBrandCardComparison 30 1280x720 66 (2.20 sec)`.

- [ ] **Step 5: Commit**

```bash
git add src/Root.tsx package.json README.md
git commit -m "feat: register AI brand card composition"
```

### Task 5: Visual Calibration and Render

**Files:**
- Generate: `out/brand-card-check-00.png`
- Generate: `out/brand-card-check-12.png`
- Generate: `out/brand-card-check-24.png`
- Generate: `out/brand-card-check-36.png`
- Generate: `out/brand-card-check-65.png`
- Generate: `out/brand-card-contact-sheet.png`
- Generate: `out/ai-brand-card-comparison.mp4`

- [ ] **Step 1: Render representative stills**

Run one `npx remotion still AIBrandCardComparison ... --frame=N` command for frames 0, 12, 24, 36 and 65.

Expected: all PNG files render without browser or asset errors.

- [ ] **Step 2: Inspect and tune**

Check that neither card covers the face, both card labels remain readable, the entrance directions match the reference, and no edge clipping occurs. Adjust only default props or card styling needed for those checks.

- [ ] **Step 3: Render the muted video**

Run: `npm run render:brand-video`

Expected: `out/ai-brand-card-comparison.mp4` exists.

- [ ] **Step 4: Verify media streams**

Run:

```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,codec_type,width,height,r_frame_rate -of json out/ai-brand-card-comparison.mp4
```

Expected: one H.264 video stream, 1280×720, 30/1, about 2.20 seconds, no audio stream.

### Task 6: Catalog Registration and Final Verification

**Files:**
- Modify in catalog worktree: `video-catalog/A-roll/entries.json`

- [ ] **Step 1: Add the A-roll entry**

Append ID `a-roll-003-ai-brand-card-comparison`, Composition `AIBrandCardComparison`, 66 frames, preview `brand-card-check-36.png`, output `ai-brand-card-comparison.mp4`, and tags for single portrait, floating cards, OpenAI, Anthropic, 16:9, 30fps and silence.

- [ ] **Step 2: Run catalog contract tests**

Run: `VIDEO_WORKSPACE_ROOT=/Users/admin/Desktop/Codex node --test test/catalog.test.mjs`

Expected: 1 test passes and all referenced assets exist.

- [ ] **Step 3: Run final project verification**

Run:

```bash
npm test
npm run typecheck
npm run lint
npx remotion compositions
```

Expected: all commands exit 0 and all three Compositions are listed.

- [ ] **Step 4: Merge and clean worktrees**

Fast-forward both feature branches into their respective `main` branches, copy ignored render outputs into the formal project `out/` directory, rerun the project and catalog checks from the formal directories, then remove the merged worktrees and branches.
