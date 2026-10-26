import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getTeamRelationshipGraphFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Portrait = ({ tone }: { tone: "blue" | "amber" }) => (
  <div
    style={{
      position: "relative",
      width: 74,
      height: 74,
      overflow: "hidden",
      borderRadius: "50%",
      border: "1px solid rgba(72,77,78,.3)",
      background:
        tone === "blue"
          ? "linear-gradient(145deg, #c4d1d2, #7d9298)"
          : "linear-gradient(145deg, #e6d5ba, #ad9474)",
      boxShadow: "-12px 14px 22px rgba(58,54,48,.14)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 23,
        top: 13,
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: tone === "blue" ? "#596c72" : "#79644d",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 13,
        bottom: -16,
        width: 48,
        height: 48,
        borderRadius: "48% 48% 18% 18%",
        background: tone === "blue" ? "#667b81" : "#8b7358",
      }}
    />
  </div>
);

const PersonNode = ({
  fps,
  springFrame,
  progress,
  labelProgress,
  left,
  top,
  name,
  role,
  tone,
}: {
  fps: number;
  springFrame: number;
  progress: number;
  labelProgress: number;
  left: number;
  top: number;
  name: string;
  role: string;
  tone: "blue" | "amber";
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 24, stiffness: 86, mass: 0.92 },
    durationInFrames: 42,
  });

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 520,
        height: 128,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 30px",
        boxSizing: "border-box",
        border: "1px solid rgba(78,82,82,.26)",
        borderRadius: 64,
        background: "rgba(250,248,242,.78)",
        boxShadow: "-22px 24px 38px rgba(67,62,54,.12)",
        opacity: progress,
        scale: interpolate(enter, [0, 1], [0.78, 1], CLAMP),
        translate: `${interpolate(enter, [0, 1], [0, left < 900 ? -22 : 22], CLAMP)}px ${interpolate(enter, [0, 1], [24, 0], CLAMP)}px`,
      }}
    >
      <Portrait tone={tone} />
      <div style={{ minWidth: 0, opacity: labelProgress }}>
        <div
          style={{
            color: "#25292a",
            fontFamily: R03_SERIF,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: 7,
            color: tone === "blue" ? "#647c83" : "#9a7955",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          {role}
        </div>
      </div>
      <div
        style={{
          marginLeft: "auto",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: tone === "blue" ? "#789098" : "#b48b5d",
          boxShadow: `0 0 0 8px ${tone === "blue" ? "rgba(120,144,152,.12)" : "rgba(180,139,93,.12)"}`,
        }}
      />
    </div>
  );
};

export const TeamRelationshipGraphFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getTeamRelationshipGraphFidelityState(frame);
  const edgeLength = 820;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#eeeae1",
        color: "#25292a",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(state.camera, [0, 1], [1, 1.055], CLAMP),
          transformOrigin: "50% 52%",
          backgroundImage:
            "radial-gradient(ellipse at 50% 45%, #fbfaf5 0%, #eeeae1 67%, #d4d0c7 100%), radial-gradient(rgba(69,64,57,.15) .55px, transparent .78px)",
          backgroundSize: "auto, 6px 6px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 146,
            top: 88,
            color: "#6f7474",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 6,
            opacity: state.primaryNodes,
          }}
        >
          TEAM MAP / COLLABORATION LINES
        </div>
        <div
          style={{
            position: "absolute",
            left: 146,
            top: 126,
            fontFamily: R03_SERIF,
            fontSize: 58,
            fontWeight: 600,
            letterSpacing: -2,
            opacity: state.primaryNodes,
            translate: `0 ${interpolate(state.primaryNodes, [0, 1], [22, 0], CLAMP)}px`,
          }}
        >
          从两组角色，到一张协作网络
        </div>

        <svg
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <path
            d="M 690 365 C 840 365, 850 710, 1068 710"
            fill="none"
            stroke="rgba(87,92,92,.5)"
            strokeWidth="2"
            strokeDasharray={edgeLength}
            strokeDashoffset={edgeLength * (1 - state.edges)}
          />
          <path
            d="M 690 710 C 866 710, 872 365, 1068 365"
            fill="none"
            stroke="rgba(87,92,92,.5)"
            strokeWidth="2"
            strokeDasharray={edgeLength}
            strokeDashoffset={edgeLength * (1 - state.edges)}
          />
          <path
            d="M 690 365 C 840 365, 880 365, 1068 365"
            fill="none"
            stroke="rgba(87,92,92,.24)"
            strokeWidth="1.5"
            strokeDasharray={edgeLength}
            strokeDashoffset={edgeLength * (1 - state.edges)}
          />
          <path
            d="M 690 710 C 842 710, 880 710, 1068 710"
            fill="none"
            stroke="rgba(87,92,92,.24)"
            strokeWidth="1.5"
            strokeDasharray={edgeLength}
            strokeDashoffset={edgeLength * (1 - state.edges)}
          />
          {[365, 710].map((y) => (
            <g key={y} opacity={state.edges}>
              <circle cx="960" cy={y} r="8" fill="#f7f4ed" stroke="#747a79" />
              <circle cx="960" cy={y} r="3" fill="#747a79" />
            </g>
          ))}
        </svg>

        <PersonNode
          fps={fps}
          springFrame={state.node1SpringFrame}
          progress={state.primaryNodes}
          labelProgress={state.labels}
          left={170}
          top={301}
          name="林序"
          role="SYSTEMS / RESEARCH"
          tone="blue"
        />
        <PersonNode
          fps={fps}
          springFrame={state.node2SpringFrame}
          progress={state.primaryNodes}
          labelProgress={state.labels}
          left={1230}
          top={301}
          name="乔安"
          role="PRODUCT / STRATEGY"
          tone="amber"
        />
        <PersonNode
          fps={fps}
          springFrame={state.node3SpringFrame}
          progress={state.secondaryNodes}
          labelProgress={state.labels}
          left={170}
          top={646}
          name="陈屿"
          role="ENGINEERING / DELIVERY"
          tone="amber"
        />
        <PersonNode
          fps={fps}
          springFrame={state.node4SpringFrame}
          progress={state.secondaryNodes}
          labelProgress={state.labels}
          left={1230}
          top={646}
          name="白澄"
          role="DESIGN / OPERATIONS"
          tone="blue"
        />

        <div
          style={{
            position: "absolute",
            left: 786,
            top: 480,
            width: 348,
            padding: "22px 28px",
            boxSizing: "border-box",
            border: "1px solid rgba(67,72,72,.28)",
            borderRadius: 4,
            background: "rgba(245,242,235,.9)",
            boxShadow: "-18px 20px 28px rgba(66,61,54,.1)",
            textAlign: "center",
            opacity: state.labels,
            translate: `0 ${interpolate(state.labels, [0, 1], [18, 0], CLAMP)}px`,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 5 }}>
            SHARED CONTEXT
          </div>
          <div
            style={{
              marginTop: 9,
              color: "#777c7b",
              fontSize: 19,
              letterSpacing: 2,
            }}
          >
            目标 · 反馈 · 决策
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
