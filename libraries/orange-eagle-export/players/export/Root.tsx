import type { ComponentType } from "react";
import { Composition } from "remotion";

import library from "../../public/data/library.json";
import { remocnScenes } from "../remocn/src/scenes.generated";
import { bitScenes } from "../remotion-bits/src/scenes.generated";
import "../../library-sources/remocn/app/globals.css";

const TARGET_CATEGORIES = new Set(["camera", "data", "typography"]);
const targetIds = new Set(
  library.cards
    .filter(
      (card) =>
        card.previewKind === "player" &&
        TARGET_CATEGORIES.has(card.category) &&
        card.compositionId,
    )
    .map((card) => card.compositionId as string),
);

export const ExportRoot = () => (
  <>
    {Object.entries(remocnScenes)
      .filter(([id, scene]) => targetIds.has(id) && scene.Component)
      .map(([id, scene]) => (
        <Composition
          key={id}
          id={id}
          component={scene.Component as ComponentType<Record<string, unknown>>}
          durationInFrames={scene.durationInFrames}
          fps={scene.fps}
          width={scene.width}
          height={scene.height}
          defaultProps={scene.inputProps}
        />
      ))}
    {Object.entries(bitScenes)
      .filter(([id]) => targetIds.has(id))
      .map(([id, scene]) => (
        <Composition
          key={id}
          id={id}
          component={scene.Component}
          durationInFrames={scene.metadata.duration ?? 180}
          fps={30}
          width={scene.metadata.width ?? 1920}
          height={scene.metadata.height ?? 1080}
        />
      ))}
  </>
);
