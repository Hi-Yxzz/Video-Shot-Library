import assert from "node:assert/strict";
import test from "node:test";

import {
  applyShotMetadata,
  validateShotMetadata,
} from "../scripts/shot-metadata.mjs";

const cards = [{ id: "remocn/hand-count", title: "Hand Count" }];
const valid = {
  "remocn/hand-count": {
    titleZh: "手写数字计数",
    tags: ["数字", "计数器", "手写"],
  },
};

test("validates and applies Chinese shot metadata", () => {
  assert.deepEqual(validateShotMetadata(cards, valid), valid);
  assert.deepEqual(applyShotMetadata(cards, valid)[0], {
    id: "remocn/hand-count",
    title: "手写数字计数",
    tags: ["数字", "计数器", "手写"],
  });
});

test("requires exact metadata coverage", () => {
  assert.throws(() => validateShotMetadata(cards, {}), /Missing metadata.*hand-count/);
  assert.throws(
    () => validateShotMetadata(cards, { ...valid, ghost: valid["remocn/hand-count"] }),
    /Unknown metadata id: ghost/,
  );
});

test("requires Chinese titles and known unique tags", () => {
  assert.throws(
    () => validateShotMetadata(cards, {
      "remocn/hand-count": { titleZh: "Hand Count", tags: ["数字"] },
    }),
    /Chinese title/,
  );
  assert.throws(
    () => validateShotMetadata(cards, {
      "remocn/hand-count": { titleZh: "手写计数", tags: ["数字", "数字"] },
    }),
    /duplicate tag/,
  );
  assert.throws(
    () => validateShotMetadata(cards, {
      "remocn/hand-count": { titleZh: "手写计数", tags: ["不存在"] },
    }),
    /unknown tag/,
  );
});
