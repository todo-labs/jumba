import { Ingredient } from "@prisma/client";

export const MAX_INGREDIENTS = 5;
export const MAX_NUM_OF_PEOPLE = 10;

export enum Requirements {
  QUICK = "Quick",
  FANCY = "Fancy",
  HEALTHY = "Healthy",
  BARBECUE = "Barbeque",
}

type IOption = {
  title: string;
  icon: string;
};

export const options: IOption[] = [
  {
    title: "Random",
    icon: "🙈",
  },
  {
    title: "Breakfast",
    icon: "🥞",
  },
  {
    title: "Asian",
    icon: "🍜",
  },
  {
    title: "Mexican",
    icon: "🌮",
  },
  {
    title: "Dessert",
    icon: "🍩",
  },
  {
    title: "Indian",
    icon: "🍛",
  },
  {
    title: "Dinner",
    icon: "🍱",
  },
];


export const getPrompt = (
  ingredients: Ingredient[],
  option: string,
  requirements: Requirements[],
  numOfPeople: number
): { text: string; highlighted: boolean }[] => {
  const prompt: { text: string; highlighted: boolean }[] = [];
  if (ingredients.length === 1) {
    prompt.push({ text: "I have ", highlighted: false });
    prompt.push({ text: ingredients[0].name, highlighted: true });
    prompt.push({
      text: " in my kitchen and I want to whip up something delicious. ",
      highlighted: false,
    });
  }
  prompt.push({ text: `I'm looking for a `, highlighted: false });
  prompt.push({ text: option, highlighted: true });
  prompt.push({ text: " dish that can feed ", highlighted: false });
  prompt.push({
    text: numOfPeople > 1 ? `${numOfPeople} people` : "just myself",
    highlighted: true,
  });
  prompt.push({
    text: " and is packed with flavor. Can you help me find a recipe that meets my criteria?",
    highlighted: false,
  });
  let ingredientsText = "";
  for (let i = 0; i < ingredients.length; i++) {
    if (i === ingredients.length - 1) {
      ingredientsText += `and ${ingredients[i].name}`;
    } else {
      ingredientsText += `${ingredients[i].name}, `;
    }
  }
  prompt.push({ text: " I have ", highlighted: false });
  prompt.push({ text: ingredientsText, highlighted: true });
  prompt.push({
    text: " in my kitchen and I want to whip up something delicious. ",
    highlighted: false,
  });
  if (requirements.includes(Requirements.QUICK)) {
    prompt.push({
      text: "I'm in a hurry and want to make a quick meal using these ingredients. ",
      highlighted: true,
    });
  }
  if (requirements.includes(Requirements.FANCY)) {
    prompt.push({
      text: "I'm hosting a party and want to impress my guests with a fancy dish made with these ingredients. Can you recommend a recipe that's both elegant and delicious?",
      highlighted: true,
    });
  }
  if (requirements.includes(Requirements.HEALTHY)) {
    prompt.push({
      text: "I'm trying to eat healthier and want to make a nutritious meal using the above ingredients. Can you suggest a recipe that's both healthy and tasty?",
      highlighted: true,
    });
  }
  if (requirements.includes(Requirements.BARBECUE)) {
    prompt.push({
      text: "I'm in the mood for a barbecue and want to make a delicious dish using these ingredients. Can you recommend a recipe that's perfect for grilling?",
      highlighted: true,
    });
  }
  return prompt;
};
