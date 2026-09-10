import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis credentials are set
const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export const aiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
    })
  : null;

// In-memory fallback tracker for development / local testing
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const localTracker = new Map<string, RateLimitRecord>();

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (aiRateLimit) {
    try {
      const res = await aiRateLimit.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    } catch (err) {
      console.warn("Upstash RateLimit failed, using in-memory fallback:", err);
    }
  }

  // Fallback in-memory limiter
  const now = Date.now();
  const record = localTracker.get(identifier);

  if (localTracker.size > 500) {
    for (const [key, val] of localTracker.entries()) {
      if (now > val.resetTime) localTracker.delete(key);
    }
  }

  if (!record || now > record.resetTime) {
    const newRecord = { count: 1, resetTime: now + windowMs };
    localTracker.set(identifier, newRecord);
    return { success: true, limit, remaining: limit - 1, reset: newRecord.resetTime };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  localTracker.set(identifier, record);
  return { success: true, limit, remaining: limit - record.count, reset: record.resetTime };
}
