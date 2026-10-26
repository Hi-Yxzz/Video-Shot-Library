import {Video} from "@remotion/media";
import {staticFile} from "remotion";
import type {ArollSelection} from "./types";

type SharedArollProps = {
  readonly selection: ArollSelection;
};

export const SharedAroll = ({selection}: SharedArollProps) => (
  <Video
    name="Shared A-roll"
    src={staticFile(selection.src)}
    from={selection.fromFrame}
    durationInFrames={selection.durationInFrames}
    trimBefore={selection.trimBeforeFrames}
    trimAfter={selection.trimAfterFrames}
    cropLeft={selection.crop.left}
    cropRight={selection.crop.right}
    cropTop={selection.crop.top}
    cropBottom={selection.crop.bottom}
    muted
    objectFit="cover"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectPosition: selection.objectPosition,
      opacity: selection.opacity,
      scale: selection.scale,
      translate: `${selection.translateX}px ${selection.translateY}px`,
      filter: `blur(${selection.blurPx}px) brightness(${selection.grade.brightness}) contrast(${selection.grade.contrast}) saturate(${selection.grade.saturation}) sepia(${selection.grade.sepia})`,
    }}
  />
);
