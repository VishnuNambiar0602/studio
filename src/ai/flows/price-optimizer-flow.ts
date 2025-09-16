'use server';
/**
 * @fileOverview An AI agent that suggests an optimal price for an auto part.
 *
 * - suggestPrice - A function that suggests a price based on part details.
 * - PriceOptimizerInput - The input type for the suggestPrice function.
 * - PriceOptimizerOutput - The return type for the suggestPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  return priceOptimizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'priceOptimizerPrompt',
  input: {schema: PriceOptimizerInputSchema},
  output: {schema: PriceOptimizerOutputSchema},
  prompt: `You are an expert pricing analyst for the automotive parts market in the Gulf region. Your task is to suggest an optimal market price for a given auto part.

Analyze the following part details:
- Name: {{{partName}}}
- Description: {{{partDescription}}}
- Categories: {{#each category}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Manufacturer: {{{manufacturer}}}

Based on this information, and your knowledge of market trends, perceived value for OEM vs. used vs. new parts, brand reputation (e.g., Bosch vs. a generic brand), and competitive landscape, determine a suggested price.

Provide a brief justification for your pricing. For example: "This is a new OEM part from a premium manufacturer, so it commands a higher price. The used market for this is strong, so we've priced it competitively."

Return your response in the structured JSON format.`,
});

const priceOptimizerFlow = ai.defineFlow(
  {
    name: 'priceOptimizerFlow',
    inputSchema: PriceOptimizerInputSchema,
    outputSchema: PriceOptimizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid price suggestion.");
    }
    return output;
  }
);
