export class ShotNotFoundError extends Error {
  readonly shotId: string;
  readonly suggestions: string[];

  constructor(shotId: string, suggestions: string[] = []) {
    super(
      suggestions.length > 0
        ? `Unknown shot "${shotId}". Did you mean: ${suggestions.join(", ")}?`
        : `Unknown shot "${shotId}".`,
    );
    this.name = "ShotNotFoundError";
    this.shotId = shotId;
    this.suggestions = suggestions;
  }
}

export class ShotNotExecutableError extends Error {
  readonly shotId: string;

  constructor(shotId: string) {
    super(`Shot "${shotId}" is a reference and cannot be rendered as a component.`);
    this.name = "ShotNotExecutableError";
    this.shotId = shotId;
  }
}

export class UnsupportedShotParameterError extends Error {
  readonly shotId: string;
  readonly parameter: string;

  constructor(shotId: string, parameter: string) {
    super(`Shot "${shotId}" does not support parameter "${parameter}".`);
    this.name = "UnsupportedShotParameterError";
    this.shotId = shotId;
    this.parameter = parameter;
  }
}

export class InvalidShotParameterError extends Error {
  readonly shotId: string;
  readonly parameter: string;
  readonly value: unknown;

  constructor(shotId: string, parameter: string, value: unknown) {
    super(`Shot "${shotId}" received an invalid value for "${parameter}".`);
    this.name = "InvalidShotParameterError";
    this.shotId = shotId;
    this.parameter = parameter;
    this.value = value;
  }
}

export class ShotRegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShotRegistryError";
  }
}
