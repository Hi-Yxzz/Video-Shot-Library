import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import {REFERENCE_LAYOUT} from "./layout";
import type {Aroll1317Props} from "./types";

const enter = (frame: number, start: number, duration = 10) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const AgentCards = ({
  props,
  frame,
}: {
  props: Aroll1317Props;
  frame: number;
}) => {
  const swapFrame = props.revealFrames[1] ?? 40;
  const firstExit = interpolate(frame, [swapFrame - 7, swapFrame + 3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const secondEnter = enter(frame, swapFrame, 10);
  const layout = REFERENCE_LAYOUT.agentCard;

  const Card = ({
    label,
    title,
    progress,
  }: {
    label: string;
    title: string;
    progress: number;
  }) => (
    <div
      style={{
        position: "absolute",
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        borderRadius: 8,
        background:
          "linear-gradient(115deg, rgba(5,11,29,.96), rgba(21,26,54,.94))",
        border: "2px solid rgba(138,151,211,.55)",
        boxShadow: "0 18px 50px rgba(0,0,0,.38)",
        color: "#fff",
        padding: "38px 34px",
        boxSizing: "border-box",
        opacity: progress,
        translate: `${interpolate(progress, [0, 1], [80, 0])}px 0`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 24,
          letterSpacing: 3,
          fontWeight: 800,
          color: "#ced4f5",
        }}
      >
        <span
          style={{
            width: 86,
            height: 86,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: props.secondaryColor,
            rotate: "45deg",
          }}
        >
          <span style={{rotate: "-45deg", fontSize: 42}}>◆</span>
        </span>
        {label}
      </div>
      <div
        style={{
          fontSize: layout.titleSize,
          lineHeight: 1,
          fontWeight: 950,
          marginTop: 26,
        }}
      >
        {title}
      </div>
      <div style={{fontSize: 46, marginTop: 18, color: "#f3f3f3"}}>
        又是干什么的？
      </div>
    </div>
  );

  return (
    <>
      <Card
        label={props.eyebrow}
        title={props.title}
        progress={enter(frame, props.revealFrames[0] ?? 0, 8) * firstExit}
      />
      <Card
        label={props.items[0] ?? "AGENT / 03"}
        title={props.items[1] ?? "OpenClaw"}
        progress={secondEnter}
      />
    </>
  );
};

const NumberedList = ({
  props,
  frame,
}: {
  props: Aroll1317Props;
  frame: number;
}) => {
  const layout = REFERENCE_LAYOUT.numberedRow;

  return (
    <div
    style={{
      position: "absolute",
      left: layout.left,
      top: layout.top,
      width: layout.width,
      display: "flex",
      flexDirection: "column",
      gap: layout.gap,
    }}
  >
    {props.items.slice(0, 3).map((item, index) => {
      const progress = enter(frame, props.revealFrames[index] ?? index * 32, 9);
      return (
        <div
          key={item}
          style={{
            height: layout.height,
            display: "flex",
            alignItems: "center",
            gap: 28,
            color: "#fff",
            background:
              "linear-gradient(90deg, rgba(3,15,28,.9), rgba(3,15,28,.56), transparent)",
            borderLeft: `6px solid ${
              index === 0
                ? props.accentColor
                : index === 1
                  ? props.secondaryColor
                  : "#f3f5ff"
            }`,
            padding: "0 34px",
            boxSizing: "border-box",
            opacity: progress,
            translate: `${interpolate(progress, [0, 1], [-130, 0])}px 0`,
          }}
        >
          <span
            style={{
              fontSize: layout.numberSize,
              lineHeight: 1,
              fontWeight: 950,
              color:
                index === 0
                  ? props.accentColor
                  : index === 1
                    ? props.secondaryColor
                    : "#fff",
            }}
          >
            {index + 1}
          </span>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: layout.textSize,
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            <span
              style={{
                fontSize: 24,
                lineHeight: 1,
                marginBottom: 12,
                color:
                  index === 0
                    ? props.accentColor
                    : index === 1
                      ? props.secondaryColor
                      : "#d9ddff",
              }}
            >
              第{["一", "二", "三"][index]}类
            </span>
            {item}
          </span>
        </div>
      );
    })}
  </div>
  );
};

const RobotFactory = ({color}: {color: string}) => (
  <div
    style={{
      width: 470,
      height: 460,
      borderRadius: 34,
      background: "rgba(247,248,244,.94)",
      color: "#182027",
      border: "5px solid #26343b",
      display: "grid",
      placeItems: "center",
      boxShadow: "0 22px 55px rgba(0,0,0,.3)",
    }}
  >
    <div style={{textAlign: "center"}}>
      <div
        style={{
          width: 210,
          height: 145,
          border: "8px solid #26343b",
          borderRadius: 24,
          display: "grid",
          placeItems: "center",
          margin: "0 auto",
          fontSize: 72,
          color,
        }}
      >
        ◉
      </div>
      <div style={{fontSize: 68, fontWeight: 950, marginTop: 25}}>AI 工厂</div>
      <div style={{fontSize: 28, marginTop: 14}}>PPT · REPORT · EXCEL</div>
    </div>
  </div>
);

const AnalyticsBoard = ({color}: {color: string}) => (
  <div
    style={{
      width: REFERENCE_LAYOUT.workflow.boardWidth,
      height: REFERENCE_LAYOUT.workflow.boardHeight,
      borderRadius: 30,
      background: "#fff",
      border: "5px solid rgba(34,61,94,.36)",
      boxShadow: "0 24px 60px rgba(0,0,0,.34)",
      padding: 50,
      boxSizing: "border-box",
    }}
  >
    <div style={{display: "flex", alignItems: "flex-end", gap: 24, height: 320}}>
      {[118, 196, 156, 258, 296].map((height, index) => (
        <div
          key={height}
          style={{
            width: 68,
            height,
            background: index % 2 ? color : "#a8d8ff",
            borderRadius: "12px 12px 2px 2px",
          }}
        />
      ))}
      <div
        style={{
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: `conic-gradient(${color} 0 30%, #f2a34b 30% 52%, #dce9f6 52%)`,
        }}
      />
    </div>
    <div style={{height: 22, borderRadius: 12, background: "#2f83ef", marginTop: 55}} />
    <div
      style={{
        height: 22,
        width: "76%",
        borderRadius: 12,
        background: "#dce9f6",
        marginTop: 22,
      }}
    />
    <div
      style={{
        height: 22,
        width: "58%",
        borderRadius: 12,
        background: "#dce9f6",
        marginTop: 22,
      }}
    />
  </div>
);

const WorkflowSwap = ({
  props,
  frame,
}: {
  props: Aroll1317Props;
  frame: number;
}) => {
  const swapFrame = props.revealFrames[1] ?? 72;
  const first = enter(frame, props.revealFrames[0] ?? 0, 10);
  const firstExit = interpolate(frame, [swapFrame - 8, swapFrame + 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const second = enter(frame, swapFrame, 12);
  const layout = REFERENCE_LAYOUT.workflow;

  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 160,
          opacity: first * firstExit,
          scale: interpolate(first, [0, 1], [0.78, 1]),
        }}
      >
        <RobotFactory color={props.accentColor} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 54,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: first * firstExit,
        }}
      >
        {props.items.slice(0, 2).map((item, index) => (
          <div
            key={item}
            style={{
              width: 360,
              height: 74,
              borderRadius: 12,
              background: "#fff",
              borderLeft: `12px solid ${index ? props.accentColor : props.secondaryColor}`,
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              boxSizing: "border-box",
              fontSize: 30,
              fontWeight: 900,
              color: "#172139",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: layout.boardRight,
          top: layout.boardTop,
          opacity: second,
          translate: `${interpolate(second, [0, 1], [100, 0])}px 0`,
        }}
      >
        <AnalyticsBoard color={props.accentColor} />
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.taskLeft,
          top: layout.taskTop,
          width: layout.taskWidth,
          height: layout.taskHeight,
          padding: "20px 26px",
          boxSizing: "border-box",
          borderRadius: 14,
          background: "rgba(255,255,255,.94)",
          color: "#172139",
          fontSize: 40,
          lineHeight: 1.25,
          fontWeight: 500,
          opacity: second,
          translate: `${interpolate(second, [0, 1], [-90, 0])}px 0`,
        }}
      >
        <div>{props.items.slice(2, 4).join(" · ")}</div>
        <div>{props.items.slice(4).join(" · ")}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 75,
          top: 82,
          border: `3px solid ${props.accentColor}`,
          borderRadius: 28,
          background: "#fff",
          color: "#31976e",
          padding: "9px 18px",
          fontSize: 24,
          lineHeight: 1,
          fontWeight: 900,
          opacity: second,
        }}
      >
        每天都在交付
      </div>
      <div
        style={{
          position: "absolute",
          left: 73,
          bottom: 118,
          display: "flex",
          gap: 18,
          opacity: second,
        }}
      >
        {["PPT", "REPORT", "EXCEL", "FILES"].map((label) => (
          <div
            key={label}
            style={{
              padding: "14px 23px",
              borderRadius: 30,
              border: "3px solid #151515",
              background: "#fff",
              color: "#181818",
              fontSize: 25,
              lineHeight: 1,
              fontWeight: 950,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </>
  );
};

const TitleBuild = ({
  props,
  frame,
}: {
  props: Aroll1317Props;
  frame: number;
}) => {
  const pieces = [...props.title];
  const layout = REFERENCE_LAYOUT.titleBuild;

  return (
    <div
      style={{
        position: "absolute",
        left: layout.left,
        top: layout.top,
        display: "flex",
        alignItems: "center",
        color: "#fff",
        filter: "drop-shadow(8px 10px 0 #111)",
      }}
    >
      {pieces.map((piece, index) => {
        const progress = enter(
          frame,
          props.revealFrames[index] ?? index * 5,
          7,
        );
        return (
          <span
            key={`${piece}-${index}`}
            style={{
              fontSize: layout.fontSize,
              lineHeight: 1,
              fontWeight: 950,
              opacity: progress,
              scale: interpolate(progress, [0, 1], [1.45, 1]),
              translate: `0 ${interpolate(progress, [0, 1], [-60, 0])}px`,
            }}
          >
            {piece}
          </span>
        );
      })}
    </div>
  );
};

const ClaimSequence = ({
  props,
  frame,
}: {
  props: Aroll1317Props;
  frame: number;
}) => {
  const secondStart = props.revealFrames[1] ?? 100;
  const first = enter(frame, props.revealFrames[0] ?? 42, 10);
  const firstExit = interpolate(
    frame,
    [secondStart - 10, secondStart + 2],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const second = enter(frame, secondStart, 11);
  const layout = REFERENCE_LAYOUT.claim;
  const renderClaim = (
    text: string,
    progress: number,
    color: string,
    top: number,
  ) => (
    <div
      style={{
        position: "absolute",
        left: layout.left,
        right: layout.right,
        top,
        color: "#fff",
        fontSize: layout.fontSize,
        lineHeight: 0.94,
        fontWeight: 950,
        whiteSpace: "pre-line",
        textAlign: "left",
        textShadow: "8px 10px 0 rgba(0,0,0,.78)",
        opacity: progress,
        scale: interpolate(progress, [0, 1], [1.25, 1]),
        rotate: layout.rotate,
      }}
    >
      {text.split("|").map((line, index) => (
        <div key={line} style={{color: index === 1 ? color : "#fff"}}>
          {line}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {renderClaim(
        props.title,
        first * firstExit,
        props.accentColor,
        layout.firstTop,
      )}
      {renderClaim(props.subtitle, second, props.secondaryColor, layout.secondTop)}
    </>
  );
};

export const Aroll1317Scene = (props: Aroll1317Props) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const scale = Math.min(width / 1920, height / 1080);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#bfc3c5",
        fontFamily:
          '"PingFang SC", "Microsoft YaHei", Arial, Helvetica, sans-serif',
      }}
    >
      <PhotoPresenterPanel {...props} frame={frame} />
      <AbsoluteFill
        style={{
          background:
            props.variant === "title-build" || props.variant === "claim-sequence"
              ? "linear-gradient(90deg, rgba(29,30,93,.4), rgba(14,20,54,.05), rgba(13,24,74,.38))"
              : "linear-gradient(90deg, rgba(0,0,0,.08), transparent 35%, rgba(0,0,0,.08))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          scale,
          transformOrigin: "top left",
        }}
      >
        {props.variant === "agent-cards" ? (
          <AgentCards props={props} frame={frame} />
        ) : null}
        {props.variant === "numbered-list" ? (
          <NumberedList props={props} frame={frame} />
        ) : null}
        {props.variant === "workflow-swap" ? (
          <WorkflowSwap props={props} frame={frame} />
        ) : null}
        {props.variant === "title-build" ? (
          <TitleBuild props={props} frame={frame} />
        ) : null}
        {props.variant === "claim-sequence" ? (
          <ClaimSequence props={props} frame={frame} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
