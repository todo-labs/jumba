import z from "zod";
import { MAX_INGREDIENTS, MAX_NUM_OF_PEOPLE, Requirements } from "~/constants";

export const createExperimentSchema = z.object({
  prompt: z.string(),
  ingredients: z.array(z.string()).max(MAX_INGREDIENTS),
  requirements: z.array(z.nativeEnum(Requirements)),
  option: z.string(),
  numOfPeople: z.number().max(MAX_NUM_OF_PEOPLE),
});

export const getIngredientsSchema = z.object({
  query: z.string().nullable(),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
