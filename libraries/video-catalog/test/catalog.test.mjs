import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot =
  process.env.VIDEO_WORKSPACE_ROOT ?? resolve(root, "..");
const readJson = (relativePath) =>
  JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
const resolveExternalPath = (relativePath) =>
  relativePath.startsWith("../")
    ? resolve(workspaceRoot, relativePath.slice(3))
    : resolve(root, relativePath);

test("catalog manifests and referenced assets exist", () => {
  const catalog = readJson("catalog.json");
  assert.equal(catalog.schemaVersion, 1);

  for (const category of catalog.categories) {
    assert.ok(existsSync(resolve(root, category.manifest)));
  }

  const entries = readJson("A-roll/entries.json");
  assert.equal(entries.length, new Set(entries.map((entry) => entry.id)).size);
  assert.ok(entries.every((entry) => entry.rollType === "A-roll"));
  assert.ok(
    entries.every((entry) =>
      ["draft", "ready", "archived"].includes(entry.status),
    ),
  );

  for (const entry of entries) {
    assert.ok(existsSync(resolveExternalPath(entry.projectPath)));
    assert.ok(existsSync(resolveExternalPath(entry.previewPath)));
    assert.ok(existsSync(resolveExternalPath(entry.outputPath)));
  }

  const bRoll = readJson("B-roll/sources.json");
  assert.equal(bRoll.rollType, "B-roll");
  for (const source of bRoll.sources) {
    assert.ok(existsSync(resolveExternalPath(source.manifestPath)));
  }
});
