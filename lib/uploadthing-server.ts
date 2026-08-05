import { UTApi } from 'uploadthing/server';
import { uploadKeyFromUrl } from './image-hosts';

let api: UTApi | null = null;

function getUTApi(): UTApi {
    if (!api) api = new UTApi();
    return api;
}

/**
 * Deletes uploaded files from UploadThing given their stored URLs.
 *
 * Called when a work is deleted or its images are replaced — otherwise the DB
 * row goes away but the files linger forever, billed and still publicly
 * reachable by URL.
 *
 * Best-effort: storage cleanup must never fail the user's request, so errors are
 * logged rather than thrown. Site-relative paths (e.g. /hero-art.png) are skipped.
 */
export async function deleteUploadedImages(urls: string[]): Promise<void> {
    const keys = urls.map(uploadKeyFromUrl).filter((k): k is string => Boolean(k));
    if (keys.length === 0) return;

    try {
        await getUTApi().deleteFiles(keys);
    } catch (error) {
        console.error('Failed to delete uploaded files from UploadThing:', keys, error);
    }
}
