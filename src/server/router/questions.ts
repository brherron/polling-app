import { createRouter } from "./context";
import { z } from "zod";

import { prisma } from "../db/client";
import { createQuestionValidator } from "../../shared/create-question-validator";

export const questionRouter = createRouter()
  .query("getAllMyQuestions", {
    async resolve({ ctx }) {
      if (!ctx.token) return [];

      return await prisma.pollQuestion.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
      });
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

      const myVote = await prisma.vote.findFirst({
        where: {
          questionId: input.id,
          voterToken: ctx.token,
        },
      });

      return {
        pollQuestion,
        isOwner: pollQuestion?.ownerToken === ctx.token,
        vote: myVote,
      };
    },
  })
  .mutation("voteOnQuestion", {
    input: z.object({
      questionId: z.string(),
      option: z.number().min(0).max(10),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error("Unauthorized");

      return await prisma.vote.create({
        data: {
          questionId: input.questionId,
          choice: input.option,
          voterToken: ctx.token,
        },
      });
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error("Unauthorized");

      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.token,
        },
      });
    },
  });
