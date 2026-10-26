import { Video } from "@remotion/media";
import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { REFERENCE_003_AROLL_CLIPS } from "../aroll-clips";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getQuestionCardSpeakerFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const PropBlock = ({ left, top, rotate = 0 }: { left: number; top: number; rotate?: number }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: 118,
      height: 72,
      rotate: `${rotate}deg`,
      background: "linear-gradient(145deg,#ffe167 0%,#d5a61d 68%,#785c13 100%)",
      boxShadow: "-20px 22px 18px rgba(40,34,24,.25)",
      transform: "skewY(-8deg)",
    }}
  />
);

const TypedLine = ({ text, progress }: { text: string; progress: number }) => {
  const visibleChars = Math.max(0, Math.floor(progress * text.length));

  return (
    <div style={{ minHeight: 74 }}>
      {text.slice(0, visibleChars)}
      <span style={{ opacity: progress > 0.05 && progress < 0.98 ? 1 : 0 }}>
        │
      </span>
    </div>
  );
};

const CoverCard = ({
  side,
  enter,
  copy,
  parallax,
}: {
  side: "left" | "right";
  enter: number;
  copy: ReactNode;
  parallax: number;
}) => {
  const isLeft = side === "left";
  const x = isLeft
    ? interpolate(parallax, [0, 0.45, 1], [-520, 158, 188], CLAMP)
    : interpolate(parallax, [0, 0.45, 1], [2120, 1292, 1660], CLAMP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: isLeft ? 96 : 126,
        width: 600,
        height: 820,
        opacity: enter,
        transform: `perspective(1400px) rotateY(${interpolate(enter, [0, 1], [isLeft ? 10 : -10, 0])}deg) rotateZ(${isLeft ? -0.8 : 0.7}deg) scale(${interpolate(enter, [0, 1], [0.9, isLeft ? 1.04 : 0.96])})`,
        transformOrigin: "center center",
        overflow: "hidden",
        border: "2px solid rgba(34,31,27,.86)",
        borderRadius: 10,
        backgroundColor: "#efeee8",
        backgroundImage:
          "linear-gradient(rgba(55,53,49,.055) 2px,transparent 2px),linear-gradient(90deg,rgba(55,53,49,.055) 2px,transparent 2px),radial-gradient(circle at 52% 38%,#fff 0%,#e7e5de 82%)",
        backgroundSize: "92px 70px,92px 70px,auto",
        boxShadow: "-42px 46px 38px rgba(19,17,15,.38)",
      }}
    >
      <PropBlock left={isLeft ? 34 : 390} top={isLeft ? 44 : 72} rotate={isLeft ? -8 : 12} />
      <PropBlock left={isLeft ? 402 : 48} top={isLeft ? 620 : 596} rotate={isLeft ? 12 : -10} />
      <div
        style={{
          position: "absolute",
          left: 62,
          right: 50,
          top: 260,
          color: "#171512",
          fontFamily: R03_SERIF,
          fontSize: 58,
          fontWeight: 600,
          lineHeight: 1.28,
          letterSpacing: -2,
        }}
      >
        {copy}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 122,
          padding: "22px 36px",
          boxSizing: "border-box",
          background: "#181716",
          color: "#f2eee5",
          fontFamily: R03_SANS,
          fontSize: 30,
          letterSpacing: 2,
        }}
      >
        FIELD REPORT / 04
        <div style={{ marginTop: 8, color: "#9b968e", fontSize: 14, letterSpacing: 3 }}>
          NOTES ON PRACTICAL SYSTEMS
        </div>
      </div>
    </div>
  );
};

export const QuestionCardSpeakerFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getQuestionCardSpeakerFidelityState(frame);
  const clip = REFERENCE_003_AROLL_CLIPS.questionCardSpeaker;
  const leftEnter = spring({
    frame: state.leftCardSpringFrame,
    fps,
    config: { damping: 24, stiffness: 74, mass: 1.05 },
    durationInFrames: 54,
  });
  const rightEnter = spring({
    frame: state.rightCardSpringFrame,
    fps,
    config: { damping: 24, stiffness: 74, mass: 1.05 },
    durationInFrames: 54,
  });
  const camera = interpolate(state.camera, [0, 1], [1.025, 1.065], CLAMP);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1d1a18", fontFamily: R03_SANS }}>
      <AbsoluteFill style={{ opacity: state.video, scale: camera }}>
        <Video
          src={staticFile(clip.src)}
          trimBefore={clip.trimBefore}
          muted
          objectFit={clip.objectFit}
          style={{
            width: "100%",
            height: "100%",
            objectPosition: clip.objectPosition,
            filter: "saturate(.76) contrast(1.04) brightness(.86)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 43%,transparent 26%,rgba(21,17,14,.2) 70%,rgba(11,9,8,.48) 100%),linear-gradient(90deg,rgba(22,18,15,.28),transparent 30%,transparent 70%,rgba(22,18,15,.28))",
        }}
      />
      <CoverCard
        side="left"
        enter={leftEnter * state.leftCard}
        copy={
          <>
            <TypedLine text="复杂问题" progress={state.copy1} />
            <TypedLine text="先找约束" progress={state.copy2} />
            <TypedLine text="再做验证" progress={state.copy3} />
          </>
        }
        parallax={state.parallax}
      />
      <CoverCard
        side="right"
        enter={rightEnter * state.rightCard}
        copy={
          <>
            <TypedLine text="系统变化" progress={state.rightCard} />
            <TypedLine text="如何保持" progress={state.copy1} />
            <TypedLine text="持续清晰" progress={state.copy2} />
          </>
        }
        parallax={state.parallax}
      />
      <AbsoluteFill
        style={{
          opacity: 0.13,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E\")",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
