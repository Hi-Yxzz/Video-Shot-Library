import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import type {ArollOverlayProps} from "./types";

export const AROLL_REFERENCE_LAYOUT = {
  milestone: {
    eyebrow: {x: 70, y: 72, fontSize: 26},
    primary: {x: 70, y: 210, fontSize: 250},
    secondary: {x: 90, y: 690, fontSize: 88},
    card: {x: 1290, y: 100, width: 600, height: 440},
  },
  levels: {
    eyebrow: {x: 88, y: 72, fontSize: 26},
    title: {x: 70, y: 235, fontSize: 78},
    cards: {x: 70, y: 540, height: 230, gap: 20},
    cardHeadingSize: 44,
    cardLabelSize: 30,
    cardValueSize: 42,
  },
  growth: {
    eyebrow: {x: 88, y: 72, fontSize: 26},
    title: {x: 70, y: 241, fontSize: 100},
    english: {x: 70, y: 360, fontSize: 44},
    chart: {x: 70, y: 595, height: 175},
    monthly: {x: 586, y: 729, fontSize: 28},
  },
  knowledge: {
    eyebrow: {x: 88, y: 72, fontSize: 26},
    title: {x: 70, y: 240, fontSize: 90},
    english: {x: 70, y: 348, fontSize: 39},
    card: {x: 1290, y: 100, width: 550, height: 593},
    ticker: {x: 70, y: 610, width: 1100, height: 114},
  },
  headline: {
    eyebrow: {x: 88, y: 72, fontSize: 26},
    title: {x: 70, y: 280, fontSize: 108},
    subtitle: {x: 70, y: 420, fontSize: 70},
  },
} as const;

const enterProgress = (
  frame: number,
  start: number,
  duration = 12,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Glass = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: "rgba(12, 14, 17, .82)",
      border: "1px solid rgba(255,255,255,.16)",
      boxShadow: "0 20px 50px rgba(0,0,0,.25)",
      backdropFilter: "blur(18px)",
      ...style,
    }}
  >
    {children}
  </div>
);

const DocumentScene = ({
  props,
  frame,
}: {
  props: ArollOverlayProps;
  frame: number;
}) => {
  const enter = enterProgress(frame, props.enterStart);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 790,
        height: 1080,
        padding: "68px 66px",
        boxSizing: "border-box",
        background: props.paperColor,
        color: "#1c2026",
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [-120, 0])}px 0`,
        boxShadow: "18px 0 60px rgba(0,0,0,.22)",
      }}
    >
      <div style={{fontSize: 22, color: props.accentColor, fontWeight: 800}}>
        ▣ {props.eyebrow}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          marginTop: 22,
          paddingBottom: 24,
          borderBottom: "2px solid rgba(0,0,0,.12)",
        }}
      >
        {props.title}
      </div>
      {props.items.map((item, index) => (
        <div
          key={item}
          style={{
            display: "grid",
            gridTemplateColumns: "58px 1fr",
            gap: 16,
            marginTop: 28,
            opacity: enterProgress(frame, props.enterStart + 5 + index * 2, 8),
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: props.accentColor,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            {index + 1}
          </div>
          <div>
            <div style={{fontSize: 27, fontWeight: 800}}>{item}</div>
            <div
              style={{
                height: 12,
                width: `${84 - index * 6}%`,
                background: "rgba(25,30,38,.13)",
                borderRadius: 8,
                marginTop: 15,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const MilestoneScene = ({
  props,
  frame,
}: {
  props: ArollOverlayProps;
  frame: number;
}) => {
  const first = enterProgress(frame, props.enterStart);
  const second = enterProgress(frame, props.enterStart + 30);
  const card = enterProgress(frame, props.enterStart + 42);
  const firstValue = Math.round(
    interpolate(first, [0, 1], [10737, Number(props.items[0] ?? 30000)]),
  );
  const secondValue = Math.round(
    interpolate(second, [0, 1], [8110, Number(props.items[1] ?? 50000)]),
  );
  const layout = AROLL_REFERENCE_LAYOUT.milestone;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: layout.eyebrow.x,
          top: layout.eyebrow.y,
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: layout.eyebrow.fontSize,
            letterSpacing: 4,
            color: props.accentColor,
            fontWeight: 800,
          }}
        >
          {props.eyebrow}
        </div>
        <div style={{fontSize: 25, fontWeight: 800, marginTop: 8}}>
          三万粉里程碑
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.primary.x,
          top: layout.primary.y,
          color: "#fff",
          fontSize: layout.primary.fontSize,
          lineHeight: 0.88,
          fontWeight: 950,
          letterSpacing: -8,
          opacity: first,
          translate: `${interpolate(first, [0, 1], [-80, 0])}px 0`,
          textShadow: "0 8px 18px rgba(0,0,0,.35)",
        }}
      >
        {firstValue.toLocaleString()}
        <span
          style={{
            color: props.accentColor,
            fontSize: 92,
            letterSpacing: 0,
          }}
        >
          +
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 448,
          fontSize: 38,
          letterSpacing: 6,
          color: props.accentColor,
          fontWeight: 900,
        }}
      >
        BILIBILI · SINGLE PLATFORM
        <div
          style={{
            color: "#fff",
            fontSize: 30,
            letterSpacing: 0,
            marginTop: 14,
          }}
        >
          单平台粉丝
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.secondary.x,
          top: layout.secondary.y,
          color: "#fff",
          opacity: second,
          translate: `0 ${interpolate(second, [0, 1], [80, 0])}px`,
        }}
      >
        <div style={{fontSize: 27, color: "#65dca6", letterSpacing: 4}}>
          ALL PLATFORMS
        </div>
        <div
          style={{
            fontSize: layout.secondary.fontSize,
            lineHeight: 1,
            fontWeight: 950,
            marginTop: 10,
          }}
        >
          {secondValue.toLocaleString()}
          <span style={{fontSize: 42, color: "#56e78b"}}>+</span>
          <span style={{fontSize: 30, marginLeft: 10}}>全平台总粉</span>
        </div>
      </div>
      <Glass
        style={{
          position: "absolute",
          left: layout.card.x,
          top: layout.card.y,
          width: layout.card.width,
          height: layout.card.height,
          borderRadius: 18,
          color: "#fff",
          padding: 32,
          boxSizing: "border-box",
          opacity: card,
          scale: interpolate(card, [0, 1], [0.82, 1]),
          border: `3px solid ${props.accentColor}`,
        }}
      >
        <div style={{fontSize: 25, color: "#79a8ff"}}>CREATOR MILESTONE</div>
        <div style={{fontSize: 46, fontWeight: 900, marginTop: 26}}>
          {props.title}
        </div>
        <div
          style={{
            marginTop: 42,
            height: 18,
            borderRadius: 9,
            background: "rgba(255,255,255,.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${interpolate(card, [0, 1], [8, 92])}%`,
              height: "100%",
              background: "#44dd85",
            }}
          />
        </div>
      </Glass>
    </>
  );
};

const LevelCardsScene = ({
  props,
  frame,
}: {
  props: ArollOverlayProps;
  frame: number;
}) => {
  const layout = AROLL_REFERENCE_LAYOUT.levels;

  return (
    <>
    <div
      style={{
        position: "absolute",
        left: layout.eyebrow.x,
        top: layout.eyebrow.y,
        color: "#fff",
      }}
    >
      <div
        style={{
          fontSize: layout.eyebrow.fontSize,
          color: props.accentColor,
          letterSpacing: 6,
          fontWeight: 900,
        }}
      >
        {props.eyebrow}
      </div>
      <div style={{fontSize: 22, fontWeight: 800, marginTop: 4}}>
        三关打怪 · 升级
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: layout.title.x,
        top: layout.title.y,
        color: "#fff",
        fontSize: layout.title.fontSize,
        lineHeight: 1,
        fontWeight: 950,
        textShadow: "0 8px 18px rgba(0,0,0,.35)",
      }}
    >
      都是<span style={{color: props.accentColor}}>打怪升级</span>的坎
      <div
        style={{
          color: props.accentColor,
          fontSize: 27,
          letterSpacing: 7,
          marginTop: 14,
        }}
      >
        ALL JUST LEVEL-UP CHALLENGES
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: layout.cards.x,
        right: 194,
        top: layout.cards.y,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: layout.cards.gap,
      }}
    >
      {props.items.slice(0, 3).map((item, index) => {
        const enter = enterProgress(frame, props.enterStart + index * 5);
        const colors = ["#20a8ff", "#48e37c", "#f4b544"];
        return (
          <Glass
            key={item}
            style={{
              height: layout.cards.height,
              borderRadius: 18,
              color: "#fff",
              padding: "30px 30px",
              boxSizing: "border-box",
              opacity: enter,
              translate: `0 ${interpolate(enter, [0, 1], [80, 0])}px`,
            }}
          >
            <div
              style={{
                color: colors[index],
                fontSize: layout.cardHeadingSize,
                letterSpacing: 2,
                fontWeight: 900,
              }}
            >
              BOSS · 0{index + 1}
            </div>
            <div
              style={{
                fontSize: layout.cardLabelSize,
                marginTop: 18,
                fontWeight: 800,
              }}
            >
              {["TOPIC", "GROWTH", "BRAND DEALS"][index]}
            </div>
            <div
              style={{
                fontSize: layout.cardValueSize,
                fontWeight: 900,
                marginTop: 10,
              }}
            >
              {item}
            </div>
          </Glass>
        );
      })}
    </div>
    </>
  );
};

const GrowthScene = ({
  props,
  frame,
}: {
  props: ArollOverlayProps;
  frame: number;
}) => {
  const enter = enterProgress(frame, props.enterStart);
  const layout = AROLL_REFERENCE_LAYOUT.growth;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: layout.eyebrow.x,
          top: layout.eyebrow.y,
          color: "#fff",
          opacity: enter,
          translate: `${interpolate(enter, [0, 1], [-80, 0])}px 0`,
        }}
      >
        <div
          style={{
            color: props.accentColor,
            fontSize: layout.eyebrow.fontSize,
            letterSpacing: 4,
            fontWeight: 800,
          }}
        >
          {props.eyebrow}
        </div>
        <div
          style={{
            position: "absolute",
            left: layout.title.x - layout.eyebrow.x,
            top: layout.title.y - layout.eyebrow.y,
            width: 800,
            fontSize: layout.title.fontSize,
            lineHeight: 1,
            fontWeight: 950,
            textShadow: "0 8px 18px rgba(0,0,0,.35)",
          }}
        >
          一次比一次<span style={{color: props.accentColor}}>更好</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: layout.english.x - layout.eyebrow.x,
            top: layout.english.y - layout.eyebrow.y,
            width: 800,
            fontSize: layout.english.fontSize,
            letterSpacing: 3,
            color: props.accentColor,
            fontWeight: 900,
          }}
        >
          BETTER EACH ITERATION
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.chart.x,
          top: layout.chart.y,
          height: layout.chart.height,
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        {Array.from({length: 8}).map((_, index) => {
          const bar = enterProgress(frame, props.enterStart + 18 + index * 4, 9);
          return (
            <div
              key={index}
              style={{
                width: 55,
                height: (38 + index * 19) * bar,
                borderRadius: "8px 8px 2px 2px",
                background: `linear-gradient(180deg, ${props.accentColor}, #159342)`,
                boxShadow: `0 0 20px ${props.accentColor}55`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.monthly.x,
          top: layout.monthly.y,
          opacity: enterProgress(frame, props.enterStart + 25),
          color: "#fff",
          fontSize: layout.monthly.fontSize,
          letterSpacing: 5,
          fontWeight: 800,
        }}
      >
        MONTHLY ITERATIONS
      </div>
    </>
  );
};

const KnowledgeScene = ({
  props,
  frame,
}: {
  props: ArollOverlayProps;
  frame: number;
}) => {
  const enter = enterProgress(frame, props.enterStart);
  const ticker = enterProgress(frame, props.enterStart + 26);
  const layout = AROLL_REFERENCE_LAYOUT.knowledge;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: layout.eyebrow.x,
          top: layout.eyebrow.y,
          color: "#fff",
          opacity: enter,
        }}
      >
        <div
          style={{
            fontSize: layout.eyebrow.fontSize,
            color: props.accentColor,
            letterSpacing: 6,
            fontWeight: 900,
          }}
        >
          {props.eyebrow}
        </div>
        <div
          style={{
            position: "absolute",
            left: layout.title.x - layout.eyebrow.x,
            top: layout.title.y - layout.eyebrow.y,
            width: 900,
            fontSize: layout.title.fontSize,
            lineHeight: 1,
            fontWeight: 950,
            textShadow: "0 8px 18px rgba(0,0,0,.35)",
          }}
        >
          知识 <span style={{color: props.accentColor}}>已经平权</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: layout.english.x - layout.eyebrow.x,
            top: layout.english.y - layout.eyebrow.y,
            width: 1000,
            fontSize: layout.english.fontSize,
            color: props.accentColor,
            letterSpacing: 6,
            fontWeight: 900,
          }}
        >
          KNOWLEDGE = COMMODITY · IN AI ERA
        </div>
      </div>
      <Glass
        style={{
          position: "absolute",
          left: layout.card.x,
          top: layout.card.y,
          width: layout.card.width,
          height: layout.card.height,
          borderRadius: 18,
          color: "#fff",
          padding: 34,
          boxSizing: "border-box",
          opacity: enter,
          translate: `${interpolate(enter, [0, 1], [100, 0])}px 0`,
        }}
      >
        <div style={{fontSize: 18, color: props.accentColor, letterSpacing: 3}}>
          AI KNOWLEDGE CARD
        </div>
        <div style={{fontSize: 40, fontWeight: 900, marginTop: 24}}>
          {props.items[0]}
        </div>
        <div
          style={{
            height: 2,
            background: props.accentColor,
            margin: "28px 0",
          }}
        />
        {props.items.slice(1, 4).map((item) => (
          <div
            key={item}
            style={{
              fontSize: 24,
              marginTop: 22,
              paddingLeft: 22,
              borderLeft: `5px solid ${props.accentColor}`,
            }}
          >
            {item}
          </div>
        ))}
      </Glass>
      <Glass
        style={{
          position: "absolute",
          left: layout.ticker.x,
          top: layout.ticker.y,
          width: layout.ticker.width,
          height: layout.ticker.height,
          borderRadius: 18,
          opacity: ticker,
          translate: `0 ${interpolate(ticker, [0, 1], [50, 0])}px`,
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          color: "#fff",
          boxSizing: "border-box",
        }}
      >
        <span style={{color: props.accentColor, fontSize: 26, fontWeight: 900}}>
          AI TOOLS
        </span>
        <span style={{marginLeft: 28, fontSize: 30}}>
          {props.items.join("  ·  ")}
        </span>
      </Glass>
    </>
  );
};

const HeadlineScene = ({
  props,
  frame,
}: {
  props: ArollOverlayProps;
  frame: number;
}) => {
  const enter = enterProgress(frame, props.enterStart);
  const pieces = props.title.split("|");
  const layout = AROLL_REFERENCE_LAYOUT.headline;

  return (
    <div
      style={{
        position: "absolute",
        left: layout.eyebrow.x,
        top: layout.eyebrow.y,
        color: "#fff",
        opacity: enter,
        translate: `${interpolate(enter, [0, 1], [-100, 0])}px 0`,
      }}
    >
      <div
        style={{
          fontSize: layout.eyebrow.fontSize,
          color: props.accentColor,
          letterSpacing: 4,
          marginBottom: 0,
        }}
      >
        {props.eyebrow}
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.title.x - layout.eyebrow.x,
          top: layout.title.y - layout.eyebrow.y,
          width: 650,
          fontSize: layout.title.fontSize,
          fontWeight: 950,
          lineHeight: 1,
          textShadow: "0 8px 18px rgba(0,0,0,.35)",
        }}
      >
        {pieces[0]}
        <span style={{color: props.accentColor}}>{pieces[1] ?? ""}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.subtitle.x - layout.eyebrow.x,
          top: layout.subtitle.y - layout.eyebrow.y,
          width: 500,
          fontSize: layout.subtitle.fontSize,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        {props.subtitle}
      </div>
    </div>
  );
};

export const ArollOverlayScene = (props: ArollOverlayProps) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#bcc1c3",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <PhotoPresenterPanel {...props} frame={frame} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(2,5,9,.34), transparent 42%, rgba(2,5,9,.1))",
        }}
      />
      {props.variant === "document" ? (
        <DocumentScene props={props} frame={frame} />
      ) : null}
      {props.variant === "milestone" ? (
        <MilestoneScene props={props} frame={frame} />
      ) : null}
      {props.variant === "levels" ? (
        <LevelCardsScene props={props} frame={frame} />
      ) : null}
      {props.variant === "growth" ? (
        <GrowthScene props={props} frame={frame} />
      ) : null}
      {props.variant === "knowledge" ? (
        <KnowledgeScene props={props} frame={frame} />
      ) : null}
      {props.variant === "headline" ? (
        <HeadlineScene props={props} frame={frame} />
      ) : null}
    </AbsoluteFill>
  );
};
