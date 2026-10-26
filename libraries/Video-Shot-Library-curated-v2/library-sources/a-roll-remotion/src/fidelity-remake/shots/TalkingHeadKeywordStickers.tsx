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
  (item) => item.slug === "talking-head-keyword-stickers",
)!;

const SERIF = '"Songti SC", "Noto Serif SC", Georgia, serif';
const SANS = '"PingFang SC", "Source Han Sans SC", sans-serif';

const ease = (frame: number, from: number, to: number) =>
  Easing.out(Easing.cubic)(segmentProgress(frame, from, to));

type StickerProps = {
  frame: number;
  fps: number;
  start: number;
  x: number;
  y: number;
  width: number;
  rotation: number;
  word: string;
  gloss: string;
  exitIndex: number;
};

const Sticker = ({
  frame,
  fps,
  start,
  x,
  y,
  width,
  rotation,
  word,
  gloss,
  exitIndex,
}: StickerProps) => {
  const arrival = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.56 },
  });
  const exit = ease(frame, 111 + exitIndex * 2, 125);
  const opacity = segmentProgress(frame, start, start + 2) * (1 - exit);
  const direction = x < 900 ? -1 : 1;
  const yParallax = Math.sin(frame / 20 + exitIndex) * 2.5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: 142,
        opacity,
        translate: `${interpolate(arrival, [0, 1], [direction * 180, 0]) + exit * direction * 170}px ${interpolate(arrival, [0, 1], [-18, 0]) + yParallax}px`,
        rotate: `${interpolate(arrival, [0, 1], [rotation + direction * 10, rotation])}deg`,
        scale: interpolate(arrival, [0, 0.7, 1], [0.62, 1.12, 1]),
        filter: "drop-shadow(10px 13px 8px rgba(44,36,32,.27))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "11px 7px -5px 15px",
          background: "#a22b26",
          opacity: 0.72,
          clipPath:
            "polygon(1% 13%,8% 5%,18% 11%,29% 2%,40% 9%,54% 2%,68% 10%,81% 4%,99% 12%,96% 88%,86% 96%,74% 91%,63% 99%,49% 92%,34% 98%,20% 91%,3% 97%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, rgba(228,222,211,.86) 0 3px, rgba(255,252,244,.97) 4px 7px)",
          clipPath:
            "polygon(0 9%,7% 3%,17% 10%,27% 1%,39% 8%,51% 2%,63% 9%,76% 3%,88% 9%,100% 3%,97% 91%,89% 97%,77% 91%,65% 99%,53% 92%,39% 99%,27% 91%,14% 97%,1% 89%)",
          border: "1px solid rgba(160,150,138,.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 55,
          top: 7,
          color: "#1e1b18",
          fontFamily: "Georgia, serif",
          fontSize: 58,
          lineHeight: 1,
        }}
      >
        “
      </div>
      <div
        style={{
          position: "absolute",
          right: 49,
          top: 7,
          color: "#1e1b18",
          fontFamily: "Georgia, serif",
          fontSize: 58,
          lineHeight: 1,
        }}
      >
        ”
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: spec.palette.accent,
          fontFamily: SERIF,
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: ".05em",
          textShadow: "1px 1px 0 #7c1e1b",
        }}
      >
        {word}
      </div>
      <div
        style={{
          position: "absolute",
          left: "48%",
          bottom: 17,
          color: "rgba(83,75,69,.42)",
          fontFamily: "Georgia, serif",
          fontSize: 18,
          fontStyle: "italic",
        }}
      >
        {gloss}
      </div>
    </div>
  );
};

export const TalkingHeadKeywordStickers = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);

  return (
    <AbsoluteFill
      style={{ overflow: "hidden", backgroundColor: spec.palette.background }}
    >
      <CameraLayer {...camera}>
        <Video
          src={staticFile(FIDELITY_AROLL_CLIPS.talkingHead.src)}
          trimBefore={FIDELITY_AROLL_CLIPS.talkingHead.trimBefore}
          durationInFrames={FIDELITY_AROLL_CLIPS.talkingHead.durationInFrames}
          muted
          objectFit={FIDELITY_AROLL_CLIPS.talkingHead.objectFit}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: FIDELITY_AROLL_CLIPS.talkingHead.scale,
          }}
        />
      </CameraLayer>
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 50,
          color: "rgba(255,255,255,.86)",
          fontFamily: SANS,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: ".04em",
        }}
      >
        知识讲堂 · KNOWLEDGE
      </div>
      <Sticker
        frame={frame}
        fps={fps}
        start={11}
        x={252}
        y={190}
        width={470}
        rotation={-1.4}
        word="证据"
        gloss="Evidence"
        exitIndex={0}
      />
      <Sticker
        frame={frame}
        fps={fps}
        start={18}
        x={1220}
        y={365}
        width={490}
        rotation={1.2}
        word="方法"
        gloss="Method"
        exitIndex={1}
      />
      <Sticker
        frame={frame}
        fps={fps}
        start={25}
        x={192}
        y={505}
        width={470}
        rotation={-1.1}
        word="边界"
        gloss="Boundary"
        exitIndex={2}
      />
      <Sticker
        frame={frame}
        fps={fps}
        start={32}
        x={1245}
        y={650}
        width={470}
        rotation={1.5}
        word="结论"
        gloss="Conclusion"
        exitIndex={3}
      />
      <div
        style={{
          position: "absolute",
          left: 490,
          right: 490,
          bottom: 42,
          color: "white",
          fontFamily: SANS,
          fontSize: 43,
          fontWeight: 450,
          textAlign: "center",
          textShadow: "0 2px 5px rgba(0,0,0,.7)",
          opacity: 1 - ease(frame, 116, 125),
        }}
      >
        把复杂问题拆成四个可验证的关键词
      </div>
      <TextureLayer
        grainColor="rgba(50,46,43,.75)"
        grainOpacity={0.035}
        grainSize={4}
        vignette="radial-gradient(circle at 51% 46%, transparent 60%, rgba(30,28,27,.25) 100%)"
        blendMode="multiply"
      />
    </AbsoluteFill>
  );
};
