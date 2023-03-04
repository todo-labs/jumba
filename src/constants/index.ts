export * from "./options";

export const MAX_INGREDIENTS = 5;
export const MAX_NUM_OF_PEOPLE = 10;

export enum Requirements {
  QUICK = "Quick",
  FANCY = "Fancy",
  HEALTHY = "Healthy",
  BARBECUE = "Barbeque",
}

export const getPrompt = (
  ingredients: string[],
  option: string,
  requirements: Requirements[],
  numOfPeople: number
): string => {
  let prompt = "";
  if (option === "random") {
    return `I have ${ingredients.join(
      ", "
    )} in my kitchen and I want to whip up something delicious. Can you suggest a recipe for me?`;
  } else if (requirements.includes(Requirements.QUICK)) {
    prompt +=
      "I'm in a hurry and looking for a quick and easy meal that's filling and delicious. Can you help me find a recipe?";
  } else if (requirements.includes(Requirements.FANCY)) {
    prompt +=
      "I'm hosting a dinner party and want to impress my guests with a fancy dish made with these ingredients. Can you recommend a recipe that's both elegant and delicious?";
  } else if (requirements.includes(Requirements.HEALTHY)) {
    prompt +=
      "I'm trying to eat healthier and want to make a nutritious meal using these ingredients. Can you suggest a recipe that's both healthy and tasty?";
  } else if (requirements.includes(Requirements.BARBECUE)) {
    prompt +=
      "I'm in the mood for a barbeque and want to make a delicious dish using these ingredients. Can you recommend a recipe that's perfect for grilling?";
  }
  prompt += ` I'm looking for a ${option} dish that can feed ${
    numOfPeople > 1 ? `${numOfPeople} people` : "just myself"
  } and is packed with flavor. Can you help me find a recipe that meets my criteria?`;
  return prompt;
};
