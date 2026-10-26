# A-roll / B-roll 视频目录设计

## 目标

建立一个轻量、可扩展的视频目录，用统一元数据管理 A-roll 和 B-roll。第一阶段只提供目录与 JSON 标签系统，不制作可视化管理页面，不移动现有项目或素材。

## 分类定义

- `A-roll`：人物出镜、口播、头像、数字人及以人物为主视觉的镜头。
- `B-roll`：数据图、解释动画、UI 演示、转场、辅助画面和其他补充镜头。

`A-roll` / `B-roll` 是镜头用途分类，与现有 S/A/B/C 质量等级相互独立。

## 目录结构

```text
video-catalog/
├── catalog.json
├── README.md
├── A-roll/
│   └── entries.json
├── B-roll/
│   └── sources.json
└── docs/
    └── superpowers/
        ├── specs/
        └── plans/
```

## 根索引

`catalog.json` 保存 schema 版本、分类入口和更新时间：

```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-07-28",
  "categories": [
    {"id": "A-roll", "manifest": "A-roll/entries.json"},
    {"id": "B-roll", "manifest": "B-roll/sources.json"}
  ]
}
```

## A-roll 条目

`A-roll/entries.json` 中每个独立视频或可复用 Composition 对应一条记录：

```json
{
  "id": "a-roll-001-photo-looping-cards",
  "title": "静态人物＋双层循环卡片",
  "rollType": "A-roll",
  "status": "ready",
  "projectPath": "../remotion-photo-replica",
  "compositionId": "PhotoReplica",
  "previewPath": "../remotion-photo-replica/out/check-115.png",
  "outputPath": "../remotion-photo-replica/out/photo-shot-replica.mp4",
  "durationInFrames": 230,
  "fps": 30,
  "width": 1280,
  "height": 720,
  "tags": {
    "subject": ["单人", "静态照片", "口罩"],
    "framing": ["近景", "固定机位"],
    "motion": ["轻推镜", "呼吸视差", "循环卡片"],
    "elements": ["AI公司卡片", "双层元素轨道"],
    "format": ["16:9", "30fps", "无声"]
  }
}
```

字段规则：

- `id` 在整个目录内唯一，采用小写短横线格式。
- `projectPath`、`previewPath`、`outputPath` 均相对于 `video-catalog/`。
- `status` 第一阶段允许 `draft`、`ready`、`archived`。
- `tags` 按稳定维度分组，不把所有标签塞入一个无结构数组。
- 新视频允许增加标签值，但不随意增加新的标签分组。

## B-roll 来源

`B-roll/sources.json` 不复制数百条既有记录，只引用现有清单：

```json
{
  "rollType": "B-roll",
  "sources": [
    {
      "id": "remotion-shot-grades",
      "manifestPath": "../remotion-shot-grades/shots.json",
      "format": "json-array",
      "idField": "id",
      "titleField": "name",
      "tagFields": ["category", "grade", "family", "source"]
    }
  ]
}
```

目录读取方将来源中的每条记录视为 `B-roll`，并把 `category`、`grade`、`family`、`source` 转换为可筛选标签。现有 `shots.json` 保持不变。

## 当前 A-roll 项目收尾

1. 将 `feature/photo-replica` 合并到 `remotion-photo-replica` 的 `main`。
2. 在合并后的 `main` 上重新运行测试、类型检查和 Composition 检查。
3. 将已验证的预览图和无声 MP4 复制到主项目 `out/`。
4. 用 `ffprobe` 验证输出仅含一个 1280×720、30fps、约 7.67 秒的 H.264 视频流。
5. 删除已合并的功能分支和全局工作树。

## 验证

- 所有 JSON 文件可被 `JSON.parse()` 读取。
- A-roll 的 `id` 唯一且 `rollType` 固定为 `A-roll`。
- 所有项目、预览、成品和 B-roll manifest 相对路径均存在。
- B-roll 来源文件保持未修改。
- 当前 A-roll 项目在 `main` 上测试、类型检查和 ESLint 通过。
- 最终 MP4 不包含音频流。

## 非目标

- 不制作 Web 管理页面、搜索 UI 或数据库。
- 不移动、重命名或复制既有 B-roll 项目。
- 不批量改写 `remotion-shot-grades/shots.json`。
- 不上传远程仓库，不创建 Pull Request。
