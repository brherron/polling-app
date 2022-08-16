import { z } from "zod";

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(600),
  options: z
    .array(
      z.object({
        id: z.number().optional(),
        text: z.string().min(1).max(200),
        questionId: z.string().optional(),
      })
    )
    .min(2)
    .max(8),
  endingTime: z.date().optional(),
});

export type CreateQuestionInputType = z.infer<typeof createQuestionValidator>;
