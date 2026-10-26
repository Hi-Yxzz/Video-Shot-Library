import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {PhotoPresenterPanel} from "../equity/PhotoPresenterPanel";
import type {ProductSOPPanelProps} from "./types";

export const ProductSOPPanel = (props: ProductSOPPanelProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const expand = interpolate(
    frame,
    [props.expandStart, props.expandEnd],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#c8cdcf"}}>
      <PhotoPresenterPanel
        portraitSrc={props.portraitSrc}
        portraitScale={props.portraitScale}
        portraitPositionX={props.portraitPositionX}
        portraitPositionY={props.portraitPositionY}
        breathingAmount={props.breathingAmount}
        floatingAmount={props.floatingAmount}
        cameraPushAmount={props.cameraPushAmount}
        durationInFrames={props.durationInFrames}
        frame={frame}
      />
      <div
        style={{
          position: "absolute",
          left: props.panelX,
          top: props.panelY,
          width: interpolate(
            expand,
            [0, 1],
            [props.collapsedWidth, props.expandedWidth],
          ),
          height: interpolate(
            expand,
            [0, 1],
            [props.collapsedHeight, props.expandedHeight],
          ),
          opacity: enter,
          scale: interpolate(enter, [0, 1], [0.78, 1]),
          translate: `${interpolate(enter, [0, 1], [-45, 0])}px 0`,
          display: "flex",
          overflow: "hidden",
          borderRadius: 8,
          border: "1px solid rgba(40,48,52,.17)",
          background: "#ffffff",
          boxShadow: "0 20px 44px rgba(16,28,34,.22)",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#202326",
        }}
      >
        <div
          style={{
            width: 112,
            flex: "0 0 112px",
            padding: "18px 12px",
            background: "#f4f5f5",
            borderRight: "1px solid #e1e4e5",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: props.accentColor,
              marginBottom: 18,
            }}
          />
          {["项目", "文档", "任务", "素材", "设置"].map((item, index) => (
            <div
              key={item}
              style={{
                height: 27,
                marginBottom: 7,
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                borderRadius: 5,
                background: index === 1 ? "#e6e9ea" : "transparent",
                color: "#6b7276",
                fontSize: 11,
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            padding: interpolate(expand, [0, 1], [16, 30]),
            opacity: interpolate(expand, [0, 0.22, 1], [0.2, 0.72, 1]),
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#8a9194",
              letterSpacing: 1.2,
              marginBottom: 8,
            }}
          >
            {props.eyebrow}
          </div>
          <div
            style={{
              fontSize: interpolate(expand, [0, 1], [14, 24]),
              fontWeight: 760,
              lineHeight: 1.25,
              marginBottom: 22,
              whiteSpace: "nowrap",
            }}
          >
            {props.title}
          </div>
          {props.sections.map((section, index) => (
            <div key={`${section}-${index}`} style={{marginBottom: 17}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: props.accentColor,
                    color: "#fff",
                    fontSize: 10,
                  }}
                >
                  {index + 1}
                </span>
                {section}
              </div>
              <div
                style={{
                  height: 5,
                  width: `${78 - index * 5}%`,
                  borderRadius: 5,
                  background: "#dfe3e4",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  height: 5,
                  width: `${58 + (index % 2) * 13}%`,
                  borderRadius: 5,
                  background: "#edf0f1",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
