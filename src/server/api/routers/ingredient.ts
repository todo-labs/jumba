import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getIngredientsSchema, addIngredientSchema } from "~/schemas";

export const ingredientRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(getIngredientsSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { query } = input;
        const ingredients = await ctx.prisma.ingredient.findMany({
          where: {
            name: { contains: query!, mode: "insensitive" },
            // approved: true,
          },
          select: { name: true, id: true, },
        });
        if (!ingredients) {
          return new TRPCError({
            code: "NOT_FOUND",
            message: "No ingredients found",
          });
        }
        return ingredients;
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getRandom: publicProcedure.query(async ({ ctx }) => {
    try {
      const ingredients = await ctx.prisma.ingredient.findMany({
        select: {
          name: true,
          id: true,
        },
      });
      if (!ingredients) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "No ingredients found",
        });
      }
      const randomIngredient =
        ingredients[Math.floor(Math.random() * ingredients.length)];
      return randomIngredient;
    } catch (error) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  add: publicProcedure
    .input(addIngredientSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { name } = input;
        const ingredient = await ctx.prisma.ingredient.create({
          data: {
            name,
            userId: ctx.session?.user.id,
          },
        });
        return ingredient;
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
