// Edited

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
    // This check is crucial for deployed environments like Vercel.
    // It ensures the application fails fast with a clear error if the key is missing.
    if (process.env.NODE_ENV === 'production') {
        throw new Error('The GEMINI_API_KEY environment variable is not set in the production environment. Please add it to your Vercel project settings.');
    } else {
        // In development, you might have it in a .env file, which should be loaded
        // but it's good practice to check.
        console.warn('GEMINI_API_KEY environment variable is not set. Please ensure it is in your .env file.');
    }
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
