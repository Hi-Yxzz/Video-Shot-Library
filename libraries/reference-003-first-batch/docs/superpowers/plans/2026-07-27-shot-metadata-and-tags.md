# Shot Metadata and Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Chinese display titles and multi-select secondary tags to all 276 shots, replace the source filter with tag filtering, and make each complete card open its detail dialog.

**Architecture:** Store curated display metadata in `source/shot-metadata.json`, validate and merge it during catalog generation, then expose `title` and `tags` on every final card. Keep filtering logic in the model layer and interaction rendering in the existing library/card/dialog components.

**Tech Stack:** Node.js ESM, TypeScript/React, built-in `node:test`, vinext, existing Sites deployment.

---

### Task 1: Define and validate shot metadata

**Files:**
- Create: `source/shot-metadata.json`
- Create: `scripts/shot-metadata.mjs`
- Create: `tests/shot-metadata.test.mjs`
- Modify: `package.json`

- [ ] Write failing tests for `validateShotMetadata(cards, metadata)` covering missing IDs, unknown IDs, titles without Chinese characters, duplicate/unknown tags, and valid multi-tag entries.
- [ ] Run `node --test tests/shot-metadata.test.mjs`; verify failure because the module does not exist.
- [ ] Implement:

```js
export const ALLOWED_SHOT_TAGS = new Set([
  "标题", "段落", "单词", "字符", "数字", "计数器", "打字", "手写",
  "字幕", "高亮", "替换", "滚动", "组件", "卡片", "列表", "表单",
  "菜单", "对话框", "聊天", "光标", "点击", "拖动", "状态切换",
  "图表", "指标", "进度", "关系图", "推近", "拉远", "环绕", "漂移",
  "穿越", "翻页", "推页", "遮挡", "淡化", "变形", "硬切", "节拍",
  "蒙太奇", "辉光", "扫光", "粒子", "着色器", "纹理", "冲击",
  "品牌", "Logo", "开场", "收尾", "卡片墙", "批量入场", "页面展开",
]);

export function validateShotMetadata(cards, metadata) {
  // Compare exact card and metadata ID sets, then return normalized entries.
}

export function applyShotMetadata(cards, metadata) {
  const normalized = validateShotMetadata(cards, metadata);
  return cards.map((card) => ({
    ...card,
    title: normalized[card.id].titleZh,
    tags: normalized[card.id].tags,
  }));
}
```

- [ ] Generate `source/shot-metadata.json` for all current IDs. Derive Video Shotcraft titles from the Chinese phrase before `——` or the first Chinese sentence; translate graded IDs with a reviewed motion/UI term dictionary. Assign at least one category-default tag plus keyword-specific tags, then inspect every typography title/tag row.
- [ ] Add `tests/shot-metadata.test.mjs` to `test:data`.
- [ ] Run the focused tests and commit with `feat: add local Chinese shot metadata`.

### Task 2: Merge metadata into generated catalog

**Files:**
- Modify: `scripts/build-library-data.mjs`
- Modify: `tests/library-data.test.mjs`
- Modify: `public/data/library.json`

- [ ] Add failing fixture tests proving metadata supplies `title` and `tags`, and generation fails for an incomplete metadata file.
- [ ] Extend `createLibraryData` to read `source/shot-metadata.json` and call `applyShotMetadata` after `mergeCatalogs`.
- [ ] Regenerate with `npm run data:build`.
- [ ] Assert the repository catalog has 276 Chinese titles, non-empty tags, unchanged IDs, and representative metadata:

```js
assert.equal(byId.get("remocn/hand-count").title, "手写数字计数");
assert.deepEqual(
  byId.get("remocn/hand-count").tags,
  ["数字", "计数器", "手写"],
);
```

- [ ] Run `npm run data:check && npm run test:data` and commit with `data: add Chinese titles and secondary tags`.

### Task 3: Add multi-select tag filtering

**Files:**
- Modify: `app/library-model.ts`
- Modify: `tests/library-ui-model.test.mjs`

- [ ] Add failing tests for OR tag matching, combinations with query/category/grade, Chinese title/tag search, tag counts, and available tags.
- [ ] Replace `collection` in `LibraryFilters` with `tags: readonly string[]`.
- [ ] Update `filterCards`:

```ts
if (
  filters.tags.length > 0 &&
  !filters.tags.some((tag) => card.tags.includes(tag))
) {
  return false;
}
```

- [ ] Add tags to searchable values and implement:

```ts
export function getTagCounts(cards: readonly LibraryCard[]): Record<string, number>;
export function getAvailableTags(
  cards: readonly LibraryCard[],
  category: LibraryCategory,
  grade: LibraryFilters["grade"],
): string[];
```

- [ ] Run model tests and commit with `feat: add secondary tag filtering`.

### Task 4: Replace source UI and localize card titles

**Files:**
- Modify: `app/shot-library.tsx`
- Modify: `app/shot-card.tsx`
- Modify: `app/shot-dialog.tsx`
- Modify: `app/globals.css`
- Modify: `app/library-model.ts`
- Modify: `tests/rendered-html.test.mjs`

- [ ] Add failing rendered HTML assertions that “来源” buttons are gone, the tag facet is present, and card/dialog output includes both Chinese title and ID.
- [ ] Remove `COLLECTIONS`, `collection` state, and source buttons.
- [ ] Add `selectedTags` state, context-aware available tags, counts, OR selection, invalid-tag cleanup on category/grade change, and clear behavior.
- [ ] Render tag buttons with `aria-pressed` and counts.
- [ ] Display `card.title` as the strong title and `card.id` as the secondary immutable ID.
- [ ] In the dialog, render Chinese title in `<h2>` and the original ID in a separate code-style row; keep copy behavior unchanged.
- [ ] Make the card root focusable and interactive:

```tsx
<article
  className="shot-card"
  role="button"
  tabIndex={0}
  aria-label={`查看镜头：${card.title}`}
  onClick={() => onOpen(card)}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(card);
    }
  }}
>
```

- [ ] Replace the nested card-body button with a non-interactive container and add hover/focus-visible styling for the complete card.
- [ ] Run rendered/model tests and commit with `feat: add Chinese tag browsing`.

### Task 5: Verify, merge, and publish

**Files:**
- Verify all changed files.

- [ ] Run `npm run lint && npm run typecheck && npm test`.
- [ ] Check representative typography tags and confirm all 276 IDs are unchanged.
- [ ] Merge the isolated feature branch into `main` and rerun `npm test`.
- [ ] Build the exact curated Sites source, push it, package the validated build, save a new Sites version, and deploy to the existing approved shared site.
- [ ] Verify the production page and `/data/library.json` return HTTP 200, and confirm `remocn/hand-count` exposes its Chinese title and three tags.

