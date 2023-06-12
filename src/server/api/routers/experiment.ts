import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createExperimentSchema,
  getByIdSchema,
  leaveReviewSchema,
} from "~/schemas";
import { getRecipe } from "~/utils/ai";

export const experimentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.experiment.findMany({
      include: {
        createdBy: true,
        Imgs: {
          select: {
            approved: true,
            url: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(createExperimentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const recipe = await getRecipe(
          input.category || "Random",
          input.ingredients,
          input.requirements,
          input.numOfPeople
        );

        if (!recipe) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not generate a recipe",
          });
        }

        const tag = Math.floor(Math.random() * 1000);

        // TODO: check for duplicates

        const data = await ctx.prisma.experiment.create({
          data: {
            tag,
            steps: recipe.steps,
            feeds: input.numOfPeople,
            inspiration: recipe.inspiration,
            createdById: ctx.session?.user.id,
            title: recipe.title,
            ingredients: recipe.ingredients,
            category: input.category,
            duration: recipe.duration,
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
        Reviews: {
          include: {
            reviewedBy: true,
          },
        },
        Imgs: true,
      },
    });
  }),
  leaveReview: protectedProcedure
    .input(leaveReviewSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.reviews.create({
        data: {
          comment: input.comment,
          rating: input.rating!,
          reviewedById: ctx.session?.user.id,
          experimentId: input.experimentId,
        },
      });
    }),
});
