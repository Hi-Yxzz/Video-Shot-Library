# Shot Category Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reclassify all three shot collections by primary visual purpose so text, number, page movement, and scene transitions no longer fall into “光效与强调”.

**Architecture:** Add one taxonomy module that owns upstream category mapping, explicit namespaced shot overrides, and unknown-category validation. Both the graded importer and the final catalog builder consume this module, so future imports and the current committed snapshots produce the same categories.

**Tech Stack:** Node.js ESM, built-in `node:test`, JSON catalog generation, existing npm validation scripts.

---

## File map

- Create `scripts/shot-categories.mjs`: single source of truth for base mappings, namespaced overrides, validation, and card reclassification.
- Create `tests/shot-categories.test.mjs`: focused taxonomy unit tests.
- Modify `scripts/graded-library.mjs`: replace its local category map and `effects` fallback with the taxonomy module.
- Modify `scripts/build-library-data.mjs`: apply the same overrides to Video Shotcraft cards and committed graded snapshots.
- Modify `tests/graded-library.test.mjs`: assert imported fixture categories and unknown-category failures.
- Modify `tests/library-data.test.mjs`: assert normalization and merge paths both use the taxonomy.
- Modify `package.json`: include the focused taxonomy test in `test:data`.
- Modify `source/graded-library.json`: refresh committed graded categories with the shared reclassifier.
- Modify `public/data/library.json`: regenerate the final local catalog and category counts.

### Task 1: Define the taxonomy contract with failing tests

**Files:**
- Create: `tests/shot-categories.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create focused failing tests**

Create `tests/shot-categories.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import {
  categoryForGradedShot,
  categoryForLibraryCard,
} from "../scripts/shot-categories.mjs";

test("classifies text and number performances as typography", () => {
  for (const id of [
    "hand-count",
    "handwrite",
    "kinetic-center-build",
    "line-by-line-slide",
    "mask-reveal-up",
    "rolodex-flip",
    "slot-machine-roll",
    "spring-scale-in",
    "staggered-fade-up",
    "strikethrough-replace",
  ]) {
    assert.equal(
      categoryForGradedShot({
        collection: "remocn",
        id,
        upstreamCategory: "视觉效果",
      }),
      "typography",
    );
  }
});

test("separates page movement by visual purpose", () => {
  const expected = new Map([
    ["drift", "camera"],
    ["fade-through", "transition"],
    ["icon-scatter", "transition"],
    ["push-through", "transition"],
    ["ripple-zoom", "transition"],
    ["shared-axis-y", "transition"],
    ["shared-axis-z", "transition"],
  ]);

  for (const [id, category] of expected) {
    assert.equal(
      categoryForGradedShot({
        collection: "remocn",
        id,
        upstreamCategory: "视觉效果",
      }),
      category,
    );
  }
});

test("keeps pure shaders and particles in effects", () => {
  assert.equal(
    categoryForGradedShot({
      collection: "remocn",
      id: "shader-god-rays",
      upstreamCategory: "Shader背景",
    }),
    "effects",
  );
  assert.equal(
    categoryForGradedShot({
      collection: "remotion-bits",
      id: "bit-fireflies",
      upstreamCategory: "粒子效果",
    }),
    "effects",
  );
});

test("applies unified overrides to existing cards from every collection", () => {
  assert.equal(
    categoryForLibraryCard({
      collection: "video-shotcraft",
      id: "line-boil",
      category: "effects",
    }),
    "typography",
  );
  assert.equal(
    categoryForLibraryCard({
      collection: "remocn",
      upstreamId: "drift",
      category: "effects",
    }),
    "camera",
  );
});

test("rejects unknown graded categories instead of defaulting to effects", () => {
  assert.throws(
    () =>
      categoryForGradedShot({
        collection: "remocn",
        id: "new-shot",
        upstreamCategory: "未定义类别",
      }),
    /Unknown graded shot category "未定义类别" for remocn\/new-shot/,
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/shot-categories.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/shot-categories.mjs`.

- [ ] **Step 3: Register the new test in the standard data suite**

Change `package.json`:

```json
"test:data": "node --test tests/library-data.test.mjs tests/library-ui-model.test.mjs tests/graded-library.test.mjs tests/player-manifest.test.mjs tests/shot-categories.test.mjs"
```

- [ ] **Step 4: Commit the failing test contract**

```bash
git add tests/shot-categories.test.mjs package.json
git commit -m "test: define unified shot category taxonomy"
```

### Task 2: Implement the shared taxonomy module

**Files:**
- Create: `scripts/shot-categories.mjs`
- Test: `tests/shot-categories.test.mjs`

- [ ] **Step 1: Add the base mapping and explicit namespaced overrides**

Create `scripts/shot-categories.mjs`:

```js
const GRADED_CATEGORY_MAP = new Map([
  ["3D场景", "camera"],
  ["Shader背景", "effects"],
  ["UI组件", "interaction"],
  ["产品演示", "interaction"],
  ["代码演示", "interaction"],
  ["光标交互", "interaction"],
  ["动态背景", "effects"],
  ["图片媒体", "rhythm"],
  ["品牌Logo", "opening"],
  ["数据图表", "data"],
  ["文字动效", "typography"],
  ["粒子效果", "effects"],
  ["组合场景", "rhythm"],
  ["聊天界面", "interaction"],
  ["视觉效果", "effects"],
  ["转场", "transition"],
]);

const CATEGORY_OVERRIDES = new Map([
  ["video-shotcraft/line-boil", "typography"],
  ["video-shotcraft/slam-entrance-moves", "ui-entrance"],
  ["remocn/check-list", "typography"],
  ["remocn/drift", "camera"],
  ["remocn/ecosystem-constellation", "data"],
  ["remocn/fade-through", "transition"],
  ["remocn/hand-count", "typography"],
  ["remocn/handwrite", "typography"],
  ["remocn/icon-scatter", "transition"],
  ["remocn/kinetic-center-build", "typography"],
  ["remocn/line-by-line-slide", "typography"],
  ["remocn/mask-reveal-up", "typography"],
  ["remocn/paper-sticker", "ui-entrance"],
  ["remocn/polaroid", "ui-entrance"],
  ["remocn/progress-steps", "interaction"],
  ["remocn/push-through", "transition"],
  ["remocn/ripple-zoom", "transition"],
  ["remocn/rolodex-flip", "typography"],
  ["remocn/shared-axis-y", "transition"],
  ["remocn/shared-axis-z", "transition"],
  ["remocn/simulated-cursor", "interaction"],
  ["remocn/slot-machine-roll", "typography"],
  ["remocn/spring-scale-in", "typography"],
  ["remocn/staggered-fade-up", "typography"],
  ["remocn/strikethrough-replace", "typography"],
  ["remocn/x-follow-card", "interaction"],
  ["remocn/x-followers-overview", "interaction"],
]);

function categoryKey(collection, id) {
  return `${collection}/${id}`;
}

export function categoryForGradedShot({
  collection,
  id,
  upstreamCategory,
}) {
  const mappedCategory = GRADED_CATEGORY_MAP.get(upstreamCategory);
  if (!mappedCategory) {
    throw new TypeError(
      `Unknown graded shot category "${upstreamCategory}" for ${categoryKey(collection, id)}`,
    );
  }

  return CATEGORY_OVERRIDES.get(categoryKey(collection, id)) ?? mappedCategory;
}

export function categoryForLibraryCard(card) {
  const id = card.upstreamId ?? card.id;
  return CATEGORY_OVERRIDES.get(categoryKey(card.collection, id)) ?? card.category;
}

export function reclassifyLibraryCards(cards) {
  return cards.map((card) => ({
    ...card,
    category: categoryForLibraryCard(card),
  }));
}
```

- [ ] **Step 2: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/shot-categories.test.mjs
```

Expected: 5 tests pass.

- [ ] **Step 3: Run lint for the new module**

Run:

```bash
npx eslint scripts/shot-categories.mjs tests/shot-categories.test.mjs
```

Expected: exit code 0.

- [ ] **Step 4: Commit the taxonomy implementation**

```bash
git add scripts/shot-categories.mjs
git commit -m "feat: add unified shot category taxonomy"
```

### Task 3: Integrate taxonomy into graded imports

**Files:**
- Modify: `scripts/graded-library.mjs`
- Modify: `tests/graded-library.test.mjs`

- [ ] **Step 1: Add failing importer assertions**

In `tests/graded-library.test.mjs`, extend the first import fixture with an unknown category case tested separately and add these assertions after the existing catalog assertions:

```js
  assert.equal(
    catalog.cards.find((card) => card.id === "remocn/hero").category,
    "effects",
  );
  assert.equal(
    catalog.cards.find((card) => card.id === "remotion-bits/terminal").category,
    "interaction",
  );
```

Add:

```js
test("rejects unknown upstream categories with the shot id", () => {
  assert.throws(
    () =>
      importGradedLibraries({
        shots: [{
          id: "unknown",
          source: "Remocn",
          name: "Unknown",
          description: "Unknown category",
          reason: "Must be classified",
          category: "未定义类别",
          grade: "A",
          score: 80,
        }],
        bitsRegistry: { items: [] },
      }),
    /Unknown graded shot category "未定义类别" for remocn\/unknown/,
  );
});
```

- [ ] **Step 2: Run the importer tests and verify RED**

Run:

```bash
node --test tests/graded-library.test.mjs
```

Expected: FAIL because the unknown category still falls back to `effects`.

- [ ] **Step 3: Replace the local map and fallback**

At the top of `scripts/graded-library.mjs`, add:

```js
import { categoryForGradedShot } from "./shot-categories.mjs";
```

Delete the local `CATEGORY_MAP` constant. In `importGradedLibraries`, replace:

```js
category: CATEGORY_MAP[shot.category] ?? "effects",
```

with:

```js
category: categoryForGradedShot({
  collection,
  id: shot.id,
  upstreamCategory: shot.category,
}),
```

- [ ] **Step 4: Run the importer tests and verify GREEN**

Run:

```bash
node --test tests/graded-library.test.mjs
```

Expected: all importer tests pass.

- [ ] **Step 5: Commit the importer integration**

```bash
git add scripts/graded-library.mjs tests/graded-library.test.mjs
git commit -m "feat: classify imported shots by visual purpose"
```

### Task 4: Apply taxonomy during final catalog generation

**Files:**
- Modify: `scripts/build-library-data.mjs`
- Modify: `tests/library-data.test.mjs`

- [ ] **Step 1: Add failing normalization and merge tests**

Add to `tests/library-data.test.mjs`:

```js
test("reclassifies Video Shotcraft cards during normalization", () => {
  const result = normalizeLibrary(
    {
      cards: [card({
        name: "line-boil",
        category: "effects",
        source: "references/shots/effects/line-boil.md",
      })],
    },
    { recipes: [], demos: [] },
  );

  assert.equal(result.cards[0].category, "typography");
});

test("reclassifies committed graded cards during merge", () => {
  const upstream = normalizeLibrary(
    { cards: [card()] },
    { recipes: [], demos: [] },
  );
  const result = mergeCatalogs(upstream, {
    cards: [{
      id: "remocn/drift",
      upstreamId: "drift",
      collection: "remocn",
      category: "effects",
      grade: "A",
      styles: [],
      previewKind: "player",
    }],
  });

  assert.equal(
    result.cards.find((entry) => entry.id === "remocn/drift").category,
    "camera",
  );
});
```

- [ ] **Step 2: Run the catalog tests and verify RED**

Run:

```bash
node --test tests/library-data.test.mjs
```

Expected: both new assertions fail with the old `effects` values.

- [ ] **Step 3: Integrate the shared reclassifier**

At the top of `scripts/build-library-data.mjs`, add:

```js
import {
  categoryForLibraryCard,
  reclassifyLibraryCards,
} from "./shot-categories.mjs";
```

In `normalizeLibrary`, change the emitted card category to:

```js
category: categoryForLibraryCard({
  collection: "video-shotcraft",
  id: card.name,
  category: card.category,
}),
```

At the beginning of `mergeCatalogs`, after validating both card arrays, add:

```js
const gradedCards = reclassifyLibraryCards(gradedCatalog.cards);
```

Then replace every use of `gradedCatalog.cards` inside `mergeCatalogs` with `gradedCards`.

- [ ] **Step 4: Run the catalog tests and verify GREEN**

Run:

```bash
node --test tests/library-data.test.mjs
```

Expected: all catalog tests pass.

- [ ] **Step 5: Commit the catalog integration**

```bash
git add scripts/build-library-data.mjs tests/library-data.test.mjs
git commit -m "feat: normalize categories across catalog sources"
```

### Task 5: Refresh committed data and lock the results

**Files:**
- Modify: `source/graded-library.json`
- Modify: `public/data/library.json`
- Modify: `tests/graded-library.test.mjs`

- [ ] **Step 1: Reclassify the committed graded snapshot**

Run:

```bash
node --input-type=module -e 'import {readFile,writeFile} from "node:fs/promises"; import {reclassifyLibraryCards} from "./scripts/shot-categories.mjs"; const path="source/graded-library.json"; const catalog=JSON.parse(await readFile(path,"utf8")); catalog.cards=reclassifyLibraryCards(catalog.cards); await writeFile(path, JSON.stringify(catalog,null,2)+"\n");'
```

Expected: only `category` values change in `source/graded-library.json`.

- [ ] **Step 2: Regenerate the public catalog**

Run:

```bash
npm run data:build
```

Expected: `public/data/library.json` is regenerated successfully.

- [ ] **Step 3: Add snapshot-level category assertions**

Add to `tests/graded-library.test.mjs` after loading the committed catalog:

```js
  const categoryById = new Map(
    catalog.cards.map((card) => [card.id, card.category]),
  );
  assert.equal(categoryById.get("remocn/hand-count"), "typography");
  assert.equal(categoryById.get("remocn/drift"), "camera");
  assert.equal(categoryById.get("remocn/shared-axis-y"), "transition");
  assert.equal(categoryById.get("remocn/shader-god-rays"), "effects");
```

- [ ] **Step 4: Verify expected final category counts**

Run:

```bash
node --input-type=module -e 'import data from "./public/data/library.json" with {type:"json"}; console.log(Object.fromEntries([...new Set(data.cards.map(card=>card.category))].sort().map(category=>[category,data.cards.filter(card=>card.category===category).length])));'
```

Expected:

```text
{
  camera: 17,
  data: 14,
  effects: 44,
  interaction: 67,
  opening: 8,
  outro: 5,
  rhythm: 24,
  transition: 36,
  typography: 43,
  'ui-entrance': 18
}
```

- [ ] **Step 5: Run data consistency tests**

Run:

```bash
npm run data:check
npm run test:data
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit generated data**

```bash
git add source/graded-library.json public/data/library.json tests/graded-library.test.mjs
git commit -m "data: reclassify local shot catalog"
```

### Task 6: Full verification and visual spot-check

**Files:**
- Verify only; no planned source changes.

- [ ] **Step 1: Run static checks**

```bash
npm run lint
npm run typecheck
```

Expected: both commands exit 0.

- [ ] **Step 2: Run the full test and production build**

```bash
npm test
```

Expected: all tests pass and the production build completes.

- [ ] **Step 3: Start the local preview**

```bash
npm run dev
```

Expected: the local mirror opens without console errors.

- [ ] **Step 4: Spot-check four filters**

Verify in the local preview:

- “文字与字卡” includes `hand-count`, `line-by-line-slide`, and `slot-machine-roll`.
- “运镜与空间” includes `drift`.
- “转场” includes `shared-axis-y`, `push-through`, and `ripple-zoom`.
- “光效与强调” includes `shader-god-rays` and `bit-fireflies`, but excludes the text and page-movement examples above.

- [ ] **Step 5: Record final repository state**

```bash
git status --short
git log -6 --oneline
```

Expected: clean worktree and the taxonomy commits at the top of `main`.

