import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_MAX_PEOPLE: z
      .string()
      .transform((s) => parseInt(s, 10))
      .pipe(z.number()),
      NEXT_PUBLIC_MAX_INGREDIENTS: z
      .string()
      .transform((s) => parseInt(s, 10))
      .pipe(z.number()),
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),
    NEXT_PUBLIC_MIXPANEL_ENABLED: z
    .string()
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true")
    .default("false"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    NEXT_PUBLIC_MIXPANEL_ENABLED: process.env.NEXT_PUBLIC_MIXPANEL_ENABLED,
    NEXT_PUBLIC_MAX_PEOPLE: process.env.NEXT_PUBLIC_MAX_PEOPLE,
    NEXT_PUBLIC_MAX_INGREDIENTS: process.env.NEXT_PUBLIC_MAX_INGREDIENTS,
  },
});
