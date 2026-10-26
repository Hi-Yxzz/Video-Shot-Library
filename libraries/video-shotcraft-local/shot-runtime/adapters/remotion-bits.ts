import type { ComponentType } from "react";

import { bitScenes } from "../../players/remotion-bits/src/scenes.generated.ts";
import type { ShotAdapter } from "./shared.ts";

type RawBitScene = {
  Component: ComponentType<unknown>;
  metadata: {
    duration?: number;
    width?: number;
    height?: number;
  };
};

const scenes = bitScenes as unknown as Record<string, RawBitScene>;

export const remotionBitsAdapters: Record<string, ShotAdapter> =
  Object.fromEntries(
    Object.entries(scenes).map(([upstreamId, scene]) => {
      const id = `remotion-bits/${upstreamId}`;
      return [id, {
        Component: scene.Component as ComponentType<Record<string, unknown>>,
        composition: {
          id,
          width: scene.metadata.width ?? 1920,
          height: scene.metadata.height ?? 1080,
          fps: 30,
          durationInFrames: scene.metadata.duration ?? 180,
        },
        inputProps: {},
        controls: [],
        commonMappings: {},
      }];
    }),
  );
