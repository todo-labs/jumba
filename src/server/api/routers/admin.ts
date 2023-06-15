import { TRPCError } from "@trpc/server";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { profileSchema } from "~/schemas";

export const adminRouter = createTRPCRouter({
  totalExperiments: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.experiment.count();
  }),
  totalUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.count();
  }),
});
