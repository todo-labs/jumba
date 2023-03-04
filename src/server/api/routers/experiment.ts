import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createExperimentSchema } from "~/schemas/experiment";
import { TRPCError } from "@trpc/server";

export const experimentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return ctx.prisma.experiment.findMany();
    } catch (error) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  create: publicProcedure
    .input(createExperimentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return ctx.prisma.experiment.create({
          data: { ...input },
        });
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
