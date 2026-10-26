import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { REFERENCE_003_AROLL_CLIPS } from "../aroll-clips";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getMonochromeQuotePortraitFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const MonochromeQuotePortraitFidelity = () => {
  const frame = useCurrentFrame();
  const state = getMonochromeQuotePortraitFidelityState(frame);
  const clip = REFERENCE_003_AROLL_CLIPS.monochromeQuotePortrait;
  const camera = interpolate(state.camera, [0, 1], [1, 1.045], CLAMP);
  const textShift = interpolate(state.quote, [0, 1], [-72, 0], CLAMP);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0c0d0d", color: "#d8d6cf" }}>
      <div
        style={{
          position: "absolute",
          right: -80,
          top: -20,
          width: 930,
          height: 1140,
          opacity: state.video,
          transform: `scale(${camera}) translateX(${interpolate(state.camera, [0, 1], [30, 0], CLAMP)}px)`,
          transformOrigin: "right center",
          overflow: "hidden",
          filter: `grayscale(${state.monochrome}) contrast(${interpolate(state.monochrome, [0, 1], [1, 1.25])}) brightness(.72)`,
          WebkitMaskImage: "linear-gradient(90deg,transparent 0%,rgba(0,0,0,.24) 13%,#000 38%,#000 100%)",
        }}
      >
        <Video
          src={staticFile(clip.src)}
          trimBefore={clip.trimBefore}
          muted
          objectFit={clip.objectFit}
          style={{
            width: "100%",
            height: "100%",
            objectPosition: clip.objectPosition,
            transform: `scale(${clip.scale})`,
          }}
        />
      </div>

      <AbsoluteFill
        style={{
          opacity: state.grid * 0.42,
          backgroundImage:
            "linear-gradient(rgba(222,218,208,.13) 1px,transparent 1px),linear-gradient(90deg,rgba(222,218,208,.11) 1px,transparent 1px)",
          backgroundSize: "100% 270px,480px 100%",
          transform: `translateX(${interpolate(state.camera, [0, 1], [-28, 0])}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 160,
          width: 1060,
          fontFamily: R03_SERIF,
          transform: `translateX(${textShift}px)`,
        }}
      >
        <div
          style={{
            opacity: state.giantLetters,
            fontSize: 116,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -7,
            textShadow: "5px 0 rgba(43,140,170,.46),-4px 0 rgba(196,136,52,.34),0 0 18px rgba(225,220,205,.18)",
            clipPath: `inset(0 ${interpolate(state.giantLetters, [0, 1], [100, 0])}% 0 0)`,
          }}
        >
          好的系统，
          <br />
          经得起实践
        </div>
        <div
          style={{
            marginTop: 36,
            width: 760,
            paddingTop: 26,
            borderTop: "1px solid rgba(222,218,208,.48)",
            opacity: state.quote,
            fontFamily: R03_SANS,
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: 5,
            lineHeight: 1.5,
          }}
        >
          不是复制答案，而是验证每一个关键假设。
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 116,
          bottom: 82,
          opacity: state.marks,
          fontFamily: R03_SANS,
          color: "#8f918e",
          fontSize: 18,
          letterSpacing: 6,
        }}
      >
        PRACTICE / EVIDENCE / ITERATION
      </div>
      <div
        style={{
          position: "absolute",
          left: 990,
          top: 666,
          opacity: state.marks * 0.64,
          fontFamily: R03_SERIF,
          fontSize: 250,
          lineHeight: 1,
          color: "#999a96",
          textShadow: "4px 0 rgba(42,130,166,.28),-4px 0 rgba(191,127,39,.22)",
        }}
      >
        ”
      </div>
      <AbsoluteFill
        style={{
          opacity: 0.16,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.42'/%3E%3C/svg%3E\")",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
