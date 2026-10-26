import {zColor} from "@remotion/zod-types";
import {z} from "zod";

const headlineBlockSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string(),
  x: z.number().min(-300).max(1280),
  y: z.number().min(-200).max(720),
  width: z.number().min(180).max(800),
  fontSize: z.number().min(28).max(120),
  textColor: zColor(),
  accentColor: zColor(),
  align: z.enum(["left", "right"]),
});

export const aiUsageHeadlineSchema = z
  .object({
    durationInFrames: z.number().int().min(1).max(900),
    portraitSrc: z.string(),
    portraitScale: z.number().min(0.8).max(1.5),
    portraitPositionX: z.number().min(0).max(100),
    portraitPositionY: z.number().min(0).max(100),
    breathingAmount: z.number().min(0).max(0.05),
    floatingAmount: z.number().min(0).max(24),
    cameraPushAmount: z.number().min(0).max(0.1),
    leftEnterStart: z.number().int().min(0),
    leftEnterEnd: z.number().int().min(1),
    rightEnterStart: z.number().int().min(0),
    rightEnterEnd: z.number().int().min(1),
    leftHeadline: headlineBlockSchema,
    rightHeadline: headlineBlockSchema,
  })
  .superRefine((props, context) => {
    if (
      props.leftEnterStart >= props.leftEnterEnd ||
      props.rightEnterStart >= props.rightEnterEnd ||
      props.rightEnterEnd > props.durationInFrames
    ) {
      context.addIssue({
        code: "custom",
        message: "headline entrance frames must be ordered",
        path: ["rightEnterEnd"],
      });
    }
  });

export type HeadlineBlockConfig = z.infer<typeof headlineBlockSchema>;
export type AIUsageHeadlineProps = z.infer<typeof aiUsageHeadlineSchema>;
