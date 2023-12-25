import { TRPCError } from "@trpc/server";
import sentiment from "sentiment";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  correctGrammarSchema,
  createExperimentSchema,
  getAllSchema,
  getByIdSchema,
  leaveReviewSchema,
} from "@/schemas";
import {
  getIngredients,
  getRecipe,
  reviewComment,
  correctGrammar,
} from "@/utils/ai";

export const experimentRouter = createTRPCRouter({
  getAll: publicProcedure.input(getAllSchema).query(async ({ ctx, input }) => {
    return await ctx.prisma.experiment.findMany({
      where: {
        createdById: ctx.session?.user.id,
        category: input.category,
      },
      include: {
        createdBy: true,
        imgs: {
          where: {
            approved: true,
          },
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        tag: "asc",
      },
    });
  }),
  create: protectedProcedure
    .input(createExperimentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const recipe = await getRecipe(input);

        if (!recipe) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Something went wrong while generating a recipe. Try again",
          });
        }

        const ingredients = await getIngredients(recipe.ingredients);

        if (!ingredients) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Something went wrong while generating your recipe. Try again",
          });
        }

        const tag = Math.floor(Math.random() * 1000);

        const data = await ctx.prisma.experiment.create({
          data: {
            tag,
            steps: recipe.steps,
            createdById: ctx.session?.user.id,
            feeds: input.feeds,
            inspiration: recipe.inspiration,
            title: recipe.title,
            rawIngredients: recipe.ingredients,
            category: input.category,
            duration: recipe.duration,
            ingredients: {
              createMany: {
                data: ingredients,
              },
            },
          },
        });
        return data;
      } catch (err) {
        console.error(err);
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
        reviews: {
          include: {
            reviewedBy: true,
          },
        },
        ingredients: true,
        imgs: true,
      },
    });
  }),
  leaveReview: protectedProcedure
    .input(leaveReviewSchema)
    .mutation(async ({ input, ctx }) => {
      const score = new sentiment().analyze(input.comment).score;

      if (score < 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Your review is too negative. Please provide something more constructive.",
        });
      }

      const experiment = await ctx.prisma.experiment.findUnique({
        where: {
          id: input.experimentId,
        },
      });

      const content = [
        experiment?.title,
        experiment?.inspiration,
        experiment?.rawIngredients.join(", "),
        experiment?.steps.join(", "),
      ].join("\n");

      const review = await reviewComment(
        input.experimentId,
        input.comment,
        content
      );

      if (review?.approved) {
        await ctx.prisma.reviews.create({
          data: {
            comment: input.comment,
            rating: input.rating,
            reviewedById: ctx.session?.user.id,
            experimentId: input.experimentId,
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            review?.suggestion ||
            "Your comment was not deemed appropriate for the current recipe. Please try again!",
        });
      }
    }),
  remove: adminProcedure
    .input(getByIdSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.experiment.delete({
        where: {
          id: input.id,
        },
      });
    }),
  correctGrammar: protectedProcedure
    .input(correctGrammarSchema)
    .query(async ({ input, ctx }) => {
      const fixed = await correctGrammar(input.comment);
      if (!fixed) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while correcting your grammar",
        });
      }
      const { text } = fixed;
      return text;
    }),
});
