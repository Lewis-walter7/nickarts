/**
 * Best-effort client IP for rate limiting.
 *
 * Every header here is set by an upstream proxy and is therefore spoofable by a
 * client talking to the origin directly. Treat the result as a coarse bucketing
 * key, never as identity or for access control — anything that must survive
 * header rotation needs a second limiter keyed on something the attacker cannot
 * change (see the per-email limiter in app/api/auth/login/route.ts).
 */
export function clientIp(request: Request): string {
    // Platform-specific headers first — these are injected by the edge network
    // and are harder to forge than a bare x-forwarded-for.
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
