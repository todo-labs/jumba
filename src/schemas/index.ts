import { Category } from "@prisma/client";
import z from "zod";
import { Requirements } from "~/constants";
import { env } from "~/env.mjs";

export const createExperimentSchema = z.object({
  ingredients: z
    .string()
    .min(3)
    .max(300)
    .refine((val) => {
      const ingredients = val.split(",");
      return (
        ingredients.length <= parseInt(env.NEXT_PUBLIC_MAX_INGREDIENTS) &&
        ingredients.every((ingredient) => isNaN(Number(ingredient)))
      );
    }),
  requirements: z.nativeEnum(Requirements),
  category: z.nativeEnum(Category),
  numOfPeople: z
    .number()
    .min(1)
    .max(parseInt(env.NEXT_PUBLIC_MAX_PEOPLE)),
});

export const getByIdSchema = z.object({
  id: z.string().nonempty().cuid(),
});

export const leaveReviewSchema = z.object({
  experimentId: z.string().nonempty().cuid(),
  rating: z.number().min(1).max(10).optional(),
  comment: z.string().min(20).max(300),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
export type GetById = z.infer<typeof getByIdSchema>;
export type LeaveReview = z.infer<typeof leaveReviewSchema>;
