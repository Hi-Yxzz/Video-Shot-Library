import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildLibraryData,
  checkLibraryData,
  createArollCards,
  indexLocalFiles,
  mergeCatalogs,
  normalizeLibrary,
} from "../scripts/build-library-data.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function card(overrides = {}) {
  return {
    name: "query-shot",
    source: "references/shots/interaction/query-shot.md",
    summary: "A concise summary",
    use: "Product demo",
    duration: "3s",
    energy: "medium",
    category: "interaction",
    styles: [
      {
        key: "query-style",
        label: "Query style",
        description: "A style description",
        media: {
          url: "./media/query-shot.mp4?v=123&quality=high",
          type: "mp4",
        },
      },
    ],
    ...overrides,
  };
}

async function writeFixture(root, relativePath, contents = "") {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

async function seedProject(root) {
  await Promise.all([
    writeFixture(
      root,
      "source/upstream-library.json",
      JSON.stringify({ cards: [card()] }),
    ),
    writeFixture(
      root,
      "source/graded-library.json",
      JSON.stringify({ cards: [] }),
    ),
    writeFixture(
      root,
      "source/shot-metadata.json",
      JSON.stringify({
        "query-shot": {
          titleZh: "查询交互镜头",
          tags: ["组件"],
        },
      }),
    ),
    writeFixture(
      root,
      "references/shots/interaction/query-shot.md",
    ),
    writeFixture(
      root,
      "demos/interaction/query-shot/QueryDemo.tsx",
    ),
  ]);
}

test("normalizes relative media URLs to absolute HTTPS and preserves queries", () => {
  const result = normalizeLibrary({ cards: [card()] }, {
    recipes: [],
    demos: [],
  });

  assert.equal(
    result.cards[0].styles[0].media.url,
    "https://vincentwei1021.github.io/video-shotcraft/media/query-shot.mp4?v=123&quality=high",
  );
  assert.equal(
    result.cards[0].styles[0].previewUrl,
    "https://vincentwei1021.github.io/video-shotcraft/media/query-shot.mp4?v=123&quality=high",
  );
});

test("excludes configured shots from the normalized catalog", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card(),
        card({
          name: "text-as-mask",
          source: "references/shots/opening/text-as-mask.md",
        }),
      ],
    },
    {
      recipes: [],
      demos: [],
    },
    ["text-as-mask"],
  );

  assert.deepEqual(result.cards.map((entry) => entry.id), ["query-shot"]);
});

test("recomputes catalog stats after excluding shots", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card(),
        card({
          name: "text-as-mask",
          source: "references/shots/opening/text-as-mask.md",
        }),
      ],
      stats: {
        cardCount: 2,
        styleCount: 2,
        previewCount: 2,
        mediaCount: 2,
        newest: "2026-07-26T12:36:39.000Z",
      },
    },
    {
      recipes: [],
      demos: [],
    },
    ["text-as-mask"],
  );

  assert.deepEqual(result.stats, {
    cardCount: 1,
    styleCount: 1,
    previewCount: 1,
    mediaCount: 1,
    newest: "2026-07-26T12:36:39.000Z",
  });
});

test("reclassifies Video Shotcraft cards during normalization", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card({
          name: "line-boil",
          category: "effects",
          source: "references/shots/effects/line-boil.md",
        }),
      ],
    },
    { recipes: [], demos: [] },
  );

  assert.equal(result.cards[0].category, "typography");
});

test("merges graded player cards while preserving video cards", () => {
  const upstream = normalizeLibrary(
    {
      cards: [card()],
      categories: {},
      stats: {
        cardCount: 1,
        styleCount: 1,
        previewCount: 1,
        mediaCount: 1,
        newest: null,
      },
    },
    { recipes: [], demos: [] },
  );
  const gradedCard = {
    id: "remocn/blur-in",
    styles: [{ key: "default", previewUrl: null }],
    previewKind: "player",
    codeFiles: [
      "library-sources/remocn/registry/remocn/blur-in/index.tsx",
    ],
  };
  const result = mergeCatalogs(upstream, { cards: [gradedCard] });

  assert.equal(result.cards.length, 2);
  assert.equal(result.cards[0].previewKind, "video");
  assert.equal(result.cards[1].previewKind, "player");
  assert.equal(result.stats.videoPreviewCount, 1);
  assert.equal(result.stats.playerPreviewCount, 1);
  assert.equal(result.stats.previewCount, 2);
  assert.equal(
    result.cards[1].sourceUrl,
    "https://github.com/Hi-Yxzz/Video-Shot-Library/blob/main/library-sources/remocn/registry/remocn/blur-in/index.tsx",
  );
});

test("converts A-roll entries into playable site cards", () => {
  const cards = createArollCards([
    {
      id: "a-roll-012-milestone-counter",
      title: "双平台里程碑数字动画",
      rollType: "A-roll",
      status: "ready",
      compositionId: "Aroll012MilestoneCounter",
      outputPath: "../remotion-photo-replica/out/a-roll-012-milestone-counter.mp4",
      durationInFrames: 64,
      fps: 30,
      width: 1920,
      height: 1080,
      tags: {
        subject: ["单人"],
        motion: ["数字递增"],
        format: ["无声"],
      },
    },
  ]);

  assert.equal(cards.length, 1);
  assert.equal(cards[0].category, "a-roll");
  assert.equal(cards[0].previewKind, "video");
  assert.equal(cards[0].compositionId, "Aroll012MilestoneCounter");
  assert.equal(
    cards[0].styles[0].previewUrl,
    "/media/a-roll/a-roll-012-milestone-counter.mp4",
  );
  assert.deepEqual(cards[0].tags, ["单人", "数字递增", "无声"]);
});

test("reclassifies committed graded cards during merge", () => {
  const upstream = normalizeLibrary(
    { cards: [card()] },
    { recipes: [], demos: [] },
  );
  const result = mergeCatalogs(upstream, {
    cards: [
      {
        id: "remocn/drift",
        upstreamId: "drift",
        collection: "remocn",
        category: "effects",
        grade: "A",
        styles: [],
        previewKind: "player",
      },
    ],
  });

  assert.equal(
    result.cards.find((entry) => entry.id === "remocn/drift").category,
    "camera",
  );
});

test("rejects duplicate ids when merging graded cards", () => {
  const upstream = normalizeLibrary(
    { cards: [card()] },
    { recipes: [], demos: [] },
  );
  const duplicate = {
    id: "remocn/blur-in",
    styles: [],
    previewKind: "player",
  };

  assert.throws(
    () => mergeCatalogs(upstream, { cards: [duplicate, duplicate] }),
    /Duplicate card id: remocn\/blur-in/,
  );
});

test("rejects preview URLs outside the trusted HTTPS media directory", () => {
  const unsafeUrls = [
    "javascript:alert(1)",
    "file:///tmp/private.mp4",
    "http://vincentwei1021.github.io/video-shotcraft/media/query-shot.mp4",
    "https://evil.example/video-shotcraft/media/query-shot.mp4",
    "https://vincentwei1021.github.io/private/query-shot.mp4",
    "./media/../private/query-shot.mp4",
    "./media/%2f..%2fprivate.mp4",
  ];

  for (const url of unsafeUrls) {
    assert.throws(
      () =>
        normalizeLibrary(
          {
            cards: [
              card({
                styles: [{
                  key: "unsafe-preview",
                  label: "Unsafe preview",
                  description: "Unsafe media URL",
                  media: { url, type: "mp4" },
                }],
              }),
            ],
          },
          { recipes: [], demos: [] },
        ),
      /Shot "query-shot", style "unsafe-preview": media.url must be a trusted HTTPS media URL/,
    );
  }
});

test("rejects unsafe recipe source paths with the shot identifier", () => {
  const unsafeSources = [
    undefined,
    42,
    "../private.md",
    "references/shots/../private.md",
    "references/shots/%2e%2e/private.md",
    "references/shots/query-shot.md",
    "references/shots/interaction/.md",
    "references/shots/interaction/query-shot.txt",
    "/references/shots/interaction/query-shot.md",
  ];

  for (const source of unsafeSources) {
    assert.throws(
      () =>
        normalizeLibrary(
          { cards: [card({ source })] },
          { recipes: [], demos: [] },
        ),
      /Shot "query-shot": source must be a safe references\/shots\/ Markdown path/,
    );
  }
});

test("emits the unified card fields and explicit recipe availability", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card({ sourceUrl: "https://evil.example/private.md" }),
        card({
          name: "missing-shot",
          source: "references/shots/interaction/missing-shot.md",
          styles: [],
        }),
      ],
    },
    {
      recipes: ["references/shots/interaction/query-shot.md"],
      demos: [],
    },
  );
  const queryShot = result.cards.find((entry) => entry.id === "query-shot");
  const missingShot = result.cards.find((entry) => entry.id === "missing-shot");

  assert.deepEqual(
    new Set(Object.keys(queryShot)),
    new Set([
      "id",
      "title",
      "summary",
      "use",
      "duration",
      "energy",
      "category",
      "recipePath",
      "recipeUrl",
      "recipeAvailable",
      "demoFiles",
      "hasDemo",
      "styles",
    ]),
  );
  assert.equal(queryShot.id, "query-shot");
  assert.equal(queryShot.title, "query-shot");
  assert.equal(queryShot.summary, "A concise summary");
  assert.equal(queryShot.category, "interaction");
  assert.equal(
    queryShot.recipePath,
    "references/shots/interaction/query-shot.md",
  );
  assert.equal(
    queryShot.recipeUrl,
    "https://github.com/Hi-Yxzz/Video-Shot-Library/blob/main/references/shots/interaction/query-shot.md",
  );
  assert.equal(queryShot.recipeAvailable, true);

  assert.equal(missingShot.recipePath, null);
  assert.equal(missingShot.recipeAvailable, false);
});

test("maps demos by category and shot id and reports missing demos explicitly", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card(),
        card({ name: "missing-shot", styles: [] }),
      ],
    },
    {
      recipes: [],
      demos: [
        "demos/interaction/query-shot/Zebra.tsx",
        "demos/interaction/query-shot/Alpha.tsx",
        "demos/other/query-shot/WrongCategory.tsx",
      ],
    },
  );
  const queryShot = result.cards.find((entry) => entry.id === "query-shot");
  const missingShot = result.cards.find((entry) => entry.id === "missing-shot");

  assert.deepEqual(queryShot.demoFiles, [
    "demos/interaction/query-shot/Alpha.tsx",
    "demos/interaction/query-shot/Zebra.tsx",
  ]);
  assert.equal(queryShot.hasDemo, true);
  assert.deepEqual(missingShot.demoFiles, []);
  assert.equal(missingShot.hasDemo, false);
});

test("keeps only reference-only style status and defaults all others to implemented", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card({
          styles: [
            {
              key: "reference",
              label: "Reference",
              description: "Reference only",
              implementationStatus: "reference-only",
              media: { url: "./media/reference.mp4", type: "mp4" },
            },
            {
              key: "defaulted",
              label: "Defaulted",
              description: "No status",
              media: { url: "./media/defaulted.mp4", type: "mp4" },
            },
            {
              key: "draft",
              label: "Draft",
              description: "Draft input",
              implementationStatus: "draft",
              media: { url: "./media/draft.mp4", type: "mp4" },
            },
          ],
        }),
      ],
    },
    { recipes: [], demos: [] },
  );

  assert.deepEqual(
    Object.fromEntries(
      result.cards[0].styles.map((style) => [
        style.key,
        style.implementationStatus,
      ]),
    ),
    {
      defaulted: "implemented",
      draft: "implemented",
      reference: "reference-only",
    },
  );
});

test("preserves styles without media and exposes a null preview URL", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card({
          styles: [{
            key: "no-preview",
            label: "No preview",
            description: "A valid style without preview media",
            implementationStatus: "reference-only",
          }],
        }),
      ],
    },
    { recipes: [], demos: [] },
  );
  const [style] = result.cards[0].styles;

  assert.equal(result.cards[0].styles.length, 1);
  assert.equal(style.key, "no-preview");
  assert.equal(style.label, "No preview");
  assert.equal(style.previewUrl, null);
  assert.equal(style.implementationStatus, "reference-only");
});

test("allows empty descriptive strings while preserving their string type", () => {
  const result = normalizeLibrary(
    {
      cards: [
        card({
          title: "",
          summary: "",
          use: "",
          duration: "",
          energy: "",
          styles: [{
            key: "empty-copy",
            label: "",
            description: "",
          }],
        }),
      ],
    },
    { recipes: [], demos: [] },
  );

  assert.equal(result.cards[0].title, "");
  assert.equal(result.cards[0].summary, "");
  assert.equal(result.cards[0].styles[0].label, "");
  assert.equal(result.cards[0].styles[0].description, "");
});

test("rejects invalid library and card inputs with clear shot identifiers", () => {
  assert.throws(
    () => normalizeLibrary({}, { recipes: [], demos: [] }),
    /Library cards must be an array/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        { cards: [{ category: "interaction", styles: [] }] },
        { recipes: [], demos: [] },
      ),
    /Shot at index 0: name must be a non-empty string/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        { cards: [card({ category: "" })] },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot": category must be a non-empty string/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        { cards: [card({ styles: null })] },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot": styles must be an array/,
  );
  for (const field of ["summary", "use", "duration", "energy"]) {
    assert.throws(
      () =>
        normalizeLibrary(
          { cards: [card({ [field]: null })] },
          { recipes: [], demos: [] },
        ),
      new RegExp(
        `Shot "query-shot": ${field} must be a string`,
      ),
    );
  }
  assert.throws(
    () =>
      normalizeLibrary(
        { cards: [card({ title: 42 })] },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot": title must be a string/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        { cards: [card({ styles: [null] })] },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot", style at index 0: style must be an object/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        {
          cards: [
            card({
              styles: [{
                label: "Missing key",
                media: { url: "./media/missing-key.mp4", type: "mp4" },
              }],
            }),
          ],
        },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot", style at index 0: key must be a non-empty string/,
  );
  for (const field of ["label", "description"]) {
    assert.throws(
      () =>
        normalizeLibrary(
          {
            cards: [
              card({
                styles: [{
                  key: "invalid-copy",
                  label: "Label",
                  description: "Description",
                  [field]: null,
                }],
              }),
            ],
          },
          { recipes: [], demos: [] },
        ),
      new RegExp(
        `Shot "query-shot", style "invalid-copy": ${field} must be a string`,
      ),
    );
  }
  assert.throws(
    () =>
      normalizeLibrary(
        {
          cards: [
            card({
              styles: [{
                key: "missing-url",
                label: "Missing URL",
                description: "Missing media URL",
                media: { type: "mp4" },
              }],
            }),
          ],
        },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot", style "missing-url": media.url must be a non-empty string/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        {
          cards: [
            card({
              styles: [{
                key: "missing-type",
                label: "Missing type",
                description: "Missing media type",
                media: { url: "./media/missing-type.mp4" },
              }],
            }),
          ],
        },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot", style "missing-type": media.type must be a non-empty string/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        {
          cards: [
            card({
              styles: [{
                key: "bad-url",
                label: "Bad URL",
                description: "Malformed media URL",
                media: { url: "https://%", type: "mp4" },
              }],
            }),
          ],
        },
        { recipes: [], demos: [] },
      ),
    /Shot "query-shot", style "bad-url": media.url must be a trusted HTTPS media URL/,
  );
});

test("requires local recipe and demo indexes to be arrays", () => {
  assert.throws(
    () =>
      normalizeLibrary(
        { cards: [card()] },
        { recipes: "references/shots/interaction/query-shot.md", demos: [] },
      ),
    /Local recipes must be an array/,
  );
  assert.throws(
    () =>
      normalizeLibrary(
        { cards: [card()] },
        { recipes: [], demos: null },
      ),
    /Local demos must be an array/,
  );
});

test("rejects local paths outside the recipe and demo roots", () => {
  const invalidRecipes = [
    "../private.md",
    "/references/shots/interaction/query-shot.md",
    "references/shots/interaction/../private.md",
    "references/shots/%2e%2e/private.md",
    "references/other/query-shot.md",
    "references/shots/interaction/.md",
    "references/shots/interaction/query-shot.txt",
    "references\\shots\\interaction\\query-shot.md",
  ];
  const invalidDemos = [
    "../Private.tsx",
    "/demos/interaction/query-shot/Private.tsx",
    "demos/interaction/query-shot/../Private.tsx",
    "demos/interaction/%2e%2e/Private.tsx",
    "private/interaction/query-shot/Private.tsx",
    "demos/interaction/query-shot/.tsx",
    "demos/interaction/query-shot/Private.js",
    "demos\\interaction\\query-shot\\Private.tsx",
  ];

  for (const recipe of invalidRecipes) {
    assert.throws(
      () =>
        normalizeLibrary(
          { cards: [card()] },
          { recipes: [recipe], demos: [] },
        ),
      /Local recipe path must stay within references\/shots\/ and end in \.md/,
    );
  }
  for (const demo of invalidDemos) {
    assert.throws(
      () =>
        normalizeLibrary(
          { cards: [card()] },
          { recipes: [], demos: [demo] },
        ),
      /Local demo path must stay within demos\/ and end in \.tsx/,
    );
  }
});

test("sorts cards, styles, and demo files deterministically", () => {
  const alphaStyle = {
    key: "alpha-style",
    label: "Alpha",
    description: "Alpha style",
    media: { url: "./media/alpha.mp4", type: "mp4" },
  };
  const zebraStyle = {
    key: "zebra-style",
    label: "Zebra",
    description: "Zebra style",
    media: { url: "./media/zebra.mp4", type: "mp4" },
  };
  const result = normalizeLibrary(
    {
      cards: [
        card({ name: "zebra-shot", styles: [] }),
        card({
          name: "alpha-shot",
          styles: [zebraStyle, alphaStyle],
        }),
      ],
    },
    {
      recipes: [],
      demos: [
        "demos/interaction/alpha-shot/Zebra.tsx",
        "demos/interaction/alpha-shot/Alpha.tsx",
      ],
    },
  );

  assert.deepEqual(
    result.cards.map((entry) => entry.id),
    ["alpha-shot", "zebra-shot"],
  );
  assert.deepEqual(
    result.cards[0].styles.map((style) => style.key),
    ["alpha-style", "zebra-style"],
  );
  assert.deepEqual(result.cards[0].demoFiles, [
    "demos/interaction/alpha-shot/Alpha.tsx",
    "demos/interaction/alpha-shot/Zebra.tsx",
  ]);
});

test("recursively indexes recipes and demos using the shot directory id", async () => {
  const root = await mkdtemp(join(tmpdir(), "shot-library-index-"));

  try {
    await Promise.all([
      writeFixture(
        root,
        "references/shots/interaction/nested/query-shot.md",
      ),
      writeFixture(
        root,
        "references/shots/opening/alpha-shot.md",
      ),
      writeFixture(
        root,
        "demos/interaction/query-shot/nested/QueryDemo.tsx",
      ),
      writeFixture(
        root,
        "demos/opening/alpha-shot/AlphaDemo.tsx",
      ),
      writeFixture(root, "demos/_fixtures/Fixtures.tsx"),
      writeFixture(root, "demos/interaction/query-shot/notes.txt"),
    ]);

    assert.deepEqual(await indexLocalFiles(root), {
      recipes: [
        "references/shots/interaction/nested/query-shot.md",
        "references/shots/opening/alpha-shot.md",
      ],
      demos: [
        "demos/interaction/query-shot/nested/QueryDemo.tsx",
        "demos/opening/alpha-shot/AlphaDemo.tsx",
      ],
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("builds the normalized catalog at public/data/library.json", async () => {
  const root = await mkdtemp(join(tmpdir(), "shot-library-build-"));

  try {
    await seedProject(root);

    const catalog = await buildLibraryData(root);
    const outputPath = join(root, "public/data/library.json");
    const firstStat = await stat(outputPath);

    await writeFixture(
      root,
      "source/upstream-library.json",
      JSON.stringify({ cards: [card({ summary: "Updated summary" })] }),
    );
    const updatedCatalog = await buildLibraryData(root);
    const secondStat = await stat(outputPath);
    const generated = JSON.parse(await readFile(outputPath, "utf8"));
    const dataFiles = await readdir(join(root, "public/data"));

    assert.notDeepEqual(updatedCatalog, catalog);
    assert.deepEqual(generated, updatedCatalog);
    assert.notEqual(secondStat.ino, firstStat.ino);
    assert.deepEqual(dataFiles, ["library.json"]);
    assert.equal(generated.cards[0].summary, "Updated summary");
    assert.equal(generated.cards[0].recipeAvailable, true);
    assert.deepEqual(generated.cards[0].demoFiles, [
      "demos/interaction/query-shot/QueryDemo.tsx",
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("build excludes shots listed in source/excluded-shots.json", async () => {
  const root = await mkdtemp(join(tmpdir(), "shot-library-exclusions-"));

  try {
    await seedProject(root);
    await writeFixture(
      root,
      "source/upstream-library.json",
      JSON.stringify({
        cards: [
          card(),
          card({
            name: "text-as-mask",
            source: "references/shots/opening/text-as-mask.md",
          }),
        ],
      }),
    );
    await writeFixture(
      root,
      "source/excluded-shots.json",
      JSON.stringify(["text-as-mask"]),
    );

    const catalog = await buildLibraryData(root);

    assert.deepEqual(catalog.cards.map((entry) => entry.id), ["query-shot"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("detects source changes without modifying the generated catalog", async () => {
  const root = await mkdtemp(join(tmpdir(), "shot-library-source-check-"));

  try {
    await seedProject(root);
    await buildLibraryData(root);
    const outputPath = join(root, "public/data/library.json");
    const original = await readFile(outputPath, "utf8");

    await writeFixture(
      root,
      "source/upstream-library.json",
      JSON.stringify({ cards: [card({ summary: "Stale source" })] }),
    );

    await assert.rejects(
      checkLibraryData(root),
      /Shot catalog is stale; run npm run data:build/,
    );
    assert.equal(await readFile(outputPath, "utf8"), original);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("detects demo index changes without modifying the generated catalog", async () => {
  const root = await mkdtemp(join(tmpdir(), "shot-library-demo-check-"));

  try {
    await seedProject(root);
    await buildLibraryData(root);
    const outputPath = join(root, "public/data/library.json");
    const original = await readFile(outputPath, "utf8");

    await writeFixture(
      root,
      "demos/interaction/query-shot/SecondDemo.tsx",
    );

    await assert.rejects(
      checkLibraryData(root),
      /Shot catalog is stale; run npm run data:build/,
    );
    assert.equal(await readFile(outputPath, "utf8"), original);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("keeps the repository catalog current and checks it before builds", async () => {
  const packageJson = JSON.parse(
    await readFile(join(projectRoot, "package.json"), "utf8"),
  );

  assert.equal(packageJson.scripts["data:check"], "node scripts/build-library-data.mjs --check");
  assert.equal(
    packageJson.scripts.prebuild,
    "npm run data:build && npm run players:build",
  );
  assert.match(
    packageJson.scripts.test,
    /^npm run data:check && npm run build && /,
  );
  await checkLibraryData(projectRoot);
});
