# Shot Library Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有镜头库改造成以大画幅预览为核心的电影接触表式目录，使用 159 个本地 MP4 和对应 WebP 封面，并提供可连续浏览的独立镜头详情页。

**Architecture:** 保持 Vinext/Next App Router 与静态 JSON 数据流不变。构建阶段由 FFmpeg 生成封面，再由数据生成器把上游数据、排除列表、本地视频和封面合并为唯一目录；首页客户端负责 URL 筛选状态与单实例悬停预览，详情路由在服务端读取同一目录并把当前镜头、相邻顺序和相关推荐交给客户端交互组件。

**Tech Stack:** Next.js 16.2、React 19.2、TypeScript 5.9、Vinext/Vite、Cloudflare Workers、Node.js test runner、FFmpeg/ffprobe 8.1、原生 CSS。

---

## 实施前提与边界

- 当前基线目录是 `/Users/admin/Desktop/Codex/video-shotcraft-local`。
- 当前已有 159 个未纳入 Git 的 MP4，位于 `public/media/`，总量约 95MB。
- `letterspace-materialize` 与 `text-as-mask` 已写入 `source/excluded-shots.json`，不得重新加入。
- 本计划不会提交 `public/media/*.mp4`；这些文件只复制到实施 worktree，并在本地或 Cloudflare 上传流程中作为静态资源打包。
- `public/posters/*.webp` 同样视为可再生构建产物，不提交 Git。
- 每个任务严格按“先写失败测试、确认失败、实现最小改动、确认通过、提交”的顺序执行。
- 实施过程中不得改动镜头配方、Demo 内容或远程上游数据。

## Task 0：固化当前本地化基线并建立隔离 worktree

**Files:**

- Modify: `.gitignore`
- Existing: `app/layout.tsx`
- Existing: `app/shot-library.tsx`
- Existing: `public/data/library.json`
- Existing: `scripts/build-library-data.mjs`
- Existing: `source/excluded-shots.json`
- Existing: `tests/library-data.test.mjs`
- Existing: `tests/rendered-html.test.mjs`

- [ ] **Step 1：确认本地媒体和排除项**

Run:

```bash
cd /Users/admin/Desktop/Codex/video-shotcraft-local
find public/media -type f -name '*.mp4' | wc -l
test ! -e public/media/letterspace-materialize.mp4
test ! -e public/media/text-as-mask.mp4
node -e 'const x=require("./source/excluded-shots.json"); if (JSON.stringify(x)!==JSON.stringify(["letterspace-materialize","text-as-mask"])) process.exit(1)'
```

Expected:

```text
159
```

三个命令退出码都为 `0`。

- [ ] **Step 2：忽略大体积媒体与可再生封面**

在 `.gitignore` 末尾加入：

```gitignore

# Local preview assets are packaged for deployment but are not stored in Git.
/public/media/*.mp4
/public/posters/*.webp
```

- [ ] **Step 3：运行现有基线测试**

Run:

```bash
npm run data:check
npm run test:data
npm run build
node --test tests/rendered-html.test.mjs
```

Expected：全部退出码为 `0`；数据断言显示 `102` 张卡片、`159` 个预览。

- [ ] **Step 4：只提交当前已授权的非二进制改动**

Run:

```bash
git add .gitignore app/layout.tsx app/shot-library.tsx public/data/library.json scripts/build-library-data.mjs source/excluded-shots.json tests/library-data.test.mjs tests/rendered-html.test.mjs
git status --short
git commit -m "feat: keep filtered shot catalog local"
```

Expected：暂存列表不含 `public/media/`，提交成功。

- [ ] **Step 5：建立专用 worktree 并复制本地媒体**

Run:

```bash
git worktree add /Users/admin/Desktop/Codex/video-shotcraft-redesign -b feat/shot-library-redesign
mkdir -p /Users/admin/Desktop/Codex/video-shotcraft-redesign/public/media
ditto /Users/admin/Desktop/Codex/video-shotcraft-local/public/media /Users/admin/Desktop/Codex/video-shotcraft-redesign/public/media
find /Users/admin/Desktop/Codex/video-shotcraft-redesign/public/media -type f -name '*.mp4' | wc -l
```

Expected:

```text
159
```

后续所有命令都在 `/Users/admin/Desktop/Codex/video-shotcraft-redesign` 中执行。

## Task 1：用 FFmpeg 可重复生成并检查 159 张 WebP 封面

**Files:**

- Create: `scripts/build-video-posters.mjs`
- Create: `tests/video-posters.test.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1：先写封面路径、时间点和滤镜测试**

创建 `tests/video-posters.test.mjs`：

```js
import assert from "node:assert/strict";
import { mkdtemp, mkdir, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildPosterFilter,
  getPosterTimestamp,
  inspectPosterSet,
  posterNameForVideo,
} from "../scripts/build-video-posters.mjs";

test("posterNameForVideo maps an mp4 basename to webp", () => {
  assert.equal(
    posterNameForVideo("ai-stream-response.mp4"),
    "ai-stream-response.webp",
  );
  assert.throws(() => posterNameForVideo("../escape.mp4"), /安全文件名/);
  assert.throws(() => posterNameForVideo("clip.mov"), /MP4/);
});

test("getPosterTimestamp selects a safe frame near 25 percent", () => {
  assert.equal(getPosterTimestamp(8), 2);
  assert.equal(getPosterTimestamp(1), 0.4);
  assert.equal(getPosterTimestamp(0.3), 0.2);
});

test("buildPosterFilter preserves aspect ratio on a 640x360 canvas", () => {
  assert.equal(
    buildPosterFilter(),
    "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x030405",
  );
});

test("inspectPosterSet reports missing and stale posters", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "shot-posters-"));
  await mkdir(path.join(root, "public/media"), { recursive: true });
  await mkdir(path.join(root, "public/posters"), { recursive: true });
  const video = path.join(root, "public/media/alpha.mp4");
  const poster = path.join(root, "public/posters/alpha.webp");
  await writeFile(video, "video");

  assert.deepEqual(await inspectPosterSet(root), {
    videos: ["alpha.mp4"],
    missing: ["alpha.webp"],
    stale: [],
  });

  await writeFile(poster, "poster");
  const now = new Date();
  await utimes(poster, now, now);
  assert.deepEqual(await inspectPosterSet(root), {
    videos: ["alpha.mp4"],
    missing: [],
    stale: [],
  });
});
```

- [ ] **Step 2：确认测试因模块不存在而失败**

Run:

```bash
node --test tests/video-posters.test.mjs
```

Expected：退出码非 `0`，错误包含 `ERR_MODULE_NOT_FOUND`。

- [ ] **Step 3：实现封面生成与 `--check`**

创建 `scripts/build-video-posters.mjs`：

```js
import { execFile } from "node:child_process";
import { mkdir, readdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const SAFE_MP4 = /^[a-z0-9][a-z0-9._-]*\.mp4$/;

export function posterNameForVideo(filename) {
  if (!filename.endsWith(".mp4")) {
    throw new Error(`只支持 MP4: ${filename}`);
  }
  if (path.basename(filename) !== filename || !SAFE_MP4.test(filename)) {
    throw new Error(`不是安全文件名: ${filename}`);
  }
  return `${filename.slice(0, -4)}.webp`;
}

export function getPosterTimestamp(duration) {
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`无效视频时长: ${duration}`);
  }
  return Math.min(Math.max(duration * 0.25, 0.4), Math.max(duration - 0.1, 0.2));
}

export function buildPosterFilter() {
  return "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x030405";
}

async function listVideos(mediaDir) {
  return (await readdir(mediaDir))
    .filter((name) => name.endsWith(".mp4"))
    .sort();
}

export async function inspectPosterSet(root) {
  const mediaDir = path.join(root, "public/media");
  const posterDir = path.join(root, "public/posters");
  await mkdir(posterDir, { recursive: true });
  const videos = await listVideos(mediaDir);
  const missing = [];
  const stale = [];

  for (const videoName of videos) {
    const posterName = posterNameForVideo(videoName);
    const videoPath = path.join(mediaDir, videoName);
    const posterPath = path.join(posterDir, posterName);
    try {
      const [videoStat, posterStat] = await Promise.all([
        stat(videoPath),
        stat(posterPath),
      ]);
      if (posterStat.size === 0 || posterStat.mtimeMs < videoStat.mtimeMs) {
        stale.push(posterName);
      }
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      missing.push(posterName);
    }
  }

  return { videos, missing, stale };
}

async function probeDuration(videoPath) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    videoPath,
  ]);
  return Number.parseFloat(stdout.trim());
}

async function generatePoster(videoPath, posterPath) {
  const duration = await probeDuration(videoPath);
  const temporaryPath = `${posterPath}.tmp.webp`;
  await unlink(temporaryPath).catch((error) => {
    if (error?.code !== "ENOENT") throw error;
  });
  await execFileAsync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-ss", String(getPosterTimestamp(duration)),
    "-i", videoPath,
    "-frames:v", "1",
    "-vf", buildPosterFilter(),
    "-c:v", "libwebp",
    "-quality", "78",
    "-compression_level", "6",
    temporaryPath,
  ]);
  const result = await stat(temporaryPath);
  if (result.size === 0) throw new Error(`封面为空: ${temporaryPath}`);
  await rename(temporaryPath, posterPath);
}

export async function buildVideoPosters(root, { check = false } = {}) {
  const state = await inspectPosterSet(root);
  if (check) {
    if (state.missing.length || state.stale.length) {
      throw new Error(
        `封面不完整: missing=${state.missing.join(",")} stale=${state.stale.join(",")}`,
      );
    }
    return state;
  }

  const targets = new Set([...state.missing, ...state.stale]);
  for (const videoName of state.videos) {
    const posterName = posterNameForVideo(videoName);
    if (!targets.has(posterName)) continue;
    await generatePoster(
      path.join(root, "public/media", videoName),
      path.join(root, "public/posters", posterName),
    );
  }
  return inspectPosterSet(root);
}

const isMain = process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const root = process.cwd();
  const check = process.argv.includes("--check");
  const result = await buildVideoPosters(root, { check });
  console.log(
    `${check ? "checked" : "built"} ${result.videos.length} posters`,
  );
}
```

- [ ] **Step 4：运行单测并生成真实封面**

Run:

```bash
node --test tests/video-posters.test.mjs
node scripts/build-video-posters.mjs
node scripts/build-video-posters.mjs --check
find public/posters -type f -name '*.webp' | wc -l
find public/posters -type f -name '*.webp' -size +100k | wc -l
for poster_file in public/posters/*.webp; do
  test "$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$poster_file")" = "640x360" || exit 1
done
```

Expected:

```text
checked 159 posters
159
0
```

若最后一个数字不为 `0`，仅把 `-quality` 从 `78` 逐步降到 `72`，重新生成超限文件后再次检查；不得降低分辨率。

- [ ] **Step 5：接入项目命令**

在 `package.json` 中加入并调整：

```json
{
  "scripts": {
    "posters:build": "node scripts/build-video-posters.mjs",
    "posters:check": "node scripts/build-video-posters.mjs --check",
    "prebuild": "npm run posters:build && npm run data:build",
    "test:data": "node --test tests/library-data.test.mjs tests/library-ui-model.test.mjs tests/video-posters.test.mjs",
    "test": "npm run posters:check && npm run data:check && npm run build && npm run test:data && node --test tests/rendered-html.test.mjs"
  }
}
```

在 `.gitignore` 已有媒体规则旁补充：

```gitignore
/public/posters/*.tmp.webp
```

- [ ] **Step 6：提交脚本和测试，不提交生成图片**

Run:

```bash
git add .gitignore package.json scripts/build-video-posters.mjs tests/video-posters.test.mjs
git commit -m "feat: generate local shot posters"
```

Expected：提交成功，`git status --short` 不显示 `public/posters/`。

## Task 2：让目录数据严格使用本地视频和本地封面

**Files:**

- Modify: `scripts/build-library-data.mjs`
- Modify: `tests/library-data.test.mjs`
- Modify: `app/library-model.ts`
- Regenerate: `public/data/library.json`

- [ ] **Step 1：先扩展数据测试**

在 `tests/library-data.test.mjs` 的 fixture 中为每个预览样式创建：

```js
await mkdir(path.join(root, "public/media"), { recursive: true });
await mkdir(path.join(root, "public/posters"), { recursive: true });
await writeFile(path.join(root, "public/media/alpha-default.mp4"), "video");
await writeFile(path.join(root, "public/posters/alpha-default.webp"), "poster");
```

新增测试：

```js
test("normalizes previews to required local media and posters", () => {
  const library = {
    cards: [
      card({
        id: "alpha",
        styles: [{
          key: "alpha-default",
          label: "Default",
          description: "Alpha",
          previewUrl: "https://vincentwei1021.github.io/video-shotcraft/previews/alpha-default.mp4",
          implementationStatus: "implemented",
        }],
      }),
    ],
    categories: {},
  };
  const result = normalizeLibrary(library, {}, [], {
    videos: ["alpha-default.mp4"],
    posters: ["alpha-default.webp"],
  });
  assert.equal(result.cards[0].styles[0].previewUrl, "/media/alpha-default.mp4");
  assert.equal(result.cards[0].styles[0].posterUrl, "/posters/alpha-default.webp");
  assert.match(result.cards[0].styles[0].sourcePreviewUrl, /^https:/);
});

test("rejects missing local video instead of falling back remotely", () => {
  assert.throws(
    () => normalizeLibrary(libraryWithAlphaPreview, {}, [], {
      videos: [],
      posters: ["alpha-default.webp"],
    }),
    /缺少本地视频.*alpha-default/,
  );
});

test("rejects missing poster", () => {
  assert.throws(
    () => normalizeLibrary(libraryWithAlphaPreview, {}, [], {
      videos: ["alpha-default.mp4"],
      posters: [],
    }),
    /缺少本地封面.*alpha-default/,
  );
});

test("rejects duplicate and unsafe local asset names", () => {
  assert.throws(
    () => normalizeLibrary(libraryWithAlphaPreview, {}, [], {
      videos: ["alpha-default.mp4", "alpha-default.mp4"],
      posters: ["alpha-default.webp"],
    }),
    /重复本地视频/,
  );
});
```

将测试文件里的共享 `libraryWithAlphaPreview` 固定为一个仅含 `alpha-default` 的最小目录对象，避免每个测试复制数据。

- [ ] **Step 2：确认新断言失败**

Run:

```bash
node --test tests/library-data.test.mjs
```

Expected：退出码非 `0`，首次失败是本地 `previewUrl` 或缺失 `posterUrl`。

- [ ] **Step 3：索引本地资产并重写样式 URL**

在 `scripts/build-library-data.mjs` 中增加：

```js
const SAFE_VIDEO_NAME = /^[a-z0-9][a-z0-9._-]*\.mp4$/;
const SAFE_POSTER_NAME = /^[a-z0-9][a-z0-9._-]*\.webp$/;

function assertUniqueSafeNames(names, pattern, label) {
  const unique = new Set();
  for (const name of names) {
    if (path.basename(name) !== name || !pattern.test(name)) {
      throw new Error(`不安全的${label}文件名: ${name}`);
    }
    if (unique.has(name)) throw new Error(`重复${label}: ${name}`);
    unique.add(name);
  }
  return unique;
}

export async function indexLocalAssets(root) {
  const [videos, posters] = await Promise.all([
    readdir(path.join(root, "public/media")),
    readdir(path.join(root, "public/posters")),
  ]);
  return {
    videos: videos.filter((name) => name.endsWith(".mp4")).sort(),
    posters: posters.filter((name) => name.endsWith(".webp")).sort(),
  };
}
```

把 `normalizeLibrary` 签名改为：

```js
export function normalizeLibrary(
  library,
  local = {},
  excludedShots = [],
  assets = { videos: [], posters: [] },
) {
  const videos = assertUniqueSafeNames(
    assets.videos,
    SAFE_VIDEO_NAME,
    "本地视频",
  );
  const posters = assertUniqueSafeNames(
    assets.posters,
    SAFE_POSTER_NAME,
    "本地封面",
  );
}
```

上述两个集合在现有卡片映射开始前创建；现有排除、配方、Demo 与统计代码保持原顺序，
只替换其中的样式归一化表达式。

在样式归一化位置使用：

```js
const sourcePreviewUrl = normalizeTrustedPreviewUrl(
  style.previewUrl ?? style.media?.url ?? null,
);
if (!sourcePreviewUrl) {
  return {
    ...style,
    previewUrl: null,
    posterUrl: null,
    sourcePreviewUrl: null,
  };
}

const videoName = decodeURIComponent(
  new URL(sourcePreviewUrl).pathname.split("/").at(-1) ?? "",
);
const posterName = `${videoName.slice(0, -4)}.webp`;
if (!videos.has(videoName)) {
  throw new Error(`缺少本地视频: ${style.key} -> ${videoName}`);
}
if (!posters.has(posterName)) {
  throw new Error(`缺少本地封面: ${style.key} -> ${posterName}`);
}
const previewUrl = `/media/${encodeURIComponent(videoName)}`;
return {
  ...style,
  media: style.media ? { ...style.media, url: previewUrl } : undefined,
  previewUrl,
  posterUrl: `/posters/${encodeURIComponent(posterName)}`,
  sourcePreviewUrl,
};
```

在构建入口先执行：

```js
const assets = await indexLocalAssets(root);
const catalog = normalizeLibrary(upstream, local, excludedShots, assets);
```

- [ ] **Step 4：更新 TypeScript 数据模型**

将 `ShotStyle` 改为：

```ts
export type ShotStyle = {
  key: string;
  label: string;
  description: string;
  media?: ShotMedia;
  previewUrl: string | null;
  posterUrl: string | null;
  sourcePreviewUrl: string | null;
  implementationStatus: "implemented" | "reference-only";
};
```

- [ ] **Step 5：运行数据测试并重新生成目录**

Run:

```bash
node --test tests/library-data.test.mjs
npm run data:build
npm run data:check
node -e 'const x=require("./public/data/library.json"); const s=x.cards.flatMap(c=>c.styles).filter(s=>s.previewUrl); if(s.length!==159||s.some(v=>!v.previewUrl.startsWith("/media/")||!v.posterUrl.startsWith("/posters/"))) process.exit(1); console.log(x.cards.length,s.length)'
```

Expected:

```text
102 159
```

- [ ] **Step 6：提交数据链路**

Run:

```bash
git add app/library-model.ts public/data/library.json scripts/build-library-data.mjs tests/library-data.test.mjs
git commit -m "feat: require local preview assets in catalog"
```

## Task 3：为筛选 URL、详情顺序和相关推荐建立纯模型

**Files:**

- Modify: `app/library-model.ts`
- Modify: `tests/library-ui-model.test.mjs`

- [ ] **Step 1：先写查询参数与相邻镜头测试**

在 `tests/library-ui-model.test.mjs` 增加：

```js
import {
  DEFAULT_LIBRARY_VIEW,
  findCardById,
  getAdjacentCardIds,
  getRelatedCards,
  parseLibraryView,
  serializeLibraryView,
} from "../app/library-model.ts";

test("parses and normalizes library query state", () => {
  assert.deepEqual(
    parseLibraryView(new URLSearchParams("q=AI&category=motion&density=compact")),
    { query: "AI", category: "motion", density: "compact" },
  );
  assert.deepEqual(
    parseLibraryView(new URLSearchParams("density=unknown")),
    DEFAULT_LIBRARY_VIEW,
  );
});

test("serializes only non-default library state", () => {
  assert.equal(
    serializeLibraryView({
      query: "AI",
      category: "all",
      density: "comfortable",
    }).toString(),
    "q=AI",
  );
});

test("uses filtered order for previous and next shots", () => {
  assert.deepEqual(getAdjacentCardIds([alpha, beta, gamma], "beta"), {
    previousId: "alpha",
    nextId: "gamma",
  });
  assert.deepEqual(getAdjacentCardIds([alpha, beta], "missing"), {
    previousId: null,
    nextId: null,
  });
});

test("finds cards and returns four same-category recommendations", () => {
  assert.equal(findCardById([alpha, beta], "beta"), beta);
  assert.equal(findCardById([alpha, beta], "missing"), null);
  assert.deepEqual(
    getRelatedCards([alpha, beta, gamma], "alpha", 4).map((card) => card.id),
    ["gamma"],
  );
});
```

为 fixture 明确设置 `alpha.category === gamma.category`、`beta.category` 不同。

- [ ] **Step 2：确认测试失败**

Run:

```bash
node --test tests/library-ui-model.test.mjs
```

Expected：退出码非 `0`，提示缺少新导出。

- [ ] **Step 3：实现纯模型函数**

在 `app/library-model.ts` 增加：

```ts
export type LibraryDensity = "comfortable" | "compact";

export type LibraryView = {
  query: string;
  category: LibraryCategory;
  density: LibraryDensity;
};

export const DEFAULT_LIBRARY_VIEW: LibraryView = {
  query: "",
  category: "all",
  density: "comfortable",
};

export function parseLibraryView(params: URLSearchParams): LibraryView {
  const density = params.get("density");
  return {
    query: params.get("q")?.trim() ?? "",
    category: params.get("category")?.trim() || "all",
    density: density === "compact" ? "compact" : "comfortable",
  };
}

export function serializeLibraryView(view: LibraryView): URLSearchParams {
  const params = new URLSearchParams();
  if (view.query) params.set("q", view.query);
  if (view.category !== "all") params.set("category", view.category);
  if (view.density !== "comfortable") params.set("density", view.density);
  return params;
}

export function findCardById(
  cards: readonly LibraryCard[],
  id: string,
): LibraryCard | null {
  return cards.find((card) => card.id === id) ?? null;
}

export function getAdjacentCardIds(
  cards: readonly Pick<LibraryCard, "id">[],
  id: string,
): { previousId: string | null; nextId: string | null } {
  const index = cards.findIndex((card) => card.id === id);
  if (index < 0) return { previousId: null, nextId: null };
  return {
    previousId: cards[index - 1]?.id ?? null,
    nextId: cards[index + 1]?.id ?? null,
  };
}

export function getRelatedCards(
  cards: readonly LibraryCard[],
  id: string,
  limit = 4,
): LibraryCard[] {
  const current = findCardById(cards, id);
  if (!current) return [];
  return cards
    .filter((card) => card.id !== id && card.category === current.category)
    .slice(0, limit);
}
```

- [ ] **Step 4：确认模型测试通过并提交**

Run:

```bash
node --test tests/library-ui-model.test.mjs
git add app/library-model.ts tests/library-ui-model.test.mjs
git commit -m "feat: model library navigation state"
```

Expected：测试全部通过，提交成功。

## Task 4：重构首页结构、URL 状态和目录恢复

**Files:**

- Modify: `app/shot-library.tsx`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/globals.css`

- [ ] **Step 1：先把首页服务端骨架验收写入渲染测试**

把首页断言改为：

```js
test("renders the compact contact-sheet library shell", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /VIDEO SHOTCRAFT/);
  assert.match(html, /快速找到下一镜/);
  assert.match(html, /搜索镜头 ID、用途或样式/);
  assert.match(html, /102 SHOTS/);
  assert.match(html, /159 PREVIEWS/);
  assert.doesNotMatch(html, /本地镜头库.*本地镜头库/s);
});
```

- [ ] **Step 2：确认旧首页不满足新骨架**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected：渲染测试因缺少“快速找到下一镜”或新搜索文案失败。

- [ ] **Step 3：改造 `ShotLibrary` 状态与结构**

把目录读取状态明确为：

```tsx
const [catalog, setCatalog] = useState<LibraryCatalog | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const [view, setView] = useState(DEFAULT_LIBRARY_VIEW);
const [activePreviewKey, setActivePreviewKey] = useState<string | null>(null);
const filteredCards = useMemo(
  () => filterCards(catalog?.cards ?? [], view.query, view.category),
  [catalog, view.query, view.category],
);

const loadCatalog = useCallback(async () => {
  setIsLoading(true);
  setErrorMessage(null);
  try {
    const response = await fetch("/data/library.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setCatalog(await response.json() as LibraryCatalog);
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "无法读取镜头目录",
    );
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  void loadCatalog();
}, [loadCatalog]);

useEffect(() => {
  setView(parseLibraryView(new URLSearchParams(window.location.search)));
}, []);

useEffect(() => {
  const query = serializeLibraryView(view).toString();
  window.history.replaceState(null, "", query ? `/?${query}` : "/");
}, [view]);

function rememberListState() {
  sessionStorage.setItem(
    "shot-library:navigation",
    JSON.stringify({
      ids: filteredCards.map((card) => card.id),
      href: `${window.location.pathname}${window.location.search}`,
      scrollY: window.scrollY,
    }),
  );
}
```

在初次装载后恢复滚动：

```tsx
useEffect(() => {
  const raw = sessionStorage.getItem("shot-library:return");
  if (!raw) return;
  sessionStorage.removeItem("shot-library:return");
  const scrollY = Number(raw);
  requestAnimationFrame(() => window.scrollTo({ top: scrollY }));
}, [catalog]);
```

页面 JSX 使用以下层级：

```tsx
<main className="library-shell" data-density={view.density}>
  <header className="site-nav">
    <a className="brand" href="/">VIDEO SHOTCRAFT</a>
    <nav aria-label="主导航">
      <a aria-current="page" href="/">镜头目录</a>
      <a href="/data/library.json">Agent JSON</a>
    </nav>
    <span className="nav-stats">102 SHOTS / 159 PREVIEWS</span>
  </header>

  <section className="library-intro">
    <p className="eyebrow">LOCAL MOTION REFERENCE</p>
    <h1>快速找到下一镜</h1>
    <p>搜索、筛选并直接预览可复用的视频镜头，进入详情查看配方与变体。</p>
  </section>

  <section className="library-toolbar" aria-label="目录筛选">
    <label className="search-field">
      <span className="sr-only">搜索镜头</span>
      <input
        type="search"
        value={view.query}
        placeholder="搜索镜头 ID、用途或样式"
        onChange={(event) =>
          setView((current) => ({ ...current, query: event.target.value }))}
      />
    </label>
    <div className="category-scroller" role="group" aria-label="镜头分类">
      {Object.entries(categoryCounts).map(([key, count]) => (
        <button
          key={key}
          type="button"
          aria-pressed={view.category === key}
          onClick={() =>
            setView((current) => ({ ...current, category: key }))}
        >
          {key === "all"
            ? "全部"
            : catalog.categories[key]?.zh ?? key}
          <span>{count}</span>
        </button>
      ))}
    </div>
    <span className="result-count">{filteredCards.length} RESULTS</span>
    <div className="density-toggle" role="group" aria-label="目录密度">
      {(["comfortable", "compact"] as const).map((density) => (
        <button
          key={density}
          type="button"
          aria-pressed={view.density === density}
          onClick={() =>
            setView((current) => ({ ...current, density }))}
        >
          {density === "comfortable" ? "舒适" : "紧凑"}
        </button>
      ))}
    </div>
  </section>

  <section className="shot-grid" aria-live="polite">
    {filteredCards.map((card) => (
      <ShotCard
        key={card.id}
        card={card}
        categoryLabel={catalog.categories[card.category]?.zh ?? card.category}
        density={view.density}
        isPreviewActive={activePreviewKey === card.id}
        onPreviewChange={(active) =>
          setActivePreviewKey((current) =>
            active ? card.id : current === card.id ? null : current)}
        onNavigate={rememberListState}
      />
    ))}
  </section>
</main>
```

在上述 JSX 前定义：

```tsx
const categoryCounts = useMemo(
  () => getCategoryCounts(catalog?.cards ?? []),
  [catalog],
);

if (isLoading) {
  return <main className="library-loading" aria-busy="true">正在读取镜头目录</main>;
}

if (!catalog || errorMessage) {
  return (
    <main className="library-shell">
      <div className="catalog-error" role="alert">
        <strong>目录加载失败</strong>
        <p>{errorMessage ?? "目录数据不可用"}</p>
        <button type="button" onClick={() => void loadCatalog()}>
          重新加载
        </button>
      </div>
    </main>
  );
}
```

无结果状态必须包含：

```tsx
<div className="empty-state">
  <strong>没有匹配的镜头</strong>
  <p>尝试缩短关键词或清空分类。</p>
  <button type="button" onClick={() => setView(DEFAULT_LIBRARY_VIEW)}>
    清空筛选
  </button>
</div>
```

- [ ] **Step 4：写入基础视觉令牌和首页壳层**

在 `app/globals.css` 顶部替换为：

```css
:root {
  --page: #07080a;
  --panel: #101216;
  --player: #030405;
  --line: #242933;
  --line-strong: #353c48;
  --text: #f4f6f8;
  --muted: #8b939f;
  --accent: #ff5a1f;
  --error: #ff6b5f;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

html {
  color-scheme: dark;
  background: var(--page);
}

body {
  margin: 0;
  color: var(--text);
  background: var(--page);
  font-family: var(--sans);
}

.site-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  min-height: 56px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 clamp(16px, 3vw, 48px);
  border-bottom: 1px solid var(--line);
  background: rgb(7 8 10 / 92%);
  backdrop-filter: blur(14px);
}

.library-intro {
  max-width: 1680px;
  min-height: 132px;
  margin: 0 auto;
  padding: 26px clamp(16px, 3vw, 48px) 22px;
}

.library-intro h1 {
  margin: 4px 0 8px;
  font-size: clamp(2.25rem, 3.2vw, 3rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.library-toolbar {
  position: sticky;
  top: 56px;
  z-index: 25;
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, auto) auto auto;
  gap: 12px;
  align-items: center;
  min-height: 60px;
  padding: 8px clamp(16px, 3vw, 48px);
  border-block: 1px solid var(--line);
  background: rgb(7 8 10 / 94%);
  backdrop-filter: blur(14px);
}
```

- [ ] **Step 5：构建并验证首页骨架**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
npm run typecheck
```

Expected：全部退出码为 `0`。

- [ ] **Step 6：提交首页结构**

Run:

```bash
git add app/shot-library.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: redesign library discovery shell"
```

## Task 5：实现大画幅卡片、封面优先和单实例延迟预览

**Files:**

- Modify: `app/shot-card.tsx`
- Modify: `app/shot-video.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1：先加入源代码性能契约**

在 `tests/rendered-html.test.mjs` 增加：

```js
test("card preview source keeps posters first and removes numeric variants", async () => {
  const [cardSource, videoSource] = await Promise.all([
    readFile(path.join(projectRoot, "app/shot-card.tsx"), "utf8"),
    readFile(path.join(projectRoot, "app/shot-video.tsx"), "utf8"),
  ]);
  assert.match(cardSource, /posterUrl/);
  assert.match(cardSource, /\/shots\/\$\{card\.id\}/);
  assert.doesNotMatch(cardSource, /style-switcher/);
  assert.match(videoSource, /PREVIEW_DELAY_MS = 120/);
  assert.match(videoSource, /prefers-reduced-motion: reduce/);
  assert.match(videoSource, /src=\{source/);
});
```

同时从 `node:fs/promises` 导入 `readFile`，并定义：

```js
const projectRoot = path.resolve(import.meta.dirname, "..");
```

- [ ] **Step 2：确认旧卡片违反契约**

Run:

```bash
node --test tests/rendered-html.test.mjs
```

Expected：失败项至少包含缺少 `posterUrl` 和仍有 `style-switcher`。

- [ ] **Step 3：重写 `ShotVideo` 为封面优先**

`app/shot-video.tsx` 的公共接口改为：

```tsx
type ShotVideoProps = {
  active?: boolean;
  controls?: boolean;
  preview?: boolean;
  style: ShotStyle;
  onPreviewChange?: (active: boolean) => void;
};

const PREVIEW_DELAY_MS = 120;
```

核心状态与行为：

```tsx
const videoRef = useRef<HTMLVideoElement>(null);
const timerRef = useRef<number | null>(null);
const [source, setSource] = useState<string | null>(
  controls ? style.previewUrl : null,
);
const [hasError, setHasError] = useState(false);

function requestPreview() {
  if (
    !preview ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) return;
  if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  timerRef.current = window.setTimeout(() => {
    onPreviewChange?.(true);
  }, PREVIEW_DELAY_MS);
}

function cancelPreview() {
  if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  timerRef.current = null;
  videoRef.current?.pause();
  if (!controls) setSource(null);
  onPreviewChange?.(false);
}

useEffect(() => {
  if (!active || !style.previewUrl) {
    videoRef.current?.pause();
    if (!controls) setSource(null);
    return;
  }
  setSource(style.previewUrl);
}, [active, controls, style.previewUrl]);

useEffect(() => {
  const video = videoRef.current;
  if (!video || !source || !active) return;
  void video.play().catch(() => setHasError(true));
}, [active, source]);

useEffect(() => cancelPreview, []);
```

渲染结构：

```tsx
<div
  className="shot-video-frame"
  onMouseEnter={requestPreview}
  onMouseLeave={cancelPreview}
  onFocus={requestPreview}
  onBlur={cancelPreview}
>
  {style.posterUrl && (
    <img
      className="shot-poster"
      src={style.posterUrl}
      alt=""
      loading={controls ? "eager" : "lazy"}
      decoding="async"
    />
  )}
  <video
    ref={videoRef}
    className="shot-video"
    controls={controls}
    loop={!controls}
    muted={!controls}
    playsInline
    preload="none"
    src={source ?? undefined}
    aria-label={`${style.label} 视频预览`}
    onError={() => setHasError(true)}
  />
  {hasError && <p className="media-message">预览加载失败</p>}
</div>
```

用 `IntersectionObserver` 观察整个 frame；离开视口时调用 `cancelPreview()`。不要在进入视口时设置视频 `src`。

- [ ] **Step 4：重写卡片为单个链接**

`ShotCard` props：

```tsx
type ShotCardProps = {
  card: LibraryCard;
  categoryLabel: string;
  density: LibraryDensity;
  isPreviewActive: boolean;
  onPreviewChange: (active: boolean) => void;
  onNavigate: () => void;
};
```

卡片 JSX：

```tsx
const style = card.styles[0];

return (
  <article className="shot-card">
    <a
      className="shot-card-link"
      href={`/shots/${card.id}`}
      onClick={onNavigate}
    >
      <div className="shot-stage">
        {style ? (
          <ShotVideo
            active={isPreviewActive}
            preview
            style={style}
            onPreviewChange={onPreviewChange}
          />
        ) : (
          <p className="media-message">该镜头暂无动态样式</p>
        )}
        <span className="play-cue" aria-hidden="true">▶ PREVIEW</span>
        <span className="duration-cue">{card.duration}</span>
        {card.styles.length > 1 && (
          <span className="variant-cue">{card.styles.length} VARIANTS</span>
        )}
      </div>
      <div className="card-body">
        <strong title={card.id}>{card.id}</strong>
        <p><span>{categoryLabel}</span>{card.use}</p>
      </div>
    </a>
  </article>
);
```

- [ ] **Step 5：实现 4/3/2/1 网格与紧凑正文**

在 `app/globals.css` 增加或替换：

```css
.shot-grid {
  width: min(1680px, 100%);
  margin: 0 auto;
  padding: 18px clamp(16px, 3vw, 48px) 56px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.library-shell[data-density="compact"] .shot-grid {
  gap: 10px;
}

.shot-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  transition: border-color 160ms ease, filter 160ms ease;
}

.shot-card:focus-within,
.shot-card:hover {
  border-color: var(--line-strong);
  filter: brightness(1.06);
}

.shot-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.shot-card-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.shot-stage,
.shot-video-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--player);
}

.shot-poster,
.shot-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.shot-video {
  z-index: 1;
}

.card-body {
  min-height: 84px;
  padding: 14px 15px;
}

.card-body strong {
  display: block;
  overflow: hidden;
  font: 600 0.98rem/1.25 var(--mono);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body p {
  display: flex;
  gap: 8px;
  min-width: 0;
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
  white-space: nowrap;
}

.card-body p span {
  flex: 0 0 auto;
  color: var(--text);
}

.card-body p {
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1499px) {
  .shot-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 1099px) {
  .shot-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .library-toolbar { grid-template-columns: 1fr auto; }
  .category-scroller { grid-column: 1 / -1; order: 3; overflow-x: auto; }
}

@media (max-width: 719px) {
  .shot-grid { grid-template-columns: 1fr; }
  .site-nav { grid-template-columns: 1fr auto; }
  .site-nav nav { display: none; }
  .nav-stats { justify-self: end; font-size: 0.65rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6：验证性能契约和构建**

Run:

```bash
node --test tests/rendered-html.test.mjs
npm run typecheck
npm run build
```

Expected：全部退出码为 `0`。浏览器查看首页源码时，初始 HTML 中不得出现 `src="/media/`。

- [ ] **Step 7：提交卡片和预览**

Run:

```bash
git add app/shot-card.tsx app/shot-video.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add poster-first shot previews"
```

## Task 6：新增独立详情路由、变体缩略图和连续浏览

**Files:**

- Create: `app/shots/[id]/page.tsx`
- Create: `app/shot-detail.tsx`
- Create: `app/variant-strip.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1：先加入详情路由渲染测试**

扩展测试 helper，使 `render(pathname)` 支持任意路径，然后新增：

```js
test("renders an existing shot detail route", async () => {
  const response = await render("/shots/ai-stream-response");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /ai-stream-response/);
  assert.match(html, /复制镜头 ID/);
  assert.match(html, /上一镜/);
  assert.match(html, /下一镜/);
});

test("renders a clear unknown shot state", async () => {
  const response = await render("/shots/not-a-real-shot");
  const html = await response.text();
  assert.match(html, /镜头不存在/);
  assert.match(html, /返回镜头目录/);
});
```

- [ ] **Step 2：确认详情路由当前返回 404**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected：详情路由测试失败。

- [ ] **Step 3：创建服务端详情路由**

创建 `app/shots/[id]/page.tsx`：

```tsx
import type { Metadata } from "next";

import catalogJson from "../../../public/data/library.json";
import {
  findCardById,
  getRelatedCards,
  type LibraryCatalog,
} from "../../library-model";
import { ShotDetail } from "../../shot-detail";

const catalog = catalogJson as unknown as LibraryCatalog;

type ShotPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: ShotPageProps,
): Promise<Metadata> {
  const { id } = await params;
  const card = findCardById(catalog.cards, decodeURIComponent(id));
  return card
    ? { title: `${card.id} · Video Shotcraft`, description: card.summary }
    : { title: "镜头不存在 · Video Shotcraft" };
}

export default async function ShotPage({ params }: ShotPageProps) {
  const { id } = await params;
  const card = findCardById(catalog.cards, decodeURIComponent(id));

  if (!card) {
    return (
      <main className="detail-not-found">
        <p className="eyebrow">404 / SHOT NOT FOUND</p>
        <h1>镜头不存在</h1>
        <p>该镜头可能已被排除，或链接中的 ID 不正确。</p>
        <a className="primary-action" href="/">返回镜头目录</a>
      </main>
    );
  }

  return (
    <ShotDetail
      card={card}
      categoryLabel={catalog.categories[card.category]?.zh ?? card.category}
      fallbackIds={catalog.cards.map((item) => item.id)}
      relatedCards={getRelatedCards(catalog.cards, card.id, 4)}
    />
  );
}
```

- [ ] **Step 4：创建变体缩略图组件**

创建 `app/variant-strip.tsx`：

```tsx
"use client";

import type { ShotStyle } from "./library-model";

type VariantStripProps = {
  activeKey: string;
  styles: readonly ShotStyle[];
  onChange: (key: string) => void;
};

export function VariantStrip({
  activeKey,
  styles,
  onChange,
}: VariantStripProps) {
  if (styles.length <= 1) return null;
  return (
    <div className="variant-strip" aria-label="镜头变体">
      {styles.map((style) => (
        <button
          key={style.key}
          className={style.key === activeKey ? "is-active" : ""}
          type="button"
          aria-pressed={style.key === activeKey}
          onClick={() => onChange(style.key)}
        >
          {style.posterUrl && <img src={style.posterUrl} alt="" loading="lazy" />}
          <span>{style.label}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5：创建详情交互组件**

创建 `app/shot-detail.tsx`：

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getAdjacentCardIds,
  type LibraryCard,
} from "./library-model";
import { ShotVideo } from "./shot-video";
import { VariantStrip } from "./variant-strip";

type ShotDetailProps = {
  card: LibraryCard;
  categoryLabel: string;
  fallbackIds: string[];
  relatedCards: LibraryCard[];
};

function readNavigation(fallbackIds: string[]) {
  try {
    const parsed = JSON.parse(
      sessionStorage.getItem("shot-library:navigation") ?? "null",
    );
    if (
      Array.isArray(parsed?.ids) &&
      parsed.ids.every((id: unknown) => typeof id === "string")
    ) {
      return {
        ids: parsed.ids as string[],
        href: typeof parsed.href === "string" ? parsed.href : "/",
        scrollY: Number(parsed.scrollY) || 0,
      };
    }
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      console.error("Failed to read library navigation", error);
    }
  }
  return { ids: fallbackIds, href: "/", scrollY: 0 };
}

export function ShotDetail({
  card,
  categoryLabel,
  fallbackIds,
  relatedCards,
}: ShotDetailProps) {
  const [activeKey, setActiveKey] = useState(card.styles[0]?.key ?? "");
  const [navigation, setNavigation] = useState({
    ids: fallbackIds,
    href: "/",
    scrollY: 0,
  });
  const activeStyle =
    card.styles.find((style) => style.key === activeKey) ?? card.styles[0];
  const adjacent = useMemo(
    () => getAdjacentCardIds(
      navigation.ids.map((id) => ({ id })),
      card.id,
    ),
    [card.id, navigation.ids],
  );

  useEffect(() => setNavigation(readNavigation(fallbackIds)), [fallbackIds]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;
      const target = event.key === "ArrowLeft"
        ? adjacent.previousId
        : event.key === "ArrowRight"
          ? adjacent.nextId
          : null;
      if (target) window.location.href = `/shots/${target}`;
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [adjacent.nextId, adjacent.previousId]);

  function returnToLibrary() {
    sessionStorage.setItem("shot-library:return", String(navigation.scrollY));
    window.location.href = navigation.href;
  }

  async function copyId() {
    await navigator.clipboard.writeText(card.id);
  }

  return (
    <main className="detail-shell">
      <header className="detail-nav">
        <button type="button" onClick={returnToLibrary}>← 返回目录</button>
        <div>
          {adjacent.previousId ? (
            <a href={`/shots/${adjacent.previousId}`}>← 上一镜</a>
          ) : <span>← 上一镜</span>}
          {adjacent.nextId ? (
            <a href={`/shots/${adjacent.nextId}`}>下一镜 →</a>
          ) : <span>下一镜 →</span>}
        </div>
      </header>

      <div className="detail-layout">
        <section className="detail-media">
          {activeStyle && (
            <ShotVideo
              key={activeStyle.key}
              active
              controls
              style={activeStyle}
            />
          )}
          <VariantStrip
            activeKey={activeKey}
            styles={card.styles}
            onChange={setActiveKey}
          />
        </section>

        <aside className="detail-info">
          <p className="eyebrow">{categoryLabel}</p>
          <h1>{card.id}</h1>
          <p className="detail-summary">{card.summary}</p>
          <dl>
            <div><dt>用途</dt><dd>{card.use}</dd></div>
            <div><dt>时长</dt><dd>{card.duration}</dd></div>
            <div><dt>能量</dt><dd>{card.energy}</dd></div>
            <div><dt>状态</dt><dd>{activeStyle?.implementationStatus}</dd></div>
            <div><dt>变体</dt><dd>{card.styles.length}</dd></div>
          </dl>
          <button className="primary-action" type="button" onClick={copyId}>
            复制镜头 ID
          </button>
          {card.recipeUrl && (
            <a href={card.recipeUrl} target="_blank" rel="noreferrer">
              打开配方
            </a>
          )}
          {card.demoFiles.length > 0 && (
            <ul className="demo-files">
              {card.demoFiles.map((file) => (
                <li key={file}><code>{file}</code></li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <details className="technical-details">
        <summary>完整技术信息</summary>
        <p>{activeStyle?.description}</p>
        <code>{card.recipePath}</code>
      </details>

      <section className="related-shots">
        <h2>同类镜头</h2>
        <div>
          {relatedCards.map((related) => (
            <a key={related.id} href={`/shots/${related.id}`}>
              {related.styles[0]?.posterUrl && (
                <img src={related.styles[0].posterUrl} alt="" loading="lazy" />
              )}
              <span>{related.id}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
```

日志不得附加 `sessionStorage` 原文，避免把用户查询内容复制到控制台。

- [ ] **Step 6：加入详情桌面和移动样式**

在 `app/globals.css` 增加：

```css
.detail-shell {
  width: min(1680px, 100%);
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 48px) 72px;
}

.detail-nav {
  min-height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line);
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 68fr) minmax(300px, 32fr);
  gap: clamp(24px, 3vw, 52px);
  padding-top: 28px;
}

.detail-media .shot-video-frame {
  width: 100%;
  max-height: calc(100vh - 154px);
  border: 1px solid var(--line);
  border-radius: 8px;
}

.detail-info {
  position: sticky;
  top: 24px;
  align-self: start;
}

.detail-info h1 {
  overflow-wrap: anywhere;
  margin: 8px 0 16px;
  font: 650 clamp(2rem, 3vw, 2.5rem)/1.05 var(--mono);
}

.detail-summary {
  display: -webkit-box;
  overflow: hidden;
  color: var(--muted);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.detail-info dl div {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}

.primary-action {
  min-height: 44px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  color: var(--text);
  background: var(--accent);
}

.variant-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 12px 0;
}

.variant-strip button {
  flex: 0 0 180px;
  min-height: 92px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--text);
  background: var(--panel);
}

.variant-strip button.is-active {
  border-color: var(--accent);
}

.variant-strip img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  background: var(--player);
}

.related-shots > div {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 900px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-info { position: static; }
  .related-shots > div { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 520px) {
  .detail-nav { align-items: flex-start; gap: 12px; padding-block: 12px; }
  .detail-nav > div { display: flex; gap: 12px; }
  .variant-strip button { flex-basis: 80%; }
  .related-shots > div { grid-template-columns: 1fr; }
}
```

- [ ] **Step 7：验证路由、类型和构建**

Run:

```bash
npm run typecheck
npm run build
node --test tests/rendered-html.test.mjs
```

Expected：现有 ID 与未知 ID 测试均通过，全部退出码为 `0`。

- [ ] **Step 8：提交详情页**

Run:

```bash
git add app/shots/[id]/page.tsx app/shot-detail.tsx app/variant-strip.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add cinematic shot detail pages"
```

## Task 7：移除旧弹窗并补齐可访问性与错误状态

**Files:**

- Delete: `app/shot-dialog.tsx`
- Modify: `app/shot-library.tsx`
- Modify: `app/shot-video.tsx`
- Modify: `app/shot-detail.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1：先写旧弹窗删除契约**

在 `tests/rendered-html.test.mjs` 增加：

```js
test("the legacy detail dialog is no longer referenced", async () => {
  const librarySource = await readFile(
    path.join(projectRoot, "app/shot-library.tsx"),
    "utf8",
  );
  assert.doesNotMatch(librarySource, /ShotDialog|selectedCard/);
  await assert.rejects(
    access(path.join(projectRoot, "app/shot-dialog.tsx")),
    { code: "ENOENT" },
  );
});
```

从 `node:fs/promises` 一并导入 `access`。

- [ ] **Step 2：确认测试因旧文件存在而失败**

Run:

```bash
node --test tests/rendered-html.test.mjs
```

Expected：失败项包含 `shot-dialog.tsx` 仍存在。

- [ ] **Step 3：删除旧弹窗和相关状态**

删除 `app/shot-dialog.tsx`，并确认 `ShotLibrary` 没有 `selectedCard`、`setSelectedCard` 或 `ShotDialog` import。

- [ ] **Step 4：补齐明确错误与键盘状态**

首页 catalog 失败状态必须提供：

```tsx
<div className="catalog-error" role="alert">
  <strong>目录加载失败</strong>
  <p>{errorMessage}</p>
  <button type="button" onClick={loadCatalog}>重新加载</button>
</div>
```

`ShotVideo` 错误后保留海报，错误文案使用 `role="status"`，详情模式增加显式重试：

```tsx
{hasError && (
  <div className="media-message" role="status">
    <span>视频加载失败</span>
    {controls && (
      <button
        type="button"
        onClick={() => {
          setHasError(false);
          setSource(null);
          requestAnimationFrame(() => setSource(style.previewUrl));
        }}
      >
        重试
      </button>
    )}
  </div>
)}
```

所有按钮和链接最小点击高度 `44px`；为 `.sr-only`、`:focus-visible`、错误色和 disabled 状态补齐 CSS：

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.catalog-error,
.media-message {
  color: var(--error);
}

[aria-disabled="true"],
button:disabled {
  color: var(--muted);
  cursor: not-allowed;
}
```

- [ ] **Step 5：运行完整静态检查并提交**

Run:

```bash
node --test tests/rendered-html.test.mjs
npm run lint
npm run typecheck
npm run build
git add app/shot-library.tsx app/shot-video.tsx app/shot-detail.tsx app/globals.css tests/rendered-html.test.mjs
git add -u app/shot-dialog.tsx
git commit -m "refactor: remove legacy shot dialog"
```

Expected：全部检查通过，提交中包含删除 `app/shot-dialog.tsx`。

## Task 8：完成端到端验证、响应式视觉检查和 Cloudflare 打包检查

**Files:**

- Modify if needed: `tests/library-data.test.mjs`
- Modify if needed: `tests/library-ui-model.test.mjs`
- Modify if needed: `tests/rendered-html.test.mjs`
- Modify if needed: `app/globals.css`

- [ ] **Step 1：运行全部自动化测试**

Run:

```bash
npm test
npm run lint
npm run typecheck
```

Expected：全部退出码为 `0`；数据为 `102` 张卡片、`159` 个预览、`159` 张封面。

- [ ] **Step 2：检查没有远程媒体回退和临时文件**

Run:

```bash
node -e 'const x=require("./public/data/library.json"); const styles=x.cards.flatMap(c=>c.styles).filter(s=>s.previewUrl); if(styles.some(s=>/^https?:/.test(s.previewUrl)||!s.posterUrl)) process.exit(1); console.log(styles.length)'
find public/posters -type f -name '*.tmp.webp' | wc -l
find public/posters -type f -name '*.webp' -size 0 | wc -l
```

Expected:

```text
159
0
0
```

- [ ] **Step 3：启动本地站点进行浏览器验收**

Run:

```bash
npm run dev
```

Expected：终端显示本地访问地址且无构建错误。

按以下固定视口截图检查：

| 视口 | 必须满足 |
|---|---|
| 1600×1000 | 四列，导航、介绍、工具栏和第一排完整卡片均可见 |
| 1440×900 | 第一排完整卡片可见，正文不超过两行 |
| 1200×900 | 三列，卡片无横向溢出 |
| 768×1024 | 两列，分类可横向滚动 |
| 390×844 | 一列，按钮点击高度至少 44px |

交互检查：

1. 首页初次加载 Network 中没有 MP4 请求；
2. 悬停单卡 120ms 后只请求一条 `/media/*.mp4`；
3. 移到第二张卡时第一条视频暂停；
4. 启用“减少动态效果”后悬停不请求 MP4；
5. 搜索、分类、密度写入 URL；
6. 进入详情后播放器显著大于首页卡片；
7. 多变体缩略图可切换；
8. 左右方向键遵循当前筛选结果；
9. 返回目录恢复查询参数与滚动位置；
10. 访问不存在 ID 显示明确返回入口。

- [ ] **Step 4：执行 Cloudflare dry-run 并检查静态资源包含关系**

Run:

```bash
npx wrangler deploy --dry-run
```

Expected：退出码为 `0`，输出无超出平台限制或缺失静态资产的错误。若 dry-run 输出静态资产数量，必须覆盖 `159` 个 MP4、`159` 个 WebP 和 `public/data/library.json`。

- [ ] **Step 5：仅提交验收中发现的最小修正**

如果步骤 1–4 没有产生代码改动，不创建空提交。若有修正：

```bash
git add app tests scripts package.json public/data/library.json
git commit -m "fix: finish shot library visual verification"
```

不得加入 `public/media/` 或 `public/posters/`。

- [ ] **Step 6：确认最终工作树和提交范围**

Run:

```bash
git status --short
git log --oneline --decorate -8
```

Expected：除被 `.gitignore` 忽略的本地媒体与封面外，工作树为空；提交历史按任务拆分且不包含二进制预览资产。

## 最终完成条件

- [ ] 首页视觉符合已确认的黑灰接触表方案，强调色仅为 `#FF5A1F`。
- [ ] 1600px/1200px/768px/390px 分别为 4/3/2/1 列。
- [ ] 102 张镜头与 159 个样式可搜索，排除项未恢复。
- [ ] 159 个本地 MP4 只在悬停、聚焦或详情播放时请求。
- [ ] 159 张 640×360 WebP 封面全部存在、非空且不超过 100KB。
- [ ] 独立 `/shots/[id]` 详情页、多变体、相邻浏览、返回恢复均可用。
- [ ] 旧 `ShotDialog` 已删除。
- [ ] `npm test`、`npm run lint`、`npm run typecheck` 与 Wrangler dry-run 全部通过。
- [ ] Git 提交中不含本地 MP4 和生成的 WebP。
