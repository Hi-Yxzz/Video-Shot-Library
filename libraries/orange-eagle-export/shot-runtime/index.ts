import catalog from "../public/data/library.json";
import { remocnAdapters } from "./adapters/remocn.ts";
import { remotionBitsAdapters } from "./adapters/remotion-bits.ts";
import {
  filterShots,
  searchShotDefinitions,
} from "./core.ts";
import {
  createShotRegistry,
  getShotFromRegistry,
  type CatalogCard,
} from "./registry.ts";
import type {
  ShotControl,
  ShotDefinition,
  ShotFilter,
} from "./types.ts";

const registry = createShotRegistry(
  catalog.cards as CatalogCard[],
  { ...remocnAdapters, ...remotionBitsAdapters },
);
const orderedShots = catalog.cards.map((card) =>
  getShotFromRegistry(registry, card.id)
);

export function getShot(id: string): ShotDefinition {
  return getShotFromRegistry(registry, id);
}

export function hasShot(id: string): boolean {
  return registry.has(id);
}

export function listShots(filters: ShotFilter = {}): ShotDefinition[] {
  return filterShots(orderedShots, filters);
}

export function searchShots(
  keyword: string,
  filters: ShotFilter = {},
): ShotDefinition[] {
  return searchShotDefinitions(orderedShots, keyword, filters);
}

export function getShotControls(id: string): ShotControl[] {
  const shot = getShot(id);
  return shot.kind === "executable"
    ? shot.controls.map((control) => ({ ...control }))
    : [];
}

export * from "./errors.ts";
export type * from "./types.ts";
