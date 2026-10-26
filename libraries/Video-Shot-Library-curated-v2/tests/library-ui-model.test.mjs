import assert from "node:assert/strict";
import test from "node:test";

import {
  filterCards,
  getCategoryCounts,
  getTagCounts,
} from "../app/library-model.ts";

const cards = [
  {
    id: "alpha-shot",
    title: "Alpha Title",
    tags: ["标题", "品牌"],
    summary: "中文开场镜头",
    use: "品牌发布",
    category: "opening",
    collection: "remocn",
    grade: "S",
    styles: [
      { key: "warm-focus", label: "Warm Focus" },
      { key: "hero-card", label: "主视觉卡片" },
    ],
  },
  {
    id: "beta-shot",
    title: "Beta Title",
    tags: ["图表", "指标"],
    summary: "数据指标逐条浮现",
    use: "产品复盘",
    category: "data",
    collection: "remotion-bits",
    grade: "A",
    styles: [{ key: "metric-rise", label: "Metric Rise" }],
  },
  {
    id: "gamma-shot",
    title: "Gamma Title",
    tags: ["品牌", "收尾"],
    summary: "收尾定格",
    use: "品牌发布",
    category: "outro",
    collection: "video-shotcraft",
    grade: null,
    styles: [{ key: "quiet-end", label: "Quiet End" }],
  },
];

test("filterCards supports all cards and exact category filters", () => {
  assert.deepEqual(
    filterCards(cards, "", "all").map((card) => card.id),
    ["alpha-shot", "beta-shot", "gamma-shot"],
  );
  assert.deepEqual(
    filterCards(cards, "", "data").map((card) => card.id),
    ["beta-shot"],
  );
});

test("filterCards searches card id, title, Chinese copy, and style identifiers", () => {
  const expectations = new Map([
    ["ALPHA-SHOT", ["alpha-shot"]],
    ["beta title", ["beta-shot"]],
    ["中文开场", ["alpha-shot"]],
    ["产品复盘", ["beta-shot"]],
    ["HERO-CARD", ["alpha-shot"]],
    ["metric rise", ["beta-shot"]],
    ["主视觉卡片", ["alpha-shot"]],
  ]);

  for (const [query, expected] of expectations) {
    assert.deepEqual(
      filterCards(cards, query, "all").map((card) => card.id),
      expected,
      query,
    );
  }
});

test("filterCards trims blank queries and combines text with category filters", () => {
  assert.deepEqual(
    filterCards(cards, "   ", "all").map((card) => card.id),
    ["alpha-shot", "beta-shot", "gamma-shot"],
  );
  assert.deepEqual(
    filterCards(cards, "品牌发布", "opening").map((card) => card.id),
    ["alpha-shot"],
  );
  assert.deepEqual(filterCards(cards, "品牌发布", "data"), []);
});

test("filterCards preserves input order without mutating cards", () => {
  const snapshot = structuredClone(cards);

  assert.deepEqual(
    filterCards(cards, "品牌发布", "all").map((card) => card.id),
    ["alpha-shot", "gamma-shot"],
  );
  assert.deepEqual(cards, snapshot);
});

test("filterCards combines grade and multi-select tag filters with OR matching", () => {
  assert.deepEqual(
    filterCards(cards, "", "all", { grade: "S", tags: [] })
      .map((card) => card.id),
    ["alpha-shot"],
  );
  assert.deepEqual(
    filterCards(cards, "", "all", {
      grade: "all",
      tags: ["标题", "图表"],
    }).map((card) => card.id),
    ["alpha-shot", "beta-shot"],
  );
  assert.deepEqual(
    filterCards(cards, "", "data", {
      grade: "A",
      tags: ["指标"],
    }).map((card) => card.id),
    ["beta-shot"],
  );
});

test("filterCards searches secondary tags", () => {
  assert.deepEqual(
    filterCards(cards, "指标", "all").map((card) => card.id),
    ["beta-shot"],
  );
});

test("getCategoryCounts returns all and per-category totals", () => {
  assert.deepEqual(getCategoryCounts(cards), {
    all: 3,
    opening: 1,
    data: 1,
    outro: 1,
  });
});

test("getTagCounts counts each tag across cards", () => {
  assert.deepEqual(getTagCounts(cards), {
    标题: 1,
    品牌: 2,
    图表: 1,
    指标: 1,
    收尾: 1,
  });
});
