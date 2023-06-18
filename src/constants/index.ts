import { Category } from "@prisma/client";

export enum Requirements {
  QUICK = "QUICK",
  FANCY = "FANCY",
  HEALTHY = "HEALTHY",
}

type IOption = {
  title: Category;
  icon: string;
};

export const options: IOption[] = [
  {
    title: Category.AFRICAN,
    icon: "🌍",
  },
  {
    title: Category.ITALIAN,
    icon: "🍝",
  },
  {
    title: Category.AMERICAN,
    icon: "🍔",
  },
  {
    title: Category.MEDITERRANEAN,
    icon: "🍆",
  },
  {
    title: Category.VEGETARIAN,
    icon: "🥦",
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
    title: Category.HISPANIC,
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

export const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;
