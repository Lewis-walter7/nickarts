import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();

    try {
        const work = await GalleryWork.findById(id);
        if (!work) {
            return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: work });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch work' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Awaiting params is required in Next.js 15+, but let's check user's version. 
    // Package.json says Next 16.1.6, so params ARE async.
    const { id } = await params;

    await dbConnect();

    try {
        const deletedWork = await GalleryWork.findByIdAndDelete(id);

        if (!deletedWork) {
            return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete work' }, { status: 400 });
    }
}
