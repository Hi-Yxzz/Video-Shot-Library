# OpenAI 股权分屏 A-roll 设计

## 目标

在现有 Remotion 工作台中新增 `OpenAIEquitySplit` Composition，复刻参考视频的全屏股权图、左右分屏、估值数字和微软持股区块动画。右侧人物使用现有静态照片与灰墙背景，通过轻微呼吸、浮动和推镜替代真人口型与手势。

## 输出规格

- 画布：1280×720
- 帧率：30fps
- 时长：236 帧，约 7.87 秒
- 音频：无音轨
- 字幕：无
- 水印：无

## 时间轴

1. 0–20 帧：股权图全屏展示，标题、100 格图和 `27%` 高亮可见。
2. 21–35 帧：图表缩放并滑至左侧，右侧照片面板进入。
3. 36–65 帧：方格颜色过渡为中性深灰，`27%` 提示完成退出。
4. 66–175 帧：顶部估值卡片进入，显示 OpenAI、日期、`市场估值` 和 `8520 亿`。
5. 176–205 帧：深灰方格淡化为浅灰，微软持股区域逐格变蓝。
6. 206–235 帧：蓝色横向高亮带和 `2290 亿` 进入并保持到结束。

所有动画由 `useCurrentFrame()`、`interpolate()` 和确定性逐格延迟驱动，不使用 CSS transition、CSS animation 或随机数。

## 构图

### 全屏阶段

股权图居中，占画面约 72% 宽度。顶部显示英文小标题和 `OpenAI 股权占比`。100 个方格按 10×10 排列，默认用粉红、暗红、微软蓝和浅灰表达不同持股区块。

### 分屏阶段

- 左侧图表面板：792px
- 右侧人物面板：488px
- 分界线保持垂直，不加装饰边框
- 图表在分屏后重新排版为较紧凑的 10×10 网格

### 人物面板

人物面板使用 `public/assets/portrait-landscape.png`，保持灰墙背景。人物仅进行低幅度推近、上下浮动和呼吸缩放。图片裁切位置、缩放和运动幅度作为 Composition props 暴露。

## 数据与可编辑参数

Composition schema 暴露：

- `durationInFrames`
- `portraitSrc`
- `title`
- `eyebrow`
- `dateLabel`
- `ownershipPercent`
- `marketValue`
- `microsoftValue`
- `currencyUnit`
- `totalCells`
- `gridColumns`
- `microsoftCells`
- `splitX`
- `introEndFrame`
- `splitEndFrame`
- `valuationStartFrame`
- `microsoftStartFrame`
- `marketColor`
- `microsoftColor`
- `neutralColor`
- `mutedColor`
- 人物缩放、裁切位置、浮动和推镜参数

默认 `totalCells=100`、`gridColumns=10`、`microsoftCells=27`。Schema 限制所有数字到安全范围，避免负尺寸、无效帧或持股格数超过总格数。

## 组件

- `src/equity/types.ts`：Composition props 与阶段类型
- `src/equity/timeline.ts`：纯函数阶段判断、逐格显现进度和网格索引
- `src/equity/timeline.test.ts`：阶段边界与 27 格测试
- `src/equity/EquityGrid.tsx`：可配置 10×10 方格图
- `src/equity/ValueCard.tsx`：OpenAI 估值卡片
- `src/equity/MicrosoftMark.tsx`：CSS 微软四色标识
- `src/equity/PhotoPresenterPanel.tsx`：右侧静态人物面板
- `src/equity/OpenAIEquitySplit.tsx`：总时间轴和分层
- `src/Root.tsx`：新增 Composition 注册与默认参数

第一条 `PhotoReplica` 的文件和默认行为保持不变。

## 错误处理

- `microsoftCells` 超过 `totalCells` 时由 schema 拒绝。
- 空标题和数字允许渲染，但布局预留稳定高度。
- 照片路径缺失时由 Remotion 资源错误明确指出文件路径。
- 阶段帧必须按递增顺序通过 schema 校验。
- 网格尺寸由总格数和列数计算，不依赖手工定位每个格子。

## 验证

- 阶段边界纯函数测试通过。
- 微软高亮恰好覆盖默认 27 格。
- `PhotoReplica` 原有 9 项测试继续通过。
- `OpenAIEquitySplit` 被 Remotion 识别为 1280×720、30fps、236 帧。
- 第 0、32、100、190、235 帧无黑边、破图、布局溢出或人物遮挡图表。
- 完整 MP4 只有 H.264 视频流，无音频流，时长约 7.87 秒。
- `video-catalog/A-roll/entries.json` 新增唯一 ID `a-roll-002-openai-equity-split`，目录契约测试通过。

## 非目标

- 不生成口型、手势或新的面部表情。
- 不保留参考视频声音、字幕、水印或原人物画面。
- 不添加网络素材、后台服务、遥测或远程上传。
- 不重构第一条 A-roll Composition。
