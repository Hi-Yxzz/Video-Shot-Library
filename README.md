# Remotion 镜头库统一归档

归档日期：2026-10-26。所有本地镜头库版本统一保存在 `Hi-Yxzz/Video-Shot-Library` 项目中。

这是一份可恢复的完整归档。各版本保留独立源码快照，避免同名镜头覆盖；未提交改动也已包含。原项目默认分支继续维护网站，归档分支集中保存全部本地版本。

## 浏览源码

| 目录 | 内容 | 文件数 | 原目录镜头卡条数 |
| --- | --- | ---: | ---: |
| [Video-Shot-Library](libraries/Video-Shot-Library/) | 主镜头库，含未提交的 VOX 镜头更新 | 1,889 | 358 |
| [Video-Shot-Library-curated-v2](libraries/Video-Shot-Library-curated-v2/) | 精选镜头库第二版 | 2,146 | 352 |
| [video-shotcraft-local](libraries/video-shotcraft-local/) | 较早本地镜头库版本 | 1,600 | 276 |
| [ai-flavor-three-shot-validation](libraries/ai-flavor-three-shot-validation/) | AI 味三镜头验证工作副本 | 1,935 | 352 |
| [reference-003-first-batch](libraries/reference-003-first-batch/) | 高保真参考镜头首批工作副本 | 2,022 | 352 |
| [orange-eagle-export](libraries/orange-eagle-export/) | Eagle 导出与镜头补全工作副本 | 1,835 | 352 |
| [remotion-photo-replica](libraries/remotion-photo-replica/) | 可编辑人物照片、终端、字卡、录屏和转场复刻工程 | 242 | — |
| [remotion-shot-grades](libraries/remotion-shot-grades/) | 镜头分级清单、报告及预览工程 | 17 | — |
| [video-catalog](libraries/video-catalog/) | A-roll / B-roll 目录索引 | 7 | — |
| [video-shotcraft-installed](libraries/video-shotcraft-installed/) | 已安装的上游镜头工具包，额外备份 | 909 | — |

镜头卡条数按各版本的索引记录，版本之间大量重合，不能相加当作独立镜头总数。

## 下载与恢复

源码文本保存在本分支。图片、视频、字体和音效等二进制素材去重后保存在 [同仓库归档附件](https://github.com/Hi-Yxzz/Video-Shot-Library/releases/tag/local-remotion-archive-2026-10-26)。

```bash
git clone --single-branch --branch archive/remotion-libraries-2026-10-26 https://github.com/Hi-Yxzz/Video-Shot-Library.git remotion-libraries
cd remotion-libraries
python3 restore.py
```

`restore.py` 需要 Python 3.9+ 和 GitHub CLI `gh`。它下载本次归档的媒体附件，核验附件与每个文件的 SHA-256，并将素材恢复到各工程原来的相对路径。遇到已修改的文件会停止，避免覆盖。

```bash
# 仅核验 Git 中的源码文件，不下载素材
python3 restore.py --source-only
# 恢复后再次完整核验
python3 restore.py --verify
```

每个工程继续使用自身 `README.md`、`package.json` 和锁文件安装依赖、启动和渲染。`video-catalog`、`remotion-photo-replica`、`remotion-shot-grades` 保持同级目录，恢复后它们之间的相对引用仍有效。

## 历史和完整性

- 文件记录共 **12,603** 条，含源码、文档、素材、预览与镜头复刻 SOP。
- 去重媒体共 **1032** 个对象（其中 **304** 个视频），约 **1026.8 MiB**，恢复为原来的 **1987** 个素材路径。
- [manifest.json](manifest.json) 保存各文件的原相对路径、大小、SHA-256、存储位置及源码分支与提交。
- 归档附件中的四份 Git bundle 备份保存本地 Git 分支和标签历史；较大 bundle 按 48 MiB 分片保存；`SHA256SUMS` 提供所有附件的 SHA-256。

恢复某个工程的提交历史，例如：

```bash
gh release download local-remotion-archive-2026-10-26 --repo Hi-Yxzz/Video-Shot-Library --pattern 'Video-Shot-Library-history.bundle.part-*'
cat Video-Shot-Library-history.bundle.part-* > Video-Shot-Library-history.bundle
git clone Video-Shot-Library-history.bundle library-history
```

Git bundle 保存已提交历史；本次未提交的改动保存在 `libraries/` 对应快照中。需要接着开发时，请以快照内容为准。

## 迁移范围

- 清理范围为桌面的三份镜头库、人物复刻工程、镜头分级目录、镜头索引目录，以及三个隐藏的镜头库工作副本。
- 已安装的 `~/.codex/skills/video-shotcraft` 保留安装，并已额外备份。
- 按用户选择，`视频产出`、`Documents/视频` 等完整成片工程不在迁移或清理范围内。
- `node_modules`、构建缓存、可重新生成的 `dist`、系统杂项和临时构建状态不归档。
- 此次敏感文件名和明显凭据扫描未发现需要上传的密钥文件；归档不包含 `.env` 或私钥。

## SOP

[Remotion 可编辑镜头库复刻 SOP](guides/Remotion镜头库复刻SOP.md)
