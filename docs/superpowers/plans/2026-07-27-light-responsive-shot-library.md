# Light Responsive Shot Library Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有镜头库改为浅色、左侧集中筛选、右侧自适应卡片的布局，并让进入可视区的卡片预览默认静音循环播放。

**Architecture:** 保留现有数据模型、筛选状态与详情弹窗，只调整 `ShotLibrary` 的 DOM 分区和现有 CSS 覆盖层。MP4 与本地 Player 分别维护“接近视口时加载”和“真正进入视口时播放”两种状态；详情页仍由用户手动控制，不参与自动播放。

**Tech Stack:** React 19、TypeScript、CSS Grid、IntersectionObserver、Node test runner、vinext/Vite、Codex Sites

---

## Task 1: 固化浅色响应式布局契约

**Files:**

- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Step 1: 写失败测试**

将现有“固定四列、橙色深色主题”断言替换为以下契约：

```js
assert.match(library, /<aside className="filter-sidebar" aria-label="筛选镜头">/);
assert.match(css, /color-scheme:\s*light/);
assert.match(
  css,
  /grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(300px,\s*1fr\)\)/,
);
assert.match(css, /\.filter-sidebar\s*\{[^}]*position:\s*sticky/s);
assert.match(css, /\.shot-card\s*\{[^}]*border-radius:\s*22px/s);
assert.doesNotMatch(card, /悬停预览/);
```

同时保留对大尺寸详情弹窗、简洁卡片信息和无旧品牌信息的断言。

**Step 2: 运行测试并确认失败**

Run:

```bash
node --test tests/rendered-html.test.mjs
```

Expected: FAIL，指出尚未存在 `filter-sidebar`、浅色主题和 `auto-fill` 网格。

**Step 3: 提交测试**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define light responsive library layout"
```

## Task 2: 重组筛选区并完成浅色视觉

**Files:**

- Modify: `app/shot-library.tsx`
- Modify: `app/shot-card.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Step 1: 重组页面结构**

在 `app/shot-library.tsx` 中：

- 保留紧凑顶部标题与统计。
- 将搜索框、分类、等级、标签全部放入 `<aside className="filter-sidebar">`。
- 右侧 `library-panel` 只保留结果栏、状态提示和卡片网格。
- 不改变 `query`、`category`、`grade`、`selectedTags` 与现有筛选函数。
- 移动端继续使用同一 DOM，只通过 CSS 将侧栏变为顶部非粘性区域。

预期结构：

```tsx
<div className="catalog-shell">
  <aside className="filter-sidebar" aria-label="筛选镜头">
    <label className="search-field">...</label>
    <section className="filter-section">...</section>
    <section className="filter-section">...</section>
    <section className="filter-section">...</section>
  </aside>
  <section className="library-panel">...</section>
</div>
```

**Step 2: 精简卡片文案**

在 `app/shot-card.tsx` 中去掉“悬停预览”，保留一个不承诺交互方式的简洁状态，例如：

```tsx
<div className="stage-caption">
  <span className="live-dot" aria-hidden="true" />
  <span>动态预览</span>
</div>
```

**Step 3: 写入浅色样式覆盖**

在 `app/globals.css` 中用一组最终覆盖规则替换旧的 `Compact contact-sheet presentation`：

- 暖灰白页面背景、白色面板、深灰文字、柔和紫/绿/橙强调。
- `catalog-shell` 使用 `260px minmax(0, 1fr)` 两列。
- `filter-sidebar` 为白色、24–28px 圆角、桌面端粘性。
- `shot-grid` 必须使用：

```css
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
```

- 卡片 22px 圆角、16:9 预览、轻边框和轻阴影。
- 详情弹窗保持大尺寸，改为浅色 28px 圆角。
- `<1020px` 收窄侧栏；`<720px` 改为单列，筛选区回到文档流。
- `:focus-visible` 保持清楚可辨，`prefers-reduced-motion` 保留现有降级。

**Step 4: 运行目标测试**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: PASS。

**Step 5: 提交布局改动**

```bash
git add app/shot-library.tsx app/shot-card.tsx app/globals.css
git commit -m "feat: redesign shot library as light responsive catalog"
```

## Task 3: 让卡片预览按可视区自动播放

**Files:**

- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/shot-video.tsx`
- Modify: `app/shot-player.tsx`
- Test: `tests/rendered-html.test.mjs`

**Step 1: 写失败测试**

用源码契约覆盖以下行为：

```js
assert.match(videoSource, /visibleRef/);
assert.match(videoSource, /prefers-reduced-motion:\s*reduce/);
assert.match(videoSource, /onCanPlay=\{syncPlayback\}/);
assert.doesNotMatch(videoSource, /onMouseEnter=\{playPreview\}/);

assert.match(playerSource, /visibleRef/);
assert.match(playerSource, /const visibleObserver = new IntersectionObserver/);
assert.match(playerSource, /onLoad=\{\(\) => syncPlayback\(\)\}/);
assert.doesNotMatch(playerSource, /hoveredRef|focusedRef/);
```

**Step 2: 运行测试并确认失败**

Run:

```bash
node --test tests/rendered-html.test.mjs
```

Expected: FAIL，指出仍为 hover/focus 驱动。

**Step 3: 实现 MP4 可视区播放**

在 `app/shot-video.tsx` 中：

- 接近视口时才设置 `src`，避免一次加载全部视频。
- 使用无 `rootMargin` 的观察器记录是否真正进入可视区。
- 进入可视区且 `controls=false`、未启用 reduced motion 时调用 `play()`。
- 离开可视区、组件卸载或启用 reduced motion 时调用 `pause()`。
- `onCanPlay` 再同步一次，解决首次设定 `src` 时播放器尚未就绪。
- `controls=true` 的详情视频保持手动控制。

**Step 4: 实现 Player 可视区播放**

在 `app/shot-player.tsx` 中：

- 保留接近视口才创建 iframe 的观察器。
- 增加实际可见性观察器，以 `postMessage({ type: "play" | "pause" })` 控制 Player。
- iframe `onLoad` 后重新发送期望播放状态。
- 删除 hover/focus refs 与事件处理。
- reduced motion 或 `controls=true` 时不自动发送 play。

**Step 5: 运行目标测试**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: PASS。

**Step 6: 提交播放改动**

```bash
git add tests/rendered-html.test.mjs app/shot-video.tsx app/shot-player.tsx
git commit -m "feat: autoplay visible shot previews"
```

## Task 4: 完整验证与本地视觉检查

**Files:**

- Verify: `app/shot-library.tsx`
- Verify: `app/shot-card.tsx`
- Verify: `app/shot-video.tsx`
- Verify: `app/shot-player.tsx`
- Verify: `app/globals.css`

**Step 1: 运行完整测试**

Run:

```bash
npm test
```

Expected: 数据测试、生产构建和界面测试全部 PASS；只允许保留项目原有的 CSS 顺序与大 chunk 警告。

**Step 2: 运行类型检查**

Run:

```bash
npm run typecheck
```

Expected: PASS，无 TypeScript 错误。

**Step 3: 启动本地预览并检查**

Run:

```bash
npm run dev
```

检查：

- 宽屏下右侧列数随宽度增加，不固定三列。
- 普通桌面约三列，窄屏两列，手机单列。
- 左侧筛选包含搜索、分类、等级和标签。
- 视口中的卡片静音循环播放，离开视口暂停。
- 详情弹窗足够大，并保留手动控制。
- reduced motion 下不自动播放。

**Step 4: 检查提交范围**

Run:

```bash
git status --short
git diff --check
git log --oneline --max-count=5
```

Expected: 无意外生成文件或无关改动。

## Task 5: 保存 Codex Sites 版本并等待发布确认

**Files:**

- Read: `.openai/hosting.json`
- Deploy source: 当前分支已验证的精确提交

**Step 1: 提交最终状态**

如视觉检查产生必要的小修复，先补测试、提交，并重新执行 Task 4 的完整验证。

**Step 2: 推送精确源码状态**

将已验证分支推送到项目关联的远端，记录对应 `commit_sha`。不得用未提交或与本地不一致的源码保存 Sites 版本。

**Step 3: 保存新 Sites 版本**

复用 `.openai/hosting.json` 中已有的 Sites 项目：

```text
appgprj_6a669127dbe081919cba3d2932d7e544
```

保存一个新的、尚未部署的版本，并记录版本号。

**Step 4: 向用户展示版本信息并请求发布确认**

报告测试结果、改动摘要和新版本号。仅在用户明确确认后，将该已保存版本部署到生产地址。

