# Reference 003 Remaining Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the eight approved remaining Reference 003 Fidelity compositions, render one muted 1080p30 H.264 preview for each, and leave Fast variants for a later phase.

**Architecture:** Extend the existing `src/reference-003` catalog and registry rather than creating a second namespace. Each shot has one focused Fidelity component and one deterministic state factory in `motion.ts`; A-roll shots additionally use selected CFR source clips copied into `public/assets/reference-003/aroll/` and described by `aroll-clips.ts`. Final rendering remains sequential at `--concurrency=1`, while implementation work is split into four non-overlapping two-shot groups.

**Tech Stack:** Remotion 4.0.500, React, TypeScript, Vitest, `@remotion/media`, FFmpeg/ffprobe.

---

## Locked shot matrix

| Key | Slug | Name | Frames | QA frames | Component ID | Kind |
| --- | --- | --- | ---: | --- | --- | --- |
| B01 | `KeywordType` | 关键词逐字形成 | 144 | 0, 28, 64, 102, 143 | `FidelityR03KeywordType` | B-roll |
| B03 | `QuotePanelPush` | 悬浮面板转巨幅引语 | 224 | 0, 42, 100, 160, 223 | `FidelityR03QuotePanelPush` | B-roll |
| B04 | `MetalComputeArray` | 金属算力阵列 | 295 | 0, 54, 128, 218, 294 | `FidelityR03MetalComputeArray` | B-roll |
| B06 | `EvidenceArticlePush` | 标题转文章证据 | 172 | 0, 30, 76, 124, 171 | `FidelityR03EvidenceArticlePush` | B-roll |
| B08 | `TeamRelationshipGraph` | 团队关系图展开 | 309 | 0, 54, 132, 222, 308 | `FidelityR03TeamRelationshipGraph` | B-roll |
| A01 | `YearMarketOverlay` | 年份巨字压屏 | 111 | 0, 20, 48, 78, 110 | `FidelityR03ArollYearMarketOverlay` | A-roll |
| A02 | `QuestionCardSpeaker` | 人物配左右问题卡 | 462 | 0, 84, 204, 330, 461 | `FidelityR03ArollQuestionCardSpeaker` | A-roll |
| A03 | `MonochromeQuotePortrait` | 黑白人物巨字引语 | 327 | 0, 58, 146, 238, 326 | `FidelityR03ArollMonochromeQuotePortrait` | A-roll |

All output names follow `R03-<shotKey>-Fidelity-<name>.mp4`. All copy, names, figures, portraits, and claims are generic replacements. Source watermarks and subtitles are excluded.

### Task 1: Extract and document remaining reference checkpoints

**Files:**
- Create: `library-sources/a-roll-remotion/reference-003/checkpoints/{B01,B03,B04,B06,B08,A01,A02,A03}/01.png` through `05.png`
- Modify: `library-sources/a-roll-remotion/src/reference-003/reference-notes.md`

- [ ] Extract five 1920×1080 PNGs per range from `/Users/admin/Desktop/视频/待镜头复刻/3.mp4`, using the locked QA proportions and source-second mapping.
- [ ] Document per stage: palette, typography, layer order, entrance order, camera push, parallax, texture, and generic replacement content.
- [ ] Verify all 40 images are 1920×1080 and no note contains source-specific brand copy as reconstruction content.
- [ ] Commit with `docs: capture remaining reference 003 checkpoints`.

### Task 2: Extend catalog and registry contracts

**Files:**
- Modify: `library-sources/a-roll-remotion/src/reference-003/catalog.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/catalog.test.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/registry.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/registry.test.ts`

- [ ] Add a failing catalog test for the eight matrix rows above and assert A-roll modes equal `['Fidelity']`.
- [ ] Rename the full catalog export to `REFERENCE_003_SHOTS`, retain the first-batch export only if existing tests require it, and expand all 12 approved shots.
- [ ] Add registry imports and map entries for eight Fidelity components; do not create Fast placeholders.
- [ ] Verify IDs, output names, durations, QA bounds, and registry counts are unique and exact.
- [ ] Commit with `feat: register remaining reference 003 fidelity shots` after component files exist.

### Task 3: Implement B01 and B03

**Files:**
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/KeywordTypeFidelity.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/QuotePanelPushFidelity.tsx`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.test.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/components.test.ts`

- [ ] RED: require B01 stages `paper`, `headline`, `keyword`, `underline`, `microcopy`, `camera`; require B03 stages `panel`, `frame`, `quote`, `macroQuote`, `shadow`, `camera`.
- [ ] B01: warm-white paper, large charcoal serif characters, one muted blue block, one amber underline, narrow microcopy; reveal by clipping characters rather than opacity-only fading.
- [ ] B03: thin black framed white panel with cast shadow, small editorial quote first, then a scale/translation transition into oversized horizontal quote text with preserved paper grain.
- [ ] Keep all motion driven by `useCurrentFrame()`, `interpolate()`, and local `spring()` clocks; no CSS animation/transition.
- [ ] GREEN: focused motion/component tests and `npm run typecheck`.

### Task 4: Implement B04 and B06

**Files:**
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/MetalComputeArrayFidelity.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/EvidenceArticlePushFidelity.tsx`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.test.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/components.test.ts`

- [ ] RED: require B04 stages `blocks`, `edgeLight`, `labels`, `depth`, `camera`; require B06 stages `headline`, `blueUnderline`, `amberUnderline`, `article`, `evidenceFocus`, `camera`.
- [ ] B04: oblique graphite/bronze compute blocks, repeated edge fins, amber labels, shallow-depth blur planes, and a diagonal camera push; do not reuse B07's front-facing module geometry.
- [ ] B06: white editorial title with blue/amber marker underlines, transition to a structured article page, then push into a highlighted evidence paragraph.
- [ ] Use invented labels such as `ARRAY 04`, `LOAD 72`, and a generic evidence paragraph; no brands or copied claims.
- [ ] GREEN: focused motion/component tests and `npm run typecheck`.

### Task 5: Implement B08 and A01

**Files:**
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/TeamRelationshipGraphFidelity.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/YearMarketOverlayFidelity.tsx`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.test.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/components.test.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/aroll-clips.ts`
- Add selected A01 clip under: `library-sources/a-roll-remotion/public/assets/reference-003/aroll/`

- [ ] RED: require B08 node/edge/camera stages and A01 year/market/video/parallax stages plus valid clip metadata.
- [ ] B08: warm-white field, two node columns, abstract CSS/SVG portraits, fine gray relationship lines that draw before secondary nodes settle, then a mild push across the network.
- [ ] A01: use a selected CFR clip from `/Users/admin/Desktop/视频/通用/A-roll`; layer oversized condensed `2030`, generic market rows, and foreground/background masks around the speaker. Keep the source video muted.
- [ ] Verify A01 trim range stays within source duration and copied asset SHA-256 matches the source.
- [ ] GREEN: focused tests, asset test, and `npm run typecheck`.

### Task 6: Implement A02 and A03

**Files:**
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/QuestionCardSpeakerFidelity.tsx`
- Create: `library-sources/a-roll-remotion/src/reference-003/fidelity/MonochromeQuotePortraitFidelity.tsx`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/motion.test.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/components.test.ts`
- Modify: `library-sources/a-roll-remotion/src/reference-003/aroll-clips.ts`
- Add selected A02/A03 clips under: `library-sources/a-roll-remotion/public/assets/reference-003/aroll/`

- [ ] RED: require A02 speaker/card/copy/parallax stages and A03 monochrome/grid/giant-letter/quote stages plus valid clip metadata.
- [ ] A02: stable centered speaker, left/right ivory paper cards, staged question fragments, subtle card rotations and independent shadows; no clip freezing or speed changes.
- [ ] A03: grayscale speaker or silhouette on the right, giant cropped generic Chinese characters behind, left editorial quote, fine grid and quotation marks, with layered scale drift.
- [ ] Use A-roll pool clips long enough for 462 and 327 output frames, or loop only a naturally seamless stable clip; prefer trim coverage without looping.
- [ ] GREEN: focused tests, asset tests, and `npm run typecheck`.

### Task 7: Integrate, render, and publish

**Files:**
- Modify: `library-sources/a-roll-remotion/src/reference-003/registry.ts`
- Generated ignored outputs: `library-sources/a-roll-remotion/out/reference-003/fidelity/mp4/`
- External previews: `/Users/admin/Desktop/视频/待镜头复刻/复刻镜头预览/`

- [ ] Run `npm run test:fidelity`, `npm run typecheck`, and `npx remotion compositions src/index.ts`.
- [ ] Render each Fidelity composition sequentially with `npx remotion render <id> <temp-output> --concurrency=1 --codec=h264 --crf=18 --muted --overwrite`.
- [ ] Extract five QA frames from each rendered MP4 with FFmpeg and visually compare with the checkpoint set.
- [ ] Run full decode and adjacent-frame difference scan; reject mosaic/scale anomalies.
- [ ] Atomically publish repository and preview copies only after validation, retaining temporary backups for replacements.
- [ ] Verify temp/repository/preview SHA-256 equality and ffprobe H.264, 1920×1080, 30/1, exact frame count, and zero audio streams.

## Self-review

- Scope is Fidelity-only for eight already-approved shots; no Fast component is introduced.
- Every matrix row has a component, timing state, test, registry entry, QA set, output name, and render step.
- A-roll use is limited to three selected assets and never copies the reference speaker.
- The plan retains the known safe single-concurrency render constraint and the existing R03 namespace.
