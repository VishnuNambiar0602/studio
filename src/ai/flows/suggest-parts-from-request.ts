// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview An AI agent that suggests relevant auto parts based on user description and/or photo.
 *
 * - suggestParts - A function that suggests parts based on the user's request.
 * - SuggestPartsInput - The input type for the suggestParts function.
 * - SuggestPartsOutput - The return type for the suggestParts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPartsInputSchema = z.object({
  partDescription: z.string().describe('The description of the auto part the user needs.'),
  availableParts: z.string().describe('A list of available auto parts and their details.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestPartsInput = z.infer<typeof SuggestPartsInputSchema>;

const SuggestPartsOutputSchema = z.object({
  suggestedParts: z.string().describe('A list of suggested parts that match the user description and/or image. The response should be in the same language as the user query.'),
});
export type SuggestPartsOutput = z.infer<typeof SuggestPartsOutputSchema>;

export async function suggestParts(input: SuggestPartsInput): Promise<SuggestPartsOutput> {
  return suggestPartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPartsPrompt',
  input: {schema: SuggestPartsInputSchema},
  output: {schema: SuggestPartsOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting auto parts based on user descriptions and images.
You will detect the language of the user's description (English or Arabic) and respond in the same language.

You will receive a description of the auto part the user needs, a list of available auto parts, and optionally an image of the part.
Based on the user's description and/or image, suggest the most relevant parts from the available list.

User's Part Description: {{{partDescription}}}
{{#if photoDataUri}}
User's Photo: {{media url=photoDataUri}}
{{/if}}
Available Auto Parts: {{{availableParts}}}

Suggested Parts:`, // Ensure that the output provides only the suggested parts.
});

const suggestPartsFlow = ai.defineFlow(
  {
    name: 'suggestPartsFlow',
    inputSchema: SuggestPartsInputSchema,
    outputSchema: SuggestPartsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
