# “转场·背景”镜头克隆实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Remotion 与镜头库中新增 20 个可编辑的“转场·背景”B-roll 镜头。

**Architecture:** 使用一个分类目录、一个共享场景入口和按运动语法拆分的小场景组件。目录保存稳定 ID 与默认属性，运动配置保存关键帧，Root 继续通过目录映射注册 Composition。

**Tech Stack:** React、TypeScript、Remotion、Vitest、FFmpeg、现有镜头库 JSON 构建脚本。

---

### Task 1: 目录与时间约束

**Files:**
- Create: `src/transition-background/types.ts`
- Create: `src/transition-background/catalog.ts`
- Create: `src/transition-background/motion.ts`
- Test: `src/transition-background/catalog.test.ts`
- Test: `src/transition-background/motion.test.ts`

- [ ] 写失败测试，约束 20 个稳定 ID、全部 B-roll、尺寸帧率、参考时长和关键运动方向。
- [ ] 运行 `npm test -- --run src/transition-background`，确认因目录和运动配置缺失而失败。
- [ ] 实现类型、目录和关键帧配置。
- [ ] 再次运行目标测试并确认通过。

### Task 2: Remotion 场景与注册

**Files:**
- Create: `src/transition-background/TransitionBackgroundScene.tsx`
- Modify: `src/Root.tsx`

- [ ] 实现品牌转场、环境背景和结构转场三个共享骨架。
- [ ] 为每个 ID 接入独立变体、文字、颜色和关键帧。
- [ ] 在 `Root.tsx` 映射注册 20 个 Composition。
- [ ] 运行 `npm run lint` 和目标测试。

### Task 3: 关键帧校准与渲染

**Files:**
- Create: `out/xcyj-transition-background/*.mp4`

- [ ] 在代表帧 0、30、60、90、120、165 渲染静帧并与参考时间线比较。
- [ ] 调整位置、尺寸、方向和速度。
- [ ] 渲染全部 Composition，并用 FFmpeg 移除空白音轨。

### Task 4: 镜头库接入

**Files:**
- Modify: `source/a-roll-entries.json`
- Modify: `source/shot-metadata.json`
- Modify: `tests/shot-runtime-registry.test.mjs`
- Create: `public/media/xcyj-transition-background/*.mp4`
- Create: `library-sources/a-roll-remotion/src/transition-background/*`

- [ ] 添加 20 个 B-roll 条目与中文元数据。
- [ ] 同步可编辑源码与静音预览。
- [ ] 重新生成 `public/data/library.json`。

### Task 5: 完整验证

- [ ] 运行 Remotion 全量测试和静态检查。
- [ ] 运行镜头库构建、测试和类型检查。
- [ ] 检查 20 个 ID 唯一、全部 B-roll、媒体尺寸/帧率/帧数/无音轨及源码同步。
