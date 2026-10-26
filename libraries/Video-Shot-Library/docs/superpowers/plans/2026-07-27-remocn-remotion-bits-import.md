# Remocn 与 Remotion Bits 本地 Player 导入 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Remocn、Remocn UI 与 Remotion Bits 的 174 个 S/A/B 镜头和源码写入本地镜头库，并用两个隔离的本地 Remotion Player 实时执行 TSX 预览。

**Architecture:** 独立导入器把评分快照和两个上游仓库转换为 `source/graded-library.json` 与 `library-sources/`。Remocn 和 Remotion Bits 各自构建静态 Player 到 `public/players/`，主站通过同源 iframe 与 `postMessage` 控制播放；原有 161 条 MP4 保持现状。

**Tech Stack:** Node.js 22、TypeScript、React、Vite、Remotion Player 4、Next/vinext、Node test runner、Playwright/浏览器 smoke test。

---

## 文件结构

- Create: `scripts/graded-library.mjs` — 分级记录、路径和 Composition 映射验证。
- Create: `scripts/import-graded-libraries.mjs` — 生成 174 条目录并归档上游源码。
- Create: `source/graded-library.json` — 可提交的分级镜头数据。
- Create: `library-sources/remocn/**` — Remocn/Remocn UI 源码与许可证。
- Create: `library-sources/remotion-bits/**` — Remotion Bits 源码与许可证。
- Create: `players/remocn/**` — 隔离的 Remocn Player 工程。
- Create: `players/remotion-bits/**` — 隔离的 Remotion Bits Player 工程。
- Create: `scripts/build-players.mjs` — 构建两个静态 Player 到 `public/players/`。
- Create: `app/shot-player.tsx` — iframe 生命周期与消息控制。
- Create: `tests/graded-library.test.mjs` — 数量、等级、路径和唯一性。
- Create: `tests/player-manifest.test.mjs` — 174 个 Composition 映射和未知 ID 拒绝。
- Modify: `scripts/build-library-data.mjs` — 合并原 102 卡与新增 174 卡。
- Modify: `app/library-model.ts` — Player 字段、等级/来源筛选。
- Modify: `app/shot-video.tsx` — 继续服务原 MP4。
- Modify: `app/shot-card.tsx`、`app/shot-dialog.tsx` — 按 `previewKind` 选择视频或 Player。
- Modify: `app/shot-library.tsx`、`app/globals.css`、`app/layout.tsx` — 筛选、徽标与统计。
- Modify: `tests/library-data.test.mjs`、`tests/library-ui-model.test.mjs`、`tests/rendered-html.test.mjs`。
- Modify: `package.json` — 导入、Player 构建和验收命令。

### Task 1: 分级目录与本地源码快照

**Files:**
- Create: `tests/graded-library.test.mjs`
- Create: `scripts/graded-library.mjs`
- Create: `scripts/import-graded-libraries.mjs`
- Create: `source/graded-library.json`
- Create: `library-sources/remocn/**`
- Create: `library-sources/remotion-bits/**`
- Modify: `package.json`

- [ ] **Step 1: 写入失败测试**

```js
test("imports only Remocn and Remotion Bits S/A/B shots", async () => {
  const catalog = await importGradedLibraries(fixtures);
  assert.equal(catalog.cards.length, 174);
  assert.deepEqual(countBy(catalog.cards, "grade"), {S: 24, A: 50, B: 100});
  assert.deepEqual(countBy(catalog.cards, "collection"), {
    remocn: 104,
    "remocn-ui": 34,
    "remotion-bits": 36,
  });
  assert.equal(catalog.cards.some((card) => card.grade === "C"), false);
  assert.equal(catalog.cards.some((card) => card.collection === "rve"), false);
});

test("uses namespaced ids and local player paths", async () => {
  const catalog = await importGradedLibraries(fixtures);
  assert.equal(new Set(catalog.cards.map((card) => card.id)).size, 174);
  for (const card of catalog.cards) {
    assert.match(card.id, /^(remocn|remocn-ui|remotion-bits)\//);
    assert.equal(card.previewKind, "player");
    assert.match(card.playerUrl, /^\/players\/(remocn|remotion-bits)\/index\.html$/);
    assert.match(card.compositionId, /^[a-z0-9-]+$/);
    assert.ok(card.codeFiles.every((file) => file.startsWith("library-sources/")));
  }
});
```

- [ ] **Step 2: 运行测试并确认 RED**

Run:

```bash
node --test tests/graded-library.test.mjs
```

Expected: FAIL，提示 `scripts/graded-library.mjs` 不存在。

- [ ] **Step 3: 实现安全映射与导入**

```js
export const ALLOWED_GRADES = new Set(["S", "A", "B"]);
export const ALLOWED_COLLECTIONS = new Set([
  "remocn",
  "remocn-ui",
  "remotion-bits",
]);

export function namespacedId(collection, upstreamId) {
  if (!ALLOWED_COLLECTIONS.has(collection) || !/^[a-z0-9-]+$/.test(upstreamId)) {
    throw new TypeError("Invalid graded shot identifier");
  }
  return `${collection}/${upstreamId}`;
}

export function playerUrl(collection) {
  return collection === "remotion-bits"
    ? "/players/remotion-bits/index.html"
    : "/players/remocn/index.html";
}

export function compositionId(collection, upstreamId) {
  namespacedId(collection, upstreamId);
  if (collection === "remocn-ui" && upstreamId.endsWith("-flow")) return upstreamId;
  if (collection === "remocn" || collection === "remocn-ui") {
    return `${upstreamId}-example`;
  }
  return upstreamId;
}
```

导入器接受 `--grades`、`--remocn`、`--bits`，使用 `fs/promises.cp` 复制命中条目的
注册表源码、官方 example、共享依赖和 LICENSE；拒绝符号链接和越界路径。

- [ ] **Step 4: 运行测试并确认 GREEN**

Run:

```bash
node --test tests/graded-library.test.mjs
```

Expected: 全部 PASS。

- [ ] **Step 5: 生成真实数据**

Run:

```bash
npm run graded:import
jq '.cards | length' source/graded-library.json
jq '[.cards[].grade] | group_by(.) | map({key:.[0], value:length}) | from_entries' source/graded-library.json
```

Expected: `174` 和 `{"A":50,"B":100,"S":24}`。

- [ ] **Step 6: 提交**

```bash
git add package.json scripts/graded-library.mjs scripts/import-graded-libraries.mjs \
  tests/graded-library.test.mjs source/graded-library.json library-sources
git commit -m "feat: import graded Remotion shot sources"
```

### Task 2: 合并统一镜头目录

**Files:**
- Modify: `scripts/build-library-data.mjs`
- Modify: `tests/library-data.test.mjs`
- Modify: `public/data/library.json`

- [ ] **Step 1: 写入失败测试**

```js
test("merges graded cards while preserving upstream cards", async () => {
  const catalog = await buildLibraryData(projectRoot);
  assert.equal(catalog.cards.length, 276);
  assert.equal(catalog.cards.filter((card) => card.previewKind === "player").length, 174);
  assert.equal(catalog.cards.filter((card) => card.previewKind === "video").length, 102);
  assert.deepEqual(catalog.gradeCounts, {S: 24, A: 50, B: 100});
});

test("rejects duplicate namespaced ids", () => {
  assert.throws(
    () => mergeCatalogs(upstreamFixture, {cards: [gradedCard, gradedCard]}),
    /Duplicate card id/,
  );
});
```

- [ ] **Step 2: 运行测试并确认 RED**

Run:

```bash
node --test tests/library-data.test.mjs
```

Expected: FAIL，目录仍只有原始卡或 `mergeCatalogs` 未定义。

- [ ] **Step 3: 实现目录合并**

原卡补充：

```js
{
  collection: "video-shotcraft",
  grade: null,
  score: null,
  previewKind: "video",
  playerUrl: null,
  compositionId: null,
  sourceUrl: "https://github.com/Vincentwei1021/video-shotcraft",
  license: "Apache-2.0",
  codeFiles: card.demoFiles,
}
```

新增卡保持 `previewKind: "player"`，不经过远程媒体 URL 解析器。兼容工作区已有的
`excluded-shots.json` 修改：先应用原库排除项，再合并分级镜头。

- [ ] **Step 4: 验证 GREEN**

Run:

```bash
npm run test:data
npm run data:build
npm run data:check
```

Expected: 全部 PASS；目录 276 张卡。

- [ ] **Step 5: 提交**

```bash
git add scripts/build-library-data.mjs tests/library-data.test.mjs public/data/library.json
git commit -m "feat: merge graded shots into library catalog"
```

### Task 3: Remocn 隔离 Player

**Files:**
- Create: `tests/player-manifest.test.mjs`
- Create: `players/remocn/package.json`
- Create: `players/remocn/index.html`
- Create: `players/remocn/src/main.tsx`
- Create: `players/remocn/src/player-app.tsx`
- Create: `players/remocn/src/manifest.ts`
- Create: `players/remocn/vite.config.ts`
- Create: `scripts/build-players.mjs`

- [ ] **Step 1: 写入失败测试**

```js
test("Remocn manifest covers 138 imported cards", async () => {
  const manifest = await loadPlayerManifest("remocn");
  assert.equal(Object.keys(manifest).length, 138);
  assert.equal(manifest["soft-blur-in"].compositionId, "soft-blur-in-example");
  assert.equal(manifest["signup-flow"].compositionId, "signup-flow");
});

test("player query parser rejects unknown ids", () => {
  assert.equal(resolveShotId("?shot=soft-blur-in", manifest), "soft-blur-in");
  assert.throws(() => resolveShotId("?shot=../../secret", manifest), /Unknown shot/);
});
```

- [ ] **Step 2: 运行测试并确认 RED**

Run:

```bash
node --test tests/player-manifest.test.mjs
```

Expected: FAIL，Player manifest 不存在。

- [ ] **Step 3: 实现 Remocn Player**

Player 读取 `?shot=`，从静态 manifest 取官方 example 组件，并使用：

```tsx
<Player
  ref={playerRef}
  component={scene.Component}
  durationInFrames={scene.durationInFrames}
  fps={scene.fps}
  compositionWidth={scene.width}
  compositionHeight={scene.height}
  loop
  controls={controls}
  style={{width: "100%", height: "100%"}}
/>
```

消息协议只接受：

```ts
type PlayerCommand =
  | {type: "play"}
  | {type: "pause"}
  | {type: "seekToStart"}
  | {type: "setControls"; value: boolean};
```

未知 ID 或加载异常显示包含 shot ID 的错误面板。Vite `base` 设置为
`/players/remocn/`，输出到临时目录后由 `build-players.mjs` 原子替换
`public/players/remocn/`。

- [ ] **Step 4: 验证 GREEN 并构建**

Run:

```bash
node --test tests/player-manifest.test.mjs
npm run players:build -- --source remocn
test -s public/players/remocn/index.html
```

Expected: 测试 PASS，静态 Player 构建成功。

- [ ] **Step 5: 提交**

```bash
git add players/remocn scripts/build-players.mjs tests/player-manifest.test.mjs \
  public/players/remocn
git commit -m "feat: add local Remocn player"
```

### Task 4: Remotion Bits 隔离 Player

**Files:**
- Create: `players/remotion-bits/package.json`
- Create: `players/remotion-bits/index.html`
- Create: `players/remotion-bits/src/main.tsx`
- Create: `players/remotion-bits/src/player-app.tsx`
- Create: `players/remotion-bits/src/manifest.ts`
- Create: `players/remotion-bits/vite.config.ts`
- Modify: `tests/player-manifest.test.mjs`
- Modify: `scripts/build-players.mjs`

- [ ] **Step 1: 写入失败测试**

```js
test("Remotion Bits manifest covers 36 imported cards", async () => {
  const manifest = await loadPlayerManifest("remotion-bits");
  assert.equal(Object.keys(manifest).length, 36);
  assert.equal(manifest["bit-cursor-flyover"].compositionId, "bit-cursor-flyover");
});
```

- [ ] **Step 2: 运行测试并确认 RED**

Run:

```bash
node --test tests/player-manifest.test.mjs
```

Expected: FAIL，Bits manifest 不存在。

- [ ] **Step 3: 实现 Bits Player**

从本地注册表 Bit 文件生成静态 import 和 manifest；共享组件、hooks、utils 一并复制，
但只暴露 36 个 S/A/B Bit。Player 使用与 Remocn 相同的消息协议，依赖版本锁在
`players/remotion-bits/package.json`，不与主站共享 `node_modules`。

- [ ] **Step 4: 验证 GREEN 并构建**

Run:

```bash
node --test tests/player-manifest.test.mjs
npm run players:build -- --source remotion-bits
test -s public/players/remotion-bits/index.html
```

Expected: manifest 36 条，静态构建成功。

- [ ] **Step 5: 提交**

```bash
git add players/remotion-bits scripts/build-players.mjs \
  tests/player-manifest.test.mjs public/players/remotion-bits
git commit -m "feat: add local Remotion Bits player"
```

### Task 5: 主站 Player 预览与等级筛选

**Files:**
- Create: `app/shot-player.tsx`
- Modify: `app/library-model.ts`
- Modify: `app/shot-library.tsx`
- Modify: `app/shot-card.tsx`
- Modify: `app/shot-dialog.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `tests/library-ui-model.test.mjs`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: 写入失败测试**

```js
test("combines text, category, grade, and collection", () => {
  assert.deepEqual(
    filterCards(cards, {
      query: "terminal",
      category: "all",
      grade: "S",
      collection: "remocn",
    }).map((card) => card.id),
    ["remocn/terminal-simulator"],
  );
});

test("supports the original ungraded library", () => {
  assert.deepEqual(
    filterCards(cards, {
      query: "",
      category: "all",
      grade: "original",
      collection: "all",
    }).map((card) => card.id),
    ["ai-stream-response"],
  );
});
```

渲染 HTML 断言包含 `276`、`S级`、`A级`、`B级`、`原镜头库`。

- [ ] **Step 2: 运行测试并确认 RED**

Run:

```bash
node --test tests/library-ui-model.test.mjs
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: 筛选签名和页面内容断言 FAIL。

- [ ] **Step 3: 扩展模型和页面**

```ts
export type ShotGrade = "S" | "A" | "B";
export type GradeFilter = "all" | "original" | ShotGrade;
export type PreviewKind = "video" | "player";
```

`ShotPlayer` 仅在进入视口后创建 iframe：

```tsx
const src = `${card.playerUrl}?shot=${encodeURIComponent(card.compositionId)}`;
```

悬停/聚焦发送 `play`，离开/失焦发送 `pause`；详情弹窗发送
`setControls: true`。`ShotCard` 根据 `previewKind` 在 `ShotVideo` 与
`ShotPlayer` 间选择。卡片显示等级/来源，详情显示评分、许可证、上游链接和
`codeFiles`。

- [ ] **Step 4: 验证 GREEN**

Run:

```bash
node --test tests/library-ui-model.test.mjs
npm run lint
npm run typecheck
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: 全部 PASS。

- [ ] **Step 5: 提交**

```bash
git add app tests/library-ui-model.test.mjs tests/rendered-html.test.mjs
git commit -m "feat: preview graded shots with local players"
```

### Task 6: 离线 Player 与完整应用验收

**Files:**
- Create: `reports/local-player-verification.json`
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: 验证数据和 Player 覆盖**

Run:

```bash
npm run data:check
npm run players:check
```

Expected:

```text
catalogCards=276
playerCards=174
remocnManifest=138
remotionBitsManifest=36
missing=0
```

- [ ] **Step 2: 浏览器 smoke test**

启动本地站点，断开外部网络请求后抽查每个来源和等级至少 3 个镜头。验证 iframe
加载、播放、暂停、回到开头、详情控制条与未知 ID 错误状态。结果写入
`reports/local-player-verification.json`。

- [ ] **Step 3: 运行完整测试**

Run:

```bash
npm run test:data
npm run lint
npm run typecheck
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: 全部退出码 0。

- [ ] **Step 4: 确认原媒体与无远程依赖**

Run:

```bash
test "$(find public/media -maxdepth 1 -name '*.mp4' | wc -l | tr -d ' ')" = "161"
rg -n "https?://" public/players && exit 1 || true
git status --short
```

Expected: 原有 161 个本地 MP4 文件均保留，其中 159 条继续出现在目录；
Player 构建产物不引用远程脚本、网页或视频。

- [ ] **Step 5: 更新说明并提交**

README 记录来源、许可证、导入命令、Player 构建方式、离线行为和 RVE 暂缓状态。

```bash
git add README.md package.json reports/local-player-verification.json
git commit -m "docs: document local graded Remotion players"
```

## 最终交付检查

- [ ] `source/graded-library.json` 恰好 174 条，没有 RVE/C。
- [ ] `public/data/library.json` 恰好 276 张卡。
- [ ] Remocn Player manifest 138 条，Remotion Bits manifest 36 条。
- [ ] 新增镜头预览不依赖 MP4 或外部网络。
- [ ] 原 `public/media/*.mp4` 161 个文件未删除、未覆盖，目录仍引用其中 159 条。
- [ ] 页面支持 S/A/B、原库、来源、分类和关键词组合筛选。
- [ ] 自动测试、lint、typecheck、build 与离线 smoke test 全部通过。
- [ ] 工作区不存在与本功能无关的修改。
