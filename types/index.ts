import type { Experiment, Imgs, Reviews, User, Ingredient } from "@prisma/client";

type Review = Reviews & {
  reviewedBy: User;
};

export type IExperiment = Experiment & {
  imgs: Imgs[];
  reviews: Review[];
  createdBy: User | null;
  ingredients: Ingredient[];
};

export type IExperimentWithoutReviews = Omit<IExperiment, "Reviews">;
