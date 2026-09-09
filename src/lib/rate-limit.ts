/**
 * Lightweight, in-memory sliding window rate limiter for serverless API routes.
 * Limits request frequency per IP address / client identifier.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitRecord>();

/**
 * Checks if a key (e.g. client IP or identifier) exceeds maximum allowed requests per window.
 * Default: 20 requests per 60 seconds.
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowMs: number = 60000
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = tracker.get(identifier);

  // Clean expired entries periodically
  if (tracker.size > 1000) {
    for (const [key, value] of tracker.entries()) {
      if (now > value.resetTime) {
        tracker.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    tracker.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  tracker.set(identifier, record);

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}
