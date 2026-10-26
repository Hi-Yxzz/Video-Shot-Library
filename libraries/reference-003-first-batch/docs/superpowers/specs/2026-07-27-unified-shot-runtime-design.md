# 统一镜头运行接口设计

## 背景

当前镜头库同时收录 Video Shotcraft、Remocn 和 Remotion Bits。目录层已经统一了镜头 ID、中文标题、等级、标签、源码位置和预览信息，但 Remotion 代码仍需了解不同来源的组件注册方式与原始 Props。

本设计增加一个面向 Remotion 代码的统一 TypeScript 调用接口。调用者只使用稳定的镜头 ID，即可取得组件、构图配置、可调参数说明、默认值和源码信息。

## 目标

- 使用 `getShot(id)` 获取一个可直接渲染的镜头定义。
- 每个镜头同时支持通用参数和镜头专属参数。
- 保留原始源码和原始 Props，不批量改写上游镜头实现。
- 支持按等级、分类和标签查找镜头。
- 为未来上传 GitHub 和作为本地依赖使用提供稳定入口。

## 非目标

- 本阶段不提供 HTTP API。
- 不制作网页端参数编辑器。
- 不把 174 个组件重写成完全相同的 Props。
- 不将 Video Shotcraft 的 MP4 参考镜头伪装成可执行 React 组件。
- 不发布 npm 包；先在仓库内形成可独立导出的模块边界。

## 方案

采用统一适配器注册表。

注册表中的每条记录负责把统一参数转换为真实组件 Props。原始组件保持不变，因此后续同步 Remocn 或 Remotion Bits 时，冲突范围只集中在对应适配器。

```ts
const shot = getShot("remocn/hand-count");

const props = shot.createProps({
  text: "年度增长",
  primaryColor: "#ff5a1f",
  custom: {
    start: 10,
    end: 98,
  },
});
const composition = shot.createComposition({
  durationInFrames: 120,
});

return <shot.Component {...props} />;
```

## 模块边界

### `shot-runtime/types.ts`

定义公开类型，不依赖具体镜头实现：

- `ShotId`
- `ShotDefinition`
- `ShotComposition`
- `ShotMetadata`
- `ShotControl`
- `ShotOverrides`
- `ShotFilter`
- `ExecutableShotDefinition`
- `ReferenceShotDefinition`

### `shot-runtime/catalog.ts`

读取构建后的统一目录数据，提供所有镜头共有的元数据：

- ID、中文标题、说明
- 分类、等级、标签、来源
- 源码文件
- 预览类型和预览地址

目录数据是元数据的唯一来源，运行接口不复制中文标题和标签。

### `shot-runtime/adapters/`

按来源保存适配器：

- `remocn.ts`
- `remotion-bits.ts`

每个适配器提供：

- 真实 React 组件
- 原始默认 Props
- Composition 配置
- 通用参数到真实 Props 的转换
- 镜头专属参数定义

适配器可以共享来源级默认值，只有参数结构特殊的镜头需要单独覆盖。

### `shot-runtime/registry.ts`

合并目录元数据与适配器，验证：

- 可执行镜头是否存在组件
- Composition ID 是否唯一
- 默认参数是否符合控件定义
- 源码文件是否存在
- 参考镜头不会被标记为可执行

### `shot-runtime/index.ts`

作为唯一公开入口导出：

```ts
getShot(id)
hasShot(id)
listShots(filters?)
searchShots(keyword, filters?)
getShotControls(id)
```

调用方不应直接依赖内部适配器文件。

## 公开数据结构

```ts
type ShotDefinition =
  | {
      kind: "executable";
      id: string;
      metadata: ShotMetadata;
      Component: React.ComponentType<Record<string, unknown>>;
      composition: ShotComposition;
      defaults: ShotOverrides;
      controls: ShotControl[];
      createProps(overrides?: ShotOverrides): Record<string, unknown>;
      createComposition(overrides?: ShotOverrides): ShotComposition;
      sourceFiles: string[];
    }
  | {
      kind: "reference";
      id: string;
      metadata: ShotMetadata;
      previewUrl: string | null;
      sourceFiles: string[];
    };
```

`kind` 是判别字段。TypeScript 调用方必须先确认 `kind === "executable"`，才能访问 `Component`、`createProps` 和 `createComposition`。

## 参数模型

### 通用参数

所有适配器接受同一种覆盖结构：

```ts
type ShotOverrides = {
  text?: string;
  secondaryText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  durationInFrames?: number;
  custom?: Record<string, unknown>;
};
```

通用参数只在镜头声明支持时生效。支持情况通过 `controls` 暴露，调用不支持的通用参数会抛出明确错误，不会静默忽略。

### 镜头专属参数

`custom` 保留真实组件的特殊能力。对应 `controls` 使用命名空间为 `custom.<name>` 的控制项描述类型、默认值和范围。

首版控件类型限制为：

- `text`
- `number`
- `color`
- `boolean`
- `select`

这足以覆盖文字、颜色、时长、数值范围、开关和枚举选择，不引入复杂嵌套表单协议。

### 参数合并顺序

```text
原始组件默认值
→ 来源级统一默认值
→ 通用参数转换结果
→ custom 专属参数
```

后面的值覆盖前面的值。`custom` 仍需经过适配器白名单，不允许传入未声明字段。

## Composition 配置

每个可执行镜头返回：

- `id`
- `width`
- `height`
- `fps`
- `durationInFrames`
- 可选的 `defaultProps`

`durationInFrames` 通过 `createComposition` 覆盖并且必须为正整数，不会混入组件 Props。组件内部依赖固定时长且无法安全覆盖时，控件中不声明时长参数。

## 查询行为

### `getShot(id)`

- 找到镜头时返回判别联合类型。
- ID 不存在时抛出 `ShotNotFoundError`。
- 错误中包含最接近的 ID 建议。

### `hasShot(id)`

只返回布尔值，不抛出不存在错误。

### `listShots(filters)`

支持：

- `kind`
- `grade`
- `category`
- `tags`

多标签采用任意命中，与网站筛选保持一致。结果按目录顺序稳定返回。

### `searchShots(keyword, filters)`

搜索 ID、中文标题、说明、用途和标签，再应用过滤条件。

### `getShotControls(id)`

可执行镜头返回控件定义；参考镜头返回空数组。

## 错误处理

公开错误类型：

- `ShotNotFoundError`
- `ShotNotExecutableError`
- `UnsupportedShotParameterError`
- `InvalidShotParameterError`
- `ShotRegistryError`

开发阶段注册表校验失败时立即抛错，避免错误延迟到渲染期间。

## 数据生成与维护

运行时注册表由现有目录与两个 Player manifest 生成，避免手工维护 174 个重复 ID。

生成流程：

1. 构建统一目录。
2. 读取 Remocn 与 Remotion Bits manifest。
3. 生成来源级组件导入表。
4. 合并默认适配器和少量镜头覆盖。
5. 校验目录、manifest 和组件导入一一对应。

新增镜头时，如果它使用来源级默认适配器，只需重新生成；参数特殊时再补一条覆盖。

## 使用方式

仓库内部统一从以下入口导入：

```ts
import {
  getShot,
  listShots,
  searchShots,
  type ShotOverrides,
} from "./shot-runtime";
```

未来作为 GitHub 依赖或 npm 包使用时，只需把这个目录设为 package export，不改变调用语法。

## 测试

### 数据一致性

- 174 个可执行镜头全部存在适配器。
- 102 个 Video Shotcraft 参考镜头全部保持 `kind: "reference"`。
- ID、标题、等级、标签和源码路径与统一目录一致。

### 参数行为

- 通用参数能覆盖声明支持的默认值。
- `custom` 只能覆盖白名单字段。
- 非法颜色、负时长、越界数字和未知字段返回对应错误。
- 合并顺序固定且可预测。

### 查询行为

- `getShot`、`hasShot`、筛选、搜索和控件查询覆盖成功与失败路径。
- 多标签采用任意命中。
- 不存在 ID 返回相近建议。

### 构建验证

- TypeScript 类型检查通过。
- 两个 Player 构建继续通过。
- 网站构建与原有目录测试继续通过。

## 验收标准

- Remotion 代码只凭稳定镜头 ID 即可取得可执行组件和可调数据。
- 调用者无需判断镜头来自 Remocn 还是 Remotion Bits。
- 通用参数和专属参数都有明确类型、默认值、范围与错误反馈。
- 上游镜头源码保持原样，适配逻辑集中维护。
- 参考镜头无法被误当作 React 组件调用。
