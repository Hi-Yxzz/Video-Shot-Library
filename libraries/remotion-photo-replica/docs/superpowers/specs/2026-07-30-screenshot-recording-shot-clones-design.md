# “截图·录屏”镜头克隆设计

## 目标

把 XCYJ 镜头市场“截图·录屏”分类的 11 个参考镜头复刻为可编辑 Remotion Composition，并接入现有镜头库。保持现有卡片悬停自动播放、移出恢复和详情预览逻辑不变。

## 范围

镜头 ID：`showcase`、`screenshot`、`shotfull`、`scrollshot`、`brollstack`、`shotrotate`、`ring`、`rc012`、`rc018`、`rc019`、`rc025`。

现有库没有同 ID 镜头，因此本批全部新增。`showcase`、`screenshot`、`brollstack` 是 A-roll，人物替换为统一演示照片；其余 8 个是 B-roll。

## 实现结构

- 新建 `src/screenshot-recording/`，包含类型、镜头目录、参考布局常量、布局测试和共享场景组件。
- 使用一个 `ScreenshotRecordingScene` 按 `variant` 渲染 11 种镜头，复用人物面板、截图占位、浏览器卡片、焦点框、卡片栈和媒体轨道。
- 每个 Composition 使用 1920×1080、30fps、180 帧，无音频。
- 参考预览没有真实截图素材的镜头，默认复刻其可编辑占位画面；后续通过 Composition props 替换截图、标题、列表和颜色。
- 所有动画只由 `useCurrentFrame()`、`interpolate()` 和关键帧参数驱动，不使用 CSS transition/animation，也不调用 AI 或网络接口。

## 视觉与时间原则

- 以参考视频 0、30、60、90、120、165 帧作为校准锚点。
- 首帧占位标题、主体卡片进入、章节切换和最终停留位置与参考帧一致。
- A-roll 人物保持原参考人物所在侧与缩放关系，使用 `assets/portrait-landscape.png`。
- 截图、媒体卡和高亮框作为独立图层，允许后续替换内容而不改变原动画。

## 镜头库接入

- 合集名与预览目录统一为 `xcyj-screenshot-recording`。
- A-roll 卡片进入现有 A-roll 大类；B-roll 进入 `interaction`。
- 卡片标题和标签写入现有源数据，预览 MP4 放入 `public/media/xcyj-screenshot-recording/`。
- 同步完整可编辑源文件到 `library-sources/a-roll-remotion/src/screenshot-recording/`。

## 验收

- 11 个 Composition 均可渲染，卡片 ID 唯一。
- 代表帧与参考视频同帧对比，位置、大小、颜色和阶段切换一致。
- MP4 为 1920×1080、30fps、无音轨。
- Remotion 测试、静态检查、镜头库数据检查与类型检查通过。
