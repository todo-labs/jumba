import { Configuration, OpenAIApi } from "openai";

export default class OpenAi {
  private openAiApi: OpenAIApi;

  constructor() {
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openAiApi = new OpenAIApi(config);
  }

  public async enhancePrompt(prompt: string): Promise<string> {
    const response = await this.openAiApi.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 1200,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response.data.choices[0].text;
  }

  public async getRecipe(prompt: string): Promise<string | undefined> {
    const response = await this.openAiApi.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 1200,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return response.data.choices[0].text;
  }
}
