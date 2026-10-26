# Dual-mode reference remake batch one implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build six paired Fast/Fidelity Remotion shot systems from reference video 40615805078 and export twelve smooth 1080p preview MP4 files.

**Architecture:** A typed catalog owns shared pair duration, checkpoints, generic copy, camera beats, and optional A-roll selection. Pair components receive a `mode` prop; A-roll is rendered by one shared high-fidelity component while B-roll components branch only on texture depth, decoration density, occlusion, and secondary parallax. Each visual family stays in its own file so three agents can implement two pairs each without editing the same source files.

**Tech Stack:** TypeScript, React, Remotion 4, Vitest, ffmpeg/ffprobe.

---

### Task 1: Reference checkpoints and pair contracts

**Files:**
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/types.ts`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/catalog.ts`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/catalog.test.ts`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/motion.ts`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/motion.test.ts`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/SharedAroll.tsx`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/shared.tsx`

- [ ] **Step 1: Extract five source checkpoints per pair**

Create uncommitted PNG files under `out/dual-remake-406158/reference/<slug>/` at establish, entrance, peak, settle, and exit beats. Use the source intervals from the design and render at 1920×1080 for direct comparison.

Run: `ffmpeg -ss <seconds> -i /Users/admin/Desktop/视频/待镜头复刻/40615805078-1-192.mp4 -frames:v 1 -vf scale=1920:1080 <output.png>`

Expected: 30 reference PNG files, each exactly 1920×1080.

- [ ] **Step 2: Write failing catalog and motion tests**

The tests must assert:

```ts
expect(pairs).toHaveLength(6);
expect(new Set(pairs.map((pair) => pair.compositionBaseId)).size).toBe(6);
expect(pair.qaFrames).toHaveLength(5);
expect(pair.qaFrames[0]).toBe(0);
expect(pair.qaFrames.at(-1)).toBe(pair.durationInFrames - 1);
expect(pair.fast.aroll).toEqual(pair.fidelity.aroll);
expect(allCameraValues.every(Number.isFinite)).toBe(true);
expect(sampleCurveAtBoundaryMinusOne).toBeCloseTo(sampleCurveAtBoundary, 1);
```

- [ ] **Step 3: Run the focused tests and confirm red**

Run: `npm run test:fidelity -- src/dual-remake-406158/catalog.test.ts src/dual-remake-406158/motion.test.ts`

Expected: FAIL because the catalog and motion modules do not exist yet.

- [ ] **Step 4: Implement typed pair catalog and deterministic motion helpers**

Define `RemakeMode = "fast" | "fidelity"`, normalized anchors, ordered camera beats, five QA frames, generic copy, and an optional immutable A-roll selection. Implement clamped segment interpolation, camera sampling, and deterministic texture seeds derived from array indices rather than random values.

- [ ] **Step 5: Implement shared high-fidelity A-roll**

`SharedAroll` must use Remotion's video component with the same source, trim, crop, grade, blur, and transform for both modes. Do not accept a `mode` prop. Use `staticFile()` only for project assets; for the external A-roll sources, stage a selected source into `public/dual-remake-406158/` before rendering.

- [ ] **Step 6: Run focused tests and typecheck**

Run: `npm run test:fidelity -- src/dual-remake-406158/catalog.test.ts src/dual-remake-406158/motion.test.ts && npm run typecheck`

Expected: all focused tests pass and TypeScript exits 0.

- [ ] **Step 7: Commit contracts and shared primitives**

```bash
git add library-sources/a-roll-remotion/src/dual-remake-406158
git commit -m "feat: define dual remake batch contracts"
```

### Task 2: Achievement collage and relationship-map pairs

**Files:**
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/shots/AchievementMedalCollage.tsx`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/shots/TalentRelationshipOutcomes.tsx`

- [ ] **Step 1: Implement pair 01**

Build warm aged paper, layered generic people silhouettes or shared A-roll portrait treatment, medal relief, pale oversized serif characters, black title strips, and red markers. Fast uses one paper pass, three main layers, and a single camera push. Fidelity adds print grain, edge wear, long shadows, foreground defocus, three parallax depths, and staggered strip wipes.

- [ ] **Step 2: Implement pair 02**

Build the continuous briefcase/talent-title → two-person relationship map → two mustard outcome-card narrative. Fast preserves the three states and primary transitions. Fidelity adds newspaper layers, rotated portrait cards, map/connector drawing, label occlusion, card flip/deal motion, and multi-plane camera movement.

- [ ] **Step 3: Render ten QA frames per pair**

Run `npx remotion still` for every catalog QA frame in both modes and place output under `out/dual-remake-406158/remake/<slug>/<mode>/`.

Expected: 20 PNG files for the two pairs, all 1920×1080.

- [ ] **Step 4: Visually compare and correct blocking differences**

Check palette balance, anchor position, font classification, entrance order, visible depth, camera scale, and safe-area clipping against the source frames. Correct only visible shot defects.

- [ ] **Step 5: Commit pairs 01–02**

```bash
git add library-sources/a-roll-remotion/src/dual-remake-406158/shots/AchievementMedalCollage.tsx library-sources/a-roll-remotion/src/dual-remake-406158/shots/TalentRelationshipOutcomes.tsx
git commit -m "feat: add achievement and relationship remake pairs"
```

### Task 3: Staged-training and feedback-loop pairs

**Files:**
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/shots/StagedTrainingQuestion.tsx`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/shots/FeedbackLoopDesktop.tsx`

- [ ] **Step 1: Implement pair 03**

Create the paper-wall person icon, two yellow archive cards, black origin/stage strips, and final oversized serif question. Fast uses clean card deals and a direct final push. Fidelity adds folded paper, label embossing, long shadows, print misregistration, foreground occlusion, and a continuous accelerating camera push into the final question.

- [ ] **Step 2: Implement pair 04**

Create the macro paper field, central black figurine, five feedback props, and red-black editorial labels. Fast uses simple vector props and two depth planes. Fidelity adds tactile prop faces, paper grain, contact shadows, five staged depth planes, ring-timed entrances, and foreground defocus.

- [ ] **Step 3: Render and inspect twenty QA frames**

Render five Fast and five Fidelity stills for each pair. Confirm the person/icon remains stable during prop entrances and that the final push does not jump at a camera-beat boundary.

- [ ] **Step 4: Commit pairs 03–04**

```bash
git add library-sources/a-roll-remotion/src/dual-remake-406158/shots/StagedTrainingQuestion.tsx library-sources/a-roll-remotion/src/dual-remake-406158/shots/FeedbackLoopDesktop.tsx
git commit -m "feat: add training and feedback remake pairs"
```

### Task 4: Biography and forked-road pairs

**Files:**
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/shots/BiographyTimeline.tsx`
- Create: `library-sources/a-roll-remotion/src/dual-remake-406158/shots/ForkedRoadDecision.tsx`

- [ ] **Step 1: Implement pair 05 with shared A-roll**

Use the staged `A17_24.7s_源1.mp4` selection for both modes. Keep crop, grade, blur, trim, and transform identical. Fast and Fidelity share the dark brown-black background, white timeline, magenta quotes, and highlight timing; Fidelity alone adds type texture, fine rules, deeper field treatment, scan grain, and subtle foreground separation.

- [ ] **Step 2: Implement pair 06**

Create bright gray paper, oversized black serif title, red underline, back-facing person, and Y-shaped road. Fast uses a vector figure and two road planes. Fidelity adds paper fiber, cutout edge treatment, realistic long road shadow, label wear, four parallax depths, and a camera advance aligned with road growth.

- [ ] **Step 3: Render and inspect twenty QA frames**

Confirm the biography A-roll frame is byte-identical between Fast/Fidelity at matching output frames. Confirm the road grows continuously from the person's feet and never reveals the canvas edge.

- [ ] **Step 4: Commit pairs 05–06**

```bash
git add library-sources/a-roll-remotion/src/dual-remake-406158/shots/BiographyTimeline.tsx library-sources/a-roll-remotion/src/dual-remake-406158/shots/ForkedRoadDecision.tsx
git commit -m "feat: add biography and decision remake pairs"
```

### Task 5: Composition registration and visual QA

**Files:**
- Modify: `library-sources/a-roll-remotion/src/Root.tsx`
- Modify: `library-sources/a-roll-remotion/src/dual-remake-406158/catalog.test.ts`

- [ ] **Step 1: Register twelve compositions**

Register `Fast406158...` and `Fidelity406158...` IDs for all six pairs using the same pair duration, 1920×1080, and 30 fps.

- [ ] **Step 2: Verify catalog, types, and composition enumeration**

Run: `npm run test:fidelity -- src/dual-remake-406158 && npm run typecheck && npx remotion compositions src/index.ts`

Expected: all tests pass; the twelve IDs appear with matching paired durations.

- [ ] **Step 3: Build five-frame comparison sheets**

For each pair, create a 2400-pixel-wide comparison sheet with reference on top, Fast in the middle, and Fidelity on the bottom. Inspect every sheet and fix only composition, typography, texture, timing, parallax, or clipping differences visible at the checkpoints.

- [ ] **Step 4: Commit integration**

```bash
git add library-sources/a-roll-remotion/src/Root.tsx library-sources/a-roll-remotion/src/dual-remake-406158
git commit -m "feat: register dual remake batch one"
```

### Task 6: MP4 render, smoothness validation, and delivery

**Files:**
- Output only: `library-sources/a-roll-remotion/out/dual-remake-406158/mp4/*.mp4`
- Delivery only: `/Users/admin/Desktop/视频/待镜头复刻/复刻镜头预览/*.mp4`

- [ ] **Step 1: Render twelve final videos**

Render H.264 at CRF 18, muted, 1920×1080, 30 fps, using bounded concurrency. Name files `406158-01-Fast-...mp4` through `406158-06-Fidelity-...mp4`.

- [ ] **Step 2: Validate metadata and decoded frame counts**

For each output, use ffprobe to verify H.264, 1920×1080, 30/1 fps, no audio stream, and duration equal to `durationInFrames / 30`. Decode with ffmpeg using `-vsync 0 -f null -` and require zero decode errors.

- [ ] **Step 3: Check continuity and unintended duplicate runs**

Use `freezedetect` and frame hashes to flag long identical runs. Compare flagged ranges with catalog holds. Any duplicate run not declared as an intentional hold is a blocking defect. Also inspect camera and major layer transforms one frame before and after every beat boundary.

- [ ] **Step 4: Copy and hash-verify delivery files**

Copy without overwriting earlier samples to `/Users/admin/Desktop/视频/待镜头复刻/复刻镜头预览`. Compare SHA-256 for source and delivered copies.

- [ ] **Step 5: Final verification commit status**

Run: `git diff --check && git status --short`

Expected: no uncommitted source changes; generated `out` files remain ignored or untracked outside commits.
