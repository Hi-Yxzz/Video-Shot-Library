import type { ComponentType } from "react";

import manifest from "../../players/remocn/src/manifest.json";
import { remocnScenes } from "../../players/remocn/src/scenes.generated.ts";
import {
  commonMappingsFromConfig,
  controlsFromConfig,
  type RawControl,
  type ShotAdapter,
} from "./shared.ts";

type RawRemocnScene = {
  Component?: ComponentType<unknown>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  controls: Record<string, RawControl>;
  inputProps: Record<string, unknown>;
};

type ManifestEntry = {
  collection: "remocn" | "remocn-ui";
};

const scenes = remocnScenes as unknown as Record<string, RawRemocnScene>;
const entries = manifest as Record<string, ManifestEntry>;
const prefixes = {
  remocn: "remocn/",
  "remocn-ui": "remocn-ui/",
} as const;

export const remocnAdapters: Record<string, ShotAdapter> =
  Object.fromEntries(
    Object.entries(scenes).flatMap(([upstreamId, scene]) => {
      const entry = entries[upstreamId];
      if (!entry || !scene.Component) {
        return [];
      }
      const id = `${prefixes[entry.collection]}${upstreamId}`;
      return [[id, {
        Component: scene.Component as ComponentType<Record<string, unknown>>,
        composition: {
          id,
          width: scene.width,
          height: scene.height,
          fps: scene.fps,
          durationInFrames: scene.durationInFrames,
        },
        inputProps: { ...scene.inputProps },
        controls: controlsFromConfig(scene.controls),
        commonMappings: commonMappingsFromConfig(scene.controls),
      }]];
    }),
  );
