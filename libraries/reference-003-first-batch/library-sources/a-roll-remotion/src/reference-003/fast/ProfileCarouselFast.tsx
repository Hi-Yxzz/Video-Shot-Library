import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS } from "../fonts";
import { getProfileCarouselFastState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CARD_WIDTH = 424;
const CARD_GAP = 28;
const PROFILES = [
  {
    name: "林澈",
    roman: "LIN CHE",
    role: "系统研究员",
    skill: "Distributed Systems",
    metric: "94 / SYSTEM",
    accent: "#d9ff43",
  },
  {
    name: "周遥",
    roman: "ZHOU YAO",
    role: "产品架构师",
    skill: "Product Architecture",
    metric: "88 / DESIGN",
    accent: "#69e8ff",
  },
  {
    name: "ALEX REED",
    roman: "MODEL ENGINEER",
    role: "模型工程师",
    skill: "Inference Systems",
    metric: "91 / MODEL",
    accent: "#d9ff43",
  },
  {
    name: "MORGAN CHEN",
    roman: "RESEARCH LEAD",
    role: "研究负责人",
    skill: "Applied Research",
    metric: "89 / FIELD",
    accent: "#69e8ff",
  },
] as const;

const AvatarGlyph = ({ accent, index }: { accent: string; index: number }) => (
  <div
    style={{
      position: "relative",
      height: 238,
      overflow: "hidden",
      borderBottom: `1px solid ${accent}66`,
      background: `radial-gradient(circle at 50% 34%, ${accent}24, transparent 42%), #121817`,
    }}
  >
    <svg
      viewBox="0 0 340 238"
      width="340"
      height="238"
      style={{ position: "absolute", left: 42, bottom: 0 }}
    >
      <circle cx="170" cy="74" r={47 + index * 2} fill="#68716d" />
      <path
        d="M77 238 C84 150 123 125 170 125 C217 125 256 150 263 238 Z"
        fill="#3e4743"
      />
      <path
        d="M126 62 C132 18 204 10 218 66 C191 47 160 43 126 62 Z"
        fill={accent}
        opacity="0.72"
      />
      <path d="M64 205 H276" stroke={accent} strokeWidth="3" />
    </svg>
    <div
      style={{
        position: "absolute",
        right: 20,
        top: 18,
        color: accent,
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: 3,
      }}
    >
      ID / 0{index + 1}
    </div>
  </div>
);

const ProfileCard = ({
  fps,
  springFrame,
  profile,
  index,
}: {
  fps: number;
  springFrame: number;
  profile: (typeof PROFILES)[number];
  index: number;
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 20, stiffness: 190, mass: 0.7 },
    durationInFrames: 24,
  });

  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: 650,
        flex: "0 0 auto",
        overflow: "hidden",
        border: `2px solid ${profile.accent}`,
        background: "linear-gradient(160deg, #171d1b, #090c0b)",
        boxShadow: `0 26px 70px rgba(0,0,0,.5), 0 0 28px ${profile.accent}1f`,
        opacity: enter,
        translate: `0 ${interpolate(enter, [0, 1], [110, 0])}px`,
        scale: interpolate(enter, [0, 1], [0.94, 1]),
      }}
    >
      <AvatarGlyph accent={profile.accent} index={index} />
      <div style={{ padding: "30px 30px 26px" }}>
        <div
          style={{
            color: profile.accent,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 4,
          }}
        >
          {profile.roman}
        </div>
        <div
          style={{
            marginTop: 14,
            minHeight: 72,
            fontSize: profile.name.length > 8 ? 35 : 48,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          {profile.name}
        </div>
        <div style={{ marginTop: 8, color: "#a5aea9", fontSize: 22 }}>
          {profile.role}
        </div>
        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid #35403a",
            color: "#6f7d76",
            fontSize: 15,
            letterSpacing: 2,
          }}
        >
          PRIMARY SKILL
          <div style={{ marginTop: 8, color: "#e6eae6", fontSize: 20 }}>
            {profile.skill}
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            color: profile.accent,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          {profile.metric}
        </div>
      </div>
    </div>
  );
};

export const ProfileCarouselFast = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getProfileCarouselFastState(frame);
  const camera = interpolate(state.camera, [0, 1], [1, 1.025], CLAMP);
  const cardFrames = [
    state.card1SpringFrame,
    state.card2SpringFrame,
    state.card3SpringFrame,
    state.card4SpringFrame,
  ];

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#070a09",
        color: "#f1f4ef",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: camera,
          backgroundImage:
            "linear-gradient(rgba(105,232,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(105,232,255,.055) 1px, transparent 1px), radial-gradient(circle at 44% 52%, rgba(217,255,67,.07), transparent 40%)",
          backgroundSize: "64px 64px, 64px 64px, auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 86,
            right: 86,
            top: 64,
            height: 92,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(217,255,67,.36)",
            opacity: state.deck,
          }}
        >
          <div>
            <div
              style={{
                color: "#d9ff43",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 6,
              }}
            >
              EXPERT NETWORK / 04
            </div>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800 }}>
              研究档案 · 系统团队
            </div>
          </div>
          <div style={{ color: "#69e8ff", fontSize: 18, letterSpacing: 4 }}>
            ACTIVE 0{state.activeProfileIndex + 1}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: (1920 - CARD_WIDTH) / 2,
            top: 214,
            display: "flex",
            gap: CARD_GAP,
            translate: `${-state.trackShift}px 0`,
          }}
        >
          {PROFILES.map((profile, index) => (
            <ProfileCard
              key={profile.roman}
              fps={fps}
              springFrame={cardFrames[index]}
              profile={profile}
              index={index}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            right: 92,
            top: 350,
            width: 420,
            padding: "28px 30px",
            borderLeft: "4px solid #69e8ff",
            background: "rgba(8,12,11,.86)",
            opacity: state.details,
            translate: `${interpolate(state.details, [0, 1], [70, 0])}px 0`,
          }}
        >
          <div style={{ color: "#69e8ff", fontSize: 14, letterSpacing: 4 }}>
            PROFILE SIGNAL
          </div>
          <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.5 }}>
            清晰的问题定义，稳定的研究节奏，以及可验证的系统输出。
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 88,
            right: 88,
            bottom: 54,
            height: 8,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            opacity: state.rail,
          }}
        >
          {PROFILES.map((profile, index) => (
            <span
              key={profile.roman}
              style={{
                background:
                  index <= state.activeProfileIndex
                    ? profile.accent
                    : "#28322d",
                boxShadow:
                  index === state.activeProfileIndex
                    ? `0 0 18px ${profile.accent}88`
                    : undefined,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
