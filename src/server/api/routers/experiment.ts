import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createExperimentSchema, getByIdSchema } from "~/schemas";
import { getRecipe } from "~/utils/ai";
import { Category } from "@prisma/client";

export const experimentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.experiment.findMany({
      include: {
        createdBy: true,
      },
    });
  }),
  create: protectedProcedure
    .input(createExperimentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const category = input.category || Category.BREAKFAST;
        const recipe = await getRecipe(
          category,
          input.ingredients.split(","),
          input.requirements,
          3
        );

        if (!recipe) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not generate a recipe",
          });
        }

        const tag = Math.floor(Math.random() * 1000);

        // TODO: check for duplicates

        console.log("RECIPE", recipe);
        const data = await ctx.prisma.experiment.create({
          data: {
            steps: recipe.steps,
            feeds: 3,
            inspiration: recipe.inspiration,
            createdById: ctx.session?.user.id,
            title: recipe.title,
            tag,
            category,
            imgs: [],
          },
        });
        return data;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not generate a recipe",
        });
      }
    }),
  getOne: publicProcedure.input(getByIdSchema).query(async ({ input, ctx }) => {
    return await ctx.prisma.experiment.findUnique({
      where: {
        id: input.id,
      },
      include: {
        createdBy: true,
      },
    });
  }),
});
