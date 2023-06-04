import { createTRPCRouter } from "~/server/api/trpc";
import { experimentRouter } from "~/server/api/routers/experiment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  experiments: experimentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
