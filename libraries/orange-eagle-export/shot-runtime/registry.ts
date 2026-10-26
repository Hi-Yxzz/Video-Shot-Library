import type { ShotAdapter } from "./adapters/shared.ts";
import {
  createComposition,
  createProps,
  suggestShotIds,
} from "./core.ts";
import {
  ShotNotFoundError,
  ShotRegistryError,
} from "./errors.ts";
import type {
  ShotDefinition,
  ShotMetadata,
  ShotOverrides,
} from "./types.ts";

export type CatalogCard = {
  id: string;
  title: string;
  summary: string;
  use: string;
  category: string;
  collection: string;
  grade: "S" | "A" | "B" | null;
  tags: string[];
  previewKind: "video" | "player";
  codeFiles: string[];
  styles: Array<{ previewUrl?: string | null }>;
};

function metadataFromCard(card: CatalogCard): ShotMetadata {
  return {
    title: card.title,
    summary: card.summary,
    use: card.use,
    category: card.category,
    collection: card.collection,
    grade: card.grade,
    tags: [...card.tags],
  };
}

function defaultsFromAdapter(adapter: ShotAdapter): ShotOverrides {
  const defaults: ShotOverrides = {
    durationInFrames: adapter.composition.durationInFrames,
    custom: { ...adapter.inputProps },
  };
  const editable = defaults as Record<string, unknown>;

  for (const [commonKey, target] of Object.entries(adapter.commonMappings)) {
    if (Object.hasOwn(adapter.inputProps, target)) {
      editable[commonKey] = adapter.inputProps[target];
    }
  }

  return defaults;
}

export function createShotRegistry(
  cards: readonly CatalogCard[],
  adapters: Readonly<Record<string, ShotAdapter>>,
): Map<string, ShotDefinition> {
  const registry = new Map<string, ShotDefinition>();

  for (const card of cards) {
    if (registry.has(card.id)) {
      throw new ShotRegistryError(`Duplicate shot id: ${card.id}`);
    }
    const metadata = metadataFromCard(card);
    if (card.previewKind === "player") {
      const adapter = adapters[card.id];
      if (!adapter) {
        throw new ShotRegistryError(
          `Missing executable shot adapter: ${card.id}`,
        );
      }
      registry.set(card.id, {
        kind: "executable",
        id: card.id,
        metadata,
        Component: adapter.Component,
        composition: { ...adapter.composition },
        defaults: defaultsFromAdapter(adapter),
        controls: adapter.controls.map((control) => ({ ...control })),
        createProps: (overrides) =>
          createProps(
            card.id,
            adapter.inputProps,
            adapter.controls,
            adapter.commonMappings,
            overrides,
          ),
        createComposition: (overrides) =>
          createComposition(card.id, adapter.composition, overrides),
        sourceFiles: [...card.codeFiles],
      });
      continue;
    }
    registry.set(card.id, {
      kind: "reference",
      id: card.id,
      metadata,
      previewUrl: card.styles.find((style) => style.previewUrl)?.previewUrl ??
        null,
      sourceFiles: [...card.codeFiles],
    });
  }

  for (const id of Object.keys(adapters)) {
    if (!registry.has(id)) {
      throw new ShotRegistryError(`Unknown shot adapter: ${id}`);
    }
  }

  return registry;
}

export function getShotFromRegistry(
  registry: ReadonlyMap<string, ShotDefinition>,
  id: string,
): ShotDefinition {
  const shot = registry.get(id);
  if (!shot) {
    throw new ShotNotFoundError(
      id,
      suggestShotIds(id, [...registry.keys()]),
    );
  }
  return shot;
}
