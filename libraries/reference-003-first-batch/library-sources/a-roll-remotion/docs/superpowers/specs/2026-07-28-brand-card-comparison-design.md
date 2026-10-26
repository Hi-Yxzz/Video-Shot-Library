# AI 品牌卡片对比 A-roll 设计

## 目标

在现有 Remotion 工作台中新增 `AIBrandCardComparison` Composition，复刻参考视频中人物居中、OpenAI 与 Anthropic 双层玻璃卡片依次进入并悬浮的镜头。人物继续使用现有静态照片和灰色墙面背景，通过低幅度呼吸、浮动与推镜替代参考人物的口型和手势。

## 输出规格

- 画布：1280×720
- 帧率：30fps
- 时长：66 帧，约 2.20 秒
- 音频：无音轨
- 字幕：无
- 水印：无

参考文件的容器元数据记录了 167 帧，但实际只能解码 66 帧；本 Composition 以实际可见帧为准。

## 时间轴

1. 0–5 帧：仅显示全屏人物照片。
2. 6–17 帧：左侧 OpenAI 卡片由左上方淡入、放大并落到人物左肩外侧。
3. 18–23 帧：OpenAI 卡片保持，产生轻微悬浮。
4. 24–35 帧：右侧 Anthropic 卡片由右上方淡入、放大并落到人物右肩外侧。
5. 36–65 帧：两张卡片保持，使用相同相位的低幅度悬浮，确保动画全过程水平对齐。

所有运动由 `useCurrentFrame()`、`interpolate()` 和确定性正弦函数驱动，不使用 CSS transition、CSS animation 或随机数。

## 构图

- 人物照片铺满画面，以人物面部为中心，保留原照片中的灰墙。
- OpenAI 卡片默认停靠在 `x=40`、`y=48`，宽 320、高 360。
- Anthropic 卡片默认停靠在 `x=920`、`y=52`，宽 300、高 360，与 OpenAI 卡片顶部、中心线和底部水平对齐。
- 卡片为双层结构：上层白色玻璃面板显示标识，下层浅灰绿色面板显示英文品牌名。
- 卡片采用圆角、细描边、半透明高光和柔和阴影，避免依赖远程品牌素材。

## 可编辑参数

Composition schema 暴露：

- `durationInFrames`
- `portraitSrc`
- `portraitScale`
- `portraitPositionX/Y`
- `breathingAmount`
- `floatingAmount`
- `cameraPushAmount`
- 左右品牌的 `brandName`、`markText`、`label`
- 左右卡片的 `x`、`y`、`width`、`height`
- `leftEnterStart/End`
- `rightEnterStart/End`
- 卡片背景色、描边色、文字色和悬浮幅度

Schema 限制尺寸、位置、帧号和运动幅度到安全范围。左右入场区间必须递增，且不得超过总帧数。

## 组件

- `src/brand-cards/types.ts`：Composition schema 与 props
- `src/brand-cards/timeline.ts`：入场进度和悬浮偏移纯函数
- `src/brand-cards/timeline.test.ts`：时间边界与确定性测试
- `src/brand-cards/BrandCard.tsx`：双层玻璃品牌卡片
- `src/brand-cards/AIBrandCardComparison.tsx`：人物背景与总时间轴
- `src/Root.tsx`：Composition 注册和默认值

现有 `PhotoReplica` 与 `OpenAIEquitySplit` 的默认行为保持不变。

## 错误处理

- 非法帧区间由 schema 拒绝。
- 卡片尺寸和位置超出安全范围时由 schema 拒绝。
- 照片路径缺失时保留 Remotion 的明确资源错误。
- 品牌文字为空时仍保留固定布局，不导致卡片塌陷。

## 验证

- 时间轴纯函数覆盖入场前、入场中、入场后和悬浮确定性。
- 现有 26 项测试继续通过。
- Remotion 能识别 `AIBrandCardComparison` 为 1280×720、30fps、66 帧。
- 第 0、6、12、24、36、65 帧无黑边、破图、文字溢出或人物被卡片遮脸。
- 完整 MP4 只有 H.264 视频流，无音频流，时长约 2.20 秒。
- `video-catalog/A-roll/entries.json` 新增唯一 ID `a-roll-003-ai-brand-card-comparison`，目录契约测试通过。

## 非目标

- 不生成口型、手势或新的人物动作。
- 不保留参考视频声音、字幕、水印或原人物画面。
- 不下载远程品牌资源。
- 不重构既有 A-roll Composition。
