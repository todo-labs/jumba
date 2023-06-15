import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { profileSchema } from "~/schemas";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session?.user.email as string,
      },
      select: {
        name: true,
        dob: true,
      },
    });
  }),
  update: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await ctx.prisma.user.update({
          where: {
            email: ctx.session?.user.email as string,
          },
          data: {
            name: input.name,
            dob: input.dob,
          },
        });

        return data;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update profile",
        });
      }
    }),
});
