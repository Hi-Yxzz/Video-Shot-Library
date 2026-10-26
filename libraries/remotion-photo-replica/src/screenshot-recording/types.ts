import {z} from "zod";

export const screenshotRecordingIds = [
  "showcase",
  "screenshot",
  "shotfull",
  "scrollshot",
  "brollstack",
  "ring",
  "rc012",
  "rc018",
  "rc019",
  "rc025",
] as const;

export const screenshotRecordingVariants = [
  "showcase",
  "screenshot",
  "shotfull",
  "scrollshot",
  "brollstack",
  "ring",
  "sticky-story",
  "browser-stack",
  "sidebar-sync",
  "media-rail",
] as const;

export const screenshotRecordingSceneSchema = z.object({
  durationInFrames: z.number().int().positive(),
  id: z.enum(screenshotRecordingIds),
  variant: z.enum(screenshotRecordingVariants),
  portraitSrc: z.string(),
  mediaSrc: z.string(),
  secondaryMediaSrc: z.string(),
  title: z.string(),
  subtitle: z.string(),
  lines: z.array(z.string()),
  accentColor: z.string(),
  darkMode: z.boolean(),
});

export type ScreenshotRecordingSceneProps = z.infer<
  typeof screenshotRecordingSceneSchema
>;
