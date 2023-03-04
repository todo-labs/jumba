import { Configuration, OpenAIApi } from "openai";
import { CreateExperiment } from "~/schemas";

export default class OpenAi {
  private openAiApi: OpenAIApi;

  constructor() {
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openAiApi = new OpenAIApi(config);
  }

  public async getRecipe(schema: CreateExperiment, maxTokens: number) {
    const { ingredients, prompt, requirements } = schema;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "Write a recipe based on these ingredients and instructions:\n\nFrito Pie\n\nIngredients:\nFritos\nChili\nShredded cheddar cheese\nSweet white or red onions, diced small\nSour cream\n\nInstructions:",
      temperature: 0.3,
      max_tokens: 120,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return response.data.choices[0].text;
  }
}
