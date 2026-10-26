import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getHardwareDispatchFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ComputeModule = ({
  fps,
  springFrame,
  left,
  top,
  label,
}: {
  fps: number;
  springFrame: number;
  left: number;
  top: number;
  label: string;
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 24, stiffness: 105, mass: 1.04 },
    durationInFrames: 44,
  });
  const id = label.replace(/ /g, "-").toLowerCase();

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 650,
        height: 320,
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [260, 0])}px ${interpolate(enter, [0, 1], [-72, 0])}px`,
        scale: interpolate(enter, [0, 1], [0.9, 1]),
        filter: "drop-shadow(0 28px 34px rgba(0,0,0,.82))",
      }}
    >
      <svg viewBox="0 0 700 320" width="650" height="320">
        <defs>
          <linearGradient id={`top-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d7c5aa" />
            <stop offset="0.18" stopColor="#766957" />
            <stop offset="0.55" stopColor="#2f2d2c" />
            <stop offset="1" stopColor="#9a8364" />
          </linearGradient>
          <linearGradient id={`face-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4b4540" />
            <stop offset="0.12" stopColor="#1d1e20" />
            <stop offset="0.72" stopColor="#0c0d0f" />
            <stop offset="1" stopColor="#292522" />
          </linearGradient>
          <linearGradient id={`edge-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2d2824" />
            <stop offset="0.52" stopColor="#b39a77" />
            <stop offset="1" stopColor="#4b4034" />
          </linearGradient>
        </defs>
        <polygon
          points="90,94 536,34 624,94 176,156"
          fill={`url(#top-${id})`}
          stroke="#d3b98f"
          strokeWidth="1.4"
        />
        <polygon
          points="176,156 624,94 624,222 176,286"
          fill={`url(#face-${id})`}
          stroke="#a88c65"
          strokeWidth="1.4"
        />
        <polygon
          points="90,94 176,156 176,286 90,224"
          fill="#121315"
          stroke="#806d55"
          strokeWidth="1.4"
        />
        <polygon
          points="624,94 660,116 660,205 624,222"
          fill={`url(#edge-${id})`}
          stroke="#8a765b"
          strokeWidth="1.2"
        />
        <path
          d="M108 216 L108 274 L140 296 L159 290 L159 248"
          fill="none"
          stroke="#a79072"
          strokeWidth="7"
        />
        <path
          d="M194 175 L596 120 M194 191 L596 136 M194 260 L596 205"
          stroke="#8c7658"
          strokeWidth="2"
          opacity="0.78"
        />
        <path
          d="M204 210 L560 160 M204 224 L560 174 M204 238 L560 188"
          stroke="#403a33"
          strokeWidth="5"
          opacity="0.9"
        />
        <circle cx="127" cy="181" r="22" fill="#08090a" stroke="#8b7456" />
        <circle cx="127" cy="181" r="9" fill="#c5a77c" opacity="0.7" />
        <text
          x="474"
          y="158"
          fill="#e3d6c4"
          fontFamily={R03_SANS}
          fontSize="15"
          fontWeight="700"
          letterSpacing="3"
          transform="rotate(-7 474 158)"
        >
          {label}
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 152,
          top: 64,
          width: 410,
          height: 38,
          rotate: "-7deg",
          clipPath: "polygon(4% 12%, 97% 0, 100% 77%, 0 100%)",
          background:
            "repeating-linear-gradient(90deg, rgba(242,225,199,.92) 0 2px, rgba(72,64,54,.8) 2px 7px)",
          boxShadow: "0 0 20px rgba(255,210,150,.48)",
        }}
      />
    </div>
  );
};

const SpecTable = ({
  rows,
  accent,
}: {
  rows: readonly (readonly [string, string])[];
  accent: string;
}) => (
  <div style={{ marginTop: 18, borderTop: `1px solid ${accent}88` }}>
    {rows.map(([label, value], index) => (
      <div
        key={label}
        style={{
          display: "grid",
          gridTemplateColumns: "210px 1fr",
          alignItems: "center",
          minHeight: 58,
          borderBottom: `1px solid ${accent}55`,
          fontSize: 21,
        }}
      >
        <span style={{ color: "#b6afa6", fontWeight: 600 }}>{label}</span>
        <span
          style={{
            color: index === 0 ? "#f2ede5" : accent,
            fontWeight: 600,
          }}
        >
          {value}
        </span>
      </div>
    ))}
  </div>
);

export const HardwareDispatchFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getHardwareDispatchFidelityState(frame);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#050505",
        color: "#f6f3ed",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(state.camera, [0, 1], [1, 1.13], CLAMP),
          transformOrigin: "66% 51%",
        }}
      >
        <AbsoluteFill
          style={{
            opacity: state.amberCopy,
            backgroundImage:
              "radial-gradient(ellipse at 52% 50%, rgba(113,76,39,.19), transparent 52%), radial-gradient(rgba(255,226,184,.08) .6px, transparent .85px)",
            backgroundSize: "auto, 5px 5px",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 92,
            top: 154,
            width: 610,
            opacity: state.amberCopy,
            translate: `${interpolate(state.amberCopy, [0, 1], [-64, 0])}px 0`,
            zIndex: 2,
          }}
        >
          <div
            style={{
              color: "#d8aa67",
              fontFamily: R03_SERIF,
              fontSize: 70,
              fontWeight: 600,
              letterSpacing: -3,
              textShadow: "0 0 26px rgba(219,164,84,.35)",
            }}
          >
            原生模块调度
          </div>
          <SpecTable
            accent="#d3a15e"
            rows={[
              ["任务分配", "32 条并行队列"],
              ["调度层级", "统一资源控制"],
              ["负载调整", "静态容量分配"],
              ["数据依赖", "完成后继续执行"],
            ]}
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: state.bars,
            translate: `${interpolate(state.bars, [0, 1], [130, 0]) + interpolate(state.nearBar, [0, 1], [0, -150])}px 0`,
            scale: interpolate(state.nearBar, [0, 1], [1, 1.13], CLAMP),
            transformOrigin: "52% 50%",
            zIndex: 3,
          }}
        >
          <ComputeModule
            fps={fps}
            springFrame={state.bar1SpringFrame}
            left={635}
            top={154}
            label="MODULE A"
          />
          <ComputeModule
            fps={fps}
            springFrame={state.bar2SpringFrame}
            left={720}
            top={400}
            label="MODULE B"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 1190,
            top: 392,
            width: 650,
            opacity: state.whiteTitle,
            translate: `${interpolate(state.whiteTitle, [0, 1], [120, 0])}px 0`,
            zIndex: 4,
          }}
        >
          <div
            style={{
              fontFamily: R03_SERIF,
              fontSize: 70,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: -4,
              textShadow: "0 0 30px rgba(255,255,255,.23)",
            }}
          >
            模块化并行调度
          </div>
          <div
            style={{
              marginTop: 12,
              color: "#8fa6d7",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 5,
            }}
          >
            MODULAR ARRAY / PARALLEL CONTROL
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 1190,
            top: 570,
            width: 640,
            opacity: state.parameters,
            translate: `0 ${interpolate(state.parameters, [0, 1], [46, 0])}px`,
            zIndex: 4,
          }}
        >
          <SpecTable
            accent="#7f98d3"
            rows={[
              ["任务分配", "按负载动态分片"],
              ["调度层级", "局部队列直接控制"],
              ["负载调整", "计算与传输并行"],
              ["数据依赖", "事件驱动持续执行"],
            ]}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 94,
            bottom: 54,
            color: "#75614a",
            fontSize: 13,
            letterSpacing: 5,
            opacity: state.nearBar,
          }}
        >
          DEPTH PASS / 0{state.phaseIndex}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
