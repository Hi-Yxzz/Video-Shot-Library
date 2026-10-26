import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getProfileCarouselFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PROFILES = [
  {
    name: "林澈",
    roman: "LIN CHE",
    role: "系统研究员",
    bio: "研究复杂计算系统中的协作边界，让基础设施保持清晰、稳定与可解释。",
    accent: "#cc3033",
    side: "left",
    initials: "LIN / CHE",
  },
  {
    name: "周遥",
    roman: "ZHOU YAO",
    role: "产品架构师",
    bio: "连接研究、产品与工程，以克制的结构把模糊需求整理成可靠的体验。",
    accent: "#4056b9",
    side: "left",
    initials: "ZHOU / YAO",
  },
  {
    name: "艾利克斯·里德",
    roman: "ALEX REED",
    role: "MODEL ENGINEER",
    bio: "Builds measured inference systems around transparent tests and resilient interfaces.",
    accent: "#a53a35",
    side: "right",
    initials: "AR",
  },
  {
    name: "摩根·陈",
    roman: "MORGAN CHEN",
    role: "RESEARCH LEAD",
    bio: "Leads applied research programs from first hypothesis to practical, repeatable systems.",
    accent: "#384f91",
    side: "right",
    initials: "MC",
  },
] as const;

const InkPortrait = ({
  accent,
  variant,
}: {
  accent: string;
  variant: number;
}) => (
  <svg viewBox="0 0 700 900" width="700" height="900">
    <defs>
      <linearGradient id={`wash-${variant}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f5f1e9" />
        <stop offset="1" stopColor="#b9b6b0" />
      </linearGradient>
      <filter id={`soft-${variant}`}>
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>
    <ellipse
      cx="350"
      cy="800"
      rx="270"
      ry="80"
      fill="#222"
      opacity="0.12"
      filter={`url(#soft-${variant})`}
    />
    <path
      d="M82 900 C92 650 182 550 350 550 C518 550 608 650 618 900 Z"
      fill="#2e3132"
    />
    <path
      d="M238 550 L276 688 L350 744 L424 688 L462 550 Z"
      fill={accent}
      opacity="0.72"
    />
    <ellipse
      cx={350 + (variant % 2) * 12}
      cy="344"
      rx={145 - variant * 3}
      ry={188 - variant * 5}
      fill={`url(#wash-${variant})`}
      stroke="#252728"
      strokeWidth="8"
    />
    <path
      d={
        variant % 2 === 0
          ? "M204 337 C206 120 465 104 500 330 C442 264 316 232 204 337 Z"
          : "M215 300 C246 112 476 142 488 348 C430 250 326 224 215 300 Z"
      }
      fill="#252728"
    />
    <path
      d="M282 366 Q320 348 344 369"
      fill="none"
      stroke="#333"
      strokeWidth="8"
    />
    <path
      d="M378 369 Q414 350 446 371"
      fill="none"
      stroke="#333"
      strokeWidth="8"
    />
    <path
      d="M352 382 L336 452 L368 459"
      fill="none"
      stroke="#777"
      strokeWidth="7"
    />
    <path
      d="M298 500 Q354 535 416 493"
      fill="none"
      stroke="#555"
      strokeWidth="8"
    />
    <path
      d="M120 862 C230 790 500 786 598 870"
      fill="none"
      stroke={accent}
      strokeWidth="5"
      opacity="0.75"
    />
  </svg>
);

const EditorialProfile = ({
  fps,
  springFrame,
  progress,
  profile,
  variant,
}: {
  fps: number;
  springFrame: number;
  progress: number;
  profile: (typeof PROFILES)[number];
  variant: number;
}) => {
  const enter = spring({
    frame: springFrame,
    fps,
    config: { damping: 24, stiffness: 82, mass: 1.05 },
    durationInFrames: 46,
  });
  const portraitLeft = profile.side === "left" ? 124 : 1096;
  const textLeft = profile.side === "left" ? 1020 : 170;

  return (
    <AbsoluteFill style={{ opacity: progress }}>
      <div
        style={{
          position: "absolute",
          left: portraitLeft,
          top: 108,
          width: 700,
          height: 900,
          overflow: "hidden",
          clipPath: `inset(0 ${interpolate(enter, [0, 1], [100, 0])}% 0 0)`,
          translate: `${interpolate(enter, [0, 1], [profile.side === "left" ? -90 : 90, 0])}px 0`,
          scale: interpolate(enter, [0, 1], [0.96, 1]),
          filter: "drop-shadow(0 30px 28px rgba(52,48,43,.16))",
        }}
      >
        <InkPortrait accent={profile.accent} variant={variant} />
      </div>

      <div
        style={{
          position: "absolute",
          left: textLeft,
          top: profile.side === "left" ? 318 : 326,
          width: profile.side === "left" ? 720 : 760,
          translate: `${interpolate(enter, [0, 1], [profile.side === "left" ? 72 : -72, 0])}px 0`,
        }}
      >
        <div
          style={{
            fontFamily: R03_SERIF,
            color: "#17191b",
            fontSize: profile.name.length > 5 ? 72 : 104,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -3,
            whiteSpace: "nowrap",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            marginTop: 20,
            color: profile.accent,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 5,
          }}
        >
          {profile.roman}
        </div>
        <div
          style={{
            marginTop: 12,
            color: "#555b60",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
          }}
        >
          {profile.role}
        </div>
        <div
          style={{
            marginTop: 38,
            paddingTop: 30,
            width: 660,
            borderTop: `2px solid ${profile.accent}66`,
            color: "#797d80",
            fontSize: 25,
            lineHeight: 1.8,
          }}
        >
          {profile.bio}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ProfileCarouselFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getProfileCarouselFidelityState(frame);
  const camera = interpolate(state.camera, [0, 1], [1, 1.045], CLAMP);
  const progresses = [
    state.profile1,
    state.profile2,
    state.profile3,
    state.profile4,
  ];
  const springFrames = [
    state.profile1SpringFrame,
    state.profile2SpringFrame,
    state.profile3SpringFrame,
    state.profile4SpringFrame,
  ];

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#e9e7e1",
        color: "#17191b",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          scale: camera,
          backgroundImage:
            "radial-gradient(ellipse at 50% 47%, #fbfaf5 0%, #ebe9e3 68%, #c9c8c5 100%), radial-gradient(rgba(62,57,51,.12) .55px, transparent .8px)",
          backgroundSize: "auto, 5px 5px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-120px -80px",
            translate: `${interpolate(state.letters, [0, 1], [0, -36])}px 0`,
            fontSize: 230,
            fontWeight: 800,
            lineHeight: 0.82,
            letterSpacing: -12,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              color: PROFILES[0].accent,
              opacity: state.profile1,
              wordSpacing: 110,
            }}
          >
            LIN CHE LIN CHE
            <br />
            CHE LIN CHE LIN
            <br />
            LIN CHE LIN CHE
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              color: PROFILES[1].accent,
              opacity: state.profile2,
              wordSpacing: 90,
            }}
          >
            ZHOU YAO ZHOU
            <br />
            YAO ZHOU YAO
            <br />
            ZHOU YAO ZHOU
          </div>
        </div>

        {PROFILES.map((profile, index) => (
          <EditorialProfile
            key={profile.roman}
            fps={fps}
            springFrame={springFrames[index]}
            progress={progresses[index]}
            profile={profile}
            variant={index}
          />
        ))}

        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: 54,
            color: "#85837f",
            fontSize: 14,
            letterSpacing: 5,
            opacity: Math.max(...progresses),
          }}
        >
          EDITORIAL PROFILE / 0{state.activeProfileIndex + 1}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
