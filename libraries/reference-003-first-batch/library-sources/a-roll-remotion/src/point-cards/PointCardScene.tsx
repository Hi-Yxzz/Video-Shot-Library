import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import {POINT_CARD_REFERENCE_LAYOUT as layout} from "./reference-layout";
import type {PointCardSceneProps} from "./types";

const ease = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const splitItem = (value: string) => value.split("|");

const Portrait = ({
  props,
  frame,
  style,
}: {
  props: PointCardSceneProps;
  frame: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      background: "#c8cdcf",
      ...style,
    }}
  >
    <PhotoPresenterPanel
      durationInFrames={props.durationInFrames}
      portraitSrc={props.portraitSrc}
      portraitScale={1.04}
      portraitPositionX={50}
      portraitPositionY={47}
      breathingAmount={0.004}
      floatingAmount={1.5}
      cameraPushAmount={0.012}
      frame={frame}
    />
  </div>
);

const Surface = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      borderRadius: 22,
      border: "1px solid rgba(255,255,255,.18)",
      background: "rgba(24,22,23,.82)",
      boxShadow: "0 24px 70px rgba(0,0,0,.28)",
      color: "#fff",
      ...style,
    }}
  >
    {children}
  </div>
);

const ArollScene = ({
  props,
  frame,
}: {
  props: PointCardSceneProps;
  frame: number;
}) => {
  const reveal = (index: number) => ease(frame, 12 + index * 18, 12);
  if (
    props.variant === "list" ||
    props.variant === "logos" ||
    props.variant === "pushstack"
  ) {
    const portrait = layout.portraitCard;
    return (
      <AbsoluteFill style={{background: "#efe6d8"}}>
        <Portrait
          props={props}
          frame={frame}
          style={{
            inset: "auto",
            left: portrait.x,
            top: portrait.y,
            width: portrait.width,
            height: portrait.height,
            borderRadius: portrait.radius,
            boxShadow: "0 28px 70px rgba(50,35,22,.24)",
          }}
        />
        {props.variant === "list" &&
          props.items.map((item, index) => {
            const progress = reveal(index);
            return (
              <div
                key={`${item}-${index}`}
                style={{
                  position: "absolute",
                  left: layout.listCard.x,
                  top:
                    layout.listCard.top +
                    index * (layout.listCard.height + layout.listCard.gap),
                  width: layout.listCard.width,
                  height: layout.listCard.height,
                  padding: "0 22px",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  background: "#625d59",
                  color: "#fff",
                  fontSize: layout.listCard.fontSize,
                  fontWeight: 800,
                  opacity: progress,
                  translate: `${interpolate(progress, [0, 1], [-90, 0])}px 0`,
                }}
              >
                {item}
              </div>
            );
          })}
        {props.variant === "logos" && (
          <>
            <div
              style={{
                position: "absolute",
                left: 36,
                top: 302,
                color: "#fff",
                fontSize: 31,
                fontWeight: 900,
              }}
            >
              {props.headline}
            </div>
            {props.items.map((item, index) => {
              const progress = reveal(index);
              const col = index % 5;
              const row = Math.floor(index / 5);
              return (
                <Surface
                  key={`${item}-${index}`}
                  style={{
                    position: "absolute",
                    left:
                      layout.logoCard.x +
                      col * (layout.logoCard.width + layout.logoCard.gap),
                    top:
                      layout.logoCard.top +
                      row * (layout.logoCard.height + layout.logoCard.gap),
                    width: layout.logoCard.width,
                    height: layout.logoCard.height,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: progress,
                    scale: interpolate(progress, [0, 1], [0.65, 1]),
                    background: "#68635f",
                  }}
                >
                  <div
                    style={{
                      width: layout.logoCard.iconSize,
                      height: layout.logoCard.iconSize,
                      display: "grid",
                      placeItems: "center",
                      fontSize: item === "Anthropic" ? 38 : 46,
                      fontWeight: 950,
                    }}
                  >
                    {item === "Claude"
                      ? "✺"
                      : item === "Codex"
                        ? "✦"
                        : item === "Cursor"
                          ? "◈"
                          : item === "Copilot"
                            ? "◒"
                            : item === "DeepSeek"
                              ? "◉"
                              : "AI"}
                  </div>
                  <div
                    style={{
                      fontSize: layout.logoCard.labelSize,
                      fontWeight: 800,
                      marginTop: 8,
                    }}
                  >
                    {item}
                  </div>
                </Surface>
              );
            })}
          </>
        )}
        {props.variant === "pushstack" && (
          <>
            {props.items.map((item, index) => {
              const progress = reveal(index);
              const lift = ease(frame, 105, 16);
              return (
                <Surface
                  key={`${item}-${index}`}
                  style={{
                    position: "absolute",
                    left: layout.pushCard.x,
                    top:
                      layout.pushCard.top +
                      index * (layout.pushCard.height + layout.pushCard.gap),
                    width: layout.pushCard.width,
                    height: layout.pushCard.height,
                    padding: "0 32px",
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                    fontSize: layout.pushCard.fontSize,
                    fontWeight: 850,
                    opacity: progress,
                    translate: `${interpolate(progress, [0, 1], [-90, 0])}px ${interpolate(
                      lift,
                      [0, 1],
                      [0, -132],
                    )}px`,
                    background: "#66615e",
                  }}
                >
                  {item}
                </Surface>
              );
            })}
            <Surface
              style={{
                position: "absolute",
                left: layout.pushCard.x,
                top: 490,
                width: layout.pushCard.width,
                height: layout.pushCard.height,
                padding: "0 32px",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                fontSize: layout.pushCard.fontSize,
                fontWeight: 900,
                opacity: ease(frame, 122, 14),
                background: "#66615e",
              }}
            >
              {props.headline}
            </Surface>
          </>
        )}
      </AbsoluteFill>
    );
  }

  const merge = ease(frame, 112, 18);
  const portraitOpacity =
    props.variant === "chipcluster"
      ? interpolate(merge, [0, 1], [1, 0.3])
      : 1;

  return (
    <AbsoluteFill style={{background: "#161415"}}>
      <Portrait props={props} frame={frame} style={{opacity: portraitOpacity}} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.76), transparent 38%, transparent 62%, rgba(0,0,0,.76))",
        }}
      />

      {props.variant === "title" &&
        props.items.map((item, index) => {
          const progress = reveal(index);
          return (
            <Surface
              key={`${item}-${index}`}
              style={{
                position: "absolute",
                left: layout.titleCard.x,
                top:
                  layout.titleCard.top +
                  index * (layout.titleCard.height + layout.titleCard.gap),
                width: layout.titleCard.width,
                height: layout.titleCard.height,
                padding: "0 34px",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                fontSize: layout.titleCard.fontSize,
                fontWeight: 900,
                opacity: progress,
                translate: `${interpolate(progress, [0, 1], [-130, 0])}px 0`,
                background: "rgba(25,23,24,.84)",
              }}
            >
              {item}
            </Surface>
          );
        })}

      {props.variant === "compare" &&
        props.items.slice(0, 2).map((item, index) => {
          const progress = reveal(index);
          const left =
            index === 0
              ? layout.compareCard.leftX
              : layout.compareCard.rightX;
          return (
            <Surface
              key={`${item}-${index}`}
              style={{
                position: "absolute",
                left,
                top: layout.compareCard.top,
                width: layout.compareCard.width,
                height: layout.compareCard.height,
                display: "grid",
                placeItems: "center",
                padding: 34,
                boxSizing: "border-box",
                textAlign: "center",
                fontSize: layout.compareCard.fontSize,
                fontWeight: 900,
                opacity: progress,
                translate: `${interpolate(
                  progress,
                  [0, 1],
                  [index === 0 ? -120 : 120, 0],
                )}px 0`,
              }}
            >
              {item}
            </Surface>
          );
        })}

      {props.variant === "flankcards" &&
        props.items.map((item, index) => {
          const progress = reveal(index);
          const rightSide = index % 2 === 1;
          const row = Math.floor(index / 2);
          return (
            <Surface
              key={`${item}-${index}`}
              style={{
                position: "absolute",
                left: rightSide
                  ? layout.flankCard.rightX
                  : layout.flankCard.leftX,
                top:
                  layout.flankCard.top +
                  row * (layout.flankCard.height + layout.flankCard.gap),
                width: layout.flankCard.width,
                height: layout.flankCard.height,
                padding: "0 42px",
                boxSizing: "border-box",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                fontSize: layout.flankCard.fontSize,
                fontWeight: 900,
                opacity: progress,
                translate: `${interpolate(
                  progress,
                  [0, 1],
                  [rightSide ? 130 : -130, 0],
                )}px 0`,
              }}
            >
              {item}
            </Surface>
          );
        })}

      {props.variant === "chipcluster" && (
        <>
          {props.items.map((item, index) => {
            const progress = reveal(index);
            const positions = [
              [160, 180],
              [1440, 180],
              [110, 455],
              [1500, 455],
              [250, 760],
              [1380, 760],
            ];
            const [left, top] = positions[index % positions.length];
            return (
              <Surface
                key={`${item}-${index}`}
                style={{
                  position: "absolute",
                  left: interpolate(merge, [0, 1], [left, 760]),
                  top: interpolate(merge, [0, 1], [top, 480]),
                  padding: "18px 34px",
                  fontSize: 36,
                  fontWeight: 850,
                  opacity: progress * (1 - merge),
                  scale: interpolate(progress, [0, 1], [0.7, 1]),
                }}
              >
                {item}
              </Surface>
            );
          })}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: props.accentColor,
              fontSize: 116,
              fontWeight: 950,
              opacity: merge,
              scale: interpolate(merge, [0, 1], [0.65, 1]),
              textShadow: "0 16px 50px rgba(0,0,0,.45)",
            }}
          >
            {props.headline}
          </div>
        </>
      )}

    </AbsoluteFill>
  );
};

const LowerThird = ({
  props,
  frame,
}: {
  props: PointCardSceneProps;
  frame: number;
}) => {
  const progress = ease(frame, 20, 14);
  const background =
    "radial-gradient(circle at 34% 42%, #3d332b 0%, #241f1b 42%, #151312 100%)";

  if (props.variant === "news-lower-third") {
    const ticker = layout.newsTicker;
    return (
      <AbsoluteFill style={{background, color: "#111"}}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: ticker.bottom,
            height: ticker.height,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            background: "#f5f2ec",
            borderTop: "2px solid rgba(255,255,255,.22)",
            opacity: progress,
          }}
        >
          <div
            style={{
              height: "100%",
              width: 142,
              flex: "0 0 auto",
              display: "grid",
              placeItems: "center",
              background: props.secondaryColor,
              fontSize: 24,
              fontWeight: 950,
              letterSpacing: 2,
            }}
          >
            MNEWS
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              fontSize: 20,
              fontWeight: 850,
              letterSpacing: 1,
              translate: `${-((frame * 5) % 520)}px 0`,
            }}
          >
            {Array.from({length: 6}, () =>
              "/// TRACE  /// PULSE  /// FOCUS  /// MOVE  ",
            ).join("")}
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              width: 54,
              height: "100%",
              background: props.accentColor,
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  if (props.variant === "sports-lower-third") {
    const sports = layout.sportsLowerThird;
    return (
      <AbsoluteFill style={{background, color: "#111"}}>
        <div
          style={{
            position: "absolute",
            left: sports.x,
            bottom: sports.bottom,
            width: sports.width,
            height: sports.height,
            display: "flex",
            alignItems: "center",
            opacity: progress,
            translate: `0 ${interpolate(progress, [0, 1], [40, 0])}px`,
          }}
        >
          <div
            style={{
              width: 230,
              height: "100%",
              display: "grid",
              placeItems: "center",
              background: props.accentColor,
              fontSize: 35,
              fontWeight: 950,
            }}
          >
            MOVE
          </div>
          <div
            style={{
              width: 260,
              height: "100%",
              display: "grid",
              placeItems: "center",
              background: props.secondaryColor,
              fontSize: 45,
              fontWeight: 950,
              letterSpacing: 4,
            }}
          >
            34:72
          </div>
          <div
            style={{
              width: 270,
              height: "100%",
              display: "grid",
              placeItems: "center",
              background: "#f4eee7",
              fontSize: 35,
              fontWeight: 950,
            }}
          >
            TRACE
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const radar = layout.radarLowerThird;
  const sweep = (frame * 5) % 360;

  return (
    <AbsoluteFill
      style={{
        background,
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 90,
          width: 1696,
          height: 620,
          background: "rgba(22,25,27,.42)",
          border: "1px solid rgba(255,255,255,.035)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: radar.x,
          bottom: radar.bottom,
          height: radar.height,
          width: radar.width,
          display: "flex",
          alignItems: "center",
          background: "rgba(8,8,8,.86)",
          borderLeft: `7px solid ${props.secondaryColor}`,
          opacity: progress,
          translate: `${interpolate(progress, [0, 1], [-160, 0])}px 0`,
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            marginLeft: 18,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            border: "2px solid rgba(239,115,83,.55)",
            background: `conic-gradient(from ${sweep}deg, ${props.secondaryColor}, transparent 22%, transparent 100%)`,
          }}
        >
          <div
            style={{
              width: 142,
              height: 142,
              borderRadius: "50%",
              border: "1px solid rgba(239,115,83,.32)",
            }}
          />
        </div>
        <div style={{padding: "0 34px"}}>
          <div style={{fontSize: 38, fontWeight: 900}}>
            {props.headline}
          </div>
          <div
            style={{
              fontSize: 18,
              color: props.accentColor,
              letterSpacing: 3,
              marginTop: 12,
            }}
          >
            {props.subline}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BrollScene = ({
  props,
  frame,
}: {
  props: PointCardSceneProps;
  frame: number;
}) => {
  if (
    ["radar-lower-third", "sports-lower-third", "news-lower-third"].includes(
      props.variant,
    )
  ) {
    return <LowerThird props={props} frame={frame} />;
  }

  const background = props.darkMode
    ? "radial-gradient(circle at 50% 50%, #2e2925, #151312 76%)"
    : "linear-gradient(120deg, #f4eee4, #eee2d2)";
  const ink = props.darkMode ? "#fff" : "#171717";

  if (props.variant === "sealcard") {
    const title = ease(frame, 14, 18);
    const stamp = ease(frame, 44, 6);
    return (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 46%, #d9cfb6 0%, #c9bb9c 72%, #b5a688 100%)",
          color: "#1a1a1a",
          display: "grid",
          placeItems: "center",
        }}
      >
        <AbsoluteFill
          style={{
            inset: 14,
            border: "3px solid rgba(49,42,32,.82)",
            boxShadow:
              "inset 0 0 70px rgba(72,52,31,.18), inset 0 0 0 8px rgba(255,255,255,.08)",
          }}
        />
        {[
          [70, 60],
          [1830, 60],
          [70, 1000],
          [1830, 1000],
        ].map(([left, top]) => (
          <div
            key={`${left}-${top}`}
            style={{
              position: "absolute",
              left,
              top,
              color: "rgba(130,65,45,.55)",
              fontSize: 28,
            }}
          >
            ✦
          </div>
        ))}
        <div style={{textAlign: "center"}}>
          <div style={{fontSize: 32, letterSpacing: 8, marginBottom: 26}}>
            {props.subline}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 950,
              opacity: title,
              translate: `0 ${interpolate(title, [0, 1], [80, 0])}px`,
            }}
          >
            这一回合{" "}
            <span
              style={{
                background:
                  "linear-gradient(transparent 62%, rgba(217,164,65,.7) 62%)",
              }}
            >
              确定性
            </span>
            完胜
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 350,
            top: 560,
            width: 170,
            height: 110,
            border: `9px solid ${props.accentColor}`,
            color: props.accentColor,
            display: "grid",
            placeItems: "center",
            fontSize: 42,
            fontWeight: 950,
            rotate: "-8deg",
            opacity: stamp,
            scale: interpolate(stamp, [0, 0.65, 1], [1.8, 0.86, 1]),
          }}
        >
          {props.items[0]}
        </div>
      </AbsoluteFill>
    );
  }

  if (props.variant === "questionpush") {
    const push = ease(frame, 52, 18);
    const activeIndex = frame < 112 ? 2 : frame < 164 ? 3 : 4;
    return (
      <AbsoluteFill style={{background: "#f4eee4", color: "#111"}}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: interpolate(
              push,
              [0, 1],
              [1920, layout.questionHero.finalLeftWidth],
            ),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              scale: interpolate(push, [0, 1], [1, 0.52]),
            }}
          >
            <div
              style={{
                fontSize: layout.questionHero.numberSize,
                lineHeight: 0.75,
                fontWeight: 950,
                color: props.accentColor,
              }}
            >
              {props.headline}
            </div>
            <div
              style={{
                whiteSpace: "pre-line",
                fontSize: layout.questionHero.labelSize,
                lineHeight: 0.82,
                fontWeight: 950,
              }}
            >
              {props.subline}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 1920 - layout.questionHero.finalLeftWidth,
            padding: "140px 0 0 300px",
            boxSizing: "border-box",
            background: "#121820",
            color: "#fff",
            translate: `${interpolate(
              push,
              [0, 1],
              [1920 - layout.questionHero.finalLeftWidth, 0],
            )}px 0`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 520,
              width: 0,
              height: 0,
              borderTop: "34px solid transparent",
              borderBottom: "34px solid transparent",
              borderLeft: "54px solid #fff",
              opacity: push,
            }}
          />
          {props.items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              style={{
                height: 150,
                marginBottom: 18,
                padding: "0 34px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 13,
                background:
                  index === activeIndex
                    ? "rgba(255,255,255,.07)"
                    : "rgba(255,255,255,.025)",
                fontSize: 34,
                fontWeight: index === activeIndex ? 850 : 650,
                opacity: push * (index === activeIndex ? 1 : 0.26),
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  if (props.variant === "token-text") {
    return (
      <AbsoluteFill style={{background, color: ink, padding: "120px 110px", boxSizing: "border-box"}}>
        <div
          style={{
            fontSize: 18,
            color: props.accentColor,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          RC TECHNIQUE / 024
        </div>
        <div style={{fontSize: 48, fontWeight: 900, marginTop: 16}}>
          {props.headline}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: layout.tokenRow.y,
            display: "flex",
            justifyContent: "center",
            gap: layout.tokenRow.gap,
          }}
        >
          {props.items.map((item, index) => {
            const progress = ease(frame, 20 + index * 13, 11);
            return (
              <div
                key={`${item}-${index}`}
                style={{
                  fontSize: layout.tokenRow.fontSize,
                  fontWeight: 900,
                  color: index === 3 ? props.accentColor : ink,
                  opacity: progress,
                  translate: `0 ${interpolate(progress, [0, 1], [36, 0])}px`,
                  borderBottom: index === 3 ? `8px solid ${props.accentColor}` : undefined,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 750,
            bottom: 130,
            fontSize: 17,
            letterSpacing: 4,
            opacity: 0.55,
          }}
        >
          字符错峰 · 关键词划线 · TOKEN 控制
        </div>
      </AbsoluteFill>
    );
  }

  if (props.variant === "badge-morph") {
    const panel = layout.badgePanel;
    return (
      <AbsoluteFill style={{background, color: ink, padding: "90px 110px", boxSizing: "border-box"}}>
        <div
          style={{
            fontSize: 18,
            color: props.accentColor,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          RC TECHNIQUE / 022
        </div>
        <div style={{fontSize: 48, fontWeight: 900, marginTop: 18}}>
          {props.headline}
        </div>
        <div
          style={{
            position: "absolute",
            left: panel.x,
            top: panel.y,
            width: panel.width,
            height: panel.height,
            padding: "52px 58px",
            boxSizing: "border-box",
            background: "rgba(255,255,255,.42)",
            border: "1px solid rgba(52,47,40,.08)",
            borderRadius: 18,
            boxShadow: "0 26px 56px rgba(60,45,30,.14)",
          }}
        >
          {props.items.map((item, index) => {
            const [label, count] = splitItem(item);
            const progress = ease(frame, 24 + index * 24, 12);
            return (
              <div
                key={`${item}-${index}`}
                style={{
                  height: 135,
                  marginBottom: 15,
                  padding: "0 30px",
                  display: "flex",
                  alignItems: "center",
                  background:
                    progress > 0.95
                      ? "rgba(93,137,214,.12)"
                      : "rgba(255,255,255,.25)",
                  borderRadius: 8,
                  boxShadow: "0 14px 34px rgba(0,0,0,.09)",
                  fontSize: 31,
                  opacity: progress,
                  translate: `${interpolate(progress, [0, 1], [-60, 0])}px 0`,
                }}
              >
                <span style={{color: props.accentColor, fontWeight: 950, marginRight: 18}}>✓</span>
                {label}
                <span
                  style={{
                    marginLeft: "auto",
                    padding: "8px 18px",
                    borderRadius: 999,
                    background: props.accentColor,
                    color: "#fff",
                    fontWeight: 900,
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

  if (props.variant === "design-history") {
    const active = Math.min(
      props.items.length - 1,
      Math.floor(frame / Math.max(1, 182 / props.items.length)),
    );
    return (
      <AbsoluteFill style={{background, color: ink, padding: "78px 100px", boxSizing: "border-box"}}>
        <div
          style={{
            fontSize: 18,
            color: props.accentColor,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          RC STRUCTURE / 014
        </div>
        <div style={{fontSize: 46, fontWeight: 900, marginTop: 16}}>
          {props.headline}
        </div>
        <div
          style={{
            position: "absolute",
            left: layout.designHistory.x,
            top: layout.designHistory.y,
            display: "flex",
            gap: 28,
          }}
        >
          {props.items.map((item, index) => {
            const [icon, era, title] = splitItem(item);
            const progress = ease(frame, 16 + index * 20, 12);
            const selected = index === active;
            return (
              <Surface
                key={`${item}-${index}`}
                style={{
                  width: selected ? 670 : 450,
                  height: layout.designHistory.height,
                  padding: 42,
                  boxSizing: "border-box",
                  opacity: progress,
                  translate: `0 ${interpolate(progress, [0, 1], [90, 0])}px`,
                  borderColor: selected ? props.accentColor : "rgba(255,255,255,.14)",
                }}
              >
                <div
                  style={{
                    height: 230,
                    margin: "-42px -42px 0",
                    display: "grid",
                    placeItems: "center",
                    background: selected
                      ? "rgba(61,133,232,.24)"
                      : "rgba(255,255,255,.025)",
                    fontSize: 82,
                  }}
                >
                  {icon}
                </div>
                <div style={{fontSize: 28, color: props.accentColor, marginTop: 45}}>{era}</div>
                <div style={{fontSize: 48, fontWeight: 900, marginTop: 16}}>{title}</div>
              </Surface>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

  if (props.variant === "wheel-interface") {
    const wheel = layout.wheel;
    const active =
      frame >= wheel.sectionStarts[3]
        ? 3
        : frame >= wheel.sectionStarts[2]
          ? 2
          : frame >= wheel.sectionStarts[1]
            ? 1
            : 0;
    const angle = interpolate(
      frame,
      [0, 55, 66, 85, 96, 115, 126, 181],
      [0, 0, -72, -72, -144, -144, -216, -216],
      {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
    return (
      <AbsoluteFill style={{background, color: ink, padding: "78px 100px", boxSizing: "border-box"}}>
        <div
          style={{
            fontSize: 18,
            color: props.accentColor,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          RC STRUCTURE / 016
        </div>
        <div style={{fontSize: 46, fontWeight: 900, marginTop: 16}}>
          {props.headline}
        </div>
        <div
          style={{
            position: "absolute",
            left: wheel.x,
            top: wheel.y,
            width: wheel.size,
            height: wheel.size,
            borderRadius: "50%",
            border: "2px solid rgba(87,136,232,.4)",
            rotate: `${angle}deg`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 62,
              borderRadius: "50%",
              background: "rgba(48,75,132,.18)",
              border: "1px solid rgba(87,136,232,.18)",
            }}
          />
          {Array.from({length: wheel.visualNodeCount}).map((_, index) => {
            const itemAngle = -90 + (360 / wheel.visualNodeCount) * index;
            const topDistance = Math.abs(
              ((((itemAngle + angle + 90) % 360) + 540) % 360) - 180,
            );
            const selected = interpolate(topDistance, [0, 38], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 105,
                  height: 105,
                  margin: -52,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  background: interpolateColors(
                    selected,
                    [0, 1],
                    ["#111725", props.accentColor],
                  ),
                  border: `2px solid ${interpolateColors(
                    selected,
                    [0, 1],
                    ["rgba(87,136,232,.35)", props.accentColor],
                  )}`,
                  translate: `${Math.cos((itemAngle * Math.PI) / 180) * 275}px ${
                    Math.sin((itemAngle * Math.PI) / 180) * 275
                  }px`,
                  rotate: `${-angle}deg`,
                  scale: interpolate(selected, [0, 1], [0.58, 1]),
                  borderRadius: interpolate(selected, [0, 1], [18, 999]),
                  boxShadow: `0 0 ${interpolate(
                    selected,
                    [0, 1],
                    [0, 32],
                  )}px rgba(57,124,247,.48)`,
                  fontSize: 18,
                  fontWeight: 850,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
            );
          })}
        </div>
        <Surface
          style={{
            position: "absolute",
            left: wheel.panelX,
            top: wheel.panelY,
            width: wheel.panelWidth,
            height: wheel.panelHeight,
            padding: 54,
            boxSizing: "border-box",
          }}
        >
          <div style={{fontSize: 30, color: props.accentColor}}>
            SECTION {String(active + 1).padStart(2, "0")}
          </div>
          <div style={{fontSize: 82, fontWeight: 950, marginTop: 54}}>
            {props.items[active]}
          </div>
          <div style={{fontSize: 30, opacity: 0.62, lineHeight: 1.55, marginTop: 30}}>
            将观察转成确定性的时间线，并保存为可复用镜头。
          </div>
          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              bottom: wheel.progressBottom,
              height: 4,
              borderRadius: 999,
              overflow: "hidden",
              background: "rgba(255,255,255,.12)",
            }}
          >
            <div
              style={{
                width: `${interpolate(frame, [0, 181], [0, 100], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}%`,
                height: "100%",
                borderRadius: 999,
                background: props.accentColor,
                boxShadow: `0 0 18px ${props.accentColor}`,
              }}
            />
          </div>
        </Surface>
      </AbsoluteFill>
    );
  }

  const longDuration = props.variant === "selective-recombine";
  const spread = ease(frame, 18, 28);
  const lock = ease(frame, longDuration ? 330 : 120, 30);
  const selective = layout.selectiveCard;

  return (
    <AbsoluteFill style={{background, color: ink}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 46,
          textAlign: "center",
          fontSize: 38,
          fontWeight: 900,
          opacity: lock,
        }}
      >
        {props.headline}
      </div>
      {props.items.map((item, index) => {
        const center = (props.items.length - 1) / 2;
        const offset = index - center;
        return (
          <Surface
            key={`${item}-${index}`}
            style={{
              position: "absolute",
              left: selective.x,
              top: selective.y,
              width: selective.width,
              height: selective.height,
              padding: 22,
              boxSizing: "border-box",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              fontSize: 31,
              fontWeight: 900,
              translate: `${interpolate(spread, [0, 1], [0, offset * selective.spread])}px ${Math.abs(offset) * 28}px`,
              rotate: `${interpolate(spread, [0, 1], [0, offset * 10])}deg`,
              scale: interpolate(lock, [0, 1], [1, index < 2 ? 1.04 : 0.92]),
              opacity: interpolate(lock, [0, 1], [1, index < 2 ? 1 : 0.35]),
              borderColor: index < 2 ? props.accentColor : "rgba(255,255,255,.18)",
            }}
          >
            {item}
          </Surface>
        );
      })}
    </AbsoluteFill>
  );
};

export const PointCardScene = (props: PointCardSceneProps) => {
  const frame = useCurrentFrame();
  const isAroll = [
    "title",
    "list",
    "compare",
    "flankcards",
    "logos",
    "chipcluster",
    "pushstack",
  ].includes(props.variant);

  return isAroll ? (
    <ArollScene props={props} frame={frame} />
  ) : (
    <BrollScene props={props} frame={frame} />
  );
};
