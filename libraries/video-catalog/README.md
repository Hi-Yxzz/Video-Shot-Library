# A-roll / B-roll 视频目录

本目录只保存索引，不移动视频项目或素材。

## 分类

- `A-roll/entries.json`：人物主镜头，每个视频或 Composition 一条记录。
- `B-roll/sources.json`：辅助镜头来源，现有镜头库通过外部 manifest 引用。

`A-roll` / `B-roll` 表示镜头用途，与原镜头库的 S/A/B/C 质量等级相互独立。

## 新增 A-roll

1. 复制现有 A-roll 项目或新增 Composition。
2. 完成测试、预览图和 MP4 导出。
3. 在 `A-roll/entries.json` 增加唯一 `id`。
4. 填写相对项目路径、Composition、成品路径和分组标签。
5. 运行 `node --test test/catalog.test.mjs`。

## 标签分组

- `subject`：人物类型和素材形态
- `framing`：景别与机位
- `motion`：人物、镜头与元素运动
- `elements`：画面主要元素
- `format`：比例、帧率和声音状态

新条目优先复用这些分组，只增加具体标签值。

## 验证

```bash
node --test test/catalog.test.mjs
```
