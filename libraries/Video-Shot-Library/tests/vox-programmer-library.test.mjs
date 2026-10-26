import assert from "node:assert/strict";
import {access, readFile} from "node:fs/promises";
import {basename, dirname, join} from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";

import {createArollCards} from "../scripts/build-library-data.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const expectedIds = [
  "a-roll-022-vox-fullscreen-countup",
  "a-roll-023-vox-presenter-shrink-card",
  "a-roll-024-vox-crowd-collage-reveal",
  "a-roll-025-vox-dual-trend-countup",
  "a-roll-026-vox-evidence-highlight",
  "a-roll-027-vox-conclusion-card-stack",
];

test("registers six editable VOX programmer shots with silent previews", async () => {
  const entries = JSON.parse(
    await readFile(join(projectRoot, "source/a-roll-entries.json"), "utf8"),
  );
  const shotMetadata = JSON.parse(
    await readFile(join(projectRoot, "source/shot-metadata.json"), "utf8"),
  );
  const selected = entries.filter((entry) => expectedIds.includes(entry.id));

  assert.deepEqual(selected.map((entry) => entry.id), expectedIds);

  for (const entry of selected) {
    assert.equal(entry.status, "ready");
    assert.equal(entry.fps, 30);
    assert.equal(entry.width, 1920);
    assert.equal(entry.height, 1080);
    assert.equal(entry.sourceProjectPath, "/Users/admin/Documents/视频");
    assert.ok(entry.sourceFiles.length > 0);
    assert.ok(entry.sourceFrameRange.end > entry.sourceFrameRange.start);
    assert.equal(typeof entry.parameters, "object");
    assert.ok(shotMetadata[entry.id]);
    await access(join(projectRoot, "public/media/a-roll", basename(entry.outputPath)));
  }

  const cards = createArollCards(selected);
  assert.deepEqual(cards.map((card) => card.id), expectedIds);
  assert.equal(cards[0].sourceProjectPath, "/Users/admin/Documents/视频");
  assert.deepEqual(cards[0].sourceFiles, selected[0].sourceFiles);
  assert.deepEqual(cards[0].parameters, selected[0].parameters);
  assert.deepEqual(cards[0].sourceFrameRange, selected[0].sourceFrameRange);
});
