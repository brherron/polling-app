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
      const pollQuestion = await prisma.pollQuestion.findUnique({
        where: {
          id: input.id,
        },
      });

      const options = await prisma.option.findMany({
        where: {
          questionId: input.id,
        },
      });

      const myVote = await prisma.vote.findFirst({
        where: {
          questionId: input.id,
          voterToken: ctx.token,
        },
      });

      const rest = {
        pollQuestion,
        options,
        vote: myVote,
        isOwner: pollQuestion?.ownerToken === ctx.token,
      };

      if (rest.vote || rest.isOwner) {
        const votes = await prisma.vote.groupBy({
          where: { questionId: input.id },
          by: ["choiceId"],
          _count: true,
        });

        return {
          ...rest,
          votes,
        };
      }

      return {
        ...rest,
        votes: undefined,
      };
    },
  })
  .mutation("voteOnQuestion", {
    input: z.object({
      questionId: z.string(),
      optionId: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error("Unauthorized");

      return await prisma.vote.create({
        data: {
          questionId: input.questionId,
          choiceId: input.optionId,
          voterToken: ctx.token,
        },
      });
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ input, ctx }) {
      if (!ctx.token) throw new Error("Unauthorized");

      const question = await prisma.pollQuestion.create({
        data: {
          question: input.question,
          endsAt: input.endingTime,
          ownerToken: ctx.token,
        },
      });

      const optionData = input.options.map((option) => {
        return {
          text: option.text,
          questionId: question.id,
        };
      });

      await prisma.option.createMany({
        data: [...optionData],
      });

      return question.id;
    },
  });
