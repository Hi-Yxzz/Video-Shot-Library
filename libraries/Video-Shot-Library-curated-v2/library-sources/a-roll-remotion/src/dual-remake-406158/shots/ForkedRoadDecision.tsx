import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DUAL_REMAKE_406158_PAIRS } from "../catalog";
import { deterministicTextureValue, segmentProgress } from "../motion";
import type { RemakeMode } from "../types";

const pair = DUAL_REMAKE_406158_PAIRS[5];
const SERIF = '"Songti SC", "STSong", "Noto Serif SC", Georgia, serif';
const SANS = '"PingFang SC", "Helvetica Neue", Arial, sans-serif';

export const FORKED_ROAD_ORIGIN = { x: 960, y: 814 } as const;

type DepthPlane = {
  readonly id: "paper" | "scene" | "road" | "person" | "labels";
  readonly x: number;
  readonly y: number;
};

export const getForkedRoadDepth = (
  mode: RemakeMode,
  cameraProgress: number,
): readonly DepthPlane[] => {
  const progress = Math.max(0, Math.min(1, cameraProgress));

  return mode === "fast"
    ? [
        { id: "paper", x: -4 * progress, y: -6 * progress },
        { id: "scene", x: 12 * progress, y: 18 * progress },
      ]
    : [
        { id: "paper", x: -14 * progress, y: -9 * progress },
        { id: "road", x: 5 * progress, y: 9 * progress },
        { id: "person", x: 14 * progress, y: 20 * progress },
        { id: "labels", x: 27 * progress, y: 33 * progress },
      ];
};

const ease = (frame: number, from: number, to: number) =>
  Easing.out(Easing.cubic)(segmentProgress(frame, from, to));

export const getForkedRoadEntrance = (frame: number) => ({
  title: ease(frame, 5, 32),
  sign: ease(frame, 30, 54),
  person: ease(frame, 34, 64),
  road: ease(frame, 58, 112),
  labels: [
    ease(frame, 108, 130),
    ease(frame, 125, 147),
    ease(frame, 142, 164),
  ] as const,
});

type RoadPoint = { readonly x: number; readonly y: number };

export const getForkedRoadGeometry = (
  originX: number,
  originY: number,
): readonly (readonly [RoadPoint, RoadPoint, RoadPoint, RoadPoint])[] => [
  [
    { x: originX - 30, y: originY },
    { x: originX + 30, y: originY },
    { x: 1_180, y: 1_170 },
    { x: 740, y: 1_170 },
  ],
  [
    { x: originX - 26, y: originY },
    { x: originX, y: originY },
    { x: 650, y: 1_110 },
    { x: -160, y: 1_110 },
  ],
  [
    { x: originX, y: originY },
    { x: originX + 26, y: originY },
    { x: 2_080, y: 1_110 },
    { x: 1_270, y: 1_110 },
  ],
];

const labels = [
  { text: pair.copy.labels[0], left: 164, top: 670, rotate: -4 },
  { text: pair.copy.labels[1], left: 1460, top: 630, rotate: 3 },
  { text: pair.copy.labels[2], left: 1012, top: 888, rotate: -2 },
] as const;

const Silhouette = ({
  fidelity,
  depthX,
  depthY,
  translateY,
  opacity,
}: {
  fidelity: boolean;
  depthX: number;
  depthY: number;
  translateY: number;
  opacity: number;
}) => {
  return (
    <div
      data-depth-plane={fidelity ? "person" : "scene"}
      style={{
        position: "absolute",
        left: 867,
        top: 485,
        width: 186,
        height: 348,
        translate: `${depthX}px ${translateY + depthY}px`,
        opacity,
        filter: fidelity ? "drop-shadow(0 18px 10px rgba(0,0,0,.26))" : "none",
        zIndex: 4,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 66,
          top: 0,
          width: 55,
          height: 55,
          borderRadius: "50%",
          backgroundColor: "#141414",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 49,
          width: 91,
          height: 157,
          background: "linear-gradient(90deg, #0b0b0b, #242424 52%, #090909)",
          clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 185,
          width: 42,
          height: 144,
          backgroundColor: "#101010",
          rotate: "5deg",
          transformOrigin: "center top",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 101,
          top: 185,
          width: 42,
          height: 144,
          backgroundColor: "#101010",
          rotate: "-5deg",
          transformOrigin: "center top",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 134,
          top: 160,
          width: 59,
          height: 88,
          border: "7px solid #111",
          backgroundColor: "#181818",
        }}
      />
    </div>
  );
};

export const ForkedRoadDecision = ({ mode }: { mode: RemakeMode }) => {
  const frame = useCurrentFrame();
  const fidelity = mode === "fidelity";
  const entrance = getForkedRoadEntrance(frame);
  const titleIn = entrance.title;
  const underline = ease(frame, 24, 58);
  const road = entrance.road;
  const cameraProgress = segmentProgress(frame, 0, pair.durationInFrames - 1);
  const figureRise = ease(frame, 34, 78);
  const figureTranslateY = interpolate(figureRise, [0, 1], [92, 0]);
  const footY = FORKED_ROAD_ORIGIN.y + figureTranslateY;
  const depths = getForkedRoadDepth(mode, cameraProgress);
  const plane = (id: DepthPlane["id"]) =>
    depths.find((candidate) => candidate.id === id) ?? { id, x: 0, y: 0 };
  const paperDepth = plane("paper");
  const sceneDepth = plane("scene");
  const roadDepth = fidelity ? plane("road") : sceneDepth;
  const personDepth = fidelity ? plane("person") : sceneDepth;
  const labelDepth = fidelity ? plane("labels") : sceneDepth;
  const roadOriginX = FORKED_ROAD_ORIGIN.x + personDepth.x - roadDepth.x;
  const roadOriginY = footY + personDepth.y - roadDepth.y;
  const roadGeometry = getForkedRoadGeometry(roadOriginX, roadOriginY);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: pair.palette.background,
        color: pair.palette.text,
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, pair.durationInFrames - 1], [1, 1.08], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }),
          translate: `0 ${cameraProgress * 20}px`,
          transformOrigin: "50% 67%",
        }}
      >
        <AbsoluteFill
          data-depth-plane="paper"
          style={{
            translate: `${paperDepth.x}px ${paperDepth.y}px`,
          }}
        >
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle at 50% 36%, #f5f3ef 0%, #e7e5e1 54%, #d5d3cf 100%)",
            }}
          />

          {fidelity ? (
            <>
              <AbsoluteFill
                style={{
                  opacity: 0.28,
                  background:
                    "repeating-linear-gradient(92deg, transparent 0 8px, rgba(86,82,77,.11) 9px, transparent 11px), repeating-linear-gradient(2deg, transparent 0 13px, rgba(255,255,255,.4) 14px, transparent 16px)",
                  filter: "blur(.35px)",
                }}
              />
              <AbsoluteFill
                style={{
                  opacity: 0.15,
                  background:
                    "linear-gradient(116deg, transparent 0 24%, rgba(78,72,67,.2) 24.2%, transparent 24.6%), linear-gradient(78deg, transparent 0 70%, rgba(255,255,255,.44) 70.3%, transparent 70.7%)",
                }}
              />
            </>
          ) : null}
        </AbsoluteFill>

        <AbsoluteFill
          data-depth-plane={fidelity ? "road" : "scene"}
          style={{
            translate: `${roadDepth.x}px ${roadDepth.y}px`,
            zIndex: 1,
          }}
        >
          <svg
            width="1920"
            height="1080"
            viewBox="0 0 1920 1080"
            style={{
              position: "absolute",
              inset: 0,
              overflow: "visible",
            }}
          >
            <defs>
              <linearGradient id="road-depth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#242424" />
                <stop offset="1" stopColor="#111111" />
              </linearGradient>
              <clipPath id="road-reveal">
                <rect
                  x="-400"
                  y={roadOriginY}
                  width="2800"
                  height={(1_200 - roadOriginY) * road}
                />
              </clipPath>
            </defs>
            <g
              data-road-geometry="perspective-polygons"
              clipPath="url(#road-reveal)"
            >
              {roadGeometry.map((points, index) => (
                <polygon
                  key={index}
                  points={points
                    .map((point) => `${point.x},${point.y}`)
                    .join(" ")}
                  fill={
                    fidelity
                      ? "url(#road-depth)"
                      : index === 0
                        ? "#171717"
                        : "#1a1a1a"
                  }
                />
              ))}
              {fidelity ? (
                <>
                  <path
                    d={`M${roadOriginX - 18} ${roadOriginY + 4} L610 1100`}
                    stroke="rgba(0,0,0,.26)"
                    strokeWidth="42"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${roadOriginX + 18} ${roadOriginY + 4} L1310 1100`}
                    stroke="rgba(0,0,0,.18)"
                    strokeWidth="30"
                    strokeLinecap="round"
                  />
                </>
              ) : null}
            </g>
          </svg>

          {fidelity ? (
            <div
              data-shadow="person-long-shadow"
              style={{
                position: "absolute",
                left: roadOriginX - 112,
                top: roadOriginY - 8,
                width: 224,
                height: 520,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,.58), rgba(0,0,0,.24) 52%, rgba(0,0,0,0))",
                clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)",
                opacity: road * entrance.person * 0.62,
                rotate: "-8deg",
                transformOrigin: "center top",
                filter: "blur(9px)",
                zIndex: 2,
              }}
            />
          ) : null}
        </AbsoluteFill>

        <div
          data-overlay="title"
          style={{
            position: "absolute",
            left: 112,
            top: 78,
            width: 1695,
            height: 325,
            overflow: "hidden",
            clipPath: `inset(0 ${(1 - titleIn) * 100}% 0 0)`,
            opacity: titleIn,
            zIndex: 5,
          }}
        >
          <div
            style={{
              color: pair.palette.text,
              fontFamily: SERIF,
              fontSize: 190,
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: "-.02em",
              whiteSpace: "nowrap",
            }}
          >
            {pair.copy.headline}
          </div>
          <div
            style={{
              position: "absolute",
              left: 1195,
              top: 226,
              width: 420,
              height: 19,
              backgroundColor: pair.palette.accent,
              scale: `${underline} 1`,
              transformOrigin: "left center",
              boxShadow: "0 5px 0 rgba(125,48,46,.23)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 856,
            top: 388,
            width: 210,
            height: 190,
            zIndex: 3,
            opacity: entrance.sign,
            translate: `${personDepth.x}px ${personDepth.y}px`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 100,
              top: 0,
              width: 16,
              height: 185,
              backgroundColor: "#78302d",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 22,
              width: 109,
              height: 43,
              background: "linear-gradient(90deg, #6f2825, #a3493e)",
              clipPath: "polygon(0 50%, 16% 0, 100% 0, 100% 100%, 16% 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 108,
              top: 76,
              width: 102,
              height: 43,
              background: "linear-gradient(90deg, #9d4439, #722825)",
              clipPath: "polygon(0 0, 84% 0, 100% 50%, 84% 100%, 0 100%)",
            }}
          />
        </div>

        <Silhouette
          fidelity={fidelity}
          depthX={personDepth.x}
          depthY={personDepth.y}
          translateY={figureTranslateY}
          opacity={entrance.person}
        />

        <AbsoluteFill
          data-depth-plane={fidelity ? "labels" : "scene"}
          style={{
            translate: `${labelDepth.x}px ${labelDepth.y}px`,
            zIndex: 6,
          }}
        >
          {labels.map((label, index) => {
            const reveal = entrance.labels[index];

            return (
              <div
                key={label.text}
                style={{
                  position: "absolute",
                  left: label.left,
                  top: label.top,
                  padding: fidelity ? "16px 27px 18px" : "14px 25px",
                  background: index === 1 ? "#b54b37" : "#252321",
                  color: index === 1 ? "#f7dfc6" : "#ef8b65",
                  fontFamily: SERIF,
                  fontSize: index === 2 ? 43 : 50,
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  opacity: reveal,
                  translate: `0 ${interpolate(reveal, [0, 1], [-36, 0])}px`,
                  rotate: `${label.rotate}deg`,
                  scale: interpolate(reveal, [0, 1], [1.18, 1]),
                  boxShadow: fidelity
                    ? "8px 12px 0 rgba(76,42,31,.18)"
                    : "none",
                  clipPath: fidelity
                    ? "polygon(2% 8%,10% 2%,20% 7%,31% 1%,44% 6%,56% 2%,69% 7%,82% 2%,98% 8%,96% 92%,86% 98%,73% 92%,61% 99%,48% 93%,35% 98%,22% 92%,8% 98%,1% 90%)"
                    : "none",
                }}
              >
                {label.text}
              </div>
            );
          })}
        </AbsoluteFill>

        {fidelity ? (
          <AbsoluteFill style={{ zIndex: 7, pointerEvents: "none" }}>
            {Array.from({ length: 96 }, (_, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${deterministicTextureValue(index, 211) * 100}%`,
                  top: `${deterministicTextureValue(index, 241) * 100}%`,
                  width: 1 + deterministicTextureValue(index, 277) * 4,
                  height: 1 + deterministicTextureValue(index, 313) * 4,
                  backgroundColor:
                    index % 3 === 0
                      ? "rgba(58,54,50,.5)"
                      : "rgba(255,255,255,.52)",
                  opacity: 0.08 + deterministicTextureValue(index, 347) * 0.14,
                  rotate: `${deterministicTextureValue(index, 379) * 80}deg`,
                }}
              />
            ))}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 92,
          bottom: 50,
          color: pair.palette.muted,
          fontFamily: SANS,
          fontSize: 20,
          letterSpacing: ".24em",
          opacity: ease(frame, 128, 160),
        }}
      >
        {pair.copy.kicker} · CHOICE
      </div>
    </AbsoluteFill>
  );
};
