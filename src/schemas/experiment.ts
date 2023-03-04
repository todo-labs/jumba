import z from "zod";

export const experimentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const createExperimentSchema = experimentSchema.omit({
  id: true,
});

export type Experiment = z.infer<typeof experimentSchema>;
export type CreateExperiment = z.infer<typeof createExperimentSchema>;
