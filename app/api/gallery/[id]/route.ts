import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';
import { getSession } from '@/lib/auth';

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
    // Auth guard
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Auth guard
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    try {
        const body = await request.json();
        const updatedWork = await GalleryWork.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedWork) {
            return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedWork });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update work' }, { status: 400 });
    }
}
