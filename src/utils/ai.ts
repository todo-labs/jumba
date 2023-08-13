import { LLMChain, loadSummarizationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { z } from "zod";

import { env } from "@/env/server.mjs";
import type { CreateExperiment } from "@/schemas";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const logResponse = (label: string, data: unknown) => {
  if (env.NODE_ENV === "production") return;
  console.log(`${label}: `, JSON.stringify(data, null, 2));
}

const MAX_TOKENS = 2000;

const gpt4 = new OpenAI({
  openAIApiKey: env.OPEN_API_KEY,
  temperature: 0,
  maxTokens: MAX_TOKENS,
  modelName: "gpt-4",
});

const gpt3 = new OpenAI({
  openAIApiKey: env.OPEN_API_KEY,
  temperature: 0,
  maxTokens: MAX_TOKENS,
  modelName: "gpt-3.5-turbo",
})

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

const ingredientsParser = StructuredOutputParser.fromZodSchema(
  z.array(
    z.object({
      name: z.string().describe("The name of the ingredient"),
      icon: z.string().emoji().describe("The icon of the ingredient"),
    })
  )
);

type IngredientsParserResponseType = z.infer<typeof ingredientsParser.schema>;

export async function getRecipe(
  arg: CreateExperiment
): Promise<RecipeParserResponseType | undefined> {
  const actionTemplate = `You are a Michelin star chef. Who has now switched to writing cookbooks.
  {desiredMeal}
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
      desiredMeal: arg.desiredMeal
        ? `You are tasked with creating a recipe for ${arg.desiredMeal}.`
        : "",
    },
  });

  const recipeChain = new LLMChain({
    llm: gpt4,
    prompt: template,
    outputKey: "review",
    outputParser: recipeParser,
    verbose: env.NODE_ENV != "production",
  });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const ingredients = arg.ingredients.map((ingredient) => ingredient.name).join(", ");
  const data = await recipeChain.call({
    ...arg,
    ingredients,
  });

  const end = performance.now();
  console.log(`\nAI took ${Math.fround((end - start) / 1000)}s to respond`);
  logResponse('RECIPE', data['review'])
  return data["review"] as RecipeParserResponseType;
}

export async function getIngredients(
  ingredients: string[]
): Promise<IngredientsParserResponseType | undefined> {
  const actionTemplate = `You are tasked with parsing an ingredients list and returning the icon and name without units, Simply return the generic name like one you would find in the groccery store. The ingredients are: {ingredients}. Please provide the ingredients in the following format: {formatInstructions}. Don't include any explanation in your response`;
  const format = ingredientsParser.getFormatInstructions();

  const template = new PromptTemplate({
    template: actionTemplate,
    inputVariables: ["ingredients"],
    partialVariables: {
      formatInstructions: format,
    },
  });

  const recipeChain = new LLMChain({
    llm: gpt4,
    prompt: template,
    outputKey: "ingredients",
    outputParser: ingredientsParser,
    verbose: env.NODE_ENV != "production"
  });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const data = await recipeChain.call({
    ingredients,
  });

  const end = performance.now();
  console.log(`\nAI took ${Math.fround((end - start) / 1000)}s to respond`);
  logResponse('INGREDIENTS', data['ingredients'])
  return data["ingredients"] as IngredientsParserResponseType;

}

export async function reviewComment(
  comment: string,
  content: string
): Promise<SentimentParserResponseType | undefined> {
  const promptTemplate = `Is this comment: {comment} appropriate for the given summary of a blog post: {content}? If not, please provide your explanation why and how it could be improved.
  Please return your response in the following format: {formatInstructions}`;

  const format = sentimentParser.getFormatInstructions();

  // NOTE: we might do this the first time and then save in db for later uses. 
  //       reasoning is recipe content wont change one its been created.

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500 });
  const docs = await textSplitter.createDocuments([content]);
  const chain = loadSummarizationChain(gpt3, {
    type: "map_reduce",
    verbose: env.NODE_ENV != "production",
  });

  const summary = await chain.call({ input_documents: docs });

  const template = new PromptTemplate({
    template: promptTemplate,
    inputVariables: ["comment", "content"],
    partialVariables: {
      formatInstructions: format,
    },
  });

  const reviewChain = new LLMChain({
    llm: gpt4,
    prompt: template,
    outputKey: "review",
    outputParser: sentimentParser,
    verbose: env.NODE_ENV != "production"
  });

  console.log(`\nAI is thinking...`);
  const start = performance.now();

  const data = await reviewChain.call({ comment, content: summary });

  const end = performance.now();
  console.log(
    `\nAI took ${Math.fround((end - start) / 1000).toFixed(2)}s to respond`
  );
  logResponse('REVIEW', data['review'])
  return data["review"] as SentimentParserResponseType;
}
