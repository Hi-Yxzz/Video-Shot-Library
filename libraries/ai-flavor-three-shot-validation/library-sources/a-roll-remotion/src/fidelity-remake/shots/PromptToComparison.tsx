import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {interpolateCameraTrack, segmentProgress} from "../motion";
import {FIDELITY_REFERENCE_SPECS} from "../reference-specs";
import {CameraLayer, TextureLayer} from "../shared";

const spec = FIDELITY_REFERENCE_SPECS.find(
  (item) => item.slug === "prompt-to-comparison",
)!;

const FONT = '"Alibaba PuHuiTi 2", "PingFang SC", "Microsoft YaHei", sans-serif';
const LATIN_FONT = '"Helvetica Neue", Inter, Arial, sans-serif';

const fade = (frame: number, from: number, to: number) =>
  Easing.out(Easing.cubic)(segmentProgress(frame, from, to));

export const PromptToComparison = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);
  const promptDraw = fade(frame, 0, 24);
  const promptCopy = fade(frame, 6, 32);
  const promptOut = 1 - segmentProgress(frame, 62, 70);
  const comparisonIn = fade(frame, 64, 74);
  const scanX = interpolate(frame, [58, 72], [-260, 2140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const parallax = camera.scale - 1;

  return (
    <AbsoluteFill style={{backgroundColor: spec.palette.background, overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          translate: `${parallax * -180}px ${parallax * 70}px`,
          background:
            "linear-gradient(118deg, transparent 0 21%, rgba(72,139,99,.06) 33%, transparent 44%), linear-gradient(118deg, transparent 0 52%, rgba(45,112,77,.075) 64%, transparent 76%), radial-gradient(circle at 64% 38%, #0e3022 0%, #0a261c 31%, #071c16 67%, #04110d 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          translate: `${parallax * -430}px ${parallax * 120}px`,
          opacity: 0.55,
          background:
            "linear-gradient(117deg, transparent 0 17%, rgba(113,183,136,.09) 18%, transparent 31%), linear-gradient(117deg, transparent 0 68%, rgba(105,181,132,.055) 69%, transparent 82%)",
          filter: "blur(22px)",
        }}
      />

      <CameraLayer {...camera}>
        <AbsoluteFill
          style={{
            opacity: promptOut,
            filter: `blur(${(1 - promptOut) * 12}px)`,
            translate: `${1000 * (1 - segmentProgress(frame, 0, 28))}px 0`,
          }}
        >
          <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}>
            <rect
              x="346"
              y="390"
              width="1228"
              height="248"
              rx="62"
              fill="rgba(13,50,36,.2)"
              stroke={spec.palette.border}
              strokeWidth="5"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - promptDraw}
              style={{filter: "drop-shadow(0 0 12px rgba(146,218,170,.22))"}}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 420,
              top: 414,
              width: 1080,
              height: 210,
              color: spec.palette.text,
              fontFamily: FONT,
              fontSize: 76,
              fontWeight: 500,
              letterSpacing: "0.015em",
              lineHeight: 1.35,
              opacity: promptCopy,
              translate: `${(1 - promptCopy) * 42}px 0`,
              clipPath: `inset(0 ${100 - promptCopy * 100}% 0 0)`,
              overflow: "hidden",
              textShadow: "0 0 16px rgba(177,230,194,.18)",
            }}
          >
            <div>帮我制作一个运营数据看板，</div>
            <div>并比较两种通用方案的表现</div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{opacity: comparisonIn}}>
          <div
            style={{
              position: "absolute",
              left: 154,
              top: 245,
              color: spec.palette.text,
              fontFamily: FONT,
              fontSize: 90,
              fontWeight: 600,
              letterSpacing: ".01em",
              textShadow: "-2px 0 rgba(49,156,255,.28), 2px 0 rgba(255,87,66,.22), 0 0 28px rgba(188,233,201,.16)",
            }}
          >
            对比项
          </div>
          {["评测平台", "综合得分", "任务成功率"].map((label, index) => {
            const row = fade(frame, 74 + index * 3, 94 + index * 3);
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: 174,
                  top: 424 + index * 108,
                  color: index === 0 ? spec.palette.muted : spec.palette.text,
                  fontFamily: FONT,
                  fontSize: index === 0 ? 49 : 54,
                  fontWeight: 600,
                  opacity: row,
                  translate: `${(1 - row) * -42}px 0`,
                  textShadow: "-1.5px 0 rgba(43,147,255,.27), 1.5px 0 rgba(255,84,65,.22)",
                }}
              >
                {label}
              </div>
            );
          })}
          <ResultColumn
            frame={frame}
            fps={fps}
            left={600}
            heading="方案 Alpha"
            score="1648 分"
            rate="78%"
            direction="up"
          />
          <ResultColumn
            frame={frame}
            fps={fps}
            left={1200}
            heading="方案 Beta"
            score="1592 分"
            rate="64%"
            direction="down"
          />
          <div
            style={{
              position: "absolute",
              left: 178,
              top: 752,
              width: 1540,
              color: spec.palette.muted,
              fontFamily: FONT,
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.85,
              letterSpacing: ".025em",
              opacity: fade(frame, 98, 120),
            }}
          >
            <div>在统一任务集与相同运行环境下完成测试，数据仅作版式示例。</div>
            <div>方案 Alpha 在综合得分与任务成功率两项均保持领先。</div>
          </div>
        </AbsoluteFill>
      </CameraLayer>

      {frame >= 58 && frame <= 74 ? (
        <div
          style={{
            position: "absolute",
            left: scanX,
            top: -80,
            width: 170,
            height: 1240,
            rotate: "12deg",
            background: "linear-gradient(90deg, transparent, rgba(133,232,165,.24), transparent)",
            filter: "blur(16px)",
          }}
        />
      ) : null}
      <TextureLayer
        grainColor="rgba(210,239,219,.78)"
        grainOpacity={0.15}
        grainSize={4}
        vignette="radial-gradient(circle at 52% 47%, transparent 36%, rgba(0,8,5,.77) 100%)"
        blendMode="soft-light"
      />
    </AbsoluteFill>
  );
};

const ResultColumn = ({
  frame,
  fps,
  left,
  heading,
  score,
  rate,
  direction,
}: {
  frame: number;
  fps: number;
  left: number;
  heading: string;
  score: string;
  rate: string;
  direction: "up" | "down";
}) => {
  const headingIn = fade(frame, 78, 98);
  const valueIn = fade(frame, 84, 106);
  const arrowFrame = frame - (direction === "up" ? 104 : 107);
  const arrowScale = spring({
    frame: Math.max(0, arrowFrame),
    fps,
    config: {damping: 12, stiffness: 170, mass: 0.65},
  });
  const arrowColor = direction === "up" ? spec.palette.accent : spec.palette.secondaryAccent;

  return (
    <div style={{position: "absolute", left, top: 0, width: 540}}>
      <div
        style={{
          position: "absolute",
          top: 247,
          width: 540,
          color: spec.palette.text,
          fontFamily: LATIN_FONT,
          fontSize: 82,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: ".018em",
          opacity: headingIn,
          translate: `0 ${(1 - headingIn) * 32}px`,
          whiteSpace: "nowrap",
          textShadow: "0 0 30px rgba(195,237,208,.12)",
        }}
      >
        {heading}
      </div>
      <div
        style={{
          position: "absolute",
          top: 429,
          color: spec.palette.text,
          fontFamily: FONT,
          fontSize: 51,
          fontWeight: 500,
          fontStyle: "italic",
          opacity: valueIn,
        }}
      >
        通用任务竞技场
      </div>
      {[score, rate].map((value, index) => (
        <div
          key={value}
          style={{
            position: "absolute",
            top: 535 + index * 108,
            color: spec.palette.text,
            fontFamily: FONT,
            fontSize: 57,
            fontWeight: 500,
            fontStyle: "italic",
            opacity: valueIn,
            translate: `0 ${(1 - valueIn) * 26}px`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
          <span
            style={{
              display: "inline-block",
              marginLeft: 18,
              color: arrowColor,
              fontFamily: LATIN_FONT,
              fontSize: 86,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: 0.55,
              scale: arrowScale,
              translate: `0 ${direction === "up" ? 8 : 15}px`,
              textShadow: `0 0 18px ${arrowColor}55`,
            }}
          >
            {direction === "up" ? "↑" : "↓"}
          </span>
        </div>
      ))}
    </div>
  );
};
