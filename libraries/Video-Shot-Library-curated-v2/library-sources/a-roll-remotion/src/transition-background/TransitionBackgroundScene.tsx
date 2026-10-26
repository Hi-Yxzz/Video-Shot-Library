import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {TRANSITION_BACKGROUND_MOTION as motion} from "./motion";
import type {
  TransitionBackgroundId,
  TransitionBackgroundSceneProps,
} from "./types";

const sans =
  '"PingFang SC", "Microsoft YaHei", Inter, system-ui, sans-serif';
const mono =
  '"SFMono-Regular", "Cascadia Code", "Roboto Mono", ui-monospace, monospace';

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const reveal = (frame: number, start: number, duration = 14) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: ease,
  });

const Stage = ({
  children,
  background = "#1c130d",
  light = false,
  style,
}: {
  children: ReactNode;
  background?: string;
  light?: boolean;
  style?: CSSProperties;
}) => (
  <AbsoluteFill
    style={{
      overflow: "hidden",
      color: light ? "#17171b" : "#f8f3ed",
      backgroundColor: background,
      backgroundImage: light
        ? "radial-gradient(circle at 72% 42%, rgba(61,133,232,.11), transparent 38%), linear-gradient(rgba(47,45,42,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(47,45,42,.035) 1px, transparent 1px)"
        : "radial-gradient(circle at 72% 42%, rgba(61,133,232,.12), transparent 36%), radial-gradient(circle at 23% 62%, rgba(217,119,87,.1), transparent 34%), linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px)",
      backgroundSize: "auto, auto, 54px 54px, 54px 54px",
      fontFamily: sans,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

const TechniqueLabel = ({
  text = "MOTION TECHNIQUE",
}: {
  text?: string;
}) => (
  <div
    style={{
      position: "absolute",
      left: 82,
      top: 66,
      fontSize: 26,
      fontWeight: 900,
      letterSpacing: 0.4,
    }}
  >
    {text}
  </div>
);

const GlowTitle = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const enter = reveal(frame, motion.transition.titleStart, 18);
  const line = reveal(frame, 20, motion.transition.lineEnd - 20);
  return (
    <Stage background={props.backgroundColor}>
      <div
        style={{
          position: "absolute",
          left: motion.transition.titleX,
          top: motion.transition.titleY,
          opacity: enter,
          translate: `${interpolate(enter, [0, 1], [-80, 0])}px 0`,
        }}
      >
        <div
          style={{
            fontSize: motion.transition.titleSize,
            lineHeight: 1.1,
            fontWeight: 950,
            letterSpacing: -1,
            textShadow: `0 0 48px ${props.primaryColor}55`,
            whiteSpace: "nowrap",
          }}
        >
          {props.title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: motion.transition.lineX,
          top: 472,
          width: interpolate(
            line,
            [0, 1],
            [0, motion.transition.lineWidth],
          ),
          height: 5,
          borderRadius: 99,
          background: props.primaryColor,
          boxShadow: `0 0 35px ${props.primaryColor}`,
        }}
      />
    </Stage>
  );
};

const AbilityCard = ({
  number,
  title,
  subtitle,
  accent,
  large = false,
  numberProgress = 1,
  titleProgress = 1,
  subtitleProgress = 1,
  style,
}: {
  number: string;
  title: string;
  subtitle?: string;
  accent: string;
  large?: boolean;
  numberProgress?: number;
  titleProgress?: number;
  subtitleProgress?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      width: large ? motion.abilitychapter.cardWidth : 300,
      height: large ? motion.abilitychapter.cardHeight : 440,
      boxSizing: "border-box",
      padding: large
        ? `${motion.abilitychapter.contentPaddingTop}px ${motion.abilitychapter.contentPaddingX}px`
        : "45px 38px",
      borderRadius: large ? 18 : 22,
      border: "1px solid rgba(255,255,255,.14)",
      background:
        "linear-gradient(155deg, rgba(255,255,255,.1), rgba(255,255,255,.025))",
      boxShadow: "0 30px 70px rgba(0,0,0,.34)",
      backdropFilter: "blur(18px)",
      ...style,
    }}
  >
    <div
      style={{
        fontFamily: mono,
        fontSize: large ? motion.abilitychapter.numberSize : 64,
        lineHeight: 1,
        fontWeight: 950,
        color: accent,
        opacity: numberProgress,
        filter: `blur(${interpolate(numberProgress, [0, 1], [12, 0])}px)`,
      }}
    >
      {number}
    </div>
    <div
      style={{
        fontSize: large ? motion.abilitychapter.cardTitleSize : 34,
        fontWeight: 900,
        marginTop: large ? 38 : 32,
        opacity: titleProgress,
        filter: `blur(${interpolate(titleProgress, [0, 1], [13, 0])}px)`,
      }}
    >
      {title}
    </div>
    {subtitle ? (
      <div
        style={{
          marginTop: 24,
          color: accent,
          fontSize: 27,
          fontWeight: 850,
          opacity: subtitleProgress,
          filter: `blur(${interpolate(subtitleProgress, [0, 1], [10, 0])}px)`,
        }}
      >
        {subtitle}
      </div>
    ) : null}
    <div
      style={{
        position: "absolute",
        left: large ? 52 : 38,
        right: large ? 52 : 38,
        bottom: large ? 54 : 42,
        height: 3,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
      }}
    />
  </div>
);

const AbilityChapter = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const pop = interpolate(
    frame,
    [
      motion.abilitychapter.popStart,
      motion.abilitychapter.popEnd - 5,
      motion.abilitychapter.popEnd,
    ],
    [0, 1.08, 1],
    {...clamp, easing: ease},
  );
  const split = interpolate(
    frame,
    [motion.abilitychapter.splitStart, motion.abilitychapter.splitEnd],
    [0, 1],
    {...clamp, easing: ease},
  );
  const second = reveal(frame, motion.abilitychapter.secondStart, 15);
  const leftNumber = reveal(frame, 5, 9);
  const leftTitle = reveal(
    frame,
    motion.abilitychapter.splitStart,
    motion.abilitychapter.textStagger + 5,
  );
  const rightNumber = reveal(frame, motion.abilitychapter.secondStart, 8);
  const rightTitle = reveal(
    frame,
    motion.abilitychapter.secondStart + motion.abilitychapter.textStagger,
    9,
  );
  const rightSubtitle = reveal(
    frame,
    motion.abilitychapter.secondStart + motion.abilitychapter.textStagger * 2,
    9,
  );
  return (
    <Stage background={props.backgroundColor}>
      <AbilityCard
        number={props.words[0] ?? "01"}
        title={props.words[1] ?? "能力一"}
        accent={props.primaryColor}
        large
        numberProgress={leftNumber}
        titleProgress={leftTitle}
        style={{
          left: interpolate(
            split,
            [0, 1],
            [735, motion.abilitychapter.finalLeft],
          ),
          top: 240,
          opacity: pop,
          scale: pop,
        }}
      />
      <AbilityCard
        number={props.words[0] ?? "01"}
        title={props.words[2] ?? props.title}
        subtitle={props.subtitle}
        accent={props.secondaryColor}
        large
        numberProgress={rightNumber}
        titleProgress={rightTitle}
        subtitleProgress={rightSubtitle}
        style={{
          left: 1100,
          top: 240,
          opacity: second,
          translate: `${interpolate(second, [0, 1], [100, 0])}px 0`,
        }}
      />
    </Stage>
  );
};

const AbilityDeal = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const slots = [
    {x: 170, y: 345, r: -14},
    {x: 510, y: 230, r: -7},
    {x: 810, y: 175, r: 0},
    {x: 1110, y: 230, r: 7},
    {x: 1450, y: 345, r: 14},
  ];
  const exit = reveal(frame, motion.abilitypan.exitStart, 22);
  return (
    <Stage background={props.backgroundColor}>
      {props.words.slice(0, 5).map((word, index) => {
        const deal =
          index === 0
            ? reveal(frame, 4, 18)
            : reveal(
                frame,
                motion.abilitypan.dealStart +
                  (index - 1) * motion.abilitypan.dealStagger,
                16,
              );
        const slot = slots[index];
        return (
          <AbilityCard
            key={word}
            number={String(index + 1).padStart(2, "0")}
            title={word}
            accent={index % 2 ? props.secondaryColor : props.primaryColor}
            style={{
              left: slot.x,
              top: interpolate(deal, [0, 1], [1030, slot.y]),
              rotate: `${interpolate(deal, [0, 1], [index % 2 ? 22 : -22, slot.r])}deg`,
              opacity: deal,
              scale:
                interpolate(deal, [0, 1], [0.72, 1]) *
                interpolate(exit, [0, 1], [1, 0.42]),
              translate: `0 ${interpolate(exit, [0, 1], [0, 180])}px`,
              zIndex: index + 1,
            }}
          />
        );
      })}
    </Stage>
  );
};

const DotMatrix = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const phase = (frame % motion.dotmatrix.loopFrames) / motion.dotmatrix.loopFrames;
  return (
    <Stage background={props.backgroundColor}>
      {Array.from({length: 14 * 24}, (_, index) => {
        const col = index % 24;
        const row = Math.floor(index / 24);
        const x = ((col * 82 + phase * 82) % 1968) - 24;
        const y = ((row * 82 - phase * 55 + 1148) % 1148) - 34;
        const pulse =
          0.35 +
          0.65 *
            Math.max(
              0,
              Math.cos(
                Math.hypot(x - 1380, y - 625) / 90 - phase * Math.PI * 6,
              ),
            );
        return (
          <i
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: pulse > 0.82 ? 7 : 4,
              height: pulse > 0.82 ? 7 : 4,
              borderRadius: "50%",
              background:
                pulse > 0.82 ? props.secondaryColor : props.primaryColor,
              opacity: 0.12 + pulse * 0.18,
              boxShadow:
                pulse > 0.82 ? `0 0 18px ${props.secondaryColor}` : undefined,
            }}
          />
        );
      })}
    </Stage>
  );
};

const TornWipe = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  return (
    <Stage background="#211812">
      <div
        style={{
          position: "absolute",
          inset: 22,
          border: "1px solid rgba(255,255,255,.28)",
          display: "grid",
          placeItems: "center",
          borderRadius: 12,
        }}
      >
        <div style={{textAlign: "center"}}>
          <div style={{fontSize: 78, fontWeight: 500}}>口播画面</div>
          <div style={{fontSize: 25, color: "#998f87", marginTop: 24}}>
            转场前后的下层画面
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: interpolate(
            frame,
            [0, motion.tornwipe.wipeEnd],
            [motion.tornwipe.startX, motion.tornwipe.endX],
            {...clamp, easing: Easing.linear},
          ),
          top: -80,
          width: motion.tornwipe.width,
          height: 1240,
          rotate: "-3deg",
          background: props.primaryColor,
          clipPath:
            "polygon(4% 0, 98% 2%, 94% 16%, 100% 31%, 93% 48%, 99% 64%, 92% 81%, 96% 100%, 0 98%, 5% 82%, 0 64%, 6% 47%, 1% 29%, 7% 14%)",
          boxShadow: "0 0 70px rgba(0,0,0,.34)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 55,
            fontWeight: 950,
            color: "#fff",
          }}
        >
          {props.words[0]}
        </div>
      </div>
    </Stage>
  );
};

const ChapterCard = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const lines = reveal(frame, motion.chaptercard.lineStart, 16);
  const title = reveal(frame, motion.chaptercard.titleStart, 18);
  return (
    <Stage background={props.backgroundColor}>
      {Array.from({length: 150}, (_, index) => (
        <i
          key={index}
          style={{
            position: "absolute",
            left: 40 + (index % 15) * 132,
            top: 35 + Math.floor(index / 15) * 112,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: props.secondaryColor,
            opacity: 0.16,
          }}
        />
      ))}
      {[motion.chaptercard.lineLeft, motion.chaptercard.lineRight].map((left, index) => (
        <div
          key={left}
          style={{
            position: "absolute",
            left,
            top: 476,
            width: 7,
            height: interpolate(
              lines,
              [0, 1],
              [0, motion.chaptercard.lineLength],
            ),
            translate: `0 ${interpolate(lines, [0, 1], [index ? 80 : -80, 0])}px`,
            background: "#fff",
            opacity: lines,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: motion.chaptercard.titleTop,
          textAlign: "center",
          opacity: title,
          translate: `0 ${interpolate(title, [0, 1], [48, 0])}px`,
        }}
      >
        <div
          style={{
            fontSize: motion.chaptercard.titleSize,
            lineHeight: 1.1,
            fontWeight: 950,
            whiteSpace: "nowrap",
          }}
        >
          {props.subtitle}
        </div>
      </div>
    </Stage>
  );
};

const Circuit = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const phase = (frame % 180) / 180;
  return (
    <Stage background={props.backgroundColor}>
      <TechniqueLabel text={props.subtitle} />
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
        {Array.from({length: 18}, (_, index) => {
          const y = 180 + index * 43;
          const start = index % 3 === 0 ? 210 : 490;
          return (
            <path
              key={index}
              d={`M ${start} ${y} H ${900 + (index % 4) * 120} V ${y + (index % 2 ? 80 : -80)} H 1740`}
              fill="none"
              stroke={index % 2 ? props.primaryColor : props.secondaryColor}
              strokeWidth={2}
              opacity={0.13 + 0.16 * Math.sin(phase * Math.PI * 2 + index)}
              strokeDasharray="4 18"
              strokeDashoffset={-phase * 180}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 72,
          fontSize: 22,
          fontFamily: mono,
          color: "#7f7771",
        }}
      >
        SIGNAL PATH / {Math.round(phase * 100).toString().padStart(2, "0")}
      </div>
    </Stage>
  );
};

const Rings = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => (
  <Stage background={props.backgroundColor}>
    <div
      style={{
        position: "absolute",
        left: motion.rk029.left,
        top: motion.rk029.top,
        width: motion.rk029.size,
        height: motion.rk029.size,
      }}
    >
      {Array.from({length: 9}, (_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            inset: index * 48,
            borderRadius: "50%",
            border: `2px solid ${index % 2 ? props.primaryColor : props.secondaryColor}`,
            opacity: 0.28 + index * 0.04,
            rotate: `${(frame * (index % 2 ? 0.55 : -0.42) + index * 17) % 360}deg`,
            scale: 1 + Math.sin(frame * 0.045 + index) * 0.035,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: motion.rk029.labelSize,
          fontWeight: 900,
        }}
      >
        {props.subtitle}
      </div>
    </div>
  </Stage>
);

const EyeScanner = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => (
  <Stage background={props.backgroundColor}>
    <div
      style={{
        position: "absolute",
        left: motion.rk036.left,
        top: motion.rk036.top,
        width: motion.rk036.width,
        height: motion.rk036.height,
      }}
    >
      {Array.from({length: 5}, (_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            inset: `${index * 34}px ${index * 58}px`,
            borderRadius: "50%",
            border: `3px solid ${index % 2 ? props.secondaryColor : props.primaryColor}`,
            opacity: 0.5 - index * 0.055,
            rotate: `${frame * (index % 2 ? -0.62 : 0.72) + index * 31}deg`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: motion.rk036.labelSize,
          fontWeight: 900,
        }}
      >
        {props.subtitle}
      </div>
    </div>
  </Stage>
);

const Scanner = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const x = interpolate((frame % 90) / 90, [0, 0.5, 1], [150, 1770, 150]);
  return (
    <Stage background={props.backgroundColor}>
      <TechniqueLabel text={props.subtitle} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: 0,
          bottom: 0,
          width: 2,
          background: props.primaryColor,
          boxShadow: `0 0 28px 8px ${props.primaryColor}66`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 110,
          top: 500,
          width: 220,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 18,
          color: props.primaryColor,
        }}
      >
        SCANNING
      </div>
    </Stage>
  );
};

const Waveform = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const points = Array.from({length: 97}, (_, index) => {
    const x = index * 20;
    const y =
      560 +
      Math.sin(index * 0.42 + frame * 0.12) *
        (45 + 120 * Math.abs(Math.sin(frame * 0.035 + index * 0.08)));
    return `${x},${y}`;
  }).join(" ");
  return (
    <Stage background={props.backgroundColor}>
      <TechniqueLabel text={props.subtitle} />
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
        <polyline
          points={points}
          fill="none"
          stroke={props.primaryColor}
          strokeWidth={4}
          opacity={0.8}
        />
        <polyline
          points={points}
          fill="none"
          stroke={props.secondaryColor}
          strokeWidth={16}
          opacity={0.13}
        />
      </svg>
    </Stage>
  );
};

const ParticleField = ({
  props,
  frame,
  stargazer = false,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
  stargazer?: boolean;
}) => (
  <Stage background={props.backgroundColor}>
    <TechniqueLabel text={props.subtitle} />
    {Array.from({length: stargazer ? 125 : 86}, (_, index) => {
      const depth = 0.25 + ((index * 37) % 100) / 100;
      const angle = index * 2.399 + frame * 0.006 * depth;
      const radius =
        ((index * 83 + frame * (stargazer ? 0.45 : 1.6) * depth) % 950) *
        depth;
      const x = 960 + Math.cos(angle) * radius;
      const y = 560 + Math.sin(angle) * radius * 0.58;
      return (
        <i
          key={index}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: stargazer ? 2 + depth * 4 : 3 + depth * 7,
            height: stargazer ? 2 + depth * 4 : 3 + depth * 7,
            borderRadius: "50%",
            background: index % 3 ? props.primaryColor : props.secondaryColor,
            opacity: 0.18 + depth * 0.58,
            boxShadow: stargazer ? `0 0 12px ${props.primaryColor}` : undefined,
          }}
        />
      );
    })}
  </Stage>
);

const Visualizer = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => (
  <Stage background={props.backgroundColor}>
    <TechniqueLabel text={props.subtitle} />
    <div
      style={{
        position: "absolute",
        left: 230,
        right: 230,
        top: 350,
        height: 390,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {Array.from({length: 76}, (_, index) => {
        const height =
          18 +
          Math.abs(
            Math.sin(index * 0.38 + frame * 0.14) *
              Math.cos(index * 0.11 - frame * 0.07),
          ) *
            340;
        return (
          <i
            key={index}
            style={{
              flex: 1,
              height,
              borderRadius: 8,
              background:
                index % 5 === 0 ? props.secondaryColor : props.primaryColor,
              opacity: 0.32 + height / 520,
            }}
          />
        );
      })}
    </div>
  </Stage>
);

const MatrixRain = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => (
  <Stage background="#120f0d">
    <TechniqueLabel text={props.subtitle} />
    {Array.from({length: 48}, (_, column) => {
      const y = ((column * 137 + frame * (6 + (column % 5))) % 1460) - 360;
      return (
        <div
          key={column}
          style={{
            position: "absolute",
            left: column * 42,
            top: y,
            color: column % 7 ? props.primaryColor : props.secondaryColor,
            opacity: 0.16 + (column % 5) * 0.06,
            fontFamily: mono,
            fontSize: 16,
            lineHeight: 1.22,
            writingMode: "vertical-rl",
            textShadow: `0 0 10px ${props.primaryColor}`,
          }}
        >
          {`${(column * 7919).toString(2)}MOTION${(column * 3571).toString(16)}`}
        </div>
      );
    })}
  </Stage>
);

const Aurora = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => (
  <Stage background="#120f0d">
    <TechniqueLabel text={props.subtitle} />
    {[
      {color: props.primaryColor, x: 20, y: 32, phase: 0},
      {color: props.secondaryColor, x: 52, y: 22, phase: 2},
      {color: "#6d5cff", x: 72, y: 48, phase: 4},
    ].map((blob) => (
      <div
        key={blob.phase}
        style={{
          position: "absolute",
          left: `${blob.x + Math.sin(frame * 0.025 + blob.phase) * 14}%`,
          top: `${blob.y + Math.cos(frame * 0.018 + blob.phase) * 11}%`,
          width: 760,
          height: 520,
          translate: "-50% -50%",
          borderRadius: "50%",
          background: blob.color,
          filter: "blur(120px)",
          opacity: 0.26,
          rotate: `${frame * 0.08 + blob.phase * 20}deg`,
        }}
      />
    ))}
  </Stage>
);

const SweepMask = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const x = interpolate(
    frame,
    [motion.rc023.sweepStart, motion.rc023.sweepEnd],
    [-240, 2160],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  return (
    <Stage background={props.paperColor} light>
      <TechniqueLabel text={props.subtitle} />
      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          top: 320,
          height: 430,
          borderRadius: 20,
          overflow: "hidden",
          background: "#e7ded2",
          border: "1px solid #d1c6ba",
          display: "grid",
          placeItems: "center",
          fontSize: 58,
          fontWeight: 900,
          color: "#6d625a",
        }}
      >
        {props.words[0]}
        <AbsoluteFill
          style={{
            clipPath: `circle(250px at ${x - 82}px 215px)`,
            background: "#201711",
            color: "#fff",
            display: "grid",
            placeItems: "center",
          }}
        >
          {props.words[1]}
        </AbsoluteFill>
      </div>
      <div
        style={{
          position: "absolute",
          left: x,
          top: 264,
          height: 550,
          width: 3,
          background: props.secondaryColor,
          boxShadow: `0 0 22px ${props.secondaryColor}`,
        }}
      />
    </Stage>
  );
};

const FluidSurface = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const points = Array.from({length: 65}, (_, index) => {
    const x = index * 30;
    const y =
      615 +
      Math.sin(index * 0.22 + frame * 0.045) * 34 +
      Math.sin(index * 0.55 - frame * 0.028) * 18;
    return `${x},${y}`;
  }).join(" ");
  const pullX = 260 + ((frame * 10) % 1400);
  return (
    <Stage background={props.backgroundColor}>
      <TechniqueLabel text={props.subtitle} />
      <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
        <defs>
          <linearGradient id="fluid-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff8eb" />
            <stop offset="55%" stopColor="#dcecff" />
            <stop offset="100%" stopColor="#f7e4d7" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,1080 ${points} 1920,1080`}
          fill="url(#fluid-fill)"
        />
        <circle cx={pullX} cy={530 + Math.sin(frame * 0.08) * 70} r="34" fill="#fff8eb" />
        <circle cx={pullX - 42} cy={570} r="12" fill="#dcecff" />
      </svg>
    </Stage>
  );
};

const PaperLift = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const lift = interpolate(
    frame,
    [motion.paperlift.liftStart, motion.paperlift.liftEnd],
    [0, -1280],
    {...clamp, easing: Easing.in(Easing.cubic)},
  );
  const revealText = reveal(frame, motion.paperlift.revealStart, 18);
  return (
    <Stage background={props.paperColor} light>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: revealText,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: motion.paperlift.revealY,
            textAlign: "center",
          }}
        >
          <div style={{fontSize: 15, color: "#70675f", letterSpacing: 2}}>
            CORE REVEAL / SUMMARY
          </div>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {[...props.words[4]].map((char, index) => (
              <span
                key={`${char}-${index}`}
                style={{
                  minWidth: motion.paperlift.titleBlockHeight,
                  height: motion.paperlift.titleBlockHeight,
                  padding: "0 14px",
                  display: "grid",
                  placeItems: "center",
                  boxSizing: "border-box",
                  borderRadius: 4,
                  background:
                    index % 2 ? "#dce8fa" : props.primaryColor,
                  color: index % 2 ? "#15171e" : "#fff",
                  fontSize: motion.paperlift.titleFontSize,
                  fontWeight: 950,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 360,
            right: 360,
            top: 760,
            height: 2,
            background: "#3a3531",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 750,
            width: 20,
            height: 20,
            translate: "-50% 0",
            borderRadius: "50%",
            border: "2px solid #756a62",
            background: props.paperColor,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: 76 + lift,
          height: 930,
          padding: "68px 76px",
          boxSizing: "border-box",
          background: "#fff",
          boxShadow: "0 28px 65px rgba(55,42,31,.17)",
          rotate: `${interpolate(lift, [-1280, 0], [-4, 0])}deg`,
        }}
      >
        <div style={{fontSize: 56, fontWeight: 950}}>{props.words[0]}</div>
        <div style={{height: 5, width: 130, margin: "22px 0 45px", background: props.primaryColor}} />
        {Array.from({length: 8}, (_, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "70px 1fr 180px",
              alignItems: "center",
              gap: 28,
              padding: "22px 0",
              borderTop: "1px solid #e3ddd6",
              fontSize: 24,
            }}
          >
            <b>{String(index + 1).padStart(2, "0")}</b>
            <span>{props.words[(index % 3) + 1]}</span>
            <i
              style={{
                height: 14,
                width: `${45 + (index % 4) * 15}%`,
                background: index % 2 ? props.primaryColor : props.secondaryColor,
              }}
            />
          </div>
        ))}
      </div>
    </Stage>
  );
};

const DocumentCascade = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  const spread = interpolate(frame, [4, motion.documentcascade.spreadEnd], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const slots = [
    {x: 58, y: 60, r: -5},
    {x: 665, y: 42, r: 2},
    {x: 1260, y: 78, r: 5},
    {x: 120, y: 560, r: 3},
    {x: 735, y: 570, r: -2},
    {x: 1320, y: 540, r: -5},
  ];
  return (
    <Stage background={interpolate(spread, [0, 1], [0, 1]) > 0.5 ? props.paperColor : props.backgroundColor} light={spread > 0.45}>
      {props.words.slice(0, 6).map((word, index) => {
        const slot = slots[index];
        return (
          <div
            key={word}
            style={{
              position: "absolute",
              left: interpolate(spread, [0, 1], [710, slot.x]),
              top: interpolate(spread, [0, 1], [300, slot.y]),
              width: interpolate(spread, [0, 1], [500, 520]),
              height: 390,
              padding: "36px",
              boxSizing: "border-box",
              background: "#fff",
              color: "#15171e",
              borderRadius: 6,
              rotate: `${interpolate(spread, [0, 1], [0, slot.r])}deg`,
              scale: interpolate(spread, [0, 1], [1.1, 0.88]),
              boxShadow: "0 20px 55px rgba(42,30,20,.17)",
              zIndex: 10 - index,
            }}
          >
            <div style={{fontSize: 28, fontWeight: 950}}>{word}</div>
            <div style={{height: 4, width: 90, background: index % 2 ? props.secondaryColor : props.primaryColor, margin: "18px 0 28px"}} />
            {Array.from({length: 6}, (_, row) => (
              <div key={row} style={{height: 8, width: `${52 + ((row + index) % 4) * 10}%`, background: "#ded9d2", marginBottom: 14}} />
            ))}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 34,
          textAlign: "center",
          fontSize: 29,
          fontWeight: 900,
          opacity: spread,
          color: "#15171e",
        }}
      >
        {props.subtitle}
      </div>
    </Stage>
  );
};

const PageLeafCascade = ({
  props,
  frame,
}: {
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => (
  <Stage background={props.backgroundColor}>
    <div
      style={{
        position: "absolute",
        left: 410,
        top: 120,
        width: 1100,
        height: 820,
        perspective: 1800,
      }}
    >
      {Array.from({length: motion.pageleafcascade.pageCount}, (_, index) => {
        const start = 4 + index * motion.pageleafcascade.flipStagger;
        const isLast =
          motion.pageleafcascade.holdLastPage &&
          index === motion.pageleafcascade.pageCount - 1;
        const flip = isLast
          ? 0
          : interpolate(frame, [start, start + 18], [0, -180], {
              ...clamp,
              easing: Easing.inOut(Easing.cubic),
            });
        const pageContent = (isBack: boolean) => (
          <>
            <div
              style={{
                fontFamily: mono,
                color:
                  index % 2 ? props.secondaryColor : props.primaryColor,
              }}
            >
              PAGE {String(index + 1).padStart(2, "0")}
              {isBack ? " / ARCHIVE" : ""}
            </div>
            <div style={{fontSize: 58, fontWeight: 950, marginTop: 42}}>
              {isLast
                ? props.subtitle
                : props.words[index % props.words.length]}
            </div>
            <div
              style={{
                height: 4,
                width: 110,
                background:
                  index % 2 ? props.secondaryColor : props.primaryColor,
                margin: "30px 0",
              }}
            />
            {Array.from({length: 9}, (_, row) => (
              <div
                key={row}
                style={{
                  height: 10,
                  width: `${58 + (row % 4) * 9}%`,
                  background: "#d9d1c8",
                  marginBottom: 18,
                }}
              />
            ))}
          </>
        );
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              width: 540,
              height: 820,
              transformOrigin: "left center",
              transform: `rotateY(${flip}deg)`,
              transformStyle: "preserve-3d",
              zIndex: motion.pageleafcascade.pageCount - index,
            }}
          >
            {[false, true].map((isBack) => (
              <div
                key={String(isBack)}
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  rotate: isBack ? "y 180deg" : undefined,
                  background: props.paperColor,
                  color: "#15171e",
                  padding: "62px 54px",
                  boxSizing: "border-box",
                  borderLeft: "2px solid #c9bba9",
                  boxShadow: "0 24px 65px rgba(0,0,0,.28)",
                }}
              >
                {pageContent(isBack)}
              </div>
            ))}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 8,
          height: 820,
          background: "#9b8977",
          zIndex: 40,
        }}
      />
    </div>
  </Stage>
);

const EnvironmentScene = ({
  id,
  props,
  frame,
}: {
  id: TransitionBackgroundId;
  props: TransitionBackgroundSceneProps;
  frame: number;
}) => {
  switch (id) {
    case "rk028":
      return <Circuit props={props} frame={frame} />;
    case "rk029":
      return <Rings props={props} frame={frame} />;
    case "rk036":
      return <EyeScanner props={props} frame={frame} />;
    case "rk063":
      return <Waveform props={props} frame={frame} />;
    case "rk069":
      return <ParticleField props={props} frame={frame} stargazer />;
    case "rk080":
      return <ParticleField props={props} frame={frame} />;
    case "rk090":
      return <Visualizer props={props} frame={frame} />;
    case "rk093":
      return <MatrixRain props={props} frame={frame} />;
    case "rk131":
      return <Aurora props={props} frame={frame} />;
    default:
      return <Scanner props={props} frame={frame} />;
  }
};

export const TransitionBackgroundScene = (
  props: TransitionBackgroundSceneProps,
) => {
  const frame = useCurrentFrame();
  switch (props.variant) {
    case "transition":
      return <GlowTitle props={props} frame={frame} />;
    case "abilitypan":
      return <AbilityDeal props={props} frame={frame} />;
    case "abilitychapter":
      return <AbilityChapter props={props} frame={frame} />;
    case "dotmatrix":
      return <DotMatrix props={props} frame={frame} />;
    case "tornwipe":
      return <TornWipe props={props} frame={frame} />;
    case "chaptercard":
      return <ChapterCard props={props} frame={frame} />;
    case "rk028":
    case "rk029":
    case "rk036":
    case "rk063":
    case "rk069":
    case "rk080":
    case "rk090":
    case "rk093":
    case "rk131":
      return (
        <EnvironmentScene id={props.variant} props={props} frame={frame} />
      );
    case "rc023":
      return <SweepMask props={props} frame={frame} />;
    case "rc026":
      return <FluidSurface props={props} frame={frame} />;
    case "paperlift":
      return <PaperLift props={props} frame={frame} />;
    case "documentcascade":
      return <DocumentCascade props={props} frame={frame} />;
    case "pageleafcascade":
      return <PageLeafCascade props={props} frame={frame} />;
    default:
      return null;
  }
};
