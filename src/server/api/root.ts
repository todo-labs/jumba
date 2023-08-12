import { createTRPCRouter } from "@/server/api/trpc";
import { experimentRouter } from "./routers/experiment";
import { adminRouter } from "./routers/admin";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  experiments: experimentRouter,
  admin: adminRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
