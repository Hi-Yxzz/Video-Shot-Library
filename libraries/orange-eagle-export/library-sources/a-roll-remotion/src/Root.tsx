import {Composition} from "remotion";
import {PhotoReplica} from "./PhotoReplica";
import {photoReplicaSchema} from "./config";
import {OpenAIEquitySplit} from "./equity/OpenAIEquitySplit";
import {openAIEquitySchema} from "./equity/types";
import {AIBrandCardComparison} from "./brand-cards/AIBrandCardComparison";
import {aiBrandCardSchema} from "./brand-cards/types";
import {AIIconCloud} from "./icon-cloud/AIIconCloud";
import {aiIconCloudSchema} from "./icon-cloud/types";
import {ProductSOPPanel} from "./document-panel/ProductSOPPanel";
import {productSOPPanelSchema} from "./document-panel/types";
import {AIUsageHeadline} from "./headline/AIUsageHeadline";
import {aiUsageHeadlineSchema} from "./headline/types";
import {LogoCallout} from "./batch/LogoCallout";
import {PromptDocumentSplit} from "./batch/PromptDocumentSplit";
import {ToolComparisonFrame} from "./batch/ToolComparisonFrame";
import {
  logoCalloutSchema,
  promptDocumentSchema,
  toolComparisonSchema,
} from "./batch/types";
import {ArollOverlayScene} from "./aroll-batch/ArollOverlayScene";
import {arollOverlaySchema} from "./aroll-batch/types";
import {Aroll1317Scene} from "./aroll-13-17/Aroll1317Scene";
import {aroll1317Schema} from "./aroll-13-17/types";
import {POINT_CARD_SHOTS} from "./point-cards/catalog";
import {PointCardScene} from "./point-cards/PointCardScene";
import {pointCardSceneSchema} from "./point-cards/types";
import {AITerminalScene} from "./ai-terminal/AITerminalScene";
import {AI_TERMINAL_SHOTS} from "./ai-terminal/catalog";
import {aiTerminalSceneSchema} from "./ai-terminal/types";
import {ScreenshotRecordingScene} from "./screenshot-recording/ScreenshotRecordingScene";
import {SCREENSHOT_RECORDING_SHOTS} from "./screenshot-recording/catalog";
import {screenshotRecordingSceneSchema} from "./screenshot-recording/types";
import {TransitionBackgroundScene} from "./transition-background/TransitionBackgroundScene";
import {TRANSITION_BACKGROUND_SHOTS} from "./transition-background/catalog";
import {transitionBackgroundSceneSchema} from "./transition-background/types";
import "./index.css";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PhotoReplica"
        component={PhotoReplica}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={230}
        schema={photoReplicaSchema}
        calculateMetadata={({props}) => ({
          durationInFrames: props.durationInFrames,
        })}
        defaultProps={{
          portraitSrc: "assets/portrait-landscape.png",
          durationInFrames: 230,
          backgroundScale: 1.03,
          backgroundPositionX: 50,
          backgroundPositionY: 50,
          portraitScale: 1.012,
          portraitOffsetX: 0,
          portraitOffsetY: 0,
          breathingAmount: 0.012,
          floatingAmount: 4,
          cameraPushAmount: 0.018,
          backgroundBrightness: 0.92,
          backgroundContrast: 1.04,
          vignetteAmount: 0.18,
          topTrack: {
            items: [
              {
                id: "microsoft",
                type: "text",
                label: "Microsoft",
                accentColor: "#00a4ef",
              },
              {
                id: "google",
                type: "text",
                label: "Google",
                accentColor: "#4285f4",
              },
              {
                id: "amazon",
                type: "text",
                label: "Amazon",
                accentColor: "#ff9900",
              },
              {
                id: "oracle",
                type: "text",
                label: "Oracle",
                accentColor: "#f80000",
              },
              {
                id: "nvidia",
                type: "text",
                label: "NVIDIA",
                accentColor: "#76b900",
              },
            ],
            speed: 0.55,
            direction: "right",
            gap: 18,
            cardWidth: 142,
            cardHeight: 74,
            opacity: 0.62,
            blur: 0.6,
            borderRadius: 12,
            shadow: 0.18,
          },
          bottomTrack: {
            items: [
              {
                id: "softbank",
                type: "text",
                label: "SoftBank",
                accentColor: "#6f6f6f",
              },
              {
                id: "intel",
                type: "text",
                label: "Intel",
                accentColor: "#0071c5",
              },
              {
                id: "openai",
                type: "text",
                label: "OpenAI",
                accentColor: "#10a37f",
              },
              {
                id: "coreweave",
                type: "text",
                label: "CoreWeave",
                accentColor: "#6c63ff",
              },
              {
                id: "anthropic",
                type: "text",
                label: "Anthropic",
                accentColor: "#d4a27f",
              },
              {
                id: "amd",
                type: "text",
                label: "AMD",
                accentColor: "#ed1c24",
              },
            ],
            speed: 0.9,
            direction: "left",
            gap: 20,
            cardWidth: 150,
            cardHeight: 82,
            opacity: 0.94,
            blur: 0,
            borderRadius: 12,
            shadow: 0.25,
          },
        }}
      />
      <Composition
        id="OpenAIEquitySplit"
        component={OpenAIEquitySplit}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={236}
        schema={openAIEquitySchema}
        calculateMetadata={({props}) => ({
          durationInFrames: props.durationInFrames,
        })}
        defaultProps={{
          durationInFrames: 236,
          portraitSrc: "assets/portrait-landscape.png",
          title: "OpenAI 股权占比",
          eyebrow: "FOCUS ON OPENAI EQUITY",
          dateLabel: "2026.03.31",
          ownershipPercent: 27,
          marketValue: 8520,
          microsoftValue: 2290,
          currencyUnit: "亿",
          totalCells: 100,
          gridColumns: 10,
          microsoftCells: 27,
          splitX: 792,
          introEndFrame: 20,
          splitEndFrame: 35,
          valuationStartFrame: 66,
          microsoftStartFrame: 176,
          microsoftHoldFrame: 206,
          marketColor: "#4d4b4d",
          microsoftColor: "#6f9fd0",
          neutralColor: "#555356",
          mutedColor: "#ececed",
          portraitScale: 1.05,
          portraitPositionX: 50,
          portraitPositionY: 48,
          breathingAmount: 0.008,
          floatingAmount: 3,
          cameraPushAmount: 0.018,
        }}
      />
      <Composition
        id="AIBrandCardComparison"
        component={AIBrandCardComparison}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={66}
        schema={aiBrandCardSchema}
        calculateMetadata={({props}) => ({
          durationInFrames: props.durationInFrames,
        })}
        defaultProps={{
          durationInFrames: 66,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          leftEnterStart: 6,
          leftEnterEnd: 18,
          rightEnterStart: 24,
          rightEnterEnd: 36,
          leftCard: {
            brandName: "OpenAI",
            markText: "◉",
            label: "OPENAI",
            x: 42,
            y: 52,
            width: 320,
            height: 360,
            enterFromX: -150,
            enterFromY: -42,
            panelColor: "#f7f7f4",
            labelColor: "#e8e9de",
            borderColor: "#ffffff",
            textColor: "#161616",
            floatAmplitude: 4,
          },
          rightCard: {
            brandName: "",
            markText: "AI",
            label: "ANTHROPIC",
            x: 924,
            y: 52,
            width: 300,
            height: 360,
            enterFromX: 150,
            enterFromY: -42,
            panelColor: "#f7f7f4",
            labelColor: "#eef0d7",
            borderColor: "#ffffff",
            textColor: "#111111",
            floatAmplitude: 4,
          },
        }}
      />
      <Composition
        id="AIIconCloud"
        component={AIIconCloud}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={140}
        schema={aiIconCloudSchema}
        calculateMetadata={({props}) => ({
          durationInFrames: props.durationInFrames,
        })}
        defaultProps={{
          durationInFrames: 140,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.016,
          enterStart: 7,
          enterStagger: 3,
          enterDuration: 10,
          exitStart: 108,
          exitEnd: 140,
          icons: [
            {
              id: "openai",
              mark: "◉",
              label: "",
              x: -38,
              y: 180,
              size: 92,
              backgroundColor: "#f8f8f4",
              textColor: "#141414",
              rotation: -8,
              enterOffsetX: -90,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 0.4,
            },
            {
              id: "threads",
              mark: "◎",
              label: "",
              x: 274,
              y: 40,
              size: 92,
              backgroundColor: "#111111",
              textColor: "#ffffff",
              rotation: 10,
              enterOffsetX: -35,
              enterOffsetY: -80,
              floatAmplitude: 5,
              phase: 1.1,
            },
            {
              id: "gemini",
              mark: "✦",
              label: "",
              x: 882,
              y: 48,
              size: 88,
              backgroundColor: "#f8f8f4",
              textColor: "#4b70ef",
              rotation: 7,
              enterOffsetX: 20,
              enterOffsetY: -90,
              floatAmplitude: 6,
              phase: 2,
            },
            {
              id: "manus",
              mark: "M",
              label: "",
              x: 1094,
              y: 132,
              size: 100,
              backgroundColor: "#f8f8f4",
              textColor: "#7157d9",
              rotation: 8,
              enterOffsetX: 100,
              enterOffsetY: -20,
              floatAmplitude: 4,
              phase: 2.8,
            },
            {
              id: "liby",
              mark: "↗",
              label: "LIBY",
              x: 870,
              y: 230,
              size: 100,
              backgroundColor: "#111111",
              textColor: "#ffffff",
              rotation: 12,
              enterOffsetX: 80,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 3.5,
            },
            {
              id: "qwen",
              mark: "Q",
              label: "AI",
              x: 1120,
              y: 330,
              size: 84,
              backgroundColor: "#f8f8f4",
              textColor: "#4963e8",
              rotation: 8,
              enterOffsetX: 100,
              enterOffsetY: 35,
              floatAmplitude: 5,
              phase: 4.2,
            },
            {
              id: "star",
              mark: "✦",
              label: "",
              x: 126,
              y: 292,
              size: 96,
              backgroundColor: "#f8f8f4",
              textColor: "#25b9d0",
              rotation: -9,
              enterOffsetX: -100,
              enterOffsetY: 30,
              floatAmplitude: 6,
              phase: 5,
            },
            {
              id: "avatar",
              mark: "AI",
              label: "",
              x: 336,
              y: 324,
              size: 86,
              backgroundColor: "#f1dfd2",
              textColor: "#573e4a",
              rotation: -7,
              enterOffsetX: -45,
              enterOffsetY: 75,
              floatAmplitude: 5,
              phase: 5.8,
            },
          ],
        }}
      />
      <Composition
        id="ProductSOPPanel"
        component={ProductSOPPanel}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={78}
        schema={productSOPPanelSchema}
        calculateMetadata={({props}) => ({
          durationInFrames: props.durationInFrames,
        })}
        defaultProps={{
          durationInFrames: 78,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          panelX: 20,
          panelY: 18,
          collapsedWidth: 190,
          expandedWidth: 520,
          collapsedHeight: 270,
          expandedHeight: 684,
          expandStart: 37,
          expandEnd: 49,
          title: "新产品上线流程 SOP",
          eyebrow: "产品体验 SOP",
          accentColor: "#3178f6",
          sections: [
            "明确产品目标与用户场景",
            "完成核心功能体验",
            "记录问题与优化建议",
            "整理上线素材与说明",
            "复盘数据并持续迭代",
          ],
        }}
      />
      <Composition
        id="AIUsageHeadline"
        component={AIUsageHeadline}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={170}
        schema={aiUsageHeadlineSchema}
        calculateMetadata={({props}) => ({
          durationInFrames: props.durationInFrames,
        })}
        defaultProps={{
          durationInFrames: 170,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.016,
          leftEnterStart: 0,
          leftEnterEnd: 13,
          rightEnterStart: 66,
          rightEnterEnd: 79,
          leftHeadline: {
            lineOne: "三类场景",
            lineTwo: "AI 优先用",
            x: 20,
            y: 80,
            width: 410,
            fontSize: 66,
            textColor: "#ffffff",
            accentColor: "#ffffff",
            align: "left" as const,
          },
          rightHeadline: {
            lineOne: "一类红线",
            lineTwo: "AI 绝不碰",
            x: 865,
            y: 225,
            width: 400,
            fontSize: 62,
            textColor: "#ffffff",
            accentColor: "#ffffff",
            align: "right" as const,
          },
        }}
      />
      <Composition
        id="BilateralAIIconStacks"
        component={AIIconCloud}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={98}
        schema={aiIconCloudSchema}
        calculateMetadata={({props}) => ({
          durationInFrames: props.durationInFrames,
        })}
        defaultProps={{
          durationInFrames: 98,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.014,
          enterStart: 4,
          enterStagger: 4,
          enterDuration: 9,
          exitStart: 79,
          exitEnd: 98,
          icons: [
            {
              id: "r1",
              mark: "⌂",
              label: "",
              x: 1540,
              y: 65,
              size: 120,
              backgroundColor: "#55b6e8",
              textColor: "#ffffff",
              rotation: 8,
              enterOffsetX: 160,
              enterOffsetY: -30,
              floatAmplitude: 5,
              phase: 0,
            },
            {
              id: "r2",
              mark: "⌁",
              label: "",
              x: 1500,
              y: 225,
              size: 132,
              backgroundColor: "#625ce1",
              textColor: "#ffffff",
              rotation: 9,
              enterOffsetX: 180,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 0.7,
            },
            {
              id: "r3",
              mark: "Σ",
              label: "",
              x: 1560,
              y: 405,
              size: 116,
              backgroundColor: "#f5f3ef",
              textColor: "#6350d5",
              rotation: 8,
              enterOffsetX: 180,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 1.4,
            },
            {
              id: "r4",
              mark: "≋",
              label: "",
              x: 1510,
              y: 565,
              size: 124,
              backgroundColor: "#e95161",
              textColor: "#ffffff",
              rotation: 6,
              enterOffsetX: 180,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 2.1,
            },
            {
              id: "r5",
              mark: "▣",
              label: "",
              x: 1560,
              y: 740,
              size: 116,
              backgroundColor: "#111d1b",
              textColor: "#38ec8e",
              rotation: 2,
              enterOffsetX: 180,
              enterOffsetY: 20,
              floatAmplitude: 5,
              phase: 2.8,
            },
            {
              id: "l1",
              mark: "G",
              label: "",
              x: 150,
              y: 80,
              size: 116,
              backgroundColor: "#f4f3ef",
              textColor: "#4740d9",
              rotation: -7,
              enterOffsetX: -170,
              enterOffsetY: -30,
              floatAmplitude: 5,
              phase: 3.5,
            },
            {
              id: "l2",
              mark: "W",
              label: "",
              x: 205,
              y: 245,
              size: 120,
              backgroundColor: "#f6f5ef",
              textColor: "#111111",
              rotation: -4,
              enterOffsetX: -180,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 4.2,
            },
            {
              id: "l3",
              mark: "◆",
              label: "",
              x: 140,
              y: 410,
              size: 118,
              backgroundColor: "#171717",
              textColor: "#d5d7d8",
              rotation: -8,
              enterOffsetX: -180,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 4.9,
            },
            {
              id: "l4",
              mark: "●",
              label: "",
              x: 215,
              y: 575,
              size: 114,
              backgroundColor: "#f5f4ef",
              textColor: "#5a5de4",
              rotation: -5,
              enterOffsetX: -180,
              enterOffsetY: 0,
              floatAmplitude: 5,
              phase: 5.6,
            },
            {
              id: "l5",
              mark: "✺",
              label: "",
              x: 150,
              y: 735,
              size: 120,
              backgroundColor: "#e98962",
              textColor: "#ffffff",
              rotation: -7,
              enterOffsetX: -180,
              enterOffsetY: 20,
              floatAmplitude: 5,
              phase: 6.3,
            },
          ],
        }}
      />
      <Composition
        id="TraeLogoCallout"
        component={LogoCallout}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={72}
        schema={logoCalloutSchema}
        defaultProps={{
          durationInFrames: 72,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          mark: "▣",
          label: "Trae",
          x: 150,
          y: 245,
          size: 210,
          enterStart: 12,
          enterEnd: 24,
          backgroundColor: "#111a18",
          accentColor: "#35ef87",
        }}
      />
      <Composition
        id="ClaudeCodexComparison"
        component={ToolComparisonFrame}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={45}
        schema={toolComparisonSchema}
        defaultProps={{
          durationInFrames: 45,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.01,
          topLabel: "Claude Code",
          bottomLabel: "Codex",
          transitionStart: 2,
          transitionEnd: 13,
          iconStagger: 5,
          panelBorderColor: "#777346",
          backgroundColor: "#050505",
        }}
      />
      <Composition
        id="PromptDocumentSplit"
        component={PromptDocumentSplit}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={103}
        schema={promptDocumentSchema}
        defaultProps={{
          durationInFrames: 103,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 100,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          title: "高质量提示词结构与执行要求",
          eyebrow: "PROMPT WORKFLOW",
          sections: [
            "明确角色、目标与使用场景",
            "补充必要背景信息与约束",
            "给出步骤、格式和质量标准",
            "提供参考示例与禁止事项",
            "检查输出并持续迭代优化",
            "沉淀为团队可复用模板",
          ],
          panelWidth: 860,
          enterStart: 12,
          enterEnd: 26,
          paperColor: "#f8f1df",
        }}
      />
      <Composition
        id="Aroll011DocumentSlide"
        component={ArollOverlayScene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={107}
        schema={arollOverlaySchema}
        defaultProps={{
          durationInFrames: 107,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 69,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          variant: "document" as const,
          title: "自定义命令与工作流",
          subtitle: "",
          eyebrow: "CUSTOM COMMAND",
          items: [
            "任务范围与目标",
            "执行步骤与输入",
            "判断标准与边界",
            "输出格式与复核",
            "持续优化与沉淀",
          ],
          enterStart: 54,
          accentColor: "#357cf3",
          paperColor: "#f7f5ef",
        }}
      />
      <Composition
        id="Aroll012MilestoneCounter"
        component={ArollOverlayScene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={64}
        schema={arollOverlaySchema}
        defaultProps={{
          durationInFrames: 64,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.01,
          variant: "milestone" as const,
          title: "全平台创作者里程碑",
          subtitle: "",
          eyebrow: "MILESTONE · 2026",
          items: ["30000", "50000"],
          enterStart: 4,
          accentColor: "#268bff",
          paperColor: "#f7f5ef",
        }}
      />
      <Composition
        id="Aroll013BossLevelCards"
        component={ArollOverlayScene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={96}
        schema={arollOverlaySchema}
        defaultProps={{
          durationInFrames: 96,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          variant: "levels" as const,
          title: "都是打怪升级的坎",
          subtitle: "",
          eyebrow: "3 BOSSES · LEVEL UP",
          items: ["选题", "涨粉", "接商单"],
          enterStart: 6,
          accentColor: "#259dff",
          paperColor: "#f7f5ef",
        }}
      />
      <Composition
        id="Aroll014IterationGrowth"
        component={ArollOverlayScene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={177}
        schema={arollOverlaySchema}
        defaultProps={{
          durationInFrames: 177,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.016,
          variant: "growth" as const,
          title: "一次比一次更好",
          subtitle: "",
          eyebrow: "OUTCOME · LEVEL UP",
          items: ["每月迭代", "调用技能库"],
          enterStart: 5,
          accentColor: "#32e263",
          paperColor: "#f7f5ef",
        }}
      />
      <Composition
        id="Aroll015KnowledgeCommodity"
        component={ArollOverlayScene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={152}
        schema={arollOverlaySchema}
        defaultProps={{
          durationInFrames: 152,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.014,
          variant: "knowledge" as const,
          title: "知识 已经平权",
          subtitle: "",
          eyebrow: "THE NEW REALITY",
          items: ["知识即服务", "ChatGPT", "Claude", "AI Search"],
          enterStart: 8,
          accentColor: "#d7a93c",
          paperColor: "#f7f5ef",
        }}
      />
      <Composition
        id="Aroll016PatientOutcome"
        component={ArollOverlayScene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={111}
        schema={arollOverlaySchema}
        defaultProps={{
          durationInFrames: 111,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          variant: "headline" as const,
          title: "没那么|急",
          subtitle: "于变现",
          eyebrow: "CREATOR POSITION",
          items: ["长期主义"],
          enterStart: 16,
          accentColor: "#169cff",
          paperColor: "#f7f5ef",
        }}
      />
      <Composition
        id="Aroll017AgentCardSwap"
        component={Aroll1317Scene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={113}
        schema={aroll1317Schema}
        defaultProps={{
          durationInFrames: 113,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          variant: "agent-cards" as const,
          title: "WorkBuddy",
          subtitle: "",
          eyebrow: "AGENT / 02",
          items: ["AGENT / 03", "OpenClaw"],
          revealFrames: [0, 42],
          accentColor: "#65e8a5",
          secondaryColor: "#d64953",
        }}
      />
      <Composition
        id="Aroll018NumberedList"
        component={Aroll1317Scene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={127}
        schema={aroll1317Schema}
        defaultProps={{
          durationInFrames: 127,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.012,
          variant: "numbered-list" as const,
          title: "三类使用方式",
          subtitle: "",
          eyebrow: "AI AGENT",
          items: ["长期在线", "办公交付", "技术执行"],
          revealFrames: [0, 58, 98],
          accentColor: "#65ed8d",
          secondaryColor: "#f3b34f",
        }}
      />
      <Composition
        id="Aroll019WorkflowSwap"
        component={Aroll1317Scene}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={188}
        schema={aroll1317Schema}
        defaultProps={{
          durationInFrames: 188,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.006,
          floatingAmount: 2,
          cameraPushAmount: 0.014,
          variant: "workflow-swap" as const,
          title: "AI 工作流",
          subtitle: "",
          eyebrow: "WORKFLOW",
          items: ["豆包", "DeepSeek", "PPT", "报告", "Excel", "整理资料"],
          revealFrames: [0, 78],
          accentColor: "#348bff",
          secondaryColor: "#f08872",
        }}
      />
      <Composition
        id="Aroll020AITitleBuild"
        component={Aroll1317Scene}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={34}
        schema={aroll1317Schema}
        defaultProps={{
          durationInFrames: 34,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.004,
          floatingAmount: 1,
          cameraPushAmount: 0.008,
          variant: "title-build" as const,
          title: "AI变现",
          subtitle: "",
          eyebrow: "AI BUSINESS",
          items: ["AI", "变现"],
          revealFrames: [0, 5, 10, 15],
          accentColor: "#ffffff",
          secondaryColor: "#8c82ff",
        }}
      />
      <Composition
        id="Aroll021AIClaims"
        component={Aroll1317Scene}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={205}
        schema={aroll1317Schema}
        defaultProps={{
          durationInFrames: 205,
          portraitSrc: "assets/portrait-landscape.png",
          portraitScale: 1.04,
          portraitPositionX: 50,
          portraitPositionY: 47,
          breathingAmount: 0.004,
          floatingAmount: 1,
          cameraPushAmount: 0.012,
          variant: "claim-sequence" as const,
          title: "至少有80%|都会提到AI",
          subtitle: "2026年注定|成为AI爆发关键期",
          eyebrow: "AI TREND",
          items: ["80%", "2026"],
          revealFrames: [48, 108],
          accentColor: "#9789ff",
          secondaryColor: "#9a8bff",
        }}
      />
      {POINT_CARD_SHOTS.map((shot) => (
        <Composition
          key={shot.id}
          id={shot.compositionId}
          component={PointCardScene}
          width={shot.width}
          height={shot.height}
          fps={shot.fps}
          durationInFrames={shot.durationInFrames}
          schema={pointCardSceneSchema}
          defaultProps={{
            durationInFrames: shot.durationInFrames,
            portraitSrc: "assets/portrait-landscape.png",
            variant: shot.variant,
            headline: shot.headline,
            subline: shot.subline,
            items: shot.items,
            accentColor: shot.accentColor,
            secondaryColor: shot.secondaryColor,
            darkMode: shot.darkMode,
          }}
        />
      ))}
      {AI_TERMINAL_SHOTS.map((shot) => (
        <Composition
          key={shot.id}
          id={shot.compositionId}
          component={AITerminalScene}
          width={shot.width}
          height={shot.height}
          fps={shot.fps}
          durationInFrames={shot.durationInFrames}
          schema={aiTerminalSceneSchema}
          defaultProps={shot.defaultProps}
        />
      ))}
      {SCREENSHOT_RECORDING_SHOTS.map((shot) => (
        <Composition
          key={shot.id}
          id={shot.compositionId}
          component={ScreenshotRecordingScene}
          width={shot.width}
          height={shot.height}
          fps={shot.fps}
          durationInFrames={shot.durationInFrames}
          schema={screenshotRecordingSceneSchema}
          defaultProps={shot.defaultProps}
        />
      ))}
      {TRANSITION_BACKGROUND_SHOTS.map((shot) => (
        <Composition
          key={shot.id}
          id={shot.compositionId}
          component={TransitionBackgroundScene}
          width={shot.width}
          height={shot.height}
          fps={shot.fps}
          durationInFrames={shot.durationInFrames}
          schema={transitionBackgroundSceneSchema}
          defaultProps={shot.defaultProps}
        />
      ))}
    </>
  );
};
