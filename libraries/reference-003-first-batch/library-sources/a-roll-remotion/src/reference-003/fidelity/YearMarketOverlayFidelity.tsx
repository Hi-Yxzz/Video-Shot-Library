import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { REFERENCE_003_AROLL_CLIPS } from "../aroll-clips";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getYearMarketOverlayFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MARKET_ROWS = [
  ["NORTH ARRAY", "NARY", "124.39", "−4.18", "−3.25%"],
  ["PINE LABS", "PINE", "91.72", "−2.46", "−2.61%"],
  ["VECTOR WORKS", "VCTR", "307.18", "+6.32", "+2.10%"],
  ["COMMON FIELD", "CMFD", "68.44", "−1.90", "−2.70%"],
] as const;

export const YearMarketOverlayFidelity = () => {
  const frame = useCurrentFrame();
  const state = getYearMarketOverlayFidelityState(frame);
  const clip = REFERENCE_003_AROLL_CLIPS.yearMarketOverlay;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#171615",
        color: "#f5eedb",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(state.camera, [0, 1], [1.03, 1.095], CLAMP),
          transformOrigin: "50% 48%",
        }}
      >
        <Video
          src={staticFile(clip.src)}
          muted
          trimBefore={clip.trimBefore}
          objectFit={clip.objectFit}
          style={{
            width: "100%",
            height: "100%",
            objectPosition: clip.objectPosition,
            transform: `scale(${clip.scale})`,
            opacity: state.video,
            filter: "saturate(.82) contrast(1.06) brightness(.84)",
          }}
        />

        <AbsoluteFill
          style={{
            opacity: state.video,
            background:
              "linear-gradient(90deg, rgba(20,16,12,.62), transparent 31%, transparent 69%, rgba(15,15,17,.58)), radial-gradient(circle at 50% 44%, transparent 20%, rgba(16,13,11,.25) 74%, rgba(8,7,7,.66) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 110,
            top: 126,
            width: 1700,
            height: 760,
            overflow: "hidden",
            opacity: state.market,
            translate: `0 ${interpolate(state.market, [0, 1], [66, 0], CLAMP)}px`,
            scale: interpolate(state.market, [0, 1], [0.94, 1], CLAMP),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderTop: "2px solid rgba(236,238,234,.54)",
              borderBottom: "2px solid rgba(236,238,234,.42)",
              background:
                "linear-gradient(90deg, rgba(238,239,235,.78), rgba(248,248,244,.93) 48%, rgba(239,238,234,.78))",
              boxShadow: "0 34px 80px rgba(0,0,0,.38)",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1.8fr .65fr .72fr .72fr .72fr",
              alignItems: "center",
              height: 92,
              padding: "0 42px",
              boxSizing: "border-box",
              borderBottom: "1px solid rgba(34,49,74,.3)",
              color: "#637086",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: 4,
            }}
          >
            <span>ENTITY</span>
            <span>CODE</span>
            <span>OPEN</span>
            <span>MOVE</span>
            <span>CHANGE</span>
          </div>
          {MARKET_ROWS.map(([name, code, price, move, change], index) => (
            <div
              key={code}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1.8fr .65fr .72fr .72fr .72fr",
                alignItems: "center",
                height: 150,
                padding: "0 42px",
                boxSizing: "border-box",
                borderBottom: "1px solid rgba(34,49,74,.21)",
                color: "#142342",
                fontSize: 36,
                fontWeight: 650,
                opacity: interpolate(
                  state.market,
                  [index * 0.14, Math.min(1, index * 0.14 + 0.48)],
                  [0, 1],
                  CLAMP,
                ),
              }}
            >
              <span style={{ fontWeight: 800, letterSpacing: -1 }}>{name}</span>
              <span style={{ color: "#45679d", fontSize: 26 }}>{code}</span>
              <span>{price}</span>
              <span
                style={{ color: move.startsWith("+") ? "#3d7e64" : "#a34e58" }}
              >
                {move}
              </span>
              <span
                style={{
                  color: change.startsWith("+") ? "#3d7e64" : "#b04d5a",
                  fontWeight: 800,
                }}
              >
                {change}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 154,
            top: 94,
            fontFamily: R03_SERIF,
            fontSize: 420,
            fontWeight: 600,
            lineHeight: 0.9,
            letterSpacing: -34,
            color: "#eee3c5",
            textShadow:
              "12px 14px 0 rgba(30,26,20,.42), 0 0 34px rgba(255,237,192,.3)",
            opacity: state.year * (1 - state.foreground * 0.88),
            translate: `${interpolate(state.year, [0, 1], [-120, 0], CLAMP)}px 0`,
            scale: interpolate(state.year, [0, 1], [0.86, 1], CLAMP),
            transformOrigin: "left center",
            mixBlendMode: "screen",
          }}
        >
          2030
        </div>
        <div
          style={{
            position: "absolute",
            right: 196,
            top: 406,
            color: "#e9ddbf",
            fontFamily: R03_SERIF,
            fontSize: 116,
            fontWeight: 600,
            opacity: state.year * (1 - state.foreground),
            translate: `${interpolate(state.year, [0, 1], [80, 0], CLAMP)}px 0`,
          }}
        >
          / 04
        </div>

        <div
          style={{
            position: "absolute",
            left: -120,
            right: -120,
            bottom: -72,
            height: 270,
            opacity: state.foreground,
            background:
              "linear-gradient(180deg, transparent, rgba(62,23,58,.28) 34%, rgba(20,18,47,.86) 100%)",
            filter: "blur(6px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 128,
            bottom: 76,
            color: "rgba(247,242,230,.8)",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 6,
            opacity: state.foreground,
          }}
        >
          MARKET FIELD / OPENING SIGNAL
        </div>
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            opacity: state.foreground * 0.34,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.3) .55px, transparent .8px), linear-gradient(90deg, rgba(255,70,70,.08), transparent 2%, transparent 98%, rgba(50,100,255,.09))",
            backgroundSize: "5px 5px, auto",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
