import assert from "node:assert/strict";
import test from "node:test";

import {validateCuratedEntries} from "../curated-v2/core/schema.ts";

const valid = {
  id: "curated/concept/orbit-comparison",
  familyId: "orbit-comparison",
  variantId: "default",
  title: "轨道对比",
  summary: "用两条轨道解释概念差异",
  use: "概念对比",
  category: "concept",
  rollType: "B-roll",
  qualityScore: 88,
  composition: {
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
  },
  sourceFiles: ["curated-v2/shots/concept/orbit-comparison/Shot.tsx"],
  analysisPath: "curated-v2/references/reference-001/orbit-comparison.md",
  previewUrl: "/media/curated-v2/orbit-comparison-default.mp4",
  fixtures: ["shortest", "default", "stress"],
  tags: ["概念", "对比"],
};

test("accepts a publishable curated entry and returns a clone", () => {
  const input = [structuredClone(valid)];
  const result = validateCuratedEntries(input);

  assert.deepEqual(result, [valid]);
  assert.notStrictEqual(result, input);
  assert.notStrictEqual(result[0], input[0]);
  assert.notStrictEqual(result[0].composition, input[0].composition);
  assert.notStrictEqual(result[0].sourceFiles, input[0].sourceFiles);
  assert.notStrictEqual(result[0].fixtures, input[0].fixtures);
  assert.notStrictEqual(result[0].tags, input[0].tags);
});

test("accepts safe support files below the curated shots root", () => {
  const sourceFiles = [
    "curated-v2/shots/concept/orbit-comparison/Shot.tsx",
    "curated-v2/shots/concept/orbit-comparison/helpers.ts",
    "curated-v2/shots/concept/orbit-comparison/styles.css",
  ];

  assert.deepEqual(
    validateCuratedEntries([{...valid, sourceFiles}])[0].sourceFiles,
    sourceFiles,
  );
});

test("rejects entries below the publish threshold", () => {
  assert.throws(
    () => validateCuratedEntries([{...valid, qualityScore: 84}]),
    /qualityScore must be at least 85/,
  );
});

test("requires exactly the three content fixtures", () => {
  for (const fixtures of [
    ["default"],
    ["shortest", "default", "stress", "extra"],
    ["shortest", "default", "default", "stress"],
  ]) {
    assert.throws(
      () => validateCuratedEntries([{...valid, fixtures}]),
      /shortest, default, stress/,
    );
  }
});

test("requires curated IDs and rejects duplicate IDs", () => {
  assert.throws(
    () => validateCuratedEntries([{...valid, id: "concept/orbit-comparison"}]),
    /id must start with curated\//,
  );
  assert.throws(
    () => validateCuratedEntries([valid, structuredClone(valid)]),
    /duplicate id/,
  );
});

test("requires the exact composition dimensions and frame rate", () => {
  assert.throws(
    () =>
      validateCuratedEntries([
        {...valid, composition: {...valid.composition, width: 1080}},
      ]),
    /1920x1080/,
  );
  assert.throws(
    () =>
      validateCuratedEntries([
        {...valid, composition: {...valid.composition, fps: 24}},
      ]),
    /fps must be 30/,
  );
});

test("requires a positive integer duration", () => {
  for (const durationInFrames of [0, -1, 1.5]) {
    assert.throws(
      () =>
        validateCuratedEntries([
          {
            ...valid,
            composition: {...valid.composition, durationInFrames},
          },
        ]),
      /durationInFrames must be a positive integer/,
    );
  }
});

test("requires a supported roll type", () => {
  assert.throws(
    () => validateCuratedEntries([{...valid, rollType: "C-roll"}]),
    /rollType must be A-roll or B-roll/,
  );
});

test("rejects unsafe or misplaced file paths", () => {
  const invalidPaths = [
    {
      sourceFiles: ["curated-v2/shots/../escaped/Shot.tsx"],
      message: /sourceFiles.*curated-v2\/shots/,
    },
    {
      analysisPath: "curated-v2/references/../escaped/orbit-comparison.md",
      message: /analysisPath.*curated-v2\/references.*\.md/,
    },
    {
      previewUrl: "/media/orbit-comparison-default.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/%2e%2e/escaped.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/%252e%252e/escaped.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/folder%2forbit-comparison.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/folder%5corbit-comparison.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/./orbit-comparison.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/orbit-comparison.mp4?download=1",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/orbit-comparison.mp4#preview",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/orbit\0-comparison.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
    {
      previewUrl: "/media/curated-v2/orbit%00-comparison.mp4",
      message: /previewUrl.*\/media\/curated-v2.*\.mp4/,
    },
  ];

  for (const {message, ...override} of invalidPaths) {
    assert.throws(() => validateCuratedEntries([{...valid, ...override}]), message);
  }
});

test("rejects encoded unsafe repo-relative paths", () => {
  const invalidSourceFiles = [
    "curated-v2/shots/%2e%2e/escaped/Shot.tsx",
    "curated-v2/shots/%252e%252e/escaped/Shot.tsx",
    "curated-v2/shots/concept%2forbit-comparison/Shot.tsx",
    "curated-v2/shots/concept%5corbit-comparison/Shot.tsx",
    "curated-v2/shots/concept/orbit\0-comparison/Shot.tsx",
    "curated-v2/shots/concept/orbit%00-comparison/Shot.tsx",
    "curated-v2/shots/concept/orbit-comparison/",
    "curated-v2/shots/concept//orbit-comparison/Shot.tsx",
    "curated-v2/shots/concept/orbit-comparison/Shot.tsx?raw=1",
    "curated-v2/shots/concept/orbit-comparison/Shot.tsx#source",
    "https://example.com/curated-v2/shots/Shot.tsx",
    "curated-v2/shots/bad%/Shot.tsx",
  ];

  for (const sourceFile of invalidSourceFiles) {
    assert.throws(
      () => validateCuratedEntries([{...valid, sourceFiles: [sourceFile]}]),
      /sourceFiles.*curated-v2\/shots/,
    );
  }

  const invalidAnalysisPaths = [
    "curated-v2/references/%2e%2e/escaped/analysis.md",
    "curated-v2/references/%252e%252e/escaped/analysis.md",
    "curated-v2/references/reference-001%2forbit-comparison.md",
    "curated-v2/references/reference-001%5corbit-comparison.md",
    "curated-v2/references/reference\0-001/orbit-comparison.md",
    "curated-v2/references/reference%00-001/orbit-comparison.md",
    "curated-v2/references/reference-001/orbit-comparison.txt",
    "curated-v2/references//reference-001/orbit-comparison.md",
    "curated-v2/references/reference-001/orbit-comparison.md?raw=1",
    "curated-v2/references/reference-001/orbit-comparison.md#analysis",
    "https://example.com/curated-v2/references/analysis.md",
    "curated-v2/references/bad%/analysis.md",
  ];

  for (const analysisPath of invalidAnalysisPaths) {
    assert.throws(
      () => validateCuratedEntries([{...valid, analysisPath}]),
      /analysisPath.*curated-v2\/references.*\.md/,
    );
  }
});

test("rejects sparse manifest and entry arrays", () => {
  assert.throws(
    () => validateCuratedEntries(new Array(1)),
    /Curated entries must not be sparse/,
  );

  for (const field of ["sourceFiles", "fixtures", "tags"]) {
    const sparse = new Array(field === "fixtures" ? 3 : 1);
    assert.throws(
      () => validateCuratedEntries([{...valid, [field]: sparse}]),
      new RegExp(`${field} must not be sparse`),
    );
  }
});

test("does not trust overridden array methods or iterators", () => {
  const entries = [{...valid, qualityScore: 0}];
  entries.map = () => [];
  assert.throws(
    () => validateCuratedEntries(entries),
    /qualityScore must be at least 85/,
  );

  const fixtures = ["shortest", "default", "unexpected"];
  fixtures.includes = () => true;
  assert.throws(
    () => validateCuratedEntries([{...valid, fixtures}]),
    /fixtures must contain exactly shortest, default, stress/,
  );

  const tags = [""];
  tags.every = () => true;
  assert.throws(
    () => validateCuratedEntries([{...valid, tags}]),
    /tags must contain at least one nonempty string/,
  );

  const sourceFiles = ["../escaped.ts"];
  sourceFiles[Symbol.iterator] = function* () {
    yield "curated-v2/shots/concept/orbit-comparison/helpers.ts";
  };
  assert.throws(
    () => validateCuratedEntries([{...valid, sourceFiles}]),
    /sourceFiles.*curated-v2\/shots/,
  );
});

test("requires nonempty text fields and tags", () => {
  for (const field of [
    "familyId",
    "variantId",
    "title",
    "summary",
    "use",
    "category",
  ]) {
    assert.throws(
      () => validateCuratedEntries([{...valid, [field]: "  "}]),
      new RegExp(`${field} must be a nonempty string`),
    );
  }
  assert.throws(
    () => validateCuratedEntries([{...valid, tags: []}]),
    /tags must contain at least one nonempty string/,
  );
  assert.throws(
    () => validateCuratedEntries([{...valid, tags: ["  "]}]),
    /tags must contain at least one nonempty string/,
  );
});

test("rejects scores above 100 and non-integer scores", () => {
  for (const qualityScore of [101, 88.5]) {
    assert.throws(
      () => validateCuratedEntries([{...valid, qualityScore}]),
      /qualityScore must be an integer between 85 and 100/,
    );
  }
});
