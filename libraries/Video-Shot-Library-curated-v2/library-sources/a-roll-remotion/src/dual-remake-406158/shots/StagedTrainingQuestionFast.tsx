import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const SONG = '"Songti SC", "STSong", serif';
const SANS = '"PingFang SC", "Microsoft YaHei", sans-serif';

const reveal = (frame: number, start: number, end: number) => {
  const progress = Math.max(0, Math.min(1, (frame - start) / (end - start)));
  return Easing.out(Easing.cubic)(progress);
};

export const getFastStagedTrainingTimeline = (frame: number) => ({
  tableau: reveal(frame, 12, 38),
  folders: reveal(frame, 12, 34),
  person: reveal(frame, 24, 44),
  topNote: reveal(frame, 64, 98),
  question: reveal(frame, 128, 154),
  conclusion: reveal(frame, 174, 194),
});

export const getFastStagedTrainingDepth = (frame: number) => {
  const push = reveal(frame, 0, 194);
  return {
    background: 0,
    cards: 1 + push * 0.04,
    foreground: 2 + push * 0.08,
  };
};

export const getFastStagedTrainingCamera = (frame: number) => {
  const progress = Math.max(0, Math.min(1, frame / 194));
  return {
    scale: 1 + progress * 0.035,
    panX: progress * -18,
    panY: progress * 5,
  };
};

const FlatFolder = ({
  side,
  label,
  title,
  progress,
}: {
  side: "left" | "right";
  label: string;
  title: string;
  progress: number;
}) => {
  const direction = side === "left" ? -1 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? 160 : 1180,
        top: 250,
        width: 580,
        height: 430,
        opacity: progress,
        translate: `${interpolate(progress, [0, 1], [direction * 260, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })}px 0px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 0,
          width: 230,
          height: 65,
          borderRadius: "12px 12px 0 0",
          backgroundColor: "#d49a2f",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "42px 0 0",
          borderRadius: 14,
          backgroundColor: "#e4b64d",
          boxShadow: "0 18px 0 rgba(67,52,29,.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6f511f",
          fontFamily: SONG,
          fontSize: 46,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          left: 34,
          right: 34,
          bottom: -23,
          padding: "18px 24px",
          backgroundColor: "#20201f",
          color: "#f4efe5",
          fontFamily: SONG,
          fontSize: 42,
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        <span style={{ color: "#b7373d" }}>“</span>
        {title}
        <span style={{ color: "#b7373d" }}>”</span>
      </div>
    </div>
  );
};

const FlatPerson = ({ progress }: { progress: number }) => (
  <div
    style={{
      position: "absolute",
      left: 810,
      top: 334,
      width: 300,
      height: 400,
      opacity: progress,
      scale: interpolate(progress, [0, 1], [0.72, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.5)),
      }),
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 90,
        width: 120,
        height: 120,
        borderRadius: "50%",
        backgroundColor: "#1d1c1a",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 108,
        width: 300,
        height: 280,
        borderRadius: "145px 145px 22px 22px",
        backgroundColor: "#1d1c1a",
      }}
    />
  </div>
);

export const FastStagedTrainingQuestion = () => {
  const frame = useCurrentFrame();
  const timeline = getFastStagedTrainingTimeline(frame);
  const camera = getFastStagedTrainingCamera(frame);
  const tableauOut = 1 - reveal(frame, 124, 152);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "linear-gradient(135deg, #ded8c9, #c8c0ad)",
        fontFamily: SANS,
        scale: camera.scale,
        translate: `${camera.panX}px ${camera.panY}px`,
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 48,
          color: "#26231f",
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: ".12em",
          opacity: timeline.tableau * tableauOut,
        }}
      >
        TRAINING PATH · 训练路径
      </div>

      <div style={{ opacity: tableauOut }}>
        <FlatFolder
          side="left"
          label="共同起点"
          title="问题的起点"
          progress={timeline.folders}
        />
        <FlatFolder
          side="right"
          label="阶段训练"
          title="分阶段练习"
          progress={timeline.folders}
        />
        <FlatPerson progress={timeline.person} />
        <div
          style={{
            position: "absolute",
            left: 760,
            top: 105,
            width: 400,
            padding: "20px 28px",
            backgroundColor: "#e5bd63",
            color: "#72521d",
            fontFamily: SONG,
            fontSize: 42,
            fontWeight: 700,
            textAlign: "center",
            opacity: timeline.topNote,
            scale: interpolate(timeline.topNote, [0, 1], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          继续追问
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: timeline.question,
          scale: interpolate(timeline.question, [0, 1], [0.88, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          fontFamily: SONG,
          fontSize: 176,
          fontWeight: 900,
          letterSpacing: "-.08em",
          color: "#1d1b18",
        }}
      >
        谁培养了他们？
      </div>
      <div
        style={{
          position: "absolute",
          left: 608,
          bottom: 142,
          color: "#a62d34",
          fontSize: 42,
          fontWeight: 800,
          opacity: timeline.conclusion,
        }}
      >
        问错了 / ERROR
      </div>
    </AbsoluteFill>
  );
};
