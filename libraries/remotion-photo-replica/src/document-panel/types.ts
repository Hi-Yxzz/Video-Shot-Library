import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const productSOPPanelSchema = z
  .object({
    durationInFrames: z.number().int().min(1).max(900),
    portraitSrc: z.string(),
    portraitScale: z.number().min(0.8).max(1.5),
    portraitPositionX: z.number().min(0).max(100),
    portraitPositionY: z.number().min(0).max(100),
    breathingAmount: z.number().min(0).max(0.05),
    floatingAmount: z.number().min(0).max(24),
    cameraPushAmount: z.number().min(0).max(0.1),
    panelX: z.number().min(-100).max(1000),
    panelY: z.number().min(-100).max(600),
    collapsedWidth: z.number().min(120).max(500),
    expandedWidth: z.number().min(240).max(900),
    collapsedHeight: z.number().min(160).max(600),
    expandedHeight: z.number().min(300).max(720),
    expandStart: z.number().int().min(0),
    expandEnd: z.number().int().min(1),
    title: z.string(),
    eyebrow: z.string(),
    accentColor: zColor(),
    sections: z.array(z.string()).min(1).max(12),
  })
  .superRefine((props, context) => {
    if (
      props.expandStart >= props.expandEnd ||
      props.expandEnd > props.durationInFrames
    ) {
      context.addIssue({
        code: "custom",
        message: "expand frames must be ordered and inside the composition",
        path: ["expandEnd"],
      });
    }
  });

export type ProductSOPPanelProps = z.infer<typeof productSOPPanelSchema>;
