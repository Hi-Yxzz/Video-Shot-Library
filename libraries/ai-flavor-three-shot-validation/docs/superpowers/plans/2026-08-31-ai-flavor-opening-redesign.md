# “高级到底是什么”第一镜头重制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将不理想的理发师第一镜头替换为直接解释“高级”含义不明确的 6.5 秒 Fidelity 预览，同时保持第二、第三镜头不变。

**Architecture:** 保留第一镜头现有 195 帧运动节奏和纸张档案视觉结构，重命名其 Composition、运动状态和组件。使用现有困惑 AI 助手、显示器和 UI 截图建立界面设计语境，不新增网络请求；完成后生成新文件并从交付目录移除旧理发师版本。

**Tech Stack:** React 19、TypeScript 5.9、Remotion 4.0.500、Vitest 4、FFmpeg。

---

### Task 1: 更新第一镜头契约与运动命名

**Files:**
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.ts`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/motion.test.ts`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/motion.ts`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/registry.ts`

- [ ] **Step 1: 将测试改成新 ID、输出名和运动 API**

第一条 catalog 期望值改为：

```ts
{
  id: "AiFlavorAdvancedAmbiguity",
  durationInFrames: 195,
}
```

输出名断言改为 `01-Fidelity-高级到底是什么.mp4`。运动测试导入并调用 `getAdvancedAmbiguityState`，同时断言旧 ID 和旧输出名不再出现在 catalog。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts src/ai-flavor-validation/motion.test.ts`

Expected: FAIL，实际 catalog 仍返回 `AiFlavorBarberAmbiguity`，且 `getAdvancedAmbiguityState` 尚未导出。

- [ ] **Step 3: 更新 catalog 和运动函数**

将第一条数据更新为：

```ts
{
  id: "AiFlavorAdvancedAmbiguity",
  durationInFrames: 195,
  fps: 30,
  width: 1920,
  height: 1080,
  qaFrames: [0, 36, 90, 150, 194],
  outputName: "01-Fidelity-高级到底是什么.mp4",
}
```

将 `getBarberState` 重命名为 `getAdvancedAmbiguityState`，保持 `tableau`、`people`、`options`、`question`、`conclusion`、`camera` 的时间边界不变。为保证这一步可独立通过类型检查，暂时保留兼容别名：

```ts
export const getBarberState = getAdvancedAmbiguityState;
```

同时将 `registry.ts` 的键先改为 `AiFlavorAdvancedAmbiguity`，临时仍映射到 `BarberAmbiguity`；Task 3 创建新组件后再替换映射并移除兼容别名。

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts src/ai-flavor-validation/motion.test.ts && npm run typecheck`

Expected: 相关测试与类型检查全部通过。

- [ ] **Step 5: 提交元数据与运动命名**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.ts \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts \
  library-sources/a-roll-remotion/src/ai-flavor-validation/motion.ts \
  library-sources/a-roll-remotion/src/ai-flavor-validation/motion.test.ts \
  library-sources/a-roll-remotion/src/ai-flavor-validation/registry.ts
git commit -m "refactor: rename AI flavor opening preview"
```

### Task 2: 增加 AI 助手与显示器素材

**Files:**
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/vox/ai-assistant.png`
- Create: `library-sources/a-roll-remotion/public/ai-flavor-validation/objects/monitor.png`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`

- [ ] **Step 1: 写素材存在性失败测试**

在 `ASSET_PATHS` 增加：

```ts
"vox/ai-assistant.png",
"objects/monitor.png",
```

- [ ] **Step 2: 运行测试确认缺失素材失败**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，首个缺失素材为 `vox/ai-assistant.png`。

- [ ] **Step 3: 复制已确认的本地素材**

```bash
mkdir -p public/ai-flavor-validation/objects
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/02_VOX/VOX-03_困惑AI设计助手.png" public/ai-flavor-validation/vox/ai-assistant.png
cp "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/素材/04_通用素材复用/reuse-monitor.png" public/ai-flavor-validation/objects/monitor.png
```

- [ ] **Step 4: 验证素材**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts && file public/ai-flavor-validation/vox/ai-assistant.png public/ai-flavor-validation/objects/monitor.png`

Expected: 测试通过；两文件均为带透明信息的 PNG。

- [ ] **Step 5: 提交素材**

```bash
git add library-sources/a-roll-remotion/public/ai-flavor-validation \
  library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts
git commit -m "assets: add AI interface ambiguity media"
```

### Task 3: 重写第一镜头组件和注册映射

**Files:**
- Delete: `library-sources/a-roll-remotion/src/ai-flavor-validation/BarberAmbiguity.tsx`
- Create: `library-sources/a-roll-remotion/src/ai-flavor-validation/AdvancedAmbiguity.tsx`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/catalog.test.ts`
- Modify: `library-sources/a-roll-remotion/src/ai-flavor-validation/registry.ts`

- [ ] **Step 1: 将内容契约改成新组件**

测试读取 `AdvancedAmbiguity.tsx` 并断言包含：

```ts
[
  "帮我做一个高级界面",
  "干净克制？",
  "大牌留白？",
  "深色科技？",
  "柔和氛围？",
  "你说的“高级”",
  "到底是哪一种？",
  "“高级”是感觉，不是指令",
  "ai-flavor-validation/vox/ai-assistant.png",
  "ai-flavor-validation/objects/monitor.png",
  "getAdvancedAmbiguityState",
]
```

并断言源码不包含 `理发师`、`剪帅`、`什么叫帅`、`barber.png`、`customer.png`。

- [ ] **Step 2: 运行测试确认组件缺失失败**

Run: `npm run test:fidelity -- src/ai-flavor-validation/catalog.test.ts`

Expected: FAIL，`AdvancedAmbiguity.tsx` 不存在。

- [ ] **Step 3: 创建新组件并删除旧组件**

新组件保持纸墙、档案卡、四张解释卡和最终推进。中央卡标题为 `“帮我做一个高级界面”`；AI 助手位于左下，显示器与默认 AI 味截图位于右下；四张解释卡使用原有分阶段入场。最终问题拆成两行：`你说的“高级”` 与 `到底是哪一种？`，结论在末段出现。

完成组件替换后，从 `motion.ts` 移除 Task 1 的 `getBarberState` 兼容别名。

`registry.ts` 映射更新为：

```ts
AiFlavorAdvancedAmbiguity: AdvancedAmbiguity,
```

- [ ] **Step 4: 运行完整代码验证**

Run: `npm run test:fidelity && npm run typecheck && npx remotion compositions src/index.ts | rg 'AiFlavor(AdvancedAmbiguity|StyleConstellation|PromptFormulaGraph)'`

Expected: 全部测试与类型检查通过；只列出新第一 ID，不再列出 `AiFlavorBarberAmbiguity`。

- [ ] **Step 5: 提交组件替换**

```bash
git add library-sources/a-roll-remotion/src/ai-flavor-validation
git commit -m "feat: replace barber preview with advanced ambiguity"
```

### Task 4: QA、渲染与交付替换

**Files:**
- Output: `library-sources/a-roll-remotion/out/ai-flavor-validation/qa/AiFlavorAdvancedAmbiguity/*.png`
- Output: `library-sources/a-roll-remotion/out/ai-flavor-validation/mp4/01-Fidelity-高级到底是什么.mp4`
- Delete delivery artifact: `/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/镜头预览/01-Fidelity-模糊指令理发师.mp4`
- Create delivery artifact: `/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/镜头预览/01-Fidelity-高级到底是什么.mp4`

- [ ] **Step 1: 渲染五个 QA 帧**

对 0、36、90、150、194 帧运行：

```bash
npx remotion still src/index.ts AiFlavorAdvancedAmbiguity out/ai-flavor-validation/qa/AiFlavorAdvancedAmbiguity/<frame>.png --frame=<frame> --overwrite --log=error
```

- [ ] **Step 2: 检查视觉要求并修复**

检查 AI 助手、显示器、四张解释卡、两行最终问题和结论；所有关键文字保持在左右 80px、上下 100px 安全区。发现问题时先增加失败契约或运动测试，再做最小修正并复渲受影响帧。

- [ ] **Step 3: 完成前验证并渲染新 MP4**

Run: `npm run test:fidelity && npm run typecheck`

Run:

```bash
npx remotion render src/index.ts AiFlavorAdvancedAmbiguity "out/ai-flavor-validation/mp4/01-Fidelity-高级到底是什么.mp4" --codec=h264 --crf=18 --muted --concurrency=1 --overwrite --log=error
```

Expected: 1920×1080、30fps、195 帧、6.5 秒。

- [ ] **Step 4: 替换交付文件**

先确认新文件存在且 `ffprobe` 规格正确，再复制新文件并删除旧交付：

```bash
cp "out/ai-flavor-validation/mp4/01-Fidelity-高级到底是什么.mp4" "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/镜头预览/"
rm "/Users/admin/Desktop/视频/20-为什么AI做的界面，总有一股AI味？/镜头预览/01-Fidelity-模糊指令理发师.mp4"
```

旧文件仍保留在 worktree 的 `out/ai-flavor-validation/mp4/` 中，可在需要时恢复。

- [ ] **Step 5: 核对交付目录与哈希**

Run: `find <镜头预览目录> -maxdepth 1 -name '*.mp4' -print | sort`

Expected: 第一段为新文件，第二、第三段文件名与内容不变；新交付和工程输出 SHA-256 一致。
