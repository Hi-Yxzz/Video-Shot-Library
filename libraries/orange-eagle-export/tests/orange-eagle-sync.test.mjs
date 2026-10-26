import assert from "node:assert/strict";
import { test } from "node:test";

import {
  decideSyncAction,
  retryOperation,
  summarizeActions,
} from "../scripts/orange-eagle/sync.mjs";

test("adds missing identities", () => {
  assert.deepEqual(decideSyncAction("new-shot", []), {
    identity: "new-shot",
    action: "add",
    item: null,
  });
});

test("replaces a single existing identity", () => {
  const item = { id: "ITEM1", name: "existing-shot" };
  assert.deepEqual(decideSyncAction("existing-shot", [item]), {
    identity: "existing-shot",
    action: "replace",
    item,
  });
});

test("flags duplicate identities as conflicts", () => {
  const matches = [
    { id: "ITEM1", name: "duplicate-shot" },
    { id: "ITEM2", name: "duplicate-shot" },
  ];
  assert.deepEqual(decideSyncAction("duplicate-shot", matches), {
    identity: "duplicate-shot",
    action: "conflict",
    items: matches,
  });
});

test("summarizes the approved 47 replace and 51 add split", () => {
  const actions = [
    ...Array.from({ length: 47 }, (_, index) => ({
      action: "replace",
      identity: `existing-${index}`,
    })),
    ...Array.from({ length: 51 }, (_, index) => ({
      action: "add",
      identity: `new-${index}`,
    })),
  ];

  assert.deepEqual(summarizeActions(actions), {
    add: 51,
    replace: 47,
    conflict: 0,
  });
});

test("retries transient operations up to three attempts", async () => {
  let attempts = 0;
  const result = await retryOperation(async () => {
    attempts += 1;
    if (attempts < 3) throw new Error("transient");
    return "ok";
  });

  assert.equal(result, "ok");
  assert.equal(attempts, 3);
});
