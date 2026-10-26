import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(scriptPath), "..");

export function createPlayerManifests(catalog) {
  if (!Array.isArray(catalog?.cards)) {
    throw new TypeError("Graded catalog cards must be an array");
  }

  const remocn = {};
  const bits = {};

  for (const card of catalog.cards) {
    const target = card.collection === "remotion-bits" ? bits : remocn;
    if (target[card.upstreamId]) {
      throw new TypeError(`Duplicate player shot: ${card.upstreamId}`);
    }
    target[card.upstreamId] = {
      compositionId: card.compositionId,
      collection: card.collection,
      grade: card.grade,
      title: card.title,
      ...(card.collection === "remotion-bits"
        ? {
          modulePath: card.codeFiles[0].replace(
            "library-sources/remotion-bits/",
            "",
          ),
        }
        : {}),
    };
  }

  return { bits, remocn };
}

export function resolveShotId(search, manifest) {
  const shot = new URLSearchParams(search).get("shot");
  if (
    !shot ||
    !/^[a-z0-9-]+$/.test(shot) ||
    !Object.hasOwn(manifest, shot)
  ) {
    throw new TypeError(`Unknown shot: ${shot ?? ""}`);
  }
  return shot;
}

function bitsImports(manifest) {
  const entries = Object.entries(manifest);
  const imports = entries.map(
    ([, entry], index) =>
      `import { Component as Scene${index}, metadata as metadata${index} } from "../../../library-sources/remotion-bits/${entry.modulePath}";`,
  );
  const records = entries.map(
    ([id], index) =>
      `  ${JSON.stringify(id)}: { Component: Scene${index}, metadata: metadata${index} },`,
  );
  return `${imports.join("\n")}

export const bitScenes = {
${records.join("\n")}
} as const;
`;
}

function pascalCase(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

const REMOCN_WITHOUT_CONFIG = new Set([
  "ai-prompt-flow",
  "brush",
  "chat-flow",
  "checkout-flow",
  "imessage-chat-flow",
  "onboarding-stepper-flow",
  "settings-toggle-flow",
  "signup-flow",
  "telegram-chat-flow",
]);

export function createRemocnScenesSource(manifest, exampleIds) {
  const entries = Object.entries(manifest);
  const imports = [];
  const records = [];

  for (const [index, [id, entry]] of entries.entries()) {
    const family = entry.collection;
    const base =
      `../../../library-sources/remocn/registry/${family}/${id}`;
    imports.push(`import * as Module${index} from "${base}/index.tsx";`);
    if (exampleIds.has(id)) {
      imports.push(
        `import * as Example${index} from "../../../library-sources/remocn/components/docs/examples/${id}-example.tsx";`,
      );
    }
    if (!REMOCN_WITHOUT_CONFIG.has(id)) {
      imports.push(`import * as Config${index} from "${base}/config.ts";`);
    }
    const configModule = REMOCN_WITHOUT_CONFIG.has(id)
      ? "{}"
      : `Config${index}`;
    const fallbackName = id === "brush" ? "BrushGrain" : pascalCase(id);
    const exampleModule = exampleIds.has(id) ? `Example${index}` : "{}";
    records.push(`  ${JSON.stringify(id)}: scene(
    Module${index},
    ${configModule},
    ${exampleModule},
    ${JSON.stringify(fallbackName)},
  ),`);
  }

  return `import type { ComponentType } from "react";
${imports.join("\n")}

type SceneConfig = {
  componentName: string;
  durationInFrames: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
  controls?: Record<string, SceneControl>;
};

type SceneControl = {
  type: "text" | "number" | "color" | "boolean" | "select";
  default?: unknown;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly (string | number)[];
};

function scene(
  componentModule: Record<string, unknown>,
  configModule: Record<string, unknown>,
  exampleModule: Record<string, unknown>,
  fallbackName: string,
) {
  const config = Object.values(configModule).find(
    (value): value is SceneConfig =>
      value !== null &&
      typeof value === "object" &&
      "componentName" in value &&
      "durationInFrames" in value,
  );
  const componentName = config?.componentName ?? fallbackName;
  const ExampleComponent = Object.entries(exampleModule).find(
    ([name, value]) =>
      name.endsWith("ExampleScene") && typeof value === "function",
  )?.[1] as ComponentType | undefined;
  const Component =
    ExampleComponent ??
    (componentModule[componentName] as ComponentType | undefined);
  const inputProps = Object.fromEntries(
    Object.entries(config?.controls ?? {}).map(([key, control]) => [
      key,
      control.default,
    ]),
  );
  return {
    Component,
    durationInFrames: config?.durationInFrames ?? 180,
    fps: config?.fps ?? 30,
    width: config?.compositionWidth ?? 1920,
    height: config?.compositionHeight ?? 1080,
    controls: config?.controls ?? {},
    inputProps,
  };
}

export const remocnScenes = {
${records.join("\n")}
} as const;
`;
}

export async function writePlayerManifests(root = projectRoot) {
  const catalog = JSON.parse(
    await readFile(resolve(root, "source/graded-library.json"), "utf8"),
  );
  const manifests = createPlayerManifests(catalog);
  const exampleIds = new Set(
    (await readdir(
      resolve(root, "library-sources/remocn/components/docs/examples"),
    ))
      .filter((name) => name.endsWith("-example.tsx"))
      .map((name) => name.slice(0, -"-example.tsx".length)),
  );
  const outputs = [
    ["players/remocn/src/manifest.json", manifests.remocn],
    ["players/remotion-bits/src/manifest.json", manifests.bits],
  ];

  for (const [path, manifest] of outputs) {
    const output = resolve(root, path);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
  }
  await writeFile(
    resolve(root, "players/remotion-bits/src/scenes.generated.ts"),
    bitsImports(manifests.bits),
  );
  await writeFile(
    resolve(root, "players/remocn/src/scenes.generated.ts"),
    createRemocnScenesSource(manifests.remocn, exampleIds),
  );
  return manifests;
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const { bits, remocn } = await writePlayerManifests();
  console.log(
    `Generated player manifests: ${Object.keys(remocn).length} Remocn, ${Object.keys(bits).length} Remotion Bits.`,
  );
}
