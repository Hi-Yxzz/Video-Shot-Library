"use client";

import type { LibraryCard, ShotStyle } from "./library-model";
import { ShotPlayer } from "./shot-player";
import { ShotVideo } from "./shot-video";

type ShotPreviewProps = {
  autoPlay?: boolean;
  card: LibraryCard;
  controls?: boolean;
  style: ShotStyle;
};

export function ShotPreview({
  autoPlay = false,
  card,
  controls = false,
  style,
}: ShotPreviewProps) {
  return card.previewKind === "player"
    ? <ShotPlayer autoPlay={autoPlay} card={card} controls={controls} />
    : <ShotVideo autoPlay={autoPlay} controls={controls} style={style} />;
}
