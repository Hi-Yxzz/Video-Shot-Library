import { spawn } from "node:child_process";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

import { writeOrangeCube } from "./orange-eagle/lut.mjs";
import {
  getLocalRenderTarget,
  loadTargets,
} from "./orange-eagle/manifest.mjs";
import {
  decideSyncAction,
  retryOperation,
  summarizeActions,
} from "./orange-eagle/sync.mjs";

const execFileAsync = promisify(execFile);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const libraryPath = join(projectRoot, "public/data/library.json");
const workRoot = "/tmp/orange-eagle-export-v1";
const sourceDir = join(workRoot, "source");
const orangeDir = join(workRoot, "orange");
const lutPath = join(workRoot, "ff6900.cube");
const backupDir = "/Users/admin/Documents/orange-eagle-backups";
const originalProjectRoot = "/Users/admin/Desktop/Codex/Video-Shot-Library";
const eagleLibrary = "/Users/admin/Documents/镜头库.library";
const eagleImages = join(eagleLibrary, "images");
const eagleBase = "http://localhost:41595";
const execute = process.argv.includes("--execute");

const safeName = (value) =>
  value.replaceAll(/[^a-zA-Z0-9._-]+/g, "-").replaceAll(/^-+|-+$/g, "");

async function eaglePost(path, body) {
  const response = await fetch(`${eagleBase}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (result.status !== "success") {
    throw new Error(`${path}: ${JSON.stringify(result)}`);
  }
  return result.data;
}

async function eagleGet(path) {
  const response = await fetch(`${eagleBase}${path}`);
  const result = await response.json();
  if (result.status !== "success") {
    throw new Error(`${path}: ${JSON.stringify(result)}`);
  }
  return result.data;
}

async function getAllEagleItems() {
  const result = await eaglePost("/api/v2/item/get", { limit: 1000 });
  return result.data;
}

function flattenFolders(folders, output = []) {
  for (const folder of folders) {
    output.push(folder);
    flattenFolders(folder.children ?? [], output);
  }
  return output;
}

async function findEagleVideo(item) {
  const infoDir = join(eagleImages, `${item.id}.info`);
  const entries = await readdir(infoDir);
  const video = entries.find((entry) => entry.toLowerCase().endsWith(".mp4"));
  if (!video) throw new Error(`No MP4 found for Eagle item ${item.id} ${item.name}`);
  return join(infoDir, video);
}

async function validVideo(path) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=codec_name,width,height,nb_frames:format=duration",
      "-of",
      "json",
      path,
    ]);
    const data = JSON.parse(stdout);
    const stream = data.streams?.[0];
    return Boolean(
      stream?.codec_name &&
        stream.width > 0 &&
        stream.height > 0 &&
        Number(data.format?.duration) > 0,
    );
  } catch {
    return false;
  }
}

async function run(command, args, cwd = projectRoot) {
  await new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: process.env,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} exited with ${code}`));
    });
  });
}

async function acquireSource(target, action, destination) {
  if (await validVideo(destination)) return;

  if (target.previewKind === "player") {
    await retryOperation(async (attempt) => {
      if (attempt > 1) {
        console.log(`retry ${attempt}/3 ${target.compositionId}`);
      }
      await run("npx", [
        "remotion",
        "render",
        "players/export/index.ts",
        target.compositionId,
        destination,
        "--config=players/export/remotion.config.ts",
        "--codec=h264",
        "--crf=23",
        "--pixel-format=yuv420p",
        "--concurrency=50%",
        "--log=warn",
      ]);
    });
    return;
  }

  if (action.action === "replace") {
    await copyFile(await findEagleVideo(action.item), destination);
    return;
  }

  if (target.mediaUrl.startsWith("/")) {
    const localPath = join(projectRoot, "public", target.mediaUrl.split("?")[0]);
    try {
      await copyFile(localPath, destination);
    } catch (error) {
      if (error.code !== "ENOENT" || !target.localRender) throw error;
      await retryOperation(async (attempt) => {
        if (attempt > 1) {
          console.log(`retry ${attempt}/3 ${target.localRender.compositionId}`);
        }
        await run(
          "npx",
          [
            "remotion",
            "render",
            target.localRender.compositionId,
            destination,
            "--muted",
            "--overwrite",
            "--codec=h264",
            "--crf=23",
            "--pixel-format=yuv420p",
            "--concurrency=50%",
            "--log=warn",
          ],
          target.localRender.projectPath,
        );
      });
    }
    return;
  }

  const response = await fetch(target.mediaUrl);
  if (!response.ok) {
    throw new Error(`Download failed ${response.status}: ${target.mediaUrl}`);
  }
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function recolor(source, destination) {
  if (await validVideo(destination)) return;
  const temporary = `${destination}.partial.mp4`;
  await execFileAsync("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    source,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-vf",
    `lut3d=file=${lutPath}`,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    temporary,
  ]);
  if (!(await validVideo(temporary))) {
    throw new Error(`Invalid recolored video: ${temporary}`);
  }
  await rename(temporary, destination);
}

function itemTags(target) {
  return [
    "统一镜头库",
    "站点镜头",
    "橘色主色",
    "FF6900",
    `来源-${target.collection}`,
    `系列-${target.collection}`,
    `类型-${target.categoryName}`,
    `镜头卡-${target.cardId}`,
    `样式-${target.styleKey}`,
    target.previewKind === "player" || target.mediaUrl?.startsWith("/")
      ? "本地资源"
      : "远端样片",
    ...target.tags,
  ];
}

function annotation(target) {
  return [
    `标题：${target.title}`,
    `分类：${target.categoryName}`,
    `用途：${target.use}`,
    `动画：${target.styleLabel}${target.styleDescription ? `；${target.styleDescription}` : ""}`,
    `时长：${target.duration}`,
    `能量：${target.energy}`,
    "主色：#FF6900",
  ].join("｜");
}

async function replaceExisting(target, action, orangePath) {
  const currentPath = await findEagleVideo(action.item);
  const backupPath = join(
    backupDir,
    `${action.item.id}-${safeName(target.identity)}.mp4`,
  );
  try {
    await stat(backupPath);
  } catch {
    await copyFile(currentPath, backupPath);
  }

  const temporary = `${currentPath}.orange.mp4`;
  await copyFile(orangePath, temporary);
  if (!(await validVideo(temporary))) throw new Error(`Invalid staged file ${temporary}`);
  await rename(temporary, currentPath);
  await eaglePost("/api/v2/item/update", {
    id: action.item.id,
    tags: [...new Set([...(action.item.tags ?? []), ...itemTags(target)])],
    annotation: action.item.annotation || annotation(target),
  });
  await eaglePost("/api/v2/item/refreshThumbnail", { itemId: action.item.id });
}

async function addMissing(target, orangePath, folderId) {
  await eaglePost("/api/v2/item/add", {
    path: orangePath,
    name: target.identity,
    tags: itemTags(target),
    folders: [folderId],
    annotation: annotation(target),
    website: target.sourceUrl ?? target.mediaUrl ?? target.playerUrl,
  });
}

async function main() {
  const targets = await loadTargets(libraryPath);
  const localEntries = JSON.parse(
    await readFile(join(projectRoot, "source/a-roll-entries.json"), "utf8"),
  );
  for (const target of targets) {
    target.localRender = getLocalRenderTarget(
      target,
      localEntries,
      originalProjectRoot,
    );
  }
  const items = await getAllEagleItems();
  const byName = new Map();
  for (const item of items) {
    const matches = byName.get(item.name) ?? [];
    matches.push(item);
    byName.set(item.name, matches);
  }
  const actions = targets.map((target) =>
    decideSyncAction(target.identity, byName.get(target.identity) ?? []),
  );
  const summary = summarizeActions(actions);
  console.log(JSON.stringify({ mode: execute ? "execute" : "dry-run", total: targets.length, ...summary }, null, 2));

  if (summary.conflict > 0) {
    const conflicts = actions.filter(({ action }) => action === "conflict");
    throw new Error(`Duplicate Eagle identities: ${JSON.stringify(conflicts)}`);
  }
  if (summary.replace !== 47 || summary.add !== 51) {
    throw new Error(`Unexpected sync split: ${JSON.stringify(summary)}`);
  }
  if (!execute) return;

  await mkdir(sourceDir, { recursive: true });
  await mkdir(orangeDir, { recursive: true });
  await mkdir(backupDir, { recursive: true });
  await writeOrangeCube(lutPath);

  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index];
    const action = actions[index];
    const filename = `${safeName(target.identity)}.mp4`;
    const sourcePath = join(sourceDir, filename);
    const orangePath = join(orangeDir, filename);
    console.log(`[${index + 1}/${targets.length}] prepare ${target.identity}`);
    await acquireSource(target, action, sourcePath);
    await recolor(sourcePath, orangePath);
  }

  const folders = flattenFolders(await eagleGet("/api/folder/list"));
  const folderByName = new Map(folders.map((folder) => [folder.name, folder.id]));
  for (const target of targets) {
    if (!folderByName.has(target.categoryName)) {
      throw new Error(`Missing Eagle folder: ${target.categoryName}`);
    }
  }

  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index];
    const action = actions[index];
    const orangePath = join(orangeDir, `${safeName(target.identity)}.mp4`);
    console.log(`[${index + 1}/${targets.length}] sync ${action.action} ${target.identity}`);
    if (action.action === "replace") {
      await replaceExisting(target, action, orangePath);
    } else {
      await addMissing(target, orangePath, folderByName.get(target.categoryName));
    }
  }
}

await main();
