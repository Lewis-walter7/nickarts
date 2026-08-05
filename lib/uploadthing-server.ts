import { UTApi } from 'uploadthing/server';
import { uploadKeyFromUrl } from './image-hosts';

let api: UTApi | null = null;

function getUTApi(): UTApi {
    if (!api) api = new UTApi();
    return api;
}

/**
 * Deletes uploaded files given their stored URLs. Called when a work is deleted or
 * its images replaced — otherwise the row goes away but the files linger, billed
 * and still publicly reachable.
 *
 * Best-effort by design: cleanup must never fail the user's request.
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
