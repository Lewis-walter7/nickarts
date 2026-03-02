/**
 * In-memory IP-based rate limiter for Next.js API routes.
 * No external dependencies needed.
 *
 * Usage:
 *   const result = rateLimit(ip, { limit: 10, windowMs: 60_000 });
 *   if (!result.success) return 429 response;
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// Global store — survives across requests in the same Node.js process.
// In a multi-instance / serverless cold-start environment this resets per instance
// (good enough for DDoS protection; use Redis/Upstash for strict cross-instance limits).
const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store.entries()) {
            if (entry.resetAt < now) store.delete(key);
        }
    }, 5 * 60 * 1000);
}

interface RateLimitOptions {
    /** Max requests allowed per window */
    limit: number;
    /** Window length in milliseconds */
    windowMs: number;
}

interface RateLimitResult {
    success: boolean;
    /** Requests remaining in the current window */
    remaining: number;
    /** Epoch ms when the window resets */
    resetAt: number;
}

export function rateLimit(
    identifier: string,
    { limit, windowMs }: RateLimitOptions
): RateLimitResult {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || entry.resetAt < now) {
        // Start a new window
        const resetAt = now + windowMs;
        store.set(identifier, { count: 1, resetAt });
        return { success: true, remaining: limit - 1, resetAt };
    }

    if (entry.count >= limit) {
        return { success: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
