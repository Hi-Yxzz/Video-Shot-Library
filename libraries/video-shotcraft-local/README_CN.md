<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/logo-mark-reverse.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/brand/logo-mark.svg">
  <img alt="Video Shot Library logo" src="./assets/brand/logo-mark.svg" width="112" height="112">
</picture>

<h1>Video Shot Library</h1>

[![GitHub stars](https://img.shields.io/github/stars/Hi-Yxzz/Video-Shot-Library)](https://github.com/Hi-Yxzz/Video-Shot-Library/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Hi-Yxzz/Video-Shot-Library)](https://github.com/Hi-Yxzz/Video-Shot-Library/network/members)
[![Gallery](https://img.shields.io/badge/Gallery-在线样片-d3923c)](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/)

**可复用的 Remotion 镜头库与 `video-shotcraft` Agent Skill：276 个镜头 ID · 174 个可执行镜头 · 159 条在线视频预览**

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md)

</div>

**Video Shot Library** 是本项目统一使用的仓库和产品名称，`video-shotcraft`
保留为兼容的 AI Agent Skill 名称。它可以把 Claude Code / Codex 变成动效工作室：
把你的产品交给它，它会用 [Remotion](https://www.remotion.dev/) 完成分镜、动画
和声音设计，产出一支电影感的宣传片 / 营销视频 / 发布视频 / 功能演示——
真实页面截图、2.5D 运镜、节奏卡点和电影级 SFX 全部包含。

仓库中的源码、镜头配方、配置与本地 Remotion Player 可以离线使用。
体积较大的视频预览文件不进入 Git；完整动态预览请访问
[在线镜头库](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/)。

## 🎬 效果预览

下面这支 38 秒的 Gallery 介绍片，本身就是用这个 skill 制作的——
从分镜、镜头实现到声音设计，全部由 agent 按库内方法论完成：

https://github.com/user-attachments/assets/cba2df8a-4b2e-4247-bace-d0b1dea9c2bd

▶️ [在 YouTube 观看高清版](https://youtu.be/gcVvRM_P3SM)

> 在线浏览全部镜头卡与动态样片：**[Gallery](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/)**
> —— 支持搜索、筛选、切换样式和多选复制镜头卡名称。

## 🚀 快速开始

**最直接的方式：把仓库链接丢给你的 agent。**
在 Claude Code / Codex 等 agent 里说：

```text
帮我安装这个 skill：https://github.com/Hi-Yxzz/Video-Shot-Library
```

agent 会克隆仓库并链接到 skills 目录。也可以用 [skills](https://skills.sh/) CLI
或手动安装：

```bash
npx skills add Hi-Yxzz/Video-Shot-Library
```

```bash
git clone https://github.com/Hi-Yxzz/Video-Shot-Library.git
cd Video-Shot-Library
ln -s "$(pwd)" ~/.claude/skills/video-shotcraft   # Claude Code
# 或
ln -s "$(pwd)" ~/.codex/skills/video-shotcraft    # Codex
```

装好后直接提需求：

```text
用 video-shotcraft 给我的桌面产品做一支宣传片。
用 deck-deal-flyin 和 row-embed 两张镜头卡展示这个功能。
参考 spotlight-hero-card，为这个页面设计一个产品特写镜头。
```

如果没有指定镜头卡，skill 会先介绍现成成片模板并询问是否采用；
也可以先在 [Gallery](https://video-shotcraft-local-2026.yxzzzzz.chatgpt.site/) 里挑好镜头再开始。

## 📼 成片模板：Ink Press（墨压）

skill 内置 **Ink Press（墨压）** 模板——一支已验收的完整宣传片：
36.2 秒、1920×1080、30fps、10 个镜头的纸墨琥珀风，含 2.5D 真实页面运镜、
字卡、转场和配好的电影感 SFX：

https://github.com/user-attachments/assets/4cf5af51-98f3-4af2-8ab2-7267f470513d

▶️ [在 YouTube 观看高清版](https://youtu.be/iShab28B_ak)

使用方式：直接告诉你的 agent——

```text
用 video-shotcraft 的 Ink Press 模板给我的产品做一支宣传片。
```

agent 会替换成目标产品的截图、文案和品牌信息，复现同等质感——
这是最快、质量最有保障的出片路径。

> 后续会持续更新更多模板。

### Headless / CI 注意事项

在无显示器的 Linux 服务器上渲染（实测环境：2 核、Node 22）会遇到三个坑，
都可以一个参数解决：

1. **并发上限** —— 低核机器上 `remotion still/render` 会报
   "Maximum for --concurrency is 2"。解决：加 `--concurrency=1`。
2. **旧版 Headless 被移除** —— 新版 Chrome/Chromium 已删除旧 headless 模式，
   让 Remotion 指向系统 chromium 会启动失败。解决：改用
   chrome-headless-shell 二进制，而不是完整版 Chrome。
3. **CDN 被墙** —— 如果 remotion.media 无法访问，headless-shell 的自动下载
   会失败。解决：用 `--browser-executable=<本地 chrome-headless-shell 路径>`
   指定本地二进制。

加上这三个参数后，内置模板即可正常渲染。

## 📦 项目包含什么

| 内容 | 说明 |
| --- | --- |
| 276 个稳定镜头 ID | 174 个可执行 Remotion 镜头与 102 个参考镜头，统一搜索和筛选 |
| 159 条在线视频预览 | 通过在线 Gallery 查看；体积较大的视频文件不进入 Git |
| 104 张 video-shotcraft 镜头配方卡 | 记录用途、能量、建议时长、参数、实现要点与已知坑 |
| Remotion 参考实现 | 经过调校的 TSX demo 与本地 Player，包含实际缓动和时序参数 |
| 完整成片模板 | 36.2 秒、1920×1080、30fps、10 镜头的纸墨琥珀风产品宣传片 |
| 组件与素材 | 2.5D 页面相机、字幕、闪切、数字滚动、音效和素材采集脚本 |
| 制作方法论 | 从素材采集、风格定调和分镜，到声音设计、节奏卡点与最终验收 |

源码目录保留全部 104 张 Video Shotcraft 配方卡，其中 102 张进入统一镜头目录；
`letterspace-materialize` 和 `text-as-mask` 当前由目录配置排除。

当前主要面向 Web 与桌面产品宣传片，但镜头卡也可以单独用于功能演示、
品牌短片、发布视频或其他动态设计项目。

## 🗂 项目结构

```text
Video-Shot-Library/
├── SKILL.md                 # Agent 使用入口与核心制作规则
├── references/
│   ├── pipeline.md          # 完整制作流水线
│   ├── shots/               # 104 张镜头配方卡
│   ├── sequences/           # 可复用的全片结构与桥段模板
│   ├── aesthetic-rules.md   # 视觉验收准则
│   ├── music-beat-sync.md   # BGM 节奏分析与卡点方法
│   └── sound-design.md      # 声音设计方法与判例
├── demos/                   # 镜头卡的 Remotion 参考实现（同类别目录）
├── gallery/                 # 在线样片画廊的静态站点
├── template/                # 可直接运行的完整成片模板
└── assets/
    ├── lib/                 # 可复制使用的 Remotion 组件
    ├── scripts/             # 页面素材采集脚本
    └── audio/               # SFX 与授权说明
```

完整工作流和实现要求见 [SKILL.md](SKILL.md)、
[制作流水线](references/pipeline.md) 与
[视觉验收准则](references/aesthetic-rules.md)。

## 🎯 统一 Remotion 调用接口（Shot Runtime）

本仓库提供了一套编程式镜头调用接口，可在代码中通过稳定 ID 直接获取可编辑的
Remotion 镜头数据与组件。当前接口随 GitHub 源码分发，尚未发布为 npm 包；
下面示例适用于克隆仓库内的 Remotion 文件。

```tsx
import {
  getShot,
  listShots,
  searchShots,
  getShotControls,
} from "./shot-runtime";

const shot = getShot("remocn/hand-count");

if (shot.kind !== "executable") {
  throw new Error("该镜头只有参考预览");
}

const props = shot.createProps({
  primaryColor: "#ff5a1f",
  custom: { from: 0, to: 2026 },
});

const composition = shot.createComposition({
  durationInFrames: 120,
});

export const Scene = () => <shot.Component {...props} />;
```

**接口概览：**

| API | 说明 |
|---|---|
| `getShot(id)` | 按 ID 取镜头，不存在时抛出 `ShotNotFoundError` 并建议相近 ID |
| `hasShot(id)` | 判断镜头是否存在 |
| `listShots(filters?)` | 列出镜头，支持按 `kind` / `grade` / `category` / `tags` 筛选 |
| `searchShots(keyword, filters?)` | 搜索中文关键词（匹配 ID、标题、摘要、用途、标签） |
| `getShotControls(id)` | 获取镜头的可编辑参数列表 |

**参数调整能力：**

- **通用参数**：文字（`text`、`secondaryText`）、颜色（`primaryColor`、`secondaryColor`、`backgroundColor`）、时长（`durationInFrames`）
- **镜头专属参数**：通过 `custom` 传入，自动校验类型、范围和格式
- **不支持参数**：明确抛出 `UnsupportedShotParameterError`

**镜头库构成：**
- 138 个 Remocn 镜头 + 36 个 Remotion Bits 镜头 = 174 个可执行镜头
- 102 个 Video Shotcraft 镜头标记为参考镜头
- 合计 276 个镜头 ID

详细用法、参数说明、筛选示例和 Remotion Root 注册方法见 [shot-runtime/README.md](shot-runtime/README.md)。

## 🔊 音频与素材说明

`assets/audio/` 中的音效可按各自授权条件使用，来源与许可信息见
[ATTRIBUTION.md](assets/audio/ATTRIBUTION.md)。
`pop.mp3`、`typewriter.mp3` 与 `bgm-tech-house.mp3` 的来源尚未完全确认，
商用前必须复核或替换。

模板内的产品截图为演示素材。对外发布成片前，请替换为目标产品自己的截图，
并确认其中的数据、客户信息和个人信息是否需要脱敏。

## 🙏 致谢

本仓库基于魏毅豪创建并以 Apache 2.0 发布的
[Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)
继续开发。仓库保留原始版权和许可证；Video Shot Library 在此基础上增加了统一目录、
本地 Player、中文元数据、镜头分级与 Shot Runtime 接口。

本库中许多镜头配方源自对优秀官方产品宣传片动效语言的研究学习——包括
**ClickUp、Perplexity、Slack、Notion、Figma、Framer、Bear、Raycast、
Pitch、Miro、Superhuman、Loom** 等产品的宣传片。镜头卡记录的是从零重新
实现的动效技法（时序、缓动、编排）；仓库中不包含上述影片的任何素材、
画面或品牌资产。所有商标归各自所有者所有，上述公司与本项目无关联、
亦未对本项目背书。

特别感谢：

- **[Remotion](https://www.remotion.dev/)** —— 驱动本库全部 demo 与模板的
  React 视频框架。请注意 Remotion 有自己的
  [许可协议](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
  （个人与小团队免费，公司可能需要付费许可）。
- **[Mixkit](https://mixkit.co/)** —— 库内 SFX 与音乐素材的来源
  （免费商用授权）。
- 游戏手感与动画社区的公开方法论（如 Vlambeer 的 screenshake 演讲、
  经典动画时序原则），多张镜头卡受其启发。
- **Claude Code** —— 本库自身的构建、迭代与验收全程由 AI coding agent
  完成，用的正是这个 skill 所传授的工作流。

## ⭐ Star 历史

[在 Star History 查看正式仓库](https://www.star-history.com/?repos=Hi-Yxzz%2FVideo-Shot-Library&type=date&legend=top-left)。
