import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
    if (process.env.NODE_ENV === 'production') {
        console.error('GEMINI_API_KEY environment variable is not set.');
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
