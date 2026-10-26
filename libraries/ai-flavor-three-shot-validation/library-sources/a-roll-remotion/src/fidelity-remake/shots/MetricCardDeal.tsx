import type {CSSProperties} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {interpolateCameraTrack, segmentProgress} from "../motion";
import {FIDELITY_REFERENCE_SPECS} from "../reference-specs";
import {CameraLayer, TextureLayer} from "../shared";

const spec = FIDELITY_REFERENCE_SPECS.find(
  (item) => item.slug === "metric-card-deal",
)!;

const CONDENSED = 'Impact, "Arial Narrow", "PingFang SC", sans-serif';
const SERIF = 'Georgia, "Songti SC", "Noto Serif SC", serif';
const SANS = '"Helvetica Neue", "PingFang SC", sans-serif';

const ease = (frame: number, from: number, to: number) =>
  Easing.out(Easing.cubic)(segmentProgress(frame, from, to));

type MetricCardProps = {
  frame: number;
  fps: number;
  x: number;
  y: number;
  start: number;
  rotation: number;
  value: string;
  title: string;
  subtitle: string;
  accent: "blue" | "gold";
  arrow: "up" | "down";
  compact?: boolean;
};

const MetricCard = ({
  frame,
  fps,
  x,
  y,
  start,
  rotation,
  value,
  title,
  subtitle,
  accent,
  arrow,
  compact = false,
}: MetricCardProps) => {
  const deal = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: {damping: 13, stiffness: 126, mass: 0.72},
  });
  const number = spring({
    frame: Math.max(0, frame - start - 5),
    fps,
    config: {damping: 12, stiffness: 170, mass: 0.62},
  });
  const cardWidth = compact ? 320 : 406;
  const cardHeight = compact ? 362 : 464;
  const edge = accent === "blue" ? "#7fafff" : "#d0aa67";
  const numeral = accent === "blue" ? "#99beff" : "#e4ca90";
  const fromY = compact ? -610 : -740;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: cardWidth,
        height: cardHeight,
        borderRadius: compact ? 13 : 17,
        overflow: "hidden",
        background:
          "linear-gradient(145deg, rgba(55,55,54,.98), rgba(18,19,19,.99) 55%, rgba(37,37,35,.98))",
        border: `${compact ? 3 : 4}px solid ${edge}`,
        boxShadow: `0 32px 38px rgba(18,17,15,.34), 0 0 0 2px rgba(255,255,255,.09) inset, 0 0 34px ${edge}35`,
        translate: `0 ${interpolate(deal, [0, 1], [fromY, 0])}px`,
        rotate: `${interpolate(deal, [0, 1], [rotation * 2.6, rotation])}deg`,
        scale: interpolate(deal, [0, 0.72, 1], [0.84, 1.06, 1]),
        opacity: segmentProgress(frame, start, start + 5),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.32,
          background:
            "repeating-linear-gradient(100deg, transparent 0 16px, rgba(255,255,255,.045) 17px, transparent 18px), radial-gradient(circle at 82% 10%, rgba(255,255,255,.13), transparent 28%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: compact ? 27 : 35,
          top: compact ? 29 : 38,
          right: compact ? 25 : 32,
          color: accent === "blue" ? "#bacdf2" : "#ead6a8",
          fontFamily: SERIF,
          fontSize: compact ? 30 : 42,
          fontWeight: 700,
          whiteSpace: "nowrap",
          textShadow: "0 1px 0 #000",
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? 28 : 38,
          top: compact ? 75 : 93,
          color: "rgba(231,228,216,.48)",
          fontFamily: SANS,
          fontSize: compact ? 13 : 16,
          letterSpacing: ".04em",
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: "absolute",
          left: compact ? 25 : 34,
          bottom: compact ? 68 : 84,
          color: numeral,
          fontFamily: CONDENSED,
          fontSize: compact ? 104 : 136,
          fontWeight: 800,
          lineHeight: 0.82,
          letterSpacing: "-.025em",
          fontVariantNumeric: "tabular-nums",
          scale: number,
          transformOrigin: "left bottom",
          textShadow: "0 4px 0 rgba(0,0,0,.35)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          right: compact ? 28 : 34,
          bottom: compact ? 83 : 102,
          width: 0,
          height: 0,
          borderLeft: `${compact ? 10 : 14}px solid transparent`,
          borderRight: `${compact ? 10 : 14}px solid transparent`,
          ...(arrow === "up"
            ? {borderBottom: `${compact ? 18 : 24}px solid ${edge}`}
            : {borderTop: `${compact ? 18 : 24}px solid ${edge}`}),
          opacity: number,
        }}
      />
      {Array.from({length: 9}).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            right: 24 + ((index * 37) % (cardWidth - 68)),
            bottom: 20 + ((index * 29) % 55),
            width: compact ? 7 : 9,
            height: compact ? 7 : 9,
            rotate: `${index * 18}deg`,
            backgroundColor: edge,
            opacity: 0.2 + (index % 3) * 0.14,
          }}
        />
      ))}
    </div>
  );
};

const GroupTab = ({
  frame,
  x,
  y,
  start,
  label,
  compact = false,
}: {
  frame: number;
  x: number;
  y: number;
  start: number;
  label: string;
  compact?: boolean;
}) => {
  const reveal = ease(frame, start, start + 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: compact ? 232 : 286,
        height: compact ? 62 : 76,
        borderRadius: "8px 8px 2px 2px",
        border: "3px solid #4b4944",
        background: "linear-gradient(#292928, #171716)",
        color: "#e9e4d8",
        fontFamily: SERIF,
        fontSize: compact ? 33 : 40,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: ".08em",
        opacity: reveal,
        translate: `0 ${(1 - reveal) * -36}px`,
        boxShadow: "0 16px 18px rgba(0,0,0,.28)",
        zIndex: 3,
      }}
    >
      {label}
    </div>
  );
};

const BrainSymbol = ({frame}: {frame: number}) => {
  const size = interpolate(frame, [0, 23, 50], [150, 392, 330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 960,
        top: 414,
        width: size,
        height: size * 0.7,
        translate: "-50% -50%",
        opacity: 1,
        filter: "drop-shadow(0 30px 18px rgba(23,22,20,.28)) grayscale(1)",
      }}
    >
      <svg viewBox="0 0 500 350" width="100%" height="100%">
        <defs>
          <linearGradient id="brain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3f1ec" />
            <stop offset=".55" stopColor="#b5b3ae" />
            <stop offset="1" stopColor="#777771" />
          </linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="1.2" /></filter>
        </defs>
        <path d="M249 73C205 25 128 49 116 107C69 117 55 181 87 214C65 266 122 315 172 291C198 323 233 305 250 276Z" fill="url(#brain)" stroke="#6e6d68" strokeWidth="5" />
        <path d="M251 73C295 25 372 49 384 107C431 117 445 181 413 214C435 266 378 315 328 291C302 323 267 305 250 276Z" fill="url(#brain)" stroke="#6e6d68" strokeWidth="5" />
        <g fill="none" stroke="#666761" strokeWidth="8" strokeLinecap="round" opacity=".83" filter="url(#soft)">
          <path d="M107 144q54-39 84 10t-28 73q-44 21-5 67M144 87q-4 49 44 43t33 54q-11 30 20 43M87 210q48-10 57 27M192 68q-16 44 19 62M250 94v178M393 144q-54-39-84 10t28 73q44 21 5 67M356 87q4 49-44 43t-33 54q11 30-20 43M413 210q-48-10-57 27M308 68q16 44-19 62" />
        </g>
        <path d="M251 81v190" stroke="#2e2f2c" strokeWidth="7" opacity=".58" />
      </svg>
    </div>
  );
};

export const MetricCardDeal = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);
  const conceptOut = 1 - ease(frame, 72, 84);
  const proofIn = ease(frame, 76, 86);
  const claimA = ease(frame, 18, 38);
  const claimB = ease(frame, 24, 46);
  const blackPinY = interpolate(frame, [0, 60, 194], [1190, 1010, 88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const paper: CSSProperties = {
    background:
      "radial-gradient(circle at 50% 44%, #fbfaf7 0%, #ecebe7 55%, #c7c8c5 100%)",
  };

  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: spec.palette.background}}>
      <AbsoluteFill style={paper} />
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0, opacity: 0.38}}>
        <path d="M40 30 Q 370 310 967 265 T 1885 160" fill="none" stroke="#686a68" strokeWidth="2" />
        <path d="M-90 842 Q 380 510 955 625 T 2010 770" fill="none" stroke="#8a8a86" strokeWidth="2" />
        <path d="M724 -120 Q 895 360 940 1180" fill="none" stroke="#747672" strokeWidth="2" />
      </svg>

      <CameraLayer {...camera}>
        <AbsoluteFill style={{opacity: conceptOut}}>
          <BrainSymbol frame={frame} />
          <div
            style={{
              position: "absolute",
              left: 548,
              top: 402,
              color: "#131514",
              fontFamily: CONDENSED,
              fontSize: 88,
              fontStyle: "italic",
              letterSpacing: "-.035em",
              opacity: ease(frame, 8, 28),
              rotate: "-3deg",
            }}
          >
            SAMPLE X3
          </div>
          <div
            style={{
              position: "absolute",
              left: 1115,
              top: 558,
              color: "#101211",
              fontFamily: SERIF,
              fontSize: 78,
              fontStyle: "italic",
              fontWeight: 900,
              opacity: ease(frame, 12, 32),
              rotate: "-5deg",
            }}
          >
            识别率
          </div>
          <ClaimStrip
            text="这组样本属于哪种类型？"
            left={330}
            top={716}
            rotation={9}
            progress={claimA}
            direction={-1}
          />
          <ClaimStrip
            text="结果是否达到目标阈值？"
            left={1128}
            top={694}
            rotation={-8}
            progress={claimB}
            direction={1}
          />
        </AbsoluteFill>

        <AbsoluteFill style={{opacity: proofIn}}>
          <MetricCard frame={frame} fps={fps} x={232} y={350} start={86} rotation={-8} value="39%" title="方案 A" subtitle="识别率 · RECOGNITION" accent="blue" arrow="down" compact />
          <MetricCard frame={frame} fps={fps} x={520} y={330} start={98} rotation={8} value="51%" title="方案 B" subtitle="识别率 · RECOGNITION" accent="gold" arrow="up" compact />
          <GroupTab frame={frame} x={432} y={286} start={106} label="识别率" compact />

          <MetricCard frame={frame} fps={fps} x={940} y={300} start={134} rotation={-8} value="72%" title="方案 A" subtitle="准确率 · ACCURACY" accent="blue" arrow="down" />
          <MetricCard frame={frame} fps={fps} x={1300} y={278} start={146} rotation={8} value="86%" title="方案 B" subtitle="准确率 · ACCURACY" accent="gold" arrow="up" />
          <GroupTab frame={frame} x={1209} y={230} start={155} label="准确率" />
        </AbsoluteFill>
      </CameraLayer>

      <div
        style={{
          position: "absolute",
          left: 930,
          top: blackPinY,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 32%, #4c4d49, #111211 64%, #000)",
          boxShadow: "0 10px 12px rgba(0,0,0,.3)",
        }}
      />
      <TextureLayer
        grainColor="rgba(47,47,44,.72)"
        grainOpacity={0.2}
        grainSize={3}
        vignette="radial-gradient(circle at 50% 44%, transparent 46%, rgba(62,62,57,.52) 100%)"
        blendMode="multiply"
      />
    </AbsoluteFill>
  );
};

const ClaimStrip = ({
  text,
  left,
  top,
  rotation,
  progress,
  direction,
}: {
  text: string;
  left: number;
  top: number;
  rotation: number;
  progress: number;
  direction: -1 | 1;
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      height: 66,
      padding: "0 28px",
      display: "flex",
      alignItems: "center",
      borderRadius: 7,
      backgroundColor: "#202120",
      color: "#f4f1eb",
      fontFamily: SANS,
      fontSize: 31,
      letterSpacing: ".02em",
      rotate: `${rotation}deg`,
      translate: `${(1 - progress) * direction * 360}px 0`,
      opacity: progress,
      boxShadow: "0 10px 20px rgba(25,24,22,.2)",
    }}
  >
    {text}
  </div>
);
