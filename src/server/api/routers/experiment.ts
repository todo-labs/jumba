import { TRPCError } from "@trpc/server";
import sentiment from "sentiment";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createExperimentSchema,
  getByIdSchema,
  leaveReviewSchema,
} from "~/schemas";
import { getRecipe, reviewComment } from "~/utils/ai";

export const experimentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.experiment.findMany({
      where: {
        createdById: ctx.session?.user.id || undefined,
      },
      include: {
        createdBy: true,
        Imgs: {
          select: {
            approved: true,
            url: true,
          },
        },
      },
      orderBy: {
        tag: "asc",
        createdAt: "desc",
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

        const tag = Math.floor(Math.random() * 1000);

        // TODO: check for duplicates

        const data = await ctx.prisma.experiment.create({
          data: {
            tag,
            steps: recipe.steps,
            createdById: ctx.session?.user.id,
            feeds: input.feeds,
            inspiration: recipe.inspiration,
            title: recipe.title,
            ingredients: recipe.ingredients,
            category: input.category,
            duration: recipe.duration,
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

      const content =
        experiment?.ingredients.concat(experiment?.steps).join(" ") || "";

      const approval = await reviewComment(input.comment, content);

      if (approval?.approved) {
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
            approval?.suggestion ||
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
});
