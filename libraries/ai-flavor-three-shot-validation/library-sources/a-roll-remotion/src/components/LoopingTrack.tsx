import {useCurrentFrame, useVideoConfig} from "remotion";
import type {TrackConfig} from "../config";
import {getLoopOffset, getRepeatCount} from "../lib/looping";
import {ElementCard} from "./ElementCard";

type LoopingTrackProps = {
  config: TrackConfig;
  name: string;
};

export const LoopingTrack = ({config, name}: LoopingTrackProps) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  if (config.items.length === 0) {
    return null;
  }

  const unitWidth = config.items.length * (config.cardWidth + config.gap);
  const repeatCount = getRepeatCount(width, unitWidth);
  const offset = getLoopOffset({
    frame,
    speed: config.speed,
    unitWidth,
    direction: config.direction,
  });

  return (
    <div
      aria-label={name}
      style={{
        width: "100%",
        overflow: "hidden",
        opacity: config.opacity,
        filter: `blur(${config.blur}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: config.gap,
          width: "max-content",
          translate: `${offset}px 0`,
        }}
      >
        {Array.from({length: repeatCount}).flatMap((_, repeatIndex) =>
          config.items.map((item) => (
            <ElementCard
              key={`${repeatIndex}-${item.id}`}
              item={item}
              width={config.cardWidth}
              height={config.cardHeight}
              borderRadius={config.borderRadius}
              shadow={config.shadow}
            />
          )),
        )}
      </div>
    </div>
  );
};
