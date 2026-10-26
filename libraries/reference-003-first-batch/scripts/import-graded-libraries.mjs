import { execFile } from "node:child_process";
import { cp, lstat, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { importGradedLibraries } from "./graded-library.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(scriptPath), "..");
const execFileAsync = promisify(execFile);

function requiredOption(name) {
  const index = process.argv.indexOf(name);
  const value = index === -1 ? undefined : process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new TypeError(`Missing required option: ${name}`);
  }
  return value;
}

export async function cleanGitRevision(root) {
  const { stdout: status } = await execFileAsync(
    "git",
    ["status", "--porcelain=v1", "--untracked-files=all"],
    { cwd: root },
  );
  if (status.trim()) {
    throw new TypeError(`Upstream repository must be clean: ${root}`);
  }

  const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], {
    cwd: root,
  });
  return stdout.trim();
}

async function assertNoSymlinks(root) {
  const rootInfo = await lstat(root);
  if (rootInfo.isSymbolicLink()) {
    throw new TypeError(`Source snapshots cannot contain symlinks: ${root}`);
  }
  if (!rootInfo.isDirectory()) {
    return;
  }

  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const target = resolve(root, entry.name);
    const info = await lstat(target);
    if (info.isSymbolicLink()) {
      throw new TypeError(`Source snapshots cannot contain symlinks: ${target}`);
    }
    if (info.isDirectory() && entry.name !== ".git") {
      await assertNoSymlinks(target);
    }
  }
}

async function copySelectedSnapshot(sourceRoot, destinationRoot, entries) {
  const temporaryRoot = `${destinationRoot}.tmp-${process.pid}`;
  const backupRoot = `${destinationRoot}.backup-${process.pid}`;
  await rm(temporaryRoot, { recursive: true, force: true });
  await mkdir(temporaryRoot, { recursive: true });

  for (const entry of entries) {
    const source = resolve(sourceRoot, entry);
    const destination = resolve(temporaryRoot, entry);
    await assertNoSymlinks(source);
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination, {
      recursive: true,
      force: false,
      errorOnExist: true,
      filter: (path) => ![".git", ".omc"].includes(basename(path)),
    });
  }

  await rm(backupRoot, { recursive: true, force: true });
  try {
    await rename(destinationRoot, backupRoot);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await rename(temporaryRoot, destinationRoot);
  await rm(backupRoot, { recursive: true, force: true });
}

export async function importSnapshots({
  gradesPath,
  remocnRoot,
  bitsRoot,
  root = projectRoot,
}) {
  const [shots, bitsRegistry, remocnRevision, bitsRevision] = await Promise.all([
    readFile(gradesPath, "utf8").then(JSON.parse),
    readFile(resolve(bitsRoot, "registry.json"), "utf8").then(JSON.parse),
    cleanGitRevision(remocnRoot),
    cleanGitRevision(bitsRoot),
  ]);
  const catalog = importGradedLibraries({ shots, bitsRegistry });
  catalog.sources = {
    remocn: {
      repository: "https://github.com/Remocn/remocn",
      revision: remocnRevision,
    },
    "remotion-bits": {
      repository: "https://github.com/av/remotion-bits",
      revision: bitsRevision,
    },
  };

  await mkdir(resolve(root, "library-sources"), { recursive: true });
  await Promise.all([
    copySelectedSnapshot(
      remocnRoot,
      resolve(root, "library-sources/remocn"),
      [
        "LICENSE",
        "package.json",
        "tsconfig.json",
        "app/globals.css",
        "app/typeset.css",
        "components",
        "lib",
        "public",
        "registry",
        "src",
      ],
    ),
    copySelectedSnapshot(
      bitsRoot,
      resolve(root, "library-sources/remotion-bits"),
      [
        "README.md",
        "package.json",
        "tsconfig.json",
        "registry.json",
        "src",
        "docs/src/bits",
      ],
    ),
  ]);

  await writeFile(
    resolve(root, "source/graded-library.json"),
    `${JSON.stringify(catalog, null, 2)}\n`,
  );
  return catalog;
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const catalog = await importSnapshots({
    gradesPath: requiredOption("--grades"),
    remocnRoot: requiredOption("--remocn"),
    bitsRoot: requiredOption("--bits"),
  });
  console.log(`Imported ${catalog.cards.length} graded shots.`);
}
