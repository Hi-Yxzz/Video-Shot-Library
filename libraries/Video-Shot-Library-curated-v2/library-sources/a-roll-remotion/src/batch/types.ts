import {zColor} from "@remotion/zod-types";
import {z} from "zod";

const portraitFields = {
  durationInFrames: z.number().int().min(1).max(900),
  portraitSrc: z.string(),
  portraitScale: z.number().min(0.8).max(1.5),
  portraitPositionX: z.number().min(0).max(100),
  portraitPositionY: z.number().min(0).max(100),
  breathingAmount: z.number().min(0).max(0.05),
  floatingAmount: z.number().min(0).max(24),
  cameraPushAmount: z.number().min(0).max(0.1),
};

export const logoCalloutSchema = z.object({
  ...portraitFields,
  mark: z.string(),
  label: z.string(),
  x: z.number().min(-200).max(1800),
  y: z.number().min(-200).max(900),
  size: z.number().min(80).max(360),
  enterStart: z.number().int().min(0),
  enterEnd: z.number().int().min(1),
  backgroundColor: zColor(),
  accentColor: zColor(),
});

export const toolComparisonSchema = z.object({
  ...portraitFields,
  topLabel: z.string(),
  bottomLabel: z.string(),
  transitionStart: z.number().int().min(0),
  transitionEnd: z.number().int().min(1),
  iconStagger: z.number().int().min(0).max(30),
  panelBorderColor: zColor(),
  backgroundColor: zColor(),
});

export const promptDocumentSchema = z.object({
  ...portraitFields,
  title: z.string(),
  eyebrow: z.string(),
  sections: z.array(z.string()).min(1).max(12),
  panelWidth: z.number().min(400).max(1200),
  enterStart: z.number().int().min(0),
  enterEnd: z.number().int().min(1),
  paperColor: zColor(),
});

export type LogoCalloutProps = z.infer<typeof logoCalloutSchema>;
export type ToolComparisonProps = z.infer<typeof toolComparisonSchema>;
export type PromptDocumentProps = z.infer<typeof promptDocumentSchema>;
