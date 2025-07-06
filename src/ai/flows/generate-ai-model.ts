'use server';

/**
 * @fileOverview An AI model generation agent.
 *
 * - generateAiModel - A function that handles the AI model generation process.
 * - GenerateAiModelInput - The input type for the generateAiModel function.
 * - GenerateAiModelOutput - The return type for the generateAiModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiModelInputSchema = z.object({
  description: z.string().describe('The description of the AI model to generate, including attributes like size, pose, and skin tone.'),
});
export type GenerateAiModelInput = z.infer<typeof GenerateAiModelInputSchema>;

const GenerateAiModelOutputSchema = z.object({
  modelImage: z
    .string()
    .describe(
      "A photo of the generated AI model, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateAiModelOutput = z.infer<typeof GenerateAiModelOutputSchema>;

export async function generateAiModel(input: GenerateAiModelInput): Promise<GenerateAiModelOutput> {
  return generateAiModelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiModelPrompt',
  input: {schema: GenerateAiModelInputSchema},
  output: {schema: GenerateAiModelOutputSchema},
  prompt: `You are an AI model generator. Generate an image of an AI model based on the following description: {{{description}}}. The image should be a data URI.`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateAiModelFlow = ai.defineFlow(
  {
    name: 'generateAiModelFlow',
    inputSchema: GenerateAiModelInputSchema,
    outputSchema: GenerateAiModelOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: input.description,
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {
      modelImage: media!.url,
    };
  }
);
