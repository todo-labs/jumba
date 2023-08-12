import { createUploadthing, type FileRouter } from "uploadthing/next";
import { prisma } from "./db";
import { getServerAuthSession } from "./auth";
import { z } from "zod";
const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req, res }) => {
      const session = await getServerAuthSession(req, res);
      if (!session?.user) throw new Error("Not logged in");
      return {
        email: session.user.email,
      };
    })
    .onUploadComplete((data) => {
      // save to user profile
    }),
  reviewImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .input(
      z.object({
        experimnetId: z.string().cuid(),
      })
    )
    .middleware(async ({ req, res }) => {
      const session = await getServerAuthSession(req, res);
      if (!session?.user) throw new Error("UNAUTHORIZED");
      return {
        email: session.user.email,
      };
    })
    .onUploadComplete(async (data) => {
      await prisma.imgs.create({
        data: {
          url: data.files[0].url,
          experimentId: data.input.experimnetId,
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
