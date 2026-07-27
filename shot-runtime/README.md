# Unified Shot Runtime

统一 Remotion 镜头调用接口。通过稳定的镜头 ID 获取可编辑的 Remotion 镜头数据和可执行组件。

## 快速开始

```tsx
import {
  getShot,
  listShots,
  searchShots,
  getShotControls,
  hasShot,
} from "video-shotcraft-local-library/shot-runtime";

// 通过 ID 获取镜头
const shot = getShot("remocn/hand-count");

if (shot.kind !== "executable") {
  throw new Error("该镜头只有参考预览");
}

// 修改颜色和镜头专属参数
const props = shot.createProps({
  primaryColor: "#ff5a1f",
  custom: {
    from: 0,
    to: 2026,
  },
});

// 修改时长
const composition = shot.createComposition({
  durationInFrames: 120,
});

// 渲染组件
export const Scene = () => <shot.Component {...props} />;
```

## API

### `getShot(id: string): ShotDefinition`

通过镜头 ID 获取镜头定义。如果 ID 不存在，抛出 `ShotNotFoundError`（附带相近 ID 建议）。

```tsx
const shot = getShot("remocn/hand-count");
// shot.kind === "executable" → 可渲染
// shot.kind === "reference" → 仅参考
```

### `hasShot(id: string): boolean`

检查镜头 ID 是否存在。

```tsx
if (hasShot("remocn/hand-count")) {
  const shot = getShot("remocn/hand-count");
}
```

### `listShots(filters?: ShotFilter): ShotDefinition[]`

列出所有镜头，可按条件筛选。

```tsx
// 所有镜头
const allShots = listShots();

// 只列出可执行镜头
const executable = listShots({ kind: "executable" });

// 只列出 S 级镜头
const topGrade = listShots({ grade: "S" });

// 按分类和标签筛选
const interactions = listShots({
  category: "interaction",
  tags: ["按钮", "弹窗"],
});
```

### `searchShots(keyword: string, filters?: ShotFilter): ShotDefinition[]`

按关键词搜索镜头（匹配 ID、标题、摘要、用途、标签），支持中文。

```tsx
// 搜索中文关键词
const results = searchShots("计数");

// 组合筛选
const topCounters = searchShots("数字", { grade: "S" });
```

### `getShotControls(id: string): ShotControl[]`

获取镜头的可编辑参数列表（参考镜头返回空数组）。

```tsx
const controls = getShotControls("remocn/hand-count");
// [{ key: "custom.to", type: "number", label: "Count to", defaultValue: 100, min: 0, max: 1000 }, ...]
```

## 参数调整

### 通用参数

所有可执行镜头支持以下通用参数（前提是镜头本身有对应的控件）：

| 参数 | 类型 | 说明 |
|---|---|---|
| `text` | `string` | 主文字 |
| `secondaryText` | `string` | 辅助文字 |
| `primaryColor` | `string` | 主色（`#rrggbb` / `#rrggbbaa`） |
| `secondaryColor` | `string` | 辅助色 |
| `backgroundColor` | `string` | 背景色 |
| `durationInFrames` | `number` | 时长（正整数，通过 `createComposition` 设置） |

### 镜头专属参数

每个镜头可能有专属参数，通过 `custom` 传入：

```tsx
const props = shot.createProps({
  custom: {
    from: 0,       // 专属数字参数
    to: 2026,      // 专属数字参数
    label: "营收", // 专属文字参数
  },
});
```

### 参数校验

- 颜色值必须匹配 `#rgb`、`#rgba`、`#rrggbb` 或 `#rrggbbaa`
- 数字值必须在 `min`/`max` 范围内
- 不支持的白名单外参数会抛出 `UnsupportedShotParameterError`
- 非法值抛出 `InvalidShotParameterError`

### 查看镜头支持的参数

```tsx
const controls = getShotControls("remocn/hand-count");

for (const control of controls) {
  console.log(control.key, control.type, control.defaultValue);
  if (control.type === "number") {
    console.log(`  范围: ${control.min} – ${control.max}`);
  }
  if (control.type === "select") {
    console.log(`  选项: ${control.options.join(", ")}`);
  }
}
```

## Composition 数据

`createComposition(overrides?)` 返回完整的 Composition 描述：

```tsx
const composition = shot.createComposition({
  durationInFrames: 120,
});

// {
//   id: "remocn/hand-count",
//   width: 1920,
//   height: 1080,
//   fps: 30,
//   durationInFrames: 120,
// }
```

## 在 Remotion Root 中注册

```tsx
import { AbsoluteFill, Composition } from "remotion";
import { getShot } from "video-shotcraft-local-library/shot-runtime";

const shot = getShot("remocn/hand-count");

if (shot.kind !== "executable") {
  throw new Error("该镜头只有参考预览");
}

const inputProps = shot.createProps({
  primaryColor: "#ff5a1f",
  custom: { from: 0, to: 2026 },
});
const composition = shot.createComposition({ durationInFrames: 120 });

export const RemotionRoot = () => (
  <>
    <Composition
      id={composition.id}
      component={shot.Component}
      durationInFrames={composition.durationInFrames}
      fps={composition.fps}
      width={composition.width}
      height={composition.height}
      defaultProps={inputProps}
    />
  </>
);
```

## 镜头库构成

| 来源 | 命名空间 | 数量 | 类型 |
|---|---|---|---|
| Remocn | `remocn/`、`remocn-ui/` | 138 | 可执行 |
| Remotion Bits | `remotion-bits/` | 36 | 可执行 |
| Video Shotcraft | 无前缀 | 102 | 参考 |

总计 276 个镜头：174 个可执行 + 102 个参考。

## Remocn 与 Remotion Bits 的参数能力差异

### Remocn（138 个）

- ✅ 完整的 `controls` 元数据（类型、默认值、范围、选项）
- ✅ `commonMappings` 自动映射通用参数到专属控件
- ✅ 专属参数完整可用

### Remotion Bits（36 个）

- ⚠️ 仅支持 **时长调整**（`createComposition`）
- ⚠️ `controls` 为空数组
- ⚠️ `commonMappings` 为空
- ⚠️ `createProps` 不接受任何参数覆盖

> Remotion Bits 示例代码是硬编码的，不暴露参数化接口。如需调整 Bits 镜头的外观，需要直接修改源码。

## 错误类型

| 错误 | 说明 |
|---|---|
| `ShotNotFoundError` | 镜头 ID 不存在，`.suggestions` 提供相近 ID |
| `ShotNotExecutableError` | 镜头是参考类型，无法渲染 |
| `UnsupportedShotParameterError` | 传入了镜头不支持的参数 |
| `InvalidShotParameterError` | 参数值非法（类型、范围、格式） |
| `ShotRegistryError` | 注册表构建失败（数据不一致） |

## 类型导出

所有公共类型从入口重新导出：

```tsx
import type {
  ShotDefinition,
  ExecutableShotDefinition,
  ReferenceShotDefinition,
  ShotMetadata,
  ShotComposition,
  ShotControl,
  ShotOverrides,
  ShotFilter,
  ShotGrade,
  ShotKind,
} from "video-shotcraft-local-library/shot-runtime";
```
