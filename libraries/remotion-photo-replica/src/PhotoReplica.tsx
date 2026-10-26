import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {LoopingTrack} from "./components/LoopingTrack";
import {PortraitScene} from "./components/PortraitScene";
import type {PhotoReplicaProps} from "./config";

export const PhotoReplica = (props: PhotoReplicaProps) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#bfc4c7",
        opacity: interpolate(frame, [0, 24], [0.18, 1], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <PortraitScene {...props} layer="background" />

      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          paddingTop: 54,
          zIndex: 1,
        }}
      >
        <LoopingTrack
          config={props.topTrack}
          name="Background element track"
        />
      </AbsoluteFill>

      <AbsoluteFill style={{zIndex: 2}}>
        <PortraitScene {...props} layer="foreground" />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          paddingBottom: 42,
          zIndex: 3,
        }}
      >
        <LoopingTrack
          config={props.bottomTrack}
          name="Foreground element track"
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          zIndex: 4,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,${props.vignetteAmount}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
