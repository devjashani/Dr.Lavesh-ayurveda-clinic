interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipRateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Checks in-memory rate limit for an IP address.
 * Defaults to 5 requests per 60-second window.
 */
export function isRateLimited(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}
