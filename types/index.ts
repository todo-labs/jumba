import { Experiment, Imgs, Reviews, User } from "@prisma/client";

export type IExperiment = Experiment & {
    Imgs: Imgs[];
    Reviews: Reviews[];
    createdBy: User | null;
  };