import { Category } from "@prisma/client";
import z from "zod";
import { Requirements } from "~/constants";
import { env } from "~/env.mjs";

export const createExperimentSchema = z.object({
  ingredients: z.string().min(3).max(300).refine((val) => {
    const ingredients = val.split(",");
    return ingredients.length <= parseInt(env.NEXT_PUBLIC_MAX_INGREDIENTS) 
      && ingredients.every((ingredient) => isNaN(Number(ingredient)));
  }),
  requirements: z.nativeEnum(Requirements),
  category: z.nativeEnum(Category).optional(),
  numOfPeople: z.number().int().min(1).max(parseInt(env.NEXT_PUBLIC_MAX_PEOPLE)),
});

export const getByIdSchema = z.object({
  id: z.string().nonempty().cuid(),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
