
export const MAX_INGREDIENTS = 5;
export const MAX_NUM_OF_PEOPLE = 10;
import { Category } from "@prisma/client"

export enum Requirements {
  QUICK = "QUICK",
  FANCY = "FANCY",
  HEALTHY = "HEALTHY",
}

type IOption = {
  title: Category | "Random";
  icon: string;
};

export const options: IOption[] = [
  {
    title: "Random",
    icon: "🙈",
  },
  {
    title: Category.BREAKFAST,
    icon: "🥞",
  },
  {
    title: Category.ASAIN,
    icon: "🍜",
  },
  {
    title: Category.MEXICAN,
    icon: "🌮",
  },
  {
    title: Category.DESSERT,
    icon: "🍩",
  },
  {
    title: Category.INDIAN,
    icon: "🍛",
  },
  {
    title: Category.DINNER,
    icon: "🍱",
  },
];

