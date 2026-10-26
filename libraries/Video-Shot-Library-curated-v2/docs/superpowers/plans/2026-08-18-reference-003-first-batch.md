# Reference 003 First Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and safely render the first four approved B-roll shots from reference 003 in separate Fast and Fidelity variants, producing eight reviewable MP4 files.

**Architecture:** Add an isolated `src/reference-003` catalog and eight focused composition components. The catalog owns IDs, durations, names, modes, and QA frames; `Root.tsx` maps its entries to Remotion compositions. Fast and Fidelity share semantic examples but use separate markup and motion so Fidelity remains reference-led rather than a recolor.

**Tech Stack:** React 19, TypeScript 5.9, Remotion 4.0.500, Vitest, FFmpeg/ffprobe.

---

### Task 1: Align Remotion packages and define the first-batch catalog

**Files:**
- Modify: `library-sources/a-roll-remotion/package.json`
- Modify: `library-sources/a-roll-remotion/package-lock.json`
- Modify: `library-sources/a-roll-remotion/vitest.fidelity.config.ts`
- Create: `library-sources/a-roll-remotion/src/reference-003/catalog.ts`
- Create: `library-sources/a-roll-remotion/src/reference-003/catalog.test.ts`

- [ ] **Step 1: Write failing catalog tests**

Test that the catalog contains exactly B02, B05, B07, and B09; each has one Fast and one Fidelity entry; IDs and output names are unique; QA frames fall within duration; all compositions are 1920×1080 at 30fps.

```ts
expect(REFERENCE_003_FIRST_BATCH.map(({shotKey}) => shotKey)).toEqual([
  "B02",
  "B05",
  "B07",
  "B09",
]);
expect(REFERENCE_003_COMPOSITIONS).toHaveLength(8);
expect(new Set(REFERENCE_003_COMPOSITIONS.map(({id}) => id)).size).toBe(8);
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test:fidelity -- src/reference-003/catalog.test.ts`

Expected: FAIL because `catalog.ts` does not exist.

- [ ] **Step 3: Add exact package pins and catalog data**

Add exact 4.0.500 dependencies for the Remotion packages currently resolved from the parent workspace: `@remotion/google-fonts`, `@remotion/paths`, `@remotion/shapes`, and `@remotion/transitions`. Use these first-batch durations:

```ts
const shots = [
  {shotKey: "B02", slug: "OpinionType", name: "观点句动态排版", durationInFrames: 96, qaFrames: [0, 18, 38, 66, 95]},
  {shotKey: "B05", slug: "ChatPanel", name: "群聊面板逐条入场", durationInFrames: 162, qaFrames: [0, 28, 66, 112, 161]},
  {shotKey: "B07", slug: "HardwareDispatch", name: "硬件调度信息卡", durationInFrames: 210, qaFrames: [0, 38, 86, 146, 209]},
  {shotKey: "B09", slug: "ProfileCarousel", name: "人物档案卡轮播", durationInFrames: 267, qaFrames: [0, 52, 112, 182, 266]},
];
```

Generate IDs as `FastR03${slug}` and `FidelityR03${slug}` and output names as `R03-${shotKey}-${mode}-${name}.mp4`.

- [ ] **Step 4: Verify GREEN and version alignment**

Run:

```bash
npm run test:fidelity -- src/reference-003/catalog.test.ts
npx remotion versions --log=verbose
```

Expected: catalog tests pass and all reported Remotion packages are 4.0.500.

- [ ] **Step 5: Commit**

```bash
git add library-sources/a-roll-remotion/package.json library-sources/a-roll-remotion/package-lock.json library-sources/a-roll-remotion/vitest.fidelity.config.ts library-sources/a-roll-remotion/src/reference-003/catalog.ts library-sources/a-roll-remotion/src/reference-003/catalog.test.ts
git commit -m "feat: define reference 003 first batch"
```

### Task 2: Extract and document reference checkpoints

**Files:**
- Create: `library-sources/a-roll-remotion/src/reference-003/reference-notes.md`
- Create: `library-sources/a-roll-remotion/reference-003/checkpoints/B02/*.png`
- Create: `library-sources/a-roll-remotion/reference-003/checkpoints/B05/*.png`
- Create: `library-sources/a-roll-remotion/reference-003/checkpoints/B07/*.png`
- Create: `library-sources/a-roll-remotion/reference-003/checkpoints/B09/*.png`

- [ ] **Step 1: Extract five 1920×1080 checkpoints per shot**

Use FFmpeg with exact reference ranges B02 `51.63–54.83`, B05 `143.33–148.70`, B07 `178.37–185.37`, and B09 `230.17–239.07`. Scale with preserved aspect ratio and padding; do not stretch the 1280×720 source.

- [ ] **Step 2: Record observations**

For every checkpoint, record background, palette, type hierarchy, entrance order, camera scale/pan, depth layers, texture, and the generic replacement content.

- [ ] **Step 3: Verify**

Run `find reference-003/checkpoints -type f -name '*.png' | wc -l`.

Expected: `20`.

- [ ] **Step 4: Commit**

```bash
git add library-sources/a-roll-remotion/reference-003/checkpoints library-sources/a-roll-remotion/src/reference-003/reference-notes.md
git commit -m "docs: capture reference 003 checkpoints"
```

### Task 3: Implement B02 and B05 Fast/Fidelity compositions

**Files:**
- Create: `library-sources/a-roll-remotion/src/reference-003/fast/OpinionTypeFast.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/OpinionTypeFidelity.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fast/ChatPanelFast.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/ChatPanelFidelity.tsx`

- [ ] **Step 1: Add motion assertions before components**

Extend `catalog.test.ts` with source-level guards rejecting `animation:`, `transition:`, `Math.random`, and `Date`, and require each component to export its catalog component key.

- [ ] **Step 2: Run the guards and verify RED**

Expected: FAIL because the four component files do not exist.

- [ ] **Step 3: Implement B02**

Fast uses a charcoal field, acid-green keyword, rapid baseline wipes, and a shallow push. Fidelity follows the reference black paper texture, white serif statement, vermilion keyword, small vertical labels, staggered tracking, and subtle parallax. Generic copy: `真正的突破 / 往往来自 / 重新定义问题`.

- [ ] **Step 4: Implement B05**

Fast uses compact dark chat cards with cyan/green status accents. Fidelity uses a warm off-white floating panel, neutral avatars, sequential bubbles, red inline emphasis, right-bottom category tag, soft edge shadow, and a 1.00→1.035 camera push. Generic dialogue concerns planning, verification, and delivery.

- [ ] **Step 5: Run tests and typecheck**

Run:

```bash
npm run test:fidelity -- src/reference-003/catalog.test.ts
npm run typecheck
```

Expected: PASS.

### Task 4: Implement B07 and B09 Fast/Fidelity compositions

**Files:**
- Create: `library-sources/a-roll-remotion/src/reference-003/fast/HardwareDispatchFast.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/HardwareDispatchFidelity.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fast/ProfileCarouselFast.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/ProfileCarouselFidelity.tsx`

- [ ] **Step 1: Add component-presence guards and verify RED**

Require the four files and exported component names in `catalog.test.ts`; run the focused test and observe failure.

- [ ] **Step 2: Implement B07**

Fast uses simplified luminous compute tiles, monospace parameters, and a short dolly. Fidelity recreates bronze/graphite metal bars, spec columns, bloom, layered blur, oblique perspective, moving highlight, and depth-separated push. Generic data describes queue, throughput, utilization, and latency.

- [ ] **Step 3: Implement B09**

Fast uses three clean profile/data cards with hard-cut carousel motion. Fidelity uses ivory paper, monochrome illustrated silhouettes built with CSS/SVG, ink-mask reveals, bilingual role labels, overlapping depth, and a soft exit into a bright field. Do not use real people or original names.

- [ ] **Step 4: Run tests and typecheck**

Run focused Vitest and `npm run typecheck`; both must pass.

### Task 5: Register compositions and render QA frames

**Files:**
- Modify: `library-sources/a-roll-remotion/src/Root.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/registry.ts`
- Create: `library-sources/a-roll-remotion/src/reference-003/registry.test.ts`
- Create: `library-sources/a-roll-remotion/out/reference-003/qa/*.png` (ignored output)

- [ ] **Step 1: Write registry tests and verify RED**

Assert that all eight catalog IDs resolve to a component and that Root registers 1920×1080, 30fps compositions with catalog durations.

- [ ] **Step 2: Add registry and Root mapping**

Use an explicit component map keyed by catalog component key. Root maps the eight records to `<Composition>` without duplicating metadata.

- [ ] **Step 3: Verify registration**

Run `npx remotion compositions` and assert all eight `FastR03...`/`FidelityR03...` IDs appear with the expected durations.

- [ ] **Step 4: Render 40 QA stills**

Render the five catalog QA frames for every composition. Review each Fidelity set against the corresponding reference checkpoints and each Fast set for legibility and independent visual identity.

### Task 6: Safe-render and publish eight previews

**Files:**
- Create: `library-sources/a-roll-remotion/out/reference-003/fast/mp4/*.mp4` (ignored output)
- Create: `library-sources/a-roll-remotion/out/reference-003/fidelity/mp4/*.mp4` (ignored output)
- Create: `/Users/admin/Desktop/视频/待镜头复刻/复刻镜头预览/R03-*.mp4`

- [ ] **Step 1: Run the complete verification gate**

```bash
npm run test:fidelity
npm run typecheck
npx prettier --check src/reference-003 src/Root.tsx package.json
git diff --check
```

- [ ] **Step 2: Render sequentially**

For each catalog entry run:

```bash
npx remotion render <composition-id> <temporary-output> --concurrency=1 --codec=h264 --crf=18 --muted --overwrite
```

Use the bundled headless shell and never start two final renders concurrently.

- [ ] **Step 3: Validate every MP4**

Require H.264, 1920×1080, 30/1 fps, exact frame count, no audio stream, successful full FFmpeg decode, and no isolated tiled/scale-corruption frames in known high-motion regions.

- [ ] **Step 4: Publish atomically**

Copy each validated temporary file to its repository output and preview `.codex-new` path, then atomically rename. Compare SHA-256 across temporary, repository, and preview copies.

- [ ] **Step 5: Commit source changes**

```bash
git add library-sources/a-roll-remotion/src/Root.tsx library-sources/a-roll-remotion/src/reference-003
git commit -m "feat: add reference 003 first batch remakes"
```
