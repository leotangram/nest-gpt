interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (options: Options) => {
  const { prompt } = options;

  return { prompt, apiKey: process.env.OPEN_AI_API_KEY };
};
