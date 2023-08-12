import { Category } from "@prisma/client";
import z from "zod";
import { Requirements } from "@/utils/constants";
import { env } from "@/env.mjs";

export const createExperimentSchema = z.object({
  ingredients: z
    .array(
      z.object({
        name: z.string().min(2).max(30),
      })
    )
    .min(2)
    .max(10),
  requirements: z.nativeEnum(Requirements),
  category: z.nativeEnum(Category),
  feeds: z.number().min(1).max(parseInt(env.NEXT_PUBLIC_MAX_PEOPLE)),
  desiredMeal: z.string().min(2).max(50).optional(),
});

export const getByIdSchema = z.object({
  id: z.string().nonempty().cuid(),
});

export const leaveReviewSchema = z.object({
  experimentId: z.string().cuid(),
  rating: z.number().min(1).max(10),
  comment: z.string().min(20).max(300),
});

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  profilePicture: z
    .string()
    .url({
      message: "Profile picture must be a valid URL.",
    })
    .optional(),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
export type GetById = z.infer<typeof getByIdSchema>;
export type LeaveReview = z.infer<typeof leaveReviewSchema>;
export type Profile = z.infer<typeof profileSchema>;
