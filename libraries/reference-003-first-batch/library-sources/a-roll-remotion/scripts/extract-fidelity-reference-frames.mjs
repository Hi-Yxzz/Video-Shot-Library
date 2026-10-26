import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

export const SOURCE_VIDEO =
  "/Users/admin/Desktop/视频/待镜头复刻/40773550241-1-192.mp4";

export const CHECKPOINT_LABELS = [
  "establish",
  "entrance",
  "peak",
  "settle",
  "exit",
];

export const SHOT_CHECKPOINTS = [
  { slug: "prompt-to-comparison", seconds: [26.033, 26.7, 31.8, 33.3, 34.3] },
  { slug: "case-card-constellation", seconds: [128.8, 130, 133, 137, 140.8] },
  { slug: "metric-card-deal", seconds: [240.833, 242.5, 245.8, 249.5, 254.9] },
  {
    slug: "ranking-row-highlight",
    seconds: [273.667, 274.4, 277, 280.5, 284.3],
  },
  { slug: "chat-bubble-ladder", seconds: [141.4, 142, 145, 148, 151.3] },
  {
    slug: "talking-head-keyword-stickers",
    seconds: [267.3, 267.9, 269.2, 271.4, 273.5],
  },
  { slug: "leaderboard-card-push", seconds: [161.8, 162.8, 166, 167, 167.733] },
  { slug: "orbital-tech-title", seconds: [5.733, 6.233, 7.4, 9.4, 10] },
];

export const REFERENCE_MANIFEST = SHOT_CHECKPOINTS.flatMap((shot) =>
  shot.seconds.map((seconds, index) => {
    const label = CHECKPOINT_LABELS[index];
    const filename = `${String(index + 1).padStart(2, "0")}-${label}.png`;
    return {
      slug: shot.slug,
      label,
      seconds,
      relativePath: join(shot.slug, filename),
    };
  }),
);

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const FIDELITY_ROOT = join(projectDir, "out", "fidelity-remake");
export const OUTPUT_ROOT = join(FIDELITY_ROOT, "reference");

const runCommand = (command, args) =>
  spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    timeout: 120_000,
  });

const commandFailure = (command, result) => {
  if (result.error?.code === "ENOENT") {
    return `${command} is not installed or is not available on PATH.`;
  }
  if (result.signal) {
    const errorDetail = result.error ? ` (${result.error.message})` : "";
    return `${command} was terminated by signal ${result.signal}${errorDetail}.`;
  }
  if (result.error) {
    return `${command} could not be executed: ${result.error.message}`;
  }
  return `${command} exited with status ${result.status}: ${result.stderr?.trim() || "no error output"}`;
};

export const validateCheckpointConfiguration = () => {
  if (SHOT_CHECKPOINTS.length !== 8) {
    throw new Error(
      `Expected 8 shot checkpoint groups, received ${SHOT_CHECKPOINTS.length}.`,
    );
  }
  if (CHECKPOINT_LABELS.length !== 5) {
    throw new Error(
      `Expected 5 checkpoint labels, received ${CHECKPOINT_LABELS.length}.`,
    );
  }

  const seenSlugs = new Set();
  for (const { slug, seconds } of SHOT_CHECKPOINTS) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Unsafe checkpoint slug: ${slug}`);
    }
    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate checkpoint slug: ${slug}`);
    }
    seenSlugs.add(slug);

    if (!Array.isArray(seconds) || seconds.length !== 5) {
      throw new Error(`Checkpoint group ${slug} must contain exactly 5 times.`);
    }
    for (const [index, value] of seconds.entries()) {
      if (!Number.isFinite(value) || value < 0) {
        throw new Error(
          `Checkpoint ${slug}/${CHECKPOINT_LABELS[index]} must be finite and non-negative.`,
        );
      }
      if (index > 0 && value <= seconds[index - 1]) {
        throw new Error(
          `Checkpoint times for ${slug} must be strictly increasing.`,
        );
      }
    }
  }

  const manifestPaths = new Set(
    REFERENCE_MANIFEST.map(({ relativePath }) => relativePath),
  );
  if (
    REFERENCE_MANIFEST.length !== 40 ||
    manifestPaths.size !== REFERENCE_MANIFEST.length
  ) {
    throw new Error("Reference manifest must contain exactly 40 unique files.");
  }
};

const maximumCheckpoint = () =>
  Math.max(...SHOT_CHECKPOINTS.flatMap(({ seconds }) => seconds));

const verifyCheckpointIsDecodable = (seconds) => {
  const probeDir = mkdtempSync(join(tmpdir(), "fidelity-reference-probe-"));
  const probePath = join(probeDir, "frame.png");
  try {
    const result = runCommand("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      String(seconds),
      "-i",
      SOURCE_VIDEO,
      "-map",
      "0:v:0",
      "-frames:v",
      "1",
      "-y",
      probePath,
    ]);
    if (result.error || result.signal || result.status !== 0) {
      throw new Error(
        `Source video cannot decode a frame at maximum checkpoint ${seconds}: ${commandFailure("ffmpeg", result)}`,
      );
    }

    let frameStat;
    try {
      frameStat = statSync(probePath);
    } catch (error) {
      throw new Error(
        `Source video produced no frame at maximum checkpoint ${seconds}: ${error.message}`,
      );
    }
    if (!frameStat.isFile() || frameStat.size === 0) {
      throw new Error(
        `Source video produced no usable frame at maximum checkpoint ${seconds}.`,
      );
    }
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
  }
};

export const validatePrerequisites = () => {
  validateCheckpointConfiguration();

  let sourceStat;
  try {
    sourceStat = statSync(SOURCE_VIDEO);
  } catch (error) {
    throw new Error(
      `Source video is unavailable at ${SOURCE_VIDEO}: ${error.message}`,
    );
  }
  if (!sourceStat.isFile()) {
    throw new Error(`Source video is not a regular file: ${SOURCE_VIDEO}`);
  }

  for (const command of ["ffmpeg", "ffprobe"]) {
    const args =
      command === "ffmpeg"
        ? ["-hide_banner", "-loglevel", "error", "-version"]
        : ["-version"];
    const result = runCommand(command, args);
    if (result.error || result.signal || result.status !== 0) {
      throw new Error(commandFailure(command, result));
    }
  }

  const probe = runCommand("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=duration:format=duration",
    "-of",
    "json",
    SOURCE_VIDEO,
  ]);
  if (probe.error || probe.signal || probe.status !== 0) {
    throw new Error(
      `Source video could not be parsed: ${commandFailure("ffprobe", probe)}`,
    );
  }

  let metadata;
  try {
    metadata = JSON.parse(probe.stdout);
  } catch (error) {
    throw new Error(
      `Source video returned invalid ffprobe JSON: ${error.message}`,
    );
  }
  const videoStream = metadata.streams?.[0];
  if (!videoStream) {
    throw new Error(
      "Source video does not contain a decodable video stream (v:0).",
    );
  }

  const streamDuration = Number.parseFloat(videoStream.duration);
  const duration = Number.isFinite(streamDuration)
    ? streamDuration
    : Number.parseFloat(metadata.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(
      "Source video stream has no valid duration, and format duration fallback is unavailable.",
    );
  }

  const latestCheckpoint = maximumCheckpoint();
  if (duration < latestCheckpoint) {
    throw new Error(
      `Source video duration ${duration} seconds does not cover the maximum checkpoint ${latestCheckpoint} seconds.`,
    );
  }
  verifyCheckpointIsDecodable(latestCheckpoint);
};

export const extractFrame = ({ slug, label, seconds, outputPath }) => {
  const result = runCommand("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    String(seconds),
    "-i",
    SOURCE_VIDEO,
    "-frames:v",
    "1",
    "-vf",
    "scale=1920:1080:flags=lanczos",
    "-y",
    outputPath,
  ]);
  if (result.error || result.signal || result.status !== 0) {
    throw new Error(
      `Failed to extract ${slug}/${label}: ${commandFailure("ffmpeg", result)}`,
    );
  }
};

export const verifyFrame = ({ slug, label, outputPath }) => {
  const result = runCommand("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-of",
    "json",
    outputPath,
  ]);
  if (result.error || result.signal || result.status !== 0) {
    throw new Error(
      `Failed to verify ${slug}/${label}: ${commandFailure("ffprobe", result)}`,
    );
  }

  let dimensions;
  try {
    dimensions = JSON.parse(result.stdout).streams?.[0];
  } catch (error) {
    throw new Error(
      `Failed to verify ${slug}/${label}: invalid ffprobe output (${error.message}).`,
    );
  }
  if (dimensions?.width !== 1920 || dimensions?.height !== 1080) {
    const actual = dimensions
      ? `${dimensions.width}x${dimensions.height}`
      : "no video stream";
    throw new Error(
      `Failed to verify ${slug}/${label}: expected 1920x1080, received ${actual}.`,
    );
  }
};

const assertManagedTemporaryDirectory = (directory, prefix) => {
  if (
    resolve(dirname(directory)) !== resolve(FIDELITY_ROOT) ||
    !basename(directory).startsWith(prefix)
  ) {
    throw new Error(
      `Refusing to manage directory outside ${FIDELITY_ROOT}: ${directory}`,
    );
  }
};

const removeManagedTemporaryDirectory = (directory, prefix) => {
  assertManagedTemporaryDirectory(directory, prefix);
  rmSync(directory, { recursive: true, force: true });
};

const requireRegularFile = (filePath, description) => {
  let fileStat;
  try {
    fileStat = lstatSync(filePath);
  } catch (error) {
    throw new Error(
      `${description} is unavailable at ${filePath}: ${error.message}`,
    );
  }
  if (!fileStat.isFile()) {
    throw new Error(`${description} is not a regular file: ${filePath}`);
  }
};

const requireRegularFileIfPresent = (filePath, description) => {
  if (existsSync(filePath)) {
    requireRegularFile(filePath, description);
  }
};

export const publishStagingDirectory = (stagingRoot, options = {}) => {
  assertManagedTemporaryDirectory(stagingRoot, ".reference-staging-");
  const renameFile = options.renameFile ?? renameSync;
  if (typeof renameFile !== "function") {
    throw new Error(
      "publishStagingDirectory renameFile option must be a function.",
    );
  }

  for (const { relativePath } of REFERENCE_MANIFEST) {
    requireRegularFile(
      join(stagingRoot, relativePath),
      `Staged reference ${relativePath}`,
    );
    requireRegularFileIfPresent(
      join(OUTPUT_ROOT, relativePath),
      `Existing reference ${relativePath}`,
    );
  }

  mkdirSync(OUTPUT_ROOT, { recursive: true });
  const backupRoot = mkdtempSync(join(FIDELITY_ROOT, ".reference-backup-"));
  assertManagedTemporaryDirectory(backupRoot, ".reference-backup-");

  const backedUpTargets = [];
  const publishedTargets = [];
  try {
    for (const entry of REFERENCE_MANIFEST) {
      const stagedPath = join(stagingRoot, entry.relativePath);
      const finalPath = join(OUTPUT_ROOT, entry.relativePath);
      const backupPath = join(backupRoot, entry.relativePath);
      mkdirSync(dirname(finalPath), { recursive: true });

      if (existsSync(finalPath)) {
        mkdirSync(dirname(backupPath), { recursive: true });
        renameFile(finalPath, backupPath);
        backedUpTargets.push(entry);
      }

      renameFile(stagedPath, finalPath);
      publishedTargets.push(entry);
    }
  } catch (publishError) {
    const rollbackErrors = [];
    for (const entry of publishedTargets.toReversed()) {
      const finalPath = join(OUTPUT_ROOT, entry.relativePath);
      try {
        rmSync(finalPath, { force: true });
      } catch (error) {
        rollbackErrors.push(
          `remove ${entry.relativePath} failed: ${error.message}`,
        );
      }
    }

    for (const entry of backedUpTargets.toReversed()) {
      const finalPath = join(OUTPUT_ROOT, entry.relativePath);
      const backupPath = join(backupRoot, entry.relativePath);
      try {
        mkdirSync(dirname(finalPath), { recursive: true });
        renameSync(backupPath, finalPath);
      } catch (error) {
        rollbackErrors.push(
          `restore ${entry.relativePath} failed: ${error.message}`,
        );
      }
    }

    if (rollbackErrors.length === 0) {
      try {
        removeManagedTemporaryDirectory(backupRoot, ".reference-backup-");
      } catch (error) {
        rollbackErrors.push(`backup cleanup failed: ${error.message}`);
      }
    }
    const rollbackDetail =
      rollbackErrors.length > 0
        ? ` Rollback errors: ${rollbackErrors.join("; ")}`
        : " Rollback completed.";
    throw new Error(
      `Failed to publish reference frames: ${publishError.message}.${rollbackDetail}`,
    );
  }

  try {
    removeManagedTemporaryDirectory(backupRoot, ".reference-backup-");
  } catch (error) {
    throw new Error(
      `Reference frames were published, but backup cleanup failed: ${error.message}`,
    );
  }
};

export const main = (publishOptions = {}) => {
  validatePrerequisites();

  mkdirSync(FIDELITY_ROOT, { recursive: true });
  const stagingRoot = mkdtempSync(join(FIDELITY_ROOT, ".reference-staging-"));
  let extractedFrames = 0;
  let operationError;
  try {
    for (const entry of REFERENCE_MANIFEST) {
      const outputPath = join(stagingRoot, entry.relativePath);
      mkdirSync(dirname(outputPath), { recursive: true });
      const frame = { ...entry, outputPath };
      extractFrame(frame);
      verifyFrame(frame);
      extractedFrames += 1;
    }
    publishStagingDirectory(stagingRoot, publishOptions);
  } catch (error) {
    operationError = error;
    throw error;
  } finally {
    if (existsSync(stagingRoot)) {
      try {
        removeManagedTemporaryDirectory(stagingRoot, ".reference-staging-");
      } catch (cleanupError) {
        if (operationError) {
          throw new Error(
            `${operationError.message} Staging cleanup also failed: ${cleanupError.message}`,
          );
        }
        throw cleanupError;
      }
    }
  }

  console.log(
    `Extracted ${extractedFrames} reference frames for ${SHOT_CHECKPOINTS.length} shots.`,
  );
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    main();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}
