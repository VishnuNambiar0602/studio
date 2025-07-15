// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview An AI agent that suggests relevant auto parts based on user description and/or photo, or answers general automotive questions.
 *
 * - suggestParts - A function that suggests parts or answers questions based on the user's request.
 * - SuggestPartsInput - The input type for the suggestParts function.
 * - SuggestPartsOutput - The return type for the suggestParts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPartsInputSchema = z.object({
  partDescription: z.string().describe('The description of the auto part the user needs, or a general automotive question.'),
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
  suggestedParts: z.string().describe('A list of suggested parts that match the user description/image, or a helpful answer to a general automotive question. The response should be in the same language as the user query.'),
});
export type SuggestPartsOutput = z.infer<typeof SuggestPartsOutputSchema>;

export async function suggestParts(input: SuggestPartsInput): Promise<SuggestPartsOutput> {
  return suggestPartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPartsPrompt',
  input: {schema: SuggestPartsInputSchema},
  output: {schema: SuggestPartsOutputSchema},
  prompt: `You are an expert AI assistant named "The Genie" for an auto parts store. You are specialized in suggesting auto parts and answering automotive questions.
You will detect the language of the user's query (English or Arabic) and respond in the same language.

Your primary goal is to determine the user's intent.

1.  **If the user is asking for a specific part or shows an image of a part:**
    -   Analyze the user's description and/or image to identify the part they need.
    -   Compare this to the "Available Auto Parts" list.
    -   Suggest the most relevant parts from the list.
    -   If no matching parts are found, politely inform the user that the part is not currently in stock but you can answer other questions they might have.
    -   The output should be a clear list of suggestions.

2.  **If the user is asking a general automotive question (e.g., "What is an OEM part?", "How do I change a tire?"):**
    -   Do not try to match the query to the "Available Auto Parts" list.
    -   Provide a clear, helpful, and concise answer to their question.
    -   The output should be a well-formatted, generalized response.

User's Query: {{{partDescription}}}
{{#if photoDataUri}}
User's Photo: {{media url=photoDataUri}}
{{/if}}
Available Auto Parts: {{{availableParts}}}

Your Response:`,
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
