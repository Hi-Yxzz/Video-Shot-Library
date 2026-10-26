# Screenshot Recording Shot Clones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 复刻“截图·录屏”分类 11 个参考镜头并接入现有镜头库。

**Architecture:** 新建 `src/screenshot-recording/`，由目录配置注册 11 个 Composition，一个共享场景组件按 variant 渲染人物、截图、浏览器卡片、焦点框和媒体轨道。布局与时间锚点集中在参考常量中，预览与可编辑源文件同步到镜头库。

**Tech Stack:** React、TypeScript、Remotion、Vitest、FFmpeg。

---

### Task 1: 镜头目录与几何契约

**Files:**
- Create: `src/screenshot-recording/types.ts`
- Create: `src/screenshot-recording/catalog.ts`
- Create: `src/screenshot-recording/reference-layout.ts`
- Create: `src/screenshot-recording/catalog.test.ts`
- Create: `src/screenshot-recording/reference-layout.test.ts`

- [ ] 写失败测试：断言 11 个稳定 ID、3 个 A-roll、8 个 B-roll、180 帧，以及每种变体的关键包围盒。
- [ ] 运行 `npx vitest run src/screenshot-recording/*.test.ts`，确认因目录与布局尚不存在而失败。
- [ ] 实现类型、目录和参考布局常量，默认人物资源为 `assets/portrait-landscape.png`。
- [ ] 重跑目标测试，确认通过。

### Task 2: 共享截图与录屏场景

**Files:**
- Create: `src/screenshot-recording/ScreenshotRecordingScene.tsx`
- Modify: `src/Root.tsx`

- [ ] 实现 `NarratorLayer`、`ScreenPlaceholder`、`BrowserCard`、`FocusRing`、`CardDeck` 和 `MediaRail`。
- [ ] 实现 11 个 variant：`showcase`、`screenshot`、`shotfull`、`scrollshot`、`brollstack`、`shotrotate`、`ring`、`rc012`、`rc018`、`rc019`、`rc025`。
- [ ] 使用 `useCurrentFrame()` 与 `interpolate()` 完成 0/30/60/90/120/165 帧阶段动画。
- [ ] 在 `src/Root.tsx` 映射注册全部 Composition。
- [ ] 运行 `npm test && npm run lint`，确认测试与类型检查通过。

### Task 3: 代表帧校准与完整渲染

**Files:**
- Create: `out/xcyj-screenshot-recording/*.mp4`

- [ ] 用 `npx remotion still` 渲染每个镜头的代表帧。
- [ ] 与 `/tmp/xcyj-screenshot-recording/*.mp4` 的同帧截图组成对比图，校准主体尺寸、位置、颜色和阶段时间。
- [ ] 并行渲染 11 个 MP4。
- [ ] 用 FFmpeg 画面流拷贝移除音轨。
- [ ] 用 ffprobe 验证 1920×1080、30fps、180 帧、无音轨。

### Task 4: 接入镜头库

**Files:**
- Modify: `../Video-Shot-Library/source/a-roll-entries.json`
- Modify: `../Video-Shot-Library/source/shot-metadata.json`
- Modify: `../Video-Shot-Library/tests/shot-runtime-registry.test.mjs`
- Create: `../Video-Shot-Library/library-sources/a-roll-remotion/src/screenshot-recording/*`
- Create: `../Video-Shot-Library/public/media/xcyj-screenshot-recording/*.mp4`

- [ ] 添加 11 张卡片，合集与预览目录为 `xcyj-screenshot-recording`。
- [ ] 添加中文标题与允许的标签。
- [ ] 同步完整可编辑源文件和 11 个无声预览。
- [ ] 更新参考视频卡片数量断言。
- [ ] 运行 `npm run data:build && npm test && npm run typecheck`。

### Task 5: 最终一致性验收

- [ ] 验证生成目录中恰好存在 11 个唯一卡片 ID。
- [ ] 比较 Remotion 与镜头库的源文件和 MP4，确保字节一致。
- [ ] 再次运行 Remotion 测试、lint、镜头库数据检查与类型检查。
- [ ] 保留当前本地分支，不推送或部署，除非用户明确要求。
