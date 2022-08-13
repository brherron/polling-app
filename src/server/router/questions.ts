import { createRouter } from "./context";
import { z } from "zod";

import { prisma } from "../db/client";

export const questionRouter = createRouter()
  .query("getAll", {
    async resolve() {
      return await prisma.pollQuestion.findMany();
    },
  }).mutation("create", {
    input: z.object({
      question: z.string().min(5).max(600),
    }),
    async resolve({input}) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
        },
      });
    },
  });
