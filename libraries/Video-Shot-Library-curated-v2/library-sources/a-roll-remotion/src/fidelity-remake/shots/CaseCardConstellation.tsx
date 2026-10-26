import type {ReactNode} from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {interpolateCameraTrack, segmentProgress} from "../motion";
import {FIDELITY_REFERENCE_SPECS} from "../reference-specs";
import {CameraLayer, TextureLayer} from "../shared";

const spec = FIDELITY_REFERENCE_SPECS.find(
  (item) => item.slug === "case-card-constellation",
)!;

const FONT = 'Inter, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif';

type CardDatum = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  start: number;
  fromX: number;
  fromY: number;
  title: string;
  eyebrow: string;
  art: ReactNode;
  artSide: "left" | "right" | "bottom";
};

const cards: CardDatum[] = [
  {
    id: "top",
    x: 700,
    y: 66,
    width: 520,
    height: 238,
    rotation: 0.4,
    start: 0,
    fromX: 0,
    fromY: -210,
    eyebrow: "CASE 01 · TRAVEL",
    title: "周末四人轻松出行",
    art: <RoadArtwork />,
    artSide: "bottom",
  },
  {
    id: "left",
    x: 100,
    y: 316,
    width: 560,
    height: 248,
    rotation: 7,
    start: 18,
    fromX: -650,
    fromY: -80,
    eyebrow: "CASE 02 · FAMILY",
    title: "为孩子规划亲子体验",
    art: <PlayArtwork />,
    artSide: "left",
  },
  {
    id: "right",
    x: 1305,
    y: 316,
    width: 520,
    height: 248,
    rotation: -6,
    start: 27,
    fromX: 650,
    fromY: -70,
    eyebrow: "CASE 03 · ACCESS",
    title: "给长辈保留从容节奏",
    art: <SeniorArtwork />,
    artSide: "left",
  },
  {
    id: "lower-left",
    x: 150,
    y: 688,
    width: 570,
    height: 258,
    rotation: -7,
    start: 66,
    fromX: -560,
    fromY: 360,
    eyebrow: "CASE 04 · BUDGET",
    title: "控制整体预算在合理范围",
    art: <BudgetArtwork />,
    artSide: "bottom",
  },
  {
    id: "lower-right",
    x: 1265,
    y: 686,
    width: 520,
    height: 258,
    rotation: 7.5,
    start: 74,
    fromX: 570,
    fromY: 350,
    eyebrow: "CASE 05 · FOOD",
    title: "串联三家本地风味餐厅",
    art: <FoodArtwork />,
    artSide: "left",
  },
];

export const CaseCardConstellation = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);
  const hubProgress = spring({
    frame: Math.max(0, frame - 134),
    fps,
    config: {damping: 13, stiffness: 145, mass: 0.8},
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: spec.palette.background,
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 48%, #f8f7f3 0%, #eaeae6 47%, #d5d5d1 100%)",
        }}
      />
      <CameraLayer {...camera}>
        <ConnectorField frame={frame} />
        {cards.map((card) => (
          <CaseCard key={card.id} card={card} frame={frame} fps={fps} />
        ))}
        <div
          style={{
            position: "absolute",
            left: 817,
            top: 419,
            width: 286,
            height: 286,
            borderRadius: "50%",
            backgroundColor: spec.palette.accent,
            color: spec.palette.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 42,
            fontWeight: 500,
            letterSpacing: ".02em",
            lineHeight: 1.2,
            scale: hubProgress,
            opacity: segmentProgress(frame, 134, 142),
            boxShadow: "0 28px 38px rgba(32,28,21,.18)",
            zIndex: 30,
          }}
        >
          总结
          <br />
          行程
        </div>
      </CameraLayer>
      <TextureLayer
        grainColor="rgba(62,57,48,.58)"
        grainOpacity={0.21}
        grainSize={3}
        vignette="radial-gradient(circle at 50% 48%, transparent 48%, rgba(87,79,67,.5) 100%)"
        blendMode="multiply"
      />
    </AbsoluteFill>
  );
};

const CaseCard = ({
  card,
  frame,
  fps,
}: {
  card: CardDatum;
  frame: number;
  fps: number;
}) => {
  const progress = spring({
    frame: Math.max(0, frame - card.start),
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.85},
  });
  const x = interpolate(progress, [0, 1], [card.fromX, 0]);
  const y = interpolate(progress, [0, 1], [card.fromY, 0]);
  const opacity = segmentProgress(frame, card.start, card.start + 8);
  const cardScale =
    card.id === "top"
      ? interpolate(frame, [0, 18, 63, 122], [2.2, 1.75, 1.32, 1.16], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 1.16;
  const imageWidth = card.artSide === "bottom" ? "100%" : "42%";
  const imageHeight = card.artSide === "bottom" ? "58%" : "100%";

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: card.x - 28,
          top: card.y + 38,
          width: card.width + 54,
          height: card.height + 18,
          borderRadius: 22,
          background: "rgba(39,34,27,.25)",
          filter: "blur(20px)",
          translate: `${x * 0.45}px ${y * 0.45}px`,
          rotate: `${card.rotation * 0.9}deg`,
          scale: cardScale,
          opacity: (card.id === "top" ? 1 : opacity) * 0.75,
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: card.x,
          top: card.y,
          width: card.width,
          height: card.height,
          borderRadius: 22,
          overflow: "hidden",
          background: "linear-gradient(145deg, #fffefa, #f7f4ed)",
          border: `2px solid ${spec.palette.border}`,
          translate: `${x}px ${y}px`,
          rotate: `${card.rotation}deg`,
          scale: cardScale,
          opacity: card.id === "top" ? 1 : opacity,
          zIndex: 20,
          boxShadow: "0 2px 2px rgba(255,255,255,.9) inset",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: card.artSide === "right" ? undefined : 0,
            right: card.artSide === "right" ? 0 : undefined,
            bottom: card.artSide === "bottom" ? 0 : undefined,
            top: card.artSide === "bottom" ? undefined : 0,
            width: imageWidth,
            height: imageHeight,
            overflow: "hidden",
            filter: "grayscale(1) contrast(.88)",
            background: "#d9d6cf",
          }}
        >
          {card.art}
        </div>
        <div
          style={{
            position: "absolute",
            left: card.artSide === "left" ? "45%" : 34,
            right: 24,
            top: card.artSide === "bottom" ? 24 : 54,
          }}
        >
          <div
            style={{
              color: spec.palette.muted,
              fontSize: 12,
              fontWeight: 650,
              letterSpacing: ".14em",
              marginBottom: 16,
            }}
          >
            {card.eyebrow}
          </div>
          <div
            style={{
              color: spec.palette.text,
              fontSize: card.artSide === "bottom" ? 27 : 25,
              fontWeight: 450,
              lineHeight: 1.32,
              letterSpacing: ".01em",
            }}
          >
            · {card.title}
          </div>
        </div>
      </div>
    </>
  );
};

const ConnectorField = ({frame}: {frame: number}) => {
  const paths = [
    "M960 305 C960 350 960 365 960 430",
    "M650 440 C730 480 770 520 830 545",
    "M1275 438 C1190 478 1150 520 1092 548",
    "M710 768 C785 710 820 664 850 625",
    "M1220 765 C1155 710 1110 665 1072 625",
  ];

  return (
    <svg width="1920" height="1080" style={{position: "absolute", inset: 0, zIndex: 10}}>
      {paths.map((path, index) => {
        const progress = Easing.inOut(Easing.cubic)(
          segmentProgress(frame, 144 + index * 4, 164 + index * 3),
        );
        return (
          <path
            key={path}
            d={path}
            fill="none"
            stroke={spec.palette.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
            opacity=".78"
          />
        );
      })}
    </svg>
  );
};

const FullSvg = ({children}: {children: ReactNode}) => (
  <svg width="100%" height="100%" viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
    {children}
  </svg>
);

function RoadArtwork() {
  return (
    <FullSvg>
      <rect width="220" height="140" fill="#d9d7d2" />
      <path d="M0 118 C60 52 155 55 220 25 L220 140 L0 140Z" fill="#8b8984" />
      <path d="M85 140 L124 58 L148 58 L173 140Z" fill="#2c2d2d" />
      <path d="M132 120 L137 99 M142 86 L146 70" stroke="#eceae4" strokeWidth="3" />
      <circle cx="56" cy="57" r="24" fill="#b7b4ad" />
      <rect x="31" y="62" width="52" height="31" rx="8" fill="#545454" />
    </FullSvg>
  );
}

function PlayArtwork() {
  return (
    <FullSvg>
      <rect width="220" height="140" fill="#d8d5ce" />
      <path d="M0 132 L82 37 L114 37 L43 140Z" fill="#555653" />
      <path d="M102 140 L157 37 L220 37 L220 140Z" fill="#aaa8a2" />
      <circle cx="88" cy="35" r="12" fill="#363735" />
      <path d="M87 47 L72 88 L103 112 M77 72 L112 78" stroke="#363735" strokeWidth="9" strokeLinecap="round" />
    </FullSvg>
  );
}

function SeniorArtwork() {
  return (
    <FullSvg>
      <rect width="220" height="140" fill="#d5d2cb" />
      <circle cx="108" cy="29" r="17" fill="#777671" />
      <path d="M67 140 C73 79 77 51 107 50 C140 51 147 82 151 140Z" fill="#383938" />
      <path d="M104 70 L104 139 M93 84 L119 84" stroke="#b8b5ae" strokeWidth="4" />
      <path d="M116 91 Q143 104 144 140" fill="none" stroke="#686964" strokeWidth="8" />
    </FullSvg>
  );
}

function BudgetArtwork() {
  return (
    <FullSvg>
      <rect width="220" height="140" fill="#ddd9d1" />
      <g transform="translate(70 22) rotate(-8 50 52)">
        <rect x="0" y="0" width="100" height="92" rx="7" fill="#777671" />
        <rect x="10" y="10" width="80" height="24" fill="#cac7c0" />
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2].map((column) => (
            <rect key={`${row}-${column}`} x={12 + column * 28} y={43 + row * 13} width="19" height="9" rx="2" fill="#e9e6df" />
          )),
        )}
      </g>
      <path d="M0 118 C68 95 146 105 220 75 L220 140 L0 140Z" fill="#aaa69e" opacity=".7" />
    </FullSvg>
  );
}

function FoodArtwork() {
  return (
    <FullSvg>
      <rect width="220" height="140" fill="#d8d5ce" />
      <rect x="47" y="14" width="126" height="112" rx="16" fill="#3c3d3d" />
      <rect x="56" y="22" width="108" height="95" rx="12" fill="#ece9e2" />
      <rect x="66" y="34" width="88" height="9" rx="4" fill="#9c9992" />
      <rect x="66" y="51" width="62" height="7" rx="3" fill="#b7b3ac" />
      <circle cx="90" cy="83" r="17" fill="#7a7975" />
      <circle cx="124" cy="83" r="17" fill="#aaa7a0" />
      <rect x="87" y="7" width="49" height="12" rx="5" fill="#242525" />
    </FullSvg>
  );
}
