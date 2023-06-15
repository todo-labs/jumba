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
  recentlyCreatedExperiments: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.experiment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true, createdBy: true, category: true },
    });
  }),
});
