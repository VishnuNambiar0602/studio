// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview An AI agent that suggests relevant auto parts based on user description.
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
});
export type SuggestPartsInput = z.infer<typeof SuggestPartsInputSchema>;

const SuggestPartsOutputSchema = z.object({
  suggestedParts: z.string().describe('A list of suggested parts that match the user description.'),
});
export type SuggestPartsOutput = z.infer<typeof SuggestPartsOutputSchema>;

export async function suggestParts(input: SuggestPartsInput): Promise<SuggestPartsOutput> {
  return suggestPartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPartsPrompt',
  input: {schema: SuggestPartsInputSchema},
  output: {schema: SuggestPartsOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting auto parts based on user descriptions.

You will receive a description of the auto part the user needs and a list of available auto parts.
Based on the user's description, suggest the most relevant parts from the available list.

User's Part Description: {{{partDescription}}}
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
