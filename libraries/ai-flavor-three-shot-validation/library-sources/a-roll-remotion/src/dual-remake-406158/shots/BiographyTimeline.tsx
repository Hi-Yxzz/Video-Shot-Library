import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DUAL_REMAKE_406158_PAIRS } from "../catalog";
import { deterministicTextureValue, segmentProgress } from "../motion";
import { SharedAroll } from "../SharedAroll";
import type { RemakeMode } from "../types";

const pair = DUAL_REMAKE_406158_PAIRS[4];
const aroll = pair.fast.aroll;

if (!aroll) {
  throw new Error("Biography timeline requires the catalog A17 selection");
}

const SERIF = '"Songti SC", "STSong", "Noto Serif SC", Georgia, serif';
const SANS = '"PingFang SC", "Helvetica Neue", Arial, sans-serif';

const ease = (frame: number, from: number, to: number) =>
  Easing.out(Easing.cubic)(segmentProgress(frame, from, to));

const timeline = [
  { year: "2007", text: pair.copy.body[0] },
  { year: "2011", text: pair.copy.body[1] },
  { year: "2019", text: pair.copy.body[2] },
] as const;

export const BiographyTimeline = ({ mode }: { mode: RemakeMode }) => {
  const frame = useCurrentFrame();
  const fidelity = mode === "fidelity";
  const titleIn = ease(frame, 8, 38);
  const scan = ease(frame, 48, 104);
  const cameraProgress = segmentProgress(frame, 0, pair.durationInFrames - 1);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: pair.palette.background,
        color: pair.palette.text,
        fontFamily: SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, pair.durationInFrames - 1], [1, 1.03], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }),
          transformOrigin: "52% 48%",
        }}
      >
        <SharedAroll selection={aroll} />

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(28,22,26,.99) 0%, rgba(32,25,29,.98) 49%, rgba(31,24,28,.75) 67%, rgba(25,20,23,.25) 100%), linear-gradient(0deg, rgba(26,20,24,.91), transparent 52%)",
          }}
        />

        {fidelity ? (
          <>
            <AbsoluteFill
              style={{
                translate: `${cameraProgress * -13}px ${cameraProgress * 5}px`,
                opacity: 0.17,
                background:
                  "repeating-linear-gradient(0deg, transparent 0 30px, rgba(238,226,232,.1) 31px, transparent 32px), repeating-linear-gradient(90deg, transparent 0 73px, rgba(217,47,104,.08) 74px, transparent 75px)",
                filter: "blur(1.2px)",
              }}
            />
            <AbsoluteFill
              style={{
                translate: `${cameraProgress * -28}px ${cameraProgress * 8}px`,
                opacity: 0.12,
                background:
                  "linear-gradient(102deg, transparent 0 20%, rgba(215,47,104,.16) 20.2%, transparent 20.5%), linear-gradient(86deg, transparent 0 72%, rgba(242,237,229,.12) 72.2%, transparent 72.4%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 160,
                top: 104,
                color: "rgba(242,237,229,.08)",
                fontFamily: SERIF,
                fontSize: 174,
                fontWeight: 700,
                letterSpacing: ".08em",
                writingMode: "vertical-rl",
                filter: "blur(2.5px)",
              }}
            >
              人物履历
            </div>
          </>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 118,
            top: 102,
            width: 940,
            height: 190,
            overflow: "hidden",
            clipPath: `inset(0 ${(1 - titleIn) * 100}% 0 0)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -36,
              color: pair.palette.accent,
              fontFamily: "Georgia, serif",
              fontSize: 148,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            “
          </div>
          <div
            style={{
              position: "absolute",
              left: 86,
              top: 14,
              color: pair.palette.text,
              fontFamily: SERIF,
              fontSize: 93,
              fontWeight: 700,
              letterSpacing: ".035em",
              lineHeight: 1.08,
              textShadow: "0 2px 12px rgba(0,0,0,.45)",
              whiteSpace: "nowrap",
            }}
          >
            {pair.copy.headline}
          </div>
          <div
            style={{
              position: "absolute",
              left: 770,
              top: 34,
              color: pair.palette.accent,
              fontFamily: "Georgia, serif",
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            ”
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 174,
            top: 350,
            width: 1070,
            height: 430,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 7,
              width: 5,
              height: 350,
              backgroundColor: pair.palette.accent,
              scale: `1 ${ease(frame, 24, 66)}`,
              transformOrigin: "center top",
              boxShadow: "0 0 16px rgba(215,47,104,.24)",
            }}
          />

          {timeline.map((item, index) => {
            const start = 34 + index * 25;
            const reveal = ease(frame, start, start + 30);
            const isFocus = index === 1;

            return (
              <div
                key={item.year}
                style={{
                  position: "absolute",
                  left: 54,
                  top: index * 118,
                  width: 990,
                  height: 88,
                  overflow: "hidden",
                  clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
                }}
              >
                {isFocus ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 122,
                      top: 3,
                      width: 790,
                      height: 68,
                      backgroundColor: pair.palette.accent,
                      opacity: 0.83,
                      scale: `${scan} 1`,
                      transformOrigin: "left center",
                      boxShadow: "0 0 20px rgba(215,47,104,.2)",
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 24,
                    color: pair.palette.text,
                    fontFamily: SERIF,
                    fontSize: 45,
                    lineHeight: 1.48,
                    letterSpacing: ".012em",
                    textShadow: "0 2px 5px rgba(0,0,0,.55)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{ fontFamily: SANS, fontSize: 31, fontWeight: 300 }}
                  >
                    {item.year}
                  </span>
                  <span>{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 180,
            top: 840,
            display: "flex",
            gap: 28,
            opacity: ease(frame, 112, 148),
          }}
        >
          {pair.copy.labels.map((label, index) => (
            <div
              key={label}
              style={{
                color: index === 1 ? pair.palette.text : pair.palette.muted,
                fontFamily: SANS,
                fontSize: 23,
                fontWeight: 300,
                letterSpacing: ".18em",
                paddingBottom: 10,
                borderBottom:
                  index === 1
                    ? `3px solid ${pair.palette.accent}`
                    : "1px solid rgba(164,154,156,.35)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {fidelity ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 72% 44%, transparent 0 20%, rgba(24,18,22,.22) 62%, rgba(15,11,14,.57) 100%)",
          }}
        >
          {Array.from({ length: 72 }, (_, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${deterministicTextureValue(index, 51) * 100}%`,
                top: `${deterministicTextureValue(index, 79) * 100}%`,
                width: 1 + deterministicTextureValue(index, 103) * 3,
                height: 1 + deterministicTextureValue(index, 131) * 3,
                borderRadius: "50%",
                backgroundColor: "rgba(243,232,236,.48)",
                opacity: 0.08 + deterministicTextureValue(index, 167) * 0.12,
              }}
            />
          ))}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
