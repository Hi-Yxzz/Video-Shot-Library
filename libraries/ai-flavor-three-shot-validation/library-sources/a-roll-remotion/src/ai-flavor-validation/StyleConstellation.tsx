import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {getConstellationState, stageProgress} from "./motion";

const FONT = 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif';
const ACCENT = "#d6ff3a";

const STYLE_CARDS = [
  {
    label: "默认 AI 味",
    eyebrow: "DEFAULT",
    src: "ai-flavor-validation/styles/default-ai.png",
    x: 700,
    y: 42,
    width: 520,
    height: 246,
    rotate: -0.6,
    start: 4,
    fromX: 0,
    fromY: -160,
  },
  {
    label: "Swiss",
    eyebrow: "STYLE 01",
    src: "ai-flavor-validation/styles/swiss.png",
    x: 88,
    y: 270,
    width: 500,
    height: 250,
    rotate: -2.2,
    start: 16,
    fromX: -180,
    fromY: -30,
  },
  {
    label: "Glassmorphism",
    eyebrow: "STYLE 02",
    src: "ai-flavor-validation/styles/glassmorphism.png",
    x: 1332,
    y: 270,
    width: 500,
    height: 250,
    rotate: 2.1,
    start: 28,
    fromX: 180,
    fromY: -30,
  },
  {
    label: "Neubrutalism",
    eyebrow: "STYLE 03",
    src: "ai-flavor-validation/styles/neubrutalism.png",
    x: 176,
    y: 748,
    width: 500,
    height: 250,
    rotate: 1.8,
    start: 40,
    fromX: -160,
    fromY: 120,
  },
  {
    label: "Aurora",
    eyebrow: "STYLE 04",
    src: "ai-flavor-validation/styles/aurora.png",
    x: 1244,
    y: 748,
    width: 500,
    height: 250,
    rotate: -1.7,
    start: 52,
    fromX: 160,
    fromY: 120,
  },
] as const;

const EDGE_PATHS = [
  "M960 525 C960 430 960 370 960 286",
  "M790 555 C660 520 560 470 498 408",
  "M1130 555 C1260 520 1360 470 1422 408",
  "M820 650 C700 720 610 785 520 850",
  "M1100 650 C1220 720 1310 785 1400 850",
] as const;

export const StyleConstellation = () => {
  const frame = useCurrentFrame();
  const state = getConstellationState(frame);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 48%, #1a241a 0%, #0c120d 46%, #050806 100%)",
        color: "#f2efe6",
        fontFamily: FONT,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.34,
          backgroundImage:
            "linear-gradient(rgba(214,255,58,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(214,255,58,.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <AbsoluteFill
        style={{
          scale: 1.035 - state.camera * 0.035,
          translate: `0px ${-10 * state.camera}px`,
          transformOrigin: "50% 50%",
        }}
      >
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{position: "absolute", inset: 0}}
        >
          {EDGE_PATHS.map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="rgba(214,255,58,.76)"
              strokeWidth="3"
              strokeDasharray="1"
              strokeDashoffset={1 - state.edges}
              pathLength="1"
            />
          ))}
          {EDGE_PATHS.map((path) => (
            <path
              key={`${path}-glow`}
              d={path}
              fill="none"
              stroke="rgba(214,255,58,.13)"
              strokeWidth="16"
              strokeDasharray="1"
              strokeDashoffset={1 - state.edges}
              pathLength="1"
            />
          ))}
        </svg>

        {STYLE_CARDS.map((card, index) => {
          const reveal = stageProgress(frame, card.start, card.start + 30);
          return (
            <div
              key={card.label}
              style={{
                position: "absolute",
                left: card.x,
                top: card.y,
                width: card.width,
                height: card.height,
                rotate: `${card.rotate}deg`,
                translate: `${card.fromX * (1 - reveal)}px ${card.fromY * (1 - reveal)}px`,
                scale: interpolate(reveal, [0, 1], [0.82, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                }),
                opacity: reveal,
                background: "#111712",
                border: index === 0 ? `3px solid ${ACCENT}` : "1px solid #4c574c",
                boxShadow:
                  index === 0
                    ? "0 0 54px rgba(214,255,58,.2), 0 28px 70px rgba(0,0,0,.48)"
                    : "0 24px 56px rgba(0,0,0,.48)",
                overflow: "hidden",
              }}
            >
              <CanvasImage
                src={staticFile(card.src)}
                style={{
                  width: "100%",
                  height: card.height - 62,
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 62,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 22px",
                  background: index === 0 ? ACCENT : "#111712",
                  color: index === 0 ? "#0a0d09" : "#f1eee4",
                  borderTop: "1px solid rgba(255,255,255,.16)",
                }}
              >
                <span style={{fontSize: 17, fontWeight: 800, letterSpacing: 3}}>
                  {card.eyebrow}
                </span>
                <span style={{fontSize: 30, fontWeight: 800}}>{card.label}</span>
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 760,
            top: 476,
            width: 400,
            height: 188,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1eee3",
            color: "#0a0d09",
            border: `5px solid ${ACCENT}`,
            borderRadius: 94,
            boxShadow: "0 0 0 15px rgba(214,255,58,.08), 0 30px 80px rgba(0,0,0,.52)",
            opacity: state.center,
            scale: 0.68 + state.center * 0.32,
          }}
        >
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 5}}>
            MEETFLOW · SAME PRODUCT
          </div>
          <div style={{marginTop: 10, fontSize: 58, fontWeight: 900}}>
            同一个页面
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 510,
            top: 672,
            width: 900,
            padding: "18px 30px",
            background: "rgba(6,10,7,.9)",
            borderTop: `2px solid ${ACCENT}`,
            borderBottom: `2px solid ${ACCENT}`,
            textAlign: "center",
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: 2,
            whiteSpace: "nowrap",
            opacity: state.summary,
            translate: `0px ${(1 - state.summary) * 26}px`,
          }}
        >
          功能、文案、结构不变，只换风格词
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 46,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 6,
          color: ACCENT,
        }}
      >
        VISUAL LANGUAGE EXPERIMENT · 05 STYLES
      </div>
    </AbsoluteFill>
  );
};
