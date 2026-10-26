# Unified Shot Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one TypeScript entry point that returns editable Remotion shot data and executable components by stable shot ID.

**Architecture:** A pure runtime core handles controls, override validation, filtering, and errors. A React adapter layer reuses the two existing generated scene maps, while the registry joins those executable scenes to the canonical `public/data/library.json` metadata and keeps Video Shotcraft-only entries as references.

**Tech Stack:** TypeScript 5.9, React 19, Remotion 4, Node test runner, Vite/vinext

---

## File structure

- `shot-runtime/types.ts`: public types and discriminated shot definitions.
- `shot-runtime/errors.ts`: public typed errors.
- `shot-runtime/core.ts`: pure parameter validation, mapping, filtering, and search.
- `shot-runtime/adapters/remocn.ts`: converts generated Remocn scenes/config controls to adapters.
- `shot-runtime/adapters/remotion-bits.ts`: converts generated Remotion Bits scenes to adapters.
- `shot-runtime/registry.ts`: joins canonical catalog cards with executable adapters.
- `shot-runtime/index.ts`: the only public import surface.
- `shot-runtime/README.md`: copy-pastable Remotion usage.
- `tests/shot-runtime-core.test.mjs`: pure parameter and query tests.
- `tests/shot-runtime-registry.test.mjs`: source/manifest coverage tests.
- `scripts/player-manifests.mjs`: retain Remocn control metadata in generated scenes.
- `players/remocn/src/scenes.generated.ts`: regenerated Remocn scene definitions.
- `package.json`: expose the runtime and include its tests.
- `tsconfig.json`: include runtime TypeScript files.

### Task 1: Public types and typed errors

**Files:**
- Create: `shot-runtime/types.ts`
- Create: `shot-runtime/errors.ts`
- Create: `tests/shot-runtime-core.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing error tests**

Create `tests/shot-runtime-core.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import {
  InvalidShotParameterError,
  ShotNotExecutableError,
  ShotNotFoundError,
  ShotRegistryError,
  UnsupportedShotParameterError,
} from "../shot-runtime/errors.ts";

test("runtime errors expose stable names and context", () => {
  assert.equal(new ShotNotFoundError("missing").name, "ShotNotFoundError");
  assert.equal(
    new ShotNotExecutableError("reference-only").shotId,
    "reference-only",
  );
  assert.equal(
    new UnsupportedShotParameterError("shot", "text").parameter,
    "text",
  );
  assert.equal(
    new InvalidShotParameterError("shot", "durationInFrames", -1).shotId,
    "shot",
  );
  assert.equal(new ShotRegistryError("broken").name, "ShotRegistryError");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/shot-runtime-core.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `shot-runtime/errors.ts`.

- [ ] **Step 3: Define the public types**

Create `shot-runtime/types.ts` with:

```ts
import type { ComponentType } from "react";

export type ShotGrade = "S" | "A" | "B" | null;
export type ShotKind = "executable" | "reference";

export type ShotMetadata = {
  title: string;
  summary: string;
  use: string;
  category: string;
  collection: string;
  grade: ShotGrade;
  tags: string[];
};

export type ShotComposition = {
  id: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

type ControlBase = {
  key: string;
  label: string;
  defaultValue: unknown;
};

export type ShotControl =
  | (ControlBase & { type: "text"; defaultValue: string })
  | (ControlBase & {
      type: "number";
      defaultValue: number;
      min?: number;
      max?: number;
      step?: number;
    })
  | (ControlBase & { type: "color"; defaultValue: string })
  | (ControlBase & { type: "boolean"; defaultValue: boolean })
  | (ControlBase & {
      type: "select";
      defaultValue: string;
      options: string[];
    });

export type ShotOverrides = {
  text?: string;
  secondaryText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  durationInFrames?: number;
  custom?: Record<string, unknown>;
};

export type ShotFilter = {
  kind?: ShotKind;
  grade?: Exclude<ShotGrade, null>;
  category?: string;
  tags?: readonly string[];
};

export type ReferenceShotDefinition = {
  kind: "reference";
  id: string;
  metadata: ShotMetadata;
  previewUrl: string | null;
  sourceFiles: string[];
};

export type ExecutableShotDefinition = {
  kind: "executable";
  id: string;
  metadata: ShotMetadata;
  Component: ComponentType<Record<string, unknown>>;
  composition: ShotComposition;
  defaults: ShotOverrides;
  controls: ShotControl[];
  createProps(overrides?: ShotOverrides): Record<string, unknown>;
  createComposition(overrides?: ShotOverrides): ShotComposition;
  sourceFiles: string[];
};

export type ShotDefinition =
  | ExecutableShotDefinition
  | ReferenceShotDefinition;
```

- [ ] **Step 4: Implement typed errors**

Create `shot-runtime/errors.ts` with exported classes that set `name` and retain `shotId`, `parameter`, and `value` where applicable:

```ts
export class ShotNotFoundError extends Error {
  readonly shotId: string;
  readonly suggestions: string[];

  constructor(shotId: string, suggestions: string[] = []) {
    super(
      suggestions.length > 0
        ? `Unknown shot "${shotId}". Did you mean: ${suggestions.join(", ")}?`
        : `Unknown shot "${shotId}".`,
    );
    this.name = "ShotNotFoundError";
    this.shotId = shotId;
    this.suggestions = suggestions;
  }
}
```

Implement the other four classes with equally explicit messages:

- `ShotNotExecutableError(shotId)`
- `UnsupportedShotParameterError(shotId, parameter)`
- `InvalidShotParameterError(shotId, parameter, value)`
- `ShotRegistryError(message)`

- [ ] **Step 5: Add the test to the data test script and verify**

Modify `package.json` so `test:data` includes `tests/shot-runtime-core.test.mjs`.

Run:

```bash
npm run test:data
```

Expected: all tests pass, including `runtime errors expose stable names and context`.

- [ ] **Step 6: Commit**

```bash
git add package.json shot-runtime/types.ts shot-runtime/errors.ts tests/shot-runtime-core.test.mjs
git commit -m "feat: define unified shot runtime types"
```

### Task 2: Pure controls, overrides, filtering, and search

**Files:**
- Create: `shot-runtime/core.ts`
- Modify: `tests/shot-runtime-core.test.mjs`

- [ ] **Step 1: Write failing control and query tests**

Append tests covering:

```js
import {
  createComposition,
  createProps,
  filterShots,
  searchShotDefinitions,
} from "../shot-runtime/core.ts";

const controls = [
  {
    key: "custom.to",
    type: "number",
    label: "Count to",
    defaultValue: 100,
    min: 0,
    max: 1000,
  },
  {
    key: "primaryColor",
    type: "color",
    label: "Color",
    defaultValue: "#ffffff",
  },
];

test("createProps merges supported common and custom overrides", () => {
  assert.deepEqual(
    createProps(
      "remocn/hand-count",
      { to: 100, color: "#ffffff" },
      controls,
      { primaryColor: "color" },
      { primaryColor: "#ff5a1f", custom: { to: 250 } },
    ),
    { to: 250, color: "#ff5a1f" },
  );
});

test("createProps rejects unsupported and invalid values", () => {
  assert.throws(
    () => createProps("shot", {}, [], {}, { text: "x" }),
    /does not support parameter "text"/,
  );
  assert.throws(
    () => createProps("shot", {}, controls, {}, { custom: { to: -1 } }),
    /invalid value/,
  );
  assert.throws(
    () => createProps("shot", {}, controls, {}, { custom: { ghost: 1 } }),
    /does not support parameter "custom.ghost"/,
  );
});

test("createComposition validates duration overrides", () => {
  const base = {
    id: "shot",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 90,
  };
  assert.equal(
    createComposition("shot", base, { durationInFrames: 120 })
      .durationInFrames,
    120,
  );
  assert.throws(
    () => createComposition("shot", base, { durationInFrames: 0 }),
    /invalid value/,
  );
});
```

Add fixtures for one executable and one reference definition, then verify category/grade/tag OR filtering and Chinese tag search.

- [ ] **Step 2: Run the focused tests to verify they fail**

```bash
node --test tests/shot-runtime-core.test.mjs
```

Expected: FAIL because `shot-runtime/core.ts` does not exist.

- [ ] **Step 3: Implement pure runtime functions**

Create `shot-runtime/core.ts` exporting:

```ts
export function createProps(
  shotId: string,
  defaults: Record<string, unknown>,
  controls: readonly ShotControl[],
  commonMappings: Readonly<Record<string, string>>,
  overrides: ShotOverrides = {},
): Record<string, unknown>;

export function createComposition(
  shotId: string,
  base: ShotComposition,
  overrides: ShotOverrides = {},
): ShotComposition;

export function filterShots(
  shots: readonly ShotDefinition[],
  filters?: ShotFilter,
): ShotDefinition[];

export function searchShotDefinitions(
  shots: readonly ShotDefinition[],
  keyword: string,
  filters?: ShotFilter,
): ShotDefinition[];

export function suggestShotIds(
  shotId: string,
  ids: readonly string[],
  limit?: number,
): string[];
```

Validation rules:

- text/select values must be strings;
- colors must match `#rgb`, `#rgba`, `#rrggbb`, or `#rrggbbaa`;
- boolean values must be booleans;
- numbers must be finite and obey `min`/`max`;
- `durationInFrames` must be a positive integer;
- undeclared common or custom parameters throw `UnsupportedShotParameterError`;
- `durationInFrames` is handled only by `createComposition`;
- tag filters use OR matching.

Use a small Levenshtein helper inside `core.ts` for ID suggestions; do not add a dependency.

- [ ] **Step 4: Run focused tests**

```bash
node --test tests/shot-runtime-core.test.mjs
```

Expected: all runtime core tests pass.

- [ ] **Step 5: Commit**

```bash
git add shot-runtime/core.ts tests/shot-runtime-core.test.mjs
git commit -m "feat: add shot parameter and query core"
```

### Task 3: Preserve source controls in generated Remocn scenes

**Files:**
- Modify: `scripts/player-manifests.mjs`
- Modify: `players/remocn/src/scenes.generated.ts`
- Modify: `tests/player-manifest.test.mjs`

- [ ] **Step 1: Write a failing generator assertion**

Add a test that calls the exported Remocn source generator and asserts the generated source includes:

```js
assert.match(source, /controls: config\?\.controls \?\? \{\}/);
assert.match(source, /inputProps/);
```

If `remocnImports` is private, rename/export it as `createRemocnScenesSource`.

- [ ] **Step 2: Run the focused test**

```bash
node --test tests/player-manifest.test.mjs
```

Expected: FAIL because generated scene records omit the full `controls` object.

- [ ] **Step 3: Extend the generated scene structure**

In the generated `scene()` return value, retain:

```ts
controls: config?.controls ?? {},
inputProps,
```

Extend `SceneConfig.controls` to include:

```ts
type SceneControl = {
  type: "text" | "number" | "color" | "boolean" | "select";
  default?: unknown;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly (string | number)[];
};
```

- [ ] **Step 4: Regenerate and verify manifests**

```bash
npm run players:manifest
node --test tests/player-manifest.test.mjs
```

Expected: manifest tests pass and all 138 Remocn scene records expose controls.

- [ ] **Step 5: Commit**

```bash
git add scripts/player-manifests.mjs players/remocn/src/scenes.generated.ts tests/player-manifest.test.mjs
git commit -m "feat: expose generated Remocn shot controls"
```

### Task 4: Source adapters and registry coverage

**Files:**
- Create: `shot-runtime/adapters/shared.ts`
- Create: `shot-runtime/adapters/remocn.ts`
- Create: `shot-runtime/adapters/remotion-bits.ts`
- Create: `tests/shot-runtime-registry.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing registry coverage tests**

Create `tests/shot-runtime-registry.test.mjs` that reads:

- `public/data/library.json`
- `players/remocn/src/manifest.json`
- `players/remotion-bits/src/manifest.json`
- the adapter source files

Assert:

```js
assert.equal(executableCards.length, 174);
assert.equal(referenceCards.length, 102);
assert.equal(Object.keys(remocnManifest).length, 138);
assert.equal(Object.keys(bitsManifest).length, 36);
```

Also assert adapter source imports `remocnScenes` and `bitScenes`, and uses namespaced IDs `remocn/`, `remocn-ui/`, and `remotion-bits/`.

- [ ] **Step 2: Run to verify failure**

```bash
node --test tests/shot-runtime-registry.test.mjs
```

Expected: FAIL because adapter files do not exist.

- [ ] **Step 3: Define the internal adapter type and control conversion**

In `shot-runtime/adapters/shared.ts`, define:

```ts
export type ShotAdapter = {
  Component: ComponentType<Record<string, unknown>>;
  composition: ShotComposition;
  inputProps: Record<string, unknown>;
  controls: ShotControl[];
  commonMappings: Record<string, string>;
};
```

Add `controlsFromConfig()` to convert Remocn control objects to public controls under `custom.<key>`. Add common mappings only when matching keys exist:

```ts
const candidates = {
  text: ["text", "title", "label"],
  secondaryText: ["secondaryText", "subtitle", "description"],
  primaryColor: ["color", "primaryColor", "accentColor"],
  secondaryColor: ["secondaryColor", "cursorColor"],
  backgroundColor: ["backgroundColor", "background", "bgColor"],
};
```

- [ ] **Step 4: Implement Remocn adapters**

Map `remocnScenes` to namespaced IDs. Determine whether the namespace is `remocn-ui/` or `remocn/` from the canonical graded catalog collection, not from title text.

Each adapter uses generated `inputProps`, `controls`, dimensions, FPS, duration, and Component.

- [ ] **Step 5: Implement Remotion Bits adapters**

Map `bitScenes` to `remotion-bits/<id>`. These examples expose hard-coded components, so the initial adapter controls only composition duration; `inputProps`, control list, and common mappings are empty.

- [ ] **Step 6: Add coverage tests to package script and verify builds**

Add `tests/shot-runtime-registry.test.mjs` to `test:data`.

Run:

```bash
npm run test:data
npm run players:build
```

Expected: all data tests pass and both Player builds complete.

- [ ] **Step 7: Commit**

```bash
git add package.json shot-runtime/adapters tests/shot-runtime-registry.test.mjs
git commit -m "feat: adapt Remocn and Remotion Bits scenes"
```

### Task 5: Build the registry and public API

**Files:**
- Create: `shot-runtime/registry.ts`
- Create: `shot-runtime/index.ts`
- Modify: `tsconfig.json`
- Modify: `package.json`
- Modify: `tests/shot-runtime-core.test.mjs`
- Modify: `tests/shot-runtime-registry.test.mjs`

- [ ] **Step 1: Write failing public-source and behavior assertions**

Add source assertions requiring these exports:

```ts
getShot
hasShot
listShots
searchShots
getShotControls
```

Add pure registry-construction tests by exporting `createShotRegistry(cards, adapters)` and injecting fake components. Verify:

- executable definitions get Component, controls, composition, and factories;
- reference definitions get preview URL and no Component;
- missing executable adapters throw `ShotRegistryError`;
- duplicate or unknown adapter IDs throw `ShotRegistryError`;
- `getShot` suggestions include a near ID.

- [ ] **Step 2: Run tests to verify failure**

```bash
node --test tests/shot-runtime-core.test.mjs tests/shot-runtime-registry.test.mjs
```

Expected: FAIL because registry and public entry do not exist.

- [ ] **Step 3: Implement registry construction**

`createShotRegistry()` must join cards and adapters by exact ID. For each executable definition:

```ts
createProps: (overrides) =>
  createProps(card.id, adapter.inputProps, adapter.controls,
    adapter.commonMappings, overrides),
createComposition: (overrides) =>
  createComposition(card.id, adapter.composition, overrides),
```

Reference definitions use the first style preview URL or `null`.

Validate exact adapter coverage before returning a `Map<string, ShotDefinition>`.

- [ ] **Step 4: Implement the public API**

`shot-runtime/index.ts` creates the production registry from the canonical catalog and source adapters, then exports:

```ts
export function getShot(id: string): ShotDefinition;
export function hasShot(id: string): boolean;
export function listShots(filters?: ShotFilter): ShotDefinition[];
export function searchShots(
  keyword: string,
  filters?: ShotFilter,
): ShotDefinition[];
export function getShotControls(id: string): ShotControl[];
```

`getShotControls()` returns an empty array for reference entries. Re-export public types and errors.

- [ ] **Step 5: Expose the package entry and include runtime in type checking**

Modify `package.json`:

```json
"exports": {
  "./shot-runtime": "./shot-runtime/index.ts"
}
```

Add `"shot-runtime/**/*.ts"` to `tsconfig.json` includes.

- [ ] **Step 6: Verify focused tests and type checking**

```bash
npm run test:data
npm run typecheck
```

Expected: tests pass and TypeScript reports no runtime type errors. If upstream source types introduce unrelated errors, use a focused `shot-runtime/tsconfig.json` with the same strict settings and run it from a new `runtime:typecheck` script; do not disable strictness.

- [ ] **Step 7: Commit**

```bash
git add package.json tsconfig.json shot-runtime/registry.ts shot-runtime/index.ts tests/shot-runtime-core.test.mjs tests/shot-runtime-registry.test.mjs
git commit -m "feat: add unified shot runtime API"
```

### Task 6: Usage documentation and full verification

**Files:**
- Create: `shot-runtime/README.md`
- Modify: `README_CN.md`
- Modify: `docs/superpowers/specs/2026-07-27-unified-shot-runtime-design.md`

- [ ] **Step 1: Write copy-pastable usage**

Document:

```tsx
import { getShot } from "video-shotcraft-local-library/shot-runtime";

const shot = getShot("remocn/hand-count");
if (shot.kind !== "executable") {
  throw new Error("该镜头只有参考预览");
}

const inputProps = shot.createProps({
  primaryColor: "#ff5a1f",
  custom: { from: 0, to: 2026 },
});
const composition = shot.createComposition({
  durationInFrames: 120,
});

export const Scene = () => <shot.Component {...inputProps} />;
```

Also document `listShots`, `searchShots`, `controls`, unsupported parameters, and the limitation that Remotion Bits examples currently expose composition-level adjustment only.

- [ ] **Step 2: Link the runtime guide from the Chinese README**

Add a concise “统一 Remotion 调用接口” section linking to `shot-runtime/README.md`.

- [ ] **Step 3: Run documentation and source checks**

```bash
rg -n "getShot|createProps|createComposition|Remotion Bits" shot-runtime/README.md README_CN.md
git diff --check
```

Expected: documented APIs are present and no whitespace errors are reported.

- [ ] **Step 4: Run the full verification suite**

```bash
npm test
npm run typecheck
```

Expected: 54 existing tests plus new runtime tests pass, both Player builds and the site build complete, and TypeScript exits zero.

- [ ] **Step 5: Verify repository state and commit**

```bash
git status --short
git add README_CN.md shot-runtime/README.md docs/superpowers/specs/2026-07-27-unified-shot-runtime-design.md
git commit -m "docs: add unified shot runtime guide"
```

### Task 7: Integrate and publish

**Files:**
- No new source files; integration and deployment only.

- [ ] **Step 1: Use the branch-finishing workflow**

Verify the feature branch, fast-forward merge it into `main`, rerun `npm test` and `npm run typecheck` on the merged result, then remove the worktree and feature branch.

- [ ] **Step 2: Publish the exact merged source**

Use the existing Sites project from `.openai/hosting.json`. Push the exact deployable source commit, package the validated build, save a new version, and deploy it to the already approved shared production site.

- [ ] **Step 3: Verify the deployed catalog**

Confirm the production root returns HTTP 200 and `/data/library.json` still returns 276 cards with Chinese titles and tags. The runtime itself remains a source-code import and is not exposed as an HTTP endpoint.
