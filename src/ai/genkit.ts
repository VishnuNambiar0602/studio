// AI Provider Abstraction Layer
// This module provides a unified interface for AI generation with automatic fallback
// Primary: Cloudflare Workers AI (@cf/meta/llama-3-8b-instruct)
// Fallback: Groq (llama-3.1-8b-instant)

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Environment variable validation
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_AI_API_TOKEN = process.env.CLOUDFLARE_AI_API_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (process.env.NODE_ENV === 'production') {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_AI_API_TOKEN) {
    throw new Error(
      'CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_AI_API_TOKEN must be set in production environment.'
    );
  }
  if (!GROQ_API_KEY) {
    console.warn('GROQ_API_KEY is not set. Fallback provider will not be available.');
  }
}

// Simple in-memory cache implementation
interface CacheEntry {
  data: string;
  timestamp: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry>();

  get(key: string, ttl: number): string | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < ttl) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  set(key: string, data: string): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      // Remove entries older than 1 hour
      if (now - entry.timestamp > 3600000) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new SimpleCache();
// Run cleanup every 10 minutes
setInterval(() => cache.cleanup(), 600000);

// Circuit breaker state
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean;
}

const circuitBreaker: CircuitBreakerState = {
  failures: 0,
  lastFailureTime: 0,
  isOpen: false,
};

const CIRCUIT_BREAKER_THRESHOLD = 3;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute

function checkCircuitBreaker(): boolean {
  if (circuitBreaker.isOpen) {
    if (Date.now() - circuitBreaker.lastFailureTime > CIRCUIT_BREAKER_TIMEOUT) {
      circuitBreaker.isOpen = false;
      circuitBreaker.failures = 0;
      return true;
    }
    return false;
  }
  return true;
}

function recordFailure(): void {
  circuitBreaker.failures++;
  circuitBreaker.lastFailureTime = Date.now();
  if (circuitBreaker.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    circuitBreaker.isOpen = true;
    console.warn('Circuit breaker opened due to repeated failures');
  }
}

function recordSuccess(): void {
  circuitBreaker.failures = 0;
  circuitBreaker.isOpen = false;
}

// Cloudflare Workers AI Provider
async function generateWithCloudflare(
  prompt: string,
  options?: any
): Promise<string> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_AI_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      ...options,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Cloudflare AI request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.result?.response || data.result?.content || '';
}

// Groq Provider
async function generateWithGroq(prompt: string, options?: any): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      ...options,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Groq API request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Exponential backoff retry
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// Main AI generation function with fallback
export async function generateAIResponse(
  prompt: string,
  options?: {
    cacheKey?: string;
    cacheTTL?: number;
    useCache?: boolean;
  }
): Promise<string> {
  // Check cache first
  if (options?.useCache && options.cacheKey) {
    const cached = cache.get(
      options.cacheKey,
      options.cacheTTL || 300000 // Default 5 minutes
    );
    if (cached) {
      return cached;
    }
  }

  let result: string;

  // Try Cloudflare Workers AI first (if circuit breaker allows)
  if (checkCircuitBreaker() && CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_AI_API_TOKEN) {
    try {
      result = await withRetry(() => generateWithCloudflare(prompt, options));
      recordSuccess();
    } catch (error) {
      console.warn('Cloudflare AI failed, attempting fallback to Groq:', error);
      recordFailure();

      // Fallback to Groq
      if (GROQ_API_KEY) {
        try {
          result = await withRetry(() => generateWithGroq(prompt, options));
        } catch (groqError) {
          console.error('Both Cloudflare and Groq failed:', groqError);
          throw new Error(
            'AI service temporarily unavailable. Please try again later.'
          );
        }
      } else {
        throw new Error(
          'Primary AI provider failed and no fallback configured.'
        );
      }
    }
  } else if (GROQ_API_KEY) {
    // If circuit breaker is open or Cloudflare not configured, use Groq directly
    try {
      result = await withRetry(() => generateWithGroq(prompt, options));
    } catch (error) {
      console.error('Groq failed:', error);
      throw new Error('AI service temporarily unavailable. Please try again later.');
    }
  } else {
    throw new Error('No AI provider is properly configured.');
  }

  // Cache the result
  if (options?.useCache && options.cacheKey && result) {
    cache.set(options.cacheKey, result);
  }

  return result;
}

// Legacy Genkit export for TTS flow (will be deprecated)
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
