import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

export default class OpenAi {
  private openAiApi: OpenAIApi;

  constructor() {
    const config = new Configuration({
      apiKey: env.OPEN_API_KEY,
    });

    this.openAiApi = new OpenAIApi(config);
  }

  public async getRecipe(prompt: string): Promise<string | undefined> {
    try {
      console.log("Getting recipe: ", prompt);
      const _prompt = prompt.concat("Make sure to separate ingredients with a dash and instructions with a number. Dont include the title of the recipe");
      const response = await this.openAiApi.createCompletion({
        model: "text-davinci-003",
        prompt: _prompt,
        temperature: 0.3,
        max_tokens: 1200,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      return response.data.choices[0].text;
    } catch (error) {
      console.error("Error getting recipe: ", error);
      throw error;
    }
  }

}
