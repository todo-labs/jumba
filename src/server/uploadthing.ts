import { createUploadthing, type FileRouter } from "uploadthing/next";

import { prisma } from "./db";
import { getServerAuthSession } from "./auth";

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req, res }) => {
      const session = await getServerAuthSession({ req, res });
      if (!session?.user) throw new Error("Not logged in");
      return {
        email: session.user.email,
      };
    })
    .onUploadComplete(async (data) => {
      await prisma.user.update({
        where: { email: data.metadata.email as string },
        data: { image: data.file.url },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
