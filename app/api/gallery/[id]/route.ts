import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';
import { requireAdmin } from '@/lib/require-admin';
import { parseGalleryPayload } from '@/lib/gallery-payload';
import { deleteUploadedImages } from '@/lib/uploadthing-server';

const NOT_FOUND = NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 });

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!isValidObjectId(id)) return NOT_FOUND;

    try {
        await dbConnect();
        const work = await GalleryWork.findById(id).lean();
        if (!work) return NOT_FOUND;
        return NextResponse.json({ success: true, data: work });
    } catch (error) {
        console.error('Failed to fetch work:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch work' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidObjectId(id)) return NOT_FOUND;

    try {
        await dbConnect();
        const deletedWork = await GalleryWork.findByIdAndDelete(id);
        if (!deletedWork) return NOT_FOUND;

        // Release the storage too — otherwise the row goes away but the files stay
        // billed and publicly reachable by URL.
        await deleteUploadedImages(deletedWork.images ?? []);

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        console.error('Failed to delete work:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete work' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidObjectId(id)) return NOT_FOUND;

    try {
        const parsed = parseGalleryPayload(await request.json(), { partial: true });
        if (!parsed.ok) {
            return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
        }
        const { set, unset } = parsed.value;

        await dbConnect();

        const previous = await GalleryWork.findById(id).lean<{ images?: string[] } | null>();
        if (!previous) return NOT_FOUND;

        const update: Record<string, unknown> = {};
        if (Object.keys(set).length > 0) update.$set = set;
        // `$unset` is how an optional price actually gets cleared; sending
        // `price: undefined` is dropped by JSON.stringify and silently no-ops.
        if (unset.length > 0) {
            update.$unset = Object.fromEntries(unset.map((field) => [field, '']));
        }

        const updatedWork = await GalleryWork.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        });
        if (!updatedWork) return NOT_FOUND;

        // Clean up images the edit removed.
        if (Array.isArray(set.images)) {
            const kept = new Set(set.images as string[]);
            const removed = (previous.images ?? []).filter((url) => !kept.has(url));
            await deleteUploadedImages(removed);
        }

        return NextResponse.json({ success: true, data: updatedWork });
    } catch (error) {
        console.error('Failed to update work:', error);
        return NextResponse.json({ success: false, error: 'Failed to update work' }, { status: 400 });
    }
}
