import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { interpolateCameraTrack, segmentProgress } from "../motion";
import {
  getOrbitalBlinkOpacity,
  getStarTwinkleOpacity,
} from "../motion-continuity";
import { FIDELITY_REFERENCE_SPECS } from "../reference-specs";
import { CameraLayer, TextureLayer } from "../shared";

const spec = FIDELITY_REFERENCE_SPECS.find(
  (item) => item.slug === "orbital-tech-title",
)!;

const DISPLAY = '"Space Grotesk", "Arial Black", "PingFang SC", sans-serif';

const craters = [
  { x: 16, y: 22, size: 13 },
  { x: 56, y: 15, size: 8 },
  { x: 75, y: 35, size: 15 },
  { x: 31, y: 52, size: 19 },
  { x: 63, y: 69, size: 11 },
  { x: 83, y: 76, size: 7 },
  { x: 18, y: 80, size: 9 },
] as const;

const stars = [
  { x: 11, y: 31, size: 3 },
  { x: 19, y: 69, size: 2 },
  { x: 29, y: 17, size: 2 },
  { x: 39, y: 81, size: 3 },
  { x: 49, y: 23, size: 2 },
  { x: 57, y: 73, size: 2 },
  { x: 67, y: 18, size: 3 },
  { x: 76, y: 59, size: 2 },
  { x: 87, y: 42, size: 3 },
  { x: 92, y: 81, size: 2 },
] as const;

const Moon = ({
  size,
  left,
  top,
  driftX,
  driftY,
  frame,
}: {
  size: number;
  left: number;
  top: number;
  driftX: number;
  driftY: number;
  frame: number;
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      translate: `${(frame / 119) * driftX}px ${(frame / 119) * driftY}px`,
      background:
        "radial-gradient(circle at 30% 25%, rgba(230,231,225,.94), rgba(143,150,151,.95) 34%, rgba(68,75,79,.98) 68%, #252a2d 100%)",
      boxShadow:
        "inset -52px -38px 90px rgba(4,7,10,.72), inset 22px 14px 35px rgba(255,255,245,.18), 0 0 5px #77aef7, 0 0 34px rgba(55,105,177,.24)",
      filter: "saturate(.62) contrast(1.13)",
    }}
  >
    <AbsoluteFill
      style={{
        opacity: 0.55,
        background:
          "repeating-radial-gradient(circle at 36% 42%, transparent 0 16px, rgba(240,240,230,.055) 17px, rgba(13,17,20,.06) 21px)",
      }}
    />
    {craters.map((crater, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: `${crater.x}%`,
          top: `${crater.y}%`,
          width: `${crater.size}%`,
          height: `${crater.size * 0.72}%`,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 62% 65%, rgba(38,43,46,.8), rgba(78,84,85,.58) 52%, rgba(225,225,215,.18) 56%, transparent 70%)",
          boxShadow: "inset 7px 6px 12px rgba(10,13,16,.42)",
          rotate: `${index * 19 - 22}deg`,
        }}
      />
    ))}
  </div>
);

export const OrbitalTechTitle = () => {
  const frame = useCurrentFrame();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);
  const titleResolve = Easing.out(Easing.cubic)(segmentProgress(frame, 0, 18));
  const frameDraw = Easing.out(Easing.cubic)(segmentProgress(frame, 6, 18));
  const sceneSettle = segmentProgress(frame, 22, 106);
  const dissolve = Easing.in(Easing.cubic)(segmentProgress(frame, 108, 119));
  const blink = getOrbitalBlinkOpacity(frame);

  return (
    <AbsoluteFill
      style={{ overflow: "hidden", backgroundColor: spec.palette.background }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 53% 45%, #11151c 0%, #080a0f 54%, #020305 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: 1 - dissolve,
          translate: `${sceneSettle * -4}px ${sceneSettle * 3}px`,
        }}
      >
        {stars.map((star, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              backgroundColor: index % 3 === 0 ? "#79b9ff" : "#88919d",
              opacity: getStarTwinkleOpacity(frame, index),
              boxShadow: index % 3 === 0 ? "0 0 10px #3d8fff" : "none",
            }}
          />
        ))}
      </AbsoluteFill>

      <CameraLayer {...camera}>
        <div
          style={{
            position: "absolute",
            left: 108,
            top: 86,
            width: 1610,
            height: 850,
            opacity: interpolate(frameDraw, [0, 1], [0, 0.22]),
            translate: `${sceneSettle * -8}px ${sceneSettle * 5}px`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              color: "transparent",
              WebkitTextStroke: "5px #4b5159",
              fontFamily: DISPLAY,
              fontSize: 550,
              fontWeight: 800,
              lineHeight: 0.82,
              letterSpacing: "-.08em",
              opacity: 0.32,
            }}
          >
            未来
          </div>
          <div
            style={{
              position: "absolute",
              right: -45,
              bottom: -120,
              color: "rgba(93,99,105,.5)",
              fontFamily: DISPLAY,
              fontSize: 430,
              fontWeight: 900,
              lineHeight: 1,
              textShadow: "0 12px 24px rgba(0,0,0,.72)",
            }}
          >
            序
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 472,
            top: 382,
            width: 980,
            height: 322,
            opacity: frameDraw * (1 - dissolve),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: frameDraw * 390,
              height: 3,
              backgroundColor: "#525a64",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: frameDraw * 390,
              height: 3,
              backgroundColor: "#525a64",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: frameDraw * 390,
              height: 3,
              backgroundColor: "#525a64",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: frameDraw * 390,
              height: 3,
              backgroundColor: "#525a64",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 3,
              height: frameDraw * 66,
              backgroundColor: "#525a64",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 3,
              height: frameDraw * 66,
              backgroundColor: "#525a64",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -7,
              top: -7,
              width: 14,
              height: 14,
              backgroundColor: "#bde3ff",
              boxShadow: "0 0 18px #3d8fff",
              opacity: blink,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -7,
              bottom: -7,
              width: 14,
              height: 14,
              backgroundColor: "#bde3ff",
              boxShadow: "0 0 18px #3d8fff",
              opacity: blink,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 476,
            top: 412,
            width: 990,
            height: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: (0.28 + titleResolve * 0.72) * (1 - dissolve),
            filter: `blur(${interpolate(titleResolve, [0, 1], [17, 0])}px)`,
            scale: interpolate(titleResolve, [0, 1], [0.94, 1]),
          }}
        >
          <div
            style={{
              color: "transparent",
              background:
                "linear-gradient(180deg, #fafaf7 0%, #bfc3c6 49%, #f0f0ec 58%, #858b91 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextStroke: "1px rgba(255,255,255,.72)",
              fontFamily: DISPLAY,
              fontSize: 240,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: ".035em",
              textShadow: "0 0 22px rgba(235,240,245,.44)",
            }}
          >
            NOVA
          </div>
          <div
            style={{
              width: 25,
              height: 25,
              rotate: "45deg",
              backgroundColor: "#8fd7f3",
              boxShadow: "0 0 17px #3d8fff",
            }}
          />
          <div
            style={{
              color: "transparent",
              background:
                "linear-gradient(180deg, #d5efff 0%, #65a9f2 45%, #5060d3 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextStroke: "2px rgba(193,225,255,.72)",
              fontFamily: DISPLAY,
              fontSize: 240,
              fontWeight: 780,
              lineHeight: 0.92,
              letterSpacing: ".025em",
              textShadow: "0 0 27px rgba(61,143,255,.68)",
            }}
          >
            X1
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 550,
            top: 160,
            width: 820,
            height: 720,
            border: "2px solid rgba(82,105,132,.18)",
            borderRadius: "50%",
            rotate: `${-22 + sceneSettle * 3}deg`,
            scale: `${1 + sceneSettle * 0.025} .36`,
            opacity: 0.48 * (1 - dissolve),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 625,
            top: 207,
            width: 670,
            height: 640,
            border: "1px dashed rgba(85,145,210,.22)",
            borderRadius: "50%",
            rotate: `${18 - sceneSettle * 2}deg`,
            scale: "1 .42",
            opacity: 0.46 * (1 - dissolve),
          }}
        />
      </CameraLayer>

      <div style={{ opacity: 1 - dissolve }}>
        <Moon
          size={620}
          left={1500}
          top={-190}
          driftX={-14}
          driftY={8}
          frame={frame}
        />
        <Moon
          size={590}
          left={-150}
          top={690}
          driftX={13}
          driftY={-9}
          frame={frame}
        />
      </div>

      <TextureLayer
        grainColor="rgba(170,182,194,.8)"
        grainOpacity={0.14}
        grainSize={4}
        vignette="radial-gradient(circle at 50% 48%, transparent 34%, rgba(0,0,0,.86) 100%)"
        blendMode="screen"
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: dissolve,
          backgroundColor: "#080a0f",
        }}
      />
    </AbsoluteFill>
  );
};
