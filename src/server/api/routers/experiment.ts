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
    .mutation(async ({ input, ctx }) => {
      try {
        // TODO: make the request to open ai for the recipe
        const openAi = new OpenAi();
        const recipe = await openAi.getRecipe(input.prompt);
        const ingredientsRegex = /-\s*(.*)/g;
        const instructionsRegex = /(\d+)\.(.*)/g;

        const ingredients = [];
        const instructions = [];

        let ingredientsMatch = ingredientsRegex.exec(recipe);
        while (ingredientsMatch) {
          ingredients.push(ingredientsMatch[1].trim());
          ingredientsMatch = ingredientsRegex.exec(recipe);
        }

        let instructionsMatch = instructionsRegex.exec(recipe);
        while (instructionsMatch) {
          instructions.push(instructionsMatch[2].trim());
          instructionsMatch = instructionsRegex.exec(recipe);
        }

        // find ingredients that are already in the db
        const ingredientsInDb = await ctx.prisma.ingredient.findMany({
          where: {
            OR: ingredients.map((ingredient) => ({
              name: {
                contains: ingredient.toLowerCase(),
              },
            })),
          },
        });

        // create a list of ingredients that are not in the db
        const ingredientsNotInDb = ingredients.filter((ingredient) => {
          return !ingredientsInDb.some(
            (i) => i.name.toLowerCase() === ingredient.toLowerCase()
          );
        });

        // add the new ingredients to the db
        // const newIngredients = await Promise.all(
        //   ingredientsNotInDb.map(async (ingredient) => {
        //     return ctx.prisma.ingredient.create({
        //       data: {
        //         name: ingredient,
        //       },
        //     });
        //   })
        // );

        // NOTE: add the ingredients that are not in the db
        console.log("ingredients: ", ingredients);
        console.log("ingredientsInDb: ", ingredientsInDb);
        console.log("ingredientsNotInDb: ", ingredientsNotInDb);
        // NOTE: add the experiment to the db
        // // TODO: return the result to the frontend
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
