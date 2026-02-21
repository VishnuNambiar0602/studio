
'use server';
/**
 * @fileOverview An AI agent that suggests relevant auto parts based on user description and/or photo, or answers general automotive questions.
 *
 * - suggestParts - A function that suggests parts or answers questions based on the user's request.
 * - SuggestPartsInput - The input type for the suggestParts function.
 * - SuggestPartsOutput - The return type for the suggestParts function.
 */

import { generateAIResponse } from '@/ai/genkit';
import { logAiInteraction } from '@/lib/actions';
import { z } from 'zod';
import { createHash } from 'crypto';

const SuggestPartsInputSchema = z.object({
  partDescription: z.string().describe("The user's description of the auto part or their general automotive question."),
  previousUserQuery: z.string().optional().describe("The user's immediately preceding query, to provide conversational context."),
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
    reason: z.string().describe("A brief, factual explanation of why this part from the store's inventory is a good match for the user's query."),
});

const SuggestPartsOutputSchema = z.object({
  suggestions: z.array(SuggestedPartSchema).optional().describe("A list of suggested parts from the store's inventory that match the user's query. If no matches are found in the inventory, this should be an empty array."),
  answer: z.string().describe("A helpful, factual, and direct answer to the user's query. This should always be populated. If the user asks a question, this field contains the direct answer. If you find relevant suggestions, this field should still contain helpful information about the part in general, before mentioning the suggestions."),
  detectedLanguage: z.enum(['en', 'ar']).optional().describe("The detected language of the user's query, either 'en' for English or 'ar' for Arabic. This should be set based on the predominant language in the user's query."),
  followUpQuestions: z.array(z.string()).optional().describe("A list of 2-3 relevant follow-up questions the user might have, based on the context of the answer provided. For example, 'What tools do I need to install this?' or 'Is there a warranty?'"),
});
export type SuggestPartsOutput = z.infer<typeof SuggestPartsOutputSchema>;

export async function suggestParts(input: SuggestPartsInput): Promise<SuggestPartsOutput> {
  // If there's a photo but no text, provide a default description.
  if (input.photoDataUri && !input.partDescription) {
    input.partDescription = "Please identify the part in the image and tell me about it.";
  }

  const languageInstruction = `You will detect the language of the user's query (English or Arabic) and respond in the same language, setting the 'detectedLanguage' field appropriately.`;

// ...existing code...
  // Build the prompt
  // Note: Image analysis is limited without multimodal AI support
  // The AI can only work with textual descriptions of images
  let promptText = `You are an expert AI assistant for GulfCarX, an auto parts store. Your persona is professional, direct, and factual. Your primary expertise is in all things automotive, but you are also a capable general knowledge AI that can answer questions on any topic. Avoid emotional language, opinions, or any conversational fluff.

${languageInstruction}

CRITICAL: When responding in Arabic, you MUST translate ALL content to Arabic including:
- The 'answer' field must be in Arabic
- The 'name' field in suggestions must be translated to Arabic (translate the part name)
- The 'reason' field in suggestions must be in Arabic
- The 'followUpQuestions' must be in Arabic

When responding in English, keep everything in English.

Your primary goal is to provide a helpful, factual 'answer' to the user's query first.
- If the query is car-related, use your deep automotive knowledge.
- If the query is a general knowledge question (e.g., "What is the capital of Oman?"), answer it accurately and concisely.

After providing the answer, you will THEN check if the query was related to cars or auto parts. If and only if it was automotive-related, search the provided "Available Auto Parts" JSON list to see if there are any relevant items in stock to suggest. For general knowledge questions, you should not suggest any parts.

Consider the user's previous query to maintain conversational context.

Here is your process:
1.  **Analyze the User's Query:** Understand what the user is asking. Is it automotive, general knowledge, or something else? Use the 'Previous User Query' for context.${input.photoDataUri ? ' Note: The user has provided an image - ask them to describe what they see in the image, as image analysis is not available with the current AI provider.' : ''}
2.  **Formulate an Answer:**
    - For car questions: Write a helpful, factual 'answer'.
    - For general questions: Provide a clear and accurate answer.
    This 'answer' is always mandatory.
    - If the detected language is Arabic, write the answer in Arabic.
3.  **Check Inventory (for Automotive Queries Only):** If the query was about cars or parts, search the "Available Auto Parts" JSON for matching items.
    - If matches are found, populate the 'suggestions' array with 'id', 'name' (TRANSLATE TO ARABIC IF DETECTED LANGUAGE IS ARABIC), and a factual 'reason' (IN ARABIC IF DETECTED LANGUAGE IS ARABIC).
    - If no matches are found for an automotive query, return an empty 'suggestions' array.
    - For non-automotive queries, always return an empty 'suggestions' array.
4.  **Suggest Follow-up Questions:** Based on your response, generate 2-3 relevant follow-up questions in the detected language. Populate these in the 'followUpQuestions' array.

User's Current Query: ${input.partDescription}
${input.previousUserQuery ? `Previous User Query: ${input.previousUserQuery}` : ''}
Available Auto Parts (JSON format): ${input.availableParts}

Respond ONLY with a valid JSON object matching this schema:
{
  "suggestions": [{"id": "string", "name": "string (TRANSLATED TO ARABIC IF detectedLanguage IS 'ar')", "reason": "string (IN ARABIC IF detectedLanguage IS 'ar')"}],
  "answer": "string (IN ARABIC IF detectedLanguage IS 'ar')",
  "detectedLanguage": "en" or "ar",
  "followUpQuestions": ["string (IN ARABIC IF detectedLanguage IS 'ar')"]
}`;

  // Generate cache key for part suggestions (TTL: 1 minute for faster responses)
  // Include previousUserQuery to ensure different conversation contexts don't share cache
  const cacheKey = createHash('md5')
    .update(`${input.partDescription}:${input.previousUserQuery || ''}:${input.availableParts}`)
    .digest('hex');

  try {
    const response = await generateAIResponse(promptText, {
      cacheKey,
      cacheTTL: 60000, // 1 minute for part suggestions (faster refresh)
      useCache: true,
    });

    // Parse the JSON response
    let output: SuggestPartsOutput;
    try {
      // Clean the response - remove markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      output = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', response);
      throw new Error('AI returned an invalid response format.');
    }

    // Validate the output against the schema
    const validated = SuggestPartsOutputSchema.parse(output);

    // Log each suggestion as a separate interaction
    if (validated.suggestions && validated.suggestions.length > 0) {
      for (const suggestion of validated.suggestions) {
        await logAiInteraction({
          partId: suggestion.id,
          partName: suggestion.name,
          userQuery: input.partDescription,
        });
      }
    }

    return validated;
  } catch (error) {
    console.error('Error in suggestParts:', error);
    throw error;
  }
}
