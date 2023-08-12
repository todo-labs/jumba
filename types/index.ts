import type { Experiment, Imgs, Reviews, User } from "@prisma/client";

type Review = Reviews & {
  reviewedBy: User;
};

export type IExperiment = Experiment & {
  Imgs: Imgs[];
  Reviews: Review[];
  createdBy: User | null;
};

export type IExperimentWithoutReviews = Omit<IExperiment, "Reviews">;
