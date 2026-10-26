import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {getAdvancedAmbiguityState, stageProgress} from "./motion";

const SANS = '"PingFang SC", "Microsoft YaHei", sans-serif';
const SERIF = '"Songti SC", "STSong", serif';

const OPTIONS = [
  {label: "干净克制？", x: 140, y: 180, rotate: -4},
  {label: "大牌留白？", x: 400, y: 340, rotate: 2},
  {label: "深色科技？", x: 1170, y: 340, rotate: -2},
  {label: "柔和氛围？", x: 1380, y: 190, rotate: 4},
] as const;

const PaperNoise = () => (
  <AbsoluteFill
    style={{
      opacity: 0.24,
      backgroundImage:
        "repeating-linear-gradient(4deg, transparent 0 15px, rgba(38,32,25,.05) 16px, transparent 18px), radial-gradient(circle at 22% 38%, rgba(89,68,39,.15) 0 1px, transparent 2px), radial-gradient(circle at 77% 63%, rgba(89,68,39,.12) 0 1px, transparent 2px)",
      backgroundSize: "auto, 23px 23px, 31px 31px",
    }}
  />
);

const FileTab = ({label, side}: {label: string; side: "left" | "right"}) => (
  <div
    style={{
      position: "absolute",
      top: side === "left" ? 184 : 220,
      left: side === "left" ? 120 : 1450,
      width: 346,
      height: 600,
      rotate: side === "left" ? "-4deg" : "3deg",
      background: side === "left" ? "#d59f42" : "#e5bd67",
      border: "2px solid rgba(42,34,25,.55)",
      boxShadow: "-24px 28px 40px rgba(39,31,23,.22)",
      clipPath:
        "polygon(0 8%, 28% 8%, 34% 0, 68% 0, 73% 8%, 100% 8%, 100% 100%, 0 100%)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 28,
        right: 28,
        top: 84,
        borderTop: "2px solid rgba(55,43,28,.42)",
        paddingTop: 22,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: 4,
        color: "#30281f",
      }}
    >
      {label}
    </div>
  </div>
);

export const AdvancedAmbiguity = () => {
  const frame = useCurrentFrame();
  const state = getAdvancedAmbiguityState(frame);
  const tableauOpacity = 1 - state.question;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#aaa9a1",
        color: "#1c1915",
        fontFamily: SANS,
      }}
    >
      <PaperNoise />
      <AbsoluteFill
        style={{
          scale: 1 + state.camera * 0.08,
          translate: `${-30 * state.camera}px ${8 * state.camera}px`,
          transformOrigin: "50% 52%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 54,
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: 7,
            opacity: 0.72 * tableauOpacity,
          }}
        >
          VAGUE BRIEF · 01
        </div>

        <div
          style={{
            opacity: state.tableau * tableauOpacity,
            translate: `${(1 - state.tableau) * -80}px 0px`,
          }}
        >
          <FileTab label="模糊需求" side="left" />
          <FileTab label="可能解释" side="right" />
        </div>

        <div
          style={{
            position: "absolute",
            left: 504,
            top: 90,
            width: 912,
            height: 850,
            rotate: "-0.8deg",
            background: "#e9e2d2",
            border: "2px solid rgba(39,33,27,.48)",
            boxShadow: "-34px 42px 70px rgba(40,34,27,.28)",
            opacity: state.tableau * tableauOpacity,
          }}
        >
          <PaperNoise />
          <div
            style={{
              position: "absolute",
              left: 48,
              top: 40,
              padding: "10px 18px",
              background: "#1f1b17",
              color: "#eee5d5",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 4,
            }}
          >
            USER REQUEST
          </div>
          <div
            style={{
              position: "absolute",
              left: 66,
              right: 66,
              top: 112,
              borderTop: "3px solid #2b2721",
              paddingTop: 30,
              textAlign: "center",
              fontFamily: SERIF,
              fontSize: 64,
              lineHeight: 1.22,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            “帮我做一个高级界面”
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 230,
            top: 420,
            width: 450,
            height: 600,
            opacity: state.people * tableauOpacity,
            translate: `${(1 - state.people) * -90}px ${(1 - state.people) * 60}px`,
            filter: "drop-shadow(-18px 28px 22px rgba(38,31,25,.26))",
          }}
        >
          <CanvasImage
            src={staticFile("ai-flavor-validation/vox/ai-assistant.png")}
            style={{width: "100%", height: "100%", objectFit: "contain"}}
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: 220,
            top: 500,
            width: 650,
            height: 430,
            opacity: state.people * tableauOpacity,
            translate: `${(1 - state.people) * 90}px ${(1 - state.people) * 45}px`,
            filter: "drop-shadow(-16px 26px 22px rgba(38,31,25,.23))",
          }}
        >
          <CanvasImage
            src={staticFile("ai-flavor-validation/objects/monitor.png")}
            style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 15,
              top: 10,
              height: 326,
              overflow: "hidden",
              borderRadius: 10,
              background: "#151519",
            }}
          >
            <CanvasImage
              src={staticFile("ai-flavor-validation/styles/default-ai.png")}
              style={{width: "100%", height: "100%", objectFit: "cover"}}
            />
          </div>
        </div>

        {OPTIONS.map((option, index) => {
          const reveal = stageProgress(frame, 62 + index * 12, 82 + index * 12);
          return (
            <div
              key={option.label}
              style={{
                position: "absolute",
                left: option.x,
                top: option.y,
                minWidth: 290,
                padding: "24px 32px 26px",
                background: index % 2 === 0 ? "#dfaa4d" : "#f0cf80",
                border: "2px solid #302820",
                boxShadow: "-16px 20px 28px rgba(36,29,21,.2)",
                rotate: `${option.rotate}deg`,
                opacity: reveal * tableauOpacity,
                translate: `0px ${(1 - reveal) * 42}px`,
                scale: 0.86 + reveal * 0.14,
                fontFamily: SERIF,
                fontSize: 40,
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              {option.label}
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 190,
            right: 190,
            top: 155,
            bottom: 130,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: state.question,
            translate: `0px ${(1 - state.question) * 70}px`,
            scale: interpolate(state.question, [0, 1], [0.84, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              background: "#c2701f",
              color: "#fff6e8",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 6,
            }}
          >
            THE REAL QUESTION
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: SERIF,
              fontSize: 126,
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: -5,
              textAlign: "center",
              textShadow: "-8px 12px 0 rgba(255,255,255,.25)",
            }}
          >
            <div>你说的“高级”</div>
            <div>到底是哪一种？</div>
          </div>
          <div
            style={{
              width: 690,
              height: 8,
              marginTop: 24,
              background: "#c2701f",
              scale: `${state.question} 1`,
            }}
          />
          <div
            style={{
              marginTop: 36,
              padding: "18px 38px",
              background: "#1e1b17",
              color: "#f2e9da",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: 3,
              opacity: state.conclusion,
              translate: `0px ${(1 - state.conclusion) * 28}px`,
            }}
          >
            “高级”是感觉，不是指令
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
