import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getIngredientsSchema } from "~/schemas";


export const metadataRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(getIngredientsSchema)
    .query(async ({ input }) => {
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
          const ingredients = data.split("\n").map((x) => {
            return x.trim().replace(/[^a-zA-Z ]/g, "");
          });
          return ingredients.filter((x) => x.includes(input.query ?? ""));
        }
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getRandom: publicProcedure.query(async () => {
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
        const ingredients = data.split("\n").map((x) => {
          return x.trim().replace(/[^a-zA-Z ]/g, "");
        });
        const randomIndex = Math.floor(Math.random() * ingredients.length);
        return ingredients[randomIndex];
      }
    } catch (error) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
});
