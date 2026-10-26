# Remotion 可编辑镜头库复刻 SOP

> 适用场景：拿到一段参考视频和一张人物照片，用 Remotion 复刻镜头结构、构图和动画，并沉淀为可持续扩展的 A-roll / B-roll 镜头库。

## 1. 最终目标

每条复刻任务必须同时交付：

1. 可在 Remotion Studio 中编辑的 Composition。
2. 与参考视频同画幅、同帧率、时长接近的成品 MP4。
3. 3～6 张代表性关键帧预览。
4. 一条镜头库标签记录。
5. 可以重复执行的测试、预览和导出命令。

默认交付标准：

- 保留参考视频的镜头动画、构图、节奏和必要画面元素。
- 人物替换为委托方提供的照片。
- 不保留原视频声音、字幕、水印和原人物。
- 所有动画必须由帧号驱动，确保每次渲染结果一致。
- 照片、文字、数值、颜色、布局和时间点应尽量开放为可编辑参数。

## 2. A-roll 与 B-roll 分类

### A-roll

A-roll 是人物主镜头，例如：

- 人物近景或半身镜头
- 人物与信息图左右分屏
- 人物前景叠加卡片、数据或 UI
- 以人物为视觉主体的讲解镜头

每个 A-roll 视频或 Composition 都必须拥有独立 ID 和标签。

推荐命名：

```text
a-roll-001-photo-looping-cards
a-roll-002-equity-split
a-roll-003-product-demo
```

### B-roll

B-roll 是辅助画面，例如：

- 产品操作录屏
- 城市、办公环境、设备等空镜
- 数据图表特写
- 网页、软件界面或素材库镜头
- 用于遮挡剪辑点的补充画面

A-roll / B-roll 表示镜头用途，不代表镜头质量等级。

## 3. 推荐目录结构

```text
<workspace>/
├── remotion-shot-library/
│   ├── public/
│   │   └── assets/
│   │       ├── portraits/
│   │       ├── logos/
│   │       └── images/
│   ├── src/
│   │   ├── Root.tsx
│   │   ├── shared/
│   │   └── shots/
│   │       ├── photo-looping-cards/
│   │       └── equity-split/
│   ├── test/
│   ├── out/
│   ├── package.json
│   └── README.md
└── video-catalog/
    ├── A-roll/
    │   └── entries.json
    ├── B-roll/
    │   └── sources.json
    ├── catalog.json
    └── test/
        └── catalog.test.mjs
```

建议把多个同类镜头放在同一个 Remotion 项目中，每个镜头注册为独立 Composition。只有技术栈、依赖或输出规格差异很大时，才新建项目。

## 4. 素材接收清单

开始前至少需要：

- 参考视频文件
- 替换人物的原始照片
- 希望保留或删除的元素说明
- 背景要求
- 输出比例或分辨率要求

建议确认：

- 是否保留参考视频声音
- 是否保留字幕、文案和水印
- 数据、品牌卡片或 Logo 是否保留
- 哪些元素后续必须可替换
- 人物照片能否满足参考镜头的景别

照片建议：

- 分辨率不低于最终人物显示区域
- 人物清晰、无严重运动模糊
- 身体和头部尽量完整
- 背景干净，或与目标背景一致
- 拍摄角度尽量接近参考镜头

如果只有单张照片，可以复刻推镜、平移、呼吸、轻微浮动和图层视差，但无法真实复刻口型、眨眼、手势或大幅度转身。

## 5. 阶段一：探测参考视频

先记录参考视频的技术参数：

```bash
ffprobe -v error \
  -show_entries format=duration \
  -show_entries stream=index,codec_name,codec_type,width,height,r_frame_rate \
  -of json "<reference-video.mp4>"
```

需要记录：

| 字段       |      示例 |
| ---------- | --------: |
| 分辨率     |  1280×720 |
| 帧率       |     30fps |
| 时长       |  7.871 秒 |
| 总帧数     | 约 236 帧 |
| 视频编码   |     H.264 |
| 是否有音轨 |   是 / 否 |

总帧数可按以下方式估算：

```text
总帧数 ≈ 时长 × 帧率
```

Remotion 的 `durationInFrames` 应按参考节奏取最接近的整数。

## 6. 阶段二：制作接触表并拆解镜头

不要直接凭印象写动画。先把参考视频抽成接触表或关键帧。

关键帧至少覆盖：

1. 开场状态
2. 第一次明显转场
3. 中间稳定状态
4. 第二次数据或元素变化
5. 收尾状态

例如一条 236 帧的视频可检查：

```text
0、32、100、190、235 帧
```

对每个关键帧记录：

- 人物位置、景别和裁切
- 背景颜色或材质
- 主元素的坐标、大小和层级
- 字体、字号、字重和颜色
- 转场开始帧和结束帧
- 元素进入、保持、退出的方式
- 是否有逐格、逐字或逐卡片延迟

最终整理为时间轴表：

| 阶段       |  帧范围 | 画面状态     | 动画                   |
| ---------- | ------: | ------------ | ---------------------- |
| Intro      |    0–20 | 主视觉全屏   | 淡入或静态保持         |
| Split      |   21–35 | 左右分屏     | 左侧缩放，人物面板进入 |
| Hold       |   36–65 | 稳定构图     | 轻微人物动态           |
| Value      |  66–175 | 数值卡片出现 | 上移、淡入             |
| Transition | 176–205 | 图表换色     | 逐格显现               |
| End        | 206–235 | 收尾数据保持 | 高亮带进入             |

帧范围必须以实际参考视频为准。

## 7. 阶段三：确定复刻边界

把参考内容分成三类：

### 必须复刻

- 镜头画幅和时长
- 核心构图
- 主要运动路径
- 关键转场时间点
- 重要数据或视觉元素

### 替换

- 人物照片
- 品牌、Logo、数据、卡片内容
- 背景图片或颜色

### 删除

- 原视频音轨
- 原字幕和口播文案
- 原作者水印
- 原人物画面

如用户要求无声版本，代码中不要添加 `<Audio>`，导出命令同时使用 `--muted` 做第二层保证。

## 8. 阶段四：设计可编辑参数

不要把频繁变化的内容写死在组件内部。通过 Composition schema 和 `defaultProps` 暴露参数。

建议参数分组：

### 素材

```ts
portraitSrc;
backgroundSrc;
logoSrc;
```

### 文案与数据

```ts
title;
eyebrow;
dateLabel;
primaryValue;
secondaryValue;
currencyUnit;
items;
```

### 布局

```ts
splitX;
portraitScale;
portraitPositionX;
portraitPositionY;
gridColumns;
gap;
```

### 动画时间

```ts
introEndFrame;
splitEndFrame;
valueStartFrame;
transitionStartFrame;
holdStartFrame;
```

### 动画幅度

```ts
cameraPushAmount;
breathingAmount;
floatingAmount;
speed;
direction;
```

### 颜色

```ts
primaryColor;
secondaryColor;
neutralColor;
mutedColor;
backgroundColor;
```

使用 Zod 或等价校验约束：

- 帧号必须递增
- 数量不能为负数
- 高亮格数不能超过总格数
- 缩放和尺寸必须处于安全范围
- 枚举字段只允许已支持的值

## 9. 阶段五：Remotion 实现规范

### 每条镜头使用独立 Composition

```tsx
<Composition
  id="EquitySplit"
  component={EquitySplit}
  width={1280}
  height={720}
  fps={30}
  durationInFrames={236}
  schema={equitySplitSchema}
  defaultProps={defaultEquitySplitProps}
/>
```

### 动画必须由帧驱动

推荐使用：

```ts
useCurrentFrame();
interpolate();
spring();
```

不要使用：

```text
CSS transition
CSS animation
setTimeout
Math.random()
依赖系统时间的动画
```

否则 Studio 预览、单帧渲染和最终视频可能不一致。

### 拆分组件职责

推荐结构：

```text
ShotComposition.tsx      总时间轴和图层顺序
timeline.ts              阶段判断、进度计算
types.ts                 Props 和 schema
PresenterPanel.tsx       人物画面
InfoGraphic.tsx          图表或数据区
ValueCard.tsx            数值卡片
BrandMark.tsx            本地绘制的品牌标识
timeline.test.ts         阶段边界测试
```

### 人物照片动画

单张照片只使用低幅度动画：

- 缓慢推近
- 1% 左右的呼吸缩放
- 2～4px 上下浮动
- 背景与人物分层后的轻微视差

运动过大会暴露静态照片的局限。

### 素材管理

- 素材统一放在 `public/assets/`
- 使用 `staticFile()` 读取
- 不依赖临时下载目录
- 不直接引用远程 Logo 或网络图片
- 不把用户照片复制到不相关项目

## 10. 阶段六：测试驱动实现

优先测试纯时间轴逻辑，再实现视觉组件。

至少覆盖：

- 每个阶段的起止帧
- 逐格动画的数量和索引
- Props 的非法输入
- 新 Composition 的注册
- 原有 Composition 不受影响

常用命令：

```bash
npm test
npm run typecheck
npm run lint
npx remotion compositions
```

验收条件：

- 所有测试通过
- TypeScript 无错误
- ESLint 无错误
- 新旧 Composition 均能被 Remotion 识别
- Composition 的分辨率、帧率和总帧数正确

## 11. 阶段七：关键帧校准

完整渲染前先输出代表性静帧：

```bash
npx remotion still <CompositionId> out/check-000.png --frame=0
npx remotion still <CompositionId> out/check-032.png --frame=32
npx remotion still <CompositionId> out/check-100.png --frame=100
npx remotion still <CompositionId> out/check-190.png --frame=190
npx remotion still <CompositionId> out/check-235.png --frame=235
```

逐张按原始分辨率检查：

- 是否有黑边
- 人物方向是否正确
- 裁切是否过紧
- 元素是否溢出
- 分屏比例是否准确
- 字体和数值是否对齐
- 逐格或逐卡片动画数量是否正确
- 关键转场是否发生在正确帧

调校顺序建议：

1. 画布和分屏
2. 人物裁切
3. 主元素尺寸和位置
4. 字体和数据
5. 转场时间
6. 缓动和细微动态

先解决大构图，再处理细节，避免重复返工。

## 12. 阶段八：无声导出与探测

导出命令：

```bash
npx remotion render <CompositionId> \
  out/<output-name>.mp4 \
  --muted \
  --overwrite
```

导出后必须运行：

```bash
ffprobe -v error \
  -show_entries format=duration \
  -show_entries stream=index,codec_name,codec_type,width,height,r_frame_rate \
  -of json "out/<output-name>.mp4"
```

无声成片应只出现一个视频流：

```json
{
  "codec_name": "h264",
  "codec_type": "video",
  "width": 1280,
  "height": 720,
  "r_frame_rate": "30/1"
}
```

如果出现 `"codec_type": "audio"`，说明导出结果仍包含音轨，需要重新检查 Composition 和渲染命令。

## 13. 阶段九：登记镜头库

每条完成的 A-roll 在 `video-catalog/A-roll/entries.json` 中增加一条记录：

```json
{
  "id": "a-roll-003-product-demo",
  "title": "产品界面分屏讲解",
  "rollType": "A-roll",
  "status": "ready",
  "projectPath": "../remotion-shot-library",
  "compositionId": "ProductDemo",
  "previewPath": "../remotion-shot-library/out/product-demo-check.png",
  "outputPath": "../remotion-shot-library/out/product-demo.mp4",
  "durationInFrames": 240,
  "fps": 30,
  "width": 1280,
  "height": 720,
  "tags": {
    "subject": ["单人", "静态照片"],
    "framing": ["近景", "左右分屏"],
    "motion": ["轻推镜", "呼吸视差"],
    "elements": ["产品界面", "数字强调"],
    "format": ["16:9", "30fps", "无声"]
  }
}
```

状态建议：

- `draft`：正在制作
- `ready`：已通过验收，可直接使用
- `archived`：保留记录，但不再推荐使用

### 标签分组

| 分组       | 内容示例                                   |
| ---------- | ------------------------------------------ |
| `subject`  | 单人、双人、静态照片、真人视频、口罩       |
| `framing`  | 特写、近景、半身、全身、固定机位、左右分屏 |
| `motion`   | 推镜、平移、呼吸视差、逐格显现、循环卡片   |
| `elements` | 数据图表、产品 UI、品牌卡片、Logo、字幕    |
| `format`   | 16:9、9:16、30fps、无声、有声              |

标签优先复用已有词汇，避免同时出现“近景”“近距离”“人物近拍”等同义标签。

登记后运行：

```bash
cd <workspace>/video-catalog
node --test test/catalog.test.mjs
```

目录测试至少应检查：

- ID 唯一
- `rollType` 正确
- `status` 合法
- 项目目录存在
- 预览图存在
- 成品视频存在

## 14. 最终验收清单

### 视觉

- [ ] 画幅、帧率和时长与参考一致或接近
- [ ] 开场、主要转场和收尾关键帧已对照
- [ ] 人物没有倒置、拉伸、黑边或错误裁切
- [ ] 主元素的位置、大小和层级正确
- [ ] 数据、Logo 和高亮数量正确
- [ ] 没有字幕、水印和不需要的文案

### 可编辑性

- [ ] 人物素材可替换
- [ ] 文案和数据可替换
- [ ] 颜色和布局可调整
- [ ] 关键动画时间点可调整
- [ ] 元素列表或卡片内容可扩展
- [ ] Remotion Studio 可以正常打开

### 工程质量

- [ ] `npm test` 通过
- [ ] `npm run typecheck` 通过
- [ ] `npm run lint` 通过
- [ ] `npx remotion compositions` 输出正确
- [ ] 完整 MP4 渲染成功
- [ ] `ffprobe` 确认无音轨
- [ ] 镜头目录测试通过

## 15. 每条镜头的交付模板

````markdown
## <镜头名称>

- 镜头 ID：`a-roll-xxx-xxxx`
- Composition：`<CompositionId>`
- 规格：1280×720 / 30fps / xxx 帧
- 声音：无
- 项目目录：`<project-path>`
- 成品：`out/<output-name>.mp4`
- 预览：`out/<preview-name>.png`

### 可编辑内容

- 人物照片
- 文案和数据
- 布局位置
- 颜色
- 动画时点
- 动画幅度

### 启动

```bash
npm install
npm run studio
```

### 导出

```bash
npm run render:<shot-name>
```

### 验证结果

- Tests：通过
- Typecheck：通过
- Lint：通过
- 视频流：H.264
- 音频流：无
````

## 16. 常见问题

### 人物构图和参考视频无法完全一致

通常是源照片景别或拍摄角度不同。优先调整 `object-position` 和缩放；如果照片缺少身体区域，不要过度拉伸，应重新提供更完整的照片。

### Studio 正常，但导出动画不一致

检查是否使用了 CSS animation、随机数、系统时间或异步状态。所有动画应只依赖当前帧和固定 Props。

### 视频导出后仍有声音

确认：

1. Composition 中没有 `<Audio>`。
2. 渲染命令包含 `--muted`。
3. 使用 `ffprobe` 检查最终文件，而不是只凭播放器判断。

### 新镜头破坏了旧镜头

新增独立 Composition 和组件目录，不要直接重写旧镜头。完成后同时运行旧测试，并确认 `npx remotion compositions` 仍列出全部镜头。

### 标签越来越混乱

先复用已有标签，只在确实出现新特征时增加新词。定期合并同义词，镜头 ID 永远保持唯一且不重复使用。

## 17. 推荐执行顺序

```text
接收素材
  ↓
探测视频参数
  ↓
生成接触表与关键帧
  ↓
拆解时间轴
  ↓
确认保留、替换、删除内容
  ↓
设计 Composition Props
  ↓
测试时间轴逻辑
  ↓
实现组件与动画
  ↓
渲染关键帧并校准
  ↓
无声导出 MP4
  ↓
FFprobe 验证
  ↓
登记 A-roll / B-roll 标签
  ↓
目录测试与交付
```

核心原则只有三条：

1. **先拆帧，再实现。**
2. **内容参数化，动画帧驱动。**
3. **成片、源码、标签和验证一起交付。**
