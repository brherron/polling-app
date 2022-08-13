import { createRouter } from "./context";
import { z } from "zod";

import { prisma } from "../db/client";

export const questionRouter = createRouter()
  .query("getAll", {
    async resolve() {
      return await prisma.pollQuestion.findMany();
    }
  });
