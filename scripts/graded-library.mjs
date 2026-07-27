import { categoryForGradedShot } from "./shot-categories.mjs";

const ALLOWED_GRADES = new Set(["S", "A", "B"]);
const SOURCE_COLLECTIONS = new Map([
  ["Remocn", "remocn"],
  ["Remocn UI", "remocn-ui"],
  ["Remotion Bits", "remotion-bits"],
]);
const ALLOWED_COLLECTIONS = new Set(SOURCE_COLLECTIONS.values());
export function namespacedId(collection, upstreamId) {
  if (
    !ALLOWED_COLLECTIONS.has(collection) ||
    typeof upstreamId !== "string" ||
    !/^[a-z0-9-]+$/.test(upstreamId)
  ) {
    throw new TypeError("Invalid graded shot identifier");
  }
  return `${collection}/${upstreamId}`;
}

export function playerUrl(collection) {
  if (!ALLOWED_COLLECTIONS.has(collection)) {
    throw new TypeError("Invalid graded shot collection");
  }
  return collection === "remotion-bits"
    ? "/players/remotion-bits/index.html"
    : "/players/remocn/index.html";
}

export function compositionId(collection, upstreamId) {
  namespacedId(collection, upstreamId);
  return upstreamId;
}

function bitsSourcePaths(bitsRegistry) {
  if (!bitsRegistry || !Array.isArray(bitsRegistry.items)) {
    throw new TypeError("Remotion Bits registry items must be an array");
  }

  return new Map(
    bitsRegistry.items
      .filter((item) => item.type === "bit")
      .map((item) => [
        item.name,
        item.files?.map((file) => file.relativePath).filter(Boolean) ?? [],
      ]),
  );
}

export function importGradedLibraries({ shots, bitsRegistry }) {
  if (!Array.isArray(shots)) {
    throw new TypeError("Graded shots must be an array");
  }

  const bitsPaths = bitsSourcePaths(bitsRegistry);
  const cards = shots
    .filter(
      (shot) =>
        SOURCE_COLLECTIONS.has(shot.source) &&
        ALLOWED_GRADES.has(shot.grade),
    )
    .map((shot) => {
      const collection = SOURCE_COLLECTIONS.get(shot.source);
      const sourceFiles =
        collection === "remotion-bits"
          ? bitsPaths.get(shot.id)
          : [`registry/${collection}/${shot.id}/index.tsx`];

      if (!sourceFiles?.length) {
        throw new TypeError(`Missing local source mapping for ${shot.id}`);
      }

      return {
        id: namespacedId(collection, shot.id),
        upstreamId: shot.id,
        title: shot.name,
        summary: shot.description,
        use: shot.reason,
        duration: "由本地 Composition 决定",
        energy: `${shot.grade} · ${shot.score}/100`,
        category: categoryForGradedShot({
          collection,
          id: shot.id,
          upstreamCategory: shot.category,
        }),
        collection,
        grade: shot.grade,
        score: shot.score,
        previewKind: "player",
        playerUrl: playerUrl(collection),
        compositionId: compositionId(collection, shot.id),
        sourceUrl:
          collection === "remotion-bits"
            ? "https://github.com/av/remotion-bits"
            : "https://github.com/Remocn/remocn",
        license: collection === "remotion-bits" ? "MIT" : "MIT",
        codeFiles: sourceFiles.map((file) =>
          `library-sources/${
            collection === "remotion-bits" ? "remotion-bits" : "remocn"
          }/${file}`,
        ),
        recipePath: null,
        recipeUrl: null,
        recipeAvailable: false,
        demoFiles: [],
        hasDemo: true,
        styles: [
          {
            key: "default",
            label: "本地 TSX",
            description: shot.description,
            implementationStatus: "implemented",
            previewUrl: null,
          },
        ],
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));

  if (new Set(cards.map((card) => card.id)).size !== cards.length) {
    throw new TypeError("Duplicate graded shot id");
  }

  return {
    generatedAt: "2026-07-27T00:00:00.000Z",
    cards,
  };
}
