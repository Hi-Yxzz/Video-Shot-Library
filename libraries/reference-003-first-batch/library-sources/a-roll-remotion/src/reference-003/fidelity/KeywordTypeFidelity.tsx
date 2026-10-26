import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getKeywordTypeFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const CharacterBuild = ({
  text,
  progress,
}: {
  text: string;
  progress: number;
}) => (
  <>
    {Array.from(text).map((character, index, characters) => {
      const step = 1 / Math.max(1, characters.length);
      const characterProgress = interpolate(
        progress,
        [index * step, Math.min(1, index * step + step * 1.8)],
        [0, 1],
        CLAMP,
      );

      return (
        <span
          key={`${character}-${index}`}
          style={{
            display: "inline-block",
            opacity: characterProgress,
            translate: `${interpolate(characterProgress, [0, 1], [34, 0])}px ${interpolate(characterProgress, [0, 1], [16, 0])}px`,
            filter: `blur(${interpolate(characterProgress, [0, 1], [7, 0])}px)`,
          }}
        >
          {character}
        </span>
      );
    })}
  </>
);

export const KeywordTypeFidelity = () => {
  const frame = useCurrentFrame();
  const state = getKeywordTypeFidelityState(frame);
  const cameraScale = interpolate(state.camera, [0, 1], [1, 1.075], CLAMP);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#eee9df",
        color: "#262421",
        fontFamily: R03_SERIF,
      }}
    >
      <AbsoluteFill
        style={{
          scale: cameraScale,
          transformOrigin: "50% 50%",
          opacity: interpolate(state.paper, [0, 1], [0.72, 1], CLAMP),
          backgroundImage:
            "radial-gradient(ellipse at 51% 44%, rgba(255,254,248,.98) 0%, rgba(248,244,235,.94) 58%, rgba(213,207,197,.94) 100%), repeating-linear-gradient(0deg, rgba(55,48,40,.045) 0 1px, transparent 1px 7px), repeating-linear-gradient(90deg, rgba(55,48,40,.035) 0 1px, transparent 1px 9px)",
          backgroundBlendMode: "normal, multiply, multiply",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 92,
            color: "#817a70",
            fontFamily: R03_SANS,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 7,
            opacity: state.microcopy,
            translate: `0 ${interpolate(state.microcopy, [0, 1], [18, 0])}px`,
          }}
        >
          FIELD NOTES / 04
        </div>

        <div
          style={{
            position: "absolute",
            left: 212,
            top: 328,
            width: 1496,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              whiteSpace: "nowrap",
              fontSize: 126,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: -7,
              textShadow:
                "2px 0 rgba(48,84,145,.16), -1px 0 rgba(193,131,53,.16)",
            }}
          >
            <span>
              <CharacterBuild text="让每个想法" progress={state.headline} />
            </span>
            <span
              style={{
                position: "relative",
                marginLeft: 34,
                padding: "18px 34px 28px",
                overflow: "hidden",
                color: "#f8f4ea",
                background: "#2149bb",
                boxShadow:
                  "0 18px 30px rgba(33,73,187,.16), -8px 10px 0 rgba(25,35,72,.09)",
                opacity: state.keyword,
                clipPath: `inset(0 ${(1 - state.keyword) * 100}% 0 0)`,
                translate: `0 ${interpolate(state.keyword, [0, 1], [24, 0])}px`,
              }}
            >
              清晰
            </span>
          </div>

          <div
            style={{
              position: "relative",
              marginTop: 42,
              display: "flex",
              alignItems: "baseline",
              fontSize: 146,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: -9,
            }}
          >
            <CharacterBuild text="从深度观察开始" progress={state.headline} />
            <span
              style={{
                position: "absolute",
                left: 316,
                bottom: -24,
                width: 786,
                height: 22,
                background: "#d79b32",
                boxShadow: "0 7px 0 rgba(35,58,155,.86)",
                opacity: state.underline,
                scale: `${state.underline} 1`,
                transformOrigin: "left center",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 100,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#686159",
              fontFamily: R03_SANS,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 6,
              opacity: state.microcopy,
              translate: `0 ${interpolate(state.microcopy, [0, 1], [24, 0])}px`,
            }}
          >
            <span>OBSERVE / FRAME / REFINE</span>
            <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 86, height: 2, background: "#d79b32" }} />
              SYSTEM STUDY
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 177,
            top: 460,
            width: 12,
            height: 118,
            background: "#d79b32",
            opacity: state.headline,
            boxShadow: "18px 0 0 #272522",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
