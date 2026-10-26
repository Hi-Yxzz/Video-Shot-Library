import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS } from "../fonts";
import { getMetalComputeArrayFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ComputeBlock = ({
  fps,
  springFrame,
  left,
  top,
  scale,
  label,
  load,
}: {
  fps: number;
  springFrame: number;
  left: number;
  top: number;
  scale: number;
  label: string;
  load: string;
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 24, stiffness: 112, mass: 1.08 },
    durationInFrames: 46,
  });
  const gradientId = label.toLowerCase().replace(/\s/g, "-");

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 660,
        height: 390,
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [180, 0])}px ${interpolate(enter, [0, 1], [-120, 0])}px`,
        scale: interpolate(enter, [0, 1], [scale * 0.82, scale]),
        filter: "drop-shadow(-28px 46px 28px rgba(0,0,0,.72))",
      }}
    >
      <svg width="660" height="390" viewBox="0 0 660 390">
        <defs>
          <linearGradient id={`top-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#272a2a" />
            <stop offset="0.48" stopColor="#8a7b65" />
            <stop offset="0.7" stopColor="#353536" />
            <stop offset="1" stopColor="#17191b" />
          </linearGradient>
          <linearGradient id={`face-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#111315" />
            <stop offset="0.58" stopColor="#37332d" />
            <stop offset="1" stopColor="#171719" />
          </linearGradient>
        </defs>
        <polygon
          points="76,138 478,54 598,118 190,206"
          fill={`url(#top-${gradientId})`}
          stroke="#a38c69"
          strokeWidth="2"
        />
        <polygon
          points="190,206 598,118 598,226 190,318"
          fill={`url(#face-${gradientId})`}
          stroke="#77664e"
          strokeWidth="2"
        />
        <polygon
          points="76,138 190,206 190,318 76,248"
          fill="#0b0d0e"
          stroke="#574d40"
          strokeWidth="2"
        />
        {Array.from({ length: 15 }, (_, index) => (
          <path
            key={index}
            d={`M${212 + index * 24} ${218 - index * 5.2} L${212 + index * 24} ${296 - index * 5.2}`}
            stroke={index % 4 === 0 ? "#b89b6d" : "#51483b"}
            strokeWidth={index % 4 === 0 ? 7 : 4}
          />
        ))}
        <path
          d="M92 153 L473 74 L560 119"
          fill="none"
          stroke="#f2dec1"
          strokeWidth="4"
          opacity="0.78"
        />
        <path
          d="M104 169 L480 91"
          fill="none"
          stroke="#d6a45d"
          strokeWidth="2"
          opacity="0.9"
        />
        <text
          x="328"
          y="151"
          fill="#e3d5c1"
          fontFamily={R03_SANS}
          fontSize="20"
          fontWeight="700"
          letterSpacing="5"
          transform="rotate(-11 328 151)"
        >
          {label}
        </text>
        <text
          x="438"
          y="220"
          fill="#d6a45d"
          fontFamily={R03_SANS}
          fontSize="15"
          fontWeight="700"
          letterSpacing="3"
          transform="rotate(-12 438 220)"
        >
          {load}
        </text>
      </svg>
    </div>
  );
};

export const MetalComputeArrayFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getMetalComputeArrayFidelityState(frame);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#090a0b",
        color: "#e9e2d8",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(state.camera, [0, 1], [0.96, 1.2], CLAMP),
          translate: `${interpolate(state.camera, [0, 1], [34, -72], CLAMP)}px ${interpolate(state.camera, [0, 1], [-18, 46], CLAMP)}px`,
          transformOrigin: "54% 48%",
        }}
      >
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(circle at 54% 45%, rgba(195,161,112,.22), transparent 33%), radial-gradient(rgba(255,231,198,.08) .7px, transparent .9px)",
            backgroundSize: "auto, 5px 5px",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 330,
            top: 238,
            color: "#26282a",
            fontSize: 440,
            fontWeight: 900,
            letterSpacing: -34,
            lineHeight: 0.8,
            opacity: state.blocks,
            rotate: "-4deg",
            textShadow: "0 0 1px #82735f",
          }}
        >
          CORE
        </div>

        <div style={{ opacity: state.blocks }}>
          <ComputeBlock
            fps={fps}
            springFrame={state.block1SpringFrame}
            left={478}
            top={312}
            scale={1.22}
            label="ARRAY 04"
            load="LOAD 72"
          />
          <ComputeBlock
            fps={fps}
            springFrame={state.block2SpringFrame}
            left={1080}
            top={70}
            scale={0.72}
            label="ARRAY 07"
            load="LOAD 48"
          />
          <ComputeBlock
            fps={fps}
            springFrame={state.block3SpringFrame}
            left={20}
            top={672}
            scale={0.78}
            label="ARRAY 11"
            load="LOAD 64"
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: -180,
            opacity: state.edgeLight,
            background:
              "linear-gradient(124deg, transparent 38%, rgba(255,225,180,.2) 49%, transparent 57%)",
            mixBlendMode: "screen",
            translate: `${interpolate(state.edgeLight, [0, 1], [-420, 360], CLAMP)}px 0`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 126,
            top: 120,
            opacity: state.labels,
            color: "#c9a56e",
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 5,
            lineHeight: 1.8,
          }}
        >
          COMPUTE FIELD / 04
          <br />
          PARALLEL CAPACITY
        </div>

        {[
          { left: -210, top: -34, rotate: -8 },
          { left: 340, top: -170, rotate: -11 },
          { left: 1250, top: -160, rotate: -7 },
          { left: 1510, top: 610, rotate: -12 },
          { left: 550, top: 920, rotate: -9 },
        ].map((block, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: block.left,
              top: block.top,
              width: 520,
              height: 170,
              opacity: interpolate(state.depth, [0, 1], [0.18, 0.72], CLAMP),
              rotate: `${block.rotate}deg`,
              background:
                "repeating-linear-gradient(90deg, #191b1d 0 28px, #695d4d 29px 35px, #0b0c0d 36px 58px)",
              border: "1px solid #79684f",
              boxShadow: "0 34px 44px rgba(0,0,0,.7)",
              filter: `blur(${interpolate(state.depth, [0, 1], [2, 7], CLAMP)}px)`,
            }}
          />
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,.68) 100%)",
          boxShadow: "inset 0 0 120px rgba(0,0,0,.75)",
        }}
      />
    </AbsoluteFill>
  );
};
