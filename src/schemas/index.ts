import { Category } from "@prisma/client";
import z from "zod";
import { MAX_INGREDIENTS, MAX_NUM_OF_PEOPLE, Requirements } from "~/constants";

export const createExperimentSchema = z.object({
  ingredients: z.string().min(3).max(300).refine((val) => {
    const ingredients = val.split(",");
    return ingredients.length <= MAX_INGREDIENTS 
      && ingredients.every((ingredient) => isNaN(Number(ingredient)));
  }),
  requirements: z.nativeEnum(Requirements),
  category: z.nativeEnum(Category),
  // numOfPeople: z.string().refine((val) => {
  //   if (isNaN(Number(val))) return false;
  //   const numOfPeople = Number(val);
  //   return numOfPeople <= MAX_NUM_OF_PEOPLE && numOfPeople > 0;
  //   }),
});

export const getByIdSchema = z.object({
  id: z.string().nonempty().cuid(),
});

export type CreateExperiment = z.infer<typeof createExperimentSchema>;
