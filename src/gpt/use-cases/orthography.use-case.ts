import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openAI: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openAI.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Te serán proveídos textos en español con posibles errores ortográficos y gramaticales.
          Las palabras usadas deben existir en el diccionario de la Real Academia Española.
          Debes responder en formato JSON, tu tarea es corregirlos y retornar información soluciones, también debes dar un porcentaje de acierto por el usuario.
          Si hay errores, debes retornar un mensaje de felicitaciones.
          
          Ejemplo de salida:
          {
            userScore: number,
            errors: string[], // ['error -> solución']
            message: string, // 'Usa emojis, por lo menos uno, y textos para felicitar al usuario'
          }
          `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.3,
    max_tokens: 150,
    response_format: {
      type: 'json_object',
    },
  });

  const jsonResponse = JSON.parse(completion.choices[0].message.content);

  return jsonResponse;
};
