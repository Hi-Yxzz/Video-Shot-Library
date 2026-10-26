import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { cleanGitRevision } from "../scripts/import-graded-libraries.mjs";
import {
  importGradedLibraries,
  namespacedId,
} from "../scripts/graded-library.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const execFileAsync = promisify(execFile);

function countBy(entries, key) {
  return Object.fromEntries(
    [...new Set(entries.map((entry) => entry[key]))]
      .sort()
      .map((value) => [
        value,
        entries.filter((entry) => entry[key] === value).length,
      ]),
  );
}

async function hiddenStateDirectories(root) {
  const matches = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === ".git" || entry.name === ".omc") {
      matches.push(join(root, entry.name));
      continue;
    }
    matches.push(...await hiddenStateDirectories(join(root, entry.name)));
  }
  return matches;
}

test("imports only Remocn and Remotion Bits S/A/B shots", async () => {
  const shots = [
    {
      id: "hero",
      source: "Remocn",
      name: "Hero",
      description: "Hero scene",
      reason: "Reusable",
      category: "视觉效果",
      grade: "S",
      score: 90,
    },
    {
      id: "terminal",
      source: "Remotion Bits",
      name: "Terminal",
      description: "Terminal scene",
      reason: "Practical",
      category: "代码演示",
      grade: "A",
      score: 80,
    },
    {
      id: "discarded",
      source: "RVE",
      name: "Discarded",
      description: "Excluded source",
      reason: "Deferred",
      category: "组合场景",
      grade: "S",
      score: 95,
    },
    {
      id: "also-discarded",
      source: "Remocn UI",
      name: "Also discarded",
      description: "Excluded grade",
      reason: "Below threshold",
      category: "UI组件",
      grade: "C",
      score: 55,
    },
  ];
  const bitsRegistry = {
    items: [
      {
        type: "bit",
        name: "terminal",
        files: [{ relativePath: "src/bits/terminal.tsx" }],
      },
    ],
  };
  const catalog = importGradedLibraries({ shots, bitsRegistry });

  assert.deepEqual(catalog.cards.map((card) => card.id), [
    "remocn/hero",
    "remotion-bits/terminal",
  ]);
  assert.equal(catalog.cards.some((card) => card.grade === "C"), false);
  assert.equal(catalog.cards.some((card) => card.collection === "rve"), false);
  assert.equal(
    catalog.cards.find((card) => card.id === "remocn/hero").category,
    "effects",
  );
  assert.equal(
    catalog.cards.find((card) => card.id === "remotion-bits/terminal").category,
    "interaction",
  );
});

test("rejects unknown upstream categories with the shot id", () => {
  assert.throws(
    () =>
      importGradedLibraries({
        shots: [
          {
            id: "unknown",
            source: "Remocn",
            name: "Unknown",
            description: "Unknown category",
            reason: "Must be classified",
            category: "未定义类别",
            grade: "A",
            score: 80,
          },
        ],
        bitsRegistry: { items: [] },
      }),
    /Unknown graded shot category "未定义类别" for remocn\/unknown/,
  );
});

test("uses namespaced ids and local player paths", async () => {
  const catalog = JSON.parse(
    await readFile(join(projectRoot, "source/graded-library.json"), "utf8"),
  );

  assert.equal(catalog.cards.length, 174);
  assert.deepEqual(countBy(catalog.cards, "grade"), {
    A: 50,
    B: 100,
    S: 24,
  });
  assert.deepEqual(countBy(catalog.cards, "collection"), {
    remocn: 104,
    "remocn-ui": 34,
    "remotion-bits": 36,
  });
  assert.equal(new Set(catalog.cards.map((card) => card.id)).size, 174);
  assert.match(catalog.sources.remocn.revision, /^[0-9a-f]{40}$/);
  assert.match(catalog.sources["remotion-bits"].revision, /^[0-9a-f]{40}$/);
  const categoryById = new Map(
    catalog.cards.map((card) => [card.id, card.category]),
  );
  assert.equal(categoryById.get("remocn/hand-count"), "typography");
  assert.equal(categoryById.get("remocn/drift"), "camera");
  assert.equal(categoryById.get("remocn/shared-axis-y"), "transition");
  assert.equal(categoryById.get("remocn/shader-god-rays"), "effects");
  for (const card of catalog.cards) {
    assert.match(card.id, /^(remocn|remocn-ui|remotion-bits)\//);
    assert.equal(card.previewKind, "player");
    assert.match(
      card.playerUrl,
      /^\/players\/(remocn|remotion-bits)\/index\.html$/,
    );
    assert.match(card.compositionId, /^[a-z0-9-]+$/);
    assert.ok(
      card.codeFiles.every((file) => file.startsWith("library-sources/")),
    );
  }
});

test("rejects unsafe graded shot identifiers", () => {
  assert.throws(
    () => namespacedId("remocn", "../../private"),
    /Invalid graded shot identifier/,
  );
  assert.throws(
    () => namespacedId("rve", "valid-id"),
    /Invalid graded shot identifier/,
  );
});

test("source snapshots exclude repository and agent state", async () => {
  assert.deepEqual(
    await hiddenStateDirectories(join(projectRoot, "library-sources")),
    [],
  );
});

test("rejects dirty upstream repositories before recording revisions", async () => {
  const repository = await mkdtemp(join(tmpdir(), "shotcraft-upstream-"));
  try {
    await execFileAsync("git", ["init"], { cwd: repository });
    await writeFile(join(repository, "tracked.txt"), "committed\n");
    await execFileAsync("git", ["add", "tracked.txt"], { cwd: repository });
    await execFileAsync(
      "git",
      [
        "-c",
        "user.name=Shotcraft Test",
        "-c",
        "user.email=shotcraft@example.invalid",
        "commit",
        "-m",
        "fixture",
      ],
      { cwd: repository },
    );

    assert.match(await cleanGitRevision(repository), /^[0-9a-f]{40}$/);
    await writeFile(join(repository, "untracked.txt"), "dirty\n");
    await assert.rejects(
      cleanGitRevision(repository),
      /Upstream repository must be clean/,
    );
  } finally {
    await rm(repository, { recursive: true, force: true });
  }
});
