/**
 * Best-effort client IP for rate limiting. Every header here is proxy-supplied
 * and so spoofable by a client reaching the origin directly — use it as a coarse
 * bucketing key, never as identity. Limits that must survive header rotation need
 * a second key the caller cannot change, as in the login route's per-email limiter.
 */
export function clientIp(request: Request): string {
    // Platform headers are injected by the edge network, so harder to forge.
    const vercel = request.headers.get('x-vercel-forwarded-for');
    if (vercel) return vercel.split(',')[0].trim();

    const real = request.headers.get('x-real-ip');
    if (real) return real.trim();

    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        const first = forwarded.split(',')[0]?.trim();
        if (first) return first;
    }

    return 'unknown';
}
