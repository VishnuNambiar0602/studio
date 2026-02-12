// Edited

// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A general-purpose AI chatbot flow.
 *
 * - generalChat - A function that handles a user's chat message.
 * - GeneralChatInput - The input type for the generalChat function.
 * - GeneralChatOutput - The return type for the generalChat function.
 */

import { generateAIResponse } from '@/ai/genkit';
import { z } from 'zod';
import { createHash } from 'crypto';

const GeneralChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;

export async function generalChat(input: GeneralChatInput): Promise<GeneralChatOutput> {
  const promptText = `You are a helpful assistant for GulfCarX, an online marketplace for auto parts.
Your goal is to answer user questions clearly and concisely.
If you don't know the answer to something, it's better to say you don't know than to make something up.

User's message: ${input.message}
Your response:`;

  // Generate cache key for general chat (TTL: 30 minutes)
  const cacheKey = createHash('md5')
    .update(input.message)
    .digest('hex');

  try {
    const response = await generateAIResponse(promptText, {
      cacheKey,
      cacheTTL: 1800000, // 30 minutes for general queries
      useCache: true,
    });

    return { response };
  } catch (error) {
    console.error('Error in generalChat:', error);
    throw error;
  }
}
