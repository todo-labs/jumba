import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { z } from "zod";

import { env } from "~/env.mjs";
import type { CreateExperiment } from "~/schemas";

const model = new OpenAI({
  openAIApiKey: env.OPEN_API_KEY,
  temperature: 0,
  maxTokens: 2000,
  modelName: "gpt-3.5-turbo",
});

const recipeParser = StructuredOutputParser.fromZodSchema(
  z.object({
    title: z.string().describe("The unique title of the recipe"),
    inspiration: z
      .string()
      .describe(
        "The inspiration for the recipe, 2-3 sentences, very expressive"
      ),
    ingredients: z
      .array(z.string())
      .describe(
        "The ingredients needed to create the recipe, make sure to include the amount of each ingredient"
      ),
    steps: z
      .array(z.string())
      .describe(
        "The detailed step by step instructions on how to create the recipe"
      ),
    duration: z.number().describe("The duration of the recipe in minutes"),
  })
);

type RecipeParserResponseType = z.infer<typeof recipeParser.schema>;

const sentimentParser = StructuredOutputParser.fromZodSchema(
  z.object({
    approved: z
      .boolean()
      .describe(
        "Whether or not this review is appropriate for the given content"
      ),
    suggestion: z
      .string()
      .describe(
        "Why this comment was not approved, if approved return an empty string"
      ),
  })
);

type SentimentParserResponseType = z.infer<typeof sentimentParser.schema>;

export async function getRecipe(
  arg: CreateExperiment
): Promise<RecipeParserResponseType | undefined> {
  const actionTemplate = `
    You are a Michelin star chef. Who has now switched to writing cookbooks.
    You are writing a cookbook for {category} cuisine. You are tasked with coming up with a recipe using the following ingredients: {ingredients}.
    Please provide the recipe in the following format: {formatInstructions}
    The recipe must be {requirements} and feed {feeds} people.
    The recipe must include a unique title, inspiration, ingredients, steps, and duration.
    Be very expressive/detailed with your instructions/steps. I want the user to be able to follow the instructions and make the recipe.
    Recipe: 
  `;
  const format = recipeParser.getFormatInstructions();

  const template = new PromptTemplate({
    template: actionTemplate,
    inputVariables: ["category", "ingredients", "requirements", "feeds"],
    partialVariables: {
      formatInstructions: format,
    },
  });

  const recipeChain = new LLMChain({
    llm: model,
    prompt: template,
    outputKey: "review",
    outputParser: recipeParser,
    verbose: true,
  });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const ingredients = arg.ingredients.map((ingredient) => ingredient.name);
  const data = await recipeChain.call({
    ...arg,
    ingredients: ingredients.join(", "),
  });

  const end = performance.now();
  console.log(`\nAI took ${Math.fround((end - start) / 1000)}s to respond`);
  return data["review"] as RecipeParserResponseType;
}

export async function reviewComment(
  comment: string,
  content: string
): Promise<SentimentParserResponseType | undefined> {
  const promptTemplate = `Is this {comment} appropriate for the given content: {content}? If not, please provide suggestions to make it more suitable.
  {formatInstructions}`;

  const format = sentimentParser.getFormatInstructions();

  const template = new PromptTemplate({
    template: promptTemplate,
    inputVariables: ["comment", "content"],
    partialVariables: {
      formatInstructions: format,
    },
  });

  const reviewChain = new LLMChain({
    llm: model,
    prompt: template,
    outputKey: "review",
    outputParser: sentimentParser,
    verbose: true,
  });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const data = await reviewChain.call({ comment, content });

  const end = performance.now();
  console.log(
    `\nAI took ${Math.fround((end - start) / 1000).toFixed(2)}s to respond`
  );
  return data["review"] as SentimentParserResponseType;
}
