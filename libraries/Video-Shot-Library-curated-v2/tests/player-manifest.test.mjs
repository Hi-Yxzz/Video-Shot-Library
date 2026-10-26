import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  createPlayerManifests,
  createRemocnScenesSource,
  resolveShotId,
} from "../scripts/player-manifests.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

async function manifests() {
  const catalog = JSON.parse(
    await readFile(join(projectRoot, "source/graded-library.json"), "utf8"),
  );
  return createPlayerManifests(catalog);
}

test("Remocn manifest covers all 138 imported cards", async () => {
  const { remocn } = await manifests();

  assert.equal(Object.keys(remocn).length, 138);
  assert.equal(
    remocn["soft-blur-in"].compositionId,
    "soft-blur-in",
  );
  assert.equal(remocn["signup-flow"].compositionId, "signup-flow");
  assert.equal(remocn["claude-chat"].compositionId, "claude-chat");
});

test("Remotion Bits manifest covers all 36 imported cards", async () => {
  const { bits } = await manifests();

  assert.equal(Object.keys(bits).length, 36);
  assert.equal(bits["bit-terminal-3d"].compositionId, "bit-terminal-3d");
  assert.match(
    bits["bit-terminal-3d"].modulePath,
    /docs\/src\/bits\/examples\/scene-3d\/Terminal3D\.tsx$/,
  );
});

test("Remotion Bits player defaults incomplete upstream metadata", async () => {
  const playerSource = await readFile(
    join(projectRoot, "players/remotion-bits/src/main.tsx"),
    "utf8",
  );

  assert.match(playerSource, /scene\.metadata\.duration \?\? 180/);
  assert.match(playerSource, /scene\.metadata\.width \?\? 1920/);
  assert.match(playerSource, /scene\.metadata\.height \?\? 1080/);
});

test("player query parser accepts known ids and rejects unknown ids", async () => {
  const { remocn } = await manifests();

  assert.equal(
    resolveShotId("?shot=soft-blur-in", remocn),
    "soft-blur-in",
  );
  assert.throws(
    () => resolveShotId("?shot=../../secret", remocn),
    /Unknown shot/,
  );
  assert.throws(() => resolveShotId("", remocn), /Unknown shot/);
});

test("generated Remocn scenes retain editable control metadata", async () => {
  const { remocn } = await manifests();
  const source = createRemocnScenesSource(remocn, new Set());

  assert.match(source, /controls: config\?\.controls \?\? \{\}/);
  assert.match(source, /inputProps/);
});

test("Remocn player pins Tailwind scanning to its vendored source", async () => {
  const viteConfig = await readFile(
    join(projectRoot, "players/remocn/vite.config.ts"),
    "utf8",
  );

  assert.match(viteConfig, /import tailwindcssPostcss from "@tailwindcss\/postcss"/);
  assert.match(
    viteConfig,
    /tailwindcssPostcss\(\{\s*base: remocnSourceRoot,\s*\}\)/,
  );
});
