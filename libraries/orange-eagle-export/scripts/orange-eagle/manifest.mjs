import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const TARGET_CATEGORIES = new Set(["camera", "data", "typography"]);

export async function loadTargets(libraryPath) {
  const library = JSON.parse(await readFile(libraryPath, "utf8"));
  const targets = [];

  for (const card of library.cards) {
    if (!TARGET_CATEGORIES.has(card.category)) continue;

    for (const style of card.styles) {
      const compositionId = card.compositionId ?? null;
      const identity =
        style.key === "default"
          ? (compositionId ?? card.id)
          : style.key;

      targets.push({
        identity,
        collection: card.collection,
        categoryId: card.category,
        categoryName: library.categories[card.category].zh,
        cardId: card.id,
        title: card.title,
        summary: card.summary,
        use: card.use,
        duration: card.duration,
        energy: card.energy,
        tags: card.tags ?? [],
        styleKey: style.key,
        styleLabel: style.label,
        styleDescription: style.description,
        compositionId,
        mediaUrl: style.media?.url ?? null,
        previewKind: card.previewKind,
        playerUrl: card.playerUrl ?? null,
        sourceUrl: card.sourceUrl ?? null,
      });
    }
  }

  return targets;
}

export function getLocalRenderTarget(target, entries, originalProjectRoot) {
  const entry = entries.find(({ id }) => id === target.cardId);
  if (!entry?.projectPath || !entry.compositionId) return null;
  return {
    projectPath: resolve(originalProjectRoot, entry.projectPath),
    compositionId: entry.compositionId,
  };
}
