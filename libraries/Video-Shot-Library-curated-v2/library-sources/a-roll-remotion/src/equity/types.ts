import {z} from "zod";

const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const openAIEquitySchema = z
  .object({
    durationInFrames: z.number().int().min(60).max(1800),
    portraitSrc: z.string().min(1),
    title: z.string(),
    eyebrow: z.string(),
    dateLabel: z.string(),
    ownershipPercent: z.number().min(0).max(100),
    marketValue: z.number().min(0).max(999999),
    microsoftValue: z.number().min(0).max(999999),
    currencyUnit: z.string(),
    totalCells: z.number().int().min(1).max(200),
    gridColumns: z.number().int().min(1).max(20),
    microsoftCells: z.number().int().min(0).max(200),
    splitX: z.number().int().min(480).max(1000),
    introEndFrame: z.number().int().min(0).max(1700),
    splitEndFrame: z.number().int().min(1).max(1720),
    valuationStartFrame: z.number().int().min(2).max(1740),
    microsoftStartFrame: z.number().int().min(3).max(1760),
    microsoftHoldFrame: z.number().int().min(4).max(1780),
    marketColor: colorSchema,
    microsoftColor: colorSchema,
    neutralColor: colorSchema,
    mutedColor: colorSchema,
    portraitScale: z.number().min(1).max(1.5),
    portraitPositionX: z.number().min(0).max(100),
    portraitPositionY: z.number().min(0).max(100),
    breathingAmount: z.number().min(0).max(0.05),
    floatingAmount: z.number().min(0).max(30),
    cameraPushAmount: z.number().min(0).max(0.1),
  })
  .superRefine((value, context) => {
    if (value.microsoftCells > value.totalCells) {
      context.addIssue({
        code: "custom",
        path: ["microsoftCells"],
        message: "microsoftCells must not exceed totalCells",
      });
    }

    const ordered = [
      value.introEndFrame,
      value.splitEndFrame,
      value.valuationStartFrame,
      value.microsoftStartFrame,
      value.microsoftHoldFrame,
      value.durationInFrames,
    ];

    if (
      ordered.some(
        (current, index) => index > 0 && current <= ordered[index - 1],
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["durationInFrames"],
        message: "timeline frames must be strictly increasing",
      });
    }
  });

export type OpenAIEquityProps = z.infer<typeof openAIEquitySchema>;
