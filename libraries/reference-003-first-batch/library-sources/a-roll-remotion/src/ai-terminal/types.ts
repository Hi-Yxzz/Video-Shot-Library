import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const aiTerminalSceneSchema = z.object({
  durationInFrames: z.number().int().min(1).max(900),
  id: z.enum([
    "code",
    "terminal",
    "contextterminal",
    "aiinput",
    "claudecodeinput",
    "inputpan",
    "rc017",
    "rc021",
  ]),
  variant: z.enum([
    "code-split",
    "terminal",
    "context-terminal",
    "ai-input",
    "claude-input",
    "input-pan",
    "command-menu",
    "command-converge",
  ]),
  portraitSrc: z.string(),
  headline: z.string(),
  subline: z.string(),
  lines: z.array(z.string()).min(1).max(12),
  accentColor: zColor(),
  darkMode: z.boolean(),
});

export type AITerminalSceneProps = z.infer<typeof aiTerminalSceneSchema>;

