import { createRouter } from "./context";
import { z } from "zod";

import { prisma } from "../db/client";

export const questionRouter = createRouter()
  .query("getAll", {
    async resolve() {
      return await prisma.pollQuestion.findMany();
    },
  })
  .query("getById", {
    input: z.object({ id: z.string() }),
    async resolve({ input, ctx }) {
      const pollQuestion = await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });

      return { pollQuestion, isOwner: pollQuestion?.ownerToken === ctx.token}
    },
  })
  .mutation("create", {
    input: z.object({
      question: z.string().min(5).max(600),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) return { error: "Unauthorized" }
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: [],
          ownerToken: ctx.token
        },
      });
    },
  });
