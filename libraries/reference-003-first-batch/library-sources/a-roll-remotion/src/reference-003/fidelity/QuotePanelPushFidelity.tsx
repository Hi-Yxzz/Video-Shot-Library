import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getQuotePanelPushFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const QuotePanelPushFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getQuotePanelPushFidelityState(frame);
  const panelOpen = spring({
    frame: state.panelSpringFrame,
    fps,
    config: { damping: 23, stiffness: 88, mass: 1.08 },
    durationInFrames: 48,
  });
  const cameraScale = interpolate(state.camera, [0, 1], [1, 1.055], CLAMP);
  const macroScale = interpolate(state.macroQuote, [0, 1], [1, 2.12], CLAMP);
  const macroShift = interpolate(state.macroQuote, [0, 1], [0, -286], CLAMP);
  const panelFade = interpolate(state.macroQuote, [0, 0.74, 1], [1, 1, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#e9e5dd",
        color: "#292724",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: cameraScale,
          transformOrigin: "50% 48%",
          backgroundImage:
            "radial-gradient(ellipse at 50% 44%, #fffefa 0%, #f4f1eb 62%, #d7d2ca 100%), radial-gradient(rgba(59,53,46,.14) .55px, transparent .8px)",
          backgroundSize: "auto, 6px 6px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 826,
            top: 112,
            width: 268,
            height: 12,
            borderRadius: 9,
            background: "#292724",
            opacity: (1 - state.panel) * state.frame,
            boxShadow: `-30px 28px 30px rgba(68,60,52,${0.08 + state.shadow * 0.2})`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 112,
            top: 88,
            width: 1696,
            height: 886,
            overflow: "hidden",
            border: `3px solid rgba(42,39,36,${state.frame})`,
            borderRadius: 30,
            background: "rgba(255,254,249,.58)",
            boxShadow: `-42px 40px 54px rgba(68,60,52,${0.04 + state.shadow * 0.2})`,
            opacity: state.panel * panelFade,
            scale: `${interpolate(panelOpen, [0, 1], [0.12, 1])} ${interpolate(panelOpen, [0, 1], [0.018, 1])}`,
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 58,
              textAlign: "center",
              color: "#817a72",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 8,
              opacity: state.frame,
            }}
          >
            PROJECT NOTE / 2026
          </div>

          <div
            style={{
              position: "absolute",
              left: 142,
              top: 234,
              width: 116,
              height: 116,
              border: "2px solid #34312d",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 37%, #736d64 0 18%, transparent 19%), radial-gradient(ellipse at 50% 108%, #90877b 0 44%, transparent 45%), #e7e1d8",
              opacity: state.quote,
              boxShadow: `-30px 30px 34px rgba(61,54,47,${0.08 + state.shadow * 0.16})`,
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 286,
              top: 242,
              minWidth: 930,
              height: 100,
              display: "flex",
              alignItems: "center",
              padding: "0 44px",
              borderRadius: "8px 22px 22px 8px",
              background: "#242321",
              color: "#f9f6ef",
              fontFamily: R03_SERIF,
              fontSize: 48,
              fontWeight: 600,
              letterSpacing: 1,
              opacity: state.quote,
              clipPath: `inset(0 ${(1 - state.quote) * 100}% 0 0)`,
              boxShadow: `-34px 32px 38px rgba(58,51,44,${0.08 + state.shadow * 0.2})`,
            }}
          >
            把复杂问题，变成清晰行动
            <span style={{ marginLeft: 18, color: "#d5962f" }}>。</span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 144,
              right: 144,
              bottom: 116,
              display: "flex",
              justifyContent: "space-between",
              color: "#777068",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 5,
              opacity: state.quote,
            }}
          >
            <span>OBSERVE / ALIGN / ACT</span>
            <span>MEMBER 01</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 118,
            top: 388,
            width: 1680,
            height: 230,
            display: "flex",
            alignItems: "center",
            padding: "0 76px",
            borderRadius: 24,
            background: "#242321",
            color: "#fffdf7",
            fontFamily: R03_SERIF,
            fontSize: 102,
            fontWeight: 600,
            letterSpacing: -3,
            whiteSpace: "nowrap",
            opacity: state.macroQuote,
            scale: macroScale,
            translate: `${macroShift}px 0`,
            transformOrigin: "left center",
            boxShadow: `-48px 44px 48px rgba(54,47,41,${0.1 + state.shadow * 0.24})`,
          }}
        >
          把复杂问题，变成清晰行动
          <span style={{ marginLeft: 22, color: "#d5962f" }}>。</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
