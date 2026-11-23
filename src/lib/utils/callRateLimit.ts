import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory rate limit stores
const ipRateLimits = new Map<string, RateLimitRecord>();
const bookingRateLimits = new Map<string, RateLimitRecord>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5; // 5 attempts per window

/**
 * Extracts client IP safely from request headers
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Rate limits token generation attempts per IP and per booking ID.
 * Returns true if allowed, false if rate limited.
 */
export function checkCallRateLimit(
  request: NextRequest,
  bookingId: string
): { allowed: boolean; retryAfterSeconds?: number } {
  const ip = getClientIp(request);

  // Allow localhost in non-production environments to avoid lockout during development
  if (
    process.env.NODE_ENV !== 'production' &&
    (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip === 'unknown')
  ) {
    return { allowed: true };
  }

  const now = Date.now();

  // 1. Check IP rate limit
  const ipRecord = ipRateLimits.get(ip);
  if (ipRecord) {
    if (now > ipRecord.resetAt) {
      ipRateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else if (ipRecord.count >= MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.ceil((ipRecord.resetAt - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    } else {
      ipRecord.count += 1;
    }
  } else {
    ipRateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  // 2. Check Booking rate limit
  const bookingKey = `booking:${bookingId}`;
  const bookingRecord = bookingRateLimits.get(bookingKey);
  if (bookingRecord) {
    if (now > bookingRecord.resetAt) {
      bookingRateLimits.set(bookingKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else if (bookingRecord.count >= MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.ceil((bookingRecord.resetAt - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    } else {
      bookingRecord.count += 1;
    }
  } else {
    bookingRateLimits.set(bookingKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  // Cleanup old entries periodically (every 100 requests)
  if (Math.random() < 0.05) {
    for (const [k, v] of ipRateLimits.entries()) {
      if (now > v.resetAt) ipRateLimits.delete(k);
    }
    for (const [k, v] of bookingRateLimits.entries()) {
      if (now > v.resetAt) bookingRateLimits.delete(k);
    }
  }

  return { allowed: true };
}

export function resetCallRateLimits(): void {
  ipRateLimits.clear();
  bookingRateLimits.clear();
}
