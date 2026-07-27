import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { writePlayerManifests } from "./player-manifests.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
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

await writePlayerManifests(projectRoot);
const requested = process.argv.includes("--source")
  ? process.argv[process.argv.indexOf("--source") + 1]
  : "all";
const players =
  requested === "all"
    ? ["remocn", "remotion-bits"]
    : [requested];

for (const player of players) {
  if (!["remocn", "remotion-bits"].includes(player)) {
    throw new TypeError(`Unknown player source: ${player}`);
  }
  await run("npx", [
    "vite",
    "build",
    "--config",
    `players/${player}/vite.config.ts`,
  ]);
}
