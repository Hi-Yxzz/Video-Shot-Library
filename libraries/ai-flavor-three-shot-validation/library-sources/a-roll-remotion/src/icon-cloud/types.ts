import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const floatingIconSchema = z.object({
  id: z.string(),
  mark: z.string(),
  label: z.string(),
  x: z.number().min(-300).max(1920),
  y: z.number().min(-300).max(1080),
  size: z.number().min(48).max(260),
  backgroundColor: zColor(),
  textColor: zColor(),
  rotation: z.number().min(-45).max(45),
  enterOffsetX: z.number().min(-400).max(400),
  enterOffsetY: z.number().min(-400).max(400),
  floatAmplitude: z.number().min(0).max(20),
  phase: z.number(),
});

export const aiIconCloudSchema = z
  .object({
    durationInFrames: z.number().int().min(1).max(900),
    portraitSrc: z.string(),
    portraitScale: z.number().min(0.8).max(1.5),
    portraitPositionX: z.number().min(0).max(100),
    portraitPositionY: z.number().min(0).max(100),
    breathingAmount: z.number().min(0).max(0.05),
    floatingAmount: z.number().min(0).max(24),
    cameraPushAmount: z.number().min(0).max(0.1),
    enterStart: z.number().int().min(0),
    enterStagger: z.number().int().min(0).max(30),
    enterDuration: z.number().int().min(1).max(60),
    exitStart: z.number().int().min(0),
    exitEnd: z.number().int().min(1),
    icons: z.array(floatingIconSchema).min(1).max(20),
  })
  .superRefine((props, context) => {
    if (
      props.exitStart >= props.exitEnd ||
      props.exitEnd > props.durationInFrames
    ) {
      context.addIssue({
        code: "custom",
        message: "exit frames must be ordered and inside the composition",
        path: ["exitEnd"],
      });
    }
  });

export type FloatingIconConfig = z.infer<typeof floatingIconSchema>;
export type AIIconCloudProps = z.infer<typeof aiIconCloudSchema>;
