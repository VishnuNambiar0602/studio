
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
  availableParts: z.string().describe('A JSON string of available auto parts, including their id, name, and description.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestPartsInput = z.infer<typeof SuggestPartsInputSchema>;

const SuggestedPartSchema = z.object({
    id: z.string().describe("The unique identifier of the suggested part."),
    name: z.string().describe("The name of the suggested part."),
    reason: z.string().describe("A friendly, human-like explanation of why this part is a good match for the user's query."),
});

const SuggestPartsOutputSchema = z.object({
  isPartQuery: z.boolean().describe("Set to true if the user is asking for a specific part, false if it's a general question."),
  suggestions: z.array(SuggestedPartSchema).describe("A list of suggested parts that match the user description/image."),
  answer: z.string().optional().describe("A helpful answer if the user asked a general automotive question."),
});
export type SuggestPartsOutput = z.infer<typeof SuggestPartsOutputSchema>;

export async function suggestParts(input: SuggestPartsInput): Promise<SuggestPartsOutput> {
  return suggestPartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPartsPrompt',
  input: {schema: SuggestPartsInputSchema},
  output: {schema: SuggestPartsOutputSchema},
  prompt: `You are an expert AI assistant named "The Genie" for GulfCarX, an auto parts store. You are specialized in suggesting auto parts and answering automotive questions. You have a friendly, conversational, and helpful tone, like a knowledgeable friend.
You will detect the language of the user's query (English or Arabic) and respond in the same language.

Your primary goal is to determine the user's intent based on their query.

1.  **If the user is asking for a specific part or shows an image of a part:**
    -   Set the 'isPartQuery' flag to true.
    -   Analyze the user's description and/or image to identify the key characteristics of the part they need.
    -   Compare this to the "Available Auto Parts" list, which is a JSON array.
    -   Identify the most relevant parts from the list and populate the 'suggestions' array.
    -   For each suggestion, you MUST include its 'id' and 'name' from the provided parts list.
    -   Also, provide a brief 'reason' explaining why it's a good match. Make this reason sound human and friendly. For example, instead of "The user's query matches the part name", say something like "This looks like a great match for what you're describing!" or "I think this is exactly what you're looking for."
    -   If no matching parts are found, return an empty 'suggestions' array. Do not populate the 'answer' field.

2.  **If the user is asking a general automotive question (e.g., "What is an OEM part?", "How do I change a tire?"):**
    -   Set the 'isPartQuery' flag to false.
    -   Do not try to match the query to the "Available Auto Parts" list.
    -   Provide a clear, helpful, and concise answer to their question in the 'answer' field, maintaining your friendly tone.
    -   Leave the 'suggestions' array empty.

User's Query: {{{partDescription}}}
{{#if photoDataUri}}
User's Photo: {{media url=photoDataUri}}
{{/if}}
Available Auto Parts (JSON format): {{{availableParts}}}

Your structured JSON response:`,
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
