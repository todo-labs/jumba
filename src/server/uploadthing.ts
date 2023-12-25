import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

import { prisma } from "./db";
import { getServerAuthSession } from "./auth";

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req, res }) => {
      const session = await getServerAuthSession({ req, res });
      if (!session?.user) throw new Error("Unauthorized");
      return {
        email: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { email: metadata.email as string },
        data: { image: file.url },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
