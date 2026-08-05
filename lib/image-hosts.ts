/**
 * Which hosts may serve artwork images. Shared by next.config.ts and the gallery
 * write path so a stored URL can never be one the renderer refuses, which would
 * surface as a silently broken image.
 */

/** Host patterns in `next/image` remotePatterns syntax. */
export const IMAGE_REMOTE_PATTERNS = [
    { protocol: 'https' as const, hostname: 'utfs.io', pathname: '/f/**' },
    { protocol: 'https' as const, hostname: '*.ufs.sh', pathname: '/f/**' },
];

/** Exact hosts, plus suffixes allowed as `*.suffix`. */
const ALLOWED_HOSTS = ['utfs.io'];
const ALLOWED_HOST_SUFFIXES = ['.ufs.sh'];

/**
 * True for absolute https URLs on an allowed upload host, and for site-relative
 * paths like `/hero-art.png` which are served from our own public/ directory.
 */
export function isAllowedImageUrl(value: string): boolean {
    if (value.startsWith('/') && !value.startsWith('//')) return true;

    let url: URL;
    try {
        url = new URL(value);
    } catch {
        return false;
    }

    if (url.protocol !== 'https:') return false;

    const host = url.hostname.toLowerCase();
    return (
        ALLOWED_HOSTS.includes(host) ||
        ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix) && host.length > suffix.length)
    );
}

/**
 * Extracts the UploadThing file key from a stored URL, for deletion via UTApi.
 * Returns null for site-relative paths and anything unparseable.
 */
export function uploadKeyFromUrl(value: string): string | null {
    try {
        const url = new URL(value);
        const parts = url.pathname.split('/').filter(Boolean);
        // Both /f/<key> (utfs.io) and /f/<key> (<app>.ufs.sh) shapes.
        if (parts[0] === 'f' && parts[1]) return decodeURIComponent(parts[1]);
        return null;
    } catch {
        return null;
    }
}
