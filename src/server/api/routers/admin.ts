import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import * as z from "zod";

export const adminRouter = createTRPCRouter({
  totalExperiments: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.experiment.findMany({
      include: {
        createdBy: true,
      },
    });
  }),
  totalUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.count();
  }),
  recentlyCreatedExperiments: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.experiment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        createdBy: true,
        category: true,
      },
    });
  }),
  totalReviews: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.reviews.count();
  }),
  removeUser: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.delete({
        where: { id: input },
      });
    }),
  allUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      include: {
        Experiment: true,
        Reviews: true,
      },
    });
  }),
  removeReview: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.reviews.delete({
        where: { id: input },
      });
    }),
});
