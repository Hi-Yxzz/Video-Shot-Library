import { randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, extname, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  categoryForLibraryCard,
  reclassifyLibraryCards,
} from "./shot-categories.mjs";
import { applyShotMetadata } from "./shot-metadata.mjs";

const UPSTREAM_BASE_URL =
  "https://vincentwei1021.github.io/video-shotcraft/";
const UPSTREAM_ORIGIN = "https://vincentwei1021.github.io";
const UPSTREAM_MEDIA_PREFIX = "/video-shotcraft/media/";
const PROJECT_REPOSITORY_URL =
  "https://github.com/Hi-Yxzz/Video-Shot-Library";
const RECIPE_BASE_URL =
  `${PROJECT_REPOSITORY_URL}/blob/main/`;
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = resolve(dirname(SCRIPT_PATH), "..");

function compareText(left, right) {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function pathKey(relativePath, rootSegments, extension, idFromDirectory) {
  const segments = relativePath.replaceAll("\\", "/").split("/");
  const rootIndex = segments.findIndex((segment, index) =>
    rootSegments.every((rootSegment, offset) =>
      segments[index + offset] === rootSegment
    )
  );
  const categoryIndex = rootIndex + rootSegments.length;
  const category = segments[categoryIndex];
  const filename = segments.at(-1);
  const directoryId = segments[categoryIndex + 1];

  if (
    rootIndex < 0 ||
    !category ||
    !directoryId ||
    !filename?.endsWith(extension)
  ) {
    return null;
  }

  const id = idFromDirectory
    ? directoryId
    : filename.slice(0, -extension.length);

  return `${category}/${id}`;
}

function indexPaths(paths, rootSegments, extension, idFromDirectory = false) {
  const index = new Map();

  for (const relativePath of paths) {
    const key = pathKey(
      relativePath,
      rootSegments,
      extension,
      idFromDirectory,
    );
    if (!key) {
      continue;
    }

    const entries = index.get(key) ?? [];
    entries.push(relativePath.replaceAll("\\", "/"));
    index.set(key, entries);
  }

  for (const entries of index.values()) {
    entries.sort(compareText);
  }

  return index;
}

function hasUnsafeEncodedSegment(path) {
  try {
    return path.split("/").some((segment) => {
      const decoded = decodeURIComponent(segment);
      return (
        decoded === "." ||
        decoded === ".." ||
        decoded.includes("/") ||
        decoded.includes("\\")
      );
    });
  } catch {
    return true;
  }
}

function validateLibrary(library) {
  if (!library || !Array.isArray(library.cards)) {
    throw new TypeError("Library cards must be an array");
  }

  for (const [index, card] of library.cards.entries()) {
    if (typeof card?.name !== "string" || card.name.trim() === "") {
      throw new TypeError(
        `Shot at index ${index}: name must be a non-empty string`,
      );
    }

    const shot = `Shot "${card.name}"`;

    if (typeof card.category !== "string" || card.category.trim() === "") {
      throw new TypeError(`${shot}: category must be a non-empty string`);
    }

    if (!Array.isArray(card.styles)) {
      throw new TypeError(`${shot}: styles must be an array`);
    }

    const sourceSegments =
      typeof card.source === "string" ? card.source.split("/") : [];
    if (
      typeof card.source !== "string" ||
      card.source.includes("\\") ||
      card.source.includes("\0") ||
      posix.isAbsolute(card.source) ||
      posix.normalize(card.source) !== card.source ||
      !card.source.startsWith("references/shots/") ||
      !card.source.endsWith(".md") ||
      sourceSegments.length < 4 ||
      sourceSegments.at(-1) === ".md" ||
      card.source.split("/").includes("..") ||
      hasUnsafeEncodedSegment(card.source)
    ) {
      throw new TypeError(
        `${shot}: source must be a safe references/shots/ Markdown path`,
      );
    }

    if (card.title !== undefined && typeof card.title !== "string") {
      throw new TypeError(`${shot}: title must be a string`);
    }

    for (const field of ["summary", "use", "duration", "energy"]) {
      if (typeof card[field] !== "string") {
        throw new TypeError(`${shot}: ${field} must be a string`);
      }
    }

    for (const [styleIndex, style] of card.styles.entries()) {
      const indexedStyle = `${shot}, style at index ${styleIndex}`;

      if (!style || typeof style !== "object" || Array.isArray(style)) {
        throw new TypeError(`${indexedStyle}: style must be an object`);
      }

      if (typeof style.key !== "string" || style.key.trim() === "") {
        throw new TypeError(`${indexedStyle}: key must be a non-empty string`);
      }

      const namedStyle = `${shot}, style "${style.key}"`;

      for (const field of ["label", "description"]) {
        if (typeof style[field] !== "string") {
          throw new TypeError(`${namedStyle}: ${field} must be a string`);
        }
      }

      if (style.media == null) {
        continue;
      }

      if (typeof style.media !== "object" || Array.isArray(style.media)) {
        throw new TypeError(`${namedStyle}: media must be an object`);
      }

      for (const field of ["url", "type"]) {
        if (
          typeof style.media[field] !== "string" ||
          style.media[field].trim() === ""
        ) {
          throw new TypeError(
            `${namedStyle}: media.${field} must be a non-empty string`,
          );
        }
      }
    }
  }
}

function validateLocalPaths(paths, {
  extension,
  label,
  minimumSegments,
  root,
}) {
  for (const path of paths) {
    const segments = typeof path === "string" ? path.split("/") : [];
    if (
      typeof path !== "string" ||
      path.includes("\\") ||
      path.includes("\0") ||
      posix.isAbsolute(path) ||
      posix.normalize(path) !== path ||
      !path.startsWith(root) ||
      !path.endsWith(extension) ||
      segments.length < minimumSegments ||
      segments.at(-1) === extension ||
      hasUnsafeEncodedSegment(path) ||
      segments.some((segment) =>
        segment === "" || segment === "." || segment === ".."
      )
    ) {
      throw new TypeError(
        `Local ${label} path must stay within ${root} and end in ${extension}`,
      );
    }
  }
}

function validateLocal(local) {
  if (!Array.isArray(local?.recipes)) {
    throw new TypeError("Local recipes must be an array");
  }
  if (!Array.isArray(local.demos)) {
    throw new TypeError("Local demos must be an array");
  }

  validateLocalPaths(local.recipes, {
    extension: ".md",
    label: "recipe",
    minimumSegments: 4,
    root: "references/shots/",
  });
  validateLocalPaths(local.demos, {
    extension: ".tsx",
    label: "demo",
    minimumSegments: 4,
    root: "demos/",
  });
}

function resolvePreviewUrl(value, errorMessage) {
  try {
    const url = new URL(value, UPSTREAM_BASE_URL);
    if (
      url.protocol !== "https:" ||
      url.origin !== UPSTREAM_ORIGIN ||
      !url.pathname.startsWith(UPSTREAM_MEDIA_PREFIX) ||
      url.pathname === UPSTREAM_MEDIA_PREFIX ||
      hasUnsafeEncodedSegment(url.pathname)
    ) {
      throw new TypeError(errorMessage);
    }
    return url.href;
  } catch {
    throw new TypeError(errorMessage);
  }
}

async function findFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => compareText(left.name, right.name));

  const files = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findFiles(entryPath, extension));
    } else if (entry.isFile() && extname(entry.name) === extension) {
      files.push(entryPath);
    }
  }

  return files;
}

function toRelativePaths(root, paths) {
  return paths
    .map((path) => relative(root, path).replaceAll("\\", "/"))
    .sort(compareText);
}

export async function indexLocalFiles(root = PROJECT_ROOT) {
  const absoluteRoot = resolve(root);
  const [recipeFiles, demoFiles] = await Promise.all([
    findFiles(resolve(absoluteRoot, "references/shots"), ".md"),
    findFiles(resolve(absoluteRoot, "demos"), ".tsx"),
  ]);

  return {
    recipes: toRelativePaths(absoluteRoot, recipeFiles),
    demos: toRelativePaths(absoluteRoot, demoFiles).filter((path) => {
      const segments = path.split("/");
      return (
        segments.length >= 4 &&
        segments[0] === "demos" &&
        segments.at(-1).endsWith(".tsx")
      );
    }),
  };
}

export function normalizeLibrary(library, local = {}, excludedShots = []) {
  validateLibrary(library);
  validateLocal(local);

  const recipes = indexPaths(
    local.recipes,
    ["references", "shots"],
    ".md",
  );
  const demos = indexPaths(local.demos, ["demos"], ".tsx", true);
  const excludedShotIds = new Set(excludedShots);
  const cards = library.cards
    .filter((card) => !excludedShotIds.has(card.name))
    .map((card) => {
      const key = `${card.category}/${card.name}`;
      const recipePath = recipes.get(key)?.[0] ?? null;
      const demoFiles = demos.get(key) ?? [];

      return {
        id: card.name,
        title: card.title ?? card.name,
        summary: card.summary,
        use: card.use,
        duration: card.duration,
        energy: card.energy,
        category: categoryForLibraryCard({
          collection: "video-shotcraft",
          id: card.name,
          category: card.category,
        }),
        recipePath,
        recipeUrl: `${RECIPE_BASE_URL}${
          card.source.split("/").map(encodeURIComponent).join("/")
        }`,
        recipeAvailable: recipePath !== null,
        demoFiles: [...demoFiles],
        hasDemo: demoFiles.length > 0,
        styles: card.styles
          .map((style) => {
            const previewUrl = style.media
              ? resolvePreviewUrl(
                style.media.url,
                `Shot "${card.name}", style "${style.key}": media.url must be a trusted HTTPS media URL`,
              )
              : null;

            return {
              ...style,
              implementationStatus:
                style.implementationStatus === "reference-only"
                  ? "reference-only"
                  : "implemented",
              previewUrl,
              ...(style.media
                ? {
                  media: {
                    ...style.media,
                    url: previewUrl,
                  },
                }
                : {}),
            };
          })
          .sort((left, right) => compareText(left.key, right.key)),
      };
    })
    .sort((left, right) => compareText(left.id, right.id));
  const styles = cards.flatMap((card) => card.styles);

  return {
    ...library,
    ...(library.stats
      ? {
        stats: {
          ...library.stats,
          cardCount: cards.length,
          styleCount: styles.length,
          previewCount: styles.filter((style) => style.previewUrl !== null).length,
          mediaCount: styles.filter((style) => style.media).length,
        },
      }
      : {}),
    cards,
  };
}

export function mergeCatalogs(upstreamCatalog, gradedCatalog) {
  if (!Array.isArray(upstreamCatalog?.cards)) {
    throw new TypeError("Upstream catalog cards must be an array");
  }
  if (!Array.isArray(gradedCatalog?.cards)) {
    throw new TypeError("Graded catalog cards must be an array");
  }

  const gradedCards = reclassifyLibraryCards(gradedCatalog.cards)
    .map((card) => ({
      ...card,
      sourceUrl: card.codeFiles?.[0]
        ? `${RECIPE_BASE_URL}${
          card.codeFiles[0].split("/").map(encodeURIComponent).join("/")
        }`
        : PROJECT_REPOSITORY_URL,
    }));
  const videoCards = upstreamCatalog.cards.map((card) => ({
    ...card,
    collection: "video-shotcraft",
    grade: null,
    score: null,
    previewKind: "video",
    playerUrl: null,
    compositionId: null,
    sourceUrl: PROJECT_REPOSITORY_URL,
    license: "Apache-2.0",
    codeFiles: [...card.demoFiles],
  }));
  const cards = [...videoCards, ...gradedCards]
    .sort((left, right) => compareText(left.id, right.id));
  const seen = new Set();

  for (const card of cards) {
    if (seen.has(card.id)) {
      throw new TypeError(`Duplicate card id: ${card.id}`);
    }
    seen.add(card.id);
  }

  const styles = cards.flatMap((card) => card.styles);
  const videoPreviewCount = videoCards
    .flatMap((card) => card.styles)
    .filter((style) => style.previewUrl !== null).length;
  const playerPreviewCount = gradedCards.length;
  const gradeCounts = Object.fromEntries(
    ["S", "A", "B"].map((grade) => [
      grade,
      gradedCards.filter((card) => card.grade === grade).length,
    ]),
  );

  return {
    ...upstreamCatalog,
    cards,
    gradeCounts,
    stats: {
      ...upstreamCatalog.stats,
      cardCount: cards.length,
      styleCount: styles.length,
      previewCount: videoPreviewCount + playerPreviewCount,
      mediaCount: videoPreviewCount,
      videoPreviewCount,
      playerPreviewCount,
    },
  };
}

async function createLibraryData(root) {
  const absoluteRoot = resolve(root);
  const sourcePath = resolve(absoluteRoot, "source/upstream-library.json");
  const gradedPath = resolve(absoluteRoot, "source/graded-library.json");
  const metadataPath = resolve(absoluteRoot, "source/shot-metadata.json");
  const exclusionsPath = resolve(absoluteRoot, "source/excluded-shots.json");
  const outputPath = resolve(absoluteRoot, "public/data/library.json");
  const [source, graded, metadata, exclusions, local] = await Promise.all([
    readFile(sourcePath, "utf8"),
    readFile(gradedPath, "utf8"),
    readFile(metadataPath, "utf8"),
    readFile(exclusionsPath, "utf8").catch((error) => {
      if (error?.code === "ENOENT") {
        return "[]";
      }
      throw error;
    }),
    indexLocalFiles(absoluteRoot),
  ]);
  const mergedCatalog = mergeCatalogs(
    normalizeLibrary(
      JSON.parse(source),
      local,
      JSON.parse(exclusions),
    ),
    JSON.parse(graded),
  );
  const catalog = {
    ...mergedCatalog,
    cards: applyShotMetadata(mergedCatalog.cards, JSON.parse(metadata)),
  };

  return {
    catalog,
    outputPath,
    serialized: `${JSON.stringify(catalog, null, 2)}\n`,
  };
}

export async function checkLibraryData(root = PROJECT_ROOT) {
  const { catalog, outputPath, serialized } = await createLibraryData(root);
  let current;

  try {
    current = await readFile(outputPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  if (current !== serialized) {
    throw new Error("Shot catalog is stale; run npm run data:build");
  }

  return catalog;
}

export async function buildLibraryData(root = PROJECT_ROOT) {
  const { catalog, outputPath, serialized } = await createLibraryData(root);
  const outputDirectory = dirname(outputPath);
  const temporaryPath = resolve(
    outputDirectory,
    `.library.json.${process.pid}.${randomUUID()}.tmp`,
  );

  await mkdir(outputDirectory, { recursive: true });
  try {
    await writeFile(temporaryPath, serialized, { flag: "wx" });
    await rename(temporaryPath, outputPath);
  } finally {
    await rm(temporaryPath, { force: true });
  }

  return catalog;
}

if (process.argv[1] && resolve(process.argv[1]) === SCRIPT_PATH) {
  if (process.argv.includes("--check")) {
    await checkLibraryData();
  } else {
    await buildLibraryData();
  }
}
