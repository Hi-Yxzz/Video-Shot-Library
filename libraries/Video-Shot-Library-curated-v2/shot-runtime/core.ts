import {
  InvalidShotParameterError,
  UnsupportedShotParameterError,
} from "./errors.ts";
import type {
  ShotComposition,
  ShotControl,
  ShotDefinition,
  ShotFilter,
  ShotOverrides,
} from "./types.ts";

const COLOR_PATTERN =
  /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const COMMON_PARAMETER_KEYS = [
  "text",
  "secondaryText",
  "primaryColor",
  "secondaryColor",
  "backgroundColor",
] as const;

function invalid(
  shotId: string,
  parameter: string,
  value: unknown,
): never {
  throw new InvalidShotParameterError(shotId, parameter, value);
}

function validateControl(
  shotId: string,
  control: ShotControl,
  value: unknown,
): void {
  if (
    (control.type === "text" || control.type === "select") &&
    typeof value !== "string"
  ) {
    invalid(shotId, control.key, value);
  }
  if (control.type === "color") {
    if (typeof value !== "string" || !COLOR_PATTERN.test(value)) {
      invalid(shotId, control.key, value);
    }
  }
  if (control.type === "boolean" && typeof value !== "boolean") {
    invalid(shotId, control.key, value);
  }
  if (control.type === "number") {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      (control.min !== undefined && value < control.min) ||
      (control.max !== undefined && value > control.max)
    ) {
      invalid(shotId, control.key, value);
    }
  }
  if (
    control.type === "select" &&
    !control.options.includes(value as string)
  ) {
    invalid(shotId, control.key, value);
  }
}

export function createProps(
  shotId: string,
  defaults: Record<string, unknown>,
  controls: readonly ShotControl[],
  commonMappings: Readonly<Record<string, string>>,
  overrides: ShotOverrides = {},
): Record<string, unknown> {
  const result = { ...defaults };
  const controlsByKey = new Map(
    controls.map((control) => [control.key, control]),
  );

  for (const commonKey of COMMON_PARAMETER_KEYS) {
    const value = overrides[commonKey];
    if (value === undefined) {
      continue;
    }
    const target = commonMappings[commonKey];
    if (!target) {
      throw new UnsupportedShotParameterError(shotId, commonKey);
    }
    const control = controlsByKey.get(`custom.${target}`);
    if (!control) {
      throw new UnsupportedShotParameterError(shotId, commonKey);
    }
    validateControl(shotId, control, value);
    result[target] = value;
  }

  for (const [key, value] of Object.entries(overrides.custom ?? {})) {
    const control = controlsByKey.get(`custom.${key}`);
    if (!control) {
      throw new UnsupportedShotParameterError(shotId, `custom.${key}`);
    }
    validateControl(shotId, control, value);
    result[key] = value;
  }

  return result;
}

export function createComposition(
  shotId: string,
  base: ShotComposition,
  overrides: ShotOverrides = {},
): ShotComposition {
  const duration = overrides.durationInFrames;
  if (
    duration !== undefined &&
    (!Number.isInteger(duration) || duration <= 0)
  ) {
    invalid(shotId, "durationInFrames", duration);
  }
  return duration === undefined
    ? { ...base }
    : { ...base, durationInFrames: duration };
}

export function filterShots(
  shots: readonly ShotDefinition[],
  filters: ShotFilter = {},
): ShotDefinition[] {
  return shots.filter((shot) => {
    if (filters.kind && shot.kind !== filters.kind) {
      return false;
    }
    if (filters.grade && shot.metadata.grade !== filters.grade) {
      return false;
    }
    if (
      filters.category &&
      shot.metadata.category !== filters.category
    ) {
      return false;
    }
    if (
      filters.tags?.length &&
      !filters.tags.some((tag) => shot.metadata.tags.includes(tag))
    ) {
      return false;
    }
    return true;
  });
}

export function searchShotDefinitions(
  shots: readonly ShotDefinition[],
  keyword: string,
  filters: ShotFilter = {},
): ShotDefinition[] {
  const normalized = keyword.trim().toLocaleLowerCase();
  return filterShots(shots, filters).filter((shot) => {
    if (!normalized) {
      return true;
    }
    return [
      shot.id,
      shot.metadata.title,
      shot.metadata.summary,
      shot.metadata.use,
      ...shot.metadata.tags,
    ].some((value) => value.toLocaleLowerCase().includes(normalized));
  });
}

function editDistance(left: string, right: string): number {
  const previous = Array.from(
    { length: right.length + 1 },
    (_, index) => index,
  );

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution =
        previous[rightIndex - 1] +
        (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        substitution,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

export function suggestShotIds(
  shotId: string,
  ids: readonly string[],
  limit = 3,
): string[] {
  return [...ids]
    .map((id) => ({ id, distance: editDistance(shotId, id) }))
    .sort((left, right) =>
      left.distance - right.distance || left.id.localeCompare(right.id)
    )
    .slice(0, Math.max(0, limit))
    .map(({ id }) => id);
}
