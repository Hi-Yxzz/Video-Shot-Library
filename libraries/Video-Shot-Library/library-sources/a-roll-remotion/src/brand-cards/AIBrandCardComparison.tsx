import {AbsoluteFill, useCurrentFrame} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import {BrandCard} from "./BrandCard";
import type {AIBrandCardProps} from "./types";

export const AIBrandCardComparison = (props: AIBrandCardProps) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: "#c8cdcf", overflow: "hidden"}}>
      <PhotoPresenterPanel
        portraitSrc={props.portraitSrc}
        portraitScale={props.portraitScale}
        portraitPositionX={props.portraitPositionX}
        portraitPositionY={props.portraitPositionY}
        breathingAmount={props.breathingAmount}
        floatingAmount={props.floatingAmount}
        cameraPushAmount={props.cameraPushAmount}
        durationInFrames={props.durationInFrames}
        frame={frame}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.06), transparent 32%, rgba(0,0,0,.03))",
        }}
      />
      <BrandCard
        config={props.leftCard}
        frame={frame}
        enterStart={props.leftEnterStart}
        enterEnd={props.leftEnterEnd}
        phase={0}
      />
      <BrandCard
        config={props.rightCard}
        frame={frame}
        enterStart={props.rightEnterStart}
        enterEnd={props.rightEnterEnd}
        phase={0}
      />
    </AbsoluteFill>
  );
};
