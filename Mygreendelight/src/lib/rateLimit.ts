import type { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitStore>();

// Auto-cleanup stale keys every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (now > record.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  maxRequests: number;
  windowSeconds: number;
  prefix?: string;
}

export function checkRateLimit(
  req: NextRequest | { headers: Headers | { get(key: string): string | null } },
  options: RateLimitOptions
): { success: boolean; remaining: number; resetTime: number } {
  const { maxRequests, windowSeconds, prefix = "rl" } = options;

  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");

  const ip = cfConnectingIp || realIp || (forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1");
  const key = `${prefix}:${ip}`;

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const currentRecord = memoryStore.get(key);

  if (!currentRecord || now > currentRecord.resetTime) {
    memoryStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (currentRecord.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: currentRecord.resetTime,
    };
  }

  currentRecord.count += 1;
  return {
    success: true,
    remaining: maxRequests - currentRecord.count,
    resetTime: currentRecord.resetTime,
  };
}
