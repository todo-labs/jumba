import z from "zod";
import { MAX_INGREDIENTS, MAX_NUM_OF_PEOPLE, Requirements } from "~/constants";

export const createExperimentSchema = z.object({
  prompt: z.string(),
  ingredients: z.array(z.string().cuid()).max(MAX_INGREDIENTS),
  requirements: z.array(z.nativeEnum(Requirements)).max(1),
  category: z.string(),
  tag: z.number().max(999),
  numOfPeople: z.number().max(MAX_NUM_OF_PEOPLE),
});

export const getIngredientsSchema = z.object({
  query: z.string().nullish(),
});

export const addIngredientSchema = z.object({
  // make sure the ingredient name is not numbers
  name: z.string().refine((v) => isNaN(Number(v)), {
    message: "Ingredient name cannot be numbers",
  }),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
