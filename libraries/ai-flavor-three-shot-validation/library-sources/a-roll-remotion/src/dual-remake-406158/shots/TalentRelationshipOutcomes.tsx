import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DUAL_REMAKE_406158_PAIRS } from "../catalog";
import { sampleCamera } from "../motion";
import { CameraLayer } from "../shared";
import type { RemakeMode } from "../types";

type TalentRelationshipOutcomesProps = {
  readonly mode: RemakeMode;
};

const PAIR = DUAL_REMAKE_406158_PAIRS[1];

export const TALENT_RELATIONSHIP_BEATS = {
  title: 8,
  relationship: 58,
  outcomes: 132,
} as const;

type CardTransform = {
  readonly translateX: number;
  readonly translateY: number;
  readonly scale: number;
  readonly rotate: number;
};

export const sampleTalentRelationshipTimeline = (
  frame: number,
  mode: RemakeMode,
): {
  readonly titleOpacity: number;
  readonly relationshipOpacity: number;
  readonly outcomesOpacity: number;
  readonly outcomeCards: readonly {
    readonly label: string;
    readonly transform: CardTransform;
  }[];
} => {
  const fidelity = mode === "fidelity";

  return {
    titleOpacity: interpolate(frame, [8, 20, 56, 76], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [
        Easing.bezier(0.16, 1, 0.3, 1),
        Easing.linear,
        Easing.bezier(0.7, 0, 0.84, 0),
      ],
    }),
    relationshipOpacity: interpolate(frame, [58, 78, 132, 154], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [
        Easing.bezier(0.16, 1, 0.3, 1),
        Easing.linear,
        Easing.bezier(0.7, 0, 0.84, 0),
      ],
    }),
    outcomesOpacity: interpolate(frame, [132, 154], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
    outcomeCards: [PAIR.copy.labels[2], PAIR.copy.labels[3]].map(
      (label, index) => ({
        label,
        transform: {
          translateX: interpolate(
            frame,
            [132, 224],
            [0, fidelity ? (index === 0 ? -10 : 14) : 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            },
          ),
          translateY: interpolate(
            frame,
            [136 + index * 10, 166 + index * 10, 224],
            [-300, 0, fidelity ? index * 8 : 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          scale: interpolate(
            frame,
            [136 + index * 10, 166 + index * 10],
            [0.72, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 18, stiffness: 120, mass: 0.9 }),
              output: "perceptual-scale",
            },
          ),
          rotate: interpolate(
            frame,
            [136 + index * 10, 166 + index * 10],
            [index === 0 ? -12 : 12, index === 0 ? -2 : 2],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 18, stiffness: 120, mass: 0.9 }),
            },
          ),
        },
      }),
    ),
  };
};

const Portrait = ({ side }: { readonly side: "left" | "right" }) => (
  <svg viewBox="0 0 220 270" style={{ width: "100%", height: "100%" }}>
    <rect
      width="220"
      height="270"
      fill={side === "left" ? "#dedbd2" : "#d4d0c6"}
    />
    <circle cx="110" cy="87" r="48" fill="#343434" />
    <path d="M38 252c8-72 42-106 72-106s64 34 72 106" fill="#242424" />
    <path
      d={
        side === "left" ? "M72 74c16-38 63-46 85-11" : "M62 78c20-44 74-48 96-4"
      }
      fill="none"
      stroke="#171717"
      strokeWidth="18"
      strokeLinecap="round"
    />
  </svg>
);

const Briefcase = ({ fidelity }: { readonly fidelity: boolean }) => (
  <div
    style={{
      position: "relative",
      width: 280,
      height: 172,
      borderRadius: 18,
      backgroundColor: "#252525",
      border: fidelity ? "8px solid #111" : "5px solid #111",
      boxShadow: fidelity
        ? "28px 30px 0 rgba(20,20,20,0.22)"
        : "14px 16px 0 rgba(20,20,20,0.15)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 82,
        top: -62,
        width: 116,
        height: 68,
        border: "18px solid #252525",
        borderBottom: 0,
        borderRadius: "18px 18px 0 0",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 70,
        height: 4,
        backgroundColor: "#6f6f6f",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 121,
        top: 59,
        width: 38,
        height: 30,
        backgroundColor: PAIR.palette.secondaryAccent,
        border: "4px solid #171717",
      }}
    />
  </div>
);

export const TalentRelationshipOutcomes = ({
  mode,
}: TalentRelationshipOutcomesProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fidelity = mode === "fidelity";
  const camera = sampleCamera(PAIR.cameraBeats, frame);
  const timeline = sampleTalentRelationshipTimeline(frame, mode);
  const titleEntrance = spring({
    frame: frame - 10,
    fps,
    durationInFrames: 38,
    config: { damping: 19, stiffness: 115, mass: 0.8, overshootClamping: true },
  });
  const relationshipEntrance = spring({
    frame: frame - 66,
    fps,
    durationInFrames: 34,
    config: { damping: 20, stiffness: 120, mass: 0.8, overshootClamping: true },
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: PAIR.palette.background,
        color: PAIR.palette.text,
        fontFamily: "Arial, 'PingFang SC', sans-serif",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: fidelity ? 0.58 : 0.34,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(37,37,34,0.04) 0px, rgba(37,37,34,0.04) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(89deg, transparent 0px, transparent 31px, rgba(255,255,255,0.08) 32px, transparent 33px)",
          mixBlendMode: "multiply",
        }}
      />
      {fidelity ? (
        <>
          <AbsoluteFill
            style={{
              opacity: 0.34,
              backgroundImage:
                "radial-gradient(circle at 14% 18%, rgba(28,28,25,0.25) 0 1px, transparent 2px), radial-gradient(circle at 78% 72%, rgba(28,28,25,0.18) 0 1px, transparent 2px)",
              backgroundSize: "17px 21px, 31px 27px",
              mixBlendMode: "multiply",
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(90deg, rgba(26,26,24,0.13), transparent 9%, transparent 91%, rgba(26,26,24,0.14)), radial-gradient(ellipse at center, transparent 55%, rgba(36,34,29,0.16))",
            }}
          />
        </>
      ) : null}

      <CameraLayer {...camera}>
        <div
          style={{
            position: "absolute",
            left: 84,
            top: 145,
            width: 1780,
            height: 500,
            opacity: timeline.titleOpacity,
            translate: interpolate(
              frame,
              [0, 42, 76],
              ["0px 70px", "0px 0px", fidelity ? "-42px -20px" : "-20px -8px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 62,
              color: PAIR.palette.accent,
              fontFamily: "Songti SC, STSong, Georgia, serif",
              fontSize: 214,
              fontWeight: 800,
              letterSpacing: -16,
              textShadow: fidelity
                ? "12px 14px 0 rgba(27,27,27,0.18)"
                : "7px 8px 0 rgba(27,27,27,0.12)",
              scale: interpolate(titleEntrance, [0, 1], [0.82, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            人才认领战
          </div>
          <div style={{ position: "absolute", right: 200, top: 34 }}>
            <Briefcase fidelity={fidelity} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 1030,
              top: 300,
              padding: "8px 22px",
              backgroundColor: "#d8c72b",
              color: PAIR.palette.accent,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 42,
              fontWeight: 700,
            }}
          >
            TALENT NETWORK
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: timeline.relationshipOpacity,
            scale: interpolate(relationshipEntrance, [0, 1], [0.94, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [58, 105, 154],
              ["0px 34px", "0px 0px", fidelity ? "-26px -12px" : "-12px -6px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              },
            ),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 316,
              top: 170,
              width: 1288,
              height: 660,
              backgroundColor: fidelity
                ? "rgba(232,228,217,0.86)"
                : "rgba(232,228,217,0.76)",
              border: `3px solid ${PAIR.palette.border}`,
              boxShadow: fidelity
                ? "38px 40px 0 rgba(31,30,27,0.17)"
                : "18px 20px 0 rgba(31,30,27,0.12)",
              rotate: "-1deg",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 72,
                top: 42,
                fontFamily: "Songti SC, STSong, Georgia, serif",
                fontSize: 66,
                fontWeight: 800,
              }}
            >
              {PAIR.copy.headline}
            </div>
            <svg
              viewBox="0 0 1288 660"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <path
                d="M322 338 C470 224 724 218 936 328"
                fill="none"
                stroke={PAIR.palette.accent}
                strokeWidth="8"
                strokeDasharray="850"
                strokeDashoffset={interpolate(frame, [70, 112], [850, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}
              />
              <path
                d="M322 338 C486 472 750 472 936 328"
                fill="none"
                stroke={PAIR.palette.secondaryAccent}
                strokeWidth="5"
                strokeDasharray="850"
                strokeDashoffset={interpolate(frame, [82, 126], [850, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}
              />
              {[0, 1, 2].map((index) => (
                <g key={index}>
                  <circle
                    cx={545 + index * 105}
                    cy={index === 1 ? 238 : 430}
                    r="18"
                    fill={
                      index === 1
                        ? PAIR.palette.accent
                        : PAIR.palette.secondaryAccent
                    }
                  />
                  <circle
                    cx={545 + index * 105}
                    cy={index === 1 ? 238 : 430}
                    r={interpolate(
                      frame,
                      [88 + index * 7, 108 + index * 7],
                      [38, 24],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      },
                    )}
                    fill="none"
                    stroke={PAIR.palette.border}
                    strokeWidth="2"
                    opacity={interpolate(
                      frame,
                      [88 + index * 7, 108 + index * 7],
                      [0, 0.6],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      },
                    )}
                  />
                </g>
              ))}
            </svg>
            {(["left", "right"] as const).map((side, index) => (
              <div
                key={side}
                style={{
                  position: "absolute",
                  left: index === 0 ? 108 : 930,
                  top: index === 0 ? 230 : 216,
                  width: 236,
                  height: 290,
                  overflow: "hidden",
                  border: "8px solid #f0ede5",
                  boxShadow: fidelity
                    ? "18px 22px 0 rgba(28,27,24,0.2)"
                    : "10px 12px 0 rgba(28,27,24,0.14)",
                  rotate: index === 0 ? "-5deg" : "4deg",
                  translate: interpolate(
                    frame,
                    [60 + index * 8, 90 + index * 8, 146],
                    [
                      index === 0 ? "-180px 30px" : "180px 30px",
                      "0px 0px",
                      fidelity
                        ? index === 0
                          ? "-12px 8px"
                          : "14px -6px"
                        : "0px 0px",
                    ],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                }}
              >
                <Portrait side={side} />
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 12,
                    padding: "6px 8px",
                    backgroundColor: "rgba(245,241,232,0.9)",
                    borderBottom: `4px solid ${PAIR.palette.accent}`,
                    fontSize: 22,
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  {index === 0 ? PAIR.copy.labels[0] : PAIR.copy.labels[1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: timeline.outcomesOpacity,
            translate: interpolate(
              frame,
              [132, 224],
              ["0px 38px", fidelity ? "-18px -8px" : "-8px -3px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              },
            ),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 100,
              fontFamily: "Songti SC, STSong, Georgia, serif",
              fontSize: 86,
              fontWeight: 800,
            }}
          >
            共同连接，形成成果
          </div>
          <div
            style={{
              position: "absolute",
              left: 154,
              top: 210,
              color: PAIR.palette.muted,
              fontSize: 28,
              letterSpacing: 5,
            }}
          >
            RELATIONSHIPS → OUTCOMES
          </div>
          {timeline.outcomeCards.map((card, index) => (
            <div
              key={card.label}
              style={{
                position: "absolute",
                left: 154 + index * 812,
                top: 344,
                width: 710,
                height: 330,
                padding: "46px 44px",
                boxSizing: "border-box",
                backgroundColor: index === 0 ? "#c9aa42" : "#d7bd61",
                border: `3px solid ${PAIR.palette.border}`,
                boxShadow: fidelity
                  ? "26px 30px 0 rgba(33,31,27,0.2)"
                  : "13px 16px 0 rgba(33,31,27,0.14)",
                rotate: `${card.transform.rotate}deg`,
                scale: card.transform.scale,
                translate: `${card.transform.translateX}px ${card.transform.translateY}px`,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  backgroundColor: PAIR.palette.text,
                  color: "white",
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: 5,
                }}
              >
                成果 0{index + 1}
              </div>
              <div
                style={{
                  marginTop: 34,
                  fontFamily: "Songti SC, STSong, Georgia, serif",
                  fontSize: 72,
                  lineHeight: 1,
                  fontWeight: 800,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  marginTop: 30,
                  paddingTop: 20,
                  borderTop: "2px solid rgba(25,25,23,0.45)",
                  fontSize: 27,
                }}
              >
                {PAIR.copy.body[index]}
              </div>
            </div>
          ))}
        </div>
      </CameraLayer>

      {fidelity ? (
        <div
          style={{
            position: "absolute",
            right: -170,
            bottom: -210,
            width: 700,
            height: 520,
            borderRadius: "45%",
            backgroundColor: "rgba(26,25,23,0.3)",
            filter: "blur(42px)",
            rotate: "-14deg",
            translate: interpolate(
              frame,
              [0, 224],
              ["80px 28px", "-32px -14px"],
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
