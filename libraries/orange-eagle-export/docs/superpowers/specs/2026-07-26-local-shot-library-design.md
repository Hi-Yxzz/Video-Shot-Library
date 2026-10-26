# video-shotcraft 本地镜头库设计

## 目标

把 `video-shotcraft` 的 104 个镜头配方、161 个样式预览和 Remotion Demo 组织成一个中文优先的本地镜头库网站，并通过 Sites 发布为默认私有的可分享站点。

第一版不复制 161 个 MP4 到本地。镜头数据、Markdown 配方与 TSX 示例保存在本地，预览视频从原项目的公开 GitHub Pages 媒体地址按需加载。

## 产品范围

### 包含

- 镜头总览、分类筛选和关键词搜索
- 104 张镜头卡与 161 个样式预览
- 同一镜头的多样式切换
- MP4 懒加载、循环播放和全屏预览
- 中文镜头说明、用途、时长、节奏与分类
- Markdown 镜头配方入口
- Remotion TSX 实现状态与本地代码路径
- 复制镜头 ID
- 桌面端和移动端适配
- 原项目、Apache 2.0 许可证与素材授权说明

### 不包含

- 在线编辑或执行 TSX
- 在线 Remotion 渲染
- 用户登录、收藏同步或数据库
- 本地上传镜头
- 将全部 MP4 打包进部署产物

## 页面与交互

站点采用单页镜头市场布局：

1. 顶部区域展示项目名称、镜头数量、样式数量和搜索框。
2. 左侧或移动端横向分类栏提供十个镜头分类。
3. 主区域使用响应式卡片网格。卡片展示预览、中文名称、英文 ID、分类和样式数量。
4. 点击卡片打开详情抽屉或详情层，不跳转到复杂的多路由页面。
5. 详情中提供样式切换、视频预览、镜头说明、配方信息、实现状态和复制 ID。
6. 视频仅在进入视口或用户打开详情时加载；滚出视口后暂停，避免大量视频同时解码。

视觉方向沿用参考图库的专业工具感，但改为中文优先的深色“镜头工作台”：近黑背景、暖橙强调色、大面积视频画面、紧凑而清晰的信息层级。

## 架构

站点使用 Sites 初始化的 vinext/Vite 结构，不修改上游镜头配方和 Demo 文件。新增的站点代码只负责读取生成后的静态镜头清单并渲染界面。

主要模块：

- `scripts/build-library-data.mjs`：把公开 `library.json` 与本地文件索引合并为站点数据。
- `app/page.tsx`：镜头库页面、筛选状态、详情层和视频交互。
- `app/globals.css`：布局、视觉系统和响应式样式。
- `public/data/library.json`：构建时生成的静态镜头数据。
- `tests/library-data.test.mjs`：验证数据合并、分类、媒体 URL 和实现状态。

## 数据模型

站点使用统一的镜头记录：

```ts
type ShotCard = {
  id: string;
  title: string;
  summary: string;
  use: string;
  duration: string;
  energy: string;
  category: string;
  recipePath: string;
  recipeUrl: string;
  demoFiles: string[];
  styles: Array<{
    id: string;
    title: string;
    description: string;
    previewUrl: string | null;
    implementationStatus: "implemented" | "reference-only";
  }>;
};
```

公开数据源固定为原项目 GitHub Pages 的 `api/library.json`。构建脚本把相对媒体地址转换成绝对 HTTPS 地址，并根据本地 `demos/<category>/<shot-id>/` 目录补充 TSX 文件列表。

## 数据流

```text
公开 library.json
        +
本地 references/shots/**/*.md
        +
本地 demos/**/*.tsx
        ↓
构建数据脚本
        ↓
public/data/library.json
        ↓
镜头库页面筛选、预览与详情展示
```

运行时站点只读取自己的静态 JSON。除加载公开 MP4 外，不依赖后端接口。

## 错误处理

- 数据生成时缺少镜头 ID、分类或样式数组：构建失败并显示具体记录。
- 本地不存在对应配方：保留镜头卡，但标记“配方未同步”。
- 本地不存在 TSX：标记为“配方参考”，不伪装成可直接调用的组件。
- 视频加载失败：显示可读的预览失败状态，不影响配方和源码信息。
- 搜索无结果：显示清空筛选入口。
- 浏览器启用减少动态效果时：关闭自动播放和非必要过渡动画。

## 测试与验收

数据测试必须覆盖：

- 104 张镜头卡和 161 个样式
- 媒体相对路径转换为绝对 HTTPS URL
- 本地配方存在性映射
- TSX Demo 文件映射
- `reference-only` 状态不被错误标记为已实现

最终验收：

- 测试全部通过
- 生产构建成功
- 分类、搜索、样式切换、复制 ID 和详情层可用
- 不将 MP4 打包进部署产物
- 许可证和来源说明可见
- Sites 私有部署成功并返回可访问网址

