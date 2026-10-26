# Remocn 与 Remotion Bits 本地镜头库导入设计

日期：2026-07-27

## 目标

在现有 Video Shotcraft 本地镜头库中，新增 Remocn（含 Remocn UI）与
Remotion Bits 的 S、A、B 级镜头，并将每个新增镜头的源码和 Remotion
Player 实时预览环境保存到本地。RVE 与所有 C 级镜头不在本轮范围内。

## 范围

| 来源 | S | A | B | 合计 |
|---|---:|---:|---:|---:|
| Remocn | 11 | 36 | 57 | 104 |
| Remocn UI | 8 | 3 | 23 | 34 |
| Remotion Bits | 5 | 11 | 20 | 36 |
| 新增合计 | 24 | 50 | 100 | 174 |

现有 102 张 Video Shotcraft 卡片及 159 条 MP4 预览保持不变。导入完成后
暂有 276 个镜头：原库继续播放本地 MP4，新增 174 个镜头通过本地 Remotion
Player 直接执行 TSX。

## 数据与源码

新增 `source/graded-library.json`，每条镜头记录包含：

- 唯一 ID：`<source>/<upstream-id>`，避免跨库重名；
- 名称、描述、用途分类；
- S/A/B 等级及五维评分；
- 上游仓库、许可证和版本快照信息；
- 本地源码文件列表；
- 本地 Player 路径与 Composition ID。

源码快照存放在：

- `library-sources/remocn/`
- `library-sources/remotion-bits/`

只保存导入镜头所需的注册表源码、示例实现和许可证，不复制文档站、构建缓存、
Git 历史或无关素材。上游源码保持原许可证声明。

## 本地 Remotion Player 预览

两个上游库构建为相互隔离的静态 Player：

```text
public/players/remocn/index.html
public/players/remocn/assets/*
public/players/remotion-bits/index.html
public/players/remotion-bits/assets/*
```

Player 使用上游仓库自带的 Remotion 示例与 Composition：

- Remocn 与 Remocn UI 使用官方文档示例和完整 flow；
- Remotion Bits 使用注册表中的独立 Bit 场景；
- 两个 Player 分别锁定自己的 React、Remotion 和第三方依赖版本，不与主站
  的 Next/React 运行时共享依赖。

主站通过同源 iframe 加载：

```text
/players/remocn/index.html?shot=soft-blur-in
/players/remotion-bits/index.html?shot=bit-cursor-flyover
```

只有镜头进入视口后才创建 iframe。主站与 Player 使用 `postMessage` 传递
`play`、`pause`、`seekToStart` 与 `setControls` 指令；离开视口时暂停，详情弹窗
启用控制条。Player 拒绝清单之外的 shot ID，并显示明确的本地错误界面。

原示例画幅不一致时由 Player 外层统一适配到 16:9，不修改镜头内部动画节奏。
构建结果是静态 JS/CSS/HTML，可离线运行，不依赖 Remocn 或 Remotion Bits 官网。

## 数据构建与页面

扩展 `scripts/build-library-data.mjs`，将原始 Video Shotcraft 卡片与
`graded-library.json` 合并，输出统一的 `public/data/library.json`。

统一卡片新增字段：

- `collection`：`video-shotcraft`、`remocn`、`remocn-ui` 或
  `remotion-bits`；
- `grade`：`S`、`A`、`B` 或 `null`；
- `score`：新增库的评分，原卡片为 `null`；
- `sourceUrl`、`license`、`codeFiles`；
- `previewKind`：原库为 `video`，新增库为 `player`；
- `playerUrl`、`compositionId`：新增镜头的本地运行时入口。

页面增加等级筛选（全部、S、A、B、原库）和来源标识。分类筛选、搜索、详情弹窗
继续复用现有交互。搜索范围扩展到等级、来源和上游 ID。详情弹窗显示评分、来源、
许可证及本地源码路径。

视频 URL 必须是站内 `/media/` 路径，Player URL 必须是站内 `/players/`
路径；新增镜头不依赖远程视频或远程网页。原有卡片的数据与交互保持兼容。

## 错误处理

- 拒绝越出 `library-sources/` 和 `public/players/` 的路径；
- 拒绝 S/A/B 之外的新增等级；
- 拒绝重复的 namespaced ID；
- 构建时检查每条新增镜头的源码文件存在；
- 构建时检查每条新增镜头的 Composition ID 出现在对应 Player manifest；
- Player 加载、Composition 解析或运行失败时显示镜头 ID 与错误摘要，不无限转圈。

## 测试与验收

自动测试覆盖：

- 仅导入 Remocn、Remocn UI 和 Remotion Bits 的 S/A/B 条目；
- 新增数量严格为 174，S/A/B 分布为 24/50/100；
- 原有 102 张卡片不丢失，且继续排除 `letterspace-materialize` 与
  `text-as-mask`；
- namespaced ID 唯一；
- 本地 Player 路径、Composition ID 和源码路径安全；
- 等级、来源、分类和关键词筛选可组合；
- 页面构建与服务端渲染测试继续通过。

Player 验收覆盖：

- 两个 Player 静态构建均可在断网状态加载；
- manifest 恰好覆盖 174 个新增镜头；
- 未知 shot ID 被拒绝并显示错误状态；
- 主站可通过消息控制播放、暂停、回到开头与详情控制条；
- 每档、每来源抽样检查开头、中间和结尾，排除空白、裁切和运行错误。

## 非目标

- 不导入 RVE；
- 不导入任何 C 级镜头；
- 不重新设计原镜头等级；
- 不为新增 174 个镜头生成或保存 MP4；
- 不部署网站；
- 不修改上游镜头动画参数或视觉风格。
