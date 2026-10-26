import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const pointCardSceneSchema = z.object({
  durationInFrames: z.number().int().min(1).max(900),
  portraitSrc: z.string(),
  variant: z.enum([
    "title",
    "list",
    "compare",
    "flankcards",
    "logos",
    "chipcluster",
    "pushstack",
    "questionpush",
    "sealcard",
    "radar-lower-third",
    "sports-lower-third",
    "news-lower-third",
    "design-history",
    "wheel-interface",
    "badge-morph",
    "token-text",
    "selective-recombine",
  ]),
  headline: z.string(),
  subline: z.string(),
  items: z.array(z.string()).min(1).max(12),
  accentColor: zColor(),
  secondaryColor: zColor(),
  darkMode: z.boolean(),
});

export type PointCardSceneProps = z.infer<typeof pointCardSceneSchema>;
