# Orange Eagle Category Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce orange `#FF6900` MP4 previews for all 98 camera/data/typography site entries, update the 47 existing Eagle items in place, and import only the 51 missing items.

**Architecture:** A small Node pipeline reads `public/data/library.json`, derives stable unique identities, renders player-only Remotion compositions through a dedicated export root, applies one generated 3D LUT with FFmpeg, and synchronizes results with Eagle through its local API. Existing Eagle binaries are backed up and atomically replaced; missing items are added once to their current category folders.

**Tech Stack:** Node.js ESM, Remotion 4.0.499 CLI, FFmpeg/ffprobe, Eagle local API v2, `node:test`.

---

### Task 1: Lock target selection and identity rules

**Files:**
- Create: `scripts/orange-eagle/manifest.mjs`
- Create: `tests/orange-eagle-manifest.test.mjs`

- [ ] **Step 1: Write the failing manifest test**

Test that the three category IDs select 98 styles, split as 47 existing-source and 51 new-source entries, and that player entries use `compositionId` instead of the repeated `default` style key.

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/orange-eagle-manifest.test.mjs`

Expected: FAIL because `scripts/orange-eagle/manifest.mjs` does not exist.

- [ ] **Step 3: Implement the selector**

Export `loadTargets(libraryPath)` returning records with `identity`, `collection`, `categoryId`, `categoryName`, `cardId`, `styleKey`, `compositionId`, `mediaUrl`, and `previewKind`. Set `identity` to `style.key` unless it is `default`; for `default`, use `compositionId`, then fall back to `card.id`.

- [ ] **Step 4: Run the test and confirm pass**

Run: `node --test tests/orange-eagle-manifest.test.mjs`

Expected: PASS with 98 unique identities.

- [ ] **Step 5: Commit**

```bash
git add scripts/orange-eagle/manifest.mjs tests/orange-eagle-manifest.test.mjs
git commit -m "test: lock orange Eagle export manifest"
```

### Task 2: Create deterministic orange LUT processing

**Files:**
- Create: `scripts/orange-eagle/lut.mjs`
- Create: `tests/orange-eagle-lut.test.mjs`

- [ ] **Step 1: Write the failing LUT test**

Test pure `mapRgbToOrange(r, g, b)` behavior: neutral RGB values remain neutral; saturated red, blue, and green map to the hue of `#FF6900`; mapped luminance remains within 8% of input luminance.

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/orange-eagle-lut.test.mjs`

Expected: FAIL because the LUT module does not exist.

- [ ] **Step 3: Implement LUT generation**

Implement a 33-point `.cube` generator. Preserve pixels below a saturation threshold of `0.12`; above it, blend toward orange hue while preserving value and a minimum useful saturation. Export `writeOrangeCube(path, { target: "#FF6900", size: 33 })`.

- [ ] **Step 4: Run tests and an FFmpeg smoke conversion**

Run:

```bash
node --test tests/orange-eagle-lut.test.mjs
ffmpeg -hide_banner -y -f lavfi -i testsrc2=size=320x180:rate=30 -t 1 -vf "lut3d=orange.cube" /tmp/orange-lut-smoke.mp4
ffprobe -v error -show_entries stream=codec_name,width,height -of json /tmp/orange-lut-smoke.mp4
```

Expected: tests PASS; ffprobe reports H.264 video at 320×180.

- [ ] **Step 5: Commit**

```bash
git add scripts/orange-eagle/lut.mjs tests/orange-eagle-lut.test.mjs
git commit -m "feat: add deterministic orange video LUT"
```

### Task 3: Add a Remotion export root for player-only entries

**Files:**
- Create: `players/export/index.ts`
- Create: `players/export/Root.tsx`

- [ ] **Step 1: Create the composition root**

Import `remocnScenes` and `bitScenes` from the generated player registries. Declare one `<Composition>` for every scene, using each registry's existing duration, fps, width, height, and input props. Prefix internal composition IDs only if two registries collide; keep a map from site `compositionId` to render ID.

- [ ] **Step 2: List compositions**

Run:

```bash
npx --yes @remotion/cli@4.0.499 compositions players/export/index.ts
```

Expected: all 44 target player compositions appear with valid dimensions and durations.

- [ ] **Step 3: Render one Remocn and one Remotion Bits pilot**

Run the CLI render command for `animated-bar-chart` and `bit-ken-burns` into a temporary export directory.

Expected: both MP4 files pass ffprobe and contain at least 30 frames.

- [ ] **Step 4: Commit**

```bash
git add players/export/index.ts players/export/Root.tsx
git commit -m "feat: add Remotion export root for library players"
```

### Task 4: Build the idempotent Eagle synchronization pipeline

**Files:**
- Create: `scripts/export-orange-eagle.mjs`
- Create: `tests/orange-eagle-sync.test.mjs`

- [ ] **Step 1: Write sync decision tests**

Cover three cases for each identity: zero Eagle matches yields `add`; one match yields `replace`; more than one yields `conflict`. Confirm only the 51 absent identities are eligible for `add`.

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/orange-eagle-sync.test.mjs`

Expected: FAIL because the sync module does not exist.

- [ ] **Step 3: Implement dry-run and execution modes**

The script must:

- read the 98-target manifest;
- query all Eagle targets and refuse duplicate matches;
- download/copy the 54 media-backed sources and render the 44 player sources;
- apply the orange LUT with H.264/yuv420p output while preserving source fps and dimensions;
- back up existing 47 MP4 files before atomic replacement;
- call `/api/v2/item/refreshThumbnail` for replaced entries;
- add only the 51 missing entries with `统一镜头库`, `站点镜头`, `橘色主色`, `FF6900`, source, series, type, card, and style tags;
- place each new item in its existing category folder.

Default mode is `--dry-run`; mutations require `--execute`.

- [ ] **Step 4: Run unit tests and dry-run**

Run:

```bash
node --test tests/orange-eagle-manifest.test.mjs tests/orange-eagle-lut.test.mjs tests/orange-eagle-sync.test.mjs
node scripts/export-orange-eagle.mjs --dry-run
```

Expected: tests PASS; dry-run reports `replace=47`, `add=51`, `conflict=0`.

- [ ] **Step 5: Commit**

```bash
git add scripts/export-orange-eagle.mjs tests/orange-eagle-sync.test.mjs
git commit -m "feat: synchronize orange category previews to Eagle"
```

### Task 5: Execute, inspect, and verify

**Files:**
- Runtime outputs only: a timestamped temporary export/backup directory outside the repository
- External state: `/Users/admin/Documents/镜头库.library`

- [ ] **Step 1: Execute the pipeline**

Run: `node scripts/export-orange-eagle.mjs --execute`

Expected: 98 successful orange outputs, 47 replacements, 51 additions, 0 conflicts.

- [ ] **Step 2: Verify media integrity**

Run ffprobe over all 98 Eagle MP4 paths and require valid H.264 video, positive width/height/duration, and zero decoding errors.

- [ ] **Step 3: Verify Eagle state**

Query the local API and require exactly one item per target identity, correct category folder, required orange/source/type tags, unchanged IDs for the original 47, and no additions beyond the expected 51.

- [ ] **Step 4: Verify color treatment**

Extract first, middle, and final frames from all 98 videos. Measure saturated-pixel hue: orange must be dominant and neutral pixels must remain low-saturation. Manually inspect a representative sample from each source collection.

- [ ] **Step 5: Run independent final audit**

Have a clean-context reviewer check the manifest counts, duplicate rules, Eagle query results, ffprobe report, and sampled frames against the approved design.

