import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const brandCardSchema = z.object({
  brandName: z.string(),
  markText: z.string(),
  label: z.string(),
  x: z.number().min(-400).max(1280),
  y: z.number().min(-400).max(720),
  width: z.number().min(160).max(500),
  height: z.number().min(200).max(500),
  enterFromX: z.number().min(-600).max(600),
  enterFromY: z.number().min(-600).max(600),
  panelColor: zColor(),
  labelColor: zColor(),
  borderColor: zColor(),
  textColor: zColor(),
  floatAmplitude: z.number().min(0).max(24),
});

export const aiBrandCardSchema = z
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
    leftEnterEnd: z.number().int().min(0),
    rightEnterStart: z.number().int().min(0),
    rightEnterEnd: z.number().int().min(0),
    leftCard: brandCardSchema,
    rightCard: brandCardSchema,
  })
  .superRefine((props, context) => {
    if (props.leftEnterEnd <= props.leftEnterStart) {
      context.addIssue({
        code: "custom",
        message: "leftEnterEnd must be greater than leftEnterStart",
        path: ["leftEnterEnd"],
      });
    }

    if (props.rightEnterEnd <= props.rightEnterStart) {
      context.addIssue({
        code: "custom",
        message: "rightEnterEnd must be greater than rightEnterStart",
        path: ["rightEnterEnd"],
      });
    }

    if (
      props.leftEnterEnd > props.durationInFrames ||
      props.rightEnterEnd > props.durationInFrames
    ) {
      context.addIssue({
        code: "custom",
        message: "entrance windows must end within durationInFrames",
        path: ["durationInFrames"],
      });
    }
  });

export type BrandCardConfig = z.infer<typeof brandCardSchema>;
export type AIBrandCardProps = z.infer<typeof aiBrandCardSchema>;
