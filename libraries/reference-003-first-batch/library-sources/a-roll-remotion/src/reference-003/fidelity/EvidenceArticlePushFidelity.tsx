import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { R03_SANS, R03_SERIF } from "../fonts";
import { getEvidenceArticlePushFidelityState } from "../motion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const MemoLine = ({ width }: { width: string }) => (
  <div
    style={{
      width,
      height: 13,
      borderRadius: 2,
      background: "#c6c6c0",
      marginBottom: 15,
    }}
  />
);

export const EvidenceArticlePushFidelity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = getEvidenceArticlePushFidelityState(frame);
  const articleEnter = spring({
    frame: state.articleSpringFrame,
    fps,
    config: { damping: 25, stiffness: 108, mass: 1.05 },
    durationInFrames: 44,
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#f3f2ec",
        color: "#111214",
        fontFamily: R03_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(47,53,58,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(47,53,58,.08) 1px, transparent 1px), radial-gradient(rgba(18,20,21,.13) .65px, transparent .8px)",
          backgroundSize: "18px 18px, 18px 18px, 5px 5px",
          scale: interpolate(state.camera, [0, 1], [1, 1.06], CLAMP),
        }}
      />

      <AbsoluteFill
        style={{
          opacity: interpolate(state.article, [0, 0.5], [1, 0], CLAMP),
          scale: interpolate(state.camera, [0, 0.45], [0.94, 1.08], CLAMP),
          translate: `${interpolate(state.camera, [0, 0.45], [46, -48], CLAMP)}px 0`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 1620,
            opacity: state.headline,
            translate: `0 ${interpolate(state.headline, [0, 1], [58, 0], CLAMP)}px`,
          }}
        >
          <div
            style={{
              fontFamily: R03_SERIF,
              fontSize: 164,
              fontStyle: "italic",
              fontWeight: 800,
              letterSpacing: -9,
              lineHeight: 0.94,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            A NEW LIMIT APPEARS
          </div>
          <div
            style={{
              position: "absolute",
              left: 212,
              top: 128,
              width: `${state.blueUnderline * 72}%`,
              height: 65,
              background: "#2458ef",
              zIndex: -1,
              boxShadow: "8px 8px 0 rgba(18,38,95,.14)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 294,
              top: 132,
              width: 1040,
              overflow: "hidden",
              clipPath: `inset(0 ${100 - state.amberUnderline * 100}% 0 0)`,
              color: "#dfa12d",
              fontFamily: R03_SERIF,
              fontSize: 92,
              fontStyle: "italic",
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 0.75,
              whiteSpace: "nowrap",
            }}
          >
            REVIEW THE NEW BOUNDARY
          </div>
          <div
            style={{
              position: "absolute",
              right: 8,
              top: -4,
              width: 5,
              height: 174,
              background: "#dfa12d",
            }}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: state.article,
          scale:
            interpolate(articleEnter, [0, 1], [0.88, 1], CLAMP) *
            interpolate(state.evidenceFocus, [0, 1], [1, 1.58], CLAMP),
          translate: `${interpolate(state.evidenceFocus, [0, 1], [0, -128], CLAMP)}px ${interpolate(state.evidenceFocus, [0, 1], [72, -116], CLAMP)}px`,
          transformOrigin: "50% 63%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 1440,
            height: 910,
            padding: "78px 104px",
            boxSizing: "border-box",
            background: "rgba(249,248,242,.96)",
            border: "1px solid rgba(31,35,38,.22)",
            boxShadow: "0 38px 80px rgba(31,33,31,.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 24,
              borderBottom: "2px solid #1c2022",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            <span>RESEARCH MEMO / 04</span>
            <span style={{ color: "#777872" }}>QUARTERLY REVIEW</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: 64,
              marginTop: 52,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: R03_SERIF,
                  fontSize: 66,
                  fontWeight: 700,
                  letterSpacing: -2,
                  lineHeight: 1.08,
                }}
              >
                Updated guidance for a measured rollout
              </div>
              <div
                style={{
                  marginTop: 26,
                  color: "#656660",
                  fontSize: 21,
                  lineHeight: 1.55,
                }}
              >
                A neutral working memo for planning, review, and responsible
                implementation.
              </div>
            </div>
            <div
              style={{
                paddingLeft: 28,
                borderLeft: "1px solid #9b9d98",
                fontSize: 18,
                lineHeight: 1.7,
                color: "#595b58",
              }}
            >
              ISSUE 04 / FIELD NOTE
              <br />
              REVIEWED THIS QUARTER
              <br />
              STATUS: ACTIVE
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              marginTop: 62,
              fontFamily: R03_SERIF,
              fontSize: 25,
              lineHeight: 1.62,
              color: "#333533",
            }}
          >
            <div>
              <MemoLine width="94%" />
              <MemoLine width="86%" />
              <MemoLine width="91%" />
              <p>
                Teams may continue staged testing while documenting each
                decision and checking the current operating boundary.
              </p>
              <p>
                The working group will review capacity, timing, and evidence
                before the next release window.
              </p>
            </div>
            <div>
              <MemoLine width="90%" />
              <MemoLine width="95%" />
              <MemoLine width="80%" />
              <p>
                The revised guideline takes effect this quarter. Each rollout
                remains subject to routine review and documented safeguards.
              </p>
              <p>
                This memo describes a fictional process and makes no external
                claim.
              </p>
            </div>

            <div
              style={{
                position: "absolute",
                right: -24,
                top: 122,
                width: `${state.evidenceFocus * 610}px`,
                height: 58,
                background: "#111315",
                boxShadow: "8px 10px 0 rgba(38,88,239,.18)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 72,
                top: 196,
                width: `${state.evidenceFocus * 510}px`,
                height: 58,
                background: "#111315",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 8,
                top: 131,
                width: 560,
                opacity: state.evidenceFocus,
                color: "#f7f4e9",
                fontFamily: R03_SANS,
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: 0.3,
                lineHeight: 3.5,
                whiteSpace: "nowrap",
              }}
            >
              THE REVISED GUIDELINE TAKES EFFECT THIS QUARTER
              <br />
              DOCUMENT EACH DECISION BEFORE RELEASE
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 48%, rgba(24,27,28,.24) 100%)",
          boxShadow: "inset 0 0 70px rgba(25,27,27,.12)",
        }}
      />
    </AbsoluteFill>
  );
};
