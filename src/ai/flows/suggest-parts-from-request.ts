
// Edited
'use server';
/**
 * @fileOverview An AI agent that suggests relevant auto parts based on user description and/or photo, or answers general automotive questions.
 *
 * - suggestParts - A function that suggests parts or answers questions based on the user's request.
 * - SuggestPartsInput - The input type for the suggestParts function.
 * - SuggestPartsOutput - The return type for the suggestParts function.
 */

import {ai} from '@/ai/genkit';
import { logAiInteraction } from '@/lib/actions';
import {z} from 'genkit';

const SuggestPartsInputSchema = z.object({
  partDescription: z.string().describe("The user's description of the auto part or their general automotive question."),
  availableParts: z.string().describe('A JSON string of available auto parts for the store, including their id, name, and description.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of a part, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestPartsInput = z.infer<typeof SuggestPartsInputSchema>;

const SuggestedPartSchema = z.object({
    id: z.string().describe("The unique identifier of the suggested part from the available parts list."),
    name: z.string().describe("The name of the suggested part from the available parts list."),
    reason: z.string().describe("A friendly, human-like explanation of why this part from the store's inventory is a good match for the user's query."),
});

const SuggestPartsOutputSchema = z.object({
  suggestions: z.array(SuggestedPartSchema).optional().describe("A list of suggested parts from the store's inventory that match the user's query. If no matches are found in the inventory, this should be an empty array."),
  answer: z.string().describe("A helpful, friendly, and conversational answer to the user's query. This should always be populated. If the user asks a question, this field contains the direct answer. If you find relevant suggestions, this field should still contain helpful information about the part in general, before mentioning the suggestions."),
  detectedLanguage: z.enum(['en', 'ar']).optional().describe("The detected language of the user's query, either 'en' for English or 'ar' for Arabic. This should be set based on the predominant language in the user's query."),
});
export type SuggestPartsOutput = z.infer<typeof SuggestPartsOutputSchema>;

export async function suggestParts(input: SuggestPartsInput): Promise<SuggestPartsOutput> {
  return suggestPartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPartsPrompt',
  input: {schema: SuggestPartsInputSchema},
  output: {schema: SuggestPartsOutputSchema},
  prompt: `You are an expert AI assistant named "The Genie" for GulfCarX, an auto parts store. You have a friendly, conversational, and helpful tone. You are an expert in all things automotive.
You will detect the language of the user's query (English or Arabic) and respond in the same language, setting the 'detectedLanguage' field appropriately.

Your primary goal is to provide a helpful, comprehensive 'answer' to the user's query first, using your general automotive knowledge. After providing this answer, you will then check the provided "Available Auto Parts" JSON list to see if there are any relevant items in stock to suggest.

Here is your process:
1.  **Analyze the User's Query:** Understand what the user is asking for, whether it's identifying a part, asking for its purpose, or seeking advice.
2.  **Formulate a General Answer:** Using your broad automotive expertise, write a helpful and informative 'answer' to the user's query. For example, if they ask about "brake pads for a Tesla", first explain what kind of brake pads Teslas use, their features, and replacement considerations. This 'answer' should be provided regardless of whether the part is in the inventory.
3.  **Check Inventory & Find Suggestions:** After formulating the general answer, search the "Available Auto Parts" JSON list for items that match the user's request.
    -   If you find one or more relevant parts, populate the 'suggestions' array.
    -   For each suggestion, include its 'id', 'name', and a friendly 'reason' explaining why it's a good match from the inventory.
    -   If no matching parts are found in the inventory, return an empty 'suggestions' array. The 'answer' you formulated in step 2 is still mandatory.

**Example Scenarios:**

*   User asks: "What are OEM parts?"
    *   answer: "OEM stands for Original Equipment Manufacturer... (detailed explanation)".
    *   suggestions: [] (empty, as it's a general question).

*   User asks: "I need brake pads for a 2021 Toyota Land Cruiser."
    *   answer: "For a 2021 Land Cruiser, you'll typically be looking for ceramic brake pads known for their quiet operation... (general helpful info). I've checked our inventory and found some options that might work for you."
    *   suggestions: [{id: "part-001", name: "OEM Brake Pads", reason: "These are high-quality OEM pads that ensure a perfect fit and great performance for your Land Cruiser."}, ... (other matches)]

*   User asks for a part you DON'T have: "Spark plugs for a 1995 Ferrari F50."
    *   answer: "The Ferrari F50 is a classic! It typically uses specialized high-performance spark plugs... (general info). While I don't have the exact spark plugs for that specific model in our current inventory, I can help you find other parts or answer any other questions."
    *   suggestions: [] (empty)

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
    if (!output) {
      throw new Error("The AI model did not return a valid output.");
    }

    // Log each suggestion as a separate interaction
    if (output.suggestions && output.suggestions.length > 0) {
      for (const suggestion of output.suggestions) {
        await logAiInteraction({
          partId: suggestion.id,
          partName: suggestion.name,
          userQuery: input.partDescription,
        });
      }
    }

    return output;
  }
);
