import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import {AI_TERMINAL_LAYOUT as layout} from "./reference-layout";
import type {AITerminalSceneProps} from "./types";

const mono =
  '"SFMono-Regular", "Cascadia Code", "Roboto Mono", ui-monospace, monospace';

const reveal = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const typed = (value: string, frame: number, start: number, speed = 1.7) =>
  value.slice(0, Math.max(0, Math.floor((frame - start) / speed)));

const GridBackground = ({
  light = false,
  children,
}: {
  light?: boolean;
  children: ReactNode;
}) => (
  <AbsoluteFill
    style={{
      color: light ? "#15171b" : "#f3f2f0",
      backgroundColor: light ? "#f4eadb" : "#1a1411",
      backgroundImage: light
        ? "radial-gradient(circle at 50% 45%, rgba(255,255,255,.74), transparent 58%)"
        : [
            "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
            "radial-gradient(circle at 18% 55%, rgba(49,74,130,.2), transparent 35%)",
            "radial-gradient(circle at 88% 48%, rgba(133,61,30,.17), transparent 38%)",
          ].join(","),
      backgroundSize: light ? "auto" : "48px 48px, 48px 48px, auto, auto",
    }}
  >
    {children}
  </AbsoluteFill>
);

const WindowSurface = ({
  title,
  children,
  style,
  light = false,
}: {
  title: string;
  children: ReactNode;
  style: CSSProperties;
  light?: boolean;
}) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 17,
      overflow: "hidden",
      color: light ? "#16181c" : "#f4f2ee",
      background: light ? "#fff" : "#100d0c",
      border: light
        ? "1px solid rgba(70,60,52,.22)"
        : "1px solid rgba(255,255,255,.16)",
      boxShadow: "0 26px 60px rgba(0,0,0,.22)",
      ...style,
    }}
  >
    <div
      style={{
        height: 66,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        boxSizing: "border-box",
        borderBottom: light
          ? "1px solid rgba(30,30,30,.1)"
          : "1px solid rgba(255,255,255,.1)",
        background: light ? "#f1ebe3" : "#1d1a18",
        fontFamily: mono,
        fontSize: 22,
        color: light ? "#252525" : "#8c8987",
      }}
    >
      <div style={{display: "flex", gap: 9, marginRight: 26}}>
        {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
          <div
            key={color}
            style={{width: 14, height: 14, borderRadius: "50%", background: color}}
          />
        ))}
      </div>
      {title}
    </div>
    {children}
  </div>
);

const Cursor = ({color = "#df7657"}: {color?: string}) => (
  <span
    style={{
      display: "inline-block",
      width: 11,
      height: "1em",
      marginLeft: 5,
      verticalAlign: "-.1em",
      background: color,
    }}
  />
);

const CodeSplit = ({
  props,
  frame,
}: {
  props: AITerminalSceneProps;
  frame: number;
}) => {
  const box = layout.code;
  const enter = reveal(frame, 3, 18);
  return (
    <AbsoluteFill style={{background: "#f1e8db"}}>
      <WindowSurface
        title={props.headline}
        style={{
          left: box.terminalX,
          top: box.terminalY,
          width: box.terminalWidth,
          height: box.terminalHeight,
          opacity: enter,
          scale: interpolate(enter, [0, 1], [0.96, 1]),
        }}
      >
        <div
          style={{
            padding: "26px 28px",
            fontFamily: mono,
            fontSize: 27,
            lineHeight: 1.48,
            color: "#d8d7dc",
          }}
        >
          {props.lines.map((line, index) => {
            const progress = reveal(frame, 8 + index * 5, 7);
            return (
              <div
                key={`${line}-${index}`}
                style={{
                  opacity: progress,
                  translate: `${interpolate(progress, [0, 1], [-18, 0])}px 0`,
                  color:
                    index === 0 || index === 2
                      ? "#b6a2ff"
                      : index === 1
                        ? "#b9df72"
                        : index >= 4 && index <= 5
                          ? "#9fc7ff"
                          : "#dedde1",
                }}
              >
                {line}
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              bottom: 16,
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
              fontSize: 22,
              fontWeight: 750,
              color: "#bbb8bd",
            }}
          >
            <span style={{color: "#4b8fff"}}>HyperFrames</span> ·{" "}
            {props.subline.split("·").slice(1).join("·")}
          </div>
        </div>
      </WindowSurface>
      <div
        style={{
          position: "absolute",
          left: box.portraitX,
          top: box.portraitY,
          width: box.portraitWidth,
          height: box.portraitHeight,
          overflow: "hidden",
          borderRadius: 18,
          opacity: reveal(frame, 8, 18),
          boxShadow: "0 28px 60px rgba(50,35,22,.27)",
          background: "#c8cdcf",
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
    </AbsoluteFill>
  );
};

const BasicTerminal = ({
  props,
  frame,
  context = false,
}: {
  props: AITerminalSceneProps;
  frame: number;
  context?: boolean;
}) => {
  const box = context ? layout.contextTerminal : layout.terminal;
  const prompt = context ? props.lines[0] : "";
  return (
    <GridBackground>
      <WindowSurface
        title={props.headline}
        style={{
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          opacity: reveal(frame, 4, 16),
          scale: interpolate(reveal(frame, 4, 16), [0, 1], [0.98, 1]),
        }}
      >
        {!context ? (
          <div
            style={{
              padding: "34px 36px",
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.45,
            }}
          >
            {props.lines.map((line, index) => (
              <div
                key={`${line}-${index}`}
                style={{opacity: reveal(frame, 4 + index * 4, 6)}}
              >
                {line}
              </div>
            ))}
            <div
              style={{
                marginTop: 16,
                color: props.accentColor,
                fontFamily: mono,
              }}
            >
              &gt; <Cursor />
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                left: 22,
                right: 22,
                top: layout.contextTerminal.inputTop - box.y,
                height: layout.contextTerminal.inputHeight,
                padding: "0 22px",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                borderRadius: 13,
                border: `2px solid ${props.accentColor}`,
                fontFamily:
                  '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              <span style={{color: props.accentColor, fontFamily: mono}}>&gt;&nbsp;</span>
              {typed(prompt, frame, 28, 2.3)}
              <Cursor color={props.accentColor} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 120,
                opacity: reveal(frame, 112, 14),
                fontFamily: mono,
                fontSize: 24,
                lineHeight: 1.7,
                color: "#aaa5a2",
              }}
            >
              {props.lines.slice(1).map((line) => (
                <div key={line}>
                  <span style={{color: "#62a2ff"}}>●</span> {line}
                </div>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                left: 28,
                bottom: 15,
                color: "#75706d",
                fontFamily: mono,
                fontSize: 21,
              }}
            >
              ~ · {props.subline}
            </div>
          </>
        )}
      </WindowSurface>
    </GridBackground>
  );
};

const InputComposer = ({
  text,
  frame,
  start,
  accent,
  light = false,
}: {
  text: string;
  frame: number;
  start: number;
  accent: string;
  light?: boolean;
}) => {
  const cleared = reveal(frame, 134, 9);
  const visibleText = typed(text, frame, start, 1.45);
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        padding: "28px 30px",
        boxSizing: "border-box",
        color: "#18191d",
        background: "#fff",
        borderRadius: 27,
        boxShadow: light ? "0 20px 55px rgba(86,68,46,.16)" : undefined,
        fontSize: 27,
        fontWeight: 750,
      }}
    >
      <span style={{opacity: 1 - cleared}}>{visibleText}</span>
      {frame >= start && frame < 134 ? <Cursor color="#77716c" /> : null}
      <div
        style={{
          position: "absolute",
          left: 25,
          bottom: 20,
          display: "flex",
          gap: 13,
          alignItems: "center",
          color: "#6f6b67",
          fontSize: 20,
        }}
      >
        {["＋", "≠", "◎"].map((item) => (
          <div
            key={item}
            style={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              border: "2px solid #ddd9d4",
            }}
          >
            {item}
          </div>
        ))}
        <div
          style={{
            padding: "9px 16px",
            border: "1px solid #ddd9d4",
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
          }}
        >
          Claude Sonnet 4.5
          <span
            style={{
              display: "block",
              width: layout.aiInput.modelSelectorChevron.width,
              height: layout.aiInput.modelSelectorChevron.height,
              marginLeft: layout.aiInput.modelSelectorChevron.marginLeft,
              background: "currentColor",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 24,
          bottom: 20,
          width: 45,
          height: 45,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          color: "#fff",
          background: accent,
          scale: interpolate(reveal(frame, 124, 8), [0, 1], [1, 1.13]),
          fontSize: 29,
        }}
      >
        ↑
      </div>
    </div>
  );
};

const AiInput = ({
  props,
  frame,
}: {
  props: AITerminalSceneProps;
  frame: number;
}) => (
  <AbsoluteFill
    style={{
      background: "#251c17",
      color: "#17181c",
      boxShadow: "inset 0 0 0 3px rgba(239,225,208,.35)",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 26,
        border: "3px solid rgba(235,224,211,.55)",
        borderRadius: 28,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 225,
        textAlign: "center",
        fontSize: 45,
        fontWeight: 800,
      }}
    >
      <span style={{color: props.accentColor}}>✦</span> {props.headline}
    </div>
    <div
      style={{
        position: "absolute",
        left: layout.aiInput.x,
        top: layout.aiInput.y,
        width: layout.aiInput.width,
        height: layout.aiInput.height,
        opacity: reveal(frame, 12, 15),
      }}
    >
      <InputComposer
        text={props.subline}
        frame={frame}
        start={layout.aiInput.typeStart}
        accent={props.accentColor}
      />
    </div>
  </AbsoluteFill>
);

const RobotMark = ({color}: {color: string}) => (
  <div
    style={{
      position: "relative",
      width: 142,
      height: 100,
      background: color,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: -22,
        right: -22,
        top: 40,
        height: 22,
        background: color,
      }}
    />
    {[31, 91].map((left) => (
      <div
        key={left}
        style={{
          position: "absolute",
          left,
          top: 22,
          width: 15,
          height: 25,
          background: "#fff",
        }}
      />
    ))}
    {[25, 58, 102].map((left) => (
      <div
        key={left}
        style={{
          position: "absolute",
          left,
          bottom: -20,
          width: 14,
          height: 26,
          background: color,
        }}
      />
    ))}
  </div>
);

const ClaudeInput = ({
  props,
  frame,
  compact = false,
}: {
  props: AITerminalSceneProps;
  frame: number;
  compact?: boolean;
}) => (
  <AbsoluteFill style={{background: "#fff", color: "#1d1e22", fontFamily: mono}}>
    <div
      style={{
        position: "absolute",
        left: 15,
        right: 15,
        top: 9,
        height: 50,
        border: "3px solid #d8d0c6",
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        background: "#f0e9e1",
        fontSize: compact ? 21 : 25,
        fontWeight: 800,
      }}
    >
      ~/项目/内容创作 - Claude Code - caffeinate ‹ Claude
    </div>
    <div
      style={{
        position: "absolute",
        left: 22,
        top: 122,
      }}
    >
      <RobotMark color={props.accentColor} />
    </div>
    <div style={{position: "absolute", left: 220, top: 104}}>
      <div style={{fontSize: 38, fontWeight: 900}}>{props.headline}</div>
      <div style={{fontSize: 32, color: "#716c68", marginTop: 15}}>
        {props.lines[0]}
      </div>
      <div style={{fontSize: 34, color: "#716c68", marginTop: 12, fontWeight: 800}}>
        ~/项目/内容创作
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 52,
        bottom: 92,
        height: 114,
        padding: "30px 0",
        boxSizing: "border-box",
        borderTop: "2px solid #bdb8b4",
        borderBottom: "2px solid #bdb8b4",
        fontSize: compact ? 26 : 31,
      }}
    >
      &gt; {typed(props.subline, frame, 30, 1.35)}
      <Cursor color="#77716c" />
    </div>
    <div
      style={{
        position: "absolute",
        left: 220,
        top: 252,
        width: 1280,
        fontFamily:
          '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
        fontSize: 27,
        lineHeight: 1.55,
        fontWeight: 700,
        opacity: reveal(frame, 118, 14),
        translate: `0 ${interpolate(
          reveal(frame, 118, 14),
          [0, 1],
          [24, 0],
        )}px`,
      }}
    >
      <div style={{fontFamily: mono, fontSize: 22, marginBottom: 12}}>
        ● {props.subline}
      </div>
      已读取当前项目结构，将为新的 AI 工作台生成清晰的界面布局与交互路径。
    </div>
    <div
      style={{
        position: "absolute",
        left: 57,
        bottom: 12,
        fontSize: 28,
        fontWeight: 850,
        color: "#73706d",
      }}
    >
      <span style={{color: "#3d82e5"}}>项目/内容创作</span> ·{" "}
      <span style={{color: props.accentColor}}>(main)</span> · Opus 4.8 (1M context)
      · <span style={{color: props.accentColor}}>auto mode on</span>
    </div>
  </AbsoluteFill>
);

const PanChatPane = ({
  props,
  frame,
}: {
  props: AITerminalSceneProps;
  frame: number;
}) => (
  <AbsoluteFill style={{background: "#f3eadc", color: "#17181c"}}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 260,
        textAlign: "center",
        fontSize: 44,
        fontWeight: 850,
      }}
    >
      <span style={{color: props.accentColor}}>✦</span> {props.headline}
    </div>
    <div
      style={{
        position: "absolute",
        left: 365,
        top: 410,
        width: 1190,
        height: 218,
      }}
    >
      <InputComposer
        text={props.subline}
        frame={frame}
        start={24}
        accent={props.accentColor}
        light
      />
    </div>
  </AbsoluteFill>
);

const InputPan = ({
  props,
  frame,
}: {
  props: AITerminalSceneProps;
  frame: number;
}) => {
  const overview = reveal(frame, 58, 24);
  const terminalTakeover = reveal(frame, 99, 27);
  const chatLeft = interpolate(overview, [0, 1], [0, 220]);
  const chatTop = interpolate(overview, [0, 1], [0, 290]);
  const chatScale = interpolate(overview, [0, 1], [1, 0.36]);
  const terminalLeft = interpolate(
    terminalTakeover,
    [0, 1],
    [1025, 0],
  );
  const terminalTop = interpolate(
    terminalTakeover,
    [0, 1],
    [290, 0],
  );
  const terminalScale = interpolate(
    terminalTakeover,
    [0, 1],
    [0.36, 1],
  );
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#1c1714"}}>
      <div
        style={{
          position: "absolute",
          left: chatLeft,
          top: chatTop,
          width: 1920,
          height: 1080,
          transformOrigin: "top left",
          scale: chatScale,
          opacity: 1 - terminalTakeover,
          boxShadow: overview > 0.05 ? "0 30px 75px rgba(0,0,0,.34)" : undefined,
        }}
      >
        <PanChatPane props={props} frame={frame} />
      </div>
      <div
        style={{
          position: "absolute",
          left: terminalLeft,
          top: terminalTop,
          width: 1920,
          height: 1080,
          transformOrigin: "top left",
          scale: terminalScale,
          opacity: overview,
          boxShadow:
            terminalTakeover < 0.95
              ? "0 30px 75px rgba(0,0,0,.34)"
              : undefined,
        }}
      >
        <ClaudeInput
          props={{...props, variant: "claude-input", headline: props.lines[0]}}
          frame={frame}
        />
      </div>
    </AbsoluteFill>
  );
};

const CommandMenu = ({
  props,
  frame,
}: {
  props: AITerminalSceneProps;
  frame: number;
}) => {
  const box = layout.commandMenu;
  const active =
    frame >= box.stageFrames[3]
      ? 3
      : frame >= box.stageFrames[2]
        ? 2
        : frame >= box.stageFrames[1]
          ? 1
          : 0;
  const labels = ["创建", "管理", "检查", "检查"];
  const keys = ["N", "G", "R", "L"];
  return (
    <GridBackground>
      <div style={{position: "absolute", left: 104, top: 80}}>
        <div style={{fontFamily: mono, fontSize: 24, color: props.accentColor}}>
          {props.subline}
        </div>
        <div style={{fontSize: 55, fontWeight: 950, marginTop: 10}}>
          {props.headline}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          borderRadius: 28,
          overflow: "hidden",
          background: "rgba(18,20,23,.94)",
          border: "1px solid rgba(255,255,255,.18)",
          boxShadow: "0 30px 70px rgba(0,0,0,.3)",
        }}
      >
        <div
          style={{
            height: 116,
            padding: "0 38px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,.14)",
            boxSizing: "border-box",
            fontSize: 35,
            fontWeight: 900,
          }}
        >
          <span style={{fontFamily: mono, color: props.accentColor, marginRight: 22}}>
            ⌘
          </span>
          镜头
        </div>
        <div style={{padding: "22px 30px"}}>
          {props.lines.map((line, index) => {
            const selected = index === active;
            return (
              <div
                key={line}
                style={{
                  height: 95,
                  padding: "0 24px",
                  display: "grid",
                  gridTemplateColumns: "150px 1fr 58px",
                  alignItems: "center",
                  borderRadius: 18,
                  color: selected ? "#fff" : "#b1adaa",
                  background: selected
                    ? "linear-gradient(90deg, rgba(232,121,85,.24), rgba(232,121,85,.1))"
                    : "transparent",
                  border: selected
                    ? "1px solid rgba(232,121,85,.62)"
                    : "1px solid transparent",
                  fontSize: 26,
                  fontWeight: 850,
                }}
              >
                <span style={{color: selected ? props.accentColor : "#8b8784"}}>
                  {labels[index]}
                </span>
                <span style={{fontSize: 31}}>{line}</span>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(255,255,255,.2)",
                    borderRadius: 10,
                    fontFamily: mono,
                  }}
                >
                  {keys[index]}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            right: 34,
            bottom: 21,
            color: "#8e8a87",
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          ↑↓ 选择 · ↵ 确认
        </div>
      </div>
    </GridBackground>
  );
};

const CommandConverge = ({
  props,
  frame,
}: {
  props: AITerminalSceneProps;
  frame: number;
}) => {
  const box = layout.commandConverge;
  const selected = Math.min(props.lines.length - 1, Math.floor(frame / 36));
  const result = reveal(frame, 86, 16);
  return (
    <GridBackground light>
      <div style={{position: "absolute", left: 108, top: 85}}>
        <div style={{fontFamily: mono, color: props.accentColor, fontSize: 23}}>
          {props.subline}
        </div>
        <div style={{fontSize: 58, fontWeight: 950, marginTop: 12}}>
          {props.headline}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          border: "1px solid rgba(91,76,62,.2)",
          borderRadius: 30,
          background: "rgba(249,244,237,.86)",
          boxShadow: "0 25px 60px rgba(92,62,32,.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 127,
            padding: "0 45px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(80,70,60,.14)",
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          <span style={{color: props.accentColor, fontFamily: mono, marginRight: 20}}>
            ⌘
          </span>
          镜头 <Cursor color={props.accentColor} />
        </div>
        <div style={{display: "flex", gap: 30, padding: "30px 60px 0"}}>
          {props.lines.map((line, index) => (
            <div
              key={line}
              style={{
                padding: "11px 25px",
                borderRadius: 999,
                color: index === selected ? props.accentColor : "#b6afa7",
                background:
                  index === selected ? "rgba(232,121,85,.11)" : "transparent",
                border:
                  index === selected
                    ? "1px solid rgba(232,121,85,.5)"
                    : "1px solid rgba(100,90,80,.08)",
                fontSize: 24,
                fontWeight: 850,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 35,
            right: 35,
            bottom: 38,
            height: 252,
            padding: "38px 40px",
            boxSizing: "border-box",
            borderRadius: 22,
            background: "rgba(232,121,85,.055)",
            opacity: result,
            translate: `0 ${interpolate(result, [0, 1], [45, 0])}px`,
          }}
        >
          <div style={{fontSize: 21, color: props.accentColor, fontWeight: 850}}>
            工作台 / 镜头目录 / {props.lines[selected]}
          </div>
          <div style={{fontSize: 42, fontWeight: 950, marginTop: 30}}>
            打开「{props.lines[selected]}」相关动作
          </div>
          <div style={{fontSize: 25, color: "#77716b", marginTop: 20}}>
            排除无关项，保留当前位置
          </div>
        </div>
      </div>
    </GridBackground>
  );
};

export const AITerminalScene = (props: AITerminalSceneProps) => {
  const frame = useCurrentFrame();

  if (props.variant === "code-split") {
    return <CodeSplit props={props} frame={frame} />;
  }
  if (props.variant === "terminal") {
    return <BasicTerminal props={props} frame={frame} />;
  }
  if (props.variant === "context-terminal") {
    return <BasicTerminal props={props} frame={frame} context />;
  }
  if (props.variant === "ai-input") {
    return <AiInput props={props} frame={frame} />;
  }
  if (props.variant === "claude-input") {
    return <ClaudeInput props={props} frame={frame} />;
  }
  if (props.variant === "input-pan") {
    return <InputPan props={props} frame={frame} />;
  }
  if (props.variant === "command-menu") {
    return <CommandMenu props={props} frame={frame} />;
  }
  return <CommandConverge props={props} frame={frame} />;
};
