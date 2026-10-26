import type {CSSProperties} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import {
  CLAMP,
  CornerFrame,
  Eyebrow,
  FONT_DISPLAY,
  FONT_SANS,
  PALETTE,
  PilotBackground,
} from "./design";

export const RANKING_SCROLL_LOCK_DURATION = 150;
export const RANKING_SCROLL_LOCK_QA_FRAMES = [14, 42, 72, 100] as const;

export const PROBABILITY_CARD_FLIP_DURATION = 145;
export const PROBABILITY_CARD_FLIP_QA_FRAMES = [18, 36, 56, 95] as const;

export const PARAMETER_ODOMETER_DURATION = 150;
export const PARAMETER_ODOMETER_QA_FRAMES = [20, 42, 67, 100] as const;

const titleStyle: CSSProperties = {
  margin: 0,
  color: PALETTE.ink,
  fontFamily: FONT_DISPLAY,
  fontSize: 72,
  fontWeight: 800,
  letterSpacing: 2,
  lineHeight: 1,
};

const MODELS = [
  {name: "Atlas", score: "92.4"},
  {name: "Nova", score: "91.8"},
  {name: "Orion", score: "90.9"},
  {name: "Helix", score: "89.7"},
  {name: "Vertex", score: "88.5"},
  {name: "Aster", score: "87.3"},
  {name: "Lumen", score: "86.2"},
  {name: "Kite", score: "84.9"},
  {name: "Delta", score: "83.6"},
  {name: "Mosaic", score: "82.1"},
  {name: "Echo", score: "80.8"},
  {name: "Prism", score: "79.4"},
] as const;

const RANK_ROW_HEIGHT = 68;
const RANK_ROW_GAP = 10;
const RANK_COLUMN_WIDTH = 1180;
const RANK_CENTER_Y = 622;
const RANK_END_Y = RANK_CENTER_Y - RANK_ROW_HEIGHT / 2;
const RANK_START_Y =
  RANK_CENTER_Y -
  (MODELS.length - 1) * (RANK_ROW_HEIGHT + RANK_ROW_GAP) -
  RANK_ROW_HEIGHT / 2;

const rankingScrollAt = (frame: number) =>
  interpolate(frame, [14, 64], [RANK_START_Y, RANK_END_Y], {
    ...CLAMP,
    easing: Easing.out(Easing.exp),
  });

const RankingRow = ({
  index,
  frame,
}: {
  index: number;
  frame: number;
}) => {
  const model = MODELS[index];
  const isTarget = index === 0;
  const emphasis = interpolate(frame, [68, 82], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const targetScale = isTarget ? 1 + emphasis * 0.025 : 1;
  const opacity = isTarget ? 1 : 1 - emphasis * 0.68;

  return (
    <div
      style={{
        position: "absolute",
        top: index * (RANK_ROW_HEIGHT + RANK_ROW_GAP),
        left: 0,
        width: RANK_COLUMN_WIDTH,
        height: RANK_ROW_HEIGHT,
        alignItems: "center",
        backgroundColor: isTarget
          ? interpolateColors(
              emphasis,
              [0, 1],
              [PALETTE.panel, PALETTE.acid],
            )
          : PALETTE.panel,
        border: `2px solid ${
          isTarget
            ? interpolateColors(
                emphasis,
                [0, 1],
                [PALETTE.dim, PALETTE.acid],
              )
            : PALETTE.dim
        }`,
        borderRadius: 12,
        boxShadow: isTarget
          ? `0 ${Math.round(8 + emphasis * 18)}px ${Math.round(
              22 + emphasis * 34,
            )}px rgba(0,0,0,${0.18 + emphasis * 0.34})`
          : "0 5px 18px rgba(0,0,0,0.18)",
        boxSizing: "border-box",
        color: isTarget && emphasis > 0.5 ? PALETTE.background : PALETTE.ink,
        display: "grid",
        fontFamily: FONT_SANS,
        gridTemplateColumns: "110px 1fr 200px",
        opacity,
        padding: "0 34px",
        scale: targetScale,
        zIndex: isTarget ? 2 : 1,
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 34,
          fontVariantNumeric: "tabular-nums",
          opacity: 0.72,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{fontSize: 38, fontWeight: 760, letterSpacing: 0.4}}>
        {model.name}
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 42,
          fontVariantNumeric: "tabular-nums",
          fontWeight: 800,
          textAlign: "right",
        }}
      >
        {model.score}
      </div>
    </div>
  );
};

export const RankingScrollLock = () => {
  const frame = useCurrentFrame();
  const y = rankingScrollAt(frame);
  const speed =
    frame > 14 && frame <= 64
      ? Math.abs(rankingScrollAt(frame) - rankingScrollAt(frame - 1))
      : 0;
  const blur = Math.min(speed / 50, 1) * 6;

  return (
    <AbsoluteFill>
      <PilotBackground>
        <CornerFrame />
        <div style={{position: "absolute", left: 120, top: 88, zIndex: 5}}>
          <Eyebrow>BENCHMARK / 2026</Eyebrow>
          <h1 style={{...titleStyle, marginTop: 18}}>模型能力榜</h1>
        </div>
        <div
          style={{
            position: "absolute",
            left: (1920 - RANK_COLUMN_WIDTH) / 2,
            top: 0,
            width: RANK_COLUMN_WIDTH,
            height: 1080,
            filter: blur > 0.08 ? `blur(${blur}px)` : undefined,
            translate: `0 ${y}px`,
          }}
        >
          {MODELS.map((model, index) => (
            <RankingRow
              key={model.name}
              index={index}
              frame={frame}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 82,
            right: 120,
            color: PALETTE.muted,
            fontSize: 32,
            letterSpacing: 3,
          }}
        >
          SCORE / 100
        </div>
      </PilotBackground>
    </AbsoluteFill>
  );
};

const CARD_WIDTH = 440;
const CARD_HEIGHT = 320;
const CARD_GAP = 54;
const CARD_X = (1920 - (CARD_WIDTH * 3 + CARD_GAP * 2)) / 2;
const CARD_Y = 420;
const CARD_LABELS = ["模型 A", "模型 B", "模型 C"] as const;
const CARD_RESULTS = ["39%", "46%", "51%"] as const;
const CARD_CONFIDENCE = [0.86, 0.78, 0.69] as const;
const CARD_ACCENTS = [PALETTE.acidSoft, PALETTE.warm, PALETTE.red] as const;

const cardAngleAt = (frame: number, index: number) => {
  const start = 18 + index * 10;
  if (frame < start + 18) {
    return interpolate(frame, [start, start + 18], [0, 192], {
      ...CLAMP,
      easing: Easing.bezier(0.55, 0, 0.3, 1),
    });
  }
  return interpolate(frame, [start + 18, start + 26], [192, 180], {
    ...CLAMP,
    easing: Easing.out(Easing.poly(5)),
  });
};

const CardSheen = ({angle}: {angle: number}) => {
  const opacity = Math.max(0, 1 - Math.abs(angle - 90) / 52);
  if (opacity < 0.004) return null;
  const position = interpolate(angle, [34, 146], [-22, 122], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(105deg, transparent ${
          position - 16
        }%, rgba(0,0,0,0.52) ${position}%, transparent ${position + 16}%)`,
        borderRadius: 18,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const ProbabilityFlipCard = ({
  index,
  frame,
}: {
  index: number;
  frame: number;
}) => {
  const angle = cardAngleAt(frame, index);
  const sharedFace: CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    border: `2px solid ${PALETTE.dim}`,
    borderRadius: 18,
    boxShadow: "0 28px 70px rgba(0,0,0,0.34)",
    boxSizing: "border-box",
    overflow: "hidden",
  };

  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X + index * (CARD_WIDTH + CARD_GAP),
        top: CARD_Y,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        perspective: 1200,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `rotateY(${angle}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            ...sharedFace,
            backgroundColor: PALETTE.panelRaised,
            padding: "46px 42px",
          }}
        >
          <div
            style={{
              color: PALETTE.ink,
              fontSize: 48,
              fontWeight: 760,
              letterSpacing: 1,
            }}
          >
            {CARD_LABELS[index]}
          </div>
          <div
            style={{
              color: PALETTE.muted,
              fontSize: 32,
              letterSpacing: 3,
              marginTop: 28,
            }}
          >
            CONFIDENCE
          </div>
          <div
            style={{
              height: 18,
              marginTop: 18,
              overflow: "hidden",
              backgroundColor: PALETTE.dim,
              borderRadius: 9,
            }}
          >
            <div
              style={{
                width: `${CARD_CONFIDENCE[index] * 100}%`,
                height: "100%",
                borderRadius: 9,
                backgroundColor: CARD_ACCENTS[index],
              }}
            />
          </div>
          <CardSheen angle={angle} />
        </div>
        <div
          style={{
            ...sharedFace,
            alignItems: "center",
            background: `linear-gradient(145deg, ${PALETTE.panelRaised}, ${PALETTE.panel})`,
            borderColor: `${CARD_ACCENTS[index]}99`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            style={{
              color: CARD_ACCENTS[index],
              fontFamily: FONT_DISPLAY,
              fontSize: 112,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 0.86,
            }}
          >
            {CARD_RESULTS[index]}
          </div>
          <div
            style={{
              color: PALETTE.ink,
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: 8,
              marginTop: 36,
            }}
          >
            幻觉率
          </div>
          <CardSheen angle={angle} />
        </div>
      </div>
    </div>
  );
};

export const ProbabilityCardFlip = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <PilotBackground accent={PALETTE.warm}>
        <CornerFrame />
        <div style={{position: "absolute", left: 120, top: 88}}>
          <Eyebrow>RELIABILITY / TEST</Eyebrow>
          <h1 style={{...titleStyle, marginTop: 18}}>输出可信度对比</h1>
        </div>
        {[0, 1, 2].map((index) => (
          <ProbabilityFlipCard key={index} index={index} frame={frame} />
        ))}
        <div
          style={{
            position: "absolute",
            left: CARD_X,
            right: CARD_X,
            top: CARD_Y + CARD_HEIGHT + 54,
            borderTop: `1px solid ${PALETTE.dim}`,
            color: PALETTE.muted,
            fontSize: 32,
            letterSpacing: 4,
            paddingTop: 24,
            textAlign: "right",
          }}
        >
          LOWER IS BETTER
        </div>
      </PilotBackground>
    </AbsoluteFill>
  );
};

const ODOMETER_ROW_HEIGHT = 230;
const ODOMETER_DIGIT_WIDTH = 152;
const ODOMETER_FONT_SIZE = 218;
const ODOMETER_SPIN_SPEED = 0.85;
const ODOMETER_DIGITS = [2, 8, 0, 0] as const;

const odometerPositionAt = (frame: number, index: number) => {
  const targetDigit = ODOMETER_DIGITS[index];
  const slowStart = 20 + index * 7;
  const initialPosition = ODOMETER_SPIN_SPEED * slowStart;
  const targetPosition =
    Math.ceil((initialPosition + 6 - targetDigit) / 10) * 10 + targetDigit;

  if (frame < slowStart) {
    return ODOMETER_SPIN_SPEED * Math.max(frame, 0);
  }
  if (frame < slowStart + 16) {
    return interpolate(
      frame,
      [slowStart, slowStart + 16],
      [initialPosition, targetPosition + 0.5],
      {...CLAMP, easing: Easing.out(Easing.cubic)},
    );
  }
  if (frame < slowStart + 22) {
    return interpolate(
      frame,
      [slowStart + 16, slowStart + 22],
      [targetPosition + 0.5, targetPosition],
      {...CLAMP, easing: Easing.out(Easing.cubic)},
    );
  }
  return targetPosition;
};

const OdometerStrip = ({
  position,
  color,
  opacity = 1,
  offsetY = 0,
}: {
  position: number;
  color: string;
  opacity?: number;
  offsetY?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: ODOMETER_DIGIT_WIDTH,
      opacity,
      translate: `0 ${-position * ODOMETER_ROW_HEIGHT + offsetY}px`,
    }}
  >
    {Array.from({length: 70}, (_, row) => (
      <div
        key={row}
        style={{
          width: ODOMETER_DIGIT_WIDTH,
          height: ODOMETER_ROW_HEIGHT,
          color,
          fontFamily: FONT_DISPLAY,
          fontSize: ODOMETER_FONT_SIZE,
          fontVariantNumeric: "tabular-nums",
          fontWeight: 800,
          letterSpacing: -4,
          lineHeight: `${ODOMETER_ROW_HEIGHT}px`,
          textAlign: "center",
        }}
      >
        {row % 10}
      </div>
    ))}
  </div>
);

const OdometerDigit = ({
  frame,
  index,
  color,
}: {
  frame: number;
  index: number;
  color: string;
}) => {
  const position = odometerPositionAt(frame, index);
  const speed = Math.abs(
    position - odometerPositionAt(Math.max(frame - 1, 0), index),
  );
  const ghostGate = interpolate(speed, [0.06, 0.5], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: "relative",
        width: ODOMETER_DIGIT_WIDTH,
        height: ODOMETER_ROW_HEIGHT,
        overflow: "hidden",
      }}
    >
      {ghostGate > 0.001 ? (
        <>
          <OdometerStrip
            position={position}
            color={color}
            opacity={ghostGate * 0.25}
            offsetY={ODOMETER_ROW_HEIGHT * 0.5}
          />
          <OdometerStrip
            position={position}
            color={color}
            opacity={ghostGate * 0.12}
            offsetY={-ODOMETER_ROW_HEIGHT * 0.5}
          />
        </>
      ) : null}
      <OdometerStrip position={position} color={color} />
    </div>
  );
};

export const ParameterOdometer = () => {
  const frame = useCurrentFrame();
  const numberColor = interpolateColors(
    frame,
    [63, 67, 71],
    [PALETTE.ink, PALETTE.acid, PALETTE.ink],
  );
  const pulseScale = interpolate(frame, [63, 67, 71], [1, 1.035, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const labelOpacity = interpolate(frame, [66, 84], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const labelRise = interpolate(frame, [66, 84], [22, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <PilotBackground>
        <CornerFrame />
        <div style={{position: "absolute", left: 120, top: 88}}>
          <Eyebrow>模型规模</Eyebrow>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 338,
            width: 1920,
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            scale: pulseScale,
            transformOrigin: "960px 115px",
          }}
        >
          {ODOMETER_DIGITS.map((digit, index) => (
            <OdometerDigit
              key={`${digit}-${index}`}
              frame={frame}
              index={index}
              color={numberColor}
            />
          ))}
          <div
            style={{
              width: 220,
              height: ODOMETER_ROW_HEIGHT,
              color: numberColor,
              fontFamily: FONT_DISPLAY,
              fontSize: ODOMETER_FONT_SIZE,
              fontWeight: 800,
              letterSpacing: -8,
              lineHeight: `${ODOMETER_ROW_HEIGHT}px`,
              textAlign: "center",
            }}
          >
            亿
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 662,
            width: 1920,
            color: PALETTE.ink,
            fontFamily: FONT_SANS,
            fontSize: 58,
            fontWeight: 750,
            letterSpacing: 15,
            opacity: labelOpacity,
            textAlign: "center",
            translate: `0 ${labelRise}px`,
          }}
        >
          PARAMETER SCALE
        </div>
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 764,
            width: 840,
            height: 3,
            backgroundColor: PALETTE.acid,
            opacity: labelOpacity * 0.65,
          }}
        />
      </PilotBackground>
    </AbsoluteFill>
  );
};
