import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { deterministicTextureValue } from "../motion";

const SONG = '"Songti SC", "STSong", "Noto Serif CJK SC", serif';
const SANS = '"PingFang SC", "Microsoft YaHei", sans-serif';
const NEWSPAPER = '"Times New Roman", "Songti SC", serif';

const reveal = (frame: number, start: number, end: number) => {
  const progress = Math.max(0, Math.min(1, (frame - start) / (end - start)));
  return Easing.out(Easing.cubic)(progress);
};

export const getFidelityStagedTrainingTimeline = (frame: number) => ({
  tableau: reveal(frame, 8, 30),
  folders: reveal(frame, 10, 34),
  person: reveal(frame, 24, 44),
  topNote: reveal(frame, 62, 82),
  question: reveal(frame, 126, 148),
  conclusion: reveal(frame, 168, 190),
});

export const getFidelityStagedTrainingDepth = (frame: number) => {
  const push = reveal(frame, 0, 194);
  return {
    wall: 0,
    fibers: 0.35 + push * 0.02,
    rearPaper: 1.55 + push * 0.08,
    folders: 2.85 + push * 0.16,
    person: 4.25 + push * 0.28,
    clippings: 5.7 + push * 0.42,
    topNote: 7.15 + push * 0.58,
    question: 9 + push * 0.78,
  };
};

export const getFidelityStagedTrainingCamera = (frame: number) => {
  const progress = Math.max(0, Math.min(1, frame / 194));
  return {
    scale: 1 + progress * 0.08,
    panX: progress * -30,
    panY: progress * 8,
  };
};

const PaperWall = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(128deg, #aeb3b1 0%, #a9aeac 52%, #9ba19f 100%)",
    }}
  >
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 21% 38%, rgba(71,66,56,.16), transparent 18%), radial-gradient(ellipse at 82% 68%, rgba(58,64,62,.19), transparent 22%), repeating-linear-gradient(3deg, transparent 0 23px, rgba(241,244,239,.07) 24px, transparent 27px)",
        mixBlendMode: "multiply",
      }}
    />
    {Array.from({ length: 420 }, (_, index) => {
      const x = deterministicTextureValue(index, 406158) * 100;
      const y = deterministicTextureValue(index, 50033) * 100;
      const width = 3 + deterministicTextureValue(index, 61833) * 29;
      const dark = index % 5 !== 0;
      return (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width,
            height: index % 17 === 0 ? 2 : 1,
            rotate: `${-42 + deterministicTextureValue(index, 195) * 84}deg`,
            borderRadius: "50%",
            backgroundColor: dark
              ? "rgba(43,49,48,.2)"
              : "rgba(242,245,240,.28)",
            opacity: 0.2 + deterministicTextureValue(index, 90) * 0.34,
          }}
        />
      );
    })}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(rgba(26,31,31,.26), transparent 17%, transparent 78%, rgba(22,25,24,.3)), radial-gradient(circle at 50% 46%, transparent 53%, rgba(22,27,27,.34) 100%)",
      }}
    />
  </AbsoluteFill>
);

const FiberPaper = ({ side }: { side: -1 | 1 }) => (
  <div
    style={{
      position: "absolute",
      left: side === -1 ? 56 : 160,
      top: -16,
      width: 430,
      height: 210,
      rotate: `${side * -4}deg`,
      background:
        "repeating-linear-gradient(7deg, rgba(67,65,55,.035) 0 1px, transparent 1px 7px), linear-gradient(118deg, #d8d5c9, #f0ede1 55%, #c9c5b8)",
      border: "2px solid rgba(70,69,61,.32)",
      boxShadow: `${side * 12}px 17px 19px rgba(35,35,31,.28)`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "25px 31px",
        color: "rgba(38,38,35,.66)",
        fontFamily: NEWSPAPER,
        fontSize: 18,
        lineHeight: 1.45,
        letterSpacing: ".08em",
      }}
    >
      ARCHIVE STUDY / FIELD NOTES
      <br />
      A PRACTICAL RECORD OF LEARNING
      <br />
      METHOD · PRACTICE · REVIEW
    </div>
    <div
      style={{
        position: "absolute",
        left: "57%",
        top: -30,
        width: 2,
        height: 280,
        rotate: "17deg",
        backgroundColor: "rgba(84,78,65,.2)",
      }}
    />
  </div>
);

const ArchiveFolder = ({
  side,
  progress,
  frame,
}: {
  side: -1 | 1;
  progress: number;
  frame: number;
}) => {
  const isLeft = side === -1;
  const x = isLeft ? 120 : 1180;
  const finale = reveal(frame, 122, 149);
  const parallaxX = side * reveal(frame, 0, 194) * 18;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: isLeft ? 245 : 224,
        width: 620,
        height: 520,
        opacity: progress * (1 - finale),
        translate: `${
          interpolate(progress, [0, 1], [side * 570, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }) + parallaxX
        }px ${interpolate(progress, [0, 1], [72, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })}px`,
        rotate: `${side * 1.8}deg`,
      }}
    >
      <FiberPaper side={side} />
      <div
        style={{
          position: "absolute",
          left: isLeft ? 50 : 332,
          top: 35,
          width: 235,
          height: 96,
          borderRadius: "17px 17px 0 0",
          background: "linear-gradient(100deg, #e1ac35, #c88718 72%, #a86a10)",
          border: "2px solid rgba(101,63,11,.45)",
          boxShadow: "11px 13px 15px rgba(38,34,27,.28)",
        }}
      >
        <div
          style={{
            margin: "17px 22px",
            color: "rgba(92,57,11,.78)",
            fontFamily: NEWSPAPER,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: ".12em",
          }}
        >
          FILE 0{isLeft ? "1" : "2"} / PATH
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 91,
          height: 354,
          clipPath: "polygon(0 2%, 100% 0, 98% 97%, 1% 100%)",
          background:
            "radial-gradient(circle at 28% 66%, rgba(104,67,16,.2), transparent 21%), repeating-linear-gradient(96deg, rgba(92,59,11,.035) 0 1px, transparent 1px 13px), linear-gradient(117deg, #edc45d 0%, #dca43a 58%, #bb7816 100%)",
          border: "2px solid rgba(94,59,13,.48)",
          boxShadow: `${side * 28}px 35px 34px rgba(31,31,27,.42), inset 0 3px rgba(255,239,167,.55), inset -20px -18px 32px rgba(108,61,7,.14)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 16,
            border: "2px dashed rgba(100,64,18,.4)",
            clipPath: "polygon(0 1%, 99% 0, 100% 98%, 1% 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "49%",
            top: -80,
            width: 4,
            height: 530,
            rotate: `${side * 7}deg`,
            background:
              "linear-gradient(90deg, transparent, rgba(93,58,12,.25), rgba(255,233,151,.16), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: isLeft ? 98 : 166,
            top: 94,
            color: "rgba(92,58,15,.88)",
            fontFamily: SONG,
            fontSize: 52,
            fontWeight: 800,
            textShadow: "1px 2px rgba(255,228,145,.45)",
          }}
        >
          {isLeft ? "共同起点" : "阶段训练"}
        </div>
        <div
          style={{
            position: "absolute",
            left: isLeft ? 64 : 320,
            top: 235,
            width: 190,
            height: 82,
            rotate: `${side * -5}deg`,
            border: "4px double rgba(119,49,34,.5)",
            color: "rgba(119,49,34,.62)",
            fontFamily: NEWSPAPER,
            fontSize: 20,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: ".16em",
          }}
        >
          VERIFIED
        </div>
      </div>
      <RoughClipping
        side={side}
        title={isLeft ? "问题从哪里开始" : "训练如何分阶段"}
      />
    </div>
  );
};

const RoughClipping = ({ side, title }: { side: -1 | 1; title: string }) => (
  <div
    style={{
      position: "absolute",
      left: -26,
      right: -24,
      top: 387,
      height: 112,
      rotate: `${side * -1.5}deg`,
      backgroundColor: "#171716",
      clipPath:
        "polygon(1% 6%, 7% 2%, 15% 7%, 24% 1%, 34% 5%, 44% 0, 55% 5%, 66% 1%, 75% 6%, 87% 1%, 99% 7%, 97% 93%, 88% 98%, 77% 94%, 66% 100%, 54% 95%, 42% 99%, 30% 94%, 17% 99%, 2% 92%)",
      boxShadow: `${side * 17}px 21px 19px rgba(24,23,20,.4)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#efede5",
      fontFamily: SONG,
      fontSize: 48,
      fontWeight: 900,
      letterSpacing: "-.04em",
      textShadow: "2px 1px rgba(177,45,49,.25)",
    }}
  >
    <span style={{ color: "#bd343b", fontSize: 69, marginRight: 8 }}>“</span>
    {title}
    <span style={{ color: "#bd343b", fontSize: 69, marginLeft: 8 }}>”</span>
  </div>
);

const DimensionalPerson = ({
  progress,
  frame,
}: {
  progress: number;
  frame: number;
}) => {
  const finale = reveal(frame, 122, 149);
  const parallax = reveal(frame, 0, 194) * 22;
  return (
    <div
      style={{
        position: "absolute",
        left: 794,
        top: 314,
        width: 340,
        height: 470,
        opacity: progress * (1 - finale * 0.84),
        translate: `${parallax}px ${finale * 320}px`,
        scale: interpolate(progress, [0, 1], [0.62, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.7)),
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 55,
          top: 44,
          width: 250,
          height: 388,
          borderRadius: "50% 50% 34% 35%",
          backgroundColor: "rgba(24,23,21,.36)",
          filter: "blur(18px)",
          translate: "30px 38px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 98,
          top: 0,
          width: 145,
          height: 145,
          borderRadius: "48% 52% 45% 49%",
          background:
            "radial-gradient(circle at 32% 24%, #55524c 0%, #272624 38%, #070707 82%)",
          boxShadow:
            "inset -20px -18px 25px #030303, 18px 25px 26px rgba(24,23,21,.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 120,
          width: 340,
          height: 340,
          borderRadius: "50% 50% 11% 12% / 62% 63% 13% 14%",
          background:
            "linear-gradient(126deg, #4a4843 0%, #242321 35%, #080808 76%, #020202 100%)",
          boxShadow:
            "inset 24px 14px 25px rgba(255,255,255,.08), 25px 34px 30px rgba(28,26,23,.52)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 220,
          width: 234,
          height: 3,
          rotate: "-13deg",
          backgroundColor: "rgba(255,255,255,.14)",
        }}
      />
    </div>
  );
};

const TopNote = ({ progress, frame }: { progress: number; frame: number }) => {
  const question = reveal(frame, 126, 148);
  return (
    <div
      style={{
        position: "absolute",
        left: 731,
        top: 72,
        width: 470,
        height: 126,
        rotate: `${-2.4 + question * 1.2}deg`,
        opacity: progress * (1 - question),
        scale: interpolate(progress, [0, 1], [1.22, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
        background:
          "repeating-linear-gradient(4deg, rgba(105,65,14,.05) 0 1px, transparent 1px 9px), linear-gradient(115deg, #efca72, #d59d31 66%, #b77416)",
        border: "2px solid rgba(101,62,13,.46)",
        boxShadow:
          "21px 26px 24px rgba(31,30,27,.45), inset 0 3px rgba(255,238,164,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#654512",
        fontFamily: SONG,
        fontSize: 47,
        fontWeight: 900,
      }}
    >
      继续追问：是谁塑造了路径？
      <div
        style={{
          position: "absolute",
          inset: 10,
          border: "2px dashed rgba(97,61,16,.3)",
        }}
      />
    </div>
  );
};

const FinalQuestion = ({ frame }: { frame: number }) => {
  const timeline = getFidelityStagedTrainingTimeline(frame);
  const ghost = reveal(frame, 136, 156);
  return (
    <AbsoluteFill
      style={{
        opacity: timeline.question,
        scale: interpolate(timeline.question, [0, 1], [0.84, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -92,
          top: 278,
          width: 2105,
          color: "#171817",
          fontFamily: SONG,
          fontSize: 258,
          fontWeight: 950,
          lineHeight: 0.9,
          letterSpacing: "-.1em",
          textAlign: "center",
          whiteSpace: "nowrap",
          textShadow:
            "12px 15px 0 rgba(70,74,71,.18), -2px 0 rgba(177,48,54,.16)",
        }}
      >
        谁培养了他们
        <span style={{ color: "#b42d35", fontSize: 305 }}>？</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 650,
          top: 444,
          width: 620,
          minHeight: 124,
          padding: "13px 28px",
          rotate: "-2deg",
          background: "linear-gradient(112deg, #efcb70, #d39a2d 70%, #b36d11)",
          border: "2px solid rgba(92,56,10,.4)",
          boxShadow: "17px 22px 21px rgba(30,29,26,.4)",
          color: "#684611",
          fontFamily: SONG,
          fontSize: 49,
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: ".04em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1.08,
        }}
      >
        继续推进问题
        <span
          style={{
            marginTop: 8,
            fontFamily: NEWSPAPER,
            fontSize: 16,
            letterSpacing: ".16em",
            opacity: 0.62,
          }}
        >
          CONTINUE THE INQUIRY
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: -62,
          width: 250,
          height: 330,
          opacity: 0.18 * ghost,
          filter: "blur(2px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 73,
            width: 105,
            height: 105,
            borderRadius: "50%",
            backgroundColor: "#101111",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 92,
            width: 250,
            height: 250,
            borderRadius: "50% 50% 10% 10%",
            backgroundColor: "#101111",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 124,
          top: 708,
          color: "rgba(228,231,226,.17)",
          fontFamily: SONG,
          fontSize: 112,
          fontWeight: 950,
          letterSpacing: "-.08em",
          opacity: timeline.conclusion,
          textShadow: "5px 7px 0 rgba(42,46,44,.12)",
        }}
      >
        问错了
      </div>
      <div
        style={{
          position: "absolute",
          left: 148,
          top: 792,
          color: "#a92730",
          fontFamily: SANS,
          fontSize: 46,
          fontWeight: 900,
          letterSpacing: ".03em",
          opacity: timeline.conclusion,
        }}
      >
        问错了 / ERROR
      </div>
      <div
        style={{
          position: "absolute",
          left: 132,
          top: 857,
          width: interpolate(timeline.conclusion, [0, 1], [0, 570], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          height: 18,
          rotate: "-1.4deg",
          backgroundColor: "#ad2932",
          clipPath: "polygon(0 27%, 99% 0, 100% 72%, 2% 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const FidelityStagedTrainingQuestion = () => {
  const frame = useCurrentFrame();
  const timeline = getFidelityStagedTrainingTimeline(frame);
  const tableauOut = 1 - reveal(frame, 122, 149);
  const camera = getFidelityStagedTrainingCamera(frame);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#aeb2af",
        fontFamily: SANS,
        scale: camera.scale,
        translate: `${camera.panX}px ${camera.panY}px`,
        transformOrigin: "50% 50%",
      }}
    >
      <PaperWall />
      <AbsoluteFill>
        <div style={{ opacity: timeline.tableau * tableauOut }}>
          <div
            style={{
              position: "absolute",
              left: 54,
              top: 43,
              color: "rgba(237,239,233,.84)",
              fontFamily: NEWSPAPER,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: ".13em",
              textShadow: "0 3px 3px rgba(24,27,26,.46)",
            }}
          >
            TRAINING PATH · FIELD ARCHIVE
          </div>
          <ArchiveFolder side={-1} progress={timeline.folders} frame={frame} />
          <ArchiveFolder side={1} progress={timeline.folders} frame={frame} />
          <DimensionalPerson progress={timeline.person} frame={frame} />
        </div>
        <TopNote progress={timeline.topNote} frame={frame} />
        <FinalQuestion frame={frame} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 46%, transparent 54%, rgba(18,22,22,.34) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
