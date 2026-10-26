import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { interpolateCameraTrack, segmentProgress } from "../motion";
import { getLeaderboardFocus } from "../motion-continuity";
import { FIDELITY_REFERENCE_SPECS } from "../reference-specs";
import { CameraLayer, TextureLayer } from "../shared";

const spec = FIDELITY_REFERENCE_SPECS.find(
  (item) => item.slug === "leaderboard-card-push",
)!;

const DISPLAY = '"IBM Plex Sans", Inter, "PingFang SC", sans-serif';
const MONO = '"IBM Plex Mono", "SFMono-Regular", Menlo, monospace';

const entries = [
  {
    name: "Atlas Prime",
    system: "Research Suite",
    score: "50.0%",
    fill: 0.72,
    color: "#1597bd",
  },
  {
    name: "Northstar 4.8",
    system: "General Lab",
    score: "48.8%",
    fill: 0.7,
    color: "#168bab",
  },
  {
    name: "Kestrel K3",
    system: "Open Studio",
    score: "48.1%",
    fill: 0.69,
    color: "#8aaa3d",
  },
  {
    name: "Aster Fable",
    system: "Context Engine",
    score: "45.0%",
    fill: 0.64,
    color: "#178bae",
  },
  {
    name: "Vector Sol",
    system: "Code Works",
    score: "42.6%",
    fill: 0.59,
    color: "#d79700",
  },
  {
    name: "Orbit 4.5",
    system: "Build Lab",
    score: "38.5%",
    fill: 0.43,
    color: "#aaa292",
  },
  {
    name: "Lumen 5.2",
    system: "Cloud Team",
    score: "34.7%",
    fill: 0.29,
    color: "#969692",
  },
] as const;

const easeOutQuart = (frame: number, from: number, to: number) =>
  1 - Math.pow(1 - segmentProgress(frame, from, to), 4);

const easeInOut = (frame: number, from: number, to: number) =>
  Easing.inOut(Easing.cubic)(segmentProgress(frame, from, to));

export const LeaderboardCardPush = () => {
  const frame = useCurrentFrame();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);
  const focus = getLeaderboardFocus(frame);
  const arrival = easeOutQuart(frame, 0, 34);
  const detailPush = easeInOut(frame, 96, 143);
  const glitch = easeInOut(frame, 133, 143);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: spec.palette.background,
        fontFamily: DISPLAY,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 49% 52%, #f9f9f8 0%, #eceeef 54%, #b9bec1 100%)",
          scale: 1 + detailPush * 0.025,
        }}
      />

      <CameraLayer
        scale={camera.scale}
        panX={camera.panX * 1920}
        panY={camera.panY * 1080}
        rollDegrees={camera.rollDegrees}
        transformOrigin={`${focus.xPercent}% ${focus.yPercent}%`}
        style={{
          translate: `${camera.panX * 1920}px ${camera.panY * 1080 + (1 - arrival) * 940}px`,
          opacity: interpolate(arrival, [0, 0.12, 1], [0.2, 0.8, 1]),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 173,
            top: 132,
            width: 1574,
            height: 824,
            borderRadius: 4,
            backgroundColor: "rgba(33,38,43,.25)",
            boxShadow: `0 ${28 + detailPush * 18}px ${42 + detailPush * 35}px rgba(31,37,42,.31)`,
            translate: `${-18 * spec.parallax.panelShadow * arrival}px ${26 * spec.parallax.panelShadow}px`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 173,
            top: 112,
            width: 1574,
            height: 824,
            overflow: "hidden",
            borderRadius: 3,
            border: `1px solid ${spec.palette.border}`,
            background:
              "linear-gradient(101deg, rgba(255,255,255,.99), rgba(247,248,248,.985) 72%, rgba(230,233,235,.98))",
            boxShadow:
              "inset 10px 0 17px rgba(65,80,91,.08), inset 0 -2px 0 rgba(127,132,136,.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 126,
              top: 65,
              color: spec.palette.text,
              fontSize: 52,
              fontWeight: 650,
              letterSpacing: "-.025em",
            }}
          >
            Performance Index
          </div>
          <div
            style={{
              position: "absolute",
              right: 98,
              top: 78,
              padding: "12px 20px 10px",
              backgroundColor: "#e9bfdc",
              color: "#593146",
              fontFamily: MONO,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: ".07em",
            }}
          >
            V2.0 · CURRENT
          </div>
          <div
            style={{
              position: "absolute",
              left: 128,
              right: 92,
              top: 145,
              height: 1,
              backgroundColor: "#cfd3d6",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 128,
              top: 165,
              color: "#5d6268",
              fontFamily: MONO,
              fontSize: 20,
              letterSpacing: ".12em",
            }}
          >
            MODEL / SYSTEM
          </div>
          <div
            style={{
              position: "absolute",
              right: 93,
              top: 165,
              color: "#5d6268",
              fontFamily: MONO,
              fontSize: 20,
              letterSpacing: ".1em",
            }}
          >
            RESOLUTION RATE
          </div>

          <div style={{ position: "absolute", left: 112, right: 82, top: 212 }}>
            {entries.map((entry, index) => {
              const rowStart = 25 + index * 2;
              const rowIn = easeOutQuart(frame, rowStart, rowStart + 16);
              const barIn = Easing.out(Easing.cubic)(
                segmentProgress(frame, 28 + index * 2, 70 + index * 2),
              );
              return (
                <div
                  key={entry.name}
                  style={{
                    position: "relative",
                    height: 81,
                    padding: "8px 18px 0",
                    boxSizing: "border-box",
                    backgroundColor:
                      index === 0 ? "rgba(232,190,217,.68)" : "transparent",
                    opacity: rowIn,
                    translate: `${(1 - rowIn) * 54}px 0`,
                    borderBottom: "1px solid rgba(190,194,197,.27)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 15,
                      color: "#22262b",
                      fontSize: 27,
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontWeight: 680 }}>{entry.name}</span>
                    <span
                      style={{
                        color: "#80245d",
                        fontFamily: MONO,
                        fontSize: 19,
                        fontWeight: 650,
                      }}
                    >
                      (PRO)
                    </span>
                    <span
                      style={{
                        color: "#737980",
                        fontFamily: MONO,
                        fontSize: 20,
                      }}
                    >
                      / {entry.system}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        color: "#34383e",
                        fontFamily: MONO,
                        fontSize: 23,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {entry.score}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 18,
                      right: 18,
                      bottom: 10,
                      height: 10,
                      backgroundColor: "#dfe1e2",
                      boxShadow: "inset 0 1px 2px rgba(64,68,72,.1)",
                    }}
                  >
                    <div
                      style={{
                        width: `${entry.fill * barIn * 100}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${entry.color}, ${entry.color} 58%, ${index < 4 ? "#2359ac" : entry.color})`,
                        boxShadow: `0 0 5px ${entry.color}55`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CameraLayer>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: detailPush * 0.48,
          background:
            "linear-gradient(90deg, transparent 0 58%, rgba(21,24,27,.3) 82%, rgba(10,12,14,.72) 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: glitch * 0.7,
          clipPath: "polygon(0 32%, 50% 32%, 47% 68%, 0 68%)",
          background:
            "linear-gradient(90deg, rgba(8,10,11,.92), rgba(25,28,30,.67), transparent)",
          translate: `${(1 - glitch) * -180}px 0`,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 555,
          top: 345,
          color: "rgba(239,241,242,.72)",
          fontFamily: DISPLAY,
          fontSize: 330,
          fontWeight: 800,
          lineHeight: 1,
          opacity: glitch * 0.72,
          translate: `${(1 - glitch) * 130}px 0`,
          textShadow: "18px 0 0 rgba(30,32,34,.32)",
        }}
      >
        07
      </div>
      <TextureLayer
        grainColor="rgba(43,49,54,.7)"
        grainOpacity={0.08}
        grainSize={5}
        vignette="radial-gradient(ellipse at 49% 51%, transparent 46%, rgba(24,29,33,.54) 100%)"
        blendMode="multiply"
      />
    </AbsoluteFill>
  );
};
