import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const metadataRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    try {
      const response = await fetch(
        "https://gist.githubusercontent.com/ConceptCodes/cda94d317fe3140ba860839dbcb71ed8/raw/08e3cf7a155f15d87db22fd1184c3efc9bad623f/all_recipies_ingredients.txt"
      );
      const data = await response.text();
      if (!data) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "No data found",
        });
      } else {
        return data.split("\n");
      }
    } catch (error) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
});
