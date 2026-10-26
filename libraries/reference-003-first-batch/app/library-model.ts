export type CategoryLabel = {
  zh: string;
  en: string;
};

export type LibraryCategory = "all" | string;

export type ShotMedia = {
  url: string;
  type: string;
};

export type ShotStyle = {
  key: string;
  label: string;
  description: string;
  media?: ShotMedia;
  previewUrl?: string;
  implementationStatus: "implemented" | "reference-only";
};

export type LibraryCard = {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  use: string;
  duration: string;
  energy: string;
  category: string;
  recipePath: string | null;
  recipeUrl: string | null;
  recipeAvailable: boolean;
  demoFiles: string[];
  hasDemo: boolean;
  styles: ShotStyle[];
  upstreamId?: string;
  collection: string;
  grade: "S" | "A" | "B" | null;
  score: number | null;
  previewKind: "video" | "player";
  playerUrl: string | null;
  compositionId: string | null;
  sourceUrl: string;
  license: string;
  codeFiles: string[];
};

export type LibraryStats = {
  cardCount: number;
  styleCount: number;
  previewCount: number;
  mediaCount: number;
  newest: string | null;
  videoPreviewCount: number;
  playerPreviewCount: number;
};

export type LibraryCatalog = {
  cards: LibraryCard[];
  categories: Record<string, CategoryLabel>;
  generatedAt: string;
  revision: string;
  stats: LibraryStats;
  gradeCounts: Record<"S" | "A" | "B", number>;
};

export type LibraryFilters = {
  grade: "all" | "S" | "A" | "B";
  tags: readonly string[];
};

export function filterCards(
  cards: readonly LibraryCard[],
  query: string,
  category: LibraryCategory,
  filters: LibraryFilters = { grade: "all", tags: [] },
): LibraryCard[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return cards.filter((card) => {
    if (category !== "all" && card.category !== category) {
      return false;
    }
    if (filters.grade !== "all" && card.grade !== filters.grade) {
      return false;
    }
    if (
      filters.tags.length > 0 &&
      !filters.tags.some((tag) => card.tags.includes(tag))
    ) {
      return false;
    }

    if (normalizedQuery === "") {
      return true;
    }

    const searchable = [
      card.id,
      card.title,
      card.summary,
      card.use,
      card.collection,
      card.grade ?? "",
      ...card.tags,
      ...card.styles.flatMap((style) => [style.key, style.label]),
    ];

    return searchable.some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery)
    );
  });
}

export function getTagCounts(
  cards: readonly LibraryCard[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const card of cards) {
    for (const tag of new Set(card.tags)) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }

  return counts;
}

export function getCategoryCounts(
  cards: readonly LibraryCard[],
): Record<string, number> {
  const counts: Record<string, number> = { all: cards.length };

  for (const card of cards) {
    counts[card.category] = (counts[card.category] ?? 0) + 1;
  }

  return counts;
}
