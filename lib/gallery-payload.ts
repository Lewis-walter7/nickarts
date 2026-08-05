import { isAllowedImageUrl } from './image-hosts';

/**
 * Validates and whitelists gallery write payloads.
 *
 * The previous handlers passed the raw request body straight into
 * `GalleryWork.create(body)` and `$set: body`. Mongoose's strict mode happened to
 * discard unknown keys, so it was not exploitable — but it left the API one
 * schema change away from mass assignment. Everything is now explicit.
 */

export const MAX_IMAGES = 10;

export interface ParsedGalleryPayload {
    /** Fields to write. */
    set: Record<string, unknown>;
    /** Fields to remove (used for clearing an optional price). */
    unset: string[];
}

export type ParseResult =
    | { ok: true; value: ParsedGalleryPayload }
    | { ok: false; error: string };

function str(value: unknown): string | null {
    return typeof value === 'string' ? value.trim() : null;
}

/**
 * @param partial when true (PUT), absent fields are left untouched; when false
 *                (POST), the required fields must all be present.
 */
export function parseGalleryPayload(body: unknown, { partial }: { partial: boolean }): ParseResult {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return { ok: false, error: 'Request body must be an object' };
    }
    const input = body as Record<string, unknown>;
    const set: Record<string, unknown> = {};
    const unset: string[] = [];

    const texts = [
        { key: 'title', max: 60, label: 'Title' },
        { key: 'category', max: 40, label: 'Category' },
        { key: 'year', max: 20, label: 'Year' },
        { key: 'description', max: 500, label: 'Description' },
    ] as const;

    for (const { key, max, label } of texts) {
        if (!(key in input)) {
            if (!partial) return { ok: false, error: `${label} is required` };
            continue;
        }
        const value = str(input[key]);
        if (!value) return { ok: false, error: `${label} is required` };
        if (value.length > max) return { ok: false, error: `${label} cannot be more than ${max} characters` };
        set[key] = value;
    }

    if ('images' in input) {
        const raw = input.images;
        if (!Array.isArray(raw)) return { ok: false, error: 'Images must be an array' };
        if (raw.length === 0) return { ok: false, error: 'Please provide at least one image' };
        if (raw.length > MAX_IMAGES) return { ok: false, error: `No more than ${MAX_IMAGES} images per work` };

        const images: string[] = [];
        for (const entry of raw) {
            const value = str(entry);
            if (!value) return { ok: false, error: 'Image URLs must be non-empty strings' };
            if (!isAllowedImageUrl(value)) {
                return { ok: false, error: 'Image URLs must be uploaded through the dashboard' };
            }
            images.push(value);
        }
        set.images = images;
    } else if (!partial) {
        return { ok: false, error: 'Please provide at least one image' };
    }

    if ('price' in input) {
        const raw = input.price;
        // null / '' means "clear the price". JSON.stringify drops `undefined`
        // entirely, which is why the old dashboard could never unset a price.
        if (raw === null || raw === '') {
            unset.push('price');
        } else {
            const price = typeof raw === 'number' ? raw : Number(raw);
            if (!Number.isFinite(price) || price < 0) {
                return { ok: false, error: 'Price must be a positive number' };
            }
            set.price = price;
        }
    }

    if ('isSold' in input) {
        if (typeof input.isSold !== 'boolean') {
            return { ok: false, error: 'isSold must be a boolean' };
        }
        set.isSold = input.isSold;
    }

    if (Object.keys(set).length === 0 && unset.length === 0) {
        return { ok: false, error: 'No valid fields to update' };
    }

    return { ok: true, value: { set, unset } };
}
