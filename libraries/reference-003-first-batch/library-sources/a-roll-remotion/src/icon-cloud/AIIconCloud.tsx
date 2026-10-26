import {AbsoluteFill, useCurrentFrame} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import {FloatingIcon} from "./FloatingIcon";
import type {AIIconCloudProps} from "./types";

export const AIIconCloud = (props: AIIconCloudProps) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#c8cdcf"}}>
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
      {props.icons.map((icon, index) => (
        <FloatingIcon
          key={icon.id}
          config={icon}
          frame={frame}
          index={index}
          enterStart={props.enterStart}
          enterStagger={props.enterStagger}
          enterDuration={props.enterDuration}
          exitStart={props.exitStart}
          exitEnd={props.exitEnd}
        />
      ))}
    </AbsoluteFill>
  );
};
