import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS } from "../fonts";
import { getHardwareDispatchFastState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TILES = [
  { id: "NODE 01", label: "GPU / A", x: 822, y: 224, accent: "#d9ff43" },
  { id: "NODE 02", label: "NPU / B", x: 1166, y: 426, accent: "#69e8ff" },
  { id: "NODE 03", label: "CPU / C", x: 790, y: 654, accent: "#d9ff43" },
] as const;

const ComputeTile = ({
  fps,
  springFrame,
  tile,
}: {
  fps: number;
  springFrame: number;
  tile: (typeof TILES)[number];
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 18, stiffness: 175, mass: 0.68 },
    durationInFrames: 22,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: tile.x,
        top: tile.y,
        width: 430,
        height: 190,
        padding: "30px 34px",
        border: `2px solid ${tile.accent}`,
        background:
          "linear-gradient(135deg, rgba(31,39,34,.98), rgba(8,12,10,.98))",
        boxShadow: `0 0 36px ${tile.accent}2e, inset 0 0 44px ${tile.accent}12`,
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [120, 0])}px 0`,
        scale: interpolate(enter, [0, 1], [0.92, 1]),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: tile.accent,
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: 4,
        }}
      >
        <span>{tile.id}</span>
        <span>ONLINE</span>
      </div>
      <div
        style={{
          marginTop: 30,
          color: "#f3f6ef",
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        {tile.label}
      </div>
      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 5,
        }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            style={{
              height: 7,
              background: index < 9 ? tile.accent : "#29342e",
              boxShadow: index < 9 ? `0 0 8px ${tile.accent}66` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const HardwareDispatchFast = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getHardwareDispatchFastState(frame);
  const camera = interpolate(state.camera, [0, 1], [1, 1.055], CLAMP);
  const tileFrames = [
    state.tile1SpringFrame,
    state.tile2SpringFrame,
    state.tile3SpringFrame,
  ];

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#060908",
        color: "#f2f5ee",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: camera,
        }}
      >
        <AbsoluteFill
          style={{
            opacity: state.grid,
            backgroundImage:
              "radial-gradient(circle at 67% 48%, rgba(217,255,67,.09), transparent 34%), linear-gradient(rgba(105,232,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(105,232,255,.08) 1px, transparent 1px)",
            backgroundSize: "auto, 56px 56px, 56px 56px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 94,
            top: 78,
            width: 660,
            opacity: state.title,
            translate: `${interpolate(state.title, [0, 1], [-54, 0])}px 0`,
          }}
        >
          <div
            style={{
              color: "#69e8ff",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 7,
            }}
          >
            DISPATCH FIELD / PHASE 0{state.phaseIndex}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -4,
            }}
          >
            异构资源
            <br />
            <span style={{ color: "#d9ff43" }}>动态调度</span>
          </div>
          <div
            style={{
              marginTop: 34,
              width: 510,
              color: "#8c9992",
              fontSize: 21,
              lineHeight: 1.7,
              letterSpacing: 2,
            }}
          >
            实时解析任务负载，将计算请求映射到可用节点。
          </div>
        </div>

        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, opacity: state.routes }}
        >
          <path
            d="M636 532 H730 L840 318 H1006 M730 532 L860 748 H1008 M730 532 H1190"
            fill="none"
            stroke="#69e8ff"
            strokeWidth="3"
            strokeDasharray="12 12"
          />
          <circle cx="730" cy="532" r="11" fill="#d9ff43" />
          <circle cx="1190" cy="532" r="7" fill="#69e8ff" />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 656,
            top: 474,
            width: 150,
            height: 150,
            display: "grid",
            placeItems: "center",
            border: "2px solid #d9ff43",
            borderRadius: "50%",
            background: "#101612",
            color: "#d9ff43",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: 3,
            opacity: state.nodes,
            boxShadow: "0 0 42px rgba(217,255,67,.2)",
          }}
        >
          ROUTER
        </div>

        {TILES.map((tile, index) => (
          <ComputeTile
            key={tile.id}
            fps={fps}
            springFrame={tileFrames[index]}
            tile={tile}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: 94,
            bottom: 78,
            width: 660,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            borderTop: "1px solid rgba(105,232,255,.34)",
            opacity: state.metrics,
          }}
        >
          {[
            ["QUEUE", "24"],
            ["UTILIZATION", "86%"],
            ["THROUGHPUT", "1.8K/s"],
            ["LATENCY", "42ms"],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: "20px 8px" }}>
              <div style={{ color: "#69e8ff", fontSize: 14, letterSpacing: 4 }}>
                {label}
              </div>
              <div style={{ marginTop: 6, fontSize: 34, fontWeight: 800 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: interpolate(state.highlight, [0, 1], [-280, 1960]),
            width: 170,
            rotate: "-9deg",
            background:
              "linear-gradient(90deg, transparent, rgba(217,255,67,.16), transparent)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
