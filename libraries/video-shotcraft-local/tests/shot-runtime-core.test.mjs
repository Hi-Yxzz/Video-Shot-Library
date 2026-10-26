import assert from "node:assert/strict";
import test from "node:test";

import {
  InvalidShotParameterError,
  ShotNotExecutableError,
  ShotNotFoundError,
  ShotRegistryError,
  UnsupportedShotParameterError,
} from "../shot-runtime/errors.ts";
import {
  createComposition,
  createProps,
  filterShots,
  searchShotDefinitions,
  suggestShotIds,
} from "../shot-runtime/core.ts";

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
    key: "custom.color",
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

const definitions = [
  {
    kind: "executable",
    id: "remocn/hand-count",
    metadata: {
      title: "手写数字计数",
      summary: "手写数字逐步变化",
      use: "指标展示",
      category: "typography",
      collection: "remocn",
      grade: "S",
      tags: ["数字", "计数器", "手写"],
    },
  },
  {
    kind: "reference",
    id: "paper-title-card",
    metadata: {
      title: "纸张标题卡",
      summary: "文字压印在纸张上",
      use: "章节标题",
      category: "typography",
      collection: "video-shotcraft",
      grade: null,
      tags: ["标题", "纹理"],
    },
  },
  {
    kind: "executable",
    id: "remotion-bits/bit-basic-counter",
    metadata: {
      title: "基础数字计数",
      summary: "数字平滑计数",
      use: "数据展示",
      category: "data",
      collection: "remotion-bits",
      grade: "A",
      tags: ["数字", "计数器"],
    },
  },
];

test("filterShots combines exact filters and OR tag matching", () => {
  assert.deepEqual(
    filterShots(definitions, {
      kind: "executable",
      grade: "S",
      tags: ["计数器", "图表"],
    }).map((shot) => shot.id),
    ["remocn/hand-count"],
  );
  assert.deepEqual(
    filterShots(definitions, {
      category: "typography",
      tags: ["手写", "纹理"],
    }).map((shot) => shot.id),
    ["remocn/hand-count", "paper-title-card"],
  );
});

test("searchShotDefinitions searches Chinese metadata and tags", () => {
  assert.deepEqual(
    searchShotDefinitions(definitions, "手写").map((shot) => shot.id),
    ["remocn/hand-count"],
  );
  assert.deepEqual(
    searchShotDefinitions(definitions, "章节标题").map((shot) => shot.id),
    ["paper-title-card"],
  );
});

test("suggestShotIds ranks nearby stable ids", () => {
  assert.deepEqual(
    suggestShotIds(
      "remocn/hand-cout",
      definitions.map((shot) => shot.id),
      1,
    ),
    ["remocn/hand-count"],
  );
});
