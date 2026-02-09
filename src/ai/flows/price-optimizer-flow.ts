'use server';
/**
 * @fileOverview An AI agent that suggests an optimal price for an auto part.
 *
 * - suggestPrice - A function that suggests a price based on part details.
 * - PriceOptimizerInput - The input type for the suggestPrice function.
 * - PriceOptimizerOutput - The return type for the suggestPrice function.
 */

import { generateAIResponse } from '@/ai/genkit';
import { z } from 'zod';
import crypto from 'crypto';

const PriceOptimizerInputSchema = z.object({
  partName: z.string().describe("The name of the auto part."),
  partDescription: z.string().describe("The detailed description of the auto part."),
  category: z.array(z.string()).describe("The categories the part belongs to (e.g., 'new', 'used', 'oem')."),
  manufacturer: z.string().describe("The manufacturer of the part."),
});
export type PriceOptimizerInput = z.infer<typeof PriceOptimizerInputSchema>;

const PriceOptimizerOutputSchema = z.object({
  suggestedPrice: z.number().describe("The suggested optimal market price for the part as a floating-point number."),
  justification: z.string().describe("A brief justification for why this price was suggested, considering market factors."),
});
export type PriceOptimizerOutput = z.infer<typeof PriceOptimizerOutputSchema>;

export async function suggestPrice(input: PriceOptimizerInput): Promise<PriceOptimizerOutput> {
  const promptText = `You are an expert pricing analyst for the automotive parts market in the Gulf region. Your task is to suggest an optimal market price for a given auto part.

Analyze the following part details:
- Name: ${input.partName}
- Description: ${input.partDescription}
- Categories: ${input.category.join(', ')}
- Manufacturer: ${input.manufacturer}

Based on this information, and your knowledge of market trends, perceived value for OEM vs. used vs. new parts, brand reputation (e.g., Bosch vs. a generic brand), and competitive landscape, determine a suggested price.

Provide a brief justification for your pricing. For example: "This is a new OEM part from a premium manufacturer, so it commands a higher price. The used market for this is strong, so we've priced it competitively."

Respond ONLY with a valid JSON object matching this schema:
{
  "suggestedPrice": <number>,
  "justification": "string"
}`;

  // Generate cache key for price suggestions
  const cacheKey = crypto
    .createHash('md5')
    .update(`${input.partName}:${input.manufacturer}:${input.category.join(',')}`)
    .digest('hex');

  try {
    const response = await generateAIResponse(promptText, {
      cacheKey,
      cacheTTL: 1800000, // 30 minutes for price suggestions
      useCache: true,
    });

    // Parse the JSON response
    let output: PriceOptimizerOutput;
    try {
      // Clean the response - remove markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      output = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', response);
      throw new Error('AI returned an invalid response format.');
    }

    // Validate the output against the schema
    const validated = PriceOptimizerOutputSchema.parse(output);

    // Additional validation for price
    if (validated.suggestedPrice <= 0) {
      throw new Error('Invalid price suggestion: price must be greater than zero');
    }

    return validated;
  } catch (error) {
    console.error('Error in suggestPrice:', error);
    throw error;
  }
}
