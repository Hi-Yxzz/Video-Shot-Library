import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { FIDELITY_AROLL_CLIPS } from "../aroll-clips";
import { interpolateCameraTrack, segmentProgress } from "../motion";
import { FIDELITY_REFERENCE_SPECS } from "../reference-specs";
import { CameraLayer, TextureLayer } from "../shared";

const spec = FIDELITY_REFERENCE_SPECS.find(
  (item) => item.slug === "chat-bubble-ladder",
)!;

const SANS =
  '"Source Han Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif';

const eased = (frame: number, from: number, to: number) =>
  Easing.out(Easing.cubic)(segmentProgress(frame, from, to));

type BubbleProps = {
  frame: number;
  fps: number;
  start: number;
  x: number;
  y: number;
  width: number;
  height: number;
  textStart: number;
  children: string;
};

const Bubble = ({
  frame,
  fps,
  start,
  x,
  y,
  width,
  height,
  textStart,
  children,
}: BubbleProps) => {
  const open = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 15, stiffness: 128, mass: 0.72 },
  });
  const reveal = eased(frame, textStart, textStart + 28);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        border: `3px solid ${spec.palette.border}`,
        borderRadius: 42,
        background:
          "linear-gradient(145deg, rgba(251,249,245,.84), rgba(231,227,221,.76))",
        boxShadow:
          "0 18px 28px rgba(69,65,59,.11), inset 0 1px 0 rgba(255,255,255,.82)",
        scale: `${interpolate(open, [0, 1], [0.18, 1])} 1`,
        transformOrigin: "left center",
        opacity: segmentProgress(frame, start, start + 5),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 42,
          top: height < 170 ? 31 : 43,
          color: spec.palette.text,
          fontFamily: SANS,
          fontSize: height < 170 ? 45 : 41,
          fontWeight: 350,
          lineHeight: 1.5,
          letterSpacing: ".008em",
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
          whiteSpace: height < 170 ? "nowrap" : "normal",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ChatBubbleLadder = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);
  const pointerOne = eased(frame, 18, 28);
  const pointerTwo = eased(frame, 76, 92);

  return (
    <AbsoluteFill
      style={{ overflow: "hidden", backgroundColor: spec.palette.background }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 48% 48%, #f1efeb 0%, #dfdcda 55%, #c8c5c3 100%)",
        }}
      />
      <CameraLayer {...camera}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: FIDELITY_AROLL_CLIPS.chatBubble.panelWidth,
            overflow: "hidden",
            boxShadow: "24px 0 42px rgba(53,50,47,.2)",
            opacity: eased(frame, 0, 20),
          }}
        >
          <Video
            src={staticFile(FIDELITY_AROLL_CLIPS.chatBubble.src)}
            trimBefore={FIDELITY_AROLL_CLIPS.chatBubble.trimBefore}
            durationInFrames={FIDELITY_AROLL_CLIPS.chatBubble.durationInFrames}
            muted
            objectFit={FIDELITY_AROLL_CLIPS.chatBubble.objectFit}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <svg
          width="1920"
          height="1080"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <path
            d="M504 650 L854 486"
            stroke="#393836"
            strokeWidth="24"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - pointerOne}
            opacity={0.92}
          />
          <path
            d="M523 672 L772 702"
            stroke="#77736c"
            strokeWidth="17"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - pointerTwo}
            opacity={0.72}
          />
        </svg>

        <Bubble
          frame={frame}
          fps={fps}
          start={24}
          textStart={35}
          x={824}
          y={367}
          width={826}
          height={132}
        >
          今天的方案，需要补充哪些细节？
        </Bubble>
        <Bubble
          frame={frame}
          fps={fps}
          start={76}
          textStart={90}
          x={742}
          y={560}
          width={906}
          height={248}
        >
          好的，我会沿用昨天的结构，补齐时间安排与预算说明。
        </Bubble>
      </CameraLayer>
      <TextureLayer
        grainColor="rgba(74,70,66,.65)"
        grainOpacity={0.045}
        grainSize={4}
        vignette="radial-gradient(ellipse at 50% 44%, transparent 54%, rgba(55,52,49,.42) 100%)"
        blendMode="multiply"
      />
    </AbsoluteFill>
  );
};
