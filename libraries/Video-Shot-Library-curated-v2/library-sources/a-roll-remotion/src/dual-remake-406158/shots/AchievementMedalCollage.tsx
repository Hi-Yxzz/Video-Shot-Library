import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import { SharedAroll } from "../SharedAroll";
import { DUAL_REMAKE_406158_PAIRS } from "../catalog";
import { sampleCamera } from "../motion";
import { AnchorLayer, CameraLayer } from "../shared";
import type { RemakeMode } from "../types";

type AchievementMedalCollageProps = {
  readonly mode: RemakeMode;
};

const PAIR = DUAL_REMAKE_406158_PAIRS[0];

type LayerTransform = {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly rotate: number;
  readonly opacity: number;
};

export const sampleAchievementTimeline = (
  frame: number,
  mode: RemakeMode,
): {
  readonly people: readonly LayerTransform[];
  readonly medal: LayerTransform;
  readonly majorOpacity: {
    readonly headline: number;
    readonly medal: number;
    readonly arroll: number;
    readonly bars: readonly number[];
  };
} => {
  const fidelity = mode === "fidelity";
  const medalEntrance = spring({
    frame: frame - 18,
    fps: PAIR.fps,
    durationInFrames: 40,
    config: { damping: 18, stiffness: 120, mass: 0.8, overshootClamping: true },
  });
  const majorOpacity = {
    headline: interpolate(frame, [8, 32], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
    medal: interpolate(frame, [18, 52], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
    arroll: interpolate(frame, [42, 78], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
    bars: [0, 1, 2].map((index) =>
      interpolate(frame, [58 + index * 20, 86 + index * 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    ),
  };
  const people = [
    { x: 760, y: 72, scale: 0.74, rotate: -7, opacity: 0.3 },
    { x: 940, y: 212, scale: 0.9, rotate: 5, opacity: 0.48 },
    { x: -118, y: 344, scale: 1.38, rotate: -4, opacity: 0.34 },
    ...(fidelity
      ? [
          { x: 1220, y: 96, scale: 0.68, rotate: 8, opacity: 0.26 },
          { x: 1510, y: 326, scale: 1.2, rotate: 5, opacity: 0.2 },
        ]
      : []),
  ].map((layer, index) => ({
    x: interpolate(
      frame,
      [20 + index * 8, 58 + index * 8, 179],
      [
        layer.x + (index % 2 === 0 ? -260 : 260),
        layer.x,
        layer.x + (fidelity ? index * 8 - 14 : index * 4 - 6),
      ],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      },
    ),
    y: interpolate(frame, [0, 179], [layer.y + 18, layer.y - index * 3], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }),
    scale: interpolate(
      frame,
      [20 + index * 8, 58 + index * 8],
      [layer.scale * 0.86, layer.scale],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      },
    ),
    rotate: interpolate(
      frame,
      [20 + index * 8, 62 + index * 8],
      [layer.rotate * 1.8, layer.rotate],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      },
    ),
    opacity: interpolate(
      frame,
      [28 + index * 10, 58 + index * 10],
      [0, layer.opacity],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  }));

  return {
    people,
    majorOpacity,
    medal: {
      x: interpolate(
        frame,
        [0, 52, 179],
        [-390, -158, fidelity ? -172 : -158],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        },
      ),
      y: interpolate(frame, [0, 52, 179], [36, 4, fidelity ? 10 : 6], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
      scale: interpolate(medalEntrance, [0, 1], [0.58, 0.86], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      rotate: interpolate(medalEntrance, [0, 1], [-12, -3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      opacity: majorOpacity.medal,
    },
  };
};

const PersonSilhouette = ({
  index,
  fidelity,
}: {
  readonly index: number;
  readonly fidelity: boolean;
}) => (
  <svg viewBox="0 0 260 620" style={{ width: 260, height: 620 }}>
    <ellipse
      cx="130"
      cy="118"
      rx={72 + (index % 2) * 8}
      ry="88"
      fill={fidelity ? "#272522" : "#3d3933"}
    />
    <path
      d="M28 620c8-208 42-336 102-336s96 128 102 336Z"
      fill={fidelity ? "#1f1d1a" : "#34312d"}
    />
    <path
      d="M68 105c10-74 116-102 138-12-32-24-100-24-138 12Z"
      fill="#171614"
    />
  </svg>
);

const Medal = ({ fidelity }: { readonly fidelity: boolean }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: fidelity
        ? "radial-gradient(circle at 36% 30%, #fff1a9 0%, #d9a83f 24%, #ae7824 66%, #65410e 100%)"
        : "radial-gradient(circle at 36% 30%, #f7dda0 0%, #c99a3f 48%, #825514 100%)",
      border: fidelity ? "18px double #8a5e17" : "12px solid #9a6b20",
      boxShadow: fidelity
        ? "32px 42px 0 rgba(38, 30, 20, 0.24), inset 0 0 0 10px rgba(255, 240, 173, 0.3), inset -18px -22px 28px rgba(81, 48, 4, 0.35)"
        : "18px 24px 0 rgba(38, 30, 20, 0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#5e3d0c",
      textAlign: "center",
      fontFamily: "Georgia, 'Times New Roman', serif",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 28,
        border: "3px dashed rgba(91, 57, 7, 0.62)",
        borderRadius: "50%",
      }}
    />
    <div style={{ fontSize: 86, lineHeight: 0.9, fontWeight: 800 }}>
      ★
      <div style={{ fontSize: 26, letterSpacing: 4, marginTop: 18 }}>
        ACHIEVEMENT
      </div>
    </div>
  </div>
);

export const AchievementMedalCollage = ({
  mode,
}: AchievementMedalCollageProps) => {
  const frame = useCurrentFrame();
  const fidelity = mode === "fidelity";
  const camera = sampleCamera(PAIR.cameraBeats, frame);
  const sharedAroll = PAIR[mode].aroll;
  const timeline = sampleAchievementTimeline(frame, mode);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#d8d6cf",
        color: PAIR.palette.text,
        fontFamily: "Arial, 'PingFang SC', sans-serif",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: fidelity ? 0.72 : 0.5,
          backgroundImage:
            "repeating-linear-gradient(8deg, rgba(48,51,53,0.09) 0px, rgba(48,51,53,0.09) 1px, transparent 1px, transparent 6px), repeating-linear-gradient(97deg, rgba(255,255,255,0.13) 0px, rgba(255,255,255,0.13) 2px, transparent 2px, transparent 12px)",
          mixBlendMode: "multiply",
        }}
      />

      {fidelity ? (
        <>
          <AbsoluteFill
            style={{
              opacity: 0.46,
              backgroundImage:
                "radial-gradient(circle at 16% 22%, rgba(45,49,52,0.3) 0 1px, transparent 2px), radial-gradient(circle at 72% 64%, rgba(45,49,52,0.24) 0 1px, transparent 2px)",
              backgroundSize: "19px 23px, 29px 31px",
              mixBlendMode: "multiply",
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 48%, rgba(43,47,50,0.22) 100%)",
            }}
          />
        </>
      ) : null}

      <CameraLayer {...camera}>
        <div
          style={{
            position: "absolute",
            left: 350,
            top: 135,
            width: 1280,
            color: fidelity
              ? "rgba(85, 80, 72, 0.18)"
              : "rgba(85, 80, 72, 0.13)",
            fontFamily: "Songti SC, STSong, Georgia, serif",
            fontSize: 290,
            fontWeight: 700,
            letterSpacing: -28,
            whiteSpace: "nowrap",
            opacity: timeline.majorOpacity.headline,
            translate: interpolate(frame, [0, 179], ["70px 0px", "-28px 8px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            }),
          }}
        >
          成果被看见
        </div>

        {timeline.people.slice(0, 2).map((person, index) => (
          <div
            key={`back-person-${index}`}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              opacity: person.opacity,
              scale: person.scale,
              rotate: `${person.rotate}deg`,
              translate: `${person.x}px ${person.y}px`,
              filter: fidelity && index === 0 ? "blur(2px)" : "none",
              mixBlendMode: "multiply",
            }}
          >
            <PersonSilhouette index={index} fidelity={fidelity} />
          </div>
        ))}

        <AnchorLayer
          anchor={PAIR.anchors.medal}
          style={{
            aspectRatio: "1",
            height: "auto",
            opacity: timeline.medal.opacity,
            scale: timeline.medal.scale,
            rotate: `${timeline.medal.rotate}deg`,
            translate: `${timeline.medal.x}px ${timeline.medal.y}px`,
          }}
        >
          <Medal fidelity={fidelity} />
        </AnchorLayer>

        {sharedAroll ? (
          <AnchorLayer
            anchor={PAIR.anchors.people}
            style={{
              overflow: "hidden",
              filter: fidelity
                ? "drop-shadow(28px 32px 0 rgba(25,20,16,0.18))"
                : "drop-shadow(14px 18px 0 rgba(25,20,16,0.13))",
              opacity: timeline.majorOpacity.arroll,
              translate: interpolate(
                frame,
                [28, 78, 179],
                [
                  "360px 28px",
                  "0px 0px",
                  fidelity ? "28px -12px" : "14px -5px",
                ],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            <SharedAroll selection={sharedAroll} />
            <AbsoluteFill
              style={{
                boxShadow: fidelity
                  ? "inset 0 0 0 8px rgba(239,232,218,0.28)"
                  : "inset 0 0 0 3px rgba(239,232,218,0.2)",
              }}
            />
          </AnchorLayer>
        ) : null}

        {timeline.people.slice(2).map((person, index) => (
          <div
            key={`front-person-${index}`}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              opacity: person.opacity,
              scale: person.scale,
              rotate: `${person.rotate}deg`,
              translate: `${person.x}px ${person.y}px`,
              filter:
                fidelity && index === timeline.people.slice(2).length - 1
                  ? "blur(9px)"
                  : index === 0
                    ? "blur(3px)"
                    : "none",
              mixBlendMode: "multiply",
            }}
          >
            <PersonSilhouette index={index + 2} fidelity={fidelity} />
          </div>
        ))}

        <AnchorLayer anchor={PAIR.anchors.title}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -36,
              padding: "10px 20px 8px",
              backgroundColor: PAIR.palette.accent,
              color: "white",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 6,
              rotate: "-2deg",
              opacity: timeline.majorOpacity.headline,
            }}
          >
            {PAIR.copy.kicker}
          </div>
          {PAIR.copy.labels.map((label, index) => (
            <div
              key={label}
              style={{
                position: "absolute",
                left: index * 44,
                top: 34 + index * 104,
                minWidth: index === 0 ? 590 : 330,
                padding: "12px 26px 16px",
                backgroundColor: "#181818",
                boxShadow: fidelity
                  ? "22px 24px 26px rgba(25,20,16,0.25)"
                  : "12px 14px 16px rgba(25,20,16,0.18)",
                color: "white",
                fontFamily: "Songti SC, STSong, Georgia, serif",
                fontSize: index === 0 ? 66 : 54,
                lineHeight: 1,
                whiteSpace: "nowrap",
                opacity: timeline.majorOpacity.bars[index],
                translate: interpolate(
                  frame,
                  [46 + index * 20, 86 + index * 20, 179],
                  [
                    `${-420 - index * 80}px 0px`,
                    "0px 0px",
                    `${fidelity ? 16 + index * 9 : 8 + index * 4}px 0px`,
                  ],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              <span style={{ color: PAIR.palette.accent }}>“</span>
              {label}
              <span style={{ color: PAIR.palette.accent }}>”</span>
            </div>
          ))}
        </AnchorLayer>

        <div
          style={{
            position: "absolute",
            left: 700,
            bottom: 56,
            padding: "10px 28px",
            backgroundColor: "rgba(239,232,218,0.86)",
            borderTop: `3px solid ${PAIR.palette.accent}`,
            color: PAIR.palette.text,
            fontSize: 30,
            letterSpacing: 2,
            opacity: interpolate(frame, [108, 132], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {PAIR.copy.body[0]} · {PAIR.copy.body[1]}
        </div>
      </CameraLayer>

      {fidelity ? (
        <div
          style={{
            position: "absolute",
            left: -150,
            bottom: -190,
            width: 620,
            height: 500,
            borderRadius: "48%",
            backgroundColor: "rgba(27,23,20,0.3)",
            filter: "blur(36px)",
            rotate: "18deg",
            opacity: interpolate(frame, [64, 96], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [0, 179],
              ["-70px 35px", "28px -10px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              },
            ),
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
