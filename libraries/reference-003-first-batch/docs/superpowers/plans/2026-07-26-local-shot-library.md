# Local Shot Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately publish a Chinese-first shot-library website for the local `video-shotcraft` recipes and Remotion demos, while loading the 161 public MP4 previews on demand.

**Architecture:** A Sites vinext/Vite application reads a generated static JSON catalog. A small Node data builder normalizes the upstream Gallery catalog, verifies local Markdown recipes, indexes local TSX demos, and converts preview paths to absolute HTTPS URLs; the React page handles filtering, style selection, lazy video playback, a detail dialog, and copy actions without a backend.

**Tech Stack:** TypeScript, React, vinext/Vite, Node.js `node:test`, CSS, Sites hosting.

---

## File map

- `scripts/build-library-data.mjs`: pure catalog normalization helpers plus the CLI that generates the site catalog.
- `tests/library-data.test.mjs`: data normalization and local-file mapping tests.
- `source/upstream-library.json`: pinned source snapshot from the public Gallery.
- `public/data/library.json`: generated runtime catalog.
- `app/page.tsx`: library state, filtering, cards, video previews, detail dialog, and clipboard behavior.
- `app/globals.css`: visual system, responsive layout, motion preferences, and accessible states.
- `app/layout.tsx`: finished metadata, title, description, and social metadata.
- `public/og.png`: generated social-preview card after visual direction is stable.
- `.openai/hosting.json`: opaque Sites project identifier created during publishing.

### Task 1: Initialize the Sites application

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `app/page.tsx`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `.openai/hosting.json`

- [ ] **Step 1: Run the Sites initializer once**

Run:

```bash
/Users/admin/.codex/plugins/cache/openai-bundled/sites/0.1.31/scripts/init-site.sh "$PWD"
```

Expected: dependencies install successfully and the starter creates a vinext/Vite application without replacing `references/`, `demos/`, `docs/`, or the upstream README files.

- [ ] **Step 2: Start the development server**

Run:

```bash
npm run dev
```

Expected: the retained process prints one healthy Local URL. Open that exact URL once through Sites preview and keep the process running during implementation.

- [ ] **Step 3: Inspect only the starter integration files**

Run:

```bash
sed -n '1,240p' app/page.tsx
sed -n '1,240p' app/layout.tsx
sed -n '1,280p' app/globals.css
sed -n '1,160p' .openai/hosting.json
```

Expected: confirm the starter component structure and hosting metadata before replacing the starter UI.

- [ ] **Step 4: Commit the initialized application**

```bash
git add --sparse package.json package-lock.json vite.config.ts app .openai
git commit -m "chore: initialize local shot library site"
```

### Task 2: Build the normalized shot catalog with TDD

**Files:**
- Create: `tests/library-data.test.mjs`
- Create: `scripts/build-library-data.mjs`
- Create: `source/upstream-library.json`
- Create: `public/data/library.json`
- Modify: `package.json`

- [ ] **Step 1: Pin the upstream catalog**

Run:

```bash
mkdir -p source
curl -L --compressed -sS \
  https://vincentwei1021.github.io/video-shotcraft/api/library.json \
  -o source/upstream-library.json
```

Expected: `source/upstream-library.json` is valid JSON containing `stats.cardCount = 104` and `stats.styleCount = 161`.

- [ ] **Step 2: Write failing catalog tests**

Create `tests/library-data.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {normalizeLibrary} from "../scripts/build-library-data.mjs";

const fixture = {
  stats: {cardCount: 1, styleCount: 2, previewCount: 2},
  categories: {interaction: {zh: "交互与功能演示", en: "Interaction"}},
  cards: [{
    name: "example-shot",
    summary: "摘要",
    use: "功能演示",
    duration: "4s",
    energy: "中",
    source: "references/shots/interaction/example-shot.md",
    sourceUrl: "./source/example-shot.md",
    category: "interaction",
    styles: [
      {
        key: "example-a",
        label: "Example A",
        description: "A",
        media: {url: "./media/example-a.mp4?v=1", type: "mp4"},
      },
      {
        key: "example-b",
        label: "Example B",
        description: "B",
        media: {url: "./media/example-b.mp4", type: "mp4"},
        implementationStatus: "reference-only",
      },
    ],
  }],
};

test("normalizes preview URLs and preserves reference-only styles", () => {
  const result = normalizeLibrary(fixture, {
    recipePaths: new Set(["references/shots/interaction/example-shot.md"]),
    demosByShot: new Map([["example-shot", ["demos/interaction/example-shot/Example.tsx"]]]),
  });

  assert.equal(result.cards[0].styles[0].previewUrl,
    "https://vincentwei1021.github.io/video-shotcraft/media/example-a.mp4?v=1");
  assert.equal(result.cards[0].styles[1].implementationStatus, "reference-only");
  assert.equal(result.cards[0].recipeAvailable, true);
  assert.deepEqual(result.cards[0].demoFiles,
    ["demos/interaction/example-shot/Example.tsx"]);
});

test("marks missing recipes and demos without inventing implementations", () => {
  const result = normalizeLibrary(fixture, {
    recipePaths: new Set(),
    demosByShot: new Map(),
  });

  assert.equal(result.cards[0].recipeAvailable, false);
  assert.deepEqual(result.cards[0].demoFiles, []);
  assert.equal(result.cards[0].hasDemo, false);
});
```

- [ ] **Step 3: Run the tests and verify RED**

Run:

```bash
node --test tests/library-data.test.mjs
```

Expected: FAIL because `scripts/build-library-data.mjs` and `normalizeLibrary` do not exist.

- [ ] **Step 4: Implement the minimal catalog builder**

Create `scripts/build-library-data.mjs` with:

```js
import {readdir, readFile, writeFile, mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const PREVIEW_BASE = "https://vincentwei1021.github.io/video-shotcraft/";

export function normalizeLibrary(library, local) {
  return {
    stats: library.stats,
    categories: library.categories,
    cards: library.cards.map((card) => ({
      id: card.name,
      title: card.name,
      summary: card.summary || card.intention || "",
      use: card.use || "",
      duration: card.duration || "",
      energy: card.energy || "",
      category: card.category,
      recipePath: card.source,
      recipeUrl: `https://github.com/Vincentwei1021/video-shotcraft/blob/main/${card.source}`,
      recipeAvailable: local.recipePaths.has(card.source),
      demoFiles: local.demosByShot.get(card.name) || [],
      hasDemo: (local.demosByShot.get(card.name) || []).length > 0,
      styles: card.styles.map((style) => ({
        id: style.key,
        title: style.label || style.key,
        description: style.description || "",
        previewUrl: style.media?.url
          ? new URL(style.media.url, PREVIEW_BASE).href
          : null,
        implementationStatus:
          style.implementationStatus === "reference-only"
            ? "reference-only"
            : "implemented",
      })),
    })),
  };
}

async function walk(root, suffix) {
  const output = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (absolute.endsWith(suffix)) output.push(absolute);
    }
  }
  await visit(root);
  return output;
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const library = JSON.parse(await readFile(
    path.join(root, "source/upstream-library.json"), "utf8"));
  const recipes = await walk(path.join(root, "references/shots"), ".md");
  const demos = await walk(path.join(root, "demos"), ".tsx");
  const relative = (file) => path.relative(root, file).split(path.sep).join("/");
  const recipePaths = new Set(recipes.map(relative));
  const demosByShot = new Map();

  for (const file of demos.map(relative)) {
    const parts = file.split("/");
    const shot = parts.length >= 4 ? parts[2] : null;
    if (!shot) continue;
    demosByShot.set(shot, [...(demosByShot.get(shot) || []), file]);
  }

  const output = normalizeLibrary(library, {recipePaths, demosByShot});
  const target = path.join(root, "public/data/library.json");
  await mkdir(path.dirname(target), {recursive: true});
  await writeFile(target, `${JSON.stringify(output, null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
```

- [ ] **Step 5: Run the tests and verify GREEN**

Run:

```bash
node --test tests/library-data.test.mjs
```

Expected: 2 tests pass and 0 fail.

- [ ] **Step 6: Generate and validate the real catalog**

Add scripts to `package.json`:

```json
{
  "scripts": {
    "data:build": "node scripts/build-library-data.mjs",
    "test": "node --test tests/*.test.mjs"
  }
}
```

Run:

```bash
npm run data:build
jq '{cards:(.cards|length),styles:([.cards[].styles[]]|length),remoteMedia:([.cards[].styles[].previewUrl|select(startswith("https://"))]|length)}' public/data/library.json
```

Expected:

```json
{"cards":104,"styles":161,"remoteMedia":161}
```

- [ ] **Step 7: Commit the data pipeline**

```bash
git add --sparse tests scripts source public/data package.json package-lock.json
git commit -m "feat: generate normalized shot catalog"
```

### Task 3: Implement the library interface

**Files:**
- Create: `tests/library-ui-model.test.mjs`
- Create: `app/library-model.ts`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Delete: `app/_sites-preview/**`

- [ ] **Step 1: Write failing filter tests**

Create `tests/library-ui-model.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {filterCards} from "../app/library-model.ts";

const cards = [
  {id: "ai-stream-response", title: "AI 响应", summary: "证据逐条汇入", use: "Agent", category: "interaction", styles: [{id: "stream"}]},
  {id: "brand-ink-open", title: "品牌开场", summary: "印章文字", use: "开场", category: "opening", styles: [{id: "ink"}]},
];

test("filters by category", () => {
  assert.deepEqual(filterCards(cards, "", "opening").map((card) => card.id),
    ["brand-ink-open"]);
});

test("searches ids, Chinese copy, uses, and style ids case-insensitively", () => {
  assert.deepEqual(filterCards(cards, "AGENT", "all").map((card) => card.id),
    ["ai-stream-response"]);
  assert.deepEqual(filterCards(cards, "ink", "all").map((card) => card.id),
    ["brand-ink-open"]);
});
```

- [ ] **Step 2: Run the UI model tests and verify RED**

Run:

```bash
node --test tests/library-ui-model.test.mjs
```

Expected: FAIL because `app/library-model.ts` does not exist.

- [ ] **Step 3: Implement the filter model**

Create `app/library-model.ts`:

```ts
export function filterCards(cards: any[], query: string, category: string) {
  const needle = query.trim().toLowerCase();
  return cards.filter((card) => {
    if (category !== "all" && card.category !== category) return false;
    if (!needle) return true;
    const haystack = [
      card.id,
      card.title,
      card.summary,
      card.use,
      ...card.styles.map((style: any) => `${style.id} ${style.title}`),
    ].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
}
```

- [ ] **Step 4: Run the UI model tests and verify GREEN**

Run:

```bash
node --test tests/library-ui-model.test.mjs
```

Expected: 2 tests pass and 0 fail.

- [ ] **Step 5: Replace the starter with the complete library page**

Implement `app/page.tsx` as a client component that:

- fetches `/data/library.json` once;
- renders the real 104-card catalog and category labels;
- calls `filterCards(cards, query, category)`;
- stores selected style indexes by card ID;
- uses an `IntersectionObserver` video component with `preload="none"`;
- opens an accessible `<dialog>` for the selected card;
- offers style switching, full controls in the dialog, copy-ID feedback, recipe links, and Demo-file lists;
- displays loading, catalog-error, media-error, and empty-result states;
- pauses videos outside the viewport;
- never requests all MP4s at once.

Replace `app/globals.css` with the approved dark workstation direction:

- near-black background, warm orange accent, neutral white text;
- sticky filter rail on desktop and horizontal filters on mobile;
- responsive card grid using `minmax(280px, 1fr)`;
- 16:9 video stages;
- visible focus states and minimum 44px touch targets;
- `prefers-reduced-motion` rules that disable transitions and autoplay-dependent effects.

Update `app/layout.tsx` with:

```ts
export const metadata = {
  title: "Video Shotcraft｜本地镜头库",
  description: "104 个镜头配方、161 个动态样式与 Remotion 实现索引。",
};
```

Remove the temporary starter preview directory and dependency after no imports remain:

```bash
npm uninstall react-loading-skeleton
```

- [ ] **Step 6: Run all tests**

Run:

```bash
npm test
```

Expected: 4 tests pass and 0 fail.

- [ ] **Step 7: Commit the interface**

```bash
git add --sparse app tests package.json package-lock.json
git commit -m "feat: add Chinese shot library interface"
```

### Task 4: Add provenance, metadata, and social preview

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Create: `public/og.png`

- [ ] **Step 1: Add visible provenance**

Add a compact footer and detail-dialog notice that state:

- the catalog is adapted from `Vincentwei1021/video-shotcraft`;
- project code is Apache 2.0;
- Remotion and bundled audio/assets can have separate license terms;
- preview videos remain hosted by the upstream public Gallery.

- [ ] **Step 2: Generate exactly one site-specific social card**

Generate a 1200×630 landscape social card using the final title, warm-orange/near-black palette, Chinese typography, film-frame grid, and the exact text:

```text
VIDEO SHOTCRAFT
本地镜头库
104 镜头配方 · 161 动态样式
```

Inspect it for exact text. If valid, save as `public/og.png`; if the text is unusable after one retry, omit the image.

- [ ] **Step 3: Wire absolute social metadata**

Update `app/layout.tsx` so Open Graph and X metadata use the incoming request host and `/og.png`, without retaining any starter metadata.

- [ ] **Step 4: Commit provenance and metadata**

```bash
git add --sparse app public/og.png
git commit -m "feat: add library provenance and social metadata"
```

### Task 5: Verify and publish

**Files:**
- Modify: `.openai/hosting.json`

- [ ] **Step 1: Run fresh data and test verification**

Run:

```bash
npm run data:build
npm test
```

Expected: the generated catalog reports 104 cards and 161 styles; all tests pass with 0 failures.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0, with `dist/server/index.js` and static assets emitted.

- [ ] **Step 3: Confirm deployment excludes MP4 files**

Run:

```bash
find dist -type f -name '*.mp4' -print
```

Expected: no output.

- [ ] **Step 4: Publish the validated source**

Use Sites to:

1. create the site exactly once and persist its opaque `project_id`;
2. push the exact validated source state;
3. package with `scripts/package-site.sh`;
4. save one version using the pushed commit SHA;
5. deploy privately;
6. poll until deployment succeeds.

- [ ] **Step 5: Open and hand off the deployed site**

Open the exact production URL returned by the successful deployment, then report:

- the production URL;
- that the catalog includes 104 cards and 161 styles;
- that previews are remotely streamed and recipes/Demos are locally indexed;
- the key local files changed.

