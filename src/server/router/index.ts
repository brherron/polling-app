// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { questionRouter } from "./questions";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("questions.", questionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
