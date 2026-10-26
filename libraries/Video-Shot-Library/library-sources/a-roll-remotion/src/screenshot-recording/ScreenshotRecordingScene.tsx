import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import {SCREENSHOT_RECORDING_LAYOUT as layout} from "./reference-layout";
import type {ScreenshotRecordingSceneProps} from "./types";

const sans =
  '"PingFang SC", "Microsoft YaHei", Inter, system-ui, sans-serif';
const mono =
  '"SFMono-Regular", "Cascadia Code", "Roboto Mono", ui-monospace, monospace';

const reveal = (frame: number, start: number, duration = 14) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const Backdrop = ({
  light = false,
  children,
}: {
  light?: boolean;
  children: ReactNode;
}) => (
  <AbsoluteFill
    style={{
      overflow: "hidden",
      color: light ? "#16181d" : "#f8f4ef",
      backgroundColor: light ? "#f0e6d6" : "#1c130d",
      backgroundImage: light
        ? [
            "radial-gradient(circle at 18% 35%, rgba(255,255,255,.72), transparent 38%)",
            "linear-gradient(rgba(94,73,55,.035) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(94,73,55,.035) 1px, transparent 1px)",
          ].join(",")
        : [
            "radial-gradient(circle at 20% 40%, rgba(92,48,28,.2), transparent 38%)",
            "radial-gradient(circle at 84% 46%, rgba(54,69,112,.13), transparent 38%)",
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          ].join(","),
      backgroundSize: "auto, 48px 48px, 48px 48px",
      fontFamily: sans,
    }}
  >
    {children}
  </AbsoluteFill>
);

const ChromeDots = ({light = false}: {light?: boolean}) => (
  <div style={{display: "flex", gap: 8}}>
    {["#ff5c57", "#febc2e", "#28c840"].map((color) => (
      <i
        key={color}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
          opacity: light ? 0.82 : 1,
        }}
      />
    ))}
  </div>
);

const MediaPlaceholder = ({
  title = "口播画面",
  subtitle = "支持替换成你的截图或录屏素材",
  light = false,
  titleSize = 48,
}: {
  title?: string;
  subtitle?: string;
  light?: boolean;
  titleSize?: number;
}) => (
  <AbsoluteFill
    style={{
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      background: light ? "#fffdf9" : "#18110c",
      color: light ? "#1d1e22" : "#f6f1eb",
    }}
  >
    <div>
      <div style={{fontSize: titleSize, fontWeight: 850, letterSpacing: 2}}>
        ▫ {title}
      </div>
      <div
        style={{
          marginTop: 20,
          color: light ? "#8b8178" : "#9c9189",
          fontSize: 20,
          letterSpacing: 1,
        }}
      >
        {subtitle}
      </div>
    </div>
  </AbsoluteFill>
);

const MediaContent = ({
  src,
  title,
  subtitle,
  light = false,
}: {
  src: string;
  title?: string;
  subtitle?: string;
  light?: boolean;
}) =>
  src ? (
    <Img
      src={staticFile(src)}
      style={{width: "100%", height: "100%", objectFit: "cover"}}
    />
  ) : (
    <MediaPlaceholder title={title} subtitle={subtitle} light={light} />
  );

const BrowserFrame = ({
  children,
  style,
  light = false,
  label = "preview.local",
}: {
  children: ReactNode;
  style: CSSProperties;
  light?: boolean;
  label?: string;
}) => (
  <div
    style={{
      position: "absolute",
      overflow: "hidden",
      borderRadius: 18,
      border: light
        ? "1px solid rgba(68,55,44,.2)"
        : "1px solid rgba(255,255,255,.16)",
      background: light ? "#fff" : "#17110d",
      boxShadow: "0 28px 70px rgba(18,10,5,.24)",
      ...style,
    }}
  >
    <div
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 20px",
        boxSizing: "border-box",
        background: light ? "#eee6dc" : "#241b15",
        borderBottom: light
          ? "1px solid rgba(60,48,38,.1)"
          : "1px solid rgba(255,255,255,.08)",
      }}
    >
      <ChromeDots light={light} />
      <span
        style={{
          fontFamily: mono,
          fontSize: 16,
          color: light ? "#766d66" : "#9d938c",
        }}
      >
        {label}
      </span>
    </div>
    <div style={{position: "absolute", inset: "54px 0 0"}}>{children}</div>
  </div>
);

const Presenter = ({
  src,
  frame,
  style,
}: {
  src: string;
  frame: number;
  style: CSSProperties;
}) => (
  <div style={{position: "absolute", overflow: "hidden", ...style}}>
    <PhotoPresenterPanel
      portraitSrc={src}
      portraitScale={1.06}
      portraitPositionX={50}
      portraitPositionY={50}
      breathingAmount={0.003}
      floatingAmount={1.5}
      cameraPushAmount={0.012}
      durationInFrames={180}
      frame={frame}
    />
  </div>
);

const Chip = ({
  children,
  accent,
  dark = false,
}: {
  children: ReactNode;
  accent: string;
  dark?: boolean;
}) => (
  <div
    style={{
      padding: "10px 17px",
      borderRadius: 999,
      border: `1px solid ${dark ? "rgba(255,255,255,.14)" : "rgba(70,55,44,.16)"}`,
      background: dark ? "rgba(255,255,255,.055)" : "rgba(255,255,255,.72)",
      color: dark ? "#eee9e3" : "#403832",
      fontSize: 18,
      fontWeight: 750,
      display: "flex",
      alignItems: "center",
      gap: 9,
      whiteSpace: "nowrap",
    }}
  >
    <i style={{width: 8, height: 8, borderRadius: "50%", background: accent}} />
    {children}
  </div>
);

const Showcase = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.showcase;
  const enter = reveal(frame, 8, 20);
  return (
    <Backdrop light>
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 74,
          fontSize: 24,
          fontWeight: 850,
          color: props.accentColor,
        }}
      >
        SHOWCASE / PRODUCT WALKTHROUGH
      </div>
      <div
        style={{
          position: "absolute",
          left: 1302,
          top: 92,
          width: 540,
          fontSize: 52,
          lineHeight: 1.12,
          fontWeight: 900,
        }}
      >
        {props.title}
      </div>
      <BrowserFrame
        light
        label="product.local / demo"
        style={{
          left: box.mediaX,
          top: box.mediaY,
          width: box.mediaWidth,
          height: box.mediaHeight,
          translate: `${interpolate(enter, [0, 1], [-110, 0])}px 0`,
          opacity: enter,
        }}
      >
        <MediaContent
          src={props.mediaSrc}
          title="录屏展示"
          subtitle={props.subtitle}
          light
        />
      </BrowserFrame>
      <Presenter
        src={props.portraitSrc}
        frame={frame}
        style={{
          left: box.portraitX,
          top: box.portraitY,
          width: box.portraitWidth,
          height: box.portraitHeight,
          borderRadius: 26,
          boxShadow: "0 30px 70px rgba(28,18,10,.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 866,
          display: "flex",
          gap: 18,
        }}
      >
        {props.lines.map((line, index) => (
          <div
            key={line}
            style={{
              opacity: reveal(frame, 34 + index * 18, 12),
              translate: `0 ${interpolate(
                reveal(frame, 34 + index * 18, 12),
                [0, 1],
                [22, 0],
              )}px`,
            }}
          >
            <Chip accent={props.accentColor}>{line}</Chip>
          </div>
        ))}
      </div>
    </Backdrop>
  );
};

const ScreenshotSide = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.screenshot;
  const enter = reveal(frame, 12, 20);
  return (
    <Backdrop light>
      <Presenter
        src={props.portraitSrc}
        frame={frame}
        style={{
          left: box.portraitX,
          top: box.portraitY,
          width: box.portraitWidth,
          height: box.portraitHeight,
          borderRadius: 28,
        }}
      />
      <BrowserFrame
        light
        label="evidence.local"
        style={{
          left: box.cardX,
          top: box.cardY,
          width: box.cardWidth,
          height: box.cardHeight,
          opacity: enter,
          translate: `${interpolate(enter, [0, 1], [-90, 0])}px 0`,
        }}
      >
        <MediaContent
          src={props.mediaSrc}
          title="截图证据"
          subtitle={props.subtitle}
          light
        />
        {props.mediaSrc
          ? props.lines.map((line, index) => (
              <div
                key={line}
                style={{
                  position: "absolute",
                  left: index === 0 ? "10%" : "52%",
                  top: index === 0 ? "21%" : "58%",
                  width: "34%",
                  height: "20%",
                  border: `3px solid ${props.accentColor}`,
                  borderRadius: 14,
                  opacity: reveal(frame, 52 + index * 28, 10),
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: -38,
                    padding: "7px 12px",
                    borderRadius: 999,
                    background: props.accentColor,
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  {line}
                </span>
              </div>
            ))
          : null}
      </BrowserFrame>
    </Backdrop>
  );
};

const CoverCard = ({
  label,
  index,
  props,
  frame,
}: {
  label: string;
  index: number;
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.brollstack;
  const enter = reveal(frame, 18 + index * 18, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: box.stackX,
        top: box.stackY + index * (box.cardHeight + 28),
        width: box.stackWidth,
        height: box.cardHeight,
        borderRadius: 22,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.2)",
        background: "#18151a",
        boxShadow: "0 24px 54px rgba(0,0,0,.28)",
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [-80, 0])}px 0`,
      }}
    >
      <MediaContent
        src={index === 0 ? props.mediaSrc : props.secondaryMediaSrc}
        title={label}
        subtitle="封面素材可替换"
      />
      <div
        style={{
          position: "absolute",
          left: 22,
          bottom: 18,
          padding: "8px 13px",
          borderRadius: 8,
          background: "rgba(0,0,0,.62)",
          color: "#fff",
          fontSize: 17,
          fontWeight: 800,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const BrollStack = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.brollstack;
  return (
    <Backdrop>
      <Presenter
        src={props.portraitSrc}
        frame={frame}
        style={{
          left: box.portraitX,
          top: box.portraitY,
          width: box.portraitWidth,
          height: box.portraitHeight,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(13,9,7,.42), rgba(13,9,7,.08) 55%, rgba(13,9,7,.18))",
        }}
      />
      {props.lines.slice(0, 2).map((line, index) => (
        <CoverCard
          key={line}
          label={line}
          index={index}
          props={props}
          frame={frame}
        />
      ))}
    </Backdrop>
  );
};

const FullEvidence = ({
  props,
  frame,
  scroll = false,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
  scroll?: boolean;
}) => {
  if (scroll) {
    const box = layout.scrollshot;
    const enter = reveal(frame, 8, 22);
    const scrollY = interpolate(
      frame,
      [box.scrollStart, box.scrollEnd],
      [0, -box.scrollDistance],
      {
        ...clamp,
        easing: Easing.bezier(0.45, 0, 0.55, 1),
      },
    );
    return (
      <Backdrop>
        <Presenter
          src={props.portraitSrc}
          frame={frame}
          style={{
            inset: 0,
            scale: 1.02,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(20,14,10,.04), rgba(20,14,10,.18))",
          }}
        />
        <BrowserFrame
          light
          label="screenshots / long-document"
          style={{
            left: box.cardX,
            top: box.cardY,
            width: box.cardWidth,
            height: box.cardHeight,
            opacity: enter,
            translate: `${interpolate(enter, [0, 1], [-260, 0])}px 0`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: 1220,
              translate: `0 ${scrollY}px`,
              background: "#fffdf9",
              color: "#222126",
            }}
          >
            {props.mediaSrc ? (
              <Img
                src={staticFile(props.mediaSrc)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
            ) : (
              <div style={{padding: "54px 62px"}}>
                <div
                  style={{
                    color: props.accentColor,
                    fontSize: 18,
                    fontWeight: 850,
                  }}
                >
                  LONG SCREENSHOT / PUBLIC
                </div>
                <h2 style={{fontSize: 46, margin: "18px 0 42px"}}>
                  {props.title}
                </h2>
                {Array.from({length: 9}, (_, index) => (
                  <section
                    key={index}
                    style={{
                      padding: "25px 0 29px",
                      borderTop: "1px solid #ddd5cc",
                    }}
                  >
                    <div style={{fontSize: 25, fontWeight: 900}}>
                      {String(index + 1).padStart(2, "0")} ·{" "}
                      {props.lines[index % props.lines.length]}
                    </div>
                    <div
                      style={{
                        width: `${68 - (index % 3) * 9}%`,
                        height: 12,
                        marginTop: 18,
                        borderRadius: 8,
                        background: "#e6dfd7",
                      }}
                    />
                  </section>
                ))}
              </div>
            )}
          </div>
        </BrowserFrame>
      </Backdrop>
    );
  }

  const zoom = interpolate(frame, [50, 132], [1, 1.48], clamp);
  const shiftX = interpolate(frame, [50, 132], [0, -340], clamp);
  const shiftY = interpolate(frame, [50, 132], [0, -170], clamp);
  return (
    <Backdrop light>
      <div
        style={{
          position: "absolute",
          inset: 92,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          scale: zoom,
          translate: `${shiftX}px ${shiftY}px`,
        }}
      >
        {props.lines.concat(["结论", "补充说明"]).slice(0, 4).map((line, index) => (
          <div
            key={`${line}-${index}`}
            style={{
              position: "relative",
              minHeight: 390,
              borderLeft: `6px solid ${index % 2 ? props.accentColor : "#3d85e8"}`,
              borderRadius: 10,
              background: "#fffdf9",
              boxShadow: "0 18px 45px rgba(68,47,29,.12)",
              padding: "48px 44px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "7px 12px",
                borderRadius: 999,
                color: "#fff",
                background: index % 2 ? props.accentColor : "#3d85e8",
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              EVIDENCE {String(index + 1).padStart(2, "0")}
            </div>
            <h2 style={{fontSize: 42, margin: "22px 0 14px"}}>{line}</h2>
            <div style={{color: "#77706a", fontSize: 22}}>{props.subtitle}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 86,
          display: "flex",
          alignItems: "center",
          padding: "0 70px",
          background: "rgba(28,19,13,.92)",
          color: "#fff",
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        {props.title} · {props.subtitle}
      </div>
    </Backdrop>
  );
};

const RingScene = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.ring;
  return (
    <Backdrop>
      <Presenter
        src={props.portraitSrc}
        frame={frame}
        style={{
          inset: box.frameInset,
          borderRadius: 16,
          scale: interpolate(
            frame,
            [0, box.zoomEnd],
            [box.startScale, box.endScale],
            {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          boxShadow: "0 22px 64px rgba(0,0,0,.34)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: box.frameInset,
          border: "2px solid rgba(255,255,255,.3)",
          borderRadius: 16,
        }}
      />
    </Backdrop>
  );
};

const StickyStory = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.rc012;
  const active = Math.min(props.lines.length - 1, Math.floor(frame / 42));
  const listOffset = interpolate(
    frame,
    [0, 30, 42, 72, 84, 114, 126, 165],
    [0, 0, -box.listStep, -box.listStep, -box.listStep * 2, -box.listStep * 2, -box.listStep * 3, -box.listStep * 3],
    clamp,
  );
  return (
    <Backdrop>
      <div style={{position: "absolute", left: 88, top: 66}}>
        <div style={{fontSize: 21, color: props.accentColor, fontWeight: 850}}>
          RC A / STICKY NARRATIVE
        </div>
        <h1 style={{fontSize: 43, margin: "12px 0"}}>{props.subtitle}</h1>
      </div>
      <div
        style={{
          position: "absolute",
          left: box.mainX,
          top: box.mainY,
          width: box.mainWidth,
          height: box.mainHeight,
          display: "grid",
          gridTemplateRows: "1fr 170px",
          gap: 16,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            background:
              "radial-gradient(circle at 50% 45%, rgba(232,121,85,.18), transparent 38%), #231812",
            border: "1px solid rgba(255,255,255,.12)",
            padding: "42px",
            boxSizing: "border-box",
          }}
        >
          <div style={{fontSize: 17, color: "#91877f", fontFamily: mono}}>
            CHAPTER {String(active + 1).padStart(2, "0")}
          </div>
          <div style={{fontSize: 46, fontWeight: 900, marginTop: 22}}>
            {props.lines[active]}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            gap: 7,
            padding: "22px 28px",
            borderRadius: 16,
            background: "rgba(255,255,255,.045)",
            border: "1px solid rgba(255,255,255,.1)",
          }}
        >
          {Array.from({length: 34}, (_, index) => (
            <i
              key={index}
              style={{
                flex: 1,
                height:
                  18 +
                  Math.abs(Math.sin(index * 0.57 + frame * 0.08)) *
                    (index < active * 8 + 8 ? 78 : 42),
                borderRadius: 5,
                background:
                  index < active * 8 + 8 ? props.accentColor : "#4b4039",
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: box.listX,
          top: box.mainY,
          width: box.listWidth,
          height: box.mainHeight,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 14,
            translate: `0 ${listOffset}px`,
          }}
        >
          {props.lines.concat(props.lines.slice(0, 3)).map((line, index) => (
            <div
              key={`${line}-${index}`}
              style={{
                height: 136,
                padding: "28px 27px",
                boxSizing: "border-box",
                borderRadius: 13,
                border:
                  index === active
                    ? `2px solid ${props.accentColor}`
                    : "1px solid rgba(255,255,255,.1)",
                background:
                  index === active
                    ? "rgba(232,121,85,.13)"
                    : "rgba(255,255,255,.035)",
                opacity: index === active ? 1 : 0.65,
                fontSize: 24,
                fontWeight: 850,
              }}
            >
              <div
                style={{
                  color: "#8f8279",
                  fontFamily: mono,
                  fontSize: 15,
                  marginBottom: 12,
                }}
              >
                SECTION {String((index % props.lines.length) + 1).padStart(2, "0")}
              </div>
              {line}
            </div>
          ))}
        </div>
      </div>
    </Backdrop>
  );
};

const BrowserStack = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.rc018;
  const historyProgress = interpolate(
    frame,
    [0, 28, 42, 70, 84, 112, 126, 165],
    [0, 0, 1, 1, 2, 2, 3, 3],
    clamp,
  );
  return (
    <Backdrop light>
      <div style={{position: "absolute", left: 82, top: 58}}>
        <div style={{color: "#3d85e8", fontSize: 20, fontWeight: 850}}>
          RC STRUCTURE / BROWSER HISTORY
        </div>
        <h1 style={{fontSize: 44, margin: "12px 0"}}>{props.subtitle}</h1>
      </div>
      {props.lines.map((line, index) => {
        const delta = index - historyProgress;
        const hasTurned = delta < 0;
        const distance = Math.abs(delta);
        return (
          <BrowserFrame
            key={line}
            light
            label={`${String(9 + index).padStart(2, "0")}:${index % 2 ? "18" : "42"} · preview.local`}
            style={{
              left:
                390 +
                (hasTurned ? delta * -box.exitX : delta * 82),
              top: 238 + distance * 34,
              width: 1140,
              height: 600,
              scale: 1 - Math.min(distance, 3) * 0.1,
              opacity: interpolate(
                delta,
                [-0.9, -0.15, 0, 2.2],
                [0, 0.72, 1, 0.5],
                clamp,
              ),
              transform: `perspective(1500px) rotateY(${hasTurned ? Math.max(box.exitRotateY, delta * -box.exitRotateY) : 0}deg)`,
              transformOrigin: "left center",
              zIndex: 20 - index,
            }}
          >
            <div
              style={{
                height: "100%",
                display: "grid",
                placeItems: "center",
                background: "#faf7f2",
              }}
            >
              <div style={{textAlign: "center"}}>
                <div style={{fontSize: 20, color: "#8a817a", fontFamily: mono}}>
                  HISTORY {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{fontSize: 55, fontWeight: 900, marginTop: 16}}>
                  {line}
                </div>
              </div>
            </div>
          </BrowserFrame>
        );
      })}
    </Backdrop>
  );
};

const SidebarSync = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.rc019;
  const active = Math.min(props.lines.length - 1, Math.floor(frame / 42));
  return (
    <Backdrop>
      <div style={{position: "absolute", left: box.shellX, top: 72}}>
        <div style={{fontSize: 19, color: props.accentColor, fontWeight: 850}}>
          RC STRUCTURE / THREE-ZONE SYNC
        </div>
        <h1 style={{fontSize: 42, margin: "12px 0"}}>{props.subtitle}</h1>
      </div>
      <div
        style={{
          position: "absolute",
          left: box.shellX,
          top: box.shellY,
          width: box.shellWidth,
          height: box.shellHeight,
          display: "grid",
          gridTemplateColumns: "260px 500px 1fr",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.12)",
          background: "#17120f",
          boxShadow: "0 28px 70px rgba(0,0,0,.26)",
        }}
      >
        <div style={{padding: "26px 20px", borderRight: "1px solid #352921"}}>
          <div style={{fontSize: 17, color: "#8e827a", marginBottom: 24}}>
            WORKSPACE
          </div>
          {props.lines.map((line, index) => (
            <div
              key={line}
              style={{
                padding: "17px 15px",
                borderRadius: 9,
                marginBottom: 8,
                color: index === active ? "#fff" : "#8e847d",
                background:
                  index === active ? "rgba(232,121,85,.15)" : "transparent",
                borderLeft:
                  index === active
                    ? `4px solid ${props.accentColor}`
                    : "4px solid transparent",
                fontSize: 21,
                fontWeight: 800,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div
          style={{
            padding: 38,
            display: "grid",
            placeItems: "center",
            borderRight: "1px solid #352921",
            background: "#1f1712",
          }}
        >
          <div
            style={{
              width: 250,
              height: 310,
              display: "grid",
              placeItems: "center",
              borderRadius: 12,
              background: "linear-gradient(145deg,#40271b,#1a1411)",
              border: `2px solid ${props.accentColor}`,
              textAlign: "center",
            }}
          >
            <div>
              <div style={{fontSize: 72, color: props.accentColor, fontWeight: 900}}>
                {String(active + 1).padStart(2, "0")}
              </div>
              <div style={{fontSize: 22, marginTop: 12}}>{props.lines[active]}</div>
            </div>
          </div>
        </div>
        <div style={{padding: "58px 54px"}}>
          <div style={{fontSize: 48, fontWeight: 900}}>{props.lines[active]}</div>
          <div
            style={{
              width: 130,
              height: 5,
              background: props.accentColor,
              margin: "24px 0",
            }}
          />
          <p style={{fontSize: 25, lineHeight: 1.65, color: "#bcb2aa"}}>
            当前预览与详情同步刷新，所有内容字段均可替换，原有镜头动画保持不变。
          </p>
          <Chip accent={props.accentColor} dark>
            同步状态 · READY
          </Chip>
        </div>
      </div>
    </Backdrop>
  );
};

const MediaRail = ({
  props,
  frame,
}: {
  props: ScreenshotRecordingSceneProps;
  frame: number;
}) => {
  const box = layout.rc025;
  const travel = interpolate(
    frame,
    [12, 158],
    [0, box.travelPerFrame * (158 - 12)],
    {
      ...clamp,
      easing: Easing.bezier(0.32, 0, 0.2, 1),
    },
  );
  const railItems = [...props.lines, ...props.lines, ...props.lines];
  return (
    <Backdrop>
      <div style={{position: "absolute", left: 84, top: 68}}>
        <div style={{fontSize: 20, color: props.accentColor, fontWeight: 850}}>
          RC B / MEDIA FOCUS RAIL
        </div>
        <h1 style={{fontSize: 43, margin: "12px 0"}}>{props.subtitle}</h1>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 184,
          bottom: 106,
          width: 3,
          background: "rgba(232,121,85,.52)",
          zIndex: 20,
        }}
      />
      {railItems.map((line, index) => {
        const left =
          960 -
          box.cardWidth / 2 +
          index * (box.cardWidth + box.gap) -
          travel;
        const distance = Math.abs(left + box.cardWidth / 2 - 960);
        const focus = interpolate(distance, [0, 420], [1, 0], clamp);
        return (
          <div
            key={`${line}-${index}`}
            style={{
              position: "absolute",
              left,
              top: box.railY - box.cardHeight / 2,
              width: box.cardWidth,
              height: box.cardHeight,
              borderRadius: 16,
              overflow: "hidden",
              border:
                focus > 0.72
                  ? `3px solid ${props.accentColor}`
                  : "1px solid rgba(255,255,255,.12)",
              background: "#241914",
              scale: interpolate(focus, [0, 1], [0.76, 1.18]),
              opacity: interpolate(focus, [0, 1], [0.24, 1]),
              boxShadow:
                focus > 0.72 ? "0 28px 70px rgba(0,0,0,.34)" : undefined,
            }}
          >
            <div
              style={{
                height: 190,
                display: "grid",
                placeItems: "center",
                background:
                  "radial-gradient(circle, rgba(232,121,85,.17), transparent 58%), #1b1411",
              }}
            >
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: props.accentColor,
                  fontSize: 25,
                }}
              >
                ▶
              </div>
            </div>
            <div style={{padding: "21px 18px"}}>
              <div style={{fontSize: 22, fontWeight: 900}}>{line}</div>
              <div
                style={{
                  marginTop: 13,
                  fontFamily: mono,
                  fontSize: 17,
                  color: "#9c9189",
                }}
              >
                0{index % props.lines.length}:{18 + (index % props.lines.length) * 12}
              </div>
            </div>
          </div>
        );
      })}
    </Backdrop>
  );
};

export const ScreenshotRecordingScene = (
  props: ScreenshotRecordingSceneProps,
) => {
  const frame = useCurrentFrame();

  switch (props.variant) {
    case "showcase":
      return <Showcase props={props} frame={frame} />;
    case "screenshot":
      return <ScreenshotSide props={props} frame={frame} />;
    case "brollstack":
      return <BrollStack props={props} frame={frame} />;
    case "shotfull":
      return <FullEvidence props={props} frame={frame} />;
    case "scrollshot":
      return <FullEvidence props={props} frame={frame} scroll />;
    case "ring":
      return <RingScene props={props} frame={frame} />;
    case "sticky-story":
      return <StickyStory props={props} frame={frame} />;
    case "browser-stack":
      return <BrowserStack props={props} frame={frame} />;
    case "sidebar-sync":
      return <SidebarSync props={props} frame={frame} />;
    case "media-rail":
      return <MediaRail props={props} frame={frame} />;
    default:
      return null;
  }
};
