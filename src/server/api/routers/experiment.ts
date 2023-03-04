import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createExperimentSchema } from "~/schemas";

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
        // TODO: make the request to open ai for the recipe

        // TODO: save the experiment in our db
        await ctx.prisma.experiment.create({
          data: {
            ...input,
          },
        });
        // TODO: return the result to the frontend

        // return ctx.prisma.experiment.create({
        //   data: { ...input },
        // });
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
