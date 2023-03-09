import z from "zod";
import { MAX_INGREDIENTS, MAX_NUM_OF_PEOPLE, Requirements } from "~/constants";

export const createExperimentSchema = z.object({
  prompt: z.string(),
  ingredients: z.array(z.string()).max(MAX_INGREDIENTS),
  requirements: z.array(z.nativeEnum(Requirements)),
  category: z.string(),
  tag: z.number().max(999),
  numOfPeople: z.number().max(MAX_NUM_OF_PEOPLE),
});

export const getIngredientsSchema = z.object({
  query: z.string().nullish(),
});

export const addIngredientSchema = z.object({
  name: z.string(),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
