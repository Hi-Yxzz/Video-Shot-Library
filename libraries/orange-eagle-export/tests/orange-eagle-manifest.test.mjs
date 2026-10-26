import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  getLocalRenderTarget,
  loadTargets,
} from "../scripts/orange-eagle/manifest.mjs";

const libraryPath = fileURLToPath(
  new URL("../public/data/library.json", import.meta.url),
);

test("selects the 98 camera, data, and typography previews", async () => {
  const targets = await loadTargets(libraryPath);
  const identities = new Set(targets.map(({ identity }) => identity));

  assert.equal(targets.length, 98);
  assert.equal(identities.size, 98);
  assert.deepEqual(
    Object.fromEntries(
      ["camera", "data", "typography"].map((category) => [
        category,
        targets.filter((target) => target.categoryId === category).length,
      ]),
    ),
    { camera: 23, data: 20, typography: 55 },
  );
});

test("splits existing video-shotcraft from 51 new entries", async () => {
  const targets = await loadTargets(libraryPath);

  assert.equal(
    targets.filter(({ collection }) => collection === "video-shotcraft").length,
    47,
  );
  assert.equal(
    targets.filter(({ collection }) => collection !== "video-shotcraft").length,
    51,
  );
});

test("uses composition ids for repeated default player styles", async () => {
  const targets = await loadTargets(libraryPath);
  const player = targets.find(
    ({ cardId }) => cardId === "remocn/animated-bar-chart",
  );

  assert.equal(player.styleKey, "default");
  assert.equal(player.compositionId, "animated-bar-chart");
  assert.equal(player.identity, "animated-bar-chart");
});

test("resolves missing local media to its source Remotion composition", () => {
  const renderTarget = getLocalRenderTarget(
    { cardId: "xcyj-point-questionpush" },
    [
      {
        id: "xcyj-point-questionpush",
        projectPath: "../remotion-photo-replica",
        compositionId: "XcyjPointQuestionPush",
      },
    ],
    "/Users/admin/Desktop/Codex/Video-Shot-Library",
  );

  assert.deepEqual(renderTarget, {
    projectPath: "/Users/admin/Desktop/Codex/remotion-photo-replica",
    compositionId: "XcyjPointQuestionPush",
  });
});
