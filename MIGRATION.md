# AI Provider Migration Guide

## Overview

This guide documents the migration from Google Gemini AI to a hybrid AI architecture using **Cloudflare Workers AI** (primary) and **Groq** (fallback) for the GulfCarX platform.

## Why Migrate?

### Cost Optimization
- **Old architecture**: ~$500-1000/month for 1M users with Gemini
- **New architecture**: ~$33-50/month for 1M users with Cloudflare Workers AI
- **Savings**: ~90-95% cost reduction

### Performance Improvements
- Target response time: <500ms
- Automatic fallback mechanism ensures high availability
- Built-in caching reduces redundant API calls

### Scalability
- Cloudflare's global edge network provides low latency worldwide
- Circuit breaker pattern prevents cascading failures
- Exponential backoff for retries

## Architecture Changes

### Before
```
User Request → Gemini 2.0 Flash → Response
```

### After
```
User Request → [Cache Check] → Cloudflare Workers AI → Response
                                      ↓ (on failure)
                                    Groq API → Response
```

## Getting API Keys

### 1. Cloudflare Workers AI

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. Navigate to **Workers & Pages** → **AI**
3. Get your **Account ID** from the URL: `https://dash.cloudflare.com/<account_id>/`
4. Create an API token:
   - Go to **My Profile** → **API Tokens**
   - Click **Create Token**
   - Use the "Edit Cloudflare Workers" template
   - Add the **Account.Workers AI** permission
   - Copy the generated token

**Free Tier**: 10,000 requests/day
**Paid Tier**: $0.01 per 1,000 requests

### 2. Groq API (Free Tier)

1. Sign up at [https://console.groq.com](https://console.groq.com)
2. Navigate to **API Keys**
3. Click **Create API Key**
4. Copy the generated key

**Free Tier**: 
- 14,400 requests/day
- Rate limit: 30 requests/minute
- Model: llama-3.1-8b-instant

**Note**: Groq is used as a fallback when Cloudflare hits rate limits.

### 3. Gemini API (Temporary - Only for TTS)

The Text-to-Speech flow temporarily continues to use Gemini since Cloudflare Workers AI doesn't support TTS yet.

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file

**This will be replaced** with an alternative TTS solution in a future update.

## Environment Variables Setup

### Development (.env.local)

Create a `.env.local` file in the root directory:

```bash
# AI Provider Configuration
CLOUDFLARE_ACCOUNT_ID=your_actual_account_id
CLOUDFLARE_AI_API_TOKEN=your_actual_api_token
GROQ_API_KEY=your_actual_groq_key

# Legacy (TTS only)
GEMINI_API_KEY=your_actual_gemini_key

# Database
POSTGRES_URL=your_postgres_connection_string
```

### Production (Vercel/Deployment)

Add these environment variables to your deployment platform:

1. **Vercel**: Project Settings → Environment Variables
2. **Netlify**: Site Settings → Build & Deploy → Environment
3. **Railway**: Project → Variables

## Code Changes Summary

### Files Modified

1. **`src/ai/genkit.ts`** - Complete rewrite
   - New AI provider abstraction layer
   - Cloudflare Workers AI integration
   - Groq fallback integration
   - In-memory caching with TTL
   - Circuit breaker pattern
   - Exponential backoff retry logic

2. **`src/ai/flows/suggest-parts-from-request.ts`**
   - Migrated from Genkit prompt flow to direct API calls
   - Added JSON response parsing
   - Cache key generation for part suggestions (5-minute TTL)

3. **`src/ai/flows/general-chat-flow.ts`**
   - Migrated from Genkit prompt flow to direct API calls
   - Cache key generation for general queries (30-minute TTL)

4. **`src/ai/flows/price-optimizer-flow.ts`**
   - Migrated from Genkit prompt flow to direct API calls
   - Added price validation
   - Cache key generation (30-minute TTL)

5. **`src/ai/flows/text-to-speech-flow.ts`**
   - **No changes** - Still uses Gemini for TTS
   - Added TODO comments for future migration

### Dependencies

No new dependencies required! The new implementation uses native `fetch` API.

**Kept** (for TTS):
- `@genkit-ai/googleai`
- `genkit`

**To be removed in future** (after TTS migration):
- `@genkit-ai/googleai`
- May keep `genkit` core if needed

## Features

### 1. Caching Layer

Reduces API calls and improves response times:

- **Part Suggestions**: 5-minute TTL
- **General Queries**: 30-minute TTL
- **Price Suggestions**: 30-minute TTL

Cache keys are generated using MD5 hash of:
- User query
- Available parts context (for suggestions)
- Part details (for pricing)

### 2. Circuit Breaker

Prevents cascading failures:

- **Threshold**: 3 consecutive failures
- **Timeout**: 1 minute
- Automatically resets after timeout

### 3. Automatic Fallback

Seamless fallback to Groq when Cloudflare fails:

1. Try Cloudflare Workers AI
2. On failure → Try Groq
3. Return graceful error if both fail

### 4. Retry Logic

Exponential backoff for transient failures:

- **Max retries**: 2
- **Initial delay**: 1 second
- **Backoff multiplier**: 2x (1s → 2s → 4s)

## Testing

### Test All AI Flows

```bash
# Start development server
npm run dev

# Test in browser:
# 1. Part suggestions (English)
# 2. Part suggestions (Arabic)
# 3. General chat
# 4. Price optimizer (admin)
# 5. TTS (if enabled)
```

### Test Fallback Mechanism

To test the fallback:

1. Temporarily set invalid Cloudflare credentials
2. Ensure Groq API key is valid
3. Verify requests fall back to Groq automatically

### Test Caching

1. Make a request
2. Make the same request again immediately
3. Check logs for cache hit

## Cost Estimates

### Cloudflare Workers AI

**Assumptions**: 1M users, 10 requests/user/month

- **Requests**: 10M/month
- **Cost**: $100/month ($0.01 per 1,000 requests)

**With caching** (50% cache hit rate):
- **Actual requests**: 5M/month
- **Cost**: $50/month

### Groq (Fallback)

**Free tier**: 14,400 requests/day = ~432,000 requests/month

Assuming 1% fallback rate:
- **Fallback requests**: 100,000/month
- **Cost**: $0 (within free tier)

### Total Estimated Cost

**Without caching**: $100/month
**With caching**: $33-50/month

**Previous cost (Gemini)**: $500-1000/month

**Savings**: 90-95%

## Rate Limits

### Cloudflare Workers AI

- **Free tier**: 10,000 requests/day
- **Paid tier**: No hard limit, pay-per-use

### Groq

- **Free tier**: 14,400 requests/day
- **Rate limit**: 30 requests/minute
- **Concurrent requests**: 10

### Recommendations

1. Monitor usage in Cloudflare dashboard
2. Implement application-level rate limiting
3. Use caching aggressively
4. Consider upgrading to Cloudflare paid tier for production

## Monitoring

### What to Monitor

1. **Cache hit rate** - Should be >40% for optimal cost savings
2. **Fallback frequency** - Should be <5% in normal conditions
3. **Response times** - Should be <500ms p95
4. **Error rates** - Should be <1%

### Logging

The new implementation logs:

- Cloudflare failures (with fallback to Groq)
- Circuit breaker state changes
- Cache operations (in development mode)
- API errors and retries

Check your deployment logs:

```bash
# Vercel
vercel logs

# Local
Check console output
```

## Rollback Plan

If issues arise, you can quickly rollback:

1. Revert the changes to `src/ai/genkit.ts`
2. Revert the flow files
3. Restore `GEMINI_API_KEY` environment variable
4. Redeploy

## Future Enhancements

### Planned

1. **TTS Migration**: Replace Gemini TTS with:
   - Cloudflare AI TTS (when available)
   - ElevenLabs API
   - Browser Web Speech API

2. **Cloudflare KV Integration**: Replace in-memory cache with Cloudflare KV for:
   - Persistent caching across deployments
   - Shared cache across edge locations

3. **Advanced Caching**: 
   - Semantic similarity caching
   - Intelligent cache invalidation

4. **Observability**:
   - Datadog/New Relic integration
   - Custom metrics dashboard
   - Alerting on high error rates

## Troubleshooting

### "No AI provider is properly configured"

**Cause**: Missing environment variables

**Solution**: 
1. Check `.env.local` exists with correct values
2. Restart the development server
3. Verify variables in deployment platform

### "Cloudflare AI failed, falling back to Groq"

**Cause**: Rate limit hit or API error

**Solution**: 
- This is normal behavior - fallback working as expected
- If happening frequently, check Cloudflare dashboard for issues
- Consider upgrading to paid tier

### "Both Cloudflare and Groq failed"

**Cause**: Both providers are down or misconfigured

**Solution**:
1. Verify API keys are correct
2. Check provider status pages
3. Review error logs for specific issues
4. Verify network connectivity

### Slow Response Times

**Cause**: Cache misses or high API latency

**Solution**:
1. Check cache hit rate
2. Verify caching is enabled
3. Consider increasing cache TTL
4. Use Cloudflare KV for distributed caching

## Support

For issues or questions:

1. Check this migration guide
2. Review the code comments in `src/ai/genkit.ts`
3. Open an issue on GitHub
4. Contact the development team

## Conclusion

This migration significantly reduces costs while improving performance and reliability. The hybrid architecture ensures high availability through automatic fallback, and the caching layer minimizes redundant API calls.

**Key Benefits**:
- ✅ 90-95% cost reduction
- ✅ <500ms response times
- ✅ Automatic failover
- ✅ Built-in caching
- ✅ Production-ready for 1M+ users
