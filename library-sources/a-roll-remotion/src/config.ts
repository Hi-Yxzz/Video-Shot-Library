import {z} from "zod";

const elementItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["text", "image", "mixed"]),
  label: z.string(),
  imageSrc: z.string().optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

const trackSchema = z.object({
  items: z.array(elementItemSchema),
  speed: z.number().min(0).max(10),
  direction: z.enum(["left", "right"]),
  gap: z.number().min(0).max(200),
  cardWidth: z.number().min(40).max(500),
  cardHeight: z.number().min(30).max(300),
  opacity: z.number().min(0).max(1),
  blur: z.number().min(0).max(20),
  borderRadius: z.number().min(0).max(100),
  shadow: z.number().min(0).max(1),
});

export const photoReplicaSchema = z.object({
  portraitSrc: z.string().min(1),
  durationInFrames: z.number().int().min(30).max(1800),
  backgroundScale: z.number().min(1).max(1.3),
  backgroundPositionX: z.number().min(0).max(100),
  backgroundPositionY: z.number().min(0).max(100),
  portraitScale: z.number().min(1).max(1.2),
  portraitOffsetX: z.number().min(-200).max(200),
  portraitOffsetY: z.number().min(-200).max(200),
  breathingAmount: z.number().min(0).max(0.05),
  floatingAmount: z.number().min(0).max(30),
  cameraPushAmount: z.number().min(0).max(0.1),
  backgroundBrightness: z.number().min(0.5).max(1.5),
  backgroundContrast: z.number().min(0.5).max(1.5),
  vignetteAmount: z.number().min(0).max(1),
  topTrack: trackSchema,
  bottomTrack: trackSchema,
});

export type PhotoReplicaProps = z.infer<typeof photoReplicaSchema>;
export type ElementItem = PhotoReplicaProps["topTrack"]["items"][number];
export type TrackConfig = PhotoReplicaProps["topTrack"];
