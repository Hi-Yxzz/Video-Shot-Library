# 静态照片镜头复刻工作台设计

## 目标

使用 Remotion 制作一个 1280×720、30fps、230 帧（约 7.67 秒）的无声视频。作品复刻参考视频的稳定镜头节奏、轻微人物动态和上下两排循环元素卡片，但不保留原视频的声音、字幕、文案或水印。

工作台必须允许用户在 Remotion Studio 中替换人物照片和卡片内容，并调整主要视觉参数，无需修改动画组件内部代码。

## 输入素材

- 参考视频：`/Users/admin/Downloads/未命名.mp4`
- 人物照片：`/Users/admin/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_mfidu1rj2wkw21_6186/temp/RWTemp/2026-07/9e20f478899dc29eb19741386f9343c8/5cd0519759d35038e31060b91b8f0f8d.png`
- 默认卡片：使用 AI 公司名称和简化视觉标识；后续可替换为图片、Logo 或文字元素

源素材只复制到项目的 `public/assets/`，不修改原文件。

## 画面与时间轴

- 画布：1280×720，16:9
- 帧率：30fps
- 时长：230 帧
- 音频：无
- 字幕与文案：无
- 水印：无

时间轴分为三个连续阶段：

1. 0–24 帧：画面柔和进入，人物和卡片从轻微虚化、低透明度状态稳定下来。
2. 25–199 帧：主体保持稳定，人物进行低幅度呼吸缩放和上下浮动，两排卡片持续循环。
3. 200–229 帧：镜头轻微推近并自然停住，不进行黑场淡出。

所有阶段保持连续，不使用突兀切镜或物理弹簧动画。

## 视觉分层

### 背景层

将源照片逆时针旋转 90 度后，以 `cover` 方式裁切为 16:9，保留照片中的灰色墙面。背景层只进行极轻微的镜头推近，避免暴露裁切边缘。

### 人物动态层

人物层使用同一张照片，并通过透明蒙版分离人物主体。人物原貌、口罩、眼镜和衣服保持不变，不生成口型或手势。

人物层包含：

- 约 0.8%–1.8% 的周期性呼吸缩放
- 约 2–6px 的低幅度上下浮动
- 与背景不同速率的轻微推近，形成克制的视差
- 可选的柔和阴影或边缘羽化，用于消除蒙版边缘

若自动蒙版质量不足，工作台回退为整张照片单层动画，确保不会出现明显的人物轮廓破损。

### 元素卡片层

画面包含上下两排独立的无缝循环卡片：

- 上排位于人物头部后方区域，透明度较低、尺寸略小，作为后景。
- 下排位于画面底部前景，尺寸较大、对比度较高。
- 两排默认反向移动，速度和起始偏移独立配置。
- 为实现无缝循环，渲染时重复卡片数组，并基于帧数计算水平位移。
- 卡片不会遮挡人物眼睛区域；下排可覆盖人物胸口下部，与参考视频的层级关系一致。

卡片支持三种内容类型：

1. `text`：名称或短标签
2. `image`：本地图片或 Logo
3. `mixed`：图片与文字组合

## 可编辑工作台

Remotion Composition 通过类型安全的 props 和 Studio schema 暴露以下参数：

- `portraitSrc`
- `durationInFrames`
- `backgroundScale`
- `backgroundPositionX`
- `backgroundPositionY`
- `portraitScale`
- `portraitOffsetX`
- `portraitOffsetY`
- `breathingAmount`
- `floatingAmount`
- `cameraPushAmount`
- `topTrack`
- `bottomTrack`
- 每排卡片的 `items`、`speed`、`direction`、`gap`、`cardWidth`、`cardHeight`
- 卡片的 `opacity`、`blur`、`borderRadius`、`shadow`
- 全局背景亮度、对比度和暗角强度

默认 props 直接放在 Composition 注册处，便于在一个文件中查看画面规格和默认配置。

## 组件边界

- `Root.tsx`：Composition 注册、尺寸、帧率、时长、schema 和默认参数
- `PhotoReplica.tsx`：总时间轴和视觉分层
- `PortraitScene.tsx`：背景、人物层和镜头动画
- `LoopingTrack.tsx`：通用无缝循环轨道
- `ElementCard.tsx`：三种卡片内容渲染
- `types.ts`：工作台 props 和卡片类型
- `public/assets/`：人物照片、默认 Logo 或图片资源

各组件只通过显式 props 通信。动画由 `useCurrentFrame()` 和 `interpolate()` 驱动，不使用 CSS transition、CSS animation 或 Tailwind 动画类。

## 错误处理

- 图片资源缺失时显示带文件名的占位卡片，不让渲染直接崩溃。
- 空卡片数组时隐藏对应轨道。
- 速度为零时卡片保持静止。
- 非法尺寸、间距或动画幅度在 schema 层限制到安全范围。
- 人物蒙版不可用时使用完整照片回退模式。

## 验证标准

1. Studio 可启动，Composition 可在 1280×720、30fps 下完整预览。
2. 第 0、115、229 帧无黑边、破图、卡片断流或明显遮挡眼睛的问题。
3. 卡片循环在首尾衔接处无跳变。
4. 将默认卡片替换为任意文字或图片后，无需修改组件代码即可预览。
5. 调整人物缩放、位置、呼吸幅度和卡片速度后，Studio 立即反映变化。
6. 完整导出的视频为无声 MP4，时长约 7.67 秒。

## 非目标

- 不生成数字人口型、手势或新的面部表情。
- 不复用参考视频的声音、字幕、文案、水印或人物画面。
- 不加入后台服务、账号系统、在线素材库、遥测或网络请求。
- 不追求参考视频内容层面的逐像素一致；复刻范围限定为镜头节奏、层级关系和元素运动方式。
