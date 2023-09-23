import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_MAX_PEOPLE: z.coerce.number().int().positive(),
    NEXT_PUBLIC_MAX_INGREDIENTS: z.coerce.number().int().positive(),
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().min(1),
    NEXT_PUBLIC_MIXPANEL_ENABLED: z.coerce.boolean().default(false).optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    NEXT_PUBLIC_MIXPANEL_ENABLED: process.env.NEXT_PUBLIC_MIXPANEL_ENABLE,
    NEXT_PUBLIC_MAX_PEOPLE: process.env.NEXT_PUBLIC_MAX_PEOPLE,
    NEXT_PUBLIC_MAX_INGREDIENTS: process.env.NEXT_PUBLIC_MAX_INGREDIENTS,
  },
});
