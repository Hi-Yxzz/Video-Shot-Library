import {z} from "zod";

export const transitionBackgroundIds = [
  "transition",
  "abilitypan",
  "abilitychapter",
  "dotmatrix",
  "tornwipe",
  "chaptercard",
  "rk028",
  "rk029",
  "rk036",
  "rk063",
  "rk069",
  "rk080",
  "rk090",
  "rk093",
  "rk131",
  "rc023",
  "rc026",
  "paperlift",
  "documentcascade",
  "pageleafcascade",
] as const;

export const transitionBackgroundSceneSchema = z.object({
  durationInFrames: z.number().int().positive(),
  id: z.enum(transitionBackgroundIds),
  variant: z.enum(transitionBackgroundIds),
  portraitSrc: z.string(),
  title: z.string(),
  subtitle: z.string(),
  words: z.array(z.string()),
  backgroundColor: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  paperColor: z.string(),
  darkMode: z.boolean(),
  speed: z.number().positive(),
  intensity: z.number().positive(),
});

export type TransitionBackgroundId = (typeof transitionBackgroundIds)[number];
export type TransitionBackgroundSceneProps = z.infer<
  typeof transitionBackgroundSceneSchema
>;
