export type CuratedRollType = "A-roll" | "B-roll";

export type CuratedFixture = "shortest" | "default" | "stress";

export type CuratedComposition = {
  width: 1920;
  height: 1080;
  fps: 30;
  durationInFrames: number;
};

export type CuratedEntry = {
  id: `curated/${string}`;
  familyId: string;
  variantId: string;
  title: string;
  summary: string;
  use: string;
  category: string;
  rollType: CuratedRollType;
  qualityScore: number;
  composition: CuratedComposition;
  sourceFiles: string[];
  analysisPath: string;
  previewUrl: string;
  fixtures: CuratedFixture[];
  tags: string[];
};

const REQUIRED_FIXTURES: CuratedFixture[] = ["shortest", "default", "stress"];
const TEXT_FIELDS = [
  "familyId",
  "variantId",
  "title",
  "summary",
  "use",
  "category",
] as const;

const fail = (index: number, message: string): never => {
  throw new TypeError(`Curated entry ${index}: ${message}`);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonemptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const snapshotDenseArray = (
  value: unknown,
  notArrayMessage: string,
  sparseMessage: string,
): unknown[] => {
  if (!Array.isArray(value)) {
    throw new TypeError(notArrayMessage);
  }

  const snapshot: unknown[] = new Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) {
      throw new TypeError(sparseMessage);
    }
    snapshot[index] = value[index];
  }
  return snapshot;
};

const MAX_PATH_DECODE_ROUNDS = 4;
const UNSAFE_ENCODED_PATH_TOKEN = /%(?:00|2f|5c)/i;

const hasCanonicalSegments = (value: string): boolean =>
  value
    .split("/")
    .every(
      (segment) => segment.length > 0 && segment !== "." && segment !== "..",
    );

const hasPathPrefix = (value: string, prefix: string): boolean =>
  value.startsWith(prefix) && value.length > prefix.length;

const isSafeDecodedPath = (
  value: string,
  validateShape: (path: string) => boolean,
): boolean => {
  let current = value;

  for (let round = 0; round < MAX_PATH_DECODE_ROUNDS; round += 1) {
    if (!validateShape(current) || UNSAFE_ENCODED_PATH_TOKEN.test(current)) {
      return false;
    }

    let decoded: string;
    try {
      decoded = decodeURIComponent(current);
    } catch {
      return false;
    }

    if (decoded === current) {
      return true;
    }
    current = decoded;
  }

  if (!validateShape(current) || UNSAFE_ENCODED_PATH_TOKEN.test(current)) {
    return false;
  }

  try {
    return decodeURIComponent(current) === current;
  } catch {
    return false;
  }
};

const isSafeRepoRelativePath = (
  value: string,
  requiredRoot: string,
  extension?: string,
): boolean =>
  isSafeDecodedPath(
    value,
    (path) =>
      !path.startsWith("/") &&
      !path.includes("\\") &&
      !path.includes("\0") &&
      !path.includes("?") &&
      !path.includes("#") &&
      !path.includes(":") &&
      hasPathPrefix(path, requiredRoot) &&
      (extension === undefined || path.endsWith(extension)) &&
      hasCanonicalSegments(path),
  );

const isSafePreviewUrl = (value: string): boolean =>
  isSafeDecodedPath(
    value,
    (path) => {
      if (
        path.includes("\\") ||
        path.includes("\0") ||
        path.includes("?") ||
        path.includes("#") ||
        path.includes(":") ||
        !hasPathPrefix(path, "/media/curated-v2/") ||
        !path.endsWith(".mp4")
      ) {
        return false;
      }

      const segments = path.split("/");
      return (
        segments[0] === "" &&
        segments[1] === "media" &&
        segments[2] === "curated-v2" &&
        segments.slice(3).every(
          (segment) =>
            segment.length > 0 && segment !== "." && segment !== "..",
        )
      );
    },
  );

export const validateCuratedEntries = (value: unknown): CuratedEntry[] => {
  const entries = snapshotDenseArray(
    value,
    "Curated entries must be an array",
    "Curated entries must not be sparse",
  );

  const seenIds = new Set<string>();

  return entries.map((candidate, index) => {
    if (!isRecord(candidate)) {
      throw new TypeError(`Curated entry ${index}: entry must be an object`);
    }

    const id = candidate.id;
    if (!isNonemptyString(id) || !id.startsWith("curated/")) {
      throw new TypeError(`Curated entry ${index}: id must start with curated/`);
    }
    if (!/^curated\/[^/]+(?:\/[^/]+)*$/.test(id)) {
      fail(index, "id must be a valid curated/ path");
    }
    if (seenIds.has(id)) {
      fail(index, `duplicate id ${id}`);
    }
    seenIds.add(id);

    for (const field of TEXT_FIELDS) {
      if (!isNonemptyString(candidate[field])) {
        fail(index, `${field} must be a nonempty string`);
      }
    }

    if (candidate.rollType !== "A-roll" && candidate.rollType !== "B-roll") {
      fail(index, "rollType must be A-roll or B-roll");
    }

    const qualityScore = candidate.qualityScore;
    if (Number.isInteger(qualityScore) && (qualityScore as number) < 85) {
      fail(index, "qualityScore must be at least 85");
    }
    if (
      !Number.isInteger(qualityScore) ||
      (qualityScore as number) > 100
    ) {
      fail(index, "qualityScore must be an integer between 85 and 100");
    }

    const composition = candidate.composition;
    if (!isRecord(composition)) {
      throw new TypeError(`Curated entry ${index}: composition must be an object`);
    }
    if (
      composition.width !== 1920 ||
      composition.height !== 1080
    ) {
      fail(index, "composition must be 1920x1080");
    }
    if (composition.fps !== 30) {
      fail(index, "composition fps must be 30");
    }
    if (
      !Number.isInteger(composition.durationInFrames) ||
      (composition.durationInFrames as number) <= 0
    ) {
      fail(index, "durationInFrames must be a positive integer");
    }

    const sourceFiles = snapshotDenseArray(
      candidate.sourceFiles,
      `Curated entry ${index}: sourceFiles must contain at least one curated-v2/shots/ path`,
      `Curated entry ${index}: sourceFiles must not be sparse`,
    );
    if (sourceFiles.length === 0) {
      fail(index, "sourceFiles must contain at least one curated-v2/shots/ path");
    }
    for (const sourceFile of sourceFiles) {
      if (
        !isNonemptyString(sourceFile) ||
        !isSafeRepoRelativePath(sourceFile, "curated-v2/shots/")
      ) {
        fail(index, "sourceFiles must use safe paths inside curated-v2/shots/");
      }
    }

    if (
      !isNonemptyString(candidate.analysisPath) ||
      !isSafeRepoRelativePath(
        candidate.analysisPath,
        "curated-v2/references/",
        ".md",
      )
    ) {
      fail(
        index,
        "analysisPath must be a safe path inside curated-v2/references/ ending in .md",
      );
    }

    if (
      !isNonemptyString(candidate.previewUrl) ||
      !isSafePreviewUrl(candidate.previewUrl)
    ) {
      fail(index, "previewUrl must be inside /media/curated-v2/ and end in .mp4");
    }

    const fixtures = snapshotDenseArray(
      candidate.fixtures,
      `Curated entry ${index}: fixtures must contain exactly shortest, default, stress`,
      `Curated entry ${index}: fixtures must not be sparse`,
    );
    if (
      fixtures.length !== REQUIRED_FIXTURES.length ||
      new Set(fixtures).size !== REQUIRED_FIXTURES.length ||
      !REQUIRED_FIXTURES.every((fixture) => fixtures.includes(fixture))
    ) {
      fail(index, "fixtures must contain exactly shortest, default, stress");
    }

    const tags = snapshotDenseArray(
      candidate.tags,
      `Curated entry ${index}: tags must contain at least one nonempty string`,
      `Curated entry ${index}: tags must not be sparse`,
    );
    if (tags.length === 0 || !tags.every(isNonemptyString)) {
      fail(index, "tags must contain at least one nonempty string");
    }

    return {
      id: id as `curated/${string}`,
      familyId: candidate.familyId as string,
      variantId: candidate.variantId as string,
      title: candidate.title as string,
      summary: candidate.summary as string,
      use: candidate.use as string,
      category: candidate.category as string,
      rollType: candidate.rollType as CuratedRollType,
      qualityScore: qualityScore as number,
      composition: {
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: composition.durationInFrames as number,
      },
      sourceFiles: [...sourceFiles] as string[],
      analysisPath: candidate.analysisPath as string,
      previewUrl: candidate.previewUrl as string,
      fixtures: [...fixtures] as CuratedFixture[],
      tags: [...tags] as string[],
    };
  });
};
