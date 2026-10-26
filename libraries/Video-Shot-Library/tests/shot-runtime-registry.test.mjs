import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createShotRegistry,
  getShotFromRegistry,
} from "../shot-runtime/registry.ts";

const projectUrl = new URL("../", import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, projectUrl), "utf8"));
}

test("runtime source adapters cover every executable catalog family", async () => {
  const [library, remocnManifest, bitsManifest, remocnSource, bitsSource] =
    await Promise.all([
      readJson("public/data/library.json"),
      readJson("players/remocn/src/manifest.json"),
      readJson("players/remotion-bits/src/manifest.json"),
      readFile(
        new URL("shot-runtime/adapters/remocn.ts", projectUrl),
        "utf8",
      ),
      readFile(
        new URL("shot-runtime/adapters/remotion-bits.ts", projectUrl),
        "utf8",
      ),
    ]);
  const executableCards = library.cards.filter(
    (card) => card.previewKind === "player",
  );
  const referenceCards = library.cards.filter(
    (card) => card.previewKind === "video",
  );

  assert.equal(executableCards.length, 174);
  assert.equal(referenceCards.length, 184);
  assert.equal(Object.keys(remocnManifest).length, 138);
  assert.equal(Object.keys(bitsManifest).length, 36);
  assert.match(remocnSource, /remocnScenes/);
  assert.match(remocnSource, /remocn-ui\//);
  assert.match(remocnSource, /remocn\//);
  assert.match(bitsSource, /bitScenes/);
  assert.match(bitsSource, /remotion-bits\//);
});

const fakeComponent = () => null;
const fakeCards = [
  {
    id: "remocn/hand-count",
    title: "手写数字计数",
    summary: "手写数字逐步变化",
    use: "指标展示",
    category: "typography",
    collection: "remocn",
    grade: "S",
    tags: ["数字", "计数器", "手写"],
    previewKind: "player",
    codeFiles: ["library-sources/remocn/hand-count.tsx"],
    styles: [],
  },
  {
    id: "paper-title-card",
    title: "纸张标题卡",
    summary: "文字压印在纸张上",
    use: "章节标题",
    category: "typography",
    collection: "video-shotcraft",
    grade: null,
    tags: ["标题", "纹理"],
    previewKind: "video",
    codeFiles: [],
    styles: [{ previewUrl: "https://example.com/paper-title-card.mp4" }],
  },
];
const fakeAdapters = {
  "remocn/hand-count": {
    Component: fakeComponent,
    composition: {
      id: "remocn/hand-count",
      width: 1920,
      height: 1080,
      fps: 30,
      durationInFrames: 90,
    },
    inputProps: { to: 100, color: "#ffffff" },
    controls: [
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
    ],
    commonMappings: { primaryColor: "color" },
  },
};

test("createShotRegistry joins executable and reference definitions", () => {
  const registry = createShotRegistry(fakeCards, fakeAdapters);
  const executable = registry.get("remocn/hand-count");
  const reference = registry.get("paper-title-card");

  assert.equal(executable.kind, "executable");
  assert.equal(executable.Component, fakeComponent);
  assert.deepEqual(
    executable.createProps({
      primaryColor: "#ff5a1f",
      custom: { to: 250 },
    }),
    { to: 250, color: "#ff5a1f" },
  );
  assert.equal(
    executable.createComposition({ durationInFrames: 120 }).durationInFrames,
    120,
  );
  assert.equal(reference.kind, "reference");
  assert.equal(
    reference.previewUrl,
    "https://example.com/paper-title-card.mp4",
  );
});

test("createShotRegistry requires exact executable adapter coverage", () => {
  assert.throws(
    () => createShotRegistry(fakeCards, {}),
    /Missing executable shot adapter: remocn\/hand-count/,
  );
  assert.throws(
    () => createShotRegistry(fakeCards, {
      ...fakeAdapters,
      "remocn/ghost": fakeAdapters["remocn/hand-count"],
    }),
    /Unknown shot adapter: remocn\/ghost/,
  );
});

test("getShotFromRegistry reports nearby ids", () => {
  const registry = createShotRegistry(fakeCards, fakeAdapters);
  assert.equal(
    getShotFromRegistry(registry, "remocn/hand-count").id,
    "remocn/hand-count",
  );
  assert.throws(
    () => getShotFromRegistry(registry, "remocn/hand-cout"),
    /Did you mean: remocn\/hand-count/,
  );
});

test("public runtime entry exports the stable query API", async () => {
  const source = await readFile(
    new URL("shot-runtime/index.ts", projectUrl),
    "utf8",
  );

  for (const name of [
    "getShot",
    "hasShot",
    "listShots",
    "searchShots",
    "getShotControls",
  ]) {
    assert.match(source, new RegExp(`export function ${name}`));
  }
});
