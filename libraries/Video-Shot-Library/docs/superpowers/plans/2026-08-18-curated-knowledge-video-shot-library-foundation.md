# Curated Knowledge Video Shot Library Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不破坏现有 Legacy 镜头与 Shot Runtime ID 的前提下，为 16:9 知识口播建立 Curated v2 的数据契约、参考视频接入、质量门槛、运行时注册和 Gallery 分层入口。

**Architecture:** `curated-v2/` 保存参考分析、镜头源码、fixture 和质量记录；`source/curated-v2-entries.json` 是进入 Catalog 的唯一清单。FFprobe 负责读取完整参考视频的画面与声音元数据；现有 `scripts/build-library-data.mjs` 将通过质量门槛的精选镜头合并进 `public/data/library.json`。FFmpeg 场景检测、关键帧提取和实际镜头家族在每条参考视频到位后按独立批次计划实现。

**Tech Stack:** TypeScript 5.9、React 19、Remotion 4.0、Node.js 24 test runner、FFmpeg/FFprobe 8.1、vinext/Next Gallery。

---

## Scope Boundary

本计划只建设可运行、可测试的精选镜头基础设施和视频接入链路，不虚构任何尚未看到的参考镜头。第一条视频到位后，先运行本计划提供的接入命令，再为该视频生成包含具体时间码、镜头家族和 TSX 文件的批次实施计划。

执行前必须在独立 worktree 中工作，因为当前 `agent/update-all-a-roll` 工作区已有用户未提交改动：

```bash
git worktree add ../Video-Shot-Library-curated-v2 -b agent/curated-v2-foundation
cd ../Video-Shot-Library-curated-v2
```

## Planned File Map

```text
curated-v2/
├── core/
│   ├── schema.ts                 # Curated manifest 的类型与运行时校验
│   ├── quality.ts                # 50 分候选评分与 100 分发布评分
│   └── media-probe.ts            # FFprobe JSON 的纯函数解析
├── references/README.md          # 本地参考视频与分析档案规则
├── recipes/README.md             # 镜头家族和 variant 配方规则
├── shots/README.md               # Remotion 镜头目录约定
├── fixtures/README.md            # shortest/default/stress fixture 约定
└── quality/README.md             # 四道验收门槛和评分记录
scripts/
├── curated-reference.mjs         # 视频元数据探测与分析档案初始化 CLI
├── curated-quality-check.mjs     # 发布前质量与文件完整性校验
└── build-library-data.mjs        # 合并 Curated v2 Catalog
source/curated-v2-entries.json     # 精选镜头发布清单，初始为空数组
shot-runtime/adapters/curated-v2.ts # 精选镜头 adapter 注册表
shot-runtime/registry.ts            # 用 runtimeKind 判断可执行性
app/library-model.ts              # tier/rollType/family/variant 数据与筛选
app/shot-library.tsx              # Curated/Legacy 分层筛选入口
tests/
├── curated-v2-schema.test.mjs
├── curated-media-probe.test.mjs
├── curated-quality.test.mjs
└── curated-library.test.mjs
```

### Task 1: Establish the Curated v2 Manifest Contract

**Files:**
- Create: `curated-v2/core/schema.ts`
- Create: `source/curated-v2-entries.json`
- Create: `tests/curated-v2-schema.test.mjs`
- Modify: `tsconfig.json`
- Modify: `package.json`

- [ ] **Step 1: Write the failing schema tests**

Create fixtures in `tests/curated-v2-schema.test.mjs` that assert a valid entry passes and invalid ID, aspect ratio, score, roll type, fixture set, or file path throws:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {validateCuratedEntries} from "../curated-v2/core/schema.ts";

const valid = {
  id: "curated/concept/orbit-comparison",
  familyId: "orbit-comparison",
  variantId: "default",
  title: "轨道对比",
  summary: "用两条轨道解释概念差异",
  use: "概念对比",
  category: "concept",
  rollType: "B-roll",
  qualityScore: 88,
  composition: {width: 1920, height: 1080, fps: 30, durationInFrames: 150},
  sourceFiles: ["curated-v2/shots/concept/orbit-comparison/Shot.tsx"],
  analysisPath: "curated-v2/references/reference-001/orbit-comparison.md",
  previewUrl: "/media/curated-v2/orbit-comparison-default.mp4",
  fixtures: ["shortest", "default", "stress"],
  tags: ["概念", "对比"],
};

test("accepts a publishable curated entry", () => {
  assert.deepEqual(validateCuratedEntries([valid]), [valid]);
});

test("rejects entries below the publish threshold", () => {
  assert.throws(
    () => validateCuratedEntries([{...valid, qualityScore: 84}]),
    /qualityScore must be at least 85/,
  );
});

test("requires the three content fixtures", () => {
  assert.throws(
    () => validateCuratedEntries([{...valid, fixtures: ["default"]}]),
    /shortest, default, stress/,
  );
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/curated-v2-schema.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `curated-v2/core/schema.ts`.

- [ ] **Step 3: Implement the manifest type and validator**

Create `CuratedEntry`, `CuratedComposition`, and `validateCuratedEntries()` in `curated-v2/core/schema.ts`. The validator must enforce:

```ts
export type CuratedRollType = "A-roll" | "B-roll";
export type CuratedFixture = "shortest" | "default" | "stress";

export type CuratedEntry = {
  id: `curated/${string}`;
  familyId: string;
  variantId: string;
  title: string;
  summary: string;
  use: string;
  category: string;
  rollType: CuratedRollType;
  qualityScore: number;
  composition: {
    width: 1920;
    height: 1080;
    fps: 30;
    durationInFrames: number;
  };
  sourceFiles: string[];
  analysisPath: string;
  previewUrl: string;
  fixtures: CuratedFixture[];
  tags: string[];
};
```

Reject duplicate `id`, unsafe relative paths, non-1920×1080 compositions, non-30fps entries, non-positive durations, scores outside 85–100, empty text fields, and fixture sets that do not contain all three required values. Return a cloned array so callers cannot mutate the parsed JSON by reference.

- [ ] **Step 4: Add the empty publication manifest and TypeScript coverage**

Create `source/curated-v2-entries.json` with:

```json
[]
```

Add `"curated-v2/**/*.ts"` to `tsconfig.json#include`. Add the new schema test to `test:data` and add this script to `package.json`:

```json
"curated:check": "node scripts/curated-quality-check.mjs"
```

- [ ] **Step 5: Run the focused tests and typecheck**

Run: `node --test tests/curated-v2-schema.test.mjs && npx tsc --noEmit`

Expected: PASS with zero TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add curated-v2/core/schema.ts source/curated-v2-entries.json tests/curated-v2-schema.test.mjs tsconfig.json package.json
git commit -m "feat: define curated shot manifest"
```

### Task 2: Add Deterministic Reference Video Probing

**Files:**
- Create: `curated-v2/core/media-probe.ts`
- Create: `scripts/curated-reference.mjs`
- Create: `tests/curated-media-probe.test.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Write failing pure-function tests for FFprobe output**

Use an inline FFprobe fixture with one H.264 video stream and one AAC audio stream. Assert the parser returns width, height, fps, duration, codec names, and `hasAudio`; add a video-only fixture and assert `hasAudio === false`.

```js
const probe = {
  format: {duration: "12.5"},
  streams: [
    {codec_type: "video", codec_name: "h264", width: 1920, height: 1080, r_frame_rate: "30/1"},
    {codec_type: "audio", codec_name: "aac", sample_rate: "48000"},
  ],
};

assert.deepEqual(parseMediaProbe(probe), {
  width: 1920,
  height: 1080,
  fps: 30,
  durationSeconds: 12.5,
  videoCodec: "h264",
  audioCodec: "aac",
  sampleRate: 48000,
  hasAudio: true,
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/curated-media-probe.test.mjs`

Expected: FAIL because `parseMediaProbe` does not exist.

- [ ] **Step 3: Implement the pure parser**

Create `parseFrameRate(value)` and `parseMediaProbe(value)` in `curated-v2/core/media-probe.ts`. Throw explicit `TypeError` messages for missing video streams, invalid dimensions, invalid duration, and zero-denominator frame rates. Audio is optional and must never make visual analysis fail.

- [ ] **Step 4: Implement the CLI wrapper without copying the source video**

Create `scripts/curated-reference.mjs` with CLI syntax:

```bash
node scripts/curated-reference.mjs --input /absolute/path/video.mp4 --id reference-001
```

The CLI must:

1. Resolve and verify the input is a file.
2. Spawn `/opt/homebrew/bin/ffprobe` if present, otherwise resolve `ffprobe` from `PATH`.
3. Run `ffprobe -v error -show_streams -show_format -of json <input>` without shell interpolation.
4. Parse the JSON through `parseMediaProbe()`.
5. Create `curated-v2/references/<id>/reference.json` containing source basename, probe results, created timestamp, and an empty `candidates` array.
6. Never copy or commit the original video.

Use `spawnSync(binary, args, {encoding: "utf8"})`; do not use `exec()` or construct a shell command string.

- [ ] **Step 5: Ignore local reference media and analysis scratch files**

Append these entries to `.gitignore`:

```gitignore
/curated-v2/inbox/
/curated-v2/work/
/curated-v2/references/**/frames/
```

Do not ignore `reference.json` or reviewed Markdown analysis files.

- [ ] **Step 6: Add scripts and run focused checks**

Add to `package.json`:

```json
"curated:probe": "node scripts/curated-reference.mjs"
```

Run: `node --test tests/curated-media-probe.test.mjs && npm run lint -- --no-warn-ignored scripts/curated-reference.mjs`

Expected: PASS. A video-only fixture must pass with `hasAudio: false`.

- [ ] **Step 7: Commit**

```bash
git add .gitignore package.json curated-v2/core/media-probe.ts scripts/curated-reference.mjs tests/curated-media-probe.test.mjs
git commit -m "feat: probe curated reference videos"
```

### Task 3: Encode Candidate and Publication Quality Gates

**Files:**
- Create: `curated-v2/core/quality.ts`
- Create: `scripts/curated-quality-check.mjs`
- Create: `tests/curated-quality.test.mjs`

- [ ] **Step 1: Write failing tests for both score systems**

Test these public functions:

```ts
scoreCandidate({information: 8, visual: 8, camera: 7, reuse: 8, value: 7});
// => {total: 38, accepted: true}

scoreCandidate({information: 6, visual: 10, camera: 10, reuse: 10, value: 10});
// => {total: 46, accepted: false} because information < 7

scorePublication({clarity: 23, finish: 18, rhythm: 18, space: 13, adaptability: 12, stability: 5});
// => {total: 89, status: "publish"}
```

Also test `refine` for 75–84, `reject` below 75, and rejection of fractional, negative, or over-maximum dimension scores.

- [ ] **Step 2: Run the tests and verify failure**

Run: `node --test tests/curated-quality.test.mjs`

Expected: FAIL because `curated-v2/core/quality.ts` is missing.

- [ ] **Step 3: Implement pure score functions**

Implement immutable result objects and fixed maxima:

```ts
export const CANDIDATE_MAX = {information: 10, visual: 10, camera: 10, reuse: 10, value: 10} as const;
export const PUBLICATION_MAX = {clarity: 25, finish: 20, rhythm: 20, space: 15, adaptability: 15, stability: 5} as const;
```

`scoreCandidate()` accepts only when total is at least 38 and both `information` and `reuse` are at least 7. `scorePublication()` returns `publish` at 85+, `refine` at 75–84, and `reject` below 75.

- [ ] **Step 4: Implement the publication checker**

`scripts/curated-quality-check.mjs` must read `source/curated-v2-entries.json`, call `validateCuratedEntries()`, and verify that every declared `sourceFiles` and `analysisPath` exists below the repository root. It must print `Curated v2: N publishable entries` and exit 0, or print every validation error and exit 1.

- [ ] **Step 5: Run focused checks**

Run: `node --test tests/curated-quality.test.mjs tests/curated-v2-schema.test.mjs && npm run curated:check`

Expected with the initial empty manifest: all tests PASS and `Curated v2: 0 publishable entries`.

- [ ] **Step 6: Commit**

```bash
git add curated-v2/core/quality.ts scripts/curated-quality-check.mjs tests/curated-quality.test.mjs
git commit -m "feat: enforce curated quality gates"
```

### Task 4: Merge Curated Entries into the Existing Catalog

**Files:**
- Modify: `scripts/build-library-data.mjs`
- Modify: `tests/library-data.test.mjs`
- Create: `tests/curated-library.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing catalog conversion tests**

Add a `createCuratedCards()` unit test using one valid Curated entry. Assert the card has:

```js
{
  id: "curated/concept/orbit-comparison",
  collection: "curated-v2",
  tier: "curated",
  rollType: "B-roll",
  familyId: "orbit-comparison",
  variantId: "default",
  grade: "S",
  score: 88,
  previewKind: "video",
  runtimeKind: "executable",
  compositionId: "curated/concept/orbit-comparison",
}
```

Assert existing upstream, graded, and A-roll cards receive `tier: "legacy"` without changing their IDs. Existing卡片同时获得显式 `runtimeKind`：当前 Player 卡为 `executable`，当前 MP4 卡为 `reference`。

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test tests/curated-library.test.mjs`

Expected: FAIL because `createCuratedCards` is not exported.

- [ ] **Step 3: Add Curated data loading and conversion**

In `createLibraryData()`, read `source/curated-v2-entries.json`, validate it, pass it to `mergeCatalogs()`, and append cards returned by `createCuratedCards()`. The converter must preserve family/variant metadata and expose a single MP4 style using `previewUrl`.

Add these category labels only when at least one curated card uses them:

```js
const CURATED_CATEGORY_LABELS = {
  concept: {zh: "概念解释", en: "Concept Explanation"},
  process: {zh: "流程与因果", en: "Process & Causality"},
  data: {zh: "数据与证据", en: "Data & Evidence"},
  timeline: {zh: "时间线", en: "Timeline"},
  documents: {zh: "文献与案例", en: "Documents & Cases"},
  maps: {zh: "地图与空间", en: "Maps & Space"},
  montage: {zh: "素材蒙太奇", en: "Montage"},
  transition: {zh: "章节过渡", en: "Transitions"},
  summary: {zh: "总结回收", en: "Summary"},
  "a-roll": {zh: "A-roll 人物主镜头", en: "A-roll Presenter Shots"},
};
```

- [ ] **Step 4: Preserve generated data determinism**

Sort Curated entries by `id`; recompute card/style/media counts after all four sources are merged. Do not inject current timestamps into individual cards. Preserve the existing duplicate-ID error across Legacy and Curated entries.

- [ ] **Step 5: Add the new test to `test:data` and verify**

Run: `node --test tests/curated-library.test.mjs tests/library-data.test.mjs && npm run data:build && npm run data:check`

Expected: PASS and the empty Curated manifest causes no changes to existing card IDs.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-library-data.mjs tests/library-data.test.mjs tests/curated-library.test.mjs package.json public/data/library.json
git commit -m "feat: merge curated shots into catalog"
```

### Task 5: Extend the Shot Runtime for Curated Adapters

**Files:**
- Create: `shot-runtime/adapters/curated-v2.ts`
- Modify: `shot-runtime/index.ts`
- Modify: `shot-runtime/types.ts`
- Modify: `shot-runtime/registry.ts`
- Modify: `tests/shot-runtime-registry.test.mjs`

- [ ] **Step 1: Write a failing Curated adapter coverage test**

Add a test that imports `curatedV2Adapters`, creates a fake Curated card with `runtimeKind: "executable"` and `previewKind: "video"`, and asserts `createShotRegistry()` returns an executable definition while retaining its MP4 Gallery preview. Also assert an entry marked `runtimeKind: "executable"` fails if its adapter is missing.

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/shot-runtime-registry.test.mjs`

Expected: FAIL because `shot-runtime/adapters/curated-v2.ts` is missing.

- [ ] **Step 3: Create the initially empty adapter registry**

Create:

```ts
import type {ShotAdapter} from "./shared.ts";

export const curatedV2Adapters: Readonly<Record<string, ShotAdapter>> = {};
```

Update `shot-runtime/index.ts`:

```ts
import {curatedV2Adapters} from "./adapters/curated-v2.ts";

const registry = createShotRegistry(catalog.cards as CatalogCard[], {
  ...remocnAdapters,
  ...remotionBitsAdapters,
  ...curatedV2Adapters,
});
```

Extend `ShotMetadata` with `tier: "curated" | "legacy"`, `rollType: "A-roll" | "B-roll" | null`, `familyId: string | null`, and `variantId: string | null`; update `CatalogCard` and `metadataFromCard()` consistently. Add `runtimeKind: "executable" | "reference"` to `CatalogCard`, and change `createShotRegistry()` to choose the executable branch from `runtimeKind` instead of `previewKind`. This separates Gallery playback from runtime capability.

- [ ] **Step 4: Keep empty-manifest behavior valid**

Update existing test fixtures with Legacy defaults. The test suite must pass while `curatedV2Adapters` is empty, because no Curated entry is published before the first video batch.

- [ ] **Step 5: Run runtime tests and typecheck**

Run: `node --test tests/shot-runtime-core.test.mjs tests/shot-runtime-registry.test.mjs && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add shot-runtime/adapters/curated-v2.ts shot-runtime/index.ts shot-runtime/types.ts shot-runtime/registry.ts tests/shot-runtime-registry.test.mjs
git commit -m "feat: register curated shot adapters"
```

### Task 6: Add Curated and Legacy Gallery Tiers

**Files:**
- Modify: `app/library-model.ts`
- Modify: `app/shot-library.tsx`
- Modify: `app/shot-card.tsx`
- Modify: `app/globals.css`
- Modify: `tests/library-ui-model.test.mjs`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Write failing tier filter tests**

Extend the card fixtures with `tier`. Add assertions for `tier: "curated"`, `tier: "legacy"`, and `tier: "all"`, while preserving category, grade, tag, and text filter combinations.

```js
assert.deepEqual(
  filterCards(cards, "", "all", {grade: "all", tags: [], tier: "curated"}).map((card) => card.id),
  ["curated/concept/orbit-comparison"],
);
```

- [ ] **Step 2: Run the model test and verify failure**

Run: `node --test tests/library-ui-model.test.mjs`

Expected: FAIL because `LibraryFilters` has no `tier` field.

- [ ] **Step 3: Add tier types and filtering**

Extend `LibraryCard` with:

```ts
tier: "curated" | "legacy";
runtimeKind: "executable" | "reference";
rollType: "A-roll" | "B-roll" | null;
familyId: string | null;
variantId: string | null;
```

Extend `LibraryFilters` with `tier: "all" | "curated" | "legacy"`. Filter exact tier before the text query. Include `rollType`, `familyId`, and `variantId` in searchable values.

- [ ] **Step 4: Add the Gallery control and default behavior**

In `ShotLibrary`, derive the initial tier after Catalog load:

- If at least one Curated card exists, default to `curated`.
- If the Curated manifest is empty, default to `all` so the current Gallery does not appear blank.
- Provide three visible buttons: `精选`, `Legacy`, `全部`.
- Reset must return to `curated` when Curated cards exist, otherwise `all`.

Show a `CURATED` badge on Curated cards and a `LEGACY` badge only when the user is viewing `all`.

- [ ] **Step 5: Add rendered HTML assertions and styles**

Assert the production HTML contains the tier control labels and accessible group name `镜头库层级`. Add compact badge and filter styles without changing the current card aspect ratio.

- [ ] **Step 6: Run UI checks**

Run: `node --test tests/library-ui-model.test.mjs tests/rendered-html.test.mjs && npm run build`

Expected: PASS. With an empty Curated manifest, all existing cards remain visible.

- [ ] **Step 7: Commit**

```bash
git add app/library-model.ts app/shot-library.tsx app/shot-card.tsx app/globals.css tests/library-ui-model.test.mjs tests/rendered-html.test.mjs
git commit -m "feat: separate curated and legacy shots"
```

### Task 7: Document the Repeatable Per-Video Production Contract

**Files:**
- Create: `curated-v2/references/README.md`
- Create: `curated-v2/recipes/README.md`
- Create: `curated-v2/shots/README.md`
- Create: `curated-v2/fixtures/README.md`
- Create: `curated-v2/quality/README.md`
- Modify: `README_CN.md`

- [ ] **Step 1: Write the reference analysis contract**

`curated-v2/references/README.md` must define `reference.json`, candidate timecodes, the 50-point score, and the Markdown analysis fields: key frames, typography, layout, layer motion, camera, parallax, texture, audio sync, originality boundary, and chosen family/variant.

- [ ] **Step 2: Write the shot and recipe contracts**

Define the exact per-family structure:

```text
curated-v2/shots/<category>/<family-id>/
├── Shot.tsx
├── schema.ts
├── motion.ts
├── camera.ts
├── fixtures.ts
├── layers/
└── shot.test.ts
```

Require 1920×1080, 30fps, seeded randomness, frame-driven animation, and content/theme/timing/camera parameter groups.

- [ ] **Step 3: Write fixture and quality contracts**

Define `shortest`, `default`, and `stress` fixtures and the 100-point scoring rubric. State that only `publish` records may be added to `source/curated-v2-entries.json`.

- [ ] **Step 4: Add the Chinese README entry point**

Add a short `Curated v2 知识口播精选库` section to `README_CN.md` linking to the design, this plan, and the five operational READMEs. Do not claim the initial 36–50 shots exist before they are implemented.

- [ ] **Step 5: Verify documentation and commit**

Run: `rg -n 'TB[D]|TO[DO]|待.{1,2}|place' curated-v2 README_CN.md docs/superpowers/plans/2026-08-18-curated-knowledge-video-shot-library-foundation.md`

Expected: no matches.

```bash
git add curated-v2/references/README.md curated-v2/recipes/README.md curated-v2/shots/README.md curated-v2/fixtures/README.md curated-v2/quality/README.md README_CN.md
git commit -m "docs: define curated video production workflow"
```

### Task 8: Run the Foundation Verification Gate

**Files:**
- Modify only if checks expose defects in files created by Tasks 1–7.

- [ ] **Step 1: Verify generated data and quality manifest**

Run: `npm run curated:check && npm run data:check`

Expected: `Curated v2: 0 publishable entries` and data check PASS.

- [ ] **Step 2: Run focused data and runtime tests**

Run: `npm run test:data`

Expected: all data, UI model, quality, Catalog, and Shot Runtime tests PASS.

- [ ] **Step 3: Run type and lint checks**

Run: `npm run typecheck && npm run lint`

Expected: both commands exit 0.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: vinext production build completes and rendered HTML checks pass.

- [ ] **Step 5: Confirm the user worktree remained untouched**

Run in the original worktree: `git -C ../Video-Shot-Library status --short`

Expected: the pre-existing A-roll changes are still present and no Curated implementation files were added there.

- [ ] **Step 6: Commit any verification-only fixes**

If Tasks 1–7 already pass unchanged, do not create an empty commit. If a focused defect was fixed:

```bash
git add <only-the-files-fixed-during-verification>
git commit -m "fix: complete curated foundation verification"
```

## First Reference Video Handoff

After Task 8 passes, accept the first full MP4/MOV with original audio when available. Run:

```bash
npm run curated:probe -- --input /absolute/path/reference-video.mp4 --id reference-001
```

Then inspect the generated metadata and use FFmpeg scene detection/keyframe extraction in a video-specific plan. That plan must name the actual reference timecodes, proposed B-roll/A-roll families, analysis files, Remotion TSX files, fixtures, adapters, previews, and per-shot tests. Do not add an entry to `source/curated-v2-entries.json` until its publication score reaches 85 and all declared files exist.
