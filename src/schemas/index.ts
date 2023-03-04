import z from "zod";
import { MAX_INGREDIENTS } from "~/constants";

export const createExperimentSchema = z.object({
  prompt: z.string(),
  ingredients: z.array(z.string()).max(MAX_INGREDIENTS),
  requirements: z.array(z.string()),
});

export const getIngredientsSchema = z.object({
  query: z.string().nullable(),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
