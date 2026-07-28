import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const aroll1317Schema = z.object({
  durationInFrames: z.number().int().min(1).max(900),
  portraitSrc: z.string(),
  portraitScale: z.number().min(0.8).max(1.5),
  portraitPositionX: z.number().min(0).max(100),
  portraitPositionY: z.number().min(0).max(100),
  breathingAmount: z.number().min(0).max(0.05),
  floatingAmount: z.number().min(0).max(24),
  cameraPushAmount: z.number().min(0).max(0.1),
  variant: z.enum([
    "agent-cards",
    "numbered-list",
    "workflow-swap",
    "title-build",
    "claim-sequence",
  ]),
  title: z.string(),
  subtitle: z.string(),
  eyebrow: z.string(),
  items: z.array(z.string()).min(1).max(12),
  revealFrames: z.array(z.number().int().min(0)).min(1).max(12),
  accentColor: zColor(),
  secondaryColor: zColor(),
});

export type Aroll1317Props = z.infer<typeof aroll1317Schema>;
