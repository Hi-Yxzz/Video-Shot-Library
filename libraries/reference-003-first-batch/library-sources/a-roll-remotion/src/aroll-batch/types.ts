import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const arollOverlaySchema = z.object({
  durationInFrames: z.number().int().min(1).max(900),
  portraitSrc: z.string(),
  portraitScale: z.number().min(0.8).max(1.5),
  portraitPositionX: z.number().min(0).max(100),
  portraitPositionY: z.number().min(0).max(100),
  breathingAmount: z.number().min(0).max(0.05),
  floatingAmount: z.number().min(0).max(24),
  cameraPushAmount: z.number().min(0).max(0.1),
  variant: z.enum([
    "document",
    "milestone",
    "levels",
    "growth",
    "knowledge",
    "headline",
  ]),
  title: z.string(),
  subtitle: z.string(),
  eyebrow: z.string(),
  items: z.array(z.string()).min(1).max(12),
  enterStart: z.number().int().min(0),
  accentColor: zColor(),
  paperColor: zColor(),
});

export type ArollOverlayProps = z.infer<typeof arollOverlaySchema>;
