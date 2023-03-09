import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createExperimentSchema } from "~/schemas";
import OpenAi from "~/utils/openAi";

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
    .mutation(async ({ input }) => {
      try {
        // TODO: make the request to open ai for the recipe
        const openAi = new OpenAi();
        const prompt = await openAi.enhancePrompt(input.prompt);
        const recipe = await openAi.getRecipe(prompt);

        // // TODO: save the experiment in our db
        // await ctx.prisma.experiment.create({
        //   data: {
        //     ...input,
        //     img: "https://source.unsplash.com/random/200x200",
        //     title: "Recipe Title",
            
        //   },
        // });
        // // TODO: return the result to the frontend
        return recipe;
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
