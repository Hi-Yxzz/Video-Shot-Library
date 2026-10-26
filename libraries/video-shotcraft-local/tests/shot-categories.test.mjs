import assert from "node:assert/strict";
import test from "node:test";

import {
  categoryForGradedShot,
  categoryForLibraryCard,
} from "../scripts/shot-categories.mjs";

test("classifies text and number performances as typography", () => {
  for (const id of [
    "hand-count",
    "handwrite",
    "kinetic-center-build",
    "line-by-line-slide",
    "mask-reveal-up",
    "rolodex-flip",
    "slot-machine-roll",
    "spring-scale-in",
    "staggered-fade-up",
    "strikethrough-replace",
  ]) {
    assert.equal(
      categoryForGradedShot({
        collection: "remocn",
        id,
        upstreamCategory: "视觉效果",
      }),
      "typography",
    );
  }
});

test("separates page movement by visual purpose", () => {
  const expected = new Map([
    ["drift", "camera"],
    ["fade-through", "transition"],
    ["icon-scatter", "transition"],
    ["push-through", "transition"],
    ["ripple-zoom", "transition"],
    ["shared-axis-y", "transition"],
    ["shared-axis-z", "transition"],
  ]);

  for (const [id, category] of expected) {
    assert.equal(
      categoryForGradedShot({
        collection: "remocn",
        id,
        upstreamCategory: "视觉效果",
      }),
      category,
    );
  }
});

test("keeps pure shaders and particles in effects", () => {
  assert.equal(
    categoryForGradedShot({
      collection: "remocn",
      id: "shader-god-rays",
      upstreamCategory: "Shader背景",
    }),
    "effects",
  );
  assert.equal(
    categoryForGradedShot({
      collection: "remotion-bits",
      id: "bit-fireflies",
      upstreamCategory: "粒子效果",
    }),
    "effects",
  );
});

test("applies unified overrides to existing cards from every collection", () => {
  assert.equal(
    categoryForLibraryCard({
      collection: "video-shotcraft",
      id: "line-boil",
      category: "effects",
    }),
    "typography",
  );
  assert.equal(
    categoryForLibraryCard({
      collection: "remocn",
      upstreamId: "drift",
      category: "effects",
    }),
    "camera",
  );
});

test("rejects unknown graded categories instead of defaulting to effects", () => {
  assert.throws(
    () =>
      categoryForGradedShot({
        collection: "remocn",
        id: "new-shot",
        upstreamCategory: "未定义类别",
      }),
    /Unknown graded shot category "未定义类别" for remocn\/new-shot/,
  );
});
