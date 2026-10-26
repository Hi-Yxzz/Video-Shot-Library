# Roll Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the first verified A-roll project and create a lightweight JSON catalog that indexes A-roll entries while referencing existing B-roll data without moving it.

**Architecture:** `video-catalog` is an independent metadata repository. A-roll entries are stored directly in `A-roll/entries.json`; B-roll remains in its existing manifest and is linked through `B-roll/sources.json`. All cross-project paths are relative to the catalog root.

**Tech Stack:** JSON, Markdown, Node.js tests, Git, Remotion, FFprobe

---

### Task 1: Merge and deliver the first A-roll project

**Repositories and files:**
- Base repository: `/Users/admin/Desktop/Codex/remotion-photo-replica`
- Feature worktree: `/Users/admin/.config/superpowers/worktrees/remotion-photo-replica/feature-photo-replica`
- Deliver: `/Users/admin/Desktop/Codex/remotion-photo-replica/out/check-115.png`
- Deliver: `/Users/admin/Desktop/Codex/remotion-photo-replica/out/photo-shot-replica.mp4`

- [ ] **Step 1: Verify the feature branch**

Run in the feature worktree:

```bash
npm test
npm run typecheck
npm run lint
npx remotion compositions
```

Expected: 9 tests pass; typecheck and lint exit 0; `PhotoReplica` is 1280×720, 30fps, 230 frames.

- [ ] **Step 2: Fast-forward local `main`**

Run in the base repository:

```bash
git status --short --branch
git merge --ff-only feature/photo-replica
```

Expected: clean `main` fast-forwards to the feature branch tip.

- [ ] **Step 3: Verify merged source on `main`**

Run in the base repository:

```bash
npm install
npm test
npm run typecheck
npm run lint
npx remotion compositions
```

Expected: the same 9 tests and `PhotoReplica` metadata pass.

- [ ] **Step 4: Copy ignored render artifacts into the main project**

Run:

```bash
mkdir -p /Users/admin/Desktop/Codex/remotion-photo-replica/out
cp /Users/admin/.config/superpowers/worktrees/remotion-photo-replica/feature-photo-replica/out/check-115.png /Users/admin/Desktop/Codex/remotion-photo-replica/out/check-115.png
cp /Users/admin/.config/superpowers/worktrees/remotion-photo-replica/feature-photo-replica/out/photo-shot-replica.mp4 /Users/admin/Desktop/Codex/remotion-photo-replica/out/photo-shot-replica.mp4
```

Expected: both files exist in the main project.

- [ ] **Step 5: Verify the delivered MP4**

Run:

```bash
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,r_frame_rate -of json /Users/admin/Desktop/Codex/remotion-photo-replica/out/photo-shot-replica.mp4
```

Expected: one H.264 video stream, no audio stream, 1280×720, 30/1 fps, 7.666667 seconds.

- [ ] **Step 6: Remove the merged worktree and feature branch**

Run in the base repository:

```bash
git worktree remove /Users/admin/.config/superpowers/worktrees/remotion-photo-replica/feature-photo-replica
git branch -d feature/photo-replica
```

Expected: the global worktree and merged feature branch are removed; `main` retains all commits.

### Task 2: Define the catalog contract with a failing test

**Files:**
- Create: `test/catalog.test.mjs`

- [ ] **Step 1: Write the catalog contract test**

Create `test/catalog.test.mjs`:

```js
import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));
const readJson = (relativePath) =>
  JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));

test("catalog manifests and referenced assets exist", () => {
  const catalog = readJson("catalog.json");
  assert.equal(catalog.schemaVersion, 1);

  for (const category of catalog.categories) {
    assert.ok(existsSync(resolve(root, category.manifest)));
  }

  const entries = readJson("A-roll/entries.json");
  assert.equal(entries.length, new Set(entries.map((entry) => entry.id)).size);
  assert.ok(entries.every((entry) => entry.rollType === "A-roll"));
  assert.ok(
    entries.every((entry) =>
      ["draft", "ready", "archived"].includes(entry.status),
    ),
  );

  for (const entry of entries) {
    assert.ok(existsSync(resolve(root, entry.projectPath)));
    assert.ok(existsSync(resolve(root, entry.previewPath)));
    assert.ok(existsSync(resolve(root, entry.outputPath)));
  }

  const bRoll = readJson("B-roll/sources.json");
  assert.equal(bRoll.rollType, "B-roll");
  for (const source of bRoll.sources) {
    assert.ok(existsSync(resolve(root, source.manifestPath)));
  }
});
```

- [ ] **Step 2: Verify the test fails for the missing catalog**

Run:

```bash
node --test test/catalog.test.mjs
```

Expected: FAIL with `ENOENT` for `catalog.json`.

### Task 3: Add the catalog data and make the contract pass

**Files:**
- Create: `catalog.json`
- Create: `A-roll/entries.json`
- Create: `B-roll/sources.json`
- Create: `README.md`

- [ ] **Step 1: Create the root catalog**

Create `catalog.json`:

```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-07-28",
  "categories": [
    {"id": "A-roll", "manifest": "A-roll/entries.json"},
    {"id": "B-roll", "manifest": "B-roll/sources.json"}
  ]
}
```

- [ ] **Step 2: Register the first A-roll**

Create `A-roll/entries.json`:

```json
[
  {
    "id": "a-roll-001-photo-looping-cards",
    "title": "静态人物＋双层循环卡片",
    "rollType": "A-roll",
    "status": "ready",
    "projectPath": "../remotion-photo-replica",
    "compositionId": "PhotoReplica",
    "previewPath": "../remotion-photo-replica/out/check-115.png",
    "outputPath": "../remotion-photo-replica/out/photo-shot-replica.mp4",
    "durationInFrames": 230,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "tags": {
      "subject": ["单人", "静态照片", "口罩"],
      "framing": ["近景", "固定机位"],
      "motion": ["轻推镜", "呼吸视差", "循环卡片"],
      "elements": ["AI公司卡片", "双层元素轨道"],
      "format": ["16:9", "30fps", "无声"]
    }
  }
]
```

- [ ] **Step 3: Reference the existing B-roll**

Create `B-roll/sources.json`:

```json
{
  "rollType": "B-roll",
  "sources": [
    {
      "id": "remotion-shot-grades",
      "manifestPath": "../remotion-shot-grades/shots.json",
      "format": "json-array",
      "idField": "id",
      "titleField": "name",
      "tagFields": ["category", "grade", "family", "source"]
    }
  ]
}
```

- [ ] **Step 4: Document maintenance**

Create `README.md`:

```markdown
# A-roll / B-roll 视频目录

本目录只保存索引，不移动视频项目或素材。

## 分类

- `A-roll/entries.json`：人物主镜头，每个视频或 Composition 一条记录。
- `B-roll/sources.json`：辅助镜头来源，现有镜头库通过外部 manifest 引用。

## 新增 A-roll

1. 复制现有 A-roll 项目或新增 Composition。
2. 完成测试、预览图和 MP4 导出。
3. 在 `A-roll/entries.json` 增加唯一 `id`。
4. 填写相对项目路径、Composition、成品路径和分组标签。
5. 运行 `node --test test/catalog.test.mjs`。
```

- [ ] **Step 5: Run the contract test**

Run:

```bash
VIDEO_WORKSPACE_ROOT=/Users/admin/Desktop/Codex node --test test/catalog.test.mjs
```

Expected: 1 test passes, 0 failures.

- [ ] **Step 6: Confirm the B-roll manifest was not modified**

Run:

```bash
git -C /Users/admin/Desktop/Codex/remotion-shot-grades status --short 2>/dev/null || true
```

Expected: no changes attributable to this task.

- [ ] **Step 7: Commit the catalog**

```bash
git add catalog.json A-roll/entries.json B-roll/sources.json README.md test/catalog.test.mjs
git commit -m "feat: add A-roll and B-roll catalog"
```
