import { Experiment, Ingredient, User } from "@prisma/client";

export type IExperiment = Experiment & {
    ingredients: Ingredient[];
    createdBy: User | null;
  };