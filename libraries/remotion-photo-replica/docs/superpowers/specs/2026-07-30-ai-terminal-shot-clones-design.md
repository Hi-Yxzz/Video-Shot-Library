# “AI 对话·终端”镜头复刻设计

## 目标

将 `shots.xiaochens.com` 的“AI 对话·终端”分类中 8 个镜头复刻为本地可编辑 Remotion 组件，并加入现有镜头库。保持 1920×1080、30fps、约 6 秒、无声、悬停自动播放。

## 范围

| ID | 标题 | 结构 | 人物 |
| --- | --- | --- | --- |
| `code` | 代码窗 | 代码卡片 + 右侧人物 | 使用统一用户照片 |
| `terminal` | Claude Code 终端 | 深色终端打字 | 无 |
| `contextterminal` | 喂资料前后对照（终端） | 终端上下文切换 | 无 |
| `aiinput` | AI 输入页（可换 AI） | 深色 AI 输入框 | 无 |
| `claudecodeinput` | Claude Code 输入页 | 浅色 AI 输入框 | 无 |
| `inputpan` | 一镜摇过：聊天框→终端 | 横向摇镜切换 | 无 |
| `rc017` | RC 结构｜命令菜单状态机 | 命令菜单分阶段选择 | 无 |
| `rc021` | RC B 技法｜命令输入收束 | 输入、排序、结果收束 | 无 |

现有镜头库没有以上 ID，全部需要新增。

## 实现结构

新增独立的 `src/ai-terminal/` 模块：

- `catalog.ts`：8 个镜头的尺寸、时间轴、默认文字、颜色和标签。
- `types.ts`：可编辑参数类型与 Schema。
- `reference-layout.ts`：从参考帧测量得到的几何常量。
- `AITerminalScene.tsx`：按四类结构渲染，公共窗口、标题栏、光标和输入框复用。
- 对应测试：锁定目录完整性、画布参数、关键布局和时间阶段。

`src/Root.tsx` 只增加 8 个 Composition 注册，不调整已有 Composition。

## 复刻原则

- 同类镜头共享基础组件，但每个镜头保存独立布局和时间参数。
- 文字、终端窗口、输入框、光标、选中态、滚动和切换时间以参考视频同帧为准。
- 不接入 AI 接口，不在浏览器悬停时分析或生成内容。
- `code` 使用现有 `assets/portrait-landscape.png`；替换图片后动画保持不变。
- 不加入声音和参考文案之外的装饰元素。

## 镜头库接入

- 分类：`AI 对话·终端`。
- `code` 标记为 A-roll，其余标记为 B-roll。
- 预览 MP4 保存到 `public/media/xcyj-ai-terminal/`。
- 可编辑源码同步到 `library-sources/a-roll-remotion/src/ai-terminal/`。
- 维持现有鼠标进入播放、移出恢复的交互。

## 验证

- 每个镜头在 0.5s、1.5s、3s、5s 与参考视频生成同帧对照。
- 运行 Remotion 单元测试、类型检查和代码检查。
- 运行镜头库数据生成、测试和类型检查。
- 确认 8 个 MP4 均为 1920×1080、30fps、无音轨，且镜头库无重复 ID。
