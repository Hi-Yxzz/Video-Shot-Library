import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {
  CLAMP,
  CornerFrame,
  FONT_DISPLAY,
  FONT_SANS,
  PALETTE,
  PilotBackground,
} from "./design";

export const PROBLEM_TITLE_CADENCE_DURATION_IN_FRAMES = 150;
export const PROBLEM_TITLE_CADENCE_QA_FRAMES = [8, 20, 35, 50, 66, 82, 96, 125] as const;

export const COMPUTE_COST_SLAM_DURATION_IN_FRAMES = 135;
export const COMPUTE_COST_SLAM_QA_FRAMES = [10, 14, 24, 90] as const;

export const THREE_STAGE_WORKFLOW_DURATION_IN_FRAMES = 150;
export const THREE_STAGE_WORKFLOW_QA_FRAMES = [18, 60, 98, 125] as const;

const vignette: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(circle at 50% 46%, transparent 38%, rgba(0,0,0,0.46) 74%, rgba(0,0,0,0.88) 100%)",
};

const TechnicalPanel = ({
  variant,
  scale,
  translate = "0px 0px",
}: {
  variant: 1 | 2 | 3;
  scale: number;
  translate?: string;
}) => {
  const nodes = [
    [250, 254],
    [502, 182],
    [760, 350],
    [1030, 232],
    [1288, 390],
    [1548, 205],
    [1420, 700],
    [1080, 790],
    [720, 690],
    [378, 785],
  ] as const;

  return (
    <AbsoluteFill
      style={{
        scale,
        translate,
        background:
          variant === 2
            ? "linear-gradient(120deg, #070907 0%, #11150d 54%, #080a08 100%)"
            : "linear-gradient(138deg, #080a08 0%, #151811 58%, #070807 100%)",
      }}
    >
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
        <defs>
          <linearGradient id={`trace-${variant}`} x1="0" x2="1">
            <stop offset="0" stopColor={PALETTE.acid} stopOpacity="0" />
            <stop offset="0.48" stopColor={PALETTE.acid} stopOpacity="0.72" />
            <stop offset="1" stopColor={PALETTE.acid} stopOpacity="0.08" />
          </linearGradient>
          <pattern id={`minor-grid-${variant}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#f4f1e8" strokeOpacity="0.045" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill={`url(#minor-grid-${variant})`} />
        {variant === 1 ? (
          <>
            <path d="M180 730 L390 590 L620 632 L822 372 L1080 452 L1280 286 L1680 390" fill="none" stroke={`url(#trace-${variant})`} strokeWidth="3" />
            <path d="M250 254 L502 182 L760 350 L1030 232 L1288 390 L1548 205" fill="none" stroke="#f4f1e8" strokeOpacity="0.16" strokeWidth="1" />
            {[330, 570, 810, 1050, 1290].map((x, index) => (
              <g key={x}>
                <rect x={x} y={790 - index * 34} width="132" height={110 + index * 24} fill={PALETTE.acid} fillOpacity={0.025 + index * 0.014} stroke={PALETTE.acid} strokeOpacity="0.2" />
                <line x1={x + 20} y1={820 - index * 34} x2={x + 108} y2={820 - index * 34} stroke={PALETTE.ink} strokeOpacity="0.22" />
              </g>
            ))}
          </>
        ) : null}
        {variant === 2 ? (
          <>
            {nodes.slice(0, 8).map(([x, y], index) => {
              const [nextX, nextY] = nodes[(index + 3) % 8];
              return <line key={`${x}-${y}`} x1={x} y1={y} x2={nextX} y2={nextY} stroke={index % 2 ? PALETTE.ink : PALETTE.acid} strokeOpacity={index % 2 ? 0.12 : 0.27} strokeWidth={index % 2 ? 1 : 2} />;
            })}
            {nodes.map(([x, y], index) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r={index % 3 === 0 ? 17 : 10} fill="#090b08" stroke={index % 3 === 0 ? PALETTE.acid : PALETTE.ink} strokeOpacity={index % 3 === 0 ? 0.82 : 0.36} strokeWidth="2" />
                <circle cx={x} cy={y} r="3" fill={PALETTE.acid} />
              </g>
            ))}
          </>
        ) : null}
        {variant === 3 ? (
          <>
            <circle cx="960" cy="540" r="340" fill="none" stroke={PALETTE.ink} strokeOpacity="0.1" />
            <circle cx="960" cy="540" r="238" fill="none" stroke={PALETTE.acid} strokeOpacity="0.25" strokeWidth="2" strokeDasharray="8 16" />
            <circle cx="960" cy="540" r="122" fill={PALETTE.acid} fillOpacity="0.025" stroke={PALETTE.acid} strokeOpacity="0.62" strokeWidth="2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const radians = (angle * Math.PI) / 180;
              const x = 960 + Math.cos(radians) * 340;
              const y = 540 + Math.sin(radians) * 340;
              return (
                <g key={angle}>
                  <line x1="960" y1="540" x2={x} y2={y} stroke={PALETTE.ink} strokeOpacity="0.11" />
                  <rect x={x - 34} y={y - 34} width="68" height="68" rx="8" fill="#11140e" stroke={PALETTE.acid} strokeOpacity="0.42" />
                </g>
              );
            })}
            <path d="M530 820 C700 655 765 718 900 566 C1025 425 1130 515 1400 262" fill="none" stroke={`url(#trace-${variant})`} strokeWidth="4" />
          </>
        ) : null}
      </svg>
      <div style={{position: "absolute", left: 92, top: 76, color: PALETTE.muted, fontSize: 20, letterSpacing: 5}}>SYSTEM ANALYSIS / 0{variant}</div>
      <div style={{position: "absolute", right: 92, bottom: 76, color: PALETTE.acid, fontSize: 20, letterSpacing: 4}}>VARIABLE MAP</div>
    </AbsoluteFill>
  );
};

const CadenceTitle = ({title, english}: {title: string; english: string}) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #080a08, #0d100b 54%, #070807)",
    }}
  >
    <div style={{width: 118, height: 3, backgroundColor: PALETTE.acid, marginBottom: 34}} />
    <div style={{fontFamily: FONT_DISPLAY, fontSize: 184, fontWeight: 900, lineHeight: 0.92, letterSpacing: 4, color: PALETTE.ink}}>{title}</div>
    <div style={{marginTop: 30, color: PALETTE.acid, fontSize: 25, fontWeight: 700, letterSpacing: 11}}>{english}</div>
  </AbsoluteFill>
);

export const ProblemTitleCadence = () => {
  const frame = useCurrentFrame();

  let scene: ReactNode;
  if (frame < 16) {
    scene = <TechnicalPanel variant={1} scale={interpolate(frame, [0, 15], [1, 1.05], CLAMP)} />;
  } else if (frame < 28) {
    scene = <CadenceTitle title="解决问题" english="TRULY DIFFICULT" />;
  } else if (frame < 44) {
    scene = <TechnicalPanel variant={2} scale={1.025} translate={`${interpolate(frame, [28, 43], [42, -42], CLAMP)}px 0px`} />;
  } else if (frame < 58) {
    scene = <CadenceTitle title="找到变量" english="FIND THE VARIABLE" />;
  } else if (frame < 74) {
    scene = <TechnicalPanel variant={3} scale={interpolate(frame, [58, 73], [1.02, 1.075], CLAMP)} />;
  } else if (frame < 90) {
    scene = <CadenceTitle title="建立因果" english="BUILD CAUSALITY" />;
  } else {
    scene = (
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", backgroundColor: PALETTE.background}}>
        <div
          style={{
            scale: interpolate(frame, [90, 97], [1.035, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}),
            textAlign: "center",
          }}
        >
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 158, lineHeight: 1.02, letterSpacing: 2, color: PALETTE.ink}}>复杂的问题</div>
          <div style={{width: 1120, height: 2, margin: "34px auto 30px", backgroundColor: PALETTE.acid, opacity: 0.8}} />
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 148, lineHeight: 1.02, letterSpacing: 2, color: PALETTE.ink}}>从来不是一个变量</div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{backgroundColor: PALETTE.background, color: PALETTE.ink, fontFamily: FONT_SANS, overflow: "hidden"}}>
      {scene}
      <CornerFrame />
      <div style={vignette} />
    </AbsoluteFill>
  );
};

const PARTICLES = [
  {x: -298, y: -178, size: 13, distance: 150, angle: -2.72},
  {x: -214, y: 174, size: 9, distance: 128, angle: 2.42},
  {x: -92, y: -185, size: 7, distance: 118, angle: -1.93},
  {x: 55, y: 181, size: 11, distance: 142, angle: 1.32},
  {x: 188, y: -183, size: 8, distance: 126, angle: -1.04},
  {x: 301, y: -92, size: 12, distance: 162, angle: -0.35},
  {x: 286, y: 167, size: 7, distance: 121, angle: 0.74},
  {x: -310, y: 56, size: 10, distance: 155, angle: 3.02},
  {x: 18, y: -190, size: 6, distance: 112, angle: -1.48},
] as const;

const GridDesk = () => (
  <AbsoluteFill>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 50% 44%, rgba(217,255,67,0.11), transparent 31%), linear-gradient(155deg, #10130e, #070907 66%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: -110,
        right: -110,
        bottom: -230,
        height: 680,
        rotate: "-5deg",
        backgroundImage:
          "linear-gradient(rgba(217,255,67,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(217,255,67,0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        borderTop: `1px solid ${PALETTE.acid}44`,
      }}
    />
    <div style={{position: "absolute", left: 82, top: 70, fontSize: 20, letterSpacing: 7, color: PALETTE.muted}}>COMPUTATION BENCH / 04</div>
    <div style={{position: "absolute", right: 82, top: 70, width: 220, height: 1, backgroundColor: PALETTE.acid, opacity: 0.55}} />
  </AbsoluteFill>
);

export const ComputeCostSlam = () => {
  const frame = useCurrentFrame();
  const cardScale =
    frame < 14
      ? interpolate(frame, [8, 14], [2.5, 0.97], {...CLAMP, easing: Easing.in(Easing.quad)})
      : interpolate(frame, [14, 22], [0.97, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const cardRotate =
    frame < 14
      ? interpolate(frame, [8, 14], [5, -0.35], {...CLAMP, easing: Easing.in(Easing.quad)})
      : interpolate(frame, [14, 22], [-0.35, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const cardY =
    frame < 14
      ? interpolate(frame, [8, 14], [-80, 0], {...CLAMP, easing: Easing.in(Easing.quad)})
      : interpolate(frame, [14, 22], [0, 0], CLAMP);
  const shakeFrames = [
    [8, -5],
    [-6, 7],
    [4, -4],
    [-2, 2],
    [1, -1],
  ] as const;
  const shake = frame >= 14 && frame < 19 ? shakeFrames[frame - 14] : [0, 0];
  const visible = frame >= 8 ? 1 : 0;
  const burstProgress = interpolate(frame, [14, 28], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  return (
    <PilotBackground>
      <GridDesk />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
        {frame >= 14 && frame < 29 ? (
          <div
            style={{
              position: "absolute",
              width: interpolate(frame, [14, 28], [110, 900], {...CLAMP, easing: Easing.out(Easing.cubic)}),
              height: interpolate(frame, [14, 28], [110, 900], {...CLAMP, easing: Easing.out(Easing.cubic)}),
              borderRadius: "50%",
              border: `4px solid ${PALETTE.acid}`,
              opacity: interpolate(frame, [14, 28], [0.85, 0], CLAMP),
            }}
          />
        ) : null}
        {frame >= 14 && frame < 29
          ? PARTICLES.map((particle, index) => {
              const travel = particle.distance * burstProgress;
              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    width: particle.size,
                    height: particle.size * 0.42,
                    borderRadius: 99,
                    backgroundColor: index % 3 === 0 ? PALETTE.ink : PALETTE.acid,
                    translate: `${particle.x + Math.cos(particle.angle) * travel}px ${particle.y + Math.sin(particle.angle) * travel}px`,
                    rotate: `${particle.angle}rad`,
                    opacity: interpolate(frame, [14, 25, 28], [1, 0.72, 0], CLAMP),
                  }}
                />
              );
            })
          : null}
        <div
          style={{
            width: 660,
            height: 360,
            position: "relative",
            opacity: visible,
            scale: cardScale,
            translate: `${shake[0]}px ${cardY + shake[1]}px`,
            rotate: `${cardRotate}deg`,
            backgroundColor: PALETTE.acid,
            color: "#090b08",
            border: "2px solid rgba(255,255,255,0.28)",
            boxShadow: frame >= 14 ? "0 38px 100px rgba(0,0,0,0.62), 0 0 54px rgba(217,255,67,0.14)" : "none",
            overflow: "hidden",
          }}
        >
          <div style={{height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", borderBottom: "2px solid #090b08", fontSize: 18, fontWeight: 900, letterSpacing: 3}}>
            <span>运算成本</span>
            <span>SYS / COST</span>
          </div>
          <div style={{height: 306, display: "flex", alignItems: "center", padding: "0 34px 12px", justifyContent: "space-between"}}>
            <div>
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 174, lineHeight: 0.86, fontWeight: 900, letterSpacing: -4}}>42×</div>
              <div style={{fontSize: 21, fontWeight: 900, letterSpacing: 4, marginTop: 24}}>COMPUTE MULTIPLIER</div>
            </div>
            <div style={{width: 118, height: 210, borderLeft: "2px solid #090b08", paddingLeft: 24, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
              {[92, 66, 100, 44, 78, 58].map((width, index) => (
                <div key={index} style={{width, height: 18, backgroundColor: "#090b08", opacity: 0.9 - index * 0.08}} />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={vignette} />
    </PilotBackground>
  );
};

type WorkflowGlyphProps = {kind: "page" | "rank" | "code"};

const WorkflowGlyph = ({kind}: WorkflowGlyphProps) => {
  if (kind === "page") {
    return (
      <svg width="300" height="176" viewBox="0 0 300 176">
        <rect x="18" y="14" width="264" height="148" rx="10" fill="#0b0d09" stroke={PALETTE.ink} strokeOpacity="0.42" strokeWidth="2" />
        <circle cx="38" cy="34" r="4" fill={PALETTE.red} /><circle cx="53" cy="34" r="4" fill={PALETTE.warm} /><circle cx="68" cy="34" r="4" fill={PALETTE.acid} />
        <rect x="36" y="58" width="94" height="76" rx="5" fill={PALETTE.acid} fillOpacity="0.14" stroke={PALETTE.acid} strokeOpacity="0.65" />
        <rect x="150" y="61" width="96" height="10" fill={PALETTE.ink} fillOpacity="0.78" />
        <rect x="150" y="84" width="72" height="7" fill={PALETTE.ink} fillOpacity="0.32" />
        <rect x="150" y="101" width="82" height="7" fill={PALETTE.ink} fillOpacity="0.22" />
        <rect x="150" y="124" width="48" height="18" rx="3" fill={PALETTE.acid} />
      </svg>
    );
  }

  if (kind === "rank") {
    return (
      <svg width="300" height="176" viewBox="0 0 300 176">
        {[0, 1, 2, 3].map((index) => (
          <g key={index}>
            <rect x="20" y={18 + index * 38} width="260" height="29" rx="5" fill={index === 0 ? PALETTE.acid : "#0b0d09"} fillOpacity={index === 0 ? 1 : 0.9} stroke={index === 0 ? PALETTE.acid : PALETTE.ink} strokeOpacity="0.35" />
            <text x="35" y={39 + index * 38} fontFamily={FONT_SANS} fontSize="14" fontWeight="800" fill={index === 0 ? "#090b08" : PALETTE.muted}>{`0${index + 1}`}</text>
            <rect x="72" y={29 + index * 38} width={116 - index * 13} height="7" fill={index === 0 ? "#090b08" : PALETTE.ink} fillOpacity={index === 0 ? 0.82 : 0.36} />
            <circle cx="258" cy={32 + index * 38} r="6" fill={index === 0 ? "#090b08" : PALETTE.acid} />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg width="300" height="176" viewBox="0 0 300 176">
      <rect x="16" y="12" width="268" height="152" rx="10" fill="#0b0d09" stroke={PALETTE.ink} strokeOpacity="0.4" strokeWidth="2" />
      <rect x="16" y="12" width="54" height="152" rx="10" fill={PALETTE.ink} fillOpacity="0.055" />
      {[37, 57, 77, 97, 117, 137].map((y, index) => <rect key={y} x="31" y={y} width={13 + (index % 2) * 8} height="4" fill={PALETTE.muted} fillOpacity="0.6" />)}
      <text x="89" y="52" fontFamily="monospace" fontSize="16" fill={PALETTE.acid}>&lt;main&gt;</text>
      <text x="108" y="80" fontFamily="monospace" fontSize="15" fill={PALETTE.ink} fillOpacity="0.78">render(workflow)</text>
      <text x="108" y="108" fontFamily="monospace" fontSize="15" fill={PALETTE.warm}>return output;</text>
      <text x="89" y="136" fontFamily="monospace" fontSize="16" fill={PALETTE.acid}>&lt;/main&gt;</text>
    </svg>
  );
};

const WorkflowPanel = ({
  index,
  title,
  english,
  kind,
  left,
}: {
  index: number;
  title: string;
  english: string;
  kind: WorkflowGlyphProps["kind"];
  left: number;
}) => {
  const frame = useCurrentFrame();
  const starts = [14, 52, 90];
  const start = starts[index];
  const progress = interpolate(frame, [start, start + 16], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const laterShift =
    index === 0
      ? interpolate(frame, [52, 68, 90, 106], [36, 18, 18, 0], CLAMP)
      : index === 1
        ? interpolate(frame, [90, 106], [18, 0], CLAMP)
        : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: left + laterShift,
        top: 322,
        width: 420,
        height: 420,
        opacity: progress,
        translate: `0px ${interpolate(progress, [0, 1], [88, 0], CLAMP)}px`,
        scale: interpolate(progress, [0, 1], [0.91, 1], CLAMP),
        background: "linear-gradient(145deg, rgba(31,35,26,0.98), rgba(15,17,13,0.98))",
        border: `1px solid ${index === 2 ? PALETTE.acid : PALETTE.ink}${index === 2 ? "aa" : "38"}`,
        boxShadow: "0 26px 74px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{height: 64, borderBottom: `1px solid ${PALETTE.ink}24`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px"}}>
        <span style={{fontFamily: FONT_DISPLAY, fontSize: 26, letterSpacing: 2, color: PALETTE.acid}}>{`0${index + 1}`}</span>
        <span style={{fontSize: 13, fontWeight: 800, letterSpacing: 3, color: PALETTE.muted}}>WORKFLOW NODE</span>
      </div>
      <div style={{height: 206, display: "flex", alignItems: "center", justifyContent: "center"}}><WorkflowGlyph kind={kind} /></div>
      <div style={{padding: "0 30px"}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 57, lineHeight: 1, fontWeight: 900, letterSpacing: 1, whiteSpace: "nowrap"}}>{title}</div>
        <div style={{marginTop: 16, color: PALETTE.acid, fontSize: 16, fontWeight: 800, letterSpacing: 3.5}}>{english}</div>
      </div>
    </div>
  );
};

const Connector = ({start}: {start: number}) => {
  const frame = useCurrentFrame();
  const dashOffset = interpolate(frame, [start, start + 8], [120, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <svg width="120" height="44" viewBox="0 0 120 44" style={{overflow: "visible"}}>
      <path d="M0 22 H105" fill="none" stroke={PALETTE.acid} strokeWidth="2" strokeDasharray="120" strokeDashoffset={dashOffset} />
      <path d="M100 14 L112 22 L100 30" fill="none" stroke={PALETTE.acid} strokeWidth="2" opacity={interpolate(frame, [start + 5, start + 8], [0, 1], CLAMP)} />
    </svg>
  );
};

export const ThreeStageWorkflow = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: PALETTE.background, color: PALETTE.ink, fontFamily: FONT_SANS, overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, 118], [1, 1.018], {...CLAMP, easing: Easing.inOut(Easing.cubic)}),
          backgroundImage: [
            "radial-gradient(circle at 50% 47%, rgba(217,255,67,0.105), transparent 38%)",
            "linear-gradient(rgba(244,241,232,0.035) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(244,241,232,0.035) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "auto, 64px 64px, 64px 64px",
        }}
      />
      <div style={{position: "absolute", left: 180, top: 122, display: "flex", alignItems: "center", gap: 24}}>
        <div style={{width: 82, height: 3, backgroundColor: PALETTE.acid}} />
        <div style={{fontSize: 20, fontWeight: 800, letterSpacing: 6, color: PALETTE.muted}}>THREE-STAGE PRODUCTION FLOW</div>
      </div>
      <div style={{position: "absolute", right: 180, top: 112, fontFamily: FONT_DISPLAY, fontSize: 46, color: PALETTE.acid, letterSpacing: 2}}>01 — 03</div>
      <div style={{position: "absolute", left: 600, top: 510}}><Connector start={44} /></div>
      <div style={{position: "absolute", left: 1170, top: 510}}><Connector start={82} /></div>
      <WorkflowPanel index={0} left={180} title="构建页面" english="CREATE PAGE" kind="page" />
      <WorkflowPanel index={1} left={750} title="排行流程" english="RANKING PROCESS" kind="rank" />
      <WorkflowPanel index={2} left={1320} title="写代码" english="WRITE CODE" kind="code" />
      <div style={{position: "absolute", left: 180, right: 180, bottom: 126, height: 1, backgroundColor: PALETTE.ink, opacity: 0.13}} />
      <div style={{position: "absolute", left: 180, bottom: 88, color: PALETTE.muted, fontSize: 15, letterSpacing: 3}}>INPUT / SEQUENCE / OUTPUT</div>
      <CornerFrame />
      <div style={vignette} />
    </AbsoluteFill>
  );
};
