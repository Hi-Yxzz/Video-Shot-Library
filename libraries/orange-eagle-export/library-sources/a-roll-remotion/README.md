# Remotion 照片镜头工作台

将一张静态照片制作成 1280×720、30fps 的无声镜头，并通过 Remotion Studio 调整人物、数据和动画。

## 启动工作台

```bash
npm install
npm run studio
```

在 Remotion Studio 中选择 Composition，通过右侧 Props 面板修改内容：

- `PhotoReplica`：约 7.67 秒，轻推镜、人物呼吸视差、上下两排循环元素卡片。
- `OpenAIEquitySplit`：约 7.87 秒，OpenAI 股权格子图、估值卡片、微软份额动画和右侧人物分屏。
- `AIBrandCardComparison`：约 2.20 秒，OpenAI 与 Anthropic 双层玻璃卡片依次进入并悬浮。
- `AIIconCloud`：约 4.67 秒，8 个可替换 AI 图标从人物四周依次弹入、漂浮并淡出。
- `ProductSOPPanel`：约 2.60 秒，左上工作台从窄版展开为大型 SOP 文档面板。
- `AIUsageHeadline`：约 5.67 秒，左右两组 AI 使用场景标题依次进入并包围人物。
- `BilateralAIIconStacks`：左右两列 AI 图标依次出现。
- `TraeLogoCallout`：左侧单品牌标识弹入。
- `ClaudeCodexComparison`：黑底双工具标识与圆角人物窗。
- `PromptDocumentSplit`：右侧提示词文档滑入。
- `Aroll011DocumentSlide`：左侧自定义命令文档滑入。
- `Aroll012MilestoneCounter`：平台里程碑数字递增与成绩卡。
- `Aroll013BossLevelCards`：三张等级卡依次进入。
- `Aroll014IterationGrowth`：成长标题与九段柱状图逐级生成。
- `Aroll015KnowledgeCommodity`：知识主标题、右侧知识卡和底部工具条。
- `Aroll016PatientOutcome`：左侧双色结论标题进入。

## 常用可编辑项

- `portraitSrc`：`public/` 目录中的照片路径
- `durationInFrames`：视频帧数
- `backgroundPositionX/Y`：照片裁切位置
- `portraitScale`、`portraitOffsetX/Y`：人物层尺寸和位置
- `breathingAmount`、`floatingAmount`：呼吸与浮动幅度
- `cameraPushAmount`：镜头推近幅度
- `topTrack`、`bottomTrack`：上下卡片轨道
- `items`：卡片数组，支持 `text`、`image`、`mixed`
- `speed`、`direction`、`gap`：轨道速度、方向和间距

`OpenAIEquitySplit` 的常用可编辑项：

- `portraitSrc`、`portraitScale`、`portraitPositionX/Y`：人物照片与裁切
- `title`、`eyebrow`、`dateLabel`：图表标题信息
- `ownershipPercent`、`marketValue`、`microsoftValue`：股权和估值数据
- `grid.total`、`grid.columns`、`grid.microsoftCells`：格子总数、列数和微软格数
- `layout.splitX`：左右分屏位置
- `timings`：分屏、估值、微软格子与收尾卡片的动画时点
- `motion`：人物呼吸、浮动和轻推镜幅度

`AIBrandCardComparison` 的常用可编辑项：

- `leftCard`、`rightCard`：品牌文字、标记、卡片尺寸、位置与颜色
- `leftEnterStart/End`、`rightEnterStart/End`：两张卡片的入场帧
- `portraitScale`、`portraitPositionX/Y`：人物照片裁切
- `breathingAmount`、`floatingAmount`、`cameraPushAmount`：人物运动幅度

`AIIconCloud` 的常用可编辑项：

- `icons`：图标标记、标签、颜色、位置、尺寸、旋转与漂浮幅度
- `enterStart`、`enterStagger`、`enterDuration`：图标入场节奏
- `exitStart`、`exitEnd`：末段淡出区间

`ProductSOPPanel` 的常用可编辑项：

- `panelX/Y`、`collapsedWidth/Height`、`expandedWidth/Height`：面板布局
- `expandStart`、`expandEnd`：文档展开时点
- `title`、`eyebrow`、`sections`、`accentColor`：文档内容与配色

`AIUsageHeadline` 的常用可编辑项：

- `leftHeadline`、`rightHeadline`：两组标题文字、位置、宽度、字号与颜色
- `leftEnterStart/End`、`rightEnterStart/End`：左右标题入场帧

图片卡片的 `imageSrc` 同样相对于 `public/`，例如：

```json
{
  "id": "brand",
  "type": "mixed",
  "label": "Brand",
  "imageSrc": "assets/brand-logo.png",
  "accentColor": "#3366ff"
}
```

## 检查与导出

```bash
npm test
npm run typecheck
npm run lint
npm run render:check
npm run render:video
npm run render:equity-check
npm run render:equity-video
npm run render:brand-check
npm run render:brand-video
npm run render:icon-check
npm run render:icon-video
npm run render:sop-check
npm run render:sop-video
npm run render:headline-check
npm run render:headline-video
npm run render:batch4
npm run render:batch5
npm run render:batch6
npm run render:batch7
npm run render:batch8
npm run render:batch9
npm run render:batch10
npm run render:batch11
npm run render:batch12
npm run render:batch19
```

最终视频输出到 `out/photo-shot-replica.mp4`、`out/openai-equity-split.mp4` 和 `out/ai-brand-card-comparison.mp4`。所有渲染命令都固定使用 `--muted`，因此输出文件不包含音轨。

## 主要文件

- `src/Root.tsx`：Composition 尺寸、时长与默认工作台配置
- `src/PhotoReplica.tsx`：总时间轴和图层顺序
- `src/components/PortraitScene.tsx`：背景与人物视差
- `src/components/LoopingTrack.tsx`：无缝循环轨道
- `src/components/ElementCard.tsx`：文字、图片和混合卡片
- `src/equity/OpenAIEquitySplit.tsx`：OpenAI 股权分屏总时间轴
- `src/equity/EquityGrid.tsx`：100 格股权动画
- `src/equity/PhotoPresenterPanel.tsx`：右侧人物镜头
- `src/brand-cards/AIBrandCardComparison.tsx`：双品牌卡片总时间轴
- `src/brand-cards/BrandCard.tsx`：可替换双层玻璃卡片
- `src/icon-cloud/AIIconCloud.tsx`：AI 图标环绕镜头
- `src/icon-cloud/FloatingIcon.tsx`：可替换漂浮图标
- `src/document-panel/ProductSOPPanel.tsx`：可编辑 SOP 文档展开镜头
- `src/headline/AIUsageHeadline.tsx`：左右大型标题镜头
- `src/batch/`：批量复刻的品牌、工具对比与文档分屏镜头
- `src/aroll-batch/`：A-roll 011–016 的可编辑标题、卡片、数字与图表镜头
- `public/assets/portrait-landscape.png`：默认人物照片
