// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A general-purpose AI chatbot flow.
 *
 * - generalChat - A function that handles a user's chat message.
 * - GeneralChatInput - The input type for the generalChat function.
 * - GeneralChatOutput - The return type for the generalChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;

export async function generalChat(input: GeneralChatInput): Promise<GeneralChatOutput> {
  return generalChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalChatPrompt',
  input: {schema: GeneralChatInputSchema},
  output: {schema: GeneralChatOutputSchema},
  prompt: `You are a helpful assistant for Desert Drive Depot, an online marketplace for auto parts.
  Your goal is to answer user questions clearly and concisely.
  If you don't know the answer to something, it's better to say you don't know than to make something up.

  User's message: {{{message}}}
  Your response:`,
});

const generalChatFlow = ai.defineFlow(
  {
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
