import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    OPEN_API_KEY: z.string().min(1).optional(),
    EMAIL_HOST: z.string().min(1).optional(),
    EMAIL_PORT: z.string().min(1).optional(),
    EMAIL_USER: z.string().min(1).optional(),
    EMAIL_PASSWORD: z.string().min(1).optional(),
    EMAIL_FROM: z.string().min(1).optional(),
    PEXELS_API_KEY: z.string().min(1).optional(),
    UPLOADTHING_SECRET: z.string().min(1).optional(),
    UPLOADTHING_APP_ID: z.string().min(1).optional()
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    OPEN_API_KEY: process.env.OPEN_API_KEY,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_USER: process.env.EMAIL_USER,
    PEXELS_API_KEY: process.env.PEXELS_API_KEY,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID
  },
});
