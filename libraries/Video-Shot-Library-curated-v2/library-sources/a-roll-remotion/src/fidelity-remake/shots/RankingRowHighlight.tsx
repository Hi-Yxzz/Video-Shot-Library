import type {ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {interpolateCameraTrack, segmentProgress} from "../motion";
import {FIDELITY_REFERENCE_SPECS} from "../reference-specs";
import {CameraLayer, TextureLayer} from "../shared";

const spec = FIDELITY_REFERENCE_SPECS.find(
  (item) => item.slug === "ranking-row-highlight",
)!;

const DISPLAY = 'Impact, "Arial Narrow", "PingFang SC", sans-serif';
const MONO = '"IBM Plex Mono", "SFMono-Regular", Menlo, monospace';
const SANS = '"Arial Narrow", "PingFang SC", sans-serif';

const ease = (frame: number, from: number, to: number) =>
  Easing.inOut(Easing.cubic)(segmentProgress(frame, from, to));

const rows = [
  {rank: "1", entity: "Aster-5 Max", studio: "星环实验室", score: "51", size: "753B (40B ACT)"},
  {rank: "2", entity: "Nova-M3", studio: "云图研究院", score: "44", size: "428B (23B ACT)"},
  {rank: "3", entity: "DeepField R1", studio: "深域智能", score: "44", size: "1.6T (49B ACT)"},
  {rank: "4", entity: "Moon K2.6", studio: "月之暗面", score: "44", size: "1T (32B ACT)"},
  {rank: "5", entity: "Mimo V25", studio: "微澜科技", score: "42", size: "1.0T (42B ACT)"},
  {rank: "6", entity: "Vector Flash", studio: "向量引擎", score: "40", size: "284B (13B ACT)"},
];

const rowTop = (index: number) => 262 + index * 118;

export const RankingRowHighlight = () => {
  const frame = useCurrentFrame();
  const camera = interpolateCameraTrack(spec.cameraKeyframes, frame);
  const firstZoom = ease(frame, 36, 54) * (1 - ease(frame, 60, 78));
  const secondZoom = ease(frame, 90, 111) * (1 - ease(frame, 116, 133));
  const activeZoom = Math.max(firstZoom, secondZoom);
  const selectionIndex = secondZoom > firstZoom ? 3 : 0;
  const finalHighlights = ease(frame, 142, 166);
  const titleOpacity = ease(frame, 0, 12);
  const introBlur = interpolate(frame, [0, 12], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: spec.palette.background}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 73% 34%, rgba(103,105,78,.34), transparent 43%), radial-gradient(circle at 45% 60%, #303126 0%, #171914 68%, #0d0e0c 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -65,
          top: 230,
          color: "rgba(205,201,154,.08)",
          fontFamily: DISPLAY,
          fontSize: 440,
          lineHeight: 0.8,
          letterSpacing: "-.05em",
          translate: `${activeZoom * -90}px ${activeZoom * 20}px`,
          opacity: activeZoom,
        }}
      >
        排行
      </div>

      <CameraLayer {...camera}>
        <div
          style={{
            position: "absolute",
            left: 176,
            top: 102,
            width: 1568,
            opacity: 0.24 + titleOpacity * 0.76,
            filter: `blur(${introBlur}px)`,
          }}
        >
          <div
            style={{
              color: spec.palette.accent,
              fontFamily: SANS,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: ".015em",
            }}
          >
            DATASET · GENERAL INTELLIGENCE INDEX
          </div>
          <div
            style={{
              marginTop: 9,
              color: spec.palette.text,
              fontFamily: SANS,
              fontSize: 31,
              letterSpacing: ".025em",
            }}
          >
            截至本期 · 六个通用样本的综合表现与规模对照
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: selectionIndex === 0 ? "50% 33%" : "50% 58%",
          }}
        >
          {rows.map((row, index) => {
            const rowIn = Easing.out(Easing.cubic)(segmentProgress(frame, index * 2, 14 + index * 2));
            const selected = index === selectionIndex;
            const finalSelected = index === 0 || index === 1 || index === 3 || index === 5;
            const firstBand = selected ? ease(frame, selectionIndex === 0 ? 30 : 88, selectionIndex === 0 ? 42 : 102) : 0;
            const band = Math.max(firstBand, finalSelected ? finalHighlights : 0);
            const dim = activeZoom > 0.03 && !selected;
            return (
              <div
                key={row.rank}
                style={{
                  position: "absolute",
                  left: 170,
                  top: rowTop(index),
                  width: 1580,
                  height: 105,
                  borderRadius: 7,
                  overflow: "hidden",
                  backgroundColor: band > 0 ? `rgba(220,190,91,${0.94 * band})` : "rgba(10,11,9,.47)",
                  boxShadow: band > 0 ? `0 0 ${28 * band}px rgba(210,175,67,.18), inset 0 0 0 2px rgba(255,225,131,.12)` : "inset 0 -1px 0 rgba(230,230,215,.08)",
                  color: band > 0 ? "#efe6b2" : spec.palette.text,
                  opacity: rowIn * (dim ? interpolate(activeZoom, [0, 1], [1, 0.18]) : 1),
                  filter: dim ? `blur(${activeZoom * 8}px)` : "none",
                  translate: `${(1 - rowIn) * 80}px 0`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 15,
                    top: -18,
                    width: 118,
                    color: band > 0 ? "rgba(117,101,54,.74)" : "#f3f0e6",
                    fontFamily: DISPLAY,
                    fontSize: 116,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-.04em",
                  }}
                >
                  {row.rank}
                </div>
                <Cell left={145} width={390} strong>{row.entity}</Cell>
                <Cell left={555} width={300}>{row.studio}</Cell>
                <Cell left={895} width={200}>SCORE {row.score}</Cell>
                <Cell left={1130} width={420}>{row.size}</Cell>
              </div>
            );
          })}
        </div>
      </CameraLayer>

      <TextureLayer
        grainColor="rgba(220,219,194,.65)"
        grainOpacity={0.14}
        grainSize={4}
        vignette="radial-gradient(circle at 55% 48%, transparent 38%, rgba(0,0,0,.74) 100%)"
        blendMode="soft-light"
      />
    </AbsoluteFill>
  );
};

const Cell = ({
  left,
  width,
  children,
  strong = false,
}: {
  left: number;
  width: number;
  children: ReactNode;
  strong?: boolean;
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 0,
      width,
      height: 105,
      display: "flex",
      alignItems: "center",
      fontFamily: strong ? SANS : MONO,
      fontSize: strong ? 31 : 25,
      fontWeight: strong ? 700 : 500,
      letterSpacing: strong ? ".01em" : "-.035em",
      whiteSpace: "nowrap",
      textShadow: "0 1px 0 rgba(0,0,0,.3)",
    }}
  >
    {children}
  </div>
);
