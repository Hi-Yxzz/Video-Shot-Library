# “AI 味”三镜头复刻验证 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Remotion 工程中新增三个无声 Fidelity 验证镜头，并将成片输出到第 20 期视频项目的 `镜头预览` 目录。

**Architecture:** 在 `src/ai-flavor-validation/` 中建立独立 catalog、运动状态和三个聚焦组件，不修改历史模板。前两个镜头复用当前工程的节奏与视觉语言，第三个镜头从 `feature/reference-003-first-batch` worktree 只迁移关系图所需的最小编排；静态素材集中复制到 `public/ai-flavor-validation/`。

**Tech Stack:** React 19、TypeScript 5.9、Remotion 4.0.500、Vitest 4、FFmpeg。

---

## 文件结构

- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.ts` — Composition 元数据、文案与素材路径。
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/motion.ts` — 三段镜头的纯函数运动状态。
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/BarberAmbiguity.tsx` — “剪帅一点”模糊指令镜头。
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/StyleConstellation.tsx` — 五风格案例星座镜头。
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/PromptFormulaGraph.tsx` — 五项界面需求关系图镜头。
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/registry.ts` — ID 到 React 组件的注册映射。
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts` — 元数据、素材和注册约束。
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/motion.test.ts` — 关键帧、边界和单调性测试。
- Modify: `library-sources/a-roll-remotion/src/Root.tsx` — 注册三个 Composition。
- Modify: `library-sources/a-roll-remotion/vitest.fidelity.config.ts` — 纳入新命名空间测试。
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/**` — 两张 VOX 人物和五张 UI 风格截图。

### Task 1: 建立 catalog 与测试入口

**Files:**
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.ts`
- Modify: `library-sources/a-roll-remotion/vitest.fidelity.config.ts`

- [ ] **Step 1: 写失败的 catalog 测试**

测试必须断言三个条目的 ID、帧数、30fps、1920×1080、五个 QA 帧和输出文件名：

```ts
import {describe, expect, it} from "vitest";
import {AI_FLAVOR_COMPOSITIONS} from "./catalog";

describe("AI flavor validation catalog", () => {
  it("registers the three approved previews", () => {
    expect(AI_FLAVOR_COMPOSITIONS.map(({id, durationInFrames}) => ({
      id,
      durationInFrames,
    }))).toEqual([
      {id: "AiFlavorBarberAmbiguity", durationInFrames: 195},
      {id: "AiFlavorStyleConstellation", durationInFrames: 180},
      {id: "AiFlavorPromptFormulaGraph", durationInFrames: 309},
    ]);
  });

  it("keeps all outputs 1080p at 30fps with valid QA frames", () => {
    for (const item of AI_FLAVOR_COMPOSITIONS) {
      expect(item).toMatchObject({width: 1920, height: 1080, fps: 30});
      expect(item.qaFrames).toHaveLength(5);
      expect(item.qaFrames).toEqual([...item.qaFrames].sort((a, b) => a - b));
      expect(item.qaFrames.at(-1)).toBeLessThan(item.durationInFrames);
    }
  });
});
```

- [ ] **Step 2: 将新测试目录加入专用 Vitest 配置并验证失败**

在 `vitest.fidelity.config.ts` 的 `include` 中增加：

```ts
"src/ai-flavor-validation/**/*.test.ts",
```

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，提示无法解析 `./catalog`。

- [ ] **Step 3: 实现最小 catalog**

定义只读条目类型并导出三条固定数据：

```ts
export const AI_FLAVOR_COMPOSITIONS = [
  {
    id: "AiFlavorBarberAmbiguity",
    durationInFrames: 195,
    fps: 30,
    width: 1920,
    height: 1080,
    qaFrames: [0, 36, 90, 150, 194],
    outputName: "01-Fidelity-模糊指令理发师.mp4",
  },
  {
    id: "AiFlavorStyleConstellation",
    durationInFrames: 180,
    fps: 30,
    width: 1920,
    height: 1080,
    qaFrames: [0, 36, 84, 132, 179],
    outputName: "02-Fidelity-五风格案例星座.mp4",
  },
  {
    id: "AiFlavorPromptFormulaGraph",
    durationInFrames: 309,
    fps: 30,
    width: 1920,
    height: 1080,
    qaFrames: [0, 54, 132, 222, 308],
    outputName: "03-Fidelity-界面需求公式关系图.mp4",
  },
] as const;
```

- [ ] **Step 4: 运行 catalog 测试**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: PASS。

- [ ] **Step 5: 提交 catalog**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.ts \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts \
  library-sources/a-roll-remotion/vitest.fidelity.config.ts
git commit -m "test: define AI flavor preview catalog"
```

### Task 2: 复制并验证本期素材

**Files:**
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/vox/barber.png`
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/vox/customer.png`
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/styles/default-ai.png`
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/styles/swiss.png`
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/styles/glassmorphism.png`
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/styles/neubrutalism.png`
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/styles/aurora.png`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`

- [ ] **Step 1: 写失败的素材存在性测试**

```ts
import {existsSync} from "node:fs";
import {resolve} from "node:path";

const assetPaths = [
  "vox/barber.png",
  "vox/customer.png",
  "styles/default-ai.png",
  "styles/swiss.png",
  "styles/glassmorphism.png",
  "styles/neubrutalism.png",
  "styles/aurora.png",
];

it("stages every approved visual asset", () => {
  for (const assetPath of assetPaths) {
    expect(existsSync(resolve(process.cwd(), "public/ai-flavor-validation", assetPath))).toBe(true);
  }
});
```

- [ ] **Step 2: 运行测试验证缺失素材失败**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，首个缺失文件是 `public/ai-flavor-validation/vox/barber.png`。

- [ ] **Step 3: 从第 20 期项目复制明确素材**

创建目标目录后，逐个复制：

```bash
mkdir -p public/ai-flavor-validation/vox public/ai-flavor-validation/styles
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/02_VOX/VOX-01_困惑理发师.png" public/ai-flavor-validation/vox/barber.png
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/02_VOX/VOX-02_模糊要求顾客.png" public/ai-flavor-validation/vox/customer.png
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/01_UI五风格/00_AI味反面案例/hero-1920x1080.png" public/ai-flavor-validation/styles/default-ai.png
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/01_UI五风格/01_Swiss/hero-1920x1080.png" public/ai-flavor-validation/styles/swiss.png
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/01_UI五风格/02_Glassmorphism/hero-1920x1080.png" public/ai-flavor-validation/styles/glassmorphism.png
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/01_UI五风格/03_Neubrutalism/hero-1920x1080.png" public/ai-flavor-validation/styles/neubrutalism.png
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/01_UI五风格/04_Aurora/hero-1920x1080.png" public/ai-flavor-validation/styles/aurora.png
```

- [ ] **Step 4: 验证素材测试通过并检查图片规格**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: PASS。

Run: `file public/ai-flavor-validation/vox/*.png public/ai-flavor-validation/styles/*.png`

Expected: 七个文件均识别为 PNG，五张 style 图片均为 1920×1080。

- [ ] **Step 5: 提交素材**

```bash
git add library-sources/a-roll-remotion/public/ai-flavor-validation \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts
git commit -m "assets: stage AI flavor validation media"
```

### Task 3: 建立运动状态和边界测试

**Files:**
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/motion.test.ts`
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/motion.ts`

- [ ] **Step 1: 写三个镜头状态的失败测试**

测试导入 `getBarberState`、`getConstellationState`、`getFormulaGraphState`，断言：负帧全部钳制为 0；结束帧关键阶段达到 1；镜头 `camera` 在 QA 帧单调不减；所有数值在 `[-30, 0, ...qaFrames, duration + 30]` 上均为有限数。

核心断言：

```ts
expect(getBarberState(-30).tableau).toBe(0);
expect(getBarberState(194).conclusion).toBe(1);
expect(getConstellationState(179).cards).toBe(1);
expect(getFormulaGraphState(308).labels).toBe(1);
```

- [ ] **Step 2: 运行测试验证导出缺失**

Run: `npm run test:fidelity -- src/ai-flavor-validation/motion.test.ts`

Expected: FAIL，提示无法解析 `./motion`。

- [ ] **Step 3: 实现钳制的阶段进度和三个状态函数**

```ts
export const stageProgress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const getBarberState = (frame: number) => ({
  tableau: stageProgress(frame, 8, 30),
  people: stageProgress(frame, 24, 44),
  options: stageProgress(frame, 62, 112),
  question: stageProgress(frame, 126, 148),
  conclusion: stageProgress(frame, 168, 190),
  camera: stageProgress(frame, 0, 194),
});

export const getConstellationState = (frame: number) => ({
  cards: stageProgress(frame, 0, 92),
  center: stageProgress(frame, 52, 108),
  edges: stageProgress(frame, 78, 136),
  summary: stageProgress(frame, 124, 164),
  camera: stageProgress(frame, 0, 179),
});

export const getFormulaGraphState = (frame: number) => ({
  center: stageProgress(frame, 8, 48),
  edges: stageProgress(frame, 42, 112),
  nodes: stageProgress(frame, 90, 168),
  labels: stageProgress(frame, 150, 218),
  summary: stageProgress(frame, 220, 272),
  camera: stageProgress(frame, 0, 308),
});
```

- [ ] **Step 4: 运行运动测试**

Run: `npm run test:fidelity -- src/ai-flavor-validation/motion.test.ts`

Expected: PASS。

- [ ] **Step 5: 提交运动状态**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation/motion.ts \
  library-sources/a-roll-remotion/src/ai-flavor-validation/motion.test.ts
git commit -m "feat: define AI flavor shot timing"
```

### Task 4: 实现“剪帅一点”模糊指令镜头

**Files:**
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/BarberAmbiguity.tsx`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`

- [ ] **Step 1: 增加组件内容契约测试**

读取组件源码并断言包含 `给我剪帅一点`、四个阶段问题、`什么叫帅？`、`感觉，不是具体指令`、两条 `staticFile()` 素材路径，以及 `getBarberState`。

- [ ] **Step 2: 运行测试验证组件缺失**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，提示 `BarberAmbiguity.tsx` 不存在。

- [ ] **Step 3: 实现 Fidelity 纸张拼贴镜头**

使用 `AbsoluteFill`、`Img`、`staticFile`、`useCurrentFrame` 和 `getBarberState`。构图包含：米灰纸墙、左右人物剪影、中央黑色指令条、四张暖黄色阶段卡、前景纸片、最终宋体巨幅问题。所有透明度和位移由状态函数驱动，镜头从 `scale(1)` 连续推进到 `scale(1.08)`。

- [ ] **Step 4: 测试与类型检查**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts && npm run typecheck`

Expected: PASS。

- [ ] **Step 5: 提交第一镜头**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation/BarberAmbiguity.tsx \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts
git commit -m "feat: add barber ambiguity preview"
```

### Task 5: 实现五风格案例星座镜头

**Files:**
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/StyleConstellation.tsx`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`

- [ ] **Step 1: 增加五风格内容契约测试**

断言组件包含五个风格标签、五张 public 素材路径、中心文案 `同一个页面`、总结文案和 `getConstellationState`。

- [ ] **Step 2: 运行测试验证组件缺失**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，提示 `StyleConstellation.tsx` 不存在。

- [ ] **Step 3: 实现卡片星座**

沿用原 Fidelity 模板的深色空间、五张不同尺度卡片、中心节点、SVG 连接线和缓慢拉远。每张卡使用 `Img` 的 `objectFit="cover"`，下方使用高对比标签；连接线绘制使用 `strokeDasharray` 与状态 `edges`。

- [ ] **Step 4: 测试与类型检查**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts && npm run typecheck`

Expected: PASS。

- [ ] **Step 5: 提交第二镜头**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation/StyleConstellation.tsx \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts
git commit -m "feat: add five-style constellation preview"
```

### Task 6: 实现界面需求公式关系图

**Files:**
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/PromptFormulaGraph.tsx`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`

- [ ] **Step 1: 增加关系图内容契约测试**

断言组件包含中心节点、五个一级节点、五条辅助说明、最终总结、SVG 连接线、`getFormulaGraphState`，并断言源码不包含团队人物标签 `LEAD`、`DESIGNER`、`ENGINEER`。

- [ ] **Step 2: 运行测试验证组件缺失**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，提示 `PromptFormulaGraph.tsx` 不存在。

- [ ] **Step 3: 移植最小关系图编排并替换语义**

参考 worktree 中 `src/reference-003/fidelity/TeamRelationshipGraphFidelity.tsx` 的关系线绘制、纸张深度、节点弹入和相机推进。在新组件中使用五个信息卡节点，不导入旧分支的 `fonts.ts`、`shared.tsx` 或完整 `motion.ts`；字体使用本工程本地字体栈，状态使用本任务创建的 `motion.ts`。

- [ ] **Step 4: 测试与类型检查**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts && npm run typecheck`

Expected: PASS。

- [ ] **Step 5: 提交第三镜头**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation/PromptFormulaGraph.tsx \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts
git commit -m "feat: add prompt formula graph preview"
```

### Task 7: 注册 Composition

**Files:**
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/registry.ts`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`
- Modify: `library-sources/a-roll-remotion/src/Root.tsx`

- [ ] **Step 1: 写注册映射失败测试**

断言 `AI_FLAVOR_REGISTERED_COMPOSITIONS` 的 ID、组件、尺寸、帧率和帧数与 catalog 一一对应，数量恰好为 3。

- [ ] **Step 2: 运行测试验证 registry 缺失**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，提示无法解析 `./registry`。

- [ ] **Step 3: 实现 registry 并接入 Root**

`registry.ts` 建立三个 ID 到组件的只读 map，再从 catalog 派生注册数组。`Root.tsx` 导入注册数组并渲染：

```tsx
{AI_FLAVOR_REGISTERED_COMPOSITIONS.map((item) => (
  <Composition
    key={item.id}
    id={item.id}
    component={item.component}
    width={item.width}
    height={item.height}
    fps={item.fps}
    durationInFrames={item.durationInFrames}
  />
))}
```

- [ ] **Step 4: 验证注册与全部专用测试**

Run: `npm run test:fidelity && npm run typecheck && npx remotion compositions src/index.ts`

Expected: 测试全通过、类型检查通过、输出中出现三个新 Composition ID 及正确帧数。

- [ ] **Step 5: 提交注册**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation/registry.ts \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts \
  library-sources/a-roll-remotion/src/Root.tsx
git commit -m "feat: register AI flavor validation previews"
```

### Task 8: 渲染 QA 帧并完成视觉修正

**Files:**
- Output: `library-sources/a-roll-remotion/out/ai-flavor-validation/qa/**/*.png`
- Modify if required: `library-sources/a-roll-remotion/src/ai-flavor-validation/*.tsx`

- [ ] **Step 1: 为三段镜头渲染十五张 QA 帧**

对 catalog 的每个 QA 帧运行：

```bash
npx remotion still src/index.ts <composition-id> out/ai-flavor-validation/qa/<composition-id>/<frame>.png --frame=<frame> --overwrite
```

Expected: 15 张 1920×1080 PNG。

- [ ] **Step 2: 生成三张五帧联系表并逐张检查**

使用 ImageMagick `montage`；若未安装则用 FFmpeg `xstack`。检查人物遮挡、标题溢出、UI 裁切、节点重叠、连线锚点、画布边缘和字体回退。

- [ ] **Step 3: 仅修复可见问题并复渲受影响 QA 帧**

每次修正后先运行：

Run: `npm run test:fidelity -- src/ai-flavor-validation && npm run typecheck`

Expected: PASS；复渲帧不再出现对应视觉问题。

- [ ] **Step 4: 提交视觉修正**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation
git commit -m "fix: refine AI flavor preview layouts"
```

如果没有源码修正，则跳过提交，不提交 QA 输出。

### Task 9: 渲染并交付三个 MP4

**Files:**
- Output: `library-sources/a-roll-remotion/out/ai-flavor-validation/mp4/*.mp4`
- Output: `/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/镜头预览/*.mp4`

- [ ] **Step 1: 运行完成前验证**

Run: `npm run test:fidelity && npm run typecheck && npx remotion compositions src/index.ts`

Expected: 所有专用测试和类型检查通过，三个 ID 可发现。

- [ ] **Step 2: 安全渲染三个无声 H.264 文件**

逐个运行：

```bash
npx remotion render src/index.ts <composition-id> "out/ai-flavor-validation/mp4/<output-name>" --codec=h264 --crf=18 --muted --concurrency=1 --overwrite
```

Expected: 三个 MP4 渲染成功。

- [ ] **Step 3: 验证媒体规格**

Run: `ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate,nb_frames -of default=noprint_wrappers=1 <each-mp4>`

Expected: 三个文件均为 1920×1080、30fps；帧数依次为 195、180、309；时长依次为 6.5、6、10.3 秒。

- [ ] **Step 4: 复制到第 20 期项目**

```bash
mkdir -p "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/镜头预览"
cp out/ai-flavor-validation/mp4/*.mp4 "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/镜头预览/"
```

- [ ] **Step 5: 最终状态检查**

Run: `git status --short`

Expected: 仅允许忽略的 `out/` 渲染产物；源码、测试和素材改动均已提交。

## 已知基线限制

仓库根目录的 `vite.config.ts` 会劫持子项目的默认 `npm test`，并依赖当前 worktree 未安装的 `vinext` 与 `@cloudflare/vite-plugin`。本计划不修改该既有根配置；可靠基线和完成检查使用 `npm run test:fidelity`（当前 12 个测试文件、50 项通过）与 `npm run typecheck`（当前通过）。
