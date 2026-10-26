import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DUAL_REMAKE_406158_PAIRS } from "../catalog";
import {
  deterministicTextureValue,
  sampleCamera,
  segmentProgress,
} from "../motion";
import { CameraLayer } from "../shared";
import type { RemakeMode } from "../types";

const pair = DUAL_REMAKE_406158_PAIRS.find(
  (candidate) => candidate.slug === "feedback-loop-desktop",
)!;

const SONG = '"Songti SC", "STSong", "Noto Serif CJK SC", serif';
const SANS = '"PingFang SC", "Microsoft YaHei", sans-serif';

type ShotProps = {
  readonly mode: RemakeMode;
};

const eased = (frame: number, start: number, end: number) =>
  Easing.out(Easing.cubic)(segmentProgress(frame, start, end));

type PropDatum = {
  readonly id: "controller" | "note" | "head" | "paper" | "pencil";
  readonly x: number;
  readonly y: number;
  readonly start: number;
  readonly rotation: number;
  readonly depth: number;
  readonly label: string;
  readonly english: string;
};

const PROPS: readonly PropDatum[] = [
  {
    id: "controller",
    x: 176,
    y: 250,
    start: 38,
    rotation: -8,
    depth: 1.12,
    label: "输入",
    english: "INPUT",
  },
  {
    id: "note",
    x: 1375,
    y: 174,
    start: 55,
    rotation: 8,
    depth: 0.88,
    label: "方法",
    english: "METHOD",
  },
  {
    id: "head",
    x: 1390,
    y: 605,
    start: 69,
    rotation: -4,
    depth: 1.2,
    label: "反馈",
    english: "FEEDBACK",
  },
  {
    id: "paper",
    x: 112,
    y: 648,
    start: 79,
    rotation: -12,
    depth: 0.76,
    label: "练习",
    english: "PRACTICE",
  },
  {
    id: "pencil",
    x: 1225,
    y: 712,
    start: 91,
    rotation: 13,
    depth: 1.34,
    label: "纠错",
    english: "CORRECT",
  },
] as const;

const FIDELITY_DEPTHS = [0.76, 0.88, 1.12, 1.2, 1.34] as const;

export const getFeedbackDepthPlane = (mode: RemakeMode, depth: number) => {
  if (mode === "fast") {
    return depth >= 1 ? 1 : 0;
  }

  return FIDELITY_DEPTHS.reduce(
    (closestIndex, candidate, index) =>
      Math.abs(candidate - depth) <
      Math.abs(FIDELITY_DEPTHS[closestIndex] - depth)
        ? index
        : closestIndex,
    0,
  );
};

export const getFeedbackParallaxOffset = (
  mode: RemakeMode,
  depthPlane: number,
  cameraProgress: number,
) => {
  const maximumPlane = mode === "fast" ? 1 : 4;
  const intensity = mode === "fast" ? 36 : 76;
  const normalizedDepth = depthPlane / maximumPlane - 0.5;
  const clampedProgress = Math.max(0, Math.min(1, cameraProgress));

  return normalizedDepth * intensity * clampedProgress;
};

const PaperField = ({ mode }: ShotProps) => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background:
          mode === "fidelity"
            ? "radial-gradient(circle at 52% 46%, #d9d4c8 0%, #c3bdb0 58%, #89847b 112%)"
            : "linear-gradient(145deg, #d8d2c5, #bdb7aa)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: -160,
        top: 70,
        width: 1110,
        height: 760,
        rotate: "-16deg",
        backgroundColor: "rgba(238,232,218,.56)",
        boxShadow:
          mode === "fidelity" ? "24px 30px 34px rgba(52,45,35,.2)" : "none",
        border: "2px solid rgba(76,70,61,.13)",
      }}
    >
      {Array.from({ length: mode === "fidelity" ? 18 : 7 }, (_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 90,
            top: 90 + index * 28,
            width: 620 - (index % 4) * 72,
            height: 3,
            backgroundColor: "rgba(72,67,59,.14)",
          }}
        />
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        right: -130,
        top: 220,
        width: 940,
        height: 630,
        rotate: "10deg",
        border: "4px solid rgba(83,76,67,.13)",
        borderRadius: "50%",
        opacity: 0.58,
      }}
    />
    {mode === "fidelity"
      ? Array.from({ length: 70 }, (_, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${deterministicTextureValue(index, 70033) * 100}%`,
              top: `${deterministicTextureValue(index, 82600) * 100}%`,
              width: 18 + deterministicTextureValue(index, 406158) * 62,
              height: 1,
              rotate: `${deterministicTextureValue(index, 180) * 70 - 35}deg`,
              backgroundColor: "rgba(55,50,43,.15)",
              mixBlendMode: "multiply",
            }}
          />
        ))
      : null}
  </AbsoluteFill>
);

const Figure = ({ frame, mode }: { frame: number; mode: RemakeMode }) => {
  const arrival = interpolate(frame, [8, 22, 34, 45], [0, 1.08, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const impact = Math.max(
    ...PROPS.map((prop) => {
      const press = segmentProgress(frame, prop.start, prop.start + 5);
      const release = segmentProgress(frame, prop.start + 5, prop.start + 13);
      return Math.min(press, 1 - release);
    }),
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 710,
        top: 190,
        width: 500,
        height: 680,
        scale: `${arrival * (1 + impact * 0.055)} ${arrival * (1 - impact * 0.12)}`,
        translate: `0 ${impact * 42}px`,
        transformOrigin: "50% 88%",
        zIndex: 30,
      }}
    >
      {mode === "fidelity" ? (
        <div
          style={{
            position: "absolute",
            left: 76,
            bottom: 4,
            width: 420,
            height: 90,
            borderRadius: "50%",
            background: "rgba(35,31,27,.38)",
            filter: "blur(19px)",
            rotate: "3deg",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 0,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            mode === "fidelity"
              ? "radial-gradient(circle at 31% 25%, #4b4945 0%, #1c1c1b 48%, #060606 100%)"
              : pair.palette.text,
          boxShadow:
            mode === "fidelity"
              ? "22px 28px 27px rgba(39,34,28,.4), inset -16px -18px 28px #050505"
              : "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 244,
          width: 500,
          height: 390,
          borderRadius: "50% 50% 12% 12% / 62% 62% 10% 10%",
          background:
            mode === "fidelity"
              ? "linear-gradient(128deg, #403e3a 0%, #171716 54%, #070707 100%)"
              : pair.palette.text,
          boxShadow:
            mode === "fidelity"
              ? "30px 38px 30px rgba(39,34,28,.43), inset -24px -20px 30px #080808"
              : "0 18px 0 rgba(45,40,33,.15)",
        }}
      />
    </div>
  );
};

const EditorialLabel = ({
  label,
  english,
  mode,
}: {
  label: string;
  english: string;
  mode: RemakeMode;
}) => (
  <div
    style={{
      position: "absolute",
      left: -4,
      top: -92,
      padding: "7px 14px 10px",
      color: mode === "fidelity" ? "#d66b56" : "#f0e7d8",
      backgroundColor: mode === "fidelity" ? "#171717" : pair.palette.accent,
      fontFamily: SONG,
      fontSize: 48,
      fontWeight: 900,
      lineHeight: 0.9,
      letterSpacing: ".04em",
      boxShadow: mode === "fidelity" ? "8px 10px 0 rgba(37,31,26,.19)" : "none",
      zIndex: 8,
    }}
  >
    <span
      style={{
        position: "absolute",
        left: 6,
        top: -24,
        fontFamily: "Georgia, serif",
        fontSize: 15,
        color: "#d66b56",
      }}
    >
      {english}
    </span>
    {label}
  </div>
);

const Controller = ({ mode }: ShotProps) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div
      style={{
        position: "absolute",
        left: 10,
        top: 36,
        width: 310,
        height: 164,
        borderRadius: "45% 45% 50% 50% / 30% 30% 70% 70%",
        background:
          mode === "fidelity"
            ? "linear-gradient(150deg, #f4f0e8, #a7a49d)"
            : "#ece8df",
        border: "4px solid #73716c",
        boxShadow:
          mode === "fidelity"
            ? "18px 25px 23px rgba(39,34,28,.32), inset 0 8px 12px rgba(255,255,255,.72)"
            : "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 77,
        top: 85,
        width: 72,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#343332",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 104,
        top: 58,
        width: 18,
        height: 72,
        borderRadius: 9,
        backgroundColor: "#343332",
      }}
    />
    {[0, 1, 2, 3].map((index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: 232 + (index % 2) * 34,
          top: 61 + Math.floor(index / 2) * 36,
          width: 25,
          height: 25,
          borderRadius: "50%",
          backgroundColor: index === 0 ? pair.palette.accent : "#575654",
        }}
      />
    ))}
  </div>
);

const Note = ({ mode }: ShotProps) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 12,
      background:
        mode === "fidelity"
          ? "linear-gradient(145deg, #e1d9c7, #aaa294)"
          : "#d8d0c0",
      border: "3px solid rgba(65,59,51,.5)",
      boxShadow:
        mode === "fidelity" ? "20px 27px 25px rgba(40,34,28,.34)" : "none",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 36,
        top: 48,
        width: 220,
        height: 8,
        backgroundColor: "rgba(60,55,49,.36)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 36,
        top: 78,
        width: 174,
        height: 8,
        backgroundColor: "rgba(60,55,49,.24)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 36,
        top: 108,
        width: 202,
        height: 8,
        backgroundColor: "rgba(60,55,49,.24)",
      }}
    />
    {mode === "fidelity" ? (
      <div
        style={{
          position: "absolute",
          left: 178,
          top: -20,
          width: 3,
          height: 310,
          rotate: "19deg",
          backgroundColor: "rgba(77,69,59,.16)",
        }}
      />
    ) : null}
  </div>
);

const OpenHead = ({ mode }: ShotProps) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div
      style={{
        position: "absolute",
        left: 78,
        top: 58,
        width: 200,
        height: 270,
        borderRadius: "50% 50% 42% 42% / 40% 42% 58% 60%",
        background:
          mode === "fidelity"
            ? "linear-gradient(90deg, #171717, #484641 42%, #121212)"
            : "#222221",
        clipPath:
          "polygon(0 0, 72% 0, 100% 34%, 85% 76%, 62% 100%, 10% 91%, 0 56%)",
        boxShadow:
          mode === "fidelity" ? "18px 27px 22px rgba(38,32,27,.37)" : "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 126,
        top: 42,
        width: 112,
        height: 45,
        borderRadius: "50%",
        backgroundColor: "#a69e8f",
        border: "10px solid #232220",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 155,
        top: 30,
        width: 54,
        height: 54,
        borderRadius: "50%",
        backgroundColor: pair.palette.accent,
      }}
    />
  </div>
);

const Papers = ({ mode }: ShotProps) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: 18 + index * 20,
          top: 16 + index * 18,
          width: 285,
          height: 180,
          rotate: `${-7 + index * 7}deg`,
          backgroundColor: index === 2 ? "#e7dfcf" : "#c7beb0",
          border: "2px solid rgba(71,64,55,.26)",
          boxShadow:
            mode === "fidelity" ? "10px 15px 14px rgba(39,33,27,.23)" : "none",
        }}
      >
        <div
          style={{
            margin: "35px 28px",
            height: 5,
            backgroundColor: "rgba(65,58,49,.25)",
            boxShadow: "0 22px rgba(65,58,49,.2), 0 44px rgba(65,58,49,.16)",
          }}
        />
      </div>
    ))}
  </div>
);

const Pencil = ({ mode }: ShotProps) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div
      style={{
        position: "absolute",
        left: 25,
        top: 70,
        width: 330,
        height: 44,
        borderRadius: 20,
        background: `linear-gradient(#c55a4d 0 45%, ${pair.palette.accent} 45% 100%)`,
        border: "3px solid #5a302c",
        boxShadow:
          mode === "fidelity" ? "17px 22px 18px rgba(41,34,27,.3)" : "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 340,
        top: 70,
        width: 0,
        height: 0,
        borderTop: "22px solid transparent",
        borderBottom: "22px solid transparent",
        borderLeft: "68px solid #d5b985",
      }}
    />
  </div>
);

const PropArtwork = ({
  id,
  mode,
}: {
  id: PropDatum["id"];
  mode: RemakeMode;
}) => {
  if (id === "controller") return <Controller mode={mode} />;
  if (id === "note") return <Note mode={mode} />;
  if (id === "head") return <OpenHead mode={mode} />;
  if (id === "paper") return <Papers mode={mode} />;
  return <Pencil mode={mode} />;
};

const OrbitProp = ({
  datum,
  frame,
  mode,
  cameraProgress,
}: {
  datum: PropDatum;
  frame: number;
  mode: RemakeMode;
  cameraProgress: number;
}) => {
  const enter = eased(frame, datum.start, datum.start + 20);
  const overshoot = interpolate(
    frame,
    [datum.start, datum.start + 13, datum.start + 23, datum.start + 34],
    [0.7, 1.1, 0.96, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const vectorX = datum.x < 700 ? -620 : datum.x > 1210 ? 610 : 0;
  const vectorY = datum.y > 600 ? 410 : -310;
  const width = datum.id === "note" ? 330 : datum.id === "pencil" ? 430 : 360;
  const height =
    datum.id === "note"
      ? 230
      : datum.id === "pencil"
        ? 190
        : datum.id === "head"
          ? 360
          : 255;
  const depthPlane = getFeedbackDepthPlane(mode, datum.depth);
  const parallax = getFeedbackParallaxOffset(mode, depthPlane, cameraProgress);
  const parallaxX = datum.x < 800 ? -parallax : parallax;
  const parallaxY = datum.y < 540 ? -parallax * 0.38 : parallax * 0.38;

  return (
    <div
      style={{
        position: "absolute",
        left: datum.x,
        top: datum.y,
        width,
        height,
        opacity: enter,
        translate: `${(1 - enter) * vectorX * datum.depth + parallaxX}px ${(1 - enter) * vectorY * datum.depth + parallaxY}px`,
        rotate: `${datum.rotation + (1 - enter) * (datum.x < 700 ? -18 : 18)}deg`,
        scale: overshoot,
        zIndex: 20 + depthPlane * 4,
      }}
    >
      <PropArtwork id={datum.id} mode={mode} />
      <EditorialLabel label={datum.label} english={datum.english} mode={mode} />
    </div>
  );
};

const LoopConnectors = ({
  frame,
  mode,
}: {
  frame: number;
  mode: RemakeMode;
}) => {
  const paths = [
    "M470 350 C620 210 720 190 830 260",
    "M1110 260 C1260 180 1390 230 1500 350",
    "M1530 520 C1540 660 1430 760 1240 790",
    "M690 810 C480 810 360 690 360 530",
    "M610 490 C760 400 870 400 960 500",
  ];

  return (
    <svg
      width="1920"
      height="1080"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 12,
        opacity: mode === "fidelity" ? 0.34 : 0.48,
      }}
    >
      {paths.map((path, index) => {
        const progress = eased(frame, 32 + index * 12, 55 + index * 12);
        return (
          <path
            key={path}
            d={path}
            pathLength="1"
            fill="none"
            stroke={index % 2 === 0 ? pair.palette.accent : pair.palette.border}
            strokeWidth={mode === "fidelity" ? 5 : 4}
            strokeDasharray=".06 .04"
            strokeDashoffset={1 - progress}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const ForegroundDetail = ({ frame }: { frame: number }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: -110,
        bottom: -160,
        width: 510,
        height: 360,
        rotate: "17deg",
        backgroundColor: "rgba(36,34,31,.68)",
        filter: "blur(16px)",
        opacity: eased(frame, 78, 98),
        zIndex: 70,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: -160,
        top: 690,
        width: 600,
        height: 125,
        rotate: "-9deg",
        backgroundColor: "rgba(164,71,62,.7)",
        filter: "blur(12px)",
        opacity: eased(frame, 91, 111),
        zIndex: 71,
      }}
    />
  </>
);

const CaptionChip = ({
  children,
  style,
}: {
  children: ReactNode;
  style: CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      padding: "10px 18px",
      color: "#efe9dc",
      backgroundColor: "#1d1c1a",
      fontFamily: SONG,
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: ".05em",
      ...style,
    }}
  >
    {children}
  </div>
);

export const FeedbackLoopDesktop = ({ mode }: ShotProps) => {
  const frame = useCurrentFrame();
  const camera = sampleCamera(pair.cameraBeats, frame);
  const cameraProgress = segmentProgress(
    camera.scale,
    pair.cameraBeats[0].scale,
    pair.cameraBeats[pair.cameraBeats.length - 1].scale,
  );
  const titleIn = eased(frame, 16, 32);
  const isFidelity = mode === "fidelity";

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: pair.palette.background,
        fontFamily: SANS,
      }}
    >
      <PaperField mode={mode} />
      <CameraLayer {...camera}>
        {isFidelity ? (
          <div
            style={{
              position: "absolute",
              left: 81,
              top: 115,
              width: 470,
              height: 230,
              rotate: "-13deg",
              backgroundColor: "rgba(88,81,70,.13)",
              filter: "blur(2px)",
              zIndex: 5,
            }}
          />
        ) : null}
        <LoopConnectors frame={frame} mode={mode} />
        <Figure frame={frame} mode={mode} />
        {PROPS.map((datum) => (
          <OrbitProp
            key={datum.id}
            datum={datum}
            frame={frame}
            mode={mode}
            cameraProgress={cameraProgress}
          />
        ))}
        <CaptionChip
          style={{ left: 694, top: 850, opacity: titleIn, zIndex: 45 }}
        >
          {pair.copy.kicker} · INPUT → PRACTICE → FEEDBACK
        </CaptionChip>
        {isFidelity ? <ForegroundDetail frame={frame} /> : null}
      </CameraLayer>
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 42,
          color: "rgba(247,241,227,.9)",
          fontSize: 25,
          fontWeight: 850,
          letterSpacing: ".09em",
          textShadow: "0 2px 2px rgba(31,28,24,.42)",
        }}
      >
        FEEDBACK LOOP · 04
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 52,
          translate: "-50% 0",
          color: pair.palette.text,
          fontFamily: SONG,
          fontSize: 38,
          fontWeight: 700,
          whiteSpace: "nowrap",
          opacity: eased(frame, 105, 122),
        }}
      >
        {pair.copy.body[0]}，{pair.copy.body[1]}
      </div>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 46%, transparent 54%, rgba(38,34,29,.33) 100%)",
          opacity: isFidelity ? 0.76 : 0.2,
        }}
      />
    </AbsoluteFill>
  );
};
